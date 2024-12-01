document.addEventListener("DOMContentLoaded", () => {
	const themeToggle = document.getElementById("theme-toggle");

	const savedTheme = localStorage.getItem("theme");
	if (savedTheme === "dark" || !savedTheme) {
		document.documentElement.setAttribute("data-theme", "dark");
		themeToggle.checked = true;
	} else {
		document.documentElement.setAttribute("data-theme", "light");
		themeToggle.checked = false;
	}

	themeToggle.addEventListener("change", function () {
		if (this.checked) {
			document.documentElement.setAttribute("data-theme", "dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.setAttribute("data-theme", "light");
			localStorage.setItem("theme", "light");
		}
	});

	document.body.style.transition = "none";
	document.documentElement.classList.add("theme-loaded");
	setTimeout(() => {
		document.body.style.transition = "";
	}, 1);
});
