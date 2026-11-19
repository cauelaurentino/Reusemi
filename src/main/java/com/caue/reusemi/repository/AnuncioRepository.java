package com.caue.reusemi.repository;

import com.caue.reusemi.model.Anuncio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnuncioRepository extends JpaRepository<Anuncio, Long> {
    // Método customizado para o campo de busca
    List<Anuncio> findByTituloContainingIgnoreCase(String query);
}