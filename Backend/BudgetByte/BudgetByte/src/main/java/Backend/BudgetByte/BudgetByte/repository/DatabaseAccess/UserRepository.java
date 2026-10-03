
package Backend.BudgetByte.BudgetByte.repository.DatabaseAccess;

import Backend.BudgetByte.BudgetByte.Model.Database_Entity.Users;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByUsername(String username);

    Optional<Users> findByEmail(String email);

    Optional<Users> findByEmailAndPassword(String email, String password);

    Optional<Users> findByUsernameAndPassword(String username, String password);
}
