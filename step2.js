document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const maxNumbers = parseInt(params.get("n")) ; // Quantidade solicitada
    const selectedNumbers = new Set();
    const totalNumbers = 500; // Total de números na rifa
  
    const numberGrid = document.getElementById("number-grid");
    const submitButton = document.getElementById("submit-button");
  
    // Gera os números disponíveis
    for (let i = 1; i <= totalNumbers; i++) {
        const numberDiv = document.createElement("div");
        numberDiv.classList.add("number");
        numberDiv.textContent = i;

        numberDiv.addEventListener("click", () => {
            if (selectedNumbers.size >= maxNumbers && !numberDiv.classList.contains("selected")) {
                alert(`Você só pode escolher até ${maxNumbers} números.`);
                return;
            }

            if (numberDiv.classList.contains("selected")) {
                selectedNumbers.delete(numberDiv.textContent);
                numberDiv.classList.remove("selected");
            } else {
                selectedNumbers.add(numberDiv.textContent);
                numberDiv.classList.add("selected");
            }

            submitButton.disabled = selectedNumbers.size !== maxNumbers;
        });

        numberGrid.appendChild(numberDiv);
    }
  
    // Envio de dados
    document.getElementById("user-info-form").addEventListener("submit", async (e) => {
        e.preventDefault();
  
        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const instagram = document.getElementById("instagram").value.trim();
  
        if (!name || !phone || !instagram) {
            alert("Preencha todos os campos.");
            return;
        }

        if (selectedNumbers.size !== maxNumbers) {
            alert(`Por favor, selecione exatamente ${maxNumbers} números.`);
            return;
        }
  
        const userData = {
            name,
            phone,
            instagram,
            selectedNumbers: Array.from(selectedNumbers),
        };
  
        try {
            const response = await fetch("https://script.google.com/macros/s/AKfycbyeSasYDugSPruq4NqrOhYTPSDuhDc5DUJfciMksC1ILU9NDlK9cDvmplvAkpzx2AyYxw/exec", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify(userData),
            });
            

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.text();
            alert("Seus dados foram salvos com sucesso!");
            console.log("Resultado:", result);
            // Redirecionar ou limpar o formulário após sucesso
            window.location.href = "agradecimento.html"; // Alterar para a página de confirmação
        } catch (error) {
            console.error("Erro ao salvar os dados:", error);
            alert("Erro ao salvar os dados. Tente novamente.");
        }
    });
});
