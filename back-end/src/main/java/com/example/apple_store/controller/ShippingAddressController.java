package com.example.apple_store.controller;

import com.example.apple_store.entity.ShippingAddress;
import com.example.apple_store.service.ShippingAddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipping-addresses")
public class ShippingAddressController {
    @Autowired
    private ShippingAddressService service;

    @GetMapping
    public ResponseEntity<List<ShippingAddress>> getAllAddresses() {
        return ResponseEntity.ok(service.getAllAddresses());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ShippingAddress>> getAddressesByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getAddressesByUserId(userId));
    }

    @GetMapping("/user/{userId}/address/{addressId}")
    public ResponseEntity<ShippingAddress> getAddressByUserIdAndAddressId(
            @PathVariable Long userId,
            @PathVariable Long addressId) {
        return ResponseEntity.ok(service.getAddressByUserIdAndAddressId(userId, addressId));
    }

    @PostMapping("/{userId}")
    public ResponseEntity<ShippingAddress> createAddress(
            @PathVariable Long userId,
            @RequestBody ShippingAddress address) {
        
        ShippingAddress createdAddress = service.createAddress(userId, address);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAddress);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShippingAddress> updateAddress(
            @PathVariable Long id,
            @RequestBody ShippingAddress address) {
        return ResponseEntity.ok(service.updateAddress(id, address));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        service.deleteAddress(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/user/{userId}/address/{addressId}")
    public ResponseEntity<Void> deleteAddressByUserId(
            @PathVariable Long userId,
            @PathVariable Long addressId) {
        service.deleteAddressByUserId(userId, addressId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteAllAddressesByUserId(@PathVariable Long userId) {
        service.deleteAllAddressesByUserId(userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/user/{userId}/address/{addressId}")
    public ResponseEntity<ShippingAddress> updateAddressByUserId(
            @PathVariable Long userId,
            @PathVariable Long addressId,
            @RequestBody ShippingAddress address) {
        
        ShippingAddress updatedAddress = service.updateAddressByUserId(userId, addressId, address);
        return ResponseEntity.ok(updatedAddress);
    }
}
