(function () {
  const j = document.createElement("link").relList;
  if (j && j.supports && j.supports("modulepreload")) return;
  for (const Z of document.querySelectorAll('link[rel="modulepreload"]')) r(Z);
  new MutationObserver((Z) => {
    for (const K of Z)
      if (K.type === "childList")
        for (const T of K.addedNodes)
          T.tagName === "LINK" && T.rel === "modulepreload" && r(T);
  }).observe(document, { childList: !0, subtree: !0 });
  function N(Z) {
    const K = {};
    return (
      Z.integrity && (K.integrity = Z.integrity),
      Z.referrerPolicy && (K.referrerPolicy = Z.referrerPolicy),
      Z.crossOrigin === "use-credentials"
        ? (K.credentials = "include")
        : Z.crossOrigin === "anonymous"
          ? (K.credentials = "omit")
          : (K.credentials = "same-origin"),
      K
    );
  }
  function r(Z) {
    if (Z.ep) return;
    Z.ep = !0;
    const K = N(Z);
    fetch(Z.href, K);
  }
})();
function Td(g) {
  return g && g.__esModule && Object.prototype.hasOwnProperty.call(g, "default")
    ? g.default
    : g;
}
var iu = { exports: {} },
  An = {};
var vd;
function F0() {
  if (vd) return An;
  vd = 1;
  var g = Symbol.for("react.transitional.element"),
    j = Symbol.for("react.fragment");
  function N(r, Z, K) {
    var T = null;
    if (
      (K !== void 0 && (T = "" + K),
      Z.key !== void 0 && (T = "" + Z.key),
      "key" in Z)
    ) {
      K = {};
      for (var U in Z) U !== "key" && (K[U] = Z[U]);
    } else K = Z;
    return (
      (Z = K.ref),
      { $$typeof: g, type: r, key: T, ref: Z !== void 0 ? Z : null, props: K }
    );
  }
  return ((An.Fragment = j), (An.jsx = N), (An.jsxs = N), An);
}
var pd;
function W0() {
  return (pd || ((pd = 1), (iu.exports = F0())), iu.exports);
}
var s = W0(),
  cu = { exports: {} },
  oe = {};
var gd;
function I0() {
  if (gd) return oe;
  gd = 1;
  var g = Symbol.for("react.transitional.element"),
    j = Symbol.for("react.portal"),
    N = Symbol.for("react.fragment"),
    r = Symbol.for("react.strict_mode"),
    Z = Symbol.for("react.profiler"),
    K = Symbol.for("react.consumer"),
    T = Symbol.for("react.context"),
    U = Symbol.for("react.forward_ref"),
    M = Symbol.for("react.suspense"),
    v = Symbol.for("react.memo"),
    V = Symbol.for("react.lazy"),
    O = Symbol.for("react.activity"),
    G = Symbol.iterator;
  function L(d) {
    return d === null || typeof d != "object"
      ? null
      : ((d = (G && d[G]) || d["@@iterator"]),
        typeof d == "function" ? d : null);
  }
  var le = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    H = Object.assign,
    ee = {};
  function me(d, E, Q) {
    ((this.props = d),
      (this.context = E),
      (this.refs = ee),
      (this.updater = Q || le));
  }
  ((me.prototype.isReactComponent = {}),
    (me.prototype.setState = function (d, E) {
      if (typeof d != "object" && typeof d != "function" && d != null)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables.",
        );
      this.updater.enqueueSetState(this, d, E, "setState");
    }),
    (me.prototype.forceUpdate = function (d) {
      this.updater.enqueueForceUpdate(this, d, "forceUpdate");
    }));
  function ae() {}
  ae.prototype = me.prototype;
  function Y(d, E, Q) {
    ((this.props = d),
      (this.context = E),
      (this.refs = ee),
      (this.updater = Q || le));
  }
  var X = (Y.prototype = new ae());
  ((X.constructor = Y), H(X, me.prototype), (X.isPureReactComponent = !0));
  var B = Array.isArray;
  function C() {}
  var A = { H: null, A: null, T: null, S: null },
    D = Object.prototype.hasOwnProperty;
  function k(d, E, Q) {
    var F = Q.ref;
    return {
      $$typeof: g,
      type: d,
      key: E,
      ref: F !== void 0 ? F : null,
      props: Q,
    };
  }
  function P(d, E) {
    return k(d.type, E, d.props);
  }
  function ce(d) {
    return typeof d == "object" && d !== null && d.$$typeof === g;
  }
  function Se(d) {
    var E = { "=": "=0", ":": "=2" };
    return (
      "$" +
      d.replace(/[=:]/g, function (Q) {
        return E[Q];
      })
    );
  }
  var He = /\/+/g;
  function J(d, E) {
    return typeof d == "object" && d !== null && d.key != null
      ? Se("" + d.key)
      : E.toString(36);
  }
  function S(d) {
    switch (d.status) {
      case "fulfilled":
        return d.value;
      case "rejected":
        throw d.reason;
      default:
        switch (
          (typeof d.status == "string"
            ? d.then(C, C)
            : ((d.status = "pending"),
              d.then(
                function (E) {
                  d.status === "pending" &&
                    ((d.status = "fulfilled"), (d.value = E));
                },
                function (E) {
                  d.status === "pending" &&
                    ((d.status = "rejected"), (d.reason = E));
                },
              )),
          d.status)
        ) {
          case "fulfilled":
            return d.value;
          case "rejected":
            throw d.reason;
        }
    }
    throw d;
  }
  function m(d, E, Q, F, re) {
    var ve = typeof d;
    (ve === "undefined" || ve === "boolean") && (d = null);
    var Ne = !1;
    if (d === null) Ne = !0;
    else
      switch (ve) {
        case "bigint":
        case "string":
        case "number":
          Ne = !0;
          break;
        case "object":
          switch (d.$$typeof) {
            case g:
            case j:
              Ne = !0;
              break;
            case V:
              return ((Ne = d._init), m(Ne(d._payload), E, Q, F, re));
          }
      }
    if (Ne)
      return (
        (re = re(d)),
        (Ne = F === "" ? "." + J(d, 0) : F),
        B(re)
          ? ((Q = ""),
            Ne != null && (Q = Ne.replace(He, "$&/") + "/"),
            m(re, E, Q, "", function (wa) {
              return wa;
            }))
          : re != null &&
            (ce(re) &&
              (re = P(
                re,
                Q +
                  (re.key == null || (d && d.key === re.key)
                    ? ""
                    : ("" + re.key).replace(He, "$&/") + "/") +
                  Ne,
              )),
            E.push(re)),
        1
      );
    Ne = 0;
    var $e = F === "" ? "." : F + ":";
    if (B(d))
      for (var we = 0; we < d.length; we++)
        ((F = d[we]), (ve = $e + J(F, we)), (Ne += m(F, E, Q, ve, re)));
    else if (((we = L(d)), typeof we == "function"))
      for (d = we.call(d), we = 0; !(F = d.next()).done; )
        ((F = F.value), (ve = $e + J(F, we++)), (Ne += m(F, E, Q, ve, re)));
    else if (ve === "object") {
      if (typeof d.then == "function") return m(S(d), E, Q, F, re);
      throw (
        (E = String(d)),
        Error(
          "Objects are not valid as a React child (found: " +
            (E === "[object Object]"
              ? "object with keys {" + Object.keys(d).join(", ") + "}"
              : E) +
            "). If you meant to render a collection of children, use an array instead.",
        )
      );
    }
    return Ne;
  }
  function q(d, E, Q) {
    if (d == null) return d;
    var F = [],
      re = 0;
    return (
      m(d, F, "", "", function (ve) {
        return E.call(Q, ve, re++);
      }),
      F
    );
  }
  function W(d) {
    if (d._status === -1) {
      var E = d._result;
      ((E = E()),
        E.then(
          function (Q) {
            (d._status === 0 || d._status === -1) &&
              ((d._status = 1), (d._result = Q));
          },
          function (Q) {
            (d._status === 0 || d._status === -1) &&
              ((d._status = 2), (d._result = Q));
          },
        ),
        d._status === -1 && ((d._status = 0), (d._result = E)));
    }
    if (d._status === 1) return d._result.default;
    throw d._result;
  }
  var pe =
      typeof reportError == "function"
        ? reportError
        : function (d) {
            if (
              typeof window == "object" &&
              typeof window.ErrorEvent == "function"
            ) {
              var E = new window.ErrorEvent("error", {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof d == "object" &&
                  d !== null &&
                  typeof d.message == "string"
                    ? String(d.message)
                    : String(d),
                error: d,
              });
              if (!window.dispatchEvent(E)) return;
            } else if (
              typeof process == "object" &&
              typeof process.emit == "function"
            ) {
              process.emit("uncaughtException", d);
              return;
            }
            console.error(d);
          },
    ue = {
      map: q,
      forEach: function (d, E, Q) {
        q(
          d,
          function () {
            E.apply(this, arguments);
          },
          Q,
        );
      },
      count: function (d) {
        var E = 0;
        return (
          q(d, function () {
            E++;
          }),
          E
        );
      },
      toArray: function (d) {
        return (
          q(d, function (E) {
            return E;
          }) || []
        );
      },
      only: function (d) {
        if (!ce(d))
          throw Error(
            "React.Children.only expected to receive a single React element child.",
          );
        return d;
      },
    };
  return (
    (oe.Activity = O),
    (oe.Children = ue),
    (oe.Component = me),
    (oe.Fragment = N),
    (oe.Profiler = Z),
    (oe.PureComponent = Y),
    (oe.StrictMode = r),
    (oe.Suspense = M),
    (oe.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = A),
    (oe.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (d) {
        return A.H.useMemoCache(d);
      },
    }),
    (oe.cache = function (d) {
      return function () {
        return d.apply(null, arguments);
      };
    }),
    (oe.cacheSignal = function () {
      return null;
    }),
    (oe.cloneElement = function (d, E, Q) {
      if (d == null)
        throw Error(
          "The argument must be a React element, but you passed " + d + ".",
        );
      var F = H({}, d.props),
        re = d.key;
      if (E != null)
        for (ve in (E.key !== void 0 && (re = "" + E.key), E))
          !D.call(E, ve) ||
            ve === "key" ||
            ve === "__self" ||
            ve === "__source" ||
            (ve === "ref" && E.ref === void 0) ||
            (F[ve] = E[ve]);
      var ve = arguments.length - 2;
      if (ve === 1) F.children = Q;
      else if (1 < ve) {
        for (var Ne = Array(ve), $e = 0; $e < ve; $e++)
          Ne[$e] = arguments[$e + 2];
        F.children = Ne;
      }
      return k(d.type, re, F);
    }),
    (oe.createContext = function (d) {
      return (
        (d = {
          $$typeof: T,
          _currentValue: d,
          _currentValue2: d,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (d.Provider = d),
        (d.Consumer = { $$typeof: K, _context: d }),
        d
      );
    }),
    (oe.createElement = function (d, E, Q) {
      var F,
        re = {},
        ve = null;
      if (E != null)
        for (F in (E.key !== void 0 && (ve = "" + E.key), E))
          D.call(E, F) &&
            F !== "key" &&
            F !== "__self" &&
            F !== "__source" &&
            (re[F] = E[F]);
      var Ne = arguments.length - 2;
      if (Ne === 1) re.children = Q;
      else if (1 < Ne) {
        for (var $e = Array(Ne), we = 0; we < Ne; we++)
          $e[we] = arguments[we + 2];
        re.children = $e;
      }
      if (d && d.defaultProps)
        for (F in ((Ne = d.defaultProps), Ne))
          re[F] === void 0 && (re[F] = Ne[F]);
      return k(d, ve, re);
    }),
    (oe.createRef = function () {
      return { current: null };
    }),
    (oe.forwardRef = function (d) {
      return { $$typeof: U, render: d };
    }),
    (oe.isValidElement = ce),
    (oe.lazy = function (d) {
      return { $$typeof: V, _payload: { _status: -1, _result: d }, _init: W };
    }),
    (oe.memo = function (d, E) {
      return { $$typeof: v, type: d, compare: E === void 0 ? null : E };
    }),
    (oe.startTransition = function (d) {
      var E = A.T,
        Q = {};
      A.T = Q;
      try {
        var F = d(),
          re = A.S;
        (re !== null && re(Q, F),
          typeof F == "object" &&
            F !== null &&
            typeof F.then == "function" &&
            F.then(C, pe));
      } catch (ve) {
        pe(ve);
      } finally {
        (E !== null && Q.types !== null && (E.types = Q.types), (A.T = E));
      }
    }),
    (oe.unstable_useCacheRefresh = function () {
      return A.H.useCacheRefresh();
    }),
    (oe.use = function (d) {
      return A.H.use(d);
    }),
    (oe.useActionState = function (d, E, Q) {
      return A.H.useActionState(d, E, Q);
    }),
    (oe.useCallback = function (d, E) {
      return A.H.useCallback(d, E);
    }),
    (oe.useContext = function (d) {
      return A.H.useContext(d);
    }),
    (oe.useDebugValue = function () {}),
    (oe.useDeferredValue = function (d, E) {
      return A.H.useDeferredValue(d, E);
    }),
    (oe.useEffect = function (d, E) {
      return A.H.useEffect(d, E);
    }),
    (oe.useEffectEvent = function (d) {
      return A.H.useEffectEvent(d);
    }),
    (oe.useId = function () {
      return A.H.useId();
    }),
    (oe.useImperativeHandle = function (d, E, Q) {
      return A.H.useImperativeHandle(d, E, Q);
    }),
    (oe.useInsertionEffect = function (d, E) {
      return A.H.useInsertionEffect(d, E);
    }),
    (oe.useLayoutEffect = function (d, E) {
      return A.H.useLayoutEffect(d, E);
    }),
    (oe.useMemo = function (d, E) {
      return A.H.useMemo(d, E);
    }),
    (oe.useOptimistic = function (d, E) {
      return A.H.useOptimistic(d, E);
    }),
    (oe.useReducer = function (d, E, Q) {
      return A.H.useReducer(d, E, Q);
    }),
    (oe.useRef = function (d) {
      return A.H.useRef(d);
    }),
    (oe.useState = function (d) {
      return A.H.useState(d);
    }),
    (oe.useSyncExternalStore = function (d, E, Q) {
      return A.H.useSyncExternalStore(d, E, Q);
    }),
    (oe.useTransition = function () {
      return A.H.useTransition();
    }),
    (oe.version = "19.2.0"),
    oe
  );
}
var yd;
function du() {
  return (yd || ((yd = 1), (cu.exports = I0())), cu.exports);
}
var R = du();
const P0 = Td(R);
var uu = { exports: {} },
  Tn = {},
  ru = { exports: {} },
  ou = {};
var xd;
function em() {
  return (
    xd ||
      ((xd = 1),
      (function (g) {
        function j(m, q) {
          var W = m.length;
          m.push(q);
          e: for (; 0 < W; ) {
            var pe = (W - 1) >>> 1,
              ue = m[pe];
            if (0 < Z(ue, q)) ((m[pe] = q), (m[W] = ue), (W = pe));
            else break e;
          }
        }
        function N(m) {
          return m.length === 0 ? null : m[0];
        }
        function r(m) {
          if (m.length === 0) return null;
          var q = m[0],
            W = m.pop();
          if (W !== q) {
            m[0] = W;
            e: for (var pe = 0, ue = m.length, d = ue >>> 1; pe < d; ) {
              var E = 2 * (pe + 1) - 1,
                Q = m[E],
                F = E + 1,
                re = m[F];
              if (0 > Z(Q, W))
                F < ue && 0 > Z(re, Q)
                  ? ((m[pe] = re), (m[F] = W), (pe = F))
                  : ((m[pe] = Q), (m[E] = W), (pe = E));
              else if (F < ue && 0 > Z(re, W))
                ((m[pe] = re), (m[F] = W), (pe = F));
              else break e;
            }
          }
          return q;
        }
        function Z(m, q) {
          var W = m.sortIndex - q.sortIndex;
          return W !== 0 ? W : m.id - q.id;
        }
        if (
          ((g.unstable_now = void 0),
          typeof performance == "object" &&
            typeof performance.now == "function")
        ) {
          var K = performance;
          g.unstable_now = function () {
            return K.now();
          };
        } else {
          var T = Date,
            U = T.now();
          g.unstable_now = function () {
            return T.now() - U;
          };
        }
        var M = [],
          v = [],
          V = 1,
          O = null,
          G = 3,
          L = !1,
          le = !1,
          H = !1,
          ee = !1,
          me = typeof setTimeout == "function" ? setTimeout : null,
          ae = typeof clearTimeout == "function" ? clearTimeout : null,
          Y = typeof setImmediate < "u" ? setImmediate : null;
        function X(m) {
          for (var q = N(v); q !== null; ) {
            if (q.callback === null) r(v);
            else if (q.startTime <= m)
              (r(v), (q.sortIndex = q.expirationTime), j(M, q));
            else break;
            q = N(v);
          }
        }
        function B(m) {
          if (((H = !1), X(m), !le))
            if (N(M) !== null) ((le = !0), C || ((C = !0), Se()));
            else {
              var q = N(v);
              q !== null && S(B, q.startTime - m);
            }
        }
        var C = !1,
          A = -1,
          D = 5,
          k = -1;
        function P() {
          return ee ? !0 : !(g.unstable_now() - k < D);
        }
        function ce() {
          if (((ee = !1), C)) {
            var m = g.unstable_now();
            k = m;
            var q = !0;
            try {
              e: {
                ((le = !1), H && ((H = !1), ae(A), (A = -1)), (L = !0));
                var W = G;
                try {
                  t: {
                    for (
                      X(m), O = N(M);
                      O !== null && !(O.expirationTime > m && P());
                    ) {
                      var pe = O.callback;
                      if (typeof pe == "function") {
                        ((O.callback = null), (G = O.priorityLevel));
                        var ue = pe(O.expirationTime <= m);
                        if (((m = g.unstable_now()), typeof ue == "function")) {
                          ((O.callback = ue), X(m), (q = !0));
                          break t;
                        }
                        (O === N(M) && r(M), X(m));
                      } else r(M);
                      O = N(M);
                    }
                    if (O !== null) q = !0;
                    else {
                      var d = N(v);
                      (d !== null && S(B, d.startTime - m), (q = !1));
                    }
                  }
                  break e;
                } finally {
                  ((O = null), (G = W), (L = !1));
                }
                q = void 0;
              }
            } finally {
              q ? Se() : (C = !1);
            }
          }
        }
        var Se;
        if (typeof Y == "function")
          Se = function () {
            Y(ce);
          };
        else if (typeof MessageChannel < "u") {
          var He = new MessageChannel(),
            J = He.port2;
          ((He.port1.onmessage = ce),
            (Se = function () {
              J.postMessage(null);
            }));
        } else
          Se = function () {
            me(ce, 0);
          };
        function S(m, q) {
          A = me(function () {
            m(g.unstable_now());
          }, q);
        }
        ((g.unstable_IdlePriority = 5),
          (g.unstable_ImmediatePriority = 1),
          (g.unstable_LowPriority = 4),
          (g.unstable_NormalPriority = 3),
          (g.unstable_Profiling = null),
          (g.unstable_UserBlockingPriority = 2),
          (g.unstable_cancelCallback = function (m) {
            m.callback = null;
          }),
          (g.unstable_forceFrameRate = function (m) {
            0 > m || 125 < m
              ? console.error(
                  "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
                )
              : (D = 0 < m ? Math.floor(1e3 / m) : 5);
          }),
          (g.unstable_getCurrentPriorityLevel = function () {
            return G;
          }),
          (g.unstable_next = function (m) {
            switch (G) {
              case 1:
              case 2:
              case 3:
                var q = 3;
                break;
              default:
                q = G;
            }
            var W = G;
            G = q;
            try {
              return m();
            } finally {
              G = W;
            }
          }),
          (g.unstable_requestPaint = function () {
            ee = !0;
          }),
          (g.unstable_runWithPriority = function (m, q) {
            switch (m) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                m = 3;
            }
            var W = G;
            G = m;
            try {
              return q();
            } finally {
              G = W;
            }
          }),
          (g.unstable_scheduleCallback = function (m, q, W) {
            var pe = g.unstable_now();
            switch (
              (typeof W == "object" && W !== null
                ? ((W = W.delay),
                  (W = typeof W == "number" && 0 < W ? pe + W : pe))
                : (W = pe),
              m)
            ) {
              case 1:
                var ue = -1;
                break;
              case 2:
                ue = 250;
                break;
              case 5:
                ue = 1073741823;
                break;
              case 4:
                ue = 1e4;
                break;
              default:
                ue = 5e3;
            }
            return (
              (ue = W + ue),
              (m = {
                id: V++,
                callback: q,
                priorityLevel: m,
                startTime: W,
                expirationTime: ue,
                sortIndex: -1,
              }),
              W > pe
                ? ((m.sortIndex = W),
                  j(v, m),
                  N(M) === null &&
                    m === N(v) &&
                    (H ? (ae(A), (A = -1)) : (H = !0), S(B, W - pe)))
                : ((m.sortIndex = ue),
                  j(M, m),
                  le || L || ((le = !0), C || ((C = !0), Se()))),
              m
            );
          }),
          (g.unstable_shouldYield = P),
          (g.unstable_wrapCallback = function (m) {
            var q = G;
            return function () {
              var W = G;
              G = q;
              try {
                return m.apply(this, arguments);
              } finally {
                G = W;
              }
            };
          }));
      })(ou)),
    ou
  );
}
var jd;
function tm() {
  return (jd || ((jd = 1), (ru.exports = em())), ru.exports);
}
var fu = { exports: {} },
  tt = {};
var bd;
function am() {
  if (bd) return tt;
  bd = 1;
  var g = du();
  function j(M) {
    var v = "https://react.dev/errors/" + M;
    if (1 < arguments.length) {
      v += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var V = 2; V < arguments.length; V++)
        v += "&args[]=" + encodeURIComponent(arguments[V]);
    }
    return (
      "Minified React error #" +
      M +
      "; visit " +
      v +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function N() {}
  var r = {
      d: {
        f: N,
        r: function () {
          throw Error(j(522));
        },
        D: N,
        C: N,
        L: N,
        m: N,
        X: N,
        S: N,
        M: N,
      },
      p: 0,
      findDOMNode: null,
    },
    Z = Symbol.for("react.portal");
  function K(M, v, V) {
    var O =
      3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: Z,
      key: O == null ? null : "" + O,
      children: M,
      containerInfo: v,
      implementation: V,
    };
  }
  var T = g.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function U(M, v) {
    if (M === "font") return "";
    if (typeof v == "string") return v === "use-credentials" ? v : "";
  }
  return (
    (tt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r),
    (tt.createPortal = function (M, v) {
      var V =
        2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!v || (v.nodeType !== 1 && v.nodeType !== 9 && v.nodeType !== 11))
        throw Error(j(299));
      return K(M, v, null, V);
    }),
    (tt.flushSync = function (M) {
      var v = T.T,
        V = r.p;
      try {
        if (((T.T = null), (r.p = 2), M)) return M();
      } finally {
        ((T.T = v), (r.p = V), r.d.f());
      }
    }),
    (tt.preconnect = function (M, v) {
      typeof M == "string" &&
        (v
          ? ((v = v.crossOrigin),
            (v =
              typeof v == "string"
                ? v === "use-credentials"
                  ? v
                  : ""
                : void 0))
          : (v = null),
        r.d.C(M, v));
    }),
    (tt.prefetchDNS = function (M) {
      typeof M == "string" && r.d.D(M);
    }),
    (tt.preinit = function (M, v) {
      if (typeof M == "string" && v && typeof v.as == "string") {
        var V = v.as,
          O = U(V, v.crossOrigin),
          G = typeof v.integrity == "string" ? v.integrity : void 0,
          L = typeof v.fetchPriority == "string" ? v.fetchPriority : void 0;
        V === "style"
          ? r.d.S(M, typeof v.precedence == "string" ? v.precedence : void 0, {
              crossOrigin: O,
              integrity: G,
              fetchPriority: L,
            })
          : V === "script" &&
            r.d.X(M, {
              crossOrigin: O,
              integrity: G,
              fetchPriority: L,
              nonce: typeof v.nonce == "string" ? v.nonce : void 0,
            });
      }
    }),
    (tt.preinitModule = function (M, v) {
      if (typeof M == "string")
        if (typeof v == "object" && v !== null) {
          if (v.as == null || v.as === "script") {
            var V = U(v.as, v.crossOrigin);
            r.d.M(M, {
              crossOrigin: V,
              integrity: typeof v.integrity == "string" ? v.integrity : void 0,
              nonce: typeof v.nonce == "string" ? v.nonce : void 0,
            });
          }
        } else v == null && r.d.M(M);
    }),
    (tt.preload = function (M, v) {
      if (
        typeof M == "string" &&
        typeof v == "object" &&
        v !== null &&
        typeof v.as == "string"
      ) {
        var V = v.as,
          O = U(V, v.crossOrigin);
        r.d.L(M, V, {
          crossOrigin: O,
          integrity: typeof v.integrity == "string" ? v.integrity : void 0,
          nonce: typeof v.nonce == "string" ? v.nonce : void 0,
          type: typeof v.type == "string" ? v.type : void 0,
          fetchPriority:
            typeof v.fetchPriority == "string" ? v.fetchPriority : void 0,
          referrerPolicy:
            typeof v.referrerPolicy == "string" ? v.referrerPolicy : void 0,
          imageSrcSet:
            typeof v.imageSrcSet == "string" ? v.imageSrcSet : void 0,
          imageSizes: typeof v.imageSizes == "string" ? v.imageSizes : void 0,
          media: typeof v.media == "string" ? v.media : void 0,
        });
      }
    }),
    (tt.preloadModule = function (M, v) {
      if (typeof M == "string")
        if (v) {
          var V = U(v.as, v.crossOrigin);
          r.d.m(M, {
            as: typeof v.as == "string" && v.as !== "script" ? v.as : void 0,
            crossOrigin: V,
            integrity: typeof v.integrity == "string" ? v.integrity : void 0,
          });
        } else r.d.m(M);
    }),
    (tt.requestFormReset = function (M) {
      r.d.r(M);
    }),
    (tt.unstable_batchedUpdates = function (M, v) {
      return M(v);
    }),
    (tt.useFormState = function (M, v, V) {
      return T.H.useFormState(M, v, V);
    }),
    (tt.useFormStatus = function () {
      return T.H.useHostTransitionStatus();
    }),
    (tt.version = "19.2.0"),
    tt
  );
}
var Sd;
function lm() {
  if (Sd) return fu.exports;
  Sd = 1;
  function g() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(g);
      } catch (j) {
        console.error(j);
      }
  }
  return (g(), (fu.exports = am()), fu.exports);
}
var Nd;
function nm() {
  if (Nd) return Tn;
  Nd = 1;
  var g = tm(),
    j = du(),
    N = lm();
  function r(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var a = 2; a < arguments.length; a++)
        t += "&args[]=" + encodeURIComponent(arguments[a]);
    }
    return (
      "Minified React error #" +
      e +
      "; visit " +
      t +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function Z(e) {
    return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
  }
  function K(e) {
    var t = e,
      a = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do ((t = e), (t.flags & 4098) !== 0 && (a = t.return), (e = t.return));
      while (e);
    }
    return t.tag === 3 ? a : null;
  }
  function T(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (
        (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
        t !== null)
      )
        return t.dehydrated;
    }
    return null;
  }
  function U(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if (
        (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
        t !== null)
      )
        return t.dehydrated;
    }
    return null;
  }
  function M(e) {
    if (K(e) !== e) throw Error(r(188));
  }
  function v(e) {
    var t = e.alternate;
    if (!t) {
      if (((t = K(e)), t === null)) throw Error(r(188));
      return t !== e ? null : e;
    }
    for (var a = e, l = t; ; ) {
      var n = a.return;
      if (n === null) break;
      var i = n.alternate;
      if (i === null) {
        if (((l = n.return), l !== null)) {
          a = l;
          continue;
        }
        break;
      }
      if (n.child === i.child) {
        for (i = n.child; i; ) {
          if (i === a) return (M(n), e);
          if (i === l) return (M(n), t);
          i = i.sibling;
        }
        throw Error(r(188));
      }
      if (a.return !== l.return) ((a = n), (l = i));
      else {
        for (var c = !1, u = n.child; u; ) {
          if (u === a) {
            ((c = !0), (a = n), (l = i));
            break;
          }
          if (u === l) {
            ((c = !0), (l = n), (a = i));
            break;
          }
          u = u.sibling;
        }
        if (!c) {
          for (u = i.child; u; ) {
            if (u === a) {
              ((c = !0), (a = i), (l = n));
              break;
            }
            if (u === l) {
              ((c = !0), (l = i), (a = n));
              break;
            }
            u = u.sibling;
          }
          if (!c) throw Error(r(189));
        }
      }
      if (a.alternate !== l) throw Error(r(190));
    }
    if (a.tag !== 3) throw Error(r(188));
    return a.stateNode.current === a ? e : t;
  }
  function V(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (((t = V(e)), t !== null)) return t;
      e = e.sibling;
    }
    return null;
  }
  var O = Object.assign,
    G = Symbol.for("react.element"),
    L = Symbol.for("react.transitional.element"),
    le = Symbol.for("react.portal"),
    H = Symbol.for("react.fragment"),
    ee = Symbol.for("react.strict_mode"),
    me = Symbol.for("react.profiler"),
    ae = Symbol.for("react.consumer"),
    Y = Symbol.for("react.context"),
    X = Symbol.for("react.forward_ref"),
    B = Symbol.for("react.suspense"),
    C = Symbol.for("react.suspense_list"),
    A = Symbol.for("react.memo"),
    D = Symbol.for("react.lazy"),
    k = Symbol.for("react.activity"),
    P = Symbol.for("react.memo_cache_sentinel"),
    ce = Symbol.iterator;
  function Se(e) {
    return e === null || typeof e != "object"
      ? null
      : ((e = (ce && e[ce]) || e["@@iterator"]),
        typeof e == "function" ? e : null);
  }
  var He = Symbol.for("react.client.reference");
  function J(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === He ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case H:
        return "Fragment";
      case me:
        return "Profiler";
      case ee:
        return "StrictMode";
      case B:
        return "Suspense";
      case C:
        return "SuspenseList";
      case k:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case le:
          return "Portal";
        case Y:
          return e.displayName || "Context";
        case ae:
          return (e._context.displayName || "Context") + ".Consumer";
        case X:
          var t = e.render;
          return (
            (e = e.displayName),
            e ||
              ((e = t.displayName || t.name || ""),
              (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
            e
          );
        case A:
          return (
            (t = e.displayName || null),
            t !== null ? t : J(e.type) || "Memo"
          );
        case D:
          ((t = e._payload), (e = e._init));
          try {
            return J(e(t));
          } catch {}
      }
    return null;
  }
  var S = Array.isArray,
    m = j.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    q = N.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    W = { pending: !1, data: null, method: null, action: null },
    pe = [],
    ue = -1;
  function d(e) {
    return { current: e };
  }
  function E(e) {
    0 > ue || ((e.current = pe[ue]), (pe[ue] = null), ue--);
  }
  function Q(e, t) {
    (ue++, (pe[ue] = e.current), (e.current = t));
  }
  var F = d(null),
    re = d(null),
    ve = d(null),
    Ne = d(null);
  function $e(e, t) {
    switch ((Q(ve, t), Q(re, e), Q(F, null), t.nodeType)) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? Bf(e) : 0;
        break;
      default:
        if (((e = t.tagName), (t = t.namespaceURI)))
          ((t = Bf(t)), (e = Zf(t, e)));
        else
          switch (e) {
            case "svg":
              e = 1;
              break;
            case "math":
              e = 2;
              break;
            default:
              e = 0;
          }
    }
    (E(F), Q(F, e));
  }
  function we() {
    (E(F), E(re), E(ve));
  }
  function wa(e) {
    e.memoizedState !== null && Q(Ne, e);
    var t = F.current,
      a = Zf(t, e.type);
    t !== a && (Q(re, e), Q(F, a));
  }
  function Ja(e) {
    (re.current === e && (E(F), E(re)),
      Ne.current === e && (E(Ne), (bn._currentValue = W)));
  }
  var $, de;
  function ie(e) {
    if ($ === void 0)
      try {
        throw Error();
      } catch (a) {
        var t = a.stack.trim().match(/\n( *(at )?)/);
        (($ = (t && t[1]) || ""),
          (de =
            -1 <
            a.stack.indexOf(`
    at`)
              ? " (<anonymous>)"
              : -1 < a.stack.indexOf("@")
                ? "@unknown:0:0"
                : ""));
      }
    return (
      `
` +
      $ +
      e +
      de
    );
  }
  var Ct = !1;
  function Ea(e, t) {
    if (!e || Ct) return "";
    Ct = !0;
    var a = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var l = {
        DetermineComponentFrameRoot: function () {
          try {
            if (t) {
              var z = function () {
                throw Error();
              };
              if (
                (Object.defineProperty(z.prototype, "props", {
                  set: function () {
                    throw Error();
                  },
                }),
                typeof Reflect == "object" && Reflect.construct)
              ) {
                try {
                  Reflect.construct(z, []);
                } catch (b) {
                  var x = b;
                }
                Reflect.construct(e, [], z);
              } else {
                try {
                  z.call();
                } catch (b) {
                  x = b;
                }
                e.call(z.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (b) {
                x = b;
              }
              (z = e()) &&
                typeof z.catch == "function" &&
                z.catch(function () {});
            }
          } catch (b) {
            if (b && x && typeof b.stack == "string") return [b.stack, x.stack];
          }
          return [null, null];
        },
      };
      l.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var n = Object.getOwnPropertyDescriptor(
        l.DetermineComponentFrameRoot,
        "name",
      );
      n &&
        n.configurable &&
        Object.defineProperty(l.DetermineComponentFrameRoot, "name", {
          value: "DetermineComponentFrameRoot",
        });
      var i = l.DetermineComponentFrameRoot(),
        c = i[0],
        u = i[1];
      if (c && u) {
        var o = c.split(`
`),
          y = u.split(`
`);
        for (
          n = l = 0;
          l < o.length && !o[l].includes("DetermineComponentFrameRoot");
        )
          l++;
        for (; n < y.length && !y[n].includes("DetermineComponentFrameRoot"); )
          n++;
        if (l === o.length || n === y.length)
          for (
            l = o.length - 1, n = y.length - 1;
            1 <= l && 0 <= n && o[l] !== y[n];
          )
            n--;
        for (; 1 <= l && 0 <= n; l--, n--)
          if (o[l] !== y[n]) {
            if (l !== 1 || n !== 1)
              do
                if ((l--, n--, 0 > n || o[l] !== y[n])) {
                  var _ =
                    `
` + o[l].replace(" at new ", " at ");
                  return (
                    e.displayName &&
                      _.includes("<anonymous>") &&
                      (_ = _.replace("<anonymous>", e.displayName)),
                    _
                  );
                }
              while (1 <= l && 0 <= n);
            break;
          }
      }
    } finally {
      ((Ct = !1), (Error.prepareStackTrace = a));
    }
    return (a = e ? e.displayName || e.name : "") ? ie(a) : "";
  }
  function wd(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return ie(e.type);
      case 16:
        return ie("Lazy");
      case 13:
        return e.child !== t && t !== null
          ? ie("Suspense Fallback")
          : ie("Suspense");
      case 19:
        return ie("SuspenseList");
      case 0:
      case 15:
        return Ea(e.type, !1);
      case 11:
        return Ea(e.type.render, !1);
      case 1:
        return Ea(e.type, !0);
      case 31:
        return ie("Activity");
      default:
        return "";
    }
  }
  function hu(e) {
    try {
      var t = "",
        a = null;
      do ((t += wd(e, a)), (a = e), (e = e.return));
      while (e);
      return t;
    } catch (l) {
      return (
        `
Error generating stack: ` +
        l.message +
        `
` +
        l.stack
      );
    }
  }
  var Vs = Object.prototype.hasOwnProperty,
    Ks = g.unstable_scheduleCallback,
    Js = g.unstable_cancelCallback,
    Ed = g.unstable_shouldYield,
    zd = g.unstable_requestPaint,
    ot = g.unstable_now,
    Md = g.unstable_getCurrentPriorityLevel,
    mu = g.unstable_ImmediatePriority,
    vu = g.unstable_UserBlockingPriority,
    En = g.unstable_NormalPriority,
    Rd = g.unstable_LowPriority,
    pu = g.unstable_IdlePriority,
    Od = g.log,
    Cd = g.unstable_setDisableYieldValue,
    Ol = null,
    ft = null;
  function aa(e) {
    if (
      (typeof Od == "function" && Cd(e),
      ft && typeof ft.setStrictMode == "function")
    )
      try {
        ft.setStrictMode(Ol, e);
      } catch {}
  }
  var dt = Math.clz32 ? Math.clz32 : Ud,
    Dd = Math.log,
    qd = Math.LN2;
  function Ud(e) {
    return ((e >>>= 0), e === 0 ? 32 : (31 - ((Dd(e) / qd) | 0)) | 0);
  }
  var zn = 256,
    Mn = 262144,
    Rn = 4194304;
  function za(e) {
    var t = e & 42;
    if (t !== 0) return t;
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return e & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return e;
    }
  }
  function On(e, t, a) {
    var l = e.pendingLanes;
    if (l === 0) return 0;
    var n = 0,
      i = e.suspendedLanes,
      c = e.pingedLanes;
    e = e.warmLanes;
    var u = l & 134217727;
    return (
      u !== 0
        ? ((l = u & ~i),
          l !== 0
            ? (n = za(l))
            : ((c &= u),
              c !== 0
                ? (n = za(c))
                : a || ((a = u & ~e), a !== 0 && (n = za(a)))))
        : ((u = l & ~i),
          u !== 0
            ? (n = za(u))
            : c !== 0
              ? (n = za(c))
              : a || ((a = l & ~e), a !== 0 && (n = za(a)))),
      n === 0
        ? 0
        : t !== 0 &&
            t !== n &&
            (t & i) === 0 &&
            ((i = n & -n),
            (a = t & -t),
            i >= a || (i === 32 && (a & 4194048) !== 0))
          ? t
          : n
    );
  }
  function Cl(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function Hd(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function gu() {
    var e = Rn;
    return ((Rn <<= 1), (Rn & 62914560) === 0 && (Rn = 4194304), e);
  }
  function ks(e) {
    for (var t = [], a = 0; 31 > a; a++) t.push(e);
    return t;
  }
  function Dl(e, t) {
    ((e.pendingLanes |= t),
      t !== 268435456 &&
        ((e.suspendedLanes = 0), (e.pingedLanes = 0), (e.warmLanes = 0)));
  }
  function Bd(e, t, a, l, n, i) {
    var c = e.pendingLanes;
    ((e.pendingLanes = a),
      (e.suspendedLanes = 0),
      (e.pingedLanes = 0),
      (e.warmLanes = 0),
      (e.expiredLanes &= a),
      (e.entangledLanes &= a),
      (e.errorRecoveryDisabledLanes &= a),
      (e.shellSuspendCounter = 0));
    var u = e.entanglements,
      o = e.expirationTimes,
      y = e.hiddenUpdates;
    for (a = c & ~a; 0 < a; ) {
      var _ = 31 - dt(a),
        z = 1 << _;
      ((u[_] = 0), (o[_] = -1));
      var x = y[_];
      if (x !== null)
        for (y[_] = null, _ = 0; _ < x.length; _++) {
          var b = x[_];
          b !== null && (b.lane &= -536870913);
        }
      a &= ~z;
    }
    (l !== 0 && yu(e, l, 0),
      i !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= i & ~(c & ~t)));
  }
  function yu(e, t, a) {
    ((e.pendingLanes |= t), (e.suspendedLanes &= ~t));
    var l = 31 - dt(t);
    ((e.entangledLanes |= t),
      (e.entanglements[l] = e.entanglements[l] | 1073741824 | (a & 261930)));
  }
  function xu(e, t) {
    var a = (e.entangledLanes |= t);
    for (e = e.entanglements; a; ) {
      var l = 31 - dt(a),
        n = 1 << l;
      ((n & t) | (e[l] & t) && (e[l] |= t), (a &= ~n));
    }
  }
  function ju(e, t) {
    var a = t & -t;
    return (
      (a = (a & 42) !== 0 ? 1 : $s(a)),
      (a & (e.suspendedLanes | t)) !== 0 ? 0 : a
    );
  }
  function $s(e) {
    switch (e) {
      case 2:
        e = 1;
        break;
      case 8:
        e = 4;
        break;
      case 32:
        e = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        e = 128;
        break;
      case 268435456:
        e = 134217728;
        break;
      default:
        e = 0;
    }
    return e;
  }
  function Fs(e) {
    return (
      (e &= -e),
      2 < e ? (8 < e ? ((e & 134217727) !== 0 ? 32 : 268435456) : 8) : 2
    );
  }
  function bu() {
    var e = q.p;
    return e !== 0 ? e : ((e = window.event), e === void 0 ? 32 : ud(e.type));
  }
  function Su(e, t) {
    var a = q.p;
    try {
      return ((q.p = e), t());
    } finally {
      q.p = a;
    }
  }
  var la = Math.random().toString(36).slice(2),
    Fe = "__reactFiber$" + la,
    lt = "__reactProps$" + la,
    ka = "__reactContainer$" + la,
    Ws = "__reactEvents$" + la,
    Zd = "__reactListeners$" + la,
    Yd = "__reactHandles$" + la,
    Nu = "__reactResources$" + la,
    ql = "__reactMarker$" + la;
  function Is(e) {
    (delete e[Fe], delete e[lt], delete e[Ws], delete e[Zd], delete e[Yd]);
  }
  function $a(e) {
    var t = e[Fe];
    if (t) return t;
    for (var a = e.parentNode; a; ) {
      if ((t = a[ka] || a[Fe])) {
        if (
          ((a = t.alternate),
          t.child !== null || (a !== null && a.child !== null))
        )
          for (e = Kf(e); e !== null; ) {
            if ((a = e[Fe])) return a;
            e = Kf(e);
          }
        return t;
      }
      ((e = a), (a = e.parentNode));
    }
    return null;
  }
  function Fa(e) {
    if ((e = e[Fe] || e[ka])) {
      var t = e.tag;
      if (
        t === 5 ||
        t === 6 ||
        t === 13 ||
        t === 31 ||
        t === 26 ||
        t === 27 ||
        t === 3
      )
        return e;
    }
    return null;
  }
  function Ul(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(r(33));
  }
  function Wa(e) {
    var t = e[Nu];
    return (
      t ||
        (t = e[Nu] =
          { hoistableStyles: new Map(), hoistableScripts: new Map() }),
      t
    );
  }
  function Je(e) {
    e[ql] = !0;
  }
  var _u = new Set(),
    Au = {};
  function Ma(e, t) {
    (Ia(e, t), Ia(e + "Capture", t));
  }
  function Ia(e, t) {
    for (Au[e] = t, e = 0; e < t.length; e++) _u.add(t[e]);
  }
  var Ld = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$",
    ),
    Tu = {},
    wu = {};
  function Gd(e) {
    return Vs.call(wu, e)
      ? !0
      : Vs.call(Tu, e)
        ? !1
        : Ld.test(e)
          ? (wu[e] = !0)
          : ((Tu[e] = !0), !1);
  }
  function Cn(e, t, a) {
    if (Gd(t))
      if (a === null) e.removeAttribute(t);
      else {
        switch (typeof a) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var l = t.toLowerCase().slice(0, 5);
            if (l !== "data-" && l !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + a);
      }
  }
  function Dn(e, t, a) {
    if (a === null) e.removeAttribute(t);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, "" + a);
    }
  }
  function Bt(e, t, a, l) {
    if (l === null) e.removeAttribute(a);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(a);
          return;
      }
      e.setAttributeNS(t, a, "" + l);
    }
  }
  function jt(e) {
    switch (typeof e) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function Eu(e) {
    var t = e.type;
    return (
      (e = e.nodeName) &&
      e.toLowerCase() === "input" &&
      (t === "checkbox" || t === "radio")
    );
  }
  function Xd(e, t, a) {
    var l = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
    if (
      !e.hasOwnProperty(t) &&
      typeof l < "u" &&
      typeof l.get == "function" &&
      typeof l.set == "function"
    ) {
      var n = l.get,
        i = l.set;
      return (
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function () {
            return n.call(this);
          },
          set: function (c) {
            ((a = "" + c), i.call(this, c));
          },
        }),
        Object.defineProperty(e, t, { enumerable: l.enumerable }),
        {
          getValue: function () {
            return a;
          },
          setValue: function (c) {
            a = "" + c;
          },
          stopTracking: function () {
            ((e._valueTracker = null), delete e[t]);
          },
        }
      );
    }
  }
  function Ps(e) {
    if (!e._valueTracker) {
      var t = Eu(e) ? "checked" : "value";
      e._valueTracker = Xd(e, t, "" + e[t]);
    }
  }
  function zu(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var a = t.getValue(),
      l = "";
    return (
      e && (l = Eu(e) ? (e.checked ? "true" : "false") : e.value),
      (e = l),
      e !== a ? (t.setValue(e), !0) : !1
    );
  }
  function qn(e) {
    if (
      ((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u")
    )
      return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var Qd = /[\n"\\]/g;
  function bt(e) {
    return e.replace(Qd, function (t) {
      return "\\" + t.charCodeAt(0).toString(16) + " ";
    });
  }
  function ei(e, t, a, l, n, i, c, u) {
    ((e.name = ""),
      c != null &&
      typeof c != "function" &&
      typeof c != "symbol" &&
      typeof c != "boolean"
        ? (e.type = c)
        : e.removeAttribute("type"),
      t != null
        ? c === "number"
          ? ((t === 0 && e.value === "") || e.value != t) &&
            (e.value = "" + jt(t))
          : e.value !== "" + jt(t) && (e.value = "" + jt(t))
        : (c !== "submit" && c !== "reset") || e.removeAttribute("value"),
      t != null
        ? ti(e, c, jt(t))
        : a != null
          ? ti(e, c, jt(a))
          : l != null && e.removeAttribute("value"),
      n == null && i != null && (e.defaultChecked = !!i),
      n != null &&
        (e.checked = n && typeof n != "function" && typeof n != "symbol"),
      u != null &&
      typeof u != "function" &&
      typeof u != "symbol" &&
      typeof u != "boolean"
        ? (e.name = "" + jt(u))
        : e.removeAttribute("name"));
  }
  function Mu(e, t, a, l, n, i, c, u) {
    if (
      (i != null &&
        typeof i != "function" &&
        typeof i != "symbol" &&
        typeof i != "boolean" &&
        (e.type = i),
      t != null || a != null)
    ) {
      if (!((i !== "submit" && i !== "reset") || t != null)) {
        Ps(e);
        return;
      }
      ((a = a != null ? "" + jt(a) : ""),
        (t = t != null ? "" + jt(t) : a),
        u || t === e.value || (e.value = t),
        (e.defaultValue = t));
    }
    ((l = l ?? n),
      (l = typeof l != "function" && typeof l != "symbol" && !!l),
      (e.checked = u ? e.checked : !!l),
      (e.defaultChecked = !!l),
      c != null &&
        typeof c != "function" &&
        typeof c != "symbol" &&
        typeof c != "boolean" &&
        (e.name = c),
      Ps(e));
  }
  function ti(e, t, a) {
    (t === "number" && qn(e.ownerDocument) === e) ||
      e.defaultValue === "" + a ||
      (e.defaultValue = "" + a);
  }
  function Pa(e, t, a, l) {
    if (((e = e.options), t)) {
      t = {};
      for (var n = 0; n < a.length; n++) t["$" + a[n]] = !0;
      for (a = 0; a < e.length; a++)
        ((n = t.hasOwnProperty("$" + e[a].value)),
          e[a].selected !== n && (e[a].selected = n),
          n && l && (e[a].defaultSelected = !0));
    } else {
      for (a = "" + jt(a), t = null, n = 0; n < e.length; n++) {
        if (e[n].value === a) {
          ((e[n].selected = !0), l && (e[n].defaultSelected = !0));
          return;
        }
        t !== null || e[n].disabled || (t = e[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Ru(e, t, a) {
    if (
      t != null &&
      ((t = "" + jt(t)), t !== e.value && (e.value = t), a == null)
    ) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = a != null ? "" + jt(a) : "";
  }
  function Ou(e, t, a, l) {
    if (t == null) {
      if (l != null) {
        if (a != null) throw Error(r(92));
        if (S(l)) {
          if (1 < l.length) throw Error(r(93));
          l = l[0];
        }
        a = l;
      }
      (a == null && (a = ""), (t = a));
    }
    ((a = jt(t)),
      (e.defaultValue = a),
      (l = e.textContent),
      l === a && l !== "" && l !== null && (e.value = l),
      Ps(e));
  }
  function el(e, t) {
    if (t) {
      var a = e.firstChild;
      if (a && a === e.lastChild && a.nodeType === 3) {
        a.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Vd = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " ",
    ),
  );
  function Cu(e, t, a) {
    var l = t.indexOf("--") === 0;
    a == null || typeof a == "boolean" || a === ""
      ? l
        ? e.setProperty(t, "")
        : t === "float"
          ? (e.cssFloat = "")
          : (e[t] = "")
      : l
        ? e.setProperty(t, a)
        : typeof a != "number" || a === 0 || Vd.has(t)
          ? t === "float"
            ? (e.cssFloat = a)
            : (e[t] = ("" + a).trim())
          : (e[t] = a + "px");
  }
  function Du(e, t, a) {
    if (t != null && typeof t != "object") throw Error(r(62));
    if (((e = e.style), a != null)) {
      for (var l in a)
        !a.hasOwnProperty(l) ||
          (t != null && t.hasOwnProperty(l)) ||
          (l.indexOf("--") === 0
            ? e.setProperty(l, "")
            : l === "float"
              ? (e.cssFloat = "")
              : (e[l] = ""));
      for (var n in t)
        ((l = t[n]), t.hasOwnProperty(n) && a[n] !== l && Cu(e, n, l));
    } else for (var i in t) t.hasOwnProperty(i) && Cu(e, i, t[i]);
  }
  function ai(e) {
    if (e.indexOf("-") === -1) return !1;
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Kd = new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"],
    ]),
    Jd =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Un(e) {
    return Jd.test("" + e)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : e;
  }
  function Zt() {}
  var li = null;
  function ni(e) {
    return (
      (e = e.target || e.srcElement || window),
      e.correspondingUseElement && (e = e.correspondingUseElement),
      e.nodeType === 3 ? e.parentNode : e
    );
  }
  var tl = null,
    al = null;
  function qu(e) {
    var t = Fa(e);
    if (t && (e = t.stateNode)) {
      var a = e[lt] || null;
      e: switch (((e = t.stateNode), t.type)) {
        case "input":
          if (
            (ei(
              e,
              a.value,
              a.defaultValue,
              a.defaultValue,
              a.checked,
              a.defaultChecked,
              a.type,
              a.name,
            ),
            (t = a.name),
            a.type === "radio" && t != null)
          ) {
            for (a = e; a.parentNode; ) a = a.parentNode;
            for (
              a = a.querySelectorAll(
                'input[name="' + bt("" + t) + '"][type="radio"]',
              ),
                t = 0;
              t < a.length;
              t++
            ) {
              var l = a[t];
              if (l !== e && l.form === e.form) {
                var n = l[lt] || null;
                if (!n) throw Error(r(90));
                ei(
                  l,
                  n.value,
                  n.defaultValue,
                  n.defaultValue,
                  n.checked,
                  n.defaultChecked,
                  n.type,
                  n.name,
                );
              }
            }
            for (t = 0; t < a.length; t++)
              ((l = a[t]), l.form === e.form && zu(l));
          }
          break e;
        case "textarea":
          Ru(e, a.value, a.defaultValue);
          break e;
        case "select":
          ((t = a.value), t != null && Pa(e, !!a.multiple, t, !1));
      }
    }
  }
  var si = !1;
  function Uu(e, t, a) {
    if (si) return e(t, a);
    si = !0;
    try {
      var l = e(t);
      return l;
    } finally {
      if (
        ((si = !1),
        (tl !== null || al !== null) &&
          (Ns(), tl && ((t = tl), (e = al), (al = tl = null), qu(t), e)))
      )
        for (t = 0; t < e.length; t++) qu(e[t]);
    }
  }
  function Hl(e, t) {
    var a = e.stateNode;
    if (a === null) return null;
    var l = a[lt] || null;
    if (l === null) return null;
    a = l[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        ((l = !l.disabled) ||
          ((e = e.type),
          (l = !(
            e === "button" ||
            e === "input" ||
            e === "select" ||
            e === "textarea"
          ))),
          (e = !l));
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (a && typeof a != "function") throw Error(r(231, t, typeof a));
    return a;
  }
  var Yt = !(
      typeof window > "u" ||
      typeof window.document > "u" ||
      typeof window.document.createElement > "u"
    ),
    ii = !1;
  if (Yt)
    try {
      var Bl = {};
      (Object.defineProperty(Bl, "passive", {
        get: function () {
          ii = !0;
        },
      }),
        window.addEventListener("test", Bl, Bl),
        window.removeEventListener("test", Bl, Bl));
    } catch {
      ii = !1;
    }
  var na = null,
    ci = null,
    Hn = null;
  function Hu() {
    if (Hn) return Hn;
    var e,
      t = ci,
      a = t.length,
      l,
      n = "value" in na ? na.value : na.textContent,
      i = n.length;
    for (e = 0; e < a && t[e] === n[e]; e++);
    var c = a - e;
    for (l = 1; l <= c && t[a - l] === n[i - l]; l++);
    return (Hn = n.slice(e, 1 < l ? 1 - l : void 0));
  }
  function Bn(e) {
    var t = e.keyCode;
    return (
      "charCode" in e
        ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
        : (e = t),
      e === 10 && (e = 13),
      32 <= e || e === 13 ? e : 0
    );
  }
  function Zn() {
    return !0;
  }
  function Bu() {
    return !1;
  }
  function nt(e) {
    function t(a, l, n, i, c) {
      ((this._reactName = a),
        (this._targetInst = n),
        (this.type = l),
        (this.nativeEvent = i),
        (this.target = c),
        (this.currentTarget = null));
      for (var u in e)
        e.hasOwnProperty(u) && ((a = e[u]), (this[u] = a ? a(i) : i[u]));
      return (
        (this.isDefaultPrevented = (
          i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1
        )
          ? Zn
          : Bu),
        (this.isPropagationStopped = Bu),
        this
      );
    }
    return (
      O(t.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a &&
            (a.preventDefault
              ? a.preventDefault()
              : typeof a.returnValue != "unknown" && (a.returnValue = !1),
            (this.isDefaultPrevented = Zn));
        },
        stopPropagation: function () {
          var a = this.nativeEvent;
          a &&
            (a.stopPropagation
              ? a.stopPropagation()
              : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0),
            (this.isPropagationStopped = Zn));
        },
        persist: function () {},
        isPersistent: Zn,
      }),
      t
    );
  }
  var Ra = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    Yn = nt(Ra),
    Zl = O({}, Ra, { view: 0, detail: 0 }),
    kd = nt(Zl),
    ui,
    ri,
    Yl,
    Ln = O({}, Zl, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: fi,
      button: 0,
      buttons: 0,
      relatedTarget: function (e) {
        return e.relatedTarget === void 0
          ? e.fromElement === e.srcElement
            ? e.toElement
            : e.fromElement
          : e.relatedTarget;
      },
      movementX: function (e) {
        return "movementX" in e
          ? e.movementX
          : (e !== Yl &&
              (Yl && e.type === "mousemove"
                ? ((ui = e.screenX - Yl.screenX), (ri = e.screenY - Yl.screenY))
                : (ri = ui = 0),
              (Yl = e)),
            ui);
      },
      movementY: function (e) {
        return "movementY" in e ? e.movementY : ri;
      },
    }),
    Zu = nt(Ln),
    $d = O({}, Ln, { dataTransfer: 0 }),
    Fd = nt($d),
    Wd = O({}, Zl, { relatedTarget: 0 }),
    oi = nt(Wd),
    Id = O({}, Ra, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Pd = nt(Id),
    eh = O({}, Ra, {
      clipboardData: function (e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      },
    }),
    th = nt(eh),
    ah = O({}, Ra, { data: 0 }),
    Yu = nt(ah),
    lh = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified",
    },
    nh = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta",
    },
    sh = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey",
    };
  function ih(e) {
    var t = this.nativeEvent;
    return t.getModifierState
      ? t.getModifierState(e)
      : (e = sh[e])
        ? !!t[e]
        : !1;
  }
  function fi() {
    return ih;
  }
  var ch = O({}, Zl, {
      key: function (e) {
        if (e.key) {
          var t = lh[e.key] || e.key;
          if (t !== "Unidentified") return t;
        }
        return e.type === "keypress"
          ? ((e = Bn(e)), e === 13 ? "Enter" : String.fromCharCode(e))
          : e.type === "keydown" || e.type === "keyup"
            ? nh[e.keyCode] || "Unidentified"
            : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: fi,
      charCode: function (e) {
        return e.type === "keypress" ? Bn(e) : 0;
      },
      keyCode: function (e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function (e) {
        return e.type === "keypress"
          ? Bn(e)
          : e.type === "keydown" || e.type === "keyup"
            ? e.keyCode
            : 0;
      },
    }),
    uh = nt(ch),
    rh = O({}, Ln, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    Lu = nt(rh),
    oh = O({}, Zl, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: fi,
    }),
    fh = nt(oh),
    dh = O({}, Ra, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    hh = nt(dh),
    mh = O({}, Ln, {
      deltaX: function (e) {
        return "deltaX" in e
          ? e.deltaX
          : "wheelDeltaX" in e
            ? -e.wheelDeltaX
            : 0;
      },
      deltaY: function (e) {
        return "deltaY" in e
          ? e.deltaY
          : "wheelDeltaY" in e
            ? -e.wheelDeltaY
            : "wheelDelta" in e
              ? -e.wheelDelta
              : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    vh = nt(mh),
    ph = O({}, Ra, { newState: 0, oldState: 0 }),
    gh = nt(ph),
    yh = [9, 13, 27, 32],
    di = Yt && "CompositionEvent" in window,
    Ll = null;
  Yt && "documentMode" in document && (Ll = document.documentMode);
  var xh = Yt && "TextEvent" in window && !Ll,
    Gu = Yt && (!di || (Ll && 8 < Ll && 11 >= Ll)),
    Xu = " ",
    Qu = !1;
  function Vu(e, t) {
    switch (e) {
      case "keyup":
        return yh.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Ku(e) {
    return (
      (e = e.detail),
      typeof e == "object" && "data" in e ? e.data : null
    );
  }
  var ll = !1;
  function jh(e, t) {
    switch (e) {
      case "compositionend":
        return Ku(t);
      case "keypress":
        return t.which !== 32 ? null : ((Qu = !0), Xu);
      case "textInput":
        return ((e = t.data), e === Xu && Qu ? null : e);
      default:
        return null;
    }
  }
  function bh(e, t) {
    if (ll)
      return e === "compositionend" || (!di && Vu(e, t))
        ? ((e = Hu()), (Hn = ci = na = null), (ll = !1), e)
        : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return Gu && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Sh = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function Ju(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Sh[e.type] : t === "textarea";
  }
  function ku(e, t, a, l) {
    (tl ? (al ? al.push(l) : (al = [l])) : (tl = l),
      (t = Ms(t, "onChange")),
      0 < t.length &&
        ((a = new Yn("onChange", "change", null, a, l)),
        e.push({ event: a, listeners: t })));
  }
  var Gl = null,
    Xl = null;
  function Nh(e) {
    Of(e, 0);
  }
  function Gn(e) {
    var t = Ul(e);
    if (zu(t)) return e;
  }
  function $u(e, t) {
    if (e === "change") return t;
  }
  var Fu = !1;
  if (Yt) {
    var hi;
    if (Yt) {
      var mi = "oninput" in document;
      if (!mi) {
        var Wu = document.createElement("div");
        (Wu.setAttribute("oninput", "return;"),
          (mi = typeof Wu.oninput == "function"));
      }
      hi = mi;
    } else hi = !1;
    Fu = hi && (!document.documentMode || 9 < document.documentMode);
  }
  function Iu() {
    Gl && (Gl.detachEvent("onpropertychange", Pu), (Xl = Gl = null));
  }
  function Pu(e) {
    if (e.propertyName === "value" && Gn(Xl)) {
      var t = [];
      (ku(t, Xl, e, ni(e)), Uu(Nh, t));
    }
  }
  function _h(e, t, a) {
    e === "focusin"
      ? (Iu(), (Gl = t), (Xl = a), Gl.attachEvent("onpropertychange", Pu))
      : e === "focusout" && Iu();
  }
  function Ah(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Gn(Xl);
  }
  function Th(e, t) {
    if (e === "click") return Gn(t);
  }
  function wh(e, t) {
    if (e === "input" || e === "change") return Gn(t);
  }
  function Eh(e, t) {
    return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
  }
  var ht = typeof Object.is == "function" ? Object.is : Eh;
  function Ql(e, t) {
    if (ht(e, t)) return !0;
    if (
      typeof e != "object" ||
      e === null ||
      typeof t != "object" ||
      t === null
    )
      return !1;
    var a = Object.keys(e),
      l = Object.keys(t);
    if (a.length !== l.length) return !1;
    for (l = 0; l < a.length; l++) {
      var n = a[l];
      if (!Vs.call(t, n) || !ht(e[n], t[n])) return !1;
    }
    return !0;
  }
  function er(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function tr(e, t) {
    var a = er(e);
    e = 0;
    for (var l; a; ) {
      if (a.nodeType === 3) {
        if (((l = e + a.textContent.length), e <= t && l >= t))
          return { node: a, offset: t - e };
        e = l;
      }
      e: {
        for (; a; ) {
          if (a.nextSibling) {
            a = a.nextSibling;
            break e;
          }
          a = a.parentNode;
        }
        a = void 0;
      }
      a = er(a);
    }
  }
  function ar(e, t) {
    return e && t
      ? e === t
        ? !0
        : e && e.nodeType === 3
          ? !1
          : t && t.nodeType === 3
            ? ar(e, t.parentNode)
            : "contains" in e
              ? e.contains(t)
              : e.compareDocumentPosition
                ? !!(e.compareDocumentPosition(t) & 16)
                : !1
      : !1;
  }
  function lr(e) {
    e =
      e != null &&
      e.ownerDocument != null &&
      e.ownerDocument.defaultView != null
        ? e.ownerDocument.defaultView
        : window;
    for (var t = qn(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var a = typeof t.contentWindow.location.href == "string";
      } catch {
        a = !1;
      }
      if (a) e = t.contentWindow;
      else break;
      t = qn(e.document);
    }
    return t;
  }
  function vi(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return (
      t &&
      ((t === "input" &&
        (e.type === "text" ||
          e.type === "search" ||
          e.type === "tel" ||
          e.type === "url" ||
          e.type === "password")) ||
        t === "textarea" ||
        e.contentEditable === "true")
    );
  }
  var zh = Yt && "documentMode" in document && 11 >= document.documentMode,
    nl = null,
    pi = null,
    Vl = null,
    gi = !1;
  function nr(e, t, a) {
    var l =
      a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
    gi ||
      nl == null ||
      nl !== qn(l) ||
      ((l = nl),
      "selectionStart" in l && vi(l)
        ? (l = { start: l.selectionStart, end: l.selectionEnd })
        : ((l = (
            (l.ownerDocument && l.ownerDocument.defaultView) ||
            window
          ).getSelection()),
          (l = {
            anchorNode: l.anchorNode,
            anchorOffset: l.anchorOffset,
            focusNode: l.focusNode,
            focusOffset: l.focusOffset,
          })),
      (Vl && Ql(Vl, l)) ||
        ((Vl = l),
        (l = Ms(pi, "onSelect")),
        0 < l.length &&
          ((t = new Yn("onSelect", "select", null, t, a)),
          e.push({ event: t, listeners: l }),
          (t.target = nl))));
  }
  function Oa(e, t) {
    var a = {};
    return (
      (a[e.toLowerCase()] = t.toLowerCase()),
      (a["Webkit" + e] = "webkit" + t),
      (a["Moz" + e] = "moz" + t),
      a
    );
  }
  var sl = {
      animationend: Oa("Animation", "AnimationEnd"),
      animationiteration: Oa("Animation", "AnimationIteration"),
      animationstart: Oa("Animation", "AnimationStart"),
      transitionrun: Oa("Transition", "TransitionRun"),
      transitionstart: Oa("Transition", "TransitionStart"),
      transitioncancel: Oa("Transition", "TransitionCancel"),
      transitionend: Oa("Transition", "TransitionEnd"),
    },
    yi = {},
    sr = {};
  Yt &&
    ((sr = document.createElement("div").style),
    "AnimationEvent" in window ||
      (delete sl.animationend.animation,
      delete sl.animationiteration.animation,
      delete sl.animationstart.animation),
    "TransitionEvent" in window || delete sl.transitionend.transition);
  function Ca(e) {
    if (yi[e]) return yi[e];
    if (!sl[e]) return e;
    var t = sl[e],
      a;
    for (a in t) if (t.hasOwnProperty(a) && a in sr) return (yi[e] = t[a]);
    return e;
  }
  var ir = Ca("animationend"),
    cr = Ca("animationiteration"),
    ur = Ca("animationstart"),
    Mh = Ca("transitionrun"),
    Rh = Ca("transitionstart"),
    Oh = Ca("transitioncancel"),
    rr = Ca("transitionend"),
    or = new Map(),
    xi =
      "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
        " ",
      );
  xi.push("scrollEnd");
  function Mt(e, t) {
    (or.set(e, t), Ma(t, [e]));
  }
  var Xn =
      typeof reportError == "function"
        ? reportError
        : function (e) {
            if (
              typeof window == "object" &&
              typeof window.ErrorEvent == "function"
            ) {
              var t = new window.ErrorEvent("error", {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof e == "object" &&
                  e !== null &&
                  typeof e.message == "string"
                    ? String(e.message)
                    : String(e),
                error: e,
              });
              if (!window.dispatchEvent(t)) return;
            } else if (
              typeof process == "object" &&
              typeof process.emit == "function"
            ) {
              process.emit("uncaughtException", e);
              return;
            }
            console.error(e);
          },
    St = [],
    il = 0,
    ji = 0;
  function Qn() {
    for (var e = il, t = (ji = il = 0); t < e; ) {
      var a = St[t];
      St[t++] = null;
      var l = St[t];
      St[t++] = null;
      var n = St[t];
      St[t++] = null;
      var i = St[t];
      if (((St[t++] = null), l !== null && n !== null)) {
        var c = l.pending;
        (c === null ? (n.next = n) : ((n.next = c.next), (c.next = n)),
          (l.pending = n));
      }
      i !== 0 && fr(a, n, i);
    }
  }
  function Vn(e, t, a, l) {
    ((St[il++] = e),
      (St[il++] = t),
      (St[il++] = a),
      (St[il++] = l),
      (ji |= l),
      (e.lanes |= l),
      (e = e.alternate),
      e !== null && (e.lanes |= l));
  }
  function bi(e, t, a, l) {
    return (Vn(e, t, a, l), Kn(e));
  }
  function Da(e, t) {
    return (Vn(e, null, null, t), Kn(e));
  }
  function fr(e, t, a) {
    e.lanes |= a;
    var l = e.alternate;
    l !== null && (l.lanes |= a);
    for (var n = !1, i = e.return; i !== null; )
      ((i.childLanes |= a),
        (l = i.alternate),
        l !== null && (l.childLanes |= a),
        i.tag === 22 &&
          ((e = i.stateNode), e === null || e._visibility & 1 || (n = !0)),
        (e = i),
        (i = i.return));
    return e.tag === 3
      ? ((i = e.stateNode),
        n &&
          t !== null &&
          ((n = 31 - dt(a)),
          (e = i.hiddenUpdates),
          (l = e[n]),
          l === null ? (e[n] = [t]) : l.push(t),
          (t.lane = a | 536870912)),
        i)
      : null;
  }
  function Kn(e) {
    if (50 < mn) throw ((mn = 0), (Mc = null), Error(r(185)));
    for (var t = e.return; t !== null; ) ((e = t), (t = e.return));
    return e.tag === 3 ? e.stateNode : null;
  }
  var cl = {};
  function Ch(e, t, a, l) {
    ((this.tag = e),
      (this.key = a),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.refCleanup = this.ref = null),
      (this.pendingProps = t),
      (this.dependencies =
        this.memoizedState =
        this.updateQueue =
        this.memoizedProps =
          null),
      (this.mode = l),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function mt(e, t, a, l) {
    return new Ch(e, t, a, l);
  }
  function Si(e) {
    return ((e = e.prototype), !(!e || !e.isReactComponent));
  }
  function Lt(e, t) {
    var a = e.alternate;
    return (
      a === null
        ? ((a = mt(e.tag, t, e.key, e.mode)),
          (a.elementType = e.elementType),
          (a.type = e.type),
          (a.stateNode = e.stateNode),
          (a.alternate = e),
          (e.alternate = a))
        : ((a.pendingProps = t),
          (a.type = e.type),
          (a.flags = 0),
          (a.subtreeFlags = 0),
          (a.deletions = null)),
      (a.flags = e.flags & 65011712),
      (a.childLanes = e.childLanes),
      (a.lanes = e.lanes),
      (a.child = e.child),
      (a.memoizedProps = e.memoizedProps),
      (a.memoizedState = e.memoizedState),
      (a.updateQueue = e.updateQueue),
      (t = e.dependencies),
      (a.dependencies =
        t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
      (a.sibling = e.sibling),
      (a.index = e.index),
      (a.ref = e.ref),
      (a.refCleanup = e.refCleanup),
      a
    );
  }
  function dr(e, t) {
    e.flags &= 65011714;
    var a = e.alternate;
    return (
      a === null
        ? ((e.childLanes = 0),
          (e.lanes = t),
          (e.child = null),
          (e.subtreeFlags = 0),
          (e.memoizedProps = null),
          (e.memoizedState = null),
          (e.updateQueue = null),
          (e.dependencies = null),
          (e.stateNode = null))
        : ((e.childLanes = a.childLanes),
          (e.lanes = a.lanes),
          (e.child = a.child),
          (e.subtreeFlags = 0),
          (e.deletions = null),
          (e.memoizedProps = a.memoizedProps),
          (e.memoizedState = a.memoizedState),
          (e.updateQueue = a.updateQueue),
          (e.type = a.type),
          (t = a.dependencies),
          (e.dependencies =
            t === null
              ? null
              : { lanes: t.lanes, firstContext: t.firstContext })),
      e
    );
  }
  function Jn(e, t, a, l, n, i) {
    var c = 0;
    if (((l = e), typeof e == "function")) Si(e) && (c = 1);
    else if (typeof e == "string")
      c = B0(e, a, F.current)
        ? 26
        : e === "html" || e === "head" || e === "body"
          ? 27
          : 5;
    else
      e: switch (e) {
        case k:
          return ((e = mt(31, a, t, n)), (e.elementType = k), (e.lanes = i), e);
        case H:
          return qa(a.children, n, i, t);
        case ee:
          ((c = 8), (n |= 24));
          break;
        case me:
          return (
            (e = mt(12, a, t, n | 2)),
            (e.elementType = me),
            (e.lanes = i),
            e
          );
        case B:
          return ((e = mt(13, a, t, n)), (e.elementType = B), (e.lanes = i), e);
        case C:
          return ((e = mt(19, a, t, n)), (e.elementType = C), (e.lanes = i), e);
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case Y:
                c = 10;
                break e;
              case ae:
                c = 9;
                break e;
              case X:
                c = 11;
                break e;
              case A:
                c = 14;
                break e;
              case D:
                ((c = 16), (l = null));
                break e;
            }
          ((c = 29),
            (a = Error(r(130, e === null ? "null" : typeof e, ""))),
            (l = null));
      }
    return (
      (t = mt(c, a, t, n)),
      (t.elementType = e),
      (t.type = l),
      (t.lanes = i),
      t
    );
  }
  function qa(e, t, a, l) {
    return ((e = mt(7, e, l, t)), (e.lanes = a), e);
  }
  function Ni(e, t, a) {
    return ((e = mt(6, e, null, t)), (e.lanes = a), e);
  }
  function hr(e) {
    var t = mt(18, null, null, 0);
    return ((t.stateNode = e), t);
  }
  function _i(e, t, a) {
    return (
      (t = mt(4, e.children !== null ? e.children : [], e.key, t)),
      (t.lanes = a),
      (t.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation,
      }),
      t
    );
  }
  var mr = new WeakMap();
  function Nt(e, t) {
    if (typeof e == "object" && e !== null) {
      var a = mr.get(e);
      return a !== void 0
        ? a
        : ((t = { value: e, source: t, stack: hu(t) }), mr.set(e, t), t);
    }
    return { value: e, source: t, stack: hu(t) };
  }
  var ul = [],
    rl = 0,
    kn = null,
    Kl = 0,
    _t = [],
    At = 0,
    sa = null,
    Dt = 1,
    qt = "";
  function Gt(e, t) {
    ((ul[rl++] = Kl), (ul[rl++] = kn), (kn = e), (Kl = t));
  }
  function vr(e, t, a) {
    ((_t[At++] = Dt), (_t[At++] = qt), (_t[At++] = sa), (sa = e));
    var l = Dt;
    e = qt;
    var n = 32 - dt(l) - 1;
    ((l &= ~(1 << n)), (a += 1));
    var i = 32 - dt(t) + n;
    if (30 < i) {
      var c = n - (n % 5);
      ((i = (l & ((1 << c) - 1)).toString(32)),
        (l >>= c),
        (n -= c),
        (Dt = (1 << (32 - dt(t) + n)) | (a << n) | l),
        (qt = i + e));
    } else ((Dt = (1 << i) | (a << n) | l), (qt = e));
  }
  function Ai(e) {
    e.return !== null && (Gt(e, 1), vr(e, 1, 0));
  }
  function Ti(e) {
    for (; e === kn; )
      ((kn = ul[--rl]), (ul[rl] = null), (Kl = ul[--rl]), (ul[rl] = null));
    for (; e === sa; )
      ((sa = _t[--At]),
        (_t[At] = null),
        (qt = _t[--At]),
        (_t[At] = null),
        (Dt = _t[--At]),
        (_t[At] = null));
  }
  function pr(e, t) {
    ((_t[At++] = Dt),
      (_t[At++] = qt),
      (_t[At++] = sa),
      (Dt = t.id),
      (qt = t.overflow),
      (sa = e));
  }
  var We = null,
    De = null,
    be = !1,
    ia = null,
    Tt = !1,
    wi = Error(r(519));
  function ca(e) {
    var t = Error(
      r(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1]
          ? "text"
          : "HTML",
        "",
      ),
    );
    throw (Jl(Nt(t, e)), wi);
  }
  function gr(e) {
    var t = e.stateNode,
      a = e.type,
      l = e.memoizedProps;
    switch (((t[Fe] = e), (t[lt] = l), a)) {
      case "dialog":
        (ye("cancel", t), ye("close", t));
        break;
      case "iframe":
      case "object":
      case "embed":
        ye("load", t);
        break;
      case "video":
      case "audio":
        for (a = 0; a < pn.length; a++) ye(pn[a], t);
        break;
      case "source":
        ye("error", t);
        break;
      case "img":
      case "image":
      case "link":
        (ye("error", t), ye("load", t));
        break;
      case "details":
        ye("toggle", t);
        break;
      case "input":
        (ye("invalid", t),
          Mu(
            t,
            l.value,
            l.defaultValue,
            l.checked,
            l.defaultChecked,
            l.type,
            l.name,
            !0,
          ));
        break;
      case "select":
        ye("invalid", t);
        break;
      case "textarea":
        (ye("invalid", t), Ou(t, l.value, l.defaultValue, l.children));
    }
    ((a = l.children),
      (typeof a != "string" && typeof a != "number" && typeof a != "bigint") ||
      t.textContent === "" + a ||
      l.suppressHydrationWarning === !0 ||
      Uf(t.textContent, a)
        ? (l.popover != null && (ye("beforetoggle", t), ye("toggle", t)),
          l.onScroll != null && ye("scroll", t),
          l.onScrollEnd != null && ye("scrollend", t),
          l.onClick != null && (t.onclick = Zt),
          (t = !0))
        : (t = !1),
      t || ca(e, !0));
  }
  function yr(e) {
    for (We = e.return; We; )
      switch (We.tag) {
        case 5:
        case 31:
        case 13:
          Tt = !1;
          return;
        case 27:
        case 3:
          Tt = !0;
          return;
        default:
          We = We.return;
      }
  }
  function ol(e) {
    if (e !== We) return !1;
    if (!be) return (yr(e), (be = !0), !1);
    var t = e.tag,
      a;
    if (
      ((a = t !== 3 && t !== 27) &&
        ((a = t === 5) &&
          ((a = e.type),
          (a =
            !(a !== "form" && a !== "button") || Vc(e.type, e.memoizedProps))),
        (a = !a)),
      a && De && ca(e),
      yr(e),
      t === 13)
    ) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
        throw Error(r(317));
      De = Vf(e);
    } else if (t === 31) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
        throw Error(r(317));
      De = Vf(e);
    } else
      t === 27
        ? ((t = De), ba(e.type) ? ((e = Fc), (Fc = null), (De = e)) : (De = t))
        : (De = We ? Et(e.stateNode.nextSibling) : null);
    return !0;
  }
  function Ua() {
    ((De = We = null), (be = !1));
  }
  function Ei() {
    var e = ia;
    return (
      e !== null &&
        (ut === null ? (ut = e) : ut.push.apply(ut, e), (ia = null)),
      e
    );
  }
  function Jl(e) {
    ia === null ? (ia = [e]) : ia.push(e);
  }
  var zi = d(null),
    Ha = null,
    Xt = null;
  function ua(e, t, a) {
    (Q(zi, t._currentValue), (t._currentValue = a));
  }
  function Qt(e) {
    ((e._currentValue = zi.current), E(zi));
  }
  function Mi(e, t, a) {
    for (; e !== null; ) {
      var l = e.alternate;
      if (
        ((e.childLanes & t) !== t
          ? ((e.childLanes |= t), l !== null && (l.childLanes |= t))
          : l !== null && (l.childLanes & t) !== t && (l.childLanes |= t),
        e === a)
      )
        break;
      e = e.return;
    }
  }
  function Ri(e, t, a, l) {
    var n = e.child;
    for (n !== null && (n.return = e); n !== null; ) {
      var i = n.dependencies;
      if (i !== null) {
        var c = n.child;
        i = i.firstContext;
        e: for (; i !== null; ) {
          var u = i;
          i = n;
          for (var o = 0; o < t.length; o++)
            if (u.context === t[o]) {
              ((i.lanes |= a),
                (u = i.alternate),
                u !== null && (u.lanes |= a),
                Mi(i.return, a, e),
                l || (c = null));
              break e;
            }
          i = u.next;
        }
      } else if (n.tag === 18) {
        if (((c = n.return), c === null)) throw Error(r(341));
        ((c.lanes |= a),
          (i = c.alternate),
          i !== null && (i.lanes |= a),
          Mi(c, a, e),
          (c = null));
      } else c = n.child;
      if (c !== null) c.return = n;
      else
        for (c = n; c !== null; ) {
          if (c === e) {
            c = null;
            break;
          }
          if (((n = c.sibling), n !== null)) {
            ((n.return = c.return), (c = n));
            break;
          }
          c = c.return;
        }
      n = c;
    }
  }
  function fl(e, t, a, l) {
    e = null;
    for (var n = t, i = !1; n !== null; ) {
      if (!i) {
        if ((n.flags & 524288) !== 0) i = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var c = n.alternate;
        if (c === null) throw Error(r(387));
        if (((c = c.memoizedProps), c !== null)) {
          var u = n.type;
          ht(n.pendingProps.value, c.value) ||
            (e !== null ? e.push(u) : (e = [u]));
        }
      } else if (n === Ne.current) {
        if (((c = n.alternate), c === null)) throw Error(r(387));
        c.memoizedState.memoizedState !== n.memoizedState.memoizedState &&
          (e !== null ? e.push(bn) : (e = [bn]));
      }
      n = n.return;
    }
    (e !== null && Ri(t, e, a, l), (t.flags |= 262144));
  }
  function $n(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!ht(e.context._currentValue, e.memoizedValue)) return !0;
      e = e.next;
    }
    return !1;
  }
  function Ba(e) {
    ((Ha = e),
      (Xt = null),
      (e = e.dependencies),
      e !== null && (e.firstContext = null));
  }
  function Ie(e) {
    return xr(Ha, e);
  }
  function Fn(e, t) {
    return (Ha === null && Ba(e), xr(e, t));
  }
  function xr(e, t) {
    var a = t._currentValue;
    if (((t = { context: t, memoizedValue: a, next: null }), Xt === null)) {
      if (e === null) throw Error(r(308));
      ((Xt = t),
        (e.dependencies = { lanes: 0, firstContext: t }),
        (e.flags |= 524288));
    } else Xt = Xt.next = t;
    return a;
  }
  var Dh =
      typeof AbortController < "u"
        ? AbortController
        : function () {
            var e = [],
              t = (this.signal = {
                aborted: !1,
                addEventListener: function (a, l) {
                  e.push(l);
                },
              });
            this.abort = function () {
              ((t.aborted = !0),
                e.forEach(function (a) {
                  return a();
                }));
            };
          },
    qh = g.unstable_scheduleCallback,
    Uh = g.unstable_NormalPriority,
    Ge = {
      $$typeof: Y,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
    };
  function Oi() {
    return { controller: new Dh(), data: new Map(), refCount: 0 };
  }
  function kl(e) {
    (e.refCount--,
      e.refCount === 0 &&
        qh(Uh, function () {
          e.controller.abort();
        }));
  }
  var $l = null,
    Ci = 0,
    dl = 0,
    hl = null;
  function Hh(e, t) {
    if ($l === null) {
      var a = ($l = []);
      ((Ci = 0),
        (dl = Uc()),
        (hl = {
          status: "pending",
          value: void 0,
          then: function (l) {
            a.push(l);
          },
        }));
    }
    return (Ci++, t.then(jr, jr), t);
  }
  function jr() {
    if (--Ci === 0 && $l !== null) {
      hl !== null && (hl.status = "fulfilled");
      var e = $l;
      (($l = null), (dl = 0), (hl = null));
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function Bh(e, t) {
    var a = [],
      l = {
        status: "pending",
        value: null,
        reason: null,
        then: function (n) {
          a.push(n);
        },
      };
    return (
      e.then(
        function () {
          ((l.status = "fulfilled"), (l.value = t));
          for (var n = 0; n < a.length; n++) (0, a[n])(t);
        },
        function (n) {
          for (l.status = "rejected", l.reason = n, n = 0; n < a.length; n++)
            (0, a[n])(void 0);
        },
      ),
      l
    );
  }
  var br = m.S;
  m.S = function (e, t) {
    ((sf = ot()),
      typeof t == "object" &&
        t !== null &&
        typeof t.then == "function" &&
        Hh(e, t),
      br !== null && br(e, t));
  };
  var Za = d(null);
  function Di() {
    var e = Za.current;
    return e !== null ? e : Ce.pooledCache;
  }
  function Wn(e, t) {
    t === null ? Q(Za, Za.current) : Q(Za, t.pool);
  }
  function Sr() {
    var e = Di();
    return e === null ? null : { parent: Ge._currentValue, pool: e };
  }
  var ml = Error(r(460)),
    qi = Error(r(474)),
    In = Error(r(542)),
    Pn = { then: function () {} };
  function Nr(e) {
    return ((e = e.status), e === "fulfilled" || e === "rejected");
  }
  function _r(e, t, a) {
    switch (
      ((a = e[a]),
      a === void 0 ? e.push(t) : a !== t && (t.then(Zt, Zt), (t = a)),
      t.status)
    ) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw ((e = t.reason), Tr(e), e);
      default:
        if (typeof t.status == "string") t.then(Zt, Zt);
        else {
          if (((e = Ce), e !== null && 100 < e.shellSuspendCounter))
            throw Error(r(482));
          ((e = t),
            (e.status = "pending"),
            e.then(
              function (l) {
                if (t.status === "pending") {
                  var n = t;
                  ((n.status = "fulfilled"), (n.value = l));
                }
              },
              function (l) {
                if (t.status === "pending") {
                  var n = t;
                  ((n.status = "rejected"), (n.reason = l));
                }
              },
            ));
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw ((e = t.reason), Tr(e), e);
        }
        throw ((La = t), ml);
    }
  }
  function Ya(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (a) {
      throw a !== null && typeof a == "object" && typeof a.then == "function"
        ? ((La = a), ml)
        : a;
    }
  }
  var La = null;
  function Ar() {
    if (La === null) throw Error(r(459));
    var e = La;
    return ((La = null), e);
  }
  function Tr(e) {
    if (e === ml || e === In) throw Error(r(483));
  }
  var vl = null,
    Fl = 0;
  function es(e) {
    var t = Fl;
    return ((Fl += 1), vl === null && (vl = []), _r(vl, e, t));
  }
  function Wl(e, t) {
    ((t = t.props.ref), (e.ref = t !== void 0 ? t : null));
  }
  function ts(e, t) {
    throw t.$$typeof === G
      ? Error(r(525))
      : ((e = Object.prototype.toString.call(t)),
        Error(
          r(
            31,
            e === "[object Object]"
              ? "object with keys {" + Object.keys(t).join(", ") + "}"
              : e,
          ),
        ));
  }
  function wr(e) {
    function t(h, f) {
      if (e) {
        var p = h.deletions;
        p === null ? ((h.deletions = [f]), (h.flags |= 16)) : p.push(f);
      }
    }
    function a(h, f) {
      if (!e) return null;
      for (; f !== null; ) (t(h, f), (f = f.sibling));
      return null;
    }
    function l(h) {
      for (var f = new Map(); h !== null; )
        (h.key !== null ? f.set(h.key, h) : f.set(h.index, h), (h = h.sibling));
      return f;
    }
    function n(h, f) {
      return ((h = Lt(h, f)), (h.index = 0), (h.sibling = null), h);
    }
    function i(h, f, p) {
      return (
        (h.index = p),
        e
          ? ((p = h.alternate),
            p !== null
              ? ((p = p.index), p < f ? ((h.flags |= 67108866), f) : p)
              : ((h.flags |= 67108866), f))
          : ((h.flags |= 1048576), f)
      );
    }
    function c(h) {
      return (e && h.alternate === null && (h.flags |= 67108866), h);
    }
    function u(h, f, p, w) {
      return f === null || f.tag !== 6
        ? ((f = Ni(p, h.mode, w)), (f.return = h), f)
        : ((f = n(f, p)), (f.return = h), f);
    }
    function o(h, f, p, w) {
      var ne = p.type;
      return ne === H
        ? _(h, f, p.props.children, w, p.key)
        : f !== null &&
            (f.elementType === ne ||
              (typeof ne == "object" &&
                ne !== null &&
                ne.$$typeof === D &&
                Ya(ne) === f.type))
          ? ((f = n(f, p.props)), Wl(f, p), (f.return = h), f)
          : ((f = Jn(p.type, p.key, p.props, null, h.mode, w)),
            Wl(f, p),
            (f.return = h),
            f);
    }
    function y(h, f, p, w) {
      return f === null ||
        f.tag !== 4 ||
        f.stateNode.containerInfo !== p.containerInfo ||
        f.stateNode.implementation !== p.implementation
        ? ((f = _i(p, h.mode, w)), (f.return = h), f)
        : ((f = n(f, p.children || [])), (f.return = h), f);
    }
    function _(h, f, p, w, ne) {
      return f === null || f.tag !== 7
        ? ((f = qa(p, h.mode, w, ne)), (f.return = h), f)
        : ((f = n(f, p)), (f.return = h), f);
    }
    function z(h, f, p) {
      if (
        (typeof f == "string" && f !== "") ||
        typeof f == "number" ||
        typeof f == "bigint"
      )
        return ((f = Ni("" + f, h.mode, p)), (f.return = h), f);
      if (typeof f == "object" && f !== null) {
        switch (f.$$typeof) {
          case L:
            return (
              (p = Jn(f.type, f.key, f.props, null, h.mode, p)),
              Wl(p, f),
              (p.return = h),
              p
            );
          case le:
            return ((f = _i(f, h.mode, p)), (f.return = h), f);
          case D:
            return ((f = Ya(f)), z(h, f, p));
        }
        if (S(f) || Se(f))
          return ((f = qa(f, h.mode, p, null)), (f.return = h), f);
        if (typeof f.then == "function") return z(h, es(f), p);
        if (f.$$typeof === Y) return z(h, Fn(h, f), p);
        ts(h, f);
      }
      return null;
    }
    function x(h, f, p, w) {
      var ne = f !== null ? f.key : null;
      if (
        (typeof p == "string" && p !== "") ||
        typeof p == "number" ||
        typeof p == "bigint"
      )
        return ne !== null ? null : u(h, f, "" + p, w);
      if (typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case L:
            return p.key === ne ? o(h, f, p, w) : null;
          case le:
            return p.key === ne ? y(h, f, p, w) : null;
          case D:
            return ((p = Ya(p)), x(h, f, p, w));
        }
        if (S(p) || Se(p)) return ne !== null ? null : _(h, f, p, w, null);
        if (typeof p.then == "function") return x(h, f, es(p), w);
        if (p.$$typeof === Y) return x(h, f, Fn(h, p), w);
        ts(h, p);
      }
      return null;
    }
    function b(h, f, p, w, ne) {
      if (
        (typeof w == "string" && w !== "") ||
        typeof w == "number" ||
        typeof w == "bigint"
      )
        return ((h = h.get(p) || null), u(f, h, "" + w, ne));
      if (typeof w == "object" && w !== null) {
        switch (w.$$typeof) {
          case L:
            return (
              (h = h.get(w.key === null ? p : w.key) || null),
              o(f, h, w, ne)
            );
          case le:
            return (
              (h = h.get(w.key === null ? p : w.key) || null),
              y(f, h, w, ne)
            );
          case D:
            return ((w = Ya(w)), b(h, f, p, w, ne));
        }
        if (S(w) || Se(w))
          return ((h = h.get(p) || null), _(f, h, w, ne, null));
        if (typeof w.then == "function") return b(h, f, p, es(w), ne);
        if (w.$$typeof === Y) return b(h, f, p, Fn(f, w), ne);
        ts(f, w);
      }
      return null;
    }
    function I(h, f, p, w) {
      for (
        var ne = null, _e = null, te = f, he = (f = 0), je = null;
        te !== null && he < p.length;
        he++
      ) {
        te.index > he ? ((je = te), (te = null)) : (je = te.sibling);
        var Ae = x(h, te, p[he], w);
        if (Ae === null) {
          te === null && (te = je);
          break;
        }
        (e && te && Ae.alternate === null && t(h, te),
          (f = i(Ae, f, he)),
          _e === null ? (ne = Ae) : (_e.sibling = Ae),
          (_e = Ae),
          (te = je));
      }
      if (he === p.length) return (a(h, te), be && Gt(h, he), ne);
      if (te === null) {
        for (; he < p.length; he++)
          ((te = z(h, p[he], w)),
            te !== null &&
              ((f = i(te, f, he)),
              _e === null ? (ne = te) : (_e.sibling = te),
              (_e = te)));
        return (be && Gt(h, he), ne);
      }
      for (te = l(te); he < p.length; he++)
        ((je = b(te, h, he, p[he], w)),
          je !== null &&
            (e &&
              je.alternate !== null &&
              te.delete(je.key === null ? he : je.key),
            (f = i(je, f, he)),
            _e === null ? (ne = je) : (_e.sibling = je),
            (_e = je)));
      return (
        e &&
          te.forEach(function (Ta) {
            return t(h, Ta);
          }),
        be && Gt(h, he),
        ne
      );
    }
    function se(h, f, p, w) {
      if (p == null) throw Error(r(151));
      for (
        var ne = null,
          _e = null,
          te = f,
          he = (f = 0),
          je = null,
          Ae = p.next();
        te !== null && !Ae.done;
        he++, Ae = p.next()
      ) {
        te.index > he ? ((je = te), (te = null)) : (je = te.sibling);
        var Ta = x(h, te, Ae.value, w);
        if (Ta === null) {
          te === null && (te = je);
          break;
        }
        (e && te && Ta.alternate === null && t(h, te),
          (f = i(Ta, f, he)),
          _e === null ? (ne = Ta) : (_e.sibling = Ta),
          (_e = Ta),
          (te = je));
      }
      if (Ae.done) return (a(h, te), be && Gt(h, he), ne);
      if (te === null) {
        for (; !Ae.done; he++, Ae = p.next())
          ((Ae = z(h, Ae.value, w)),
            Ae !== null &&
              ((f = i(Ae, f, he)),
              _e === null ? (ne = Ae) : (_e.sibling = Ae),
              (_e = Ae)));
        return (be && Gt(h, he), ne);
      }
      for (te = l(te); !Ae.done; he++, Ae = p.next())
        ((Ae = b(te, h, he, Ae.value, w)),
          Ae !== null &&
            (e &&
              Ae.alternate !== null &&
              te.delete(Ae.key === null ? he : Ae.key),
            (f = i(Ae, f, he)),
            _e === null ? (ne = Ae) : (_e.sibling = Ae),
            (_e = Ae)));
      return (
        e &&
          te.forEach(function ($0) {
            return t(h, $0);
          }),
        be && Gt(h, he),
        ne
      );
    }
    function Oe(h, f, p, w) {
      if (
        (typeof p == "object" &&
          p !== null &&
          p.type === H &&
          p.key === null &&
          (p = p.props.children),
        typeof p == "object" && p !== null)
      ) {
        switch (p.$$typeof) {
          case L:
            e: {
              for (var ne = p.key; f !== null; ) {
                if (f.key === ne) {
                  if (((ne = p.type), ne === H)) {
                    if (f.tag === 7) {
                      (a(h, f.sibling),
                        (w = n(f, p.props.children)),
                        (w.return = h),
                        (h = w));
                      break e;
                    }
                  } else if (
                    f.elementType === ne ||
                    (typeof ne == "object" &&
                      ne !== null &&
                      ne.$$typeof === D &&
                      Ya(ne) === f.type)
                  ) {
                    (a(h, f.sibling),
                      (w = n(f, p.props)),
                      Wl(w, p),
                      (w.return = h),
                      (h = w));
                    break e;
                  }
                  a(h, f);
                  break;
                } else t(h, f);
                f = f.sibling;
              }
              p.type === H
                ? ((w = qa(p.props.children, h.mode, w, p.key)),
                  (w.return = h),
                  (h = w))
                : ((w = Jn(p.type, p.key, p.props, null, h.mode, w)),
                  Wl(w, p),
                  (w.return = h),
                  (h = w));
            }
            return c(h);
          case le:
            e: {
              for (ne = p.key; f !== null; ) {
                if (f.key === ne)
                  if (
                    f.tag === 4 &&
                    f.stateNode.containerInfo === p.containerInfo &&
                    f.stateNode.implementation === p.implementation
                  ) {
                    (a(h, f.sibling),
                      (w = n(f, p.children || [])),
                      (w.return = h),
                      (h = w));
                    break e;
                  } else {
                    a(h, f);
                    break;
                  }
                else t(h, f);
                f = f.sibling;
              }
              ((w = _i(p, h.mode, w)), (w.return = h), (h = w));
            }
            return c(h);
          case D:
            return ((p = Ya(p)), Oe(h, f, p, w));
        }
        if (S(p)) return I(h, f, p, w);
        if (Se(p)) {
          if (((ne = Se(p)), typeof ne != "function")) throw Error(r(150));
          return ((p = ne.call(p)), se(h, f, p, w));
        }
        if (typeof p.then == "function") return Oe(h, f, es(p), w);
        if (p.$$typeof === Y) return Oe(h, f, Fn(h, p), w);
        ts(h, p);
      }
      return (typeof p == "string" && p !== "") ||
        typeof p == "number" ||
        typeof p == "bigint"
        ? ((p = "" + p),
          f !== null && f.tag === 6
            ? (a(h, f.sibling), (w = n(f, p)), (w.return = h), (h = w))
            : (a(h, f), (w = Ni(p, h.mode, w)), (w.return = h), (h = w)),
          c(h))
        : a(h, f);
    }
    return function (h, f, p, w) {
      try {
        Fl = 0;
        var ne = Oe(h, f, p, w);
        return ((vl = null), ne);
      } catch (te) {
        if (te === ml || te === In) throw te;
        var _e = mt(29, te, null, h.mode);
        return ((_e.lanes = w), (_e.return = h), _e);
      } finally {
      }
    };
  }
  var Ga = wr(!0),
    Er = wr(!1),
    ra = !1;
  function Ui(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function Hi(e, t) {
    ((e = e.updateQueue),
      t.updateQueue === e &&
        (t.updateQueue = {
          baseState: e.baseState,
          firstBaseUpdate: e.firstBaseUpdate,
          lastBaseUpdate: e.lastBaseUpdate,
          shared: e.shared,
          callbacks: null,
        }));
  }
  function oa(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function fa(e, t, a) {
    var l = e.updateQueue;
    if (l === null) return null;
    if (((l = l.shared), (Te & 2) !== 0)) {
      var n = l.pending;
      return (
        n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
        (l.pending = t),
        (t = Kn(e)),
        fr(e, null, a),
        t
      );
    }
    return (Vn(e, l, t, a), Kn(e));
  }
  function Il(e, t, a) {
    if (
      ((t = t.updateQueue), t !== null && ((t = t.shared), (a & 4194048) !== 0))
    ) {
      var l = t.lanes;
      ((l &= e.pendingLanes), (a |= l), (t.lanes = a), xu(e, a));
    }
  }
  function Bi(e, t) {
    var a = e.updateQueue,
      l = e.alternate;
    if (l !== null && ((l = l.updateQueue), a === l)) {
      var n = null,
        i = null;
      if (((a = a.firstBaseUpdate), a !== null)) {
        do {
          var c = {
            lane: a.lane,
            tag: a.tag,
            payload: a.payload,
            callback: null,
            next: null,
          };
          (i === null ? (n = i = c) : (i = i.next = c), (a = a.next));
        } while (a !== null);
        i === null ? (n = i = t) : (i = i.next = t);
      } else n = i = t;
      ((a = {
        baseState: l.baseState,
        firstBaseUpdate: n,
        lastBaseUpdate: i,
        shared: l.shared,
        callbacks: l.callbacks,
      }),
        (e.updateQueue = a));
      return;
    }
    ((e = a.lastBaseUpdate),
      e === null ? (a.firstBaseUpdate = t) : (e.next = t),
      (a.lastBaseUpdate = t));
  }
  var Zi = !1;
  function Pl() {
    if (Zi) {
      var e = hl;
      if (e !== null) throw e;
    }
  }
  function en(e, t, a, l) {
    Zi = !1;
    var n = e.updateQueue;
    ra = !1;
    var i = n.firstBaseUpdate,
      c = n.lastBaseUpdate,
      u = n.shared.pending;
    if (u !== null) {
      n.shared.pending = null;
      var o = u,
        y = o.next;
      ((o.next = null), c === null ? (i = y) : (c.next = y), (c = o));
      var _ = e.alternate;
      _ !== null &&
        ((_ = _.updateQueue),
        (u = _.lastBaseUpdate),
        u !== c &&
          (u === null ? (_.firstBaseUpdate = y) : (u.next = y),
          (_.lastBaseUpdate = o)));
    }
    if (i !== null) {
      var z = n.baseState;
      ((c = 0), (_ = y = o = null), (u = i));
      do {
        var x = u.lane & -536870913,
          b = x !== u.lane;
        if (b ? (xe & x) === x : (l & x) === x) {
          (x !== 0 && x === dl && (Zi = !0),
            _ !== null &&
              (_ = _.next =
                {
                  lane: 0,
                  tag: u.tag,
                  payload: u.payload,
                  callback: null,
                  next: null,
                }));
          e: {
            var I = e,
              se = u;
            x = t;
            var Oe = a;
            switch (se.tag) {
              case 1:
                if (((I = se.payload), typeof I == "function")) {
                  z = I.call(Oe, z, x);
                  break e;
                }
                z = I;
                break e;
              case 3:
                I.flags = (I.flags & -65537) | 128;
              case 0:
                if (
                  ((I = se.payload),
                  (x = typeof I == "function" ? I.call(Oe, z, x) : I),
                  x == null)
                )
                  break e;
                z = O({}, z, x);
                break e;
              case 2:
                ra = !0;
            }
          }
          ((x = u.callback),
            x !== null &&
              ((e.flags |= 64),
              b && (e.flags |= 8192),
              (b = n.callbacks),
              b === null ? (n.callbacks = [x]) : b.push(x)));
        } else
          ((b = {
            lane: x,
            tag: u.tag,
            payload: u.payload,
            callback: u.callback,
            next: null,
          }),
            _ === null ? ((y = _ = b), (o = z)) : (_ = _.next = b),
            (c |= x));
        if (((u = u.next), u === null)) {
          if (((u = n.shared.pending), u === null)) break;
          ((b = u),
            (u = b.next),
            (b.next = null),
            (n.lastBaseUpdate = b),
            (n.shared.pending = null));
        }
      } while (!0);
      (_ === null && (o = z),
        (n.baseState = o),
        (n.firstBaseUpdate = y),
        (n.lastBaseUpdate = _),
        i === null && (n.shared.lanes = 0),
        (pa |= c),
        (e.lanes = c),
        (e.memoizedState = z));
    }
  }
  function zr(e, t) {
    if (typeof e != "function") throw Error(r(191, e));
    e.call(t);
  }
  function Mr(e, t) {
    var a = e.callbacks;
    if (a !== null)
      for (e.callbacks = null, e = 0; e < a.length; e++) zr(a[e], t);
  }
  var pl = d(null),
    as = d(0);
  function Rr(e, t) {
    ((e = Pt), Q(as, e), Q(pl, t), (Pt = e | t.baseLanes));
  }
  function Yi() {
    (Q(as, Pt), Q(pl, pl.current));
  }
  function Li() {
    ((Pt = as.current), E(pl), E(as));
  }
  var vt = d(null),
    wt = null;
  function da(e) {
    var t = e.alternate;
    (Q(Ye, Ye.current & 1),
      Q(vt, e),
      wt === null &&
        (t === null || pl.current !== null || t.memoizedState !== null) &&
        (wt = e));
  }
  function Gi(e) {
    (Q(Ye, Ye.current), Q(vt, e), wt === null && (wt = e));
  }
  function Or(e) {
    e.tag === 22
      ? (Q(Ye, Ye.current), Q(vt, e), wt === null && (wt = e))
      : ha();
  }
  function ha() {
    (Q(Ye, Ye.current), Q(vt, vt.current));
  }
  function pt(e) {
    (E(vt), wt === e && (wt = null), E(Ye));
  }
  var Ye = d(0);
  function ls(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var a = t.memoizedState;
        if (a !== null && ((a = a.dehydrated), a === null || kc(a) || $c(a)))
          return t;
      } else if (
        t.tag === 19 &&
        (t.memoizedProps.revealOrder === "forwards" ||
          t.memoizedProps.revealOrder === "backwards" ||
          t.memoizedProps.revealOrder === "unstable_legacy-backwards" ||
          t.memoizedProps.revealOrder === "together")
      ) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        ((t.child.return = t), (t = t.child));
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
    return null;
  }
  var Vt = 0,
    fe = null,
    Me = null,
    Xe = null,
    ns = !1,
    gl = !1,
    Xa = !1,
    ss = 0,
    tn = 0,
    yl = null,
    Zh = 0;
  function Be() {
    throw Error(r(321));
  }
  function Xi(e, t) {
    if (t === null) return !1;
    for (var a = 0; a < t.length && a < e.length; a++)
      if (!ht(e[a], t[a])) return !1;
    return !0;
  }
  function Qi(e, t, a, l, n, i) {
    return (
      (Vt = i),
      (fe = t),
      (t.memoizedState = null),
      (t.updateQueue = null),
      (t.lanes = 0),
      (m.H = e === null || e.memoizedState === null ? po : sc),
      (Xa = !1),
      (i = a(l, n)),
      (Xa = !1),
      gl && (i = Dr(t, a, l, n)),
      Cr(e),
      i
    );
  }
  function Cr(e) {
    m.H = nn;
    var t = Me !== null && Me.next !== null;
    if (((Vt = 0), (Xe = Me = fe = null), (ns = !1), (tn = 0), (yl = null), t))
      throw Error(r(300));
    e === null ||
      Qe ||
      ((e = e.dependencies), e !== null && $n(e) && (Qe = !0));
  }
  function Dr(e, t, a, l) {
    fe = e;
    var n = 0;
    do {
      if ((gl && (yl = null), (tn = 0), (gl = !1), 25 <= n))
        throw Error(r(301));
      if (((n += 1), (Xe = Me = null), e.updateQueue != null)) {
        var i = e.updateQueue;
        ((i.lastEffect = null),
          (i.events = null),
          (i.stores = null),
          i.memoCache != null && (i.memoCache.index = 0));
      }
      ((m.H = go), (i = t(a, l)));
    } while (gl);
    return i;
  }
  function Yh() {
    var e = m.H,
      t = e.useState()[0];
    return (
      (t = typeof t.then == "function" ? an(t) : t),
      (e = e.useState()[0]),
      (Me !== null ? Me.memoizedState : null) !== e && (fe.flags |= 1024),
      t
    );
  }
  function Vi() {
    var e = ss !== 0;
    return ((ss = 0), e);
  }
  function Ki(e, t, a) {
    ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~a));
  }
  function Ji(e) {
    if (ns) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        (t !== null && (t.pending = null), (e = e.next));
      }
      ns = !1;
    }
    ((Vt = 0), (Xe = Me = fe = null), (gl = !1), (tn = ss = 0), (yl = null));
  }
  function at() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null,
    };
    return (Xe === null ? (fe.memoizedState = Xe = e) : (Xe = Xe.next = e), Xe);
  }
  function Le() {
    if (Me === null) {
      var e = fe.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Me.next;
    var t = Xe === null ? fe.memoizedState : Xe.next;
    if (t !== null) ((Xe = t), (Me = e));
    else {
      if (e === null)
        throw fe.alternate === null ? Error(r(467)) : Error(r(310));
      ((Me = e),
        (e = {
          memoizedState: Me.memoizedState,
          baseState: Me.baseState,
          baseQueue: Me.baseQueue,
          queue: Me.queue,
          next: null,
        }),
        Xe === null ? (fe.memoizedState = Xe = e) : (Xe = Xe.next = e));
    }
    return Xe;
  }
  function is() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function an(e) {
    var t = tn;
    return (
      (tn += 1),
      yl === null && (yl = []),
      (e = _r(yl, e, t)),
      (t = fe),
      (Xe === null ? t.memoizedState : Xe.next) === null &&
        ((t = t.alternate),
        (m.H = t === null || t.memoizedState === null ? po : sc)),
      e
    );
  }
  function cs(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return an(e);
      if (e.$$typeof === Y) return Ie(e);
    }
    throw Error(r(438, String(e)));
  }
  function ki(e) {
    var t = null,
      a = fe.updateQueue;
    if ((a !== null && (t = a.memoCache), t == null)) {
      var l = fe.alternate;
      l !== null &&
        ((l = l.updateQueue),
        l !== null &&
          ((l = l.memoCache),
          l != null &&
            (t = {
              data: l.data.map(function (n) {
                return n.slice();
              }),
              index: 0,
            })));
    }
    if (
      (t == null && (t = { data: [], index: 0 }),
      a === null && ((a = is()), (fe.updateQueue = a)),
      (a.memoCache = t),
      (a = t.data[t.index]),
      a === void 0)
    )
      for (a = t.data[t.index] = Array(e), l = 0; l < e; l++) a[l] = P;
    return (t.index++, a);
  }
  function Kt(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function us(e) {
    var t = Le();
    return $i(t, Me, e);
  }
  function $i(e, t, a) {
    var l = e.queue;
    if (l === null) throw Error(r(311));
    l.lastRenderedReducer = a;
    var n = e.baseQueue,
      i = l.pending;
    if (i !== null) {
      if (n !== null) {
        var c = n.next;
        ((n.next = i.next), (i.next = c));
      }
      ((t.baseQueue = n = i), (l.pending = null));
    }
    if (((i = e.baseState), n === null)) e.memoizedState = i;
    else {
      t = n.next;
      var u = (c = null),
        o = null,
        y = t,
        _ = !1;
      do {
        var z = y.lane & -536870913;
        if (z !== y.lane ? (xe & z) === z : (Vt & z) === z) {
          var x = y.revertLane;
          if (x === 0)
            (o !== null &&
              (o = o.next =
                {
                  lane: 0,
                  revertLane: 0,
                  gesture: null,
                  action: y.action,
                  hasEagerState: y.hasEagerState,
                  eagerState: y.eagerState,
                  next: null,
                }),
              z === dl && (_ = !0));
          else if ((Vt & x) === x) {
            ((y = y.next), x === dl && (_ = !0));
            continue;
          } else
            ((z = {
              lane: 0,
              revertLane: y.revertLane,
              gesture: null,
              action: y.action,
              hasEagerState: y.hasEagerState,
              eagerState: y.eagerState,
              next: null,
            }),
              o === null ? ((u = o = z), (c = i)) : (o = o.next = z),
              (fe.lanes |= x),
              (pa |= x));
          ((z = y.action),
            Xa && a(i, z),
            (i = y.hasEagerState ? y.eagerState : a(i, z)));
        } else
          ((x = {
            lane: z,
            revertLane: y.revertLane,
            gesture: y.gesture,
            action: y.action,
            hasEagerState: y.hasEagerState,
            eagerState: y.eagerState,
            next: null,
          }),
            o === null ? ((u = o = x), (c = i)) : (o = o.next = x),
            (fe.lanes |= z),
            (pa |= z));
        y = y.next;
      } while (y !== null && y !== t);
      if (
        (o === null ? (c = i) : (o.next = u),
        !ht(i, e.memoizedState) && ((Qe = !0), _ && ((a = hl), a !== null)))
      )
        throw a;
      ((e.memoizedState = i),
        (e.baseState = c),
        (e.baseQueue = o),
        (l.lastRenderedState = i));
    }
    return (n === null && (l.lanes = 0), [e.memoizedState, l.dispatch]);
  }
  function Fi(e) {
    var t = Le(),
      a = t.queue;
    if (a === null) throw Error(r(311));
    a.lastRenderedReducer = e;
    var l = a.dispatch,
      n = a.pending,
      i = t.memoizedState;
    if (n !== null) {
      a.pending = null;
      var c = (n = n.next);
      do ((i = e(i, c.action)), (c = c.next));
      while (c !== n);
      (ht(i, t.memoizedState) || (Qe = !0),
        (t.memoizedState = i),
        t.baseQueue === null && (t.baseState = i),
        (a.lastRenderedState = i));
    }
    return [i, l];
  }
  function qr(e, t, a) {
    var l = fe,
      n = Le(),
      i = be;
    if (i) {
      if (a === void 0) throw Error(r(407));
      a = a();
    } else a = t();
    var c = !ht((Me || n).memoizedState, a);
    if (
      (c && ((n.memoizedState = a), (Qe = !0)),
      (n = n.queue),
      Pi(Br.bind(null, l, n, e), [e]),
      n.getSnapshot !== t || c || (Xe !== null && Xe.memoizedState.tag & 1))
    ) {
      if (
        ((l.flags |= 2048),
        xl(9, { destroy: void 0 }, Hr.bind(null, l, n, a, t), null),
        Ce === null)
      )
        throw Error(r(349));
      i || (Vt & 127) !== 0 || Ur(l, t, a);
    }
    return a;
  }
  function Ur(e, t, a) {
    ((e.flags |= 16384),
      (e = { getSnapshot: t, value: a }),
      (t = fe.updateQueue),
      t === null
        ? ((t = is()), (fe.updateQueue = t), (t.stores = [e]))
        : ((a = t.stores), a === null ? (t.stores = [e]) : a.push(e)));
  }
  function Hr(e, t, a, l) {
    ((t.value = a), (t.getSnapshot = l), Zr(t) && Yr(e));
  }
  function Br(e, t, a) {
    return a(function () {
      Zr(t) && Yr(e);
    });
  }
  function Zr(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var a = t();
      return !ht(e, a);
    } catch {
      return !0;
    }
  }
  function Yr(e) {
    var t = Da(e, 2);
    t !== null && rt(t, e, 2);
  }
  function Wi(e) {
    var t = at();
    if (typeof e == "function") {
      var a = e;
      if (((e = a()), Xa)) {
        aa(!0);
        try {
          a();
        } finally {
          aa(!1);
        }
      }
    }
    return (
      (t.memoizedState = t.baseState = e),
      (t.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Kt,
        lastRenderedState: e,
      }),
      t
    );
  }
  function Lr(e, t, a, l) {
    return ((e.baseState = a), $i(e, Me, typeof l == "function" ? l : Kt));
  }
  function Lh(e, t, a, l, n) {
    if (fs(e)) throw Error(r(485));
    if (((e = t.action), e !== null)) {
      var i = {
        payload: n,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function (c) {
          i.listeners.push(c);
        },
      };
      (m.T !== null ? a(!0) : (i.isTransition = !1),
        l(i),
        (a = t.pending),
        a === null
          ? ((i.next = t.pending = i), Gr(t, i))
          : ((i.next = a.next), (t.pending = a.next = i)));
    }
  }
  function Gr(e, t) {
    var a = t.action,
      l = t.payload,
      n = e.state;
    if (t.isTransition) {
      var i = m.T,
        c = {};
      m.T = c;
      try {
        var u = a(n, l),
          o = m.S;
        (o !== null && o(c, u), Xr(e, t, u));
      } catch (y) {
        Ii(e, t, y);
      } finally {
        (i !== null && c.types !== null && (i.types = c.types), (m.T = i));
      }
    } else
      try {
        ((i = a(n, l)), Xr(e, t, i));
      } catch (y) {
        Ii(e, t, y);
      }
  }
  function Xr(e, t, a) {
    a !== null && typeof a == "object" && typeof a.then == "function"
      ? a.then(
          function (l) {
            Qr(e, t, l);
          },
          function (l) {
            return Ii(e, t, l);
          },
        )
      : Qr(e, t, a);
  }
  function Qr(e, t, a) {
    ((t.status = "fulfilled"),
      (t.value = a),
      Vr(t),
      (e.state = a),
      (t = e.pending),
      t !== null &&
        ((a = t.next),
        a === t ? (e.pending = null) : ((a = a.next), (t.next = a), Gr(e, a))));
  }
  function Ii(e, t, a) {
    var l = e.pending;
    if (((e.pending = null), l !== null)) {
      l = l.next;
      do ((t.status = "rejected"), (t.reason = a), Vr(t), (t = t.next));
      while (t !== l);
    }
    e.action = null;
  }
  function Vr(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function Kr(e, t) {
    return t;
  }
  function Jr(e, t) {
    if (be) {
      var a = Ce.formState;
      if (a !== null) {
        e: {
          var l = fe;
          if (be) {
            if (De) {
              t: {
                for (var n = De, i = Tt; n.nodeType !== 8; ) {
                  if (!i) {
                    n = null;
                    break t;
                  }
                  if (((n = Et(n.nextSibling)), n === null)) {
                    n = null;
                    break t;
                  }
                }
                ((i = n.data), (n = i === "F!" || i === "F" ? n : null));
              }
              if (n) {
                ((De = Et(n.nextSibling)), (l = n.data === "F!"));
                break e;
              }
            }
            ca(l);
          }
          l = !1;
        }
        l && (t = a[0]);
      }
    }
    return (
      (a = at()),
      (a.memoizedState = a.baseState = t),
      (l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Kr,
        lastRenderedState: t,
      }),
      (a.queue = l),
      (a = ho.bind(null, fe, l)),
      (l.dispatch = a),
      (l = Wi(!1)),
      (i = nc.bind(null, fe, !1, l.queue)),
      (l = at()),
      (n = { state: t, dispatch: null, action: e, pending: null }),
      (l.queue = n),
      (a = Lh.bind(null, fe, n, i, a)),
      (n.dispatch = a),
      (l.memoizedState = e),
      [t, a, !1]
    );
  }
  function kr(e) {
    var t = Le();
    return $r(t, Me, e);
  }
  function $r(e, t, a) {
    if (
      ((t = $i(e, t, Kr)[0]),
      (e = us(Kt)[0]),
      typeof t == "object" && t !== null && typeof t.then == "function")
    )
      try {
        var l = an(t);
      } catch (c) {
        throw c === ml ? In : c;
      }
    else l = t;
    t = Le();
    var n = t.queue,
      i = n.dispatch;
    return (
      a !== t.memoizedState &&
        ((fe.flags |= 2048),
        xl(9, { destroy: void 0 }, Gh.bind(null, n, a), null)),
      [l, i, e]
    );
  }
  function Gh(e, t) {
    e.action = t;
  }
  function Fr(e) {
    var t = Le(),
      a = Me;
    if (a !== null) return $r(t, a, e);
    (Le(), (t = t.memoizedState), (a = Le()));
    var l = a.queue.dispatch;
    return ((a.memoizedState = e), [t, l, !1]);
  }
  function xl(e, t, a, l) {
    return (
      (e = { tag: e, create: a, deps: l, inst: t, next: null }),
      (t = fe.updateQueue),
      t === null && ((t = is()), (fe.updateQueue = t)),
      (a = t.lastEffect),
      a === null
        ? (t.lastEffect = e.next = e)
        : ((l = a.next), (a.next = e), (e.next = l), (t.lastEffect = e)),
      e
    );
  }
  function Wr() {
    return Le().memoizedState;
  }
  function rs(e, t, a, l) {
    var n = at();
    ((fe.flags |= e),
      (n.memoizedState = xl(
        1 | t,
        { destroy: void 0 },
        a,
        l === void 0 ? null : l,
      )));
  }
  function os(e, t, a, l) {
    var n = Le();
    l = l === void 0 ? null : l;
    var i = n.memoizedState.inst;
    Me !== null && l !== null && Xi(l, Me.memoizedState.deps)
      ? (n.memoizedState = xl(t, i, a, l))
      : ((fe.flags |= e), (n.memoizedState = xl(1 | t, i, a, l)));
  }
  function Ir(e, t) {
    rs(8390656, 8, e, t);
  }
  function Pi(e, t) {
    os(2048, 8, e, t);
  }
  function Xh(e) {
    fe.flags |= 4;
    var t = fe.updateQueue;
    if (t === null) ((t = is()), (fe.updateQueue = t), (t.events = [e]));
    else {
      var a = t.events;
      a === null ? (t.events = [e]) : a.push(e);
    }
  }
  function Pr(e) {
    var t = Le().memoizedState;
    return (
      Xh({ ref: t, nextImpl: e }),
      function () {
        if ((Te & 2) !== 0) throw Error(r(440));
        return t.impl.apply(void 0, arguments);
      }
    );
  }
  function eo(e, t) {
    return os(4, 2, e, t);
  }
  function to(e, t) {
    return os(4, 4, e, t);
  }
  function ao(e, t) {
    if (typeof t == "function") {
      e = e();
      var a = t(e);
      return function () {
        typeof a == "function" ? a() : t(null);
      };
    }
    if (t != null)
      return (
        (e = e()),
        (t.current = e),
        function () {
          t.current = null;
        }
      );
  }
  function lo(e, t, a) {
    ((a = a != null ? a.concat([e]) : null), os(4, 4, ao.bind(null, t, e), a));
  }
  function ec() {}
  function no(e, t) {
    var a = Le();
    t = t === void 0 ? null : t;
    var l = a.memoizedState;
    return t !== null && Xi(t, l[1]) ? l[0] : ((a.memoizedState = [e, t]), e);
  }
  function so(e, t) {
    var a = Le();
    t = t === void 0 ? null : t;
    var l = a.memoizedState;
    if (t !== null && Xi(t, l[1])) return l[0];
    if (((l = e()), Xa)) {
      aa(!0);
      try {
        e();
      } finally {
        aa(!1);
      }
    }
    return ((a.memoizedState = [l, t]), l);
  }
  function tc(e, t, a) {
    return a === void 0 || ((Vt & 1073741824) !== 0 && (xe & 261930) === 0)
      ? (e.memoizedState = t)
      : ((e.memoizedState = a), (e = uf()), (fe.lanes |= e), (pa |= e), a);
  }
  function io(e, t, a, l) {
    return ht(a, t)
      ? a
      : pl.current !== null
        ? ((e = tc(e, a, l)), ht(e, t) || (Qe = !0), e)
        : (Vt & 42) === 0 || ((Vt & 1073741824) !== 0 && (xe & 261930) === 0)
          ? ((Qe = !0), (e.memoizedState = a))
          : ((e = uf()), (fe.lanes |= e), (pa |= e), t);
  }
  function co(e, t, a, l, n) {
    var i = q.p;
    q.p = i !== 0 && 8 > i ? i : 8;
    var c = m.T,
      u = {};
    ((m.T = u), nc(e, !1, t, a));
    try {
      var o = n(),
        y = m.S;
      if (
        (y !== null && y(u, o),
        o !== null && typeof o == "object" && typeof o.then == "function")
      ) {
        var _ = Bh(o, l);
        ln(e, t, _, xt(e));
      } else ln(e, t, l, xt(e));
    } catch (z) {
      ln(e, t, { then: function () {}, status: "rejected", reason: z }, xt());
    } finally {
      ((q.p = i),
        c !== null && u.types !== null && (c.types = u.types),
        (m.T = c));
    }
  }
  function Qh() {}
  function ac(e, t, a, l) {
    if (e.tag !== 5) throw Error(r(476));
    var n = uo(e).queue;
    co(
      e,
      n,
      t,
      W,
      a === null
        ? Qh
        : function () {
            return (ro(e), a(l));
          },
    );
  }
  function uo(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: W,
      baseState: W,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Kt,
        lastRenderedState: W,
      },
      next: null,
    };
    var a = {};
    return (
      (t.next = {
        memoizedState: a,
        baseState: a,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Kt,
          lastRenderedState: a,
        },
        next: null,
      }),
      (e.memoizedState = t),
      (e = e.alternate),
      e !== null && (e.memoizedState = t),
      t
    );
  }
  function ro(e) {
    var t = uo(e);
    (t.next === null && (t = e.alternate.memoizedState),
      ln(e, t.next.queue, {}, xt()));
  }
  function lc() {
    return Ie(bn);
  }
  function oo() {
    return Le().memoizedState;
  }
  function fo() {
    return Le().memoizedState;
  }
  function Vh(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var a = xt();
          e = oa(a);
          var l = fa(t, e, a);
          (l !== null && (rt(l, t, a), Il(l, t, a)),
            (t = { cache: Oi() }),
            (e.payload = t));
          return;
      }
      t = t.return;
    }
  }
  function Kh(e, t, a) {
    var l = xt();
    ((a = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
      fs(e)
        ? mo(t, a)
        : ((a = bi(e, t, a, l)), a !== null && (rt(a, e, l), vo(a, t, l))));
  }
  function ho(e, t, a) {
    var l = xt();
    ln(e, t, a, l);
  }
  function ln(e, t, a, l) {
    var n = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    };
    if (fs(e)) mo(t, n);
    else {
      var i = e.alternate;
      if (
        e.lanes === 0 &&
        (i === null || i.lanes === 0) &&
        ((i = t.lastRenderedReducer), i !== null)
      )
        try {
          var c = t.lastRenderedState,
            u = i(c, a);
          if (((n.hasEagerState = !0), (n.eagerState = u), ht(u, c)))
            return (Vn(e, t, n, 0), Ce === null && Qn(), !1);
        } catch {
        } finally {
        }
      if (((a = bi(e, t, n, l)), a !== null))
        return (rt(a, e, l), vo(a, t, l), !0);
    }
    return !1;
  }
  function nc(e, t, a, l) {
    if (
      ((l = {
        lane: 2,
        revertLane: Uc(),
        gesture: null,
        action: l,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      fs(e))
    ) {
      if (t) throw Error(r(479));
    } else ((t = bi(e, a, l, 2)), t !== null && rt(t, e, 2));
  }
  function fs(e) {
    var t = e.alternate;
    return e === fe || (t !== null && t === fe);
  }
  function mo(e, t) {
    gl = ns = !0;
    var a = e.pending;
    (a === null ? (t.next = t) : ((t.next = a.next), (a.next = t)),
      (e.pending = t));
  }
  function vo(e, t, a) {
    if ((a & 4194048) !== 0) {
      var l = t.lanes;
      ((l &= e.pendingLanes), (a |= l), (t.lanes = a), xu(e, a));
    }
  }
  var nn = {
    readContext: Ie,
    use: cs,
    useCallback: Be,
    useContext: Be,
    useEffect: Be,
    useImperativeHandle: Be,
    useLayoutEffect: Be,
    useInsertionEffect: Be,
    useMemo: Be,
    useReducer: Be,
    useRef: Be,
    useState: Be,
    useDebugValue: Be,
    useDeferredValue: Be,
    useTransition: Be,
    useSyncExternalStore: Be,
    useId: Be,
    useHostTransitionStatus: Be,
    useFormState: Be,
    useActionState: Be,
    useOptimistic: Be,
    useMemoCache: Be,
    useCacheRefresh: Be,
  };
  nn.useEffectEvent = Be;
  var po = {
      readContext: Ie,
      use: cs,
      useCallback: function (e, t) {
        return ((at().memoizedState = [e, t === void 0 ? null : t]), e);
      },
      useContext: Ie,
      useEffect: Ir,
      useImperativeHandle: function (e, t, a) {
        ((a = a != null ? a.concat([e]) : null),
          rs(4194308, 4, ao.bind(null, t, e), a));
      },
      useLayoutEffect: function (e, t) {
        return rs(4194308, 4, e, t);
      },
      useInsertionEffect: function (e, t) {
        rs(4, 2, e, t);
      },
      useMemo: function (e, t) {
        var a = at();
        t = t === void 0 ? null : t;
        var l = e();
        if (Xa) {
          aa(!0);
          try {
            e();
          } finally {
            aa(!1);
          }
        }
        return ((a.memoizedState = [l, t]), l);
      },
      useReducer: function (e, t, a) {
        var l = at();
        if (a !== void 0) {
          var n = a(t);
          if (Xa) {
            aa(!0);
            try {
              a(t);
            } finally {
              aa(!1);
            }
          }
        } else n = t;
        return (
          (l.memoizedState = l.baseState = n),
          (e = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: e,
            lastRenderedState: n,
          }),
          (l.queue = e),
          (e = e.dispatch = Kh.bind(null, fe, e)),
          [l.memoizedState, e]
        );
      },
      useRef: function (e) {
        var t = at();
        return ((e = { current: e }), (t.memoizedState = e));
      },
      useState: function (e) {
        e = Wi(e);
        var t = e.queue,
          a = ho.bind(null, fe, t);
        return ((t.dispatch = a), [e.memoizedState, a]);
      },
      useDebugValue: ec,
      useDeferredValue: function (e, t) {
        var a = at();
        return tc(a, e, t);
      },
      useTransition: function () {
        var e = Wi(!1);
        return (
          (e = co.bind(null, fe, e.queue, !0, !1)),
          (at().memoizedState = e),
          [!1, e]
        );
      },
      useSyncExternalStore: function (e, t, a) {
        var l = fe,
          n = at();
        if (be) {
          if (a === void 0) throw Error(r(407));
          a = a();
        } else {
          if (((a = t()), Ce === null)) throw Error(r(349));
          (xe & 127) !== 0 || Ur(l, t, a);
        }
        n.memoizedState = a;
        var i = { value: a, getSnapshot: t };
        return (
          (n.queue = i),
          Ir(Br.bind(null, l, i, e), [e]),
          (l.flags |= 2048),
          xl(9, { destroy: void 0 }, Hr.bind(null, l, i, a, t), null),
          a
        );
      },
      useId: function () {
        var e = at(),
          t = Ce.identifierPrefix;
        if (be) {
          var a = qt,
            l = Dt;
          ((a = (l & ~(1 << (32 - dt(l) - 1))).toString(32) + a),
            (t = "_" + t + "R_" + a),
            (a = ss++),
            0 < a && (t += "H" + a.toString(32)),
            (t += "_"));
        } else ((a = Zh++), (t = "_" + t + "r_" + a.toString(32) + "_"));
        return (e.memoizedState = t);
      },
      useHostTransitionStatus: lc,
      useFormState: Jr,
      useActionState: Jr,
      useOptimistic: function (e) {
        var t = at();
        t.memoizedState = t.baseState = e;
        var a = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null,
        };
        return (
          (t.queue = a),
          (t = nc.bind(null, fe, !0, a)),
          (a.dispatch = t),
          [e, t]
        );
      },
      useMemoCache: ki,
      useCacheRefresh: function () {
        return (at().memoizedState = Vh.bind(null, fe));
      },
      useEffectEvent: function (e) {
        var t = at(),
          a = { impl: e };
        return (
          (t.memoizedState = a),
          function () {
            if ((Te & 2) !== 0) throw Error(r(440));
            return a.impl.apply(void 0, arguments);
          }
        );
      },
    },
    sc = {
      readContext: Ie,
      use: cs,
      useCallback: no,
      useContext: Ie,
      useEffect: Pi,
      useImperativeHandle: lo,
      useInsertionEffect: eo,
      useLayoutEffect: to,
      useMemo: so,
      useReducer: us,
      useRef: Wr,
      useState: function () {
        return us(Kt);
      },
      useDebugValue: ec,
      useDeferredValue: function (e, t) {
        var a = Le();
        return io(a, Me.memoizedState, e, t);
      },
      useTransition: function () {
        var e = us(Kt)[0],
          t = Le().memoizedState;
        return [typeof e == "boolean" ? e : an(e), t];
      },
      useSyncExternalStore: qr,
      useId: oo,
      useHostTransitionStatus: lc,
      useFormState: kr,
      useActionState: kr,
      useOptimistic: function (e, t) {
        var a = Le();
        return Lr(a, Me, e, t);
      },
      useMemoCache: ki,
      useCacheRefresh: fo,
    };
  sc.useEffectEvent = Pr;
  var go = {
    readContext: Ie,
    use: cs,
    useCallback: no,
    useContext: Ie,
    useEffect: Pi,
    useImperativeHandle: lo,
    useInsertionEffect: eo,
    useLayoutEffect: to,
    useMemo: so,
    useReducer: Fi,
    useRef: Wr,
    useState: function () {
      return Fi(Kt);
    },
    useDebugValue: ec,
    useDeferredValue: function (e, t) {
      var a = Le();
      return Me === null ? tc(a, e, t) : io(a, Me.memoizedState, e, t);
    },
    useTransition: function () {
      var e = Fi(Kt)[0],
        t = Le().memoizedState;
      return [typeof e == "boolean" ? e : an(e), t];
    },
    useSyncExternalStore: qr,
    useId: oo,
    useHostTransitionStatus: lc,
    useFormState: Fr,
    useActionState: Fr,
    useOptimistic: function (e, t) {
      var a = Le();
      return Me !== null
        ? Lr(a, Me, e, t)
        : ((a.baseState = e), [e, a.queue.dispatch]);
    },
    useMemoCache: ki,
    useCacheRefresh: fo,
  };
  go.useEffectEvent = Pr;
  function ic(e, t, a, l) {
    ((t = e.memoizedState),
      (a = a(l, t)),
      (a = a == null ? t : O({}, t, a)),
      (e.memoizedState = a),
      e.lanes === 0 && (e.updateQueue.baseState = a));
  }
  var cc = {
    enqueueSetState: function (e, t, a) {
      e = e._reactInternals;
      var l = xt(),
        n = oa(l);
      ((n.payload = t),
        a != null && (n.callback = a),
        (t = fa(e, n, l)),
        t !== null && (rt(t, e, l), Il(t, e, l)));
    },
    enqueueReplaceState: function (e, t, a) {
      e = e._reactInternals;
      var l = xt(),
        n = oa(l);
      ((n.tag = 1),
        (n.payload = t),
        a != null && (n.callback = a),
        (t = fa(e, n, l)),
        t !== null && (rt(t, e, l), Il(t, e, l)));
    },
    enqueueForceUpdate: function (e, t) {
      e = e._reactInternals;
      var a = xt(),
        l = oa(a);
      ((l.tag = 2),
        t != null && (l.callback = t),
        (t = fa(e, l, a)),
        t !== null && (rt(t, e, a), Il(t, e, a)));
    },
  };
  function yo(e, t, a, l, n, i, c) {
    return (
      (e = e.stateNode),
      typeof e.shouldComponentUpdate == "function"
        ? e.shouldComponentUpdate(l, i, c)
        : t.prototype && t.prototype.isPureReactComponent
          ? !Ql(a, l) || !Ql(n, i)
          : !0
    );
  }
  function xo(e, t, a, l) {
    ((e = t.state),
      typeof t.componentWillReceiveProps == "function" &&
        t.componentWillReceiveProps(a, l),
      typeof t.UNSAFE_componentWillReceiveProps == "function" &&
        t.UNSAFE_componentWillReceiveProps(a, l),
      t.state !== e && cc.enqueueReplaceState(t, t.state, null));
  }
  function Qa(e, t) {
    var a = t;
    if ("ref" in t) {
      a = {};
      for (var l in t) l !== "ref" && (a[l] = t[l]);
    }
    if ((e = e.defaultProps)) {
      a === t && (a = O({}, a));
      for (var n in e) a[n] === void 0 && (a[n] = e[n]);
    }
    return a;
  }
  function jo(e) {
    Xn(e);
  }
  function bo(e) {
    console.error(e);
  }
  function So(e) {
    Xn(e);
  }
  function ds(e, t) {
    try {
      var a = e.onUncaughtError;
      a(t.value, { componentStack: t.stack });
    } catch (l) {
      setTimeout(function () {
        throw l;
      });
    }
  }
  function No(e, t, a) {
    try {
      var l = e.onCaughtError;
      l(a.value, {
        componentStack: a.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null,
      });
    } catch (n) {
      setTimeout(function () {
        throw n;
      });
    }
  }
  function uc(e, t, a) {
    return (
      (a = oa(a)),
      (a.tag = 3),
      (a.payload = { element: null }),
      (a.callback = function () {
        ds(e, t);
      }),
      a
    );
  }
  function _o(e) {
    return ((e = oa(e)), (e.tag = 3), e);
  }
  function Ao(e, t, a, l) {
    var n = a.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var i = l.value;
      ((e.payload = function () {
        return n(i);
      }),
        (e.callback = function () {
          No(t, a, l);
        }));
    }
    var c = a.stateNode;
    c !== null &&
      typeof c.componentDidCatch == "function" &&
      (e.callback = function () {
        (No(t, a, l),
          typeof n != "function" &&
            (ga === null ? (ga = new Set([this])) : ga.add(this)));
        var u = l.stack;
        this.componentDidCatch(l.value, {
          componentStack: u !== null ? u : "",
        });
      });
  }
  function Jh(e, t, a, l, n) {
    if (
      ((a.flags |= 32768),
      l !== null && typeof l == "object" && typeof l.then == "function")
    ) {
      if (
        ((t = a.alternate),
        t !== null && fl(t, a, n, !0),
        (a = vt.current),
        a !== null)
      ) {
        switch (a.tag) {
          case 31:
          case 13:
            return (
              wt === null ? _s() : a.alternate === null && Ze === 0 && (Ze = 3),
              (a.flags &= -257),
              (a.flags |= 65536),
              (a.lanes = n),
              l === Pn
                ? (a.flags |= 16384)
                : ((t = a.updateQueue),
                  t === null ? (a.updateQueue = new Set([l])) : t.add(l),
                  Cc(e, l, n)),
              !1
            );
          case 22:
            return (
              (a.flags |= 65536),
              l === Pn
                ? (a.flags |= 16384)
                : ((t = a.updateQueue),
                  t === null
                    ? ((t = {
                        transitions: null,
                        markerInstances: null,
                        retryQueue: new Set([l]),
                      }),
                      (a.updateQueue = t))
                    : ((a = t.retryQueue),
                      a === null ? (t.retryQueue = new Set([l])) : a.add(l)),
                  Cc(e, l, n)),
              !1
            );
        }
        throw Error(r(435, a.tag));
      }
      return (Cc(e, l, n), _s(), !1);
    }
    if (be)
      return (
        (t = vt.current),
        t !== null
          ? ((t.flags & 65536) === 0 && (t.flags |= 256),
            (t.flags |= 65536),
            (t.lanes = n),
            l !== wi && ((e = Error(r(422), { cause: l })), Jl(Nt(e, a))))
          : (l !== wi && ((t = Error(r(423), { cause: l })), Jl(Nt(t, a))),
            (e = e.current.alternate),
            (e.flags |= 65536),
            (n &= -n),
            (e.lanes |= n),
            (l = Nt(l, a)),
            (n = uc(e.stateNode, l, n)),
            Bi(e, n),
            Ze !== 4 && (Ze = 2)),
        !1
      );
    var i = Error(r(520), { cause: l });
    if (
      ((i = Nt(i, a)),
      hn === null ? (hn = [i]) : hn.push(i),
      Ze !== 4 && (Ze = 2),
      t === null)
    )
      return !0;
    ((l = Nt(l, a)), (a = t));
    do {
      switch (a.tag) {
        case 3:
          return (
            (a.flags |= 65536),
            (e = n & -n),
            (a.lanes |= e),
            (e = uc(a.stateNode, l, e)),
            Bi(a, e),
            !1
          );
        case 1:
          if (
            ((t = a.type),
            (i = a.stateNode),
            (a.flags & 128) === 0 &&
              (typeof t.getDerivedStateFromError == "function" ||
                (i !== null &&
                  typeof i.componentDidCatch == "function" &&
                  (ga === null || !ga.has(i)))))
          )
            return (
              (a.flags |= 65536),
              (n &= -n),
              (a.lanes |= n),
              (n = _o(n)),
              Ao(n, e, a, l),
              Bi(a, n),
              !1
            );
      }
      a = a.return;
    } while (a !== null);
    return !1;
  }
  var rc = Error(r(461)),
    Qe = !1;
  function Pe(e, t, a, l) {
    t.child = e === null ? Er(t, null, a, l) : Ga(t, e.child, a, l);
  }
  function To(e, t, a, l, n) {
    a = a.render;
    var i = t.ref;
    if ("ref" in l) {
      var c = {};
      for (var u in l) u !== "ref" && (c[u] = l[u]);
    } else c = l;
    return (
      Ba(t),
      (l = Qi(e, t, a, c, i, n)),
      (u = Vi()),
      e !== null && !Qe
        ? (Ki(e, t, n), Jt(e, t, n))
        : (be && u && Ai(t), (t.flags |= 1), Pe(e, t, l, n), t.child)
    );
  }
  function wo(e, t, a, l, n) {
    if (e === null) {
      var i = a.type;
      return typeof i == "function" &&
        !Si(i) &&
        i.defaultProps === void 0 &&
        a.compare === null
        ? ((t.tag = 15), (t.type = i), Eo(e, t, i, l, n))
        : ((e = Jn(a.type, null, l, t, t.mode, n)),
          (e.ref = t.ref),
          (e.return = t),
          (t.child = e));
    }
    if (((i = e.child), !gc(e, n))) {
      var c = i.memoizedProps;
      if (
        ((a = a.compare), (a = a !== null ? a : Ql), a(c, l) && e.ref === t.ref)
      )
        return Jt(e, t, n);
    }
    return (
      (t.flags |= 1),
      (e = Lt(i, l)),
      (e.ref = t.ref),
      (e.return = t),
      (t.child = e)
    );
  }
  function Eo(e, t, a, l, n) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (Ql(i, l) && e.ref === t.ref)
        if (((Qe = !1), (t.pendingProps = l = i), gc(e, n)))
          (e.flags & 131072) !== 0 && (Qe = !0);
        else return ((t.lanes = e.lanes), Jt(e, t, n));
    }
    return oc(e, t, a, l, n);
  }
  function zo(e, t, a, l) {
    var n = l.children,
      i = e !== null ? e.memoizedState : null;
    if (
      (e === null &&
        t.stateNode === null &&
        (t.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      l.mode === "hidden")
    ) {
      if ((t.flags & 128) !== 0) {
        if (((i = i !== null ? i.baseLanes | a : a), e !== null)) {
          for (l = t.child = e.child, n = 0; l !== null; )
            ((n = n | l.lanes | l.childLanes), (l = l.sibling));
          l = n & ~i;
        } else ((l = 0), (t.child = null));
        return Mo(e, t, i, a, l);
      }
      if ((a & 536870912) !== 0)
        ((t.memoizedState = { baseLanes: 0, cachePool: null }),
          e !== null && Wn(t, i !== null ? i.cachePool : null),
          i !== null ? Rr(t, i) : Yi(),
          Or(t));
      else
        return (
          (l = t.lanes = 536870912),
          Mo(e, t, i !== null ? i.baseLanes | a : a, a, l)
        );
    } else
      i !== null
        ? (Wn(t, i.cachePool), Rr(t, i), ha(), (t.memoizedState = null))
        : (e !== null && Wn(t, null), Yi(), ha());
    return (Pe(e, t, n, a), t.child);
  }
  function sn(e, t) {
    return (
      (e !== null && e.tag === 22) ||
        t.stateNode !== null ||
        (t.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      t.sibling
    );
  }
  function Mo(e, t, a, l, n) {
    var i = Di();
    return (
      (i = i === null ? null : { parent: Ge._currentValue, pool: i }),
      (t.memoizedState = { baseLanes: a, cachePool: i }),
      e !== null && Wn(t, null),
      Yi(),
      Or(t),
      e !== null && fl(e, t, l, !0),
      (t.childLanes = n),
      null
    );
  }
  function hs(e, t) {
    return (
      (t = vs({ mode: t.mode, children: t.children }, e.mode)),
      (t.ref = e.ref),
      (e.child = t),
      (t.return = e),
      t
    );
  }
  function Ro(e, t, a) {
    return (
      Ga(t, e.child, null, a),
      (e = hs(t, t.pendingProps)),
      (e.flags |= 2),
      pt(t),
      (t.memoizedState = null),
      e
    );
  }
  function kh(e, t, a) {
    var l = t.pendingProps,
      n = (t.flags & 128) !== 0;
    if (((t.flags &= -129), e === null)) {
      if (be) {
        if (l.mode === "hidden")
          return ((e = hs(t, l)), (t.lanes = 536870912), sn(null, e));
        if (
          (Gi(t),
          (e = De)
            ? ((e = Qf(e, Tt)),
              (e = e !== null && e.data === "&" ? e : null),
              e !== null &&
                ((t.memoizedState = {
                  dehydrated: e,
                  treeContext: sa !== null ? { id: Dt, overflow: qt } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (a = hr(e)),
                (a.return = t),
                (t.child = a),
                (We = t),
                (De = null)))
            : (e = null),
          e === null)
        )
          throw ca(t);
        return ((t.lanes = 536870912), null);
      }
      return hs(t, l);
    }
    var i = e.memoizedState;
    if (i !== null) {
      var c = i.dehydrated;
      if ((Gi(t), n))
        if (t.flags & 256) ((t.flags &= -257), (t = Ro(e, t, a)));
        else if (t.memoizedState !== null)
          ((t.child = e.child), (t.flags |= 128), (t = null));
        else throw Error(r(558));
      else if (
        (Qe || fl(e, t, a, !1), (n = (a & e.childLanes) !== 0), Qe || n)
      ) {
        if (
          ((l = Ce),
          l !== null && ((c = ju(l, a)), c !== 0 && c !== i.retryLane))
        )
          throw ((i.retryLane = c), Da(e, c), rt(l, e, c), rc);
        (_s(), (t = Ro(e, t, a)));
      } else
        ((e = i.treeContext),
          (De = Et(c.nextSibling)),
          (We = t),
          (be = !0),
          (ia = null),
          (Tt = !1),
          e !== null && pr(t, e),
          (t = hs(t, l)),
          (t.flags |= 4096));
      return t;
    }
    return (
      (e = Lt(e.child, { mode: l.mode, children: l.children })),
      (e.ref = t.ref),
      (t.child = e),
      (e.return = t),
      e
    );
  }
  function ms(e, t) {
    var a = t.ref;
    if (a === null) e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof a != "function" && typeof a != "object") throw Error(r(284));
      (e === null || e.ref !== a) && (t.flags |= 4194816);
    }
  }
  function oc(e, t, a, l, n) {
    return (
      Ba(t),
      (a = Qi(e, t, a, l, void 0, n)),
      (l = Vi()),
      e !== null && !Qe
        ? (Ki(e, t, n), Jt(e, t, n))
        : (be && l && Ai(t), (t.flags |= 1), Pe(e, t, a, n), t.child)
    );
  }
  function Oo(e, t, a, l, n, i) {
    return (
      Ba(t),
      (t.updateQueue = null),
      (a = Dr(t, l, a, n)),
      Cr(e),
      (l = Vi()),
      e !== null && !Qe
        ? (Ki(e, t, i), Jt(e, t, i))
        : (be && l && Ai(t), (t.flags |= 1), Pe(e, t, a, i), t.child)
    );
  }
  function Co(e, t, a, l, n) {
    if ((Ba(t), t.stateNode === null)) {
      var i = cl,
        c = a.contextType;
      (typeof c == "object" && c !== null && (i = Ie(c)),
        (i = new a(l, i)),
        (t.memoizedState =
          i.state !== null && i.state !== void 0 ? i.state : null),
        (i.updater = cc),
        (t.stateNode = i),
        (i._reactInternals = t),
        (i = t.stateNode),
        (i.props = l),
        (i.state = t.memoizedState),
        (i.refs = {}),
        Ui(t),
        (c = a.contextType),
        (i.context = typeof c == "object" && c !== null ? Ie(c) : cl),
        (i.state = t.memoizedState),
        (c = a.getDerivedStateFromProps),
        typeof c == "function" && (ic(t, a, c, l), (i.state = t.memoizedState)),
        typeof a.getDerivedStateFromProps == "function" ||
          typeof i.getSnapshotBeforeUpdate == "function" ||
          (typeof i.UNSAFE_componentWillMount != "function" &&
            typeof i.componentWillMount != "function") ||
          ((c = i.state),
          typeof i.componentWillMount == "function" && i.componentWillMount(),
          typeof i.UNSAFE_componentWillMount == "function" &&
            i.UNSAFE_componentWillMount(),
          c !== i.state && cc.enqueueReplaceState(i, i.state, null),
          en(t, l, i, n),
          Pl(),
          (i.state = t.memoizedState)),
        typeof i.componentDidMount == "function" && (t.flags |= 4194308),
        (l = !0));
    } else if (e === null) {
      i = t.stateNode;
      var u = t.memoizedProps,
        o = Qa(a, u);
      i.props = o;
      var y = i.context,
        _ = a.contextType;
      ((c = cl), typeof _ == "object" && _ !== null && (c = Ie(_)));
      var z = a.getDerivedStateFromProps;
      ((_ =
        typeof z == "function" ||
        typeof i.getSnapshotBeforeUpdate == "function"),
        (u = t.pendingProps !== u),
        _ ||
          (typeof i.UNSAFE_componentWillReceiveProps != "function" &&
            typeof i.componentWillReceiveProps != "function") ||
          ((u || y !== c) && xo(t, i, l, c)),
        (ra = !1));
      var x = t.memoizedState;
      ((i.state = x),
        en(t, l, i, n),
        Pl(),
        (y = t.memoizedState),
        u || x !== y || ra
          ? (typeof z == "function" && (ic(t, a, z, l), (y = t.memoizedState)),
            (o = ra || yo(t, a, o, l, x, y, c))
              ? (_ ||
                  (typeof i.UNSAFE_componentWillMount != "function" &&
                    typeof i.componentWillMount != "function") ||
                  (typeof i.componentWillMount == "function" &&
                    i.componentWillMount(),
                  typeof i.UNSAFE_componentWillMount == "function" &&
                    i.UNSAFE_componentWillMount()),
                typeof i.componentDidMount == "function" &&
                  (t.flags |= 4194308))
              : (typeof i.componentDidMount == "function" &&
                  (t.flags |= 4194308),
                (t.memoizedProps = l),
                (t.memoizedState = y)),
            (i.props = l),
            (i.state = y),
            (i.context = c),
            (l = o))
          : (typeof i.componentDidMount == "function" && (t.flags |= 4194308),
            (l = !1)));
    } else {
      ((i = t.stateNode),
        Hi(e, t),
        (c = t.memoizedProps),
        (_ = Qa(a, c)),
        (i.props = _),
        (z = t.pendingProps),
        (x = i.context),
        (y = a.contextType),
        (o = cl),
        typeof y == "object" && y !== null && (o = Ie(y)),
        (u = a.getDerivedStateFromProps),
        (y =
          typeof u == "function" ||
          typeof i.getSnapshotBeforeUpdate == "function") ||
          (typeof i.UNSAFE_componentWillReceiveProps != "function" &&
            typeof i.componentWillReceiveProps != "function") ||
          ((c !== z || x !== o) && xo(t, i, l, o)),
        (ra = !1),
        (x = t.memoizedState),
        (i.state = x),
        en(t, l, i, n),
        Pl());
      var b = t.memoizedState;
      c !== z ||
      x !== b ||
      ra ||
      (e !== null && e.dependencies !== null && $n(e.dependencies))
        ? (typeof u == "function" && (ic(t, a, u, l), (b = t.memoizedState)),
          (_ =
            ra ||
            yo(t, a, _, l, x, b, o) ||
            (e !== null && e.dependencies !== null && $n(e.dependencies)))
            ? (y ||
                (typeof i.UNSAFE_componentWillUpdate != "function" &&
                  typeof i.componentWillUpdate != "function") ||
                (typeof i.componentWillUpdate == "function" &&
                  i.componentWillUpdate(l, b, o),
                typeof i.UNSAFE_componentWillUpdate == "function" &&
                  i.UNSAFE_componentWillUpdate(l, b, o)),
              typeof i.componentDidUpdate == "function" && (t.flags |= 4),
              typeof i.getSnapshotBeforeUpdate == "function" &&
                (t.flags |= 1024))
            : (typeof i.componentDidUpdate != "function" ||
                (c === e.memoizedProps && x === e.memoizedState) ||
                (t.flags |= 4),
              typeof i.getSnapshotBeforeUpdate != "function" ||
                (c === e.memoizedProps && x === e.memoizedState) ||
                (t.flags |= 1024),
              (t.memoizedProps = l),
              (t.memoizedState = b)),
          (i.props = l),
          (i.state = b),
          (i.context = o),
          (l = _))
        : (typeof i.componentDidUpdate != "function" ||
            (c === e.memoizedProps && x === e.memoizedState) ||
            (t.flags |= 4),
          typeof i.getSnapshotBeforeUpdate != "function" ||
            (c === e.memoizedProps && x === e.memoizedState) ||
            (t.flags |= 1024),
          (l = !1));
    }
    return (
      (i = l),
      ms(e, t),
      (l = (t.flags & 128) !== 0),
      i || l
        ? ((i = t.stateNode),
          (a =
            l && typeof a.getDerivedStateFromError != "function"
              ? null
              : i.render()),
          (t.flags |= 1),
          e !== null && l
            ? ((t.child = Ga(t, e.child, null, n)),
              (t.child = Ga(t, null, a, n)))
            : Pe(e, t, a, n),
          (t.memoizedState = i.state),
          (e = t.child))
        : (e = Jt(e, t, n)),
      e
    );
  }
  function Do(e, t, a, l) {
    return (Ua(), (t.flags |= 256), Pe(e, t, a, l), t.child);
  }
  var fc = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null,
  };
  function dc(e) {
    return { baseLanes: e, cachePool: Sr() };
  }
  function hc(e, t, a) {
    return ((e = e !== null ? e.childLanes & ~a : 0), t && (e |= yt), e);
  }
  function qo(e, t, a) {
    var l = t.pendingProps,
      n = !1,
      i = (t.flags & 128) !== 0,
      c;
    if (
      ((c = i) ||
        (c =
          e !== null && e.memoizedState === null ? !1 : (Ye.current & 2) !== 0),
      c && ((n = !0), (t.flags &= -129)),
      (c = (t.flags & 32) !== 0),
      (t.flags &= -33),
      e === null)
    ) {
      if (be) {
        if (
          (n ? da(t) : ha(),
          (e = De)
            ? ((e = Qf(e, Tt)),
              (e = e !== null && e.data !== "&" ? e : null),
              e !== null &&
                ((t.memoizedState = {
                  dehydrated: e,
                  treeContext: sa !== null ? { id: Dt, overflow: qt } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (a = hr(e)),
                (a.return = t),
                (t.child = a),
                (We = t),
                (De = null)))
            : (e = null),
          e === null)
        )
          throw ca(t);
        return ($c(e) ? (t.lanes = 32) : (t.lanes = 536870912), null);
      }
      var u = l.children;
      return (
        (l = l.fallback),
        n
          ? (ha(),
            (n = t.mode),
            (u = vs({ mode: "hidden", children: u }, n)),
            (l = qa(l, n, a, null)),
            (u.return = t),
            (l.return = t),
            (u.sibling = l),
            (t.child = u),
            (l = t.child),
            (l.memoizedState = dc(a)),
            (l.childLanes = hc(e, c, a)),
            (t.memoizedState = fc),
            sn(null, l))
          : (da(t), mc(t, u))
      );
    }
    var o = e.memoizedState;
    if (o !== null && ((u = o.dehydrated), u !== null)) {
      if (i)
        t.flags & 256
          ? (da(t), (t.flags &= -257), (t = vc(e, t, a)))
          : t.memoizedState !== null
            ? (ha(), (t.child = e.child), (t.flags |= 128), (t = null))
            : (ha(),
              (u = l.fallback),
              (n = t.mode),
              (l = vs({ mode: "visible", children: l.children }, n)),
              (u = qa(u, n, a, null)),
              (u.flags |= 2),
              (l.return = t),
              (u.return = t),
              (l.sibling = u),
              (t.child = l),
              Ga(t, e.child, null, a),
              (l = t.child),
              (l.memoizedState = dc(a)),
              (l.childLanes = hc(e, c, a)),
              (t.memoizedState = fc),
              (t = sn(null, l)));
      else if ((da(t), $c(u))) {
        if (((c = u.nextSibling && u.nextSibling.dataset), c)) var y = c.dgst;
        ((c = y),
          (l = Error(r(419))),
          (l.stack = ""),
          (l.digest = c),
          Jl({ value: l, source: null, stack: null }),
          (t = vc(e, t, a)));
      } else if (
        (Qe || fl(e, t, a, !1), (c = (a & e.childLanes) !== 0), Qe || c)
      ) {
        if (
          ((c = Ce),
          c !== null && ((l = ju(c, a)), l !== 0 && l !== o.retryLane))
        )
          throw ((o.retryLane = l), Da(e, l), rt(c, e, l), rc);
        (kc(u) || _s(), (t = vc(e, t, a)));
      } else
        kc(u)
          ? ((t.flags |= 192), (t.child = e.child), (t = null))
          : ((e = o.treeContext),
            (De = Et(u.nextSibling)),
            (We = t),
            (be = !0),
            (ia = null),
            (Tt = !1),
            e !== null && pr(t, e),
            (t = mc(t, l.children)),
            (t.flags |= 4096));
      return t;
    }
    return n
      ? (ha(),
        (u = l.fallback),
        (n = t.mode),
        (o = e.child),
        (y = o.sibling),
        (l = Lt(o, { mode: "hidden", children: l.children })),
        (l.subtreeFlags = o.subtreeFlags & 65011712),
        y !== null ? (u = Lt(y, u)) : ((u = qa(u, n, a, null)), (u.flags |= 2)),
        (u.return = t),
        (l.return = t),
        (l.sibling = u),
        (t.child = l),
        sn(null, l),
        (l = t.child),
        (u = e.child.memoizedState),
        u === null
          ? (u = dc(a))
          : ((n = u.cachePool),
            n !== null
              ? ((o = Ge._currentValue),
                (n = n.parent !== o ? { parent: o, pool: o } : n))
              : (n = Sr()),
            (u = { baseLanes: u.baseLanes | a, cachePool: n })),
        (l.memoizedState = u),
        (l.childLanes = hc(e, c, a)),
        (t.memoizedState = fc),
        sn(e.child, l))
      : (da(t),
        (a = e.child),
        (e = a.sibling),
        (a = Lt(a, { mode: "visible", children: l.children })),
        (a.return = t),
        (a.sibling = null),
        e !== null &&
          ((c = t.deletions),
          c === null ? ((t.deletions = [e]), (t.flags |= 16)) : c.push(e)),
        (t.child = a),
        (t.memoizedState = null),
        a);
  }
  function mc(e, t) {
    return (
      (t = vs({ mode: "visible", children: t }, e.mode)),
      (t.return = e),
      (e.child = t)
    );
  }
  function vs(e, t) {
    return ((e = mt(22, e, null, t)), (e.lanes = 0), e);
  }
  function vc(e, t, a) {
    return (
      Ga(t, e.child, null, a),
      (e = mc(t, t.pendingProps.children)),
      (e.flags |= 2),
      (t.memoizedState = null),
      e
    );
  }
  function Uo(e, t, a) {
    e.lanes |= t;
    var l = e.alternate;
    (l !== null && (l.lanes |= t), Mi(e.return, t, a));
  }
  function pc(e, t, a, l, n, i) {
    var c = e.memoizedState;
    c === null
      ? (e.memoizedState = {
          isBackwards: t,
          rendering: null,
          renderingStartTime: 0,
          last: l,
          tail: a,
          tailMode: n,
          treeForkCount: i,
        })
      : ((c.isBackwards = t),
        (c.rendering = null),
        (c.renderingStartTime = 0),
        (c.last = l),
        (c.tail = a),
        (c.tailMode = n),
        (c.treeForkCount = i));
  }
  function Ho(e, t, a) {
    var l = t.pendingProps,
      n = l.revealOrder,
      i = l.tail;
    l = l.children;
    var c = Ye.current,
      u = (c & 2) !== 0;
    if (
      (u ? ((c = (c & 1) | 2), (t.flags |= 128)) : (c &= 1),
      Q(Ye, c),
      Pe(e, t, l, a),
      (l = be ? Kl : 0),
      !u && e !== null && (e.flags & 128) !== 0)
    )
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Uo(e, a, t);
        else if (e.tag === 19) Uo(e, a, t);
        else if (e.child !== null) {
          ((e.child.return = e), (e = e.child));
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    switch (n) {
      case "forwards":
        for (a = t.child, n = null; a !== null; )
          ((e = a.alternate),
            e !== null && ls(e) === null && (n = a),
            (a = a.sibling));
        ((a = n),
          a === null
            ? ((n = t.child), (t.child = null))
            : ((n = a.sibling), (a.sibling = null)),
          pc(t, !1, n, a, i, l));
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (a = null, n = t.child, t.child = null; n !== null; ) {
          if (((e = n.alternate), e !== null && ls(e) === null)) {
            t.child = n;
            break;
          }
          ((e = n.sibling), (n.sibling = a), (a = n), (n = e));
        }
        pc(t, !0, a, null, i, l);
        break;
      case "together":
        pc(t, !1, null, null, void 0, l);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Jt(e, t, a) {
    if (
      (e !== null && (t.dependencies = e.dependencies),
      (pa |= t.lanes),
      (a & t.childLanes) === 0)
    )
      if (e !== null) {
        if ((fl(e, t, a, !1), (a & t.childLanes) === 0)) return null;
      } else return null;
    if (e !== null && t.child !== e.child) throw Error(r(153));
    if (t.child !== null) {
      for (
        e = t.child, a = Lt(e, e.pendingProps), t.child = a, a.return = t;
        e.sibling !== null;
      )
        ((e = e.sibling),
          (a = a.sibling = Lt(e, e.pendingProps)),
          (a.return = t));
      a.sibling = null;
    }
    return t.child;
  }
  function gc(e, t) {
    return (e.lanes & t) !== 0
      ? !0
      : ((e = e.dependencies), !!(e !== null && $n(e)));
  }
  function $h(e, t, a) {
    switch (t.tag) {
      case 3:
        ($e(t, t.stateNode.containerInfo),
          ua(t, Ge, e.memoizedState.cache),
          Ua());
        break;
      case 27:
      case 5:
        wa(t);
        break;
      case 4:
        $e(t, t.stateNode.containerInfo);
        break;
      case 10:
        ua(t, t.type, t.memoizedProps.value);
        break;
      case 31:
        if (t.memoizedState !== null) return ((t.flags |= 128), Gi(t), null);
        break;
      case 13:
        var l = t.memoizedState;
        if (l !== null)
          return l.dehydrated !== null
            ? (da(t), (t.flags |= 128), null)
            : (a & t.child.childLanes) !== 0
              ? qo(e, t, a)
              : (da(t), (e = Jt(e, t, a)), e !== null ? e.sibling : null);
        da(t);
        break;
      case 19:
        var n = (e.flags & 128) !== 0;
        if (
          ((l = (a & t.childLanes) !== 0),
          l || (fl(e, t, a, !1), (l = (a & t.childLanes) !== 0)),
          n)
        ) {
          if (l) return Ho(e, t, a);
          t.flags |= 128;
        }
        if (
          ((n = t.memoizedState),
          n !== null &&
            ((n.rendering = null), (n.tail = null), (n.lastEffect = null)),
          Q(Ye, Ye.current),
          l)
        )
          break;
        return null;
      case 22:
        return ((t.lanes = 0), zo(e, t, a, t.pendingProps));
      case 24:
        ua(t, Ge, e.memoizedState.cache);
    }
    return Jt(e, t, a);
  }
  function Bo(e, t, a) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps) Qe = !0;
      else {
        if (!gc(e, a) && (t.flags & 128) === 0) return ((Qe = !1), $h(e, t, a));
        Qe = (e.flags & 131072) !== 0;
      }
    else ((Qe = !1), be && (t.flags & 1048576) !== 0 && vr(t, Kl, t.index));
    switch (((t.lanes = 0), t.tag)) {
      case 16:
        e: {
          var l = t.pendingProps;
          if (((e = Ya(t.elementType)), (t.type = e), typeof e == "function"))
            Si(e)
              ? ((l = Qa(e, l)), (t.tag = 1), (t = Co(null, t, e, l, a)))
              : ((t.tag = 0), (t = oc(null, t, e, l, a)));
          else {
            if (e != null) {
              var n = e.$$typeof;
              if (n === X) {
                ((t.tag = 11), (t = To(null, t, e, l, a)));
                break e;
              } else if (n === A) {
                ((t.tag = 14), (t = wo(null, t, e, l, a)));
                break e;
              }
            }
            throw ((t = J(e) || e), Error(r(306, t, "")));
          }
        }
        return t;
      case 0:
        return oc(e, t, t.type, t.pendingProps, a);
      case 1:
        return ((l = t.type), (n = Qa(l, t.pendingProps)), Co(e, t, l, n, a));
      case 3:
        e: {
          if (($e(t, t.stateNode.containerInfo), e === null))
            throw Error(r(387));
          l = t.pendingProps;
          var i = t.memoizedState;
          ((n = i.element), Hi(e, t), en(t, l, null, a));
          var c = t.memoizedState;
          if (
            ((l = c.cache),
            ua(t, Ge, l),
            l !== i.cache && Ri(t, [Ge], a, !0),
            Pl(),
            (l = c.element),
            i.isDehydrated)
          )
            if (
              ((i = { element: l, isDehydrated: !1, cache: c.cache }),
              (t.updateQueue.baseState = i),
              (t.memoizedState = i),
              t.flags & 256)
            ) {
              t = Do(e, t, l, a);
              break e;
            } else if (l !== n) {
              ((n = Nt(Error(r(424)), t)), Jl(n), (t = Do(e, t, l, a)));
              break e;
            } else {
              switch (((e = t.stateNode.containerInfo), e.nodeType)) {
                case 9:
                  e = e.body;
                  break;
                default:
                  e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
              }
              for (
                De = Et(e.firstChild),
                  We = t,
                  be = !0,
                  ia = null,
                  Tt = !0,
                  a = Er(t, null, l, a),
                  t.child = a;
                a;
              )
                ((a.flags = (a.flags & -3) | 4096), (a = a.sibling));
            }
          else {
            if ((Ua(), l === n)) {
              t = Jt(e, t, a);
              break e;
            }
            Pe(e, t, l, a);
          }
          t = t.child;
        }
        return t;
      case 26:
        return (
          ms(e, t),
          e === null
            ? (a = Ff(t.type, null, t.pendingProps, null))
              ? (t.memoizedState = a)
              : be ||
                ((a = t.type),
                (e = t.pendingProps),
                (l = Rs(ve.current).createElement(a)),
                (l[Fe] = t),
                (l[lt] = e),
                et(l, a, e),
                Je(l),
                (t.stateNode = l))
            : (t.memoizedState = Ff(
                t.type,
                e.memoizedProps,
                t.pendingProps,
                e.memoizedState,
              )),
          null
        );
      case 27:
        return (
          wa(t),
          e === null &&
            be &&
            ((l = t.stateNode = Jf(t.type, t.pendingProps, ve.current)),
            (We = t),
            (Tt = !0),
            (n = De),
            ba(t.type) ? ((Fc = n), (De = Et(l.firstChild))) : (De = n)),
          Pe(e, t, t.pendingProps.children, a),
          ms(e, t),
          e === null && (t.flags |= 4194304),
          t.child
        );
      case 5:
        return (
          e === null &&
            be &&
            ((n = l = De) &&
              ((l = A0(l, t.type, t.pendingProps, Tt)),
              l !== null
                ? ((t.stateNode = l),
                  (We = t),
                  (De = Et(l.firstChild)),
                  (Tt = !1),
                  (n = !0))
                : (n = !1)),
            n || ca(t)),
          wa(t),
          (n = t.type),
          (i = t.pendingProps),
          (c = e !== null ? e.memoizedProps : null),
          (l = i.children),
          Vc(n, i) ? (l = null) : c !== null && Vc(n, c) && (t.flags |= 32),
          t.memoizedState !== null &&
            ((n = Qi(e, t, Yh, null, null, a)), (bn._currentValue = n)),
          ms(e, t),
          Pe(e, t, l, a),
          t.child
        );
      case 6:
        return (
          e === null &&
            be &&
            ((e = a = De) &&
              ((a = T0(a, t.pendingProps, Tt)),
              a !== null
                ? ((t.stateNode = a), (We = t), (De = null), (e = !0))
                : (e = !1)),
            e || ca(t)),
          null
        );
      case 13:
        return qo(e, t, a);
      case 4:
        return (
          $e(t, t.stateNode.containerInfo),
          (l = t.pendingProps),
          e === null ? (t.child = Ga(t, null, l, a)) : Pe(e, t, l, a),
          t.child
        );
      case 11:
        return To(e, t, t.type, t.pendingProps, a);
      case 7:
        return (Pe(e, t, t.pendingProps, a), t.child);
      case 8:
        return (Pe(e, t, t.pendingProps.children, a), t.child);
      case 12:
        return (Pe(e, t, t.pendingProps.children, a), t.child);
      case 10:
        return (
          (l = t.pendingProps),
          ua(t, t.type, l.value),
          Pe(e, t, l.children, a),
          t.child
        );
      case 9:
        return (
          (n = t.type._context),
          (l = t.pendingProps.children),
          Ba(t),
          (n = Ie(n)),
          (l = l(n)),
          (t.flags |= 1),
          Pe(e, t, l, a),
          t.child
        );
      case 14:
        return wo(e, t, t.type, t.pendingProps, a);
      case 15:
        return Eo(e, t, t.type, t.pendingProps, a);
      case 19:
        return Ho(e, t, a);
      case 31:
        return kh(e, t, a);
      case 22:
        return zo(e, t, a, t.pendingProps);
      case 24:
        return (
          Ba(t),
          (l = Ie(Ge)),
          e === null
            ? ((n = Di()),
              n === null &&
                ((n = Ce),
                (i = Oi()),
                (n.pooledCache = i),
                i.refCount++,
                i !== null && (n.pooledCacheLanes |= a),
                (n = i)),
              (t.memoizedState = { parent: l, cache: n }),
              Ui(t),
              ua(t, Ge, n))
            : ((e.lanes & a) !== 0 && (Hi(e, t), en(t, null, null, a), Pl()),
              (n = e.memoizedState),
              (i = t.memoizedState),
              n.parent !== l
                ? ((n = { parent: l, cache: l }),
                  (t.memoizedState = n),
                  t.lanes === 0 &&
                    (t.memoizedState = t.updateQueue.baseState = n),
                  ua(t, Ge, l))
                : ((l = i.cache),
                  ua(t, Ge, l),
                  l !== n.cache && Ri(t, [Ge], a, !0))),
          Pe(e, t, t.pendingProps.children, a),
          t.child
        );
      case 29:
        throw t.pendingProps;
    }
    throw Error(r(156, t.tag));
  }
  function kt(e) {
    e.flags |= 4;
  }
  function yc(e, t, a, l, n) {
    if (((t = (e.mode & 32) !== 0) && (t = !1), t)) {
      if (((e.flags |= 16777216), (n & 335544128) === n))
        if (e.stateNode.complete) e.flags |= 8192;
        else if (df()) e.flags |= 8192;
        else throw ((La = Pn), qi);
    } else e.flags &= -16777217;
  }
  function Zo(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (((e.flags |= 16777216), !td(t)))
      if (df()) e.flags |= 8192;
      else throw ((La = Pn), qi);
  }
  function ps(e, t) {
    (t !== null && (e.flags |= 4),
      e.flags & 16384 &&
        ((t = e.tag !== 22 ? gu() : 536870912), (e.lanes |= t), (Nl |= t)));
  }
  function cn(e, t) {
    if (!be)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var a = null; t !== null; )
            (t.alternate !== null && (a = t), (t = t.sibling));
          a === null ? (e.tail = null) : (a.sibling = null);
          break;
        case "collapsed":
          a = e.tail;
          for (var l = null; a !== null; )
            (a.alternate !== null && (l = a), (a = a.sibling));
          l === null
            ? t || e.tail === null
              ? (e.tail = null)
              : (e.tail.sibling = null)
            : (l.sibling = null);
      }
  }
  function qe(e) {
    var t = e.alternate !== null && e.alternate.child === e.child,
      a = 0,
      l = 0;
    if (t)
      for (var n = e.child; n !== null; )
        ((a |= n.lanes | n.childLanes),
          (l |= n.subtreeFlags & 65011712),
          (l |= n.flags & 65011712),
          (n.return = e),
          (n = n.sibling));
    else
      for (n = e.child; n !== null; )
        ((a |= n.lanes | n.childLanes),
          (l |= n.subtreeFlags),
          (l |= n.flags),
          (n.return = e),
          (n = n.sibling));
    return ((e.subtreeFlags |= l), (e.childLanes = a), t);
  }
  function Fh(e, t, a) {
    var l = t.pendingProps;
    switch ((Ti(t), t.tag)) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (qe(t), null);
      case 1:
        return (qe(t), null);
      case 3:
        return (
          (a = t.stateNode),
          (l = null),
          e !== null && (l = e.memoizedState.cache),
          t.memoizedState.cache !== l && (t.flags |= 2048),
          Qt(Ge),
          we(),
          a.pendingContext &&
            ((a.context = a.pendingContext), (a.pendingContext = null)),
          (e === null || e.child === null) &&
            (ol(t)
              ? kt(t)
              : e === null ||
                (e.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
                ((t.flags |= 1024), Ei())),
          qe(t),
          null
        );
      case 26:
        var n = t.type,
          i = t.memoizedState;
        return (
          e === null
            ? (kt(t),
              i !== null ? (qe(t), Zo(t, i)) : (qe(t), yc(t, n, null, l, a)))
            : i
              ? i !== e.memoizedState
                ? (kt(t), qe(t), Zo(t, i))
                : (qe(t), (t.flags &= -16777217))
              : ((e = e.memoizedProps),
                e !== l && kt(t),
                qe(t),
                yc(t, n, e, l, a)),
          null
        );
      case 27:
        if (
          (Ja(t),
          (a = ve.current),
          (n = t.type),
          e !== null && t.stateNode != null)
        )
          e.memoizedProps !== l && kt(t);
        else {
          if (!l) {
            if (t.stateNode === null) throw Error(r(166));
            return (qe(t), null);
          }
          ((e = F.current),
            ol(t) ? gr(t) : ((e = Jf(n, l, a)), (t.stateNode = e), kt(t)));
        }
        return (qe(t), null);
      case 5:
        if ((Ja(t), (n = t.type), e !== null && t.stateNode != null))
          e.memoizedProps !== l && kt(t);
        else {
          if (!l) {
            if (t.stateNode === null) throw Error(r(166));
            return (qe(t), null);
          }
          if (((i = F.current), ol(t))) gr(t);
          else {
            var c = Rs(ve.current);
            switch (i) {
              case 1:
                i = c.createElementNS("http://www.w3.org/2000/svg", n);
                break;
              case 2:
                i = c.createElementNS("http://www.w3.org/1998/Math/MathML", n);
                break;
              default:
                switch (n) {
                  case "svg":
                    i = c.createElementNS("http://www.w3.org/2000/svg", n);
                    break;
                  case "math":
                    i = c.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      n,
                    );
                    break;
                  case "script":
                    ((i = c.createElement("div")),
                      (i.innerHTML = "<script><\/script>"),
                      (i = i.removeChild(i.firstChild)));
                    break;
                  case "select":
                    ((i =
                      typeof l.is == "string"
                        ? c.createElement("select", { is: l.is })
                        : c.createElement("select")),
                      l.multiple
                        ? (i.multiple = !0)
                        : l.size && (i.size = l.size));
                    break;
                  default:
                    i =
                      typeof l.is == "string"
                        ? c.createElement(n, { is: l.is })
                        : c.createElement(n);
                }
            }
            ((i[Fe] = t), (i[lt] = l));
            e: for (c = t.child; c !== null; ) {
              if (c.tag === 5 || c.tag === 6) i.appendChild(c.stateNode);
              else if (c.tag !== 4 && c.tag !== 27 && c.child !== null) {
                ((c.child.return = c), (c = c.child));
                continue;
              }
              if (c === t) break e;
              for (; c.sibling === null; ) {
                if (c.return === null || c.return === t) break e;
                c = c.return;
              }
              ((c.sibling.return = c.return), (c = c.sibling));
            }
            t.stateNode = i;
            e: switch ((et(i, n, l), n)) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                l = !!l.autoFocus;
                break e;
              case "img":
                l = !0;
                break e;
              default:
                l = !1;
            }
            l && kt(t);
          }
        }
        return (
          qe(t),
          yc(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, a),
          null
        );
      case 6:
        if (e && t.stateNode != null) e.memoizedProps !== l && kt(t);
        else {
          if (typeof l != "string" && t.stateNode === null) throw Error(r(166));
          if (((e = ve.current), ol(t))) {
            if (
              ((e = t.stateNode),
              (a = t.memoizedProps),
              (l = null),
              (n = We),
              n !== null)
            )
              switch (n.tag) {
                case 27:
                case 5:
                  l = n.memoizedProps;
              }
            ((e[Fe] = t),
              (e = !!(
                e.nodeValue === a ||
                (l !== null && l.suppressHydrationWarning === !0) ||
                Uf(e.nodeValue, a)
              )),
              e || ca(t, !0));
          } else
            ((e = Rs(e).createTextNode(l)), (e[Fe] = t), (t.stateNode = e));
        }
        return (qe(t), null);
      case 31:
        if (((a = t.memoizedState), e === null || e.memoizedState !== null)) {
          if (((l = ol(t)), a !== null)) {
            if (e === null) {
              if (!l) throw Error(r(318));
              if (
                ((e = t.memoizedState),
                (e = e !== null ? e.dehydrated : null),
                !e)
              )
                throw Error(r(557));
              e[Fe] = t;
            } else
              (Ua(),
                (t.flags & 128) === 0 && (t.memoizedState = null),
                (t.flags |= 4));
            (qe(t), (e = !1));
          } else
            ((a = Ei()),
              e !== null &&
                e.memoizedState !== null &&
                (e.memoizedState.hydrationErrors = a),
              (e = !0));
          if (!e) return t.flags & 256 ? (pt(t), t) : (pt(t), null);
          if ((t.flags & 128) !== 0) throw Error(r(558));
        }
        return (qe(t), null);
      case 13:
        if (
          ((l = t.memoizedState),
          e === null ||
            (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
        ) {
          if (((n = ol(t)), l !== null && l.dehydrated !== null)) {
            if (e === null) {
              if (!n) throw Error(r(318));
              if (
                ((n = t.memoizedState),
                (n = n !== null ? n.dehydrated : null),
                !n)
              )
                throw Error(r(317));
              n[Fe] = t;
            } else
              (Ua(),
                (t.flags & 128) === 0 && (t.memoizedState = null),
                (t.flags |= 4));
            (qe(t), (n = !1));
          } else
            ((n = Ei()),
              e !== null &&
                e.memoizedState !== null &&
                (e.memoizedState.hydrationErrors = n),
              (n = !0));
          if (!n) return t.flags & 256 ? (pt(t), t) : (pt(t), null);
        }
        return (
          pt(t),
          (t.flags & 128) !== 0
            ? ((t.lanes = a), t)
            : ((a = l !== null),
              (e = e !== null && e.memoizedState !== null),
              a &&
                ((l = t.child),
                (n = null),
                l.alternate !== null &&
                  l.alternate.memoizedState !== null &&
                  l.alternate.memoizedState.cachePool !== null &&
                  (n = l.alternate.memoizedState.cachePool.pool),
                (i = null),
                l.memoizedState !== null &&
                  l.memoizedState.cachePool !== null &&
                  (i = l.memoizedState.cachePool.pool),
                i !== n && (l.flags |= 2048)),
              a !== e && a && (t.child.flags |= 8192),
              ps(t, t.updateQueue),
              qe(t),
              null)
        );
      case 4:
        return (we(), e === null && Yc(t.stateNode.containerInfo), qe(t), null);
      case 10:
        return (Qt(t.type), qe(t), null);
      case 19:
        if ((E(Ye), (l = t.memoizedState), l === null)) return (qe(t), null);
        if (((n = (t.flags & 128) !== 0), (i = l.rendering), i === null))
          if (n) cn(l, !1);
          else {
            if (Ze !== 0 || (e !== null && (e.flags & 128) !== 0))
              for (e = t.child; e !== null; ) {
                if (((i = ls(e)), i !== null)) {
                  for (
                    t.flags |= 128,
                      cn(l, !1),
                      e = i.updateQueue,
                      t.updateQueue = e,
                      ps(t, e),
                      t.subtreeFlags = 0,
                      e = a,
                      a = t.child;
                    a !== null;
                  )
                    (dr(a, e), (a = a.sibling));
                  return (
                    Q(Ye, (Ye.current & 1) | 2),
                    be && Gt(t, l.treeForkCount),
                    t.child
                  );
                }
                e = e.sibling;
              }
            l.tail !== null &&
              ot() > bs &&
              ((t.flags |= 128), (n = !0), cn(l, !1), (t.lanes = 4194304));
          }
        else {
          if (!n)
            if (((e = ls(i)), e !== null)) {
              if (
                ((t.flags |= 128),
                (n = !0),
                (e = e.updateQueue),
                (t.updateQueue = e),
                ps(t, e),
                cn(l, !0),
                l.tail === null &&
                  l.tailMode === "hidden" &&
                  !i.alternate &&
                  !be)
              )
                return (qe(t), null);
            } else
              2 * ot() - l.renderingStartTime > bs &&
                a !== 536870912 &&
                ((t.flags |= 128), (n = !0), cn(l, !1), (t.lanes = 4194304));
          l.isBackwards
            ? ((i.sibling = t.child), (t.child = i))
            : ((e = l.last),
              e !== null ? (e.sibling = i) : (t.child = i),
              (l.last = i));
        }
        return l.tail !== null
          ? ((e = l.tail),
            (l.rendering = e),
            (l.tail = e.sibling),
            (l.renderingStartTime = ot()),
            (e.sibling = null),
            (a = Ye.current),
            Q(Ye, n ? (a & 1) | 2 : a & 1),
            be && Gt(t, l.treeForkCount),
            e)
          : (qe(t), null);
      case 22:
      case 23:
        return (
          pt(t),
          Li(),
          (l = t.memoizedState !== null),
          e !== null
            ? (e.memoizedState !== null) !== l && (t.flags |= 8192)
            : l && (t.flags |= 8192),
          l
            ? (a & 536870912) !== 0 &&
              (t.flags & 128) === 0 &&
              (qe(t), t.subtreeFlags & 6 && (t.flags |= 8192))
            : qe(t),
          (a = t.updateQueue),
          a !== null && ps(t, a.retryQueue),
          (a = null),
          e !== null &&
            e.memoizedState !== null &&
            e.memoizedState.cachePool !== null &&
            (a = e.memoizedState.cachePool.pool),
          (l = null),
          t.memoizedState !== null &&
            t.memoizedState.cachePool !== null &&
            (l = t.memoizedState.cachePool.pool),
          l !== a && (t.flags |= 2048),
          e !== null && E(Za),
          null
        );
      case 24:
        return (
          (a = null),
          e !== null && (a = e.memoizedState.cache),
          t.memoizedState.cache !== a && (t.flags |= 2048),
          Qt(Ge),
          qe(t),
          null
        );
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(r(156, t.tag));
  }
  function Wh(e, t) {
    switch ((Ti(t), t.tag)) {
      case 1:
        return (
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 3:
        return (
          Qt(Ge),
          we(),
          (e = t.flags),
          (e & 65536) !== 0 && (e & 128) === 0
            ? ((t.flags = (e & -65537) | 128), t)
            : null
        );
      case 26:
      case 27:
      case 5:
        return (Ja(t), null);
      case 31:
        if (t.memoizedState !== null) {
          if ((pt(t), t.alternate === null)) throw Error(r(340));
          Ua();
        }
        return (
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 13:
        if (
          (pt(t), (e = t.memoizedState), e !== null && e.dehydrated !== null)
        ) {
          if (t.alternate === null) throw Error(r(340));
          Ua();
        }
        return (
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 19:
        return (E(Ye), null);
      case 4:
        return (we(), null);
      case 10:
        return (Qt(t.type), null);
      case 22:
      case 23:
        return (
          pt(t),
          Li(),
          e !== null && E(Za),
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 24:
        return (Qt(Ge), null);
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Yo(e, t) {
    switch ((Ti(t), t.tag)) {
      case 3:
        (Qt(Ge), we());
        break;
      case 26:
      case 27:
      case 5:
        Ja(t);
        break;
      case 4:
        we();
        break;
      case 31:
        t.memoizedState !== null && pt(t);
        break;
      case 13:
        pt(t);
        break;
      case 19:
        E(Ye);
        break;
      case 10:
        Qt(t.type);
        break;
      case 22:
      case 23:
        (pt(t), Li(), e !== null && E(Za));
        break;
      case 24:
        Qt(Ge);
    }
  }
  function un(e, t) {
    try {
      var a = t.updateQueue,
        l = a !== null ? a.lastEffect : null;
      if (l !== null) {
        var n = l.next;
        a = n;
        do {
          if ((a.tag & e) === e) {
            l = void 0;
            var i = a.create,
              c = a.inst;
            ((l = i()), (c.destroy = l));
          }
          a = a.next;
        } while (a !== n);
      }
    } catch (u) {
      ze(t, t.return, u);
    }
  }
  function ma(e, t, a) {
    try {
      var l = t.updateQueue,
        n = l !== null ? l.lastEffect : null;
      if (n !== null) {
        var i = n.next;
        l = i;
        do {
          if ((l.tag & e) === e) {
            var c = l.inst,
              u = c.destroy;
            if (u !== void 0) {
              ((c.destroy = void 0), (n = t));
              var o = a,
                y = u;
              try {
                y();
              } catch (_) {
                ze(n, o, _);
              }
            }
          }
          l = l.next;
        } while (l !== i);
      }
    } catch (_) {
      ze(t, t.return, _);
    }
  }
  function Lo(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var a = e.stateNode;
      try {
        Mr(t, a);
      } catch (l) {
        ze(e, e.return, l);
      }
    }
  }
  function Go(e, t, a) {
    ((a.props = Qa(e.type, e.memoizedProps)), (a.state = e.memoizedState));
    try {
      a.componentWillUnmount();
    } catch (l) {
      ze(e, t, l);
    }
  }
  function rn(e, t) {
    try {
      var a = e.ref;
      if (a !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var l = e.stateNode;
            break;
          case 30:
            l = e.stateNode;
            break;
          default:
            l = e.stateNode;
        }
        typeof a == "function" ? (e.refCleanup = a(l)) : (a.current = l);
      }
    } catch (n) {
      ze(e, t, n);
    }
  }
  function Ut(e, t) {
    var a = e.ref,
      l = e.refCleanup;
    if (a !== null)
      if (typeof l == "function")
        try {
          l();
        } catch (n) {
          ze(e, t, n);
        } finally {
          ((e.refCleanup = null),
            (e = e.alternate),
            e != null && (e.refCleanup = null));
        }
      else if (typeof a == "function")
        try {
          a(null);
        } catch (n) {
          ze(e, t, n);
        }
      else a.current = null;
  }
  function Xo(e) {
    var t = e.type,
      a = e.memoizedProps,
      l = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && l.focus();
          break e;
        case "img":
          a.src ? (l.src = a.src) : a.srcSet && (l.srcset = a.srcSet);
      }
    } catch (n) {
      ze(e, e.return, n);
    }
  }
  function xc(e, t, a) {
    try {
      var l = e.stateNode;
      (x0(l, e.type, a, t), (l[lt] = t));
    } catch (n) {
      ze(e, e.return, n);
    }
  }
  function Qo(e) {
    return (
      e.tag === 5 ||
      e.tag === 3 ||
      e.tag === 26 ||
      (e.tag === 27 && ba(e.type)) ||
      e.tag === 4
    );
  }
  function jc(e) {
    e: for (;;) {
      for (; e.sibling === null; ) {
        if (e.return === null || Qo(e.return)) return null;
        e = e.return;
      }
      for (
        e.sibling.return = e.return, e = e.sibling;
        e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
      ) {
        if (
          (e.tag === 27 && ba(e.type)) ||
          e.flags & 2 ||
          e.child === null ||
          e.tag === 4
        )
          continue e;
        ((e.child.return = e), (e = e.child));
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function bc(e, t, a) {
    var l = e.tag;
    if (l === 5 || l === 6)
      ((e = e.stateNode),
        t
          ? (a.nodeType === 9
              ? a.body
              : a.nodeName === "HTML"
                ? a.ownerDocument.body
                : a
            ).insertBefore(e, t)
          : ((t =
              a.nodeType === 9
                ? a.body
                : a.nodeName === "HTML"
                  ? a.ownerDocument.body
                  : a),
            t.appendChild(e),
            (a = a._reactRootContainer),
            a != null || t.onclick !== null || (t.onclick = Zt)));
    else if (
      l !== 4 &&
      (l === 27 && ba(e.type) && ((a = e.stateNode), (t = null)),
      (e = e.child),
      e !== null)
    )
      for (bc(e, t, a), e = e.sibling; e !== null; )
        (bc(e, t, a), (e = e.sibling));
  }
  function gs(e, t, a) {
    var l = e.tag;
    if (l === 5 || l === 6)
      ((e = e.stateNode), t ? a.insertBefore(e, t) : a.appendChild(e));
    else if (
      l !== 4 &&
      (l === 27 && ba(e.type) && (a = e.stateNode), (e = e.child), e !== null)
    )
      for (gs(e, t, a), e = e.sibling; e !== null; )
        (gs(e, t, a), (e = e.sibling));
  }
  function Vo(e) {
    var t = e.stateNode,
      a = e.memoizedProps;
    try {
      for (var l = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      (et(t, l, a), (t[Fe] = e), (t[lt] = a));
    } catch (i) {
      ze(e, e.return, i);
    }
  }
  var $t = !1,
    Ve = !1,
    Sc = !1,
    Ko = typeof WeakSet == "function" ? WeakSet : Set,
    ke = null;
  function Ih(e, t) {
    if (((e = e.containerInfo), (Xc = Bs), (e = lr(e)), vi(e))) {
      if ("selectionStart" in e)
        var a = { start: e.selectionStart, end: e.selectionEnd };
      else
        e: {
          a = ((a = e.ownerDocument) && a.defaultView) || window;
          var l = a.getSelection && a.getSelection();
          if (l && l.rangeCount !== 0) {
            a = l.anchorNode;
            var n = l.anchorOffset,
              i = l.focusNode;
            l = l.focusOffset;
            try {
              (a.nodeType, i.nodeType);
            } catch {
              a = null;
              break e;
            }
            var c = 0,
              u = -1,
              o = -1,
              y = 0,
              _ = 0,
              z = e,
              x = null;
            t: for (;;) {
              for (
                var b;
                z !== a || (n !== 0 && z.nodeType !== 3) || (u = c + n),
                  z !== i || (l !== 0 && z.nodeType !== 3) || (o = c + l),
                  z.nodeType === 3 && (c += z.nodeValue.length),
                  (b = z.firstChild) !== null;
              )
                ((x = z), (z = b));
              for (;;) {
                if (z === e) break t;
                if (
                  (x === a && ++y === n && (u = c),
                  x === i && ++_ === l && (o = c),
                  (b = z.nextSibling) !== null)
                )
                  break;
                ((z = x), (x = z.parentNode));
              }
              z = b;
            }
            a = u === -1 || o === -1 ? null : { start: u, end: o };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (
      Qc = { focusedElem: e, selectionRange: a }, Bs = !1, ke = t;
      ke !== null;
    )
      if (
        ((t = ke), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null)
      )
        ((e.return = t), (ke = e));
      else
        for (; ke !== null; ) {
          switch (((t = ke), (i = t.alternate), (e = t.flags), t.tag)) {
            case 0:
              if (
                (e & 4) !== 0 &&
                ((e = t.updateQueue),
                (e = e !== null ? e.events : null),
                e !== null)
              )
                for (a = 0; a < e.length; a++)
                  ((n = e[a]), (n.ref.impl = n.nextImpl));
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && i !== null) {
                ((e = void 0),
                  (a = t),
                  (n = i.memoizedProps),
                  (i = i.memoizedState),
                  (l = a.stateNode));
                try {
                  var I = Qa(a.type, n);
                  ((e = l.getSnapshotBeforeUpdate(I, i)),
                    (l.__reactInternalSnapshotBeforeUpdate = e));
                } catch (se) {
                  ze(a, a.return, se);
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (
                  ((e = t.stateNode.containerInfo), (a = e.nodeType), a === 9)
                )
                  Jc(e);
                else if (a === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Jc(e);
                      break;
                    default:
                      e.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((e & 1024) !== 0) throw Error(r(163));
          }
          if (((e = t.sibling), e !== null)) {
            ((e.return = t.return), (ke = e));
            break;
          }
          ke = t.return;
        }
  }
  function Jo(e, t, a) {
    var l = a.flags;
    switch (a.tag) {
      case 0:
      case 11:
      case 15:
        (Wt(e, a), l & 4 && un(5, a));
        break;
      case 1:
        if ((Wt(e, a), l & 4))
          if (((e = a.stateNode), t === null))
            try {
              e.componentDidMount();
            } catch (c) {
              ze(a, a.return, c);
            }
          else {
            var n = Qa(a.type, t.memoizedProps);
            t = t.memoizedState;
            try {
              e.componentDidUpdate(n, t, e.__reactInternalSnapshotBeforeUpdate);
            } catch (c) {
              ze(a, a.return, c);
            }
          }
        (l & 64 && Lo(a), l & 512 && rn(a, a.return));
        break;
      case 3:
        if ((Wt(e, a), l & 64 && ((e = a.updateQueue), e !== null))) {
          if (((t = null), a.child !== null))
            switch (a.child.tag) {
              case 27:
              case 5:
                t = a.child.stateNode;
                break;
              case 1:
                t = a.child.stateNode;
            }
          try {
            Mr(e, t);
          } catch (c) {
            ze(a, a.return, c);
          }
        }
        break;
      case 27:
        t === null && l & 4 && Vo(a);
      case 26:
      case 5:
        (Wt(e, a), t === null && l & 4 && Xo(a), l & 512 && rn(a, a.return));
        break;
      case 12:
        Wt(e, a);
        break;
      case 31:
        (Wt(e, a), l & 4 && Fo(e, a));
        break;
      case 13:
        (Wt(e, a),
          l & 4 && Wo(e, a),
          l & 64 &&
            ((e = a.memoizedState),
            e !== null &&
              ((e = e.dehydrated),
              e !== null && ((a = c0.bind(null, a)), w0(e, a)))));
        break;
      case 22:
        if (((l = a.memoizedState !== null || $t), !l)) {
          ((t = (t !== null && t.memoizedState !== null) || Ve), (n = $t));
          var i = Ve;
          (($t = l),
            (Ve = t) && !i ? It(e, a, (a.subtreeFlags & 8772) !== 0) : Wt(e, a),
            ($t = n),
            (Ve = i));
        }
        break;
      case 30:
        break;
      default:
        Wt(e, a);
    }
  }
  function ko(e) {
    var t = e.alternate;
    (t !== null && ((e.alternate = null), ko(t)),
      (e.child = null),
      (e.deletions = null),
      (e.sibling = null),
      e.tag === 5 && ((t = e.stateNode), t !== null && Is(t)),
      (e.stateNode = null),
      (e.return = null),
      (e.dependencies = null),
      (e.memoizedProps = null),
      (e.memoizedState = null),
      (e.pendingProps = null),
      (e.stateNode = null),
      (e.updateQueue = null));
  }
  var Ue = null,
    st = !1;
  function Ft(e, t, a) {
    for (a = a.child; a !== null; ) ($o(e, t, a), (a = a.sibling));
  }
  function $o(e, t, a) {
    if (ft && typeof ft.onCommitFiberUnmount == "function")
      try {
        ft.onCommitFiberUnmount(Ol, a);
      } catch {}
    switch (a.tag) {
      case 26:
        (Ve || Ut(a, t),
          Ft(e, t, a),
          a.memoizedState
            ? a.memoizedState.count--
            : a.stateNode && ((a = a.stateNode), a.parentNode.removeChild(a)));
        break;
      case 27:
        Ve || Ut(a, t);
        var l = Ue,
          n = st;
        (ba(a.type) && ((Ue = a.stateNode), (st = !1)),
          Ft(e, t, a),
          yn(a.stateNode),
          (Ue = l),
          (st = n));
        break;
      case 5:
        Ve || Ut(a, t);
      case 6:
        if (
          ((l = Ue),
          (n = st),
          (Ue = null),
          Ft(e, t, a),
          (Ue = l),
          (st = n),
          Ue !== null)
        )
          if (st)
            try {
              (Ue.nodeType === 9
                ? Ue.body
                : Ue.nodeName === "HTML"
                  ? Ue.ownerDocument.body
                  : Ue
              ).removeChild(a.stateNode);
            } catch (i) {
              ze(a, t, i);
            }
          else
            try {
              Ue.removeChild(a.stateNode);
            } catch (i) {
              ze(a, t, i);
            }
        break;
      case 18:
        Ue !== null &&
          (st
            ? ((e = Ue),
              Gf(
                e.nodeType === 9
                  ? e.body
                  : e.nodeName === "HTML"
                    ? e.ownerDocument.body
                    : e,
                a.stateNode,
              ),
              Rl(e))
            : Gf(Ue, a.stateNode));
        break;
      case 4:
        ((l = Ue),
          (n = st),
          (Ue = a.stateNode.containerInfo),
          (st = !0),
          Ft(e, t, a),
          (Ue = l),
          (st = n));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        (ma(2, a, t), Ve || ma(4, a, t), Ft(e, t, a));
        break;
      case 1:
        (Ve ||
          (Ut(a, t),
          (l = a.stateNode),
          typeof l.componentWillUnmount == "function" && Go(a, t, l)),
          Ft(e, t, a));
        break;
      case 21:
        Ft(e, t, a);
        break;
      case 22:
        ((Ve = (l = Ve) || a.memoizedState !== null), Ft(e, t, a), (Ve = l));
        break;
      default:
        Ft(e, t, a);
    }
  }
  function Fo(e, t) {
    if (
      t.memoizedState === null &&
      ((e = t.alternate), e !== null && ((e = e.memoizedState), e !== null))
    ) {
      e = e.dehydrated;
      try {
        Rl(e);
      } catch (a) {
        ze(t, t.return, a);
      }
    }
  }
  function Wo(e, t) {
    if (
      t.memoizedState === null &&
      ((e = t.alternate),
      e !== null &&
        ((e = e.memoizedState), e !== null && ((e = e.dehydrated), e !== null)))
    )
      try {
        Rl(e);
      } catch (a) {
        ze(t, t.return, a);
      }
  }
  function Ph(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return (t === null && (t = e.stateNode = new Ko()), t);
      case 22:
        return (
          (e = e.stateNode),
          (t = e._retryCache),
          t === null && (t = e._retryCache = new Ko()),
          t
        );
      default:
        throw Error(r(435, e.tag));
    }
  }
  function ys(e, t) {
    var a = Ph(e);
    t.forEach(function (l) {
      if (!a.has(l)) {
        a.add(l);
        var n = u0.bind(null, e, l);
        l.then(n, n);
      }
    });
  }
  function it(e, t) {
    var a = t.deletions;
    if (a !== null)
      for (var l = 0; l < a.length; l++) {
        var n = a[l],
          i = e,
          c = t,
          u = c;
        e: for (; u !== null; ) {
          switch (u.tag) {
            case 27:
              if (ba(u.type)) {
                ((Ue = u.stateNode), (st = !1));
                break e;
              }
              break;
            case 5:
              ((Ue = u.stateNode), (st = !1));
              break e;
            case 3:
            case 4:
              ((Ue = u.stateNode.containerInfo), (st = !0));
              break e;
          }
          u = u.return;
        }
        if (Ue === null) throw Error(r(160));
        ($o(i, c, n),
          (Ue = null),
          (st = !1),
          (i = n.alternate),
          i !== null && (i.return = null),
          (n.return = null));
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; ) (Io(t, e), (t = t.sibling));
  }
  var Rt = null;
  function Io(e, t) {
    var a = e.alternate,
      l = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        (it(t, e),
          ct(e),
          l & 4 && (ma(3, e, e.return), un(3, e), ma(5, e, e.return)));
        break;
      case 1:
        (it(t, e),
          ct(e),
          l & 512 && (Ve || a === null || Ut(a, a.return)),
          l & 64 &&
            $t &&
            ((e = e.updateQueue),
            e !== null &&
              ((l = e.callbacks),
              l !== null &&
                ((a = e.shared.hiddenCallbacks),
                (e.shared.hiddenCallbacks = a === null ? l : a.concat(l))))));
        break;
      case 26:
        var n = Rt;
        if (
          (it(t, e),
          ct(e),
          l & 512 && (Ve || a === null || Ut(a, a.return)),
          l & 4)
        ) {
          var i = a !== null ? a.memoizedState : null;
          if (((l = e.memoizedState), a === null))
            if (l === null)
              if (e.stateNode === null) {
                e: {
                  ((l = e.type),
                    (a = e.memoizedProps),
                    (n = n.ownerDocument || n));
                  t: switch (l) {
                    case "title":
                      ((i = n.getElementsByTagName("title")[0]),
                        (!i ||
                          i[ql] ||
                          i[Fe] ||
                          i.namespaceURI === "http://www.w3.org/2000/svg" ||
                          i.hasAttribute("itemprop")) &&
                          ((i = n.createElement(l)),
                          n.head.insertBefore(
                            i,
                            n.querySelector("head > title"),
                          )),
                        et(i, l, a),
                        (i[Fe] = e),
                        Je(i),
                        (l = i));
                      break e;
                    case "link":
                      var c = Pf("link", "href", n).get(l + (a.href || ""));
                      if (c) {
                        for (var u = 0; u < c.length; u++)
                          if (
                            ((i = c[u]),
                            i.getAttribute("href") ===
                              (a.href == null || a.href === ""
                                ? null
                                : a.href) &&
                              i.getAttribute("rel") ===
                                (a.rel == null ? null : a.rel) &&
                              i.getAttribute("title") ===
                                (a.title == null ? null : a.title) &&
                              i.getAttribute("crossorigin") ===
                                (a.crossOrigin == null ? null : a.crossOrigin))
                          ) {
                            c.splice(u, 1);
                            break t;
                          }
                      }
                      ((i = n.createElement(l)),
                        et(i, l, a),
                        n.head.appendChild(i));
                      break;
                    case "meta":
                      if (
                        (c = Pf("meta", "content", n).get(
                          l + (a.content || ""),
                        ))
                      ) {
                        for (u = 0; u < c.length; u++)
                          if (
                            ((i = c[u]),
                            i.getAttribute("content") ===
                              (a.content == null ? null : "" + a.content) &&
                              i.getAttribute("name") ===
                                (a.name == null ? null : a.name) &&
                              i.getAttribute("property") ===
                                (a.property == null ? null : a.property) &&
                              i.getAttribute("http-equiv") ===
                                (a.httpEquiv == null ? null : a.httpEquiv) &&
                              i.getAttribute("charset") ===
                                (a.charSet == null ? null : a.charSet))
                          ) {
                            c.splice(u, 1);
                            break t;
                          }
                      }
                      ((i = n.createElement(l)),
                        et(i, l, a),
                        n.head.appendChild(i));
                      break;
                    default:
                      throw Error(r(468, l));
                  }
                  ((i[Fe] = e), Je(i), (l = i));
                }
                e.stateNode = l;
              } else ed(n, e.type, e.stateNode);
            else e.stateNode = If(n, l, e.memoizedProps);
          else
            i !== l
              ? (i === null
                  ? a.stateNode !== null &&
                    ((a = a.stateNode), a.parentNode.removeChild(a))
                  : i.count--,
                l === null
                  ? ed(n, e.type, e.stateNode)
                  : If(n, l, e.memoizedProps))
              : l === null &&
                e.stateNode !== null &&
                xc(e, e.memoizedProps, a.memoizedProps);
        }
        break;
      case 27:
        (it(t, e),
          ct(e),
          l & 512 && (Ve || a === null || Ut(a, a.return)),
          a !== null && l & 4 && xc(e, e.memoizedProps, a.memoizedProps));
        break;
      case 5:
        if (
          (it(t, e),
          ct(e),
          l & 512 && (Ve || a === null || Ut(a, a.return)),
          e.flags & 32)
        ) {
          n = e.stateNode;
          try {
            el(n, "");
          } catch (I) {
            ze(e, e.return, I);
          }
        }
        (l & 4 &&
          e.stateNode != null &&
          ((n = e.memoizedProps), xc(e, n, a !== null ? a.memoizedProps : n)),
          l & 1024 && (Sc = !0));
        break;
      case 6:
        if ((it(t, e), ct(e), l & 4)) {
          if (e.stateNode === null) throw Error(r(162));
          ((l = e.memoizedProps), (a = e.stateNode));
          try {
            a.nodeValue = l;
          } catch (I) {
            ze(e, e.return, I);
          }
        }
        break;
      case 3:
        if (
          ((Ds = null),
          (n = Rt),
          (Rt = Os(t.containerInfo)),
          it(t, e),
          (Rt = n),
          ct(e),
          l & 4 && a !== null && a.memoizedState.isDehydrated)
        )
          try {
            Rl(t.containerInfo);
          } catch (I) {
            ze(e, e.return, I);
          }
        Sc && ((Sc = !1), Po(e));
        break;
      case 4:
        ((l = Rt),
          (Rt = Os(e.stateNode.containerInfo)),
          it(t, e),
          ct(e),
          (Rt = l));
        break;
      case 12:
        (it(t, e), ct(e));
        break;
      case 31:
        (it(t, e),
          ct(e),
          l & 4 &&
            ((l = e.updateQueue),
            l !== null && ((e.updateQueue = null), ys(e, l))));
        break;
      case 13:
        (it(t, e),
          ct(e),
          e.child.flags & 8192 &&
            (e.memoizedState !== null) !=
              (a !== null && a.memoizedState !== null) &&
            (js = ot()),
          l & 4 &&
            ((l = e.updateQueue),
            l !== null && ((e.updateQueue = null), ys(e, l))));
        break;
      case 22:
        n = e.memoizedState !== null;
        var o = a !== null && a.memoizedState !== null,
          y = $t,
          _ = Ve;
        if (
          (($t = y || n),
          (Ve = _ || o),
          it(t, e),
          (Ve = _),
          ($t = y),
          ct(e),
          l & 8192)
        )
          e: for (
            t = e.stateNode,
              t._visibility = n ? t._visibility & -2 : t._visibility | 1,
              n && (a === null || o || $t || Ve || Va(e)),
              a = null,
              t = e;
            ;
          ) {
            if (t.tag === 5 || t.tag === 26) {
              if (a === null) {
                o = a = t;
                try {
                  if (((i = o.stateNode), n))
                    ((c = i.style),
                      typeof c.setProperty == "function"
                        ? c.setProperty("display", "none", "important")
                        : (c.display = "none"));
                  else {
                    u = o.stateNode;
                    var z = o.memoizedProps.style,
                      x =
                        z != null && z.hasOwnProperty("display")
                          ? z.display
                          : null;
                    u.style.display =
                      x == null || typeof x == "boolean" ? "" : ("" + x).trim();
                  }
                } catch (I) {
                  ze(o, o.return, I);
                }
              }
            } else if (t.tag === 6) {
              if (a === null) {
                o = t;
                try {
                  o.stateNode.nodeValue = n ? "" : o.memoizedProps;
                } catch (I) {
                  ze(o, o.return, I);
                }
              }
            } else if (t.tag === 18) {
              if (a === null) {
                o = t;
                try {
                  var b = o.stateNode;
                  n ? Xf(b, !0) : Xf(o.stateNode, !1);
                } catch (I) {
                  ze(o, o.return, I);
                }
              }
            } else if (
              ((t.tag !== 22 && t.tag !== 23) ||
                t.memoizedState === null ||
                t === e) &&
              t.child !== null
            ) {
              ((t.child.return = t), (t = t.child));
              continue;
            }
            if (t === e) break e;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === e) break e;
              (a === t && (a = null), (t = t.return));
            }
            (a === t && (a = null),
              (t.sibling.return = t.return),
              (t = t.sibling));
          }
        l & 4 &&
          ((l = e.updateQueue),
          l !== null &&
            ((a = l.retryQueue),
            a !== null && ((l.retryQueue = null), ys(e, a))));
        break;
      case 19:
        (it(t, e),
          ct(e),
          l & 4 &&
            ((l = e.updateQueue),
            l !== null && ((e.updateQueue = null), ys(e, l))));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        (it(t, e), ct(e));
    }
  }
  function ct(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var a, l = e.return; l !== null; ) {
          if (Qo(l)) {
            a = l;
            break;
          }
          l = l.return;
        }
        if (a == null) throw Error(r(160));
        switch (a.tag) {
          case 27:
            var n = a.stateNode,
              i = jc(e);
            gs(e, i, n);
            break;
          case 5:
            var c = a.stateNode;
            a.flags & 32 && (el(c, ""), (a.flags &= -33));
            var u = jc(e);
            gs(e, u, c);
            break;
          case 3:
          case 4:
            var o = a.stateNode.containerInfo,
              y = jc(e);
            bc(e, y, o);
            break;
          default:
            throw Error(r(161));
        }
      } catch (_) {
        ze(e, e.return, _);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Po(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        (Po(t),
          t.tag === 5 && t.flags & 1024 && t.stateNode.reset(),
          (e = e.sibling));
      }
  }
  function Wt(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; ) (Jo(e, t.alternate, t), (t = t.sibling));
  }
  function Va(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (ma(4, t, t.return), Va(t));
          break;
        case 1:
          Ut(t, t.return);
          var a = t.stateNode;
          (typeof a.componentWillUnmount == "function" && Go(t, t.return, a),
            Va(t));
          break;
        case 27:
          yn(t.stateNode);
        case 26:
        case 5:
          (Ut(t, t.return), Va(t));
          break;
        case 22:
          t.memoizedState === null && Va(t);
          break;
        case 30:
          Va(t);
          break;
        default:
          Va(t);
      }
      e = e.sibling;
    }
  }
  function It(e, t, a) {
    for (a = a && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var l = t.alternate,
        n = e,
        i = t,
        c = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          (It(n, i, a), un(4, i));
          break;
        case 1:
          if (
            (It(n, i, a),
            (l = i),
            (n = l.stateNode),
            typeof n.componentDidMount == "function")
          )
            try {
              n.componentDidMount();
            } catch (y) {
              ze(l, l.return, y);
            }
          if (((l = i), (n = l.updateQueue), n !== null)) {
            var u = l.stateNode;
            try {
              var o = n.shared.hiddenCallbacks;
              if (o !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < o.length; n++)
                  zr(o[n], u);
            } catch (y) {
              ze(l, l.return, y);
            }
          }
          (a && c & 64 && Lo(i), rn(i, i.return));
          break;
        case 27:
          Vo(i);
        case 26:
        case 5:
          (It(n, i, a), a && l === null && c & 4 && Xo(i), rn(i, i.return));
          break;
        case 12:
          It(n, i, a);
          break;
        case 31:
          (It(n, i, a), a && c & 4 && Fo(n, i));
          break;
        case 13:
          (It(n, i, a), a && c & 4 && Wo(n, i));
          break;
        case 22:
          (i.memoizedState === null && It(n, i, a), rn(i, i.return));
          break;
        case 30:
          break;
        default:
          It(n, i, a);
      }
      t = t.sibling;
    }
  }
  function Nc(e, t) {
    var a = null;
    (e !== null &&
      e.memoizedState !== null &&
      e.memoizedState.cachePool !== null &&
      (a = e.memoizedState.cachePool.pool),
      (e = null),
      t.memoizedState !== null &&
        t.memoizedState.cachePool !== null &&
        (e = t.memoizedState.cachePool.pool),
      e !== a && (e != null && e.refCount++, a != null && kl(a)));
  }
  function _c(e, t) {
    ((e = null),
      t.alternate !== null && (e = t.alternate.memoizedState.cache),
      (t = t.memoizedState.cache),
      t !== e && (t.refCount++, e != null && kl(e)));
  }
  function Ot(e, t, a, l) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) (ef(e, t, a, l), (t = t.sibling));
  }
  function ef(e, t, a, l) {
    var n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        (Ot(e, t, a, l), n & 2048 && un(9, t));
        break;
      case 1:
        Ot(e, t, a, l);
        break;
      case 3:
        (Ot(e, t, a, l),
          n & 2048 &&
            ((e = null),
            t.alternate !== null && (e = t.alternate.memoizedState.cache),
            (t = t.memoizedState.cache),
            t !== e && (t.refCount++, e != null && kl(e))));
        break;
      case 12:
        if (n & 2048) {
          (Ot(e, t, a, l), (e = t.stateNode));
          try {
            var i = t.memoizedProps,
              c = i.id,
              u = i.onPostCommit;
            typeof u == "function" &&
              u(
                c,
                t.alternate === null ? "mount" : "update",
                e.passiveEffectDuration,
                -0,
              );
          } catch (o) {
            ze(t, t.return, o);
          }
        } else Ot(e, t, a, l);
        break;
      case 31:
        Ot(e, t, a, l);
        break;
      case 13:
        Ot(e, t, a, l);
        break;
      case 23:
        break;
      case 22:
        ((i = t.stateNode),
          (c = t.alternate),
          t.memoizedState !== null
            ? i._visibility & 2
              ? Ot(e, t, a, l)
              : on(e, t)
            : i._visibility & 2
              ? Ot(e, t, a, l)
              : ((i._visibility |= 2),
                jl(e, t, a, l, (t.subtreeFlags & 10256) !== 0 || !1)),
          n & 2048 && Nc(c, t));
        break;
      case 24:
        (Ot(e, t, a, l), n & 2048 && _c(t.alternate, t));
        break;
      default:
        Ot(e, t, a, l);
    }
  }
  function jl(e, t, a, l, n) {
    for (
      n = n && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child;
      t !== null;
    ) {
      var i = e,
        c = t,
        u = a,
        o = l,
        y = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          (jl(i, c, u, o, n), un(8, c));
          break;
        case 23:
          break;
        case 22:
          var _ = c.stateNode;
          (c.memoizedState !== null
            ? _._visibility & 2
              ? jl(i, c, u, o, n)
              : on(i, c)
            : ((_._visibility |= 2), jl(i, c, u, o, n)),
            n && y & 2048 && Nc(c.alternate, c));
          break;
        case 24:
          (jl(i, c, u, o, n), n && y & 2048 && _c(c.alternate, c));
          break;
        default:
          jl(i, c, u, o, n);
      }
      t = t.sibling;
    }
  }
  function on(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var a = e,
          l = t,
          n = l.flags;
        switch (l.tag) {
          case 22:
            (on(a, l), n & 2048 && Nc(l.alternate, l));
            break;
          case 24:
            (on(a, l), n & 2048 && _c(l.alternate, l));
            break;
          default:
            on(a, l);
        }
        t = t.sibling;
      }
  }
  var fn = 8192;
  function bl(e, t, a) {
    if (e.subtreeFlags & fn)
      for (e = e.child; e !== null; ) (tf(e, t, a), (e = e.sibling));
  }
  function tf(e, t, a) {
    switch (e.tag) {
      case 26:
        (bl(e, t, a),
          e.flags & fn &&
            e.memoizedState !== null &&
            Z0(a, Rt, e.memoizedState, e.memoizedProps));
        break;
      case 5:
        bl(e, t, a);
        break;
      case 3:
      case 4:
        var l = Rt;
        ((Rt = Os(e.stateNode.containerInfo)), bl(e, t, a), (Rt = l));
        break;
      case 22:
        e.memoizedState === null &&
          ((l = e.alternate),
          l !== null && l.memoizedState !== null
            ? ((l = fn), (fn = 16777216), bl(e, t, a), (fn = l))
            : bl(e, t, a));
        break;
      default:
        bl(e, t, a);
    }
  }
  function af(e) {
    var t = e.alternate;
    if (t !== null && ((e = t.child), e !== null)) {
      t.child = null;
      do ((t = e.sibling), (e.sibling = null), (e = t));
      while (e !== null);
    }
  }
  function dn(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var a = 0; a < t.length; a++) {
          var l = t[a];
          ((ke = l), nf(l, e));
        }
      af(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) (lf(e), (e = e.sibling));
  }
  function lf(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        (dn(e), e.flags & 2048 && ma(9, e, e.return));
        break;
      case 3:
        dn(e);
        break;
      case 12:
        dn(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null &&
        t._visibility & 2 &&
        (e.return === null || e.return.tag !== 13)
          ? ((t._visibility &= -3), xs(e))
          : dn(e);
        break;
      default:
        dn(e);
    }
  }
  function xs(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var a = 0; a < t.length; a++) {
          var l = t[a];
          ((ke = l), nf(l, e));
        }
      af(e);
    }
    for (e = e.child; e !== null; ) {
      switch (((t = e), t.tag)) {
        case 0:
        case 11:
        case 15:
          (ma(8, t, t.return), xs(t));
          break;
        case 22:
          ((a = t.stateNode),
            a._visibility & 2 && ((a._visibility &= -3), xs(t)));
          break;
        default:
          xs(t);
      }
      e = e.sibling;
    }
  }
  function nf(e, t) {
    for (; ke !== null; ) {
      var a = ke;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          ma(8, a, t);
          break;
        case 23:
        case 22:
          if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
            var l = a.memoizedState.cachePool.pool;
            l != null && l.refCount++;
          }
          break;
        case 24:
          kl(a.memoizedState.cache);
      }
      if (((l = a.child), l !== null)) ((l.return = a), (ke = l));
      else
        e: for (a = e; ke !== null; ) {
          l = ke;
          var n = l.sibling,
            i = l.return;
          if ((ko(l), l === a)) {
            ke = null;
            break e;
          }
          if (n !== null) {
            ((n.return = i), (ke = n));
            break e;
          }
          ke = i;
        }
    }
  }
  var e0 = {
      getCacheForType: function (e) {
        var t = Ie(Ge),
          a = t.data.get(e);
        return (a === void 0 && ((a = e()), t.data.set(e, a)), a);
      },
      cacheSignal: function () {
        return Ie(Ge).controller.signal;
      },
    },
    t0 = typeof WeakMap == "function" ? WeakMap : Map,
    Te = 0,
    Ce = null,
    ge = null,
    xe = 0,
    Ee = 0,
    gt = null,
    va = !1,
    Sl = !1,
    Ac = !1,
    Pt = 0,
    Ze = 0,
    pa = 0,
    Ka = 0,
    Tc = 0,
    yt = 0,
    Nl = 0,
    hn = null,
    ut = null,
    wc = !1,
    js = 0,
    sf = 0,
    bs = 1 / 0,
    Ss = null,
    ga = null,
    Ke = 0,
    ya = null,
    _l = null,
    ea = 0,
    Ec = 0,
    zc = null,
    cf = null,
    mn = 0,
    Mc = null;
  function xt() {
    return (Te & 2) !== 0 && xe !== 0 ? xe & -xe : m.T !== null ? Uc() : bu();
  }
  function uf() {
    if (yt === 0)
      if ((xe & 536870912) === 0 || be) {
        var e = Mn;
        ((Mn <<= 1), (Mn & 3932160) === 0 && (Mn = 262144), (yt = e));
      } else yt = 536870912;
    return ((e = vt.current), e !== null && (e.flags |= 32), yt);
  }
  function rt(e, t, a) {
    (((e === Ce && (Ee === 2 || Ee === 9)) || e.cancelPendingCommit !== null) &&
      (Al(e, 0), xa(e, xe, yt, !1)),
      Dl(e, a),
      ((Te & 2) === 0 || e !== Ce) &&
        (e === Ce &&
          ((Te & 2) === 0 && (Ka |= a), Ze === 4 && xa(e, xe, yt, !1)),
        Ht(e)));
  }
  function rf(e, t, a) {
    if ((Te & 6) !== 0) throw Error(r(327));
    var l = (!a && (t & 127) === 0 && (t & e.expiredLanes) === 0) || Cl(e, t),
      n = l ? n0(e, t) : Oc(e, t, !0),
      i = l;
    do {
      if (n === 0) {
        Sl && !l && xa(e, t, 0, !1);
        break;
      } else {
        if (((a = e.current.alternate), i && !a0(a))) {
          ((n = Oc(e, t, !1)), (i = !1));
          continue;
        }
        if (n === 2) {
          if (((i = t), e.errorRecoveryDisabledLanes & i)) var c = 0;
          else
            ((c = e.pendingLanes & -536870913),
              (c = c !== 0 ? c : c & 536870912 ? 536870912 : 0));
          if (c !== 0) {
            t = c;
            e: {
              var u = e;
              n = hn;
              var o = u.current.memoizedState.isDehydrated;
              if ((o && (Al(u, c).flags |= 256), (c = Oc(u, c, !1)), c !== 2)) {
                if (Ac && !o) {
                  ((u.errorRecoveryDisabledLanes |= i), (Ka |= i), (n = 4));
                  break e;
                }
                ((i = ut),
                  (ut = n),
                  i !== null &&
                    (ut === null ? (ut = i) : ut.push.apply(ut, i)));
              }
              n = c;
            }
            if (((i = !1), n !== 2)) continue;
          }
        }
        if (n === 1) {
          (Al(e, 0), xa(e, t, 0, !0));
          break;
        }
        e: {
          switch (((l = e), (i = n), i)) {
            case 0:
            case 1:
              throw Error(r(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              xa(l, t, yt, !va);
              break e;
            case 2:
              ut = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(r(329));
          }
          if ((t & 62914560) === t && ((n = js + 300 - ot()), 10 < n)) {
            if ((xa(l, t, yt, !va), On(l, 0, !0) !== 0)) break e;
            ((ea = t),
              (l.timeoutHandle = Yf(
                of.bind(
                  null,
                  l,
                  a,
                  ut,
                  Ss,
                  wc,
                  t,
                  yt,
                  Ka,
                  Nl,
                  va,
                  i,
                  "Throttled",
                  -0,
                  0,
                ),
                n,
              )));
            break e;
          }
          of(l, a, ut, Ss, wc, t, yt, Ka, Nl, va, i, null, -0, 0);
        }
      }
      break;
    } while (!0);
    Ht(e);
  }
  function of(e, t, a, l, n, i, c, u, o, y, _, z, x, b) {
    if (
      ((e.timeoutHandle = -1),
      (z = t.subtreeFlags),
      z & 8192 || (z & 16785408) === 16785408)
    ) {
      ((z = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Zt,
      }),
        tf(t, i, z));
      var I =
        (i & 62914560) === i ? js - ot() : (i & 4194048) === i ? sf - ot() : 0;
      if (((I = Y0(z, I)), I !== null)) {
        ((ea = i),
          (e.cancelPendingCommit = I(
            yf.bind(null, e, t, i, a, l, n, c, u, o, _, z, null, x, b),
          )),
          xa(e, i, c, !y));
        return;
      }
    }
    yf(e, t, i, a, l, n, c, u, o);
  }
  function a0(e) {
    for (var t = e; ; ) {
      var a = t.tag;
      if (
        (a === 0 || a === 11 || a === 15) &&
        t.flags & 16384 &&
        ((a = t.updateQueue), a !== null && ((a = a.stores), a !== null))
      )
        for (var l = 0; l < a.length; l++) {
          var n = a[l],
            i = n.getSnapshot;
          n = n.value;
          try {
            if (!ht(i(), n)) return !1;
          } catch {
            return !1;
          }
        }
      if (((a = t.child), t.subtreeFlags & 16384 && a !== null))
        ((a.return = t), (t = a));
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
    }
    return !0;
  }
  function xa(e, t, a, l) {
    ((t &= ~Tc),
      (t &= ~Ka),
      (e.suspendedLanes |= t),
      (e.pingedLanes &= ~t),
      l && (e.warmLanes |= t),
      (l = e.expirationTimes));
    for (var n = t; 0 < n; ) {
      var i = 31 - dt(n),
        c = 1 << i;
      ((l[i] = -1), (n &= ~c));
    }
    a !== 0 && yu(e, a, t);
  }
  function Ns() {
    return (Te & 6) === 0 ? (vn(0), !1) : !0;
  }
  function Rc() {
    if (ge !== null) {
      if (Ee === 0) var e = ge.return;
      else ((e = ge), (Xt = Ha = null), Ji(e), (vl = null), (Fl = 0), (e = ge));
      for (; e !== null; ) (Yo(e.alternate, e), (e = e.return));
      ge = null;
    }
  }
  function Al(e, t) {
    var a = e.timeoutHandle;
    (a !== -1 && ((e.timeoutHandle = -1), S0(a)),
      (a = e.cancelPendingCommit),
      a !== null && ((e.cancelPendingCommit = null), a()),
      (ea = 0),
      Rc(),
      (Ce = e),
      (ge = a = Lt(e.current, null)),
      (xe = t),
      (Ee = 0),
      (gt = null),
      (va = !1),
      (Sl = Cl(e, t)),
      (Ac = !1),
      (Nl = yt = Tc = Ka = pa = Ze = 0),
      (ut = hn = null),
      (wc = !1),
      (t & 8) !== 0 && (t |= t & 32));
    var l = e.entangledLanes;
    if (l !== 0)
      for (e = e.entanglements, l &= t; 0 < l; ) {
        var n = 31 - dt(l),
          i = 1 << n;
        ((t |= e[n]), (l &= ~i));
      }
    return ((Pt = t), Qn(), a);
  }
  function ff(e, t) {
    ((fe = null),
      (m.H = nn),
      t === ml || t === In
        ? ((t = Ar()), (Ee = 3))
        : t === qi
          ? ((t = Ar()), (Ee = 4))
          : (Ee =
              t === rc
                ? 8
                : t !== null &&
                    typeof t == "object" &&
                    typeof t.then == "function"
                  ? 6
                  : 1),
      (gt = t),
      ge === null && ((Ze = 1), ds(e, Nt(t, e.current))));
  }
  function df() {
    var e = vt.current;
    return e === null
      ? !0
      : (xe & 4194048) === xe
        ? wt === null
        : (xe & 62914560) === xe || (xe & 536870912) !== 0
          ? e === wt
          : !1;
  }
  function hf() {
    var e = m.H;
    return ((m.H = nn), e === null ? nn : e);
  }
  function mf() {
    var e = m.A;
    return ((m.A = e0), e);
  }
  function _s() {
    ((Ze = 4),
      va || ((xe & 4194048) !== xe && vt.current !== null) || (Sl = !0),
      ((pa & 134217727) === 0 && (Ka & 134217727) === 0) ||
        Ce === null ||
        xa(Ce, xe, yt, !1));
  }
  function Oc(e, t, a) {
    var l = Te;
    Te |= 2;
    var n = hf(),
      i = mf();
    ((Ce !== e || xe !== t) && ((Ss = null), Al(e, t)), (t = !1));
    var c = Ze;
    e: do
      try {
        if (Ee !== 0 && ge !== null) {
          var u = ge,
            o = gt;
          switch (Ee) {
            case 8:
              (Rc(), (c = 6));
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              vt.current === null && (t = !0);
              var y = Ee;
              if (((Ee = 0), (gt = null), Tl(e, u, o, y), a && Sl)) {
                c = 0;
                break e;
              }
              break;
            default:
              ((y = Ee), (Ee = 0), (gt = null), Tl(e, u, o, y));
          }
        }
        (l0(), (c = Ze));
        break;
      } catch (_) {
        ff(e, _);
      }
    while (!0);
    return (
      t && e.shellSuspendCounter++,
      (Xt = Ha = null),
      (Te = l),
      (m.H = n),
      (m.A = i),
      ge === null && ((Ce = null), (xe = 0), Qn()),
      c
    );
  }
  function l0() {
    for (; ge !== null; ) vf(ge);
  }
  function n0(e, t) {
    var a = Te;
    Te |= 2;
    var l = hf(),
      n = mf();
    Ce !== e || xe !== t
      ? ((Ss = null), (bs = ot() + 500), Al(e, t))
      : (Sl = Cl(e, t));
    e: do
      try {
        if (Ee !== 0 && ge !== null) {
          t = ge;
          var i = gt;
          t: switch (Ee) {
            case 1:
              ((Ee = 0), (gt = null), Tl(e, t, i, 1));
              break;
            case 2:
            case 9:
              if (Nr(i)) {
                ((Ee = 0), (gt = null), pf(t));
                break;
              }
              ((t = function () {
                ((Ee !== 2 && Ee !== 9) || Ce !== e || (Ee = 7), Ht(e));
              }),
                i.then(t, t));
              break e;
            case 3:
              Ee = 7;
              break e;
            case 4:
              Ee = 5;
              break e;
            case 7:
              Nr(i)
                ? ((Ee = 0), (gt = null), pf(t))
                : ((Ee = 0), (gt = null), Tl(e, t, i, 7));
              break;
            case 5:
              var c = null;
              switch (ge.tag) {
                case 26:
                  c = ge.memoizedState;
                case 5:
                case 27:
                  var u = ge;
                  if (c ? td(c) : u.stateNode.complete) {
                    ((Ee = 0), (gt = null));
                    var o = u.sibling;
                    if (o !== null) ge = o;
                    else {
                      var y = u.return;
                      y !== null ? ((ge = y), As(y)) : (ge = null);
                    }
                    break t;
                  }
              }
              ((Ee = 0), (gt = null), Tl(e, t, i, 5));
              break;
            case 6:
              ((Ee = 0), (gt = null), Tl(e, t, i, 6));
              break;
            case 8:
              (Rc(), (Ze = 6));
              break e;
            default:
              throw Error(r(462));
          }
        }
        s0();
        break;
      } catch (_) {
        ff(e, _);
      }
    while (!0);
    return (
      (Xt = Ha = null),
      (m.H = l),
      (m.A = n),
      (Te = a),
      ge !== null ? 0 : ((Ce = null), (xe = 0), Qn(), Ze)
    );
  }
  function s0() {
    for (; ge !== null && !Ed(); ) vf(ge);
  }
  function vf(e) {
    var t = Bo(e.alternate, e, Pt);
    ((e.memoizedProps = e.pendingProps), t === null ? As(e) : (ge = t));
  }
  function pf(e) {
    var t = e,
      a = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Oo(a, t, t.pendingProps, t.type, void 0, xe);
        break;
      case 11:
        t = Oo(a, t, t.pendingProps, t.type.render, t.ref, xe);
        break;
      case 5:
        Ji(t);
      default:
        (Yo(a, t), (t = ge = dr(t, Pt)), (t = Bo(a, t, Pt)));
    }
    ((e.memoizedProps = e.pendingProps), t === null ? As(e) : (ge = t));
  }
  function Tl(e, t, a, l) {
    ((Xt = Ha = null), Ji(t), (vl = null), (Fl = 0));
    var n = t.return;
    try {
      if (Jh(e, n, t, a, xe)) {
        ((Ze = 1), ds(e, Nt(a, e.current)), (ge = null));
        return;
      }
    } catch (i) {
      if (n !== null) throw ((ge = n), i);
      ((Ze = 1), ds(e, Nt(a, e.current)), (ge = null));
      return;
    }
    t.flags & 32768
      ? (be || l === 1
          ? (e = !0)
          : Sl || (xe & 536870912) !== 0
            ? (e = !1)
            : ((va = e = !0),
              (l === 2 || l === 9 || l === 3 || l === 6) &&
                ((l = vt.current),
                l !== null && l.tag === 13 && (l.flags |= 16384))),
        gf(t, e))
      : As(t);
  }
  function As(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        gf(t, va);
        return;
      }
      e = t.return;
      var a = Fh(t.alternate, t, Pt);
      if (a !== null) {
        ge = a;
        return;
      }
      if (((t = t.sibling), t !== null)) {
        ge = t;
        return;
      }
      ge = t = e;
    } while (t !== null);
    Ze === 0 && (Ze = 5);
  }
  function gf(e, t) {
    do {
      var a = Wh(e.alternate, e);
      if (a !== null) {
        ((a.flags &= 32767), (ge = a));
        return;
      }
      if (
        ((a = e.return),
        a !== null &&
          ((a.flags |= 32768), (a.subtreeFlags = 0), (a.deletions = null)),
        !t && ((e = e.sibling), e !== null))
      ) {
        ge = e;
        return;
      }
      ge = e = a;
    } while (e !== null);
    ((Ze = 6), (ge = null));
  }
  function yf(e, t, a, l, n, i, c, u, o) {
    e.cancelPendingCommit = null;
    do Ts();
    while (Ke !== 0);
    if ((Te & 6) !== 0) throw Error(r(327));
    if (t !== null) {
      if (t === e.current) throw Error(r(177));
      if (
        ((i = t.lanes | t.childLanes),
        (i |= ji),
        Bd(e, a, i, c, u, o),
        e === Ce && ((ge = Ce = null), (xe = 0)),
        (_l = t),
        (ya = e),
        (ea = a),
        (Ec = i),
        (zc = n),
        (cf = l),
        (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
          ? ((e.callbackNode = null),
            (e.callbackPriority = 0),
            r0(En, function () {
              return (Nf(), null);
            }))
          : ((e.callbackNode = null), (e.callbackPriority = 0)),
        (l = (t.flags & 13878) !== 0),
        (t.subtreeFlags & 13878) !== 0 || l)
      ) {
        ((l = m.T), (m.T = null), (n = q.p), (q.p = 2), (c = Te), (Te |= 4));
        try {
          Ih(e, t, a);
        } finally {
          ((Te = c), (q.p = n), (m.T = l));
        }
      }
      ((Ke = 1), xf(), jf(), bf());
    }
  }
  function xf() {
    if (Ke === 1) {
      Ke = 0;
      var e = ya,
        t = _l,
        a = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || a) {
        ((a = m.T), (m.T = null));
        var l = q.p;
        q.p = 2;
        var n = Te;
        Te |= 4;
        try {
          Io(t, e);
          var i = Qc,
            c = lr(e.containerInfo),
            u = i.focusedElem,
            o = i.selectionRange;
          if (
            c !== u &&
            u &&
            u.ownerDocument &&
            ar(u.ownerDocument.documentElement, u)
          ) {
            if (o !== null && vi(u)) {
              var y = o.start,
                _ = o.end;
              if ((_ === void 0 && (_ = y), "selectionStart" in u))
                ((u.selectionStart = y),
                  (u.selectionEnd = Math.min(_, u.value.length)));
              else {
                var z = u.ownerDocument || document,
                  x = (z && z.defaultView) || window;
                if (x.getSelection) {
                  var b = x.getSelection(),
                    I = u.textContent.length,
                    se = Math.min(o.start, I),
                    Oe = o.end === void 0 ? se : Math.min(o.end, I);
                  !b.extend && se > Oe && ((c = Oe), (Oe = se), (se = c));
                  var h = tr(u, se),
                    f = tr(u, Oe);
                  if (
                    h &&
                    f &&
                    (b.rangeCount !== 1 ||
                      b.anchorNode !== h.node ||
                      b.anchorOffset !== h.offset ||
                      b.focusNode !== f.node ||
                      b.focusOffset !== f.offset)
                  ) {
                    var p = z.createRange();
                    (p.setStart(h.node, h.offset),
                      b.removeAllRanges(),
                      se > Oe
                        ? (b.addRange(p), b.extend(f.node, f.offset))
                        : (p.setEnd(f.node, f.offset), b.addRange(p)));
                  }
                }
              }
            }
            for (z = [], b = u; (b = b.parentNode); )
              b.nodeType === 1 &&
                z.push({ element: b, left: b.scrollLeft, top: b.scrollTop });
            for (
              typeof u.focus == "function" && u.focus(), u = 0;
              u < z.length;
              u++
            ) {
              var w = z[u];
              ((w.element.scrollLeft = w.left), (w.element.scrollTop = w.top));
            }
          }
          ((Bs = !!Xc), (Qc = Xc = null));
        } finally {
          ((Te = n), (q.p = l), (m.T = a));
        }
      }
      ((e.current = t), (Ke = 2));
    }
  }
  function jf() {
    if (Ke === 2) {
      Ke = 0;
      var e = ya,
        t = _l,
        a = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || a) {
        ((a = m.T), (m.T = null));
        var l = q.p;
        q.p = 2;
        var n = Te;
        Te |= 4;
        try {
          Jo(e, t.alternate, t);
        } finally {
          ((Te = n), (q.p = l), (m.T = a));
        }
      }
      Ke = 3;
    }
  }
  function bf() {
    if (Ke === 4 || Ke === 3) {
      ((Ke = 0), zd());
      var e = ya,
        t = _l,
        a = ea,
        l = cf;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
        ? (Ke = 5)
        : ((Ke = 0), (_l = ya = null), Sf(e, e.pendingLanes));
      var n = e.pendingLanes;
      if (
        (n === 0 && (ga = null),
        Fs(a),
        (t = t.stateNode),
        ft && typeof ft.onCommitFiberRoot == "function")
      )
        try {
          ft.onCommitFiberRoot(Ol, t, void 0, (t.current.flags & 128) === 128);
        } catch {}
      if (l !== null) {
        ((t = m.T), (n = q.p), (q.p = 2), (m.T = null));
        try {
          for (var i = e.onRecoverableError, c = 0; c < l.length; c++) {
            var u = l[c];
            i(u.value, { componentStack: u.stack });
          }
        } finally {
          ((m.T = t), (q.p = n));
        }
      }
      ((ea & 3) !== 0 && Ts(),
        Ht(e),
        (n = e.pendingLanes),
        (a & 261930) !== 0 && (n & 42) !== 0
          ? e === Mc
            ? mn++
            : ((mn = 0), (Mc = e))
          : (mn = 0),
        vn(0));
    }
  }
  function Sf(e, t) {
    (e.pooledCacheLanes &= t) === 0 &&
      ((t = e.pooledCache), t != null && ((e.pooledCache = null), kl(t)));
  }
  function Ts() {
    return (xf(), jf(), bf(), Nf());
  }
  function Nf() {
    if (Ke !== 5) return !1;
    var e = ya,
      t = Ec;
    Ec = 0;
    var a = Fs(ea),
      l = m.T,
      n = q.p;
    try {
      ((q.p = 32 > a ? 32 : a), (m.T = null), (a = zc), (zc = null));
      var i = ya,
        c = ea;
      if (((Ke = 0), (_l = ya = null), (ea = 0), (Te & 6) !== 0))
        throw Error(r(331));
      var u = Te;
      if (
        ((Te |= 4),
        lf(i.current),
        ef(i, i.current, c, a),
        (Te = u),
        vn(0, !1),
        ft && typeof ft.onPostCommitFiberRoot == "function")
      )
        try {
          ft.onPostCommitFiberRoot(Ol, i);
        } catch {}
      return !0;
    } finally {
      ((q.p = n), (m.T = l), Sf(e, t));
    }
  }
  function _f(e, t, a) {
    ((t = Nt(a, t)),
      (t = uc(e.stateNode, t, 2)),
      (e = fa(e, t, 2)),
      e !== null && (Dl(e, 2), Ht(e)));
  }
  function ze(e, t, a) {
    if (e.tag === 3) _f(e, e, a);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          _f(t, e, a);
          break;
        } else if (t.tag === 1) {
          var l = t.stateNode;
          if (
            typeof t.type.getDerivedStateFromError == "function" ||
            (typeof l.componentDidCatch == "function" &&
              (ga === null || !ga.has(l)))
          ) {
            ((e = Nt(a, e)),
              (a = _o(2)),
              (l = fa(t, a, 2)),
              l !== null && (Ao(a, l, t, e), Dl(l, 2), Ht(l)));
            break;
          }
        }
        t = t.return;
      }
  }
  function Cc(e, t, a) {
    var l = e.pingCache;
    if (l === null) {
      l = e.pingCache = new t0();
      var n = new Set();
      l.set(t, n);
    } else ((n = l.get(t)), n === void 0 && ((n = new Set()), l.set(t, n)));
    n.has(a) ||
      ((Ac = !0), n.add(a), (e = i0.bind(null, e, t, a)), t.then(e, e));
  }
  function i0(e, t, a) {
    var l = e.pingCache;
    (l !== null && l.delete(t),
      (e.pingedLanes |= e.suspendedLanes & a),
      (e.warmLanes &= ~a),
      Ce === e &&
        (xe & a) === a &&
        (Ze === 4 || (Ze === 3 && (xe & 62914560) === xe && 300 > ot() - js)
          ? (Te & 2) === 0 && Al(e, 0)
          : (Tc |= a),
        Nl === xe && (Nl = 0)),
      Ht(e));
  }
  function Af(e, t) {
    (t === 0 && (t = gu()), (e = Da(e, t)), e !== null && (Dl(e, t), Ht(e)));
  }
  function c0(e) {
    var t = e.memoizedState,
      a = 0;
    (t !== null && (a = t.retryLane), Af(e, a));
  }
  function u0(e, t) {
    var a = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var l = e.stateNode,
          n = e.memoizedState;
        n !== null && (a = n.retryLane);
        break;
      case 19:
        l = e.stateNode;
        break;
      case 22:
        l = e.stateNode._retryCache;
        break;
      default:
        throw Error(r(314));
    }
    (l !== null && l.delete(t), Af(e, a));
  }
  function r0(e, t) {
    return Ks(e, t);
  }
  var ws = null,
    wl = null,
    Dc = !1,
    Es = !1,
    qc = !1,
    ja = 0;
  function Ht(e) {
    (e !== wl &&
      e.next === null &&
      (wl === null ? (ws = wl = e) : (wl = wl.next = e)),
      (Es = !0),
      Dc || ((Dc = !0), f0()));
  }
  function vn(e, t) {
    if (!qc && Es) {
      qc = !0;
      do
        for (var a = !1, l = ws; l !== null; ) {
          if (e !== 0) {
            var n = l.pendingLanes;
            if (n === 0) var i = 0;
            else {
              var c = l.suspendedLanes,
                u = l.pingedLanes;
              ((i = (1 << (31 - dt(42 | e) + 1)) - 1),
                (i &= n & ~(c & ~u)),
                (i = i & 201326741 ? (i & 201326741) | 1 : i ? i | 2 : 0));
            }
            i !== 0 && ((a = !0), zf(l, i));
          } else
            ((i = xe),
              (i = On(
                l,
                l === Ce ? i : 0,
                l.cancelPendingCommit !== null || l.timeoutHandle !== -1,
              )),
              (i & 3) === 0 || Cl(l, i) || ((a = !0), zf(l, i)));
          l = l.next;
        }
      while (a);
      qc = !1;
    }
  }
  function o0() {
    Tf();
  }
  function Tf() {
    Es = Dc = !1;
    var e = 0;
    ja !== 0 && b0() && (e = ja);
    for (var t = ot(), a = null, l = ws; l !== null; ) {
      var n = l.next,
        i = wf(l, t);
      (i === 0
        ? ((l.next = null),
          a === null ? (ws = n) : (a.next = n),
          n === null && (wl = a))
        : ((a = l), (e !== 0 || (i & 3) !== 0) && (Es = !0)),
        (l = n));
    }
    ((Ke !== 0 && Ke !== 5) || vn(e), ja !== 0 && (ja = 0));
  }
  function wf(e, t) {
    for (
      var a = e.suspendedLanes,
        l = e.pingedLanes,
        n = e.expirationTimes,
        i = e.pendingLanes & -62914561;
      0 < i;
    ) {
      var c = 31 - dt(i),
        u = 1 << c,
        o = n[c];
      (o === -1
        ? ((u & a) === 0 || (u & l) !== 0) && (n[c] = Hd(u, t))
        : o <= t && (e.expiredLanes |= u),
        (i &= ~u));
    }
    if (
      ((t = Ce),
      (a = xe),
      (a = On(
        e,
        e === t ? a : 0,
        e.cancelPendingCommit !== null || e.timeoutHandle !== -1,
      )),
      (l = e.callbackNode),
      a === 0 ||
        (e === t && (Ee === 2 || Ee === 9)) ||
        e.cancelPendingCommit !== null)
    )
      return (
        l !== null && l !== null && Js(l),
        (e.callbackNode = null),
        (e.callbackPriority = 0)
      );
    if ((a & 3) === 0 || Cl(e, a)) {
      if (((t = a & -a), t === e.callbackPriority)) return t;
      switch ((l !== null && Js(l), Fs(a))) {
        case 2:
        case 8:
          a = vu;
          break;
        case 32:
          a = En;
          break;
        case 268435456:
          a = pu;
          break;
        default:
          a = En;
      }
      return (
        (l = Ef.bind(null, e)),
        (a = Ks(a, l)),
        (e.callbackPriority = t),
        (e.callbackNode = a),
        t
      );
    }
    return (
      l !== null && l !== null && Js(l),
      (e.callbackPriority = 2),
      (e.callbackNode = null),
      2
    );
  }
  function Ef(e, t) {
    if (Ke !== 0 && Ke !== 5)
      return ((e.callbackNode = null), (e.callbackPriority = 0), null);
    var a = e.callbackNode;
    if (Ts() && e.callbackNode !== a) return null;
    var l = xe;
    return (
      (l = On(
        e,
        e === Ce ? l : 0,
        e.cancelPendingCommit !== null || e.timeoutHandle !== -1,
      )),
      l === 0
        ? null
        : (rf(e, l, t),
          wf(e, ot()),
          e.callbackNode != null && e.callbackNode === a
            ? Ef.bind(null, e)
            : null)
    );
  }
  function zf(e, t) {
    if (Ts()) return null;
    rf(e, t, !0);
  }
  function f0() {
    N0(function () {
      (Te & 6) !== 0 ? Ks(mu, o0) : Tf();
    });
  }
  function Uc() {
    if (ja === 0) {
      var e = dl;
      (e === 0 && ((e = zn), (zn <<= 1), (zn & 261888) === 0 && (zn = 256)),
        (ja = e));
    }
    return ja;
  }
  function Mf(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean"
      ? null
      : typeof e == "function"
        ? e
        : Un("" + e);
  }
  function Rf(e, t) {
    var a = t.ownerDocument.createElement("input");
    return (
      (a.name = t.name),
      (a.value = t.value),
      e.id && a.setAttribute("form", e.id),
      t.parentNode.insertBefore(a, t),
      (e = new FormData(e)),
      a.parentNode.removeChild(a),
      e
    );
  }
  function d0(e, t, a, l, n) {
    if (t === "submit" && a && a.stateNode === n) {
      var i = Mf((n[lt] || null).action),
        c = l.submitter;
      c &&
        ((t = (t = c[lt] || null)
          ? Mf(t.formAction)
          : c.getAttribute("formAction")),
        t !== null && ((i = t), (c = null)));
      var u = new Yn("action", "action", null, l, n);
      e.push({
        event: u,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (l.defaultPrevented) {
                if (ja !== 0) {
                  var o = c ? Rf(n, c) : new FormData(n);
                  ac(
                    a,
                    { pending: !0, data: o, method: n.method, action: i },
                    null,
                    o,
                  );
                }
              } else
                typeof i == "function" &&
                  (u.preventDefault(),
                  (o = c ? Rf(n, c) : new FormData(n)),
                  ac(
                    a,
                    { pending: !0, data: o, method: n.method, action: i },
                    i,
                    o,
                  ));
            },
            currentTarget: n,
          },
        ],
      });
    }
  }
  for (var Hc = 0; Hc < xi.length; Hc++) {
    var Bc = xi[Hc],
      h0 = Bc.toLowerCase(),
      m0 = Bc[0].toUpperCase() + Bc.slice(1);
    Mt(h0, "on" + m0);
  }
  (Mt(ir, "onAnimationEnd"),
    Mt(cr, "onAnimationIteration"),
    Mt(ur, "onAnimationStart"),
    Mt("dblclick", "onDoubleClick"),
    Mt("focusin", "onFocus"),
    Mt("focusout", "onBlur"),
    Mt(Mh, "onTransitionRun"),
    Mt(Rh, "onTransitionStart"),
    Mt(Oh, "onTransitionCancel"),
    Mt(rr, "onTransitionEnd"),
    Ia("onMouseEnter", ["mouseout", "mouseover"]),
    Ia("onMouseLeave", ["mouseout", "mouseover"]),
    Ia("onPointerEnter", ["pointerout", "pointerover"]),
    Ia("onPointerLeave", ["pointerout", "pointerover"]),
    Ma(
      "onChange",
      "change click focusin focusout input keydown keyup selectionchange".split(
        " ",
      ),
    ),
    Ma(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " ",
      ),
    ),
    Ma("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    Ma(
      "onCompositionEnd",
      "compositionend focusout keydown keypress keyup mousedown".split(" "),
    ),
    Ma(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" "),
    ),
    Ma(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
    ));
  var pn =
      "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " ",
      ),
    v0 = new Set(
      "beforetoggle cancel close invalid load scroll scrollend toggle"
        .split(" ")
        .concat(pn),
    );
  function Of(e, t) {
    t = (t & 4) !== 0;
    for (var a = 0; a < e.length; a++) {
      var l = e[a],
        n = l.event;
      l = l.listeners;
      e: {
        var i = void 0;
        if (t)
          for (var c = l.length - 1; 0 <= c; c--) {
            var u = l[c],
              o = u.instance,
              y = u.currentTarget;
            if (((u = u.listener), o !== i && n.isPropagationStopped()))
              break e;
            ((i = u), (n.currentTarget = y));
            try {
              i(n);
            } catch (_) {
              Xn(_);
            }
            ((n.currentTarget = null), (i = o));
          }
        else
          for (c = 0; c < l.length; c++) {
            if (
              ((u = l[c]),
              (o = u.instance),
              (y = u.currentTarget),
              (u = u.listener),
              o !== i && n.isPropagationStopped())
            )
              break e;
            ((i = u), (n.currentTarget = y));
            try {
              i(n);
            } catch (_) {
              Xn(_);
            }
            ((n.currentTarget = null), (i = o));
          }
      }
    }
  }
  function ye(e, t) {
    var a = t[Ws];
    a === void 0 && (a = t[Ws] = new Set());
    var l = e + "__bubble";
    a.has(l) || (Cf(t, e, 2, !1), a.add(l));
  }
  function Zc(e, t, a) {
    var l = 0;
    (t && (l |= 4), Cf(a, e, l, t));
  }
  var zs = "_reactListening" + Math.random().toString(36).slice(2);
  function Yc(e) {
    if (!e[zs]) {
      ((e[zs] = !0),
        _u.forEach(function (a) {
          a !== "selectionchange" && (v0.has(a) || Zc(a, !1, e), Zc(a, !0, e));
        }));
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[zs] || ((t[zs] = !0), Zc("selectionchange", !1, t));
    }
  }
  function Cf(e, t, a, l) {
    switch (ud(t)) {
      case 2:
        var n = X0;
        break;
      case 8:
        n = Q0;
        break;
      default:
        n = tu;
    }
    ((a = n.bind(null, t, a, e)),
      (n = void 0),
      !ii ||
        (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
        (n = !0),
      l
        ? n !== void 0
          ? e.addEventListener(t, a, { capture: !0, passive: n })
          : e.addEventListener(t, a, !0)
        : n !== void 0
          ? e.addEventListener(t, a, { passive: n })
          : e.addEventListener(t, a, !1));
  }
  function Lc(e, t, a, l, n) {
    var i = l;
    if ((t & 1) === 0 && (t & 2) === 0 && l !== null)
      e: for (;;) {
        if (l === null) return;
        var c = l.tag;
        if (c === 3 || c === 4) {
          var u = l.stateNode.containerInfo;
          if (u === n) break;
          if (c === 4)
            for (c = l.return; c !== null; ) {
              var o = c.tag;
              if ((o === 3 || o === 4) && c.stateNode.containerInfo === n)
                return;
              c = c.return;
            }
          for (; u !== null; ) {
            if (((c = $a(u)), c === null)) return;
            if (((o = c.tag), o === 5 || o === 6 || o === 26 || o === 27)) {
              l = i = c;
              continue e;
            }
            u = u.parentNode;
          }
        }
        l = l.return;
      }
    Uu(function () {
      var y = i,
        _ = ni(a),
        z = [];
      e: {
        var x = or.get(e);
        if (x !== void 0) {
          var b = Yn,
            I = e;
          switch (e) {
            case "keypress":
              if (Bn(a) === 0) break e;
            case "keydown":
            case "keyup":
              b = uh;
              break;
            case "focusin":
              ((I = "focus"), (b = oi));
              break;
            case "focusout":
              ((I = "blur"), (b = oi));
              break;
            case "beforeblur":
            case "afterblur":
              b = oi;
              break;
            case "click":
              if (a.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              b = Zu;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              b = Fd;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              b = fh;
              break;
            case ir:
            case cr:
            case ur:
              b = Pd;
              break;
            case rr:
              b = hh;
              break;
            case "scroll":
            case "scrollend":
              b = kd;
              break;
            case "wheel":
              b = vh;
              break;
            case "copy":
            case "cut":
            case "paste":
              b = th;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              b = Lu;
              break;
            case "toggle":
            case "beforetoggle":
              b = gh;
          }
          var se = (t & 4) !== 0,
            Oe = !se && (e === "scroll" || e === "scrollend"),
            h = se ? (x !== null ? x + "Capture" : null) : x;
          se = [];
          for (var f = y, p; f !== null; ) {
            var w = f;
            if (
              ((p = w.stateNode),
              (w = w.tag),
              (w !== 5 && w !== 26 && w !== 27) ||
                p === null ||
                h === null ||
                ((w = Hl(f, h)), w != null && se.push(gn(f, w, p))),
              Oe)
            )
              break;
            f = f.return;
          }
          0 < se.length &&
            ((x = new b(x, I, null, a, _)),
            z.push({ event: x, listeners: se }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (
            ((x = e === "mouseover" || e === "pointerover"),
            (b = e === "mouseout" || e === "pointerout"),
            x &&
              a !== li &&
              (I = a.relatedTarget || a.fromElement) &&
              ($a(I) || I[ka]))
          )
            break e;
          if (
            (b || x) &&
            ((x =
              _.window === _
                ? _
                : (x = _.ownerDocument)
                  ? x.defaultView || x.parentWindow
                  : window),
            b
              ? ((I = a.relatedTarget || a.toElement),
                (b = y),
                (I = I ? $a(I) : null),
                I !== null &&
                  ((Oe = K(I)),
                  (se = I.tag),
                  I !== Oe || (se !== 5 && se !== 27 && se !== 6)) &&
                  (I = null))
              : ((b = null), (I = y)),
            b !== I)
          ) {
            if (
              ((se = Zu),
              (w = "onMouseLeave"),
              (h = "onMouseEnter"),
              (f = "mouse"),
              (e === "pointerout" || e === "pointerover") &&
                ((se = Lu),
                (w = "onPointerLeave"),
                (h = "onPointerEnter"),
                (f = "pointer")),
              (Oe = b == null ? x : Ul(b)),
              (p = I == null ? x : Ul(I)),
              (x = new se(w, f + "leave", b, a, _)),
              (x.target = Oe),
              (x.relatedTarget = p),
              (w = null),
              $a(_) === y &&
                ((se = new se(h, f + "enter", I, a, _)),
                (se.target = p),
                (se.relatedTarget = Oe),
                (w = se)),
              (Oe = w),
              b && I)
            )
              t: {
                for (se = p0, h = b, f = I, p = 0, w = h; w; w = se(w)) p++;
                w = 0;
                for (var ne = f; ne; ne = se(ne)) w++;
                for (; 0 < p - w; ) ((h = se(h)), p--);
                for (; 0 < w - p; ) ((f = se(f)), w--);
                for (; p--; ) {
                  if (h === f || (f !== null && h === f.alternate)) {
                    se = h;
                    break t;
                  }
                  ((h = se(h)), (f = se(f)));
                }
                se = null;
              }
            else se = null;
            (b !== null && Df(z, x, b, se, !1),
              I !== null && Oe !== null && Df(z, Oe, I, se, !0));
          }
        }
        e: {
          if (
            ((x = y ? Ul(y) : window),
            (b = x.nodeName && x.nodeName.toLowerCase()),
            b === "select" || (b === "input" && x.type === "file"))
          )
            var _e = $u;
          else if (Ju(x))
            if (Fu) _e = wh;
            else {
              _e = Ah;
              var te = _h;
            }
          else
            ((b = x.nodeName),
              !b ||
              b.toLowerCase() !== "input" ||
              (x.type !== "checkbox" && x.type !== "radio")
                ? y && ai(y.elementType) && (_e = $u)
                : (_e = Th));
          if (_e && (_e = _e(e, y))) {
            ku(z, _e, a, _);
            break e;
          }
          (te && te(e, x, y),
            e === "focusout" &&
              y &&
              x.type === "number" &&
              y.memoizedProps.value != null &&
              ti(x, "number", x.value));
        }
        switch (((te = y ? Ul(y) : window), e)) {
          case "focusin":
            (Ju(te) || te.contentEditable === "true") &&
              ((nl = te), (pi = y), (Vl = null));
            break;
          case "focusout":
            Vl = pi = nl = null;
            break;
          case "mousedown":
            gi = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ((gi = !1), nr(z, a, _));
            break;
          case "selectionchange":
            if (zh) break;
          case "keydown":
          case "keyup":
            nr(z, a, _);
        }
        var he;
        if (di)
          e: {
            switch (e) {
              case "compositionstart":
                var je = "onCompositionStart";
                break e;
              case "compositionend":
                je = "onCompositionEnd";
                break e;
              case "compositionupdate":
                je = "onCompositionUpdate";
                break e;
            }
            je = void 0;
          }
        else
          ll
            ? Vu(e, a) && (je = "onCompositionEnd")
            : e === "keydown" &&
              a.keyCode === 229 &&
              (je = "onCompositionStart");
        (je &&
          (Gu &&
            a.locale !== "ko" &&
            (ll || je !== "onCompositionStart"
              ? je === "onCompositionEnd" && ll && (he = Hu())
              : ((na = _),
                (ci = "value" in na ? na.value : na.textContent),
                (ll = !0))),
          (te = Ms(y, je)),
          0 < te.length &&
            ((je = new Yu(je, e, null, a, _)),
            z.push({ event: je, listeners: te }),
            he
              ? (je.data = he)
              : ((he = Ku(a)), he !== null && (je.data = he)))),
          (he = xh ? jh(e, a) : bh(e, a)) &&
            ((je = Ms(y, "onBeforeInput")),
            0 < je.length &&
              ((te = new Yu("onBeforeInput", "beforeinput", null, a, _)),
              z.push({ event: te, listeners: je }),
              (te.data = he))),
          d0(z, e, y, a, _));
      }
      Of(z, t);
    });
  }
  function gn(e, t, a) {
    return { instance: e, listener: t, currentTarget: a };
  }
  function Ms(e, t) {
    for (var a = t + "Capture", l = []; e !== null; ) {
      var n = e,
        i = n.stateNode;
      if (
        ((n = n.tag),
        (n !== 5 && n !== 26 && n !== 27) ||
          i === null ||
          ((n = Hl(e, a)),
          n != null && l.unshift(gn(e, n, i)),
          (n = Hl(e, t)),
          n != null && l.push(gn(e, n, i))),
        e.tag === 3)
      )
        return l;
      e = e.return;
    }
    return [];
  }
  function p0(e) {
    if (e === null) return null;
    do e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function Df(e, t, a, l, n) {
    for (var i = t._reactName, c = []; a !== null && a !== l; ) {
      var u = a,
        o = u.alternate,
        y = u.stateNode;
      if (((u = u.tag), o !== null && o === l)) break;
      ((u !== 5 && u !== 26 && u !== 27) ||
        y === null ||
        ((o = y),
        n
          ? ((y = Hl(a, i)), y != null && c.unshift(gn(a, y, o)))
          : n || ((y = Hl(a, i)), y != null && c.push(gn(a, y, o)))),
        (a = a.return));
    }
    c.length !== 0 && e.push({ event: t, listeners: c });
  }
  var g0 = /\r\n?/g,
    y0 = /\u0000|\uFFFD/g;
  function qf(e) {
    return (typeof e == "string" ? e : "" + e)
      .replace(
        g0,
        `
`,
      )
      .replace(y0, "");
  }
  function Uf(e, t) {
    return ((t = qf(t)), qf(e) === t);
  }
  function Re(e, t, a, l, n, i) {
    switch (a) {
      case "children":
        typeof l == "string"
          ? t === "body" || (t === "textarea" && l === "") || el(e, l)
          : (typeof l == "number" || typeof l == "bigint") &&
            t !== "body" &&
            el(e, "" + l);
        break;
      case "className":
        Dn(e, "class", l);
        break;
      case "tabIndex":
        Dn(e, "tabindex", l);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Dn(e, a, l);
        break;
      case "style":
        Du(e, l, i);
        break;
      case "data":
        if (t !== "object") {
          Dn(e, "data", l);
          break;
        }
      case "src":
      case "href":
        if (l === "" && (t !== "a" || a !== "href")) {
          e.removeAttribute(a);
          break;
        }
        if (
          l == null ||
          typeof l == "function" ||
          typeof l == "symbol" ||
          typeof l == "boolean"
        ) {
          e.removeAttribute(a);
          break;
        }
        ((l = Un("" + l)), e.setAttribute(a, l));
        break;
      case "action":
      case "formAction":
        if (typeof l == "function") {
          e.setAttribute(
            a,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
          );
          break;
        } else
          typeof i == "function" &&
            (a === "formAction"
              ? (t !== "input" && Re(e, t, "name", n.name, n, null),
                Re(e, t, "formEncType", n.formEncType, n, null),
                Re(e, t, "formMethod", n.formMethod, n, null),
                Re(e, t, "formTarget", n.formTarget, n, null))
              : (Re(e, t, "encType", n.encType, n, null),
                Re(e, t, "method", n.method, n, null),
                Re(e, t, "target", n.target, n, null)));
        if (l == null || typeof l == "symbol" || typeof l == "boolean") {
          e.removeAttribute(a);
          break;
        }
        ((l = Un("" + l)), e.setAttribute(a, l));
        break;
      case "onClick":
        l != null && (e.onclick = Zt);
        break;
      case "onScroll":
        l != null && ye("scroll", e);
        break;
      case "onScrollEnd":
        l != null && ye("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l)) throw Error(r(61));
          if (((a = l.__html), a != null)) {
            if (n.children != null) throw Error(r(60));
            e.innerHTML = a;
          }
        }
        break;
      case "multiple":
        e.multiple = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "muted":
        e.muted = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (
          l == null ||
          typeof l == "function" ||
          typeof l == "boolean" ||
          typeof l == "symbol"
        ) {
          e.removeAttribute("xlink:href");
          break;
        }
        ((a = Un("" + l)),
          e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", a));
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        l != null && typeof l != "function" && typeof l != "symbol"
          ? e.setAttribute(a, "" + l)
          : e.removeAttribute(a);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        l && typeof l != "function" && typeof l != "symbol"
          ? e.setAttribute(a, "")
          : e.removeAttribute(a);
        break;
      case "capture":
      case "download":
        l === !0
          ? e.setAttribute(a, "")
          : l !== !1 &&
              l != null &&
              typeof l != "function" &&
              typeof l != "symbol"
            ? e.setAttribute(a, l)
            : e.removeAttribute(a);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        l != null &&
        typeof l != "function" &&
        typeof l != "symbol" &&
        !isNaN(l) &&
        1 <= l
          ? e.setAttribute(a, l)
          : e.removeAttribute(a);
        break;
      case "rowSpan":
      case "start":
        l == null || typeof l == "function" || typeof l == "symbol" || isNaN(l)
          ? e.removeAttribute(a)
          : e.setAttribute(a, l);
        break;
      case "popover":
        (ye("beforetoggle", e), ye("toggle", e), Cn(e, "popover", l));
        break;
      case "xlinkActuate":
        Bt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", l);
        break;
      case "xlinkArcrole":
        Bt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", l);
        break;
      case "xlinkRole":
        Bt(e, "http://www.w3.org/1999/xlink", "xlink:role", l);
        break;
      case "xlinkShow":
        Bt(e, "http://www.w3.org/1999/xlink", "xlink:show", l);
        break;
      case "xlinkTitle":
        Bt(e, "http://www.w3.org/1999/xlink", "xlink:title", l);
        break;
      case "xlinkType":
        Bt(e, "http://www.w3.org/1999/xlink", "xlink:type", l);
        break;
      case "xmlBase":
        Bt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", l);
        break;
      case "xmlLang":
        Bt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", l);
        break;
      case "xmlSpace":
        Bt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", l);
        break;
      case "is":
        Cn(e, "is", l);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < a.length) ||
          (a[0] !== "o" && a[0] !== "O") ||
          (a[1] !== "n" && a[1] !== "N")) &&
          ((a = Kd.get(a) || a), Cn(e, a, l));
    }
  }
  function Gc(e, t, a, l, n, i) {
    switch (a) {
      case "style":
        Du(e, l, i);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l)) throw Error(r(61));
          if (((a = l.__html), a != null)) {
            if (n.children != null) throw Error(r(60));
            e.innerHTML = a;
          }
        }
        break;
      case "children":
        typeof l == "string"
          ? el(e, l)
          : (typeof l == "number" || typeof l == "bigint") && el(e, "" + l);
        break;
      case "onScroll":
        l != null && ye("scroll", e);
        break;
      case "onScrollEnd":
        l != null && ye("scrollend", e);
        break;
      case "onClick":
        l != null && (e.onclick = Zt);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!Au.hasOwnProperty(a))
          e: {
            if (
              a[0] === "o" &&
              a[1] === "n" &&
              ((n = a.endsWith("Capture")),
              (t = a.slice(2, n ? a.length - 7 : void 0)),
              (i = e[lt] || null),
              (i = i != null ? i[a] : null),
              typeof i == "function" && e.removeEventListener(t, i, n),
              typeof l == "function")
            ) {
              (typeof i != "function" &&
                i !== null &&
                (a in e
                  ? (e[a] = null)
                  : e.hasAttribute(a) && e.removeAttribute(a)),
                e.addEventListener(t, l, n));
              break e;
            }
            a in e
              ? (e[a] = l)
              : l === !0
                ? e.setAttribute(a, "")
                : Cn(e, a, l);
          }
    }
  }
  function et(e, t, a) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        (ye("error", e), ye("load", e));
        var l = !1,
          n = !1,
          i;
        for (i in a)
          if (a.hasOwnProperty(i)) {
            var c = a[i];
            if (c != null)
              switch (i) {
                case "src":
                  l = !0;
                  break;
                case "srcSet":
                  n = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(r(137, t));
                default:
                  Re(e, t, i, c, a, null);
              }
          }
        (n && Re(e, t, "srcSet", a.srcSet, a, null),
          l && Re(e, t, "src", a.src, a, null));
        return;
      case "input":
        ye("invalid", e);
        var u = (i = c = n = null),
          o = null,
          y = null;
        for (l in a)
          if (a.hasOwnProperty(l)) {
            var _ = a[l];
            if (_ != null)
              switch (l) {
                case "name":
                  n = _;
                  break;
                case "type":
                  c = _;
                  break;
                case "checked":
                  o = _;
                  break;
                case "defaultChecked":
                  y = _;
                  break;
                case "value":
                  i = _;
                  break;
                case "defaultValue":
                  u = _;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (_ != null) throw Error(r(137, t));
                  break;
                default:
                  Re(e, t, l, _, a, null);
              }
          }
        Mu(e, i, u, o, y, c, n, !1);
        return;
      case "select":
        (ye("invalid", e), (l = c = i = null));
        for (n in a)
          if (a.hasOwnProperty(n) && ((u = a[n]), u != null))
            switch (n) {
              case "value":
                i = u;
                break;
              case "defaultValue":
                c = u;
                break;
              case "multiple":
                l = u;
              default:
                Re(e, t, n, u, a, null);
            }
        ((t = i),
          (a = c),
          (e.multiple = !!l),
          t != null ? Pa(e, !!l, t, !1) : a != null && Pa(e, !!l, a, !0));
        return;
      case "textarea":
        (ye("invalid", e), (i = n = l = null));
        for (c in a)
          if (a.hasOwnProperty(c) && ((u = a[c]), u != null))
            switch (c) {
              case "value":
                l = u;
                break;
              case "defaultValue":
                n = u;
                break;
              case "children":
                i = u;
                break;
              case "dangerouslySetInnerHTML":
                if (u != null) throw Error(r(91));
                break;
              default:
                Re(e, t, c, u, a, null);
            }
        Ou(e, l, n, i);
        return;
      case "option":
        for (o in a)
          if (a.hasOwnProperty(o) && ((l = a[o]), l != null))
            switch (o) {
              case "selected":
                e.selected =
                  l && typeof l != "function" && typeof l != "symbol";
                break;
              default:
                Re(e, t, o, l, a, null);
            }
        return;
      case "dialog":
        (ye("beforetoggle", e),
          ye("toggle", e),
          ye("cancel", e),
          ye("close", e));
        break;
      case "iframe":
      case "object":
        ye("load", e);
        break;
      case "video":
      case "audio":
        for (l = 0; l < pn.length; l++) ye(pn[l], e);
        break;
      case "image":
        (ye("error", e), ye("load", e));
        break;
      case "details":
        ye("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        (ye("error", e), ye("load", e));
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (y in a)
          if (a.hasOwnProperty(y) && ((l = a[y]), l != null))
            switch (y) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(r(137, t));
              default:
                Re(e, t, y, l, a, null);
            }
        return;
      default:
        if (ai(t)) {
          for (_ in a)
            a.hasOwnProperty(_) &&
              ((l = a[_]), l !== void 0 && Gc(e, t, _, l, a, void 0));
          return;
        }
    }
    for (u in a)
      a.hasOwnProperty(u) && ((l = a[u]), l != null && Re(e, t, u, l, a, null));
  }
  function x0(e, t, a, l) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var n = null,
          i = null,
          c = null,
          u = null,
          o = null,
          y = null,
          _ = null;
        for (b in a) {
          var z = a[b];
          if (a.hasOwnProperty(b) && z != null)
            switch (b) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                o = z;
              default:
                l.hasOwnProperty(b) || Re(e, t, b, null, l, z);
            }
        }
        for (var x in l) {
          var b = l[x];
          if (((z = a[x]), l.hasOwnProperty(x) && (b != null || z != null)))
            switch (x) {
              case "type":
                i = b;
                break;
              case "name":
                n = b;
                break;
              case "checked":
                y = b;
                break;
              case "defaultChecked":
                _ = b;
                break;
              case "value":
                c = b;
                break;
              case "defaultValue":
                u = b;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (b != null) throw Error(r(137, t));
                break;
              default:
                b !== z && Re(e, t, x, b, l, z);
            }
        }
        ei(e, c, u, o, y, _, i, n);
        return;
      case "select":
        b = c = u = x = null;
        for (i in a)
          if (((o = a[i]), a.hasOwnProperty(i) && o != null))
            switch (i) {
              case "value":
                break;
              case "multiple":
                b = o;
              default:
                l.hasOwnProperty(i) || Re(e, t, i, null, l, o);
            }
        for (n in l)
          if (
            ((i = l[n]),
            (o = a[n]),
            l.hasOwnProperty(n) && (i != null || o != null))
          )
            switch (n) {
              case "value":
                x = i;
                break;
              case "defaultValue":
                u = i;
                break;
              case "multiple":
                c = i;
              default:
                i !== o && Re(e, t, n, i, l, o);
            }
        ((t = u),
          (a = c),
          (l = b),
          x != null
            ? Pa(e, !!a, x, !1)
            : !!l != !!a &&
              (t != null ? Pa(e, !!a, t, !0) : Pa(e, !!a, a ? [] : "", !1)));
        return;
      case "textarea":
        b = x = null;
        for (u in a)
          if (
            ((n = a[u]),
            a.hasOwnProperty(u) && n != null && !l.hasOwnProperty(u))
          )
            switch (u) {
              case "value":
                break;
              case "children":
                break;
              default:
                Re(e, t, u, null, l, n);
            }
        for (c in l)
          if (
            ((n = l[c]),
            (i = a[c]),
            l.hasOwnProperty(c) && (n != null || i != null))
          )
            switch (c) {
              case "value":
                x = n;
                break;
              case "defaultValue":
                b = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(r(91));
                break;
              default:
                n !== i && Re(e, t, c, n, l, i);
            }
        Ru(e, x, b);
        return;
      case "option":
        for (var I in a)
          if (
            ((x = a[I]),
            a.hasOwnProperty(I) && x != null && !l.hasOwnProperty(I))
          )
            switch (I) {
              case "selected":
                e.selected = !1;
                break;
              default:
                Re(e, t, I, null, l, x);
            }
        for (o in l)
          if (
            ((x = l[o]),
            (b = a[o]),
            l.hasOwnProperty(o) && x !== b && (x != null || b != null))
          )
            switch (o) {
              case "selected":
                e.selected =
                  x && typeof x != "function" && typeof x != "symbol";
                break;
              default:
                Re(e, t, o, x, l, b);
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var se in a)
          ((x = a[se]),
            a.hasOwnProperty(se) &&
              x != null &&
              !l.hasOwnProperty(se) &&
              Re(e, t, se, null, l, x));
        for (y in l)
          if (
            ((x = l[y]),
            (b = a[y]),
            l.hasOwnProperty(y) && x !== b && (x != null || b != null))
          )
            switch (y) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (x != null) throw Error(r(137, t));
                break;
              default:
                Re(e, t, y, x, l, b);
            }
        return;
      default:
        if (ai(t)) {
          for (var Oe in a)
            ((x = a[Oe]),
              a.hasOwnProperty(Oe) &&
                x !== void 0 &&
                !l.hasOwnProperty(Oe) &&
                Gc(e, t, Oe, void 0, l, x));
          for (_ in l)
            ((x = l[_]),
              (b = a[_]),
              !l.hasOwnProperty(_) ||
                x === b ||
                (x === void 0 && b === void 0) ||
                Gc(e, t, _, x, l, b));
          return;
        }
    }
    for (var h in a)
      ((x = a[h]),
        a.hasOwnProperty(h) &&
          x != null &&
          !l.hasOwnProperty(h) &&
          Re(e, t, h, null, l, x));
    for (z in l)
      ((x = l[z]),
        (b = a[z]),
        !l.hasOwnProperty(z) ||
          x === b ||
          (x == null && b == null) ||
          Re(e, t, z, x, l, b));
  }
  function Hf(e) {
    switch (e) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function j0() {
    if (typeof performance.getEntriesByType == "function") {
      for (
        var e = 0, t = 0, a = performance.getEntriesByType("resource"), l = 0;
        l < a.length;
        l++
      ) {
        var n = a[l],
          i = n.transferSize,
          c = n.initiatorType,
          u = n.duration;
        if (i && u && Hf(c)) {
          for (c = 0, u = n.responseEnd, l += 1; l < a.length; l++) {
            var o = a[l],
              y = o.startTime;
            if (y > u) break;
            var _ = o.transferSize,
              z = o.initiatorType;
            _ &&
              Hf(z) &&
              ((o = o.responseEnd), (c += _ * (o < u ? 1 : (u - y) / (o - y))));
          }
          if ((--l, (t += (8 * (i + c)) / (n.duration / 1e3)), e++, 10 < e))
            break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection &&
      ((e = navigator.connection.downlink), typeof e == "number")
      ? e
      : 5;
  }
  var Xc = null,
    Qc = null;
  function Rs(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function Bf(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Zf(e, t) {
    if (e === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return e === 1 && t === "foreignObject" ? 0 : e;
  }
  function Vc(e, t) {
    return (
      e === "textarea" ||
      e === "noscript" ||
      typeof t.children == "string" ||
      typeof t.children == "number" ||
      typeof t.children == "bigint" ||
      (typeof t.dangerouslySetInnerHTML == "object" &&
        t.dangerouslySetInnerHTML !== null &&
        t.dangerouslySetInnerHTML.__html != null)
    );
  }
  var Kc = null;
  function b0() {
    var e = window.event;
    return e && e.type === "popstate"
      ? e === Kc
        ? !1
        : ((Kc = e), !0)
      : ((Kc = null), !1);
  }
  var Yf = typeof setTimeout == "function" ? setTimeout : void 0,
    S0 = typeof clearTimeout == "function" ? clearTimeout : void 0,
    Lf = typeof Promise == "function" ? Promise : void 0,
    N0 =
      typeof queueMicrotask == "function"
        ? queueMicrotask
        : typeof Lf < "u"
          ? function (e) {
              return Lf.resolve(null).then(e).catch(_0);
            }
          : Yf;
  function _0(e) {
    setTimeout(function () {
      throw e;
    });
  }
  function ba(e) {
    return e === "head";
  }
  function Gf(e, t) {
    var a = t,
      l = 0;
    do {
      var n = a.nextSibling;
      if ((e.removeChild(a), n && n.nodeType === 8))
        if (((a = n.data), a === "/$" || a === "/&")) {
          if (l === 0) {
            (e.removeChild(n), Rl(t));
            return;
          }
          l--;
        } else if (
          a === "$" ||
          a === "$?" ||
          a === "$~" ||
          a === "$!" ||
          a === "&"
        )
          l++;
        else if (a === "html") yn(e.ownerDocument.documentElement);
        else if (a === "head") {
          ((a = e.ownerDocument.head), yn(a));
          for (var i = a.firstChild; i; ) {
            var c = i.nextSibling,
              u = i.nodeName;
            (i[ql] ||
              u === "SCRIPT" ||
              u === "STYLE" ||
              (u === "LINK" && i.rel.toLowerCase() === "stylesheet") ||
              a.removeChild(i),
              (i = c));
          }
        } else a === "body" && yn(e.ownerDocument.body);
      a = n;
    } while (a);
    Rl(t);
  }
  function Xf(e, t) {
    var a = e;
    e = 0;
    do {
      var l = a.nextSibling;
      if (
        (a.nodeType === 1
          ? t
            ? ((a._stashedDisplay = a.style.display),
              (a.style.display = "none"))
            : ((a.style.display = a._stashedDisplay || ""),
              a.getAttribute("style") === "" && a.removeAttribute("style"))
          : a.nodeType === 3 &&
            (t
              ? ((a._stashedText = a.nodeValue), (a.nodeValue = ""))
              : (a.nodeValue = a._stashedText || "")),
        l && l.nodeType === 8)
      )
        if (((a = l.data), a === "/$")) {
          if (e === 0) break;
          e--;
        } else (a !== "$" && a !== "$?" && a !== "$~" && a !== "$!") || e++;
      a = l;
    } while (a);
  }
  function Jc(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var a = t;
      switch (((t = t.nextSibling), a.nodeName)) {
        case "HTML":
        case "HEAD":
        case "BODY":
          (Jc(a), Is(a));
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (a.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(a);
    }
  }
  function A0(e, t, a, l) {
    for (; e.nodeType === 1; ) {
      var n = a;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!l && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
      } else if (l) {
        if (!e[ql])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (
                ((i = e.getAttribute("rel")),
                i === "stylesheet" && e.hasAttribute("data-precedence"))
              )
                break;
              if (
                i !== n.rel ||
                e.getAttribute("href") !==
                  (n.href == null || n.href === "" ? null : n.href) ||
                e.getAttribute("crossorigin") !==
                  (n.crossOrigin == null ? null : n.crossOrigin) ||
                e.getAttribute("title") !== (n.title == null ? null : n.title)
              )
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (
                ((i = e.getAttribute("src")),
                (i !== (n.src == null ? null : n.src) ||
                  e.getAttribute("type") !== (n.type == null ? null : n.type) ||
                  e.getAttribute("crossorigin") !==
                    (n.crossOrigin == null ? null : n.crossOrigin)) &&
                  i &&
                  e.hasAttribute("async") &&
                  !e.hasAttribute("itemprop"))
              )
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var i = n.name == null ? null : "" + n.name;
        if (n.type === "hidden" && e.getAttribute("name") === i) return e;
      } else return e;
      if (((e = Et(e.nextSibling)), e === null)) break;
    }
    return null;
  }
  function T0(e, t, a) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if (
        ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") &&
          !a) ||
        ((e = Et(e.nextSibling)), e === null)
      )
        return null;
    return e;
  }
  function Qf(e, t) {
    for (; e.nodeType !== 8; )
      if (
        ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") &&
          !t) ||
        ((e = Et(e.nextSibling)), e === null)
      )
        return null;
    return e;
  }
  function kc(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function $c(e) {
    return (
      e.data === "$!" ||
      (e.data === "$?" && e.ownerDocument.readyState !== "loading")
    );
  }
  function w0(e, t) {
    var a = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = t;
    else if (e.data !== "$?" || a.readyState !== "loading") t();
    else {
      var l = function () {
        (t(), a.removeEventListener("DOMContentLoaded", l));
      };
      (a.addEventListener("DOMContentLoaded", l), (e._reactRetry = l));
    }
  }
  function Et(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (
          ((t = e.data),
          t === "$" ||
            t === "$!" ||
            t === "$?" ||
            t === "$~" ||
            t === "&" ||
            t === "F!" ||
            t === "F")
        )
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return e;
  }
  var Fc = null;
  function Vf(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var a = e.data;
        if (a === "/$" || a === "/&") {
          if (t === 0) return Et(e.nextSibling);
          t--;
        } else
          (a !== "$" && a !== "$!" && a !== "$?" && a !== "$~" && a !== "&") ||
            t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function Kf(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var a = e.data;
        if (a === "$" || a === "$!" || a === "$?" || a === "$~" || a === "&") {
          if (t === 0) return e;
          t--;
        } else (a !== "/$" && a !== "/&") || t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function Jf(e, t, a) {
    switch (((t = Rs(a)), e)) {
      case "html":
        if (((e = t.documentElement), !e)) throw Error(r(452));
        return e;
      case "head":
        if (((e = t.head), !e)) throw Error(r(453));
        return e;
      case "body":
        if (((e = t.body), !e)) throw Error(r(454));
        return e;
      default:
        throw Error(r(451));
    }
  }
  function yn(e) {
    for (var t = e.attributes; t.length; ) e.removeAttributeNode(t[0]);
    Is(e);
  }
  var zt = new Map(),
    kf = new Set();
  function Os(e) {
    return typeof e.getRootNode == "function"
      ? e.getRootNode()
      : e.nodeType === 9
        ? e
        : e.ownerDocument;
  }
  var ta = q.d;
  q.d = { f: E0, r: z0, D: M0, C: R0, L: O0, m: C0, X: q0, S: D0, M: U0 };
  function E0() {
    var e = ta.f(),
      t = Ns();
    return e || t;
  }
  function z0(e) {
    var t = Fa(e);
    t !== null && t.tag === 5 && t.type === "form" ? ro(t) : ta.r(e);
  }
  var El = typeof document > "u" ? null : document;
  function $f(e, t, a) {
    var l = El;
    if (l && typeof t == "string" && t) {
      var n = bt(t);
      ((n = 'link[rel="' + e + '"][href="' + n + '"]'),
        typeof a == "string" && (n += '[crossorigin="' + a + '"]'),
        kf.has(n) ||
          (kf.add(n),
          (e = { rel: e, crossOrigin: a, href: t }),
          l.querySelector(n) === null &&
            ((t = l.createElement("link")),
            et(t, "link", e),
            Je(t),
            l.head.appendChild(t))));
    }
  }
  function M0(e) {
    (ta.D(e), $f("dns-prefetch", e, null));
  }
  function R0(e, t) {
    (ta.C(e, t), $f("preconnect", e, t));
  }
  function O0(e, t, a) {
    ta.L(e, t, a);
    var l = El;
    if (l && e && t) {
      var n = 'link[rel="preload"][as="' + bt(t) + '"]';
      t === "image" && a && a.imageSrcSet
        ? ((n += '[imagesrcset="' + bt(a.imageSrcSet) + '"]'),
          typeof a.imageSizes == "string" &&
            (n += '[imagesizes="' + bt(a.imageSizes) + '"]'))
        : (n += '[href="' + bt(e) + '"]');
      var i = n;
      switch (t) {
        case "style":
          i = zl(e);
          break;
        case "script":
          i = Ml(e);
      }
      zt.has(i) ||
        ((e = O(
          {
            rel: "preload",
            href: t === "image" && a && a.imageSrcSet ? void 0 : e,
            as: t,
          },
          a,
        )),
        zt.set(i, e),
        l.querySelector(n) !== null ||
          (t === "style" && l.querySelector(xn(i))) ||
          (t === "script" && l.querySelector(jn(i))) ||
          ((t = l.createElement("link")),
          et(t, "link", e),
          Je(t),
          l.head.appendChild(t)));
    }
  }
  function C0(e, t) {
    ta.m(e, t);
    var a = El;
    if (a && e) {
      var l = t && typeof t.as == "string" ? t.as : "script",
        n =
          'link[rel="modulepreload"][as="' + bt(l) + '"][href="' + bt(e) + '"]',
        i = n;
      switch (l) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          i = Ml(e);
      }
      if (
        !zt.has(i) &&
        ((e = O({ rel: "modulepreload", href: e }, t)),
        zt.set(i, e),
        a.querySelector(n) === null)
      ) {
        switch (l) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (a.querySelector(jn(i))) return;
        }
        ((l = a.createElement("link")),
          et(l, "link", e),
          Je(l),
          a.head.appendChild(l));
      }
    }
  }
  function D0(e, t, a) {
    ta.S(e, t, a);
    var l = El;
    if (l && e) {
      var n = Wa(l).hoistableStyles,
        i = zl(e);
      t = t || "default";
      var c = n.get(i);
      if (!c) {
        var u = { loading: 0, preload: null };
        if ((c = l.querySelector(xn(i)))) u.loading = 5;
        else {
          ((e = O({ rel: "stylesheet", href: e, "data-precedence": t }, a)),
            (a = zt.get(i)) && Wc(e, a));
          var o = (c = l.createElement("link"));
          (Je(o),
            et(o, "link", e),
            (o._p = new Promise(function (y, _) {
              ((o.onload = y), (o.onerror = _));
            })),
            o.addEventListener("load", function () {
              u.loading |= 1;
            }),
            o.addEventListener("error", function () {
              u.loading |= 2;
            }),
            (u.loading |= 4),
            Cs(c, t, l));
        }
        ((c = { type: "stylesheet", instance: c, count: 1, state: u }),
          n.set(i, c));
      }
    }
  }
  function q0(e, t) {
    ta.X(e, t);
    var a = El;
    if (a && e) {
      var l = Wa(a).hoistableScripts,
        n = Ml(e),
        i = l.get(n);
      i ||
        ((i = a.querySelector(jn(n))),
        i ||
          ((e = O({ src: e, async: !0 }, t)),
          (t = zt.get(n)) && Ic(e, t),
          (i = a.createElement("script")),
          Je(i),
          et(i, "link", e),
          a.head.appendChild(i)),
        (i = { type: "script", instance: i, count: 1, state: null }),
        l.set(n, i));
    }
  }
  function U0(e, t) {
    ta.M(e, t);
    var a = El;
    if (a && e) {
      var l = Wa(a).hoistableScripts,
        n = Ml(e),
        i = l.get(n);
      i ||
        ((i = a.querySelector(jn(n))),
        i ||
          ((e = O({ src: e, async: !0, type: "module" }, t)),
          (t = zt.get(n)) && Ic(e, t),
          (i = a.createElement("script")),
          Je(i),
          et(i, "link", e),
          a.head.appendChild(i)),
        (i = { type: "script", instance: i, count: 1, state: null }),
        l.set(n, i));
    }
  }
  function Ff(e, t, a, l) {
    var n = (n = ve.current) ? Os(n) : null;
    if (!n) throw Error(r(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof a.precedence == "string" && typeof a.href == "string"
          ? ((t = zl(a.href)),
            (a = Wa(n).hoistableStyles),
            (l = a.get(t)),
            l ||
              ((l = { type: "style", instance: null, count: 0, state: null }),
              a.set(t, l)),
            l)
          : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (
          a.rel === "stylesheet" &&
          typeof a.href == "string" &&
          typeof a.precedence == "string"
        ) {
          e = zl(a.href);
          var i = Wa(n).hoistableStyles,
            c = i.get(e);
          if (
            (c ||
              ((n = n.ownerDocument || n),
              (c = {
                type: "stylesheet",
                instance: null,
                count: 0,
                state: { loading: 0, preload: null },
              }),
              i.set(e, c),
              (i = n.querySelector(xn(e))) &&
                !i._p &&
                ((c.instance = i), (c.state.loading = 5)),
              zt.has(e) ||
                ((a = {
                  rel: "preload",
                  as: "style",
                  href: a.href,
                  crossOrigin: a.crossOrigin,
                  integrity: a.integrity,
                  media: a.media,
                  hrefLang: a.hrefLang,
                  referrerPolicy: a.referrerPolicy,
                }),
                zt.set(e, a),
                i || H0(n, e, a, c.state))),
            t && l === null)
          )
            throw Error(r(528, ""));
          return c;
        }
        if (t && l !== null) throw Error(r(529, ""));
        return null;
      case "script":
        return (
          (t = a.async),
          (a = a.src),
          typeof a == "string" &&
          t &&
          typeof t != "function" &&
          typeof t != "symbol"
            ? ((t = Ml(a)),
              (a = Wa(n).hoistableScripts),
              (l = a.get(t)),
              l ||
                ((l = {
                  type: "script",
                  instance: null,
                  count: 0,
                  state: null,
                }),
                a.set(t, l)),
              l)
            : { type: "void", instance: null, count: 0, state: null }
        );
      default:
        throw Error(r(444, e));
    }
  }
  function zl(e) {
    return 'href="' + bt(e) + '"';
  }
  function xn(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Wf(e) {
    return O({}, e, { "data-precedence": e.precedence, precedence: null });
  }
  function H0(e, t, a, l) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]")
      ? (l.loading = 1)
      : ((t = e.createElement("link")),
        (l.preload = t),
        t.addEventListener("load", function () {
          return (l.loading |= 1);
        }),
        t.addEventListener("error", function () {
          return (l.loading |= 2);
        }),
        et(t, "link", a),
        Je(t),
        e.head.appendChild(t));
  }
  function Ml(e) {
    return '[src="' + bt(e) + '"]';
  }
  function jn(e) {
    return "script[async]" + e;
  }
  function If(e, t, a) {
    if ((t.count++, t.instance === null))
      switch (t.type) {
        case "style":
          var l = e.querySelector('style[data-href~="' + bt(a.href) + '"]');
          if (l) return ((t.instance = l), Je(l), l);
          var n = O({}, a, {
            "data-href": a.href,
            "data-precedence": a.precedence,
            href: null,
            precedence: null,
          });
          return (
            (l = (e.ownerDocument || e).createElement("style")),
            Je(l),
            et(l, "style", n),
            Cs(l, a.precedence, e),
            (t.instance = l)
          );
        case "stylesheet":
          n = zl(a.href);
          var i = e.querySelector(xn(n));
          if (i) return ((t.state.loading |= 4), (t.instance = i), Je(i), i);
          ((l = Wf(a)),
            (n = zt.get(n)) && Wc(l, n),
            (i = (e.ownerDocument || e).createElement("link")),
            Je(i));
          var c = i;
          return (
            (c._p = new Promise(function (u, o) {
              ((c.onload = u), (c.onerror = o));
            })),
            et(i, "link", l),
            (t.state.loading |= 4),
            Cs(i, a.precedence, e),
            (t.instance = i)
          );
        case "script":
          return (
            (i = Ml(a.src)),
            (n = e.querySelector(jn(i)))
              ? ((t.instance = n), Je(n), n)
              : ((l = a),
                (n = zt.get(i)) && ((l = O({}, a)), Ic(l, n)),
                (e = e.ownerDocument || e),
                (n = e.createElement("script")),
                Je(n),
                et(n, "link", l),
                e.head.appendChild(n),
                (t.instance = n))
          );
        case "void":
          return null;
        default:
          throw Error(r(443, t.type));
      }
    else
      t.type === "stylesheet" &&
        (t.state.loading & 4) === 0 &&
        ((l = t.instance), (t.state.loading |= 4), Cs(l, a.precedence, e));
    return t.instance;
  }
  function Cs(e, t, a) {
    for (
      var l = a.querySelectorAll(
          'link[rel="stylesheet"][data-precedence],style[data-precedence]',
        ),
        n = l.length ? l[l.length - 1] : null,
        i = n,
        c = 0;
      c < l.length;
      c++
    ) {
      var u = l[c];
      if (u.dataset.precedence === t) i = u;
      else if (i !== n) break;
    }
    i
      ? i.parentNode.insertBefore(e, i.nextSibling)
      : ((t = a.nodeType === 9 ? a.head : a), t.insertBefore(e, t.firstChild));
  }
  function Wc(e, t) {
    (e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
      e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
      e.title == null && (e.title = t.title));
  }
  function Ic(e, t) {
    (e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
      e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
      e.integrity == null && (e.integrity = t.integrity));
  }
  var Ds = null;
  function Pf(e, t, a) {
    if (Ds === null) {
      var l = new Map(),
        n = (Ds = new Map());
      n.set(a, l);
    } else ((n = Ds), (l = n.get(a)), l || ((l = new Map()), n.set(a, l)));
    if (l.has(e)) return l;
    for (
      l.set(e, null), a = a.getElementsByTagName(e), n = 0;
      n < a.length;
      n++
    ) {
      var i = a[n];
      if (
        !(
          i[ql] ||
          i[Fe] ||
          (e === "link" && i.getAttribute("rel") === "stylesheet")
        ) &&
        i.namespaceURI !== "http://www.w3.org/2000/svg"
      ) {
        var c = i.getAttribute(t) || "";
        c = e + c;
        var u = l.get(c);
        u ? u.push(i) : l.set(c, [i]);
      }
    }
    return l;
  }
  function ed(e, t, a) {
    ((e = e.ownerDocument || e),
      e.head.insertBefore(
        a,
        t === "title" ? e.querySelector("head > title") : null,
      ));
  }
  function B0(e, t, a) {
    if (a === 1 || t.itemProp != null) return !1;
    switch (e) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (
          typeof t.precedence != "string" ||
          typeof t.href != "string" ||
          t.href === ""
        )
          break;
        return !0;
      case "link":
        if (
          typeof t.rel != "string" ||
          typeof t.href != "string" ||
          t.href === "" ||
          t.onLoad ||
          t.onError
        )
          break;
        switch (t.rel) {
          case "stylesheet":
            return (
              (e = t.disabled),
              typeof t.precedence == "string" && e == null
            );
          default:
            return !0;
        }
      case "script":
        if (
          t.async &&
          typeof t.async != "function" &&
          typeof t.async != "symbol" &&
          !t.onLoad &&
          !t.onError &&
          t.src &&
          typeof t.src == "string"
        )
          return !0;
    }
    return !1;
  }
  function td(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function Z0(e, t, a, l) {
    if (
      a.type === "stylesheet" &&
      (typeof l.media != "string" || matchMedia(l.media).matches !== !1) &&
      (a.state.loading & 4) === 0
    ) {
      if (a.instance === null) {
        var n = zl(l.href),
          i = t.querySelector(xn(n));
        if (i) {
          ((t = i._p),
            t !== null &&
              typeof t == "object" &&
              typeof t.then == "function" &&
              (e.count++, (e = qs.bind(e)), t.then(e, e)),
            (a.state.loading |= 4),
            (a.instance = i),
            Je(i));
          return;
        }
        ((i = t.ownerDocument || t),
          (l = Wf(l)),
          (n = zt.get(n)) && Wc(l, n),
          (i = i.createElement("link")),
          Je(i));
        var c = i;
        ((c._p = new Promise(function (u, o) {
          ((c.onload = u), (c.onerror = o));
        })),
          et(i, "link", l),
          (a.instance = i));
      }
      (e.stylesheets === null && (e.stylesheets = new Map()),
        e.stylesheets.set(a, t),
        (t = a.state.preload) &&
          (a.state.loading & 3) === 0 &&
          (e.count++,
          (a = qs.bind(e)),
          t.addEventListener("load", a),
          t.addEventListener("error", a)));
    }
  }
  var Pc = 0;
  function Y0(e, t) {
    return (
      e.stylesheets && e.count === 0 && Hs(e, e.stylesheets),
      0 < e.count || 0 < e.imgCount
        ? function (a) {
            var l = setTimeout(function () {
              if ((e.stylesheets && Hs(e, e.stylesheets), e.unsuspend)) {
                var i = e.unsuspend;
                ((e.unsuspend = null), i());
              }
            }, 6e4 + t);
            0 < e.imgBytes && Pc === 0 && (Pc = 62500 * j0());
            var n = setTimeout(
              function () {
                if (
                  ((e.waitingForImages = !1),
                  e.count === 0 &&
                    (e.stylesheets && Hs(e, e.stylesheets), e.unsuspend))
                ) {
                  var i = e.unsuspend;
                  ((e.unsuspend = null), i());
                }
              },
              (e.imgBytes > Pc ? 50 : 800) + t,
            );
            return (
              (e.unsuspend = a),
              function () {
                ((e.unsuspend = null), clearTimeout(l), clearTimeout(n));
              }
            );
          }
        : null
    );
  }
  function qs() {
    if (
      (this.count--,
      this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))
    ) {
      if (this.stylesheets) Hs(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        ((this.unsuspend = null), e());
      }
    }
  }
  var Us = null;
  function Hs(e, t) {
    ((e.stylesheets = null),
      e.unsuspend !== null &&
        (e.count++,
        (Us = new Map()),
        t.forEach(L0, e),
        (Us = null),
        qs.call(e)));
  }
  function L0(e, t) {
    if (!(t.state.loading & 4)) {
      var a = Us.get(e);
      if (a) var l = a.get(null);
      else {
        ((a = new Map()), Us.set(e, a));
        for (
          var n = e.querySelectorAll(
              "link[data-precedence],style[data-precedence]",
            ),
            i = 0;
          i < n.length;
          i++
        ) {
          var c = n[i];
          (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") &&
            (a.set(c.dataset.precedence, c), (l = c));
        }
        l && a.set(null, l);
      }
      ((n = t.instance),
        (c = n.getAttribute("data-precedence")),
        (i = a.get(c) || l),
        i === l && a.set(null, n),
        a.set(c, n),
        this.count++,
        (l = qs.bind(this)),
        n.addEventListener("load", l),
        n.addEventListener("error", l),
        i
          ? i.parentNode.insertBefore(n, i.nextSibling)
          : ((e = e.nodeType === 9 ? e.head : e),
            e.insertBefore(n, e.firstChild)),
        (t.state.loading |= 4));
    }
  }
  var bn = {
    $$typeof: Y,
    Provider: null,
    Consumer: null,
    _currentValue: W,
    _currentValue2: W,
    _threadCount: 0,
  };
  function G0(e, t, a, l, n, i, c, u, o) {
    ((this.tag = 1),
      (this.containerInfo = e),
      (this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode =
        this.next =
        this.pendingContext =
        this.context =
        this.cancelPendingCommit =
          null),
      (this.callbackPriority = 0),
      (this.expirationTimes = ks(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = ks(0)),
      (this.hiddenUpdates = ks(null)),
      (this.identifierPrefix = l),
      (this.onUncaughtError = n),
      (this.onCaughtError = i),
      (this.onRecoverableError = c),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = o),
      (this.incompleteTransitions = new Map()));
  }
  function ad(e, t, a, l, n, i, c, u, o, y, _, z) {
    return (
      (e = new G0(e, t, a, c, o, y, _, z, u)),
      (t = 1),
      i === !0 && (t |= 24),
      (i = mt(3, null, null, t)),
      (e.current = i),
      (i.stateNode = e),
      (t = Oi()),
      t.refCount++,
      (e.pooledCache = t),
      t.refCount++,
      (i.memoizedState = { element: l, isDehydrated: a, cache: t }),
      Ui(i),
      e
    );
  }
  function ld(e) {
    return e ? ((e = cl), e) : cl;
  }
  function nd(e, t, a, l, n, i) {
    ((n = ld(n)),
      l.context === null ? (l.context = n) : (l.pendingContext = n),
      (l = oa(t)),
      (l.payload = { element: a }),
      (i = i === void 0 ? null : i),
      i !== null && (l.callback = i),
      (a = fa(e, l, t)),
      a !== null && (rt(a, e, t), Il(a, e, t)));
  }
  function sd(e, t) {
    if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
      var a = e.retryLane;
      e.retryLane = a !== 0 && a < t ? a : t;
    }
  }
  function eu(e, t) {
    (sd(e, t), (e = e.alternate) && sd(e, t));
  }
  function id(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Da(e, 67108864);
      (t !== null && rt(t, e, 67108864), eu(e, 67108864));
    }
  }
  function cd(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = xt();
      t = $s(t);
      var a = Da(e, t);
      (a !== null && rt(a, e, t), eu(e, t));
    }
  }
  var Bs = !0;
  function X0(e, t, a, l) {
    var n = m.T;
    m.T = null;
    var i = q.p;
    try {
      ((q.p = 2), tu(e, t, a, l));
    } finally {
      ((q.p = i), (m.T = n));
    }
  }
  function Q0(e, t, a, l) {
    var n = m.T;
    m.T = null;
    var i = q.p;
    try {
      ((q.p = 8), tu(e, t, a, l));
    } finally {
      ((q.p = i), (m.T = n));
    }
  }
  function tu(e, t, a, l) {
    if (Bs) {
      var n = au(l);
      if (n === null) (Lc(e, t, l, Zs, a), rd(e, l));
      else if (K0(n, e, t, a, l)) l.stopPropagation();
      else if ((rd(e, l), t & 4 && -1 < V0.indexOf(e))) {
        for (; n !== null; ) {
          var i = Fa(n);
          if (i !== null)
            switch (i.tag) {
              case 3:
                if (((i = i.stateNode), i.current.memoizedState.isDehydrated)) {
                  var c = za(i.pendingLanes);
                  if (c !== 0) {
                    var u = i;
                    for (u.pendingLanes |= 2, u.entangledLanes |= 2; c; ) {
                      var o = 1 << (31 - dt(c));
                      ((u.entanglements[1] |= o), (c &= ~o));
                    }
                    (Ht(i), (Te & 6) === 0 && ((bs = ot() + 500), vn(0)));
                  }
                }
                break;
              case 31:
              case 13:
                ((u = Da(i, 2)), u !== null && rt(u, i, 2), Ns(), eu(i, 2));
            }
          if (((i = au(l)), i === null && Lc(e, t, l, Zs, a), i === n)) break;
          n = i;
        }
        n !== null && l.stopPropagation();
      } else Lc(e, t, l, null, a);
    }
  }
  function au(e) {
    return ((e = ni(e)), lu(e));
  }
  var Zs = null;
  function lu(e) {
    if (((Zs = null), (e = $a(e)), e !== null)) {
      var t = K(e);
      if (t === null) e = null;
      else {
        var a = t.tag;
        if (a === 13) {
          if (((e = T(t)), e !== null)) return e;
          e = null;
        } else if (a === 31) {
          if (((e = U(t)), e !== null)) return e;
          e = null;
        } else if (a === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return ((Zs = e), null);
  }
  function ud(e) {
    switch (e) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (Md()) {
          case mu:
            return 2;
          case vu:
            return 8;
          case En:
          case Rd:
            return 32;
          case pu:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var nu = !1,
    Sa = null,
    Na = null,
    _a = null,
    Sn = new Map(),
    Nn = new Map(),
    Aa = [],
    V0 =
      "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
        " ",
      );
  function rd(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Sa = null;
        break;
      case "dragenter":
      case "dragleave":
        Na = null;
        break;
      case "mouseover":
      case "mouseout":
        _a = null;
        break;
      case "pointerover":
      case "pointerout":
        Sn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Nn.delete(t.pointerId);
    }
  }
  function _n(e, t, a, l, n, i) {
    return e === null || e.nativeEvent !== i
      ? ((e = {
          blockedOn: t,
          domEventName: a,
          eventSystemFlags: l,
          nativeEvent: i,
          targetContainers: [n],
        }),
        t !== null && ((t = Fa(t)), t !== null && id(t)),
        e)
      : ((e.eventSystemFlags |= l),
        (t = e.targetContainers),
        n !== null && t.indexOf(n) === -1 && t.push(n),
        e);
  }
  function K0(e, t, a, l, n) {
    switch (t) {
      case "focusin":
        return ((Sa = _n(Sa, e, t, a, l, n)), !0);
      case "dragenter":
        return ((Na = _n(Na, e, t, a, l, n)), !0);
      case "mouseover":
        return ((_a = _n(_a, e, t, a, l, n)), !0);
      case "pointerover":
        var i = n.pointerId;
        return (Sn.set(i, _n(Sn.get(i) || null, e, t, a, l, n)), !0);
      case "gotpointercapture":
        return (
          (i = n.pointerId),
          Nn.set(i, _n(Nn.get(i) || null, e, t, a, l, n)),
          !0
        );
    }
    return !1;
  }
  function od(e) {
    var t = $a(e.target);
    if (t !== null) {
      var a = K(t);
      if (a !== null) {
        if (((t = a.tag), t === 13)) {
          if (((t = T(a)), t !== null)) {
            ((e.blockedOn = t),
              Su(e.priority, function () {
                cd(a);
              }));
            return;
          }
        } else if (t === 31) {
          if (((t = U(a)), t !== null)) {
            ((e.blockedOn = t),
              Su(e.priority, function () {
                cd(a);
              }));
            return;
          }
        } else if (t === 3 && a.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Ys(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var a = au(e.nativeEvent);
      if (a === null) {
        a = e.nativeEvent;
        var l = new a.constructor(a.type, a);
        ((li = l), a.target.dispatchEvent(l), (li = null));
      } else return ((t = Fa(a)), t !== null && id(t), (e.blockedOn = a), !1);
      t.shift();
    }
    return !0;
  }
  function fd(e, t, a) {
    Ys(e) && a.delete(t);
  }
  function J0() {
    ((nu = !1),
      Sa !== null && Ys(Sa) && (Sa = null),
      Na !== null && Ys(Na) && (Na = null),
      _a !== null && Ys(_a) && (_a = null),
      Sn.forEach(fd),
      Nn.forEach(fd));
  }
  function Ls(e, t) {
    e.blockedOn === t &&
      ((e.blockedOn = null),
      nu ||
        ((nu = !0),
        g.unstable_scheduleCallback(g.unstable_NormalPriority, J0)));
  }
  var Gs = null;
  function dd(e) {
    Gs !== e &&
      ((Gs = e),
      g.unstable_scheduleCallback(g.unstable_NormalPriority, function () {
        Gs === e && (Gs = null);
        for (var t = 0; t < e.length; t += 3) {
          var a = e[t],
            l = e[t + 1],
            n = e[t + 2];
          if (typeof l != "function") {
            if (lu(l || a) === null) continue;
            break;
          }
          var i = Fa(a);
          i !== null &&
            (e.splice(t, 3),
            (t -= 3),
            ac(i, { pending: !0, data: n, method: a.method, action: l }, l, n));
        }
      }));
  }
  function Rl(e) {
    function t(o) {
      return Ls(o, e);
    }
    (Sa !== null && Ls(Sa, e),
      Na !== null && Ls(Na, e),
      _a !== null && Ls(_a, e),
      Sn.forEach(t),
      Nn.forEach(t));
    for (var a = 0; a < Aa.length; a++) {
      var l = Aa[a];
      l.blockedOn === e && (l.blockedOn = null);
    }
    for (; 0 < Aa.length && ((a = Aa[0]), a.blockedOn === null); )
      (od(a), a.blockedOn === null && Aa.shift());
    if (((a = (e.ownerDocument || e).$$reactFormReplay), a != null))
      for (l = 0; l < a.length; l += 3) {
        var n = a[l],
          i = a[l + 1],
          c = n[lt] || null;
        if (typeof i == "function") c || dd(a);
        else if (c) {
          var u = null;
          if (i && i.hasAttribute("formAction")) {
            if (((n = i), (c = i[lt] || null))) u = c.formAction;
            else if (lu(n) !== null) continue;
          } else u = c.action;
          (typeof u == "function" ? (a[l + 1] = u) : (a.splice(l, 3), (l -= 3)),
            dd(a));
        }
      }
  }
  function hd() {
    function e(i) {
      i.canIntercept &&
        i.info === "react-transition" &&
        i.intercept({
          handler: function () {
            return new Promise(function (c) {
              return (n = c);
            });
          },
          focusReset: "manual",
          scroll: "manual",
        });
    }
    function t() {
      (n !== null && (n(), (n = null)), l || setTimeout(a, 20));
    }
    function a() {
      if (!l && !navigation.transition) {
        var i = navigation.currentEntry;
        i &&
          i.url != null &&
          navigation.navigate(i.url, {
            state: i.getState(),
            info: "react-transition",
            history: "replace",
          });
      }
    }
    if (typeof navigation == "object") {
      var l = !1,
        n = null;
      return (
        navigation.addEventListener("navigate", e),
        navigation.addEventListener("navigatesuccess", t),
        navigation.addEventListener("navigateerror", t),
        setTimeout(a, 100),
        function () {
          ((l = !0),
            navigation.removeEventListener("navigate", e),
            navigation.removeEventListener("navigatesuccess", t),
            navigation.removeEventListener("navigateerror", t),
            n !== null && (n(), (n = null)));
        }
      );
    }
  }
  function su(e) {
    this._internalRoot = e;
  }
  ((Xs.prototype.render = su.prototype.render =
    function (e) {
      var t = this._internalRoot;
      if (t === null) throw Error(r(409));
      var a = t.current,
        l = xt();
      nd(a, l, e, t, null, null);
    }),
    (Xs.prototype.unmount = su.prototype.unmount =
      function () {
        var e = this._internalRoot;
        if (e !== null) {
          this._internalRoot = null;
          var t = e.containerInfo;
          (nd(e.current, 2, null, e, null, null), Ns(), (t[ka] = null));
        }
      }));
  function Xs(e) {
    this._internalRoot = e;
  }
  Xs.prototype.unstable_scheduleHydration = function (e) {
    if (e) {
      var t = bu();
      e = { blockedOn: null, target: e, priority: t };
      for (var a = 0; a < Aa.length && t !== 0 && t < Aa[a].priority; a++);
      (Aa.splice(a, 0, e), a === 0 && od(e));
    }
  };
  var md = j.version;
  if (md !== "19.2.0") throw Error(r(527, md, "19.2.0"));
  q.findDOMNode = function (e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function"
        ? Error(r(188))
        : ((e = Object.keys(e).join(",")), Error(r(268, e)));
    return (
      (e = v(t)),
      (e = e !== null ? V(e) : null),
      (e = e === null ? null : e.stateNode),
      e
    );
  };
  var k0 = {
    bundleType: 0,
    version: "19.2.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: m,
    reconcilerVersion: "19.2.0",
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Qs = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Qs.isDisabled && Qs.supportsFiber)
      try {
        ((Ol = Qs.inject(k0)), (ft = Qs));
      } catch {}
  }
  return (
    (Tn.createRoot = function (e, t) {
      if (!Z(e)) throw Error(r(299));
      var a = !1,
        l = "",
        n = jo,
        i = bo,
        c = So;
      return (
        t != null &&
          (t.unstable_strictMode === !0 && (a = !0),
          t.identifierPrefix !== void 0 && (l = t.identifierPrefix),
          t.onUncaughtError !== void 0 && (n = t.onUncaughtError),
          t.onCaughtError !== void 0 && (i = t.onCaughtError),
          t.onRecoverableError !== void 0 && (c = t.onRecoverableError)),
        (t = ad(e, 1, !1, null, null, a, l, null, n, i, c, hd)),
        (e[ka] = t.current),
        Yc(e),
        new su(t)
      );
    }),
    (Tn.hydrateRoot = function (e, t, a) {
      if (!Z(e)) throw Error(r(299));
      var l = !1,
        n = "",
        i = jo,
        c = bo,
        u = So,
        o = null;
      return (
        a != null &&
          (a.unstable_strictMode === !0 && (l = !0),
          a.identifierPrefix !== void 0 && (n = a.identifierPrefix),
          a.onUncaughtError !== void 0 && (i = a.onUncaughtError),
          a.onCaughtError !== void 0 && (c = a.onCaughtError),
          a.onRecoverableError !== void 0 && (u = a.onRecoverableError),
          a.formState !== void 0 && (o = a.formState)),
        (t = ad(e, 1, !0, t, a ?? null, l, n, o, i, c, u, hd)),
        (t.context = ld(null)),
        (a = t.current),
        (l = xt()),
        (l = $s(l)),
        (n = oa(l)),
        (n.callback = null),
        fa(a, n, l),
        (a = l),
        (t.current.lanes = a),
        Dl(t, a),
        Ht(t),
        (e[ka] = t.current),
        Yc(e),
        new Xs(t)
      );
    }),
    (Tn.version = "19.2.0"),
    Tn
  );
}
var _d;
function sm() {
  if (_d) return uu.exports;
  _d = 1;
  function g() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(g);
      } catch (j) {
        console.error(j);
      }
  }
  return (g(), (uu.exports = nm()), uu.exports);
}
var im = sm();
const cm = Td(im);
function um({ onLogin: g, onSwitchToSignup: j }) {
  const [N, r] = R.useState({ email: "", password: "" }),
    [Z, K] = R.useState(!1),
    [T, U] = R.useState(""),
    [M, v] = R.useState(!1),
    [V, O] = R.useState(0);
  R.useEffect(() => {
    const ee = localStorage.getItem("business_login_attempts");
    ee && O(parseInt(ee));
  }, []);
  const G = (ee) => {
      r({ ...N, [ee.target.name]: ee.target.value });
    },
    L = async (ee) => {
      if ((ee.preventDefault(), !N.email || !N.password)) {
        U("Please enter both email and password");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(N.email)) {
        U("Please enter a valid email address");
        return;
      }
      if (V >= 5) {
        const ae = localStorage.getItem("last_business_login_attempt");
        if (ae && Date.now() - parseInt(ae) < 3e5) {
          U("Too many login attempts. Please try again in 5 minutes.");
          return;
        }
      }
      (K(!0), U(""));
      try {
        const ae = await fetch(
            "http://localhost/EatEase-Backend/backend/public/api/auth/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-App": "restaurant-app",
              },
              body: JSON.stringify(N),
            },
          ),
          Y = await ae.json();
        if (ae.status === 422 && Y.errors) {
          const X = Object.values(Y.errors)[0]?.[0];
          (U(X || "Validation failed"), le());
          return;
        }
        if (ae.status === 429) {
          U(Y.message || "Too many attempts. Please wait.");
          return;
        }
        if (Y.error === "wrong_app") {
          (alert(Y.message),
            Y.redirect_url && (window.location.href = Y.redirect_url));
          return;
        }
        if (ae.ok && Y.user && Y.token) {
          if (
            (localStorage.setItem("auth_token", Y.token),
            localStorage.setItem("user", JSON.stringify(Y.user)),
            Y.token_expires_at &&
              localStorage.setItem("token_expires_at", Y.token_expires_at),
            Y.user.user_type !== "restaurant_owner")
          ) {
            (alert("This is the Business App. Please use the Diner App."),
              localStorage.removeItem("auth_token"),
              localStorage.removeItem("user"),
              localStorage.removeItem("token_expires_at"),
              (window.location.href = "http://localhost:5176"));
            return;
          }
          (localStorage.removeItem("business_login_attempts"),
            localStorage.removeItem("last_business_login_attempt"),
            g(Y.user));
        } else (U(Y.message || "Invalid email or password"), le());
      } catch (ae) {
        (console.error("Business login error:", ae),
          U("Network error. Please check your connection."),
          le());
      } finally {
        K(!1);
      }
    },
    le = () => {
      const ee = V + 1;
      (O(ee),
        localStorage.setItem("business_login_attempts", ee.toString()),
        localStorage.setItem(
          "last_business_login_attempt",
          Date.now().toString(),
        ));
    },
    H = () => {
      v(!M);
    };
  return s.jsx("div", {
    className: "login",
    children: s.jsxs("div", {
      className: "login-container business-login",
      children: [
        s.jsx("div", {
          className: "login-header",
          children: s.jsx("h2", { children: "Sign In" }),
        }),
        V >= 3 &&
          s.jsx("div", {
            className: "security-warning",
            children: s.jsx("span", {
              children: "Multiple failed login attempts detected.",
            }),
          }),
        s.jsxs("form", {
          onSubmit: L,
          className: "secure-form",
          children: [
            s.jsxs("div", {
              className: "form-group",
              children: [
                s.jsx("label", {
                  htmlFor: "business-email",
                  children: "Email",
                }),
                s.jsx("input", {
                  type: "email",
                  id: "business-email",
                  name: "email",
                  value: N.email,
                  onChange: G,
                  placeholder: "Enter your business email",
                  required: !0,
                  autoComplete: "email",
                  className: T && !N.email ? "input-error" : "",
                }),
              ],
            }),
            s.jsxs("div", {
              className: "form-group",
              children: [
                s.jsx("label", {
                  htmlFor: "business-password",
                  children: "Password",
                }),
                s.jsxs("div", {
                  className: "password-input-wrapper",
                  children: [
                    s.jsx("input", {
                      type: M ? "text" : "password",
                      id: "business-password",
                      name: "password",
                      value: N.password,
                      onChange: G,
                      placeholder: "Enter your password",
                      required: !0,
                      autoComplete: "current-password",
                      className: T && !N.password ? "input-error" : "",
                    }),
                    s.jsx("button", {
                      type: "button",
                      className: "password-toggle",
                      onClick: H,
                      "aria-label": M ? "Hide password" : "Show password",
                      children: M
                        ? s.jsx("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            width: "16",
                            height: "16",
                            fill: "#666666",
                            viewBox: "0 0 256 256",
                            children: s.jsx("path", {
                              d: "M228,175a8,8,0,0,1-10.92-3l-19-33.2A123.23,123.23,0,0,1,162,155.46l5.87,35.22a8,8,0,0,1-6.58,9.21A8.4,8.4,0,0,1,160,200a8,8,0,0,1-7.88-6.69l-5.77-34.58a133.06,133.06,0,0,1-36.68,0l-5.77,34.58A8,8,0,0,1,96,200a8.4,8.4,0,0,1-1.32-.11,8,8,0,0,1-6.58-9.21L94,155.46a123.23,123.23,0,0,1-36.06-16.69L39,172A8,8,0,1,1,25.06,164l20-35a153.47,153.47,0,0,1-19.3-20A8,8,0,1,1,38.22,99c16.6,20.54,45.64,45,89.78,45s73.18-24.49,89.78-45A8,8,0,1,1,230.22,109a153.47,153.47,0,0,1-19.3,20l20,35A8,8,0,0,1,228,175Z",
                            }),
                          })
                        : s.jsx("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            width: "16",
                            height: "16",
                            fill: "#666666",
                            viewBox: "0 0 256 256",
                            children: s.jsx("path", {
                              d: "M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z",
                            }),
                          }),
                    }),
                  ],
                }),
              ],
            }),
            T &&
              s.jsx("div", {
                className: "error-message security-error",
                children: s.jsx("span", { children: T }),
              }),
            s.jsx("button", {
              type: "submit",
              disabled: Z,
              className: Z
                ? s.jsx("div", {
                    className: "loading-spinner-container",
                    children: s.jsx("div", { className: "loading-spinner" }),
                  })
                : "secure-button",
              children: Z
                ? s.jsx(s.Fragment, {
                    children: s.jsx("div", {
                      className: "loading-spinner-container",
                      children: s.jsx("div", { className: "loading-spinner" }),
                    }),
                  })
                : "Sign In",
            }),
          ],
        }),
        s.jsx("div", {
          className: "auth-switch",
          children: s.jsxs("p", {
            children: [
              "Don't have an account?",
              " ",
              s.jsx("button", {
                type: "button",
                onClick: j,
                children: "Sign Up",
              }),
            ],
          }),
        }),
      ],
    }),
  });
}
function rm({ onSignup: g, onSwitchToLogin: j }) {
  const [N, r] = R.useState({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    }),
    [Z, K] = R.useState(!1),
    [T, U] = R.useState(""),
    [M, v] = R.useState(!1),
    [V, O] = R.useState(!1),
    [G, L] = R.useState({ score: 0, message: "Very Weak", color: "#ff6b6b" }),
    le = (B) => {
      if (!B) return { score: 0, message: "Very Weak", color: "#ff6b6b" };
      let C = 0;
      return (
        B.length >= 12 ? (C += 2) : B.length >= 8 && (C += 1),
        /[a-z]/.test(B) && (C += 1),
        /[A-Z]/.test(B) && (C += 1),
        /[0-9]/.test(B) && (C += 1),
        /[@$!%*#?&]/.test(B) && (C += 1),
        C >= 5
          ? { score: C, message: "Strong", color: "#37b24d" }
          : C >= 3
            ? { score: C, message: "Good", color: "#51cf66" }
            : C >= 2
              ? { score: C, message: "Fair", color: "#fcc419" }
              : C >= 1
                ? { score: C, message: "Weak", color: "#ff922b" }
                : { score: C, message: "Very Weak", color: "#ff6b6b" }
      );
    };
  R.useEffect(() => {
    if (N.password) {
      const B = le(N.password);
      L(B);
    } else L({ score: 0, message: "Very Weak", color: "#ff6b6b" });
  }, [N.password]);
  const H = (B) => {
      r({ ...N, [B.target.name]: B.target.value });
    },
    ee = () =>
      N.name.length < 2
        ? (U("Name must be at least 2 characters"), !1)
        : N.name.length > 50
          ? (U("Name must not exceed 50 characters"), !1)
          : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(N.email)
            ? N.password.length < 8
              ? (U("Password must be at least 8 characters"), !1)
              : /(?=.*[a-z])/.test(N.password)
                ? /(?=.*[A-Z])/.test(N.password)
                  ? /(?=.*\d)/.test(N.password)
                    ? /(?=.*[@$!%*#?&])/.test(N.password)
                      ? [
                          "password",
                          "password123",
                          "123456",
                          "12345678",
                          "qwerty",
                          "abc123",
                          "letmein",
                          "monkey",
                          "admin",
                          "welcome",
                          "test123",
                        ].includes(N.password.toLowerCase())
                        ? (U(
                            "This password is too common. Please choose a stronger password.",
                          ),
                          !1)
                        : N.password !== N.password_confirmation
                          ? (U("Passwords do not match"), !1)
                          : !0
                      : (U(
                          "Password must contain at least one special character (@$!%*#?&)",
                        ),
                        !1)
                    : (U("Password must contain at least one number"), !1)
                  : (U("Password must contain at least one uppercase letter"),
                    !1)
                : (U("Password must contain at least one lowercase letter"), !1)
            : (U("Please enter a valid email address"), !1),
    me = async (B) => {
      if ((B.preventDefault(), U(""), !!ee())) {
        if (G.score < 2) {
          U(
            "Password is too weak for business account. Please use a stronger password.",
          );
          return;
        }
        K(!0);
        try {
          const C = { ...N, user_type: "restaurant_owner", is_admin: !1 },
            A = await fetch(
              "http://localhost/EatEase-Backend/backend/public/api/auth/signup",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  "X-Requested-App": "restaurant-app",
                },
                body: JSON.stringify(C),
              },
            ),
            D = await A.json();
          if (A.status === 422 && D.errors) {
            const k = Object.values(D.errors)[0]?.[0];
            U(k || "Validation failed");
            return;
          }
          if (A.ok && D.user && D.token) {
            if (D.user.user_type !== "restaurant_owner") {
              alert("Error: Account was not created as restaurant owner.");
              return;
            }
            (localStorage.setItem("auth_token", D.token),
              localStorage.setItem("user", JSON.stringify(D.user)),
              D.token_expires_at &&
                localStorage.setItem("token_expires_at", D.token_expires_at),
              g(D.user));
          } else U(D.message || "Signup failed");
        } catch (C) {
          (U("Network error. Please try again."),
            console.error("Business signup error:", C));
        } finally {
          K(!1);
        }
      }
    },
    ae = (B) => {
      B === "password" ? v(!M) : O(!V);
    },
    X = (() => {
      const B = N.password || "";
      return [
        { text: "At least 8 characters", met: B.length >= 8 },
        { text: "One lowercase letter", met: /[a-z]/.test(B) },
        { text: "One uppercase letter", met: /[A-Z]/.test(B) },
        { text: "One number", met: /\d/.test(B) },
        { text: "One special character", met: /[@$!%*#?&]/.test(B) },
      ];
    })();
  return s.jsx("div", {
    className: "signup",
    children: s.jsxs("div", {
      className: "signup-container business-signup",
      children: [
        s.jsx("div", {
          className: "signup-header",
          children: s.jsx("h2", { children: "Sign Up" }),
        }),
        s.jsxs("form", {
          onSubmit: me,
          className: "secure-signup-form",
          children: [
            s.jsxs("div", {
              className: "form-group",
              children: [
                s.jsx("label", { htmlFor: "business-name", children: "Name" }),
                s.jsx("input", {
                  type: "text",
                  id: "business-name",
                  name: "name",
                  value: N.name,
                  onChange: H,
                  placeholder: "Enter your full name",
                  required: !0,
                  minLength: "2",
                  maxLength: "50",
                  autoComplete: "name",
                }),
              ],
            }),
            s.jsxs("div", {
              className: "form-group",
              children: [
                s.jsx("label", {
                  htmlFor: "business-email",
                  children: "Email",
                }),
                s.jsx("input", {
                  type: "email",
                  id: "business-email",
                  name: "email",
                  value: N.email,
                  onChange: H,
                  placeholder: "Enter your email",
                  required: !0,
                  autoComplete: "email",
                }),
              ],
            }),
            s.jsxs("div", {
              className: "form-group",
              children: [
                s.jsx("label", {
                  htmlFor: "business-password",
                  children: "Password",
                }),
                s.jsxs("div", {
                  className: "password-input-wrapper",
                  children: [
                    s.jsx("input", {
                      type: M ? "text" : "password",
                      id: "business-password",
                      name: "password",
                      value: N.password,
                      onChange: H,
                      placeholder: "Create password",
                      required: !0,
                      minLength: "8",
                      autoComplete: "new-password",
                    }),
                    s.jsx("button", {
                      type: "button",
                      className: "password-toggle",
                      onClick: () => ae("password"),
                      "aria-label": M ? "Hide password" : "Show password",
                      children: M
                        ? s.jsx("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            width: "16",
                            height: "16",
                            fill: "#666666",
                            viewBox: "0 0 256 256",
                            children: s.jsx("path", {
                              d: "M228,175a8,8,0,0,1-10.92-3l-19-33.2A123.23,123.23,0,0,1,162,155.46l5.87,35.22a8,8,0,0,1-6.58,9.21A8.4,8.4,0,0,1,160,200a8,8,0,0,1-7.88-6.69l-5.77-34.58a133.06,133.06,0,0,1-36.68,0l-5.77,34.58A8,8,0,0,1,96,200a8.4,8.4,0,0,1-1.32-.11,8,8,0,0,1-6.58-9.21L94,155.46a123.23,123.23,0,0,1-36.06-16.69L39,172A8,8,0,1,1,25.06,164l20-35a153.47,153.47,0,0,1-19.3-20A8,8,0,1,1,38.22,99c16.6,20.54,45.64,45,89.78,45s73.18-24.49,89.78-45A8,8,0,1,1,230.22,109a153.47,153.47,0,0,1-19.3,20l20,35A8,8,0,0,1,228,175Z",
                            }),
                          })
                        : s.jsx("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            width: "16",
                            height: "16",
                            fill: "#666666",
                            viewBox: "0 0 256 256",
                            children: s.jsx("path", {
                              d: "M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z",
                            }),
                          }),
                    }),
                  ],
                }),
                N.password &&
                  s.jsxs("div", {
                    className: "password-strength-meter",
                    children: [
                      s.jsx("div", {
                        className: "strength-bar",
                        children: s.jsx("div", {
                          className: "strength-fill",
                          style: {
                            width: `${G.score * 20}%`,
                            backgroundColor: G.color,
                          },
                        }),
                      }),
                      s.jsx("div", {
                        className: "strength-info",
                        children: s.jsxs("span", {
                          style: { color: G.color },
                          children: ["Strength: ", G.message],
                        }),
                      }),
                      s.jsx("div", {
                        className: "password-requirements-list",
                        children: X.map((B, C) =>
                          s.jsxs(
                            "div",
                            {
                              className: `requirement ${B.met ? "met" : "not-met"}`,
                              children: [B.met ? "✓" : "○", " ", B.text],
                            },
                            C,
                          ),
                        ),
                      }),
                    ],
                  }),
              ],
            }),
            s.jsxs("div", {
              className: "form-group",
              children: [
                s.jsx("label", {
                  htmlFor: "confirm-business-password",
                  children: "Confirm Password",
                }),
                s.jsxs("div", {
                  className: "password-input-wrapper",
                  children: [
                    s.jsx("input", {
                      type: V ? "text" : "password",
                      id: "confirm-business-password",
                      name: "password_confirmation",
                      value: N.password_confirmation,
                      onChange: H,
                      placeholder: "Confirm password",
                      required: !0,
                      autoComplete: "new-password",
                    }),
                    s.jsx("button", {
                      type: "button",
                      className: "password-toggle",
                      onClick: () => ae("confirm"),
                      "aria-label": V ? "Hide password" : "Show password",
                      children: V
                        ? s.jsx("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            width: "16",
                            height: "16",
                            fill: "#666666",
                            viewBox: "0 0 256 256",
                            children: s.jsx("path", {
                              d: "M228,175a8,8,0,0,1-10.92-3l-19-33.2A123.23,123.23,0,0,1,162,155.46l5.87,35.22a8,8,0,0,1-6.58,9.21A8.4,8.4,0,0,1,160,200a8,8,0,0,1-7.88-6.69l-5.77-34.58a133.06,133.06,0,0,1-36.68,0l-5.77,34.58A8,8,0,0,1,96,200a8.4,8.4,0,0,1-1.32-.11,8,8,0,0,1-6.58-9.21L94,155.46a123.23,123.23,0,0,1-36.06-16.69L39,172A8,8,0,1,1,25.06,164l20-35a153.47,153.47,0,0,1-19.3-20A8,8,0,1,1,38.22,99c16.6,20.54,45.64,45,89.78,45s73.18-24.49,89.78-45A8,8,0,1,1,230.22,109a153.47,153.47,0,0,1-19.3,20l20,35A8,8,0,0,1,228,175Z",
                            }),
                          })
                        : s.jsx("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            width: "16",
                            height: "16",
                            fill: "#666666",
                            viewBox: "0 0 256 256",
                            children: s.jsx("path", {
                              d: "M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z",
                            }),
                          }),
                    }),
                  ],
                }),
                N.password_confirmation &&
                  N.password !== N.password_confirmation &&
                  s.jsxs("div", {
                    className: "password-match-error",
                    children: [
                      s.jsx("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        width: "12",
                        height: "12",
                        fill: "#ff6b6b",
                        viewBox: "0 0 256 256",
                        style: { marginRight: "4px" },
                        children: s.jsx("path", {
                          d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z",
                        }),
                      }),
                      "Passwords do not match",
                    ],
                  }),
              ],
            }),
            T &&
              s.jsx("div", {
                className: "error-message security-error",
                children: s.jsx("span", { children: T }),
              }),
            s.jsx("button", {
              type: "submit",
              disabled: Z,
              className: Z
                ? "loading-spinner"
                : "secure-button business-button",
              children: Z
                ? s.jsx(s.Fragment, {
                    children: s.jsx("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "12",
                      height: "12",
                      fill: "#ffffff",
                      viewBox: "0 0 256 256",
                      className: "spinner",
                      children: s.jsx("path", {
                        d: "M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm37.25,58.75a8,8,0,0,0,5.66-2.35l22.63-22.62a8,8,0,0,0-11.32-11.32L167.6,77.09a8,8,0,0,0,5.65,13.66ZM224,120H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z",
                      }),
                    }),
                  })
                : "Create Account",
            }),
          ],
        }),
        s.jsx("div", {
          className: "auth-switch",
          children: s.jsxs("p", {
            children: [
              "Already have an account?",
              " ",
              s.jsx("button", {
                type: "button",
                onClick: j,
                children: "Sign In",
              }),
            ],
          }),
        }),
      ],
    }),
  });
}
function om({ restaurant: g, onRequestSubmitted: j, onClose: N }) {
  const [r, Z] = R.useState(""),
    [K, T] = R.useState(!1),
    [U, M] = R.useState(""),
    [v, V] = R.useState(!1),
    O = async (G) => {
      if ((G.preventDefault(), r.length < 50)) {
        M(
          "Please provide at least 50 characters explaining why your restaurant should be verified",
        );
        return;
      }
      if (r.length > 1e3) {
        M("Request must be less than 1000 characters");
        return;
      }
      (T(!0), M(""));
      const L = localStorage.getItem("auth_token");
      try {
        const H = await (
          await fetch(
            "http://localhost:8000/api/restaurant/request-verification",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${L}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({ verification_request: r }),
            },
          )
        ).json();
        H.success
          ? (V(!0),
            j && j(),
            setTimeout(() => {
              N && N();
            }, 2e3))
          : M(H.message || "Failed to submit request");
      } catch (le) {
        (console.error("Verification request error:", le),
          M("Network error. Please try again."));
      } finally {
        T(!1);
      }
    };
  return v
    ? s.jsxs("div", {
        className: "verification-request success-modal",
        children: [
          s.jsx("div", { className: "success-icon", children: " " }),
          s.jsx("h3", { children: "Verification Request Submitted!" }),
          s.jsx("p", {
            children:
              "Your request has been sent to our admin team for review.",
          }),
          s.jsx("p", {
            children: "You'll be notified once your restaurant is verified.",
          }),
          s.jsx("button", { onClick: N, children: "Close" }),
        ],
      })
    : s.jsxs("div", {
        className: "verification-request",
        children: [
          s.jsxs("div", {
            className: "verification-header",
            children: [
              s.jsx("h2", { children: "Be Verified Now" }),
              s.jsx("button", {
                className: "close-btn",
                onClick: N,
                children: "×",
              }),
            ],
          }),
          s.jsx("div", {
            className: "verification-benefits",
            children: s.jsxs("ul", {
              children: [
                s.jsxs("li", {
                  children: [
                    s.jsx("strong", { children: "Trust Badge" }),
                    " - Builds customer confidence",
                  ],
                }),
                s.jsxs("li", {
                  children: [
                    s.jsx("strong", { children: "Priority Listing" }),
                    " - Higher in search results",
                  ],
                }),
                s.jsxs("li", {
                  children: [
                    s.jsx("strong", { children: "Official Status" }),
                    " - Verified by EatEase team",
                  ],
                }),
                s.jsxs("li", {
                  children: [
                    s.jsx("strong", { children: "Increased Visibility" }),
                    " - More customer trust",
                  ],
                }),
              ],
            }),
          }),
          s.jsxs("form", {
            onSubmit: O,
            children: [
              s.jsxs("div", {
                className: "form-group",
                children: [
                  s.jsx("label", {
                    htmlFor: "verificationRequest",
                    children: s.jsx("strong", {
                      children: "Why should your restaurant be verified?",
                    }),
                  }),
                  s.jsxs("p", {
                    className: "instruction",
                    children: [
                      "Please explain why customers should trust your restaurant. Include details about:",
                      s.jsx("br", {}),
                      "• Your restaurant's history and reputation",
                      s.jsx("br", {}),
                      "• Food safety standards",
                      s.jsx("br", {}),
                      "• Customer service commitment",
                      s.jsx("br", {}),
                      "• Any certifications or awards",
                    ],
                  }),
                  s.jsx("textarea", {
                    id: "verificationRequest",
                    value: r,
                    onChange: (G) => Z(G.target.value),
                    rows: "6",
                    minLength: "1",
                    maxLength: "1000",
                    required: !0,
                    placeholder:
                      "Describe why your restaurant deserves verification",
                  }),
                ],
              }),
              U && s.jsx("div", { className: "error-message", children: U }),
              s.jsxs("div", {
                className: "form-actions",
                children: [
                  s.jsx("button", {
                    type: "button",
                    onClick: N,
                    disabled: K,
                    children: "Cancel",
                  }),
                  s.jsx("button", {
                    type: "submit",
                    disabled: K || r.length < 1 || r.length > 1e3,
                    className: "submit-btn",
                    children: K
                      ? "Submitting..."
                      : "Submit Verification Request",
                  }),
                ],
              }),
            ],
          }),
        ],
      });
}
const Ad = ({
    restaurant: g,
    onEdit: j,
    onUpdateOccupancy: N,
    tier: r,
    handleUpgrade: Z,
  }) => {
    const [K, T] = R.useState(!1),
      [U, M] = R.useState(g.current_occupancy),
      [v, V] = R.useState(!1),
      [O, G] = R.useState(null),
      [L, le] = R.useState(null),
      [H, ee] = R.useState(null);
    R.useEffect(() => {
      if (g && g.subscription_tier === "premium" && g.subscription_ends_at) {
        const A = new Date(g.subscription_ends_at),
          D = A.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
        le(D);
        const P = A - new Date(),
          ce = Math.ceil(P / (1e3 * 60 * 60 * 24));
        (ee(ce), ce <= 0 ? G("expired") : ce <= 7 ? G("warning") : G("active"));
      } else (G(null), le(null), ee(null));
    }, [g]);
    const me = async () => {
        try {
          const A = localStorage.getItem("auth_token"),
            k = await (
              await fetch(
                "http://localhost:8000/api/restaurant/renew-premium",
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${A}`,
                    "Content-Type": "application/json",
                  },
                },
              )
            ).json();
          k.success
            ? (alert(`  Premium renewed! New expiry: ${k.expires_at}`),
              window.location.reload && window.location.reload())
            : alert("Renewal failed: " + k.message);
        } catch (A) {
          (console.error("Renewal error:", A),
            alert("Error renewing subscription"));
        }
      },
      ae = async () => {
        if (U < 0 || U > g.max_capacity) {
          alert(`Occupancy must be between 0 and ${g.max_capacity}`);
          return;
        }
        V(!0);
        try {
          const A = localStorage.getItem("auth_token"),
            D = await fetch(
              "http://localhost/EatEase-Backend/backend/public/api/restaurant/occupancy",
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${A}`,
                  Accept: "application/json",
                },
                body: JSON.stringify({ current_occupancy: Number(U) }),
              },
            ),
            k = await D.json();
          D.ok
            ? (alert("  Occupancy updated successfully!"), T(!1), N && N(U))
            : alert(
                "Failed to update occupancy: " + (k.message || "Unknown error"),
              );
        } catch (A) {
          (console.error("Error updating occupancy:", A),
            alert("Error updating occupancy. Please try again."));
        } finally {
          V(!1);
        }
      },
      Y = (A) => {
        switch (A) {
          case "green":
            return "Low";
          case "yellow":
            return "Moderate";
          case "orange":
            return "Busy";
          case "red":
            return "Very High";
          default:
            return "Unknown";
        }
      },
      X = (A) =>
        A <= 50 ? "green" : A <= 79 ? "yellow" : A <= 89 ? "orange" : "red",
      B =
        g.max_capacity > 0
          ? Math.round((g.current_occupancy / g.max_capacity) * 100)
          : 0,
      C = X(B);
    return s.jsxs("div", {
      className: "owner-overview-tab",
      children: [
        s.jsxs("div", {
          className: "tab-section",
          children: [
            s.jsx("div", {
              className: "section-header",
              children: s.jsx("h3", { children: "Tier Level" }),
            }),
            s.jsx("div", {
              className: "tier-display",
              children:
                r === "basic"
                  ? s.jsxs("div", {
                      className: "basic-tier-display",
                      children: [
                        s.jsxs("div", {
                          className: "tier-info-row",
                          children: [
                            s.jsx("span", {
                              className: "tier-badge basic",
                              children: "Free Tier",
                            }),
                            s.jsxs("p", {
                              className: "tier-description",
                              children: [
                                "• Manual updates only",
                                s.jsx("br", {}),
                                "• Cannot apply for featured status",
                                s.jsx("br", {}),
                                "• No customer analytics",
                                s.jsx("br", {}),
                                "• Not eligible to be advertised",
                              ],
                            }),
                          ],
                        }),
                        s.jsx("button", {
                          className: "tier-upgrade-btn",
                          onClick: Z,
                          children: "Upgrade to Premium",
                        }),
                      ],
                    })
                  : s.jsx("div", {
                      className: "premium-tier-display",
                      children: s.jsxs("div", {
                        className: "premium-tier-info",
                        children: [
                          s.jsx("span", {
                            className: "tier-badge premium",
                            children: "Premium",
                          }),
                          L &&
                            s.jsxs("div", {
                              className: `premium-expiry-display ${O}`,
                              children: [
                                s.jsxs("div", {
                                  className: "expiry-row",
                                  children: [
                                    s.jsx("span", {
                                      className: "expiry-label",
                                      children: "Subscription ends on:",
                                    }),
                                    s.jsx("span", {
                                      className: "expiry-date",
                                      children: L,
                                    }),
                                  ],
                                }),
                                H !== null &&
                                  s.jsx("div", {
                                    className: "expiry-details",
                                    children:
                                      H > 0
                                        ? s.jsxs(s.Fragment, {
                                            children: [
                                              s.jsxs("span", {
                                                className: `days-left ${O}`,
                                                children: [
                                                  H,
                                                  " ",
                                                  H === 1 ? "day" : "days",
                                                  " left",
                                                ],
                                              }),
                                              H <= 7 &&
                                                H > 0 &&
                                                s.jsxs("button", {
                                                  className: "renew-now-btn",
                                                  onClick: () => {
                                                    window.confirm(`Renew your premium subscription for 30 days?

You'll keep all premium features for another month.`) && me();
                                                  },
                                                  children: [
                                                    s.jsx("svg", {
                                                      xmlns:
                                                        "http://www.w3.org/2000/svg",
                                                      width: "12",
                                                      height: "12",
                                                      viewBox: "0 -960 960 960",
                                                      fill: "currentColor",
                                                      children: s.jsx("path", {
                                                        d: "M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z",
                                                      }),
                                                    }),
                                                    "Renew Now",
                                                  ],
                                                }),
                                            ],
                                          })
                                        : s.jsxs(s.Fragment, {
                                            children: [
                                              s.jsx("span", {
                                                className: "days-left expired",
                                                children: "Expired",
                                              }),
                                              s.jsxs("button", {
                                                className: "renew-now-btn",
                                                onClick: () => {
                                                  window.confirm(
                                                    "Your premium subscription has expired. Renew for 30 days to restore premium features?",
                                                  ) && me();
                                                },
                                                children: [
                                                  s.jsx("svg", {
                                                    xmlns:
                                                      "http://www.w3.org/2000/svg",
                                                    width: "12",
                                                    height: "12",
                                                    viewBox: "0 -960 960 960",
                                                    fill: "currentColor",
                                                    children: s.jsx("path", {
                                                      d: "M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z",
                                                    }),
                                                  }),
                                                  "Renew Subscription",
                                                ],
                                              }),
                                            ],
                                          }),
                                  }),
                              ],
                            }),
                        ],
                      }),
                    }),
            }),
            s.jsxs("div", {
              className: "section-header",
              children: [
                s.jsx("h3", { children: "Location & Contact" }),
                s.jsx("button", {
                  className: "section-edit-btn",
                  onClick: j,
                  children: s.jsx("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    height: "17px",
                    viewBox: "0 -960 960 960",
                    width: "17px",
                    fill: "black",
                    children: s.jsx("path", {
                      d: "M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z",
                    }),
                  }),
                }),
              ],
            }),
            s.jsxs("div", {
              className: "info-grid",
              children: [
                s.jsxs("div", {
                  className: "info-section",
                  children: [
                    s.jsx("div", {
                      className: "section-title",
                      children: s.jsxs("h3", {
                        className: "section-title",
                        id: "section-title-location",
                        children: [
                          s.jsx("svg", {
                            className: "location-icon",
                            width: "20",
                            height: "20",
                            viewBox: "0 -960 960 960",
                            fill: "black",
                            "aria-hidden": "true",
                            children: s.jsx("path", {
                              d: "M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z",
                            }),
                          }),
                          "Location:",
                        ],
                      }),
                    }),
                    s.jsx("p", {
                      className: "section-content",
                      children: g.address,
                    }),
                  ],
                }),
                s.jsxs("div", {
                  className: "info-section",
                  children: [
                    s.jsxs("h3", {
                      className: "section-title",
                      children: [
                        s.jsx("svg", {
                          width: "20",
                          height: "20",
                          viewBox: "0 -960 960 960",
                          fill: "black",
                          "aria-hidden": "true",
                          children: s.jsx("path", {
                            d: "M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z",
                          }),
                        }),
                        "Contact:",
                      ],
                    }),
                    s.jsx("p", {
                      className: "section-content",
                      children: g.phone || "Not provided",
                    }),
                  ],
                }),
                s.jsxs("div", {
                  className: "info-section",
                  children: [
                    s.jsxs("h3", {
                      className: "section-title",
                      children: [
                        s.jsx("svg", {
                          width: "20",
                          height: "20",
                          viewBox: "0 -960 960 960",
                          fill: "black",
                          "aria-hidden": "true",
                          children: s.jsx("path", {
                            d: "m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z",
                          }),
                        }),
                        "Operating Hours:",
                      ],
                    }),
                    s.jsx("p", {
                      className: "section-content",
                      children: g.hours || "Not specified",
                    }),
                  ],
                }),
                s.jsxs("div", {
                  className: "info-section",
                  children: [
                    s.jsxs("h3", {
                      className: "section-title",
                      children: [
                        s.jsx("svg", {
                          width: "20",
                          height: "20",
                          viewBox: "0 -960 960 960",
                          fill: "black",
                          "aria-hidden": "true",
                          children: s.jsx("path", {
                            d: "m175-120-56-56 410-410q-18-42-5-95t57-95q53-53 118-62t106 32q41 41 32 106t-62 118q-42 44-95 57t-95-5l-50 50 304 304-56 56-304-302-304 302Zm118-342L173-582q-54-54-54-129t54-129l248 250-128 128Z",
                          }),
                        }),
                        "Cuisine:",
                      ],
                    }),
                    s.jsx("p", {
                      className: "section-content",
                      children: g.cuisine_type || "Not specified",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        s.jsxs("div", {
          className: "tab-section",
          children: [
            s.jsxs("div", {
              className: "section-header",
              children: [
                s.jsx("h3", { children: "Features & Amenities" }),
                s.jsx("button", {
                  className: "section-edit-btn",
                  onClick: j,
                  children: s.jsx("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    height: "17px",
                    viewBox: "0 -960 960 960",
                    width: "17px",
                    fill: "black",
                    children: s.jsx("path", {
                      d: "M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z",
                    }),
                  }),
                }),
              ],
            }),
            g.features && g.features.length > 0
              ? s.jsx("div", {
                  className: "overview-features-list",
                  children: g.features.map((A, D) =>
                    s.jsx("span", { className: "feature-tag", children: A }, D),
                  ),
                })
              : s.jsx("p", {
                  className: "no-features",
                  children: "No features added yet.",
                }),
          ],
        }),
        s.jsxs("div", {
          className: "tab-section",
          children: [
            s.jsxs("div", {
              className: "section-header",
              children: [
                s.jsx("h3", { children: "Current Status" }),
                s.jsx("div", {
                  className: "status-header-actions",
                  children: K
                    ? s.jsxs("div", {
                        className: "occupancy-edit-controls",
                        children: [
                          s.jsx("input", {
                            type: "number",
                            value: U,
                            onChange: (A) => M(A.target.value),
                            min: "0",
                            max: g.max_capacity,
                            className: "occupancy-input",
                            placeholder: "Enter current occupancy",
                          }),
                          s.jsx("button", {
                            className: "status-save-btn",
                            onClick: ae,
                            disabled: v,
                            children: v ? "Saving..." : "Save",
                          }),
                          s.jsx("button", {
                            className: "status-cancel-btn",
                            onClick: () => {
                              (T(!1), M(g.current_occupancy));
                            },
                            disabled: v,
                            children: "Cancel",
                          }),
                        ],
                      })
                    : s.jsxs("button", {
                        className: "update-occupancy-btn",
                        onClick: () => T(!0),
                        children: [
                          s.jsx("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            height: "11px",
                            viewBox: "0 -960 960 960",
                            width: "11px",
                            fill: "white",
                            children: s.jsx("path", {
                              d: "M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z",
                            }),
                          }),
                          "Update",
                        ],
                      }),
                }),
              ],
            }),
            s.jsxs("div", {
              className: "status-info",
              children: [
                s.jsxs("div", {
                  className: "status-item",
                  children: [
                    s.jsx("span", {
                      className: "status-label",
                      children: "Current Crowd:",
                    }),
                    s.jsxs("span", {
                      className: `status-value status-${C}`,
                      children: [
                        Y(C),
                        C !== g.crowd_status &&
                          s.jsxs("span", {
                            className: "status-note",
                            children: [
                              " ",
                              "(Calculated: ",
                              Y(g.crowd_status),
                              " in DB)",
                            ],
                          }),
                      ],
                    }),
                  ],
                }),
                s.jsxs("div", {
                  className: "status-item",
                  children: [
                    s.jsx("span", {
                      className: "status-label",
                      children: "Capacity:",
                    }),
                    s.jsxs("span", {
                      className: "status-value",
                      children: [
                        g.current_occupancy,
                        "/",
                        g.max_capacity,
                        " people",
                      ],
                    }),
                  ],
                }),
                s.jsxs("div", {
                  className: "status-item",
                  children: [
                    s.jsx("span", {
                      className: "status-label",
                      children: "Occupancy:",
                    }),
                    s.jsxs("span", {
                      className: "status-value",
                      children: [B, "%"],
                    }),
                  ],
                }),
                s.jsxs("div", {
                  className: "status-visual",
                  children: [
                    s.jsx("div", {
                      className: "capacity-bar",
                      children: s.jsx("div", {
                        className: "capacity-fill",
                        style: {
                          width: `${Math.min(B, 100)}%`,
                          backgroundColor: X(B),
                        },
                      }),
                    }),
                    s.jsxs("div", {
                      className: "capacity-labels",
                      children: [
                        s.jsx("span", { children: "0" }),
                        s.jsx("span", { children: "25%" }),
                        s.jsx("span", { children: "50%" }),
                        s.jsx("span", { children: "75%" }),
                        s.jsx("span", { children: "100%" }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  },
  fm = ({ restaurantId: g }) => {
    const [j, N] = R.useState([]),
      [r, Z] = R.useState(!1),
      [K, T] = R.useState(""),
      [U, M] = R.useState(!1),
      [v, V] = R.useState({ name: "", price: "" });
    R.useEffect(() => {
      O();
    }, [g]);
    const O = async () => {
        try {
          const X = localStorage.getItem("auth_token"),
            C = await (
              await fetch(
                `http://localhost/EatEase/backend/public/api/restaurants/${g}/menu-text`,
                {
                  headers: {
                    Authorization: `Bearer ${X}`,
                    Accept: "application/json",
                  },
                },
              )
            ).json();
          if (C.success) {
            const A = C.menu_description || C.menu_text || "";
            if (A) {
              const D = G(A);
              N(D);
            } else N([]);
          }
        } catch (X) {
          console.error("Error fetching menu:", X);
        }
      },
      G = (X) => {
        const B = [];
        return (
          X.split(
            `
`,
          )
            .filter((A) => A.trim())
            .forEach((A) => {
              const D = A.trim();
              if (D.includes(" - $")) {
                const k = D.split(" - $");
                k.length === 2 &&
                  B.push({
                    name: k[0].trim(),
                    price: k[1].trim(),
                    id: Date.now() + Math.random(),
                  });
              }
            }),
          B
        );
      },
      L = (X) =>
        X.length === 0
          ? ""
          : X.map((B) => `${B.name} - $${B.price}`).join(`
`),
      le = async () => {
        if (!H()) return;
        (Z(!0), T(""));
        const X = localStorage.getItem("auth_token");
        try {
          const B = L(j),
            A = await (
              await fetch(
                `http://localhost/EatEase/backend/public/api/restaurants/${g}/menu-text`,
                {
                  method: "PUT",
                  headers: {
                    Authorization: `Bearer ${X}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ menu_description: B }),
                },
              )
            ).json();
          A.success
            ? (T("Menu saved successfully!"),
              M(!1),
              setTimeout(() => T(""), 3e3))
            : T("Failed to save menu: " + (A.message || "Unknown error"));
        } catch (B) {
          (console.error("Error saving menu:", B), T("Error saving menu"));
        } finally {
          Z(!1);
        }
      },
      H = () => {
        for (const X of j) {
          if (!X.name.trim())
            return (T("Please enter a name for all menu items"), !1);
          if (
            !X.price ||
            isNaN(parseFloat(X.price)) ||
            parseFloat(X.price) <= 0
          )
            return (
              T("Please enter a valid price (positive number) for all items"),
              !1
            );
        }
        return !0;
      },
      ee = () => {
        if (!v.name.trim()) {
          T("Please enter an item name");
          return;
        }
        if (
          !v.price ||
          isNaN(parseFloat(v.price)) ||
          parseFloat(v.price) <= 0
        ) {
          T("Please enter a valid price (positive number)");
          return;
        }
        (N([
          ...j,
          {
            ...v,
            id: Date.now() + Math.random(),
            price: parseFloat(v.price).toFixed(2),
          },
        ]),
          V({ name: "", price: "" }),
          T(""));
      },
      me = (X, B, C) => {
        N(j.map((A) => (A.id === X ? { ...A, [B]: C } : A)));
      },
      ae = (X) => {
        N(j.filter((B) => B.id !== X));
      },
      Y = (X, B) => {
        const C = X.replace(/[^0-9.]/g, ""),
          A = C.split(".");
        A.length > 2 ? B(A[0] + "." + A.slice(1).join("")) : B(C);
      };
    return s.jsxs("div", {
      className: "owner-menu-tab",
      children: [
        s.jsxs("div", {
          className: "menu-header",
          children: [
            s.jsx("h3", { children: "Restaurant Menu" }),
            s.jsx("div", {
              className: "owner-menu-actions",
              children: U
                ? s.jsxs(s.Fragment, {
                    children: [
                      s.jsx("button", {
                        onClick: le,
                        disabled: r,
                        className: "save-btn",
                        children: r ? "Saving..." : "Save Menu",
                      }),
                      s.jsx("button", {
                        onClick: () => {
                          (M(!1), O());
                        },
                        className: "menu-cancel-btn",
                        children: s.jsx("svg", {
                          xmlns: "http://www.w3.org/2000/svg",
                          width: "11",
                          height: "18",
                          fill: "white",
                          viewBox: "0 0 256 256",
                          children: s.jsx("path", {
                            d: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z",
                          }),
                        }),
                      }),
                    ],
                  })
                : s.jsxs("button", {
                    onClick: () => M(!0),
                    className: "edit-btn",
                    children: [
                      s.jsx("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        height: "12px",
                        viewBox: "0 -960 960 960",
                        width: "12px",
                        fill: "White",
                        children: s.jsx("path", {
                          d: "M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z",
                        }),
                      }),
                      "Edit Menu",
                    ],
                  }),
            }),
          ],
        }),
        K &&
          s.jsx("div", {
            className: `message ${K.includes("successfully") ? "success" : "error"}`,
            children: K,
          }),
        s.jsx("div", {
          className: "menu-content",
          children: U
            ? s.jsxs("div", {
                className: "menu-edit-container",
                children: [
                  s.jsxs("div", {
                    className: "add-item-form",
                    children: [
                      s.jsx("h4", { children: "Add New Menu Item" }),
                      s.jsxs("div", {
                        className: "form-row",
                        children: [
                          s.jsxs("div", {
                            className: "form-group",
                            children: [
                              s.jsx("label", { children: "Item Name" }),
                              s.jsx("input", {
                                type: "text",
                                value: v.name,
                                onChange: (X) =>
                                  V({ ...v, name: X.target.value }),
                                placeholder: "Name",
                                className: "item-name-input",
                              }),
                            ],
                          }),
                          s.jsxs("div", {
                            className: "form-group",
                            children: [
                              s.jsx("label", { children: "Price" }),
                              s.jsx("input", {
                                type: "text",
                                value: v.price,
                                onChange: (X) =>
                                  Y(X.target.value, (B) =>
                                    V({ ...v, price: B }),
                                  ),
                                placeholder: "Price",
                                className: "item-price-input",
                              }),
                            ],
                          }),
                          s.jsxs("button", {
                            onClick: ee,
                            className: "add-item-btn",
                            children: [
                              s.jsx("svg", {
                                width: "13",
                                height: "13",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                children: s.jsx("path", {
                                  strokeLinecap: "round",
                                  strokeLinejoin: "round",
                                  strokeWidth: "2",
                                  d: "M12 4v16m8-8H4",
                                }),
                              }),
                              "Add Item",
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  s.jsxs("div", {
                    className: "menu-items-list",
                    children: [
                      s.jsx("h4", { children: "Menu Items" }),
                      j.length === 0
                        ? s.jsx("p", {
                            className: "no-items",
                            children: "No menu items yet. Add some above!",
                          })
                        : s.jsxs("div", {
                            className: "items-table",
                            children: [
                              s.jsxs("div", {
                                className: "table-header",
                                children: [
                                  s.jsx("div", {
                                    className: "header-name",
                                    children: "Item Name",
                                  }),
                                  s.jsx("div", {
                                    className: "header-price",
                                    children: "Price",
                                  }),
                                  s.jsx("div", {
                                    className: "header-actions",
                                    children: "Actions",
                                  }),
                                ],
                              }),
                              j.map((X) =>
                                s.jsxs(
                                  "div",
                                  {
                                    className: "item-row",
                                    children: [
                                      s.jsx("div", {
                                        className: "item-cell item-name-cell",
                                        children: s.jsx("input", {
                                          type: "text",
                                          value: X.name,
                                          onChange: (B) =>
                                            me(X.id, "name", B.target.value),
                                          className: "item-input",
                                          placeholder: "Item name",
                                        }),
                                      }),
                                      s.jsx("div", {
                                        className: "item-cell item-price-cell",
                                        children: s.jsx("div", {
                                          className: "price-input-wrapper",
                                          children: s.jsx("input", {
                                            type: "text",
                                            value: X.price,
                                            onChange: (B) =>
                                              Y(B.target.value, (C) =>
                                                me(X.id, "price", C),
                                              ),
                                            className: "price-input",
                                            placeholder: "0.00",
                                          }),
                                        }),
                                      }),
                                      s.jsx("div", {
                                        className:
                                          "item-cell item-actions-cell",
                                        children: s.jsx("button", {
                                          onClick: () => ae(X.id),
                                          className: "remove-item-btn",
                                          title: "Remove item",
                                          children: s.jsx("svg", {
                                            width: "12",
                                            height: "16",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            children: s.jsx("path", {
                                              strokeLinecap: "round",
                                              strokeLinejoin: "round",
                                              strokeWidth: "2",
                                              d: "M6 18L18 6M6 6l12 12",
                                            }),
                                          }),
                                        }),
                                      }),
                                    ],
                                  },
                                  X.id,
                                ),
                              ),
                            ],
                          }),
                    ],
                  }),
                ],
              })
            : s.jsx("div", {
                className: "menu-display",
                children:
                  j.length > 0
                    ? s.jsxs("div", {
                        className: "menu-preview",
                        children: [
                          s.jsx("h4", { children: "Menu Preview" }),
                          s.jsxs("div", {
                            className: "preview-table",
                            children: [
                              s.jsxs("div", {
                                className: "preview-header",
                                children: [
                                  s.jsx("div", {
                                    className: "preview-header-name",
                                    children: "Menu Item",
                                  }),
                                  s.jsx("div", {
                                    className: "preview-header-price",
                                    children: "Price",
                                  }),
                                ],
                              }),
                              j.map((X, B) =>
                                s.jsxs(
                                  "div",
                                  {
                                    className: "preview-row",
                                    children: [
                                      s.jsx("div", {
                                        className: "preview-name",
                                        children: X.name,
                                      }),
                                      s.jsxs("div", {
                                        className: "preview-price",
                                        children: ["₱", X.price],
                                      }),
                                    ],
                                  },
                                  B,
                                ),
                              ),
                            ],
                          }),
                        ],
                      })
                    : s.jsx("div", {
                        className: "empty-menu",
                        children: s.jsx("p", {
                          children: "No menu items added yet.",
                        }),
                      }),
              }),
        }),
      ],
    });
  },
  dm = ({ restaurantId: g, restaurantName: j }) => {
    const [N, r] = R.useState([]),
      [Z, K] = R.useState(0),
      [T, U] = R.useState(0),
      [M, v] = R.useState(!0),
      [V, O] = R.useState(null),
      [G, L] = R.useState(""),
      [le, H] = R.useState({
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        recentReviews: 0,
        averageRating: 0,
      }),
      [ee, me] = R.useState("all");
    R.useEffect(() => {
      (console.log("OwnerReviewsTab: Loading reviews for restaurant", g), ae());
    }, [g]);
    const ae = async () => {
        v(!0);
        try {
          const k = await (
            await fetch(`http://localhost:8000/api/restaurants/${g}/reviews`)
          ).json();
          if ((console.log("Owner reviews API response:", k), k.success)) {
            (r(k.reviews || []),
              K(k.average_rating || 0),
              U(k.total_reviews || 0));
            const P = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            (k.reviews || []).forEach((Se) => {
              P[Se.rating] = (P[Se.rating] || 0) + 1;
            });
            const ce = (k.reviews || []).filter((Se) => {
              const He = new Date(Se.created_at),
                J = new Date();
              return (J.setMonth(J.getMonth() - 1), He >= J);
            }).length;
            H({
              ratingDistribution: P,
              recentReviews: ce,
              averageRating: k.average_rating || 0,
            });
          } else r([]);
        } catch (D) {
          (console.error("Error fetching reviews:", D), r([]));
        } finally {
          v(!1);
        }
      },
      Y = async (D) => {
        (console.log("Sending response to review:", D, G),
          alert("Response sent! (Backend integration needed)"),
          O(null),
          L(""));
      },
      X = async (D) => {
        if (
          !confirm(
            "Are you sure you want to delete this review? This cannot be undone.",
          )
        )
          return;
        const k = localStorage.getItem("auth_token");
        try {
          const ce = await (
            await fetch(`http://localhost:8000/api/reviews/${D}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${k}`,
                Accept: "application/json",
              },
            })
          ).json();
          ce.success
            ? (await ae(), alert("Review deleted successfully"))
            : alert(ce.error || "Failed to delete review");
        } catch (P) {
          (console.error("Error deleting review:", P),
            alert("Error deleting review"));
        }
      },
      B = () => {
        let D = [...N];
        return (
          ee !== "all" &&
            ee !== "recent" &&
            (D = D.filter((k) => k.rating === parseInt(ee))),
          ee === "recent" &&
            D.sort((k, P) => new Date(P.created_at) - new Date(k.created_at)),
          D
        );
      },
      C = () =>
        s.jsx("div", {
          className: "rating-distribution",
          children: [5, 4, 3, 2, 1].map((D) => {
            const k = le.ratingDistribution[D] || 0,
              P = T ? (k / T) * 100 : 0;
            return s.jsxs(
              "div",
              {
                className: "distribution-row",
                children: [
                  s.jsxs("span", {
                    className: "stars-label",
                    children: [D, " ★"],
                  }),
                  s.jsx("div", {
                    className: "percentage-bar",
                    children: s.jsx("div", {
                      className: "bar-fill",
                      style: { width: `${P}%` },
                    }),
                  }),
                  s.jsxs("span", {
                    className: "percentage-value",
                    children: [P.toFixed(0), "%"],
                  }),
                  s.jsxs("span", {
                    className: "count-value",
                    children: ["(", k, ")"],
                  }),
                ],
              },
              D,
            );
          }),
        }),
      A = B();
    return M
      ? s.jsx("div", {
          className: "loading-spinner-container",
          children: s.jsx("div", { className: "loading-spinner" }),
        })
      : s.jsxs("div", {
          className: "owner-reviews-tab",
          children: [
            s.jsxs("div", {
              className: "owner-reviews-header",
              children: [
                s.jsx("h2", { children: "Reviews" }),
                s.jsxs("div", {
                  className: "quick-stats",
                  children: [
                    s.jsxs("div", {
                      className: "stat-item",
                      children: [
                        s.jsx("div", {
                          className: "stat-value",
                          children: Z.toFixed(1),
                        }),
                        s.jsx("div", {
                          className: "stat-label",
                          children: "Average Rating",
                        }),
                      ],
                    }),
                    s.jsx("div", { className: "stat-divider" }),
                    s.jsxs("div", {
                      className: "stat-item",
                      children: [
                        s.jsx("div", { className: "stat-value", children: T }),
                        s.jsx("div", {
                          className: "stat-label",
                          children: "Total Reviews",
                        }),
                      ],
                    }),
                    s.jsx("div", { className: "stat-divider" }),
                    s.jsxs("div", {
                      className: "stat-item",
                      children: [
                        s.jsx("div", {
                          className: "stat-value",
                          children: le.recentReviews,
                        }),
                        s.jsx("div", {
                          className: "stat-label",
                          children: "Recent (30 days)",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            s.jsxs("div", {
              className: "reviews-dashboard",
              children: [
                s.jsx("div", {
                  className: "dashboard-left",
                  children: s.jsxs("div", {
                    className: "distribution-card",
                    children: [s.jsx("h4", { children: "Rating" }), C()],
                  }),
                }),
                s.jsxs("div", {
                  className: "dashboard-right",
                  children: [
                    s.jsxs("div", {
                      className: "reviews-list-header",
                      children: [
                        s.jsxs("h3", {
                          children: [
                            ee === "all"
                              ? "All Reviews"
                              : ee === "recent"
                                ? "Recent Reviews"
                                : ee === "5"
                                  ? "5-Star Reviews"
                                  : ee === "1"
                                    ? "1-Star Reviews"
                                    : `${ee}-Star Reviews`,
                            "(",
                            A.length,
                            ")",
                          ],
                        }),
                        s.jsx("button", {
                          onClick: ae,
                          className: "refresh-btn",
                          disabled: M,
                          children: s.jsx("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            height: "24px",
                            viewBox: "0 -960 960 960",
                            width: "24px",
                            fill: "black",
                            children: s.jsx("path", {
                              d: "M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z",
                            }),
                          }),
                        }),
                      ],
                    }),
                    A.length === 0
                      ? s.jsxs("div", {
                          className: "reviews-tab-empty-state",
                          children: [
                            s.jsx("h4", { children: "No Reviews Yet" }),
                            s.jsx("p", {
                              children: "Be Featured to get more customers",
                            }),
                            s.jsx("button", {
                              className: "reset-filter-btn",
                              onClick: () => me("all"),
                              children: s.jsx("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                height: "24px",
                                viewBox: "0 -960 960 960",
                                width: "24px",
                                fill: "black ",
                                children: s.jsx("path", {
                                  d: "M480-360 280-560h400L480-360Z",
                                }),
                              }),
                            }),
                          ],
                        })
                      : s.jsx("div", {
                          className: "reviews-list",
                          children: A.map((D) =>
                            s.jsxs(
                              "div",
                              {
                                className: "review-card",
                                children: [
                                  s.jsxs("div", {
                                    className: "review-header",
                                    children: [
                                      s.jsxs("div", {
                                        className: "reviewer-info",
                                        children: [
                                          s.jsx("div", {
                                            className: "reviewer-avatar",
                                            children:
                                              D.user?.name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "C",
                                          }),
                                          s.jsxs("div", {
                                            className: "reviewer-details",
                                            children: [
                                              s.jsx("span", {
                                                className: "reviewer-name",
                                                children:
                                                  D.user?.name ||
                                                  "Anonymous Customer",
                                              }),
                                              s.jsx("span", {
                                                className: "review-date",
                                                children: new Date(
                                                  D.created_at,
                                                ).toLocaleDateString(),
                                              }),
                                              s.jsx("span", {
                                                className: "review-time",
                                                children: new Date(
                                                  D.created_at,
                                                ).toLocaleTimeString([], {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                }),
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      s.jsx("div", {
                                        className: "review-rating-section",
                                        children: s.jsx("button", {
                                          onClick: () => X(D.id),
                                          className: "delete-review-btn",
                                          title: "Delete this review",
                                          children: "Delete",
                                        }),
                                      }),
                                    ],
                                  }),
                                  D.comment &&
                                    s.jsx("div", {
                                      className: "review-content",
                                      children: s.jsx("p", {
                                        className: "review-comment",
                                        children: D.comment,
                                      }),
                                    }),
                                  D.images &&
                                    D.images.length > 0 &&
                                    s.jsx("div", {
                                      className: "review-images",
                                      children: D.images
                                        .slice(0, 3)
                                        .map((k, P) =>
                                          s.jsx(
                                            "div",
                                            {
                                              className: "review-image",
                                              children: s.jsx("img", {
                                                src: k,
                                                alt: `Review ${P + 1}`,
                                              }),
                                            },
                                            P,
                                          ),
                                        ),
                                    }),
                                  D.response
                                    ? s.jsxs("div", {
                                        className: "owner-response",
                                        children: [
                                          s.jsxs("div", {
                                            className: "response-header",
                                            children: [
                                              s.jsx("strong", {
                                                children: "Your Response:",
                                              }),
                                              s.jsx("span", {
                                                className: "response-date",
                                                children: new Date(
                                                  D.response.created_at,
                                                ).toLocaleDateString(),
                                              }),
                                            ],
                                          }),
                                          s.jsx("p", {
                                            className: "response-text",
                                            children: D.response.text,
                                          }),
                                          s.jsx("button", {
                                            className: "edit-response-btn",
                                            onClick: () => {
                                              (O(D.id), L(D.response.text));
                                            },
                                            children: "Edit Response",
                                          }),
                                        ],
                                      })
                                    : V === D.id
                                      ? s.jsxs("div", {
                                          className: "response-form",
                                          children: [
                                            s.jsx("strong", {
                                              children: "Write a Response:",
                                            }),
                                            s.jsx("textarea", {
                                              value: G,
                                              onChange: (k) =>
                                                L(k.target.value),
                                              rows: "3",
                                            }),
                                            s.jsxs("div", {
                                              className: "response-actions",
                                              children: [
                                                s.jsx("button", {
                                                  onClick: () => O(null),
                                                  className: "cancel-btn",
                                                  children: "Cancel",
                                                }),
                                                s.jsx("button", {
                                                  onClick: () => Y(D.id),
                                                  disabled: !G.trim(),
                                                  className: "send-btn",
                                                  children: "Send Reply",
                                                }),
                                              ],
                                            }),
                                          ],
                                        })
                                      : s.jsx("button", {
                                          className: "respond-btn",
                                          onClick: () => {
                                            (O(D.id), L(""));
                                          },
                                          children: "Reply",
                                        }),
                                ],
                              },
                              D.id,
                            ),
                          ),
                        }),
                  ],
                }),
              ],
            }),
          ],
        });
  },
  hm = ({ restaurant: g }) => {
    const j = g?.id,
      [N, r] = R.useState([]),
      [Z, K] = R.useState(!0),
      [T, U] = R.useState(!1),
      [M, v] = R.useState([]),
      [V, O] = R.useState(!1),
      [G, L] = R.useState({}),
      [le, H] = R.useState(null),
      ee = R.useRef(null);
    R.useEffect(() => {
      (console.log("OwnerPhotosTab mounted with restaurant:", g),
        console.log("Extracted restaurantId:", j),
        j
          ? (console.log("Fetching photos for restaurantId:", j), me())
          : (console.error("No restaurantId provided to OwnerPhotosTab"),
            H("No restaurant selected"),
            K(!1)));
    }, [j]);
    const me = async () => {
        try {
          H(null);
          const C = localStorage.getItem("auth_token");
          console.log("Fetching photos with token:", C ? "exists" : "missing");
          const A = await fetch(
            `http://127.0.0.1:8000/api/restaurant/${j}/photos`,
            {
              headers: {
                Authorization: `Bearer ${C}`,
                Accept: "application/json",
              },
            },
          );
          if ((console.log("Photos API response status:", A.status), A.ok)) {
            const D = await A.json();
            (console.log("Photos API response data:", D),
              r(Array.isArray(D) ? D : []));
          } else {
            const D = await A.text();
            (console.error("Photos API error:", A.status, D),
              H(`Failed to load photos: ${A.status}`),
              r([]));
          }
        } catch (C) {
          (console.error("Error fetching photos:", C),
            H("Network error loading photos"),
            r([]));
        } finally {
          K(!1);
        }
      },
      ae = (C) => {
        const A = Array.from(C.target.files);
        if (A.length === 0) return;
        const D = A.filter((k) => {
          const ce = [
              "image/jpeg",
              "image/png",
              "image/gif",
              "image/webp",
            ].includes(k.type),
            Se = k.size <= 5 * 1024 * 1024;
          return ce
            ? Se
              ? !0
              : (alert(`${k.name} is too large (max 5MB)`), !1)
            : (alert(
                `${k.name} is not a valid image type (JPEG, PNG, GIF, WebP allowed)`,
              ),
              !1);
        });
        if (D.length > 0) {
          (v(D), O(!0));
          const k = {};
          (D.forEach((P, ce) => {
            k[ce] = "";
          }),
            L(k));
        }
        ee.current && (ee.current.value = "");
      },
      Y = async () => {
        if (M.length === 0) return;
        U(!0);
        const C = new FormData();
        (M.forEach((A, D) => {
          (C.append("photos[]", A), G[D] && C.append("captions[]", G[D]));
        }),
          console.log("FormData entries:"));
        for (let A of C.entries()) console.log(A[0], A[1]);
        try {
          const A = localStorage.getItem("auth_token");
          (console.log(
            "Sending request to:",
            `http://127.0.0.1:8000/api/restaurant/${j}/photos`,
          ),
            console.log("Token exists:", !!A));
          const D = await fetch(
            `http://127.0.0.1:8000/api/restaurant/${j}/photos`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${A}`,
                Accept: "application/json",
              },
              body: C,
            },
          );
          console.log("Response status:", D.status);
          const k = await D.json();
          (console.log("Response data:", k),
            k.success
              ? (alert(k.message), O(!1), v([]), L({}), me())
              : alert(k.message || "Upload failed"));
        } catch (A) {
          (console.error("Upload error:", A), alert("Error uploading photos"));
        } finally {
          U(!1);
        }
      },
      X = async (C) => {
        try {
          const A = localStorage.getItem("auth_token"),
            k = await (
              await fetch(
                `http://localhost/EatEase/backend/public/api/restaurant/${j}/photos/${C}/primary`,
                {
                  method: "PUT",
                  headers: {
                    Authorization: `Bearer ${A}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                },
              )
            ).json();
          k.success
            ? (r((P) => P.map((ce) => ({ ...ce, is_primary: ce.id === C }))),
              alert("Primary photo updated!"))
            : alert(k.message || "Failed to set primary");
        } catch (A) {
          (console.error("Set primary error:", A),
            alert("Error setting primary photo"));
        }
      },
      B = async (C) => {
        if (window.confirm("Are you sure you want to delete this photo?"))
          try {
            const A = localStorage.getItem("auth_token"),
              k = await (
                await fetch(
                  `http://localhost/EatEase/backend/public/api/restaurant/${j}/photos/${C}`,
                  {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${A}`,
                      Accept: "application/json",
                    },
                  },
                )
              ).json();
            k.success
              ? (r((P) => P.filter((ce) => ce.id !== C)),
                alert("Photo deleted!"))
              : alert(k.message || "Failed to delete");
          } catch (A) {
            (console.error("Delete error:", A), alert("Error deleting photo"));
          }
      };
    return j
      ? Z
        ? s.jsx("div", {
            className: "owner-photos-tab loading",
            children: s.jsx("div", { className: "loading-spinner" }),
          })
        : le
          ? s.jsx("div", {
              className: "owner-photos-tab error",
              children: s.jsxs("div", {
                className: "error-message",
                children: [
                  s.jsx("h3", { children: "Error" }),
                  s.jsx("p", { children: le }),
                  s.jsx("button", {
                    onClick: me,
                    className: "retry-btn",
                    children: "Try Again",
                  }),
                ],
              }),
            })
          : s.jsxs("div", {
              className: "owner-photos-tab",
              children: [
                s.jsxs("div", {
                  className: "tab-header",
                  children: [
                    s.jsx("div", {
                      className: "header-left",
                      children: s.jsx("h3", { children: "Restaurant Photos" }),
                    }),
                    s.jsxs("div", {
                      className: "header-right",
                      children: [
                        s.jsxs("label", {
                          htmlFor: "photo-upload",
                          className: "upload-btn primary-btn",
                          children: [
                            s.jsx("svg", {
                              xmlns: "http://www.w3.org/2000/svg",
                              height: "11px",
                              viewBox: "0 -960 960 960",
                              width: "11px",
                              fill: "white",
                              children: s.jsx("path", {
                                d: "M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z",
                              }),
                            }),
                            "Upload",
                          ],
                        }),
                        s.jsx("input", {
                          id: "photo-upload",
                          ref: ee,
                          type: "file",
                          multiple: !0,
                          accept: "image/*",
                          onChange: ae,
                          style: { display: "none" },
                        }),
                      ],
                    }),
                  ],
                }),
                N.length === 0
                  ? s.jsxs("div", {
                      className: "photos-empty-state",
                      children: [
                        s.jsx("div", {
                          className: "empty-icon",
                          children: s.jsx("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            width: "60",
                            height: "60",
                            fill: "#ccc",
                            viewBox: "0 0 256 256",
                            children: s.jsx("path", {
                              d: "M228,160v40a20,20,0,0,1-20,20H48a20,20,0,0,1-20-20V56A20,20,0,0,1,48,36h80a4,4,0,0,1,0,8H48a12,12,0,0,0-12,12V164.81A36,36,0,0,1,48,148H208a36,36,0,0,1,36,36v12a4,4,0,0,1-8,0V184a28,28,0,0,0-28-28H48a28,28,0,0,0-28,28v36a12,12,0,0,0,12,12H208a12,12,0,0,0,12-12V160a4,4,0,0,1,8,0ZM92,112a12,12,0,1,0-12-12A12,12,0,0,0,92,112Zm116-76h40a4,4,0,0,1,4,4V92a4,4,0,0,1-8,0V48.49l-50.83,50.83a4,4,0,0,1-5.66-5.66L238.51,42H200a4,4,0,0,1,0-8Z",
                            }),
                          }),
                        }),
                        s.jsx("h4", { children: "No Photos Yet" }),
                        s.jsx("p", {
                          children: "Upload photos to showcase your restaurant",
                        }),
                      ],
                    })
                  : s.jsx("div", {
                      className: "photos-grid",
                      children: N.map((C) =>
                        s.jsxs(
                          "div",
                          {
                            className: "photo-card",
                            children: [
                              s.jsxs("div", {
                                className: "photo-container",
                                children: [
                                  s.jsx("img", {
                                    src: C.full_image_url,
                                    alt: C.caption || "Restaurant photo",
                                    loading: "lazy",
                                  }),
                                  C.is_primary &&
                                    s.jsx("div", {
                                      className: "primary-badge",
                                      children: s.jsx("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        width: "12",
                                        height: "12",
                                        fill: "black",
                                        viewBox: "0 0 256 256",
                                        children: s.jsx("path", {
                                          d: "M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z",
                                        }),
                                      }),
                                    }),
                                ],
                              }),
                              s.jsx("div", {
                                className: "photo-info",
                                children: s.jsxs("div", {
                                  className: "photo-actions",
                                  children: [
                                    s.jsx("button", {
                                      className: `set-primary-btn ${C.is_primary ? "is-primary" : ""}`,
                                      onClick: () => X(C.id),
                                      disabled: C.is_primary,
                                      children: C.is_primary
                                        ? "Primary"
                                        : "Set Primary",
                                    }),
                                    s.jsx("button", {
                                      className: "delete-btn",
                                      onClick: () => B(C.id),
                                      children: s.jsx("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        width: "15",
                                        height: "15",
                                        fill: "white",
                                        viewBox: "0 0 256 256",
                                        children: s.jsx("path", {
                                          d: "M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z",
                                        }),
                                      }),
                                    }),
                                  ],
                                }),
                              }),
                            ],
                          },
                          C.id,
                        ),
                      ),
                    }),
                V &&
                  s.jsx("div", {
                    className: "upload-modal-overlay",
                    children: s.jsxs("div", {
                      className: "upload-modal",
                      children: [
                        s.jsxs("div", {
                          className: "photos-modal-header",
                          children: [
                            s.jsxs("h3", {
                              children: [
                                "Upload Photos (",
                                M.length,
                                " selected)",
                              ],
                            }),
                            s.jsx("button", {
                              className: "close-btn",
                              onClick: () => {
                                (O(!1), v([]));
                              },
                              children: "×",
                            }),
                          ],
                        }),
                        s.jsxs("div", {
                          className: "photos-modal-content",
                          children: [
                            s.jsx("div", {
                              className: "selected-files",
                              children: M.map((C, A) =>
                                s.jsxs(
                                  "div",
                                  {
                                    className: "file-preview",
                                    children: [
                                      s.jsx("img", {
                                        src: URL.createObjectURL(C),
                                        alt: `Preview ${A + 1}`,
                                        className: "photos-tab-preview-image",
                                      }),
                                      s.jsxs("div", {
                                        className: "file-info",
                                        children: [
                                          s.jsx("p", {
                                            className: "file-name",
                                            children: C.name,
                                          }),
                                          s.jsxs("p", {
                                            className: "file-size",
                                            children: [
                                              (C.size / 1024 / 1024).toFixed(2),
                                              " MB",
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  },
                                  A,
                                ),
                              ),
                            }),
                            s.jsxs("div", {
                              className: "photos-modal-actions",
                              children: [
                                s.jsx("button", {
                                  className: "cancel-btn",
                                  onClick: () => {
                                    (O(!1), v([]));
                                  },
                                  disabled: T,
                                  children: "Cancel",
                                }),
                                s.jsx("button", {
                                  className: "upload-confirm-btn",
                                  onClick: Y,
                                  disabled: T,
                                  children: T
                                    ? s.jsxs(s.Fragment, {
                                        children: [
                                          s.jsx("span", {
                                            className: "photos-spinner",
                                          }),
                                          "Uploading...",
                                        ],
                                      })
                                    : "Upload",
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
              ],
            })
      : s.jsx("div", {
          className: "owner-photos-tab error",
          children: s.jsxs("div", {
            className: "error-message",
            children: [
              s.jsx("h3", { children: "No Restaurant Data" }),
              s.jsx("p", {
                children:
                  "Unable to load restaurant information. Please try again.",
              }),
            ],
          }),
        });
  },
  mm = ({ restaurantId: g, isPremium: j }) => {
    if (!g)
      return s.jsx("div", {
        className: "error-message",
        children: "Error: No restaurant ID provided",
      });
    const [N, r] = R.useState(null),
      [Z, K] = R.useState(!0),
      [T, U] = R.useState("week"),
      M = async () => {
        try {
          K(!0);
          const ae = localStorage.getItem("auth_token"),
            Y = await fetch(
              `http://localhost/EatEase-Backend/backend/public/api/restaurants/${g}/analytics?range=${T}`,
              {
                headers: {
                  Authorization: `Bearer ${ae}`,
                  Accept: "application/json",
                },
              },
            );
          if ((console.log("Analytics API Response Status:", Y.status), Y.ok)) {
            const X = await Y.json();
            (console.log("Analytics API Data:", X),
              X.success && X.analytics ? r(X.analytics) : r(null));
          } else (console.warn("API returned non-OK status"), r(null));
        } catch (ae) {
          (console.error("Error fetching analytics:", ae), r(null));
        } finally {
          K(!1);
        }
      };
    if (
      (R.useEffect(() => {
        j && g && M();
      }, [g, j, T]),
      !j)
    )
      return s.jsx("div", {
        className: "analytics-premium-locked",
        children: s.jsxs("div", {
          className: "premium-locked-content",
          children: [
            s.jsx("div", {
              className: "premium-icon",
              children: s.jsx("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                height: "50",
                viewBox: "0 -960 960 960",
                width: "50",
                fill: "gray",
                children: s.jsx("path", {
                  d: "M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z",
                }),
              }),
            }),
            s.jsx("h3", { children: "Premium Analytics Locked" }),
            s.jsx("p", {
              children:
                "Upgrade to Premium tier to access detailed analytics and insights about your restaurant performance.",
            }),
            s.jsx("div", {
              className: "features-list",
              children: s.jsxs("ul", {
                children: [
                  s.jsx("li", {
                    className: "feature-text",
                    children: "Advanced occupancy analytics",
                  }),
                  s.jsx("li", {
                    className: "feature-text",
                    children: "Customer demographics",
                  }),
                  s.jsx("li", {
                    className: "feature-text",
                    children: "Peak hour analysis",
                  }),
                ],
              }),
            }),
          ],
        }),
      });
    if (Z)
      return s.jsx("div", {
        className: "loading-spinner-container",
        children: s.jsx("div", { className: "loading-spinner" }),
      });
    if (!(N?.occupancy?.has_data || !1))
      return s.jsxs("div", {
        className: "analytics-empty-state",
        children: [
          s.jsx("div", { className: "empty-icon" }),
          s.jsx("h3", { children: "No Analytics Data Yet" }),
          s.jsx("p", {
            children:
              "Your analytics dashboard will show occupancy trends, peak hours, and customer patterns once you start updating your restaurant's occupancy.",
          }),
          s.jsxs("div", {
            className: "empty-tips",
            children: [
              s.jsx("p", {
                children: s.jsx("strong", { children: "To get started:" }),
              }),
              s.jsxs("ol", {
                children: [
                  s.jsxs("li", {
                    children: [
                      "Go to the ",
                      s.jsx("strong", { children: "Overview" }),
                      " tab",
                    ],
                  }),
                  s.jsxs("li", {
                    children: [
                      "Click ",
                      s.jsx("strong", { children: "Edit Profile" }),
                      " in the menu",
                    ],
                  }),
                  s.jsx("li", { children: "Update your current occupancy" }),
                  s.jsx("li", {
                    children: "Return here to see your analytics!",
                  }),
                ],
              }),
            ],
          }),
          s.jsx("p", {
            className: "empty-note",
            children:
              "Analytics data is automatically collected when you update your restaurant's occupancy.",
          }),
        ],
      });
    const V = N?.occupancy || {},
      O = V.daily || [],
      G = V.weekly || [],
      L = V.monthly || [],
      le = T === "week" ? O : T === "month" ? G : L,
      H = N?.peakHours || [];
    N?.revenue;
    const ee = N?.reviews || {};
    N?.customers;
    const me = N?.summary || {};
    return s.jsxs("div", {
      className: "analytics-tab",
      children: [
        s.jsxs("div", {
          className: "analytics-header",
          children: [
            s.jsx("h2", { children: "Restaurant Analytics" }),
            s.jsxs("div", {
              className: "time-range-selector",
              children: [
                s.jsx("button", {
                  className: `time-btn ${T === "week" ? "active" : ""}`,
                  onClick: () => U("week"),
                  children: "Week",
                }),
                s.jsx("button", {
                  className: `time-btn ${T === "month" ? "active" : ""}`,
                  onClick: () => U("month"),
                  children: "Month",
                }),
                s.jsx("button", {
                  className: `time-btn ${T === "year" ? "active" : ""}`,
                  onClick: () => U("year"),
                  children: "Year",
                }),
              ],
            }),
          ],
        }),
        s.jsxs("div", {
          className: "kpi-cards",
          children: [
            s.jsx("div", {
              className: "kpi-card",
              children: s.jsxs("div", {
                className: "kpi-content",
                children: [
                  s.jsxs("h3", { children: [V.average || 0, "%"] }),
                  s.jsx("p", { children: "Average Occupancy" }),
                  s.jsxs("div", {
                    className: "kpi-comparison",
                    children: [
                      s.jsxs("span", {
                        children: ["Peak: ", V.peak || 0, "%"],
                      }),
                      s.jsxs("span", {
                        children: ["Lowest: ", V.low || 0, "%"],
                      }),
                    ],
                  }),
                ],
              }),
            }),
            s.jsx("div", {
              className: "kpi-card",
              children: s.jsxs("div", {
                className: "kpi-content",
                children: [
                  s.jsx("h3", { children: ee.average || 0 }),
                  s.jsx("p", { children: "Average Rating" }),
                  s.jsxs("span", {
                    className: `kpi-trend ${(ee.trend || 0) > 0 ? "positive" : "negative"}`,
                    children: [
                      (ee.trend || 0) > 0 ? "+" : "",
                      ee.trend || 0,
                      " reviews",
                    ],
                  }),
                ],
              }),
            }),
          ],
        }),
        s.jsxs("div", {
          className: "charts-section",
          children: [
            s.jsxs("div", {
              className: "chart-card",
              children: [
                s.jsx("h3", { children: "Occupancy Trend" }),
                s.jsx("div", {
                  className: "simple-chart",
                  children:
                    le.length > 0
                      ? le.map((ae, Y) =>
                          s.jsxs(
                            "div",
                            {
                              className: "chart-bar",
                              children: [
                                s.jsx("div", {
                                  className: "bar-fill",
                                  style: { height: `${ae || 0}%` },
                                  title: `${ae || 0}%`,
                                }),
                                s.jsx("span", {
                                  className: "bar-label",
                                  children:
                                    T === "week"
                                      ? [
                                          "Mon",
                                          "Tue",
                                          "Wed",
                                          "Thu",
                                          "Fri",
                                          "Sat",
                                          "Sun",
                                        ][Y] || `Day ${Y + 1}`
                                      : T === "month"
                                        ? `Week ${Y + 1}`
                                        : [
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec",
                                          ][Y] || `Month ${Y + 1}`,
                                }),
                              ],
                            },
                            Y,
                          ),
                        )
                      : s.jsx("div", {
                          className: "no-chart-data",
                          children: s.jsx("p", {
                            children: "No occupancy data for this period",
                          }),
                        }),
                }),
              ],
            }),
            s.jsxs("div", {
              className: "chart-card",
              children: [
                s.jsx("h3", { children: "Peak Hours" }),
                s.jsx("div", {
                  className: "peak-hours-list",
                  children:
                    H.length > 0
                      ? H.map((ae, Y) =>
                          s.jsxs(
                            "div",
                            {
                              className: "peak-hour-item",
                              children: [
                                s.jsx("div", {
                                  className: "peak-hour-time",
                                  children: ae.hour,
                                }),
                                s.jsx("div", {
                                  className: "peak-hour-bar",
                                  children: s.jsx("div", {
                                    className: "peak-bar-fill",
                                    style: { width: `${ae.occupancy || 0}%` },
                                  }),
                                }),
                                s.jsxs("div", {
                                  className: "peak-hour-percent",
                                  children: [ae.occupancy || 0, "%"],
                                }),
                              ],
                            },
                            Y,
                          ),
                        )
                      : s.jsx("div", {
                          className: "no-peak-data",
                          children: s.jsx("p", {
                            children: "No peak hour data yet",
                          }),
                        }),
                }),
              ],
            }),
          ],
        }),
        s.jsx("div", {
          className: "insights-section",
          children: s.jsxs("div", {
            className: "insights-card",
            children: [
              s.jsx("h3", { children: "Insights" }),
              s.jsx("div", {
                className: "insights-content",
                children: s.jsxs("div", {
                  className: "best-day",
                  children: [
                    s.jsx("strong", { children: "Busiest Day:" }),
                    " ",
                    me.best_day || "No data yet",
                  ],
                }),
              }),
            ],
          }),
        }),
        s.jsx("div", {
          className: "data-info",
          children: s.jsx("p", {
            children: s.jsxs("small", {
              children: [
                "Analytics based on ",
                V.total_logs || 0,
                " occupancy logs. Data updates automatically when you update your restaurant occupancy.",
              ],
            }),
          }),
        }),
      ],
    });
  };
function vm({ type: g, currentImage: j, onUploadSuccess: N, restaurantId: r }) {
  const [Z, K] = R.useState(!1),
    [T, U] = R.useState(""),
    [M, v] = R.useState(null),
    [V, O] = R.useState(j || null),
    G = R.useRef(null);
  R.useEffect(() => {
    if (j) {
      let H = j;
      (H && !H.startsWith("http") && (H = `http://localhost:8000/storage/${H}`),
        O(H));
    } else O(null);
  }, [j]);
  const L = (H) => {
      const ee = H.target.files[0];
      if (!ee) return;
      if (
        !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          ee.type,
        )
      ) {
        U("Please select a valid image (JPEG, PNG, GIF, WebP)");
        return;
      }
      if (ee.size > 5 * 1024 * 1024) {
        U("File size should be less than 5MB");
        return;
      }
      U("");
      const ae = new FileReader();
      ((ae.onload = (Y) => v(Y.target.result)), ae.readAsDataURL(ee), le(ee));
    },
    le = async (H) => {
      (K(!0), U(""));
      const ee = new FormData();
      ee.append("image", H);
      try {
        const me = localStorage.getItem("auth_token"),
          Y = await (
            await fetch(`http://127.0.0.1:8000/api/restaurant/upload/${g}`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${me}`,
                Accept: "application/json",
              },
              body: ee,
            })
          ).json();
        Y.success
          ? (Y.url && O(Y.url),
            N && N(Y.url, Y.path),
            v(null),
            G.current && (G.current.value = ""),
            alert(
              `${g === "profile" ? "Profile" : "Banner"} image uploaded successfully!`,
            ))
          : U(Y.message || "Upload failed");
      } catch (me) {
        (U("Network error. Please try again."),
          console.error("Upload error:", me));
      } finally {
        K(!1);
      }
    };
  return s.jsxs("div", {
    className: `image-upload ${g}`,
    children: [
      s.jsx("h3", {
        children: g === "profile" ? "Profile Image" : "Banner Image",
      }),
      s.jsx("div", {
        className: "upload-area",
        children: M
          ? s.jsxs("div", {
              className: "preview-container",
              children: [
                s.jsx("img", {
                  src: M,
                  alt: `${g} preview`,
                  className: "preview-image",
                }),
                s.jsx("div", {
                  className: "preview-overlay",
                  children: s.jsxs("label", {
                    className: "upload-button",
                    children: [
                      Z ? "Uploading..." : `Upload ${g} image`,
                      s.jsx("input", {
                        type: "file",
                        accept: "image/*",
                        onChange: L,
                        disabled: Z,
                        hidden: !0,
                      }),
                    ],
                  }),
                }),
              ],
            })
          : s.jsxs("label", {
              className: "upload-placeholder",
              children: [
                s.jsx("div", {
                  className: "upload-icon",
                  children: s.jsx("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    height: "30px",
                    viewBox: "0 -960 960 960",
                    width: "30px",
                    fill: "#000000",
                    children: s.jsx("path", {
                      d: "M440-120v-320H120v-80h320v-320h80v320h320v80H520v320h-80Z",
                    }),
                  }),
                }),
                s.jsx("div", {
                  className: "upload-text",
                  children: Z ? "Uploading..." : `Upload ${g} image`,
                }),
                s.jsx("div", {
                  className: "upload-hint",
                  children: "Click to select image",
                }),
                s.jsx("div", {
                  className: "upload-requirements",
                  children: "Max 5MB",
                }),
                s.jsx("input", {
                  type: "file",
                  ref: G,
                  accept: "image/*",
                  onChange: L,
                  disabled: Z,
                  hidden: !0,
                }),
              ],
            }),
      }),
      T && s.jsx("div", { className: "error-message", children: T }),
    ],
  });
}
const pm = ({ restaurant: g }) => {
    const [j, N] = R.useState([]),
      [r, Z] = R.useState([]),
      [K, T] = R.useState(g),
      [U, M] = R.useState(!0),
      [v, V] = R.useState("active"),
      [O, G] = R.useState({
        current: g?.current_occupancy || 0,
        max: g?.max_capacity || 100,
      }),
      [L, le] = R.useState(!1),
      [H, ee] = R.useState({
        hold_fee: 0,
        min_party_for_fee: 1,
        fee_description: "",
      }),
      me = () => {
        v === "expired" && D();
      };
    R.useEffect(() => {
      if (g) {
        (G({ current: g.current_occupancy || 0, max: g.max_capacity || 100 }),
          X(),
          ae());
        const J = setInterval(X, 3e4);
        return () => clearInterval(J);
      }
    }, [v, g]);
    const ae = async () => {
        try {
          const J = localStorage.getItem("auth_token"),
            m = await (
              await fetch("http://localhost:8000/api/restaurant/fee-settings", {
                headers: {
                  Authorization: `Bearer ${J}`,
                  Accept: "application/json",
                },
              })
            ).json();
          m.success &&
            ee({
              hold_fee: Number(m.hold_fee) || 0,
              min_party_for_fee: Number(m.min_party_for_fee) || 1,
              fee_description: m.fee_description || "",
            });
        } catch (J) {
          console.error("Error fetching fee settings:", J);
        }
      },
      Y = async () => {
        try {
          const J = localStorage.getItem("auth_token"),
            m = await (
              await fetch("http://localhost:8000/api/restaurant/update-fee", {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${J}`,
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify(H),
              })
            ).json();
          m.success
            ? (alert("  Fee settings saved!"), le(!1))
            : alert("Failed to save: " + m.message);
        } catch (J) {
          (console.error("Error saving fee:", J),
            alert("Error saving fee settings"));
        }
      },
      X = async () => {
        try {
          (M(!0),
            v === "active"
              ? await C()
              : v === "today"
                ? await A()
                : v === "expired" && (await D()));
        } catch (J) {
          console.error("Error fetching data:", J);
        } finally {
          M(!1);
        }
      },
      B = async (J, S = {}) => {
        const m = localStorage.getItem("auth_token"),
          W = `http://localhost:8000/api${J}`;
        console.log("API Call:", W, J);
        const pe = {
          Authorization: `Bearer ${m}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        };
        try {
          const ue = await fetch(W, { ...S, headers: { ...pe, ...S.headers } });
          if ((console.log("Response Status:", ue.status), !ue.ok))
            throw (
              console.error("API Error:", ue.status, ue.statusText),
              new Error(`API Error: ${ue.status}`)
            );
          return await ue.json();
        } catch (ue) {
          throw (console.error("Fetch error:", ue), ue);
        }
      },
      C = async () => {
        try {
          console.log("Fetching active holds...");
          const J = await B("/my-restaurant/spot-holds");
          (console.log("Active holds response:", J),
            J.success
              ? N(J.spot_holds || [])
              : console.error("API returned false success:", J));
        } catch (J) {
          console.error("Error fetching active holds:", J);
        }
      },
      A = async () => {
        try {
          const J = await B("/my-restaurant/todays-reservations");
          J.success && Z(J.reservations || []);
        } catch (J) {
          console.error("Error fetching today's reservations:", J);
        }
      },
      D = async () => {
        try {
          const J = await B("/my-restaurant/spot-holds/expired");
          J.success && N(J.expired_holds || []);
        } catch (J) {
          console.error("Error fetching expired holds:", J);
        }
      },
      k = async (J) => {
        if (
          (console.log("Accepting hold ID:", J),
          !!window.confirm(
            "Accept this spot hold? This will confirm the reservation.",
          ))
        )
          try {
            const S = await B(`/my-restaurant/spot-holds/${J}/accept`, {
              method: "PUT",
            });
            (console.log("Accept hold response:", S),
              S.success
                ? (alert("  Spot hold accepted! Reservation confirmed."),
                  X(),
                  S.restaurant_occupancy &&
                    G({
                      current: S.restaurant_occupancy.current,
                      max: S.restaurant_occupancy.max,
                    }))
                : (alert(`❌ ${S.message || "Failed to accept hold"}`),
                  console.error("Accept failed:", S)));
          } catch (S) {
            (console.error("Error accepting hold:", S),
              alert("Error accepting spot hold. Check console for details."));
          }
      },
      P = async (J) => {
        if (window.confirm("Reject this spot hold?"))
          try {
            const S = await B(`/my-restaurant/spot-holds/${J}/reject`, {
              method: "PUT",
            });
            S.success
              ? (alert("Spot hold rejected."), X())
              : alert(S.message || "Failed to reject hold");
          } catch (S) {
            (console.error("Error rejecting hold:", S),
              alert("Error rejecting spot hold"));
          }
      },
      ce = (J, S) => {
        if (J <= 0) return "Expired";
        if (J < 60) return `${J}m remaining`;
        const m = Math.floor(J / 60),
          q = J % 60;
        return `${m}h ${q}m remaining`;
      },
      Se = (J) => {
        switch (J) {
          case "quick_10min":
            return "10-min Quick Hold";
          case "extended_20min":
            return "20-min Extended Hold";
          default:
            return J;
        }
      },
      He = () => O.max - O.current;
    return s.jsxs("div", {
      className: "spot-hold-management",
      children: [
        s.jsxs("div", {
          className: "management-header",
          children: [
            s.jsx("div", {
              children: s.jsx("h3", { children: "Spot Hold Management" }),
            }),
            s.jsxs("div", {
              className: "capacity-status",
              children: [
                s.jsxs("div", {
                  className: "spot-hold-capacity-bar",
                  children: [
                    s.jsxs("div", {
                      className: "capacity-label",
                      children: ["Capacity: ", O.current, "/", O.max],
                    }),
                    s.jsx("div", {
                      className: "capacity-progress",
                      children: s.jsx("div", {
                        className: "hold-capacity-fill",
                        style: {
                          width: `${(O.current / O.max) * 100}%`,
                          backgroundColor:
                            O.current >= O.max * 0.9
                              ? "var(--red-status)"
                              : O.current >= O.max * 0.7
                                ? "var(--orange-status)"
                                : "var(--green-status)",
                        },
                      }),
                    }),
                  ],
                }),
                s.jsxs("div", {
                  className: "available-capacity",
                  children: ["Available: ", He(), " seats"],
                }),
                s.jsxs("button", {
                  className: "fee-settings-btn",
                  onClick: () => le(!0),
                  title: "Configure hold fees",
                  children: [
                    s.jsx("svg", {
                      width: "16",
                      height: "16",
                      viewBox: "0 0 24 24",
                      fill: "currentColor",
                      children: s.jsx("path", {
                        d: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",
                      }),
                    }),
                    "Fee Settings",
                  ],
                }),
              ],
            }),
          ],
        }),
        s.jsxs("div", {
          className: "management-tabs",
          children: [
            s.jsxs("button", {
              className: `tab ${v === "active" ? "active" : ""}`,
              onClick: () => V("active"),
              children: [
                "Active Holds",
                v === "active" &&
                  j.length > 0 &&
                  s.jsx("span", { className: "tab-badge", children: j.length }),
              ],
            }),
            s.jsx("button", {
              className: `tab ${v === "today" ? "active" : ""}`,
              onClick: () => V("today"),
              children: "Today's Reservations",
            }),
            s.jsx("button", {
              className: `tab ${v === "expired" ? "active" : ""}`,
              onClick: () => V("expired"),
              children: "Expired Holds",
            }),
          ],
        }),
        s.jsx("div", {
          className: "management-content",
          children: U
            ? s.jsx("div", {
                className: "loading-state",
                children: s.jsx("div", { className: "spinner" }),
              })
            : s.jsxs(s.Fragment, {
                children: [
                  v === "active" &&
                    s.jsx(gm, {
                      holds: j,
                      onAccept: k,
                      onReject: P,
                      formatTimeRemaining: ce,
                      getHoldTypeLabel: Se,
                      availableCapacity: He(),
                    }),
                  v === "today" && s.jsx(ym, { reservations: r }),
                  v === "expired" &&
                    s.jsx(xm, {
                      holds: j,
                      getHoldTypeLabel: Se,
                      onRemoveExpired: me,
                      setActiveHolds: N,
                    }),
                ],
              }),
        }),
        L &&
          s.jsx("div", {
            className: "modal-overlay",
            onClick: () => le(!1),
            children: s.jsxs("div", {
              className: "modal-content fee-modal",
              onClick: (J) => J.stopPropagation(),
              children: [
                s.jsxs("div", {
                  className: "modal-header",
                  children: [
                    s.jsx("h3", { children: "Spot Hold Fee Settings" }),
                    s.jsx("button", {
                      className: "close-btn",
                      onClick: () => le(!1),
                      children: "✕",
                    }),
                  ],
                }),
                s.jsxs("div", {
                  className: "modal-body",
                  children: [
                    s.jsxs("div", {
                      className: "fee-current",
                      children: [
                        s.jsxs("h4", {
                          children: [
                            "Current Fee: ₱",
                            Number(H.hold_fee || 0).toFixed(2),
                          ],
                        }),
                        H.fee_description &&
                          s.jsx("p", {
                            className: "fee-desc",
                            children: H.fee_description,
                          }),
                      ],
                    }),
                    s.jsxs("div", {
                      className: "form-group",
                      children: [
                        s.jsxs("div", {
                          className: "currency-input",
                          children: [
                            s.jsx("label", {
                              className: "currency-symbol",
                              children: "Php Amount:",
                            }),
                            s.jsx("input", {
                              type: "number",
                              value:
                                H.hold_fee === 0 || H.hold_fee === null
                                  ? ""
                                  : Number(H.hold_fee),
                              onChange: (J) => {
                                const S = J.target.value;
                                ee({
                                  ...H,
                                  hold_fee: S === "" ? 0 : parseFloat(S),
                                });
                              },
                              min: "0",
                              step: "0.01",
                              placeholder: "0.00",
                            }),
                          ],
                        }),
                        s.jsx("small", { children: "Set to 0 for free holds" }),
                      ],
                    }),
                    s.jsxs("div", {
                      className: "form-group",
                      children: [
                        s.jsx("label", {
                          children: "Minimum Party Size for Fee",
                        }),
                        s.jsx("input", {
                          type: "number",
                          value: H.min_party_for_fee || 1,
                          onChange: (J) =>
                            ee({
                              ...H,
                              min_party_for_fee: parseInt(J.target.value) || 1,
                            }),
                          min: "1",
                          max: "20",
                        }),
                        s.jsx("small", {
                          children:
                            "Fee applies only to parties of this size or larger",
                        }),
                      ],
                    }),
                  ],
                }),
                s.jsxs("div", {
                  className: "modal-actions",
                  children: [
                    s.jsx("button", {
                      className: "cancel-btn",
                      onClick: () => le(!1),
                      children: "Cancel",
                    }),
                    s.jsx("button", {
                      className: "save-btn",
                      onClick: Y,
                      children: "Save Settings",
                    }),
                  ],
                }),
              ],
            }),
          }),
      ],
    });
  },
  gm = ({
    holds: g,
    onAccept: j,
    onReject: N,
    formatTimeRemaining: r,
    getHoldTypeLabel: Z,
    availableCapacity: K,
  }) =>
    g.length === 0
      ? s.jsxs("div", {
          className: "hold-empty-state",
          children: [
            s.jsx("p", { children: "No active spot holds" }),
            s.jsx("p", {
              className: "empty-subtitle",
              children: "When diners request spot holds, they'll appear here.",
            }),
          ],
        })
      : s.jsx("div", {
          className: "holds-list",
          children: g.map((T) => {
            let U = !1,
              M = "";
            T.hold_status === "pending"
              ? ((U = T.time_remaining <= 0),
                (M = U
                  ? "Response deadline passed"
                  : `Restaurant response in: ${r(T.time_remaining)}`))
              : T.hold_status === "accepted" &&
                ((U = T.time_remaining <= 0),
                (M = U
                  ? "Hold expired"
                  : `Diner arrival time: ${r(T.time_remaining)}`));
            const v = !U && T.party_size <= K;
            return s.jsxs(
              "div",
              {
                className: `hold-card ${U ? "expired" : ""}`,
                children: [
                  s.jsxs("div", {
                    className: "hold-header",
                    children: [
                      s.jsxs("div", {
                        className: "hold-user",
                        children: [
                          s.jsxs("span", {
                            className: "user-name",
                            children: [
                              "Username: ",
                              T.user?.name || "Customer",
                            ],
                          }),
                          s.jsxs("span", {
                            className: "user-email",
                            children: ["User Email: ", T.user?.email],
                          }),
                        ],
                      }),
                      s.jsxs("div", {
                        className: "hold-meta",
                        children: [
                          s.jsxs("span", {
                            className: "party-size",
                            children: ["People: ", T.party_size],
                          }),
                          s.jsxs("span", {
                            className: "hold-type",
                            children: ["Type: ", Z(T.hold_type)],
                          }),
                          s.jsxs("span", {
                            className: "confirmation-code",
                            children: ["Code: ", T.confirmation_code],
                          }),
                          T.hold_fee > 0 &&
                            s.jsxs("span", {
                              className: "fee-badge",
                              children: [
                                "Fee: ₱",
                                Number(T.hold_fee || 0).toFixed(2),
                              ],
                            }),
                        ],
                      }),
                    ],
                  }),
                  s.jsx("div", {
                    className: "hold-details",
                    children: s.jsxs("div", {
                      className: "time-info",
                      children: [
                        s.jsxs("div", {
                          className: "time-remaining",
                          children: [
                            s.jsx("span", {
                              className: "time-label",
                              children: "Status:",
                            }),
                            s.jsx("span", {
                              className: `time-value ${U ? "expired" : ""}`,
                              children:
                                T.hold_status === "pending"
                                  ? "Waiting for acceptance"
                                  : "Accepted - Timer running",
                            }),
                          ],
                        }),
                        s.jsxs("div", {
                          className: "time-details",
                          children: [
                            M &&
                              s.jsx("div", {
                                className: "time-text",
                                children: M,
                              }),
                            T.hold_status === "pending"
                              ? s.jsxs("div", {
                                  className: "expires-at",
                                  children: [
                                    "Auto-cancels if not accepted by:",
                                    " ",
                                    new Date(
                                      T.original_expires_at,
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }),
                                  ],
                                })
                              : T.accepted_at
                                ? s.jsxs("div", {
                                    className: "accepted-at",
                                    children: [
                                      "Accepted at:",
                                      " ",
                                      new Date(
                                        T.accepted_at,
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }),
                                    ],
                                  })
                                : null,
                          ],
                        }),
                      ],
                    }),
                  }),
                  s.jsx("div", {
                    className: "hold-actions",
                    children:
                      T.hold_status === "pending"
                        ? U
                          ? s.jsx("span", {
                              className: "expired-label",
                              children: "Reservation Expired",
                            })
                          : s.jsxs(s.Fragment, {
                              children: [
                                s.jsx("button", {
                                  className: "btn-accept",
                                  onClick: () => j(T.id),
                                  disabled: !v,
                                  title: v
                                    ? "Accept this spot hold"
                                    : "Not enough capacity",
                                  children: "Accept Hold",
                                }),
                                s.jsx("button", {
                                  className: "btn-reject",
                                  onClick: () => N(T.id),
                                  children: "Reject",
                                }),
                              ],
                            })
                        : U
                          ? s.jsx("span", {
                              className: "expired-label",
                              children: "Hold Expired",
                            })
                          : s.jsx("span", {
                              className: "accepted-label",
                              children: "Accepted",
                            }),
                  }),
                ],
              },
              T.id,
            );
          }),
        }),
  ym = ({ reservations: g }) =>
    g.length === 0
      ? s.jsx("div", {
          className: "hold-empty-state",
          children: s.jsx("p", {
            children: "No confirmed reservations for today",
          }),
        })
      : s.jsx("div", {
          className: "reservations-list",
          children: s.jsxs("table", {
            className: "reservations-table",
            children: [
              s.jsx("thead", {
                children: s.jsxs("tr", {
                  children: [
                    s.jsx("th", { children: "Time" }),
                    s.jsx("th", { children: "Customer" }),
                    s.jsx("th", { children: "Party Size" }),
                    s.jsx("th", { children: "Contact" }),
                    s.jsx("th", { children: "Confirmation Code" }),
                  ],
                }),
              }),
              s.jsx("tbody", {
                children: g.map((j) =>
                  s.jsxs(
                    "tr",
                    {
                      children: [
                        s.jsx("td", { children: j.reservation_time }),
                        s.jsx("td", { children: j.user?.name || "Customer" }),
                        s.jsx("td", { children: j.party_size }),
                        s.jsxs("td", {
                          children: [
                            s.jsx("div", { children: j.user?.email }),
                            j.user?.phone &&
                              s.jsx("div", { children: j.user.phone }),
                          ],
                        }),
                        s.jsx("td", {
                          children: s.jsx("code", {
                            children: j.confirmation_code,
                          }),
                        }),
                      ],
                    },
                    j.id,
                  ),
                ),
              }),
            ],
          }),
        }),
  xm = ({
    holds: g,
    getHoldTypeLabel: j,
    onRemoveExpired: N,
    setActiveHolds: r,
  }) => {
    if (g.length === 0)
      return s.jsx("div", {
        className: "hold-empty-state",
        children: s.jsx("p", { children: "No expired holds" }),
      });
    const Z = async (T) => {
        if (window.confirm("Remove this expired hold from view?"))
          try {
            const U = localStorage.getItem("auth_token"),
              v = await (
                await fetch(
                  `http://localhost:8000/api/my-restaurant/expired-holds/${T}/hide`,
                  {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${U}`,
                      Accept: "application/json",
                    },
                  },
                )
              ).json();
            v.success
              ? (r((V) => V.filter((O) => O.id !== T)),
                N && N(),
                alert("Hold hidden successfully"))
              : alert("Failed to hide hold: " + v.message);
          } catch (U) {
            (console.error("Error:", U), alert("Error hiding hold"));
          }
      },
      K = (T) => {
        let U = T.expires_at || T.original_expires_at || T.created_at;
        if (!U) return "Date not available";
        try {
          const M = new Date(U);
          return isNaN(M.getTime()) || M.getTime() === 0
            ? "Date not available"
            : M.toLocaleString(void 0, {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: !0,
              });
        } catch {
          return "Date not available";
        }
      };
    return s.jsx("div", {
      className: "expired-holds",
      children: g.map((T) =>
        s.jsxs(
          "div",
          {
            className: "expired-hold-card",
            children: [
              s.jsx("button", {
                className: "remove-expired-btn",
                onClick: () => Z(T.id),
                title: "Remove from view",
                children: "×",
              }),
              s.jsxs("div", {
                className: "expired-hold-header",
                children: [
                  s.jsx("span", {
                    className: "customer-name",
                    children: T.user?.name || "Customer",
                  }),
                  s.jsx("span", {
                    className: "hold-type",
                    children: j(T.hold_type),
                  }),
                  s.jsxs("span", {
                    className: "party-size",
                    children: [T.party_size, "p"],
                  }),
                ],
              }),
              s.jsxs("div", {
                className: "expired-hold-details",
                children: [
                  s.jsxs("div", { children: ["Expired: ", K(T)] }),
                  s.jsxs("div", { children: ["Code: ", T.confirmation_code] }),
                ],
              }),
            ],
          },
          T.id,
        ),
      ),
    });
  },
  jm = "http://localhost:8000";
class bm {
  constructor() {
    ((this.intervals = new Map()),
      (this.subscribers = new Map()),
      (this.pollingInterval = 15e3),
      (this.isTabActive = !0));
  }
  subscribe(j, N) {
    return (
      console.log(`🏪 [Owner Polling] Subscribing to restaurant ${j}`),
      this.subscribers.has(j) || this.subscribers.set(j, new Set()),
      this.subscribers.get(j).add(N),
      this.intervals.has(j)
        ? console.log(`🏪 [Owner Polling] Using existing interval for ${j}`)
        : this.startPolling(j),
      () => this.unsubscribe(j, N)
    );
  }
  unsubscribe(j, N) {
    if (this.subscribers.has(j)) {
      const r = this.subscribers.get(j);
      (r.delete(N),
        r.size === 0 && (this.stopPolling(j), this.subscribers.delete(j)));
    }
  }
  startPolling(j) {
    (console.log(`⏱️ [Owner Polling] Setting up 15s interval for ${j}`),
      this.stopPolling(j));
    const N = setInterval(() => {
      this.isTabActive &&
        (console.log(`🔄 [Owner Polling] Interval tick for ${j}`),
        this.fetchRestaurantStatus(j));
    }, this.pollingInterval);
    (this.intervals.set(j, N),
      console.log(`🔍 [Owner Polling] Initial fetch for ${j}`),
      this.fetchRestaurantStatus(j));
  }
  stopPolling(j) {
    this.intervals.has(j) &&
      (console.log(`⏹️ [Owner Polling] Stopping interval for ${j}`),
      clearInterval(this.intervals.get(j)),
      this.intervals.delete(j));
  }
  async fetchRestaurantStatus(j) {
    try {
      console.log(`🔍 [Owner Polling] Fetching status for ${j}`);
      const N = await fetch(`${jm}/api/restaurants/${j}/status`);
      if (N.ok) {
        const r = await N.json();
        r.success &&
          r.restaurant &&
          (console.log(
            `  [Owner Polling] Update for ${j}:`,
            r.restaurant.crowd_status,
            `(${r.restaurant.current_occupancy}/${r.restaurant.max_capacity})`,
          ),
          this.notifySubscribers(j, r.restaurant));
      }
    } catch (N) {
      console.error(`❌ [Owner Polling] Error fetching ${j}:`, N);
    }
  }
  notifySubscribers(j, N) {
    if (this.subscribers.has(j)) {
      const r = this.subscribers.get(j);
      (console.log(
        `📢 [Owner Polling] Notifying ${r.size} subscribers for ${j}`,
      ),
        r.forEach((Z) => {
          try {
            Z(N);
          } catch (K) {
            console.error("Error in subscriber callback:", K);
          }
        }));
    }
  }
  pausePolling() {
    (console.log("⏸️ [Owner Polling] Pausing all intervals"),
      this.intervals.forEach((j) => {
        clearInterval(j);
      }));
  }
  resumePolling() {
    (console.log("▶️ [Owner Polling] Resuming all intervals"),
      this.subscribers.forEach((j, N) => {
        j.size > 0 && this.startPolling(N);
      }));
  }
  async refreshRestaurant(j) {
    await this.fetchRestaurantStatus(j);
  }
}
const wn = new bm();
typeof document < "u" &&
  document.addEventListener("visibilitychange", () => {
    ((wn.isTabActive = !document.hidden),
      wn.isTabActive ? wn.resumePolling() : wn.pausePolling());
  });
function Sm({ user: g }) {
  const [j, N] = R.useState(!1),
    [r, Z] = R.useState(null),
    [K, T] = R.useState(!1),
    [U, M] = R.useState(!0),
    [v, V] = R.useState(!1),
    [O, G] = R.useState(""),
    [L, le] = R.useState("overview"),
    [H, ee] = R.useState(""),
    [me, ae] = R.useState(!1),
    [Y, X] = R.useState("basic"),
    [B, C] = R.useState(!1),
    A = R.useRef(null),
    [D, k] = R.useState(!1),
    [P, ce] = R.useState({
      name: "",
      cuisine_type: "",
      address: "",
      phone: "",
      hours: "",
      max_capacity: 50,
      current_occupancy: 0,
      features: [],
    }),
    [Se, He] = R.useState(null),
    [J, S] = R.useState(""),
    [m, q] = R.useState(!1),
    [W, pe] = R.useState(!1),
    ue = ($) =>
      $
        ? $.startsWith("http")
          ? $
          : `http://localhost/EatEase/backend/public/storage/${$}`
        : null;
  (R.useEffect(() => {
    g && g.user_type === "restaurant_owner" && (E(), we());
  }, [g]),
    R.useEffect(() => {
      if (!r || !r.id) return;
      console.log(
        `🏪 [Owner Dashboard] Setting up polling for restaurant ${r.id}`,
      );
      const $ = wn.subscribe(r.id, (de) => {
        (console.log("🔄 [Owner Dashboard] Received update:", de),
          Z((ie) => ({
            ...ie,
            current_occupancy: de.current_occupancy,
            crowd_status: de.crowd_status,
            occupancy_percentage: de.occupancy_percentage,
            updated_at: de.updated_at,
          })));
      });
      return () => {
        (console.log(
          `🏪 [Owner Dashboard] Cleaning up polling for restaurant ${r.id}`,
        ),
          $());
      };
    }, [r?.id]),
    R.useEffect(() => {
      const $ = (de) => {
        A.current && !A.current.contains(de.target) && C(!1);
      };
      return (
        document.addEventListener("mousedown", $),
        () => document.removeEventListener("mousedown", $)
      );
    }, []));
  const d = async () => {
      if (!r?.is_featured) {
        alert("Only featured restaurants can add promo text");
        return;
      }
      if (J.length > 100) {
        alert("Promo text must be 100 characters or less");
        return;
      }
      try {
        const $ = localStorage.getItem("auth_token"),
          ie = await (
            await fetch(
              "http://localhost/EatEase-Backend/backend/public/api/restaurant/promo",
              {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${$}`,
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify({ promo_text: J, show_promo: m }),
              },
            )
          ).json();
        ie.success
          ? (alert("  Promo text saved!"), we(), W && pe(!1))
          : alert("Failed to save promo: " + ie.message);
      } catch ($) {
        (console.error("Error saving promo:", $),
          alert("Error saving promo text"));
      }
    },
    E = async () => {
      const $ = localStorage.getItem("auth_token");
      try {
        const ie = await (
          await fetch("http://localhost:8000/api/subscription/tier", {
            headers: {
              Authorization: `Bearer ${$}`,
              Accept: "application/json",
            },
            credentials: "include",
          })
        ).json();
        (console.log("Tier API Response:", ie),
          ie.success
            ? (X(ie.tier),
              k(ie.can_be_featured),
              ie.needs_setup &&
                (console.log("User needs to create a restaurant first"),
                ae(!0)))
            : (console.error("Tier API error:", ie.message),
              (ie.message === "Restaurant not found" ||
                ie.message === "No restaurant found") &&
                (X("basic"), k(!1), ae(!0))));
      } catch (de) {
        (console.error("Error fetching tier:", de), X("basic"), k(!1));
      }
    },
    Q = async () => {
      if (r.is_featured) {
        confirm(
          "Your restaurant is currently featured. Remove from featured section?",
        ) && (await re());
        return;
      }
      if (!r.banner_image) {
        confirm("To be featured, you need a banner image. Upload one now?") &&
          He("banner");
        return;
      }
      confirm(
        "Feature your restaurant in the main carousel? This will make it visible to all diners.",
      ) && (await F());
    },
    F = async () => {
      try {
        const $ = localStorage.getItem("auth_token"),
          ie = await (
            await fetch("http://localhost:8000/api/restaurant/feature", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${$}`,
                Accept: "application/json",
              },
            })
          ).json();
        ie.success
          ? (alert(
              "  Your restaurant is now featured! It will appear in the featured carousel.",
            ),
            we())
          : alert("Failed to feature: " + (ie.message || "Unknown error"));
      } catch ($) {
        (console.error("Feature error:", $),
          alert("Failed to feature restaurant. Please try again."));
      }
    },
    re = async () => {
      try {
        const $ = localStorage.getItem("auth_token"),
          ie = await (
            await fetch("http://localhost:8000/api/restaurant/unfeature", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${$}`,
                Accept: "application/json",
              },
            })
          ).json();
        ie.success
          ? (alert("  Your restaurant is no longer featured."), we())
          : alert("Failed to unfeature: " + (ie.message || "Unknown error"));
      } catch ($) {
        (console.error("Unfeature error:", $),
          alert("Failed to unfeature restaurant. Please try again."));
      }
    },
    ve = async () => {
      if (
        confirm(
          "Upgrade to Premium tier? This will unlock all features including the ability to apply for featured status.",
        )
      )
        try {
          const $ = localStorage.getItem("auth_token"),
            ie = await (
              await fetch("http://localhost:8000/api/subscription/upgrade", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${$}`,
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
              })
            ).json();
          ie.success
            ? (alert("Successfully upgraded to Premium tier!"),
              X("premium"),
              k(!0))
            : alert("Upgrade failed: " + ie.message);
        } catch ($) {
          (console.error("Error upgrading tier:", $),
            alert("Error upgrading tier"));
        }
    };
  (R.useEffect(() => {
    r && (S(r.promo_text || ""), q(r.show_promo || !1));
  }, [r]),
    R.useEffect(() => {
      we();
    }, []));
  const Ne = () => {
      (localStorage.removeItem("auth_token"),
        localStorage.removeItem("user"),
        (window.location.href = "/"));
    },
    $e = async () => {
      const $ = localStorage.getItem("auth_token");
      if (!O.trim()) {
        alert("Please enter a description for your featured listing!");
        return;
      }
      try {
        const de = await fetch(
            "http://localhost:8000/api/restaurant/request-feature",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${$}`,
                Accept: "application/json",
              },
              body: JSON.stringify({ featured_description: O }),
            },
          ),
          ie = await de.json();
        de.ok
          ? (alert(
              "  Feature request submitted! Our team will review it shortly.",
            ),
            V(!1),
            G(""),
            we())
          : alert(
              "Failed to submit request: " + (ie.message || "Unknown error"),
            );
      } catch (de) {
        (console.error("Feature request error:", de),
          alert("Failed to submit request. Please try again."));
      }
    },
    we = async () => {
      const $ = localStorage.getItem("auth_token");
      try {
        const de = await fetch("http://localhost:8000/api/restaurant/my", {
            headers: {
              Authorization: `Bearer ${$}`,
              Accept: "application/json",
            },
            credentials: "include",
          }),
          ie = await de.json();
        (console.log("Restaurant API Response:", ie),
          de.status === 404
            ? (Z(null), ie.needs_setup && ae(!0))
            : de.ok &&
              ie.success &&
              (Z(ie.restaurant),
              ae(!1),
              ie.restaurant &&
                (X(ie.restaurant.subscription_tier || "basic"),
                k(ie.restaurant.can_be_featured || !1))));
      } catch (de) {
        (console.error("Error fetching restaurant:", de), Z(null), ae(!0));
      } finally {
        M(!1);
      }
    },
    wa = async ($) => {
      $.preventDefault();
      const de = localStorage.getItem("auth_token"),
        ie = {
          name: P.name,
          cuisine_type: P.cuisine_type,
          address: P.address,
          phone: P.phone,
          hours: P.hours,
          max_capacity: Number(P.max_capacity) || 50,
          current_occupancy: Number(P.current_occupancy) || 0,
          features: Array.isArray(P.features) ? P.features : [],
          is_featured: !1,
        };
      try {
        const Ct = await fetch("http://localhost:8000/api/restaurant/save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${de}`,
              Accept: "application/json",
            },
            body: JSON.stringify(ie),
          }),
          Ea = await Ct.json();
        Ct.ok &&
          (Z(Ea.restaurant),
          T(!1),
          ce({
            name: "",
            cuisine_type: "",
            address: "",
            phone: "",
            hours: "",
            max_capacity: 50,
            current_occupancy: 0,
            features: [],
          }));
      } catch (Ct) {
        console.error("Error:", Ct);
      }
    },
    Ja = () => {
      if (!r) return null;
      switch (L) {
        case "overview":
          return s.jsx(Ad, {
            restaurant: r,
            tier: Y,
            handleUpgrade: ve,
            onEdit: () => {
              (ce({
                name: r.name,
                cuisine_type: r.cuisine_type,
                address: r.address,
                phone: r.phone,
                hours: r.hours,
                max_capacity: r.max_capacity,
                current_occupancy: r.current_occupancy,
                features: r.features || [],
              }),
                T(!0));
            },
            onUpdateOccupancy: ($) => {
              Z((de) => ({ ...de, current_occupancy: $ }));
            },
          });
        case "menu":
          return s.jsx(fm, { restaurantId: r.id });
        case "reviews":
          return s.jsx(dm, { restaurantId: r.id });
        case "photos":
          return (
            console.log("Photos tab - restaurant object:", r),
            s.jsx(hm, { restaurant: r })
          );
        case "reservations":
          return s.jsx(pm, { restaurant: r });
        case "analytics":
          return s.jsx(mm, { restaurantId: r.id, isPremium: Y === "premium" });
        default:
          return s.jsx(Ad, {
            restaurant: r,
            onEdit: () => {
              (ce({
                name: r.name,
                cuisine_type: r.cuisine_type,
                address: r.address,
                phone: r.phone,
                hours: r.hours,
                max_capacity: r.max_capacity,
                current_occupancy: r.current_occupancy,
                features: r.features || [],
              }),
                T(!0));
            },
          });
      }
    };
  return U
    ? s.jsx("div", {
        className: "restaurant-owner-dashboard",
        children: s.jsx("div", {
          className: "loading-container",
          children: s.jsx("div", { className: "restaurant-loading-spinner" }),
        }),
      })
    : s.jsxs("div", {
        className: "restaurant-owner-dashboard",
        children: [
          r
            ? s.jsxs("div", {
                className: "restaurant-owner-view",
                children: [
                  s.jsx("div", {
                    className: "restaurant-banner-section",
                    children: r.banner_image
                      ? s.jsxs("div", {
                          className: "restaurant-banner-container",
                          children: [
                            s.jsx("img", {
                              src: ue(r.banner_image),
                              alt: `${r.name} banner`,
                              className: "restaurant-banner-img",
                            }),
                            s.jsx("button", {
                              className: "edit-image-btn banner-btn",
                              onClick: () => He("banner"),
                              title: "Edit banner image",
                              children: s.jsx("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                height: "13px",
                                viewBox: "0 -960 960 960",
                                width: "13px",
                                fill: "white",
                                children: s.jsx("path", {
                                  d: "M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z",
                                }),
                              }),
                            }),
                            s.jsx("div", { className: "banner-background" }),
                          ],
                        })
                      : s.jsxs("div", {
                          className: "restaurant-banner-placeholder",
                          children: [
                            s.jsx("div", {
                              className: "banner-placeholder-content",
                              children: s.jsxs("button", {
                                className: "add-banner-btn",
                                onClick: () => He("banner"),
                                children: [
                                  s.jsx("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    height: "13px",
                                    viewBox: "0 -960 960 960",
                                    width: "13px",
                                    fill: "currentColor",
                                    children: s.jsx("path", {
                                      d: "M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z",
                                    }),
                                  }),
                                  "Add Banner",
                                ],
                              }),
                            }),
                            s.jsx("div", { className: "banner-background" }),
                          ],
                        }),
                  }),
                  s.jsx("div", {
                    className: "owner-title-row",
                    children: s.jsx("div", {
                      className: "restaurant-title-section",
                      children: s.jsxs("div", {
                        className: "restaurant-header-profile",
                        children: [
                          s.jsxs("div", {
                            className: "profile-image-container",
                            children: [
                              r.profile_image
                                ? s.jsx("img", {
                                    src: ue(r.profile_image),
                                    alt: r.name,
                                    className: "restaurant-profile-img",
                                  })
                                : s.jsx("div", {
                                    className: "profile-image-placeholder",
                                    children: r.name.charAt(0),
                                  }),
                              s.jsx("button", {
                                className: "edit-image-btn small-btn",
                                onClick: () => He("profile"),
                                title: "Edit profile image",
                                children: s.jsx("svg", {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  height: "13px",
                                  viewBox: "0 -960 960 960",
                                  width: "13px",
                                  fill: "white",
                                  children: s.jsx("path", {
                                    d: "M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z",
                                  }),
                                }),
                              }),
                            ],
                          }),
                          s.jsx("div", {
                            className: "restaurant-header-info",
                            children: s.jsx("h2", {
                              className: "restaurant-owner-name",
                              children: r.name,
                            }),
                          }),
                          s.jsxs("div", {
                            className: "menu-container",
                            ref: A,
                            children: [
                              s.jsx("button", {
                                className: "menu-button",
                                onClick: () => C(!B),
                                "aria-label": "Toggle menu",
                                children: s.jsx("svg", {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  height: "24px",
                                  viewBox: "0 -960 960 960",
                                  width: "24px",
                                  fill: "currentColor",
                                  className: `hamburger-icon ${B ? "active" : ""}`,
                                  children: s.jsx("path", {
                                    d: "M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z",
                                  }),
                                }),
                              }),
                              B &&
                                s.jsxs("div", {
                                  className: "dropdown-menu",
                                  children: [
                                    s.jsxs("button", {
                                      className: "dropdown-item edit-item",
                                      onClick: () => {
                                        (ce({
                                          name: r.name,
                                          cuisine_type: r.cuisine_type,
                                          address: r.address,
                                          phone: r.phone,
                                          hours: r.hours,
                                          max_capacity: r.max_capacity,
                                          current_occupancy:
                                            r.current_occupancy,
                                          features: r.features || [],
                                        }),
                                          T(!0),
                                          C(!1));
                                      },
                                      children: [
                                        s.jsx("svg", {
                                          xmlns: "http://www.w3.org/2000/svg",
                                          height: "13px",
                                          viewBox: "0 -960 960 960",
                                          width: "13px",
                                          fill: "currentColor",
                                          children: s.jsx("path", {
                                            d: "M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z",
                                          }),
                                        }),
                                        s.jsx("span", {
                                          children: "Edit Profile",
                                        }),
                                      ],
                                    }),
                                    Y === "premium" &&
                                      s.jsxs("button", {
                                        className: "dropdown-item feature-item",
                                        onClick: () => {
                                          (C(!1), Q());
                                        },
                                        children: [
                                          s.jsx("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            height: "13px",
                                            viewBox: "0 -960 960 960",
                                            width: "13px",
                                            fill: r.is_featured
                                              ? "green"
                                              : "gold",
                                            children: r.is_featured
                                              ? s.jsx("path", {
                                                  d: "m424-312 282-282-56-56-226 226-114-114-56 56 170 170Zm56 192q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z",
                                                })
                                              : s.jsx("path", {
                                                  d: "M480-80 360-320l-280-40 200-192-56-280 216 160 216-160-56 280 200 192-280 40-120 240Z",
                                                }),
                                          }),
                                          s.jsx("span", {
                                            children: r.is_featured
                                              ? "Featured ✓"
                                              : "Be Featured",
                                          }),
                                        ],
                                      }),
                                    r.is_featured &&
                                      s.jsxs("div", {
                                        className: "dropdown-promo-section",
                                        children: [
                                          s.jsxs("div", {
                                            className: "promo-header-small",
                                            children: [
                                              s.jsx("svg", {
                                                width: "14",
                                                height: "14",
                                                viewBox: "0 0 24 24",
                                                fill: "#ffd43b",
                                                children: s.jsx("path", {
                                                  d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
                                                }),
                                              }),
                                              s.jsx("span", {
                                                children: "Promo Text",
                                              }),
                                            ],
                                          }),
                                          s.jsxs("div", {
                                            className:
                                              "promo-input-group-small",
                                            children: [
                                              s.jsx("input", {
                                                type: "text",
                                                value: J,
                                                onChange: ($) =>
                                                  S(
                                                    $.target.value.slice(0, 30),
                                                  ),
                                                placeholder:
                                                  "e.g., '20% Off Today'",
                                                maxLength: 50,
                                                className:
                                                  "dropdown-promo-input",
                                              }),
                                              s.jsxs("div", {
                                                className: "char-count-small",
                                                children: [J.length, "/30"],
                                              }),
                                            ],
                                          }),
                                          s.jsxs("div", {
                                            className: "promo-toggle-row",
                                            children: [
                                              s.jsxs("label", {
                                                className: "toggle-label-small",
                                                children: [
                                                  s.jsx("input", {
                                                    type: "checkbox",
                                                    checked: m,
                                                    onChange: ($) =>
                                                      q($.target.checked),
                                                  }),
                                                  s.jsx("span", {
                                                    id: "toggle-text-small",
                                                    children:
                                                      "Show in carousel",
                                                  }),
                                                ],
                                              }),
                                              s.jsx("button", {
                                                onClick: d,
                                                id: "save-promo-btn-small",
                                                disabled: !J.trim(),
                                                children: "Save",
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                    s.jsxs("button", {
                                      onClick: () => {
                                        (C(!1), Ne());
                                      },
                                      className: "dropdown-item logout-btn",
                                      children: [
                                        s.jsx("svg", {
                                          xmlns: "http://www.w3.org/2000/svg",
                                          height: "13px",
                                          viewBox: "0 -960 960 960",
                                          width: "13px",
                                          fill: "red",
                                          children: s.jsx("path", {
                                            d: "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z",
                                          }),
                                        }),
                                        s.jsx("span", { children: "Log Out" }),
                                      ],
                                    }),
                                  ],
                                }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  }),
                  s.jsxs("div", {
                    className: "content-wrapper",
                    children: [
                      s.jsx("div", {
                        className: "owner-header",
                        children: s.jsxs("div", {
                          className: "owner-quick-stats",
                          children: [
                            s.jsxs("div", {
                              className: "owner-stat-card",
                              children: [
                                s.jsxs("span", {
                                  className: "owner-stat-value",
                                  children: [
                                    r.current_occupancy,
                                    "/",
                                    r.max_capacity,
                                  ],
                                }),
                                s.jsx("span", {
                                  className: "owner-stat-label",
                                  children: "Current Capacity",
                                }),
                              ],
                            }),
                            s.jsxs("div", {
                              className: "owner-stat-card",
                              children: [
                                s.jsxs("span", {
                                  className: "owner-stat-value",
                                  children: [r.occupancy_percentage, "%"],
                                }),
                                s.jsx("span", {
                                  className: "owner-stat-label",
                                  children: "Occupancy",
                                }),
                              ],
                            }),
                            s.jsxs("div", {
                              className: "owner-stat-card",
                              children: [
                                s.jsx("span", {
                                  className: `owner-stat-value status-${r.crowd_status}`,
                                  children:
                                    r.crowd_status === "green"
                                      ? "Low"
                                      : r.crowd_status === "yellow"
                                        ? "Moderate"
                                        : r.crowd_status === "orange"
                                          ? "Busy"
                                          : "Very High",
                                }),
                                s.jsxs("span", {
                                  className: "owner-stat-label",
                                  children: [
                                    "Crowd ",
                                    s.jsx("br", {}),
                                    "Status",
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      }),
                      s.jsxs("div", {
                        className: "owner-tab-navigation",
                        children: [
                          s.jsx("button", {
                            className: `owner-tab-btn ${L === "overview" ? "active" : ""}`,
                            onClick: () => le("overview"),
                            children: "Overview",
                          }),
                          s.jsx("button", {
                            className: `owner-tab-btn ${L === "menu" ? "active" : ""}`,
                            onClick: () => le("menu"),
                            children: "Menu",
                          }),
                          s.jsx("button", {
                            className: `owner-tab-btn ${L === "reviews" ? "active" : ""}`,
                            onClick: () => le("reviews"),
                            children: "Reviews",
                          }),
                          s.jsx("button", {
                            className: `owner-tab-btn ${L === "photos" ? "active" : ""}`,
                            onClick: () => le("photos"),
                            children: "Photos",
                          }),
                          s.jsx("button", {
                            className: `owner-tab-btn ${L === "reservations" ? "active" : ""}`,
                            onClick: () => le("reservations"),
                            children: "Reservations",
                          }),
                          s.jsx("button", {
                            className: `owner-tab-btn ${L === "analytics" ? "active" : ""} ${Y === "premium" ? "premium-unlocked" : "premium-locked"}`,
                            onClick: () => le("analytics"),
                            title:
                              Y === "basic"
                                ? "Upgrade to Premium to access analytics"
                                : "View analytics",
                            children: "Analytics",
                          }),
                        ],
                      }),
                      s.jsx("div", {
                        className: "owner-tab-content",
                        children: Ja(),
                      }),
                    ],
                  }),
                ],
              })
            : s.jsx("div", {
                className: "setup-prompt",
                children: s.jsxs("div", {
                  className: "restaurant-empty-state",
                  children: [
                    s.jsx("h3", { children: "No Restaurant Setup Yet" }),
                    s.jsx("p", {
                      children:
                        "Set up your restaurant profile to start receiving diners",
                    }),
                    s.jsx("div", {
                      className: "tier-info-prompt",
                      children: s.jsxs("h4", {
                        children: [
                          " ",
                          s.jsx("span", {
                            className: `tier-badge ${Y}`,
                            children: Y === "premium" ? "Premium" : "Free Tier",
                          }),
                        ],
                      }),
                    }),
                    s.jsx("button", {
                      className: "setup-btn",
                      onClick: () => T(!0),
                      children: "Set Up My Restaurant",
                    }),
                  ],
                }),
              }),
          K &&
            s.jsx("div", {
              className: "modal-overlay",
              onClick: () => T(!1),
              children: s.jsxs("div", {
                className: "modal-content",
                onClick: ($) => $.stopPropagation(),
                children: [
                  s.jsx("h3", {
                    children: r ? "Edit Restaurant" : "Setup Restaurant",
                  }),
                  s.jsxs("form", {
                    onSubmit: wa,
                    children: [
                      s.jsxs("div", {
                        className: "form-group",
                        children: [
                          s.jsx("label", { children: "Restaurant Name *" }),
                          s.jsx("input", {
                            type: "text",
                            value: P.name,
                            onChange: ($) => ce({ ...P, name: $.target.value }),
                            placeholder: "Enter restaurant name",
                            required: !0,
                          }),
                        ],
                      }),
                      s.jsxs("div", {
                        className: "form-group",
                        children: [
                          s.jsx("label", { children: "Cuisine Type *" }),
                          s.jsx("input", {
                            type: "text",
                            value: P.cuisine_type,
                            onChange: ($) =>
                              ce({ ...P, cuisine_type: $.target.value }),
                            placeholder: "e.g., Fast Food, Cafe, Filipino",
                            required: !0,
                          }),
                        ],
                      }),
                      s.jsxs("div", {
                        className: "form-group",
                        children: [
                          s.jsx("label", { children: "Address *" }),
                          s.jsx("input", {
                            value: P.address,
                            onChange: ($) =>
                              ce({ ...P, address: $.target.value }),
                            placeholder: "Full address",
                            required: !0,
                            rows: "3",
                          }),
                        ],
                      }),
                      s.jsxs("div", {
                        className: "form-group",
                        children: [
                          s.jsx("label", { children: "Phone Number *" }),
                          s.jsx("input", {
                            type: "tel",
                            value: P.phone,
                            onChange: ($) =>
                              ce({ ...P, phone: $.target.value }),
                            placeholder: "(555) 123-4567",
                            required: !0,
                          }),
                        ],
                      }),
                      s.jsxs("div", {
                        className: "form-group",
                        children: [
                          s.jsx("label", { children: "Operating Hours *" }),
                          s.jsx("input", {
                            type: "text",
                            value: P.hours,
                            onChange: ($) =>
                              ce({ ...P, hours: $.target.value }),
                            placeholder: "e.g., 9AM-10PM, Mon-Sun",
                            required: !0,
                          }),
                        ],
                      }),
                      s.jsxs("div", {
                        className: "form-group",
                        children: [
                          s.jsx("label", { children: "Max Capacity *" }),
                          s.jsx("input", {
                            type: "number",
                            value: P.max_capacity || "",
                            onChange: ($) => {
                              const de = $.target.value;
                              ce({
                                ...P,
                                max_capacity:
                                  de === ""
                                    ? 0
                                    : Math.max(0, parseInt(de) || 0),
                              });
                            },
                            placeholder: "Maximum number of customers",
                            min: "0",
                            required: !0,
                          }),
                        ],
                      }),
                      s.jsxs("div", {
                        className: "form-group",
                        children: [
                          s.jsx("label", { children: "Current Occupancy" }),
                          s.jsx("input", {
                            type: "number",
                            value: P.current_occupancy || "",
                            onChange: ($) => {
                              const de = $.target.value;
                              ce({
                                ...P,
                                current_occupancy:
                                  de === "" ? 0 : Math.max(0, Number(de) || 0),
                              });
                            },
                            placeholder: "Current number of customers",
                            min: "0",
                          }),
                        ],
                      }),
                      s.jsxs("div", {
                        className: "form-group",
                        children: [
                          s.jsx("label", { children: "Features (optional)" }),
                          s.jsx("div", {
                            className: "features-checkboxes",
                            children: [
                              "WiFi",
                              "Parking",
                              "Air Conditioned",
                              "Outdoor Seating",
                              "Takeout",
                              "Delivery",
                            ].map(($, de) =>
                              s.jsxs(
                                "label",
                                {
                                  className: "feature-checkbox",
                                  children: [
                                    " ",
                                    s.jsx("input", {
                                      type: "checkbox",
                                      checked: P.features.includes($),
                                      onChange: (ie) => {
                                        const Ct = ie.target.checked
                                          ? [...P.features, $]
                                          : P.features.filter((Ea) => Ea !== $);
                                        ce({ ...P, features: Ct });
                                      },
                                    }),
                                    s.jsx("span", {
                                      className: "checkbox-label",
                                      children: $,
                                    }),
                                  ],
                                },
                                `feature-${de}`,
                              ),
                            ),
                          }),
                        ],
                      }),
                      s.jsxs("div", {
                        className: "form-actions",
                        children: [
                          s.jsx("button", {
                            type: "button",
                            onClick: () => T(!1),
                            children: "Cancel",
                          }),
                          s.jsx("button", { type: "submit", children: "Save" }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            }),
          j &&
            s.jsx("div", {
              className: "modal-overlay",
              children: s.jsx("div", {
                className: "modal-content verification-modal",
                children: s.jsx(om, {
                  restaurant: r,
                  onRequestSubmitted: () => {
                    we();
                  },
                  onClose: () => N(!1),
                }),
              }),
            }),
          v &&
            s.jsx("div", {
              className: "modal-overlay",
              onClick: () => V(!1),
              children: s.jsxs("div", {
                className: "modal-content",
                onClick: ($) => $.stopPropagation(),
                children: [
                  s.jsx("h3", { children: "Be Featured Now" }),
                  s.jsx("p", {
                    className: "modal-subtitle",
                    children:
                      "Get premium visibility on the homepage! Featured restaurants get 3x more views.",
                  }),
                  s.jsxs("div", {
                    className: "form-group",
                    children: [
                      s.jsx("label", {
                        children: "Why should your restaurant be featured? *",
                      }),
                      s.jsx("textarea", {
                        value: O,
                        onChange: ($) => G($.target.value),
                        placeholder:
                          "Tell diners what makes your restaurant special...",
                        rows: "6",
                        maxLength: "300",
                        required: !0,
                      }),
                      s.jsxs("small", {
                        className: "char-count",
                        children: [O.length, "/300 characters"],
                      }),
                    ],
                  }),
                  s.jsxs("div", {
                    className: "benefits-list",
                    children: [
                      s.jsx("h4", { children: "Featured Benefits:" }),
                      s.jsxs("ul", {
                        children: [
                          s.jsx("li", {
                            children: "Top placement on homepage",
                          }),
                          s.jsx("li", { children: "3x more visibility" }),
                          s.jsx("li", { children: "Special featured badge" }),
                          s.jsx("li", {
                            children: "Custom description display",
                          }),
                          s.jsx("li", {
                            children: "Priority in search results",
                          }),
                        ],
                      }),
                    ],
                  }),
                  s.jsxs("div", {
                    className: "form-actions",
                    children: [
                      s.jsx("button", {
                        type: "button",
                        onClick: () => V(!1),
                        children: "Cancel",
                      }),
                      s.jsx("button", {
                        type: "button",
                        onClick: $e,
                        disabled: !O.trim(),
                        className: "primary-btn",
                        children: "Submit Feature Request",
                      }),
                    ],
                  }),
                ],
              }),
            }),
          Se &&
            s.jsx("div", {
              className: "modal-overlay image-upload-modal",
              onClick: () => He(null),
              children: s.jsxs("div", {
                className: "modal-content",
                onClick: ($) => $.stopPropagation(),
                children: [
                  s.jsxs("div", {
                    className: "modal-header",
                    children: [
                      s.jsx("h3", {
                        children:
                          Se === "profile"
                            ? "Edit Profile Image"
                            : "Edit Banner Image",
                      }),
                      s.jsx("button", {
                        className: "close-modal-btn",
                        onClick: () => He(null),
                        children: "✕",
                      }),
                    ],
                  }),
                  s.jsx(vm, {
                    type: Se,
                    currentImage:
                      Se === "profile"
                        ? r.profile_image || null
                        : r.banner_image || null,
                    onUploadSuccess: ($, de) => {
                      (Z(
                        Se === "profile"
                          ? (ie) => ({ ...ie, profile_image: $ })
                          : (ie) => ({ ...ie, banner_image: $ }),
                      ),
                        He(null),
                        alert(
                          `${Se === "profile" ? "Profile" : "Banner"} image updated!`,
                        ));
                    },
                    restaurantId: r.id,
                  }),
                  s.jsx("div", {
                    className: "modal-actions",
                    children: s.jsx("button", {
                      className: "cancel-btn",
                      onClick: () => He(null),
                      children: "Cancel",
                    }),
                  }),
                ],
              }),
            }),
        ],
      });
}
function Nm({ user: g }) {
  const [j, N] = R.useState("Dashboard"),
    [r, Z] = R.useState([]),
    [K, T] = R.useState([]),
    [U, M] = R.useState([]),
    [v, V] = R.useState([]),
    [O, G] = R.useState(!1),
    [L, le] = R.useState({
      totalRestaurants: 0,
      pendingVerifications: 0,
      totalUsers: 0,
      suspendedRestaurants: 0,
      pendingFeatureRequests: 0,
      featuredRestaurants: 0,
    }),
    H = localStorage.getItem("auth_token"),
    ee = [
      "Dashboard",
      "Verifications",
      "Feature Requests",
      "Restaurants",
      "Users",
    ];
  R.useEffect(() => {
    j === "Dashboard"
      ? me()
      : j === "Verifications"
        ? A()
        : j === "Feature Requests"
          ? (ae(), Y())
          : j === "Restaurants"
            ? P()
            : j === "Users" && Se();
  }, [j]);
  const me = async () => {
      G(!0);
      try {
        const [S, m, q, W] = await Promise.all([
            fetch("http://localhost:8000/api/admin/verification-requests", {
              headers: { Authorization: `Bearer ${H}` },
            }),
            fetch("http://localhost:8000/api/admin/restaurants", {
              headers: { Authorization: `Bearer ${H}` },
            }),
            fetch("http://localhost:8000/api/admin/users", {
              headers: { Authorization: `Bearer ${H}` },
            }),
            fetch("http://localhost:8000/api/admin/feature-requests", {
              headers: { Authorization: `Bearer ${H}` },
            }),
          ]),
          pe = await S.json(),
          ue = await m.json(),
          d = await q.json(),
          E = await W.json(),
          Q = ue.restaurants?.filter((F) => F.is_featured)?.length || 0;
        le({
          totalRestaurants: ue.restaurants?.length || 0,
          pendingVerifications: pe.verification_requests?.length || 0,
          totalUsers: d.users?.length || 0,
          suspendedRestaurants:
            ue.restaurants?.filter((F) => F.is_suspended)?.length || 0,
          pendingFeatureRequests: E.feature_requests?.length || 0,
          featuredRestaurants: Q,
        });
      } catch (S) {
        console.error("Error fetching dashboard stats:", S);
      } finally {
        G(!1);
      }
    },
    ae = async () => {
      G(!0);
      try {
        const m = await (
          await fetch("http://localhost:8000/api/admin/feature-requests", {
            headers: { Authorization: `Bearer ${H}` },
          })
        ).json();
        m.success && V(m.feature_requests || []);
      } catch (S) {
        console.error("Error fetching feature requests:", S);
      } finally {
        G(!1);
      }
    },
    Y = async () => {
      try {
        const m = await (
          await fetch("http://localhost:8000/api/admin/restaurants", {
            headers: { Authorization: `Bearer ${H}` },
          })
        ).json();
        if (m.success) {
          const q = m.restaurants?.filter((W) => W.is_featured)?.length || 0;
          le((W) => ({ ...W, featuredRestaurants: q }));
        }
      } catch (S) {
        console.error("Error fetching featured count:", S);
      }
    },
    X = async (S, m) => {
      if (L.featuredRestaurants >= 10) {
        alert(
          "❌ Maximum of 10 featured restaurants reached! Please remove some before adding new ones.",
        );
        return;
      }
      if (
        confirm(
          "Approve this feature request? The restaurant will appear in featured section.",
        )
      )
        try {
          const W = await (
            await fetch(
              `http://localhost:8000/api/admin/approve-feature-request/${S}`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${H}`,
                  Accept: "application/json",
                },
              },
            )
          ).json();
          W.success
            ? (alert("  Feature request approved! Restaurant is now featured."),
              ae(),
              Y())
            : alert("Failed to approve: " + (W.message || "Unknown error"));
        } catch (q) {
          (console.error("Error approving feature:", q),
            alert("Failed to approve feature request. Please try again."));
        }
    },
    B = async (S) => {
      if (confirm("Are you sure you want to reject this feature request?"))
        try {
          const q = await (
            await fetch(
              `http://localhost:8000/api/admin/reject-feature-request/${S}`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${H}`,
                  Accept: "application/json",
                },
              },
            )
          ).json();
          q.success
            ? (alert("❌ Feature request rejected."), ae())
            : alert("Failed to reject: " + (q.message || "Unknown error"));
        } catch (m) {
          (console.error("Error rejecting feature:", m),
            alert("Failed to reject feature request. Please try again."));
        }
    },
    C = async (S) => {
      if (confirm("Remove this restaurant from featured section?"))
        try {
          const q = await (
            await fetch(`http://localhost:8000/api/restaurants/${S}`)
          ).json();
          q.success &&
            (
              await (
                await fetch("http://localhost:8000/api/restaurant/save", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${H}`,
                  },
                  body: JSON.stringify({
                    ...q.restaurant,
                    is_featured: !1,
                    featured_description: null,
                  }),
                })
              ).json()
            ).success &&
            (alert("  Restaurant removed from featured section."), ae(), Y());
        } catch (m) {
          console.error("Error removing from featured:", m);
        }
    },
    A = async () => {
      G(!0);
      try {
        const m = await (
          await fetch("http://localhost:8000/api/admin/verification-requests", {
            headers: { Authorization: `Bearer ${H}` },
          })
        ).json();
        m.success && Z(m.verification_requests || []);
      } catch (S) {
        console.error("Error fetching verification requests:", S);
      } finally {
        G(!1);
      }
    },
    D = async (S) => {
      try {
        (
          await (
            await fetch(
              `http://localhost:8000/api/admin/verify-restaurant/${S}`,
              { method: "POST", headers: { Authorization: `Bearer ${H}` } },
            )
          ).json()
        ).success && (alert("  Verification approved!"), A());
      } catch (m) {
        console.error("Error approving verification:", m);
      }
    },
    k = async (S) => {
      const m = prompt("Please enter reason for rejection:");
      if (m)
        try {
          (
            await (
              await fetch(
                `http://localhost:8000/api/admin/reject-verification/${S}`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${H}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ reason: m }),
                },
              )
            ).json()
          ).success && (alert("❌ Verification rejected."), A());
        } catch (q) {
          console.error("Error rejecting verification:", q);
        }
    },
    P = async () => {
      G(!0);
      try {
        const m = await (
          await fetch("http://localhost:8000/api/admin/restaurants", {
            headers: { Authorization: `Bearer ${H}` },
          })
        ).json();
        m.success && T(m.restaurants || []);
      } catch (S) {
        console.error("Error fetching restaurants:", S);
      } finally {
        G(!1);
      }
    },
    ce = async (S, m) => {
      const q = m ? "unsuspend" : "suspend",
        W = m ? null : prompt("Enter suspension reason:");
      if (!(!m && !W))
        try {
          (
            await (
              await fetch(
                `http://localhost:8000/api/admin/suspend-restaurant/${S}`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${H}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ suspend: !m, reason: W || "" }),
                },
              )
            ).json()
          ).success && (alert(`  Restaurant ${q}ed.`), P());
        } catch (pe) {
          console.error("Error toggling suspension:", pe);
        }
    },
    Se = async () => {
      G(!0);
      try {
        const m = await (
          await fetch("http://localhost:8000/api/admin/users", {
            headers: { Authorization: `Bearer ${H}` },
          })
        ).json();
        m.success && M(m.users || []);
      } catch (S) {
        console.error("Error fetching users:", S);
      } finally {
        G(!1);
      }
    },
    He = () => {
      (localStorage.removeItem("auth_token"),
        localStorage.removeItem("user"),
        window.location.reload());
    },
    J = (S) =>
      S
        ? new Date(S).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "N/A";
  return s.jsxs("div", {
    className: "admin-panel",
    children: [
      s.jsxs("div", {
        className: "admin-header",
        children: [
          s.jsx("h1", { children: "EatEase Admin Panel" }),
          s.jsx("div", {
            className: "admin-info",
            children: s.jsx("button", {
              onClick: He,
              className: "logout-btn",
              children: "Logout",
            }),
          }),
        ],
      }),
      s.jsx("div", {
        className: "admin-tabs",
        children: ee.map((S) =>
          s.jsx(
            "button",
            {
              className: `tab-btn ${j === S ? "active" : ""}`,
              onClick: () => N(S),
              children: S,
            },
            S,
          ),
        ),
      }),
      s.jsxs("div", {
        className: "admin-content",
        children: [
          O &&
            s.jsx("div", {
              className: "loading-overlay",
              children: s.jsx("p", { children: "Loading..." }),
            }),
          j === "Dashboard" &&
            s.jsxs("div", {
              className: "dashboard",
              children: [
                s.jsx("h2", { children: "Overview" }),
                s.jsxs("div", {
                  className: "stats-grid",
                  children: [
                    s.jsxs("div", {
                      className: "stat-card",
                      children: [
                        s.jsx("div", {
                          className: "stat-number",
                          children: L.totalRestaurants,
                        }),
                        s.jsx("div", {
                          className: "stat-label",
                          children: "Total Restaurants",
                        }),
                      ],
                    }),
                    s.jsxs("div", {
                      className: "stat-card",
                      children: [
                        s.jsx("div", {
                          className: "stat-number",
                          children: L.pendingVerifications,
                        }),
                        s.jsx("div", {
                          className: "stat-label",
                          children: "Pending Verifications",
                        }),
                      ],
                    }),
                    s.jsxs("div", {
                      className: "stat-card",
                      children: [
                        s.jsx("div", {
                          className: "stat-number",
                          children: L.pendingFeatureRequests,
                        }),
                        s.jsx("div", {
                          className: "stat-label",
                          children: "Pending Feature Requests",
                        }),
                      ],
                    }),
                    s.jsxs("div", {
                      className: "stat-card",
                      children: [
                        s.jsxs("div", {
                          className: "stat-number",
                          children: [L.featuredRestaurants, "/10"],
                        }),
                        s.jsx("div", {
                          className: "stat-label",
                          children: "Featured Restaurants",
                        }),
                      ],
                    }),
                    s.jsxs("div", {
                      className: "stat-card",
                      children: [
                        s.jsx("div", {
                          className: "stat-number",
                          children: L.totalUsers,
                        }),
                        s.jsx("div", {
                          className: "stat-label",
                          children: "Total Users",
                        }),
                      ],
                    }),
                    s.jsxs("div", {
                      className: "stat-card",
                      children: [
                        s.jsx("div", {
                          className: "stat-number",
                          children: L.suspendedRestaurants,
                        }),
                        s.jsx("div", {
                          className: "stat-label",
                          children: "Suspended Restaurants",
                        }),
                      ],
                    }),
                  ],
                }),
                L.featuredRestaurants >= 8 &&
                  s.jsx("div", {
                    className: `limit-warning ${L.featuredRestaurants >= 10 ? "danger" : "warning"}`,
                    children:
                      L.featuredRestaurants >= 10
                        ? "❌ MAXIMUM REACHED: 10/10 featured restaurants. Remove some before adding new ones."
                        : `⚠️ WARNING: ${L.featuredRestaurants}/10 featured restaurants. ${10 - L.featuredRestaurants} spots remaining.`,
                  }),
              ],
            }),
          j === "Feature Requests" &&
            s.jsxs("div", {
              className: "feature-requests-section",
              children: [
                s.jsxs("div", {
                  className: "section-header",
                  children: [
                    s.jsx("h2", { children: "Feature Requests" }),
                    s.jsxs("div", {
                      className: "header-info",
                      children: [
                        s.jsxs("span", {
                          className: "featured-count",
                          children: [
                            "Featured: ",
                            s.jsxs("strong", {
                              children: [L.featuredRestaurants, "/10"],
                            }),
                          ],
                        }),
                        s.jsx("button", {
                          onClick: ae,
                          className: "admin-refresh-btn",
                          children: "Refresh",
                        }),
                      ],
                    }),
                  ],
                }),
                v.length === 0
                  ? s.jsx("div", {
                      className: "empty-state",
                      children: s.jsx("h3", {
                        children: "No Pending Requests",
                      }),
                    })
                  : s.jsx("div", {
                      className: "requests-container",
                      children: s.jsx("div", {
                        className: "requests-list",
                        children: v.map((S) =>
                          s.jsxs(
                            "div",
                            {
                              className: "request-card",
                              children: [
                                s.jsxs("div", {
                                  className: "request-header",
                                  children: [
                                    s.jsx("h4", {
                                      children: S.restaurant_name,
                                    }),
                                    s.jsxs("div", {
                                      className: "request-meta",
                                      children: [
                                        s.jsxs("span", {
                                          className: "owner-info",
                                          children: [
                                            "Owner: ",
                                            s.jsx("strong", {
                                              children: S.owner_name,
                                            }),
                                            " (",
                                            S.owner_email,
                                            ")",
                                          ],
                                        }),
                                        s.jsxs("span", {
                                          className: "request-date",
                                          children: [
                                            "Submitted: ",
                                            J(S.submitted_at),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                s.jsxs("div", {
                                  className: "request-details",
                                  children: [
                                    s.jsxs("p", {
                                      children: [
                                        s.jsx("strong", {
                                          children: "Cuisine:",
                                        }),
                                        " ",
                                        S.cuisine,
                                      ],
                                    }),
                                    s.jsxs("div", {
                                      className: "featured-description-box",
                                      children: [
                                        s.jsx("strong", {
                                          children: "Featured Description:",
                                        }),
                                        s.jsxs("p", {
                                          className: "description-text",
                                          children: [
                                            '"',
                                            S.featured_description,
                                            '"',
                                          ],
                                        }),
                                      ],
                                    }),
                                    S.restaurant_is_featured &&
                                      s.jsxs("div", {
                                        className: "already-featured-badge",
                                        children: [
                                          s.jsx("span", {
                                            className: "badge-icon",
                                            children: " ",
                                          }),
                                          s.jsx("span", {
                                            className: "badge-text",
                                            children: "CURRENTLY FEATURED",
                                          }),
                                        ],
                                      }),
                                  ],
                                }),
                                s.jsx("div", {
                                  className: "request-actions",
                                  children: S.restaurant_is_featured
                                    ? s.jsx("button", {
                                        className: "remove-featured-btn",
                                        onClick: () => C(S.restaurant_id),
                                        children: "Remove From Featured",
                                      })
                                    : s.jsxs(s.Fragment, {
                                        children: [
                                          s.jsx("button", {
                                            className: "approve-btn",
                                            onClick: () =>
                                              X(S.id, S.restaurant_id),
                                            disabled:
                                              L.featuredRestaurants >= 10,
                                            title:
                                              L.featuredRestaurants >= 10
                                                ? "Max 10 featured restaurants reached"
                                                : "",
                                            children: "Approve",
                                          }),
                                          s.jsx("button", {
                                            className: "reject-btn",
                                            onClick: () => B(S.id),
                                            children: "Reject",
                                          }),
                                        ],
                                      }),
                                }),
                              ],
                            },
                            S.id,
                          ),
                        ),
                      }),
                    }),
                s.jsxs("div", {
                  className: "featured-restaurants-section",
                  children: [
                    s.jsx("h3", { children: "Currently Featured Restaurants" }),
                    K.filter((S) => S.is_featured).length === 0
                      ? s.jsx("div", {
                          className: "empty-state",
                          children: s.jsx("p", {
                            children: "No Restaurants Are Featured.",
                          }),
                        })
                      : s.jsx("div", {
                          className: "featured-list",
                          children: K.filter((S) => S.is_featured).map((S) =>
                            s.jsxs(
                              "div",
                              {
                                className: "featured-item",
                                children: [
                                  s.jsxs("div", {
                                    className: "featured-info",
                                    children: [
                                      s.jsx("h4", { children: S.name }),
                                      s.jsxs("p", {
                                        className: "featured-description",
                                        children: [
                                          '"',
                                          S.featured_description ||
                                            "No description",
                                          '"',
                                        ],
                                      }),
                                      s.jsxs("p", {
                                        className: "featured-meta",
                                        children: [
                                          "Owner: ",
                                          S.owner_name,
                                          " • Added: ",
                                          J(S.updated_at),
                                        ],
                                      }),
                                    ],
                                  }),
                                  s.jsx("button", {
                                    className: "remove-btn",
                                    onClick: () => C(S.id),
                                    children: "Remove",
                                  }),
                                ],
                              },
                              S.id,
                            ),
                          ),
                        }),
                  ],
                }),
              ],
            }),
          j === "Verifications" &&
            s.jsxs("div", {
              className: "admin-section",
              children: [
                s.jsx("h2", { children: "Verification Requests" }),
                s.jsxs("div", {
                  className: "section-header",
                  children: [
                    s.jsx("p", {
                      children: "Restaurants requesting verification",
                    }),
                    s.jsx("button", {
                      onClick: A,
                      className: "admin-refresh-btn",
                      children: "Refresh",
                    }),
                  ],
                }),
                r.length === 0
                  ? s.jsx("div", {
                      className: "empty-state",
                      children: s.jsx("p", {
                        children: "No pending verification requests",
                      }),
                    })
                  : s.jsx("div", {
                      className: "requests-list",
                      children: r.map((S) =>
                        s.jsxs(
                          "div",
                          {
                            className: "request-card",
                            children: [
                              s.jsx("h4", { children: S.restaurant_name }),
                              s.jsxs("p", {
                                children: [
                                  "Owner: ",
                                  S.owner_name,
                                  " (",
                                  S.owner_email,
                                  ")",
                                ],
                              }),
                              s.jsxs("p", {
                                children: ["Cuisine: ", S.cuisine],
                              }),
                              s.jsxs("div", {
                                className: "verification-reason",
                                children: [
                                  s.jsx("strong", {
                                    children: "Verification Reason:",
                                  }),
                                  s.jsx("p", {
                                    children: S.verification_request,
                                  }),
                                ],
                              }),
                              s.jsxs("div", {
                                className: "request-actions",
                                children: [
                                  s.jsx("button", {
                                    className: "approve-btn",
                                    onClick: () => D(S.restaurant_id),
                                    children: "Approve",
                                  }),
                                  s.jsx("button", {
                                    className: "reject-btn",
                                    onClick: () => k(S.restaurant_id),
                                    children: "Reject",
                                  }),
                                ],
                              }),
                            ],
                          },
                          S.id,
                        ),
                      ),
                    }),
              ],
            }),
          j === "Restaurants" &&
            s.jsxs("div", {
              className: "admin-section",
              children: [
                s.jsx("h2", { children: "Restaurants" }),
                s.jsx("div", {
                  className: "section-header",
                  children: s.jsx("button", {
                    onClick: P,
                    className: "admin-refresh-btn",
                    children: "Refresh",
                  }),
                }),
                K.length === 0
                  ? s.jsx("div", {
                      className: "empty-state",
                      children: s.jsx("p", {
                        children: "No restaurants found",
                      }),
                    })
                  : s.jsx("div", {
                      className: "restaurants-list",
                      children: K.map((S) =>
                        s.jsxs(
                          "div",
                          {
                            className: "restaurant-card",
                            children: [
                              s.jsxs("h4", {
                                children: [S.name, " ", S.is_verified && " "],
                              }),
                              s.jsxs("p", {
                                children: ["Owner: ", S.owner_name],
                              }),
                              s.jsxs("p", {
                                children: ["Cuisine: ", S.cuisine_type],
                              }),
                              s.jsxs("p", {
                                children: [
                                  "Status: ",
                                  s.jsx("span", {
                                    className: `status-${S.crowd_status}`,
                                    children: S.crowd_status,
                                  }),
                                ],
                              }),
                              s.jsxs("div", {
                                className: "restaurant-actions",
                                children: [
                                  S.is_featured &&
                                    s.jsx("span", {
                                      className: "featured-badge",
                                      children: "🌟 Featured",
                                    }),
                                  s.jsx("button", {
                                    className: S.is_suspended
                                      ? "unsuspend-btn"
                                      : "suspend-btn",
                                    onClick: () => ce(S.id, S.is_suspended),
                                    children: S.is_suspended
                                      ? "Unsuspend"
                                      : "Suspend",
                                  }),
                                ],
                              }),
                            ],
                          },
                          S.id,
                        ),
                      ),
                    }),
              ],
            }),
          j === "Users" &&
            s.jsxs("div", {
              className: "admin-section",
              children: [
                s.jsx("div", {
                  className: "section-header",
                  children: s.jsx("button", {
                    onClick: Se,
                    className: "admin-refresh-btn",
                    children: "Refresh",
                  }),
                }),
                U.length === 0
                  ? s.jsx("div", {
                      className: "empty-state",
                      children: s.jsx("p", { children: "No users found" }),
                    })
                  : s.jsx("div", {
                      className: "users-list",
                      children: U.map((S) =>
                        s.jsxs(
                          "div",
                          {
                            className: "user-card",
                            children: [
                              s.jsx("h4", { children: S.name }),
                              s.jsxs("p", { children: ["Email: ", S.email] }),
                              s.jsxs("p", {
                                children: [
                                  "Type: ",
                                  s.jsx("span", {
                                    className: `user-type ${S.user_type}`,
                                    children: S.user_type,
                                  }),
                                ],
                              }),
                              s.jsxs("p", {
                                children: ["Joined: ", J(S.created_at)],
                              }),
                            ],
                          },
                          S.id,
                        ),
                      ),
                    }),
              ],
            }),
        ],
      }),
    ],
  });
}
function _m() {
  const [g, j] = R.useState(null),
    [N, r] = R.useState(!0),
    [Z, K] = R.useState(!0),
    [T, U] = R.useState("restaurantList");
  (R.useEffect(() => {
    (() => {
      const le = localStorage.getItem("auth_token"),
        H = localStorage.getItem("user");
      (le && H && j(JSON.parse(H)), r(!1));
    })();
  }, []),
    R.useEffect(() => {
      let L = localStorage.getItem("auth_token");
      const le = setInterval(() => {
        const H = localStorage.getItem("auth_token");
        L !== H &&
          (console.log("🔍 TOKEN CHANGED!"),
          console.log("Was:", L ? "Exists" : "Missing"),
          console.log("Now:", H ? "Exists" : "Missing"),
          console.log("Stack trace:", new Error().stack),
          (L = H));
      }, 1e3);
      return () => clearInterval(le);
    }, []));
  const M = (L) => {
      (console.log("  Login successful:", {
        name: L.name,
        user_type: L.user_type,
        is_admin: L.is_admin,
      }),
        j(L),
        U("restaurantList"));
    },
    v = (L) => {
      (console.log("  Signup successful:", {
        name: L.name,
        user_type: L.user_type,
        is_admin: L.is_admin,
      }),
        j(L),
        U("restaurantList"));
    },
    V = () => {
      U("bookmarks");
    },
    O = () => {
      U("notifications");
    },
    G = () => {
      U("restaurantList");
    };
  if (N)
    return s.jsx("div", {
      className: "app",
      children: s.jsx("p", { children: "Loading..." }),
    });
  if (!g)
    return s.jsx("div", {
      className: "app",
      children: Z
        ? s.jsx(um, { onLogin: M, onSwitchToSignup: () => K(!1) })
        : s.jsx(rm, { onSignup: v, onSwitchToLogin: () => K(!0) }),
    });
  if (
    (console.log("🎯 APP ROUTING WITH USER:", {
      id: g.id,
      name: g.name,
      user_type: g.user_type,
      is_admin: g.is_admin,
      currentPage: T,
    }),
    g.is_admin === !0 || g.is_admin === 1)
  )
    return (
      console.log("🛡️ Routing: ADMIN → AdminPanel"),
      s.jsx("div", { className: "app", children: s.jsx(Nm, { user: g }) })
    );
  if (g.user_type === "restaurant_owner")
    return (
      console.log("🏪 Routing: RESTAURANT OWNER → RestaurantOwnerDashboard"),
      s.jsx("div", { className: "app", children: s.jsx(Sm, { user: g }) })
    );
  if (g.user_type === "diner")
    switch ((console.log("🍽️ Routing: DINER → " + T), T)) {
      case "bookmarks":
        return s.jsx("div", {
          className: "app",
          children: s.jsx(BookmarksPage, { user: g, onBack: G }),
        });
      case "notifications":
        return s.jsx("div", {
          className: "app",
          children: s.jsx(NotificationsPage, { user: g, onBack: G }),
        });
      default:
        return s.jsx("div", {
          className: "app",
          children: s.jsx(RestaurantList, {
            user: g,
            onNavigateToBookmarks: V,
            onNavigateToNotifications: O,
          }),
        });
    }
  return (
    console.log(
      "⚠️ Unknown user_type, defaulting to RestaurantList:",
      g.user_type,
    ),
    s.jsx("div", {
      className: "app",
      children: s.jsx(RestaurantList, {
        user: g,
        onNavigateToBookmarks: V,
        onNavigateToNotifications: O,
      }),
    })
  );
}
cm.createRoot(document.getElementById("root")).render(
  s.jsx(P0.StrictMode, { children: s.jsx(_m, {}) }),
);
