!(function(e) {
    "function" == typeof define && define.amd ?
        define(["jquery", "./core"], e) :
        e(jQuery);
})(function(o) {
    return o.widget("ui.accordion", {
        version: "1.12.1",
        options: {
            active: 0,
            animate: {},
            classes: {
                "ui-accordion-header": "ui-corner-top",
                "ui-accordion-header-collapsed": "ui-corner-all",
                "ui-accordion-content": "ui-corner-bottom",
            },
            collapsible: !1,
            event: "click",
            header: "> li > :first-child, > :not(li):even",
            heightStyle: "auto",
            icons: {
                activeHeader: "ui-icon-triangle-1-s",
                header: "ui-icon-triangle-1-e",
            },
            activate: null,
            beforeActivate: null,
        },
        hideProps: {
            borderTopWidth: "hide",
            borderBottomWidth: "hide",
            paddingTop: "hide",
            paddingBottom: "hide",
            height: "hide",
        },
        showProps: {
            borderTopWidth: "show",
            borderBottomWidth: "show",
            paddingTop: "show",
            paddingBottom: "show",
            height: "show",
        },
        _create: function() {
            var e = this.options;
            (this.prevShow = this.prevHide = o()),
            this._addClass("ui-accordion", "ui-widget ui-helper-reset"),
                this.element.attr("role", "tablist"),
                e.collapsible ||
                (!1 !== e.active && null != e.active) ||
                (e.active = 0),
                this._processPanels(),
                e.active < 0 && (e.active += this.headers.length),
                this._refresh();
        },
        _getCreateEventData: function() {
            return {
                header: this.active,
                panel: this.active.length ? this.active.next() : o(),
            };
        },
        _createIcons: function() {
            var e,
                t = this.options.icons;
            t &&
                ((e = o("<span>")),
                    this._addClass(e, "ui-accordion-header-icon", "ui-icon " + t.header),
                    e.prependTo(this.headers),
                    (e = this.active.children(".ui-accordion-header-icon")),
                    this._removeClass(e, t.header)
                    ._addClass(e, null, t.activeHeader)
                    ._addClass(this.headers, "ui-accordion-icons"));
        },
        _destroyIcons: function() {
            this._removeClass(this.headers, "ui-accordion-icons"),
                this.headers.children(".ui-accordion-header-icon").remove();
        },
        _destroy: function() {
            var e;
            this.element.removeAttr("role"),
                this.headers
                .removeAttr("role aria-expanded aria-selected aria-controls tabIndex")
                .removeUniqueId(),
                this._destroyIcons(),
                (e = this.headers
                    .next()
                    .css("display", "")
                    .removeAttr("role aria-hidden aria-labelledby")
                    .removeUniqueId()),
                "content" !== this.options.heightStyle && e.css("height", "");
        },
        _setOption: function(e, t) {
            "active" !== e
                ?
                ("event" === e &&
                    (this.options.event && this._off(this.headers, this.options.event),
                        this._setupEvents(t)),
                    this._super(e, t),
                    "collapsible" !== e ||
                    t ||
                    !1 !== this.options.active ||
                    this._activate(0),
                    "icons" === e && (this._destroyIcons(), t && this._createIcons())) :
                this._activate(t);
        },
        _setOptionDisabled: function(e) {
            this._super(e),
                this.element.attr("aria-disabled", e),
                this._toggleClass(null, "ui-state-disabled", !!e),
                this._toggleClass(
                    this.headers.add(this.headers.next()),
                    null,
                    "ui-state-disabled", !!e
                );
        },
        _keydown: function(e) {
            if (!e.altKey && !e.ctrlKey) {
                var t = o.ui.keyCode,
                    i = this.headers.length,
                    a = this.headers.index(e.target),
                    s = !1;
                switch (e.keyCode) {
                    case t.RIGHT:
                    case t.DOWN:
                        s = this.headers[(a + 1) % i];
                        break;
                    case t.LEFT:
                    case t.UP:
                        s = this.headers[(a - 1 + i) % i];
                        break;
                    case t.SPACE:
                    case t.ENTER:
                        this._eventHandler(e);
                        break;
                    case t.HOME:
                        s = this.headers[0];
                        break;
                    case t.END:
                        s = this.headers[i - 1];
                }
                s &&
                    (o(e.target).attr("tabIndex", -1),
                        o(s).attr("tabIndex", 0),
                        o(s).trigger("focus"),
                        e.preventDefault());
            }
        },
        _panelKeyDown: function(e) {
            e.keyCode === o.ui.keyCode.UP &&
                e.ctrlKey &&
                o(e.currentTarget).prev().trigger("focus");
        },
        refresh: function() {
            var e = this.options;
            this._processPanels(),
                (!1 === e.active && !0 === e.collapsible) || !this.headers.length ?
                ((e.active = !1), (this.active = o())) :
                !1 === e.active ?
                this._activate(0) :
                this.active.length && !o.contains(this.element[0], this.active[0]) ?
                this.headers.length ===
                this.headers.find(".ui-state-disabled").length ?
                ((e.active = !1), (this.active = o())) :
                this._activate(Math.max(0, e.active - 1)) :
                (e.active = this.headers.index(this.active)),
                this._destroyIcons(),
                this._refresh();
        },
        _processPanels: function() {
            var e = this.headers,
                t = this.panels;
            (this.headers = this.element.find(this.options.header)),
            this._addClass(
                    this.headers,
                    "ui-accordion-header ui-accordion-header-collapsed",
                    "ui-state-default"
                ),
                (this.panels = this.headers
                    .next()
                    .filter(":not(.ui-accordion-content-active)")
                    .hide()),
                this._addClass(
                    this.panels,
                    "ui-accordion-content",
                    "ui-helper-reset ui-widget-content"
                ),
                t && (this._off(e.not(this.headers)), this._off(t.not(this.panels)));
        },
        _refresh: function() {
            var i,
                e = this.options,
                t = e.heightStyle,
                a = this.element.parent();
            (this.active = this._findActive(e.active)),
            this._addClass(
                    this.active,
                    "ui-accordion-header-active",
                    "ui-state-active"
                )._removeClass(this.active, "ui-accordion-header-collapsed"),
                this._addClass(this.active.next(), "ui-accordion-content-active"),
                this.active.next().show(),
                this.headers
                .attr("role", "tab")
                .each(function() {
                    var e = o(this),
                        t = e.uniqueId().attr("id"),
                        i = e.next(),
                        a = i.uniqueId().attr("id");
                    e.attr("aria-controls", a), i.attr("aria-labelledby", t);
                })
                .next()
                .attr("role", "tabpanel"),
                this.headers
                .not(this.active)
                .attr({
                    "aria-selected": "false",
                    "aria-expanded": "false",
                    tabIndex: -1,
                })
                .next()
                .attr({ "aria-hidden": "true" })
                .hide(),
                this.active.length ?
                this.active
                .attr({
                    "aria-selected": "true",
                    "aria-expanded": "true",
                    tabIndex: 0,
                })
                .next()
                .attr({ "aria-hidden": "false" }) :
                this.headers.eq(0).attr("tabIndex", 0),
                this._createIcons(),
                this._setupEvents(e.event),
                "fill" === t ?
                ((i = a.height()),
                    this.element.siblings(":visible").each(function() {
                        var e = o(this),
                            t = e.css("position");
                        "absolute" !== t && "fixed" !== t && (i -= e.outerHeight(!0));
                    }),
                    this.headers.each(function() {
                        i -= o(this).outerHeight(!0);
                    }),
                    this.headers
                    .next()
                    .each(function() {
                        o(this).height(
                            Math.max(0, i - o(this).innerHeight() + o(this).height())
                        );
                    })
                    .css("overflow", "auto")) :
                "auto" === t &&
                ((i = 0),
                    this.headers
                    .next()
                    .each(function() {
                        var e = o(this).is(":visible");
                        e || o(this).show(),
                            (i = Math.max(i, o(this).css("height", "").height())),
                            e || o(this).hide();
                    })
                    .height(i));
        },
        _activate: function(e) {
            e = this._findActive(e)[0];
            e !== this.active[0] &&
                ((e = e || this.active[0]),
                    this._eventHandler({
                        target: e,
                        currentTarget: e,
                        preventDefault: o.noop,
                    }));
        },
        _findActive: function(e) {
            return "number" == typeof e ? this.headers.eq(e) : o();
        },
        _setupEvents: function(e) {
            var i = { keydown: "_keydown" };
            e &&
                o.each(e.split(" "), function(e, t) {
                    i[t] = "_eventHandler";
                }),
                this._off(this.headers.add(this.headers.next())),
                this._on(this.headers, i),
                this._on(this.headers.next(), { keydown: "_panelKeyDown" }),
                this._hoverable(this.headers),
                this._focusable(this.headers);
        },
        _eventHandler: function(e) {
            var t = this.options,
                i = this.active,
                a = o(e.currentTarget),
                s = a[0] === i[0],
                n = s && t.collapsible,
                h = n ? o() : a.next(),
                r = i.next(),
                h = { oldHeader: i, oldPanel: r, newHeader: n ? o() : a, newPanel: h };
            e.preventDefault(),
                (s && !t.collapsible) ||
                !1 === this._trigger("beforeActivate", e, h) ||
                ((t.active = !n && this.headers.index(a)),
                    (this.active = s ? o() : a),
                    this._toggle(h),
                    this._removeClass(i, "ui-accordion-header-active", "ui-state-active"),
                    t.icons &&
                    ((i = i.children(".ui-accordion-header-icon")),
                        this._removeClass(i, null, t.icons.activeHeader)._addClass(
                            i,
                            null,
                            t.icons.header
                        )),
                    s ||
                    (this._removeClass(a, "ui-accordion-header-collapsed")._addClass(
                            a,
                            "ui-accordion-header-active",
                            "ui-state-active"
                        ),
                        t.icons &&
                        ((s = a.children(".ui-accordion-header-icon")),
                            this._removeClass(s, null, t.icons.header)._addClass(
                                s,
                                null,
                                t.icons.activeHeader
                            )),
                        this._addClass(a.next(), "ui-accordion-content-active")));
        },
        _toggle: function(e) {
            var t = e.newPanel,
                i = this.prevShow.length ? this.prevShow : e.oldPanel;
            this.prevShow.add(this.prevHide).stop(!0, !0),
                (this.prevShow = t),
                (this.prevHide = i),
                this.options.animate ?
                this._animate(t, i, e) :
                (i.hide(), t.show(), this._toggleComplete(e)),
                i.attr({ "aria-hidden": "true" }),
                i.prev().attr({ "aria-selected": "false", "aria-expanded": "false" }),
                t.length && i.length ?
                i.prev().attr({ tabIndex: -1, "aria-expanded": "false" }) :
                t.length &&
                this.headers
                .filter(function() {
                    return 0 === parseInt(o(this).attr("tabIndex"), 10);
                })
                .attr("tabIndex", -1),
                t
                .attr("aria-hidden", "false")
                .prev()
                .attr({
                    "aria-selected": "true",
                    "aria-expanded": "true",
                    tabIndex: 0,
                });
        },
        _animate: function(e, i, t) {
            var a,
                s,
                n,
                h = this,
                r = 0,
                o = e.css("box-sizing"),
                d = e.length && (!i.length || e.index() < i.index()),
                c = this.options.animate || {},
                l = (d && c.down) || c,
                d = function() {
                    h._toggleComplete(t);
                };
            return (
                (s = (s = "string" == typeof l ? l : s) || l.easing || c.easing),
                (n = (n = "number" == typeof l ? l : n) || l.duration || c.duration),
                i.length ?
                e.length ?
                ((a = e.show().outerHeight()),
                    i.animate(this.hideProps, {
                        duration: n,
                        easing: s,
                        step: function(e, t) {
                            t.now = Math.round(e);
                        },
                    }),
                    void e.hide().animate(this.showProps, {
                        duration: n,
                        easing: s,
                        complete: d,
                        step: function(e, t) {
                            (t.now = Math.round(e)),
                            "height" !== t.prop ?
                                "content-box" === o && (r += t.now) :
                                "content" !== h.options.heightStyle &&
                                ((t.now = Math.round(a - i.outerHeight() - r)),
                                    (r = 0));
                        },
                    })) :
                i.animate(this.hideProps, n, s, d) :
                e.animate(this.showProps, n, s, d)
            );
        },
        _toggleComplete: function(e) {
            var t = e.oldPanel,
                i = t.prev();
            this._removeClass(t, "ui-accordion-content-active"),
                this._removeClass(i, "ui-accordion-header-active")._addClass(
                    i,
                    "ui-accordion-header-collapsed"
                ),
                t.length && (t.parent()[0].className = t.parent()[0].className),
                this._trigger("activate", null, e);
        },
    });
});