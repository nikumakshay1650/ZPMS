package com.zpms.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.zpms.demo.Register.ArogyaForm;
import com.zpms.demo.Service.ArogyaFormService;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/arogya-forms")
@CrossOrigin(origins = "http://localhost:4200/")
public class ArogyaFormController {

    @Autowired
    private ArogyaFormService arogyaFormService;

    @GetMapping
    public List<ArogyaForm> getAllArogyaForms() {
        return arogyaFormService.getAllArogyaForms();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArogyaForm> getArogyaFormById(@PathVariable Long id) {
        Optional<ArogyaForm> arogyaForm = arogyaFormService.getArogyaFormById(id);
        return arogyaForm.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ArogyaForm createArogyaForm(@Valid @RequestBody ArogyaForm arogyaForm) {
        return arogyaFormService.createArogyaForm(arogyaForm);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArogyaForm> updateArogyaForm(@PathVariable Long id,
                                                      @Valid @RequestBody ArogyaForm arogyaFormDetails) {
        ArogyaForm updatedArogyaForm = arogyaFormService.updateArogyaForm(id, arogyaFormDetails);
        if (updatedArogyaForm == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedArogyaForm);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArogyaForm(@PathVariable Long id) {
        try {
            arogyaFormService.deleteArogyaForm(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}