package com.caue.reusemi.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Anuncio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String categoria;
    private String tipoNegociacao;
    private String valor;
    private String condicao;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String localizacao;
    private String contato;
    private String tags;

    // --- NOVO CAMPO DE IMAGENS ---
    @ElementCollection
    @CollectionTable(name = "anuncio_imagens", joinColumns = @JoinColumn(name = "anuncio_id"))
    @Lob
    @Column(columnDefinition = "TEXT")
    private List<String> imagens = new ArrayList<>();

    private String valorReferencia;
    
    // --- GETTERS E SETTERS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getTipoNegociacao() { return tipoNegociacao; }
    public void setTipoNegociacao(String tipoNegociacao) { this.tipoNegociacao = tipoNegociacao; }

    public String getValor() { return valor; }
    public void setValor(String valor) { this.valor = valor; }

    public String getCondicao() { return condicao; }
    public void setCondicao(String condicao) { this.condicao = condicao; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getLocalizacao() { return localizacao; }
    public void setLocalizacao(String localizacao) { this.localizacao = localizacao; }

    public String getContato() { return contato; }
    public void setContato(String contato) { this.contato = contato; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public List<String> getImagens() { return imagens; }
    public void setImagens(List<String> imagens) { this.imagens = imagens; }
    
    public String getValorReferencia() { return valorReferencia; }
    public void setValorReferencia(String valorReferencia) { this.valorReferencia = valorReferencia; }
}