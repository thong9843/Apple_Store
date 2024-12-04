package com.example.apple_store.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import com.example.apple_store.entity.CartItem;
import com.example.apple_store.entity.Discount;
import com.example.apple_store.entity.DiscountScope;
import com.example.apple_store.entity.DiscountType;
import com.example.apple_store.entity.Order;
import com.example.apple_store.entity.OrderItem;
import com.example.apple_store.entity.OrderStatus;
import com.example.apple_store.entity.Payment;
import com.example.apple_store.entity.PaymentConfirm;
import com.example.apple_store.entity.PaymentMethod;
import com.example.apple_store.entity.PaymentStatus;
import com.example.apple_store.entity.ProductDiscount;
import com.example.apple_store.entity.ProductVariant;
import com.example.apple_store.entity.ShippingAddress;
import com.example.apple_store.entity.User;
import com.example.apple_store.exception.ResourceNotFoundException;
import com.example.apple_store.repository.CartItemRepository;
import com.example.apple_store.repository.CartRepository;
import com.example.apple_store.repository.OrderRepository;
import com.example.apple_store.repository.PaymentRepository;
import com.example.apple_store.repository.ProductVariantRepository;
import com.example.apple_store.repository.ShippingAddressRepository;
import com.example.apple_store.repository.UserRepository;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import java.math.RoundingMode;
import java.time.LocalDateTime;

import com.example.apple_store.dto.*;

