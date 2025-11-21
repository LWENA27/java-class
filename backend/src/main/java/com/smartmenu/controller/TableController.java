package com.smartmenu.controller;

import com.smartmenu.model.Table;
import com.smartmenu.repository.TableRepository;
import com.smartmenu.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Table Controller - REST endpoints to manage tables/rooms and QR codes
 */
@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class TableController {

    private final TableRepository tableRepository;
    
    @Value("${app.frontend.url}")
    private String frontendUrl;

    /**
     * GET /api/tables
     * Return list of tables for the current authenticated user
     */
    @GetMapping
    public ResponseEntity<List<Table>> listTables(@AuthenticationPrincipal UserDetailsImpl currentUser) {
        String userId = currentUser.getId();
        List<Table> tables = tableRepository.findByUserId(userId);
        return ResponseEntity.ok(tables);
    }

    /**
     * POST /api/tables
     * Create a new table for the current user
     */
    @PostMapping
    public ResponseEntity<?> createTable(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @RequestBody Map<String, Object> body
    ) {
        String userId = currentUser.getId();

        String tableNumber = Optional.ofNullable((String) body.get("tableNumber")).orElse("").trim();
        boolean isRoom = Optional.ofNullable((Boolean) body.get("isRoom")).orElse(false);
        String location = Optional.ofNullable((String) body.get("location")).orElse("").trim();

        List<String> errors = new ArrayList<>();
        if (tableNumber.isEmpty()) errors.add("tableNumber is required");
        if (tableNumber.length() > 50) errors.add("tableNumber too long");
        if (location.length() > 100) errors.add("location too long");
        if (!errors.isEmpty()) return ResponseEntity.badRequest().body(Map.of("errors", errors));

        // Check uniqueness for this user
        List<Table> existing = tableRepository.findByUserIdAndTableNumber(userId, tableNumber);
        if (!existing.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "A table with this number already exists"));
        }

        // Generate QR identifiers
        String qrCodeId = UUID.randomUUID().toString();

    Table table = new Table();
        table.setUserId(userId);
        table.setTableNumber(tableNumber);
    table.setRoom(isRoom);
    table.setLocation(location);
        table.setQrCodeId(qrCodeId);
        table.setQrCodeUrl(""); // Will be updated after save
        table.setQrCodeImage("");
        table.setActive(true);
        table.setCreatedAt(LocalDateTime.now());

        // Save first to get the table ID
        Table saved = tableRepository.save(table);
        
        // Now update with proper URL using frontend URL from config
        String qrCodeUrl = String.format("%s/customer-menu?table=%s", frontendUrl, saved.getId());
        saved.setQrCodeUrl(qrCodeUrl);
        saved = tableRepository.save(saved);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * DELETE /api/tables/{id}
     * Delete a table owned by the current user
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTable(@AuthenticationPrincipal UserDetailsImpl currentUser, @PathVariable String id) {
        String userId = currentUser.getId();

        if (id == null || id.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid id"));
        }

        Optional<Table> opt = tableRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Table not found"));

        Table table = opt.get();
        if (!Objects.equals(table.getUserId(), userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Not allowed to delete this table"));
        }

        tableRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
