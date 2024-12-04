package com.example.apple_store.dto;

public class VNPayResponseDTO {
    private String orderId;
    private String amount;
    private String orderInfo;
    private String responseCode;
    private String transactionNo;
    private String bankCode;
    private String payDate;
    private String paymentStatus;
    public VNPayResponseDTO() {
    }
    public VNPayResponseDTO(String orderId, String amount, String orderInfo, String responseCode, String transactionNo,
            String bankCode, String payDate, String paymentStatus) {
        this.orderId = orderId;
        this.amount = amount;
        this.orderInfo = orderInfo;
        this.responseCode = responseCode;
        this.transactionNo = transactionNo;
        this.bankCode = bankCode;
        this.payDate = payDate;
        this.paymentStatus = paymentStatus;
    }
    public String getOrderId() {
        return orderId;
    }
    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
    public String getAmount() {
        return amount;
    }
    public void setAmount(String amount) {
        this.amount = amount;
    }
    public String getOrderInfo() {
        return orderInfo;
    }
    public void setOrderInfo(String orderInfo) {
        this.orderInfo = orderInfo;
    }
    public String getResponseCode() {
        return responseCode;
    }
    public void setResponseCode(String responseCode) {
        this.responseCode = responseCode;
    }
    public String getTransactionNo() {
        return transactionNo;
    }
    public void setTransactionNo(String transactionNo) {
        this.transactionNo = transactionNo;
    }
    public String getBankCode() {
        return bankCode;
    }
    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
    }
    public String getPayDate() {
        return payDate;
    }
    public void setPayDate(String payDate) {
        this.payDate = payDate;
    }
    public String getPaymentStatus() {
        return paymentStatus;
    }
    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
    @Override
    public String toString() {
        return "VNPayResponseDTO{" +
                "orderId='" + orderId + '\'' +
                ", amount='" + amount + '\'' +
                ", orderInfo='" + orderInfo + '\'' +
                ", responseCode='" + responseCode + '\'' +
                ", transactionNo='" + transactionNo + '\'' +
                ", bankCode='" + bankCode + '\'' +
                ", payDate='" + payDate + '\'' +
                ", paymentStatus='" + paymentStatus + '\'' +
                '}';
    }

}