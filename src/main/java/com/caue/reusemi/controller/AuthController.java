package com.caue.reusemi.controller;

import com.caue.reusemi.model.Usuario;
import com.caue.reusemi.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin("*") 
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Usuario loginRequest) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<Usuario> usuarioDb = usuarioRepository.findByEmail(loginRequest.getEmail());
        
        // Validação simples (em produção, as senhas devem ser criptografadas)
        if (usuarioDb.isPresent() && usuarioDb.get().getPassword().equals(loginRequest.getPassword())) {
            response.put("success", true);
            response.put("token", "jwt_token_gerado_aqui");
            response.put("message", "Login realizado com sucesso!");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Email ou senha incorretos.");
            return ResponseEntity.status(401).body(response);
        }
    }
    
    // Rota auxiliar para você cadastrar o primeiro usuário para testar
    @PostMapping("/usuarios/cadastrar")
    public Usuario cadastrar(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
}