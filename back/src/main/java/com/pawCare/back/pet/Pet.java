package com.pawCare.back.pet;

import com.pawCare.back.user.User;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "pets")
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    private String breed;
    private LocalDate birthDate;
    private String color;
    private Double weight;
    private String identification;
    private Boolean sterilized;
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private PetType type;

    public Pet() {}

    public Pet(User user, String name, String breed, LocalDate birthDate,
               String color, Double weight, String identification,
               Boolean sterilized, String imageUrl, PetType type) {
        this.user = user;
        this.name = name;
        this.breed = breed;
        this.birthDate = birthDate;
        this.color = color;
        this.weight = weight;
        this.identification = identification;
        this.sterilized = sterilized;
        this.imageUrl = imageUrl;
        this.type = type;
    }

    public Long getId() { return id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public PetType getType() { return type; }
    public void setType(PetType type) { this.type = type; }
}
