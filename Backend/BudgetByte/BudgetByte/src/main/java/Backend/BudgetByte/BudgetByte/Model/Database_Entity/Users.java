package Backend.BudgetByte.BudgetByte.Model.Database_Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")

// Table name is "users" and the class name is "Users". The class represents a user entity in the database 
// with fields for id, username, email, and password. It includes constructors, getters, and setters for these fields.
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    public Users() {
    }

// Constructor to create a new user with the specified username, email, and password.

    public Users(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}