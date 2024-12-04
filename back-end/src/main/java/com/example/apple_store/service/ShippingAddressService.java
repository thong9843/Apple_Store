package com.example.apple_store.service;

import com.example.apple_store.entity.ShippingAddress;
import com.example.apple_store.repository.ShippingAddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ShippingAddressService {
    @Autowired
    private ShippingAddressRepository repository;

    public List<ShippingAddress> getAllAddresses() {
        return repository.findAll();
    }

    public List<ShippingAddress> getAddressesByUserId(Long userId) {
        return repository.findByUserId(userId);
    }

    public ShippingAddress getAddressByUserIdAndAddressId(Long userId, Long addressId) {
        return repository.findByUserIdAndId(userId, addressId);
    }

    public ShippingAddress createAddress(Long userId, ShippingAddress address) {
        address.setUserId(userId);
        address.setCreatedAt(LocalDateTime.now());
        address.setUpdatedAt(LocalDateTime.now());
        return repository.save(address);
    }

    public ShippingAddress updateAddress(Long id, ShippingAddress address) {
        ShippingAddress existingAddress = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Address not found"));
        
        existingAddress.setAddress(address.getAddress());
        existingAddress.setCity(address.getCity());
        existingAddress.setState(address.getState());
        existingAddress.setCountry(address.getCountry());
        existingAddress.setPostalCode(address.getPostalCode());
        existingAddress.setPhone(address.getPhone());
        existingAddress.setUpdatedAt(LocalDateTime.now());
        
        return repository.save(existingAddress);
    }

    public void deleteAddress(Long id) {
        repository.deleteById(id);
    }

    public ShippingAddress updateAddressByUserId(Long userId, Long addressId, ShippingAddress address) {
        ShippingAddress existingAddress = repository.findByUserIdAndId(userId, addressId);
        if (existingAddress == null) {
            throw new RuntimeException("Address not found for user with id: " + userId);
        }
        
        existingAddress.setAddress(address.getAddress());
        existingAddress.setCity(address.getCity());
        existingAddress.setState(address.getState());
        existingAddress.setCountry(address.getCountry());
        existingAddress.setPostalCode(address.getPostalCode());
        existingAddress.setPhone(address.getPhone());
        existingAddress.setUpdatedAt(LocalDateTime.now());
        
        return repository.save(existingAddress);
    }

    public void deleteAddressByUserId(Long userId, Long addressId) {
        ShippingAddress address = repository.findByUserIdAndId(userId, addressId);
        if (address == null) {
            throw new RuntimeException("Address not found for user with id: " + userId);
        }
        repository.delete(address);
    }

    public void deleteAllAddressesByUserId(Long userId) {
        List<ShippingAddress> addresses = repository.findByUserId(userId);
        if (addresses.isEmpty()) {
            throw new RuntimeException("No addresses found for user with id: " + userId);
        }
        repository.deleteAll(addresses);
    }
}
