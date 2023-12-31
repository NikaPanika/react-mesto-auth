import '../index.css';
import { useEffect, useState } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from '../utils/Api.js';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Login from "./Login";
import { ProtectedRoute } from "./ProtectedRoute";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import * as auth from "../utils/auth";
import Register from './Register';
import InfoTooltip from './InfoTooltip';


function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);

  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);

  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);

  const [selectedCard, setSelectedCard] = useState({});

  const [currentUser, setCurrentUser] = useState({});

  const [cards, setCards] = useState([]);

  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    api.getUser()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => {
        console.log(`Ошибка profile: ${err}`)
      });
    api.getInitialCards()
      .then((initialCards) => {
        setCards(initialCards);
      }).catch((err) => {
        console.log(`Ошибка cards: ${err}`)
      });
  }, []);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  };

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  };

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  };

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  };

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setIsLoginConfirmed(false);
  }

  const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || isImagePopupOpen;

  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if (isOpen) { // навешиваем только при открытии
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isOpen])

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => c._id === card._id ? newCard : c));
      }).catch((err) => {
        console.log(`Ошибка cards: ${err}`)
      });
  }

  const [isLoading, setIsLoading] = useState(false);

  function handleCardDelete(card) {
    setIsLoading(true);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) =>
          state.filter((c) => c._id !== card._id));
      }).catch((err) => {
        console.log(`Ошибка cards: ${err}`)
      }).finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateUser(inputs) {
    setIsLoading(true);
    api
      .setUserInfo(inputs) //сделать запрос к серверу на добавление
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      })
  }

  function handleUpdateAvatar(link) {
    setIsLoading(true);
    api
      .setAvatar(link)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();

      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleAddPlaceSubmit(data) {
    setIsLoading(true);
    api
      .addCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      auth
        .checkToken()
        .then((res) => {
          setIsLogged(true);
          navigate("/", { replace: true });
          setUserEmail(res.data.email);
        })
        .catch(console.error);
    }
  }, []);


  const [userEmail, setUserEmail] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [text, setText] = useState("");
  const [isLoginConfirmed, setIsLoginConfirmed] = useState(false);

  function handleLogin({ email, password }) {
    setIsLoading(true);
    auth
      .login({ email, password })
      .then((res) => {
        setUserEmail(email);
        setIsLogged(true);
        navigate("/", { replace: true });
        localStorage.setItem("jwt", res.token);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  function handleRegister({ email, password }) {
    setIsLoading(true);
    auth
      .register({ email, password })
      .then(() => {
        navigate("/sign-in", { replace: true });
        setIsRegistered(true);
        setText("Вы успешно зарегистрировались!");
      })
      .catch((err) => {
        console.log(err);
        setIsRegistered(false);
        setText("Что-то пошло не так! Попробуйте ещё раз.");
      })
      .finally(() => {
        setIsLoginConfirmed(true);
        setIsLoading(false);
      });
  }

  function onSignOut() {
    localStorage.removeItem("jwt");
    setUserEmail("");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header userEmail={userEmail} signOut={onSignOut} isLogged={isLogged} />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute
              element={Main}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              cards={cards}
              isLogged={isLogged}
            />
          }
        />
        <Route
          path="*"
          element={isLogged ? (<Navigate to="/" />) : (<Navigate to="/sign-up" replace />)}
        />

        <Route
          path="/sign-up"
          element={
            <Register
              formName={"sign-up"}
              title={"Регистрация"}
              buttonName={"Зарегистрироваться"}
              onSubmit={handleRegister}
              isLoading={isLoading} />
          }
        />

        <Route
          path="/sign-in"
          element={
            <Login
              formName={"sign-in"}
              title={"Вход"}
              buttonName={"Войти"}
              onSubmit={handleLogin}
              isLoading={isLoading} />
          }
        />
      </Routes>
      <InfoTooltip
        isOpen={isLoginConfirmed}
        name={'confirmation'}
        onClose={closeAllPopups}
        text={text}
        isRegistered={isRegistered} />
      <Footer />
      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
        isLoading={isLoading} />
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
        isLoading={isLoading} />
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
        isLoading={isLoading} />
      <ImagePopup
        card={selectedCard}
        isOpen={isImagePopupOpen}
        onClose={closeAllPopups} />
    </CurrentUserContext.Provider>
  );
};

export default App;
