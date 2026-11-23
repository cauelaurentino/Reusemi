
package com.caue.reusemi.controller;

import com.caue.reusemi.model.Usuario;
import com.caue.reusemi.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    // Cadastro de usuário
    @PostMapping("/cadastro")
    public ResponseEntity<Map<String, Object>> cadastrar(
            @RequestBody Usuario novoUsuario) {

        Map<String, Object> resposta = new HashMap<>();

        // Verifica se o e-mail já está cadastrado
        if (usuarioRepository.findByEmail(novoUsuario.getEmail()).isPresent()) {
            resposta.put("success", false);
            resposta.put("message", "Este e-mail já está cadastrado!");

            return ResponseEntity.badRequest().body(resposta);
        }

        // Criptografa a senha antes de salvar no banco
        String senhaCriptografada =
                passwordEncoder.encode(novoUsuario.getSenha());

        novoUsuario.setSenha(senhaCriptografada);

        // Salva o usuário no banco de dados
        Usuario salvo = usuarioRepository.save(novoUsuario);

        // Remove a senha do objeto de retorno
        salvo.setSenha(null);

        resposta.put("success", true);
        resposta.put("message", "Conta criada com sucesso!");
        resposta.put("usuario", salvo);

        return ResponseEntity.ok(resposta);
    }

    // Login de usuário
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody Map<String, String> credenciais) {

        Map<String, Object> resposta = new HashMap<>();

        String email = credenciais.get("email");
        String senhaAberta = credenciais.get("password");

        Optional<Usuario> usuarioOpt =
                usuarioRepository.findByEmail(email);

        // Verifica se o usuário existe e valida a senha criptografada
        if (usuarioOpt.isPresent()
                && passwordEncoder.matches(
                        senhaAberta,
                        usuarioOpt.get().getSenha())) {

            Usuario usuario = usuarioOpt.get();

            // Não retorna a senha para o front-end
            usuario.setSenha(null);

            resposta.put("success", true);
            resposta.put("token", UUID.randomUUID().toString());
            resposta.put("usuario", usuario);

            return ResponseEntity.ok(resposta);

        } else {
            resposta.put("success", false);
            resposta.put("message", "E-mail ou senha incorretos.");

            return ResponseEntity.status(401).body(resposta);
        }
    }
}
