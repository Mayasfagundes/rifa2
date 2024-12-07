document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const maxNumbers = parseInt(params.get("n") ); 
    const selectedNumbers = new Set();
    const totalNumbers = 500; // Total de números disponíveis

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

        // Validação do formulário
        if (!name || !phone || !instagram) {
            alert("Por favor, preencha todos os campos.");
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

        // Configuração da API
        const apiUrl = `https://api.airtable.com/v0/pat6SzawWOx1PX6hq.c08b8ba67206eb4f5b14e69d4c1a10f0a5878c31fae5e74caacd866f12ea2261`;
        const apiKey = "FF8QqqpnYfbHEU"; // Substitua isso por uma variável segura no backend

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    fields: {
                        Name: userData.name,
                        Phone: userData.phone,
                        Instagram: userData.instagram,
                        SelectedNumbers: userData.selectedNumbers,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error(`Erro ao salvar: HTTP ${response.status}`);
            }

            const result = await response.json();
            alert("Seus dados foram salvos com sucesso!");
            console.log("Resultado:", result);

            // Limpa os dados do formulário e números selecionados
            document.getElementById("user-info-form").reset();
            selectedNumbers.clear();
            document.querySelectorAll(".number.selected").forEach((el) => el.classList.remove("selected"));

            // Redireciona para a página de agradecimento
            window.location.href = "agradecimento.html";
        } catch (error) {
            console.error("Erro ao salvar os dados:", error);
            alert("Erro ao salvar os dados. Por favor, tente novamente.");
        }
    });
});
