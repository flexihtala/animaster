addListeners();

function addListeners() {
    const animation = animaster();

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animation.addFadeIn(5000).play(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animation.addFadeOut(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animation.addMove(1000, { x: 100, y: 10 }).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animation.addScale(1000, 1.25).play(block);
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

    // Запуск сложной кастомной анимации
    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
            const customAnimation = animaster()
                .addMove(200, { x: 40, y: 40 })
                .addScale(800, 1.3)
                .addMove(200, { x: 80, y: 0 })
                .addScale(800, 1)
                .addMove(200, { x: 40, y: -40 })
                .addScale(800, 0.7)
                .addMove(200, { x: 0, y: 0 })
                .addScale(800, 1);
            customAnimation.play(block);
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
        }
    };
}