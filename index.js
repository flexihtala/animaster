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
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animation.resetMoveAndHide(block);
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

function animaster() {
    let timerId;

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

    function resetMoveAndHide(element) {
        clearTimeout(timerId);
        resetMoveAndScale(element);
        resetFadeOut(element);
    }

    return {
        _steps: [],

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

        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        move(element, duration, translation) {
            this.addMove(duration, translation)
                .play(element);
        },

        addMove(duration, translation) {
            this._steps.push({
                type: 'move',
                duration,
                translation,
            });
            return this;
        },

        addScale(duration, ratio) {
            this._steps.push({
                type: 'scale',
                duration,
                ratio,
            });
            return this;
        },

        addFadeIn(duration) {
            this._steps.push({
                type: 'fadeIn',
                duration,
            });
            return this;
        },

        addFadeOut(duration) {
            this._steps.push({
                type: 'fadeOut',
                duration,
            });
            return this;
        },

        play(element) {
            let delay = 0;
            this._steps.forEach(step => {
                setTimeout(() => {
                    switch (step.type) {
                        case 'move':
                            element.style.transitionDuration = `${step.duration}ms`;
                            element.style.transform = getTransform(step.translation, null);
                            break;
                        case 'scale':
                            element.style.transitionDuration = `${step.duration}ms`;
                            element.style.transform = getTransform(null, step.ratio);
                            break;
                        case 'fadeIn':
                            this.fadeIn(element, step.duration);
                            break;
                        case 'fadeOut':
                            this.fadeOut(element, step.duration);
                            break;
                    }
                }, delay);
                delay += step.duration;
            });
        },

        resetFadeIn,
        resetFadeOut,
        resetMoveAndScale,
        resetMoveAndHide
    };
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
