package com.example.apple_store.entity;

import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "orders")
@Getter
@Setter // Thay @Data bằng @Getter và @Setter
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "shipping_address_id")
    private ShippingAddress shippingAddress;
    
    private BigDecimal total;
    private BigDecimal discountTotal;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;
    
    @Enumerated(EnumType.STRING)
    private PaymentConfirm paymentConfirm;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @JsonManagedReference
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;
    
    @JsonManagedReference
    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    private Payment payment;

    // Override equals and hashCode to use only the id
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Order)) return false;
        Order order = (Order) o;
        return getId() != null && getId().equals(order.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}