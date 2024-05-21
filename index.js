let hasFlippedCard = false;
let firstCard;
let secondCard;
let blockCard = false;
let matchedCards = 0;
let count = 0
let playerName = ''


const memoryGame = {
  cardCreate() {
    for (let i = 0; i < 20; i++) {
      const gameContainer = document.querySelector(".memory-game");
      const div = document.createElement("div");
      div.classList.add("card");
      div.style.backgroundColor = "rgb(18 112 95)";
      gameContainer.append(div);
      // вставка фронта
      const frontImg = document.createElement("img");
      frontImg.classList.add("front-img");
      frontImg.src = "assets/svg/lapka.svg";
      div.append(frontImg);
    }
  },
  createBackImg() {
    const frontCard = document.querySelectorAll(".card");
    const imageSources = [
      "assets/img/fox.png",
      "assets/img/homiak.png",
      "assets/img/korova.png",
      "assets/img/koshka.png",
      "assets/img/ovechka.png",
      "assets/img/skuns.png",
      "assets/img/slon.png",
      "assets/img/sova.png",
      "assets/img/svinya.png",
      "assets/img/utka.png",
    ];
    frontCard.forEach((frontCard, index) => {
      const backImg = document.createElement("img");
      const imageName = imageSources[Math.floor(index / 2)]
        .split("/")
        .pop()
        .split(".")[0];
      backImg.classList.add("back-img");
      frontCard.dataset.name = imageName;
      backImg.src = imageSources[Math.floor(index / 2)];
      frontCard.append(backImg);
    });
  },
  flipCards() {
    const frontCard = document.querySelectorAll(".card");
    frontCard.forEach((card) => card.addEventListener("click", flipCard));
    function flipCard() {
      if (blockCard) return;
      if (this === firstCard && firstCard.classList.contains('flip')) return;
      this.classList.add("flip");
      // переворот первыой карты и сохраняем значение
      if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
      }
      // переворот второй карты и сохраняем значение
      else {
        hasFlippedCard = false;
        secondCard = this;
        // проверка по датасэту
        if (secondCard.dataset.name === firstCard.dataset.name) {
          firstCard.removeEventListener("click", flipCard);
          secondCard.removeEventListener("click", flipCard);
          firstCard.setAttribute('data-matched', 'true');
          secondCard.setAttribute('data-matched', 'true');
        } else {
          blockCard = true;
          setTimeout(() => {
            firstCard.classList.remove("flip");
            secondCard.classList.remove("flip");
            blockCard = false;
          }, 1000);
          memoryGame.counting()
        }
        memoryGame.matched ()
      }
    }
  },
  randomize() {
    const frontCard = document.querySelectorAll(".card");
    frontCard.forEach((card) => {
      let random = Math.floor(Math.random() * 20);
      card.style.order = random;
    });
  },
  matched () {
    const allCards = document.querySelectorAll('.card')
    matchedCards = Array.from(document.querySelectorAll('.card')).filter(card => card.getAttribute('data-matched') === 'true').length;
    if (matchedCards === totalCards) {
        console.log('Все карты уже открыты. Игра завершена.');
        setTimeout(() => {
            allCards.forEach((card) => {
                 card.classList.remove('flip')
                card.removeAttribute('data-matched')})
            blockCard = false;
            memoryGame.flipCards()
            memoryGame.finishResult()
          }, 1000);
          setTimeout(() => {memoryGame.randomize() },1100)
    }
},
// модальное окно конца
finishResult () {
  const numberOfTry = document.querySelector('.finish-try')
  numberOfTry.innerHTML = `Количество попыток: ${count}`
  const finishModal = document.querySelector('.finish-modal')
  finishModal.classList.remove('visibility')
  memoryGame.showPlayerName()
  memoryGame.saveScoreLocalStorage ()
  memoryGame.addScoreName ()
finishModal.addEventListener('click', function (event) {
  if (event.target.classList.contains('finish-modal')){
    finishModal.classList.add('visibility')
    count = 0
  }
})
},
counting () {
  return count++
  },
  // показывает и скрывает модалку
