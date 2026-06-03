const delayTargets = document.querySelectorAll(`
    .hero h1
`);

const letterDelay = 18;
const wordDelay = 90;
const elementDelay = 45;

function prepareTextDelay(element, elementIndex) {
    const text = element.innerText.trim();

    if (!text) {
        return;
    }

    element.classList.add("text-delay");
    element.setAttribute("aria-label", text);
    element.innerHTML = "";

    let totalDelay = elementIndex * elementDelay;

    text.split(/\s+/).forEach((word) => {
        const wordSpan = document.createElement("span");
        wordSpan.classList.add("word");
        wordSpan.setAttribute("aria-hidden", "true");

        word.split("").forEach((char) => {
            const letterSpan = document.createElement("span");
            letterSpan.classList.add("letter");
            letterSpan.innerText = char;
            letterSpan.style.animationDelay = `${totalDelay}ms`;

            totalDelay += letterDelay;
            wordSpan.appendChild(letterSpan);
        });

        totalDelay += wordDelay;
        element.appendChild(wordSpan);
    });
}

delayTargets.forEach(prepareTextDelay);

document.querySelectorAll(".contact-icon[data-animation]").forEach((icon) => {
    if (!window.lottie) {
        return;
    }

    const animationPath = icon.dataset.animation;
    const fallbackIcon = icon.querySelector("img");
    const animationMount = document.createElement("span");

    animationMount.className = "contact-animation";
    icon.appendChild(animationMount);

    const animation = window.lottie.loadAnimation({
        container: animationMount,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: animationPath
    });

    animation.addEventListener("DOMLoaded", () => {
        icon.classList.add("is-animated");
        fallbackIcon?.setAttribute("hidden", "");
    });

    animation.addEventListener("data_failed", () => {
        animationMount.remove();
        fallbackIcon?.removeAttribute("hidden");
    });
});

if ("IntersectionObserver" in window) {
    const textObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, {
        threshold:0.2,
        rootMargin:"0px 0px -8% 0px"
    });

    delayTargets.forEach((element) => textObserver.observe(element));
} else {
    delayTargets.forEach((element) => element.classList.add("is-visible"));
}
