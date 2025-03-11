addListeners();

function addListeners() {
    const animation = animaster();

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animation.fadeIn(block, 5000);
        });

    document.getElementById('fadeInCancel')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animation.resetFadeIn(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animation.fadeOut(block, 5000);
        });

    document.getElementById('fadeOutCancel')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animation.resetFadeOut(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animation.move(block, 1000, { x: 100, y: 10 });
        });

    document.getElementById('moveCancel')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animation.resetMoveAndScale(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animation.scale(block, 1000, 1.25);
        });

    document.getElementById('scaleCancel')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animation.resetMoveAndScale(block);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animation.moveAndHide(block, 5000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animation.showAndHide(block, 3000);
        });

    let heartBeatingAnimation;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            if (!heartBeatingAnimation) {
                heartBeatingAnimation = animation.heartBeating(block);
            }
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (heartBeatingAnimation) {
                heartBeatingAnimation.stop();
                heartBeatingAnimation = null;
            }
        });
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}

function animaster() {
    function resetFadeIn(element) {
        element.classList.remove('show');
        element.classList.add('hide');
        element.style.transitionDuration = null;
    }

    function resetFadeOut(element) {
        element.classList.remove('hide');
        element.classList.add('show');
        element.style.transitionDuration = null;
    }

    function resetMoveAndScale(element) {
        element.style.transform = null;
        element.style.transitionDuration = null;
    }

    return {
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        moveAndHide(element, duration) {
            const moveDuration = (duration * 2) / 5;
            const hideDuration = (duration * 3) / 5;

            this.move(element, moveDuration, { x: 100, y: 20 });

            setTimeout(() => {
                this.fadeOut(element, hideDuration);
            }, moveDuration);
        },

        showAndHide(element, duration) {
            const stepDuration = duration / 3;

            this.fadeIn(element, stepDuration);

            setTimeout(() => {
                this.fadeOut(element, stepDuration);
            }, stepDuration * 2);
        },

        heartBeating(element) {
            const beat = () => {
                this.scale(element, 500, 1.4);
                setTimeout(() => {
                    this.scale(element, 500, 1);
                }, 500);
            };

            const intervalId = setInterval(beat, 1000);

            return {
                stop() {
                    clearInterval(intervalId);
                },
            };
        },

        resetFadeIn,
        resetFadeOut,
        resetMoveAndScale
    };
}