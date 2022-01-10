! function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.vueYandexMaps = t()
}(this, function() {
    "use strict";
    var e = {
            render: function() {
                var e = this,
                    t = e.$createElement,
                    r = e._self._c || t;
                return r("section", {
                    staticClass: "ymap-container"
                }, [r("div", {
                    style: {
                        width: "100%",
                        height: "100%"
                    },
                    attrs: {
                        id: e.ymapId
                    }
                }), e._t("default")], 2)
            },
            staticRenderFns: [],
            data: function() {
                return {
                    ymapId: "yandexMap" + Math.round(1e5 * Math.random())
                }
            },
            props: {
                coords: {
                    type: Array,
                    validator: function(e) {
                        return !e.filter(function(e) {
                            return isNaN(e)
                        }).length
                    },
                    required: !0
                },
                zoom: {
                    validator: function(e) {
                        return !isNaN(e)
                    },
                    default: 18
                }
            },
            computed: {
                coordinates: function() {
                    return this.coords.map(function(e) {
                        return +e
                    })
                }
            },
            beforeCreate: function() {
                var e = this;
                if (!this.$ymapEventBus.scriptIsNotAttached) return !1;
                var t = document.createElement("SCRIPT");
                t.setAttribute("src", "https://api-maps.yandex.ru/2.1/?apikey=2950fc82-fd32-4f18-961c-f1cfc9a6cf1f&lang=ru_RU"), t.setAttribute("async", ""), t.setAttribute("defer", ""), document.body.appendChild(t), this.$ymapEventBus.scriptIsNotAttached = !1, t.onload = function() {
                    e.$ymapEventBus.ymapReady = !0, e.$ymapEventBus.$emit("scriptIsLoaded")
                }
            },
            created: function() {
                var e = this;
                window.addEventListener("DOMContentLoaded", function() {
                    function t() {
                        a = new ymaps.Map(this.ymapId, {
                            center: this.coordinates,
                            zoom: +this.zoom
                        });
                        for (var e = this.$slots.default.map(function(e) {
                                var t = e.componentOptions && e.componentOptions.propsData;
                                if (t) return {
                                    markerType: t.markerType,
                                    coords: o(t.coords),
                                    hintContent: t.hintContent,
                                    icon: t.icon,
                                    balloon: t.balloon,
                                    markerStroke: t.markerStroke,
                                    markerFill: t.markerFill,
                                    circleRadius: +t.circleRadius
                                }
                            }).filter(function(e) {
                                return e && e.markerType
                            }), t = 0; t < e.length; t++) {
                            var i = n(e[t].markerType),
                                c = {
                                    hintContent: e[t].hintContent,
                                    balloonContentHeader: e[t].balloon && e[t].balloon.header,
                                    balloonContentBody: e[t].balloon && e[t].balloon.body,
                                    balloonContentFooter: e[t].balloon && e[t].balloon.footer,
                                    iconContent: e[t].icon && e[t].icon.content
                                },
                                s = {
                                    preset: e[t].icon && "islands#" + r(e[t]) + "Icon",
                                    strokeColor: e[t].markerStroke && e[t].markerStroke.color || "0066ffff",
                                    strokeOpacity: e[t].markerStroke && e[t].markerStroke.opacity || 1,
                                    strokeStyle: e[t].markerStroke && e[t].markerStroke.style,
                                    strokeWidth: e[t].markerStroke && e[t].markerStroke.width || 1,
                                    fill: e[t].markerFill && e[t].markerFill.enabled || !0,
                                    fillColor: e[t].markerFill && e[t].markerFill.color || "0066ff99",
                                    fillOpacity: e[t].markerFill && e[t].markerFill.opacity || 1
                                };
                            "Circle" === i && (e[t].coords = [e[t].coords, e[t].circleRadius]);
                            var l = new ymaps[i](e[t].coords, c, s);
                            a.geoObjects.add(l)
                        }
                    }

                    function r(e) {
                        var t, r = e.icon.color || "blue";
                        return t = e.icon.glyph ? n(e.icon.glyph) : e.icon.content ? "Stretchy" : "", r + t
                    }

                    function n(e) {
                        return e.charAt(0).toUpperCase() + e.slice(1)
                    }

                    function o(e) {
                        return e.map(function(e) {
                            return Array.isArray(e) ? o(e) : +e
                        })
                    }
                    var a;
                    e.$ymapEventBus.ymapReady ? ymaps.ready(t.bind(e)) : e.$ymapEventBus.$on("scriptIsLoaded", function() {
                        ymaps.ready(t.bind(e))
                    })
                })
            }
        },
        t = {
            props: {
                coords: {
                    type: Array,
                    required: !0
                },
                hintContent: String,
                icon: Object,
                balloon: Object,
                markerType: {
                    type: String,
                    required: !0
                },
                markerFill: Object,
                markerStroke: Object,
                circleRadius: {
                    validator: function(e) {
                        return !isNaN(e)
                    },
                    default: 1e3
                }
            },
            render: function() {}
        },
        r = function(r) {
            r.component("yandex-map", e), r.component("ymap-marker", t), r.prototype.$ymapEventBus = new r({
                data: {
                    ymapReady: !1,
                    scriptIsNotAttached: !0
                }
            })
        };
    return window.Vue && (window.YMapPlugin = e, Vue.use(r)), e.install = r, e
});