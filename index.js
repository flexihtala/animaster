addListeners();

function addListeners() {
    const animation = animaster();

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animation.addFadeIn(5000).play(block);
        });

    document.getElementById('fadeInCancel')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animation.resetFadeIn(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animation.addFadeOut(5000).play(block);
        });

    document.getElementById('fadeOutCancel')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animation.resetFadeOut(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animation.addMove(1000, { x: 100, y: 10 }).play(block);
        });

    document.getElementById('moveCancel')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animation.resetMoveAndScale(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animation.addScale(1000, 1.25).play(block);
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

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animation.resetMoveAndHide(block);
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
            this.addFadeIn(duration).play(element);
        },

        fadeOut(element, duration) {
            this.addFadeOut(duration).play(element);
        },

        move(element, duration, translation) {
            this.addMove(duration, translation).play(element);
        },

        scale(element, duration, ratio) {
            this.addScale(duration, ratio).play(element);
        },

        moveAndHide(element, duration) {
            const moveDuration = (duration * 2) / 5;
            const hideDuration = (duration * 3) / 5;

            this.addMove(moveDuration, { x: 100, y: 20 })
                .addFadeOut(hideDuration)
                .play(element);
        },

        showAndHide(element, duration) {
            const stepDuration = duration / 3;

            this.addFadeIn(stepDuration)
                .addFadeOut(stepDuration)
                .play(element);
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

        addMove(duration, translation) {
            this._steps.push({ type: 'move', duration, translation });
            return this;
        },

        addScale(duration, ratio) {
            this._steps.push({ type: 'scale', duration, ratio });
            return this;
        },

        addFadeIn(duration) {
            this._steps.push({ type: 'fadeIn', duration });
            return this;
        },

        addFadeOut(duration) {
            this._steps.push({ type: 'fadeOut', duration });
            return this;
        },

        play(element) {
            let totalDelay = 0;

            for (const step of this._steps) {
                setTimeout(() => {
                    if (step.type === 'move') {
                        this._executeMove(element, step.duration, step.translation);
                    } else if (step.type === 'scale') {
                        this._executeScale(element, step.duration, step.ratio);
                    } else if (step.type === 'fadeIn') {
                        this._executeFadeIn(element, step.duration);
                    } else if (step.type === 'fadeOut') {
                        this._executeFadeOut(element, step.duration);
                    }
                }, totalDelay);

                totalDelay += step.duration;
            }
        },

        _executeMove(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        _executeScale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        _executeFadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        _executeFadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        resetFadeIn,
        resetFadeOut,
        resetMoveAndScale,
        resetMoveAndHide
    };
}