
package com.caue.reusemi.controller;

import com.caue.reusemi.model.Anuncio;
import com.caue.reusemi.repository.AnuncioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class AnuncioController {

    @Autowired
    private AnuncioRepository anuncioRepository;

    @GetMapping("/produtos")
    public ResponseEntity<Map<String, Object>> listarProdutos(
            @RequestParam(required = false) String q) {

        List<Anuncio> resultados;

        if (q != null && !q.isEmpty()) {
            resultados = anuncioRepository.findByTituloContainingIgnoreCase(q);
        } else {
            resultados = anuncioRepository.findAll();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", resultados);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/produtos")
    public ResponseEntity<Map<String, Object>> criarAnuncio(
            @RequestBody Anuncio anuncio) {

        Anuncio salvo = anuncioRepository.save(anuncio);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Anúncio publicado com sucesso!");
        response.put("data", salvo);

        return ResponseEntity.ok(response);
    }
}
