package com.pawCare.back.login;

public class LoginData {

    private String token;
    private Long id;
    private String firstName;
    private String lastName;
    private String email;

    public LoginData(String token, Long id, String firstName, String lastName, String email) {
        this.token = token;
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    public String getToken() { return token; }
    public Long getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
}
