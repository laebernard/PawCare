package com.pawCare.back.pet;

import java.time.LocalDate;
import jakarta.persistence.*;

@Entity
@Table(name = "pets")
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String name;

    private String breed;
    private LocalDate birthDate;    
    private String color;
    private Double weight;
    private String identification;
    private Boolean sterilized;
    private String imageUrl;

    public Pet() {}

    public Pet(String userId, String name, String breed, LocalDate birthDate,
               String color, Double weight, String identification,
               Boolean sterilized, String imageUrl) {
        this.userId = userId;
        this.name = name;
        this.breed = breed;
        this.birthDate = birthDate;
        this.color = color;
        this.weight = weight;
        this.identification = identification;
        this.sterilized = sterilized;
        this.imageUrl = imageUrl;
    }

    public Long getId() { return id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }

    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public String getIdentification() { return identification; }
    public void setIdentification(String identification) { this.identification = identification; }

    public Boolean getSterilized() { return sterilized; }
    public void setSterilized(Boolean sterilized) { this.sterilized = sterilized; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}