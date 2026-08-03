//#region \0@oxc-project+runtime@0.127.0/helpers/checkPrivateRedeclaration.js
function e(e, t) {
	if (t.has(e)) throw TypeError("Cannot initialize the same private elements twice on an object");
}
//#endregion
//#region \0@oxc-project+runtime@0.127.0/helpers/classPrivateMethodInitSpec.js
function t(t, n) {
	e(t, n), n.add(t);
}
//#endregion
//#region \0@oxc-project+runtime@0.127.0/helpers/classPrivateFieldInitSpec.js
function n(t, n, r) {
	e(t, n), n.set(t, r);
}
//#endregion
//#region \0@oxc-project+runtime@0.127.0/helpers/typeof.js
function r(e) {
	"@babel/helpers - typeof";
	return r = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, r(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.127.0/helpers/toPrimitive.js
function i(e, t) {
	if (r(e) != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var i = n.call(e, t || "default");
		if (r(i) != "object") return i;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.127.0/helpers/toPropertyKey.js
function a(e) {
	var t = i(e, "string");
	return r(t) == "symbol" ? t : t + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.127.0/helpers/defineProperty.js
function o(e, t, n) {
	return (t = a(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
//#endregion
//#region \0@oxc-project+runtime@0.127.0/helpers/assertClassBrand.js
function s(e, t, n) {
	if (typeof e == "function" ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
	throw TypeError("Private element is not present on this object");
}
//#endregion
//#region \0@oxc-project+runtime@0.127.0/helpers/classPrivateFieldSet2.js
function c(e, t, n) {
	return e.set(s(e, t), n), n;
}
//#endregion
//#region \0@oxc-project+runtime@0.127.0/helpers/classPrivateFieldGet2.js
function l(e, t) {
	return e.get(s(e, t));
}
//#endregion
//#region ../../shared/players/common/facade.ts
var u = /* @__PURE__ */ new WeakMap(), d = /* @__PURE__ */ new WeakMap(), f = /* @__PURE__ */ new WeakMap(), p = /* @__PURE__ */ new WeakSet(), ee = class {
	constructor(e, r, i) {
		t(this, p), n(this, u, void 0), n(this, d, void 0), n(this, f, !1), o(this, "id", void 0), o(this, "play", void 0), o(this, "pause", void 0), o(this, "stop", void 0), o(this, "on", void 0), o(this, "destroy", void 0), c(u, this, e), c(d, this, i), this.id = r, this.play = () => {
			s(p, this, m).call(this, "play"), l(u, this).play();
		}, this.pause = () => {
			s(p, this, m).call(this, "pause"), l(u, this).pause();
		}, this.stop = () => {
			s(p, this, m).call(this, "stop"), l(u, this).stop();
		}, this.on = (e, t) => {
			s(p, this, m).call(this, "on");
			let n = l(u, this).on(e, t);
			return () => {
				l(f, this) || n();
			};
		}, this.destroy = () => {
			if (!l(f, this)) {
				c(f, this, !0);
				try {
					l(u, this).destroy();
				} finally {
					l(d, this)?.call(this);
				}
			}
		};
	}
	get type() {
		return l(u, this).type;
	}
};
function m(e) {
	if (l(f, this)) throw Error(`[VideoPlayerFacade] Cannot call "${e}" on a destroyed player.`);
}
//#endregion
//#region ../../node_modules/.pnpm/@fandom+odyssey-tracking-client@1.0.2/node_modules/@fandom/odyssey-tracking-client/dist/index.js
var te = () => {
	let e = window.fandomTrack ?? {
		q: [],
		cmd: [],
		registry: {}
	};
	return window.fandomTrack = e, e;
}, ne = "shortlivedtrackingevent", re = "trackingevent", ie = (e, t = {}, n = { requiresConsent: !0 }) => {
	if (e === ne) throw Error("shortlivedtrackingevent cannot be re-registered via buildBasicTrackingFunction, use buildShortlivedTrackingFunction instead.");
	if (e === re) throw Error("trackingevent usage is discouraged, use shortlived or register your own custom event type in event catalog.");
	return (r) => {
		let i = te();
		i.registry[e] || i.cmd.push((t) => {
			if (typeof t.createAndRegisterBasicTracker != "function") throw Error("fandomTrack.createAndRegisterBasicTracker is not available");
			t.createAndRegisterBasicTracker(e, n);
		}), i.q.push({
			event: e,
			payload: {
				...t,
				...r
			}
		});
	};
}, ae = 20, oe = [];
function h(e) {
	oe.push({
		action: e,
		ts: typeof performance < "u" ? performance.now() : -1
	}), oe.length > ae && oe.shift();
}
function se() {
	return oe.map((e) => `${Math.round(e.ts)}ms:${e.action}`).join(" → ");
}
//#endregion
//#region ../../shared/utils/src/issue-tracking.ts
var ce, le, ue = "morpheus_performance", de = { requiresConsent: !1 }, fe = {
	engine_version: "unknown",
	env: "unknown"
};
function pe(e) {
	fe = e;
}
var me, g = [], he, ge = 0, _e = 64, ve = 250, ye = 40;
function be(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return Array.isArray(t.q) && Array.isArray(t.cmd) && typeof t.registry == "object" && t.registry !== null;
}
function xe() {
	return typeof window < "u" && be(window.fandomTrack);
}
function Se(e) {
	me ?? (me = ie(ue, { category: "morpheus" }, de)), me(e);
}
function Ce() {
	if (g.length === 0) return;
	let e = g;
	g = [];
	for (let t of e) Se(t);
}
function we() {
	he || (he = setTimeout(() => {
		if (he = void 0, g.length !== 0) {
			if (xe() || ++ge >= ye) {
				try {
					Ce();
				} catch {}
				return;
			}
			we();
		}
	}, ve));
}
function _(e, t = {}) {
	try {
		if (t.error !== void 0 && De(t.error)) return;
		let n = t.error === void 0 ? void 0 : ke(t.error), r = t.error_type ?? n?.error_type, i = t.error_message ?? n?.error_message, a = {
			...fe,
			component: "video-engine",
			action: "issue",
			issue_code: e.code,
			constant_name: e.constantName,
			issue_priority: e.priority
		};
		if (t.label && (a.label = t.label), r && (a.error_type = r), i && (a.error_message = Oe(i, 500)), t.player_type && (a.player_type = t.player_type), t.player_mode && (a.player_mode = t.player_mode), t.exp_bucket && (a.exp_bucket = t.exp_bucket), t.experiment_groups && (a.experiment_groups = t.experiment_groups), e.code.startsWith("U")) {
			let e = se();
			e && (a.label = a.label ? `${a.label} | ${e}` : e);
		}
		xe() ? (Ce(), Se(a)) : (g.push(a), g.length > _e && g.shift(), we()), t.error !== void 0 && Ee(t.error);
	} catch {}
}
var Te = (ce = globalThis)[le = Symbol.for("morpheus.reportedErrors")] ?? (ce[le] = /* @__PURE__ */ new WeakSet());
function Ee(e) {
	e instanceof Error && Te.add(e);
}
function De(e) {
	return e instanceof Error && Te.has(e);
}
function Oe(e, t) {
	return e.length > t ? e.slice(0, t) : e;
}
function ke(e) {
	return e instanceof Error ? {
		error_type: e.constructor.name || "Error",
		error_message: e.message
	} : {
		error_type: "NonError",
		error_message: String(e)
	};
}
var Ae = { get: (e) => {
	let t = ("; " + document.cookie).split("; " + e + "=");
	return t.length >= 2 ? t.pop().split(";").shift() : null;
} };
//#endregion
//#region ../../shared/utils/src/experiments.ts
function je(e, t) {
	let n = e.featureFlags?.get("icExperiments");
	return n ? n.includes(t) : !1;
}
var Me = /^(?:v\d+-)?(\d{2})$/;
function Ne() {
	return Ae.get("exp_bucket")?.match(Me)?.[1] ?? "";
}
function Pe() {
	let e = globalThis.googletag?.pubads?.()?.getTargeting?.("experiment_groups");
	return Array.isArray(e) ? e.join(",") : "";
}
//#endregion
//#region ../../packages/contracts/src/issue-codes.ts
var v = /* @__PURE__ */ function(e) {
	return e.P1 = "P1", e.P2 = "P2", e.P3 = "P3", e.P4 = "P4", e;
}({}), Fe = {
	code: "E001",
	constantName: "EngineBootstrapFailed",
	priority: v.P1,
	description: "Fatal error during engine bootstrap; runtime never initialized"
}, y = {
	code: "E002",
	constantName: "PluginHookExecutionFailed",
	priority: v.P2,
	description: "A plugin hook threw; isolated so other plugins continue"
}, Ie = {
	code: "E003",
	constantName: "PlayerFactoryAttachConfigFailed",
	priority: v.P2,
	description: "factory.attachConfig() threw during factory registration"
}, Le = {
	code: "E004",
	constantName: "PlayerCreateFailed",
	priority: v.P2,
	description: "Player instance could not be created from the queued command"
}, Re = {
	code: "E005",
	constantName: "ConfigInitializationFailed",
	priority: v.P2,
	description: "window.__morpheusConfig missing/invalid; engine cannot configure"
}, ze = {
	code: "E006",
	constantName: "InstantConfigFetchFailed",
	priority: v.P3,
	description: "Instant Config (ICBM) flags could not be fetched"
}, Be = {
	code: "E007",
	constantName: "TrackingFlushFailed",
	priority: v.P4,
	description: "FTL enqueue/flush threw while reporting telemetry"
}, b = {
	code: "E101",
	constantName: "PlayerScriptLoadFailed",
	priority: v.P2,
	description: "Vendor SDK/script/bundle failed to inject/load"
}, Ve = {
	code: "E102",
	constantName: "PlayerSetupFailed",
	priority: v.P2,
	description: "Adapter setup() / vendor init threw or rejected"
}, He = {
	code: "E103",
	constantName: "PlayerMountFailed",
	priority: v.P2,
	description: "Target container missing / DOM attach failed"
}, x = {
	code: "E104",
	constantName: "PlayerReadyTimeout",
	priority: v.P3,
	description: "Player never signaled ready within budget"
}, Ue = {
	code: "E105",
	constantName: "PlayerMediaLoadError",
	priority: v.P2,
	description: "Vendor media/network error (manifest 404, CORS, source unreachable)"
}, We = {
	code: "E106",
	constantName: "PlayerPlaybackFatalError",
	priority: v.P2,
	description: "Vendor fatal playback error (decode, unrecoverable buffer/DRM)"
}, S = {
	code: "E107",
	constantName: "PlayerDestroyFailed",
	priority: v.P3,
	description: "Teardown threw (facade isolates, still reported)"
}, Ge = {
	code: "E108",
	constantName: "AdCustomElementNotDefined",
	priority: v.P3,
	description: "Custom element wait budget exceeded; element never defined"
}, Ke = {
	code: "D001",
	constantName: "FandomTrackQueueUnavailable",
	priority: v.P3,
	description: "window.fandomTrack never appeared after cold-start poll window; buffered events dropped"
}, qe = {
	code: "D002",
	constantName: "PluginWaitingTimeout",
	priority: v.P3,
	description: "onConfigLoaded plugin init exceeded timeout; bootstrap proceeded"
}, Je = {
	code: "D003",
	constantName: "PlayerFactoryNotRegistered",
	priority: v.P2,
	description: "Queue drain found no registered factory for requested player type"
}, Ye = {
	code: "D004",
	constantName: "InstantConfigLocalStorageError",
	priority: v.P3,
	description: "LocalStorage access error while reading/caching instant config"
}, Xe = {
	code: "D005",
	constantName: "PerfMarkMissing",
	priority: v.P4,
	description: "No matching start/render mark when measuring a perf duration"
}, C = {
	code: "D101",
	constantName: "PlayerMediaResolveMissing",
	priority: v.P3,
	description: "No mediaId / empty playlist / unresolved source; player skipped"
}, Ze = {
	code: "D102",
	constantName: "PlayerFormatUnsupported",
	priority: v.P3,
	description: "Codec/format/DRM unsupported in env; fallback/skip"
}, Qe = {
	code: "D103",
	constantName: "PlayerAutoplayBlocked",
	priority: v.P4,
	description: "Browser blocked autoplay; degraded to muted / click-to-play"
}, $e = {
	code: "D104",
	constantName: "PlayerRecoverableMediaError",
	priority: v.P4,
	description: "Vendor recoverable media error, auto-retried"
}, et = {
	code: "D201",
	constantName: "AdConsentTimeout",
	priority: v.P3,
	description: "Consent listener timed out; ad plugin degraded"
}, tt = {
	code: "D202",
	constantName: "AdSlotRequestRenderFailed",
	priority: v.P3,
	description: "requestRender failed for a slot; slot skipped"
}, nt = {
	code: "D204",
	constantName: "BucketExperimentUnknownGroup",
	priority: v.P4,
	description: "setExperimentGroup received unrecognized group; defaulted to control"
}, w = {
	code: "U001",
	constantName: "UnexpectedRuntimeError",
	priority: v.P2,
	description: "Uncaught error with no specific issue code; indicates a gap in error handling"
}, rt = {
	code: "U002",
	constantName: "UnhandledPromiseRejection",
	priority: v.P2,
	description: "Unhandled promise rejection originating from Morpheus code"
};
new Map([
	[Fe.code, Fe],
	[y.code, y],
	[Ie.code, Ie],
	[Le.code, Le],
	[Re.code, Re],
	[ze.code, ze],
	[Be.code, Be],
	[b.code, b],
	[Ve.code, Ve],
	[He.code, He],
	[x.code, x],
	[Ue.code, Ue],
	[We.code, We],
	[S.code, S],
	[Ge.code, Ge],
	[Ke.code, Ke],
	[qe.code, qe],
	[Je.code, Je],
	[Ye.code, Ye],
	[Xe.code, Xe],
	[C.code, C],
	[Ze.code, Ze],
	[Qe.code, Qe],
	[$e.code, $e],
	[et.code, et],
	[tt.code, tt],
	[nt.code, nt],
	[w.code, w],
	[rt.code, rt]
]);
var it = { requiresConsent: !1 }, at = {
	engine_version: "unknown",
	env: "unknown"
}, ot;
function st(e) {
	at = e;
}
function ct(e) {
	try {
		return e();
	} catch {
		return "";
	}
}
function lt() {
	if (ot) return ot;
	let e = {
		exp_bucket: ct(Ne),
		experiment_groups: ct(Pe)
	};
	return e.experiment_groups && (ot = e), e;
}
var ut, T = [], dt, ft = 0, pt = 64, mt = 250, ht = 40;
function gt(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return Array.isArray(t.q) && Array.isArray(t.cmd) && typeof t.registry == "object" && t.registry !== null;
}
function _t() {
	return typeof window < "u" && gt(window.fandomTrack);
}
function vt(e) {
	ut ?? (ut = ie("morpheus_performance", { category: "morpheus" }, it)), ut(e);
}
function yt() {
	if (T.length === 0) return;
	let e = T;
	T = [];
	for (let t of e) vt(t);
}
function bt() {
	dt || (dt = setTimeout(() => {
		if (dt = void 0, T.length !== 0) {
			if (_t() || ++ft >= ht) {
				_t() || _(Ke);
				try {
					yt();
				} catch (e) {
					_(Be, { error: e });
				}
				return;
			}
			bt();
		}
	}, mt));
}
function E(e) {
	try {
		let t = {
			...at,
			...lt(),
			...e
		};
		if (_t()) {
			yt(), vt(t);
			return;
		}
		T.push(t), T.length > pt && T.shift(), bt();
	} catch {}
}
function D() {
	return typeof performance < "u" ? performance.now() : NaN;
}
function O(e) {
	let t = D() - e;
	return Number.isFinite(t) && t >= 0 ? t : -1;
}
//#endregion
//#region ../../shared/utils/src/logger.ts
var xt = "morpheus_debug", k = !1;
function St(e) {
	k = e;
}
function Ct() {
	return k;
}
function wt(e = globalThis.location?.search ?? "") {
	let t = new URLSearchParams(e);
	if (!t.has("morpheus_debug")) return !1;
	let n = t.get(xt);
	return n !== "false" && n !== "0";
}
function A(e) {
	let t = `[${e}]`;
	return {
		log: (...e) => {
			k && console.log(t, ...e);
		},
		info: (...e) => {
			k && console.info(t, ...e);
		},
		debug: (...e) => {
			k && console.debug(t, ...e);
		},
		warn: (...e) => {
			console.warn(t, ...e);
		},
		error: (...e) => {
			console.error(t, ...e);
		}
	};
}
//#endregion
//#region runtime/run-hook.ts
var Tt = A("RunHook"), Et = [];
function j(e, t, ...n) {
	h(`hook:${t}`);
	let r = [], i = [];
	for (let a of e) {
		let e = a.hooks[t];
		if (typeof e != "function") continue;
		let o = (e) => {
			r.push(a.name), Tt.error(`Plugin "${a.name}" threw in hook "${t}":`, e), _(y, {
				label: `${a.name}:${t}`,
				error: e
			});
		}, s = Promise.resolve();
		try {
			s = Promise.resolve(e.call(a, ...n)).catch(o);
		} catch (e) {
			o(e);
		}
		i.push(s);
	}
	return Ct() && Ot(t, n, r, i), i;
}
async function Dt(e, t, ...n) {
	h(`hook:${t}`);
	let r = [];
	for (let i of e) {
		let e = i.hooks[t];
		if (typeof e == "function") try {
			await e.call(i, ...n);
		} catch (e) {
			r.push(i.name), Tt.error(`Plugin "${i.name}" threw in hook "${t}":`, e), _(y, {
				label: `${i.name}:${t}`,
				error: e
			});
		}
	}
	Ct() && Ot(t, n, r, []);
}
function Ot(e, t, n, r) {
	let i = {
		time: typeof performance < "u" ? performance.now() : -1,
		name: e,
		params: t,
		failures: n
	};
	Promise.allSettled(r).then(() => Et.push(i));
}
//#endregion
//#region runtime/create-runtime.ts
var M = "mve-player", kt = "v10";
function At(e, t = []) {
	let n = A("CreateRuntime"), r = [];
	for (let i of t) try {
		i.setConfig?.(e), i.setPlugins(t), r.push(i);
	} catch (e) {
		n.error(`Plugin "${i.name}" threw in setPlugins(), skipping:`, e), _(y, {
			label: `${i.name}:setPlugins`,
			error: e
		});
	}
	let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
	return {
		version: kt,
		config: e,
		getPlugin(e) {
			return r.find((t) => t.name === e);
		},
		getPlugins() {
			return [...r];
		},
		registerPlayerFactory(t) {
			h(`factory:register:${t.type}`), i.has(t.type) && n.warn(`Player factory "${t.type}" is already registered; overwriting.`);
			try {
				t.attachConfig?.(e);
			} catch (e) {
				n.error(`Player factory "${t.type}" threw in attachConfig():`, e), _(Ie, {
					player_type: t.type,
					error: e
				});
			}
			i.set(t.type, t);
		},
		async createPlayer(e, t, s) {
			h(`player:create:${e}`);
			let c = i.get(e);
			if (!c) throw _(Je, { player_type: e }), Error(`[Morpheus] No player factory registered for type "${e}"`);
			let l = D(), u = {
				type: e,
				container: t,
				options: s
			};
			await Dt(r, "onBeforePlayerCreate", u);
			let d;
			try {
				d = await c.create(t, u.options);
			} catch (t) {
				throw _(Le, {
					player_type: e,
					error: t
				}), t;
			}
			let f, p = {
				type: e,
				container: t
			}, m;
			try {
				m = jt(t, e, o, n), Mt(a, m);
			} catch (e) {
				throw d.destroy(), e;
			}
			return f = new ee(d, m, () => {
				h(`player:destroy:${e}`), t.classList.remove(M, `${M}--${e}`), a.get(m) === f && a.delete(m), Dt(r, "onAfterPlayerDestroy", p);
			}), a.set(m, f), E({
				component: "video-engine",
				action: "player-created",
				duration_ms: O(l),
				label: e
			}), t.classList.add(M, `${M}--${e}`), Dt(r, "onAfterPlayerCreate", {
				type: e,
				container: t,
				player: f
			}), f;
		},
		getPlayers() {
			return [...a.values()];
		},
		findPlayer(e) {
			return a.get(e);
		}
	};
}
function jt(e, t, n, r) {
	if (e.id) return e.id;
	let i = (n.get(t) ?? 0) + 1;
	n.set(t, i);
	let a = `${t}-${i}`;
	return r.warn(`Player container has no id; using fallback "${a}". Set container.id for stable, reusable player identifiers.`), a;
}
function Mt(e, t) {
	if (e.has(t)) throw Error(`[Morpheus] Duplicate player id "${t}": a player with this id is already tracked. Destroy the existing player before creating a new one with the same id.`);
}
function Nt(e, t) {
	let n = e;
	for (let [r, ...i] of t) {
		let t = n[r];
		typeof t == "function" && t.apply(e, i);
	}
}
//#endregion
//#region runtime/initialize-plugins.ts
var Pt = A("InitializePlugins");
function Ft(e, t) {
	return e.filter((e) => {
		try {
			return e.isEnabled(t);
		} catch (t) {
			return Pt.error(`Plugin "${e.name}" threw in isEnabled():`, t), _(w, {
				label: `${e.name}:isEnabled`,
				error: t
			}), !1;
		}
	});
}
//#endregion
//#region ../../shared/instant-config/src/repository.ts
var It = {}, Lt = "icbm__";
function Rt(e) {
	if (e === "true" || e === "false") return e === "true";
	let t = parseInt(e, 10);
	if (e === `${t}`) return t;
	try {
		return JSON.parse(e);
	} catch {
		return e;
	}
}
function zt(e, t) {
	let n = new URLSearchParams(t), r = [...n.keys()].filter((e) => e.startsWith(Lt) && n.get(e) !== null).reduce((e, t) => (e[t.slice(6)] = Rt(n.get(t)), e), {});
	return {
		...e,
		...r
	};
}
//#endregion
//#region ../../shared/instant-config/src/instant-config-service.ts
var Bt = A("InstantConfig"), Vt = "instantConfigLoaded", Ht = 2e3, Ut = class {
	constructor() {
		o(this, "repository", { ...It });
	}
	async init(e) {
		let t = await Wt(e), n = {
			...It,
			...t
		};
		return this.repository = zt(n, e.location?.search ?? ""), Bt.info("initialized with", this.repository), this;
	}
	get(e, t) {
		return this.repository[e] ?? t;
	}
	getAll() {
		return { ...this.repository };
	}
	toJSON() {
		return this.getAll();
	}
};
function Wt(e) {
	return e.icbm?.config ? Promise.resolve(e.icbm.config) : new Promise((t) => {
		let n = () => {
			clearTimeout(r), t(e.icbm?.config ?? {});
		}, r = setTimeout(() => {
			e.removeEventListener(Vt, n), Bt.warn("host did not provide instant-config in time; using defaults"), t({});
		}, Ht);
		e.addEventListener(Vt, n, { once: !0 });
	});
}
//#endregion
//#region runtime/initialize-instant-config.ts
var Gt = A("InstantConfig:bootstrap");
async function Kt() {
	let e = globalThis.window;
	try {
		return await new Ut().init(e);
	} catch (e) {
		return Gt.error("failed to initialize instant-config; using defaults", e), _(ze, { error: e }), new Ut();
	}
}
//#endregion
//#region runtime/attach-debug-info.ts
function qt(e) {
	Ct() && (e.debug = {
		version: e.version,
		config: e.config,
		activePlugins: e.getPlugins().map((e) => e.name)
	});
}
//#endregion
//#region runtime/constants.ts
var Jt = 2e3, Yt = /* @__PURE__ */ Object.assign({ "../config/default.ts": () => import("./default-BQtT_IEv.js") }), Xt = A("LoadConfig");
async function Zt(e) {
	let t = "../config/default.ts", n = Yt[e ? `../config/${e}/${e}.ts` : t] ?? Yt[t];
	try {
		return (await n()).default;
	} catch (t) {
		Xt.error("Could not load config for app", {
			app: e,
			error: t
		});
		let n = Error(`[VideoEngine] [LoadConfig] Could not load config for app: ${e}`, { cause: t });
		throw _(Re, {
			label: e ?? "default",
			...ke(t),
			error: n
		}), n;
	}
}
//#endregion
//#region ../../shared/utils/src/geo.ts
var Qt = "ZZ", $t = {
	country: Qt,
	region: Qt,
	continent: Qt
};
async function en() {
	let e = window.fandomHost?.geo;
	if (e && e.country) return e;
	let t = Ae.get("Geo");
	if (t) try {
		return JSON.parse(decodeURIComponent(t));
	} catch {}
	return $t;
}
//#endregion
//#region ../../shared/utils/src/device.ts
var tn = new Set([
	"desktop",
	"smartphone",
	"tablet"
]);
function nn(e) {
	return tn.has(e);
}
var rn = /Mobile|iPhone|Android|Silk|Kindle|Windows Phone|KFAPWI|(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i, an = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i, on = /iPad|Android(?!.*Mobile)/i;
function sn() {
	return fn(window.fandomHost?.device, window.navigator.userAgent);
}
function cn(e) {
	return e ?? sn();
}
function ln(e) {
	return cn(e) === "smartphone";
}
function un(e) {
	return cn(e) === "tablet";
}
function dn(e) {
	return ln(e) || un(e);
}
function fn(e, t = "") {
	return e && nn(e) ? e : pn(t);
}
function pn(e) {
	return on.test(e) ? "tablet" : rn.test(e) || an.test(e.substring(0, 4)) ? "smartphone" : "desktop";
}
//#endregion
//#region runtime/build-page-context.ts
async function mn() {
	return {
		geo: await en(),
		device: sn()
	};
}
//#endregion
//#region runtime/initialize-config.ts
async function hn(e) {
	let t = await Zt(), n = await mn(), r = { ...t.players };
	for (let [n, i] of Object.entries(e.players ?? {})) r[n] = {
		...t.players?.[n],
		...i
	};
	return {
		...t,
		...e,
		players: r,
		pageContext: n
	};
}
//#endregion
//#region ../../shared/plugins/morpheus-plugin/morpheus-plugin.ts
var gn = /* @__PURE__ */ new WeakMap(), _n = /* @__PURE__ */ new WeakMap(), vn = class {
	constructor(e) {
		o(this, "hooks", {}), o(this, "api", void 0), n(this, gn, []), n(this, _n, void 0), this.pluginConfig = e;
	}
	isEnabled(e) {
		return this.pluginConfig.enabled !== !1;
	}
	setPlugins(e) {
		c(gn, this, e);
	}
	setConfig(e) {
		c(_n, this, e);
	}
	useFeatureFlag(e, t) {
		return l(_n, this)?.featureFlags?.get(e) ?? t;
	}
	usePlugin(e) {
		return l(gn, this).find((t) => t.name === e);
	}
	useExperiment(e) {
		return l(gn, this).find((t) => t.experimentName === e.experimentName);
	}
}, yn = "fandom-video-ad", bn = A("FandomVideoAdPlugin");
function xn(e) {
	let t = document.getElementById(e);
	return t && t.localName === "fandom-video-ad" ? t : null;
}
function Sn(e, t) {
	let n = t.parentNode;
	if (!n) return bn.warn(`Container has no parent; cannot create ad element for slot "${e}".`), null;
	let r = document.createElement(yn);
	return r.id = e, n.insertBefore(r, t), r;
}
//#endregion
//#region ../../shared/plugins/fandom-video-ad/consents.ts
var Cn = null;
function wn(e, t) {
	return t.consentString !== e?.consentString || t.optOut !== e?.optOut;
}
function Tn() {
	return Cn || (window.fandomCmp?.allowed.ads ? Promise.resolve(!0) : (Cn = new Promise((e) => {
		let t = (n) => {
			(n.detail?.allowed.ads || window.fandomCmp?.allowed.ads) && (window.removeEventListener("fandomConsentUpdate", t), e(!0));
		};
		window.addEventListener("fandomConsentUpdate", t);
	}).finally(() => {
		Cn = null;
	}), Cn));
}
//#endregion
//#region ../../shared/plugins/fandom-video-ad/fandom-video-ad-plugin.ts
var En = 1e3, Dn = 5e3, On = 3;
function kn(e, t) {
	let n = new URLSearchParams();
	t && n.set("player", t);
	let r = (e) => {
		if (e) for (let [t, r] of Object.entries(e)) n.set(t, Array.isArray(r) ? r.join(",") : r);
	};
	return e && (e.vpos && n.set("vpos", e.vpos), r(e.pageTargeting), r(e.slotTargeting)), n.toString() || void 0;
}
var N = /* @__PURE__ */ new WeakMap(), An = /* @__PURE__ */ new WeakMap(), jn = /* @__PURE__ */ new WeakMap(), Mn = /* @__PURE__ */ new WeakMap(), Nn = /* @__PURE__ */ new WeakMap(), P = /* @__PURE__ */ new WeakSet(), Pn = class extends vn {
	constructor(e = {}) {
		super(e), t(this, P), o(this, "name", "FandomVideoAdPlugin"), n(this, N, A("FandomVideoAdPlugin")), n(this, An, /* @__PURE__ */ new WeakMap()), n(this, jn, /* @__PURE__ */ new Map()), n(this, Mn, null), n(this, Nn, null), o(this, "hooks", {
			onRuntimeReady: async () => {
				s(P, this, In).call(this);
			},
			onBeforePlayerCreate: (e) => s(P, this, Fn).call(this, e),
			onAfterPlayerDestroy: (e) => s(P, this, Bn).call(this, e)
		});
	}
};
async function Fn(e) {
	let t = e.options, n = t.adSlotName;
	if (!n) return;
	let r = e.container;
	l(jn, this).set(r, {
		slotName: n,
		resolveApplyAdTag: () => r.isConnected ? t.applyAdTag : void 0
	}), window.fandomCmp?.allowed.ads || (l(N, this).log(`ad request deferred for slot "${n}" — waiting for consent`), await Tn());
	let i = this.pluginConfig.whenDefinedTimeoutMs ?? En, a = this.pluginConfig.requestRenderTimeoutMs ?? Dn, o;
	if (!await Promise.race([customElements.whenDefined("fandom-video-ad").then(() => (clearTimeout(o), !0)), new Promise((e) => {
		o = setTimeout(() => e(!1), i);
	})])) {
		l(N, this).warn(`"<${yn}>" not defined within ${i}ms — playing without ads.`), _(Ge, { label: n });
		return;
	}
	let c = s(P, this, zn).call(this, n, e.container);
	if (!c) return;
	let u, d = null, f;
	try {
		[u, d] = await Promise.race([Promise.all([c.requestRender(), Promise.resolve().then(() => c.getAdUnitPath()).catch(() => null)]).finally(() => clearTimeout(f)), new Promise((e, t) => {
			f = setTimeout(() => t(/* @__PURE__ */ Error(`requestRender timed out after ${a}ms`)), a);
		})]);
	} catch (e) {
		l(N, this).warn(`requestRender failed for slot "${n}":`, e), _(tt, {
			label: n,
			error: e
		});
		return;
	}
	if (u.vastUrl) {
		t.adVastUrl = u.vastUrl, t.adUnitPath = d, t.adTargetingParams = kn(u.vastParams, e.type);
		try {
			let e = c.getMonetizationTier();
			if (e != null) {
				let n = Number(e);
				Number.isFinite(n) && (t.adTier = n);
			}
		} catch {}
		t.adTier ?? (t.adTier = On), l(N, this).log(`slot "${n}" enriched: adTier=${t.adTier}, hasVastUrl=${!!t.adVastUrl}, adUnitPath=${t.adUnitPath ?? "none"}`);
	}
}
function In() {
	l(Nn, this) || (c(Mn, this, {
		consentString: window.fandomCmp?.consentString,
		optOut: window.fandomCmp?.optOut
	}), c(Nn, this, (e) => {
		s(P, this, Ln).call(this, e).catch((e) => {
			l(N, this).warn("consent update handler failed:", e), _(w, {
				label: "FandomVideoAdPlugin:consentUpdate",
				error: e
			});
		});
	}), window.addEventListener("fandomConsentUpdate", l(Nn, this)));
}
async function Ln(e) {
	let { consentString: t, optOut: n } = e.detail;
	wn(l(Mn, this), e.detail) && (c(Mn, this, {
		consentString: t,
		optOut: n
	}), l(N, this).log("consent change detected — triggering ad tag renewal"), await Promise.allSettled([...l(jn, this).entries()].map(([e, t]) => s(P, this, Rn).call(this, e, t))));
}
async function Rn(e, { slotName: t, resolveApplyAdTag: n }) {
	let r = n();
	if (!r) return;
	let i = xn(t) ?? s(P, this, zn).call(this, t, e);
	if (!i) return;
	if (!window.fandomCmp?.allowed.ads) {
		l(N, this).log(`ad tag renewal gated for slot "${t}" — consent not granted`);
		return;
	}
	let a;
	try {
		a = await i.requestRender();
	} catch (e) {
		l(N, this).warn(`requestRender failed during consent update for slot "${t}":`, e), _(tt, {
			label: t,
			error: e
		});
		return;
	}
	if (a.vastUrl) try {
		await r(a.vastUrl);
	} catch (e) {
		l(N, this).warn(`applyAdTag failed during consent update for slot "${t}":`, e), _(w, {
			label: `FandomVideoAdPlugin:applyAdTag:${t}`,
			error: e
		});
	}
}
function zn(e, t) {
	let n = xn(e);
	if (n) return n;
	let r = Sn(e, t);
	return r ? (l(An, this).set(t, r), r) : null;
}
async function Bn(e) {
	l(jn, this).delete(e.container);
	let t = l(An, this).get(e.container);
	t && (l(An, this).delete(e.container), t.isConnected && t.localName === "fandom-video-ad" && t.parentNode && t.remove());
}
//#endregion
//#region ../../shared/players/jwplayer/consts.ts
var F = "jwplayer", I = "jwplayer-dsr", Vn = "https://cdn.jwplayer.com/", Hn = 1e4, L = "connatix", Un = 1e4, R = "primis", Wn = "https://live.primis.tech/live/liveView.php", Gn = 3e4, Kn = {
	floating: "playerFloating",
	closed: "playerFloatingClosed",
	stopped: "playerFloatingStopped"
}, qn = .5, Jn = 50, Yn = "mve-floating", Xn = "mve-floating-close", Zn = "mve-floating-close-container", Qn = "mve-floating-close--ad", $n = ".jwplayer .jw-wrapper", er = "cnx, [class*=\"cnx-\"]";
function tr(e, t) {
	let n = 0, r, i = () => {
		n = Date.now(), e();
	};
	return {
		run() {
			let e = t - (Date.now() - n);
			e <= 0 ? (r && (clearTimeout(r), r = void 0), i()) : r || (r = setTimeout(() => {
				r = void 0, i();
			}, e));
		},
		cancel() {
			r && clearTimeout(r), r = void 0;
		}
	};
}
var z = /* @__PURE__ */ new WeakMap(), B = /* @__PURE__ */ new WeakMap(), V = /* @__PURE__ */ new WeakMap(), nr = /* @__PURE__ */ new WeakMap(), rr = /* @__PURE__ */ new WeakMap(), ir = /* @__PURE__ */ new WeakMap(), H = /* @__PURE__ */ new WeakMap(), ar = /* @__PURE__ */ new WeakMap(), U = /* @__PURE__ */ new WeakMap(), or = /* @__PURE__ */ new WeakMap(), W = /* @__PURE__ */ new WeakMap(), G = /* @__PURE__ */ new WeakMap(), sr = /* @__PURE__ */ new WeakMap(), cr = /* @__PURE__ */ new WeakMap(), K = /* @__PURE__ */ new WeakMap(), lr = /* @__PURE__ */ new WeakMap(), ur = /* @__PURE__ */ new WeakMap(), dr = /* @__PURE__ */ new WeakMap(), fr = /* @__PURE__ */ new WeakMap(), pr = /* @__PURE__ */ new WeakMap(), mr = /* @__PURE__ */ new WeakMap(), hr = /* @__PURE__ */ new WeakMap(), q = /* @__PURE__ */ new WeakSet(), gr = /* @__PURE__ */ new WeakMap(), _r = class {
	constructor(e) {
		t(this, q), n(this, z, void 0), n(this, B, void 0), n(this, V, void 0), n(this, nr, void 0), n(this, rr, void 0), n(this, ir, void 0), n(this, H, void 0), n(this, ar, tr(() => s(q, this, br).call(this), Jn)), n(this, U, void 0), n(this, or, void 0), n(this, W, void 0), n(this, G, void 0), n(this, sr, !1), n(this, cr, !0), n(this, K, !1), n(this, lr, !1), n(this, ur, !1), n(this, dr, !1), n(this, fr, () => l(ar, this).run()), n(this, pr, () => {
			c(ur, this, !0), s(q, this, Or).call(this, !1), l(K, this) && s(q, this, Dr).call(this);
		}), n(this, mr, () => {
			c(ur, this, !0), s(q, this, Or).call(this, !0), l(K, this) && s(q, this, Dr).call(this);
		}), n(this, hr, () => s(q, this, Or).call(this, !1)), n(this, gr, () => s(q, this, Tr).call(this)), c(z, this, e.container), c(B, this, e.player), c(V, this, e.isMobile), c(nr, this, e.scrollThreshold), c(rr, this, e.closeButtonIcon), c(ir, this, e.logger);
	}
	start() {
		if (!l(sr, this)) {
			if (typeof IntersectionObserver > "u") {
				l(ir, this).warn("IntersectionObserver unavailable — floating disabled.");
				return;
			}
			if (!l(z, this).parentNode) {
				l(ir, this).warn("Container is detached — floating disabled.");
				return;
			}
			if (c(H, this, new IntersectionObserver((e) => s(q, this, vr).call(this, e), { threshold: qn })), l(H, this).observe(l(z, this)), l(V, this)) {
				let e = [
					l(B, this).on("play", l(pr, this)),
					l(B, this).on("adImpression", l(mr, this)),
					l(B, this).on("adPlay", l(mr, this)),
					l(B, this).on("adComplete", l(hr, this)),
					l(B, this).on("adError", l(hr, this))
				];
				c(G, this, () => e.forEach((e) => e()));
			}
			window.addEventListener("scroll", l(fr, this), { passive: !0 }), c(sr, this, !0), s(q, this, br).call(this);
		}
	}
	destroy() {
		l(H, this)?.disconnect(), c(H, this, void 0), l(sr, this) && window.removeEventListener("scroll", l(fr, this)), l(ar, this).cancel(), l(G, this)?.call(this), c(G, this, void 0), s(q, this, Ar).call(this), l(K, this) && (l(W, this)?.classList.remove(Yn, s(q, this, Er).call(this)), c(W, this, void 0), c(K, this, !1));
	}
};
function vr(e) {
	let t = e[0];
	t && (c(cr, this, typeof t.intersectionRatio == "number" ? t.intersectionRatio >= qn : t.isIntersecting), s(q, this, br).call(this));
}
function yr() {
	return !!l(z, this).querySelector($n) && !l(z, this).querySelector(er);
}
function br() {
	l(lr, this) || (s(q, this, yr).call(this) && !l(cr, this) && window.scrollY > l(nr, this) ? s(q, this, Sr).call(this) : s(q, this, Cr).call(this, Kn.stopped));
}
function xr() {
	return l(z, this).querySelector("div");
}
function Sr() {
	if (l(K, this)) return;
	let e = s(q, this, xr).call(this);
	e && (c(K, this, !0), c(W, this, e), e.classList.add(Yn, s(q, this, Er).call(this)), (!l(V, this) || l(ur, this)) && s(q, this, Dr).call(this), s(q, this, wr).call(this), s(q, this, jr).call(this, Kn.floating));
}
function Cr(e) {
	l(K, this) && (c(K, this, !1), l(W, this)?.classList.remove(Yn, s(q, this, Er).call(this)), c(W, this, void 0), s(q, this, Ar).call(this), s(q, this, wr).call(this), s(q, this, jr).call(this, e));
}
function wr() {
	window.dispatchEvent(new Event("resize"));
}
function Tr() {
	c(lr, this, !0);
	try {
		l(B, this).pause();
	} catch {}
	s(q, this, Cr).call(this, Kn.closed);
}
function Er() {
	return `${Yn}--${l(V, this) ? "mobile" : "desktop"}`;
}
function Dr() {
	if (l(U, this)) return;
	let e = l(z, this).ownerDocument, t = e.createElement("button");
	if (t.type = "button", t.className = `${Xn} ${Xn}--${l(V, this) ? "mobile" : "desktop"}`, t.setAttribute("aria-label", "Close floating video"), l(rr, this) ? t.innerHTML = l(rr, this) : t.textContent = "×", t.addEventListener("click", l(gr, this)), l(V, this)) {
		let n = e.createElement("div");
		n.className = Zn, n.appendChild(t), (l(z, this).parentElement ?? e.body).appendChild(n), c(or, this, n);
	} else {
		let e = l(W, this)?.firstElementChild;
		(e instanceof HTMLElement ? e : l(W, this))?.appendChild(t);
	}
	c(U, this, t), s(q, this, kr).call(this);
}
function Or(e) {
	l(dr, this) !== e && (c(dr, this, e), s(q, this, kr).call(this));
}
function kr() {
	l(U, this)?.classList.toggle(Qn, l(V, this) && l(dr, this));
}
function Ar() {
	l(U, this) && (l(U, this).removeEventListener("click", l(gr, this)), l(U, this).remove(), c(U, this, void 0), l(or, this)?.remove(), c(or, this, void 0));
}
function jr(e) {
	l(z, this).dispatchEvent(new CustomEvent(e, { bubbles: !0 }));
}
function Mr(e, t) {
	let n = e?.scrollThresholds;
	return (t ? n?.mobile : n?.desktop) ?? (t ? 300 : 580);
}
//#endregion
//#region ../../shared/plugins/custom-floating/custom-floating-plugin.ts
var Nr = A("CustomFloatingPlugin"), Pr = /* @__PURE__ */ new WeakMap(), Fr = /* @__PURE__ */ new WeakMap(), Ir = /* @__PURE__ */ new WeakMap(), J = /* @__PURE__ */ new WeakMap(), Lr = /* @__PURE__ */ new WeakSet(), Rr = class extends vn {
	constructor(e = {}) {
		super(e), t(this, Lr), o(this, "name", "CustomFloatingPlugin"), n(this, Pr, void 0), n(this, Fr, void 0), n(this, Ir, void 0), n(this, J, /* @__PURE__ */ new WeakMap()), o(this, "hooks", {
			onConfigLoaded: async (e) => {
				c(Pr, this, e.pageContext?.device), c(Ir, this, e.players);
				let t = e.customFloating?.closeButtonIcon;
				c(Fr, this, typeof t == "string" ? t : void 0);
			},
			onAfterPlayerCreate: async (e) => {
				e.type === "jwplayer" && s(Lr, this, zr).call(this, e);
			},
			onAfterPlayerDestroy: async (e) => {
				let t = l(J, this).get(e.container);
				t && (l(J, this).delete(e.container), t.destroy());
			}
		});
	}
	isEnabled(e) {
		let t = e;
		return super.isEnabled(e) && t.customFloating?.enabled === !0;
	}
};
function zr(e) {
	l(J, this).get(e.container)?.destroy();
	let t = dn(l(Pr, this)), n = l(Ir, this)?.[e.type], r = typeof n == "object" && n ? n.customFloating : void 0, i = new _r({
		container: e.container,
		player: e.player,
		isMobile: t,
		scrollThreshold: Mr(r, t),
		closeButtonIcon: l(Fr, this),
		logger: Nr
	});
	l(J, this).set(e.container, i), i.start();
}
//#endregion
//#region ../../shared/plugins/bucket-experiment/types.ts
var Br = "control", Vr = A("BucketExperimentPlugin"), Hr = class extends vn {
	constructor(e = {}) {
		super(e), o(this, "experimentName", void 0), o(this, "currentGroup", Br), this.experimentName = this.constructor.experimentName;
	}
	setExperimentGroup(e) {
		["control", ...this.variantNames].includes(e) ? this.currentGroup = e : (Vr.warn(`Unknown experiment group "${e}" for ${this.experimentName}; defaulting to control`), _(nt, { label: `${this.experimentName}:${e}` }), this.currentGroup = Br);
	}
	getDebugState() {
		return {
			experimentName: this.experimentName,
			currentGroup: this.currentGroup,
			variantNames: [...this.variantNames],
			codeDeletionDate: this.codeDeletionDate.toISOString()
		};
	}
};
o(Hr, "experimentName", "missing");
//#endregion
//#region ../../shared/plugins/bucket-experiment/get-server-side-experiment.ts
var Ur = /^sse-(?<experimentString>.+)$/, Wr = /^(?<team>[a-zA-Z]+)-(?<ticketId>[0-9]+)-(?<mode>variant|control)-?(?<variant>[1-6])?$/;
function Gr(e) {
	let t = e.toLowerCase().match(Wr);
	if (!t?.groups) return;
	let { team: n, ticketId: r, mode: i, variant: a } = t.groups;
	if (i === "variant" && !a) return;
	let o = a ? `${i}${a}` : i;
	return {
		name: `${n}-${r}`,
		group: o
	};
}
function Kr() {
	let { classList: e } = document.documentElement;
	for (let t of e) {
		let e = t.toLowerCase().match(Ur);
		if (e?.groups) return e.groups.experimentString;
	}
}
function qr() {
	let e = Kr();
	if (e) return Gr(e);
}
//#endregion
//#region ../../shared/plugins/bucket-experiment/bucket-experiment-manager.ts
var Jr = A("BucketExperimentManager");
function Yr() {
	return new URLSearchParams(globalThis.location?.search ?? "").get("force-sse");
}
var Xr = /* @__PURE__ */ new WeakMap(), Zr = /* @__PURE__ */ new WeakSet(), Qr = class {
	constructor(e, r) {
		t(this, Zr), n(this, Xr, void 0);
		let i = s(Zr, this, $r).call(this, r);
		if (!i) return;
		let a = s(Zr, this, ti).call(this, e, i.name);
		if (!a || a.isEligible && !a.isEligible(r)) return;
		let o = new a({});
		o.setExperimentGroup(i.group), r.experiments ?? (r.experiments = {}), r.experiments[i.name] = o.currentGroup;
		try {
			o.adjustRuntimeConfig?.(r);
		} catch (e) {
			Jr.error(`adjustRuntimeConfig failed for ${i.name}:`, e), _(w, {
				label: `${i.name}:adjustRuntimeConfig`,
				error: e
			});
		}
		c(Xr, this, o);
	}
	getActivePlugin() {
		return l(Xr, this);
	}
};
function $r(e) {
	let t = Yr();
	if (t) {
		let e = Gr(t);
		if (e) return e;
	}
	return qr() || s(Zr, this, ei).call(this, e);
}
function ei(e) {
	let t = e.experiments;
	if (!t) return;
	let [n, r] = Object.entries(t)[0] ?? [];
	if (!(!n || !r)) return {
		name: n,
		group: r
	};
}
function ti(e, t) {
	return Object.values(e).find((e) => e.experimentName === t);
}
//#endregion
//#region ../../shared/plugins/experiments/ExampleExperiment/example-experiment.ts
var ni = A("ExampleExperiment"), ri = class extends Hr {
	constructor(...e) {
		super(...e), o(this, "name", "ExampleExperiment"), o(this, "variantNames", ["variant1", "variant2"]), o(this, "codeDeletionDate", /* @__PURE__ */ new Date("2045-08-01")), o(this, "hooks", { onRuntimeReady: async () => {
			ni.log("onRuntimeReady from an example experiment", { group: this.currentGroup });
		} });
	}
	isEnabled(e) {
		return super.isEnabled(e) && je(e, this.name);
	}
	adjustRuntimeConfig(e) {
		this.isEnabled(e) && (e.exampleFeatureEnabled = this.currentGroup === "variant1");
	}
};
o(ri, "experimentName", "fake-1234");
//#endregion
//#region ../../shared/plugins/bucket-experiment/index.ts
var ii = { ExampleExperiment: ri };
//#endregion
//#region runtime/load-plugins-list.ts
function ai(e) {
	let t = new Qr(ii, e).getActivePlugin();
	return [
		...t ? [t] : [],
		new Pn(),
		new Rr()
	];
}
//#endregion
//#region ../../shared/players/define-player-factory.ts
function oi(e, t) {
	let n = {};
	return {
		type: e,
		attachConfig(t) {
			let r = t.players?.[e];
			if (r === void 0) {
				n = {};
				return;
			}
			if (typeof r != "object" || !r) {
				console.warn(`[${e}] config.players.${e} is not an object; ignoring.`), n = {};
				return;
			}
			n = r;
		},
		create: (e, r) => {
			for (let e of Object.keys(n)) {
				let t = n[e];
				t !== void 0 && (r[e] ?? (r[e] = t));
			}
			return t(e, r);
		}
	};
}
//#endregion
//#region ../../shared/players/common/ad-slot-registry.ts
var si = /* @__PURE__ */ new Set();
function ci(e, t) {
	if (si.has(t)) throw Error(`[${e}] cannot create ${e} with ads — slot "${t}" is already reserved by another pending/live player`);
	si.add(t);
}
function li(e) {
	si.delete(e);
}
//#endregion
//#region ../../shared/players/jwplayer/jwplayer-adapter.ts
var ui = class {
	constructor(e, t) {
		o(this, "type", F), this.instance = e, this.onDestroy = t;
	}
	play() {
		this.instance.play();
	}
	pause() {
		this.instance.pause();
	}
	stop() {
		this.instance.stop();
	}
	on(e, t) {
		let n = t;
		return this.instance.on(e, n), () => this.instance.off(e, n);
	}
	destroy() {
		this.onDestroy();
	}
}, di = /* @__PURE__ */ new Map();
function fi(e, t) {
	di.set(e, t);
}
function pi(e) {
	let t = window.jwDsrPartners?.[e]?.partner ?? "jwplayer", n = di.get(t);
	if (!n) throw Error(`[${I}] No adapter registered for DSR partner "${t}". Register one with registerPartnerAdapter() or add support for this partner.`);
	return n;
}
fi(F, ui);
//#endregion
//#region ../../shared/players/jwplayer/modes/dsr.ts
function mi(e) {
	return (t) => {
		var n, r;
		let i = (n = window).jwDataStore ?? (n.jwDataStore = { custom: {} });
		i.custom ?? (i.custom = {}), (r = i.custom)[e] ?? (r[e] = {}), i.custom[e].preroll_ad_tag = t;
	};
}
var hi = `${F}-dsr`, gi = (e, t) => `${Vn}v2/sites/${e}/placements/${t}/embed.js`, _i = {
	name: "dsr",
	async bootstrap(e, t) {
		let { siteId: n, placementId: r, playlistId: i, mediaId: a, adVastUrl: o, adTier: s } = t;
		if (h(`dsr:bootstrap:${r}`), t.applyAdTag ?? (t.applyAdTag = mi(r)), !i && !a) {
			let e = /* @__PURE__ */ Error(`[${I}] At least one of \`playlistId\` or \`mediaId\` is required — without it the DSR bundle has nothing to play and aborts.`);
			throw _(C, {
				player_type: F,
				player_mode: "dsr",
				label: r,
				error: e
			}), e;
		}
		let c = {};
		i && (c.playlist_id = i), a && (c.media_id = a), o && (c.preroll_ad_tag = o), s != null && Number.isFinite(s) && (c.tier = s);
		let l = Object.keys(c), u;
		try {
			bi(r, c);
			let t = `player_${r}`, i = document.getElementById(t);
			if (i && i !== e) throw Error(`[${I}] A DSR player for placement "${r}" is already mounted in another container. Re-use the existing container or provide a different placementId.`);
			e.id = t;
			let a = D(), o = (e) => E({
				component: hi,
				action: e,
				duration_ms: O(a),
				label: hi,
				placement_id: r
			});
			u = xi(e, gi(n, r)), h("dsr:script-inject"), o("player-script-inject");
			let s = await Si(r);
			h("dsr:placement-ready"), o("player-placement-ready"), await vi(s, Hn, r), h("dsr:player-ready"), o("player-ready");
			let d = pi(r);
			return {
				instance: s,
				script: u,
				destroyPlayer: () => {},
				Adapter: d,
				cleanup: () => {
					yi(r, l), delete window.jwplacements, delete window.jwplacementsMap;
				}
			};
		} catch (e) {
			_(b, {
				player_type: F,
				player_mode: "dsr",
				label: r,
				error: e
			});
			try {
				u?.remove(), yi(r, l);
			} catch {}
			throw e;
		}
	}
};
function vi(e, t, n) {
	return e.getState() == null ? new Promise((r, i) => {
		let a = setTimeout(() => {
			let e = /* @__PURE__ */ Error(`[${I}] Player did not emit 'ready' within ${t}ms — JW registered the placement but its underlying player never finished booting.`);
			_(x, {
				player_type: F,
				player_mode: "dsr",
				label: n,
				error: e
			}), i(e);
		}, t);
		e.once("ready", () => {
			clearTimeout(a), r();
		});
	}) : Promise.resolve();
}
function yi(e, t) {
	let n = window.jwDataStore?.custom?.[e];
	if (n) {
		for (let e of t) delete n[e];
		Object.keys(n).length === 0 && delete window.jwDataStore.custom[e];
	}
}
function bi(e, t) {
	var n;
	let r = (n = window).jwDataStore ?? (n.jwDataStore = { custom: {} });
	r.custom ?? (r.custom = {}), r.custom[e] = {
		...r.custom[e],
		...t
	};
}
function xi(e, t) {
	let n = e.querySelector(`script[src="${t}"]`);
	if (n) return n;
	let r = document.createElement("script");
	return r.src = t, r.async = !0, e.appendChild(r), r;
}
async function Si(e) {
	let t = Date.now();
	for (; Date.now() - t < Hn;) {
		let t = window.jwplacements?._getPlacementReadyPromise(e);
		if (t) return (await t).player;
		await new Promise((e) => setTimeout(e, 100));
	}
	throw Error(`[${I}] placement "${e}" did not become ready within ${Hn}ms`);
}
//#endregion
//#region ../../shared/players/jwplayer/modes/index.ts
var Ci = /* @__PURE__ */ new Map();
function wi(e) {
	Ci.set(e.name, {
		name: e.name,
		bootstrap: (t, n) => e.bootstrap(t, n)
	});
}
wi(_i);
function Ti(e) {
	let t = Ci.get(e);
	if (!t) throw Error(`[${F}] Unknown mode "${e}". Registered modes: ${[...Ci.keys()].join(", ") || "(none)"}`);
	return t;
}
//#endregion
//#region ../../shared/players/jwplayer/safe-instance.ts
var Ei = new Set(["remove"]);
function Di(e) {
	return new Proxy(e, { get(e, t, n) {
		if (typeof t == "string" && Ei.has(t)) return (...e) => {
			console.warn(`[${F}] "${t}()" is blocked on the safe instance. Call JwPlayer.destroy() instead to tear the player down cleanly.`);
		};
		let r = Reflect.get(e, t, n);
		return typeof r == "function" ? r.bind(e) : r;
	} });
}
//#endregion
//#region ../../shared/players/jwplayer/jwplayer.ts
var Oi = /* @__PURE__ */ new WeakMap(), ki = /* @__PURE__ */ new WeakMap(), Ai = /* @__PURE__ */ new WeakMap(), ji = /* @__PURE__ */ new WeakMap(), Mi = /* @__PURE__ */ new WeakMap(), Ni = /* @__PURE__ */ new WeakMap(), Pi = /* @__PURE__ */ new WeakMap(), Fi = /* @__PURE__ */ new WeakMap(), Ii = class e {
	constructor(e, t, r, i = {}) {
		o(this, "type", F), n(this, Oi, void 0), n(this, ki, void 0), n(this, Ai, void 0), n(this, ji, void 0), n(this, Mi, void 0), n(this, Ni, void 0), n(this, Pi, void 0), n(this, Fi, !1), c(Oi, this, e), c(ki, this, t), c(Ai, this, Di(t)), c(Mi, this, i.cleanup), c(Ni, this, i.destroyPlayer), c(Pi, this, i.onDestroy), c(ji, this, new r(l(Ai, this), () => this.destroy()));
	}
	get adapter() {
		return l(ji, this);
	}
	static async create(t, n, r) {
		let { instance: i, script: a, cleanup: o, destroyPlayer: s, Adapter: c } = await Ti(n.mode).bootstrap(t, n);
		return new e(a, i, c, {
			cleanup: o,
			destroyPlayer: s,
			onDestroy: r
		});
	}
	getInstance() {
		if (l(Fi, this)) throw Error(`[${F}] Player has been destroyed; instance is no longer available.`);
		return l(Ai, this);
	}
	destroy() {
		if (!l(Fi, this)) {
			c(Fi, this, !0);
			try {
				l(Ni, this) ? l(Ni, this).call(this) : l(ki, this).remove();
			} catch (e) {
				_(S, {
					player_type: F,
					error: e
				});
			}
			l(Oi, this).remove();
			try {
				l(Mi, this)?.call(this);
			} catch (e) {
				_(w, {
					label: `${F}:cleanup`,
					player_type: F,
					error: e
				});
			}
			l(Pi, this)?.call(this);
		}
	}
}, Li = oi(F, async (e, t) => {
	let n = t.adSlotName;
	n && ci(F, n);
	try {
		return (await Ii.create(e, t, n ? () => li(n) : void 0)).adapter;
	} catch (e) {
		throw n && li(n), e;
	}
}), Ri = {
	play: "play",
	complete: "videoCompleted100",
	error: "playError",
	adImpression: "adImpression",
	adPlay: "adPlay",
	adComplete: "adCompleted100",
	adError: "adError",
	ready: "videoStarted"
}, Y = /* @__PURE__ */ new WeakMap(), zi = /* @__PURE__ */ new WeakMap(), Bi = /* @__PURE__ */ new WeakMap(), Vi = /* @__PURE__ */ new WeakMap(), Hi = class {
	constructor(e, t, r) {
		o(this, "type", L), n(this, Y, void 0), n(this, zi, void 0), n(this, Bi, void 0), n(this, Vi, !1), o(this, "play", () => {
			l(Y, this).play();
		}), o(this, "pause", () => {
			l(Y, this).pause();
		}), o(this, "stop", () => {
			l(Y, this).pause(), l(Y, this).setVideoPosition(0);
		}), o(this, "on", (e, t) => {
			let n = Ri[e];
			return n && l(Y, this).on(n, t), () => {};
		}), o(this, "destroy", () => {
			if (!l(Vi, this)) {
				c(Vi, this, !0);
				try {
					l(Y, this).destroy();
				} catch (e) {
					_(S, {
						player_type: L,
						error: e
					});
				}
				l(zi, this).remove(), l(Bi, this)?.call(this);
			}
		}), c(Y, this, e), c(zi, this, t), c(Bi, this, r);
	}
}, Ui = (e) => (function(t) {
	if (!window.cnx) {
		window.cnx = {}, window.cnx.cmd = [];
		var n = t.createElement("iframe");
		n.src = "javascript:false", n.display = "none", n.onload = function() {
			var t = n.contentWindow.document, r = t.createElement("script");
			r.src = `//cd.connatix.com/connatix.player.js?cid=${e}`, r.setAttribute("async", "1"), r.setAttribute("type", "text/javascript"), t.body.appendChild(r);
		}, t.head.appendChild(n);
	}
})(document);
//#endregion
//#region ../../shared/players/connatix/render.ts
function Wi(e, t, n) {
	window.cnx?.cmd?.push(function() {
		window.cnx?.(t).render(e, n);
	});
}
//#endregion
//#region ../../shared/players/connatix/connatix.ts
var Gi = 0;
function Ki(e) {
	return {
		renderId: `${e.renderId ?? "cnx"}-${++Gi}`,
		playerId: e.playerId ?? ""
	};
}
function qi(e, t) {
	let n = {
		playerId: e,
		settings: t.adVastUrl ? {
			disableAdvertising: !1,
			advertising: { lineItems: [{
				id: e,
				url: t.adVastUrl
			}] }
		} : { disableAdvertising: !0 }
	};
	return t.mediaId && (n.mediaId = t.mediaId), t.playlistId && (n.playlistId = t.playlistId), n;
}
function Ji(e, t) {
	return new Promise((n, r) => {
		let i = !1, a = setTimeout(() => {
			if (i) return;
			i = !0;
			let e = /* @__PURE__ */ Error(`[${L}] render timed out after ${Un}ms — SDK may not have loaded`);
			_(x, {
				player_type: L,
				error: e
			}), r(e);
		}, Un);
		Wi(e, t, (e, t) => {
			if (!i) if (i = !0, clearTimeout(a), e) {
				let t = /* @__PURE__ */ Error(`[${L}] ${e.type}: ${e.message}`);
				_(b, {
					player_type: L,
					error_type: e.type,
					error_message: e.message,
					error: t
				}), r(t);
			} else n(t);
		});
	});
}
function Yi(e, t) {
	let n = {};
	t.adUnitPath && (n.path = t.adUnitPath), t.adTargetingParams && (n.custmac = t.adTargetingParams), Object.keys(n).length > 0 && e.setMacros(n);
}
var Xi = oi(L, async (e, t) => {
	let n = t.customerId;
	if (!n) throw Error(`[${L}] customerId is required — set it in window.__morpheusConfig.players.${L}.customerId`);
	let { renderId: r, playerId: i } = Ki(t);
	if (!i) {
		let e = /* @__PURE__ */ Error(`[${L}] playerId is required — set players.${L}.playerId in config or pass it directly`);
		throw _(C, {
			player_type: L,
			error: e
		}), e;
	}
	let a = t.adSlotName;
	a && ci(L, a);
	let o = D(), s = (e) => E({
		component: L,
		action: e,
		duration_ms: O(o),
		label: L
	}), c;
	try {
		Ui(n), s("player-script-inject"), c = document.createElement("div"), c.id = r, e.appendChild(c);
		let o = await Ji(r, qi(i, t));
		return s("player-ready"), Yi(o, t), new Hi(o, c, a ? () => li(a) : void 0);
	} catch (e) {
		throw c?.remove(), a && li(a), e;
	}
});
//#endregion
//#region ../../shared/players/primis/inject-script.ts
function Zi(e, t) {
	let n = e.querySelector(`script[src="${t}"]`);
	if (n) return n;
	let r = document.createElement("script");
	return r.src = t, r.async = !0, e.appendChild(r), r;
}
//#endregion
//#region ../../shared/players/primis/primis-adapter.ts
var Qi = A("Primis"), $i = {
	play: ["adPlay", "videoStart"],
	pause: ["adPause", "videoPause"],
	complete: ["adCompleted", "videoEnd"],
	adImpression: ["adStarted"],
	adPlay: ["adPlay"],
	adPause: ["adPause"],
	adComplete: ["adCompleted"],
	mute: ["volumeChange"],
	volume: ["volumeChange"]
}, ea = /* @__PURE__ */ new WeakMap(), ta = /* @__PURE__ */ new WeakSet(), na = class {
	constructor(e, r) {
		t(this, ta), o(this, "type", R), n(this, ea, /* @__PURE__ */ new Set()), this.primisPlayer = e, this.onDestroy = r;
	}
	play() {
		this.primisPlayer.play ? this.primisPlayer.play() : s(ta, this, ra).call(this, "play");
	}
	pause() {
		this.primisPlayer.pause ? this.primisPlayer.pause() : s(ta, this, ra).call(this, "pause");
	}
	stop() {
		s(ta, this, ra).call(this, "stop");
	}
	on(e, t) {
		if (e === "ready") {
			let e = !1;
			return queueMicrotask(() => {
				e || t(void 0);
			}), () => {
				e = !0;
			};
		}
		let n = $i[e];
		if (!n) return () => {};
		let r = t, i = n.map((e) => this.primisPlayer.addEventListener(e, r)).filter((e) => e != null), a = !1;
		return () => {
			a || (a = !0, i.forEach((e) => this.primisPlayer.removeEventListener(e)));
		};
	}
	destroy() {
		this.onDestroy();
	}
};
function ra(e) {
	l(ea, this).has(e) || (l(ea, this).add(e), Qi.warn(`"${e}" is not supported by this Primis player instance — ignoring.`));
}
//#endregion
//#region ../../shared/players/primis/build-script-url.ts
function ia({ siteId: e, playerApiId: t, pubUrl: n, cbuster: r, customConfig: i }) {
	let a = new URLSearchParams(i);
	return a.set("s", e), a.set("playerApiId", t), a.set("pubUrl", n), a.set("cbuster", String(r)), `${Wn}?${a.toString()}`;
}
//#endregion
//#region ../../shared/players/primis/player-api-id.ts
function aa() {
	return crypto.randomUUID().replaceAll("-", "");
}
//#endregion
//#region ../../shared/players/primis/primis.ts
var oa = A("Primis"), sa = R, X = /* @__PURE__ */ new Map();
function ca(e, t) {
	return `${e}${t}`;
}
var la = /* @__PURE__ */ new WeakMap(), ua = /* @__PURE__ */ new WeakMap(), da = /* @__PURE__ */ new WeakMap(), Z = /* @__PURE__ */ new WeakMap(), fa = /* @__PURE__ */ new WeakMap(), pa = class e {
	constructor(e, t, r) {
		o(this, "type", R), n(this, la, void 0), n(this, ua, void 0), n(this, da, void 0), n(this, Z, void 0), n(this, fa, !1), c(la, this, e), c(ua, this, t), c(Z, this, r), c(da, this, new na(t, () => this.destroy()));
	}
	get adapter() {
		return l(da, this);
	}
	static async create(t, n) {
		if (h("primis:create"), !n.siteId) {
			let e = /* @__PURE__ */ Error(`[${R}] "siteId" is required to create a Primis player`);
			throw _(C, {
				player_type: R,
				error: e
			}), oa.error("\"siteId\" is required to create a Primis player"), e;
		}
		if (X.has(n.siteId)) throw oa.error(`a Primis player is already live for siteId "${n.siteId}"; ignoring duplicate create request`), Error(`[${R}] a Primis player is already live for siteId "${n.siteId}"; ignoring duplicate create request`);
		X.set(n.siteId, "pending");
		let r;
		try {
			let i = ca(n.playerApiId ?? aa(), n.siteId), a = n.pubUrl ?? window.location.href, o = D(), s = (e) => E({
				component: sa,
				action: e,
				duration_ms: O(o),
				label: sa,
				placement_id: n.siteId
			}), c = ha(i, Gn);
			try {
				r = Zi(t, ia({
					siteId: n.siteId,
					playerApiId: i,
					pubUrl: a,
					cbuster: Date.now(),
					customConfig: n.customConfig
				})), h("primis:script-inject"), s("player-script-inject");
				let o = await c.promise;
				h("primis:ready"), s("player-ready");
				let l = new e(t, o, n.siteId);
				return X.set(n.siteId, l), l;
			} finally {
				c.cleanup();
			}
		} catch (e) {
			throw _(b, {
				player_type: R,
				error: e
			}), r?.remove(), X.delete(n.siteId), e;
		}
	}
	destroy() {
		if (!l(fa, this)) {
			c(fa, this, !0);
			try {
				l(ua, this).destruct?.();
			} catch (e) {
				_(S, {
					player_type: this.type,
					error: e
				});
			}
			try {
				l(la, this).replaceChildren();
			} catch (e) {
				_(S, {
					player_type: this.type,
					error: e
				});
			}
			X.get(l(Z, this)) === this && X.delete(l(Z, this));
		}
	}
};
function ma() {
	try {
		return window.top ?? window;
	} catch {
		return window;
	}
}
function ha(e, t) {
	let n = ma(), r, i, a = () => {
		r !== void 0 && (clearTimeout(r), r = void 0), i && (n.removeEventListener("primisPlayerInit", i), i = void 0);
	};
	return {
		promise: new Promise((o, s) => {
			i = (t) => {
				let n = t.detail;
				n?.playerApiId === e && (a(), o(n));
			}, r = setTimeout(() => {
				a();
				let e = /* @__PURE__ */ Error(`[${R}] player did not initialize within ${t}ms — the embed script may have failed to load (ad blocker, network error, blocked origin).`);
				_(x, {
					player_type: R,
					error: e
				}), s(e);
			}, t), n.addEventListener("primisPlayerInit", i);
		}),
		cleanup: a
	};
}
var ga = oi(R, async (e, t) => (await pa.create(e, t)).adapter), _a = "v10";
function va(e, t) {
	if (typeof t.env == "string" && t.env) return t.env;
	let n = e.fandomContext?.app?.env;
	return typeof n == "string" && n ? n : "unknown";
}
var ya = D(), Q = (e, t) => {
	h(`bootstrap:${e}`), E({
		component: "video-engine",
		action: e,
		duration_ms: O(ya),
		...t
	});
};
St(wt()), window.addEventListener("unhandledrejection", (e) => {
	let t = e.reason, n = t instanceof Error ? t.message : String(t);
	!n.includes("[Morpheus]") && !n.includes("[jwplayer") && !n.includes("[VideoEngine]") || _(rt, { error: t });
});
var $ = A("VideoEngine"), ba = window, xa, Sa;
ba.MorpheusReady = new Promise((e, t) => {
	xa = e, Sa = t;
}), (async function(e) {
	$.log("bootstrap starting");
	let t = await hn(e.__morpheusConfig ?? {}), n = {
		engine_version: _a,
		env: va(e, t)
	};
	st(n), pe(n), E({
		component: "video-engine",
		action: "script-execution-start",
		duration_ms: ya >= 0 ? ya : -1
	}), Q("config-fetch"), $.log("config initialized", t);
	let r = await Kt();
	t.featureFlags = r, $.log("instant-config resolved", r.getAll());
	let i = Array.isArray(e.Morpheus) ? e.Morpheus : [], a = Ft(ai(t), t);
	Q("plugin-init"), $.log("active plugins", a.map((e) => e.name));
	let o = !1, s = Promise.allSettled(j(a, "onConfigLoaded", t)).then(() => {
		o = !0;
	});
	await Promise.race([s, new Promise((e) => setTimeout(e, Jt))]), o || (Q("plugin-waiting-timeout"), _(qe)), Q("config-loaded-hook");
	let c = At(t, a);
	Q("runtime-create"), qt(c), j(a, "onRuntimeReady", c);
	let l = [
		Li,
		Xi,
		ga
	];
	for (let e of l) c.registerPlayerFactory(e);
	Q("player-factory-register"), j(a, "onPlayersRegistered", c), e.Morpheus = c, Nt(c, i), Q("queue-drain"), j(a, "onQueueDrained"), xa(c), j(a, "onInitializationEnded"), Q("bootstrap-complete", { active_plugins: a.map((e) => e.name) }), $.log("runtime ready", t);
})(ba).catch((e) => {
	$.error("fatal init error:", e), _(Fe, { error: e }), Sa(e);
});
//#endregion
