<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <transition name="modal">
        <div class="modal modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">

                    <div class="modal-header">
                        <slot name="header">
                            <h3>Выберите вашу клинику</h3>
                        </slot>
                    </div>

                    <div class="modal-body">
                        <span v-cloak="" class="modal__list">
                            <div class="modal__clinic" v-on:click="$emit('clinik-select', item.tid)" v-for="item in all_clinics">
                                <span class="modal__listName" v-html="item.name"></span>
                                <span class="modal__minAdress" v-html="item.field_adres"></span>
                                <span class="modal__phone" v-html="item.field_phones"></span>
                            </div>
                        </span>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer">
                            <button class="modal__close" v-on:click="$emit('current-select')">
                                Закрыть
                            </button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    module.exports = {
        props: ['all_clinics', 'current_clinic'],
        data: function () {
            return {
            }
        }
    }
</script>


