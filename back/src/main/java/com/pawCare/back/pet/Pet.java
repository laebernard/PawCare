package com.pawCare.back.pet;

public class Pet {

    private String id;
    private String userId;
    private String name;
    private String breed;
    private String birthDate;
    private String color;
    private double weight;
    private String identification;
    private boolean sterilized;
    private String imageUrl;

    public Pet(String id, String userId, String name, String breed, String birthDate,
               String color, double weight, String identification,
               boolean sterilized, String imageUrl) {
        this.id = id;
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

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getName() { return name; }
    public String getBreed() { return breed; }
    public String getBirthDate() { return birthDate; }
    public String getColor() { return color; }
    public double getWeight() { return weight; }
    public String getIdentification() { return identification; }
    public boolean isSterilized() { return sterilized; }
    public String getImageUrl() { return imageUrl; }
}