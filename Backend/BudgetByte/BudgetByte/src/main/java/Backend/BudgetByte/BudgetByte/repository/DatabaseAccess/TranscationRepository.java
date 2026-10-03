package Backend.BudgetByte.BudgetByte.repository.DatabaseAccess;

import Backend.BudgetByte.BudgetByte.Model.Database_Entity.Payments.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TranscationRepository extends JpaRepository<Transactions, Long> {
	List<Transactions> findByUserId_Id(Long userId);
}
