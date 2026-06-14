package com.pawCare.back.contact;

import jakarta.persistence.*;

@Entity
@Table(name = "contacts")
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private ContactType type;

    private String phone;
    private String address;

    public Contact() {}

    public Contact(String name, ContactType type, String phone, String address) {
        this.name = name;
        this.type = type;
        this.phone = phone;
        this.address = address;
    }

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public ContactType getType() { return type; }
    public void setType(ContactType type) { this.type = type; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
