/**
 * Copyright (c) 2019 Hiago S. Andrade <dev.hisan@gmail.com>
 *
 * This is a part of Open Library.
 */

import axios from "axios";
import _ from "lodash";

/**
 * Método de requisição ou consumo de páginas usando AJAX.
 * @param {String} url Link para fazer a requisição.
 * @param {Object} data 'Corpo' ou conteúdo, no caso de método 'post' ou 'put'.
 * @param {String} method Verbo de requisição: 'get', 'post', 'put', 'delete'.
 * @param {String} index Query ou subdiretórios como 'id' de um contéudo em específico.
 * @returns {Promise} Resposta da Promise.
 */
export function ajax(url, data, method = "get", index = "") {
  return new Promise((resolve, reject) => {
    axios[method](url + index, data)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        const message = err.response.data.message || err.message;
        reject(message);
      });
  });
}

/**
 * Verifica se há dados da sessão armazenados em 'localStorage'.
 */
export function hasCookies() {
  const token = window.localStorage.getItem("accessToken") || null;
  const user = window.localStorage.getItem("loggedUser") || null;

  return !_.isEmpty(token || user);
}

/**
 * Obtém os dados da sessão armazenadas em 'localStorage'.
 * @returns {Object} Objeto contendo os dados 'token' e 'usuário'.
 */
export function getCookies() {
  const token = JSON.parse(window.localStorage.getItem("accessToken"));
  const user = JSON.parse(window.localStorage.getItem("loggedUser"));

  return { token, user };
}

/**
 * Armazena dados da sessão em 'localStorage'.
 * @param {Object} param0 Objeto contendo 'token' e 'user'.
 */
export function setCookies({ accessToken, loggedUser }) {
  const token = JSON.stringify(accessToken.token);
  const type = accessToken.type;
  const expires = accessToken.expires;
  const user = JSON.stringify(loggedUser);

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  window.localStorage.setItem("accessToken", token);
  window.localStorage.setItem("tokenType", type);
  window.localStorage.setItem("expiresIn", expires);
  window.localStorage.setItem("loggedUser", user);
}

export function removeCookies() {
  window.localStorage.removeItem("accessToken");
  window.localStorage.removeItem("loggedUser");

  axios.defaults.headers.common["Authorization"] = null;
}