loginModal() {
  const modal = document.querySelector('.login-modal')
  const login = document.querySelector('.login');
  login.addEventListener('click', function(event){
  if (event.target.classList.contains('log')){
  modal.classList.remove('visibility');
  }
  });
  modal.addEventListener('click', function(event){
    if (event.target.classList.contains('login-modal')){
      modal.classList.add('visibility');
      }
  })
  },
  // получает имя юзера и записываем в локал
  getPlayerName() {
    const modal = document.querySelector('.login-modal')
    const input = document.querySelector('.inp');
    const button = document.querySelector('.btn');

    button.addEventListener('click', function() {
      const playerName = input.value;
      const newPlayer = {
        name: playerName,
        score: memoryGame.counting()
      };

      // Сохраняем в локал
      let existingData = JSON.parse(localStorage.getItem("users")) || [];
      if (existingData.length > 9){
      // Удаляем всех пользователей
      existingData.shift();
      }

      // Добавляем нового пользователя
      existingData.push(newPlayer);
      count = 0

      localStorage.setItem("users", JSON.stringify(existingData));
      // скрываем окно
      modal.classList.add('visibility');
    });
  },
  // показываем имя пользователя в конце
showPlayerName () {
  const div = document.querySelector('.finish-text')
  let localData = localStorage.getItem("users");
      if (localData) {
        let parseLocalData = JSON.parse(localData);
        let playerName = parseLocalData[parseLocalData.length - 1].name;
        div.innerHTML = `Поздравляю, ${playerName}, вы победили`
        console.log(playerName)
  }
},
// счётчик очков в конце игры сохраняем в локале
saveScoreLocalStorage() {
  let data = localStorage.getItem("users");
  if (data) {
      let num = JSON.parse(data);
      if (num.length > 0) {
          num[num.length - 1].score = count; // Устанавливаем новый счетчик
          localStorage.setItem("users", JSON.stringify(num)); // Сохраняем обновленные данные
      }
  }
},
addScoreName () {
  let data = localStorage.getItem("users");
  if (data) {
      let dataParse = JSON.parse(data);
      memoryGame.createDivName(dataParse)
      memoryGame.createDivScore(dataParse)
  }
},
// дивы с именами
createDivName(dataParse) {
  const nameBlock = document.querySelector('.score-name');
  nameBlock.innerHTML = '';
   // хедер названия колонки
  const headerRow = document.createElement('div');
  headerRow.classList.add("name");
  headerRow.style.backgroundColor = "rgb(18 112 95)";
  headerRow.textContent = "Имя";
  nameBlock.append(headerRow);

  dataParse.forEach(player => {
    const div = document.createElement('div');
    div.classList.add("name");
    div.style.backgroundColor = "rgb(18 112 95)";
    div.textContent = player.name;
    nameBlock.append(div);
  });
},
createDivScore (dataParse) {
  const scoreBlock = document.querySelector('.score-score');
  scoreBlock.innerHTML = '';
  // хедер названия колонки
  const headerRow = document.createElement('div');
  headerRow.classList.add("score-try");
  headerRow.style.backgroundColor = "rgb(18 112 95)";
  headerRow.textContent = "Попыток";
  scoreBlock.append(headerRow);

  dataParse.forEach(player => {
    const div = document.createElement('div');
    div.classList.add("score-try");
    div.style.backgroundColor = "rgb(18 112 95)";
    div.textContent = player.score;
    scoreBlock.append(div);
  });
},
// cкрытие и открытие счёта
ShowAndHideScore () {
  const scoreButton = document.querySelector('.try')
  const scoreModal = document.querySelector('.score-modal')
  scoreButton.addEventListener('click', function(event) {
    if (event.target.classList.contains('try')) {
      scoreModal.classList.remove('visibility')
    }
  })
  scoreModal.addEventListener('click', function(event) {
    if (event.target.classList.contains('score-modal')) {
      scoreModal.classList.add('visibility')
    }
  })
},
};
memoryGame.cardCreate();
memoryGame.createBackImg();
memoryGame.flipCards();
memoryGame.randomize();
memoryGame.loginModal()
memoryGame.getPlayerName()
memoryGame.addScoreName ()
memoryGame.ShowAndHideScore ();

const totalCards = document.querySelectorAll('.card').length;


