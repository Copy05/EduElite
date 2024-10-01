const resetLink = document.getElementById("settings-reset-progress");
const modal = document.getElementById("confirmationModal");
const confirmButton = document.getElementById("confirm-reset");
const cancelButton = document.getElementById("cancel-reset");

resetLink.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "block";
});

confirmButton.addEventListener("click", () => {
    localStorage.removeItem("totalScore");

    modal.style.display = "none";
    location.reload();
});

cancelButton.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target == modal) {
        modal.style.display = "none";
    }
});
