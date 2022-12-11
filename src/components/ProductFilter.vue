<template>
  <form class="filter__form form" action="#" method="get" @submit.prevent="submit">
    <fieldset class="form__block">
      <legend class="form__legend">Цена</legend>
      <label class="form__label form__label--price">
        <input class="form__input" type="text" name="min-price" v-model.number="currentPriceFrom">
        <span class="form__value">От</span>
      </label>
      <label class="form__label form__label--price">
        <input class="form__input" type="text" name="max-price" v-model.number="currentPriceTo">
        <span class="form__value">До</span>
      </label>
    </fieldset>

    <fieldset class="form__block">
      <legend class="form__legend">Категория</legend>
      <label class="form__label form__label--select">
        <select class="form__select" type="text" name="category" v-model.number="currentCategoryId">
          <option value="0">Все категории</option>
          <option :value="category.id"
                  v-for="category in categories"
                  :key="category.id"
          >
            {{ category.title }}
          </option>
        </select>
      </label>
    </fieldset>

    <fieldset class="form__block">
      <legend class="form__legend">Материал</legend>
      <ul class="check-list">
        <li class="check-list__item"
            v-for="material in materials"
            :key="material.id"
        >
          <label class="check-list__label">
            <input class="check-list__check sr-only" type="checkbox" name="material"
                   :value="material.id"
                   v-model="currentMaterialIds"
            >


            <span class="check-list__desc">
                    {{ material.title }}
                    <span>({{ material.productsCount }})</span>
            </span>
          </label>
        </li>
      </ul>
    </fieldset>

    <fieldset class="form__block">
      <legend class="form__legend">Коллекция</legend>
      <ul class="check-list">
        <li class="check-list__item"
            v-for="season in seasons"
            :key="season.id"
        >
          <label class="check-list__label">
            <input class="check-list__check sr-only" type="checkbox" name="collection"
                   :value="season.id"
                   v-model="currentSeasonIds"

            >
            <span class="check-list__desc">
                    {{ season.title }}
                    <span>({{ season.productsCount }})</span>
                  </span>
          </label>
        </li>
      </ul>
    </fieldset>

    <button class="filter__submit button button--primery" type="submit" >
      Применить
    </button>
    <button class="filter__reset button button--second" type="button" @click.prevent = "reset" v-if="showResetBtn">
      Сбросить
    </button>
  </form>
</template>

<script>
import axios from "axios";

export default {
  props: ['priceFrom', 'priceTo', 'categoryId', 'materialIds', 'seasonIds'],
  data() {
    return {
      currentPriceFrom: 0,
      currentPriceTo: 0,
      currentCategoryId: 0,
      currentMaterialIds: [],
      currentSeasonIds: [],

      categoriesData: null,
      materialsData: null,
      seasonsData: null
    }
  },
  computed: {
    categories() {
      return this.categoriesData ? this.categoriesData.items : [];
    },
    materials() {
      return this.materialsData ? this.materialsData.items.map(material => {
        return material;
      }) : [];
    },
    seasons() {
      return this.seasonsData ? this.seasonsData.items.map(season => {
        return season;
      }) : [];
    },
    showResetBtn() {
      return this.priceFrom !== 0 || this.priceTo !== 0 || this.categoryId !== 0 || this.materialIds.length || this.seasonIds.length
    }
  },
  watch: {
    priceFrom(value) {
      this.currentPriceFrom = value;
    },
    priceTo(value) {
      this.currentPriceTo = value;
    },
    categoryId(value) {
      this.currentCategoryId = value;
    },
    materialIds(value){
      this.currentMaterialIds = value;
    },
    seasonIds(value){
      this.currentSeasonIds = value;
    }
  },
  methods: {
    submit(){
      this.$emit('update:priceFrom', this.currentPriceFrom);
      this.$emit('update:priceTo', this.currentPriceTo);
      this.$emit('update:categoryId', this.currentCategoryId);
      this.$emit('update:materialIds', this.currentMaterialIds);
      this.$emit('update:seasonIds', this.currentSeasonIds);
    },
    reset(){
      this.$emit('update:priceFrom', 0);
      this.$emit('update:priceTo', 0);
      this.$emit('update:categoryId', 0);
      this.$emit('update:materialIds', []);
      this.$emit('update:seasonIds', []);
    },

    loadCategories () {
      axios.get(`https://vue-moire.skillbox.cc/api/productCategories`)
        .then(response => this.categoriesData = response.data);
    },
    loadMaterials () {
      axios.get(`https://vue-moire.skillbox.cc/api/materials`)
          .then(response => this.materialsData = response.data);
    },
    loadSeasons () {
      axios.get(`https://vue-moire.skillbox.cc/api/seasons`)
          .then(response => this.seasonsData = response.data);
    }
  },
  created() {
    this.loadCategories();
    this.loadMaterials();
    this.loadSeasons();
  }
}
</script>
