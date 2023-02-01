import icons from "url:../../img/icons.svg";

export default class View {

  _data;

  /**
   * Rebder the received object to the DOM
   * @param {Object | Object[]} data the data to be rendered
   * @param {boolean} [render=true] IF false, create markup string instead of rendering to the DOM 
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Bardocz Daniels 
   * @todo Finish the implementation
   */


  render(data, render = true) {

    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  };


  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {

      const curEl = curElements[i];

      // console.log(curEl, newEl.isEqualNode(curEl));

      //Update changed Text
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = newEl.textContent;
      }

      //Update changed Atributes

      if (!newEl.isEqualNode(curEl)) {

        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value))


      }

    })


    // console.log(newElements);
    // console.log(curElements);

  }


  renderSpinner() {

    const markup = `
  <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div div class="error" >
       <div>
         <svg>
           <use href="${icons}#icon-alert-triangle"></use>
         </svg>
       </div>
     <p>${message}</p>
    </div >`

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }


  renderMessage(message = this._message) {
    const markup = `
    <div div class="message" >
       <div>
         <svg>
           <use href="${icons}#icon-smile"></use>
          </svg>
      </div>
      <p>${message}</p>
    </div >`

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _generateMarkupIngredient(ing) {

    return ` <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}//#region icon-check"></use>
              </svg>
              <div class="recipe__quantity">${ing.quantity ? ing.quantity : ''}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing.unit}</span>
                ${ing.description}
              </div>
            </li>`
  }
}