@Service
@Transactional
@AllArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;
    private final DiscountService discountService;
    private final PaymentRepository paymentRepository;
    private final ShippingAddressRepository shippingAddressRepository;
    private final VNPayService vnPayService;
    private static final BigDecimal HUNDRED = new BigDecimal("100");

    public String processVNPayPayment(Order order, String ipAddress) throws UnsupportedEncodingException {
        if (order.getPayment().getPaymentMethod() != PaymentMethod.VNPAY) {
            throw new RuntimeException("Invalid payment method");
        }
        return vnPayService.createPaymentUrl(order, ipAddress);
    }

    public VNPayResponseDTO handleVNPayCallback(Map<String, String> vnpParams) {
        try {
            String orderId = vnpParams.get("vnp_TxnRef");
            if (orderId == null || orderId.trim().isEmpty()) {
                throw new RuntimeException("Order ID is missing in VNPay response");
            }

            Long orderIdLong = Long.parseLong(orderId);
            Order order = getOrderDetails(orderIdLong);
            if (order == null) {
                throw new RuntimeException("Order not found with ID: " + orderIdLong);
            }

            String vnp_ResponseCode = vnpParams.get("vnp_ResponseCode");
            String vnp_TransactionStatus = vnpParams.get("vnp_TransactionStatus");
            Payment payment = order.getPayment();

            if ("00".equals(vnp_ResponseCode) && "00".equals(vnp_TransactionStatus)) {
                payment.setPaymentStatus(PaymentStatus.PAID);
                payment.setTransactionId(vnpParams.get("vnp_TransactionNo"));
                order.setPaymentConfirm(PaymentConfirm.PAID);
                System.out.println("Payment successful for order: " + orderId);
            } else {
                payment.setPaymentStatus(PaymentStatus.FAILED);
                order.setPaymentConfirm(PaymentConfirm.UNPAID);
                System.out.println("Payment failed for order: " + orderId);
            }

            paymentRepository.save(payment);
            orderRepository.save(order);

            VNPayResponseDTO responseDTO = new VNPayResponseDTO();

            String amount = vnpParams.get("vnp_Amount");
            if (amount != null) {
                try {
                    long amountLong = Long.parseLong(amount);
                    responseDTO.setAmount(String.valueOf(amountLong / 100));
                } catch (NumberFormatException e) {
                    responseDTO.setAmount(amount);
                }
            }

            responseDTO.setOrderId(orderId);
            responseDTO.setOrderInfo(vnpParams.get("vnp_OrderInfo"));
            responseDTO.setResponseCode(vnp_ResponseCode);
            responseDTO.setTransactionNo(vnpParams.get("vnp_TransactionNo"));
            responseDTO.setBankCode(vnpParams.get("vnp_BankCode"));
            responseDTO.setPayDate(vnpParams.get("vnp_PayDate"));
            responseDTO.setPaymentStatus(
                    "00".equals(vnp_ResponseCode) ? "Giao dịch thành công" : "Giao dịch không thành công");

            System.out.println("Created VNPay response DTO: " + responseDTO);
            return responseDTO;

        } catch (Exception e) {
            System.err.println("Error in handleVNPayCallback: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private ShippingAddress getShippingAddress(Long userId, Long addressId) {
        return shippingAddressRepository.findByUserIdAndId(userId, addressId);
    }

    private List<OrderItem> createOrderItems(List<CartItem> cartItems, Order order) {
        return cartItems.stream()
                .map(cartItem -> {
                    ProductVariant productVariant = productVariantRepository
                            .findById(cartItem.getProductVariantId().longValue())
                            .orElseThrow(() -> new ResourceNotFoundException("Product variant not found"));

                    // Kiểm tra số lượng trong kho
                    if (productVariant.getStockQuantity() < cartItem.getQuantity()) {
                        throw new RuntimeException("Insufficient stock quantity for product " +
                                productVariant.getVariantName() + ". Available: " +
                                productVariant.getStockQuantity() + ", Requested: " + cartItem.getQuantity());
                    }

                    // Kiểm tra sản phẩm có available không
                    if (!productVariant.getIsAvailable()) {
                        throw new RuntimeException("Product variant " + productVariant.getVariantName() +
                                " is not available");
                    }

                    // Cập nhật số lượng trong kho
                    productVariant.setStockQuantity(productVariant.getStockQuantity() - cartItem.getQuantity());
                    productVariant.setUpdatedAt(LocalDateTime.now());

                    // Nếu hết hàng thì set isAvailable = false
                    if (productVariant.getStockQuantity() == 0) {
                        productVariant.setIsAvailable(false);
                    }

                    // Lưu cập nhật product variant
                    productVariantRepository.save(productVariant);

                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setProductVariant(productVariant);
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setPrice(productVariant.getPrice());
                    return orderItem;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Order createOrderFromCartItems(Long userId, List<Long> cartItemIds,
            Long shippingAddressId, String productDiscountCode,
            String orderDiscountCode, PaymentMethod paymentMethod) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartItemRepository.findAllById(cartItemIds);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart items not found");
        }

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(getShippingAddress(userId, shippingAddressId));

        order.setOrderStatus(OrderStatus.PENDING);
        order.setPaymentConfirm(PaymentConfirm.UNPAID);

        List<OrderItem> orderItems = createOrderItems(cartItems, order);
        order.setOrderItems(orderItems);

        calculateTotalAndDiscount(order, productDiscountCode, orderDiscountCode);

        Payment payment = createPayment(order, paymentMethod);
        order.setPayment(payment);

        Order savedOrder = orderRepository.save(order);
        cartItemRepository.deleteAll(cartItems);

        return savedOrder;
    }

    @Transactional
    public Order createOrderFromCart(Long userId, Long cartId,
            Long shippingAddressId, String productDiscountCode,
            String orderDiscountCode, PaymentMethod paymentMethod) {
        List<CartItem> cartItems = cartItemRepository.findByCartId(cartId);
        return createOrderFromCartItems(userId,
                cartItems.stream().map(CartItem::getId).collect(Collectors.toList()),
                shippingAddressId, productDiscountCode, orderDiscountCode, paymentMethod);
    }

    @Transactional
    public Order createOrderFromProductVariant(Long userId, Long productVariantId,
            Integer quantity, Long shippingAddressId, String productDiscountCode,
            String orderDiscountCode, PaymentMethod paymentMethod) {
        ProductVariant productVariant = productVariantRepository.findById(productVariantId)
                .orElseThrow(() -> new RuntimeException("Product variant not found"));

        if (productVariant.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock quantity. Available: " +
                    productVariant.getStockQuantity() + ", Requested: " + quantity);
        }

        if (!productVariant.getIsAvailable()) {
            throw new RuntimeException("Product variant is not available");
        }

        Order order = new Order();
        order.setUser(userRepository.getById(userId));
        order.setShippingAddress(getShippingAddress(userId, shippingAddressId));

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProductVariant(productVariant);
        orderItem.setQuantity(quantity);
        orderItem.setPrice(productVariant.getPrice());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setPaymentConfirm(PaymentConfirm.UNPAID);
        order.setOrderItems(List.of(orderItem));

        calculateTotalAndDiscount(order, productDiscountCode, orderDiscountCode);

        Payment payment = createPayment(order, paymentMethod);
        order.setPayment(payment);

        productVariant.setStockQuantity(productVariant.getStockQuantity() - quantity);
        productVariant.setUpdatedAt(LocalDateTime.now());

        if (productVariant.getStockQuantity() == 0) {
            productVariant.setIsAvailable(false);
        }

        productVariantRepository.save(productVariant);

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order getOrderDetails(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = getOrderDetails(orderId);
        order.setOrderStatus(status);
        return orderRepository.save(order);
    }

    public Order updatePaymentConfirm(Long orderId, PaymentConfirm status) {
        Order order = getOrderDetails(orderId);
        order.setPaymentConfirm(status);
        return orderRepository.save(order);
    }

    public void cancelOrder(Long orderId) {
        Order order = getOrderDetails(orderId);
        if (order.getOrderStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Cannot cancel non-pending order");
        }
        order.setOrderStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    private void calculateTotalAndDiscount(Order order, String productDiscountCode, String orderDiscountCode) {
        BigDecimal total = BigDecimal.ZERO;
        BigDecimal discountTotal = BigDecimal.ZERO;

        for (OrderItem item : order.getOrderItems()) {
            BigDecimal itemTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(itemTotal);

            if (productDiscountCode != null && !productDiscountCode.isEmpty()) {
                Optional<Discount> productDiscountOpt = discountService.getAllDiscounts().stream()
                        .filter(d -> d.getDiscountScope() == DiscountScope.PRODUCT
                                && d.getDiscountCode().equals(productDiscountCode))
                        .findFirst();

                if (productDiscountOpt.isPresent()) {
                    Discount productDiscount = productDiscountOpt.get();
                    Optional<ProductDiscount> productDiscountEntity = productDiscount.getProductDiscounts().stream()
                            .filter(pd -> pd.getProductId().equals(item.getProductVariant().getProduct().getId()))
                            .findFirst();

                    if (productDiscountEntity.isPresent()) {
                        BigDecimal discountValue = discountService.getDiscountValue(productDiscount);

                        if (productDiscount.getDiscountType() == DiscountType.PERCENTAGE) {
                            BigDecimal discountAmount = itemTotal.multiply(discountValue)
                                    .divide(HUNDRED, 2, RoundingMode.HALF_UP);
                            discountTotal = discountTotal.add(discountAmount);
                        } else if (productDiscount.getDiscountType() == DiscountType.FIXED) {
                            BigDecimal discountAmount = discountValue.multiply(BigDecimal.valueOf(item.getQuantity()));
                            discountTotal = discountTotal.add(discountAmount);
                        }
                    }
                }
            }
        }

        if (orderDiscountCode != null && !orderDiscountCode.isEmpty()) {
            Optional<Discount> orderDiscount = discountService.getAllDiscounts().stream()
                    .filter(d -> d.getDiscountScope() == DiscountScope.ORDER
                            && d.getDiscountCode().equals(orderDiscountCode))
                    .findFirst();

            if (orderDiscount.isPresent()) {
                BigDecimal remainingTotal = total.subtract(discountTotal);
                BigDecimal discountValue = discountService.getDiscountValue(orderDiscount.get());

                if (orderDiscount.get().getDiscountType() == DiscountType.PERCENTAGE) {
                    BigDecimal discountAmount = remainingTotal.multiply(discountValue)
                            .divide(HUNDRED, 2, RoundingMode.HALF_UP);
                    discountTotal = discountTotal.add(discountAmount);
                } else if (orderDiscount.get().getDiscountType() == DiscountType.FIXED) {
                    discountTotal = discountTotal.add(discountValue);
                }
            }
        }

        order.setTotal(total);
        order.setDiscountTotal(discountTotal);

        if (discountTotal.compareTo(total) > 0) {
            discountTotal = total;
        }

        if (discountTotal.compareTo(BigDecimal.ZERO) > 0) {
            order.setTotal(total.subtract(discountTotal));
        }
    }

    private Payment createPayment(Order order, PaymentMethod paymentMethod) {
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentMethod(paymentMethod);

        // Set initial payment status based on payment method
        switch (paymentMethod) {
            case VNPAY:
                // For VNPAY, set initial status as PENDING since payment needs to be processed
                payment.setPaymentStatus(PaymentStatus.PENDING);
                break;
            case CASH:
                // For COD (Cash on Delivery), set as PENDING
                payment.setPaymentStatus(PaymentStatus.PENDING);
                break;
            default:
                payment.setPaymentStatus(PaymentStatus.PENDING);
        }

        return payment;
    }
}