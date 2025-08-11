var ig = Object.defineProperty;
var Hf = (r) => {
  throw TypeError(r);
};
var sg = (r, e, t) => e in r ? ig(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var Le = (r, e, t) => sg(r, typeof e != "symbol" ? e + "" : e, t), Fc = (r, e, t) => e.has(r) || Hf("Cannot " + t);
var $ = (r, e, t) => (Fc(r, e, "read from private field"), t ? t.call(r) : e.get(r)), rr = (r, e, t) => e.has(r) ? Hf("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(r) : e.set(r, t), It = (r, e, t, n) => (Fc(r, e, "write to private field"), n ? n.call(r, t) : e.set(r, t), t), Ue = (r, e, t) => (Fc(r, e, "access private method"), t);
var Ff = (r, e, t, n) => ({
  set _(i) {
    It(r, e, i, t);
  },
  get _() {
    return $(r, e, n);
  }
});
import { jsx as Dd } from "react/jsx-runtime";
import { createContext as $d, useState as al, useEffect as Ns, useContext as Md } from "react";
let oi = null;
function og(r) {
  if (!r.apiUrl || r.apiUrl.trim() === "")
    throw new Error("OpenSecret SDK requires a non-empty apiUrl");
  if (!r.clientId || r.clientId.trim() === "")
    throw new Error("OpenSecret SDK requires a non-empty clientId");
  oi = {
    apiUrl: r.apiUrl.replace(/\/$/, ""),
    // Remove trailing slash
    clientId: r.clientId
  }, Promise.resolve().then(() => mw).then(({ setApiUrl: e }) => {
    e(oi.apiUrl);
  }), Promise.resolve().then(() => Vd).then(({ apiConfig: e }) => {
    const t = e.platformApiUrl || "";
    e.configure(oi.apiUrl, t);
  });
}
function fn() {
  if (!oi)
    throw new Error(
      "OpenSecret SDK not configured. Please call configure() with your apiUrl and clientId first."
    );
  return oi;
}
function Pw() {
  return oi !== null;
}
function jw() {
  oi = null;
}
class ag {
  constructor() {
    Le(this, "_appApiUrl", "");
    Le(this, "_platformApiUrl", "");
  }
  /**
   * Configure the API URLs for both app and platform contexts
   */
  configure(e, t) {
    this._appApiUrl = e, this._platformApiUrl = t;
  }
  /**
   * Get the platform API URL
   */
  get platformApiUrl() {
    return this._platformApiUrl;
  }
  /**
   * Get the app API URL
   */
  get appApiUrl() {
    return this._appApiUrl;
  }
  /**
   * Determine if a path is for the platform context
   */
  isPlatformPath(e) {
    return e.includes("/platform/");
  }
  /**
   * Get the API endpoint for a given path
   */
  resolveEndpoint(e) {
    const t = this.isPlatformPath(e);
    return {
      baseUrl: t ? this._platformApiUrl : this._appApiUrl,
      context: t ? "platform" : "app"
    };
  }
  /**
   * Build a complete URL for an API path
   */
  buildUrl(e) {
    if (e.startsWith("http"))
      return e;
    const t = this.resolveEndpoint(e), n = t.baseUrl.endsWith("/") ? t.baseUrl.slice(0, -1) : t.baseUrl, i = e.startsWith("/") ? e : `/${e}`;
    return `${n}${i}`;
  }
  /**
   * Get the appropriate refresh token function name for a given path
   */
  getRefreshFunction(e) {
    return this.isPlatformPath(e) ? "platformRefreshToken" : "refreshToken";
  }
}
const Ko = new ag(), Vd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  apiConfig: Ko
}, Symbol.toStringTag, { value: "Module" })), hr = 256;
class cg {
  // TODO(dchest): methods to encode chunk-by-chunk.
  constructor(e = "=") {
    Le(this, "_paddingCharacter");
    this._paddingCharacter = e;
  }
  encodedLength(e) {
    return this._paddingCharacter ? (e + 2) / 3 * 4 | 0 : (e * 8 + 5) / 6 | 0;
  }
  encode(e) {
    let t = "", n = 0;
    for (; n < e.length - 2; n += 3) {
      let s = e[n] << 16 | e[n + 1] << 8 | e[n + 2];
      t += this._encodeByte(s >>> 3 * 6 & 63), t += this._encodeByte(s >>> 2 * 6 & 63), t += this._encodeByte(s >>> 1 * 6 & 63), t += this._encodeByte(s >>> 0 * 6 & 63);
    }
    const i = e.length - n;
    if (i > 0) {
      let s = e[n] << 16 | (i === 2 ? e[n + 1] << 8 : 0);
      t += this._encodeByte(s >>> 3 * 6 & 63), t += this._encodeByte(s >>> 2 * 6 & 63), i === 2 ? t += this._encodeByte(s >>> 1 * 6 & 63) : t += this._paddingCharacter || "", t += this._paddingCharacter || "";
    }
    return t;
  }
  maxDecodedLength(e) {
    return this._paddingCharacter ? e / 4 * 3 | 0 : (e * 6 + 7) / 8 | 0;
  }
  decodedLength(e) {
    return this.maxDecodedLength(e.length - this._getPaddingLength(e));
  }
  decode(e) {
    if (e.length === 0)
      return new Uint8Array(0);
    const t = this._getPaddingLength(e), n = e.length - t, i = new Uint8Array(this.maxDecodedLength(n));
    let s = 0, o = 0, c = 0, u = 0, h = 0, m = 0, x = 0;
    for (; o < n - 4; o += 4)
      u = this._decodeChar(e.charCodeAt(o + 0)), h = this._decodeChar(e.charCodeAt(o + 1)), m = this._decodeChar(e.charCodeAt(o + 2)), x = this._decodeChar(e.charCodeAt(o + 3)), i[s++] = u << 2 | h >>> 4, i[s++] = h << 4 | m >>> 2, i[s++] = m << 6 | x, c |= u & hr, c |= h & hr, c |= m & hr, c |= x & hr;
    if (o < n - 1 && (u = this._decodeChar(e.charCodeAt(o)), h = this._decodeChar(e.charCodeAt(o + 1)), i[s++] = u << 2 | h >>> 4, c |= u & hr, c |= h & hr), o < n - 2 && (m = this._decodeChar(e.charCodeAt(o + 2)), i[s++] = h << 4 | m >>> 2, c |= m & hr), o < n - 3 && (x = this._decodeChar(e.charCodeAt(o + 3)), i[s++] = m << 6 | x, c |= x & hr), c !== 0)
      throw new Error("Base64Coder: incorrect characters for decoding");
    return i;
  }
  // Standard encoding have the following encoded/decoded ranges,
  // which we need to convert between.
  //
  // ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789  +   /
  // Index:   0 - 25                    26 - 51              52 - 61   62  63
  // ASCII:  65 - 90                    97 - 122             48 - 57   43  47
  //
  // Encode 6 bits in b into a new character.
  _encodeByte(e) {
    let t = e;
    return t += 65, t += 25 - e >>> 8 & 6, t += 51 - e >>> 8 & -75, t += 61 - e >>> 8 & -15, t += 62 - e >>> 8 & 3, String.fromCharCode(t);
  }
  // Decode a character code into a byte.
  // Must return 256 if character is out of alphabet range.
  _decodeChar(e) {
    let t = hr;
    return t += (42 - e & e - 44) >>> 8 & -hr + e - 43 + 62, t += (46 - e & e - 48) >>> 8 & -hr + e - 47 + 63, t += (47 - e & e - 58) >>> 8 & -hr + e - 48 + 52, t += (64 - e & e - 91) >>> 8 & -hr + e - 65 + 0, t += (96 - e & e - 123) >>> 8 & -hr + e - 97 + 26, t;
  }
  _getPaddingLength(e) {
    let t = 0;
    if (this._paddingCharacter) {
      for (let n = e.length - 1; n >= 0 && e[n] === this._paddingCharacter; n--)
        t++;
      if (e.length < 4 || t > 2)
        throw new Error("Base64Coder: incorrect padding");
    }
    return t;
  }
}
const Ld = new cg();
function Br(r) {
  return Ld.encode(r);
}
function Ds(r) {
  return Ld.decode(r);
}
function Gt(r, e = new Uint8Array(4), t = 0) {
  return e[t + 0] = r >>> 0, e[t + 1] = r >>> 8, e[t + 2] = r >>> 16, e[t + 3] = r >>> 24, e;
}
function zf(r, e = new Uint8Array(8), t = 0) {
  return Gt(r >>> 0, e, t), Gt(r / 4294967296 >>> 0, e, t + 4), e;
}
function Cr(r) {
  for (let e = 0; e < r.length; e++)
    r[e] = 0;
  return r;
}
const lg = 20;
function ug(r, e, t) {
  let n = 1634760805, i = 857760878, s = 2036477234, o = 1797285236, c = t[3] << 24 | t[2] << 16 | t[1] << 8 | t[0], u = t[7] << 24 | t[6] << 16 | t[5] << 8 | t[4], h = t[11] << 24 | t[10] << 16 | t[9] << 8 | t[8], m = t[15] << 24 | t[14] << 16 | t[13] << 8 | t[12], x = t[19] << 24 | t[18] << 16 | t[17] << 8 | t[16], G = t[23] << 24 | t[22] << 16 | t[21] << 8 | t[20], N = t[27] << 24 | t[26] << 16 | t[25] << 8 | t[24], v = t[31] << 24 | t[30] << 16 | t[29] << 8 | t[28], A = e[3] << 24 | e[2] << 16 | e[1] << 8 | e[0], O = e[7] << 24 | e[6] << 16 | e[5] << 8 | e[4], I = e[11] << 24 | e[10] << 16 | e[9] << 8 | e[8], P = e[15] << 24 | e[14] << 16 | e[13] << 8 | e[12], R = n, ce = i, ze = s, Je = o, Pe = c, re = u, pe = h, we = m, Ge = x, bt = G, Tt = N, Et = v, ht = A, Qe = O, se = I, _e = P;
  for (let yt = 0; yt < lg; yt += 2)
    R = R + Pe | 0, ht ^= R, ht = ht >>> 16 | ht << 16, Ge = Ge + ht | 0, Pe ^= Ge, Pe = Pe >>> 20 | Pe << 12, ce = ce + re | 0, Qe ^= ce, Qe = Qe >>> 16 | Qe << 16, bt = bt + Qe | 0, re ^= bt, re = re >>> 20 | re << 12, ze = ze + pe | 0, se ^= ze, se = se >>> 16 | se << 16, Tt = Tt + se | 0, pe ^= Tt, pe = pe >>> 20 | pe << 12, Je = Je + we | 0, _e ^= Je, _e = _e >>> 16 | _e << 16, Et = Et + _e | 0, we ^= Et, we = we >>> 20 | we << 12, ze = ze + pe | 0, se ^= ze, se = se >>> 24 | se << 8, Tt = Tt + se | 0, pe ^= Tt, pe = pe >>> 25 | pe << 7, Je = Je + we | 0, _e ^= Je, _e = _e >>> 24 | _e << 8, Et = Et + _e | 0, we ^= Et, we = we >>> 25 | we << 7, ce = ce + re | 0, Qe ^= ce, Qe = Qe >>> 24 | Qe << 8, bt = bt + Qe | 0, re ^= bt, re = re >>> 25 | re << 7, R = R + Pe | 0, ht ^= R, ht = ht >>> 24 | ht << 8, Ge = Ge + ht | 0, Pe ^= Ge, Pe = Pe >>> 25 | Pe << 7, R = R + re | 0, _e ^= R, _e = _e >>> 16 | _e << 16, Tt = Tt + _e | 0, re ^= Tt, re = re >>> 20 | re << 12, ce = ce + pe | 0, ht ^= ce, ht = ht >>> 16 | ht << 16, Et = Et + ht | 0, pe ^= Et, pe = pe >>> 20 | pe << 12, ze = ze + we | 0, Qe ^= ze, Qe = Qe >>> 16 | Qe << 16, Ge = Ge + Qe | 0, we ^= Ge, we = we >>> 20 | we << 12, Je = Je + Pe | 0, se ^= Je, se = se >>> 16 | se << 16, bt = bt + se | 0, Pe ^= bt, Pe = Pe >>> 20 | Pe << 12, ze = ze + we | 0, Qe ^= ze, Qe = Qe >>> 24 | Qe << 8, Ge = Ge + Qe | 0, we ^= Ge, we = we >>> 25 | we << 7, Je = Je + Pe | 0, se ^= Je, se = se >>> 24 | se << 8, bt = bt + se | 0, Pe ^= bt, Pe = Pe >>> 25 | Pe << 7, ce = ce + pe | 0, ht ^= ce, ht = ht >>> 24 | ht << 8, Et = Et + ht | 0, pe ^= Et, pe = pe >>> 25 | pe << 7, R = R + re | 0, _e ^= R, _e = _e >>> 24 | _e << 8, Tt = Tt + _e | 0, re ^= Tt, re = re >>> 25 | re << 7;
  Gt(R + n | 0, r, 0), Gt(ce + i | 0, r, 4), Gt(ze + s | 0, r, 8), Gt(Je + o | 0, r, 12), Gt(Pe + c | 0, r, 16), Gt(re + u | 0, r, 20), Gt(pe + h | 0, r, 24), Gt(we + m | 0, r, 28), Gt(Ge + x | 0, r, 32), Gt(bt + G | 0, r, 36), Gt(Tt + N | 0, r, 40), Gt(Et + v | 0, r, 44), Gt(ht + A | 0, r, 48), Gt(Qe + O | 0, r, 52), Gt(se + I | 0, r, 56), Gt(_e + P | 0, r, 60);
}
function cl(r, e, t, n, i = 0) {
  if (r.length !== 32)
    throw new Error("ChaCha: key size must be 32 bytes");
  if (n.length < t.length)
    throw new Error("ChaCha: destination is shorter than source");
  let s, o;
  if (i === 0) {
    if (e.length !== 8 && e.length !== 12)
      throw new Error("ChaCha nonce must be 8 or 12 bytes");
    s = new Uint8Array(16), o = s.length - e.length, s.set(e, o);
  } else {
    if (e.length !== 16)
      throw new Error("ChaCha nonce with counter must be 16 bytes");
    s = e, o = i;
  }
  const c = new Uint8Array(64);
  for (let u = 0; u < t.length; u += 64) {
    ug(c, s, r);
    for (let h = u; h < u + 64 && h < t.length; h++)
      n[h] = t[h] ^ c[h - u];
    fg(s, 0, o);
  }
  return Cr(c), i === 0 && Cr(s), n;
}
function Gf(r, e, t, n = 0) {
  return Cr(t), cl(r, e, t, t, n);
}
function fg(r, e, t) {
  let n = 1;
  for (; t--; )
    n = n + (r[e] & 255) | 0, r[e] = n & 255, n >>>= 8, e++;
  if (n > 0)
    throw new Error("ChaCha: counter overflow");
}
function hg(r, e) {
  if (r.length !== e.length)
    return 0;
  let t = 0;
  for (let n = 0; n < r.length; n++)
    t |= r[n] ^ e[n];
  return 1 & t - 1 >>> 8;
}
function dg(r, e) {
  return r.length === 0 || e.length === 0 ? !1 : hg(r, e) !== 0;
}
const pg = 16;
class yg {
  constructor(e) {
    Le(this, "digestLength", pg);
    Le(this, "_buffer", new Uint8Array(16));
    Le(this, "_r", new Uint16Array(10));
    Le(this, "_h", new Uint16Array(10));
    Le(this, "_pad", new Uint16Array(8));
    Le(this, "_leftover", 0);
    Le(this, "_fin", 0);
    Le(this, "_finished", !1);
    let t = e[0] | e[1] << 8;
    this._r[0] = t & 8191;
    let n = e[2] | e[3] << 8;
    this._r[1] = (t >>> 13 | n << 3) & 8191;
    let i = e[4] | e[5] << 8;
    this._r[2] = (n >>> 10 | i << 6) & 7939;
    let s = e[6] | e[7] << 8;
    this._r[3] = (i >>> 7 | s << 9) & 8191;
    let o = e[8] | e[9] << 8;
    this._r[4] = (s >>> 4 | o << 12) & 255, this._r[5] = o >>> 1 & 8190;
    let c = e[10] | e[11] << 8;
    this._r[6] = (o >>> 14 | c << 2) & 8191;
    let u = e[12] | e[13] << 8;
    this._r[7] = (c >>> 11 | u << 5) & 8065;
    let h = e[14] | e[15] << 8;
    this._r[8] = (u >>> 8 | h << 8) & 8191, this._r[9] = h >>> 5 & 127, this._pad[0] = e[16] | e[17] << 8, this._pad[1] = e[18] | e[19] << 8, this._pad[2] = e[20] | e[21] << 8, this._pad[3] = e[22] | e[23] << 8, this._pad[4] = e[24] | e[25] << 8, this._pad[5] = e[26] | e[27] << 8, this._pad[6] = e[28] | e[29] << 8, this._pad[7] = e[30] | e[31] << 8;
  }
  _blocks(e, t, n) {
    let i = this._fin ? 0 : 2048, s = this._h[0], o = this._h[1], c = this._h[2], u = this._h[3], h = this._h[4], m = this._h[5], x = this._h[6], G = this._h[7], N = this._h[8], v = this._h[9], A = this._r[0], O = this._r[1], I = this._r[2], P = this._r[3], R = this._r[4], ce = this._r[5], ze = this._r[6], Je = this._r[7], Pe = this._r[8], re = this._r[9];
    for (; n >= 16; ) {
      let pe = e[t + 0] | e[t + 1] << 8;
      s += pe & 8191;
      let we = e[t + 2] | e[t + 3] << 8;
      o += (pe >>> 13 | we << 3) & 8191;
      let Ge = e[t + 4] | e[t + 5] << 8;
      c += (we >>> 10 | Ge << 6) & 8191;
      let bt = e[t + 6] | e[t + 7] << 8;
      u += (Ge >>> 7 | bt << 9) & 8191;
      let Tt = e[t + 8] | e[t + 9] << 8;
      h += (bt >>> 4 | Tt << 12) & 8191, m += Tt >>> 1 & 8191;
      let Et = e[t + 10] | e[t + 11] << 8;
      x += (Tt >>> 14 | Et << 2) & 8191;
      let ht = e[t + 12] | e[t + 13] << 8;
      G += (Et >>> 11 | ht << 5) & 8191;
      let Qe = e[t + 14] | e[t + 15] << 8;
      N += (ht >>> 8 | Qe << 8) & 8191, v += Qe >>> 5 | i;
      let se = 0, _e = se;
      _e += s * A, _e += o * (5 * re), _e += c * (5 * Pe), _e += u * (5 * Je), _e += h * (5 * ze), se = _e >>> 13, _e &= 8191, _e += m * (5 * ce), _e += x * (5 * R), _e += G * (5 * P), _e += N * (5 * I), _e += v * (5 * O), se += _e >>> 13, _e &= 8191;
      let yt = se;
      yt += s * O, yt += o * A, yt += c * (5 * re), yt += u * (5 * Pe), yt += h * (5 * Je), se = yt >>> 13, yt &= 8191, yt += m * (5 * ze), yt += x * (5 * ce), yt += G * (5 * R), yt += N * (5 * P), yt += v * (5 * I), se += yt >>> 13, yt &= 8191;
      let Ut = se;
      Ut += s * I, Ut += o * O, Ut += c * A, Ut += u * (5 * re), Ut += h * (5 * Pe), se = Ut >>> 13, Ut &= 8191, Ut += m * (5 * Je), Ut += x * (5 * ze), Ut += G * (5 * ce), Ut += N * (5 * R), Ut += v * (5 * P), se += Ut >>> 13, Ut &= 8191;
      let Dt = se;
      Dt += s * P, Dt += o * I, Dt += c * O, Dt += u * A, Dt += h * (5 * re), se = Dt >>> 13, Dt &= 8191, Dt += m * (5 * Pe), Dt += x * (5 * Je), Dt += G * (5 * ze), Dt += N * (5 * ce), Dt += v * (5 * R), se += Dt >>> 13, Dt &= 8191;
      let le = se;
      le += s * R, le += o * P, le += c * I, le += u * O, le += h * A, se = le >>> 13, le &= 8191, le += m * (5 * re), le += x * (5 * Pe), le += G * (5 * Je), le += N * (5 * ze), le += v * (5 * ce), se += le >>> 13, le &= 8191;
      let it = se;
      it += s * ce, it += o * R, it += c * P, it += u * I, it += h * O, se = it >>> 13, it &= 8191, it += m * A, it += x * (5 * re), it += G * (5 * Pe), it += N * (5 * Je), it += v * (5 * ze), se += it >>> 13, it &= 8191;
      let gt = se;
      gt += s * ze, gt += o * ce, gt += c * R, gt += u * P, gt += h * I, se = gt >>> 13, gt &= 8191, gt += m * O, gt += x * A, gt += G * (5 * re), gt += N * (5 * Pe), gt += v * (5 * Je), se += gt >>> 13, gt &= 8191;
      let Q = se;
      Q += s * Je, Q += o * ze, Q += c * ce, Q += u * R, Q += h * P, se = Q >>> 13, Q &= 8191, Q += m * I, Q += x * O, Q += G * A, Q += N * (5 * re), Q += v * (5 * Pe), se += Q >>> 13, Q &= 8191;
      let dt = se;
      dt += s * Pe, dt += o * Je, dt += c * ze, dt += u * ce, dt += h * R, se = dt >>> 13, dt &= 8191, dt += m * P, dt += x * I, dt += G * O, dt += N * A, dt += v * (5 * re), se += dt >>> 13, dt &= 8191;
      let Vt = se;
      Vt += s * re, Vt += o * Pe, Vt += c * Je, Vt += u * ze, Vt += h * ce, se = Vt >>> 13, Vt &= 8191, Vt += m * R, Vt += x * P, Vt += G * I, Vt += N * O, Vt += v * A, se += Vt >>> 13, Vt &= 8191, se = (se << 2) + se | 0, se = se + _e | 0, _e = se & 8191, se = se >>> 13, yt += se, s = _e, o = yt, c = Ut, u = Dt, h = le, m = it, x = gt, G = Q, N = dt, v = Vt, t += 16, n -= 16;
    }
    this._h[0] = s, this._h[1] = o, this._h[2] = c, this._h[3] = u, this._h[4] = h, this._h[5] = m, this._h[6] = x, this._h[7] = G, this._h[8] = N, this._h[9] = v;
  }
  finish(e, t = 0) {
    const n = new Uint16Array(10);
    let i, s, o, c;
    if (this._leftover) {
      for (c = this._leftover, this._buffer[c++] = 1; c < 16; c++)
        this._buffer[c] = 0;
      this._fin = 1, this._blocks(this._buffer, 0, 16);
    }
    for (i = this._h[1] >>> 13, this._h[1] &= 8191, c = 2; c < 10; c++)
      this._h[c] += i, i = this._h[c] >>> 13, this._h[c] &= 8191;
    for (this._h[0] += i * 5, i = this._h[0] >>> 13, this._h[0] &= 8191, this._h[1] += i, i = this._h[1] >>> 13, this._h[1] &= 8191, this._h[2] += i, n[0] = this._h[0] + 5, i = n[0] >>> 13, n[0] &= 8191, c = 1; c < 10; c++)
      n[c] = this._h[c] + i, i = n[c] >>> 13, n[c] &= 8191;
    for (n[9] -= 8192, s = (i ^ 1) - 1, c = 0; c < 10; c++)
      n[c] &= s;
    for (s = ~s, c = 0; c < 10; c++)
      this._h[c] = this._h[c] & s | n[c];
    for (this._h[0] = (this._h[0] | this._h[1] << 13) & 65535, this._h[1] = (this._h[1] >>> 3 | this._h[2] << 10) & 65535, this._h[2] = (this._h[2] >>> 6 | this._h[3] << 7) & 65535, this._h[3] = (this._h[3] >>> 9 | this._h[4] << 4) & 65535, this._h[4] = (this._h[4] >>> 12 | this._h[5] << 1 | this._h[6] << 14) & 65535, this._h[5] = (this._h[6] >>> 2 | this._h[7] << 11) & 65535, this._h[6] = (this._h[7] >>> 5 | this._h[8] << 8) & 65535, this._h[7] = (this._h[8] >>> 8 | this._h[9] << 5) & 65535, o = this._h[0] + this._pad[0], this._h[0] = o & 65535, c = 1; c < 8; c++)
      o = (this._h[c] + this._pad[c] | 0) + (o >>> 16) | 0, this._h[c] = o & 65535;
    return e[t + 0] = this._h[0] >>> 0, e[t + 1] = this._h[0] >>> 8, e[t + 2] = this._h[1] >>> 0, e[t + 3] = this._h[1] >>> 8, e[t + 4] = this._h[2] >>> 0, e[t + 5] = this._h[2] >>> 8, e[t + 6] = this._h[3] >>> 0, e[t + 7] = this._h[3] >>> 8, e[t + 8] = this._h[4] >>> 0, e[t + 9] = this._h[4] >>> 8, e[t + 10] = this._h[5] >>> 0, e[t + 11] = this._h[5] >>> 8, e[t + 12] = this._h[6] >>> 0, e[t + 13] = this._h[6] >>> 8, e[t + 14] = this._h[7] >>> 0, e[t + 15] = this._h[7] >>> 8, this._finished = !0, this;
  }
  update(e) {
    let t = 0, n = e.length, i;
    if (this._leftover) {
      i = 16 - this._leftover, i > n && (i = n);
      for (let s = 0; s < i; s++)
        this._buffer[this._leftover + s] = e[t + s];
      if (n -= i, t += i, this._leftover += i, this._leftover < 16)
        return this;
      this._blocks(this._buffer, 0, 16), this._leftover = 0;
    }
    if (n >= 16 && (i = n - n % 16, this._blocks(e, t, i), t += i, n -= i), n) {
      for (let s = 0; s < n; s++)
        this._buffer[this._leftover + s] = e[t + s];
      this._leftover += n;
    }
    return this;
  }
  digest() {
    if (this._finished)
      throw new Error("Poly1305 was finished");
    let e = new Uint8Array(16);
    return this.finish(e), e;
  }
  clean() {
    return Cr(this._buffer), Cr(this._r), Cr(this._h), Cr(this._pad), this._leftover = 0, this._fin = 0, this._finished = !0, this;
  }
}
const gg = 32, vg = 12, mg = 16, Kf = new Uint8Array(16);
class Ru {
  /**
   * Creates a new instance with the given 32-byte key.
   */
  constructor(e) {
    Le(this, "nonceLength", vg);
    Le(this, "tagLength", mg);
    Le(this, "_key");
    if (e.length !== gg)
      throw new Error("ChaCha20Poly1305 needs 32-byte key");
    this._key = new Uint8Array(e);
  }
  /**
   * Encrypts and authenticates plaintext, authenticates associated data,
   * and returns sealed ciphertext, which includes authentication tag.
   *
   * RFC7539 specifies 12 bytes for nonce. It may be this 12-byte nonce
   * ("IV"), or full 16-byte counter (called "32-bit fixed-common part")
   * and nonce.
   *
   * If dst is given (it must be the size of plaintext + the size of tag
   * length) the result will be put into it. Dst and plaintext must not
   * overlap.
   */
  seal(e, t, n, i) {
    if (e.length > 16)
      throw new Error("ChaCha20Poly1305: incorrect nonce length");
    const s = new Uint8Array(16);
    s.set(e, s.length - e.length);
    const o = new Uint8Array(32);
    Gf(this._key, s, o, 4);
    const c = t.length + this.tagLength;
    let u;
    if (i) {
      if (i.length !== c)
        throw new Error("ChaCha20Poly1305: incorrect destination length");
      u = i;
    } else
      u = new Uint8Array(c);
    return cl(this._key, s, t, u, 4), this._authenticate(u.subarray(u.length - this.tagLength, u.length), o, u.subarray(0, u.length - this.tagLength), n), Cr(s), u;
  }
  /**
   * Authenticates sealed ciphertext (which includes authentication tag) and
   * associated data, decrypts ciphertext and returns decrypted plaintext.
   *
   * RFC7539 specifies 12 bytes for nonce. It may be this 12-byte nonce
   * ("IV"), or full 16-byte counter (called "32-bit fixed-common part")
   * and nonce.
   *
   * If authentication fails, it returns null.
   *
   * If dst is given (it must be of ciphertext length minus tag length),
   * the result will be put into it. Dst and plaintext must not overlap.
   */
  open(e, t, n, i) {
    if (e.length > 16)
      throw new Error("ChaCha20Poly1305: incorrect nonce length");
    if (t.length < this.tagLength)
      return null;
    const s = new Uint8Array(16);
    s.set(e, s.length - e.length);
    const o = new Uint8Array(32);
    Gf(this._key, s, o, 4);
    const c = new Uint8Array(this.tagLength);
    if (this._authenticate(c, o, t.subarray(0, t.length - this.tagLength), n), !dg(c, t.subarray(t.length - this.tagLength, t.length)))
      return null;
    const u = t.length - this.tagLength;
    let h;
    if (i) {
      if (i.length !== u)
        throw new Error("ChaCha20Poly1305: incorrect destination length");
      h = i;
    } else
      h = new Uint8Array(u);
    return cl(this._key, s, t.subarray(0, t.length - this.tagLength), h, 4), Cr(s), h;
  }
  clean() {
    return Cr(this._key), this;
  }
  _authenticate(e, t, n, i) {
    const s = new yg(t);
    i && (s.update(i), i.length % 16 > 0 && s.update(Kf.subarray(i.length % 16))), s.update(n), n.length % 16 > 0 && s.update(Kf.subarray(n.length % 16));
    const o = new Uint8Array(8);
    i && zf(i.length, o), s.update(o), zf(n.length, o), s.update(o);
    const c = s.digest();
    for (let u = 0; u < c.length; u++)
      e[u] = c[u];
    s.clean(), Cr(c), Cr(o);
  }
}
const qf = 65536;
class wg {
  constructor() {
    Le(this, "isAvailable", !1);
    Le(this, "isInstantiated", !1);
    typeof crypto < "u" && "getRandomValues" in crypto && (this.isAvailable = !0, this.isInstantiated = !0);
  }
  randomBytes(e) {
    if (!this.isAvailable)
      throw new Error("System random byte generator is not available.");
    const t = new Uint8Array(e);
    for (let n = 0; n < t.length; n += qf)
      crypto.getRandomValues(t.subarray(n, n + Math.min(t.length - n, qf)));
    return t;
  }
}
const bg = new wg();
function xg(r, e = bg) {
  return e.randomBytes(r);
}
function Hd(r, e) {
  const t = new Ru(r), n = xg(12), s = new TextEncoder().encode(e), o = t.seal(n, s), c = new Uint8Array(n.length + o.length);
  return c.set(n), c.set(o, n.length), Br(c);
}
function Fd(r, e) {
  const t = new Ru(r), n = Ds(e), i = 12, s = n.slice(0, i), o = n.slice(i), c = t.open(s, o);
  if (!c)
    throw new Error("Decryption failed");
  return new TextDecoder().decode(c);
}
var ll = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ag(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function Sg(r) {
  if (r.__esModule) return r;
  var e = r.default;
  if (typeof e == "function") {
    var t = function n() {
      return this instanceof n ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(r).forEach(function(n) {
    var i = Object.getOwnPropertyDescriptor(r, n);
    Object.defineProperty(t, n, i.get ? i : {
      enumerable: !0,
      get: function() {
        return r[n];
      }
    });
  }), t;
}
/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Zf;
(function(r) {
  (function(e) {
    var t = typeof globalThis == "object" ? globalThis : typeof ll == "object" ? ll : typeof self == "object" ? self : typeof this == "object" ? this : c(), n = i(r);
    typeof t.Reflect < "u" && (n = i(t.Reflect, n)), e(n, t), typeof t.Reflect > "u" && (t.Reflect = r);
    function i(u, h) {
      return function(m, x) {
        Object.defineProperty(u, m, { configurable: !0, writable: !0, value: x }), h && h(m, x);
      };
    }
    function s() {
      try {
        return Function("return this;")();
      } catch {
      }
    }
    function o() {
      try {
        return (0, eval)("(function() { return this; })()");
      } catch {
      }
    }
    function c() {
      return s() || o();
    }
  })(function(e, t) {
    var n = Object.prototype.hasOwnProperty, i = typeof Symbol == "function", s = i && typeof Symbol.toPrimitive < "u" ? Symbol.toPrimitive : "@@toPrimitive", o = i && typeof Symbol.iterator < "u" ? Symbol.iterator : "@@iterator", c = typeof Object.create == "function", u = { __proto__: [] } instanceof Array, h = !c && !u, m = {
      // create an object in dictionary mode (a.k.a. "slow" mode in v8)
      create: c ? function() {
        return _s(/* @__PURE__ */ Object.create(null));
      } : u ? function() {
        return _s({ __proto__: null });
      } : function() {
        return _s({});
      },
      has: h ? function(_, k) {
        return n.call(_, k);
      } : function(_, k) {
        return k in _;
      },
      get: h ? function(_, k) {
        return n.call(_, k) ? _[k] : void 0;
      } : function(_, k) {
        return _[k];
      }
    }, x = Object.getPrototypeOf(Function), G = typeof Map == "function" && typeof Map.prototype.entries == "function" ? Map : As(), N = typeof Set == "function" && typeof Set.prototype.entries == "function" ? Set : Ss(), v = typeof WeakMap == "function" ? WeakMap : Po(), A = i ? Symbol.for("@reflect-metadata:registry") : void 0, O = bs(), I = Ni(O);
    function P(_, k, T, K) {
      if (le(T)) {
        if (!ps(_))
          throw new TypeError();
        if (!ys(k))
          throw new TypeError();
        return bt(_, k);
      } else {
        if (!ps(_))
          throw new TypeError();
        if (!Q(k))
          throw new TypeError();
        if (!Q(K) && !le(K) && !it(K))
          throw new TypeError();
        return it(K) && (K = void 0), T = or(T), Tt(_, k, T, K);
      }
    }
    e("decorate", P);
    function R(_, k) {
      function T(K, be) {
        if (!Q(K))
          throw new TypeError();
        if (!le(be) && !Hc(be))
          throw new TypeError();
        _e(_, k, K, be);
      }
      return T;
    }
    e("metadata", R);
    function ce(_, k, T, K) {
      if (!Q(T))
        throw new TypeError();
      return le(K) || (K = or(K)), _e(_, k, T, K);
    }
    e("defineMetadata", ce);
    function ze(_, k, T) {
      if (!Q(k))
        throw new TypeError();
      return le(T) || (T = or(T)), Et(_, k, T);
    }
    e("hasMetadata", ze);
    function Je(_, k, T) {
      if (!Q(k))
        throw new TypeError();
      return le(T) || (T = or(T)), ht(_, k, T);
    }
    e("hasOwnMetadata", Je);
    function Pe(_, k, T) {
      if (!Q(k))
        throw new TypeError();
      return le(T) || (T = or(T)), Qe(_, k, T);
    }
    e("getMetadata", Pe);
    function re(_, k, T) {
      if (!Q(k))
        throw new TypeError();
      return le(T) || (T = or(T)), se(_, k, T);
    }
    e("getOwnMetadata", re);
    function pe(_, k) {
      if (!Q(_))
        throw new TypeError();
      return le(k) || (k = or(k)), yt(_, k);
    }
    e("getMetadataKeys", pe);
    function we(_, k) {
      if (!Q(_))
        throw new TypeError();
      return le(k) || (k = or(k)), Ut(_, k);
    }
    e("getOwnMetadataKeys", we);
    function Ge(_, k, T) {
      if (!Q(k))
        throw new TypeError();
      if (le(T) || (T = or(T)), !Q(k))
        throw new TypeError();
      le(T) || (T = or(T));
      var K = Wr(
        k,
        T,
        /*Create*/
        !1
      );
      return le(K) ? !1 : K.OrdinaryDeleteMetadata(_, k, T);
    }
    e("deleteMetadata", Ge);
    function bt(_, k) {
      for (var T = _.length - 1; T >= 0; --T) {
        var K = _[T], be = K(k);
        if (!le(be) && !it(be)) {
          if (!ys(be))
            throw new TypeError();
          k = be;
        }
      }
      return k;
    }
    function Tt(_, k, T, K) {
      for (var be = _.length - 1; be >= 0; --be) {
        var At = _[be], St = At(k, T, K);
        if (!le(St) && !it(St)) {
          if (!Q(St))
            throw new TypeError();
          K = St;
        }
      }
      return K;
    }
    function Et(_, k, T) {
      var K = ht(_, k, T);
      if (K)
        return !0;
      var be = Ti(k);
      return it(be) ? !1 : Et(_, be, T);
    }
    function ht(_, k, T) {
      var K = Wr(
        k,
        T,
        /*Create*/
        !1
      );
      return le(K) ? !1 : ds(K.OrdinaryHasOwnMetadata(_, k, T));
    }
    function Qe(_, k, T) {
      var K = ht(_, k, T);
      if (K)
        return se(_, k, T);
      var be = Ti(k);
      if (!it(be))
        return Qe(_, be, T);
    }
    function se(_, k, T) {
      var K = Wr(
        k,
        T,
        /*Create*/
        !1
      );
      if (!le(K))
        return K.OrdinaryGetOwnMetadata(_, k, T);
    }
    function _e(_, k, T, K) {
      var be = Wr(
        T,
        K,
        /*Create*/
        !0
      );
      be.OrdinaryDefineOwnMetadata(_, k, T, K);
    }
    function yt(_, k) {
      var T = Ut(_, k), K = Ti(_);
      if (K === null)
        return T;
      var be = yt(K, k);
      if (be.length <= 0)
        return T;
      if (T.length <= 0)
        return be;
      for (var At = new N(), St = [], je = 0, Z = T; je < Z.length; je++) {
        var ee = Z[je], ue = At.has(ee);
        ue || (At.add(ee), St.push(ee));
      }
      for (var ye = 0, Xe = be; ye < Xe.length; ye++) {
        var ee = Xe[ye], ue = At.has(ee);
        ue || (At.add(ee), St.push(ee));
      }
      return St;
    }
    function Ut(_, k) {
      var T = Wr(
        _,
        k,
        /*create*/
        !1
      );
      return T ? T.OrdinaryOwnMetadataKeys(_, k) : [];
    }
    function Dt(_) {
      if (_ === null)
        return 1;
      switch (typeof _) {
        case "undefined":
          return 0;
        case "boolean":
          return 2;
        case "string":
          return 3;
        case "symbol":
          return 4;
        case "number":
          return 5;
        case "object":
          return _ === null ? 1 : 6;
        default:
          return 6;
      }
    }
    function le(_) {
      return _ === void 0;
    }
    function it(_) {
      return _ === null;
    }
    function gt(_) {
      return typeof _ == "symbol";
    }
    function Q(_) {
      return typeof _ == "object" ? _ !== null : typeof _ == "function";
    }
    function dt(_, k) {
      switch (Dt(_)) {
        case 0:
          return _;
        case 1:
          return _;
        case 2:
          return _;
        case 3:
          return _;
        case 4:
          return _;
        case 5:
          return _;
      }
      var T = "string", K = No(_, s);
      if (K !== void 0) {
        var be = K.call(_, T);
        if (Q(be))
          throw new TypeError();
        return be;
      }
      return Vt(_);
    }
    function Vt(_, k) {
      var T, K;
      {
        var be = _.toString;
        if (yn(be)) {
          var K = be.call(_);
          if (!Q(K))
            return K;
        }
        var T = _.valueOf;
        if (yn(T)) {
          var K = T.call(_);
          if (!Q(K))
            return K;
        }
      }
      throw new TypeError();
    }
    function ds(_) {
      return !!_;
    }
    function Oi(_) {
      return "" + _;
    }
    function or(_) {
      var k = dt(_);
      return gt(k) ? k : Oi(k);
    }
    function ps(_) {
      return Array.isArray ? Array.isArray(_) : _ instanceof Object ? _ instanceof Array : Object.prototype.toString.call(_) === "[object Array]";
    }
    function yn(_) {
      return typeof _ == "function";
    }
    function ys(_) {
      return typeof _ == "function";
    }
    function Hc(_) {
      switch (Dt(_)) {
        case 3:
          return !0;
        case 4:
          return !0;
        default:
          return !1;
      }
    }
    function gs(_, k) {
      return _ === k || _ !== _ && k !== k;
    }
    function No(_, k) {
      var T = _[k];
      if (T != null) {
        if (!yn(T))
          throw new TypeError();
        return T;
      }
    }
    function vs(_) {
      var k = No(_, o);
      if (!yn(k))
        throw new TypeError();
      var T = k.call(_);
      if (!Q(T))
        throw new TypeError();
      return T;
    }
    function ms(_) {
      return _.value;
    }
    function Zr(_) {
      var k = _.next();
      return k.done ? !1 : k;
    }
    function Qn(_) {
      var k = _.return;
      k && k.call(_);
    }
    function Ti(_) {
      var k = Object.getPrototypeOf(_);
      if (typeof _ != "function" || _ === x || k !== x)
        return k;
      var T = _.prototype, K = T && Object.getPrototypeOf(T);
      if (K == null || K === Object.prototype)
        return k;
      var be = K.constructor;
      return typeof be != "function" || be === _ ? k : be;
    }
    function ws() {
      var _;
      !le(A) && typeof t.Reflect < "u" && !(A in t.Reflect) && typeof t.Reflect.defineMetadata == "function" && (_ = xs(t.Reflect));
      var k, T, K, be = new v(), At = {
        registerProvider: St,
        getProvider: Z,
        setProvider: ue
      };
      return At;
      function St(ye) {
        if (!Object.isExtensible(At))
          throw new Error("Cannot add provider to a frozen registry.");
        switch (!0) {
          case _ === ye:
            break;
          case le(k):
            k = ye;
            break;
          case k === ye:
            break;
          case le(T):
            T = ye;
            break;
          case T === ye:
            break;
          default:
            K === void 0 && (K = new N()), K.add(ye);
            break;
        }
      }
      function je(ye, Xe) {
        if (!le(k)) {
          if (k.isProviderFor(ye, Xe))
            return k;
          if (!le(T)) {
            if (T.isProviderFor(ye, Xe))
              return k;
            if (!le(K))
              for (var tt = vs(K); ; ) {
                var vt = Zr(tt);
                if (!vt)
                  return;
                var zt = ms(vt);
                if (zt.isProviderFor(ye, Xe))
                  return Qn(tt), zt;
              }
          }
        }
        if (!le(_) && _.isProviderFor(ye, Xe))
          return _;
      }
      function Z(ye, Xe) {
        var tt = be.get(ye), vt;
        return le(tt) || (vt = tt.get(Xe)), le(vt) && (vt = je(ye, Xe), le(vt) || (le(tt) && (tt = new G(), be.set(ye, tt)), tt.set(Xe, vt))), vt;
      }
      function ee(ye) {
        if (le(ye))
          throw new TypeError();
        return k === ye || T === ye || !le(K) && K.has(ye);
      }
      function ue(ye, Xe, tt) {
        if (!ee(tt))
          throw new Error("Metadata provider not registered.");
        var vt = Z(ye, Xe);
        if (vt !== tt) {
          if (!le(vt))
            return !1;
          var zt = be.get(ye);
          le(zt) && (zt = new G(), be.set(ye, zt)), zt.set(Xe, tt);
        }
        return !0;
      }
    }
    function bs() {
      var _;
      return !le(A) && Q(t.Reflect) && Object.isExtensible(t.Reflect) && (_ = t.Reflect[A]), le(_) && (_ = ws()), !le(A) && Q(t.Reflect) && Object.isExtensible(t.Reflect) && Object.defineProperty(t.Reflect, A, {
        enumerable: !1,
        configurable: !1,
        writable: !1,
        value: _
      }), _;
    }
    function Ni(_) {
      var k = new v(), T = {
        isProviderFor: function(ee, ue) {
          var ye = k.get(ee);
          return le(ye) ? !1 : ye.has(ue);
        },
        OrdinaryDefineOwnMetadata: St,
        OrdinaryHasOwnMetadata: be,
        OrdinaryGetOwnMetadata: At,
        OrdinaryOwnMetadataKeys: je,
        OrdinaryDeleteMetadata: Z
      };
      return O.registerProvider(T), T;
      function K(ee, ue, ye) {
        var Xe = k.get(ee), tt = !1;
        if (le(Xe)) {
          if (!ye)
            return;
          Xe = new G(), k.set(ee, Xe), tt = !0;
        }
        var vt = Xe.get(ue);
        if (le(vt)) {
          if (!ye)
            return;
          if (vt = new G(), Xe.set(ue, vt), !_.setProvider(ee, ue, T))
            throw Xe.delete(ue), tt && k.delete(ee), new Error("Wrong provider for target.");
        }
        return vt;
      }
      function be(ee, ue, ye) {
        var Xe = K(
          ue,
          ye,
          /*Create*/
          !1
        );
        return le(Xe) ? !1 : ds(Xe.has(ee));
      }
      function At(ee, ue, ye) {
        var Xe = K(
          ue,
          ye,
          /*Create*/
          !1
        );
        if (!le(Xe))
          return Xe.get(ee);
      }
      function St(ee, ue, ye, Xe) {
        var tt = K(
          ye,
          Xe,
          /*Create*/
          !0
        );
        tt.set(ee, ue);
      }
      function je(ee, ue) {
        var ye = [], Xe = K(
          ee,
          ue,
          /*Create*/
          !1
        );
        if (le(Xe))
          return ye;
        for (var tt = Xe.keys(), vt = vs(tt), zt = 0; ; ) {
          var Pi = Zr(vt);
          if (!Pi)
            return ye.length = zt, ye;
          var Es = ms(Pi);
          try {
            ye[zt] = Es;
          } catch (jo) {
            try {
              Qn(vt);
            } finally {
              throw jo;
            }
          }
          zt++;
        }
      }
      function Z(ee, ue, ye) {
        var Xe = K(
          ue,
          ye,
          /*Create*/
          !1
        );
        if (le(Xe) || !Xe.delete(ee))
          return !1;
        if (Xe.size === 0) {
          var tt = k.get(ue);
          le(tt) || (tt.delete(ye), tt.size === 0 && k.delete(tt));
        }
        return !0;
      }
    }
    function xs(_) {
      var k = _.defineMetadata, T = _.hasOwnMetadata, K = _.getOwnMetadata, be = _.getOwnMetadataKeys, At = _.deleteMetadata, St = new v(), je = {
        isProviderFor: function(Z, ee) {
          var ue = St.get(Z);
          return !le(ue) && ue.has(ee) ? !0 : be(Z, ee).length ? (le(ue) && (ue = new N(), St.set(Z, ue)), ue.add(ee), !0) : !1;
        },
        OrdinaryDefineOwnMetadata: k,
        OrdinaryHasOwnMetadata: T,
        OrdinaryGetOwnMetadata: K,
        OrdinaryOwnMetadataKeys: be,
        OrdinaryDeleteMetadata: At
      };
      return je;
    }
    function Wr(_, k, T) {
      var K = O.getProvider(_, k);
      if (!le(K))
        return K;
      if (T) {
        if (O.setProvider(_, k, I))
          return I;
        throw new Error("Illegal state.");
      }
    }
    function As() {
      var _ = {}, k = [], T = (
        /** @class */
        function() {
          function je(Z, ee, ue) {
            this._index = 0, this._keys = Z, this._values = ee, this._selector = ue;
          }
          return je.prototype["@@iterator"] = function() {
            return this;
          }, je.prototype[o] = function() {
            return this;
          }, je.prototype.next = function() {
            var Z = this._index;
            if (Z >= 0 && Z < this._keys.length) {
              var ee = this._selector(this._keys[Z], this._values[Z]);
              return Z + 1 >= this._keys.length ? (this._index = -1, this._keys = k, this._values = k) : this._index++, { value: ee, done: !1 };
            }
            return { value: void 0, done: !0 };
          }, je.prototype.throw = function(Z) {
            throw this._index >= 0 && (this._index = -1, this._keys = k, this._values = k), Z;
          }, je.prototype.return = function(Z) {
            return this._index >= 0 && (this._index = -1, this._keys = k, this._values = k), { value: Z, done: !0 };
          }, je;
        }()
      ), K = (
        /** @class */
        function() {
          function je() {
            this._keys = [], this._values = [], this._cacheKey = _, this._cacheIndex = -2;
          }
          return Object.defineProperty(je.prototype, "size", {
            get: function() {
              return this._keys.length;
            },
            enumerable: !0,
            configurable: !0
          }), je.prototype.has = function(Z) {
            return this._find(
              Z,
              /*insert*/
              !1
            ) >= 0;
          }, je.prototype.get = function(Z) {
            var ee = this._find(
              Z,
              /*insert*/
              !1
            );
            return ee >= 0 ? this._values[ee] : void 0;
          }, je.prototype.set = function(Z, ee) {
            var ue = this._find(
              Z,
              /*insert*/
              !0
            );
            return this._values[ue] = ee, this;
          }, je.prototype.delete = function(Z) {
            var ee = this._find(
              Z,
              /*insert*/
              !1
            );
            if (ee >= 0) {
              for (var ue = this._keys.length, ye = ee + 1; ye < ue; ye++)
                this._keys[ye - 1] = this._keys[ye], this._values[ye - 1] = this._values[ye];
              return this._keys.length--, this._values.length--, gs(Z, this._cacheKey) && (this._cacheKey = _, this._cacheIndex = -2), !0;
            }
            return !1;
          }, je.prototype.clear = function() {
            this._keys.length = 0, this._values.length = 0, this._cacheKey = _, this._cacheIndex = -2;
          }, je.prototype.keys = function() {
            return new T(this._keys, this._values, be);
          }, je.prototype.values = function() {
            return new T(this._keys, this._values, At);
          }, je.prototype.entries = function() {
            return new T(this._keys, this._values, St);
          }, je.prototype["@@iterator"] = function() {
            return this.entries();
          }, je.prototype[o] = function() {
            return this.entries();
          }, je.prototype._find = function(Z, ee) {
            if (!gs(this._cacheKey, Z)) {
              this._cacheIndex = -1;
              for (var ue = 0; ue < this._keys.length; ue++)
                if (gs(this._keys[ue], Z)) {
                  this._cacheIndex = ue;
                  break;
                }
            }
            return this._cacheIndex < 0 && ee && (this._cacheIndex = this._keys.length, this._keys.push(Z), this._values.push(void 0)), this._cacheIndex;
          }, je;
        }()
      );
      return K;
      function be(je, Z) {
        return je;
      }
      function At(je, Z) {
        return Z;
      }
      function St(je, Z) {
        return [je, Z];
      }
    }
    function Ss() {
      var _ = (
        /** @class */
        function() {
          function k() {
            this._map = new G();
          }
          return Object.defineProperty(k.prototype, "size", {
            get: function() {
              return this._map.size;
            },
            enumerable: !0,
            configurable: !0
          }), k.prototype.has = function(T) {
            return this._map.has(T);
          }, k.prototype.add = function(T) {
            return this._map.set(T, T), this;
          }, k.prototype.delete = function(T) {
            return this._map.delete(T);
          }, k.prototype.clear = function() {
            this._map.clear();
          }, k.prototype.keys = function() {
            return this._map.keys();
          }, k.prototype.values = function() {
            return this._map.keys();
          }, k.prototype.entries = function() {
            return this._map.entries();
          }, k.prototype["@@iterator"] = function() {
            return this.keys();
          }, k.prototype[o] = function() {
            return this.keys();
          }, k;
        }()
      );
      return _;
    }
    function Po() {
      var _ = 16, k = m.create(), T = K();
      return (
        /** @class */
        function() {
          function Z() {
            this._key = K();
          }
          return Z.prototype.has = function(ee) {
            var ue = be(
              ee,
              /*create*/
              !1
            );
            return ue !== void 0 ? m.has(ue, this._key) : !1;
          }, Z.prototype.get = function(ee) {
            var ue = be(
              ee,
              /*create*/
              !1
            );
            return ue !== void 0 ? m.get(ue, this._key) : void 0;
          }, Z.prototype.set = function(ee, ue) {
            var ye = be(
              ee,
              /*create*/
              !0
            );
            return ye[this._key] = ue, this;
          }, Z.prototype.delete = function(ee) {
            var ue = be(
              ee,
              /*create*/
              !1
            );
            return ue !== void 0 ? delete ue[this._key] : !1;
          }, Z.prototype.clear = function() {
            this._key = K();
          }, Z;
        }()
      );
      function K() {
        var Z;
        do
          Z = "@@WeakMap@@" + je();
        while (m.has(k, Z));
        return k[Z] = !0, Z;
      }
      function be(Z, ee) {
        if (!n.call(Z, T)) {
          if (!ee)
            return;
          Object.defineProperty(Z, T, { value: m.create() });
        }
        return Z[T];
      }
      function At(Z, ee) {
        for (var ue = 0; ue < ee; ++ue)
          Z[ue] = Math.random() * 255 | 0;
        return Z;
      }
      function St(Z) {
        if (typeof Uint8Array == "function") {
          var ee = new Uint8Array(Z);
          return typeof crypto < "u" ? crypto.getRandomValues(ee) : typeof msCrypto < "u" ? msCrypto.getRandomValues(ee) : At(ee, Z), ee;
        }
        return At(new Array(Z), Z);
      }
      function je() {
        var Z = St(_);
        Z[6] = Z[6] & 79 | 64, Z[8] = Z[8] & 191 | 128;
        for (var ee = "", ue = 0; ue < _; ++ue) {
          var ye = Z[ue];
          (ue === 4 || ue === 6 || ue === 8) && (ee += "-"), ye < 16 && (ee += "0"), ee += ye.toString(16).toLowerCase();
        }
        return ee;
      }
    }
    function _s(_) {
      return _.__ = void 0, delete _.__, _;
    }
  });
})(Zf || (Zf = {}));
/*!
 * MIT License
 * 
 * Copyright (c) 2017-2022 Peculiar Ventures, LLC
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */
const _g = "[object ArrayBuffer]";
class W {
  static isArrayBuffer(e) {
    return Object.prototype.toString.call(e) === _g;
  }
  static toArrayBuffer(e) {
    return this.isArrayBuffer(e) ? e : e.byteLength === e.buffer.byteLength || e.byteOffset === 0 && e.byteLength === e.buffer.byteLength ? e.buffer : this.toUint8Array(e.buffer).slice(e.byteOffset, e.byteOffset + e.byteLength).buffer;
  }
  static toUint8Array(e) {
    return this.toView(e, Uint8Array);
  }
  static toView(e, t) {
    if (e.constructor === t)
      return e;
    if (this.isArrayBuffer(e))
      return new t(e);
    if (this.isArrayBufferView(e))
      return new t(e.buffer, e.byteOffset, e.byteLength);
    throw new TypeError("The provided value is not of type '(ArrayBuffer or ArrayBufferView)'");
  }
  static isBufferSource(e) {
    return this.isArrayBufferView(e) || this.isArrayBuffer(e);
  }
  static isArrayBufferView(e) {
    return ArrayBuffer.isView(e) || e && this.isArrayBuffer(e.buffer);
  }
  static isEqual(e, t) {
    const n = W.toUint8Array(e), i = W.toUint8Array(t);
    if (n.length !== i.byteLength)
      return !1;
    for (let s = 0; s < n.length; s++)
      if (n[s] !== i[s])
        return !1;
    return !0;
  }
  static concat(...e) {
    let t;
    Array.isArray(e[0]) && !(e[1] instanceof Function) || Array.isArray(e[0]) && e[1] instanceof Function ? t = e[0] : e[e.length - 1] instanceof Function ? t = e.slice(0, e.length - 1) : t = e;
    let n = 0;
    for (const o of t)
      n += o.byteLength;
    const i = new Uint8Array(n);
    let s = 0;
    for (const o of t) {
      const c = this.toUint8Array(o);
      i.set(c, s), s += c.length;
    }
    return e[e.length - 1] instanceof Function ? this.toView(i, e[e.length - 1]) : i.buffer;
  }
}
const zc = "string", Eg = /^[0-9a-f]+$/i, Ig = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/, kg = /^[a-zA-Z0-9-_]+$/;
class Wf {
  static fromString(e) {
    const t = unescape(encodeURIComponent(e)), n = new Uint8Array(t.length);
    for (let i = 0; i < t.length; i++)
      n[i] = t.charCodeAt(i);
    return n.buffer;
  }
  static toString(e) {
    const t = W.toUint8Array(e);
    let n = "";
    for (let s = 0; s < t.length; s++)
      n += String.fromCharCode(t[s]);
    return decodeURIComponent(escape(n));
  }
}
class Yr {
  static toString(e, t = !1) {
    const n = W.toArrayBuffer(e), i = new DataView(n);
    let s = "";
    for (let o = 0; o < n.byteLength; o += 2) {
      const c = i.getUint16(o, t);
      s += String.fromCharCode(c);
    }
    return s;
  }
  static fromString(e, t = !1) {
    const n = new ArrayBuffer(e.length * 2), i = new DataView(n);
    for (let s = 0; s < e.length; s++)
      i.setUint16(s * 2, e.charCodeAt(s), t);
    return n;
  }
}
class fe {
  static isHex(e) {
    return typeof e === zc && Eg.test(e);
  }
  static isBase64(e) {
    return typeof e === zc && Ig.test(e);
  }
  static isBase64Url(e) {
    return typeof e === zc && kg.test(e);
  }
  static ToString(e, t = "utf8") {
    const n = W.toUint8Array(e);
    switch (t.toLowerCase()) {
      case "utf8":
        return this.ToUtf8String(n);
      case "binary":
        return this.ToBinary(n);
      case "hex":
        return this.ToHex(n);
      case "base64":
        return this.ToBase64(n);
      case "base64url":
        return this.ToBase64Url(n);
      case "utf16le":
        return Yr.toString(n, !0);
      case "utf16":
      case "utf16be":
        return Yr.toString(n);
      default:
        throw new Error(`Unknown type of encoding '${t}'`);
    }
  }
  static FromString(e, t = "utf8") {
    if (!e)
      return new ArrayBuffer(0);
    switch (t.toLowerCase()) {
      case "utf8":
        return this.FromUtf8String(e);
      case "binary":
        return this.FromBinary(e);
      case "hex":
        return this.FromHex(e);
      case "base64":
        return this.FromBase64(e);
      case "base64url":
        return this.FromBase64Url(e);
      case "utf16le":
        return Yr.fromString(e, !0);
      case "utf16":
      case "utf16be":
        return Yr.fromString(e);
      default:
        throw new Error(`Unknown type of encoding '${t}'`);
    }
  }
  static ToBase64(e) {
    const t = W.toUint8Array(e);
    if (typeof btoa < "u") {
      const n = this.ToString(t, "binary");
      return btoa(n);
    } else
      return Buffer.from(t).toString("base64");
  }
  static FromBase64(e) {
    const t = this.formatString(e);
    if (!t)
      return new ArrayBuffer(0);
    if (!fe.isBase64(t))
      throw new TypeError("Argument 'base64Text' is not Base64 encoded");
    return typeof atob < "u" ? this.FromBinary(atob(t)) : new Uint8Array(Buffer.from(t, "base64")).buffer;
  }
  static FromBase64Url(e) {
    const t = this.formatString(e);
    if (!t)
      return new ArrayBuffer(0);
    if (!fe.isBase64Url(t))
      throw new TypeError("Argument 'base64url' is not Base64Url encoded");
    return this.FromBase64(this.Base64Padding(t.replace(/\-/g, "+").replace(/\_/g, "/")));
  }
  static ToBase64Url(e) {
    return this.ToBase64(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
  }
  static FromUtf8String(e, t = fe.DEFAULT_UTF8_ENCODING) {
    switch (t) {
      case "ascii":
        return this.FromBinary(e);
      case "utf8":
        return Wf.fromString(e);
      case "utf16":
      case "utf16be":
        return Yr.fromString(e);
      case "utf16le":
      case "usc2":
        return Yr.fromString(e, !0);
      default:
        throw new Error(`Unknown type of encoding '${t}'`);
    }
  }
  static ToUtf8String(e, t = fe.DEFAULT_UTF8_ENCODING) {
    switch (t) {
      case "ascii":
        return this.ToBinary(e);
      case "utf8":
        return Wf.toString(e);
      case "utf16":
      case "utf16be":
        return Yr.toString(e);
      case "utf16le":
      case "usc2":
        return Yr.toString(e, !0);
      default:
        throw new Error(`Unknown type of encoding '${t}'`);
    }
  }
  static FromBinary(e) {
    const t = e.length, n = new Uint8Array(t);
    for (let i = 0; i < t; i++)
      n[i] = e.charCodeAt(i);
    return n.buffer;
  }
  static ToBinary(e) {
    const t = W.toUint8Array(e);
    let n = "";
    for (let i = 0; i < t.length; i++)
      n += String.fromCharCode(t[i]);
    return n;
  }
  static ToHex(e) {
    const t = W.toUint8Array(e);
    let n = "";
    const i = t.length;
    for (let s = 0; s < i; s++) {
      const o = t[s];
      o < 16 && (n += "0"), n += o.toString(16);
    }
    return n;
  }
  static FromHex(e) {
    let t = this.formatString(e);
    if (!t)
      return new ArrayBuffer(0);
    if (!fe.isHex(t))
      throw new TypeError("Argument 'hexString' is not HEX encoded");
    t.length % 2 && (t = `0${t}`);
    const n = new Uint8Array(t.length / 2);
    for (let i = 0; i < t.length; i = i + 2) {
      const s = t.slice(i, i + 2);
      n[i / 2] = parseInt(s, 16);
    }
    return n.buffer;
  }
  static ToUtf16String(e, t = !1) {
    return Yr.toString(e, t);
  }
  static FromUtf16String(e, t = !1) {
    return Yr.fromString(e, t);
  }
  static Base64Padding(e) {
    const t = 4 - e.length % 4;
    if (t < 4)
      for (let n = 0; n < t; n++)
        e += "=";
    return e;
  }
  static formatString(e) {
    return (e == null ? void 0 : e.replace(/[\n\r\t ]/g, "")) || "";
  }
}
fe.DEFAULT_UTF8_ENCODING = "utf8";
function Cg(...r) {
  const e = r.map((i) => i.byteLength).reduce((i, s) => i + s), t = new Uint8Array(e);
  let n = 0;
  return r.map((i) => new Uint8Array(i)).forEach((i) => {
    for (const s of i)
      t[n++] = s;
  }), t.buffer;
}
function qo(r, e) {
  if (!(r && e) || r.byteLength !== e.byteLength)
    return !1;
  const t = new Uint8Array(r), n = new Uint8Array(e);
  for (let i = 0; i < r.byteLength; i++)
    if (t[i] !== n[i])
      return !1;
  return !0;
}
/*!
 Copyright (c) Peculiar Ventures, LLC
*/
function Li(r, e) {
  let t = 0;
  if (r.length === 1)
    return r[0];
  for (let n = r.length - 1; n >= 0; n--)
    t += r[r.length - 1 - n] * Math.pow(2, e * n);
  return t;
}
function ui(r, e, t = -1) {
  const n = t;
  let i = r, s = 0, o = Math.pow(2, e);
  for (let c = 1; c < 8; c++) {
    if (r < o) {
      let u;
      if (n < 0)
        u = new ArrayBuffer(c), s = c;
      else {
        if (n < c)
          return new ArrayBuffer(0);
        u = new ArrayBuffer(n), s = n;
      }
      const h = new Uint8Array(u);
      for (let m = c - 1; m >= 0; m--) {
        const x = Math.pow(2, m * e);
        h[s - m - 1] = Math.floor(i / x), i -= h[s - m - 1] * x;
      }
      return u;
    }
    o *= Math.pow(2, e);
  }
  return new ArrayBuffer(0);
}
function ul(...r) {
  let e = 0, t = 0;
  for (const s of r)
    e += s.length;
  const n = new ArrayBuffer(e), i = new Uint8Array(n);
  for (const s of r)
    i.set(s, t), t += s.length;
  return i;
}
function zd() {
  const r = new Uint8Array(this.valueHex);
  if (this.valueHex.byteLength >= 2) {
    const c = r[0] === 255 && r[1] & 128, u = r[0] === 0 && (r[1] & 128) === 0;
    (c || u) && this.warnings.push("Needlessly long format");
  }
  const e = new ArrayBuffer(this.valueHex.byteLength), t = new Uint8Array(e);
  for (let c = 0; c < this.valueHex.byteLength; c++)
    t[c] = 0;
  t[0] = r[0] & 128;
  const n = Li(t, 8), i = new ArrayBuffer(this.valueHex.byteLength), s = new Uint8Array(i);
  for (let c = 0; c < this.valueHex.byteLength; c++)
    s[c] = r[c];
  return s[0] &= 127, Li(s, 8) - n;
}
function Bg(r) {
  const e = r < 0 ? r * -1 : r;
  let t = 128;
  for (let n = 1; n < 8; n++) {
    if (e <= t) {
      if (r < 0) {
        const o = t - e, c = ui(o, 8, n), u = new Uint8Array(c);
        return u[0] |= 128, c;
      }
      let i = ui(e, 8, n), s = new Uint8Array(i);
      if (s[0] & 128) {
        const o = i.slice(0), c = new Uint8Array(o);
        i = new ArrayBuffer(i.byteLength + 1), s = new Uint8Array(i);
        for (let u = 0; u < o.byteLength; u++)
          s[u + 1] = c[u];
        s[0] = 0;
      }
      return i;
    }
    t *= Math.pow(2, 8);
  }
  return new ArrayBuffer(0);
}
function Og(r, e) {
  if (r.byteLength !== e.byteLength)
    return !1;
  const t = new Uint8Array(r), n = new Uint8Array(e);
  for (let i = 0; i < t.length; i++)
    if (t[i] !== n[i])
      return !1;
  return !0;
}
function Sr(r, e) {
  const t = r.toString(10);
  if (e < t.length)
    return "";
  const n = e - t.length, i = new Array(n);
  for (let o = 0; o < n; o++)
    i[o] = "0";
  return i.join("").concat(t);
}
/*!
 * Copyright (c) 2014, GMO GlobalSign
 * Copyright (c) 2015-2022, Peculiar Ventures
 * All rights reserved.
 * 
 * Author 2014-2019, Yury Strozhevsky
 * 
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 * 
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * 
 * * Redistributions in binary form must reproduce the above copyright notice, this
 *   list of conditions and the following disclaimer in the documentation and/or
 *   other materials provided with the distribution.
 * 
 * * Neither the name of the copyright holder nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 */
function Zo() {
  if (typeof BigInt > "u")
    throw new Error("BigInt is not defined. Your environment doesn't implement BigInt.");
}
function Uu(r) {
  let e = 0, t = 0;
  for (let i = 0; i < r.length; i++) {
    const s = r[i];
    e += s.byteLength;
  }
  const n = new Uint8Array(e);
  for (let i = 0; i < r.length; i++) {
    const s = r[i];
    n.set(new Uint8Array(s), t), t += s.byteLength;
  }
  return n.buffer;
}
function kn(r, e, t, n) {
  return e instanceof Uint8Array ? e.byteLength ? t < 0 ? (r.error = "Wrong parameter: inputOffset less than zero", !1) : n < 0 ? (r.error = "Wrong parameter: inputLength less than zero", !1) : e.byteLength - t - n < 0 ? (r.error = "End of input reached before message was fully decoded (inconsistent offset and length values)", !1) : !0 : (r.error = "Wrong parameter: inputBuffer has zero length", !1) : (r.error = "Wrong parameter: inputBuffer must be 'Uint8Array'", !1);
}
class Ga {
  constructor() {
    this.items = [];
  }
  write(e) {
    this.items.push(e);
  }
  final() {
    return Uu(this.items);
  }
}
const Is = [new Uint8Array([1])], Yf = "0123456789", Gc = "name", Jf = "valueHexView", Tg = "isHexOnly", Ng = "idBlock", Pg = "tagClass", jg = "tagNumber", Rg = "isConstructed", Ug = "fromBER", Dg = "toBER", $g = "local", yr = "", Kr = new ArrayBuffer(0), Ka = new Uint8Array(0), $s = "EndOfContent", Gd = "OCTET STRING", Kd = "BIT STRING";
function hn(r) {
  var e;
  return e = class extends r {
    constructor(...n) {
      var i;
      super(...n);
      const s = n[0] || {};
      this.isHexOnly = (i = s.isHexOnly) !== null && i !== void 0 ? i : !1, this.valueHexView = s.valueHex ? W.toUint8Array(s.valueHex) : Ka;
    }
    get valueHex() {
      return this.valueHexView.slice().buffer;
    }
    set valueHex(n) {
      this.valueHexView = new Uint8Array(n);
    }
    fromBER(n, i, s) {
      const o = n instanceof ArrayBuffer ? new Uint8Array(n) : n;
      if (!kn(this, o, i, s))
        return -1;
      const c = i + s;
      return this.valueHexView = o.subarray(i, c), this.valueHexView.length ? (this.blockLength = s, c) : (this.warnings.push("Zero buffer length"), i);
    }
    toBER(n = !1) {
      return this.isHexOnly ? n ? new ArrayBuffer(this.valueHexView.byteLength) : this.valueHexView.byteLength === this.valueHexView.buffer.byteLength ? this.valueHexView.buffer : this.valueHexView.slice().buffer : (this.error = "Flag 'isHexOnly' is not set, abort", Kr);
    }
    toJSON() {
      return {
        ...super.toJSON(),
        isHexOnly: this.isHexOnly,
        valueHex: fe.ToHex(this.valueHexView)
      };
    }
  }, e.NAME = "hexBlock", e;
}
class ki {
  constructor({ blockLength: e = 0, error: t = yr, warnings: n = [], valueBeforeDecode: i = Ka } = {}) {
    this.blockLength = e, this.error = t, this.warnings = n, this.valueBeforeDecodeView = W.toUint8Array(i);
  }
  static blockName() {
    return this.NAME;
  }
  get valueBeforeDecode() {
    return this.valueBeforeDecodeView.slice().buffer;
  }
  set valueBeforeDecode(e) {
    this.valueBeforeDecodeView = new Uint8Array(e);
  }
  toJSON() {
    return {
      blockName: this.constructor.NAME,
      blockLength: this.blockLength,
      error: this.error,
      warnings: this.warnings,
      valueBeforeDecode: fe.ToHex(this.valueBeforeDecodeView)
    };
  }
}
ki.NAME = "baseBlock";
class fr extends ki {
  fromBER(e, t, n) {
    throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
  }
  toBER(e, t) {
    throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
  }
}
fr.NAME = "valueBlock";
class qd extends hn(ki) {
  constructor({ idBlock: e = {} } = {}) {
    var t, n, i, s;
    super(), e ? (this.isHexOnly = (t = e.isHexOnly) !== null && t !== void 0 ? t : !1, this.valueHexView = e.valueHex ? W.toUint8Array(e.valueHex) : Ka, this.tagClass = (n = e.tagClass) !== null && n !== void 0 ? n : -1, this.tagNumber = (i = e.tagNumber) !== null && i !== void 0 ? i : -1, this.isConstructed = (s = e.isConstructed) !== null && s !== void 0 ? s : !1) : (this.tagClass = -1, this.tagNumber = -1, this.isConstructed = !1);
  }
  toBER(e = !1) {
    let t = 0;
    switch (this.tagClass) {
      case 1:
        t |= 0;
        break;
      case 2:
        t |= 64;
        break;
      case 3:
        t |= 128;
        break;
      case 4:
        t |= 192;
        break;
      default:
        return this.error = "Unknown tag class", Kr;
    }
    if (this.isConstructed && (t |= 32), this.tagNumber < 31 && !this.isHexOnly) {
      const i = new Uint8Array(1);
      if (!e) {
        let s = this.tagNumber;
        s &= 31, t |= s, i[0] = t;
      }
      return i.buffer;
    }
    if (!this.isHexOnly) {
      const i = ui(this.tagNumber, 7), s = new Uint8Array(i), o = i.byteLength, c = new Uint8Array(o + 1);
      if (c[0] = t | 31, !e) {
        for (let u = 0; u < o - 1; u++)
          c[u + 1] = s[u] | 128;
        c[o] = s[o - 1];
      }
      return c.buffer;
    }
    const n = new Uint8Array(this.valueHexView.byteLength + 1);
    if (n[0] = t | 31, !e) {
      const i = this.valueHexView;
      for (let s = 0; s < i.length - 1; s++)
        n[s + 1] = i[s] | 128;
      n[this.valueHexView.byteLength] = i[i.length - 1];
    }
    return n.buffer;
  }
  fromBER(e, t, n) {
    const i = W.toUint8Array(e);
    if (!kn(this, i, t, n))
      return -1;
    const s = i.subarray(t, t + n);
    if (s.length === 0)
      return this.error = "Zero buffer length", -1;
    switch (s[0] & 192) {
      case 0:
        this.tagClass = 1;
        break;
      case 64:
        this.tagClass = 2;
        break;
      case 128:
        this.tagClass = 3;
        break;
      case 192:
        this.tagClass = 4;
        break;
      default:
        return this.error = "Unknown tag class", -1;
    }
    this.isConstructed = (s[0] & 32) === 32, this.isHexOnly = !1;
    const c = s[0] & 31;
    if (c !== 31)
      this.tagNumber = c, this.blockLength = 1;
    else {
      let u = 1, h = this.valueHexView = new Uint8Array(255), m = 255;
      for (; s[u] & 128; ) {
        if (h[u - 1] = s[u] & 127, u++, u >= s.length)
          return this.error = "End of input reached before message was fully decoded", -1;
        if (u === m) {
          m += 255;
          const G = new Uint8Array(m);
          for (let N = 0; N < h.length; N++)
            G[N] = h[N];
          h = this.valueHexView = new Uint8Array(m);
        }
      }
      this.blockLength = u + 1, h[u - 1] = s[u] & 127;
      const x = new Uint8Array(u);
      for (let G = 0; G < u; G++)
        x[G] = h[G];
      h = this.valueHexView = new Uint8Array(u), h.set(x), this.blockLength <= 9 ? this.tagNumber = Li(h, 7) : (this.isHexOnly = !0, this.warnings.push("Tag too long, represented as hex-coded"));
    }
    if (this.tagClass === 1 && this.isConstructed)
      switch (this.tagNumber) {
        case 1:
        case 2:
        case 5:
        case 6:
        case 9:
        case 13:
        case 14:
        case 23:
        case 24:
        case 31:
        case 32:
        case 33:
        case 34:
          return this.error = "Constructed encoding used for primitive type", -1;
      }
    return t + this.blockLength;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      tagClass: this.tagClass,
      tagNumber: this.tagNumber,
      isConstructed: this.isConstructed
    };
  }
}
qd.NAME = "identificationBlock";
class Zd extends ki {
  constructor({ lenBlock: e = {} } = {}) {
    var t, n, i;
    super(), this.isIndefiniteForm = (t = e.isIndefiniteForm) !== null && t !== void 0 ? t : !1, this.longFormUsed = (n = e.longFormUsed) !== null && n !== void 0 ? n : !1, this.length = (i = e.length) !== null && i !== void 0 ? i : 0;
  }
  fromBER(e, t, n) {
    const i = W.toUint8Array(e);
    if (!kn(this, i, t, n))
      return -1;
    const s = i.subarray(t, t + n);
    if (s.length === 0)
      return this.error = "Zero buffer length", -1;
    if (s[0] === 255)
      return this.error = "Length block 0xFF is reserved by standard", -1;
    if (this.isIndefiniteForm = s[0] === 128, this.isIndefiniteForm)
      return this.blockLength = 1, t + this.blockLength;
    if (this.longFormUsed = !!(s[0] & 128), this.longFormUsed === !1)
      return this.length = s[0], this.blockLength = 1, t + this.blockLength;
    const o = s[0] & 127;
    if (o > 8)
      return this.error = "Too big integer", -1;
    if (o + 1 > s.length)
      return this.error = "End of input reached before message was fully decoded", -1;
    const c = t + 1, u = i.subarray(c, c + o);
    return u[o - 1] === 0 && this.warnings.push("Needlessly long encoded length"), this.length = Li(u, 8), this.longFormUsed && this.length <= 127 && this.warnings.push("Unnecessary usage of long length form"), this.blockLength = o + 1, t + this.blockLength;
  }
  toBER(e = !1) {
    let t, n;
    if (this.length > 127 && (this.longFormUsed = !0), this.isIndefiniteForm)
      return t = new ArrayBuffer(1), e === !1 && (n = new Uint8Array(t), n[0] = 128), t;
    if (this.longFormUsed) {
      const i = ui(this.length, 8);
      if (i.byteLength > 127)
        return this.error = "Too big length", Kr;
      if (t = new ArrayBuffer(i.byteLength + 1), e)
        return t;
      const s = new Uint8Array(i);
      n = new Uint8Array(t), n[0] = i.byteLength | 128;
      for (let o = 0; o < i.byteLength; o++)
        n[o + 1] = s[o];
      return t;
    }
    return t = new ArrayBuffer(1), e === !1 && (n = new Uint8Array(t), n[0] = this.length), t;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      isIndefiniteForm: this.isIndefiniteForm,
      longFormUsed: this.longFormUsed,
      length: this.length
    };
  }
}
Zd.NAME = "lengthBlock";
const oe = {};
class Jt extends ki {
  constructor({ name: e = yr, optional: t = !1, primitiveSchema: n, ...i } = {}, s) {
    super(i), this.name = e, this.optional = t, n && (this.primitiveSchema = n), this.idBlock = new qd(i), this.lenBlock = new Zd(i), this.valueBlock = s ? new s(i) : new fr(i);
  }
  fromBER(e, t, n) {
    const i = this.valueBlock.fromBER(e, t, this.lenBlock.isIndefiniteForm ? n : this.lenBlock.length);
    return i === -1 ? (this.error = this.valueBlock.error, i) : (this.idBlock.error.length || (this.blockLength += this.idBlock.blockLength), this.lenBlock.error.length || (this.blockLength += this.lenBlock.blockLength), this.valueBlock.error.length || (this.blockLength += this.valueBlock.blockLength), i);
  }
  toBER(e, t) {
    const n = t || new Ga();
    t || Wd(this);
    const i = this.idBlock.toBER(e);
    if (n.write(i), this.lenBlock.isIndefiniteForm)
      n.write(new Uint8Array([128]).buffer), this.valueBlock.toBER(e, n), n.write(new ArrayBuffer(2));
    else {
      const s = this.valueBlock.toBER(e);
      this.lenBlock.length = s.byteLength;
      const o = this.lenBlock.toBER(e);
      n.write(o), n.write(s);
    }
    return t ? Kr : n.final();
  }
  toJSON() {
    const e = {
      ...super.toJSON(),
      idBlock: this.idBlock.toJSON(),
      lenBlock: this.lenBlock.toJSON(),
      valueBlock: this.valueBlock.toJSON(),
      name: this.name,
      optional: this.optional
    };
    return this.primitiveSchema && (e.primitiveSchema = this.primitiveSchema.toJSON()), e;
  }
  toString(e = "ascii") {
    return e === "ascii" ? this.onAsciiEncoding() : fe.ToHex(this.toBER());
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${fe.ToHex(this.valueBlock.valueBeforeDecodeView)}`;
  }
  isEqual(e) {
    if (this === e)
      return !0;
    if (!(e instanceof this.constructor))
      return !1;
    const t = this.toBER(), n = e.toBER();
    return Og(t, n);
  }
}
Jt.NAME = "BaseBlock";
function Wd(r) {
  if (r instanceof oe.Constructed)
    for (const e of r.valueBlock.value)
      Wd(e) && (r.lenBlock.isIndefiniteForm = !0);
  return !!r.lenBlock.isIndefiniteForm;
}
class Du extends Jt {
  constructor({ value: e = yr, ...t } = {}, n) {
    super(t, n), e && this.fromString(e);
  }
  getValue() {
    return this.valueBlock.value;
  }
  setValue(e) {
    this.valueBlock.value = e;
  }
  fromBER(e, t, n) {
    const i = this.valueBlock.fromBER(e, t, this.lenBlock.isIndefiniteForm ? n : this.lenBlock.length);
    return i === -1 ? (this.error = this.valueBlock.error, i) : (this.fromBuffer(this.valueBlock.valueHexView), this.idBlock.error.length || (this.blockLength += this.idBlock.blockLength), this.lenBlock.error.length || (this.blockLength += this.lenBlock.blockLength), this.valueBlock.error.length || (this.blockLength += this.valueBlock.blockLength), i);
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : '${this.valueBlock.value}'`;
  }
}
Du.NAME = "BaseStringBlock";
class Yd extends hn(fr) {
  constructor({ isHexOnly: e = !0, ...t } = {}) {
    super(t), this.isHexOnly = e;
  }
}
Yd.NAME = "PrimitiveValueBlock";
var Jd;
class yo extends Jt {
  constructor(e = {}) {
    super(e, Yd), this.idBlock.isConstructed = !1;
  }
}
Jd = yo;
oe.Primitive = Jd;
yo.NAME = "PRIMITIVE";
function Mg(r, e) {
  if (r instanceof e)
    return r;
  const t = new e();
  return t.idBlock = r.idBlock, t.lenBlock = r.lenBlock, t.warnings = r.warnings, t.valueBeforeDecodeView = r.valueBeforeDecodeView, t;
}
function ss(r, e = 0, t = r.length) {
  const n = e;
  let i = new Jt({}, fr);
  const s = new ki();
  if (!kn(s, r, e, t))
    return i.error = s.error, {
      offset: -1,
      result: i
    };
  if (!r.subarray(e, e + t).length)
    return i.error = "Zero buffer length", {
      offset: -1,
      result: i
    };
  let c = i.idBlock.fromBER(r, e, t);
  if (i.idBlock.warnings.length && i.warnings.concat(i.idBlock.warnings), c === -1)
    return i.error = i.idBlock.error, {
      offset: -1,
      result: i
    };
  if (e = c, t -= i.idBlock.blockLength, c = i.lenBlock.fromBER(r, e, t), i.lenBlock.warnings.length && i.warnings.concat(i.lenBlock.warnings), c === -1)
    return i.error = i.lenBlock.error, {
      offset: -1,
      result: i
    };
  if (e = c, t -= i.lenBlock.blockLength, !i.idBlock.isConstructed && i.lenBlock.isIndefiniteForm)
    return i.error = "Indefinite length form used for primitive encoding form", {
      offset: -1,
      result: i
    };
  let u = Jt;
  switch (i.idBlock.tagClass) {
    case 1:
      if (i.idBlock.tagNumber >= 37 && i.idBlock.isHexOnly === !1)
        return i.error = "UNIVERSAL 37 and upper tags are reserved by ASN.1 standard", {
          offset: -1,
          result: i
        };
      switch (i.idBlock.tagNumber) {
        case 0:
          if (i.idBlock.isConstructed && i.lenBlock.length > 0)
            return i.error = "Type [UNIVERSAL 0] is reserved", {
              offset: -1,
              result: i
            };
          u = oe.EndOfContent;
          break;
        case 1:
          u = oe.Boolean;
          break;
        case 2:
          u = oe.Integer;
          break;
        case 3:
          u = oe.BitString;
          break;
        case 4:
          u = oe.OctetString;
          break;
        case 5:
          u = oe.Null;
          break;
        case 6:
          u = oe.ObjectIdentifier;
          break;
        case 10:
          u = oe.Enumerated;
          break;
        case 12:
          u = oe.Utf8String;
          break;
        case 13:
          u = oe.RelativeObjectIdentifier;
          break;
        case 14:
          u = oe.TIME;
          break;
        case 15:
          return i.error = "[UNIVERSAL 15] is reserved by ASN.1 standard", {
            offset: -1,
            result: i
          };
        case 16:
          u = oe.Sequence;
          break;
        case 17:
          u = oe.Set;
          break;
        case 18:
          u = oe.NumericString;
          break;
        case 19:
          u = oe.PrintableString;
          break;
        case 20:
          u = oe.TeletexString;
          break;
        case 21:
          u = oe.VideotexString;
          break;
        case 22:
          u = oe.IA5String;
          break;
        case 23:
          u = oe.UTCTime;
          break;
        case 24:
          u = oe.GeneralizedTime;
          break;
        case 25:
          u = oe.GraphicString;
          break;
        case 26:
          u = oe.VisibleString;
          break;
        case 27:
          u = oe.GeneralString;
          break;
        case 28:
          u = oe.UniversalString;
          break;
        case 29:
          u = oe.CharacterString;
          break;
        case 30:
          u = oe.BmpString;
          break;
        case 31:
          u = oe.DATE;
          break;
        case 32:
          u = oe.TimeOfDay;
          break;
        case 33:
          u = oe.DateTime;
          break;
        case 34:
          u = oe.Duration;
          break;
        default: {
          const h = i.idBlock.isConstructed ? new oe.Constructed() : new oe.Primitive();
          h.idBlock = i.idBlock, h.lenBlock = i.lenBlock, h.warnings = i.warnings, i = h;
        }
      }
      break;
    case 2:
    case 3:
    case 4:
    default:
      u = i.idBlock.isConstructed ? oe.Constructed : oe.Primitive;
  }
  return i = Mg(i, u), c = i.fromBER(r, e, i.lenBlock.isIndefiniteForm ? t : i.lenBlock.length), i.valueBeforeDecodeView = r.subarray(n, n + i.blockLength), {
    offset: c,
    result: i
  };
}
function $i(r) {
  if (!r.byteLength) {
    const e = new Jt({}, fr);
    return e.error = "Input buffer has zero length", {
      offset: -1,
      result: e
    };
  }
  return ss(W.toUint8Array(r).slice(), 0, r.byteLength);
}
function Vg(r, e) {
  return r ? 1 : e;
}
class Ln extends fr {
  constructor({ value: e = [], isIndefiniteForm: t = !1, ...n } = {}) {
    super(n), this.value = e, this.isIndefiniteForm = t;
  }
  fromBER(e, t, n) {
    const i = W.toUint8Array(e);
    if (!kn(this, i, t, n))
      return -1;
    if (this.valueBeforeDecodeView = i.subarray(t, t + n), this.valueBeforeDecodeView.length === 0)
      return this.warnings.push("Zero buffer length"), t;
    let s = t;
    for (; Vg(this.isIndefiniteForm, n) > 0; ) {
      const o = ss(i, s, n);
      if (o.offset === -1)
        return this.error = o.result.error, this.warnings.concat(o.result.warnings), -1;
      if (s = o.offset, this.blockLength += o.result.blockLength, n -= o.result.blockLength, this.value.push(o.result), this.isIndefiniteForm && o.result.constructor.NAME === $s)
        break;
    }
    return this.isIndefiniteForm && (this.value[this.value.length - 1].constructor.NAME === $s ? this.value.pop() : this.warnings.push("No EndOfContent block encoded")), s;
  }
  toBER(e, t) {
    const n = t || new Ga();
    for (let i = 0; i < this.value.length; i++)
      this.value[i].toBER(e, n);
    return t ? Kr : n.final();
  }
  toJSON() {
    const e = {
      ...super.toJSON(),
      isIndefiniteForm: this.isIndefiniteForm,
      value: []
    };
    for (const t of this.value)
      e.value.push(t.toJSON());
    return e;
  }
}
Ln.NAME = "ConstructedValueBlock";
var Xd;
class vr extends Jt {
  constructor(e = {}) {
    super(e, Ln), this.idBlock.isConstructed = !0;
  }
  fromBER(e, t, n) {
    this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
    const i = this.valueBlock.fromBER(e, t, this.lenBlock.isIndefiniteForm ? n : this.lenBlock.length);
    return i === -1 ? (this.error = this.valueBlock.error, i) : (this.idBlock.error.length || (this.blockLength += this.idBlock.blockLength), this.lenBlock.error.length || (this.blockLength += this.lenBlock.blockLength), this.valueBlock.error.length || (this.blockLength += this.valueBlock.blockLength), i);
  }
  onAsciiEncoding() {
    const e = [];
    for (const n of this.valueBlock.value)
      e.push(n.toString("ascii").split(`
`).map((i) => `  ${i}`).join(`
`));
    const t = this.idBlock.tagClass === 3 ? `[${this.idBlock.tagNumber}]` : this.constructor.NAME;
    return e.length ? `${t} :
${e.join(`
`)}` : `${t} :`;
  }
}
Xd = vr;
oe.Constructed = Xd;
vr.NAME = "CONSTRUCTED";
class Qd extends fr {
  fromBER(e, t, n) {
    return t;
  }
  toBER(e) {
    return Kr;
  }
}
Qd.override = "EndOfContentValueBlock";
var ep;
class $u extends Jt {
  constructor(e = {}) {
    super(e, Qd), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 0;
  }
}
ep = $u;
oe.EndOfContent = ep;
$u.NAME = $s;
var tp;
class fi extends Jt {
  constructor(e = {}) {
    super(e, fr), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 5;
  }
  fromBER(e, t, n) {
    return this.lenBlock.length > 0 && this.warnings.push("Non-zero length of value block for Null type"), this.idBlock.error.length || (this.blockLength += this.idBlock.blockLength), this.lenBlock.error.length || (this.blockLength += this.lenBlock.blockLength), this.blockLength += n, t + n > e.byteLength ? (this.error = "End of input reached before message was fully decoded (inconsistent offset and length values)", -1) : t + n;
  }
  toBER(e, t) {
    const n = new ArrayBuffer(2);
    if (!e) {
      const i = new Uint8Array(n);
      i[0] = 5, i[1] = 0;
    }
    return t && t.write(n), n;
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME}`;
  }
}
tp = fi;
oe.Null = tp;
fi.NAME = "NULL";
class rp extends hn(fr) {
  constructor({ value: e, ...t } = {}) {
    super(t), t.valueHex ? this.valueHexView = W.toUint8Array(t.valueHex) : this.valueHexView = new Uint8Array(1), e && (this.value = e);
  }
  get value() {
    for (const e of this.valueHexView)
      if (e > 0)
        return !0;
    return !1;
  }
  set value(e) {
    this.valueHexView[0] = e ? 255 : 0;
  }
  fromBER(e, t, n) {
    const i = W.toUint8Array(e);
    return kn(this, i, t, n) ? (this.valueHexView = i.subarray(t, t + n), n > 1 && this.warnings.push("Boolean value encoded in more then 1 octet"), this.isHexOnly = !0, zd.call(this), this.blockLength = n, t + n) : -1;
  }
  toBER() {
    return this.valueHexView.slice();
  }
  toJSON() {
    return {
      ...super.toJSON(),
      value: this.value
    };
  }
}
rp.NAME = "BooleanValueBlock";
var np;
let qa = class extends Jt {
  constructor(e = {}) {
    super(e, rp), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 1;
  }
  getValue() {
    return this.valueBlock.value;
  }
  setValue(e) {
    this.valueBlock.value = e;
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.getValue}`;
  }
};
np = qa;
oe.Boolean = np;
qa.NAME = "BOOLEAN";
class ip extends hn(Ln) {
  constructor({ isConstructed: e = !1, ...t } = {}) {
    super(t), this.isConstructed = e;
  }
  fromBER(e, t, n) {
    let i = 0;
    if (this.isConstructed) {
      if (this.isHexOnly = !1, i = Ln.prototype.fromBER.call(this, e, t, n), i === -1)
        return i;
      for (let s = 0; s < this.value.length; s++) {
        const o = this.value[s].constructor.NAME;
        if (o === $s) {
          if (this.isIndefiniteForm)
            break;
          return this.error = "EndOfContent is unexpected, OCTET STRING may consists of OCTET STRINGs only", -1;
        }
        if (o !== Gd)
          return this.error = "OCTET STRING may consists of OCTET STRINGs only", -1;
      }
    } else
      this.isHexOnly = !0, i = super.fromBER(e, t, n), this.blockLength = n;
    return i;
  }
  toBER(e, t) {
    return this.isConstructed ? Ln.prototype.toBER.call(this, e, t) : e ? new ArrayBuffer(this.valueHexView.byteLength) : this.valueHexView.slice().buffer;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      isConstructed: this.isConstructed
    };
  }
}
ip.NAME = "OctetStringValueBlock";
var sp;
let ai = class op extends Jt {
  constructor({ idBlock: e = {}, lenBlock: t = {}, ...n } = {}) {
    var i, s;
    (i = n.isConstructed) !== null && i !== void 0 || (n.isConstructed = !!(!((s = n.value) === null || s === void 0) && s.length)), super({
      idBlock: {
        isConstructed: n.isConstructed,
        ...e
      },
      lenBlock: {
        ...t,
        isIndefiniteForm: !!n.isIndefiniteForm
      },
      ...n
    }, ip), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 4;
  }
  fromBER(e, t, n) {
    if (this.valueBlock.isConstructed = this.idBlock.isConstructed, this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm, n === 0)
      return this.idBlock.error.length === 0 && (this.blockLength += this.idBlock.blockLength), this.lenBlock.error.length === 0 && (this.blockLength += this.lenBlock.blockLength), t;
    if (!this.valueBlock.isConstructed) {
      const s = (e instanceof ArrayBuffer ? new Uint8Array(e) : e).subarray(t, t + n);
      try {
        if (s.byteLength) {
          const o = ss(s, 0, s.byteLength);
          o.offset !== -1 && o.offset === n && (this.valueBlock.value = [o.result]);
        }
      } catch {
      }
    }
    return super.fromBER(e, t, n);
  }
  onAsciiEncoding() {
    return this.valueBlock.isConstructed || this.valueBlock.value && this.valueBlock.value.length ? vr.prototype.onAsciiEncoding.call(this) : `${this.constructor.NAME} : ${fe.ToHex(this.valueBlock.valueHexView)}`;
  }
  getValue() {
    if (!this.idBlock.isConstructed)
      return this.valueBlock.valueHexView.slice().buffer;
    const e = [];
    for (const t of this.valueBlock.value)
      t instanceof op && e.push(t.valueBlock.valueHexView);
    return W.concat(e);
  }
};
sp = ai;
oe.OctetString = sp;
ai.NAME = Gd;
class ap extends hn(Ln) {
  constructor({ unusedBits: e = 0, isConstructed: t = !1, ...n } = {}) {
    super(n), this.unusedBits = e, this.isConstructed = t, this.blockLength = this.valueHexView.byteLength;
  }
  fromBER(e, t, n) {
    if (!n)
      return t;
    let i = -1;
    if (this.isConstructed) {
      if (i = Ln.prototype.fromBER.call(this, e, t, n), i === -1)
        return i;
      for (const c of this.value) {
        const u = c.constructor.NAME;
        if (u === $s) {
          if (this.isIndefiniteForm)
            break;
          return this.error = "EndOfContent is unexpected, BIT STRING may consists of BIT STRINGs only", -1;
        }
        if (u !== Kd)
          return this.error = "BIT STRING may consists of BIT STRINGs only", -1;
        const h = c.valueBlock;
        if (this.unusedBits > 0 && h.unusedBits > 0)
          return this.error = 'Using of "unused bits" inside constructive BIT STRING allowed for least one only', -1;
        this.unusedBits = h.unusedBits;
      }
      return i;
    }
    const s = W.toUint8Array(e);
    if (!kn(this, s, t, n))
      return -1;
    const o = s.subarray(t, t + n);
    if (this.unusedBits = o[0], this.unusedBits > 7)
      return this.error = "Unused bits for BitString must be in range 0-7", -1;
    if (!this.unusedBits) {
      const c = o.subarray(1);
      try {
        if (c.byteLength) {
          const u = ss(c, 0, c.byteLength);
          u.offset !== -1 && u.offset === n - 1 && (this.value = [u.result]);
        }
      } catch {
      }
    }
    return this.valueHexView = o.subarray(1), this.blockLength = o.length, t + n;
  }
  toBER(e, t) {
    if (this.isConstructed)
      return Ln.prototype.toBER.call(this, e, t);
    if (e)
      return new ArrayBuffer(this.valueHexView.byteLength + 1);
    if (!this.valueHexView.byteLength)
      return Kr;
    const n = new Uint8Array(this.valueHexView.length + 1);
    return n[0] = this.unusedBits, n.set(this.valueHexView, 1), n.buffer;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      unusedBits: this.unusedBits,
      isConstructed: this.isConstructed
    };
  }
}
ap.NAME = "BitStringValueBlock";
var cp;
let ci = class extends Jt {
  constructor({ idBlock: e = {}, lenBlock: t = {}, ...n } = {}) {
    var i, s;
    (i = n.isConstructed) !== null && i !== void 0 || (n.isConstructed = !!(!((s = n.value) === null || s === void 0) && s.length)), super({
      idBlock: {
        isConstructed: n.isConstructed,
        ...e
      },
      lenBlock: {
        ...t,
        isIndefiniteForm: !!n.isIndefiniteForm
      },
      ...n
    }, ap), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 3;
  }
  fromBER(e, t, n) {
    return this.valueBlock.isConstructed = this.idBlock.isConstructed, this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm, super.fromBER(e, t, n);
  }
  onAsciiEncoding() {
    if (this.valueBlock.isConstructed || this.valueBlock.value && this.valueBlock.value.length)
      return vr.prototype.onAsciiEncoding.call(this);
    {
      const e = [], t = this.valueBlock.valueHexView;
      for (const i of t)
        e.push(i.toString(2).padStart(8, "0"));
      const n = e.join("");
      return `${this.constructor.NAME} : ${n.substring(0, n.length - this.valueBlock.unusedBits)}`;
    }
  }
};
cp = ci;
oe.BitString = cp;
ci.NAME = Kd;
var lp;
function Lg(r, e) {
  const t = new Uint8Array([0]), n = new Uint8Array(r), i = new Uint8Array(e);
  let s = n.slice(0);
  const o = s.length - 1, c = i.slice(0), u = c.length - 1;
  let h = 0;
  const m = u < o ? o : u;
  let x = 0;
  for (let G = m; G >= 0; G--, x++) {
    switch (!0) {
      case x < c.length:
        h = s[o - x] + c[u - x] + t[0];
        break;
      default:
        h = s[o - x] + t[0];
    }
    switch (t[0] = h / 10, !0) {
      case x >= s.length:
        s = ul(new Uint8Array([h % 10]), s);
        break;
      default:
        s[o - x] = h % 10;
    }
  }
  return t[0] > 0 && (s = ul(t, s)), s;
}
function Xf(r) {
  if (r >= Is.length)
    for (let e = Is.length; e <= r; e++) {
      const t = new Uint8Array([0]);
      let n = Is[e - 1].slice(0);
      for (let i = n.length - 1; i >= 0; i--) {
        const s = new Uint8Array([(n[i] << 1) + t[0]]);
        t[0] = s[0] / 10, n[i] = s[0] % 10;
      }
      t[0] > 0 && (n = ul(t, n)), Is.push(n);
    }
  return Is[r];
}
function Hg(r, e) {
  let t = 0;
  const n = new Uint8Array(r), i = new Uint8Array(e), s = n.slice(0), o = s.length - 1, c = i.slice(0), u = c.length - 1;
  let h, m = 0;
  for (let x = u; x >= 0; x--, m++)
    switch (h = s[o - m] - c[u - m] - t, !0) {
      case h < 0:
        t = 1, s[o - m] = h + 10;
        break;
      default:
        t = 0, s[o - m] = h;
    }
  if (t > 0)
    for (let x = o - u + 1; x >= 0; x--, m++)
      if (h = s[o - m] - t, h < 0)
        t = 1, s[o - m] = h + 10;
      else {
        t = 0, s[o - m] = h;
        break;
      }
  return s.slice();
}
class Mu extends hn(fr) {
  constructor({ value: e, ...t } = {}) {
    super(t), this._valueDec = 0, t.valueHex && this.setValueHex(), e !== void 0 && (this.valueDec = e);
  }
  setValueHex() {
    this.valueHexView.length >= 4 ? (this.warnings.push("Too big Integer for decoding, hex only"), this.isHexOnly = !0, this._valueDec = 0) : (this.isHexOnly = !1, this.valueHexView.length > 0 && (this._valueDec = zd.call(this)));
  }
  set valueDec(e) {
    this._valueDec = e, this.isHexOnly = !1, this.valueHexView = new Uint8Array(Bg(e));
  }
  get valueDec() {
    return this._valueDec;
  }
  fromDER(e, t, n, i = 0) {
    const s = this.fromBER(e, t, n);
    if (s === -1)
      return s;
    const o = this.valueHexView;
    return o[0] === 0 && o[1] & 128 ? this.valueHexView = o.subarray(1) : i !== 0 && o.length < i && (i - o.length > 1 && (i = o.length + 1), this.valueHexView = o.subarray(i - o.length)), s;
  }
  toDER(e = !1) {
    const t = this.valueHexView;
    switch (!0) {
      case (t[0] & 128) !== 0:
        {
          const n = new Uint8Array(this.valueHexView.length + 1);
          n[0] = 0, n.set(t, 1), this.valueHexView = n;
        }
        break;
      case (t[0] === 0 && (t[1] & 128) === 0):
        this.valueHexView = this.valueHexView.subarray(1);
        break;
    }
    return this.toBER(e);
  }
  fromBER(e, t, n) {
    const i = super.fromBER(e, t, n);
    return i === -1 || this.setValueHex(), i;
  }
  toBER(e) {
    return e ? new ArrayBuffer(this.valueHexView.length) : this.valueHexView.slice().buffer;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      valueDec: this.valueDec
    };
  }
  toString() {
    const e = this.valueHexView.length * 8 - 1;
    let t = new Uint8Array(this.valueHexView.length * 8 / 3), n = 0, i;
    const s = this.valueHexView;
    let o = "", c = !1;
    for (let u = s.byteLength - 1; u >= 0; u--) {
      i = s[u];
      for (let h = 0; h < 8; h++) {
        if ((i & 1) === 1)
          switch (n) {
            case e:
              t = Hg(Xf(n), t), o = "-";
              break;
            default:
              t = Lg(t, Xf(n));
          }
        n++, i >>= 1;
      }
    }
    for (let u = 0; u < t.length; u++)
      t[u] && (c = !0), c && (o += Yf.charAt(t[u]));
    return c === !1 && (o += Yf.charAt(0)), o;
  }
}
lp = Mu;
Mu.NAME = "IntegerValueBlock";
Object.defineProperty(lp.prototype, "valueHex", {
  set: function(r) {
    this.valueHexView = new Uint8Array(r), this.setValueHex();
  },
  get: function() {
    return this.valueHexView.slice().buffer;
  }
});
var up;
class nn extends Jt {
  constructor(e = {}) {
    super(e, Mu), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 2;
  }
  toBigInt() {
    return Zo(), BigInt(this.valueBlock.toString());
  }
  static fromBigInt(e) {
    Zo();
    const t = BigInt(e), n = new Ga(), i = t.toString(16).replace(/^-/, ""), s = new Uint8Array(fe.FromHex(i));
    if (t < 0) {
      const c = new Uint8Array(s.length + (s[0] & 128 ? 1 : 0));
      c[0] |= 128;
      const h = BigInt(`0x${fe.ToHex(c)}`) + t, m = W.toUint8Array(fe.FromHex(h.toString(16)));
      m[0] |= 128, n.write(m);
    } else
      s[0] & 128 && n.write(new Uint8Array([0])), n.write(s);
    return new nn({
      valueHex: n.final()
    });
  }
  convertToDER() {
    const e = new nn({ valueHex: this.valueBlock.valueHexView });
    return e.valueBlock.toDER(), e;
  }
  convertFromDER() {
    return new nn({
      valueHex: this.valueBlock.valueHexView[0] === 0 ? this.valueBlock.valueHexView.subarray(1) : this.valueBlock.valueHexView
    });
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.valueBlock.toString()}`;
  }
}
up = nn;
oe.Integer = up;
nn.NAME = "INTEGER";
var fp;
class Za extends nn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 10;
  }
}
fp = Za;
oe.Enumerated = fp;
Za.NAME = "ENUMERATED";
class fl extends hn(fr) {
  constructor({ valueDec: e = -1, isFirstSid: t = !1, ...n } = {}) {
    super(n), this.valueDec = e, this.isFirstSid = t;
  }
  fromBER(e, t, n) {
    if (!n)
      return t;
    const i = W.toUint8Array(e);
    if (!kn(this, i, t, n))
      return -1;
    const s = i.subarray(t, t + n);
    this.valueHexView = new Uint8Array(n);
    for (let c = 0; c < n && (this.valueHexView[c] = s[c] & 127, this.blockLength++, !!(s[c] & 128)); c++)
      ;
    const o = new Uint8Array(this.blockLength);
    for (let c = 0; c < this.blockLength; c++)
      o[c] = this.valueHexView[c];
    return this.valueHexView = o, s[this.blockLength - 1] & 128 ? (this.error = "End of input reached before message was fully decoded", -1) : (this.valueHexView[0] === 0 && this.warnings.push("Needlessly long format of SID encoding"), this.blockLength <= 8 ? this.valueDec = Li(this.valueHexView, 7) : (this.isHexOnly = !0, this.warnings.push("Too big SID for decoding, hex only")), t + this.blockLength);
  }
  set valueBigInt(e) {
    Zo();
    let t = BigInt(e).toString(2);
    for (; t.length % 7; )
      t = "0" + t;
    const n = new Uint8Array(t.length / 7);
    for (let i = 0; i < n.length; i++)
      n[i] = parseInt(t.slice(i * 7, i * 7 + 7), 2) + (i + 1 < n.length ? 128 : 0);
    this.fromBER(n.buffer, 0, n.length);
  }
  toBER(e) {
    if (this.isHexOnly) {
      if (e)
        return new ArrayBuffer(this.valueHexView.byteLength);
      const i = this.valueHexView, s = new Uint8Array(this.blockLength);
      for (let o = 0; o < this.blockLength - 1; o++)
        s[o] = i[o] | 128;
      return s[this.blockLength - 1] = i[this.blockLength - 1], s.buffer;
    }
    const t = ui(this.valueDec, 7);
    if (t.byteLength === 0)
      return this.error = "Error during encoding SID value", Kr;
    const n = new Uint8Array(t.byteLength);
    if (!e) {
      const i = new Uint8Array(t), s = t.byteLength - 1;
      for (let o = 0; o < s; o++)
        n[o] = i[o] | 128;
      n[s] = i[s];
    }
    return n;
  }
  toString() {
    let e = "";
    if (this.isHexOnly)
      e = fe.ToHex(this.valueHexView);
    else if (this.isFirstSid) {
      let t = this.valueDec;
      this.valueDec <= 39 ? e = "0." : this.valueDec <= 79 ? (e = "1.", t -= 40) : (e = "2.", t -= 80), e += t.toString();
    } else
      e = this.valueDec.toString();
    return e;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      valueDec: this.valueDec,
      isFirstSid: this.isFirstSid
    };
  }
}
fl.NAME = "sidBlock";
class hp extends fr {
  constructor({ value: e = yr, ...t } = {}) {
    super(t), this.value = [], e && this.fromString(e);
  }
  fromBER(e, t, n) {
    let i = t;
    for (; n > 0; ) {
      const s = new fl();
      if (i = s.fromBER(e, i, n), i === -1)
        return this.blockLength = 0, this.error = s.error, i;
      this.value.length === 0 && (s.isFirstSid = !0), this.blockLength += s.blockLength, n -= s.blockLength, this.value.push(s);
    }
    return i;
  }
  toBER(e) {
    const t = [];
    for (let n = 0; n < this.value.length; n++) {
      const i = this.value[n].toBER(e);
      if (i.byteLength === 0)
        return this.error = this.value[n].error, Kr;
      t.push(i);
    }
    return Uu(t);
  }
  fromString(e) {
    this.value = [];
    let t = 0, n = 0, i = "", s = !1;
    do
      if (n = e.indexOf(".", t), n === -1 ? i = e.substring(t) : i = e.substring(t, n), t = n + 1, s) {
        const o = this.value[0];
        let c = 0;
        switch (o.valueDec) {
          case 0:
            break;
          case 1:
            c = 40;
            break;
          case 2:
            c = 80;
            break;
          default:
            this.value = [];
            return;
        }
        const u = parseInt(i, 10);
        if (isNaN(u))
          return;
        o.valueDec = u + c, s = !1;
      } else {
        const o = new fl();
        if (i > Number.MAX_SAFE_INTEGER) {
          Zo();
          const c = BigInt(i);
          o.valueBigInt = c;
        } else if (o.valueDec = parseInt(i, 10), isNaN(o.valueDec))
          return;
        this.value.length || (o.isFirstSid = !0, s = !0), this.value.push(o);
      }
    while (n !== -1);
  }
  toString() {
    let e = "", t = !1;
    for (let n = 0; n < this.value.length; n++) {
      t = this.value[n].isHexOnly;
      let i = this.value[n].toString();
      n !== 0 && (e = `${e}.`), t ? (i = `{${i}}`, this.value[n].isFirstSid ? e = `2.{${i} - 80}` : e += i) : e += i;
    }
    return e;
  }
  toJSON() {
    const e = {
      ...super.toJSON(),
      value: this.toString(),
      sidArray: []
    };
    for (let t = 0; t < this.value.length; t++)
      e.sidArray.push(this.value[t].toJSON());
    return e;
  }
}
hp.NAME = "ObjectIdentifierValueBlock";
var dp;
class Wa extends Jt {
  constructor(e = {}) {
    super(e, hp), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 6;
  }
  getValue() {
    return this.valueBlock.toString();
  }
  setValue(e) {
    this.valueBlock.fromString(e);
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.valueBlock.toString() || "empty"}`;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      value: this.getValue()
    };
  }
}
dp = Wa;
oe.ObjectIdentifier = dp;
Wa.NAME = "OBJECT IDENTIFIER";
class hl extends hn(ki) {
  constructor({ valueDec: e = 0, ...t } = {}) {
    super(t), this.valueDec = e;
  }
  fromBER(e, t, n) {
    if (n === 0)
      return t;
    const i = W.toUint8Array(e);
    if (!kn(this, i, t, n))
      return -1;
    const s = i.subarray(t, t + n);
    this.valueHexView = new Uint8Array(n);
    for (let c = 0; c < n && (this.valueHexView[c] = s[c] & 127, this.blockLength++, !!(s[c] & 128)); c++)
      ;
    const o = new Uint8Array(this.blockLength);
    for (let c = 0; c < this.blockLength; c++)
      o[c] = this.valueHexView[c];
    return this.valueHexView = o, s[this.blockLength - 1] & 128 ? (this.error = "End of input reached before message was fully decoded", -1) : (this.valueHexView[0] === 0 && this.warnings.push("Needlessly long format of SID encoding"), this.blockLength <= 8 ? this.valueDec = Li(this.valueHexView, 7) : (this.isHexOnly = !0, this.warnings.push("Too big SID for decoding, hex only")), t + this.blockLength);
  }
  toBER(e) {
    if (this.isHexOnly) {
      if (e)
        return new ArrayBuffer(this.valueHexView.byteLength);
      const i = this.valueHexView, s = new Uint8Array(this.blockLength);
      for (let o = 0; o < this.blockLength - 1; o++)
        s[o] = i[o] | 128;
      return s[this.blockLength - 1] = i[this.blockLength - 1], s.buffer;
    }
    const t = ui(this.valueDec, 7);
    if (t.byteLength === 0)
      return this.error = "Error during encoding SID value", Kr;
    const n = new Uint8Array(t.byteLength);
    if (!e) {
      const i = new Uint8Array(t), s = t.byteLength - 1;
      for (let o = 0; o < s; o++)
        n[o] = i[o] | 128;
      n[s] = i[s];
    }
    return n.buffer;
  }
  toString() {
    let e = "";
    return this.isHexOnly ? e = fe.ToHex(this.valueHexView) : e = this.valueDec.toString(), e;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      valueDec: this.valueDec
    };
  }
}
hl.NAME = "relativeSidBlock";
class pp extends fr {
  constructor({ value: e = yr, ...t } = {}) {
    super(t), this.value = [], e && this.fromString(e);
  }
  fromBER(e, t, n) {
    let i = t;
    for (; n > 0; ) {
      const s = new hl();
      if (i = s.fromBER(e, i, n), i === -1)
        return this.blockLength = 0, this.error = s.error, i;
      this.blockLength += s.blockLength, n -= s.blockLength, this.value.push(s);
    }
    return i;
  }
  toBER(e, t) {
    const n = [];
    for (let i = 0; i < this.value.length; i++) {
      const s = this.value[i].toBER(e);
      if (s.byteLength === 0)
        return this.error = this.value[i].error, Kr;
      n.push(s);
    }
    return Uu(n);
  }
  fromString(e) {
    this.value = [];
    let t = 0, n = 0, i = "";
    do {
      n = e.indexOf(".", t), n === -1 ? i = e.substring(t) : i = e.substring(t, n), t = n + 1;
      const s = new hl();
      if (s.valueDec = parseInt(i, 10), isNaN(s.valueDec))
        return !0;
      this.value.push(s);
    } while (n !== -1);
    return !0;
  }
  toString() {
    let e = "", t = !1;
    for (let n = 0; n < this.value.length; n++) {
      t = this.value[n].isHexOnly;
      let i = this.value[n].toString();
      n !== 0 && (e = `${e}.`), t && (i = `{${i}}`), e += i;
    }
    return e;
  }
  toJSON() {
    const e = {
      ...super.toJSON(),
      value: this.toString(),
      sidArray: []
    };
    for (let t = 0; t < this.value.length; t++)
      e.sidArray.push(this.value[t].toJSON());
    return e;
  }
}
pp.NAME = "RelativeObjectIdentifierValueBlock";
var yp;
class Vu extends Jt {
  constructor(e = {}) {
    super(e, pp), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 13;
  }
  getValue() {
    return this.valueBlock.toString();
  }
  setValue(e) {
    this.valueBlock.fromString(e);
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.valueBlock.toString() || "empty"}`;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      value: this.getValue()
    };
  }
}
yp = Vu;
oe.RelativeObjectIdentifier = yp;
Vu.NAME = "RelativeObjectIdentifier";
var gp;
class wn extends vr {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 16;
  }
}
gp = wn;
oe.Sequence = gp;
wn.NAME = "SEQUENCE";
var vp;
let bn = class extends vr {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 17;
  }
};
vp = bn;
oe.Set = vp;
bn.NAME = "SET";
class mp extends hn(fr) {
  constructor({ ...e } = {}) {
    super(e), this.isHexOnly = !0, this.value = yr;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      value: this.value
    };
  }
}
mp.NAME = "StringValueBlock";
class wp extends mp {
}
wp.NAME = "SimpleStringValueBlock";
class Ir extends Du {
  constructor({ ...e } = {}) {
    super(e, wp);
  }
  fromBuffer(e) {
    this.valueBlock.value = String.fromCharCode.apply(null, W.toUint8Array(e));
  }
  fromString(e) {
    const t = e.length, n = this.valueBlock.valueHexView = new Uint8Array(t);
    for (let i = 0; i < t; i++)
      n[i] = e.charCodeAt(i);
    this.valueBlock.value = e;
  }
}
Ir.NAME = "SIMPLE STRING";
class bp extends Ir {
  fromBuffer(e) {
    this.valueBlock.valueHexView = W.toUint8Array(e);
    try {
      this.valueBlock.value = fe.ToUtf8String(e);
    } catch (t) {
      this.warnings.push(`Error during "decodeURIComponent": ${t}, using raw string`), this.valueBlock.value = fe.ToBinary(e);
    }
  }
  fromString(e) {
    this.valueBlock.valueHexView = new Uint8Array(fe.FromUtf8String(e)), this.valueBlock.value = e;
  }
}
bp.NAME = "Utf8StringValueBlock";
var xp;
class Cn extends bp {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 12;
  }
}
xp = Cn;
oe.Utf8String = xp;
Cn.NAME = "UTF8String";
class Ap extends Ir {
  fromBuffer(e) {
    this.valueBlock.value = fe.ToUtf16String(e), this.valueBlock.valueHexView = W.toUint8Array(e);
  }
  fromString(e) {
    this.valueBlock.value = e, this.valueBlock.valueHexView = new Uint8Array(fe.FromUtf16String(e));
  }
}
Ap.NAME = "BmpStringValueBlock";
var Sp;
class Ya extends Ap {
  constructor({ ...e } = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 30;
  }
}
Sp = Ya;
oe.BmpString = Sp;
Ya.NAME = "BMPString";
class _p extends Ir {
  fromBuffer(e) {
    const t = ArrayBuffer.isView(e) ? e.slice().buffer : e.slice(0), n = new Uint8Array(t);
    for (let i = 0; i < n.length; i += 4)
      n[i] = n[i + 3], n[i + 1] = n[i + 2], n[i + 2] = 0, n[i + 3] = 0;
    this.valueBlock.value = String.fromCharCode.apply(null, new Uint32Array(t));
  }
  fromString(e) {
    const t = e.length, n = this.valueBlock.valueHexView = new Uint8Array(t * 4);
    for (let i = 0; i < t; i++) {
      const s = ui(e.charCodeAt(i), 8), o = new Uint8Array(s);
      if (o.length > 4)
        continue;
      const c = 4 - o.length;
      for (let u = o.length - 1; u >= 0; u--)
        n[i * 4 + u + c] = o[u];
    }
    this.valueBlock.value = e;
  }
}
_p.NAME = "UniversalStringValueBlock";
var Ep;
class Ja extends _p {
  constructor({ ...e } = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 28;
  }
}
Ep = Ja;
oe.UniversalString = Ep;
Ja.NAME = "UniversalString";
var Ip;
class Xa extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 18;
  }
}
Ip = Xa;
oe.NumericString = Ip;
Xa.NAME = "NumericString";
var kp;
class Qa extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 19;
  }
}
kp = Qa;
oe.PrintableString = kp;
Qa.NAME = "PrintableString";
var Cp;
class ec extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 20;
  }
}
Cp = ec;
oe.TeletexString = Cp;
ec.NAME = "TeletexString";
var Bp;
class tc extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 21;
  }
}
Bp = tc;
oe.VideotexString = Bp;
tc.NAME = "VideotexString";
var Op;
class rc extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 22;
  }
}
Op = rc;
oe.IA5String = Op;
rc.NAME = "IA5String";
var Tp;
class nc extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 25;
  }
}
Tp = nc;
oe.GraphicString = Tp;
nc.NAME = "GraphicString";
var Np;
class go extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 26;
  }
}
Np = go;
oe.VisibleString = Np;
go.NAME = "VisibleString";
var Pp;
class ic extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 27;
  }
}
Pp = ic;
oe.GeneralString = Pp;
ic.NAME = "GeneralString";
var jp;
class sc extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 29;
  }
}
jp = sc;
oe.CharacterString = jp;
sc.NAME = "CharacterString";
var Rp;
class vo extends go {
  constructor({ value: e, valueDate: t, ...n } = {}) {
    if (super(n), this.year = 0, this.month = 0, this.day = 0, this.hour = 0, this.minute = 0, this.second = 0, e) {
      this.fromString(e), this.valueBlock.valueHexView = new Uint8Array(e.length);
      for (let i = 0; i < e.length; i++)
        this.valueBlock.valueHexView[i] = e.charCodeAt(i);
    }
    t && (this.fromDate(t), this.valueBlock.valueHexView = new Uint8Array(this.toBuffer())), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 23;
  }
  fromBuffer(e) {
    this.fromString(String.fromCharCode.apply(null, W.toUint8Array(e)));
  }
  toBuffer() {
    const e = this.toString(), t = new ArrayBuffer(e.length), n = new Uint8Array(t);
    for (let i = 0; i < e.length; i++)
      n[i] = e.charCodeAt(i);
    return t;
  }
  fromDate(e) {
    this.year = e.getUTCFullYear(), this.month = e.getUTCMonth() + 1, this.day = e.getUTCDate(), this.hour = e.getUTCHours(), this.minute = e.getUTCMinutes(), this.second = e.getUTCSeconds();
  }
  toDate() {
    return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second));
  }
  fromString(e) {
    const n = /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z/ig.exec(e);
    if (n === null) {
      this.error = "Wrong input string for conversion";
      return;
    }
    const i = parseInt(n[1], 10);
    i >= 50 ? this.year = 1900 + i : this.year = 2e3 + i, this.month = parseInt(n[2], 10), this.day = parseInt(n[3], 10), this.hour = parseInt(n[4], 10), this.minute = parseInt(n[5], 10), this.second = parseInt(n[6], 10);
  }
  toString(e = "iso") {
    if (e === "iso") {
      const t = new Array(7);
      return t[0] = Sr(this.year < 2e3 ? this.year - 1900 : this.year - 2e3, 2), t[1] = Sr(this.month, 2), t[2] = Sr(this.day, 2), t[3] = Sr(this.hour, 2), t[4] = Sr(this.minute, 2), t[5] = Sr(this.second, 2), t[6] = "Z", t.join("");
    }
    return super.toString(e);
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.toDate().toISOString()}`;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      year: this.year,
      month: this.month,
      day: this.day,
      hour: this.hour,
      minute: this.minute,
      second: this.second
    };
  }
}
Rp = vo;
oe.UTCTime = Rp;
vo.NAME = "UTCTime";
var Up;
class oc extends vo {
  constructor(e = {}) {
    var t;
    super(e), (t = this.millisecond) !== null && t !== void 0 || (this.millisecond = 0), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 24;
  }
  fromDate(e) {
    super.fromDate(e), this.millisecond = e.getUTCMilliseconds();
  }
  toDate() {
    return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.millisecond));
  }
  fromString(e) {
    let t = !1, n = "", i = "", s = 0, o, c = 0, u = 0;
    if (e[e.length - 1] === "Z")
      n = e.substring(0, e.length - 1), t = !0;
    else {
      const x = new Number(e[e.length - 1]);
      if (isNaN(x.valueOf()))
        throw new Error("Wrong input string for conversion");
      n = e;
    }
    if (t) {
      if (n.indexOf("+") !== -1)
        throw new Error("Wrong input string for conversion");
      if (n.indexOf("-") !== -1)
        throw new Error("Wrong input string for conversion");
    } else {
      let x = 1, G = n.indexOf("+"), N = "";
      if (G === -1 && (G = n.indexOf("-"), x = -1), G !== -1) {
        if (N = n.substring(G + 1), n = n.substring(0, G), N.length !== 2 && N.length !== 4)
          throw new Error("Wrong input string for conversion");
        let v = parseInt(N.substring(0, 2), 10);
        if (isNaN(v.valueOf()))
          throw new Error("Wrong input string for conversion");
        if (c = x * v, N.length === 4) {
          if (v = parseInt(N.substring(2, 4), 10), isNaN(v.valueOf()))
            throw new Error("Wrong input string for conversion");
          u = x * v;
        }
      }
    }
    let h = n.indexOf(".");
    if (h === -1 && (h = n.indexOf(",")), h !== -1) {
      const x = new Number(`0${n.substring(h)}`);
      if (isNaN(x.valueOf()))
        throw new Error("Wrong input string for conversion");
      s = x.valueOf(), i = n.substring(0, h);
    } else
      i = n;
    switch (!0) {
      case i.length === 8:
        if (o = /(\d{4})(\d{2})(\d{2})/ig, h !== -1)
          throw new Error("Wrong input string for conversion");
        break;
      case i.length === 10:
        if (o = /(\d{4})(\d{2})(\d{2})(\d{2})/ig, h !== -1) {
          let x = 60 * s;
          this.minute = Math.floor(x), x = 60 * (x - this.minute), this.second = Math.floor(x), x = 1e3 * (x - this.second), this.millisecond = Math.floor(x);
        }
        break;
      case i.length === 12:
        if (o = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/ig, h !== -1) {
          let x = 60 * s;
          this.second = Math.floor(x), x = 1e3 * (x - this.second), this.millisecond = Math.floor(x);
        }
        break;
      case i.length === 14:
        if (o = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/ig, h !== -1) {
          const x = 1e3 * s;
          this.millisecond = Math.floor(x);
        }
        break;
      default:
        throw new Error("Wrong input string for conversion");
    }
    const m = o.exec(i);
    if (m === null)
      throw new Error("Wrong input string for conversion");
    for (let x = 1; x < m.length; x++)
      switch (x) {
        case 1:
          this.year = parseInt(m[x], 10);
          break;
        case 2:
          this.month = parseInt(m[x], 10);
          break;
        case 3:
          this.day = parseInt(m[x], 10);
          break;
        case 4:
          this.hour = parseInt(m[x], 10) + c;
          break;
        case 5:
          this.minute = parseInt(m[x], 10) + u;
          break;
        case 6:
          this.second = parseInt(m[x], 10);
          break;
        default:
          throw new Error("Wrong input string for conversion");
      }
    if (t === !1) {
      const x = new Date(this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
      this.year = x.getUTCFullYear(), this.month = x.getUTCMonth(), this.day = x.getUTCDay(), this.hour = x.getUTCHours(), this.minute = x.getUTCMinutes(), this.second = x.getUTCSeconds(), this.millisecond = x.getUTCMilliseconds();
    }
  }
  toString(e = "iso") {
    if (e === "iso") {
      const t = [];
      return t.push(Sr(this.year, 4)), t.push(Sr(this.month, 2)), t.push(Sr(this.day, 2)), t.push(Sr(this.hour, 2)), t.push(Sr(this.minute, 2)), t.push(Sr(this.second, 2)), this.millisecond !== 0 && (t.push("."), t.push(Sr(this.millisecond, 3))), t.push("Z"), t.join("");
    }
    return super.toString(e);
  }
  toJSON() {
    return {
      ...super.toJSON(),
      millisecond: this.millisecond
    };
  }
}
Up = oc;
oe.GeneralizedTime = Up;
oc.NAME = "GeneralizedTime";
var Dp;
class Lu extends Cn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 31;
  }
}
Dp = Lu;
oe.DATE = Dp;
Lu.NAME = "DATE";
var $p;
class Hu extends Cn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 32;
  }
}
$p = Hu;
oe.TimeOfDay = $p;
Hu.NAME = "TimeOfDay";
var Mp;
class Fu extends Cn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 33;
  }
}
Mp = Fu;
oe.DateTime = Mp;
Fu.NAME = "DateTime";
var Vp;
class zu extends Cn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 34;
  }
}
Vp = zu;
oe.Duration = Vp;
zu.NAME = "Duration";
var Lp;
class Gu extends Cn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 14;
  }
}
Lp = Gu;
oe.TIME = Lp;
Gu.NAME = "TIME";
class hi {
  constructor({ name: e = yr, optional: t = !1 } = {}) {
    this.name = e, this.optional = t;
  }
}
class Ku extends hi {
  constructor({ value: e = [], ...t } = {}) {
    super(t), this.value = e;
  }
}
class Wo extends hi {
  constructor({ value: e = new hi(), local: t = !1, ...n } = {}) {
    super(n), this.value = e, this.local = t;
  }
}
class Fg {
  constructor({ data: e = Ka } = {}) {
    this.dataView = W.toUint8Array(e);
  }
  get data() {
    return this.dataView.slice().buffer;
  }
  set data(e) {
    this.dataView = W.toUint8Array(e);
  }
  fromBER(e, t, n) {
    const i = t + n;
    return this.dataView = W.toUint8Array(e).subarray(t, i), i;
  }
  toBER(e) {
    return this.dataView.slice().buffer;
  }
}
function ni(r, e, t) {
  if (t instanceof Ku) {
    for (let s = 0; s < t.value.length; s++)
      if (ni(r, e, t.value[s]).verified)
        return {
          verified: !0,
          result: r
        };
    {
      const s = {
        verified: !1,
        result: {
          error: "Wrong values for Choice type"
        }
      };
      return t.hasOwnProperty(Gc) && (s.name = t.name), s;
    }
  }
  if (t instanceof hi)
    return t.hasOwnProperty(Gc) && (r[t.name] = e), {
      verified: !0,
      result: r
    };
  if (!(r instanceof Object))
    return {
      verified: !1,
      result: { error: "Wrong root object" }
    };
  if (!(e instanceof Object))
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 data" }
    };
  if (!(t instanceof Object))
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (!(Ng in t))
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (!(Ug in t.idBlock))
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (!(Dg in t.idBlock))
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  const n = t.idBlock.toBER(!1);
  if (n.byteLength === 0)
    return {
      verified: !1,
      result: { error: "Error encoding idBlock for ASN.1 schema" }
    };
  if (t.idBlock.fromBER(n, 0, n.byteLength) === -1)
    return {
      verified: !1,
      result: { error: "Error decoding idBlock for ASN.1 schema" }
    };
  if (t.idBlock.hasOwnProperty(Pg) === !1)
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (t.idBlock.tagClass !== e.idBlock.tagClass)
    return {
      verified: !1,
      result: r
    };
  if (t.idBlock.hasOwnProperty(jg) === !1)
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (t.idBlock.tagNumber !== e.idBlock.tagNumber)
    return {
      verified: !1,
      result: r
    };
  if (t.idBlock.hasOwnProperty(Rg) === !1)
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (t.idBlock.isConstructed !== e.idBlock.isConstructed)
    return {
      verified: !1,
      result: r
    };
  if (!(Tg in t.idBlock))
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (t.idBlock.isHexOnly !== e.idBlock.isHexOnly)
    return {
      verified: !1,
      result: r
    };
  if (t.idBlock.isHexOnly) {
    if (!(Jf in t.idBlock))
      return {
        verified: !1,
        result: { error: "Wrong ASN.1 schema" }
      };
    const s = t.idBlock.valueHexView, o = e.idBlock.valueHexView;
    if (s.length !== o.length)
      return {
        verified: !1,
        result: r
      };
    for (let c = 0; c < s.length; c++)
      if (s[c] !== o[1])
        return {
          verified: !1,
          result: r
        };
  }
  if (t.name && (t.name = t.name.replace(/^\s+|\s+$/g, yr), t.name && (r[t.name] = e)), t instanceof oe.Constructed) {
    let s = 0, o = {
      verified: !1,
      result: {
        error: "Unknown error"
      }
    }, c = t.valueBlock.value.length;
    if (c > 0 && t.valueBlock.value[0] instanceof Wo && (c = e.valueBlock.value.length), c === 0)
      return {
        verified: !0,
        result: r
      };
    if (e.valueBlock.value.length === 0 && t.valueBlock.value.length !== 0) {
      let u = !0;
      for (let h = 0; h < t.valueBlock.value.length; h++)
        u = u && (t.valueBlock.value[h].optional || !1);
      return u ? {
        verified: !0,
        result: r
      } : (t.name && (t.name = t.name.replace(/^\s+|\s+$/g, yr), t.name && delete r[t.name]), r.error = "Inconsistent object length", {
        verified: !1,
        result: r
      });
    }
    for (let u = 0; u < c; u++)
      if (u - s >= e.valueBlock.value.length) {
        if (t.valueBlock.value[u].optional === !1) {
          const h = {
            verified: !1,
            result: r
          };
          return r.error = "Inconsistent length between ASN.1 data and schema", t.name && (t.name = t.name.replace(/^\s+|\s+$/g, yr), t.name && (delete r[t.name], h.name = t.name)), h;
        }
      } else if (t.valueBlock.value[0] instanceof Wo) {
        if (o = ni(r, e.valueBlock.value[u], t.valueBlock.value[0].value), o.verified === !1)
          if (t.valueBlock.value[0].optional)
            s++;
          else
            return t.name && (t.name = t.name.replace(/^\s+|\s+$/g, yr), t.name && delete r[t.name]), o;
        if (Gc in t.valueBlock.value[0] && t.valueBlock.value[0].name.length > 0) {
          let h = {};
          $g in t.valueBlock.value[0] && t.valueBlock.value[0].local ? h = e : h = r, typeof h[t.valueBlock.value[0].name] > "u" && (h[t.valueBlock.value[0].name] = []), h[t.valueBlock.value[0].name].push(e.valueBlock.value[u]);
        }
      } else if (o = ni(r, e.valueBlock.value[u - s], t.valueBlock.value[u]), o.verified === !1)
        if (t.valueBlock.value[u].optional)
          s++;
        else
          return t.name && (t.name = t.name.replace(/^\s+|\s+$/g, yr), t.name && delete r[t.name]), o;
    if (o.verified === !1) {
      const u = {
        verified: !1,
        result: r
      };
      return t.name && (t.name = t.name.replace(/^\s+|\s+$/g, yr), t.name && (delete r[t.name], u.name = t.name)), u;
    }
    return {
      verified: !0,
      result: r
    };
  }
  if (t.primitiveSchema && Jf in e.valueBlock) {
    const s = ss(e.valueBlock.valueHexView);
    if (s.offset === -1) {
      const o = {
        verified: !1,
        result: s.result
      };
      return t.name && (t.name = t.name.replace(/^\s+|\s+$/g, yr), t.name && (delete r[t.name], o.name = t.name)), o;
    }
    return ni(r, s.result, t.primitiveSchema);
  }
  return {
    verified: !0,
    result: r
  };
}
function zg(r, e) {
  if (!(e instanceof Object))
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema type" }
    };
  const t = ss(W.toUint8Array(r));
  return t.offset === -1 ? {
    verified: !1,
    result: t.result
  } : ni(t.result, t.result, e);
}
const Hp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Any: hi,
  BaseBlock: Jt,
  BaseStringBlock: Du,
  BitString: ci,
  BmpString: Ya,
  Boolean: qa,
  CharacterString: sc,
  Choice: Ku,
  Constructed: vr,
  DATE: Lu,
  DateTime: Fu,
  Duration: zu,
  EndOfContent: $u,
  Enumerated: Za,
  GeneralString: ic,
  GeneralizedTime: oc,
  GraphicString: nc,
  HexBlock: hn,
  IA5String: rc,
  Integer: nn,
  Null: fi,
  NumericString: Xa,
  ObjectIdentifier: Wa,
  OctetString: ai,
  Primitive: yo,
  PrintableString: Qa,
  RawData: Fg,
  RelativeObjectIdentifier: Vu,
  Repeated: Wo,
  Sequence: wn,
  Set: bn,
  TIME: Gu,
  TeletexString: ec,
  TimeOfDay: Hu,
  UTCTime: vo,
  UniversalString: Ja,
  Utf8String: Cn,
  ValueBlock: fr,
  VideotexString: tc,
  ViewWriter: Ga,
  VisibleString: go,
  compareSchema: ni,
  fromBER: $i,
  verifySchema: zg
}, Symbol.toStringTag, { value: "Module" }));
var M;
(function(r) {
  r[r.Sequence = 0] = "Sequence", r[r.Set = 1] = "Set", r[r.Choice = 2] = "Choice";
})(M || (M = {}));
var b;
(function(r) {
  r[r.Any = 1] = "Any", r[r.Boolean = 2] = "Boolean", r[r.OctetString = 3] = "OctetString", r[r.BitString = 4] = "BitString", r[r.Integer = 5] = "Integer", r[r.Enumerated = 6] = "Enumerated", r[r.ObjectIdentifier = 7] = "ObjectIdentifier", r[r.Utf8String = 8] = "Utf8String", r[r.BmpString = 9] = "BmpString", r[r.UniversalString = 10] = "UniversalString", r[r.NumericString = 11] = "NumericString", r[r.PrintableString = 12] = "PrintableString", r[r.TeletexString = 13] = "TeletexString", r[r.VideotexString = 14] = "VideotexString", r[r.IA5String = 15] = "IA5String", r[r.GraphicString = 16] = "GraphicString", r[r.VisibleString = 17] = "VisibleString", r[r.GeneralString = 18] = "GeneralString", r[r.CharacterString = 19] = "CharacterString", r[r.UTCTime = 20] = "UTCTime", r[r.GeneralizedTime = 21] = "GeneralizedTime", r[r.DATE = 22] = "DATE", r[r.TimeOfDay = 23] = "TimeOfDay", r[r.DateTime = 24] = "DateTime", r[r.Duration = 25] = "Duration", r[r.TIME = 26] = "TIME", r[r.Null = 27] = "Null";
})(b || (b = {}));
class ac {
  constructor(e, t = 0) {
    if (this.unusedBits = 0, this.value = new ArrayBuffer(0), e)
      if (typeof e == "number")
        this.fromNumber(e);
      else if (W.isBufferSource(e))
        this.unusedBits = t, this.value = W.toArrayBuffer(e);
      else
        throw TypeError("Unsupported type of 'params' argument for BitString");
  }
  fromASN(e) {
    if (!(e instanceof ci))
      throw new TypeError("Argument 'asn' is not instance of ASN.1 BitString");
    return this.unusedBits = e.valueBlock.unusedBits, this.value = e.valueBlock.valueHex, this;
  }
  toASN() {
    return new ci({ unusedBits: this.unusedBits, valueHex: this.value });
  }
  toSchema(e) {
    return new ci({ name: e });
  }
  toNumber() {
    let e = "";
    const t = new Uint8Array(this.value);
    for (const n of t)
      e += n.toString(2).padStart(8, "0");
    return e = e.split("").reverse().join(""), this.unusedBits && (e = e.slice(this.unusedBits).padStart(this.unusedBits, "0")), parseInt(e, 2);
  }
  fromNumber(e) {
    let t = e.toString(2);
    const n = t.length + 7 >> 3;
    this.unusedBits = (n << 3) - t.length;
    const i = new Uint8Array(n);
    t = t.padStart(n << 3, "0").split("").reverse().join("");
    let s = 0;
    for (; s < n; )
      i[s] = parseInt(t.slice(s << 3, (s << 3) + 8), 2), s++;
    this.value = i.buffer;
  }
}
class nt {
  get byteLength() {
    return this.buffer.byteLength;
  }
  get byteOffset() {
    return 0;
  }
  constructor(e) {
    typeof e == "number" ? this.buffer = new ArrayBuffer(e) : W.isBufferSource(e) ? this.buffer = W.toArrayBuffer(e) : Array.isArray(e) ? this.buffer = new Uint8Array(e) : this.buffer = new ArrayBuffer(0);
  }
  fromASN(e) {
    if (!(e instanceof ai))
      throw new TypeError("Argument 'asn' is not instance of ASN.1 OctetString");
    return this.buffer = e.valueBlock.valueHex, this;
  }
  toASN() {
    return new ai({ valueHex: this.buffer });
  }
  toSchema(e) {
    return new ai({ name: e });
  }
}
const Gg = {
  fromASN: (r) => r instanceof fi ? null : r.valueBeforeDecodeView,
  toASN: (r) => {
    if (r === null)
      return new fi();
    const e = $i(r);
    if (e.result.error)
      throw new Error(e.result.error);
    return e.result;
  }
}, Kg = {
  fromASN: (r) => r.valueBlock.valueHexView.byteLength >= 4 ? r.valueBlock.toString() : r.valueBlock.valueDec,
  toASN: (r) => new nn({ value: +r })
}, qg = {
  fromASN: (r) => r.valueBlock.valueDec,
  toASN: (r) => new Za({ value: r })
}, xt = {
  fromASN: (r) => r.valueBlock.valueHexView,
  toASN: (r) => new nn({ valueHex: r })
}, Zg = {
  fromASN: (r) => r.valueBlock.valueHexView,
  toASN: (r) => new ci({ valueHex: r })
}, Wg = {
  fromASN: (r) => r.valueBlock.toString(),
  toASN: (r) => new Wa({ value: r })
}, Yg = {
  fromASN: (r) => r.valueBlock.value,
  toASN: (r) => new qa({ value: r })
}, Yo = {
  fromASN: (r) => r.valueBlock.valueHexView,
  toASN: (r) => new ai({ valueHex: r })
}, Jg = {
  fromASN: (r) => new nt(r.getValue()),
  toASN: (r) => r.toASN()
};
function Nr(r) {
  return {
    fromASN: (e) => e.valueBlock.value,
    toASN: (e) => new r({ value: e })
  };
}
const Fp = Nr(Cn), Xg = Nr(Ya), Qg = Nr(Ja), ev = Nr(Xa), tv = Nr(Qa), rv = Nr(ec), nv = Nr(tc), iv = Nr(rc), sv = Nr(nc), ov = Nr(go), av = Nr(ic), cv = Nr(sc), lv = {
  fromASN: (r) => r.toDate(),
  toASN: (r) => new vo({ valueDate: r })
}, uv = {
  fromASN: (r) => r.toDate(),
  toASN: (r) => new oc({ valueDate: r })
}, fv = {
  fromASN: () => null,
  toASN: () => new fi()
};
function qu(r) {
  switch (r) {
    case b.Any:
      return Gg;
    case b.BitString:
      return Zg;
    case b.BmpString:
      return Xg;
    case b.Boolean:
      return Yg;
    case b.CharacterString:
      return cv;
    case b.Enumerated:
      return qg;
    case b.GeneralString:
      return av;
    case b.GeneralizedTime:
      return uv;
    case b.GraphicString:
      return sv;
    case b.IA5String:
      return iv;
    case b.Integer:
      return Kg;
    case b.Null:
      return fv;
    case b.NumericString:
      return ev;
    case b.ObjectIdentifier:
      return Wg;
    case b.OctetString:
      return Yo;
    case b.PrintableString:
      return tv;
    case b.TeletexString:
      return rv;
    case b.UTCTime:
      return lv;
    case b.UniversalString:
      return Qg;
    case b.Utf8String:
      return Fp;
    case b.VideotexString:
      return nv;
    case b.VisibleString:
      return ov;
    default:
      return null;
  }
}
function vn(r) {
  return typeof r == "function" && r.prototype ? r.prototype.toASN && r.prototype.fromASN ? !0 : vn(r.prototype) : !!(r && typeof r == "object" && "toASN" in r && "fromASN" in r);
}
function zp(r) {
  var e;
  if (r) {
    const t = Object.getPrototypeOf(r);
    return ((e = t == null ? void 0 : t.prototype) === null || e === void 0 ? void 0 : e.constructor) === Array ? !0 : zp(t);
  }
  return !1;
}
function hv(r, e) {
  if (!(r && e) || r.byteLength !== e.byteLength)
    return !1;
  const t = new Uint8Array(r), n = new Uint8Array(e);
  for (let i = 0; i < r.byteLength; i++)
    if (t[i] !== n[i])
      return !1;
  return !0;
}
class dv {
  constructor() {
    this.items = /* @__PURE__ */ new WeakMap();
  }
  has(e) {
    return this.items.has(e);
  }
  get(e, t = !1) {
    const n = this.items.get(e);
    if (!n)
      throw new Error(`Cannot get schema for '${e.prototype.constructor.name}' target`);
    if (t && !n.schema)
      throw new Error(`Schema '${e.prototype.constructor.name}' doesn't contain ASN.1 schema. Call 'AsnSchemaStorage.cache'.`);
    return n;
  }
  cache(e) {
    const t = this.get(e);
    t.schema || (t.schema = this.create(e, !0));
  }
  createDefault(e) {
    const t = {
      type: M.Sequence,
      items: {}
    }, n = this.findParentSchema(e);
    return n && (Object.assign(t, n), t.items = Object.assign({}, t.items, n.items)), t;
  }
  create(e, t) {
    const n = this.items.get(e) || this.createDefault(e), i = [];
    for (const s in n.items) {
      const o = n.items[s], c = t ? s : "";
      let u;
      if (typeof o.type == "number") {
        const m = b[o.type], x = Hp[m];
        if (!x)
          throw new Error(`Cannot get ASN1 class by name '${m}'`);
        u = new x({ name: c });
      } else vn(o.type) ? u = new o.type().toSchema(c) : o.optional ? this.get(o.type).type === M.Choice ? u = new hi({ name: c }) : (u = this.create(o.type, !1), u.name = c) : u = new hi({ name: c });
      const h = !!o.optional || o.defaultValue !== void 0;
      if (o.repeated) {
        u.name = "";
        const m = o.repeated === "set" ? bn : wn;
        u = new m({
          name: "",
          value: [
            new Wo({
              name: c,
              value: u
            })
          ]
        });
      }
      if (o.context !== null && o.context !== void 0)
        if (o.implicit)
          if (typeof o.type == "number" || vn(o.type)) {
            const m = o.repeated ? vr : yo;
            i.push(new m({
              name: c,
              optional: h,
              idBlock: {
                tagClass: 3,
                tagNumber: o.context
              }
            }));
          } else {
            this.cache(o.type);
            const m = !!o.repeated;
            let x = m ? u : this.get(o.type, !0).schema;
            x = "valueBlock" in x ? x.valueBlock.value : x.value, i.push(new vr({
              name: m ? "" : c,
              optional: h,
              idBlock: {
                tagClass: 3,
                tagNumber: o.context
              },
              value: x
            }));
          }
        else
          i.push(new vr({
            optional: h,
            idBlock: {
              tagClass: 3,
              tagNumber: o.context
            },
            value: [u]
          }));
      else
        u.optional = h, i.push(u);
    }
    switch (n.type) {
      case M.Sequence:
        return new wn({ value: i, name: "" });
      case M.Set:
        return new bn({ value: i, name: "" });
      case M.Choice:
        return new Ku({ value: i, name: "" });
      default:
        throw new Error("Unsupported ASN1 type in use");
    }
  }
  set(e, t) {
    return this.items.set(e, t), this;
  }
  findParentSchema(e) {
    const t = Object.getPrototypeOf(e);
    return t ? this.items.get(t) || this.findParentSchema(t) : null;
  }
}
const Or = new dv(), H = (r) => (e) => {
  let t;
  Or.has(e) ? t = Or.get(e) : (t = Or.createDefault(e), Or.set(e, t)), Object.assign(t, r);
}, y = (r) => (e, t) => {
  let n;
  Or.has(e.constructor) ? n = Or.get(e.constructor) : (n = Or.createDefault(e.constructor), Or.set(e.constructor, n));
  const i = Object.assign({}, r);
  if (typeof i.type == "number" && !i.converter) {
    const s = qu(r.type);
    if (!s)
      throw new Error(`Cannot get default converter for property '${t}' of ${e.constructor.name}`);
    i.converter = s;
  }
  n.items[t] = i;
};
class Qf extends Error {
  constructor() {
    super(...arguments), this.schemas = [];
  }
}
class pv {
  static parse(e, t) {
    const n = $i(e);
    if (n.result.error)
      throw new Error(n.result.error);
    return this.fromASN(n.result, t);
  }
  static fromASN(e, t) {
    var n;
    try {
      if (vn(t))
        return new t().fromASN(e);
      const i = Or.get(t);
      Or.cache(t);
      let s = i.schema;
      if (e.constructor === vr && i.type !== M.Choice) {
        s = new vr({
          idBlock: {
            tagClass: 3,
            tagNumber: e.idBlock.tagNumber
          },
          value: i.schema.valueBlock.value
        });
        for (const u in i.items)
          delete e[u];
      }
      const o = ni({}, e, s);
      if (!o.verified)
        throw new Qf(`Data does not match to ${t.name} ASN1 schema. ${o.result.error}`);
      const c = new t();
      if (zp(t)) {
        if (!("value" in e.valueBlock && Array.isArray(e.valueBlock.value)))
          throw new Error("Cannot get items from the ASN.1 parsed value. ASN.1 object is not constructed.");
        const u = i.itemType;
        if (typeof u == "number") {
          const h = qu(u);
          if (!h)
            throw new Error(`Cannot get default converter for array item of ${t.name} ASN1 schema`);
          return t.from(e.valueBlock.value, (m) => h.fromASN(m));
        } else
          return t.from(e.valueBlock.value, (h) => this.fromASN(h, u));
      }
      for (const u in i.items) {
        const h = o.result[u];
        if (!h)
          continue;
        const m = i.items[u], x = m.type;
        if (typeof x == "number" || vn(x)) {
          const G = (n = m.converter) !== null && n !== void 0 ? n : vn(x) ? new x() : null;
          if (!G)
            throw new Error("Converter is empty");
          if (m.repeated)
            if (m.implicit) {
              const N = m.repeated === "sequence" ? wn : bn, v = new N();
              v.valueBlock = h.valueBlock;
              const A = $i(v.toBER(!1));
              if (A.offset === -1)
                throw new Error(`Cannot parse the child item. ${A.result.error}`);
              if (!("value" in A.result.valueBlock && Array.isArray(A.result.valueBlock.value)))
                throw new Error("Cannot get items from the ASN.1 parsed value. ASN.1 object is not constructed.");
              const O = A.result.valueBlock.value;
              c[u] = Array.from(O, (I) => G.fromASN(I));
            } else
              c[u] = Array.from(h, (N) => G.fromASN(N));
          else {
            let N = h;
            if (m.implicit) {
              let v;
              if (vn(x))
                v = new x().toSchema("");
              else {
                const A = b[x], O = Hp[A];
                if (!O)
                  throw new Error(`Cannot get '${A}' class from asn1js module`);
                v = new O();
              }
              v.valueBlock = N.valueBlock, N = $i(v.toBER(!1)).result;
            }
            c[u] = G.fromASN(N);
          }
        } else if (m.repeated) {
          if (!Array.isArray(h))
            throw new Error("Cannot get list of items from the ASN.1 parsed value. ASN.1 value should be iterable.");
          c[u] = Array.from(h, (G) => this.fromASN(G, x));
        } else
          c[u] = this.fromASN(h, x);
      }
      return c;
    } catch (i) {
      throw i instanceof Qf && i.schemas.push(t.name), i;
    }
  }
}
class Zu {
  static serialize(e) {
    return e instanceof Jt ? e.toBER(!1) : this.toASN(e).toBER(!1);
  }
  static toASN(e) {
    if (e && typeof e == "object" && vn(e))
      return e.toASN();
    if (!(e && typeof e == "object"))
      throw new TypeError("Parameter 1 should be type of Object.");
    const t = e.constructor, n = Or.get(t);
    Or.cache(t);
    let i = [];
    if (n.itemType) {
      if (!Array.isArray(e))
        throw new TypeError("Parameter 1 should be type of Array.");
      if (typeof n.itemType == "number") {
        const o = qu(n.itemType);
        if (!o)
          throw new Error(`Cannot get default converter for array item of ${t.name} ASN1 schema`);
        i = e.map((c) => o.toASN(c));
      } else
        i = e.map((o) => this.toAsnItem({ type: n.itemType }, "[]", t, o));
    } else
      for (const o in n.items) {
        const c = n.items[o], u = e[o];
        if (u === void 0 || c.defaultValue === u || typeof c.defaultValue == "object" && typeof u == "object" && hv(this.serialize(c.defaultValue), this.serialize(u)))
          continue;
        const h = Zu.toAsnItem(c, o, t, u);
        if (typeof c.context == "number")
          if (c.implicit)
            if (!c.repeated && (typeof c.type == "number" || vn(c.type))) {
              const m = {};
              m.valueHex = h instanceof fi ? h.valueBeforeDecodeView : h.valueBlock.toBER(), i.push(new yo({
                optional: c.optional,
                idBlock: {
                  tagClass: 3,
                  tagNumber: c.context
                },
                ...m
              }));
            } else
              i.push(new vr({
                optional: c.optional,
                idBlock: {
                  tagClass: 3,
                  tagNumber: c.context
                },
                value: h.valueBlock.value
              }));
          else
            i.push(new vr({
              optional: c.optional,
              idBlock: {
                tagClass: 3,
                tagNumber: c.context
              },
              value: [h]
            }));
        else c.repeated ? i = i.concat(h) : i.push(h);
      }
    let s;
    switch (n.type) {
      case M.Sequence:
        s = new wn({ value: i });
        break;
      case M.Set:
        s = new bn({ value: i });
        break;
      case M.Choice:
        if (!i[0])
          throw new Error(`Schema '${t.name}' has wrong data. Choice cannot be empty.`);
        s = i[0];
        break;
    }
    return s;
  }
  static toAsnItem(e, t, n, i) {
    let s;
    if (typeof e.type == "number") {
      const o = e.converter;
      if (!o)
        throw new Error(`Property '${t}' doesn't have converter for type ${b[e.type]} in schema '${n.name}'`);
      if (e.repeated) {
        if (!Array.isArray(i))
          throw new TypeError("Parameter 'objProp' should be type of Array.");
        const c = Array.from(i, (h) => o.toASN(h)), u = e.repeated === "sequence" ? wn : bn;
        s = new u({
          value: c
        });
      } else
        s = o.toASN(i);
    } else if (e.repeated) {
      if (!Array.isArray(i))
        throw new TypeError("Parameter 'objProp' should be type of Array.");
      const o = Array.from(i, (u) => this.toASN(u)), c = e.repeated === "sequence" ? wn : bn;
      s = new c({
        value: o
      });
    } else
      s = this.toASN(i);
    return s;
  }
}
class pt extends Array {
  constructor(e = []) {
    if (typeof e == "number")
      super(e);
    else {
      super();
      for (const t of e)
        this.push(t);
    }
  }
}
class q {
  static serialize(e) {
    return Zu.serialize(e);
  }
  static parse(e, t) {
    return pv.parse(e, t);
  }
  static toString(e) {
    const t = W.isBufferSource(e) ? W.toArrayBuffer(e) : q.serialize(e), n = $i(t);
    if (n.offset === -1)
      throw new Error(`Cannot decode ASN.1 data. ${n.result.error}`);
    return n.result.toString();
  }
}
function f(r, e, t, n) {
  var i = arguments.length, s = i < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") s = Reflect.decorate(r, e, t, n);
  else for (var c = r.length - 1; c >= 0; c--) (o = r[c]) && (s = (i < 3 ? o(s) : i > 3 ? o(e, t, s) : o(e, t)) || s);
  return i > 3 && s && Object.defineProperty(e, t, s), s;
}
var Gp = { exports: {} };
(function(r) {
  (function(e) {
    const t = "(0?\\d+|0x[a-f0-9]+)", n = {
      fourOctet: new RegExp(`^${t}\\.${t}\\.${t}\\.${t}$`, "i"),
      threeOctet: new RegExp(`^${t}\\.${t}\\.${t}$`, "i"),
      twoOctet: new RegExp(`^${t}\\.${t}$`, "i"),
      longValue: new RegExp(`^${t}$`, "i")
    }, i = new RegExp("^0[0-7]+$", "i"), s = new RegExp("^0x[a-f0-9]+$", "i"), o = "%[0-9a-z]{1,}", c = "(?:[0-9a-f]+::?)+", u = {
      zoneIndex: new RegExp(o, "i"),
      native: new RegExp(`^(::)?(${c})?([0-9a-f]+)?(::)?(${o})?$`, "i"),
      deprecatedTransitional: new RegExp(`^(?:::)(${t}\\.${t}\\.${t}\\.${t}(${o})?)$`, "i"),
      transitional: new RegExp(`^((?:${c})|(?:::)(?:${c})?)${t}\\.${t}\\.${t}\\.${t}(${o})?$`, "i")
    };
    function h(v, A) {
      if (v.indexOf("::") !== v.lastIndexOf("::"))
        return null;
      let O = 0, I = -1, P = (v.match(u.zoneIndex) || [])[0], R, ce;
      for (P && (P = P.substring(1), v = v.replace(/%.+$/, "")); (I = v.indexOf(":", I + 1)) >= 0; )
        O++;
      if (v.substr(0, 2) === "::" && O--, v.substr(-2, 2) === "::" && O--, O > A)
        return null;
      for (ce = A - O, R = ":"; ce--; )
        R += "0:";
      return v = v.replace("::", R), v[0] === ":" && (v = v.slice(1)), v[v.length - 1] === ":" && (v = v.slice(0, -1)), A = function() {
        const ze = v.split(":"), Je = [];
        for (let Pe = 0; Pe < ze.length; Pe++)
          Je.push(parseInt(ze[Pe], 16));
        return Je;
      }(), {
        parts: A,
        zoneId: P
      };
    }
    function m(v, A, O, I) {
      if (v.length !== A.length)
        throw new Error("ipaddr: cannot match CIDR for objects with different lengths");
      let P = 0, R;
      for (; I > 0; ) {
        if (R = O - I, R < 0 && (R = 0), v[P] >> R !== A[P] >> R)
          return !1;
        I -= O, P += 1;
      }
      return !0;
    }
    function x(v) {
      if (s.test(v))
        return parseInt(v, 16);
      if (v[0] === "0" && !isNaN(parseInt(v[1], 10))) {
        if (i.test(v))
          return parseInt(v, 8);
        throw new Error(`ipaddr: cannot parse ${v} as octal`);
      }
      return parseInt(v, 10);
    }
    function G(v, A) {
      for (; v.length < A; )
        v = `0${v}`;
      return v;
    }
    const N = {};
    N.IPv4 = function() {
      function v(A) {
        if (A.length !== 4)
          throw new Error("ipaddr: ipv4 octet count should be 4");
        let O, I;
        for (O = 0; O < A.length; O++)
          if (I = A[O], !(0 <= I && I <= 255))
            throw new Error("ipaddr: ipv4 octet should fit in 8 bits");
        this.octets = A;
      }
      return v.prototype.SpecialRanges = {
        unspecified: [[new v([0, 0, 0, 0]), 8]],
        broadcast: [[new v([255, 255, 255, 255]), 32]],
        // RFC3171
        multicast: [[new v([224, 0, 0, 0]), 4]],
        // RFC3927
        linkLocal: [[new v([169, 254, 0, 0]), 16]],
        // RFC5735
        loopback: [[new v([127, 0, 0, 0]), 8]],
        // RFC6598
        carrierGradeNat: [[new v([100, 64, 0, 0]), 10]],
        // RFC1918
        private: [
          [new v([10, 0, 0, 0]), 8],
          [new v([172, 16, 0, 0]), 12],
          [new v([192, 168, 0, 0]), 16]
        ],
        // Reserved and testing-only ranges; RFCs 5735, 5737, 2544, 1700
        reserved: [
          [new v([192, 0, 0, 0]), 24],
          [new v([192, 0, 2, 0]), 24],
          [new v([192, 88, 99, 0]), 24],
          [new v([198, 18, 0, 0]), 15],
          [new v([198, 51, 100, 0]), 24],
          [new v([203, 0, 113, 0]), 24],
          [new v([240, 0, 0, 0]), 4]
        ],
        // RFC7534, RFC7535
        as112: [
          [new v([192, 175, 48, 0]), 24],
          [new v([192, 31, 196, 0]), 24]
        ],
        // RFC7450
        amt: [
          [new v([192, 52, 193, 0]), 24]
        ]
      }, v.prototype.kind = function() {
        return "ipv4";
      }, v.prototype.match = function(A, O) {
        let I;
        if (O === void 0 && (I = A, A = I[0], O = I[1]), A.kind() !== "ipv4")
          throw new Error("ipaddr: cannot match ipv4 address with non-ipv4 one");
        return m(this.octets, A.octets, 8, O);
      }, v.prototype.prefixLengthFromSubnetMask = function() {
        let A = 0, O = !1;
        const I = {
          0: 8,
          128: 7,
          192: 6,
          224: 5,
          240: 4,
          248: 3,
          252: 2,
          254: 1,
          255: 0
        };
        let P, R, ce;
        for (P = 3; P >= 0; P -= 1)
          if (R = this.octets[P], R in I) {
            if (ce = I[R], O && ce !== 0)
              return null;
            ce !== 8 && (O = !0), A += ce;
          } else
            return null;
        return 32 - A;
      }, v.prototype.range = function() {
        return N.subnetMatch(this, this.SpecialRanges);
      }, v.prototype.toByteArray = function() {
        return this.octets.slice(0);
      }, v.prototype.toIPv4MappedAddress = function() {
        return N.IPv6.parse(`::ffff:${this.toString()}`);
      }, v.prototype.toNormalizedString = function() {
        return this.toString();
      }, v.prototype.toString = function() {
        return this.octets.join(".");
      }, v;
    }(), N.IPv4.broadcastAddressFromCIDR = function(v) {
      try {
        const A = this.parseCIDR(v), O = A[0].toByteArray(), I = this.subnetMaskFromPrefixLength(A[1]).toByteArray(), P = [];
        let R = 0;
        for (; R < 4; )
          P.push(parseInt(O[R], 10) | parseInt(I[R], 10) ^ 255), R++;
        return new this(P);
      } catch {
        throw new Error("ipaddr: the address does not have IPv4 CIDR format");
      }
    }, N.IPv4.isIPv4 = function(v) {
      return this.parser(v) !== null;
    }, N.IPv4.isValid = function(v) {
      try {
        return new this(this.parser(v)), !0;
      } catch {
        return !1;
      }
    }, N.IPv4.isValidCIDR = function(v) {
      try {
        return this.parseCIDR(v), !0;
      } catch {
        return !1;
      }
    }, N.IPv4.isValidFourPartDecimal = function(v) {
      return !!(N.IPv4.isValid(v) && v.match(/^(0|[1-9]\d*)(\.(0|[1-9]\d*)){3}$/));
    }, N.IPv4.networkAddressFromCIDR = function(v) {
      let A, O, I, P, R;
      try {
        for (A = this.parseCIDR(v), I = A[0].toByteArray(), R = this.subnetMaskFromPrefixLength(A[1]).toByteArray(), P = [], O = 0; O < 4; )
          P.push(parseInt(I[O], 10) & parseInt(R[O], 10)), O++;
        return new this(P);
      } catch {
        throw new Error("ipaddr: the address does not have IPv4 CIDR format");
      }
    }, N.IPv4.parse = function(v) {
      const A = this.parser(v);
      if (A === null)
        throw new Error("ipaddr: string is not formatted like an IPv4 Address");
      return new this(A);
    }, N.IPv4.parseCIDR = function(v) {
      let A;
      if (A = v.match(/^(.+)\/(\d+)$/)) {
        const O = parseInt(A[2]);
        if (O >= 0 && O <= 32) {
          const I = [this.parse(A[1]), O];
          return Object.defineProperty(I, "toString", {
            value: function() {
              return this.join("/");
            }
          }), I;
        }
      }
      throw new Error("ipaddr: string is not formatted like an IPv4 CIDR range");
    }, N.IPv4.parser = function(v) {
      let A, O, I;
      if (A = v.match(n.fourOctet))
        return function() {
          const P = A.slice(1, 6), R = [];
          for (let ce = 0; ce < P.length; ce++)
            O = P[ce], R.push(x(O));
          return R;
        }();
      if (A = v.match(n.longValue)) {
        if (I = x(A[1]), I > 4294967295 || I < 0)
          throw new Error("ipaddr: address outside defined range");
        return function() {
          const P = [];
          let R;
          for (R = 0; R <= 24; R += 8)
            P.push(I >> R & 255);
          return P;
        }().reverse();
      } else return (A = v.match(n.twoOctet)) ? function() {
        const P = A.slice(1, 4), R = [];
        if (I = x(P[1]), I > 16777215 || I < 0)
          throw new Error("ipaddr: address outside defined range");
        return R.push(x(P[0])), R.push(I >> 16 & 255), R.push(I >> 8 & 255), R.push(I & 255), R;
      }() : (A = v.match(n.threeOctet)) ? function() {
        const P = A.slice(1, 5), R = [];
        if (I = x(P[2]), I > 65535 || I < 0)
          throw new Error("ipaddr: address outside defined range");
        return R.push(x(P[0])), R.push(x(P[1])), R.push(I >> 8 & 255), R.push(I & 255), R;
      }() : null;
    }, N.IPv4.subnetMaskFromPrefixLength = function(v) {
      if (v = parseInt(v), v < 0 || v > 32)
        throw new Error("ipaddr: invalid IPv4 prefix length");
      const A = [0, 0, 0, 0];
      let O = 0;
      const I = Math.floor(v / 8);
      for (; O < I; )
        A[O] = 255, O++;
      return I < 4 && (A[I] = Math.pow(2, v % 8) - 1 << 8 - v % 8), new this(A);
    }, N.IPv6 = function() {
      function v(A, O) {
        let I, P;
        if (A.length === 16)
          for (this.parts = [], I = 0; I <= 14; I += 2)
            this.parts.push(A[I] << 8 | A[I + 1]);
        else if (A.length === 8)
          this.parts = A;
        else
          throw new Error("ipaddr: ipv6 part count should be 8 or 16");
        for (I = 0; I < this.parts.length; I++)
          if (P = this.parts[I], !(0 <= P && P <= 65535))
            throw new Error("ipaddr: ipv6 part should fit in 16 bits");
        O && (this.zoneId = O);
      }
      return v.prototype.SpecialRanges = {
        // RFC4291, here and after
        unspecified: [new v([0, 0, 0, 0, 0, 0, 0, 0]), 128],
        linkLocal: [new v([65152, 0, 0, 0, 0, 0, 0, 0]), 10],
        multicast: [new v([65280, 0, 0, 0, 0, 0, 0, 0]), 8],
        loopback: [new v([0, 0, 0, 0, 0, 0, 0, 1]), 128],
        uniqueLocal: [new v([64512, 0, 0, 0, 0, 0, 0, 0]), 7],
        ipv4Mapped: [new v([0, 0, 0, 0, 0, 65535, 0, 0]), 96],
        // RFC6666
        discard: [new v([256, 0, 0, 0, 0, 0, 0, 0]), 64],
        // RFC6145
        rfc6145: [new v([0, 0, 0, 0, 65535, 0, 0, 0]), 96],
        // RFC6052
        rfc6052: [new v([100, 65435, 0, 0, 0, 0, 0, 0]), 96],
        // RFC3056
        "6to4": [new v([8194, 0, 0, 0, 0, 0, 0, 0]), 16],
        // RFC6052, RFC6146
        teredo: [new v([8193, 0, 0, 0, 0, 0, 0, 0]), 32],
        // RFC5180
        benchmarking: [new v([8193, 2, 0, 0, 0, 0, 0, 0]), 48],
        // RFC7450
        amt: [new v([8193, 3, 0, 0, 0, 0, 0, 0]), 32],
        as112v6: [
          [new v([8193, 4, 274, 0, 0, 0, 0, 0]), 48],
          [new v([9760, 79, 32768, 0, 0, 0, 0, 0]), 48]
        ],
        deprecated: [new v([8193, 16, 0, 0, 0, 0, 0, 0]), 28],
        orchid2: [new v([8193, 32, 0, 0, 0, 0, 0, 0]), 28],
        droneRemoteIdProtocolEntityTags: [new v([8193, 48, 0, 0, 0, 0, 0, 0]), 28],
        reserved: [
          // RFC3849
          [new v([8193, 0, 0, 0, 0, 0, 0, 0]), 23],
          // RFC2928
          [new v([8193, 3512, 0, 0, 0, 0, 0, 0]), 32]
        ]
      }, v.prototype.isIPv4MappedAddress = function() {
        return this.range() === "ipv4Mapped";
      }, v.prototype.kind = function() {
        return "ipv6";
      }, v.prototype.match = function(A, O) {
        let I;
        if (O === void 0 && (I = A, A = I[0], O = I[1]), A.kind() !== "ipv6")
          throw new Error("ipaddr: cannot match ipv6 address with non-ipv6 one");
        return m(this.parts, A.parts, 16, O);
      }, v.prototype.prefixLengthFromSubnetMask = function() {
        let A = 0, O = !1;
        const I = {
          0: 16,
          32768: 15,
          49152: 14,
          57344: 13,
          61440: 12,
          63488: 11,
          64512: 10,
          65024: 9,
          65280: 8,
          65408: 7,
          65472: 6,
          65504: 5,
          65520: 4,
          65528: 3,
          65532: 2,
          65534: 1,
          65535: 0
        };
        let P, R;
        for (let ce = 7; ce >= 0; ce -= 1)
          if (P = this.parts[ce], P in I) {
            if (R = I[P], O && R !== 0)
              return null;
            R !== 16 && (O = !0), A += R;
          } else
            return null;
        return 128 - A;
      }, v.prototype.range = function() {
        return N.subnetMatch(this, this.SpecialRanges);
      }, v.prototype.toByteArray = function() {
        let A;
        const O = [], I = this.parts;
        for (let P = 0; P < I.length; P++)
          A = I[P], O.push(A >> 8), O.push(A & 255);
        return O;
      }, v.prototype.toFixedLengthString = function() {
        const A = (function() {
          const I = [];
          for (let P = 0; P < this.parts.length; P++)
            I.push(G(this.parts[P].toString(16), 4));
          return I;
        }).call(this).join(":");
        let O = "";
        return this.zoneId && (O = `%${this.zoneId}`), A + O;
      }, v.prototype.toIPv4Address = function() {
        if (!this.isIPv4MappedAddress())
          throw new Error("ipaddr: trying to convert a generic ipv6 address to ipv4");
        const A = this.parts.slice(-2), O = A[0], I = A[1];
        return new N.IPv4([O >> 8, O & 255, I >> 8, I & 255]);
      }, v.prototype.toNormalizedString = function() {
        const A = (function() {
          const I = [];
          for (let P = 0; P < this.parts.length; P++)
            I.push(this.parts[P].toString(16));
          return I;
        }).call(this).join(":");
        let O = "";
        return this.zoneId && (O = `%${this.zoneId}`), A + O;
      }, v.prototype.toRFC5952String = function() {
        const A = /((^|:)(0(:|$)){2,})/g, O = this.toNormalizedString();
        let I = 0, P = -1, R;
        for (; R = A.exec(O); )
          R[0].length > P && (I = R.index, P = R[0].length);
        return P < 0 ? O : `${O.substring(0, I)}::${O.substring(I + P)}`;
      }, v.prototype.toString = function() {
        return this.toRFC5952String();
      }, v;
    }(), N.IPv6.broadcastAddressFromCIDR = function(v) {
      try {
        const A = this.parseCIDR(v), O = A[0].toByteArray(), I = this.subnetMaskFromPrefixLength(A[1]).toByteArray(), P = [];
        let R = 0;
        for (; R < 16; )
          P.push(parseInt(O[R], 10) | parseInt(I[R], 10) ^ 255), R++;
        return new this(P);
      } catch (A) {
        throw new Error(`ipaddr: the address does not have IPv6 CIDR format (${A})`);
      }
    }, N.IPv6.isIPv6 = function(v) {
      return this.parser(v) !== null;
    }, N.IPv6.isValid = function(v) {
      if (typeof v == "string" && v.indexOf(":") === -1)
        return !1;
      try {
        const A = this.parser(v);
        return new this(A.parts, A.zoneId), !0;
      } catch {
        return !1;
      }
    }, N.IPv6.isValidCIDR = function(v) {
      if (typeof v == "string" && v.indexOf(":") === -1)
        return !1;
      try {
        return this.parseCIDR(v), !0;
      } catch {
        return !1;
      }
    }, N.IPv6.networkAddressFromCIDR = function(v) {
      let A, O, I, P, R;
      try {
        for (A = this.parseCIDR(v), I = A[0].toByteArray(), R = this.subnetMaskFromPrefixLength(A[1]).toByteArray(), P = [], O = 0; O < 16; )
          P.push(parseInt(I[O], 10) & parseInt(R[O], 10)), O++;
        return new this(P);
      } catch (ce) {
        throw new Error(`ipaddr: the address does not have IPv6 CIDR format (${ce})`);
      }
    }, N.IPv6.parse = function(v) {
      const A = this.parser(v);
      if (A.parts === null)
        throw new Error("ipaddr: string is not formatted like an IPv6 Address");
      return new this(A.parts, A.zoneId);
    }, N.IPv6.parseCIDR = function(v) {
      let A, O, I;
      if ((O = v.match(/^(.+)\/(\d+)$/)) && (A = parseInt(O[2]), A >= 0 && A <= 128))
        return I = [this.parse(O[1]), A], Object.defineProperty(I, "toString", {
          value: function() {
            return this.join("/");
          }
        }), I;
      throw new Error("ipaddr: string is not formatted like an IPv6 CIDR range");
    }, N.IPv6.parser = function(v) {
      let A, O, I, P, R, ce;
      if (I = v.match(u.deprecatedTransitional))
        return this.parser(`::ffff:${I[1]}`);
      if (u.native.test(v))
        return h(v, 8);
      if ((I = v.match(u.transitional)) && (ce = I[6] || "", A = I[1], I[1].endsWith("::") || (A = A.slice(0, -1)), A = h(A + ce, 6), A.parts)) {
        for (R = [
          parseInt(I[2]),
          parseInt(I[3]),
          parseInt(I[4]),
          parseInt(I[5])
        ], O = 0; O < R.length; O++)
          if (P = R[O], !(0 <= P && P <= 255))
            return null;
        return A.parts.push(R[0] << 8 | R[1]), A.parts.push(R[2] << 8 | R[3]), {
          parts: A.parts,
          zoneId: A.zoneId
        };
      }
      return null;
    }, N.IPv6.subnetMaskFromPrefixLength = function(v) {
      if (v = parseInt(v), v < 0 || v > 128)
        throw new Error("ipaddr: invalid IPv6 prefix length");
      const A = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let O = 0;
      const I = Math.floor(v / 8);
      for (; O < I; )
        A[O] = 255, O++;
      return I < 16 && (A[I] = Math.pow(2, v % 8) - 1 << 8 - v % 8), new this(A);
    }, N.fromByteArray = function(v) {
      const A = v.length;
      if (A === 4)
        return new N.IPv4(v);
      if (A === 16)
        return new N.IPv6(v);
      throw new Error("ipaddr: the binary input is neither an IPv6 nor IPv4 address");
    }, N.isValid = function(v) {
      return N.IPv6.isValid(v) || N.IPv4.isValid(v);
    }, N.isValidCIDR = function(v) {
      return N.IPv6.isValidCIDR(v) || N.IPv4.isValidCIDR(v);
    }, N.parse = function(v) {
      if (N.IPv6.isValid(v))
        return N.IPv6.parse(v);
      if (N.IPv4.isValid(v))
        return N.IPv4.parse(v);
      throw new Error("ipaddr: the address has neither IPv6 nor IPv4 format");
    }, N.parseCIDR = function(v) {
      try {
        return N.IPv6.parseCIDR(v);
      } catch {
        try {
          return N.IPv4.parseCIDR(v);
        } catch {
          throw new Error("ipaddr: the address has neither IPv6 nor IPv4 CIDR format");
        }
      }
    }, N.process = function(v) {
      const A = this.parse(v);
      return A.kind() === "ipv6" && A.isIPv4MappedAddress() ? A.toIPv4Address() : A;
    }, N.subnetMatch = function(v, A, O) {
      let I, P, R, ce;
      O == null && (O = "unicast");
      for (P in A)
        if (Object.prototype.hasOwnProperty.call(A, P)) {
          for (R = A[P], R[0] && !(R[0] instanceof Array) && (R = [R]), I = 0; I < R.length; I++)
            if (ce = R[I], v.kind() === ce[0].kind() && v.match.apply(v, ce))
              return P;
        }
      return O;
    }, r.exports ? r.exports = N : e.ipaddr = N;
  })(ll);
})(Gp);
var eh = Gp.exports;
class th {
  static decodeIP(e) {
    if (e.length === 64 && parseInt(e, 16) === 0)
      return "::/0";
    if (e.length !== 16)
      return e;
    const t = parseInt(e.slice(8), 16).toString(2).split("").reduce((i, s) => i + +s, 0);
    let n = e.slice(0, 8).replace(/(.{2})/g, (i) => `${parseInt(i, 16)}.`);
    return n = n.slice(0, -1), `${n}/${t}`;
  }
  static toString(e) {
    if (e.byteLength === 4 || e.byteLength === 16) {
      const t = new Uint8Array(e);
      return eh.fromByteArray(Array.from(t)).toString();
    }
    return this.decodeIP(fe.ToHex(e));
  }
  static fromString(e) {
    const t = eh.parse(e);
    return new Uint8Array(t.toByteArray()).buffer;
  }
}
var dl, pl, yl;
let Xt = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
  toString() {
    return this.bmpString || this.printableString || this.teletexString || this.universalString || this.utf8String || "";
  }
};
f([
  y({ type: b.TeletexString })
], Xt.prototype, "teletexString", void 0);
f([
  y({ type: b.PrintableString })
], Xt.prototype, "printableString", void 0);
f([
  y({ type: b.UniversalString })
], Xt.prototype, "universalString", void 0);
f([
  y({ type: b.Utf8String })
], Xt.prototype, "utf8String", void 0);
f([
  y({ type: b.BmpString })
], Xt.prototype, "bmpString", void 0);
Xt = f([
  H({ type: M.Choice })
], Xt);
let Hi = class extends Xt {
  constructor(e = {}) {
    super(e), Object.assign(this, e);
  }
  toString() {
    return this.ia5String || (this.anyValue ? fe.ToHex(this.anyValue) : super.toString());
  }
};
f([
  y({ type: b.IA5String })
], Hi.prototype, "ia5String", void 0);
f([
  y({ type: b.Any })
], Hi.prototype, "anyValue", void 0);
Hi = f([
  H({ type: M.Choice })
], Hi);
class cc {
  constructor(e = {}) {
    this.type = "", this.value = new Hi(), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], cc.prototype, "type", void 0);
f([
  y({ type: Hi })
], cc.prototype, "value", void 0);
let Fi = dl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, dl.prototype);
  }
};
Fi = dl = f([
  H({ type: M.Set, itemType: cc })
], Fi);
let gl = pl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, pl.prototype);
  }
};
gl = pl = f([
  H({ type: M.Sequence, itemType: Fi })
], gl);
let Ht = yl = class extends gl {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, yl.prototype);
  }
};
Ht = yl = f([
  H({ type: M.Sequence })
], Ht);
const yv = {
  fromASN: (r) => th.toString(Yo.fromASN(r)),
  toASN: (r) => Yo.toASN(th.fromString(r))
};
class Ms {
  constructor(e = {}) {
    this.typeId = "", this.value = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Ms.prototype, "typeId", void 0);
f([
  y({ type: b.Any, context: 0 })
], Ms.prototype, "value", void 0);
class Wu {
  constructor(e = {}) {
    this.partyName = new Xt(), Object.assign(this, e);
  }
}
f([
  y({ type: Xt, optional: !0, context: 0, implicit: !0 })
], Wu.prototype, "nameAssigner", void 0);
f([
  y({ type: Xt, context: 1, implicit: !0 })
], Wu.prototype, "partyName", void 0);
let De = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: Ms, context: 0, implicit: !0 })
], De.prototype, "otherName", void 0);
f([
  y({ type: b.IA5String, context: 1, implicit: !0 })
], De.prototype, "rfc822Name", void 0);
f([
  y({ type: b.IA5String, context: 2, implicit: !0 })
], De.prototype, "dNSName", void 0);
f([
  y({ type: b.Any, context: 3, implicit: !0 })
], De.prototype, "x400Address", void 0);
f([
  y({ type: Ht, context: 4, implicit: !1 })
], De.prototype, "directoryName", void 0);
f([
  y({ type: Wu, context: 5 })
], De.prototype, "ediPartyName", void 0);
f([
  y({ type: b.IA5String, context: 6, implicit: !0 })
], De.prototype, "uniformResourceIdentifier", void 0);
f([
  y({ type: b.OctetString, context: 7, implicit: !0, converter: yv })
], De.prototype, "iPAddress", void 0);
f([
  y({ type: b.ObjectIdentifier, context: 8, implicit: !0 })
], De.prototype, "registeredID", void 0);
De = f([
  H({ type: M.Choice })
], De);
const Yu = "1.3.6.1.5.5.7", gv = `${Yu}.1`, os = `${Yu}.3`, lc = `${Yu}.48`, rh = `${lc}.1`, nh = `${lc}.2`, ih = `${lc}.3`, sh = `${lc}.5`, Jn = "2.5.29";
var vl;
const ml = `${gv}.1`;
class mo {
  constructor(e = {}) {
    this.accessMethod = "", this.accessLocation = new De(), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], mo.prototype, "accessMethod", void 0);
f([
  y({ type: De })
], mo.prototype, "accessLocation", void 0);
let Ui = vl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, vl.prototype);
  }
};
Ui = vl = f([
  H({ type: M.Sequence, itemType: mo })
], Ui);
const Jo = `${Jn}.35`;
class Ju extends nt {
}
class ii {
  constructor(e = {}) {
    e && Object.assign(this, e);
  }
}
f([
  y({ type: Ju, context: 0, optional: !0, implicit: !0 })
], ii.prototype, "keyIdentifier", void 0);
f([
  y({ type: De, context: 1, optional: !0, implicit: !0, repeated: "sequence" })
], ii.prototype, "authorityCertIssuer", void 0);
f([
  y({
    type: b.Integer,
    context: 2,
    optional: !0,
    implicit: !0,
    converter: xt
  })
], ii.prototype, "authorityCertSerialNumber", void 0);
const Kp = `${Jn}.19`;
class Xo {
  constructor(e = {}) {
    this.cA = !1, Object.assign(this, e);
  }
}
f([
  y({ type: b.Boolean, defaultValue: !1 })
], Xo.prototype, "cA", void 0);
f([
  y({ type: b.Integer, optional: !0 })
], Xo.prototype, "pathLenConstraint", void 0);
var wl;
let cr = wl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, wl.prototype);
  }
};
cr = wl = f([
  H({ type: M.Sequence, itemType: De })
], cr);
var bl;
let oh = bl = class extends cr {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, bl.prototype);
  }
};
oh = bl = f([
  H({ type: M.Sequence })
], oh);
var xl;
const qp = `${Jn}.32`;
let Sn = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
  toString() {
    return this.ia5String || this.visibleString || this.bmpString || this.utf8String || "";
  }
};
f([
  y({ type: b.IA5String })
], Sn.prototype, "ia5String", void 0);
f([
  y({ type: b.VisibleString })
], Sn.prototype, "visibleString", void 0);
f([
  y({ type: b.BmpString })
], Sn.prototype, "bmpString", void 0);
f([
  y({ type: b.Utf8String })
], Sn.prototype, "utf8String", void 0);
Sn = f([
  H({ type: M.Choice })
], Sn);
class Xu {
  constructor(e = {}) {
    this.organization = new Sn(), this.noticeNumbers = [], Object.assign(this, e);
  }
}
f([
  y({ type: Sn })
], Xu.prototype, "organization", void 0);
f([
  y({ type: b.Integer, repeated: "sequence" })
], Xu.prototype, "noticeNumbers", void 0);
class Qu {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: Xu, optional: !0 })
], Qu.prototype, "noticeRef", void 0);
f([
  y({ type: Sn, optional: !0 })
], Qu.prototype, "explicitText", void 0);
let Qo = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: b.IA5String })
], Qo.prototype, "cPSuri", void 0);
f([
  y({ type: Qu })
], Qo.prototype, "userNotice", void 0);
Qo = f([
  H({ type: M.Choice })
], Qo);
class ef {
  constructor(e = {}) {
    this.policyQualifierId = "", this.qualifier = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], ef.prototype, "policyQualifierId", void 0);
f([
  y({ type: b.Any })
], ef.prototype, "qualifier", void 0);
class uc {
  constructor(e = {}) {
    this.policyIdentifier = "", Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], uc.prototype, "policyIdentifier", void 0);
f([
  y({ type: ef, repeated: "sequence", optional: !0 })
], uc.prototype, "policyQualifiers", void 0);
let ea = xl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, xl.prototype);
  }
};
ea = xl = f([
  H({ type: M.Sequence, itemType: uc })
], ea);
let ta = class {
  constructor(e = 0) {
    this.value = e;
  }
};
f([
  y({ type: b.Integer })
], ta.prototype, "value", void 0);
ta = f([
  H({ type: M.Choice })
], ta);
let ah = class extends ta {
};
ah = f([
  H({ type: M.Choice })
], ah);
var Al;
const Sl = `${Jn}.31`;
var Ur;
(function(r) {
  r[r.unused = 1] = "unused", r[r.keyCompromise = 2] = "keyCompromise", r[r.cACompromise = 4] = "cACompromise", r[r.affiliationChanged = 8] = "affiliationChanged", r[r.superseded = 16] = "superseded", r[r.cessationOfOperation = 32] = "cessationOfOperation", r[r.certificateHold = 64] = "certificateHold", r[r.privilegeWithdrawn = 128] = "privilegeWithdrawn", r[r.aACompromise = 256] = "aACompromise";
})(Ur || (Ur = {}));
class Zp extends ac {
  toJSON() {
    const e = [], t = this.toNumber();
    return t & Ur.aACompromise && e.push("aACompromise"), t & Ur.affiliationChanged && e.push("affiliationChanged"), t & Ur.cACompromise && e.push("cACompromise"), t & Ur.certificateHold && e.push("certificateHold"), t & Ur.cessationOfOperation && e.push("cessationOfOperation"), t & Ur.keyCompromise && e.push("keyCompromise"), t & Ur.privilegeWithdrawn && e.push("privilegeWithdrawn"), t & Ur.superseded && e.push("superseded"), t & Ur.unused && e.push("unused"), e;
  }
  toString() {
    return `[${this.toJSON().join(", ")}]`;
  }
}
let di = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: De, context: 0, repeated: "sequence", implicit: !0 })
], di.prototype, "fullName", void 0);
f([
  y({ type: Fi, context: 1, implicit: !0 })
], di.prototype, "nameRelativeToCRLIssuer", void 0);
di = f([
  H({ type: M.Choice })
], di);
class as {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: di, context: 0, optional: !0 })
], as.prototype, "distributionPoint", void 0);
f([
  y({ type: Zp, context: 1, optional: !0, implicit: !0 })
], as.prototype, "reasons", void 0);
f([
  y({ type: De, context: 2, optional: !0, repeated: "sequence", implicit: !0 })
], as.prototype, "cRLIssuer", void 0);
let Mi = Al = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Al.prototype);
  }
};
Mi = Al = f([
  H({ type: M.Sequence, itemType: as })
], Mi);
var _l;
let ch = _l = class extends Mi {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, _l.prototype);
  }
};
ch = _l = f([
  H({ type: M.Sequence, itemType: as })
], ch);
class ir {
  constructor(e = {}) {
    this.onlyContainsUserCerts = ir.ONLY, this.onlyContainsCACerts = ir.ONLY, this.indirectCRL = ir.ONLY, this.onlyContainsAttributeCerts = ir.ONLY, Object.assign(this, e);
  }
}
ir.ONLY = !1;
f([
  y({ type: di, context: 0, optional: !0 })
], ir.prototype, "distributionPoint", void 0);
f([
  y({ type: b.Boolean, context: 1, defaultValue: ir.ONLY, implicit: !0 })
], ir.prototype, "onlyContainsUserCerts", void 0);
f([
  y({ type: b.Boolean, context: 2, defaultValue: ir.ONLY, implicit: !0 })
], ir.prototype, "onlyContainsCACerts", void 0);
f([
  y({ type: Zp, context: 3, optional: !0, implicit: !0 })
], ir.prototype, "onlySomeReasons", void 0);
f([
  y({ type: b.Boolean, context: 4, defaultValue: ir.ONLY, implicit: !0 })
], ir.prototype, "indirectCRL", void 0);
f([
  y({ type: b.Boolean, context: 5, defaultValue: ir.ONLY, implicit: !0 })
], ir.prototype, "onlyContainsAttributeCerts", void 0);
var Ps;
(function(r) {
  r[r.unspecified = 0] = "unspecified", r[r.keyCompromise = 1] = "keyCompromise", r[r.cACompromise = 2] = "cACompromise", r[r.affiliationChanged = 3] = "affiliationChanged", r[r.superseded = 4] = "superseded", r[r.cessationOfOperation = 5] = "cessationOfOperation", r[r.certificateHold = 6] = "certificateHold", r[r.removeFromCRL = 8] = "removeFromCRL", r[r.privilegeWithdrawn = 9] = "privilegeWithdrawn", r[r.aACompromise = 10] = "aACompromise";
})(Ps || (Ps = {}));
let El = class {
  constructor(e = Ps.unspecified) {
    this.reason = Ps.unspecified, this.reason = e;
  }
  toJSON() {
    return Ps[this.reason];
  }
  toString() {
    return this.toJSON();
  }
};
f([
  y({ type: b.Enumerated })
], El.prototype, "reason", void 0);
El = f([
  H({ type: M.Choice })
], El);
var Il;
const Wp = `${Jn}.37`;
let ra = Il = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Il.prototype);
  }
};
ra = Il = f([
  H({ type: M.Sequence, itemType: b.ObjectIdentifier })
], ra);
const vv = `${os}.1`, mv = `${os}.2`, wv = `${os}.3`, bv = `${os}.4`, xv = `${os}.8`, Av = `${os}.9`;
let kl = class {
  constructor(e = new ArrayBuffer(0)) {
    this.value = e;
  }
};
f([
  y({ type: b.Integer, converter: xt })
], kl.prototype, "value", void 0);
kl = f([
  H({ type: M.Choice })
], kl);
let Cl = class {
  constructor(e) {
    this.value = /* @__PURE__ */ new Date(), e && (this.value = e);
  }
};
f([
  y({ type: b.GeneralizedTime })
], Cl.prototype, "value", void 0);
Cl = f([
  H({ type: M.Choice })
], Cl);
var Bl;
let lh = Bl = class extends cr {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Bl.prototype);
  }
};
lh = Bl = f([
  H({ type: M.Sequence })
], lh);
const Yp = `${Jn}.15`;
var Dr;
(function(r) {
  r[r.digitalSignature = 1] = "digitalSignature", r[r.nonRepudiation = 2] = "nonRepudiation", r[r.keyEncipherment = 4] = "keyEncipherment", r[r.dataEncipherment = 8] = "dataEncipherment", r[r.keyAgreement = 16] = "keyAgreement", r[r.keyCertSign = 32] = "keyCertSign", r[r.cRLSign = 64] = "cRLSign", r[r.encipherOnly = 128] = "encipherOnly", r[r.decipherOnly = 256] = "decipherOnly";
})(Dr || (Dr = {}));
class Kc extends ac {
  toJSON() {
    const e = this.toNumber(), t = [];
    return e & Dr.cRLSign && t.push("crlSign"), e & Dr.dataEncipherment && t.push("dataEncipherment"), e & Dr.decipherOnly && t.push("decipherOnly"), e & Dr.digitalSignature && t.push("digitalSignature"), e & Dr.encipherOnly && t.push("encipherOnly"), e & Dr.keyAgreement && t.push("keyAgreement"), e & Dr.keyCertSign && t.push("keyCertSign"), e & Dr.keyEncipherment && t.push("keyEncipherment"), e & Dr.nonRepudiation && t.push("nonRepudiation"), t;
  }
  toString() {
    return `[${this.toJSON().join(", ")}]`;
  }
}
var Ol;
class fc {
  constructor(e = {}) {
    this.base = new De(), this.minimum = 0, Object.assign(this, e);
  }
}
f([
  y({ type: De })
], fc.prototype, "base", void 0);
f([
  y({ type: b.Integer, context: 0, defaultValue: 0, implicit: !0 })
], fc.prototype, "minimum", void 0);
f([
  y({ type: b.Integer, context: 1, optional: !0, implicit: !0 })
], fc.prototype, "maximum", void 0);
let na = Ol = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Ol.prototype);
  }
};
na = Ol = f([
  H({ type: M.Sequence, itemType: fc })
], na);
class Jp {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: na, context: 0, optional: !0, implicit: !0 })
], Jp.prototype, "permittedSubtrees", void 0);
f([
  y({ type: na, context: 1, optional: !0, implicit: !0 })
], Jp.prototype, "excludedSubtrees", void 0);
class Xp {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({
    type: b.Integer,
    context: 0,
    implicit: !0,
    optional: !0,
    converter: xt
  })
], Xp.prototype, "requireExplicitPolicy", void 0);
f([
  y({
    type: b.Integer,
    context: 1,
    implicit: !0,
    optional: !0,
    converter: xt
  })
], Xp.prototype, "inhibitPolicyMapping", void 0);
var Tl;
class tf {
  constructor(e = {}) {
    this.issuerDomainPolicy = "", this.subjectDomainPolicy = "", Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], tf.prototype, "issuerDomainPolicy", void 0);
f([
  y({ type: b.ObjectIdentifier })
], tf.prototype, "subjectDomainPolicy", void 0);
let uh = Tl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Tl.prototype);
  }
};
uh = Tl = f([
  H({ type: M.Sequence, itemType: tf })
], uh);
var Nl;
const rf = `${Jn}.17`;
let Pl = Nl = class extends cr {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Nl.prototype);
  }
};
Pl = Nl = f([
  H({ type: M.Sequence })
], Pl);
let _n = class {
  constructor(e = {}) {
    this.type = "", this.values = [], Object.assign(this, e);
  }
};
f([
  y({ type: b.ObjectIdentifier })
], _n.prototype, "type", void 0);
f([
  y({ type: b.Any, repeated: "set" })
], _n.prototype, "values", void 0);
var jl;
let fh = jl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, jl.prototype);
  }
};
fh = jl = f([
  H({ type: M.Sequence, itemType: _n })
], fh);
const nf = `${Jn}.14`;
class Hn extends Ju {
}
class Qp {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: b.GeneralizedTime, context: 0, implicit: !0, optional: !0 })
], Qp.prototype, "notBefore", void 0);
f([
  y({ type: b.GeneralizedTime, context: 1, implicit: !0, optional: !0 })
], Qp.prototype, "notAfter", void 0);
var js;
(function(r) {
  r[r.keyUpdateAllowed = 1] = "keyUpdateAllowed", r[r.newExtensions = 2] = "newExtensions", r[r.pKIXCertificate = 4] = "pKIXCertificate";
})(js || (js = {}));
class e0 extends ac {
  toJSON() {
    const e = [], t = this.toNumber();
    return t & js.pKIXCertificate && e.push("pKIXCertificate"), t & js.newExtensions && e.push("newExtensions"), t & js.keyUpdateAllowed && e.push("keyUpdateAllowed"), e;
  }
  toString() {
    return `[${this.toJSON().join(", ")}]`;
  }
}
class t0 {
  constructor(e = {}) {
    this.entrustVers = "", this.entrustInfoFlags = new e0(), Object.assign(this, e);
  }
}
f([
  y({ type: b.GeneralString })
], t0.prototype, "entrustVers", void 0);
f([
  y({ type: e0 })
], t0.prototype, "entrustInfoFlags", void 0);
var Rl;
let hh = Rl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Rl.prototype);
  }
};
hh = Rl = f([
  H({ type: M.Sequence, itemType: mo })
], hh);
class ie {
  constructor(e = {}) {
    this.algorithm = "", Object.assign(this, e);
  }
  isEqual(e) {
    return e instanceof ie && e.algorithm == this.algorithm && (e.parameters && this.parameters && qo(e.parameters, this.parameters) || e.parameters === this.parameters);
  }
}
f([
  y({
    type: b.ObjectIdentifier
  })
], ie.prototype, "algorithm", void 0);
f([
  y({
    type: b.Any,
    optional: !0
  })
], ie.prototype, "parameters", void 0);
class rn {
  constructor(e = {}) {
    this.algorithm = new ie(), this.subjectPublicKey = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: ie })
], rn.prototype, "algorithm", void 0);
f([
  y({ type: b.BitString })
], rn.prototype, "subjectPublicKey", void 0);
let Yt = class {
  constructor(e) {
    if (e)
      if (typeof e == "string" || typeof e == "number" || e instanceof Date) {
        const t = new Date(e);
        t.getUTCFullYear() > 2049 ? this.generalTime = t : this.utcTime = t;
      } else
        Object.assign(this, e);
  }
  getTime() {
    const e = this.utcTime || this.generalTime;
    if (!e)
      throw new Error("Cannot get time from CHOICE object");
    return e;
  }
};
f([
  y({
    type: b.UTCTime
  })
], Yt.prototype, "utcTime", void 0);
f([
  y({
    type: b.GeneralizedTime
  })
], Yt.prototype, "generalTime", void 0);
Yt = f([
  H({ type: M.Choice })
], Yt);
class hc {
  constructor(e) {
    this.notBefore = new Yt(/* @__PURE__ */ new Date()), this.notAfter = new Yt(/* @__PURE__ */ new Date()), e && (this.notBefore = new Yt(e.notBefore), this.notAfter = new Yt(e.notAfter));
  }
}
f([
  y({ type: Yt })
], hc.prototype, "notBefore", void 0);
f([
  y({ type: Yt })
], hc.prototype, "notAfter", void 0);
var Ul;
let Hr = class r0 {
  constructor(e = {}) {
    this.extnID = "", this.critical = r0.CRITICAL, this.extnValue = new nt(), Object.assign(this, e);
  }
};
Hr.CRITICAL = !1;
f([
  y({ type: b.ObjectIdentifier })
], Hr.prototype, "extnID", void 0);
f([
  y({
    type: b.Boolean,
    defaultValue: Hr.CRITICAL
  })
], Hr.prototype, "critical", void 0);
f([
  y({ type: nt })
], Hr.prototype, "extnValue", void 0);
let pi = Ul = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Ul.prototype);
  }
};
pi = Ul = f([
  H({ type: M.Sequence, itemType: Hr })
], pi);
var zi;
(function(r) {
  r[r.v1 = 0] = "v1", r[r.v2 = 1] = "v2", r[r.v3 = 2] = "v3";
})(zi || (zi = {}));
class Pr {
  constructor(e = {}) {
    this.version = zi.v1, this.serialNumber = new ArrayBuffer(0), this.signature = new ie(), this.issuer = new Ht(), this.validity = new hc(), this.subject = new Ht(), this.subjectPublicKeyInfo = new rn(), Object.assign(this, e);
  }
}
f([
  y({
    type: b.Integer,
    context: 0,
    defaultValue: zi.v1
  })
], Pr.prototype, "version", void 0);
f([
  y({
    type: b.Integer,
    converter: xt
  })
], Pr.prototype, "serialNumber", void 0);
f([
  y({ type: ie })
], Pr.prototype, "signature", void 0);
f([
  y({ type: Ht })
], Pr.prototype, "issuer", void 0);
f([
  y({ type: hc })
], Pr.prototype, "validity", void 0);
f([
  y({ type: Ht })
], Pr.prototype, "subject", void 0);
f([
  y({ type: rn })
], Pr.prototype, "subjectPublicKeyInfo", void 0);
f([
  y({
    type: b.BitString,
    context: 1,
    implicit: !0,
    optional: !0
  })
], Pr.prototype, "issuerUniqueID", void 0);
f([
  y({ type: b.BitString, context: 2, implicit: !0, optional: !0 })
], Pr.prototype, "subjectUniqueID", void 0);
f([
  y({ type: pi, context: 3, optional: !0 })
], Pr.prototype, "extensions", void 0);
class yi {
  constructor(e = {}) {
    this.tbsCertificate = new Pr(), this.signatureAlgorithm = new ie(), this.signatureValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: Pr })
], yi.prototype, "tbsCertificate", void 0);
f([
  y({ type: ie })
], yi.prototype, "signatureAlgorithm", void 0);
f([
  y({ type: b.BitString })
], yi.prototype, "signatureValue", void 0);
class dc {
  constructor(e = {}) {
    this.userCertificate = new ArrayBuffer(0), this.revocationDate = new Yt(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, converter: xt })
], dc.prototype, "userCertificate", void 0);
f([
  y({ type: Yt })
], dc.prototype, "revocationDate", void 0);
f([
  y({ type: Hr, optional: !0, repeated: "sequence" })
], dc.prototype, "crlEntryExtensions", void 0);
class Bn {
  constructor(e = {}) {
    this.signature = new ie(), this.issuer = new Ht(), this.thisUpdate = new Yt(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, optional: !0 })
], Bn.prototype, "version", void 0);
f([
  y({ type: ie })
], Bn.prototype, "signature", void 0);
f([
  y({ type: Ht })
], Bn.prototype, "issuer", void 0);
f([
  y({ type: Yt })
], Bn.prototype, "thisUpdate", void 0);
f([
  y({ type: Yt, optional: !0 })
], Bn.prototype, "nextUpdate", void 0);
f([
  y({ type: dc, repeated: "sequence", optional: !0 })
], Bn.prototype, "revokedCertificates", void 0);
f([
  y({ type: Hr, optional: !0, context: 0, repeated: "sequence" })
], Bn.prototype, "crlExtensions", void 0);
class sf {
  constructor(e = {}) {
    this.tbsCertList = new Bn(), this.signatureAlgorithm = new ie(), this.signature = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: Bn })
], sf.prototype, "tbsCertList", void 0);
f([
  y({ type: ie })
], sf.prototype, "signatureAlgorithm", void 0);
f([
  y({ type: b.BitString })
], sf.prototype, "signature", void 0);
class cs {
  constructor(e = {}) {
    this.issuer = new Ht(), this.serialNumber = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: Ht })
], cs.prototype, "issuer", void 0);
f([
  y({ type: b.Integer, converter: xt })
], cs.prototype, "serialNumber", void 0);
let Gi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: Hn, context: 0, implicit: !0 })
], Gi.prototype, "subjectKeyIdentifier", void 0);
f([
  y({ type: cs })
], Gi.prototype, "issuerAndSerialNumber", void 0);
Gi = f([
  H({ type: M.Choice })
], Gi);
var an;
(function(r) {
  r[r.v0 = 0] = "v0", r[r.v1 = 1] = "v1", r[r.v2 = 2] = "v2", r[r.v3 = 3] = "v3", r[r.v4 = 4] = "v4", r[r.v5 = 5] = "v5";
})(an || (an = {}));
let Vs = class extends ie {
};
Vs = f([
  H({ type: M.Sequence })
], Vs);
let ia = class extends ie {
};
ia = f([
  H({ type: M.Sequence })
], ia);
let cn = class extends ie {
};
cn = f([
  H({ type: M.Sequence })
], cn);
let sa = class extends ie {
};
sa = f([
  H({ type: M.Sequence })
], sa);
let dh = class extends ie {
};
dh = f([
  H({ type: M.Sequence })
], dh);
let Dl = class extends ie {
};
Dl = f([
  H({ type: M.Sequence })
], Dl);
let ls = class {
  constructor(e = {}) {
    this.attrType = "", this.attrValues = [], Object.assign(this, e);
  }
};
f([
  y({ type: b.ObjectIdentifier })
], ls.prototype, "attrType", void 0);
f([
  y({ type: b.Any, repeated: "set" })
], ls.prototype, "attrValues", void 0);
var $l;
class dn {
  constructor(e = {}) {
    this.version = an.v0, this.sid = new Gi(), this.digestAlgorithm = new Vs(), this.signatureAlgorithm = new ia(), this.signature = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], dn.prototype, "version", void 0);
f([
  y({ type: Gi })
], dn.prototype, "sid", void 0);
f([
  y({ type: Vs })
], dn.prototype, "digestAlgorithm", void 0);
f([
  y({ type: ls, repeated: "set", context: 0, implicit: !0, optional: !0 })
], dn.prototype, "signedAttrs", void 0);
f([
  y({ type: ia })
], dn.prototype, "signatureAlgorithm", void 0);
f([
  y({ type: nt })
], dn.prototype, "signature", void 0);
f([
  y({ type: ls, repeated: "set", context: 1, implicit: !0, optional: !0 })
], dn.prototype, "unsignedAttrs", void 0);
let oa = $l = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, $l.prototype);
  }
};
oa = $l = f([
  H({ type: M.Set, itemType: dn })
], oa);
let ph = class extends Yt {
};
ph = f([
  H({ type: M.Choice })
], ph);
let yh = class extends dn {
};
yh = f([
  H({ type: M.Sequence })
], yh);
class of {
  constructor(e = {}) {
    this.acIssuer = new De(), this.acSerial = 0, this.attrs = [], Object.assign(this, e);
  }
}
f([
  y({ type: De })
], of.prototype, "acIssuer", void 0);
f([
  y({ type: b.Integer })
], of.prototype, "acSerial", void 0);
f([
  y({ type: _n, repeated: "sequence" })
], of.prototype, "attrs", void 0);
var Ml;
let aa = Ml = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Ml.prototype);
  }
};
aa = Ml = f([
  H({ type: M.Sequence, itemType: b.ObjectIdentifier })
], aa);
class pc {
  constructor(e = {}) {
    this.permitUnSpecified = !0, Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, optional: !0 })
], pc.prototype, "pathLenConstraint", void 0);
f([
  y({ type: aa, implicit: !0, context: 0, optional: !0 })
], pc.prototype, "permittedAttrs", void 0);
f([
  y({ type: aa, implicit: !0, context: 1, optional: !0 })
], pc.prototype, "excludedAttrs", void 0);
f([
  y({ type: b.Boolean, defaultValue: !0 })
], pc.prototype, "permitUnSpecified", void 0);
class Ci {
  constructor(e = {}) {
    this.issuer = new cr(), this.serial = new ArrayBuffer(0), this.issuerUID = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: cr })
], Ci.prototype, "issuer", void 0);
f([
  y({ type: b.Integer, converter: xt })
], Ci.prototype, "serial", void 0);
f([
  y({ type: b.BitString, optional: !0 })
], Ci.prototype, "issuerUID", void 0);
var Vl;
(function(r) {
  r[r.publicKey = 0] = "publicKey", r[r.publicKeyCert = 1] = "publicKeyCert", r[r.otherObjectTypes = 2] = "otherObjectTypes";
})(Vl || (Vl = {}));
class Bi {
  constructor(e = {}) {
    this.digestedObjectType = Vl.publicKey, this.digestAlgorithm = new ie(), this.objectDigest = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.Enumerated })
], Bi.prototype, "digestedObjectType", void 0);
f([
  y({ type: b.ObjectIdentifier, optional: !0 })
], Bi.prototype, "otherObjectTypeID", void 0);
f([
  y({ type: ie })
], Bi.prototype, "digestAlgorithm", void 0);
f([
  y({ type: b.BitString })
], Bi.prototype, "objectDigest", void 0);
class yc {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: cr, optional: !0 })
], yc.prototype, "issuerName", void 0);
f([
  y({ type: Ci, context: 0, implicit: !0, optional: !0 })
], yc.prototype, "baseCertificateID", void 0);
f([
  y({ type: Bi, context: 1, implicit: !0, optional: !0 })
], yc.prototype, "objectDigestInfo", void 0);
let Ki = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: De, repeated: "sequence" })
], Ki.prototype, "v1Form", void 0);
f([
  y({ type: yc, context: 0, implicit: !0 })
], Ki.prototype, "v2Form", void 0);
Ki = f([
  H({ type: M.Choice })
], Ki);
class gc {
  constructor(e = {}) {
    this.notBeforeTime = /* @__PURE__ */ new Date(), this.notAfterTime = /* @__PURE__ */ new Date(), Object.assign(this, e);
  }
}
f([
  y({ type: b.GeneralizedTime })
], gc.prototype, "notBeforeTime", void 0);
f([
  y({ type: b.GeneralizedTime })
], gc.prototype, "notAfterTime", void 0);
class wo {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: Ci, implicit: !0, context: 0, optional: !0 })
], wo.prototype, "baseCertificateID", void 0);
f([
  y({ type: cr, implicit: !0, context: 1, optional: !0 })
], wo.prototype, "entityName", void 0);
f([
  y({ type: Bi, implicit: !0, context: 2, optional: !0 })
], wo.prototype, "objectDigestInfo", void 0);
var Ll;
(function(r) {
  r[r.v2 = 1] = "v2";
})(Ll || (Ll = {}));
class qr {
  constructor(e = {}) {
    this.version = Ll.v2, this.holder = new wo(), this.issuer = new Ki(), this.signature = new ie(), this.serialNumber = new ArrayBuffer(0), this.attrCertValidityPeriod = new gc(), this.attributes = [], Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], qr.prototype, "version", void 0);
f([
  y({ type: wo })
], qr.prototype, "holder", void 0);
f([
  y({ type: Ki })
], qr.prototype, "issuer", void 0);
f([
  y({ type: ie })
], qr.prototype, "signature", void 0);
f([
  y({ type: b.Integer, converter: xt })
], qr.prototype, "serialNumber", void 0);
f([
  y({ type: gc })
], qr.prototype, "attrCertValidityPeriod", void 0);
f([
  y({ type: _n, repeated: "sequence" })
], qr.prototype, "attributes", void 0);
f([
  y({ type: b.BitString, optional: !0 })
], qr.prototype, "issuerUniqueID", void 0);
f([
  y({ type: pi, optional: !0 })
], qr.prototype, "extensions", void 0);
class vc {
  constructor(e = {}) {
    this.acinfo = new qr(), this.signatureAlgorithm = new ie(), this.signatureValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: qr })
], vc.prototype, "acinfo", void 0);
f([
  y({ type: ie })
], vc.prototype, "signatureAlgorithm", void 0);
f([
  y({ type: b.BitString })
], vc.prototype, "signatureValue", void 0);
var ca;
(function(r) {
  r[r.unmarked = 1] = "unmarked", r[r.unclassified = 2] = "unclassified", r[r.restricted = 4] = "restricted", r[r.confidential = 8] = "confidential", r[r.secret = 16] = "secret", r[r.topSecret = 32] = "topSecret";
})(ca || (ca = {}));
class Hl extends ac {
}
class af {
  constructor(e = {}) {
    this.type = "", this.value = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier, implicit: !0, context: 0 })
], af.prototype, "type", void 0);
f([
  y({ type: b.Any, implicit: !0, context: 1 })
], af.prototype, "value", void 0);
class cf {
  constructor(e = {}) {
    this.policyId = "", this.classList = new Hl(ca.unclassified), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], cf.prototype, "policyId", void 0);
f([
  y({ type: Hl, defaultValue: new Hl(ca.unclassified) })
], cf.prototype, "classList", void 0);
f([
  y({ type: af, repeated: "set" })
], cf.prototype, "securityCategories", void 0);
class mc {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: nt })
], mc.prototype, "cotets", void 0);
f([
  y({ type: b.ObjectIdentifier })
], mc.prototype, "oid", void 0);
f([
  y({ type: b.Utf8String })
], mc.prototype, "string", void 0);
class n0 {
  constructor(e = {}) {
    this.values = [], Object.assign(this, e);
  }
}
f([
  y({ type: cr, implicit: !0, context: 0, optional: !0 })
], n0.prototype, "policyAuthority", void 0);
f([
  y({ type: mc, repeated: "sequence" })
], n0.prototype, "values", void 0);
var Fl;
class wc {
  constructor(e = {}) {
    this.targetCertificate = new Ci(), Object.assign(this, e);
  }
}
f([
  y({ type: Ci })
], wc.prototype, "targetCertificate", void 0);
f([
  y({ type: De, optional: !0 })
], wc.prototype, "targetName", void 0);
f([
  y({ type: Bi, optional: !0 })
], wc.prototype, "certDigestInfo", void 0);
let qi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: De, context: 0, implicit: !0 })
], qi.prototype, "targetName", void 0);
f([
  y({ type: De, context: 1, implicit: !0 })
], qi.prototype, "targetGroup", void 0);
f([
  y({ type: wc, context: 2, implicit: !0 })
], qi.prototype, "targetCert", void 0);
qi = f([
  H({ type: M.Choice })
], qi);
let zl = Fl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Fl.prototype);
  }
};
zl = Fl = f([
  H({ type: M.Sequence, itemType: qi })
], zl);
var Gl;
let gh = Gl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Gl.prototype);
  }
};
gh = Gl = f([
  H({ type: M.Sequence, itemType: zl })
], gh);
class i0 {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: cr, implicit: !0, context: 0, optional: !0 })
], i0.prototype, "roleAuthority", void 0);
f([
  y({ type: De, implicit: !0, context: 1 })
], i0.prototype, "roleName", void 0);
class lf {
  constructor(e = {}) {
    this.service = new De(), this.ident = new De(), Object.assign(this, e);
  }
}
f([
  y({ type: De })
], lf.prototype, "service", void 0);
f([
  y({ type: De })
], lf.prototype, "ident", void 0);
f([
  y({ type: nt, optional: !0 })
], lf.prototype, "authInfo", void 0);
var Kl;
class uf {
  constructor(e = {}) {
    this.otherCertFormat = "", this.otherCert = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], uf.prototype, "otherCertFormat", void 0);
f([
  y({ type: b.Any })
], uf.prototype, "otherCert", void 0);
let gi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: yi })
], gi.prototype, "certificate", void 0);
f([
  y({ type: vc, context: 2, implicit: !0 })
], gi.prototype, "v2AttrCert", void 0);
f([
  y({ type: uf, context: 3, implicit: !0 })
], gi.prototype, "other", void 0);
gi = f([
  H({ type: M.Choice })
], gi);
let Ls = Kl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Kl.prototype);
  }
};
Ls = Kl = f([
  H({ type: M.Set, itemType: gi })
], Ls);
class xn {
  constructor(e = {}) {
    this.contentType = "", this.content = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], xn.prototype, "contentType", void 0);
f([
  y({ type: b.Any, context: 0 })
], xn.prototype, "content", void 0);
let Zi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: nt })
], Zi.prototype, "single", void 0);
f([
  y({ type: b.Any })
], Zi.prototype, "any", void 0);
Zi = f([
  H({ type: M.Choice })
], Zi);
class bc {
  constructor(e = {}) {
    this.eContentType = "", Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], bc.prototype, "eContentType", void 0);
f([
  y({ type: Zi, context: 0, optional: !0 })
], bc.prototype, "eContent", void 0);
let Hs = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: nt, context: 0, implicit: !0, optional: !0 })
], Hs.prototype, "value", void 0);
f([
  y({ type: nt, converter: Jg, context: 0, implicit: !0, optional: !0, repeated: "sequence" })
], Hs.prototype, "constructedValue", void 0);
Hs = f([
  H({ type: M.Choice })
], Hs);
class bo {
  constructor(e = {}) {
    this.contentType = "", this.contentEncryptionAlgorithm = new sa(), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], bo.prototype, "contentType", void 0);
f([
  y({ type: sa })
], bo.prototype, "contentEncryptionAlgorithm", void 0);
f([
  y({ type: Hs, optional: !0 })
], bo.prototype, "encryptedContent", void 0);
class xc {
  constructor(e = {}) {
    this.keyAttrId = "", Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], xc.prototype, "keyAttrId", void 0);
f([
  y({ type: b.Any, optional: !0 })
], xc.prototype, "keyAttr", void 0);
var ql;
class Ac {
  constructor(e = {}) {
    this.subjectKeyIdentifier = new Hn(), Object.assign(this, e);
  }
}
f([
  y({ type: Hn })
], Ac.prototype, "subjectKeyIdentifier", void 0);
f([
  y({ type: b.GeneralizedTime, optional: !0 })
], Ac.prototype, "date", void 0);
f([
  y({ type: xc, optional: !0 })
], Ac.prototype, "other", void 0);
let Wi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: Ac, context: 0, implicit: !0, optional: !0 })
], Wi.prototype, "rKeyId", void 0);
f([
  y({ type: cs, optional: !0 })
], Wi.prototype, "issuerAndSerialNumber", void 0);
Wi = f([
  H({ type: M.Choice })
], Wi);
class ff {
  constructor(e = {}) {
    this.rid = new Wi(), this.encryptedKey = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: Wi })
], ff.prototype, "rid", void 0);
f([
  y({ type: nt })
], ff.prototype, "encryptedKey", void 0);
let la = ql = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, ql.prototype);
  }
};
la = ql = f([
  H({ type: M.Sequence, itemType: ff })
], la);
class hf {
  constructor(e = {}) {
    this.algorithm = new ie(), this.publicKey = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: ie })
], hf.prototype, "algorithm", void 0);
f([
  y({ type: b.BitString })
], hf.prototype, "publicKey", void 0);
let vi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: Hn, context: 0, implicit: !0, optional: !0 })
], vi.prototype, "subjectKeyIdentifier", void 0);
f([
  y({ type: hf, context: 1, implicit: !0, optional: !0 })
], vi.prototype, "originatorKey", void 0);
f([
  y({ type: cs, optional: !0 })
], vi.prototype, "issuerAndSerialNumber", void 0);
vi = f([
  H({ type: M.Choice })
], vi);
class us {
  constructor(e = {}) {
    this.version = an.v3, this.originator = new vi(), this.keyEncryptionAlgorithm = new cn(), this.recipientEncryptedKeys = new la(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], us.prototype, "version", void 0);
f([
  y({ type: vi, context: 0 })
], us.prototype, "originator", void 0);
f([
  y({ type: nt, context: 1, optional: !0 })
], us.prototype, "ukm", void 0);
f([
  y({ type: cn })
], us.prototype, "keyEncryptionAlgorithm", void 0);
f([
  y({ type: la })
], us.prototype, "recipientEncryptedKeys", void 0);
let Yi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: Hn, context: 0, implicit: !0 })
], Yi.prototype, "subjectKeyIdentifier", void 0);
f([
  y({ type: cs })
], Yi.prototype, "issuerAndSerialNumber", void 0);
Yi = f([
  H({ type: M.Choice })
], Yi);
class xo {
  constructor(e = {}) {
    this.version = an.v0, this.rid = new Yi(), this.keyEncryptionAlgorithm = new cn(), this.encryptedKey = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], xo.prototype, "version", void 0);
f([
  y({ type: Yi })
], xo.prototype, "rid", void 0);
f([
  y({ type: cn })
], xo.prototype, "keyEncryptionAlgorithm", void 0);
f([
  y({ type: nt })
], xo.prototype, "encryptedKey", void 0);
class Ao {
  constructor(e = {}) {
    this.keyIdentifier = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: nt })
], Ao.prototype, "keyIdentifier", void 0);
f([
  y({ type: b.GeneralizedTime, optional: !0 })
], Ao.prototype, "date", void 0);
f([
  y({ type: xc, optional: !0 })
], Ao.prototype, "other", void 0);
class So {
  constructor(e = {}) {
    this.version = an.v4, this.kekid = new Ao(), this.keyEncryptionAlgorithm = new cn(), this.encryptedKey = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], So.prototype, "version", void 0);
f([
  y({ type: Ao })
], So.prototype, "kekid", void 0);
f([
  y({ type: cn })
], So.prototype, "keyEncryptionAlgorithm", void 0);
f([
  y({ type: nt })
], So.prototype, "encryptedKey", void 0);
class _o {
  constructor(e = {}) {
    this.version = an.v0, this.keyEncryptionAlgorithm = new cn(), this.encryptedKey = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], _o.prototype, "version", void 0);
f([
  y({ type: Dl, context: 0, optional: !0 })
], _o.prototype, "keyDerivationAlgorithm", void 0);
f([
  y({ type: cn })
], _o.prototype, "keyEncryptionAlgorithm", void 0);
f([
  y({ type: nt })
], _o.prototype, "encryptedKey", void 0);
class df {
  constructor(e = {}) {
    this.oriType = "", this.oriValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], df.prototype, "oriType", void 0);
f([
  y({ type: b.Any })
], df.prototype, "oriValue", void 0);
let zn = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: xo, optional: !0 })
], zn.prototype, "ktri", void 0);
f([
  y({ type: us, context: 1, implicit: !0, optional: !0 })
], zn.prototype, "kari", void 0);
f([
  y({ type: So, context: 2, implicit: !0, optional: !0 })
], zn.prototype, "kekri", void 0);
f([
  y({ type: _o, context: 3, implicit: !0, optional: !0 })
], zn.prototype, "pwri", void 0);
f([
  y({ type: df, context: 4, implicit: !0, optional: !0 })
], zn.prototype, "ori", void 0);
zn = f([
  H({ type: M.Choice })
], zn);
var Zl;
let ua = Zl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Zl.prototype);
  }
};
ua = Zl = f([
  H({ type: M.Set, itemType: zn })
], ua);
var Wl;
class Sc {
  constructor(e = {}) {
    this.otherRevInfoFormat = "", this.otherRevInfo = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Sc.prototype, "otherRevInfoFormat", void 0);
f([
  y({ type: b.Any })
], Sc.prototype, "otherRevInfo", void 0);
let fa = class {
  constructor(e = {}) {
    this.other = new Sc(), Object.assign(this, e);
  }
};
f([
  y({ type: Sc, context: 1, implicit: !0 })
], fa.prototype, "other", void 0);
fa = f([
  H({ type: M.Choice })
], fa);
let ha = Wl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Wl.prototype);
  }
};
ha = Wl = f([
  H({ type: M.Set, itemType: fa })
], ha);
class pf {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: Ls, context: 0, implicit: !0, optional: !0 })
], pf.prototype, "certs", void 0);
f([
  y({ type: ha, context: 1, implicit: !0, optional: !0 })
], pf.prototype, "crls", void 0);
var Yl;
let Jl = Yl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Yl.prototype);
  }
};
Jl = Yl = f([
  H({ type: M.Set, itemType: ls })
], Jl);
class Eo {
  constructor(e = {}) {
    this.version = an.v0, this.recipientInfos = new ua(), this.encryptedContentInfo = new bo(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], Eo.prototype, "version", void 0);
f([
  y({ type: pf, context: 0, implicit: !0, optional: !0 })
], Eo.prototype, "originatorInfo", void 0);
f([
  y({ type: ua })
], Eo.prototype, "recipientInfos", void 0);
f([
  y({ type: bo })
], Eo.prototype, "encryptedContentInfo", void 0);
f([
  y({ type: Jl, context: 1, implicit: !0, optional: !0 })
], Eo.prototype, "unprotectedAttrs", void 0);
const Sv = "1.2.840.113549.1.7.1", Xl = "1.2.840.113549.1.7.2";
var Ql;
let da = Ql = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Ql.prototype);
  }
};
da = Ql = f([
  H({ type: M.Set, itemType: Vs })
], da);
class An {
  constructor(e = {}) {
    this.version = an.v0, this.digestAlgorithms = new da(), this.encapContentInfo = new bc(), this.signerInfos = new oa(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], An.prototype, "version", void 0);
f([
  y({ type: da })
], An.prototype, "digestAlgorithms", void 0);
f([
  y({ type: bc })
], An.prototype, "encapContentInfo", void 0);
f([
  y({ type: Ls, context: 0, implicit: !0, optional: !0 })
], An.prototype, "certificates", void 0);
f([
  y({ type: ha, context: 1, implicit: !0, optional: !0 })
], An.prototype, "crls", void 0);
f([
  y({ type: oa })
], An.prototype, "signerInfos", void 0);
const Fs = "1.2.840.10045.2.1", yf = "1.2.840.10045.4.1", s0 = "1.2.840.10045.4.3.1", gf = "1.2.840.10045.4.3.2", vf = "1.2.840.10045.4.3.3", mf = "1.2.840.10045.4.3.4", vh = "1.2.840.10045.3.1.7", mh = "1.3.132.0.34", wh = "1.3.132.0.35";
function Io(r) {
  return new ie({ algorithm: r });
}
const _v = Io(yf);
Io(s0);
const Ev = Io(gf), Iv = Io(vf), kv = Io(mf);
let zs = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: b.ObjectIdentifier })
], zs.prototype, "fieldType", void 0);
f([
  y({ type: b.Any })
], zs.prototype, "parameters", void 0);
zs = f([
  H({ type: M.Sequence })
], zs);
class Cv extends nt {
}
let Ji = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: b.OctetString })
], Ji.prototype, "a", void 0);
f([
  y({ type: b.OctetString })
], Ji.prototype, "b", void 0);
f([
  y({ type: b.BitString, optional: !0 })
], Ji.prototype, "seed", void 0);
Ji = f([
  H({ type: M.Sequence })
], Ji);
var eu;
(function(r) {
  r[r.ecpVer1 = 1] = "ecpVer1";
})(eu || (eu = {}));
let En = class {
  constructor(e = {}) {
    this.version = eu.ecpVer1, Object.assign(this, e);
  }
};
f([
  y({ type: b.Integer })
], En.prototype, "version", void 0);
f([
  y({ type: zs })
], En.prototype, "fieldID", void 0);
f([
  y({ type: Ji })
], En.prototype, "curve", void 0);
f([
  y({ type: Cv })
], En.prototype, "base", void 0);
f([
  y({ type: b.Integer, converter: xt })
], En.prototype, "order", void 0);
f([
  y({ type: b.Integer, optional: !0 })
], En.prototype, "cofactor", void 0);
En = f([
  H({ type: M.Sequence })
], En);
let Gn = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: b.ObjectIdentifier })
], Gn.prototype, "namedCurve", void 0);
f([
  y({ type: b.Null })
], Gn.prototype, "implicitCurve", void 0);
f([
  y({ type: En })
], Gn.prototype, "specifiedCurve", void 0);
Gn = f([
  H({ type: M.Choice })
], Gn);
class _c {
  constructor(e = {}) {
    this.version = 1, this.privateKey = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], _c.prototype, "version", void 0);
f([
  y({ type: nt })
], _c.prototype, "privateKey", void 0);
f([
  y({ type: Gn, context: 0, optional: !0 })
], _c.prototype, "parameters", void 0);
f([
  y({ type: b.BitString, context: 1, optional: !0 })
], _c.prototype, "publicKey", void 0);
class pa {
  constructor(e = {}) {
    this.r = new ArrayBuffer(0), this.s = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, converter: xt })
], pa.prototype, "r", void 0);
f([
  y({ type: b.Integer, converter: xt })
], pa.prototype, "s", void 0);
const wr = "1.2.840.113549.1.1", mi = `${wr}.1`, Bv = `${wr}.7`, Ov = `${wr}.9`, Rs = `${wr}.10`, Tv = `${wr}.2`, Nv = `${wr}.4`, ya = `${wr}.5`, Pv = `${wr}.14`, tu = `${wr}.11`, ga = `${wr}.12`, va = `${wr}.13`, o0 = `${wr}.15`, a0 = `${wr}.16`, ma = "1.3.14.3.2.26", c0 = "2.16.840.1.101.3.4.2.4", wa = "2.16.840.1.101.3.4.2.1", ba = "2.16.840.1.101.3.4.2.2", xa = "2.16.840.1.101.3.4.2.3", jv = "2.16.840.1.101.3.4.2.5", Rv = "2.16.840.1.101.3.4.2.6", Uv = "1.2.840.113549.2.2", Dv = "1.2.840.113549.2.5", Ec = `${wr}.8`;
function Ft(r) {
  return new ie({ algorithm: r, parameters: null });
}
Ft(Uv);
Ft(Dv);
const wi = Ft(ma);
Ft(c0);
Ft(wa);
Ft(ba);
Ft(xa);
Ft(jv);
Ft(Rv);
const l0 = new ie({
  algorithm: Ec,
  parameters: q.serialize(wi)
}), u0 = new ie({
  algorithm: Ov,
  parameters: q.serialize(Yo.toASN(new Uint8Array([218, 57, 163, 238, 94, 107, 75, 13, 50, 85, 191, 239, 149, 96, 24, 144, 175, 216, 7, 9]).buffer))
});
Ft(mi);
Ft(Tv);
Ft(Nv);
Ft(ya);
Ft(o0);
Ft(a0);
Ft(ga);
Ft(va);
Ft(o0);
Ft(a0);
class Ic {
  constructor(e = {}) {
    this.hashAlgorithm = new ie(wi), this.maskGenAlgorithm = new ie({
      algorithm: Ec,
      parameters: q.serialize(wi)
    }), this.pSourceAlgorithm = new ie(u0), Object.assign(this, e);
  }
}
f([
  y({ type: ie, context: 0, defaultValue: wi })
], Ic.prototype, "hashAlgorithm", void 0);
f([
  y({ type: ie, context: 1, defaultValue: l0 })
], Ic.prototype, "maskGenAlgorithm", void 0);
f([
  y({ type: ie, context: 2, defaultValue: u0 })
], Ic.prototype, "pSourceAlgorithm", void 0);
new ie({
  algorithm: Bv,
  parameters: q.serialize(new Ic())
});
class bi {
  constructor(e = {}) {
    this.hashAlgorithm = new ie(wi), this.maskGenAlgorithm = new ie({
      algorithm: Ec,
      parameters: q.serialize(wi)
    }), this.saltLength = 20, this.trailerField = 1, Object.assign(this, e);
  }
}
f([
  y({ type: ie, context: 0, defaultValue: wi })
], bi.prototype, "hashAlgorithm", void 0);
f([
  y({ type: ie, context: 1, defaultValue: l0 })
], bi.prototype, "maskGenAlgorithm", void 0);
f([
  y({ type: b.Integer, context: 2, defaultValue: 20 })
], bi.prototype, "saltLength", void 0);
f([
  y({ type: b.Integer, context: 3, defaultValue: 1 })
], bi.prototype, "trailerField", void 0);
new ie({
  algorithm: Rs,
  parameters: q.serialize(new bi())
});
class kc {
  constructor(e = {}) {
    this.digestAlgorithm = new ie(), this.digest = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: ie })
], kc.prototype, "digestAlgorithm", void 0);
f([
  y({ type: nt })
], kc.prototype, "digest", void 0);
var ru;
class Cc {
  constructor(e = {}) {
    this.prime = new ArrayBuffer(0), this.exponent = new ArrayBuffer(0), this.coefficient = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, converter: xt })
], Cc.prototype, "prime", void 0);
f([
  y({ type: b.Integer, converter: xt })
], Cc.prototype, "exponent", void 0);
f([
  y({ type: b.Integer, converter: xt })
], Cc.prototype, "coefficient", void 0);
let nu = ru = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, ru.prototype);
  }
};
nu = ru = f([
  H({ type: M.Sequence, itemType: Cc })
], nu);
class pn {
  constructor(e = {}) {
    this.version = 0, this.modulus = new ArrayBuffer(0), this.publicExponent = new ArrayBuffer(0), this.privateExponent = new ArrayBuffer(0), this.prime1 = new ArrayBuffer(0), this.prime2 = new ArrayBuffer(0), this.exponent1 = new ArrayBuffer(0), this.exponent2 = new ArrayBuffer(0), this.coefficient = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], pn.prototype, "version", void 0);
f([
  y({ type: b.Integer, converter: xt })
], pn.prototype, "modulus", void 0);
f([
  y({ type: b.Integer, converter: xt })
], pn.prototype, "publicExponent", void 0);
f([
  y({ type: b.Integer, converter: xt })
], pn.prototype, "privateExponent", void 0);
f([
  y({ type: b.Integer, converter: xt })
], pn.prototype, "prime1", void 0);
f([
  y({ type: b.Integer, converter: xt })
], pn.prototype, "prime2", void 0);
f([
  y({ type: b.Integer, converter: xt })
], pn.prototype, "exponent1", void 0);
f([
  y({ type: b.Integer, converter: xt })
], pn.prototype, "exponent2", void 0);
f([
  y({ type: b.Integer, converter: xt })
], pn.prototype, "coefficient", void 0);
f([
  y({ type: nu, optional: !0 })
], pn.prototype, "otherPrimeInfos", void 0);
class wf {
  constructor(e = {}) {
    this.modulus = new ArrayBuffer(0), this.publicExponent = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, converter: xt })
], wf.prototype, "modulus", void 0);
f([
  y({ type: b.Integer, converter: xt })
], wf.prototype, "publicExponent", void 0);
var iu;
(function(r) {
  r[r.Transient = 0] = "Transient", r[r.Singleton = 1] = "Singleton", r[r.ResolutionScoped = 2] = "ResolutionScoped", r[r.ContainerScoped = 3] = "ContainerScoped";
})(iu || (iu = {}));
const dr = iu;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var su = function(r, e) {
  return su = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, n) {
    t.__proto__ = n;
  } || function(t, n) {
    for (var i in n) n.hasOwnProperty(i) && (t[i] = n[i]);
  }, su(r, e);
};
function bf(r, e) {
  su(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
function $v(r, e, t, n) {
  function i(s) {
    return s instanceof t ? s : new t(function(o) {
      o(s);
    });
  }
  return new (t || (t = Promise))(function(s, o) {
    function c(m) {
      try {
        h(n.next(m));
      } catch (x) {
        o(x);
      }
    }
    function u(m) {
      try {
        h(n.throw(m));
      } catch (x) {
        o(x);
      }
    }
    function h(m) {
      m.done ? s(m.value) : i(m.value).then(c, u);
    }
    h((n = n.apply(r, [])).next());
  });
}
function Mv(r, e) {
  var t = { label: 0, sent: function() {
    if (s[0] & 1) throw s[1];
    return s[1];
  }, trys: [], ops: [] }, n, i, s, o;
  return o = { next: c(0), throw: c(1), return: c(2) }, typeof Symbol == "function" && (o[Symbol.iterator] = function() {
    return this;
  }), o;
  function c(h) {
    return function(m) {
      return u([h, m]);
    };
  }
  function u(h) {
    if (n) throw new TypeError("Generator is already executing.");
    for (; t; ) try {
      if (n = 1, i && (s = h[0] & 2 ? i.return : h[0] ? i.throw || ((s = i.return) && s.call(i), 0) : i.next) && !(s = s.call(i, h[1])).done) return s;
      switch (i = 0, s && (h = [h[0] & 2, s.value]), h[0]) {
        case 0:
        case 1:
          s = h;
          break;
        case 4:
          return t.label++, { value: h[1], done: !1 };
        case 5:
          t.label++, i = h[1], h = [0];
          continue;
        case 7:
          h = t.ops.pop(), t.trys.pop();
          continue;
        default:
          if (s = t.trys, !(s = s.length > 0 && s[s.length - 1]) && (h[0] === 6 || h[0] === 2)) {
            t = 0;
            continue;
          }
          if (h[0] === 3 && (!s || h[1] > s[0] && h[1] < s[3])) {
            t.label = h[1];
            break;
          }
          if (h[0] === 6 && t.label < s[1]) {
            t.label = s[1], s = h;
            break;
          }
          if (s && t.label < s[2]) {
            t.label = s[2], t.ops.push(h);
            break;
          }
          s[2] && t.ops.pop(), t.trys.pop();
          continue;
      }
      h = e.call(r, t);
    } catch (m) {
      h = [6, m], i = 0;
    } finally {
      n = s = 0;
    }
    if (h[0] & 5) throw h[1];
    return { value: h[0] ? h[1] : void 0, done: !0 };
  }
}
function Ro(r) {
  var e = typeof Symbol == "function" && Symbol.iterator, t = e && r[e], n = 0;
  if (t) return t.call(r);
  if (r && typeof r.length == "number") return {
    next: function() {
      return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
    }
  };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function Aa(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), i, s = [], o;
  try {
    for (; (e === void 0 || e-- > 0) && !(i = n.next()).done; ) s.push(i.value);
  } catch (c) {
    o = { error: c };
  } finally {
    try {
      i && !i.done && (t = n.return) && t.call(n);
    } finally {
      if (o) throw o.error;
    }
  }
  return s;
}
function ri() {
  for (var r = [], e = 0; e < arguments.length; e++)
    r = r.concat(Aa(arguments[e]));
  return r;
}
var Vv = "injectionTokens";
function Lv(r) {
  var e = Reflect.getMetadata("design:paramtypes", r) || [], t = Reflect.getOwnMetadata(Vv, r) || {};
  return Object.keys(t).forEach(function(n) {
    e[+n] = t[n];
  }), e;
}
function f0(r) {
  return !!r.useClass;
}
function ou(r) {
  return !!r.useFactory;
}
var h0 = function() {
  function r(e) {
    this.wrap = e, this.reflectMethods = [
      "get",
      "getPrototypeOf",
      "setPrototypeOf",
      "getOwnPropertyDescriptor",
      "defineProperty",
      "has",
      "set",
      "deleteProperty",
      "apply",
      "construct",
      "ownKeys"
    ];
  }
  return r.prototype.createProxy = function(e) {
    var t = this, n = {}, i = !1, s, o = function() {
      return i || (s = e(t.wrap()), i = !0), s;
    };
    return new Proxy(n, this.createHandler(o));
  }, r.prototype.createHandler = function(e) {
    var t = {}, n = function(i) {
      t[i] = function() {
        for (var s = [], o = 0; o < arguments.length; o++)
          s[o] = arguments[o];
        s[0] = e();
        var c = Reflect[i];
        return c.apply(void 0, ri(s));
      };
    };
    return this.reflectMethods.forEach(n), t;
  }, r;
}();
function ji(r) {
  return typeof r == "string" || typeof r == "symbol";
}
function Hv(r) {
  return typeof r == "object" && "token" in r && "multiple" in r;
}
function bh(r) {
  return typeof r == "object" && "token" in r && "transform" in r;
}
function Fv(r) {
  return typeof r == "function" || r instanceof h0;
}
function Lo(r) {
  return !!r.useToken;
}
function Ho(r) {
  return r.useValue != null;
}
function zv(r) {
  return f0(r) || Ho(r) || Lo(r) || ou(r);
}
var xf = function() {
  function r() {
    this._registryMap = /* @__PURE__ */ new Map();
  }
  return r.prototype.entries = function() {
    return this._registryMap.entries();
  }, r.prototype.getAll = function(e) {
    return this.ensure(e), this._registryMap.get(e);
  }, r.prototype.get = function(e) {
    this.ensure(e);
    var t = this._registryMap.get(e);
    return t[t.length - 1] || null;
  }, r.prototype.set = function(e, t) {
    this.ensure(e), this._registryMap.get(e).push(t);
  }, r.prototype.setAll = function(e, t) {
    this._registryMap.set(e, t);
  }, r.prototype.has = function(e) {
    return this.ensure(e), this._registryMap.get(e).length > 0;
  }, r.prototype.clear = function() {
    this._registryMap.clear();
  }, r.prototype.ensure = function(e) {
    this._registryMap.has(e) || this._registryMap.set(e, []);
  }, r;
}(), Gv = function(r) {
  bf(e, r);
  function e() {
    return r !== null && r.apply(this, arguments) || this;
  }
  return e;
}(xf), xh = /* @__PURE__ */ function() {
  function r() {
    this.scopedResolutions = /* @__PURE__ */ new Map();
  }
  return r;
}();
function Kv(r, e) {
  if (r === null)
    return "at position #" + e;
  var t = r.split(",")[e].trim();
  return '"' + t + '" at position #' + e;
}
function qv(r, e, t) {
  return t === void 0 && (t = "    "), ri([r], e.message.split(`
`).map(function(n) {
    return t + n;
  })).join(`
`);
}
function Zv(r, e, t) {
  var n = Aa(r.toString().match(/constructor\(([\w, ]+)\)/) || [], 2), i = n[1], s = i === void 0 ? null : i, o = Kv(s, e);
  return qv("Cannot inject the dependency " + o + ' of "' + r.name + '" constructor. Reason:', t);
}
function Wv(r) {
  if (typeof r.dispose != "function")
    return !1;
  var e = r.dispose;
  return !(e.length > 0);
}
var Yv = function(r) {
  bf(e, r);
  function e() {
    return r !== null && r.apply(this, arguments) || this;
  }
  return e;
}(xf), Jv = function(r) {
  bf(e, r);
  function e() {
    return r !== null && r.apply(this, arguments) || this;
  }
  return e;
}(xf), Xv = /* @__PURE__ */ function() {
  function r() {
    this.preResolution = new Yv(), this.postResolution = new Jv();
  }
  return r;
}(), d0 = /* @__PURE__ */ new Map(), Qv = function() {
  function r(e) {
    this.parent = e, this._registry = new Gv(), this.interceptors = new Xv(), this.disposed = !1, this.disposables = /* @__PURE__ */ new Set();
  }
  return r.prototype.register = function(e, t, n) {
    n === void 0 && (n = { lifecycle: dr.Transient }), this.ensureNotDisposed();
    var i;
    if (zv(t) ? i = t : i = { useClass: t }, Lo(i))
      for (var s = [e], o = i; o != null; ) {
        var c = o.useToken;
        if (s.includes(c))
          throw new Error("Token registration cycle detected! " + ri(s, [c]).join(" -> "));
        s.push(c);
        var u = this._registry.get(c);
        u && Lo(u.provider) ? o = u.provider : o = null;
      }
    if ((n.lifecycle === dr.Singleton || n.lifecycle == dr.ContainerScoped || n.lifecycle == dr.ResolutionScoped) && (Ho(i) || ou(i)))
      throw new Error('Cannot use lifecycle "' + dr[n.lifecycle] + '" with ValueProviders or FactoryProviders');
    return this._registry.set(e, { provider: i, options: n }), this;
  }, r.prototype.registerType = function(e, t) {
    return this.ensureNotDisposed(), ji(t) ? this.register(e, {
      useToken: t
    }) : this.register(e, {
      useClass: t
    });
  }, r.prototype.registerInstance = function(e, t) {
    return this.ensureNotDisposed(), this.register(e, {
      useValue: t
    });
  }, r.prototype.registerSingleton = function(e, t) {
    if (this.ensureNotDisposed(), ji(e)) {
      if (ji(t))
        return this.register(e, {
          useToken: t
        }, { lifecycle: dr.Singleton });
      if (t)
        return this.register(e, {
          useClass: t
        }, { lifecycle: dr.Singleton });
      throw new Error('Cannot register a type name as a singleton without a "to" token');
    }
    var n = e;
    return t && !ji(t) && (n = t), this.register(e, {
      useClass: n
    }, { lifecycle: dr.Singleton });
  }, r.prototype.resolve = function(e, t) {
    t === void 0 && (t = new xh()), this.ensureNotDisposed();
    var n = this.getRegistration(e);
    if (!n && ji(e))
      throw new Error('Attempted to resolve unregistered dependency token: "' + e.toString() + '"');
    if (this.executePreResolutionInterceptor(e, "Single"), n) {
      var i = this.resolveRegistration(n, t);
      return this.executePostResolutionInterceptor(e, i, "Single"), i;
    }
    if (Fv(e)) {
      var i = this.construct(e, t);
      return this.executePostResolutionInterceptor(e, i, "Single"), i;
    }
    throw new Error("Attempted to construct an undefined constructor. Could mean a circular dependency problem. Try using `delay` function.");
  }, r.prototype.executePreResolutionInterceptor = function(e, t) {
    var n, i;
    if (this.interceptors.preResolution.has(e)) {
      var s = [];
      try {
        for (var o = Ro(this.interceptors.preResolution.getAll(e)), c = o.next(); !c.done; c = o.next()) {
          var u = c.value;
          u.options.frequency != "Once" && s.push(u), u.callback(e, t);
        }
      } catch (h) {
        n = { error: h };
      } finally {
        try {
          c && !c.done && (i = o.return) && i.call(o);
        } finally {
          if (n) throw n.error;
        }
      }
      this.interceptors.preResolution.setAll(e, s);
    }
  }, r.prototype.executePostResolutionInterceptor = function(e, t, n) {
    var i, s;
    if (this.interceptors.postResolution.has(e)) {
      var o = [];
      try {
        for (var c = Ro(this.interceptors.postResolution.getAll(e)), u = c.next(); !u.done; u = c.next()) {
          var h = u.value;
          h.options.frequency != "Once" && o.push(h), h.callback(e, t, n);
        }
      } catch (m) {
        i = { error: m };
      } finally {
        try {
          u && !u.done && (s = c.return) && s.call(c);
        } finally {
          if (i) throw i.error;
        }
      }
      this.interceptors.postResolution.setAll(e, o);
    }
  }, r.prototype.resolveRegistration = function(e, t) {
    if (this.ensureNotDisposed(), e.options.lifecycle === dr.ResolutionScoped && t.scopedResolutions.has(e))
      return t.scopedResolutions.get(e);
    var n = e.options.lifecycle === dr.Singleton, i = e.options.lifecycle === dr.ContainerScoped, s = n || i, o;
    return Ho(e.provider) ? o = e.provider.useValue : Lo(e.provider) ? o = s ? e.instance || (e.instance = this.resolve(e.provider.useToken, t)) : this.resolve(e.provider.useToken, t) : f0(e.provider) ? o = s ? e.instance || (e.instance = this.construct(e.provider.useClass, t)) : this.construct(e.provider.useClass, t) : ou(e.provider) ? o = e.provider.useFactory(this) : o = this.construct(e.provider, t), e.options.lifecycle === dr.ResolutionScoped && t.scopedResolutions.set(e, o), o;
  }, r.prototype.resolveAll = function(e, t) {
    var n = this;
    t === void 0 && (t = new xh()), this.ensureNotDisposed();
    var i = this.getAllRegistrations(e);
    if (!i && ji(e))
      throw new Error('Attempted to resolve unregistered dependency token: "' + e.toString() + '"');
    if (this.executePreResolutionInterceptor(e, "All"), i) {
      var s = i.map(function(c) {
        return n.resolveRegistration(c, t);
      });
      return this.executePostResolutionInterceptor(e, s, "All"), s;
    }
    var o = [this.construct(e, t)];
    return this.executePostResolutionInterceptor(e, o, "All"), o;
  }, r.prototype.isRegistered = function(e, t) {
    return t === void 0 && (t = !1), this.ensureNotDisposed(), this._registry.has(e) || t && (this.parent || !1) && this.parent.isRegistered(e, !0);
  }, r.prototype.reset = function() {
    this.ensureNotDisposed(), this._registry.clear(), this.interceptors.preResolution.clear(), this.interceptors.postResolution.clear();
  }, r.prototype.clearInstances = function() {
    var e, t;
    this.ensureNotDisposed();
    try {
      for (var n = Ro(this._registry.entries()), i = n.next(); !i.done; i = n.next()) {
        var s = Aa(i.value, 2), o = s[0], c = s[1];
        this._registry.setAll(o, c.filter(function(u) {
          return !Ho(u.provider);
        }).map(function(u) {
          return u.instance = void 0, u;
        }));
      }
    } catch (u) {
      e = { error: u };
    } finally {
      try {
        i && !i.done && (t = n.return) && t.call(n);
      } finally {
        if (e) throw e.error;
      }
    }
  }, r.prototype.createChildContainer = function() {
    var e, t;
    this.ensureNotDisposed();
    var n = new r(this);
    try {
      for (var i = Ro(this._registry.entries()), s = i.next(); !s.done; s = i.next()) {
        var o = Aa(s.value, 2), c = o[0], u = o[1];
        u.some(function(h) {
          var m = h.options;
          return m.lifecycle === dr.ContainerScoped;
        }) && n._registry.setAll(c, u.map(function(h) {
          return h.options.lifecycle === dr.ContainerScoped ? {
            provider: h.provider,
            options: h.options
          } : h;
        }));
      }
    } catch (h) {
      e = { error: h };
    } finally {
      try {
        s && !s.done && (t = i.return) && t.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return n;
  }, r.prototype.beforeResolution = function(e, t, n) {
    n === void 0 && (n = { frequency: "Always" }), this.interceptors.preResolution.set(e, {
      callback: t,
      options: n
    });
  }, r.prototype.afterResolution = function(e, t, n) {
    n === void 0 && (n = { frequency: "Always" }), this.interceptors.postResolution.set(e, {
      callback: t,
      options: n
    });
  }, r.prototype.dispose = function() {
    return $v(this, void 0, void 0, function() {
      var e;
      return Mv(this, function(t) {
        switch (t.label) {
          case 0:
            return this.disposed = !0, e = [], this.disposables.forEach(function(n) {
              var i = n.dispose();
              i && e.push(i);
            }), [4, Promise.all(e)];
          case 1:
            return t.sent(), [2];
        }
      });
    });
  }, r.prototype.getRegistration = function(e) {
    return this.isRegistered(e) ? this._registry.get(e) : this.parent ? this.parent.getRegistration(e) : null;
  }, r.prototype.getAllRegistrations = function(e) {
    return this.isRegistered(e) ? this._registry.getAll(e) : this.parent ? this.parent.getAllRegistrations(e) : null;
  }, r.prototype.construct = function(e, t) {
    var n = this;
    if (e instanceof h0)
      return e.createProxy(function(s) {
        return n.resolve(s, t);
      });
    var i = function() {
      var s = d0.get(e);
      if (!s || s.length === 0) {
        if (e.length === 0)
          return new e();
        throw new Error('TypeInfo not known for "' + e.name + '"');
      }
      var o = s.map(n.resolveParams(t, e));
      return new (e.bind.apply(e, ri([void 0], o)))();
    }();
    return Wv(i) && this.disposables.add(i), i;
  }, r.prototype.resolveParams = function(e, t) {
    var n = this;
    return function(i, s) {
      var o, c, u;
      try {
        return Hv(i) ? bh(i) ? i.multiple ? (o = n.resolve(i.transform)).transform.apply(o, ri([n.resolveAll(i.token)], i.transformArgs)) : (c = n.resolve(i.transform)).transform.apply(c, ri([n.resolve(i.token, e)], i.transformArgs)) : i.multiple ? n.resolveAll(i.token) : n.resolve(i.token, e) : bh(i) ? (u = n.resolve(i.transform, e)).transform.apply(u, ri([n.resolve(i.token, e)], i.transformArgs)) : n.resolve(i, e);
      } catch (h) {
        throw new Error(Zv(t, s, h));
      }
    };
  }, r.prototype.ensureNotDisposed = function() {
    if (this.disposed)
      throw new Error("This container has been disposed, you cannot interact with a disposed container");
  }, r;
}(), lr = new Qv();
function Bc() {
  return function(r) {
    d0.set(r, Lv(r));
  };
}
if (typeof Reflect > "u" || !Reflect.getMetadata)
  throw new Error(`tsyringe requires a reflect polyfill. Please add 'import "reflect-metadata"' to the top of your entry point.`);
var au;
class Oc {
  constructor(e = {}) {
    this.attrId = "", this.attrValues = [], Object.assign(e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Oc.prototype, "attrId", void 0);
f([
  y({ type: b.Any, repeated: "set" })
], Oc.prototype, "attrValues", void 0);
let Ah = au = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, au.prototype);
  }
};
Ah = au = f([
  H({ type: M.Sequence, itemType: Oc })
], Ah);
var cu;
let Sh = cu = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, cu.prototype);
  }
};
Sh = cu = f([
  H({ type: M.Sequence, itemType: xn })
], Sh);
class p0 {
  constructor(e = {}) {
    this.certId = "", this.certValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], p0.prototype, "certId", void 0);
f([
  y({ type: b.Any, context: 0 })
], p0.prototype, "certValue", void 0);
class y0 {
  constructor(e = {}) {
    this.crlId = "", this.crltValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], y0.prototype, "crlId", void 0);
f([
  y({ type: b.Any, context: 0 })
], y0.prototype, "crltValue", void 0);
class g0 extends nt {
}
let Tc = class {
  constructor(e = {}) {
    this.encryptionAlgorithm = new ie(), this.encryptedData = new g0(), Object.assign(this, e);
  }
};
f([
  y({ type: ie })
], Tc.prototype, "encryptionAlgorithm", void 0);
f([
  y({ type: g0 })
], Tc.prototype, "encryptedData", void 0);
var lu, uu;
(function(r) {
  r[r.v1 = 0] = "v1";
})(uu || (uu = {}));
class v0 extends nt {
}
let fu = lu = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, lu.prototype);
  }
};
fu = lu = f([
  H({ type: M.Sequence, itemType: _n })
], fu);
class ko {
  constructor(e = {}) {
    this.version = uu.v1, this.privateKeyAlgorithm = new ie(), this.privateKey = new v0(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], ko.prototype, "version", void 0);
f([
  y({ type: ie })
], ko.prototype, "privateKeyAlgorithm", void 0);
f([
  y({ type: v0 })
], ko.prototype, "privateKey", void 0);
f([
  y({ type: fu, implicit: !0, context: 0, optional: !0 })
], ko.prototype, "attributes", void 0);
let _h = class extends ko {
};
_h = f([
  H({ type: M.Sequence })
], _h);
let Eh = class extends Tc {
};
Eh = f([
  H({ type: M.Sequence })
], Eh);
class m0 {
  constructor(e = {}) {
    this.secretTypeId = "", this.secretValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], m0.prototype, "secretTypeId", void 0);
f([
  y({ type: b.Any, context: 0 })
], m0.prototype, "secretValue", void 0);
class Co {
  constructor(e = {}) {
    this.mac = new kc(), this.macSalt = new nt(), this.iterations = 1, Object.assign(this, e);
  }
}
f([
  y({ type: kc })
], Co.prototype, "mac", void 0);
f([
  y({ type: nt })
], Co.prototype, "macSalt", void 0);
f([
  y({ type: b.Integer, defaultValue: 1 })
], Co.prototype, "iterations", void 0);
class Nc {
  constructor(e = {}) {
    this.version = 3, this.authSafe = new xn(), this.macData = new Co(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], Nc.prototype, "version", void 0);
f([
  y({ type: xn })
], Nc.prototype, "authSafe", void 0);
f([
  y({ type: Co, optional: !0 })
], Nc.prototype, "macData", void 0);
var hu;
class Pc {
  constructor(e = {}) {
    this.bagId = "", this.bagValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Pc.prototype, "bagId", void 0);
f([
  y({ type: b.Any, context: 0 })
], Pc.prototype, "bagValue", void 0);
f([
  y({ type: Oc, repeated: "set", optional: !0 })
], Pc.prototype, "bagAttributes", void 0);
let Ih = hu = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, hu.prototype);
  }
};
Ih = hu = f([
  H({ type: M.Sequence, itemType: Pc })
], Ih);
var du, pu, yu;
const w0 = "1.2.840.113549.1.9", b0 = `${w0}.7`, Af = `${w0}.14`;
let Sa = class extends Xt {
  constructor(e = {}) {
    super(e);
  }
  toString() {
    return this.ia5String || super.toString();
  }
};
f([
  y({ type: b.IA5String })
], Sa.prototype, "ia5String", void 0);
Sa = f([
  H({ type: M.Choice })
], Sa);
let kh = class extends xn {
};
kh = f([
  H({ type: M.Sequence })
], kh);
let Ch = class extends Nc {
};
Ch = f([
  H({ type: M.Sequence })
], Ch);
let Bh = class extends Tc {
};
Bh = f([
  H({ type: M.Sequence })
], Bh);
let gu = class {
  constructor(e = "") {
    this.value = e;
  }
  toString() {
    return this.value;
  }
};
f([
  y({ type: b.IA5String })
], gu.prototype, "value", void 0);
gu = f([
  H({ type: M.Choice })
], gu);
let Oh = class extends Sa {
};
Oh = f([
  H({ type: M.Choice })
], Oh);
let Th = class extends Xt {
};
Th = f([
  H({ type: M.Choice })
], Th);
let vu = class {
  constructor(e = /* @__PURE__ */ new Date()) {
    this.value = e;
  }
};
f([
  y({ type: b.GeneralizedTime })
], vu.prototype, "value", void 0);
vu = f([
  H({ type: M.Choice })
], vu);
let Nh = class extends Xt {
};
Nh = f([
  H({ type: M.Choice })
], Nh);
let mu = class {
  constructor(e = "M") {
    this.value = e;
  }
  toString() {
    return this.value;
  }
};
f([
  y({ type: b.PrintableString })
], mu.prototype, "value", void 0);
mu = f([
  H({ type: M.Choice })
], mu);
let _a = class {
  constructor(e = "") {
    this.value = e;
  }
  toString() {
    return this.value;
  }
};
f([
  y({ type: b.PrintableString })
], _a.prototype, "value", void 0);
_a = f([
  H({ type: M.Choice })
], _a);
let Ph = class extends _a {
};
Ph = f([
  H({ type: M.Choice })
], Ph);
let jh = class extends Xt {
};
jh = f([
  H({ type: M.Choice })
], jh);
let wu = class {
  constructor(e = "") {
    this.value = e;
  }
  toString() {
    return this.value;
  }
};
f([
  y({ type: b.ObjectIdentifier })
], wu.prototype, "value", void 0);
wu = f([
  H({ type: M.Choice })
], wu);
let Rh = class extends Yt {
};
Rh = f([
  H({ type: M.Choice })
], Rh);
let bu = class {
  constructor(e = 0) {
    this.value = e;
  }
  toString() {
    return this.value.toString();
  }
};
f([
  y({ type: b.Integer })
], bu.prototype, "value", void 0);
bu = f([
  H({ type: M.Choice })
], bu);
let Uh = class extends dn {
};
Uh = f([
  H({ type: M.Sequence })
], Uh);
let Ea = class extends Xt {
};
Ea = f([
  H({ type: M.Choice })
], Ea);
let Dh = du = class extends pi {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, du.prototype);
  }
};
Dh = du = f([
  H({ type: M.Sequence })
], Dh);
let $h = pu = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, pu.prototype);
  }
};
$h = pu = f([
  H({ type: M.Set, itemType: ls })
], $h);
let xu = class {
  constructor(e = "") {
    this.value = e;
  }
  toString() {
    return this.value;
  }
};
f([
  y({ type: b.BmpString })
], xu.prototype, "value", void 0);
xu = f([
  H({ type: M.Choice })
], xu);
let Au = class extends ie {
};
Au = f([
  H({ type: M.Sequence })
], Au);
let Mh = yu = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, yu.prototype);
  }
};
Mh = yu = f([
  H({ type: M.Sequence, itemType: Au })
], Mh);
var Su;
let Ia = Su = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Su.prototype);
  }
};
Ia = Su = f([
  H({ type: M.Sequence, itemType: _n })
], Ia);
class fs {
  constructor(e = {}) {
    this.version = 0, this.subject = new Ht(), this.subjectPKInfo = new rn(), this.attributes = new Ia(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], fs.prototype, "version", void 0);
f([
  y({ type: Ht })
], fs.prototype, "subject", void 0);
f([
  y({ type: rn })
], fs.prototype, "subjectPKInfo", void 0);
f([
  y({ type: Ia, implicit: !0, context: 0 })
], fs.prototype, "attributes", void 0);
class Gs {
  constructor(e = {}) {
    this.certificationRequestInfo = new fs(), this.signatureAlgorithm = new ie(), this.signature = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: fs })
], Gs.prototype, "certificationRequestInfo", void 0);
f([
  y({ type: ie })
], Gs.prototype, "signatureAlgorithm", void 0);
f([
  y({ type: b.BitString })
], Gs.prototype, "signature", void 0);
/*!
 * MIT License
 * 
 * Copyright (c) Peculiar Ventures. All rights reserved.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */
const Bo = "crypto.algorithm";
class em {
  getAlgorithms() {
    return lr.resolveAll(Bo);
  }
  toAsnAlgorithm(e) {
    ({ ...e });
    for (const t of this.getAlgorithms()) {
      const n = t.toAsnAlgorithm(e);
      if (n)
        return n;
    }
    if (/^[0-9.]+$/.test(e.name)) {
      const t = new ie({
        algorithm: e.name
      });
      if ("parameters" in e) {
        const n = e;
        t.parameters = n.parameters;
      }
      return t;
    }
    throw new Error("Cannot convert WebCrypto algorithm to ASN.1 algorithm");
  }
  toWebAlgorithm(e) {
    for (const n of this.getAlgorithms()) {
      const i = n.toWebAlgorithm(e);
      if (i)
        return i;
    }
    return {
      name: e.algorithm,
      parameters: e.parameters
    };
  }
}
const Xi = "crypto.algorithmProvider";
lr.registerSingleton(Xi, em);
var Fo;
const br = "1.3.36.3.3.2.8.1.1", Vh = `${br}.1`, Lh = `${br}.2`, Hh = `${br}.3`, Fh = `${br}.4`, zh = `${br}.5`, Gh = `${br}.6`, Kh = `${br}.7`, qh = `${br}.8`, Zh = `${br}.9`, Wh = `${br}.10`, Yh = `${br}.11`, Jh = `${br}.12`, Xh = `${br}.13`, Qh = `${br}.14`, ed = "brainpoolP160r1", td = "brainpoolP160t1", rd = "brainpoolP192r1", nd = "brainpoolP192t1", id = "brainpoolP224r1", sd = "brainpoolP224t1", od = "brainpoolP256r1", ad = "brainpoolP256t1", cd = "brainpoolP320r1", ld = "brainpoolP320t1", ud = "brainpoolP384r1", fd = "brainpoolP384t1", hd = "brainpoolP512r1", dd = "brainpoolP512t1", kt = "ECDSA";
let Ks = Fo = class {
  toAsnAlgorithm(e) {
    switch (e.name.toLowerCase()) {
      case kt.toLowerCase():
        if ("hash" in e)
          switch ((typeof e.hash == "string" ? e.hash : e.hash.name).toLowerCase()) {
            case "sha-1":
              return _v;
            case "sha-256":
              return Ev;
            case "sha-384":
              return Iv;
            case "sha-512":
              return kv;
          }
        else if ("namedCurve" in e) {
          let t = "";
          switch (e.namedCurve) {
            case "P-256":
              t = vh;
              break;
            case "K-256":
              t = Fo.SECP256K1;
              break;
            case "P-384":
              t = mh;
              break;
            case "P-521":
              t = wh;
              break;
            case ed:
              t = Vh;
              break;
            case td:
              t = Lh;
              break;
            case rd:
              t = Hh;
              break;
            case nd:
              t = Fh;
              break;
            case id:
              t = zh;
              break;
            case sd:
              t = Gh;
              break;
            case od:
              t = Kh;
              break;
            case ad:
              t = qh;
              break;
            case cd:
              t = Zh;
              break;
            case ld:
              t = Wh;
              break;
            case ud:
              t = Yh;
              break;
            case fd:
              t = Jh;
              break;
            case hd:
              t = Xh;
              break;
            case dd:
              t = Qh;
              break;
          }
          if (t)
            return new ie({
              algorithm: Fs,
              parameters: q.serialize(new Gn({ namedCurve: t }))
            });
        }
    }
    return null;
  }
  toWebAlgorithm(e) {
    switch (e.algorithm) {
      case yf:
        return { name: kt, hash: { name: "SHA-1" } };
      case gf:
        return { name: kt, hash: { name: "SHA-256" } };
      case vf:
        return { name: kt, hash: { name: "SHA-384" } };
      case mf:
        return { name: kt, hash: { name: "SHA-512" } };
      case Fs: {
        if (!e.parameters)
          throw new TypeError("Cannot get required parameters from EC algorithm");
        switch (q.parse(e.parameters, Gn).namedCurve) {
          case vh:
            return { name: kt, namedCurve: "P-256" };
          case Fo.SECP256K1:
            return { name: kt, namedCurve: "K-256" };
          case mh:
            return { name: kt, namedCurve: "P-384" };
          case wh:
            return { name: kt, namedCurve: "P-521" };
          case Vh:
            return { name: kt, namedCurve: ed };
          case Lh:
            return { name: kt, namedCurve: td };
          case Hh:
            return { name: kt, namedCurve: rd };
          case Fh:
            return { name: kt, namedCurve: nd };
          case zh:
            return { name: kt, namedCurve: id };
          case Gh:
            return { name: kt, namedCurve: sd };
          case Kh:
            return { name: kt, namedCurve: od };
          case qh:
            return { name: kt, namedCurve: ad };
          case Zh:
            return { name: kt, namedCurve: cd };
          case Wh:
            return { name: kt, namedCurve: ld };
          case Yh:
            return { name: kt, namedCurve: ud };
          case Jh:
            return { name: kt, namedCurve: fd };
          case Xh:
            return { name: kt, namedCurve: hd };
          case Qh:
            return { name: kt, namedCurve: dd };
        }
      }
    }
    return null;
  }
};
Ks.SECP256K1 = "1.3.132.0.10";
Ks = Fo = f([
  Bc()
], Ks);
lr.registerSingleton(Bo, Ks);
const x0 = Symbol("name"), A0 = Symbol("value");
class rt {
  constructor(e, t = {}, n = "") {
    this[x0] = e, this[A0] = n;
    for (const i in t)
      this[i] = t[i];
  }
}
rt.NAME = x0;
rt.VALUE = A0;
class tm {
  static toTextObject(e) {
    const t = new rt("Algorithm Identifier", {}, On.toString(e.algorithm));
    if (e.parameters)
      switch (e.algorithm) {
        case Fs: {
          const n = new Ks().toWebAlgorithm(e);
          n && "namedCurve" in n ? t["Named Curve"] = n.namedCurve : t.Parameters = e.parameters;
          break;
        }
        default:
          t.Parameters = e.parameters;
      }
    return t;
  }
}
class On {
  static toString(e) {
    const t = this.items[e];
    return t || e;
  }
}
On.items = {
  [ma]: "sha1",
  [c0]: "sha224",
  [wa]: "sha256",
  [ba]: "sha384",
  [xa]: "sha512",
  [mi]: "rsaEncryption",
  [ya]: "sha1WithRSAEncryption",
  [Pv]: "sha224WithRSAEncryption",
  [tu]: "sha256WithRSAEncryption",
  [ga]: "sha384WithRSAEncryption",
  [va]: "sha512WithRSAEncryption",
  [Fs]: "ecPublicKey",
  [yf]: "ecdsaWithSHA1",
  [s0]: "ecdsaWithSHA224",
  [gf]: "ecdsaWithSHA256",
  [vf]: "ecdsaWithSHA384",
  [mf]: "ecdsaWithSHA512",
  [vv]: "TLS WWW server authentication",
  [mv]: "TLS WWW client authentication",
  [wv]: "Code Signing",
  [bv]: "E-mail Protection",
  [xv]: "Time Stamping",
  [Av]: "OCSP Signing",
  [Xl]: "Signed Data"
};
class Kn {
  static serialize(e) {
    return this.serializeObj(e).join(`
`);
  }
  static pad(e = 0) {
    return "".padStart(2 * e, " ");
  }
  static serializeObj(e, t = 0) {
    const n = [];
    let i = this.pad(t++), s = "";
    const o = e[rt.VALUE];
    o && (s = ` ${o}`), n.push(`${i}${e[rt.NAME]}:${s}`), i = this.pad(t);
    for (const c in e) {
      if (typeof c == "symbol")
        continue;
      const u = e[c], h = c ? `${c}: ` : "";
      if (typeof u == "string" || typeof u == "number" || typeof u == "boolean")
        n.push(`${i}${h}${u}`);
      else if (u instanceof Date)
        n.push(`${i}${h}${u.toUTCString()}`);
      else if (Array.isArray(u))
        for (const m of u)
          m[rt.NAME] = c, n.push(...this.serializeObj(m, t));
      else if (u instanceof rt)
        u[rt.NAME] = c, n.push(...this.serializeObj(u, t));
      else if (W.isBufferSource(u))
        c ? (n.push(`${i}${h}`), n.push(...this.serializeBufferSource(u, t + 1))) : n.push(...this.serializeBufferSource(u, t));
      else if ("toTextObject" in u) {
        const m = u.toTextObject();
        m[rt.NAME] = c, n.push(...this.serializeObj(m, t));
      } else
        throw new TypeError("Cannot serialize data in text format. Unsupported type.");
    }
    return n;
  }
  static serializeBufferSource(e, t = 0) {
    const n = this.pad(t), i = W.toUint8Array(e), s = [];
    for (let o = 0; o < i.length; ) {
      const c = [];
      for (let u = 0; u < 16 && o < i.length; u++) {
        u === 8 && c.push("");
        const h = i[o++].toString(16).padStart(2, "0");
        c.push(h);
      }
      s.push(`${n}${c.join(" ")}`);
    }
    return s;
  }
  static serializeAlgorithm(e) {
    return this.algorithmSerializer.toTextObject(e);
  }
}
Kn.oidSerializer = On;
Kn.algorithmSerializer = tm;
class Xn {
  constructor(...e) {
    if (e.length === 1) {
      const t = e[0];
      this.rawData = q.serialize(t), this.onInit(t);
    } else {
      const t = q.parse(e[0], e[1]);
      this.rawData = W.toArrayBuffer(e[0]), this.onInit(t);
    }
  }
  equal(e) {
    return e instanceof Xn ? qo(e.rawData, this.rawData) : !1;
  }
  toString(e = "text") {
    switch (e) {
      case "asn":
        return q.toString(this.rawData);
      case "text":
        return Kn.serialize(this.toTextObject());
      case "hex":
        return fe.ToHex(this.rawData);
      case "base64":
        return fe.ToBase64(this.rawData);
      case "base64url":
        return fe.ToBase64Url(this.rawData);
      default:
        throw TypeError("Argument 'format' is unsupported value");
    }
  }
  getTextName() {
    return this.constructor.NAME;
  }
  toTextObject() {
    const e = this.toTextObjectEmpty();
    return e[""] = this.rawData, e;
  }
  toTextObjectEmpty(e) {
    return new rt(this.getTextName(), {}, e);
  }
}
Xn.NAME = "ASN";
class jr extends Xn {
  constructor(...e) {
    let t;
    W.isBufferSource(e[0]) ? t = W.toArrayBuffer(e[0]) : t = q.serialize(new Hr({
      extnID: e[0],
      critical: e[1],
      extnValue: new nt(W.toArrayBuffer(e[2]))
    })), super(t, Hr);
  }
  onInit(e) {
    this.type = e.extnID, this.critical = e.critical, this.value = e.extnValue.buffer;
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return e[""] = this.value, e;
  }
  toTextObjectWithoutValue() {
    const e = this.toTextObjectEmpty(this.critical ? "critical" : void 0);
    return e[rt.NAME] === jr.NAME && (e[rt.NAME] = On.toString(this.type)), e;
  }
}
var S0;
class $n {
  static isCryptoKeyPair(e) {
    return e && e.privateKey && e.publicKey;
  }
  static isCryptoKey(e) {
    return e && e.usages && e.type && e.algorithm && e.extractable !== void 0;
  }
  constructor() {
    this.items = /* @__PURE__ */ new Map(), this[S0] = "CryptoProvider", typeof self < "u" && typeof crypto < "u" ? this.set($n.DEFAULT, crypto) : typeof global < "u" && global.crypto && global.crypto.subtle && this.set($n.DEFAULT, global.crypto);
  }
  clear() {
    this.items.clear();
  }
  delete(e) {
    return this.items.delete(e);
  }
  forEach(e, t) {
    return this.items.forEach(e, t);
  }
  has(e) {
    return this.items.has(e);
  }
  get size() {
    return this.items.size;
  }
  entries() {
    return this.items.entries();
  }
  keys() {
    return this.items.keys();
  }
  values() {
    return this.items.values();
  }
  [Symbol.iterator]() {
    return this.items[Symbol.iterator]();
  }
  get(e = $n.DEFAULT) {
    const t = this.items.get(e.toLowerCase());
    if (!t)
      throw new Error(`Cannot get Crypto by name '${e}'`);
    return t;
  }
  set(e, t) {
    if (typeof e == "string") {
      if (!t)
        throw new TypeError("Argument 'value' is required");
      this.items.set(e.toLowerCase(), t);
    } else
      this.items.set($n.DEFAULT, e);
    return this;
  }
}
S0 = Symbol.toStringTag;
$n.DEFAULT = "default";
const Zt = new $n(), rm = /^[0-2](?:\.[1-9][0-9]*)+$/;
function nm(r) {
  return new RegExp(rm).test(r);
}
class _0 {
  constructor(e = {}) {
    this.items = {};
    for (const t in e)
      this.register(t, e[t]);
  }
  get(e) {
    return this.items[e] || null;
  }
  findId(e) {
    return nm(e) ? e : this.get(e);
  }
  register(e, t) {
    this.items[e] = t, this.items[t] = e;
  }
}
const mr = new _0();
mr.register("CN", "2.5.4.3");
mr.register("L", "2.5.4.7");
mr.register("ST", "2.5.4.8");
mr.register("O", "2.5.4.10");
mr.register("OU", "2.5.4.11");
mr.register("C", "2.5.4.6");
mr.register("DC", "0.9.2342.19200300.100.1.25");
mr.register("E", "1.2.840.113549.1.9.1");
mr.register("G", "2.5.4.42");
mr.register("I", "2.5.4.43");
mr.register("SN", "2.5.4.4");
mr.register("T", "2.5.4.12");
function im(r, e) {
  return `\\${fe.ToHex(fe.FromUtf8String(e)).toUpperCase()}`;
}
function sm(r) {
  return r.replace(/([,+"\\<>;])/g, "\\$1").replace(/^([ #])/, "\\$1").replace(/([ ]$)/, "\\$1").replace(/([\r\n\t])/, im);
}
class Fn {
  static isASCII(e) {
    for (let t = 0; t < e.length; t++)
      if (e.charCodeAt(t) > 255)
        return !1;
    return !0;
  }
  static isPrintableString(e) {
    return /^[A-Za-z0-9 '()+,-./:=?]*$/g.test(e);
  }
  constructor(e, t = {}) {
    this.extraNames = new _0(), this.asn = new Ht();
    for (const n in t)
      if (Object.prototype.hasOwnProperty.call(t, n)) {
        const i = t[n];
        this.extraNames.register(n, i);
      }
    typeof e == "string" ? this.asn = this.fromString(e) : e instanceof Ht ? this.asn = e : W.isBufferSource(e) ? this.asn = q.parse(e, Ht) : this.asn = this.fromJSON(e);
  }
  getField(e) {
    const t = this.extraNames.findId(e) || mr.findId(e), n = [];
    for (const i of this.asn)
      for (const s of i)
        s.type === t && n.push(s.value.toString());
    return n;
  }
  getName(e) {
    return this.extraNames.get(e) || mr.get(e);
  }
  toString() {
    return this.asn.map((e) => e.map((t) => {
      const n = this.getName(t.type) || t.type, i = t.value.anyValue ? `#${fe.ToHex(t.value.anyValue)}` : sm(t.value.toString());
      return `${n}=${i}`;
    }).join("+")).join(", ");
  }
  toJSON() {
    var e;
    const t = [];
    for (const n of this.asn) {
      const i = {};
      for (const s of n) {
        const o = this.getName(s.type) || s.type;
        (e = i[o]) !== null && e !== void 0 || (i[o] = []), i[o].push(s.value.anyValue ? `#${fe.ToHex(s.value.anyValue)}` : s.value.toString());
      }
      t.push(i);
    }
    return t;
  }
  fromString(e) {
    const t = new Ht(), n = /(\d\.[\d.]*\d|[A-Za-z]+)=((?:"")|(?:".*?[^\\]")|(?:[^,+].*?(?:[^\\][,+]))|(?:))([,+])?/g;
    let i = null, s = ",";
    for (; i = n.exec(`${e},`); ) {
      let [, o, c] = i;
      const u = c[c.length - 1];
      (u === "," || u === "+") && (c = c.slice(0, c.length - 1), i[3] = u);
      const h = i[3];
      o = this.getTypeOid(o);
      const m = this.createAttribute(o, c);
      s === "+" ? t[t.length - 1].push(m) : t.push(new Fi([m])), s = h;
    }
    return t;
  }
  fromJSON(e) {
    const t = new Ht();
    for (const n of e) {
      const i = new Fi();
      for (const s in n) {
        const o = this.getTypeOid(s), c = n[s];
        for (const u of c) {
          const h = this.createAttribute(o, u);
          i.push(h);
        }
      }
      t.push(i);
    }
    return t;
  }
  getTypeOid(e) {
    if (/[\d.]+/.test(e) || (e = this.getName(e) || ""), !e)
      throw new Error(`Cannot get OID for name type '${e}'`);
    return e;
  }
  createAttribute(e, t) {
    const n = new cc({ type: e });
    if (typeof t == "object")
      for (const i in t)
        switch (i) {
          case "ia5String":
            n.value.ia5String = t[i];
            break;
          case "utf8String":
            n.value.utf8String = t[i];
            break;
          case "universalString":
            n.value.universalString = t[i];
            break;
          case "bmpString":
            n.value.bmpString = t[i];
            break;
          case "printableString":
            n.value.printableString = t[i];
            break;
        }
    else if (t[0] === "#")
      n.value.anyValue = fe.FromHex(t.slice(1));
    else {
      const i = this.processStringValue(t);
      e === this.getName("E") || e === this.getName("DC") ? n.value.ia5String = i : Fn.isPrintableString(i) ? n.value.printableString = i : n.value.utf8String = i;
    }
    return n;
  }
  processStringValue(e) {
    const t = /"(.*?[^\\])?"/.exec(e);
    return t && (e = t[1]), e.replace(/\\0a/ig, `
`).replace(/\\0d/ig, "\r").replace(/\\0g/ig, "	").replace(/\\(.)/g, "$1");
  }
  toArrayBuffer() {
    return q.serialize(this.asn);
  }
  async getThumbprint(...e) {
    var t;
    let n, i = "SHA-1";
    return e.length >= 1 && !(!((t = e[0]) === null || t === void 0) && t.subtle) ? (i = e[0] || i, n = e[1] || Zt.get()) : n = e[0] || Zt.get(), await n.subtle.digest(i, this.toArrayBuffer());
  }
}
const E0 = "Cannot initialize GeneralName from ASN.1 data.", pd = `${E0} Unsupported string format in use.`, om = `${E0} Value doesn't match to GUID regular expression.`, yd = /^([0-9a-f]{8})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{12})$/i, gd = "1.3.6.1.4.1.311.25.1", vd = "1.3.6.1.4.1.311.20.2.3", qc = "dns", Zc = "dn", Wc = "email", Yc = "ip", Jc = "url", Xc = "guid", Qc = "upn", Uo = "id";
class Mn extends Xn {
  constructor(...e) {
    let t;
    if (e.length === 2)
      switch (e[0]) {
        case Zc: {
          const n = new Fn(e[1]).toArrayBuffer(), i = q.parse(n, Ht);
          t = new De({ directoryName: i });
          break;
        }
        case qc:
          t = new De({ dNSName: e[1] });
          break;
        case Wc:
          t = new De({ rfc822Name: e[1] });
          break;
        case Xc: {
          const n = new RegExp(yd, "i").exec(e[1]);
          if (!n)
            throw new Error("Cannot parse GUID value. Value doesn't match to regular expression");
          const i = n.slice(1).map((s, o) => o < 3 ? fe.ToHex(new Uint8Array(fe.FromHex(s)).reverse()) : s).join("");
          t = new De({
            otherName: new Ms({
              typeId: gd,
              value: q.serialize(new nt(fe.FromHex(i)))
            })
          });
          break;
        }
        case Yc:
          t = new De({ iPAddress: e[1] });
          break;
        case Uo:
          t = new De({ registeredID: e[1] });
          break;
        case Qc: {
          t = new De({
            otherName: new Ms({
              typeId: vd,
              value: q.serialize(Fp.toASN(e[1]))
            })
          });
          break;
        }
        case Jc:
          t = new De({ uniformResourceIdentifier: e[1] });
          break;
        default:
          throw new Error("Cannot create GeneralName. Unsupported type of the name");
      }
    else W.isBufferSource(e[0]) ? t = q.parse(e[0], De) : t = e[0];
    super(t);
  }
  onInit(e) {
    if (e.dNSName != null)
      this.type = qc, this.value = e.dNSName;
    else if (e.rfc822Name != null)
      this.type = Wc, this.value = e.rfc822Name;
    else if (e.iPAddress != null)
      this.type = Yc, this.value = e.iPAddress;
    else if (e.uniformResourceIdentifier != null)
      this.type = Jc, this.value = e.uniformResourceIdentifier;
    else if (e.registeredID != null)
      this.type = Uo, this.value = e.registeredID;
    else if (e.directoryName != null)
      this.type = Zc, this.value = new Fn(e.directoryName).toString();
    else if (e.otherName != null)
      if (e.otherName.typeId === gd) {
        this.type = Xc;
        const t = q.parse(e.otherName.value, nt), n = new RegExp(yd, "i").exec(fe.ToHex(t));
        if (!n)
          throw new Error(om);
        this.value = n.slice(1).map((i, s) => s < 3 ? fe.ToHex(new Uint8Array(fe.FromHex(i)).reverse()) : i).join("-");
      } else if (e.otherName.typeId === vd)
        this.type = Qc, this.value = q.parse(e.otherName.value, Xt).toString();
      else
        throw new Error(pd);
    else
      throw new Error(pd);
  }
  toJSON() {
    return {
      type: this.type,
      value: this.value
    };
  }
  toTextObject() {
    let e;
    switch (this.type) {
      case Zc:
      case qc:
      case Xc:
      case Yc:
      case Uo:
      case Qc:
      case Jc:
        e = this.type.toUpperCase();
        break;
      case Wc:
        e = "Email";
        break;
      default:
        throw new Error("Unsupported GeneralName type");
    }
    let t = this.value;
    return this.type === Uo && (t = On.toString(t)), new rt(e, void 0, t);
  }
}
class qs extends Xn {
  constructor(e) {
    let t;
    if (e instanceof cr)
      t = e;
    else if (Array.isArray(e)) {
      const n = [];
      for (const i of e)
        if (i instanceof De)
          n.push(i);
        else {
          const s = q.parse(new Mn(i.type, i.value).rawData, De);
          n.push(s);
        }
      t = new cr(n);
    } else if (W.isBufferSource(e))
      t = q.parse(e, cr);
    else
      throw new Error("Cannot initialize GeneralNames. Incorrect incoming arguments");
    super(t);
  }
  onInit(e) {
    const t = [];
    for (const n of e) {
      let i = null;
      try {
        i = new Mn(n);
      } catch {
        continue;
      }
      t.push(i);
    }
    this.items = t;
  }
  toJSON() {
    return this.items.map((e) => e.toJSON());
  }
  toTextObject() {
    const e = super.toTextObjectEmpty();
    for (const t of this.items) {
      const n = t.toTextObject();
      let i = e[n[rt.NAME]];
      Array.isArray(i) || (i = [], e[n[rt.NAME]] = i), i.push(n);
    }
    return e;
  }
}
qs.NAME = "GeneralNames";
const Us = "-{5}", Zs = "\\n", am = `[^${Zs}]+`, cm = `${Us}BEGIN (${am}(?=${Us}))${Us}`, lm = `${Us}END \\1${Us}`, Qi = "\\n", um = `[^:${Zs}]+`, fm = `(?:[^${Zs}]+${Qi}(?: +[^${Zs}]+${Qi})*)`, hm = "[a-zA-Z0-9=+/]+", dm = `(?:${hm}${Qi})+`, md = `${cm}${Qi}(?:((?:${um}: ${fm})+))?${Qi}?(${dm})${lm}`;
class gr {
  static isPem(e) {
    return typeof e == "string" && new RegExp(md, "g").test(e);
  }
  static decodeWithHeaders(e) {
    e = e.replace(/\r/g, "");
    const t = new RegExp(md, "g"), n = [];
    let i = null;
    for (; i = t.exec(e); ) {
      const s = i[3].replace(new RegExp(`[${Zs}]+`, "g"), ""), o = {
        type: i[1],
        headers: [],
        rawData: fe.FromBase64(s)
      }, c = i[2];
      if (c) {
        const u = c.split(new RegExp(Qi, "g"));
        let h = null;
        for (const m of u) {
          const [x, G] = m.split(/:(.*)/);
          if (G === void 0) {
            if (!h)
              throw new Error("Cannot parse PEM string. Incorrect header value");
            h.value += x.trim();
          } else
            h && o.headers.push(h), h = { key: x, value: G.trim() };
        }
        h && o.headers.push(h);
      }
      n.push(o);
    }
    return n;
  }
  static decode(e) {
    return this.decodeWithHeaders(e).map((n) => n.rawData);
  }
  static decodeFirst(e) {
    const t = this.decode(e);
    if (!t.length)
      throw new RangeError("PEM string doesn't contain any objects");
    return t[0];
  }
  static encode(e, t) {
    if (Array.isArray(e)) {
      const n = new Array();
      return t ? e.forEach((i) => {
        if (!W.isBufferSource(i))
          throw new TypeError("Cannot encode array of BufferSource in PEM format. Not all items of the array are BufferSource");
        n.push(this.encodeStruct({
          type: t,
          rawData: W.toArrayBuffer(i)
        }));
      }) : e.forEach((i) => {
        if (!("type" in i))
          throw new TypeError("Cannot encode array of PemStruct in PEM format. Not all items of the array are PemStrut");
        n.push(this.encodeStruct(i));
      }), n.join(`
`);
    } else {
      if (!t)
        throw new Error("Required argument 'tag' is missed");
      return this.encodeStruct({
        type: t,
        rawData: W.toArrayBuffer(e)
      });
    }
  }
  static encodeStruct(e) {
    var t;
    const n = e.type.toLocaleUpperCase(), i = [];
    if (i.push(`-----BEGIN ${n}-----`), !((t = e.headers) === null || t === void 0) && t.length) {
      for (const h of e.headers)
        i.push(`${h.key}: ${h.value}`);
      i.push("");
    }
    const s = fe.ToBase64(e.rawData);
    let o, c = 0;
    const u = Array();
    for (; c < s.length && (s.length - c < 64 ? o = s.substring(c) : (o = s.substring(c, c + 64), c += 64), o.length !== 0); )
      if (u.push(o), o.length < 64)
        break;
    return i.push(...u), i.push(`-----END ${n}-----`), i.join(`
`);
  }
}
gr.CertificateTag = "CERTIFICATE";
gr.CrlTag = "CRL";
gr.CertificateRequestTag = "CERTIFICATE REQUEST";
gr.PublicKeyTag = "PUBLIC KEY";
gr.PrivateKeyTag = "PRIVATE KEY";
class Fr extends Xn {
  static isAsnEncoded(e) {
    return W.isBufferSource(e) || typeof e == "string";
  }
  static toArrayBuffer(e) {
    if (typeof e == "string") {
      if (gr.isPem(e))
        return gr.decode(e)[0];
      if (fe.isHex(e))
        return fe.FromHex(e);
      if (fe.isBase64(e))
        return fe.FromBase64(e);
      if (fe.isBase64Url(e))
        return fe.FromBase64Url(e);
      throw new TypeError("Unsupported format of 'raw' argument. Must be one of DER, PEM, HEX, Base64, or Base4Url");
    } else {
      const t = fe.ToBinary(e);
      return gr.isPem(t) ? gr.decode(t)[0] : fe.isHex(t) ? fe.FromHex(t) : fe.isBase64(t) ? fe.FromBase64(t) : fe.isBase64Url(t) ? fe.FromBase64Url(t) : W.toArrayBuffer(e);
    }
  }
  constructor(...e) {
    Fr.isAsnEncoded(e[0]) ? super(Fr.toArrayBuffer(e[0]), e[1]) : super(e[0]);
  }
  toString(e = "pem") {
    switch (e) {
      case "pem":
        return gr.encode(this.rawData, this.tag);
      default:
        return super.toString(e);
    }
  }
}
class sn extends Fr {
  static async create(e, t = Zt.get()) {
    if (e instanceof sn)
      return e;
    if ($n.isCryptoKey(e)) {
      if (e.type !== "public")
        throw new TypeError("Public key is required");
      const n = await t.subtle.exportKey("spki", e);
      return new sn(n);
    } else {
      if (e.publicKey)
        return e.publicKey;
      if (W.isBufferSource(e))
        return new sn(e);
      throw new TypeError("Unsupported PublicKeyType");
    }
  }
  constructor(e) {
    Fr.isAsnEncoded(e) ? super(e, rn) : super(e), this.tag = gr.PublicKeyTag;
  }
  async export(...e) {
    let t, n = ["verify"], i = { hash: "SHA-256", ...this.algorithm };
    e.length > 1 ? (i = e[0] || i, n = e[1] || n, t = e[2] || Zt.get()) : t = e[0] || Zt.get();
    let s = this.rawData;
    const o = q.parse(this.rawData, rn);
    return o.algorithm.algorithm === Rs && (s = pm(o, s)), t.subtle.importKey("spki", s, i, !0, n);
  }
  onInit(e) {
    const t = lr.resolve(Xi), n = this.algorithm = t.toWebAlgorithm(e.algorithm);
    switch (e.algorithm.algorithm) {
      case mi: {
        const i = q.parse(e.subjectPublicKey, wf), s = W.toUint8Array(i.modulus);
        n.publicExponent = W.toUint8Array(i.publicExponent), n.modulusLength = (s[0] ? s : s.slice(1)).byteLength << 3;
        break;
      }
    }
  }
  async getThumbprint(...e) {
    var t;
    let n, i = "SHA-1";
    return e.length >= 1 && !(!((t = e[0]) === null || t === void 0) && t.subtle) ? (i = e[0] || i, n = e[1] || Zt.get()) : n = e[0] || Zt.get(), await n.subtle.digest(i, this.rawData);
  }
  async getKeyIdentifier(...e) {
    let t, n = "SHA-1";
    e.length === 1 ? typeof e[0] == "string" ? (n = e[0], t = Zt.get()) : t = e[0] : e.length === 2 ? (n = e[0], t = e[1]) : t = Zt.get();
    const i = q.parse(this.rawData, rn);
    return await t.subtle.digest(n, i.subjectPublicKey);
  }
  toTextObject() {
    const e = this.toTextObjectEmpty(), t = q.parse(this.rawData, rn);
    switch (e.Algorithm = Kn.serializeAlgorithm(t.algorithm), t.algorithm.algorithm) {
      case Fs:
        e["EC Point"] = t.subjectPublicKey;
        break;
      case mi:
      default:
        e["Raw Data"] = t.subjectPublicKey;
    }
    return e;
  }
}
function pm(r, e) {
  return r.algorithm = new ie({
    algorithm: mi,
    parameters: null
  }), e = q.serialize(r), e;
}
class Ws extends jr {
  static async create(e, t = !1, n = Zt.get()) {
    if ("name" in e && "serialNumber" in e)
      return new Ws(e, t);
    const s = await (await sn.create(e, n)).getKeyIdentifier(n);
    return new Ws(fe.ToHex(s), t);
  }
  constructor(...e) {
    if (W.isBufferSource(e[0]))
      super(e[0]);
    else if (typeof e[0] == "string") {
      const t = new ii({ keyIdentifier: new Ju(fe.FromHex(e[0])) });
      super(Jo, e[1], q.serialize(t));
    } else {
      const t = e[0], n = t.name instanceof qs ? q.parse(t.name.rawData, cr) : t.name, i = new ii({
        authorityCertIssuer: n,
        authorityCertSerialNumber: fe.FromHex(t.serialNumber)
      });
      super(Jo, e[1], q.serialize(i));
    }
  }
  onInit(e) {
    super.onInit(e);
    const t = q.parse(e.extnValue, ii);
    t.keyIdentifier && (this.keyId = fe.ToHex(t.keyIdentifier)), (t.authorityCertIssuer || t.authorityCertSerialNumber) && (this.certId = {
      name: t.authorityCertIssuer || [],
      serialNumber: t.authorityCertSerialNumber ? fe.ToHex(t.authorityCertSerialNumber) : ""
    });
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue(), t = q.parse(this.value, ii);
    return t.authorityCertIssuer && (e["Authority Issuer"] = new qs(t.authorityCertIssuer).toTextObject()), t.authorityCertSerialNumber && (e["Authority Serial Number"] = t.authorityCertSerialNumber), t.keyIdentifier && (e[""] = t.keyIdentifier), e;
  }
}
Ws.NAME = "Authority Key Identifier";
class I0 extends jr {
  constructor(...e) {
    if (W.isBufferSource(e[0])) {
      super(e[0]);
      const t = q.parse(this.value, Xo);
      this.ca = t.cA, this.pathLength = t.pathLenConstraint;
    } else {
      const t = new Xo({
        cA: e[0],
        pathLenConstraint: e[1]
      });
      super(Kp, e[2], q.serialize(t)), this.ca = e[0], this.pathLength = e[1];
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return this.ca && (e.CA = this.ca), this.pathLength !== void 0 && (e["Path Length"] = this.pathLength), e;
  }
}
I0.NAME = "Basic Constraints";
var wd;
(function(r) {
  r.serverAuth = "1.3.6.1.5.5.7.3.1", r.clientAuth = "1.3.6.1.5.5.7.3.2", r.codeSigning = "1.3.6.1.5.5.7.3.3", r.emailProtection = "1.3.6.1.5.5.7.3.4", r.timeStamping = "1.3.6.1.5.5.7.3.8", r.ocspSigning = "1.3.6.1.5.5.7.3.9";
})(wd || (wd = {}));
class k0 extends jr {
  constructor(...e) {
    if (W.isBufferSource(e[0])) {
      super(e[0]);
      const t = q.parse(this.value, ra);
      this.usages = t.map((n) => n);
    } else {
      const t = new ra(e[0]);
      super(Wp, e[1], q.serialize(t)), this.usages = e[0];
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return e[""] = this.usages.map((t) => On.toString(t)).join(", "), e;
  }
}
k0.NAME = "Extended Key Usages";
var bd;
(function(r) {
  r[r.digitalSignature = 1] = "digitalSignature", r[r.nonRepudiation = 2] = "nonRepudiation", r[r.keyEncipherment = 4] = "keyEncipherment", r[r.dataEncipherment = 8] = "dataEncipherment", r[r.keyAgreement = 16] = "keyAgreement", r[r.keyCertSign = 32] = "keyCertSign", r[r.cRLSign = 64] = "cRLSign", r[r.encipherOnly = 128] = "encipherOnly", r[r.decipherOnly = 256] = "decipherOnly";
})(bd || (bd = {}));
class C0 extends jr {
  constructor(...e) {
    if (W.isBufferSource(e[0])) {
      super(e[0]);
      const t = q.parse(this.value, Kc);
      this.usages = t.toNumber();
    } else {
      const t = new Kc(e[0]);
      super(Yp, e[1], q.serialize(t)), this.usages = e[0];
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue(), t = q.parse(this.value, Kc);
    return e[""] = t.toJSON().join(", "), e;
  }
}
C0.NAME = "Key Usages";
class jc extends jr {
  static async create(e, t = !1, n = Zt.get()) {
    const s = await (await sn.create(e, n)).getKeyIdentifier(n);
    return new jc(fe.ToHex(s), t);
  }
  constructor(...e) {
    if (W.isBufferSource(e[0])) {
      super(e[0]);
      const t = q.parse(this.value, Hn);
      this.keyId = fe.ToHex(t);
    } else {
      const t = typeof e[0] == "string" ? fe.FromHex(e[0]) : e[0], n = new Hn(t);
      super(nf, e[1], q.serialize(n)), this.keyId = fe.ToHex(t);
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue(), t = q.parse(this.value, Hn);
    return e[""] = t, e;
  }
}
jc.NAME = "Subject Key Identifier";
class B0 extends jr {
  constructor(...e) {
    W.isBufferSource(e[0]) ? super(e[0]) : super(rf, e[1], new qs(e[0] || []).rawData);
  }
  onInit(e) {
    super.onInit(e);
    const t = q.parse(e.extnValue, Pl);
    this.names = new qs(t);
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue(), t = this.names.toTextObject();
    for (const n in t)
      e[n] = t[n];
    return e;
  }
}
B0.NAME = "Subject Alternative Name";
class Rr {
  static register(e, t) {
    this.items.set(e, t);
  }
  static create(e) {
    const t = new jr(e), n = this.items.get(t.type);
    return n ? new n(e) : t;
  }
}
Rr.items = /* @__PURE__ */ new Map();
class O0 extends jr {
  constructor(...e) {
    var t;
    if (W.isBufferSource(e[0])) {
      super(e[0]);
      const n = q.parse(this.value, ea);
      this.policies = n.map((i) => i.policyIdentifier);
    } else {
      const n = e[0], i = (t = e[1]) !== null && t !== void 0 ? t : !1, s = new ea(n.map((o) => new uc({
        policyIdentifier: o
      })));
      super(qp, i, q.serialize(s)), this.policies = n;
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return e.Policy = this.policies.map((t) => new rt("", {}, On.toString(t))), e;
  }
}
O0.NAME = "Certificate Policies";
Rr.register(qp, O0);
class T0 extends jr {
  constructor(...e) {
    var t;
    if (W.isBufferSource(e[0]))
      super(e[0]);
    else if (Array.isArray(e[0]) && typeof e[0][0] == "string") {
      const i = e[0].map((o) => new as({
        distributionPoint: new di({
          fullName: [new De({ uniformResourceIdentifier: o })]
        })
      })), s = new Mi(i);
      super(Sl, e[1], q.serialize(s));
    } else {
      const n = new Mi(e[0]);
      super(Sl, e[1], q.serialize(n));
    }
    (t = this.distributionPoints) !== null && t !== void 0 || (this.distributionPoints = []);
  }
  onInit(e) {
    super.onInit(e);
    const t = q.parse(e.extnValue, Mi);
    this.distributionPoints = t;
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return e["Distribution Point"] = this.distributionPoints.map((t) => {
      var n;
      const i = {};
      return t.distributionPoint && (i[""] = (n = t.distributionPoint.fullName) === null || n === void 0 ? void 0 : n.map((s) => new Mn(s).toString()).join(", ")), t.reasons && (i.Reasons = t.reasons.toString()), t.cRLIssuer && (i["CRL Issuer"] = t.cRLIssuer.map((s) => s.toString()).join(", ")), i;
    }), e;
  }
}
T0.NAME = "CRL Distribution Points";
class N0 extends jr {
  constructor(...e) {
    var t, n, i, s;
    if (W.isBufferSource(e[0]))
      super(e[0]);
    else if (e[0] instanceof Ui) {
      const o = new Ui(e[0]);
      super(ml, e[1], q.serialize(o));
    } else {
      const o = e[0], c = new Ui();
      $o(c, o, rh, "ocsp"), $o(c, o, nh, "caIssuers"), $o(c, o, ih, "timeStamping"), $o(c, o, sh, "caRepository"), super(ml, e[1], q.serialize(c));
    }
    (t = this.ocsp) !== null && t !== void 0 || (this.ocsp = []), (n = this.caIssuers) !== null && n !== void 0 || (this.caIssuers = []), (i = this.timeStamping) !== null && i !== void 0 || (this.timeStamping = []), (s = this.caRepository) !== null && s !== void 0 || (this.caRepository = []);
  }
  onInit(e) {
    super.onInit(e), this.ocsp = [], this.caIssuers = [], this.timeStamping = [], this.caRepository = [], q.parse(e.extnValue, Ui).forEach((n) => {
      switch (n.accessMethod) {
        case rh:
          this.ocsp.push(new Mn(n.accessLocation));
          break;
        case nh:
          this.caIssuers.push(new Mn(n.accessLocation));
          break;
        case ih:
          this.timeStamping.push(new Mn(n.accessLocation));
          break;
        case sh:
          this.caRepository.push(new Mn(n.accessLocation));
          break;
      }
    });
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return this.ocsp.length && Do(e, "OCSP", this.ocsp), this.caIssuers.length && Do(e, "CA Issuers", this.caIssuers), this.timeStamping.length && Do(e, "Time Stamping", this.timeStamping), this.caRepository.length && Do(e, "CA Repository", this.caRepository), e;
  }
}
N0.NAME = "Authority Info Access";
function Do(r, e, t) {
  if (t.length === 1)
    r[e] = t[0].toTextObject();
  else {
    const n = new rt("");
    t.forEach((i, s) => {
      const o = i.toTextObject(), c = `${o[rt.NAME]} ${s + 1}`;
      let u = n[c];
      Array.isArray(u) || (u = [], n[c] = u), u.push(o);
    }), r[e] = n;
  }
}
function $o(r, e, t, n) {
  const i = e[n];
  i && (Array.isArray(i) ? i : [i]).forEach((o) => {
    typeof o == "string" && (o = new Mn("url", o)), r.push(new mo({
      accessMethod: t,
      accessLocation: q.parse(o.rawData, De)
    }));
  });
}
class hs extends Xn {
  constructor(...e) {
    let t;
    if (W.isBufferSource(e[0]))
      t = W.toArrayBuffer(e[0]);
    else {
      const n = e[0], i = Array.isArray(e[1]) ? e[1].map((s) => W.toArrayBuffer(s)) : [];
      t = q.serialize(new _n({ type: n, values: i }));
    }
    super(t, _n);
  }
  onInit(e) {
    this.type = e.type, this.values = e.values;
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return e.Value = this.values.map((t) => new rt("", { "": t })), e;
  }
  toTextObjectWithoutValue() {
    const e = this.toTextObjectEmpty();
    return e[rt.NAME] === hs.NAME && (e[rt.NAME] = On.toString(this.type)), e;
  }
}
hs.NAME = "Attribute";
class P0 extends hs {
  constructor(...e) {
    var t;
    if (W.isBufferSource(e[0]))
      super(e[0]);
    else {
      const n = new Ea({
        printableString: e[0]
      });
      super(b0, [q.serialize(n)]);
    }
    (t = this.password) !== null && t !== void 0 || (this.password = "");
  }
  onInit(e) {
    if (super.onInit(e), this.values[0]) {
      const t = q.parse(this.values[0], Ea);
      this.password = t.toString();
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return e[rt.VALUE] = this.password, e;
  }
}
P0.NAME = "Challenge Password";
class Sf extends hs {
  constructor(...e) {
    var t;
    if (W.isBufferSource(e[0]))
      super(e[0]);
    else {
      const n = e[0], i = new pi();
      for (const s of n)
        i.push(q.parse(s.rawData, Hr));
      super(Af, [q.serialize(i)]);
    }
    (t = this.items) !== null && t !== void 0 || (this.items = []);
  }
  onInit(e) {
    if (super.onInit(e), this.values[0]) {
      const t = q.parse(this.values[0], pi);
      this.items = t.map((n) => Rr.create(q.serialize(n)));
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue(), t = this.items.map((n) => n.toTextObject());
    for (const n of t)
      e[n[rt.NAME]] = n;
    return e;
  }
}
Sf.NAME = "Extensions";
class Rc {
  static register(e, t) {
    this.items.set(e, t);
  }
  static create(e) {
    const t = new hs(e), n = this.items.get(t.type);
    return n ? new n(e) : t;
  }
}
Rc.items = /* @__PURE__ */ new Map();
const Uc = "crypto.signatureFormatter";
class ym {
  toAsnSignature(e, t) {
    return W.toArrayBuffer(t);
  }
  toWebSignature(e, t) {
    return W.toArrayBuffer(t);
  }
}
var zo;
let _u = zo = class {
  static createPssParams(e, t) {
    const n = zo.getHashAlgorithm(e);
    return n ? new bi({
      hashAlgorithm: n,
      maskGenAlgorithm: new ie({
        algorithm: Ec,
        parameters: q.serialize(n)
      }),
      saltLength: t
    }) : null;
  }
  static getHashAlgorithm(e) {
    const t = lr.resolve(Xi);
    return typeof e == "string" ? t.toAsnAlgorithm({ name: e }) : typeof e == "object" && e && "name" in e ? t.toAsnAlgorithm(e) : null;
  }
  toAsnAlgorithm(e) {
    switch (e.name.toLowerCase()) {
      case "rsassa-pkcs1-v1_5":
        if ("hash" in e) {
          let t;
          if (typeof e.hash == "string")
            t = e.hash;
          else if (e.hash && typeof e.hash == "object" && "name" in e.hash && typeof e.hash.name == "string")
            t = e.hash.name.toUpperCase();
          else
            throw new Error("Cannot get hash algorithm name");
          switch (t.toLowerCase()) {
            case "sha-1":
              return new ie({ algorithm: ya, parameters: null });
            case "sha-256":
              return new ie({ algorithm: tu, parameters: null });
            case "sha-384":
              return new ie({ algorithm: ga, parameters: null });
            case "sha-512":
              return new ie({ algorithm: va, parameters: null });
          }
        } else
          return new ie({ algorithm: mi, parameters: null });
        break;
      case "rsa-pss":
        if ("hash" in e) {
          if (!("saltLength" in e && typeof e.saltLength == "number"))
            throw new Error("Cannot get 'saltLength' from 'alg' argument");
          const t = zo.createPssParams(e.hash, e.saltLength);
          if (!t)
            throw new Error("Cannot create PSS parameters");
          return new ie({ algorithm: Rs, parameters: q.serialize(t) });
        } else
          return new ie({ algorithm: Rs, parameters: null });
    }
    return null;
  }
  toWebAlgorithm(e) {
    switch (e.algorithm) {
      case mi:
        return { name: "RSASSA-PKCS1-v1_5" };
      case ya:
        return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-1" } };
      case tu:
        return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } };
      case ga:
        return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-384" } };
      case va:
        return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-512" } };
      case Rs:
        if (e.parameters) {
          const t = q.parse(e.parameters, bi);
          return {
            name: "RSA-PSS",
            hash: lr.resolve(Xi).toWebAlgorithm(t.hashAlgorithm),
            saltLength: t.saltLength
          };
        } else
          return { name: "RSA-PSS" };
    }
    return null;
  }
};
_u = zo = f([
  Bc()
], _u);
lr.registerSingleton(Bo, _u);
let Eu = class {
  toAsnAlgorithm(e) {
    switch (e.name.toLowerCase()) {
      case "sha-1":
        return new ie({ algorithm: ma });
      case "sha-256":
        return new ie({ algorithm: wa });
      case "sha-384":
        return new ie({ algorithm: ba });
      case "sha-512":
        return new ie({ algorithm: xa });
    }
    return null;
  }
  toWebAlgorithm(e) {
    switch (e.algorithm) {
      case ma:
        return { name: "SHA-1" };
      case wa:
        return { name: "SHA-256" };
      case ba:
        return { name: "SHA-384" };
      case xa:
        return { name: "SHA-512" };
    }
    return null;
  }
};
Eu = f([
  Bc()
], Eu);
lr.registerSingleton(Bo, Eu);
class Tr {
  addPadding(e, t) {
    const n = W.toUint8Array(t), i = new Uint8Array(e);
    return i.set(n, e - n.length), i;
  }
  removePadding(e, t = !1) {
    let n = W.toUint8Array(e);
    for (let i = 0; i < n.length; i++)
      if (n[i]) {
        n = n.slice(i);
        break;
      }
    if (t && n[0] > 127) {
      const i = new Uint8Array(n.length + 1);
      return i.set(n, 1), i.buffer;
    }
    return n.buffer;
  }
  toAsnSignature(e, t) {
    if (e.name === "ECDSA") {
      const n = e.namedCurve, i = Tr.namedCurveSize.get(n) || Tr.defaultNamedCurveSize, s = new pa(), o = W.toUint8Array(t);
      return s.r = this.removePadding(o.slice(0, i), !0), s.s = this.removePadding(o.slice(i, i + i), !0), q.serialize(s);
    }
    return null;
  }
  toWebSignature(e, t) {
    if (e.name === "ECDSA") {
      const n = q.parse(t, pa), i = e.namedCurve, s = Tr.namedCurveSize.get(i) || Tr.defaultNamedCurveSize, o = this.addPadding(s, this.removePadding(n.r)), c = this.addPadding(s, this.removePadding(n.s));
      return Cg(o, c);
    }
    return null;
  }
}
Tr.namedCurveSize = /* @__PURE__ */ new Map();
Tr.defaultNamedCurveSize = 32;
const el = "1.3.101.110", xd = "1.3.101.111", tl = "1.3.101.112", Ad = "1.3.101.113";
let Iu = class {
  toAsnAlgorithm(e) {
    let t = null;
    switch (e.name.toLowerCase()) {
      case "ed25519":
        t = tl;
        break;
      case "x25519":
        t = el;
        break;
      case "eddsa":
        switch (e.namedCurve.toLowerCase()) {
          case "ed25519":
            t = tl;
            break;
          case "ed448":
            t = Ad;
            break;
        }
        break;
      case "ecdh-es":
        switch (e.namedCurve.toLowerCase()) {
          case "x25519":
            t = el;
            break;
          case "x448":
            t = xd;
            break;
        }
    }
    return t ? new ie({
      algorithm: t
    }) : null;
  }
  toWebAlgorithm(e) {
    switch (e.algorithm) {
      case tl:
        return { name: "Ed25519" };
      case Ad:
        return { name: "EdDSA", namedCurve: "Ed448" };
      case el:
        return { name: "X25519" };
      case xd:
        return { name: "ECDH-ES", namedCurve: "X448" };
    }
    return null;
  }
};
Iu = f([
  Bc()
], Iu);
lr.registerSingleton(Bo, Iu);
class gm extends Fr {
  constructor(e) {
    Fr.isAsnEncoded(e) ? super(e, Gs) : super(e), this.tag = gr.CertificateRequestTag;
  }
  onInit(e) {
    this.tbs = q.serialize(e.certificationRequestInfo), this.publicKey = new sn(e.certificationRequestInfo.subjectPKInfo);
    const t = lr.resolve(Xi);
    this.signatureAlgorithm = t.toWebAlgorithm(e.signatureAlgorithm), this.signature = e.signature, this.attributes = e.certificationRequestInfo.attributes.map((i) => Rc.create(q.serialize(i)));
    const n = this.getAttribute(Af);
    this.extensions = [], n instanceof Sf && (this.extensions = n.items), this.subjectName = new Fn(e.certificationRequestInfo.subject), this.subject = this.subjectName.toString();
  }
  getAttribute(e) {
    for (const t of this.attributes)
      if (t.type === e)
        return t;
    return null;
  }
  getAttributes(e) {
    return this.attributes.filter((t) => t.type === e);
  }
  getExtension(e) {
    for (const t of this.extensions)
      if (t.type === e)
        return t;
    return null;
  }
  getExtensions(e) {
    return this.extensions.filter((t) => t.type === e);
  }
  async verify(e = Zt.get()) {
    const t = { ...this.publicKey.algorithm, ...this.signatureAlgorithm }, n = await this.publicKey.export(t, ["verify"], e), i = lr.resolveAll(Uc).reverse();
    let s = null;
    for (const c of i)
      if (s = c.toWebSignature(t, this.signature), s)
        break;
    if (!s)
      throw Error("Cannot convert WebCrypto signature value to ASN.1 format");
    return await e.subtle.verify(this.signatureAlgorithm, n, s, this.tbs);
  }
  toTextObject() {
    const e = this.toTextObjectEmpty(), t = q.parse(this.rawData, Gs), n = t.certificationRequestInfo, i = new rt("", {
      Version: `${zi[n.version]} (${n.version})`,
      Subject: this.subject,
      "Subject Public Key Info": this.publicKey
    });
    if (this.attributes.length) {
      const s = new rt("");
      for (const o of this.attributes) {
        const c = o.toTextObject();
        s[c[rt.NAME]] = c;
      }
      i.Attributes = s;
    }
    return e.Data = i, e.Signature = new rt("", {
      Algorithm: Kn.serializeAlgorithm(t.signatureAlgorithm),
      "": t.signature
    }), e;
  }
}
gm.NAME = "PKCS#10 Certificate Request";
class xi extends Fr {
  constructor(e) {
    Fr.isAsnEncoded(e) ? super(e, yi) : super(e), this.tag = gr.CertificateTag;
  }
  onInit(e) {
    const t = e.tbsCertificate;
    this.tbs = q.serialize(t), this.serialNumber = fe.ToHex(t.serialNumber), this.subjectName = new Fn(t.subject), this.subject = new Fn(t.subject).toString(), this.issuerName = new Fn(t.issuer), this.issuer = this.issuerName.toString();
    const n = lr.resolve(Xi);
    this.signatureAlgorithm = n.toWebAlgorithm(e.signatureAlgorithm), this.signature = e.signatureValue;
    const i = t.validity.notBefore.utcTime || t.validity.notBefore.generalTime;
    if (!i)
      throw new Error("Cannot get 'notBefore' value");
    this.notBefore = i;
    const s = t.validity.notAfter.utcTime || t.validity.notAfter.generalTime;
    if (!s)
      throw new Error("Cannot get 'notAfter' value");
    this.notAfter = s, this.extensions = [], t.extensions && (this.extensions = t.extensions.map((o) => Rr.create(q.serialize(o)))), this.publicKey = new sn(t.subjectPublicKeyInfo);
  }
  getExtension(e) {
    for (const t of this.extensions)
      if (typeof e == "string") {
        if (t.type === e)
          return t;
      } else if (t instanceof e)
        return t;
    return null;
  }
  getExtensions(e) {
    return this.extensions.filter((t) => typeof e == "string" ? t.type === e : t instanceof e);
  }
  async verify(e = {}, t = Zt.get()) {
    let n, i;
    const s = e.publicKey;
    try {
      if (!s)
        n = { ...this.publicKey.algorithm, ...this.signatureAlgorithm }, i = await this.publicKey.export(n, ["verify"], t);
      else if ("publicKey" in s)
        n = { ...s.publicKey.algorithm, ...this.signatureAlgorithm }, i = await s.publicKey.export(n, ["verify"], t);
      else if (s instanceof sn)
        n = { ...s.algorithm, ...this.signatureAlgorithm }, i = await s.export(n, ["verify"], t);
      else if (W.isBufferSource(s)) {
        const h = new sn(s);
        n = { ...h.algorithm, ...this.signatureAlgorithm }, i = await h.export(n, ["verify"], t);
      } else
        n = { ...s.algorithm, ...this.signatureAlgorithm }, i = s;
    } catch {
      return !1;
    }
    const o = lr.resolveAll(Uc).reverse();
    let c = null;
    for (const h of o)
      if (c = h.toWebSignature(n, this.signature), c)
        break;
    if (!c)
      throw Error("Cannot convert ASN.1 signature value to WebCrypto format");
    const u = await t.subtle.verify(this.signatureAlgorithm, i, c, this.tbs);
    if (e.signatureOnly)
      return u;
    {
      const m = (e.date || /* @__PURE__ */ new Date()).getTime();
      return u && this.notBefore.getTime() < m && m < this.notAfter.getTime();
    }
  }
  async getThumbprint(...e) {
    let t, n = "SHA-1";
    return e[0] && (e[0].subtle ? t = e[0] : (n = e[0] || n, t = e[1])), t ?? (t = Zt.get()), await t.subtle.digest(n, this.rawData);
  }
  async isSelfSigned(e = Zt.get()) {
    return this.subject === this.issuer && await this.verify({ signatureOnly: !0 }, e);
  }
  toTextObject() {
    const e = this.toTextObjectEmpty(), t = q.parse(this.rawData, yi), n = t.tbsCertificate, i = new rt("", {
      Version: `${zi[n.version]} (${n.version})`,
      "Serial Number": n.serialNumber,
      "Signature Algorithm": Kn.serializeAlgorithm(n.signature),
      Issuer: this.issuer,
      Validity: new rt("", {
        "Not Before": n.validity.notBefore.getTime(),
        "Not After": n.validity.notAfter.getTime()
      }),
      Subject: this.subject,
      "Subject Public Key Info": this.publicKey
    });
    if (n.issuerUniqueID && (i["Issuer Unique ID"] = n.issuerUniqueID), n.subjectUniqueID && (i["Subject Unique ID"] = n.subjectUniqueID), this.extensions.length) {
      const s = new rt("");
      for (const o of this.extensions) {
        const c = o.toTextObject();
        s[c[rt.NAME]] = c;
      }
      i.Extensions = s;
    }
    return e.Data = i, e.Signature = new rt("", {
      Algorithm: Kn.serializeAlgorithm(t.signatureAlgorithm),
      "": t.signatureValue
    }), e;
  }
}
xi.NAME = "Certificate";
class vm extends Array {
  constructor(e) {
    if (super(), Fr.isAsnEncoded(e))
      this.import(e);
    else if (e instanceof xi)
      this.push(e);
    else if (Array.isArray(e))
      for (const t of e)
        this.push(t);
  }
  export(e) {
    const t = new An();
    t.version = 1, t.encapContentInfo.eContentType = Sv, t.encapContentInfo.eContent = new Zi({
      single: new nt()
    }), t.certificates = new Ls(this.map((s) => new gi({
      certificate: q.parse(s.rawData, yi)
    })));
    const n = new xn({
      contentType: Xl,
      content: q.serialize(t)
    }), i = q.serialize(n);
    return e === "raw" ? i : this.toString(e);
  }
  import(e) {
    const t = Fr.toArrayBuffer(e), n = q.parse(t, xn);
    if (n.contentType !== Xl)
      throw new TypeError("Cannot parse CMS package. Incoming data is not a SignedData object.");
    const i = q.parse(n.content, An);
    this.clear();
    for (const s of i.certificates || [])
      s.certificate && this.push(new xi(s.certificate));
  }
  clear() {
    for (; this.pop(); )
      ;
  }
  toString(e = "pem") {
    const t = this.export("raw");
    switch (e) {
      case "pem":
        return gr.encode(t, "CMS");
      case "pem-chain":
        return this.map((n) => n.toString("pem")).join(`
`);
      case "asn":
        return q.toString(t);
      case "hex":
        return fe.ToHex(t);
      case "base64":
        return fe.ToBase64(t);
      case "base64url":
        return fe.ToBase64Url(t);
      case "text":
        return Kn.serialize(this.toTextObject());
      default:
        throw TypeError("Argument 'format' is unsupported value");
    }
  }
  toTextObject() {
    const e = q.parse(this.export("raw"), xn), t = q.parse(e.content, An);
    return new rt("X509Certificates", {
      "Content Type": On.toString(e.contentType),
      Content: new rt("", {
        Version: `${an[t.version]} (${t.version})`,
        Certificates: new rt("", { Certificate: this.map((i) => i.toTextObject()) })
      })
    });
  }
}
class mm {
  constructor(e = {}) {
    this.certificates = [], e.certificates && (this.certificates = e.certificates);
  }
  async build(e, t = Zt.get()) {
    const n = new vm(e);
    let i = e;
    for (; i = await this.findIssuer(i, t); ) {
      const s = await i.getThumbprint(t);
      for (const o of n) {
        const c = await o.getThumbprint(t);
        if (qo(s, c))
          throw new Error("Cannot build a certificate chain. Circular dependency.");
      }
      n.push(i);
    }
    return n;
  }
  async findIssuer(e, t = Zt.get()) {
    if (!await e.isSelfSigned(t)) {
      const n = e.getExtension(Jo);
      for (const i of this.certificates)
        if (i.subject === e.issuer) {
          if (n) {
            if (n.keyId) {
              const s = i.getExtension(nf);
              if (s && s.keyId !== n.keyId)
                continue;
            } else if (n.certId) {
              const s = i.getExtension(rf);
              if (s && !(n.certId.serialNumber === i.serialNumber && qo(q.serialize(n.certId.name), q.serialize(s))))
                continue;
            }
          }
          try {
            const s = { ...i.publicKey.algorithm, ...e.signatureAlgorithm }, o = await i.publicKey.export(s, ["verify"], t);
            if (!await e.verify({ publicKey: o, signatureOnly: !0 }, t))
              continue;
          } catch {
            continue;
          }
          return i;
        }
    }
    return null;
  }
}
var Sd;
(function(r) {
  r[r.unspecified = 0] = "unspecified", r[r.keyCompromise = 1] = "keyCompromise", r[r.cACompromise = 2] = "cACompromise", r[r.affiliationChanged = 3] = "affiliationChanged", r[r.superseded = 4] = "superseded", r[r.cessationOfOperation = 5] = "cessationOfOperation", r[r.certificateHold = 6] = "certificateHold", r[r.removeFromCRL = 8] = "removeFromCRL", r[r.privilegeWithdrawn = 9] = "privilegeWithdrawn", r[r.aACompromise = 10] = "aACompromise";
})(Sd || (Sd = {}));
Rr.register(Kp, I0);
Rr.register(Wp, k0);
Rr.register(Yp, C0);
Rr.register(nf, jc);
Rr.register(Jo, Ws);
Rr.register(rf, B0);
Rr.register(Sl, T0);
Rr.register(ml, N0);
Rc.register(b0, P0);
Rc.register(Af, Sf);
lr.registerSingleton(Uc, ym);
lr.registerSingleton(Uc, Tr);
Tr.namedCurveSize.set("P-256", 32);
Tr.namedCurveSize.set("K-256", 32);
Tr.namedCurveSize.set("P-384", 48);
Tr.namedCurveSize.set("P-521", 66);
const ve = { POS_INT: 0, NEG_INT: 1, BYTE_STRING: 2, UTF8_STRING: 3, ARRAY: 4, MAP: 5, TAG: 6, SIMPLE_FLOAT: 7 }, _t = { DATE_STRING: 0, DATE_EPOCH: 1, POS_BIGINT: 2, NEG_BIGINT: 3, DECIMAL_FRAC: 4, BIGFLOAT: 5, BASE64URL_EXPECTED: 21, BASE64_EXPECTED: 22, BASE16_EXPECTED: 23, CBOR: 24, URI: 32, BASE64URL: 33, BASE64: 34, MIME: 36, SET: 258, JSON: 262, REGEXP: 21066, SELF_DESCRIBED: 55799, INVALID_16: 65535, INVALID_32: 4294967295, INVALID_64: 0xffffffffffffffffn }, wt = { ZERO: 0, ONE: 24, TWO: 25, FOUR: 26, EIGHT: 27, INDEFINITE: 31 }, Vn = { FALSE: 20, TRUE: 21, NULL: 22, UNDEFINED: 23 };
var ks;
let Er = (ks = class {
}, Le(ks, "BREAK", Symbol.for("github.com/hildjj/cbor2/break")), Le(ks, "ENCODED", Symbol.for("github.com/hildjj/cbor2/cbor-encoded")), Le(ks, "LENGTH", Symbol.for("github.com/hildjj/cbor2/length")), ks);
const ka = { MIN: -(2n ** 63n), MAX: 2n ** 64n - 1n };
var mn, Qr;
let Ye = (mn = class {
  constructor(e, t = void 0) {
    Le(this, "tag");
    Le(this, "contents");
    this.tag = e, this.contents = t;
  }
  get noChildren() {
    var e;
    return !!((e = $(mn, Qr).get(this.tag)) != null && e.noChildren);
  }
  static registerDecoder(e, t, n) {
    const i = $(this, Qr).get(e);
    return $(this, Qr).set(e, t), i && ("comment" in t || (t.comment = i.comment), "noChildren" in t || (t.noChildren = i.noChildren)), n && !t.comment && (t.comment = () => `(${n})`), i;
  }
  static clearDecoder(e) {
    const t = $(this, Qr).get(e);
    return $(this, Qr).delete(e), t;
  }
  *[Symbol.iterator]() {
    yield this.contents;
  }
  push(e) {
    return this.contents = e, 1;
  }
  decode(e) {
    const t = $(mn, Qr).get(this.tag);
    return t ? t(this, e) : this;
  }
  comment(e, t) {
    const n = $(mn, Qr).get(this.tag);
    if (n != null && n.comment) return n.comment(this, e, t);
  }
  toCBOR() {
    return [this.tag, this.contents];
  }
  [Symbol.for("nodejs.util.inspect.custom")](e, t, n) {
    return `${this.tag}(${n(this.contents, t)})`;
  }
}, Qr = new WeakMap(), rr(mn, Qr, /* @__PURE__ */ new Map()), mn);
function Ca(r) {
  if (r != null && typeof r == "object") return r[Er.ENCODED];
}
function wm(r) {
  if (r != null && typeof r == "object") return r[Er.LENGTH];
}
function Ys(r, e) {
  Object.defineProperty(r, Er.ENCODED, { configurable: !0, enumerable: !1, value: e });
}
function Cs(r, e) {
  const t = Object(r);
  return Ys(t, e), t;
}
function j0(r) {
  let e = Math.ceil(r.length / 2);
  const t = new Uint8Array(e);
  e--;
  for (let n = r.length, i = n - 2; n >= 0; n = i, i -= 2, e--) t[e] = parseInt(r.substring(i, n), 16);
  return t;
}
function Vr(r) {
  return r.reduce((e, t) => e + t.toString(16).padStart(2, "0"), "");
}
function bm(r) {
  const e = r.reduce((i, s) => i + s.length, 0), t = new Uint8Array(e);
  let n = 0;
  for (const i of r) t.set(i, n), n += i.length;
  return t;
}
function _f(r) {
  const e = atob(r);
  return Uint8Array.from(e, (t) => t.codePointAt(0));
}
const xm = { "-": "+", _: "/" };
function Am(r) {
  const e = r.replace(/[_-]/g, (t) => xm[t]);
  return _f(e.padEnd(Math.ceil(e.length / 4) * 4, "="));
}
function Sm() {
  const r = new Uint8Array(4), e = new Uint32Array(r.buffer);
  return !((e[0] = 1) & r[0]);
}
function _d(r) {
  var t;
  let e = "";
  for (const n of r) {
    const i = (t = n.codePointAt(0)) == null ? void 0 : t.toString(16).padStart(4, "0");
    e && (e += ", "), e += `U+${i}`;
  }
  return e;
}
function R0(r, e) {
  const [t, n, i] = r, [s, o, c] = e, u = Math.min(i.length, c.length);
  for (let h = 0; h < u; h++) {
    const m = i[h] - c[h];
    if (m !== 0) return m;
  }
  return 0;
}
var Un, Kt, pr, Mt, Dn, et, ei, Go, ku, Jr, Xr;
const Ha = class Ha {
  constructor(e = {}) {
    rr(this, et);
    rr(this, Un);
    rr(this, Kt, []);
    rr(this, pr, null);
    rr(this, Mt, 0);
    rr(this, Dn, 0);
    if (It(this, Un, { ...Ha.defaultOptions, ...e }), $(this, Un).chunkSize < 8) throw new RangeError(`Expected size >= 8, got ${$(this, Un).chunkSize}`);
    Ue(this, et, ei).call(this);
  }
  get length() {
    return $(this, Dn);
  }
  read() {
    Ue(this, et, Go).call(this);
    const e = new Uint8Array($(this, Dn));
    let t = 0;
    for (const n of $(this, Kt)) e.set(n, t), t += n.length;
    return Ue(this, et, ei).call(this), e;
  }
  write(e) {
    const t = e.length;
    t > Ue(this, et, ku).call(this) ? (Ue(this, et, Go).call(this), t > $(this, Un).chunkSize ? ($(this, Kt).push(e), Ue(this, et, ei).call(this)) : (Ue(this, et, ei).call(this), $(this, Kt)[$(this, Kt).length - 1].set(e), It(this, Mt, t))) : ($(this, Kt)[$(this, Kt).length - 1].set(e, $(this, Mt)), It(this, Mt, $(this, Mt) + t)), It(this, Dn, $(this, Dn) + t);
  }
  writeUint8(e) {
    Ue(this, et, Jr).call(this, 1), $(this, pr).setUint8($(this, Mt), e), Ue(this, et, Xr).call(this, 1);
  }
  writeUint16(e, t = !1) {
    Ue(this, et, Jr).call(this, 2), $(this, pr).setUint16($(this, Mt), e, t), Ue(this, et, Xr).call(this, 2);
  }
  writeUint32(e, t = !1) {
    Ue(this, et, Jr).call(this, 4), $(this, pr).setUint32($(this, Mt), e, t), Ue(this, et, Xr).call(this, 4);
  }
  writeBigUint64(e, t = !1) {
    Ue(this, et, Jr).call(this, 8), $(this, pr).setBigUint64($(this, Mt), e, t), Ue(this, et, Xr).call(this, 8);
  }
  writeInt16(e, t = !1) {
    Ue(this, et, Jr).call(this, 2), $(this, pr).setInt16($(this, Mt), e, t), Ue(this, et, Xr).call(this, 2);
  }
  writeInt32(e, t = !1) {
    Ue(this, et, Jr).call(this, 4), $(this, pr).setInt32($(this, Mt), e, t), Ue(this, et, Xr).call(this, 4);
  }
  writeBigInt64(e, t = !1) {
    Ue(this, et, Jr).call(this, 8), $(this, pr).setBigInt64($(this, Mt), e, t), Ue(this, et, Xr).call(this, 8);
  }
  writeFloat32(e, t = !1) {
    Ue(this, et, Jr).call(this, 4), $(this, pr).setFloat32($(this, Mt), e, t), Ue(this, et, Xr).call(this, 4);
  }
  writeFloat64(e, t = !1) {
    Ue(this, et, Jr).call(this, 8), $(this, pr).setFloat64($(this, Mt), e, t), Ue(this, et, Xr).call(this, 8);
  }
  clear() {
    It(this, Dn, 0), It(this, Kt, []), Ue(this, et, ei).call(this);
  }
};
Un = new WeakMap(), Kt = new WeakMap(), pr = new WeakMap(), Mt = new WeakMap(), Dn = new WeakMap(), et = new WeakSet(), ei = function() {
  const e = new Uint8Array($(this, Un).chunkSize);
  $(this, Kt).push(e), It(this, Mt, 0), It(this, pr, new DataView(e.buffer, e.byteOffset, e.byteLength));
}, Go = function() {
  if ($(this, Mt) === 0) {
    $(this, Kt).pop();
    return;
  }
  const e = $(this, Kt).length - 1;
  $(this, Kt)[e] = $(this, Kt)[e].subarray(0, $(this, Mt)), It(this, Mt, 0), It(this, pr, null);
}, ku = function() {
  const e = $(this, Kt).length - 1;
  return $(this, Kt)[e].length - $(this, Mt);
}, Jr = function(e) {
  Ue(this, et, ku).call(this) < e && (Ue(this, et, Go).call(this), Ue(this, et, ei).call(this));
}, Xr = function(e) {
  It(this, Mt, $(this, Mt) + e), It(this, Dn, $(this, Dn) + e);
}, Le(Ha, "defaultOptions", { chunkSize: 4096 });
let Ba = Ha;
function U0(r, e = 0, t = !1) {
  const n = r[e] & 128 ? -1 : 1, i = (r[e] & 124) >> 2, s = (r[e] & 3) << 8 | r[e + 1];
  if (i === 0) {
    if (t && s !== 0) throw new Error(`Unwanted subnormal: ${n * 5960464477539063e-23 * s}`);
    return n * 5960464477539063e-23 * s;
  } else if (i === 31) return s ? NaN : n * (1 / 0);
  return n * 2 ** (i - 25) * (1024 + s);
}
function _m(r) {
  const e = new DataView(new ArrayBuffer(4));
  e.setFloat32(0, r, !1);
  const t = e.getUint32(0, !1);
  if (t & 8191) return null;
  let n = t >> 16 & 32768;
  const i = t >> 23 & 255, s = t & 8388607;
  if (!(i === 0 && s === 0)) if (i >= 113 && i <= 142) n += (i - 112 << 10) + (s >> 13);
  else if (i >= 103 && i < 113) {
    if (s & (1 << 126 - i) - 1) return null;
    n += s + 8388608 >> 126 - i;
  } else if (i === 255) n |= 31744, n |= s >> 13;
  else return null;
  return n;
}
function Em(r) {
  if (r !== 0) {
    const e = new ArrayBuffer(8), t = new DataView(e);
    t.setFloat64(0, r, !1);
    const n = t.getBigUint64(0, !1);
    if ((n & 0x7ff0000000000000n) === 0n) return n & 0x8000000000000000n ? -0 : 0;
  }
  return r;
}
function Im(r) {
  switch (r.length) {
    case 2:
      U0(r, 0, !0);
      break;
    case 4: {
      const e = new DataView(r.buffer, r.byteOffset, r.byteLength), t = e.getUint32(0, !1);
      if (!(t & 2139095040) && t & 8388607) throw new Error(`Unwanted subnormal: ${e.getFloat32(0, !1)}`);
      break;
    }
    case 8: {
      const e = new DataView(r.buffer, r.byteOffset, r.byteLength), t = e.getBigUint64(0, !1);
      if ((t & 0x7ff0000000000000n) === 0n && t & 0x000fffffffffffn) throw new Error(`Unwanted subnormal: ${e.getFloat64(0, !1)}`);
      break;
    }
    default:
      throw new TypeError(`Bad input to isSubnormal: ${r}`);
  }
}
const Ed = ve.SIMPLE_FLOAT << 5 | wt.TWO, km = ve.SIMPLE_FLOAT << 5 | wt.FOUR, Cm = ve.SIMPLE_FLOAT << 5 | wt.EIGHT, Bm = ve.SIMPLE_FLOAT << 5 | Vn.TRUE, Om = ve.SIMPLE_FLOAT << 5 | Vn.FALSE, Tm = ve.SIMPLE_FLOAT << 5 | Vn.UNDEFINED, Nm = ve.SIMPLE_FLOAT << 5 | Vn.NULL, Pm = new TextEncoder(), jm = { ...Ba.defaultOptions, avoidInts: !1, cde: !1, collapseBigInts: !0, dcbor: !1, float64: !1, flushToZero: !1, forceEndian: null, ignoreOriginalEncoding: !1, largeNegativeAsBigInt: !1, reduceUnsafeNumbers: !1, rejectBigInts: !1, rejectCustomSimples: !1, rejectDuplicateKeys: !1, rejectFloats: !1, rejectUndefined: !1, simplifyNegativeZero: !1, sortKeys: null, stringNormalization: null }, D0 = { cde: !0, ignoreOriginalEncoding: !0, sortKeys: R0 }, Rm = { ...D0, dcbor: !0, largeNegativeAsBigInt: !0, reduceUnsafeNumbers: !0, rejectCustomSimples: !0, rejectDuplicateKeys: !0, rejectUndefined: !0, simplifyNegativeZero: !0, stringNormalization: "NFC" };
function $0(r) {
  const e = r < 0;
  return typeof r == "bigint" ? [e ? -r - 1n : r, e] : [e ? -r - 1 : r, e];
}
function rl(r, e, t) {
  if (t.rejectFloats) throw new Error(`Attempt to encode an unwanted floating point number: ${r}`);
  if (isNaN(r)) e.writeUint8(Ed), e.writeUint16(32256);
  else if (!t.float64 && Math.fround(r) === r) {
    const n = _m(r);
    n === null ? (e.writeUint8(km), e.writeFloat32(r)) : (e.writeUint8(Ed), e.writeUint16(n));
  } else e.writeUint8(Cm), e.writeFloat64(r);
}
function zr(r, e, t) {
  const [n, i] = $0(r);
  if (i && t) throw new TypeError(`Negative size: ${r}`);
  t ?? (t = i ? ve.NEG_INT : ve.POS_INT), t <<= 5, n < 24 ? e.writeUint8(t | n) : n <= 255 ? (e.writeUint8(t | wt.ONE), e.writeUint8(n)) : n <= 65535 ? (e.writeUint8(t | wt.TWO), e.writeUint16(n)) : n <= 4294967295 ? (e.writeUint8(t | wt.FOUR), e.writeUint32(n)) : (e.writeUint8(t | wt.EIGHT), e.writeBigUint64(BigInt(n)));
}
function Oa(r, e, t) {
  typeof r == "number" ? zr(r, e, ve.TAG) : typeof r == "object" && !t.ignoreOriginalEncoding && Er.ENCODED in r ? e.write(r[Er.ENCODED]) : r <= Number.MAX_SAFE_INTEGER ? zr(Number(r), e, ve.TAG) : (e.writeUint8(ve.TAG << 5 | wt.EIGHT), e.writeBigUint64(BigInt(r)));
}
function M0(r, e, t) {
  const [n, i] = $0(r);
  if (t.collapseBigInts && (!t.largeNegativeAsBigInt || r >= -0x8000000000000000n)) {
    if (n <= 0xffffffffn) {
      zr(Number(r), e);
      return;
    }
    if (n <= 0xffffffffffffffffn) {
      const h = (i ? ve.NEG_INT : ve.POS_INT) << 5;
      e.writeUint8(h | wt.EIGHT), e.writeBigUint64(n);
      return;
    }
  }
  if (t.rejectBigInts) throw new Error(`Attempt to encode unwanted bigint: ${r}`);
  const s = i ? _t.NEG_BIGINT : _t.POS_BIGINT, o = n.toString(16), c = o.length % 2 ? "0" : "";
  Oa(s, e, t);
  const u = j0(c + o);
  zr(u.length, e, ve.BYTE_STRING), e.write(u);
}
function Um(r, e, t) {
  t.flushToZero && (r = Em(r)), Object.is(r, -0) ? t.simplifyNegativeZero ? t.avoidInts ? rl(0, e, t) : zr(0, e) : rl(r, e, t) : !t.avoidInts && Number.isSafeInteger(r) ? zr(r, e) : t.reduceUnsafeNumbers && Math.floor(r) === r && r >= ka.MIN && r <= ka.MAX ? M0(BigInt(r), e, t) : rl(r, e, t);
}
function Dm(r, e, t) {
  const n = t.stringNormalization ? r.normalize(t.stringNormalization) : r, i = Pm.encode(n);
  zr(i.length, e, ve.UTF8_STRING), e.write(i);
}
function $m(r, e, t) {
  const n = r;
  Ef(n, n.length, ve.ARRAY, e, t);
  for (const i of n) si(i, e, t);
}
function Mm(r, e) {
  const t = r;
  zr(t.length, e, ve.BYTE_STRING), e.write(t);
}
const Cu = /* @__PURE__ */ new Map([[Array, $m], [Uint8Array, Mm]]);
function Rt(r, e) {
  const t = Cu.get(r);
  return Cu.set(r, e), t;
}
function Ef(r, e, t, n, i) {
  const s = wm(r);
  s && !i.ignoreOriginalEncoding ? n.write(s) : zr(e, n, t);
}
function Vm(r, e, t) {
  if (r === null) {
    e.writeUint8(Nm);
    return;
  }
  if (!t.ignoreOriginalEncoding && Er.ENCODED in r) {
    e.write(r[Er.ENCODED]);
    return;
  }
  const n = Cu.get(r.constructor);
  if (n) {
    const s = n(r, e, t);
    s && ((typeof s[0] == "bigint" || isFinite(Number(s[0]))) && Oa(s[0], e, t), si(s[1], e, t));
    return;
  }
  if (typeof r.toCBOR == "function") {
    const s = r.toCBOR(e, t);
    s && ((typeof s[0] == "bigint" || isFinite(Number(s[0]))) && Oa(s[0], e, t), si(s[1], e, t));
    return;
  }
  if (typeof r.toJSON == "function") {
    si(r.toJSON(), e, t);
    return;
  }
  const i = Object.entries(r).map((s) => [s[0], s[1], Dc(s[0], t)]);
  t.sortKeys && i.sort(t.sortKeys), Ef(r, i.length, ve.MAP, e, t);
  for (const [s, o, c] of i) e.write(c), si(o, e, t);
}
function si(r, e, t) {
  switch (typeof r) {
    case "number":
      Um(r, e, t);
      break;
    case "bigint":
      M0(r, e, t);
      break;
    case "string":
      Dm(r, e, t);
      break;
    case "boolean":
      e.writeUint8(r ? Bm : Om);
      break;
    case "undefined":
      if (t.rejectUndefined) throw new Error("Attempt to encode unwanted undefined.");
      e.writeUint8(Tm);
      break;
    case "object":
      Vm(r, e, t);
      break;
    case "symbol":
      throw new TypeError(`Unknown symbol: ${r.toString()}`);
    default:
      throw new TypeError(`Unknown type: ${typeof r}, ${String(r)}`);
  }
}
function Dc(r, e = {}) {
  const t = { ...jm };
  e.dcbor ? Object.assign(t, Rm) : e.cde && Object.assign(t, D0), Object.assign(t, e);
  const n = new Ba(t);
  return si(r, n, t), n.read();
}
var V0 = ((r) => (r[r.NEVER = -1] = "NEVER", r[r.PREFERRED = 0] = "PREFERRED", r[r.ALWAYS = 1] = "ALWAYS", r))(V0 || {});
const Nn = class Nn {
  constructor(e) {
    Le(this, "value");
    this.value = e;
  }
  static create(e) {
    return Nn.KnownSimple.has(e) ? Nn.KnownSimple.get(e) : new Nn(e);
  }
  toCBOR(e, t) {
    if (t.rejectCustomSimples) throw new Error(`Cannot encode non-standard Simple value: ${this.value}`);
    zr(this.value, e, ve.SIMPLE_FLOAT);
  }
  toString() {
    return `simple(${this.value})`;
  }
  decode() {
    return Nn.KnownSimple.has(this.value) ? Nn.KnownSimple.get(this.value) : this;
  }
  [Symbol.for("nodejs.util.inspect.custom")](e, t, n) {
    return `simple(${n(this.value, t)})`;
  }
};
Le(Nn, "KnownSimple", /* @__PURE__ */ new Map([[Vn.FALSE, !1], [Vn.TRUE, !0], [Vn.NULL, null], [Vn.UNDEFINED, void 0]]));
let Js = Nn;
const Lm = new TextDecoder("utf8", { fatal: !0, ignoreBOM: !0 });
var Ar, $r, qt, kr, Wt, ti, Bu, Bs;
const Fa = class Fa {
  constructor(e, t) {
    rr(this, Wt);
    rr(this, Ar);
    rr(this, $r);
    rr(this, qt, 0);
    rr(this, kr);
    if (It(this, kr, { ...Fa.defaultOptions, ...t }), typeof e == "string") switch ($(this, kr).encoding) {
      case "hex":
        It(this, Ar, j0(e));
        break;
      case "base64":
        It(this, Ar, _f(e));
        break;
      default:
        throw new TypeError(`Encoding not implemented: "${$(this, kr).encoding}"`);
    }
    else It(this, Ar, e);
    It(this, $r, new DataView($(this, Ar).buffer, $(this, Ar).byteOffset, $(this, Ar).byteLength));
  }
  toHere(e) {
    return $(this, Ar).subarray(e, $(this, qt));
  }
  *[Symbol.iterator]() {
    if (yield* Ue(this, Wt, ti).call(this, 0), $(this, qt) !== $(this, Ar).length) throw new Error("Extra data in input");
  }
};
Ar = new WeakMap(), $r = new WeakMap(), qt = new WeakMap(), kr = new WeakMap(), Wt = new WeakSet(), ti = function* (e) {
  if (e++ > $(this, kr).maxDepth) throw new Error(`Maximum depth ${$(this, kr).maxDepth} exceeded`);
  const t = $(this, qt), n = $(this, $r).getUint8(Ff(this, qt)._++), i = n >> 5, s = n & 31;
  let o = s, c = !1, u = 0;
  switch (s) {
    case wt.ONE:
      if (u = 1, o = $(this, $r).getUint8($(this, qt)), i === ve.SIMPLE_FLOAT) {
        if (o < 32) throw new Error(`Invalid simple encoding in extra byte: ${o}`);
        c = !0;
      } else if ($(this, kr).requirePreferred && o < 24) throw new Error(`Unexpectedly long integer encoding (1) for ${o}`);
      break;
    case wt.TWO:
      if (u = 2, i === ve.SIMPLE_FLOAT) o = U0($(this, Ar), $(this, qt));
      else if (o = $(this, $r).getUint16($(this, qt), !1), $(this, kr).requirePreferred && o <= 255) throw new Error(`Unexpectedly long integer encoding (2) for ${o}`);
      break;
    case wt.FOUR:
      if (u = 4, i === ve.SIMPLE_FLOAT) o = $(this, $r).getFloat32($(this, qt), !1);
      else if (o = $(this, $r).getUint32($(this, qt), !1), $(this, kr).requirePreferred && o <= 65535) throw new Error(`Unexpectedly long integer encoding (4) for ${o}`);
      break;
    case wt.EIGHT: {
      if (u = 8, i === ve.SIMPLE_FLOAT) o = $(this, $r).getFloat64($(this, qt), !1);
      else if (o = $(this, $r).getBigUint64($(this, qt), !1), o <= Number.MAX_SAFE_INTEGER && (o = Number(o)), $(this, kr).requirePreferred && o <= 4294967295) throw new Error(`Unexpectedly long integer encoding (8) for ${o}`);
      break;
    }
    case 28:
    case 29:
    case 30:
      throw new Error(`Additional info not implemented: ${s}`);
    case wt.INDEFINITE:
      switch (i) {
        case ve.POS_INT:
        case ve.NEG_INT:
        case ve.TAG:
          throw new Error(`Invalid indefinite encoding for MT ${i}`);
        case ve.SIMPLE_FLOAT:
          yield [i, s, Er.BREAK, t, 0];
          return;
      }
      o = 1 / 0;
      break;
    default:
      c = !0;
  }
  switch (It(this, qt, $(this, qt) + u), i) {
    case ve.POS_INT:
      yield [i, s, o, t, u];
      break;
    case ve.NEG_INT:
      yield [i, s, typeof o == "bigint" ? -1n - o : -1 - Number(o), t, u];
      break;
    case ve.BYTE_STRING:
      o === 1 / 0 ? yield* Ue(this, Wt, Bs).call(this, i, e, t) : yield [i, s, Ue(this, Wt, Bu).call(this, o), t, o];
      break;
    case ve.UTF8_STRING:
      o === 1 / 0 ? yield* Ue(this, Wt, Bs).call(this, i, e, t) : yield [i, s, Lm.decode(Ue(this, Wt, Bu).call(this, o)), t, o];
      break;
    case ve.ARRAY:
      if (o === 1 / 0) yield* Ue(this, Wt, Bs).call(this, i, e, t, !1);
      else {
        const h = Number(o);
        yield [i, s, h, t, u];
        for (let m = 0; m < h; m++) yield* Ue(this, Wt, ti).call(this, e + 1);
      }
      break;
    case ve.MAP:
      if (o === 1 / 0) yield* Ue(this, Wt, Bs).call(this, i, e, t, !1);
      else {
        const h = Number(o);
        yield [i, s, h, t, u];
        for (let m = 0; m < h; m++) yield* Ue(this, Wt, ti).call(this, e), yield* Ue(this, Wt, ti).call(this, e);
      }
      break;
    case ve.TAG:
      yield [i, s, o, t, u], yield* Ue(this, Wt, ti).call(this, e);
      break;
    case ve.SIMPLE_FLOAT: {
      const h = o;
      c && (o = Js.create(Number(o))), yield [i, s, o, t, h];
      break;
    }
  }
}, Bu = function(e) {
  const t = $(this, Ar).subarray($(this, qt), It(this, qt, $(this, qt) + e));
  if (t.length !== e) throw new Error(`Unexpected end of stream reading ${e} bytes, got ${t.length}`);
  return t;
}, Bs = function* (e, t, n, i = !0) {
  for (yield [e, wt.INDEFINITE, 1 / 0, n, 1 / 0]; ; ) {
    const s = Ue(this, Wt, ti).call(this, t), o = s.next(), [c, u, h] = o.value;
    if (h === Er.BREAK) {
      yield o.value, s.next();
      return;
    }
    if (i) {
      if (c !== e) throw new Error(`Unmatched major type.  Expected ${e}, got ${c}.`);
      if (u === wt.INDEFINITE) throw new Error("New stream started in typed stream");
    }
    yield o.value, yield* s;
  }
}, Le(Fa, "defaultOptions", { maxDepth: 1024, encoding: "hex", requirePreferred: !1 });
let Xs = Fa;
const Hm = /* @__PURE__ */ new Map([[wt.ZERO, 1], [wt.ONE, 2], [wt.TWO, 3], [wt.FOUR, 5], [wt.EIGHT, 9]]), Fm = new Uint8Array(0);
var tn, ar, en, za, L0;
let Pn = (tn = class {
  constructor(e, t, n, i) {
    rr(this, za);
    Le(this, "parent");
    Le(this, "mt");
    Le(this, "ai");
    Le(this, "left");
    Le(this, "offset");
    Le(this, "count", 0);
    Le(this, "children", []);
    Le(this, "depth", 0);
    rr(this, ar);
    rr(this, en, null);
    if ([this.mt, this.ai, , this.offset] = e, this.left = t, this.parent = n, It(this, ar, i), n && (this.depth = n.depth + 1), this.mt === ve.MAP && ($(this, ar).sortKeys || $(this, ar).rejectDuplicateKeys) && It(this, en, []), $(this, ar).rejectStreaming && this.ai === wt.INDEFINITE) throw new Error("Streaming not supported");
  }
  get isStreaming() {
    return this.left === 1 / 0;
  }
  get done() {
    return this.left === 0;
  }
  static create(e, t, n, i) {
    const [s, o, c, u] = e;
    switch (s) {
      case ve.POS_INT:
      case ve.NEG_INT: {
        if (n.rejectInts) throw new Error(`Unexpected integer: ${c}`);
        if (n.rejectLargeNegatives && c < -0x8000000000000000n) throw new Error(`Invalid 65bit negative number: ${c}`);
        let h = c;
        return n.convertUnsafeIntsToFloat && h >= ka.MIN && h <= ka.MAX && (h = Number(c)), n.boxed ? Cs(h, i.toHere(u)) : h;
      }
      case ve.SIMPLE_FLOAT:
        if (o > wt.ONE) {
          if (n.rejectFloats) throw new Error(`Decoding unwanted floating point number: ${c}`);
          if (n.rejectNegativeZero && Object.is(c, -0)) throw new Error("Decoding negative zero");
          if (n.rejectLongLoundNaN && isNaN(c)) {
            const h = i.toHere(u);
            if (h.length !== 3 || h[1] !== 126 || h[2] !== 0) throw new Error(`Invalid NaN encoding: "${Vr(h)}"`);
          }
          if (n.rejectSubnormals && Im(i.toHere(u + 1)), n.rejectLongFloats) {
            const h = Dc(c, { chunkSize: 9, reduceUnsafeNumbers: n.rejectUnsafeFloatInts });
            if (h[0] >> 5 !== s) throw new Error(`Should have been encoded as int, not float: ${c}`);
            if (h.length < Hm.get(o)) throw new Error(`Number should have been encoded shorter: ${c}`);
          }
          if (typeof c == "number" && n.boxed) return Cs(c, i.toHere(u));
        } else {
          if (n.rejectSimple && c instanceof Js) throw new Error(`Invalid simple value: ${c}`);
          if (n.rejectUndefined && c === void 0) throw new Error("Unexpected undefined");
        }
        return c;
      case ve.BYTE_STRING:
      case ve.UTF8_STRING:
        if (c === 1 / 0) return new n.ParentType(e, 1 / 0, t, n);
        if (n.rejectStringsNotNormalizedAs && typeof c == "string") {
          const h = c.normalize(n.rejectStringsNotNormalizedAs);
          if (c !== h) throw new Error(`String not normalized as "${n.rejectStringsNotNormalizedAs}", got [${_d(c)}] instead of [${_d(h)}]`);
        }
        return n.boxed ? Cs(c, i.toHere(u)) : c;
      case ve.ARRAY:
        return new n.ParentType(e, c, t, n);
      case ve.MAP:
        return new n.ParentType(e, c * 2, t, n);
      case ve.TAG: {
        const h = new n.ParentType(e, 1, t, n);
        return h.children = new Ye(c), h;
      }
    }
    throw new TypeError(`Invalid major type: ${s}`);
  }
  push(e, t, n) {
    if (this.children.push(e), $(this, en)) {
      const i = Ca(e) || t.toHere(n);
      $(this, en).push(i);
    }
    return --this.left;
  }
  replaceLast(e, t, n) {
    let i, s = -1 / 0;
    if (this.children instanceof Ye ? (s = 0, i = this.children.contents, this.children.contents = e) : (s = this.children.length - 1, i = this.children[s], this.children[s] = e), $(this, en)) {
      const o = Ca(e) || n.toHere(t.offset);
      $(this, en)[s] = o;
    }
    return i;
  }
  convert(e) {
    let t;
    switch (this.mt) {
      case ve.ARRAY:
        t = this.children;
        break;
      case ve.MAP: {
        const n = Ue(this, za, L0).call(this);
        if ($(this, ar).sortKeys) {
          let i;
          for (const s of n) {
            if (i && $(this, ar).sortKeys(i, s) >= 0) throw new Error(`Duplicate or out of order key: "0x${s[2]}"`);
            i = s;
          }
        } else if ($(this, ar).rejectDuplicateKeys) {
          const i = /* @__PURE__ */ new Set();
          for (const [s, o, c] of n) {
            const u = Vr(c);
            if (i.has(u)) throw new Error(`Duplicate key: "0x${u}"`);
            i.add(u);
          }
        }
        t = !$(this, ar).boxed && !$(this, ar).preferMap && n.every(([i]) => typeof i == "string") ? Object.fromEntries(n) : new Map(n);
        break;
      }
      case ve.BYTE_STRING:
        return bm(this.children);
      case ve.UTF8_STRING: {
        const n = this.children.join("");
        t = $(this, ar).boxed ? Cs(n, e.toHere(this.offset)) : n;
        break;
      }
      case ve.TAG:
        t = this.children.decode($(this, ar));
        break;
      default:
        throw new TypeError(`Invalid mt on convert: ${this.mt}`);
    }
    return $(this, ar).saveOriginal && t && typeof t == "object" && Ys(t, e.toHere(this.offset)), t;
  }
}, ar = new WeakMap(), en = new WeakMap(), za = new WeakSet(), L0 = function() {
  const e = this.children, t = e.length;
  if (t % 2) throw new Error("Missing map value");
  const n = new Array(t / 2);
  if ($(this, en)) for (let i = 0; i < t; i += 2) n[i >> 1] = [e[i], e[i + 1], $(this, en)[i]];
  else for (let i = 0; i < t; i += 2) n[i >> 1] = [e[i], e[i + 1], Fm];
  return n;
}, Le(tn, "defaultDecodeOptions", { ...Xs.defaultOptions, ParentType: tn, boxed: !1, cde: !1, dcbor: !1, diagnosticSizes: V0.PREFERRED, convertUnsafeIntsToFloat: !1, pretty: !1, preferMap: !1, rejectLargeNegatives: !1, rejectBigInts: !1, rejectDuplicateKeys: !1, rejectFloats: !1, rejectInts: !1, rejectLongLoundNaN: !1, rejectLongFloats: !1, rejectNegativeZero: !1, rejectSimple: !1, rejectStreaming: !1, rejectStringsNotNormalizedAs: null, rejectSubnormals: !1, rejectUndefined: !1, rejectUnsafeFloatInts: !1, saveOriginal: !1, sortKeys: null }), Le(tn, "cdeDecodeOptions", { cde: !0, rejectStreaming: !0, requirePreferred: !0, sortKeys: R0 }), Le(tn, "dcborDecodeOptions", { ...tn.cdeDecodeOptions, dcbor: !0, convertUnsafeIntsToFloat: !0, rejectDuplicateKeys: !0, rejectLargeNegatives: !0, rejectLongLoundNaN: !0, rejectLongFloats: !0, rejectNegativeZero: !0, rejectSimple: !0, rejectUndefined: !0, rejectUnsafeFloatInts: !0, rejectStringsNotNormalizedAs: "NFC" }), tn);
var Rd, Ud;
class Ou extends (Ud = Pn, Rd = Er.ENCODED, Ud) {
  constructor(t, n, i, s) {
    super(t, n, i, s);
    Le(this, "depth", 0);
    Le(this, "leaf", !1);
    Le(this, "value");
    Le(this, "length");
    Le(this, Rd);
    this.parent ? this.depth = this.parent.depth + 1 : this.depth = s.initialDepth, [, , this.value, , this.length] = t;
  }
  numBytes() {
    switch (this.ai) {
      case wt.ONE:
        return 1;
      case wt.TWO:
        return 2;
      case wt.FOUR:
        return 4;
      case wt.EIGHT:
        return 8;
    }
    return 0;
  }
}
function H0(r) {
  return r instanceof Ou;
}
function Mo(r, e) {
  return r === 1 / 0 ? "Indefinite" : e ? `${r} ${e}${r !== 1 && r !== 1n ? "s" : ""}` : String(r);
}
function nl(r) {
  return "".padStart(r, " ");
}
function F0(r, e, t) {
  let n = "";
  n += nl(r.depth * 2);
  const i = Ca(r);
  n += Vr(i.subarray(0, 1));
  const s = r.numBytes();
  s && (n += " ", n += Vr(i.subarray(1, s + 1))), n = n.padEnd(e.minCol + 1, " "), n += "-- ", t !== void 0 && (n += nl(r.depth * 2), t !== "" && (n += `[${t}] `));
  let o = !1;
  const [c] = r.children;
  switch (r.mt) {
    case ve.POS_INT:
      n += `Unsigned: ${c}`, typeof c == "bigint" && (n += "n");
      break;
    case ve.NEG_INT:
      n += `Negative: ${c}`, typeof c == "bigint" && (n += "n");
      break;
    case ve.BYTE_STRING:
      n += `Bytes (Length: ${Mo(r.length)})`;
      break;
    case ve.UTF8_STRING:
      n += `UTF8 (Length: ${Mo(r.length)})`, r.length !== 1 / 0 && (n += `: ${JSON.stringify(c)}`);
      break;
    case ve.ARRAY:
      n += `Array (Length: ${Mo(r.value, "item")})`;
      break;
    case ve.MAP:
      n += `Map (Length: ${Mo(r.value, "pair")})`;
      break;
    case ve.TAG: {
      n += `Tag #${r.value}`;
      const u = r.children, [h] = u.contents.children, m = new Ye(u.tag, h);
      Ys(m, i);
      const x = m.comment(e, r.depth);
      x && (n += ": ", n += x), o || (o = m.noChildren);
      break;
    }
    case ve.SIMPLE_FLOAT:
      c === Er.BREAK ? n += "BREAK" : r.ai > wt.ONE ? Object.is(c, -0) ? n += "Float: -0" : n += `Float: ${c}` : (n += "Simple: ", c instanceof Js ? n += c.value : n += c);
      break;
  }
  if (!o) if (r.leaf) {
    if (n += `
`, i.length > s + 1) {
      const u = nl((r.depth + 1) * 2);
      for (let h = s + 1; h < i.length; h += 8) n += u, n += Vr(i.subarray(h, h + 8)), n += `
`;
    }
  } else {
    n += `
`;
    let u = 0;
    for (const h of r.children) {
      if (H0(h)) {
        let m = String(u);
        r.mt === ve.MAP ? m = u % 2 ? `val ${(u - 1) / 2}` : `key ${u / 2}` : r.mt === ve.TAG && (m = ""), n += F0(h, e, m);
      }
      u++;
    }
  }
  return n;
}
const zm = { ...Pn.defaultDecodeOptions, initialDepth: 0, noPrefixHex: !1, minCol: 0 };
function Gm(r, e) {
  const t = { ...zm, ...e, ParentType: Ou, saveOriginal: !0 }, n = new Xs(r, t);
  let i, s;
  for (const c of n) {
    if (s = Pn.create(c, i, t, n), c[2] === Er.BREAK) if (i != null && i.isStreaming) i.left = 1;
    else throw new Error("Unexpected BREAK");
    if (!H0(s)) {
      const m = new Ou(c, 0, i, t);
      m.leaf = !0, m.children.push(s), Ys(m, n.toHere(c[3])), s = m;
    }
    let u = (s.depth + 1) * 2;
    const h = s.numBytes();
    for (h && (u += 1, u += h * 2), t.minCol = Math.max(t.minCol, u), i && i.push(s, n, c[3]), i = s; i != null && i.done; ) s = i, s.leaf || Ys(s, n.toHere(s.offset)), { parent: i } = i;
  }
  e && (e.minCol = t.minCol);
  let o = t.noPrefixHex ? "" : `0x${Vr(n.toHere(0))}
`;
  return o += F0(s, t), o;
}
const Id = !Sm();
function z0(r) {
  if (typeof r == "object" && r) {
    if (r.constructor !== Number) throw new Error(`Expected number: ${r}`);
  } else if (typeof r != "number") throw new Error(`Expected number: ${r}`);
}
function jn(r) {
  if (typeof r == "object" && r) {
    if (r.constructor !== String) throw new Error(`Expected string: ${r}`);
  } else if (typeof r != "string") throw new Error(`Expected string: ${r}`);
}
function Ai(r) {
  if (!(r instanceof Uint8Array)) throw new Error(`Expected Uint8Array: ${r}`);
}
function G0(r) {
  if (!Array.isArray(r)) throw new Error(`Expected Array: ${r}`);
}
Rt(Map, (r, e, t) => {
  const n = [...r.entries()].map((i) => [i[0], i[1], Dc(i[0], t)]);
  if (t.rejectDuplicateKeys) {
    const i = /* @__PURE__ */ new Set();
    for (const [s, o, c] of n) {
      const u = Vr(c);
      if (i.has(u)) throw new Error(`Duplicate map key: 0x${u}`);
      i.add(u);
    }
  }
  t.sortKeys && n.sort(t.sortKeys), Ef(r, r.size, ve.MAP, e, t);
  for (const [i, s, o] of n) e.write(o), si(s, e, t);
});
function kd(r) {
  return jn(r.contents), new Date(r.contents);
}
kd.comment = (r) => (jn(r.contents), `(String Date) ${new Date(r.contents).toISOString()}`), Ye.registerDecoder(_t.DATE_STRING, kd);
function Cd(r) {
  return z0(r.contents), new Date(r.contents * 1e3);
}
Cd.comment = (r) => (z0(r.contents), `(Epoch Date) ${new Date(r.contents * 1e3).toISOString()}`), Ye.registerDecoder(_t.DATE_EPOCH, Cd), Rt(Date, (r) => [_t.DATE_EPOCH, r.valueOf() / 1e3]);
function Ta(r, e, t) {
  if (Ai(e.contents), t.rejectBigInts) throw new Error(`Decoding unwanted big integer: ${e}(h'${Vr(e.contents)}')`);
  if (t.requirePreferred && e.contents[0] === 0) throw new Error(`Decoding overly-large bigint: ${e.tag}(h'${Vr(e.contents)})`);
  let n = e.contents.reduce((i, s) => i << 8n | BigInt(s), 0n);
  if (r && (n = -1n - n), t.requirePreferred && n >= Number.MIN_SAFE_INTEGER && n <= Number.MAX_SAFE_INTEGER) throw new Error(`Decoding bigint that could have been int: ${n}n`);
  return t.boxed ? Cs(n, e.contents) : n;
}
const Bd = Ta.bind(null, !1), Od = Ta.bind(null, !0);
Bd.comment = (r, e) => `(Positive BigInt) ${Ta(!1, r, e)}n`, Od.comment = (r, e) => `(Negative BigInt) ${Ta(!0, r, e)}n`, Ye.registerDecoder(_t.POS_BIGINT, Bd), Ye.registerDecoder(_t.NEG_BIGINT, Od);
function il(r, e) {
  return Ai(r.contents), r;
}
il.comment = (r, e, t) => {
  Ai(r.contents);
  const n = { ...e, initialDepth: t + 2, noPrefixHex: !0 }, i = Ca(r);
  let s = 2 ** ((i[0] & 31) - 24) + 1;
  const o = i[s] & 31;
  let c = Vr(i.subarray(s, ++s));
  o >= 24 && (c += " ", c += Vr(i.subarray(s, s + 2 ** (o - 24)))), n.minCol = Math.max(n.minCol, (t + 1) * 2 + c.length);
  const u = Gm(r.contents, n);
  let h = `Embedded CBOR
`;
  return h += `${"".padStart((t + 1) * 2, " ")}${c}`.padEnd(n.minCol + 1, " "), h += `-- Bytes (Length: ${r.contents.length})
`, h += u, h;
}, il.noChildren = !0, Ye.registerDecoder(_t.CBOR, il), Ye.registerDecoder(_t.URI, (r) => (jn(r.contents), new URL(r.contents)), "URI"), Rt(URL, (r) => [_t.URI, r.toString()]), Ye.registerDecoder(_t.BASE64URL, (r) => (jn(r.contents), Am(r.contents)), "Base64url-encoded"), Ye.registerDecoder(_t.BASE64, (r) => (jn(r.contents), _f(r.contents)), "Base64-encoded"), Ye.registerDecoder(35, (r) => (jn(r.contents), new RegExp(r.contents)), "RegExp"), Ye.registerDecoder(21065, (r) => {
  jn(r.contents);
  let e = r.contents.replace(new RegExp("(?<!\\\\)(?<!\\[(?:[^\\]]|\\\\\\])*)\\.", "g"), `[^
\r]`);
  return e = `^(?:${e})$`, new RegExp(e, "u");
}, "I-RegExp"), Ye.registerDecoder(_t.REGEXP, (r) => {
  if (G0(r.contents), r.contents.length < 1 || r.contents.length > 2) throw new Error(`Invalid RegExp Array: ${r.contents}`);
  return new RegExp(r.contents[0], r.contents[1]);
}, "RegExp"), Rt(RegExp, (r) => [_t.REGEXP, [r.source, r.flags]]), Ye.registerDecoder(64, (r) => (Ai(r.contents), r.contents), "uint8 Typed Array");
function nr(r, e, t) {
  Ai(r.contents);
  let n = r.contents.length;
  if (n % e.BYTES_PER_ELEMENT !== 0) throw new Error(`Number of bytes must be divisible by ${e.BYTES_PER_ELEMENT}, got: ${n}`);
  n /= e.BYTES_PER_ELEMENT;
  const i = new e(n), s = new DataView(r.contents.buffer, r.contents.byteOffset, r.contents.byteLength), o = s[`get${e.name.replace(/Array/, "")}`].bind(s);
  for (let c = 0; c < n; c++) i[c] = o(c * e.BYTES_PER_ELEMENT, t);
  return i;
}
function Tn(r, e, t, n, i) {
  const s = i.forceEndian ?? Id;
  if (Oa(s ? e : t, r, i), zr(n.byteLength, r, ve.BYTE_STRING), Id === s) r.write(new Uint8Array(n.buffer, n.byteOffset, n.byteLength));
  else {
    const o = `write${n.constructor.name.replace(/Array/, "")}`, c = r[o].bind(r);
    for (const u of n) c(u, s);
  }
}
Ye.registerDecoder(65, (r) => nr(r, Uint16Array, !1), "uint16, big endian, Typed Array"), Ye.registerDecoder(66, (r) => nr(r, Uint32Array, !1), "uint32, big endian, Typed Array"), Ye.registerDecoder(67, (r) => nr(r, BigUint64Array, !1), "uint64, big endian, Typed Array"), Ye.registerDecoder(68, (r) => (Ai(r.contents), new Uint8ClampedArray(r.contents)), "uint8 Typed Array, clamped arithmetic"), Rt(Uint8ClampedArray, (r) => [68, new Uint8Array(r.buffer, r.byteOffset, r.byteLength)]), Ye.registerDecoder(69, (r) => nr(r, Uint16Array, !0), "uint16, little endian, Typed Array"), Rt(Uint16Array, (r, e, t) => Tn(e, 69, 65, r, t)), Ye.registerDecoder(70, (r) => nr(r, Uint32Array, !0), "uint32, little endian, Typed Array"), Rt(Uint32Array, (r, e, t) => Tn(e, 70, 66, r, t)), Ye.registerDecoder(71, (r) => nr(r, BigUint64Array, !0), "uint64, little endian, Typed Array"), Rt(BigUint64Array, (r, e, t) => Tn(e, 71, 67, r, t)), Ye.registerDecoder(72, (r) => (Ai(r.contents), new Int8Array(r.contents)), "sint8 Typed Array"), Rt(Int8Array, (r) => [72, new Uint8Array(r.buffer, r.byteOffset, r.byteLength)]), Ye.registerDecoder(73, (r) => nr(r, Int16Array, !1), "sint16, big endian, Typed Array"), Ye.registerDecoder(74, (r) => nr(r, Int32Array, !1), "sint32, big endian, Typed Array"), Ye.registerDecoder(75, (r) => nr(r, BigInt64Array, !1), "sint64, big endian, Typed Array"), Ye.registerDecoder(77, (r) => nr(r, Int16Array, !0), "sint16, little endian, Typed Array"), Rt(Int16Array, (r, e, t) => Tn(e, 77, 73, r, t)), Ye.registerDecoder(78, (r) => nr(r, Int32Array, !0), "sint32, little endian, Typed Array"), Rt(Int32Array, (r, e, t) => Tn(e, 78, 74, r, t)), Ye.registerDecoder(79, (r) => nr(r, BigInt64Array, !0), "sint64, little endian, Typed Array"), Rt(BigInt64Array, (r, e, t) => Tn(e, 79, 75, r, t)), Ye.registerDecoder(81, (r) => nr(r, Float32Array, !1), "IEEE 754 binary32, big endian, Typed Array"), Ye.registerDecoder(82, (r) => nr(r, Float64Array, !1), "IEEE 754 binary64, big endian, Typed Array"), Ye.registerDecoder(85, (r) => nr(r, Float32Array, !0), "IEEE 754 binary32, little endian, Typed Array"), Rt(Float32Array, (r, e, t) => Tn(e, 85, 81, r, t)), Ye.registerDecoder(86, (r) => nr(r, Float64Array, !0), "IEEE 754 binary64, big endian, Typed Array"), Rt(Float64Array, (r, e, t) => Tn(e, 86, 82, r, t)), Ye.registerDecoder(_t.SET, (r) => (G0(r.contents), new Set(r.contents)), "Set"), Rt(Set, (r) => [_t.SET, [...r]]), Ye.registerDecoder(_t.JSON, (r) => (jn(r.contents), JSON.parse(r.contents)), "JSON-encoded"), Ye.registerDecoder(_t.SELF_DESCRIBED, (r) => r.contents, "Self-Described"), Ye.registerDecoder(_t.INVALID_16, () => {
  throw new Error(`Tag always invalid: ${_t.INVALID_16}`);
}, "Invalid"), Ye.registerDecoder(_t.INVALID_32, () => {
  throw new Error(`Tag always invalid: ${_t.INVALID_32}`);
}, "Invalid"), Ye.registerDecoder(_t.INVALID_64, () => {
  throw new Error(`Tag always invalid: ${_t.INVALID_64}`);
}, "Invalid");
function sl(r) {
  throw new Error(`Encoding ${r.constructor.name} intentionally unimplmented.  It is not concrete enough to interoperate.  Convert to Uint8Array first.`);
}
Rt(ArrayBuffer, sl), Rt(DataView, sl), typeof SharedArrayBuffer < "u" && Rt(SharedArrayBuffer, sl);
function Vo(r) {
  return [NaN, r.valueOf()];
}
Rt(Boolean, Vo), Rt(Number, Vo), Rt(String, Vo), Rt(BigInt, Vo);
function Na(r, e = {}) {
  const t = { ...Pn.defaultDecodeOptions };
  if (e.dcbor ? Object.assign(t, Pn.dcborDecodeOptions) : e.cde && Object.assign(t, Pn.cdeDecodeOptions), Object.assign(t, e), Object.hasOwn(t, "rejectLongNumbers")) throw new TypeError("rejectLongNumbers has changed to requirePreferred");
  t.boxed && (t.saveOriginal = !0);
  const n = new Xs(r, t);
  let i, s;
  for (const o of n) {
    if (s = Pn.create(o, i, t, n), o[2] === Er.BREAK) if (i != null && i.isStreaming) i.left = 0;
    else throw new Error("Unexpected BREAK");
    else i && i.push(s, n, o[3]);
    for (s instanceof Pn && (i = s); i != null && i.done; ) {
      s = i.convert(n);
      const c = i.parent;
      c == null || c.replaceLast(s, i, n), i = c;
    }
  }
  return s;
}
new TextEncoder();
var at;
(function(r) {
  r.assertEqual = (i) => i;
  function e(i) {
  }
  r.assertIs = e;
  function t(i) {
    throw new Error();
  }
  r.assertNever = t, r.arrayToEnum = (i) => {
    const s = {};
    for (const o of i)
      s[o] = o;
    return s;
  }, r.getValidEnumValues = (i) => {
    const s = r.objectKeys(i).filter((c) => typeof i[i[c]] != "number"), o = {};
    for (const c of s)
      o[c] = i[c];
    return r.objectValues(o);
  }, r.objectValues = (i) => r.objectKeys(i).map(function(s) {
    return i[s];
  }), r.objectKeys = typeof Object.keys == "function" ? (i) => Object.keys(i) : (i) => {
    const s = [];
    for (const o in i)
      Object.prototype.hasOwnProperty.call(i, o) && s.push(o);
    return s;
  }, r.find = (i, s) => {
    for (const o of i)
      if (s(o))
        return o;
  }, r.isInteger = typeof Number.isInteger == "function" ? (i) => Number.isInteger(i) : (i) => typeof i == "number" && isFinite(i) && Math.floor(i) === i;
  function n(i, s = " | ") {
    return i.map((o) => typeof o == "string" ? `'${o}'` : o).join(s);
  }
  r.joinValues = n, r.jsonStringifyReplacer = (i, s) => typeof s == "bigint" ? s.toString() : s;
})(at || (at = {}));
var Tu;
(function(r) {
  r.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(Tu || (Tu = {}));
const ne = at.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), Rn = (r) => {
  switch (typeof r) {
    case "undefined":
      return ne.undefined;
    case "string":
      return ne.string;
    case "number":
      return isNaN(r) ? ne.nan : ne.number;
    case "boolean":
      return ne.boolean;
    case "function":
      return ne.function;
    case "bigint":
      return ne.bigint;
    case "symbol":
      return ne.symbol;
    case "object":
      return Array.isArray(r) ? ne.array : r === null ? ne.null : r.then && typeof r.then == "function" && r.catch && typeof r.catch == "function" ? ne.promise : typeof Map < "u" && r instanceof Map ? ne.map : typeof Set < "u" && r instanceof Set ? ne.set : typeof Date < "u" && r instanceof Date ? ne.date : ne.object;
    default:
      return ne.unknown;
  }
}, F = at.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]), Km = (r) => JSON.stringify(r, null, 2).replace(/"([^"]+)":/g, "$1:");
class _r extends Error {
  constructor(e) {
    super(), this.issues = [], this.addIssue = (n) => {
      this.issues = [...this.issues, n];
    }, this.addIssues = (n = []) => {
      this.issues = [...this.issues, ...n];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  get errors() {
    return this.issues;
  }
  format(e) {
    const t = e || function(s) {
      return s.message;
    }, n = { _errors: [] }, i = (s) => {
      for (const o of s.issues)
        if (o.code === "invalid_union")
          o.unionErrors.map(i);
        else if (o.code === "invalid_return_type")
          i(o.returnTypeError);
        else if (o.code === "invalid_arguments")
          i(o.argumentsError);
        else if (o.path.length === 0)
          n._errors.push(t(o));
        else {
          let c = n, u = 0;
          for (; u < o.path.length; ) {
            const h = o.path[u];
            u === o.path.length - 1 ? (c[h] = c[h] || { _errors: [] }, c[h]._errors.push(t(o))) : c[h] = c[h] || { _errors: [] }, c = c[h], u++;
          }
        }
    };
    return i(this), n;
  }
  static assert(e) {
    if (!(e instanceof _r))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, at.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, n = [];
    for (const i of this.issues)
      i.path.length > 0 ? (t[i.path[0]] = t[i.path[0]] || [], t[i.path[0]].push(e(i))) : n.push(e(i));
    return { formErrors: n, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
_r.create = (r) => new _r(r);
const es = (r, e) => {
  let t;
  switch (r.code) {
    case F.invalid_type:
      r.received === ne.undefined ? t = "Required" : t = `Expected ${r.expected}, received ${r.received}`;
      break;
    case F.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(r.expected, at.jsonStringifyReplacer)}`;
      break;
    case F.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${at.joinValues(r.keys, ", ")}`;
      break;
    case F.invalid_union:
      t = "Invalid input";
      break;
    case F.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${at.joinValues(r.options)}`;
      break;
    case F.invalid_enum_value:
      t = `Invalid enum value. Expected ${at.joinValues(r.options)}, received '${r.received}'`;
      break;
    case F.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case F.invalid_return_type:
      t = "Invalid function return type";
      break;
    case F.invalid_date:
      t = "Invalid date";
      break;
    case F.invalid_string:
      typeof r.validation == "object" ? "includes" in r.validation ? (t = `Invalid input: must include "${r.validation.includes}"`, typeof r.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${r.validation.position}`)) : "startsWith" in r.validation ? t = `Invalid input: must start with "${r.validation.startsWith}"` : "endsWith" in r.validation ? t = `Invalid input: must end with "${r.validation.endsWith}"` : at.assertNever(r.validation) : r.validation !== "regex" ? t = `Invalid ${r.validation}` : t = "Invalid";
      break;
    case F.too_small:
      r.type === "array" ? t = `Array must contain ${r.exact ? "exactly" : r.inclusive ? "at least" : "more than"} ${r.minimum} element(s)` : r.type === "string" ? t = `String must contain ${r.exact ? "exactly" : r.inclusive ? "at least" : "over"} ${r.minimum} character(s)` : r.type === "number" ? t = `Number must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${r.minimum}` : r.type === "date" ? t = `Date must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(r.minimum))}` : t = "Invalid input";
      break;
    case F.too_big:
      r.type === "array" ? t = `Array must contain ${r.exact ? "exactly" : r.inclusive ? "at most" : "less than"} ${r.maximum} element(s)` : r.type === "string" ? t = `String must contain ${r.exact ? "exactly" : r.inclusive ? "at most" : "under"} ${r.maximum} character(s)` : r.type === "number" ? t = `Number must be ${r.exact ? "exactly" : r.inclusive ? "less than or equal to" : "less than"} ${r.maximum}` : r.type === "bigint" ? t = `BigInt must be ${r.exact ? "exactly" : r.inclusive ? "less than or equal to" : "less than"} ${r.maximum}` : r.type === "date" ? t = `Date must be ${r.exact ? "exactly" : r.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(r.maximum))}` : t = "Invalid input";
      break;
    case F.custom:
      t = "Invalid input";
      break;
    case F.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case F.not_multiple_of:
      t = `Number must be a multiple of ${r.multipleOf}`;
      break;
    case F.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, at.assertNever(r);
  }
  return { message: t };
};
let K0 = es;
function qm(r) {
  K0 = r;
}
function Pa() {
  return K0;
}
const ja = (r) => {
  const { data: e, path: t, errorMaps: n, issueData: i } = r, s = [...t, ...i.path || []], o = {
    ...i,
    path: s
  };
  if (i.message !== void 0)
    return {
      ...i,
      path: s,
      message: i.message
    };
  let c = "";
  const u = n.filter((h) => !!h).slice().reverse();
  for (const h of u)
    c = h(o, { data: e, defaultError: c }).message;
  return {
    ...i,
    path: s,
    message: c
  };
}, Zm = [];
function X(r, e) {
  const t = Pa(), n = ja({
    issueData: e,
    data: r.data,
    path: r.path,
    errorMaps: [
      r.common.contextualErrorMap,
      r.schemaErrorMap,
      t,
      t === es ? void 0 : es
      // then global default map
    ].filter((i) => !!i)
  });
  r.common.issues.push(n);
}
class sr {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, t) {
    const n = [];
    for (const i of t) {
      if (i.status === "aborted")
        return Ie;
      i.status === "dirty" && e.dirty(), n.push(i.value);
    }
    return { status: e.value, value: n };
  }
  static async mergeObjectAsync(e, t) {
    const n = [];
    for (const i of t) {
      const s = await i.key, o = await i.value;
      n.push({
        key: s,
        value: o
      });
    }
    return sr.mergeObjectSync(e, n);
  }
  static mergeObjectSync(e, t) {
    const n = {};
    for (const i of t) {
      const { key: s, value: o } = i;
      if (s.status === "aborted" || o.status === "aborted")
        return Ie;
      s.status === "dirty" && e.dirty(), o.status === "dirty" && e.dirty(), s.value !== "__proto__" && (typeof o.value < "u" || i.alwaysSet) && (n[s.value] = o.value);
    }
    return { status: e.value, value: n };
  }
}
const Ie = Object.freeze({
  status: "aborted"
}), Di = (r) => ({ status: "dirty", value: r }), ur = (r) => ({ status: "valid", value: r }), Nu = (r) => r.status === "aborted", Pu = (r) => r.status === "dirty", Qs = (r) => r.status === "valid", eo = (r) => typeof Promise < "u" && r instanceof Promise;
function Ra(r, e, t, n) {
  if (typeof e == "function" ? r !== e || !n : !e.has(r)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return e.get(r);
}
function q0(r, e, t, n, i) {
  if (typeof e == "function" ? r !== e || !i : !e.has(r)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return e.set(r, t), t;
}
var Ae;
(function(r) {
  r.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, r.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(Ae || (Ae = {}));
var Os, Ts;
class ln {
  constructor(e, t, n, i) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = n, this._key = i;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const Td = (r, e) => {
  if (Qs(e))
    return { success: !0, data: e.value };
  if (!r.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new _r(r.common.issues);
      return this._error = t, this._error;
    }
  };
};
function He(r) {
  if (!r)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: n, description: i } = r;
  if (e && (t || n))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: i } : { errorMap: (o, c) => {
    var u, h;
    const { message: m } = r;
    return o.code === "invalid_enum_value" ? { message: m ?? c.defaultError } : typeof c.data > "u" ? { message: (u = m ?? n) !== null && u !== void 0 ? u : c.defaultError } : o.code !== "invalid_type" ? { message: c.defaultError } : { message: (h = m ?? t) !== null && h !== void 0 ? h : c.defaultError };
  }, description: i };
}
class qe {
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this);
  }
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return Rn(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: Rn(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new sr(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: Rn(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (eo(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const n = this.safeParse(e, t);
    if (n.success)
      return n.data;
    throw n.error;
  }
  safeParse(e, t) {
    var n;
    const i = {
      common: {
        issues: [],
        async: (n = t == null ? void 0 : t.async) !== null && n !== void 0 ? n : !1,
        contextualErrorMap: t == null ? void 0 : t.errorMap
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Rn(e)
    }, s = this._parseSync({ data: e, path: i.path, parent: i });
    return Td(i, s);
  }
  async parseAsync(e, t) {
    const n = await this.safeParseAsync(e, t);
    if (n.success)
      return n.data;
    throw n.error;
  }
  async safeParseAsync(e, t) {
    const n = {
      common: {
        issues: [],
        contextualErrorMap: t == null ? void 0 : t.errorMap,
        async: !0
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Rn(e)
    }, i = this._parse({ data: e, path: n.path, parent: n }), s = await (eo(i) ? i : Promise.resolve(i));
    return Td(n, s);
  }
  refine(e, t) {
    const n = (i) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(i) : t;
    return this._refinement((i, s) => {
      const o = e(i), c = () => s.addIssue({
        code: F.custom,
        ...n(i)
      });
      return typeof Promise < "u" && o instanceof Promise ? o.then((u) => u ? !0 : (c(), !1)) : o ? !0 : (c(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((n, i) => e(n) ? !0 : (i.addIssue(typeof t == "function" ? t(n, i) : t), !1));
  }
  _refinement(e) {
    return new Gr({
      schema: this,
      typeName: Ee.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  optional() {
    return on.create(this, this._def);
  }
  nullable() {
    return Yn.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return Lr.create(this, this._def);
  }
  promise() {
    return rs.create(this, this._def);
  }
  or(e) {
    return io.create([this, e], this._def);
  }
  and(e) {
    return so.create(this, e, this._def);
  }
  transform(e) {
    return new Gr({
      ...He(this._def),
      schema: this,
      typeName: Ee.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new uo({
      ...He(this._def),
      innerType: this,
      defaultValue: t,
      typeName: Ee.ZodDefault
    });
  }
  brand() {
    return new If({
      typeName: Ee.ZodBranded,
      type: this,
      ...He(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new fo({
      ...He(this._def),
      innerType: this,
      catchValue: t,
      typeName: Ee.ZodCatch
    });
  }
  describe(e) {
    const t = this.constructor;
    return new t({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return Oo.create(this, e);
  }
  readonly() {
    return ho.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Wm = /^c[^\s-]{8,}$/i, Ym = /^[0-9a-z]+$/, Jm = /^[0-9A-HJKMNP-TV-Z]{26}$/, Xm = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Qm = /^[a-z0-9_-]{21}$/i, e1 = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, t1 = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, r1 = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let ol;
const n1 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, i1 = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/, s1 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, Z0 = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", o1 = new RegExp(`^${Z0}$`);
function W0(r) {
  let e = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
  return r.precision ? e = `${e}\\.\\d{${r.precision}}` : r.precision == null && (e = `${e}(\\.\\d+)?`), e;
}
function a1(r) {
  return new RegExp(`^${W0(r)}$`);
}
function Y0(r) {
  let e = `${Z0}T${W0(r)}`;
  const t = [];
  return t.push(r.local ? "Z?" : "Z"), r.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function c1(r, e) {
  return !!((e === "v4" || !e) && n1.test(r) || (e === "v6" || !e) && i1.test(r));
}
class Mr extends qe {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== ne.string) {
      const s = this._getOrReturnCtx(e);
      return X(s, {
        code: F.invalid_type,
        expected: ne.string,
        received: s.parsedType
      }), Ie;
    }
    const n = new sr();
    let i;
    for (const s of this._def.checks)
      if (s.kind === "min")
        e.data.length < s.value && (i = this._getOrReturnCtx(e, i), X(i, {
          code: F.too_small,
          minimum: s.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: s.message
        }), n.dirty());
      else if (s.kind === "max")
        e.data.length > s.value && (i = this._getOrReturnCtx(e, i), X(i, {
          code: F.too_big,
          maximum: s.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: s.message
        }), n.dirty());
      else if (s.kind === "length") {
        const o = e.data.length > s.value, c = e.data.length < s.value;
        (o || c) && (i = this._getOrReturnCtx(e, i), o ? X(i, {
          code: F.too_big,
          maximum: s.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: s.message
        }) : c && X(i, {
          code: F.too_small,
          minimum: s.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: s.message
        }), n.dirty());
      } else if (s.kind === "email")
        t1.test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
          validation: "email",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "emoji")
        ol || (ol = new RegExp(r1, "u")), ol.test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
          validation: "emoji",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "uuid")
        Xm.test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
          validation: "uuid",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "nanoid")
        Qm.test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
          validation: "nanoid",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "cuid")
        Wm.test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
          validation: "cuid",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "cuid2")
        Ym.test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
          validation: "cuid2",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "ulid")
        Jm.test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
          validation: "ulid",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "url")
        try {
          new URL(e.data);
        } catch {
          i = this._getOrReturnCtx(e, i), X(i, {
            validation: "url",
            code: F.invalid_string,
            message: s.message
          }), n.dirty();
        }
      else s.kind === "regex" ? (s.regex.lastIndex = 0, s.regex.test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
        validation: "regex",
        code: F.invalid_string,
        message: s.message
      }), n.dirty())) : s.kind === "trim" ? e.data = e.data.trim() : s.kind === "includes" ? e.data.includes(s.value, s.position) || (i = this._getOrReturnCtx(e, i), X(i, {
        code: F.invalid_string,
        validation: { includes: s.value, position: s.position },
        message: s.message
      }), n.dirty()) : s.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : s.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : s.kind === "startsWith" ? e.data.startsWith(s.value) || (i = this._getOrReturnCtx(e, i), X(i, {
        code: F.invalid_string,
        validation: { startsWith: s.value },
        message: s.message
      }), n.dirty()) : s.kind === "endsWith" ? e.data.endsWith(s.value) || (i = this._getOrReturnCtx(e, i), X(i, {
        code: F.invalid_string,
        validation: { endsWith: s.value },
        message: s.message
      }), n.dirty()) : s.kind === "datetime" ? Y0(s).test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
        code: F.invalid_string,
        validation: "datetime",
        message: s.message
      }), n.dirty()) : s.kind === "date" ? o1.test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
        code: F.invalid_string,
        validation: "date",
        message: s.message
      }), n.dirty()) : s.kind === "time" ? a1(s).test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
        code: F.invalid_string,
        validation: "time",
        message: s.message
      }), n.dirty()) : s.kind === "duration" ? e1.test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
        validation: "duration",
        code: F.invalid_string,
        message: s.message
      }), n.dirty()) : s.kind === "ip" ? c1(e.data, s.version) || (i = this._getOrReturnCtx(e, i), X(i, {
        validation: "ip",
        code: F.invalid_string,
        message: s.message
      }), n.dirty()) : s.kind === "base64" ? s1.test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
        validation: "base64",
        code: F.invalid_string,
        message: s.message
      }), n.dirty()) : at.assertNever(s);
    return { status: n.value, value: e.data };
  }
  _regex(e, t, n) {
    return this.refinement((i) => e.test(i), {
      validation: t,
      code: F.invalid_string,
      ...Ae.errToObj(n)
    });
  }
  _addCheck(e) {
    return new Mr({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...Ae.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...Ae.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...Ae.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...Ae.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...Ae.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...Ae.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...Ae.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...Ae.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...Ae.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...Ae.errToObj(e) });
  }
  datetime(e) {
    var t, n;
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: e
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      offset: (t = e == null ? void 0 : e.offset) !== null && t !== void 0 ? t : !1,
      local: (n = e == null ? void 0 : e.local) !== null && n !== void 0 ? n : !1,
      ...Ae.errToObj(e == null ? void 0 : e.message)
    });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "time",
      precision: null,
      message: e
    }) : this._addCheck({
      kind: "time",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      ...Ae.errToObj(e == null ? void 0 : e.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...Ae.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...Ae.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t == null ? void 0 : t.position,
      ...Ae.errToObj(t == null ? void 0 : t.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...Ae.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...Ae.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...Ae.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...Ae.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...Ae.errToObj(t)
    });
  }
  /**
   * @deprecated Use z.string().min(1) instead.
   * @see {@link ZodString.min}
   */
  nonempty(e) {
    return this.min(1, Ae.errToObj(e));
  }
  trim() {
    return new Mr({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new Mr({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new Mr({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === "base64");
  }
  get minLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
Mr.create = (r) => {
  var e;
  return new Mr({
    checks: [],
    typeName: Ee.ZodString,
    coerce: (e = r == null ? void 0 : r.coerce) !== null && e !== void 0 ? e : !1,
    ...He(r)
  });
};
function l1(r, e) {
  const t = (r.toString().split(".")[1] || "").length, n = (e.toString().split(".")[1] || "").length, i = t > n ? t : n, s = parseInt(r.toFixed(i).replace(".", "")), o = parseInt(e.toFixed(i).replace(".", ""));
  return s % o / Math.pow(10, i);
}
class qn extends qe {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== ne.number) {
      const s = this._getOrReturnCtx(e);
      return X(s, {
        code: F.invalid_type,
        expected: ne.number,
        received: s.parsedType
      }), Ie;
    }
    let n;
    const i = new sr();
    for (const s of this._def.checks)
      s.kind === "int" ? at.isInteger(e.data) || (n = this._getOrReturnCtx(e, n), X(n, {
        code: F.invalid_type,
        expected: "integer",
        received: "float",
        message: s.message
      }), i.dirty()) : s.kind === "min" ? (s.inclusive ? e.data < s.value : e.data <= s.value) && (n = this._getOrReturnCtx(e, n), X(n, {
        code: F.too_small,
        minimum: s.value,
        type: "number",
        inclusive: s.inclusive,
        exact: !1,
        message: s.message
      }), i.dirty()) : s.kind === "max" ? (s.inclusive ? e.data > s.value : e.data >= s.value) && (n = this._getOrReturnCtx(e, n), X(n, {
        code: F.too_big,
        maximum: s.value,
        type: "number",
        inclusive: s.inclusive,
        exact: !1,
        message: s.message
      }), i.dirty()) : s.kind === "multipleOf" ? l1(e.data, s.value) !== 0 && (n = this._getOrReturnCtx(e, n), X(n, {
        code: F.not_multiple_of,
        multipleOf: s.value,
        message: s.message
      }), i.dirty()) : s.kind === "finite" ? Number.isFinite(e.data) || (n = this._getOrReturnCtx(e, n), X(n, {
        code: F.not_finite,
        message: s.message
      }), i.dirty()) : at.assertNever(s);
    return { status: i.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, Ae.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, Ae.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, Ae.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, Ae.toString(t));
  }
  setLimit(e, t, n, i) {
    return new qn({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: Ae.toString(i)
        }
      ]
    });
  }
  _addCheck(e) {
    return new qn({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: Ae.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: Ae.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: Ae.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: Ae.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: Ae.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: Ae.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: Ae.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: Ae.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: Ae.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && at.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (const n of this._def.checks) {
      if (n.kind === "finite" || n.kind === "int" || n.kind === "multipleOf")
        return !0;
      n.kind === "min" ? (t === null || n.value > t) && (t = n.value) : n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
qn.create = (r) => new qn({
  checks: [],
  typeName: Ee.ZodNumber,
  coerce: (r == null ? void 0 : r.coerce) || !1,
  ...He(r)
});
class Zn extends qe {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = BigInt(e.data)), this._getType(e) !== ne.bigint) {
      const s = this._getOrReturnCtx(e);
      return X(s, {
        code: F.invalid_type,
        expected: ne.bigint,
        received: s.parsedType
      }), Ie;
    }
    let n;
    const i = new sr();
    for (const s of this._def.checks)
      s.kind === "min" ? (s.inclusive ? e.data < s.value : e.data <= s.value) && (n = this._getOrReturnCtx(e, n), X(n, {
        code: F.too_small,
        type: "bigint",
        minimum: s.value,
        inclusive: s.inclusive,
        message: s.message
      }), i.dirty()) : s.kind === "max" ? (s.inclusive ? e.data > s.value : e.data >= s.value) && (n = this._getOrReturnCtx(e, n), X(n, {
        code: F.too_big,
        type: "bigint",
        maximum: s.value,
        inclusive: s.inclusive,
        message: s.message
      }), i.dirty()) : s.kind === "multipleOf" ? e.data % s.value !== BigInt(0) && (n = this._getOrReturnCtx(e, n), X(n, {
        code: F.not_multiple_of,
        multipleOf: s.value,
        message: s.message
      }), i.dirty()) : at.assertNever(s);
    return { status: i.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, Ae.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, Ae.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, Ae.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, Ae.toString(t));
  }
  setLimit(e, t, n, i) {
    return new Zn({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: Ae.toString(i)
        }
      ]
    });
  }
  _addCheck(e) {
    return new Zn({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: Ae.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: Ae.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: Ae.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: Ae.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: Ae.toString(t)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
Zn.create = (r) => {
  var e;
  return new Zn({
    checks: [],
    typeName: Ee.ZodBigInt,
    coerce: (e = r == null ? void 0 : r.coerce) !== null && e !== void 0 ? e : !1,
    ...He(r)
  });
};
class to extends qe {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== ne.boolean) {
      const n = this._getOrReturnCtx(e);
      return X(n, {
        code: F.invalid_type,
        expected: ne.boolean,
        received: n.parsedType
      }), Ie;
    }
    return ur(e.data);
  }
}
to.create = (r) => new to({
  typeName: Ee.ZodBoolean,
  coerce: (r == null ? void 0 : r.coerce) || !1,
  ...He(r)
});
class Si extends qe {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== ne.date) {
      const s = this._getOrReturnCtx(e);
      return X(s, {
        code: F.invalid_type,
        expected: ne.date,
        received: s.parsedType
      }), Ie;
    }
    if (isNaN(e.data.getTime())) {
      const s = this._getOrReturnCtx(e);
      return X(s, {
        code: F.invalid_date
      }), Ie;
    }
    const n = new sr();
    let i;
    for (const s of this._def.checks)
      s.kind === "min" ? e.data.getTime() < s.value && (i = this._getOrReturnCtx(e, i), X(i, {
        code: F.too_small,
        message: s.message,
        inclusive: !0,
        exact: !1,
        minimum: s.value,
        type: "date"
      }), n.dirty()) : s.kind === "max" ? e.data.getTime() > s.value && (i = this._getOrReturnCtx(e, i), X(i, {
        code: F.too_big,
        message: s.message,
        inclusive: !0,
        exact: !1,
        maximum: s.value,
        type: "date"
      }), n.dirty()) : at.assertNever(s);
    return {
      status: n.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new Si({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: Ae.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: Ae.toString(t)
    });
  }
  get minDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
}
Si.create = (r) => new Si({
  checks: [],
  coerce: (r == null ? void 0 : r.coerce) || !1,
  typeName: Ee.ZodDate,
  ...He(r)
});
class Ua extends qe {
  _parse(e) {
    if (this._getType(e) !== ne.symbol) {
      const n = this._getOrReturnCtx(e);
      return X(n, {
        code: F.invalid_type,
        expected: ne.symbol,
        received: n.parsedType
      }), Ie;
    }
    return ur(e.data);
  }
}
Ua.create = (r) => new Ua({
  typeName: Ee.ZodSymbol,
  ...He(r)
});
class ro extends qe {
  _parse(e) {
    if (this._getType(e) !== ne.undefined) {
      const n = this._getOrReturnCtx(e);
      return X(n, {
        code: F.invalid_type,
        expected: ne.undefined,
        received: n.parsedType
      }), Ie;
    }
    return ur(e.data);
  }
}
ro.create = (r) => new ro({
  typeName: Ee.ZodUndefined,
  ...He(r)
});
class no extends qe {
  _parse(e) {
    if (this._getType(e) !== ne.null) {
      const n = this._getOrReturnCtx(e);
      return X(n, {
        code: F.invalid_type,
        expected: ne.null,
        received: n.parsedType
      }), Ie;
    }
    return ur(e.data);
  }
}
no.create = (r) => new no({
  typeName: Ee.ZodNull,
  ...He(r)
});
class ts extends qe {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return ur(e.data);
  }
}
ts.create = (r) => new ts({
  typeName: Ee.ZodAny,
  ...He(r)
});
class li extends qe {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return ur(e.data);
  }
}
li.create = (r) => new li({
  typeName: Ee.ZodUnknown,
  ...He(r)
});
class In extends qe {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return X(t, {
      code: F.invalid_type,
      expected: ne.never,
      received: t.parsedType
    }), Ie;
  }
}
In.create = (r) => new In({
  typeName: Ee.ZodNever,
  ...He(r)
});
class Da extends qe {
  _parse(e) {
    if (this._getType(e) !== ne.undefined) {
      const n = this._getOrReturnCtx(e);
      return X(n, {
        code: F.invalid_type,
        expected: ne.void,
        received: n.parsedType
      }), Ie;
    }
    return ur(e.data);
  }
}
Da.create = (r) => new Da({
  typeName: Ee.ZodVoid,
  ...He(r)
});
class Lr extends qe {
  _parse(e) {
    const { ctx: t, status: n } = this._processInputParams(e), i = this._def;
    if (t.parsedType !== ne.array)
      return X(t, {
        code: F.invalid_type,
        expected: ne.array,
        received: t.parsedType
      }), Ie;
    if (i.exactLength !== null) {
      const o = t.data.length > i.exactLength.value, c = t.data.length < i.exactLength.value;
      (o || c) && (X(t, {
        code: o ? F.too_big : F.too_small,
        minimum: c ? i.exactLength.value : void 0,
        maximum: o ? i.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: i.exactLength.message
      }), n.dirty());
    }
    if (i.minLength !== null && t.data.length < i.minLength.value && (X(t, {
      code: F.too_small,
      minimum: i.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: i.minLength.message
    }), n.dirty()), i.maxLength !== null && t.data.length > i.maxLength.value && (X(t, {
      code: F.too_big,
      maximum: i.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: i.maxLength.message
    }), n.dirty()), t.common.async)
      return Promise.all([...t.data].map((o, c) => i.type._parseAsync(new ln(t, o, t.path, c)))).then((o) => sr.mergeArray(n, o));
    const s = [...t.data].map((o, c) => i.type._parseSync(new ln(t, o, t.path, c)));
    return sr.mergeArray(n, s);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new Lr({
      ...this._def,
      minLength: { value: e, message: Ae.toString(t) }
    });
  }
  max(e, t) {
    return new Lr({
      ...this._def,
      maxLength: { value: e, message: Ae.toString(t) }
    });
  }
  length(e, t) {
    return new Lr({
      ...this._def,
      exactLength: { value: e, message: Ae.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
Lr.create = (r, e) => new Lr({
  type: r,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: Ee.ZodArray,
  ...He(e)
});
function Ri(r) {
  if (r instanceof Bt) {
    const e = {};
    for (const t in r.shape) {
      const n = r.shape[t];
      e[t] = on.create(Ri(n));
    }
    return new Bt({
      ...r._def,
      shape: () => e
    });
  } else return r instanceof Lr ? new Lr({
    ...r._def,
    type: Ri(r.element)
  }) : r instanceof on ? on.create(Ri(r.unwrap())) : r instanceof Yn ? Yn.create(Ri(r.unwrap())) : r instanceof un ? un.create(r.items.map((e) => Ri(e))) : r;
}
class Bt extends qe {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = at.objectKeys(e);
    return this._cached = { shape: e, keys: t };
  }
  _parse(e) {
    if (this._getType(e) !== ne.object) {
      const h = this._getOrReturnCtx(e);
      return X(h, {
        code: F.invalid_type,
        expected: ne.object,
        received: h.parsedType
      }), Ie;
    }
    const { status: n, ctx: i } = this._processInputParams(e), { shape: s, keys: o } = this._getCached(), c = [];
    if (!(this._def.catchall instanceof In && this._def.unknownKeys === "strip"))
      for (const h in i.data)
        o.includes(h) || c.push(h);
    const u = [];
    for (const h of o) {
      const m = s[h], x = i.data[h];
      u.push({
        key: { status: "valid", value: h },
        value: m._parse(new ln(i, x, i.path, h)),
        alwaysSet: h in i.data
      });
    }
    if (this._def.catchall instanceof In) {
      const h = this._def.unknownKeys;
      if (h === "passthrough")
        for (const m of c)
          u.push({
            key: { status: "valid", value: m },
            value: { status: "valid", value: i.data[m] }
          });
      else if (h === "strict")
        c.length > 0 && (X(i, {
          code: F.unrecognized_keys,
          keys: c
        }), n.dirty());
      else if (h !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const h = this._def.catchall;
      for (const m of c) {
        const x = i.data[m];
        u.push({
          key: { status: "valid", value: m },
          value: h._parse(
            new ln(i, x, i.path, m)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: m in i.data
        });
      }
    }
    return i.common.async ? Promise.resolve().then(async () => {
      const h = [];
      for (const m of u) {
        const x = await m.key, G = await m.value;
        h.push({
          key: x,
          value: G,
          alwaysSet: m.alwaysSet
        });
      }
      return h;
    }).then((h) => sr.mergeObjectSync(n, h)) : sr.mergeObjectSync(n, u);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return Ae.errToObj, new Bt({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, n) => {
          var i, s, o, c;
          const u = (o = (s = (i = this._def).errorMap) === null || s === void 0 ? void 0 : s.call(i, t, n).message) !== null && o !== void 0 ? o : n.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: (c = Ae.errToObj(e).message) !== null && c !== void 0 ? c : u
          } : {
            message: u
          };
        }
      } : {}
    });
  }
  strip() {
    return new Bt({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new Bt({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(e) {
    return new Bt({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...e
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(e) {
    return new Bt({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: Ee.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(e) {
    return new Bt({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    return at.objectKeys(e).forEach((n) => {
      e[n] && this.shape[n] && (t[n] = this.shape[n]);
    }), new Bt({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    return at.objectKeys(this.shape).forEach((n) => {
      e[n] || (t[n] = this.shape[n]);
    }), new Bt({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return Ri(this);
  }
  partial(e) {
    const t = {};
    return at.objectKeys(this.shape).forEach((n) => {
      const i = this.shape[n];
      e && !e[n] ? t[n] = i : t[n] = i.optional();
    }), new Bt({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    return at.objectKeys(this.shape).forEach((n) => {
      if (e && !e[n])
        t[n] = this.shape[n];
      else {
        let s = this.shape[n];
        for (; s instanceof on; )
          s = s._def.innerType;
        t[n] = s;
      }
    }), new Bt({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return J0(at.objectKeys(this.shape));
  }
}
Bt.create = (r, e) => new Bt({
  shape: () => r,
  unknownKeys: "strip",
  catchall: In.create(),
  typeName: Ee.ZodObject,
  ...He(e)
});
Bt.strictCreate = (r, e) => new Bt({
  shape: () => r,
  unknownKeys: "strict",
  catchall: In.create(),
  typeName: Ee.ZodObject,
  ...He(e)
});
Bt.lazycreate = (r, e) => new Bt({
  shape: r,
  unknownKeys: "strip",
  catchall: In.create(),
  typeName: Ee.ZodObject,
  ...He(e)
});
class io extends qe {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = this._def.options;
    function i(s) {
      for (const c of s)
        if (c.result.status === "valid")
          return c.result;
      for (const c of s)
        if (c.result.status === "dirty")
          return t.common.issues.push(...c.ctx.common.issues), c.result;
      const o = s.map((c) => new _r(c.ctx.common.issues));
      return X(t, {
        code: F.invalid_union,
        unionErrors: o
      }), Ie;
    }
    if (t.common.async)
      return Promise.all(n.map(async (s) => {
        const o = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await s._parseAsync({
            data: t.data,
            path: t.path,
            parent: o
          }),
          ctx: o
        };
      })).then(i);
    {
      let s;
      const o = [];
      for (const u of n) {
        const h = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, m = u._parseSync({
          data: t.data,
          path: t.path,
          parent: h
        });
        if (m.status === "valid")
          return m;
        m.status === "dirty" && !s && (s = { result: m, ctx: h }), h.common.issues.length && o.push(h.common.issues);
      }
      if (s)
        return t.common.issues.push(...s.ctx.common.issues), s.result;
      const c = o.map((u) => new _r(u));
      return X(t, {
        code: F.invalid_union,
        unionErrors: c
      }), Ie;
    }
  }
  get options() {
    return this._def.options;
  }
}
io.create = (r, e) => new io({
  options: r,
  typeName: Ee.ZodUnion,
  ...He(e)
});
const gn = (r) => r instanceof ao ? gn(r.schema) : r instanceof Gr ? gn(r.innerType()) : r instanceof co ? [r.value] : r instanceof Wn ? r.options : r instanceof lo ? at.objectValues(r.enum) : r instanceof uo ? gn(r._def.innerType) : r instanceof ro ? [void 0] : r instanceof no ? [null] : r instanceof on ? [void 0, ...gn(r.unwrap())] : r instanceof Yn ? [null, ...gn(r.unwrap())] : r instanceof If || r instanceof ho ? gn(r.unwrap()) : r instanceof fo ? gn(r._def.innerType) : [];
class $c extends qe {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== ne.object)
      return X(t, {
        code: F.invalid_type,
        expected: ne.object,
        received: t.parsedType
      }), Ie;
    const n = this.discriminator, i = t.data[n], s = this.optionsMap.get(i);
    return s ? t.common.async ? s._parseAsync({
      data: t.data,
      path: t.path,
      parent: t
    }) : s._parseSync({
      data: t.data,
      path: t.path,
      parent: t
    }) : (X(t, {
      code: F.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [n]
    }), Ie);
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(e, t, n) {
    const i = /* @__PURE__ */ new Map();
    for (const s of t) {
      const o = gn(s.shape[e]);
      if (!o.length)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const c of o) {
        if (i.has(c))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(c)}`);
        i.set(c, s);
      }
    }
    return new $c({
      typeName: Ee.ZodDiscriminatedUnion,
      discriminator: e,
      options: t,
      optionsMap: i,
      ...He(n)
    });
  }
}
function ju(r, e) {
  const t = Rn(r), n = Rn(e);
  if (r === e)
    return { valid: !0, data: r };
  if (t === ne.object && n === ne.object) {
    const i = at.objectKeys(e), s = at.objectKeys(r).filter((c) => i.indexOf(c) !== -1), o = { ...r, ...e };
    for (const c of s) {
      const u = ju(r[c], e[c]);
      if (!u.valid)
        return { valid: !1 };
      o[c] = u.data;
    }
    return { valid: !0, data: o };
  } else if (t === ne.array && n === ne.array) {
    if (r.length !== e.length)
      return { valid: !1 };
    const i = [];
    for (let s = 0; s < r.length; s++) {
      const o = r[s], c = e[s], u = ju(o, c);
      if (!u.valid)
        return { valid: !1 };
      i.push(u.data);
    }
    return { valid: !0, data: i };
  } else return t === ne.date && n === ne.date && +r == +e ? { valid: !0, data: r } : { valid: !1 };
}
class so extends qe {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), i = (s, o) => {
      if (Nu(s) || Nu(o))
        return Ie;
      const c = ju(s.value, o.value);
      return c.valid ? ((Pu(s) || Pu(o)) && t.dirty(), { status: t.value, value: c.data }) : (X(n, {
        code: F.invalid_intersection_types
      }), Ie);
    };
    return n.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: n.data,
        path: n.path,
        parent: n
      }),
      this._def.right._parseAsync({
        data: n.data,
        path: n.path,
        parent: n
      })
    ]).then(([s, o]) => i(s, o)) : i(this._def.left._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }), this._def.right._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }));
  }
}
so.create = (r, e, t) => new so({
  left: r,
  right: e,
  typeName: Ee.ZodIntersection,
  ...He(t)
});
class un extends qe {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== ne.array)
      return X(n, {
        code: F.invalid_type,
        expected: ne.array,
        received: n.parsedType
      }), Ie;
    if (n.data.length < this._def.items.length)
      return X(n, {
        code: F.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), Ie;
    !this._def.rest && n.data.length > this._def.items.length && (X(n, {
      code: F.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const s = [...n.data].map((o, c) => {
      const u = this._def.items[c] || this._def.rest;
      return u ? u._parse(new ln(n, o, n.path, c)) : null;
    }).filter((o) => !!o);
    return n.common.async ? Promise.all(s).then((o) => sr.mergeArray(t, o)) : sr.mergeArray(t, s);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new un({
      ...this._def,
      rest: e
    });
  }
}
un.create = (r, e) => {
  if (!Array.isArray(r))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new un({
    items: r,
    typeName: Ee.ZodTuple,
    rest: null,
    ...He(e)
  });
};
class oo extends qe {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== ne.object)
      return X(n, {
        code: F.invalid_type,
        expected: ne.object,
        received: n.parsedType
      }), Ie;
    const i = [], s = this._def.keyType, o = this._def.valueType;
    for (const c in n.data)
      i.push({
        key: s._parse(new ln(n, c, n.path, c)),
        value: o._parse(new ln(n, n.data[c], n.path, c)),
        alwaysSet: c in n.data
      });
    return n.common.async ? sr.mergeObjectAsync(t, i) : sr.mergeObjectSync(t, i);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, n) {
    return t instanceof qe ? new oo({
      keyType: e,
      valueType: t,
      typeName: Ee.ZodRecord,
      ...He(n)
    }) : new oo({
      keyType: Mr.create(),
      valueType: e,
      typeName: Ee.ZodRecord,
      ...He(t)
    });
  }
}
class $a extends qe {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== ne.map)
      return X(n, {
        code: F.invalid_type,
        expected: ne.map,
        received: n.parsedType
      }), Ie;
    const i = this._def.keyType, s = this._def.valueType, o = [...n.data.entries()].map(([c, u], h) => ({
      key: i._parse(new ln(n, c, n.path, [h, "key"])),
      value: s._parse(new ln(n, u, n.path, [h, "value"]))
    }));
    if (n.common.async) {
      const c = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const u of o) {
          const h = await u.key, m = await u.value;
          if (h.status === "aborted" || m.status === "aborted")
            return Ie;
          (h.status === "dirty" || m.status === "dirty") && t.dirty(), c.set(h.value, m.value);
        }
        return { status: t.value, value: c };
      });
    } else {
      const c = /* @__PURE__ */ new Map();
      for (const u of o) {
        const h = u.key, m = u.value;
        if (h.status === "aborted" || m.status === "aborted")
          return Ie;
        (h.status === "dirty" || m.status === "dirty") && t.dirty(), c.set(h.value, m.value);
      }
      return { status: t.value, value: c };
    }
  }
}
$a.create = (r, e, t) => new $a({
  valueType: e,
  keyType: r,
  typeName: Ee.ZodMap,
  ...He(t)
});
class _i extends qe {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== ne.set)
      return X(n, {
        code: F.invalid_type,
        expected: ne.set,
        received: n.parsedType
      }), Ie;
    const i = this._def;
    i.minSize !== null && n.data.size < i.minSize.value && (X(n, {
      code: F.too_small,
      minimum: i.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: i.minSize.message
    }), t.dirty()), i.maxSize !== null && n.data.size > i.maxSize.value && (X(n, {
      code: F.too_big,
      maximum: i.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: i.maxSize.message
    }), t.dirty());
    const s = this._def.valueType;
    function o(u) {
      const h = /* @__PURE__ */ new Set();
      for (const m of u) {
        if (m.status === "aborted")
          return Ie;
        m.status === "dirty" && t.dirty(), h.add(m.value);
      }
      return { status: t.value, value: h };
    }
    const c = [...n.data.values()].map((u, h) => s._parse(new ln(n, u, n.path, h)));
    return n.common.async ? Promise.all(c).then((u) => o(u)) : o(c);
  }
  min(e, t) {
    return new _i({
      ...this._def,
      minSize: { value: e, message: Ae.toString(t) }
    });
  }
  max(e, t) {
    return new _i({
      ...this._def,
      maxSize: { value: e, message: Ae.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
_i.create = (r, e) => new _i({
  valueType: r,
  minSize: null,
  maxSize: null,
  typeName: Ee.ZodSet,
  ...He(e)
});
class Vi extends qe {
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== ne.function)
      return X(t, {
        code: F.invalid_type,
        expected: ne.function,
        received: t.parsedType
      }), Ie;
    function n(c, u) {
      return ja({
        data: c,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          Pa(),
          es
        ].filter((h) => !!h),
        issueData: {
          code: F.invalid_arguments,
          argumentsError: u
        }
      });
    }
    function i(c, u) {
      return ja({
        data: c,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          Pa(),
          es
        ].filter((h) => !!h),
        issueData: {
          code: F.invalid_return_type,
          returnTypeError: u
        }
      });
    }
    const s = { errorMap: t.common.contextualErrorMap }, o = t.data;
    if (this._def.returns instanceof rs) {
      const c = this;
      return ur(async function(...u) {
        const h = new _r([]), m = await c._def.args.parseAsync(u, s).catch((N) => {
          throw h.addIssue(n(u, N)), h;
        }), x = await Reflect.apply(o, this, m);
        return await c._def.returns._def.type.parseAsync(x, s).catch((N) => {
          throw h.addIssue(i(x, N)), h;
        });
      });
    } else {
      const c = this;
      return ur(function(...u) {
        const h = c._def.args.safeParse(u, s);
        if (!h.success)
          throw new _r([n(u, h.error)]);
        const m = Reflect.apply(o, this, h.data), x = c._def.returns.safeParse(m, s);
        if (!x.success)
          throw new _r([i(m, x.error)]);
        return x.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...e) {
    return new Vi({
      ...this._def,
      args: un.create(e).rest(li.create())
    });
  }
  returns(e) {
    return new Vi({
      ...this._def,
      returns: e
    });
  }
  implement(e) {
    return this.parse(e);
  }
  strictImplement(e) {
    return this.parse(e);
  }
  static create(e, t, n) {
    return new Vi({
      args: e || un.create([]).rest(li.create()),
      returns: t || li.create(),
      typeName: Ee.ZodFunction,
      ...He(n)
    });
  }
}
class ao extends qe {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
ao.create = (r, e) => new ao({
  getter: r,
  typeName: Ee.ZodLazy,
  ...He(e)
});
class co extends qe {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return X(t, {
        received: t.data,
        code: F.invalid_literal,
        expected: this._def.value
      }), Ie;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
co.create = (r, e) => new co({
  value: r,
  typeName: Ee.ZodLiteral,
  ...He(e)
});
function J0(r, e) {
  return new Wn({
    values: r,
    typeName: Ee.ZodEnum,
    ...He(e)
  });
}
class Wn extends qe {
  constructor() {
    super(...arguments), Os.set(this, void 0);
  }
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return X(t, {
        expected: at.joinValues(n),
        received: t.parsedType,
        code: F.invalid_type
      }), Ie;
    }
    if (Ra(this, Os) || q0(this, Os, new Set(this._def.values)), !Ra(this, Os).has(e.data)) {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return X(t, {
        received: t.data,
        code: F.invalid_enum_value,
        options: n
      }), Ie;
    }
    return ur(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Values() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  extract(e, t = this._def) {
    return Wn.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return Wn.create(this.options.filter((n) => !e.includes(n)), {
      ...this._def,
      ...t
    });
  }
}
Os = /* @__PURE__ */ new WeakMap();
Wn.create = J0;
class lo extends qe {
  constructor() {
    super(...arguments), Ts.set(this, void 0);
  }
  _parse(e) {
    const t = at.getValidEnumValues(this._def.values), n = this._getOrReturnCtx(e);
    if (n.parsedType !== ne.string && n.parsedType !== ne.number) {
      const i = at.objectValues(t);
      return X(n, {
        expected: at.joinValues(i),
        received: n.parsedType,
        code: F.invalid_type
      }), Ie;
    }
    if (Ra(this, Ts) || q0(this, Ts, new Set(at.getValidEnumValues(this._def.values))), !Ra(this, Ts).has(e.data)) {
      const i = at.objectValues(t);
      return X(n, {
        received: n.data,
        code: F.invalid_enum_value,
        options: i
      }), Ie;
    }
    return ur(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
Ts = /* @__PURE__ */ new WeakMap();
lo.create = (r, e) => new lo({
  values: r,
  typeName: Ee.ZodNativeEnum,
  ...He(e)
});
class rs extends qe {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== ne.promise && t.common.async === !1)
      return X(t, {
        code: F.invalid_type,
        expected: ne.promise,
        received: t.parsedType
      }), Ie;
    const n = t.parsedType === ne.promise ? t.data : Promise.resolve(t.data);
    return ur(n.then((i) => this._def.type.parseAsync(i, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
rs.create = (r, e) => new rs({
  type: r,
  typeName: Ee.ZodPromise,
  ...He(e)
});
class Gr extends qe {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === Ee.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), i = this._def.effect || null, s = {
      addIssue: (o) => {
        X(n, o), o.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return n.path;
      }
    };
    if (s.addIssue = s.addIssue.bind(s), i.type === "preprocess") {
      const o = i.transform(n.data, s);
      if (n.common.async)
        return Promise.resolve(o).then(async (c) => {
          if (t.value === "aborted")
            return Ie;
          const u = await this._def.schema._parseAsync({
            data: c,
            path: n.path,
            parent: n
          });
          return u.status === "aborted" ? Ie : u.status === "dirty" || t.value === "dirty" ? Di(u.value) : u;
        });
      {
        if (t.value === "aborted")
          return Ie;
        const c = this._def.schema._parseSync({
          data: o,
          path: n.path,
          parent: n
        });
        return c.status === "aborted" ? Ie : c.status === "dirty" || t.value === "dirty" ? Di(c.value) : c;
      }
    }
    if (i.type === "refinement") {
      const o = (c) => {
        const u = i.refinement(c, s);
        if (n.common.async)
          return Promise.resolve(u);
        if (u instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return c;
      };
      if (n.common.async === !1) {
        const c = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return c.status === "aborted" ? Ie : (c.status === "dirty" && t.dirty(), o(c.value), { status: t.value, value: c.value });
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((c) => c.status === "aborted" ? Ie : (c.status === "dirty" && t.dirty(), o(c.value).then(() => ({ status: t.value, value: c.value }))));
    }
    if (i.type === "transform")
      if (n.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        if (!Qs(o))
          return o;
        const c = i.transform(o.value, s);
        if (c instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: c };
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((o) => Qs(o) ? Promise.resolve(i.transform(o.value, s)).then((c) => ({ status: t.value, value: c })) : o);
    at.assertNever(i);
  }
}
Gr.create = (r, e, t) => new Gr({
  schema: r,
  typeName: Ee.ZodEffects,
  effect: e,
  ...He(t)
});
Gr.createWithPreprocess = (r, e, t) => new Gr({
  schema: e,
  effect: { type: "preprocess", transform: r },
  typeName: Ee.ZodEffects,
  ...He(t)
});
class on extends qe {
  _parse(e) {
    return this._getType(e) === ne.undefined ? ur(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
on.create = (r, e) => new on({
  innerType: r,
  typeName: Ee.ZodOptional,
  ...He(e)
});
class Yn extends qe {
  _parse(e) {
    return this._getType(e) === ne.null ? ur(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Yn.create = (r, e) => new Yn({
  innerType: r,
  typeName: Ee.ZodNullable,
  ...He(e)
});
class uo extends qe {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let n = t.data;
    return t.parsedType === ne.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({
      data: n,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
uo.create = (r, e) => new uo({
  innerType: r,
  typeName: Ee.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...He(e)
});
class fo extends qe {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, i = this._def.innerType._parse({
      data: n.data,
      path: n.path,
      parent: {
        ...n
      }
    });
    return eo(i) ? i.then((s) => ({
      status: "valid",
      value: s.status === "valid" ? s.value : this._def.catchValue({
        get error() {
          return new _r(n.common.issues);
        },
        input: n.data
      })
    })) : {
      status: "valid",
      value: i.status === "valid" ? i.value : this._def.catchValue({
        get error() {
          return new _r(n.common.issues);
        },
        input: n.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
fo.create = (r, e) => new fo({
  innerType: r,
  typeName: Ee.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...He(e)
});
class Ma extends qe {
  _parse(e) {
    if (this._getType(e) !== ne.nan) {
      const n = this._getOrReturnCtx(e);
      return X(n, {
        code: F.invalid_type,
        expected: ne.nan,
        received: n.parsedType
      }), Ie;
    }
    return { status: "valid", value: e.data };
  }
}
Ma.create = (r) => new Ma({
  typeName: Ee.ZodNaN,
  ...He(r)
});
const u1 = Symbol("zod_brand");
class If extends qe {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = t.data;
    return this._def.type._parse({
      data: n,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class Oo extends qe {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.common.async)
      return (async () => {
        const s = await this._def.in._parseAsync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return s.status === "aborted" ? Ie : s.status === "dirty" ? (t.dirty(), Di(s.value)) : this._def.out._parseAsync({
          data: s.value,
          path: n.path,
          parent: n
        });
      })();
    {
      const i = this._def.in._parseSync({
        data: n.data,
        path: n.path,
        parent: n
      });
      return i.status === "aborted" ? Ie : i.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: i.value
      }) : this._def.out._parseSync({
        data: i.value,
        path: n.path,
        parent: n
      });
    }
  }
  static create(e, t) {
    return new Oo({
      in: e,
      out: t,
      typeName: Ee.ZodPipeline
    });
  }
}
class ho extends qe {
  _parse(e) {
    const t = this._def.innerType._parse(e), n = (i) => (Qs(i) && (i.value = Object.freeze(i.value)), i);
    return eo(t) ? t.then((i) => n(i)) : n(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ho.create = (r, e) => new ho({
  innerType: r,
  typeName: Ee.ZodReadonly,
  ...He(e)
});
function X0(r, e = {}, t) {
  return r ? ts.create().superRefine((n, i) => {
    var s, o;
    if (!r(n)) {
      const c = typeof e == "function" ? e(n) : typeof e == "string" ? { message: e } : e, u = (o = (s = c.fatal) !== null && s !== void 0 ? s : t) !== null && o !== void 0 ? o : !0, h = typeof c == "string" ? { message: c } : c;
      i.addIssue({ code: "custom", ...h, fatal: u });
    }
  }) : ts.create();
}
const f1 = {
  object: Bt.lazycreate
};
var Ee;
(function(r) {
  r.ZodString = "ZodString", r.ZodNumber = "ZodNumber", r.ZodNaN = "ZodNaN", r.ZodBigInt = "ZodBigInt", r.ZodBoolean = "ZodBoolean", r.ZodDate = "ZodDate", r.ZodSymbol = "ZodSymbol", r.ZodUndefined = "ZodUndefined", r.ZodNull = "ZodNull", r.ZodAny = "ZodAny", r.ZodUnknown = "ZodUnknown", r.ZodNever = "ZodNever", r.ZodVoid = "ZodVoid", r.ZodArray = "ZodArray", r.ZodObject = "ZodObject", r.ZodUnion = "ZodUnion", r.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r.ZodIntersection = "ZodIntersection", r.ZodTuple = "ZodTuple", r.ZodRecord = "ZodRecord", r.ZodMap = "ZodMap", r.ZodSet = "ZodSet", r.ZodFunction = "ZodFunction", r.ZodLazy = "ZodLazy", r.ZodLiteral = "ZodLiteral", r.ZodEnum = "ZodEnum", r.ZodEffects = "ZodEffects", r.ZodNativeEnum = "ZodNativeEnum", r.ZodOptional = "ZodOptional", r.ZodNullable = "ZodNullable", r.ZodDefault = "ZodDefault", r.ZodCatch = "ZodCatch", r.ZodPromise = "ZodPromise", r.ZodBranded = "ZodBranded", r.ZodPipeline = "ZodPipeline", r.ZodReadonly = "ZodReadonly";
})(Ee || (Ee = {}));
const h1 = (r, e = {
  message: `Input not instance of ${r.name}`
}) => X0((t) => t instanceof r, e), Q0 = Mr.create, ey = qn.create, d1 = Ma.create, p1 = Zn.create, ty = to.create, y1 = Si.create, g1 = Ua.create, v1 = ro.create, m1 = no.create, w1 = ts.create, b1 = li.create, x1 = In.create, A1 = Da.create, S1 = Lr.create, _1 = Bt.create, E1 = Bt.strictCreate, I1 = io.create, k1 = $c.create, C1 = so.create, B1 = un.create, O1 = oo.create, T1 = $a.create, N1 = _i.create, P1 = Vi.create, j1 = ao.create, R1 = co.create, U1 = Wn.create, D1 = lo.create, $1 = rs.create, Nd = Gr.create, M1 = on.create, V1 = Yn.create, L1 = Gr.createWithPreprocess, H1 = Oo.create, F1 = () => Q0().optional(), z1 = () => ey().optional(), G1 = () => ty().optional(), K1 = {
  string: (r) => Mr.create({ ...r, coerce: !0 }),
  number: (r) => qn.create({ ...r, coerce: !0 }),
  boolean: (r) => to.create({
    ...r,
    coerce: !0
  }),
  bigint: (r) => Zn.create({ ...r, coerce: !0 }),
  date: (r) => Si.create({ ...r, coerce: !0 })
}, q1 = Ie;
var Ct = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: es,
  setErrorMap: qm,
  getErrorMap: Pa,
  makeIssue: ja,
  EMPTY_PATH: Zm,
  addIssueToContext: X,
  ParseStatus: sr,
  INVALID: Ie,
  DIRTY: Di,
  OK: ur,
  isAborted: Nu,
  isDirty: Pu,
  isValid: Qs,
  isAsync: eo,
  get util() {
    return at;
  },
  get objectUtil() {
    return Tu;
  },
  ZodParsedType: ne,
  getParsedType: Rn,
  ZodType: qe,
  datetimeRegex: Y0,
  ZodString: Mr,
  ZodNumber: qn,
  ZodBigInt: Zn,
  ZodBoolean: to,
  ZodDate: Si,
  ZodSymbol: Ua,
  ZodUndefined: ro,
  ZodNull: no,
  ZodAny: ts,
  ZodUnknown: li,
  ZodNever: In,
  ZodVoid: Da,
  ZodArray: Lr,
  ZodObject: Bt,
  ZodUnion: io,
  ZodDiscriminatedUnion: $c,
  ZodIntersection: so,
  ZodTuple: un,
  ZodRecord: oo,
  ZodMap: $a,
  ZodSet: _i,
  ZodFunction: Vi,
  ZodLazy: ao,
  ZodLiteral: co,
  ZodEnum: Wn,
  ZodNativeEnum: lo,
  ZodPromise: rs,
  ZodEffects: Gr,
  ZodTransformer: Gr,
  ZodOptional: on,
  ZodNullable: Yn,
  ZodDefault: uo,
  ZodCatch: fo,
  ZodNaN: Ma,
  BRAND: u1,
  ZodBranded: If,
  ZodPipeline: Oo,
  ZodReadonly: ho,
  custom: X0,
  Schema: qe,
  ZodSchema: qe,
  late: f1,
  get ZodFirstPartyTypeKind() {
    return Ee;
  },
  coerce: K1,
  any: w1,
  array: S1,
  bigint: p1,
  boolean: ty,
  date: y1,
  discriminatedUnion: k1,
  effect: Nd,
  enum: U1,
  function: P1,
  instanceof: h1,
  intersection: C1,
  lazy: j1,
  literal: R1,
  map: T1,
  nan: d1,
  nativeEnum: D1,
  never: x1,
  null: m1,
  nullable: V1,
  number: ey,
  object: _1,
  oboolean: G1,
  onumber: z1,
  optional: M1,
  ostring: F1,
  pipeline: H1,
  preprocess: L1,
  promise: $1,
  record: O1,
  set: N1,
  strictObject: E1,
  string: Q0,
  symbol: g1,
  transformer: Nd,
  tuple: B1,
  undefined: v1,
  union: I1,
  unknown: b1,
  void: A1,
  NEVER: q1,
  ZodIssueCode: F,
  quotelessJson: Km,
  ZodError: _r
});
const Va = new Uint8Array([48, 130, 2, 17, 48, 130, 1, 150, 160, 3, 2, 1, 2, 2, 17, 0, 249, 49, 117, 104, 27, 144, 175, 225, 29, 70, 204, 180, 228, 231, 248, 86, 48, 10, 6, 8, 42, 134, 72, 206, 61, 4, 3, 3, 48, 73, 49, 11, 48, 9, 6, 3, 85, 4, 6, 19, 2, 85, 83, 49, 15, 48, 13, 6, 3, 85, 4, 10, 12, 6, 65, 109, 97, 122, 111, 110, 49, 12, 48, 10, 6, 3, 85, 4, 11, 12, 3, 65, 87, 83, 49, 27, 48, 25, 6, 3, 85, 4, 3, 12, 18, 97, 119, 115, 46, 110, 105, 116, 114, 111, 45, 101, 110, 99, 108, 97, 118, 101, 115, 48, 30, 23, 13, 49, 57, 49, 48, 50, 56, 49, 51, 50, 56, 48, 53, 90, 23, 13, 52, 57, 49, 48, 50, 56, 49, 52, 50, 56, 48, 53, 90, 48, 73, 49, 11, 48, 9, 6, 3, 85, 4, 6, 19, 2, 85, 83, 49, 15, 48, 13, 6, 3, 85, 4, 10, 12, 6, 65, 109, 97, 122, 111, 110, 49, 12, 48, 10, 6, 3, 85, 4, 11, 12, 3, 65, 87, 83, 49, 27, 48, 25, 6, 3, 85, 4, 3, 12, 18, 97, 119, 115, 46, 110, 105, 116, 114, 111, 45, 101, 110, 99, 108, 97, 118, 101, 115, 48, 118, 48, 16, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 5, 43, 129, 4, 0, 34, 3, 98, 0, 4, 252, 2, 84, 235, 166, 8, 193, 243, 104, 112, 226, 154, 218, 144, 190, 70, 56, 50, 146, 115, 110, 137, 75, 255, 246, 114, 217, 137, 68, 75, 80, 81, 229, 52, 164, 177, 246, 219, 227, 192, 188, 88, 26, 50, 183, 177, 118, 7, 14, 222, 18, 214, 154, 63, 234, 33, 27, 102, 231, 82, 207, 125, 209, 221, 9, 95, 111, 19, 112, 244, 23, 8, 67, 217, 220, 16, 1, 33, 228, 207, 99, 1, 40, 9, 102, 68, 135, 201, 121, 98, 132, 48, 77, 197, 63, 244, 163, 66, 48, 64, 48, 15, 6, 3, 85, 29, 19, 1, 1, 255, 4, 5, 48, 3, 1, 1, 255, 48, 29, 6, 3, 85, 29, 14, 4, 22, 4, 20, 144, 37, 181, 13, 217, 5, 71, 231, 150, 195, 150, 250, 114, 157, 207, 153, 169, 223, 75, 150, 48, 14, 6, 3, 85, 29, 15, 1, 1, 255, 4, 4, 3, 2, 1, 134, 48, 10, 6, 8, 42, 134, 72, 206, 61, 4, 3, 3, 3, 105, 0, 48, 102, 2, 49, 0, 163, 127, 47, 145, 161, 201, 189, 94, 231, 184, 98, 124, 22, 152, 210, 85, 3, 142, 31, 3, 67, 249, 91, 99, 169, 98, 140, 61, 57, 128, 149, 69, 161, 30, 188, 191, 46, 59, 85, 216, 174, 238, 113, 180, 195, 214, 173, 243, 2, 49, 0, 162, 243, 155, 22, 5, 178, 112, 40, 165, 221, 75, 160, 105, 181, 1, 110, 101, 180, 251, 222, 143, 224, 6, 29, 106, 83, 25, 127, 156, 218, 245, 217, 67, 188, 97, 252, 43, 235, 3, 203, 111, 238, 141, 35, 2, 243, 223, 246]);
if (!Va || Va.length === 0)
  throw new Error("AWS root certificate is empty or not loaded correctly");
const Z1 = Ct.object({
  module_id: Ct.string().min(1),
  digest: Ct.literal("SHA384"),
  timestamp: Ct.number().min(1677721600),
  pcrs: Ct.map(Ct.number(), Ct.instanceof(Uint8Array)),
  certificate: Ct.instanceof(Uint8Array),
  cabundle: Ct.array(Ct.instanceof(Uint8Array)),
  public_key: Ct.nullable(Ct.instanceof(Uint8Array)),
  user_data: Ct.nullable(Ct.instanceof(Uint8Array)),
  nonce: Ct.nullable(Ct.instanceof(Uint8Array))
}), W1 = Ct.object({
  protected: Ct.instanceof(Uint8Array),
  // There's an "unprotected" header in the CBOR, but we never use it
  payload: Ct.instanceof(Uint8Array),
  signature: Ct.instanceof(Uint8Array)
});
async function Y1(r) {
  try {
    if (!r)
      throw new Error("Attestation document is empty.");
    const e = Ds(r), t = Na(e), n = t[0], i = t[2], s = t[3];
    return W1.parse({
      protected: n,
      payload: i,
      signature: s
    });
  } catch (e) {
    throw console.error("Error parsing document data:", e), new Error("Failed to parse document data.");
  }
}
async function J1(r) {
  try {
    const e = Na(r);
    return Z1.parse(e);
  } catch (e) {
    throw console.error("Error parsing document payload:", e), new Error("Failed to parse document payload.");
  }
}
function X1(r, e) {
  const t = [
    "Signature1",
    // Context string
    r,
    // Protected headers
    new Uint8Array(0),
    // external_aad (empty ByteBuf in Rust)
    e
    // payload
  ];
  return Dc(t);
}
async function Q1(r, e) {
  try {
    console.log("SIGNATURE:"), console.log(Br(r.signature));
    const t = X1(r.protected, r.payload), n = await crypto.subtle.digest("SHA-384", t);
    return console.log("SIGNATURE STRUCTURE DIGEST:"), console.log(Br(new Uint8Array(n))), await crypto.subtle.verify(
      // TODO: these could be derived from the document, but we're hardcoding them for now
      {
        name: "ECDSA",
        hash: "SHA-384"
      },
      e,
      r.signature,
      t
    );
  } catch (t) {
    throw console.error("Error verifying signature:", t), t instanceof Error ? new Error(`Signature verification failed: ${t.message}`) : new Error(`Signature verification failed: ${t}`);
  }
}
async function Ei(r, e, t) {
  try {
    const n = await Y1(r), i = await J1(n.payload);
    if (!i.nonce)
      throw new Error("Attestation document does not have a nonce.");
    const o = new TextDecoder("utf-8").decode(i.nonce);
    if (t !== o)
      throw console.log("Nonce mismatch"), console.log("Provided nonce:", t), console.log("Attestation document nonce:", o), new Error("Attestation document's nonce does not match the provided nonce.");
    const c = [], u = Br(i.cabundle[0]);
    if (u !== Br(e))
      throw console.error("Root cert doesn't match first cert"), console.log("First cert base64:", u), console.log("Trusted root cert base64:", Br(e)), new Error("Root cert does not match first cert in attestation document.");
    for (let I = 0; I < i.cabundle.length; I++) {
      const P = new xi(i.cabundle[I]);
      c.push(P);
    }
    const h = new xi(i.certificate), x = await new mm({
      certificates: c
    }).build(h);
    console.log("Chain items:", x);
    const N = (/* @__PURE__ */ new Date()).getTime();
    for (let I = 0; I < x.length; I++) {
      const P = x[I];
      if (console.log("CERT: ", I), console.log(P.subject), console.log("Not before:", P.notBefore), console.log("Not after:", P.notAfter), console.log(P.toString("pem")), P.notBefore.getTime() > N || P.notAfter.getTime() < N)
        throw new Error("Certificate is expired.");
      console.log(`Certificate ${I} is not expired.`);
    }
    if (x.length !== i.cabundle.length + 1)
      throw new Error("Certificate chain length does not match length of cabundle.");
    const v = h.publicKey;
    console.log("PUBLIC KEY:"), console.log(Br(new Uint8Array(v.rawData)));
    const A = await v.export(), O = await Q1(n, A);
    if (console.log("Signature verified:", O), !O)
      throw new Error("Signature verification failed.");
    return i;
  } catch (n) {
    throw console.error("Error verifying attestation document:", n), n;
  }
}
const ew = Ct.object({
  public_key: Ct.nullable(Ct.instanceof(Uint8Array))
});
async function tw(r) {
  const e = Ds(r), n = Na(e)[2], i = Na(n);
  return await ew.parse(i);
}
async function rw(r, e) {
  try {
    const t = await My(r, e), n = e || Ny();
    return n && (n === "http://127.0.0.1:3000" || n === "http://localhost:3000" || n === "http://0.0.0.0:3000") ? (console.log("DEV MODE: Using fake attestation document"), await tw(t)) : await Ei(t, Va, r);
  } catch (t) {
    throw t instanceof Error ? (console.error("Error verifying attestation document:", t), new Error(`Couldn't process attestation document: ${t.message}`)) : (console.error("Error verifying attestation document:", t), new Error("Couldn't process attestation document."));
  }
}
function nw(r) {
  throw new Error('Could not dynamically require "' + r + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var ry = { exports: {} };
const iw = {}, sw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: iw
}, Symbol.toStringTag, { value: "Module" })), ow = /* @__PURE__ */ Sg(sw);
(function(r) {
  (function(e) {
    var t = function(l) {
      var p, d = new Float64Array(16);
      if (l) for (p = 0; p < l.length; p++) d[p] = l[p];
      return d;
    }, n = function() {
      throw new Error("no PRNG");
    }, i = new Uint8Array(16), s = new Uint8Array(32);
    s[0] = 9;
    var o = t(), c = t([1]), u = t([56129, 1]), h = t([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]), m = t([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]), x = t([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]), G = t([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]), N = t([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);
    function v(l, p, d, a) {
      l[p] = d >> 24 & 255, l[p + 1] = d >> 16 & 255, l[p + 2] = d >> 8 & 255, l[p + 3] = d & 255, l[p + 4] = a >> 24 & 255, l[p + 5] = a >> 16 & 255, l[p + 6] = a >> 8 & 255, l[p + 7] = a & 255;
    }
    function A(l, p, d, a, g) {
      var S, E = 0;
      for (S = 0; S < g; S++) E |= l[p + S] ^ d[a + S];
      return (1 & E - 1 >>> 8) - 1;
    }
    function O(l, p, d, a) {
      return A(l, p, d, a, 16);
    }
    function I(l, p, d, a) {
      return A(l, p, d, a, 32);
    }
    function P(l, p, d, a) {
      for (var g = a[0] & 255 | (a[1] & 255) << 8 | (a[2] & 255) << 16 | (a[3] & 255) << 24, S = d[0] & 255 | (d[1] & 255) << 8 | (d[2] & 255) << 16 | (d[3] & 255) << 24, E = d[4] & 255 | (d[5] & 255) << 8 | (d[6] & 255) << 16 | (d[7] & 255) << 24, U = d[8] & 255 | (d[9] & 255) << 8 | (d[10] & 255) << 16 | (d[11] & 255) << 24, z = d[12] & 255 | (d[13] & 255) << 8 | (d[14] & 255) << 16 | (d[15] & 255) << 24, me = a[4] & 255 | (a[5] & 255) << 8 | (a[6] & 255) << 16 | (a[7] & 255) << 24, J = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, lt = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, ae = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, ke = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, Ce = a[8] & 255 | (a[9] & 255) << 8 | (a[10] & 255) << 16 | (a[11] & 255) << 24, $e = d[16] & 255 | (d[17] & 255) << 8 | (d[18] & 255) << 16 | (d[19] & 255) << 24, Re = d[20] & 255 | (d[21] & 255) << 8 | (d[22] & 255) << 16 | (d[23] & 255) << 24, Be = d[24] & 255 | (d[25] & 255) << 8 | (d[26] & 255) << 16 | (d[27] & 255) << 24, Ne = d[28] & 255 | (d[29] & 255) << 8 | (d[30] & 255) << 16 | (d[31] & 255) << 24, Oe = a[12] & 255 | (a[13] & 255) << 8 | (a[14] & 255) << 16 | (a[15] & 255) << 24, he = g, xe = S, te = E, de = U, ge = z, Y = me, C = J, B = lt, V = ae, j = ke, D = Ce, L = $e, Se = Re, Me = Be, Fe = Ne, Ve = Oe, w, We = 0; We < 20; We += 2)
        w = he + Se | 0, ge ^= w << 7 | w >>> 25, w = ge + he | 0, V ^= w << 9 | w >>> 23, w = V + ge | 0, Se ^= w << 13 | w >>> 19, w = Se + V | 0, he ^= w << 18 | w >>> 14, w = Y + xe | 0, j ^= w << 7 | w >>> 25, w = j + Y | 0, Me ^= w << 9 | w >>> 23, w = Me + j | 0, xe ^= w << 13 | w >>> 19, w = xe + Me | 0, Y ^= w << 18 | w >>> 14, w = D + C | 0, Fe ^= w << 7 | w >>> 25, w = Fe + D | 0, te ^= w << 9 | w >>> 23, w = te + Fe | 0, C ^= w << 13 | w >>> 19, w = C + te | 0, D ^= w << 18 | w >>> 14, w = Ve + L | 0, de ^= w << 7 | w >>> 25, w = de + Ve | 0, B ^= w << 9 | w >>> 23, w = B + de | 0, L ^= w << 13 | w >>> 19, w = L + B | 0, Ve ^= w << 18 | w >>> 14, w = he + de | 0, xe ^= w << 7 | w >>> 25, w = xe + he | 0, te ^= w << 9 | w >>> 23, w = te + xe | 0, de ^= w << 13 | w >>> 19, w = de + te | 0, he ^= w << 18 | w >>> 14, w = Y + ge | 0, C ^= w << 7 | w >>> 25, w = C + Y | 0, B ^= w << 9 | w >>> 23, w = B + C | 0, ge ^= w << 13 | w >>> 19, w = ge + B | 0, Y ^= w << 18 | w >>> 14, w = D + j | 0, L ^= w << 7 | w >>> 25, w = L + D | 0, V ^= w << 9 | w >>> 23, w = V + L | 0, j ^= w << 13 | w >>> 19, w = j + V | 0, D ^= w << 18 | w >>> 14, w = Ve + Fe | 0, Se ^= w << 7 | w >>> 25, w = Se + Ve | 0, Me ^= w << 9 | w >>> 23, w = Me + Se | 0, Fe ^= w << 13 | w >>> 19, w = Fe + Me | 0, Ve ^= w << 18 | w >>> 14;
      he = he + g | 0, xe = xe + S | 0, te = te + E | 0, de = de + U | 0, ge = ge + z | 0, Y = Y + me | 0, C = C + J | 0, B = B + lt | 0, V = V + ae | 0, j = j + ke | 0, D = D + Ce | 0, L = L + $e | 0, Se = Se + Re | 0, Me = Me + Be | 0, Fe = Fe + Ne | 0, Ve = Ve + Oe | 0, l[0] = he >>> 0 & 255, l[1] = he >>> 8 & 255, l[2] = he >>> 16 & 255, l[3] = he >>> 24 & 255, l[4] = xe >>> 0 & 255, l[5] = xe >>> 8 & 255, l[6] = xe >>> 16 & 255, l[7] = xe >>> 24 & 255, l[8] = te >>> 0 & 255, l[9] = te >>> 8 & 255, l[10] = te >>> 16 & 255, l[11] = te >>> 24 & 255, l[12] = de >>> 0 & 255, l[13] = de >>> 8 & 255, l[14] = de >>> 16 & 255, l[15] = de >>> 24 & 255, l[16] = ge >>> 0 & 255, l[17] = ge >>> 8 & 255, l[18] = ge >>> 16 & 255, l[19] = ge >>> 24 & 255, l[20] = Y >>> 0 & 255, l[21] = Y >>> 8 & 255, l[22] = Y >>> 16 & 255, l[23] = Y >>> 24 & 255, l[24] = C >>> 0 & 255, l[25] = C >>> 8 & 255, l[26] = C >>> 16 & 255, l[27] = C >>> 24 & 255, l[28] = B >>> 0 & 255, l[29] = B >>> 8 & 255, l[30] = B >>> 16 & 255, l[31] = B >>> 24 & 255, l[32] = V >>> 0 & 255, l[33] = V >>> 8 & 255, l[34] = V >>> 16 & 255, l[35] = V >>> 24 & 255, l[36] = j >>> 0 & 255, l[37] = j >>> 8 & 255, l[38] = j >>> 16 & 255, l[39] = j >>> 24 & 255, l[40] = D >>> 0 & 255, l[41] = D >>> 8 & 255, l[42] = D >>> 16 & 255, l[43] = D >>> 24 & 255, l[44] = L >>> 0 & 255, l[45] = L >>> 8 & 255, l[46] = L >>> 16 & 255, l[47] = L >>> 24 & 255, l[48] = Se >>> 0 & 255, l[49] = Se >>> 8 & 255, l[50] = Se >>> 16 & 255, l[51] = Se >>> 24 & 255, l[52] = Me >>> 0 & 255, l[53] = Me >>> 8 & 255, l[54] = Me >>> 16 & 255, l[55] = Me >>> 24 & 255, l[56] = Fe >>> 0 & 255, l[57] = Fe >>> 8 & 255, l[58] = Fe >>> 16 & 255, l[59] = Fe >>> 24 & 255, l[60] = Ve >>> 0 & 255, l[61] = Ve >>> 8 & 255, l[62] = Ve >>> 16 & 255, l[63] = Ve >>> 24 & 255;
    }
    function R(l, p, d, a) {
      for (var g = a[0] & 255 | (a[1] & 255) << 8 | (a[2] & 255) << 16 | (a[3] & 255) << 24, S = d[0] & 255 | (d[1] & 255) << 8 | (d[2] & 255) << 16 | (d[3] & 255) << 24, E = d[4] & 255 | (d[5] & 255) << 8 | (d[6] & 255) << 16 | (d[7] & 255) << 24, U = d[8] & 255 | (d[9] & 255) << 8 | (d[10] & 255) << 16 | (d[11] & 255) << 24, z = d[12] & 255 | (d[13] & 255) << 8 | (d[14] & 255) << 16 | (d[15] & 255) << 24, me = a[4] & 255 | (a[5] & 255) << 8 | (a[6] & 255) << 16 | (a[7] & 255) << 24, J = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, lt = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, ae = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, ke = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, Ce = a[8] & 255 | (a[9] & 255) << 8 | (a[10] & 255) << 16 | (a[11] & 255) << 24, $e = d[16] & 255 | (d[17] & 255) << 8 | (d[18] & 255) << 16 | (d[19] & 255) << 24, Re = d[20] & 255 | (d[21] & 255) << 8 | (d[22] & 255) << 16 | (d[23] & 255) << 24, Be = d[24] & 255 | (d[25] & 255) << 8 | (d[26] & 255) << 16 | (d[27] & 255) << 24, Ne = d[28] & 255 | (d[29] & 255) << 8 | (d[30] & 255) << 16 | (d[31] & 255) << 24, Oe = a[12] & 255 | (a[13] & 255) << 8 | (a[14] & 255) << 16 | (a[15] & 255) << 24, he = g, xe = S, te = E, de = U, ge = z, Y = me, C = J, B = lt, V = ae, j = ke, D = Ce, L = $e, Se = Re, Me = Be, Fe = Ne, Ve = Oe, w, We = 0; We < 20; We += 2)
        w = he + Se | 0, ge ^= w << 7 | w >>> 25, w = ge + he | 0, V ^= w << 9 | w >>> 23, w = V + ge | 0, Se ^= w << 13 | w >>> 19, w = Se + V | 0, he ^= w << 18 | w >>> 14, w = Y + xe | 0, j ^= w << 7 | w >>> 25, w = j + Y | 0, Me ^= w << 9 | w >>> 23, w = Me + j | 0, xe ^= w << 13 | w >>> 19, w = xe + Me | 0, Y ^= w << 18 | w >>> 14, w = D + C | 0, Fe ^= w << 7 | w >>> 25, w = Fe + D | 0, te ^= w << 9 | w >>> 23, w = te + Fe | 0, C ^= w << 13 | w >>> 19, w = C + te | 0, D ^= w << 18 | w >>> 14, w = Ve + L | 0, de ^= w << 7 | w >>> 25, w = de + Ve | 0, B ^= w << 9 | w >>> 23, w = B + de | 0, L ^= w << 13 | w >>> 19, w = L + B | 0, Ve ^= w << 18 | w >>> 14, w = he + de | 0, xe ^= w << 7 | w >>> 25, w = xe + he | 0, te ^= w << 9 | w >>> 23, w = te + xe | 0, de ^= w << 13 | w >>> 19, w = de + te | 0, he ^= w << 18 | w >>> 14, w = Y + ge | 0, C ^= w << 7 | w >>> 25, w = C + Y | 0, B ^= w << 9 | w >>> 23, w = B + C | 0, ge ^= w << 13 | w >>> 19, w = ge + B | 0, Y ^= w << 18 | w >>> 14, w = D + j | 0, L ^= w << 7 | w >>> 25, w = L + D | 0, V ^= w << 9 | w >>> 23, w = V + L | 0, j ^= w << 13 | w >>> 19, w = j + V | 0, D ^= w << 18 | w >>> 14, w = Ve + Fe | 0, Se ^= w << 7 | w >>> 25, w = Se + Ve | 0, Me ^= w << 9 | w >>> 23, w = Me + Se | 0, Fe ^= w << 13 | w >>> 19, w = Fe + Me | 0, Ve ^= w << 18 | w >>> 14;
      l[0] = he >>> 0 & 255, l[1] = he >>> 8 & 255, l[2] = he >>> 16 & 255, l[3] = he >>> 24 & 255, l[4] = Y >>> 0 & 255, l[5] = Y >>> 8 & 255, l[6] = Y >>> 16 & 255, l[7] = Y >>> 24 & 255, l[8] = D >>> 0 & 255, l[9] = D >>> 8 & 255, l[10] = D >>> 16 & 255, l[11] = D >>> 24 & 255, l[12] = Ve >>> 0 & 255, l[13] = Ve >>> 8 & 255, l[14] = Ve >>> 16 & 255, l[15] = Ve >>> 24 & 255, l[16] = C >>> 0 & 255, l[17] = C >>> 8 & 255, l[18] = C >>> 16 & 255, l[19] = C >>> 24 & 255, l[20] = B >>> 0 & 255, l[21] = B >>> 8 & 255, l[22] = B >>> 16 & 255, l[23] = B >>> 24 & 255, l[24] = V >>> 0 & 255, l[25] = V >>> 8 & 255, l[26] = V >>> 16 & 255, l[27] = V >>> 24 & 255, l[28] = j >>> 0 & 255, l[29] = j >>> 8 & 255, l[30] = j >>> 16 & 255, l[31] = j >>> 24 & 255;
    }
    function ce(l, p, d, a) {
      P(l, p, d, a);
    }
    function ze(l, p, d, a) {
      R(l, p, d, a);
    }
    var Je = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
    function Pe(l, p, d, a, g, S, E) {
      var U = new Uint8Array(16), z = new Uint8Array(64), me, J;
      for (J = 0; J < 16; J++) U[J] = 0;
      for (J = 0; J < 8; J++) U[J] = S[J];
      for (; g >= 64; ) {
        for (ce(z, U, E, Je), J = 0; J < 64; J++) l[p + J] = d[a + J] ^ z[J];
        for (me = 1, J = 8; J < 16; J++)
          me = me + (U[J] & 255) | 0, U[J] = me & 255, me >>>= 8;
        g -= 64, p += 64, a += 64;
      }
      if (g > 0)
        for (ce(z, U, E, Je), J = 0; J < g; J++) l[p + J] = d[a + J] ^ z[J];
      return 0;
    }
    function re(l, p, d, a, g) {
      var S = new Uint8Array(16), E = new Uint8Array(64), U, z;
      for (z = 0; z < 16; z++) S[z] = 0;
      for (z = 0; z < 8; z++) S[z] = a[z];
      for (; d >= 64; ) {
        for (ce(E, S, g, Je), z = 0; z < 64; z++) l[p + z] = E[z];
        for (U = 1, z = 8; z < 16; z++)
          U = U + (S[z] & 255) | 0, S[z] = U & 255, U >>>= 8;
        d -= 64, p += 64;
      }
      if (d > 0)
        for (ce(E, S, g, Je), z = 0; z < d; z++) l[p + z] = E[z];
      return 0;
    }
    function pe(l, p, d, a, g) {
      var S = new Uint8Array(32);
      ze(S, a, g, Je);
      for (var E = new Uint8Array(8), U = 0; U < 8; U++) E[U] = a[U + 16];
      return re(l, p, d, E, S);
    }
    function we(l, p, d, a, g, S, E) {
      var U = new Uint8Array(32);
      ze(U, S, E, Je);
      for (var z = new Uint8Array(8), me = 0; me < 8; me++) z[me] = S[me + 16];
      return Pe(l, p, d, a, g, z, U);
    }
    var Ge = function(l) {
      this.buffer = new Uint8Array(16), this.r = new Uint16Array(10), this.h = new Uint16Array(10), this.pad = new Uint16Array(8), this.leftover = 0, this.fin = 0;
      var p, d, a, g, S, E, U, z;
      p = l[0] & 255 | (l[1] & 255) << 8, this.r[0] = p & 8191, d = l[2] & 255 | (l[3] & 255) << 8, this.r[1] = (p >>> 13 | d << 3) & 8191, a = l[4] & 255 | (l[5] & 255) << 8, this.r[2] = (d >>> 10 | a << 6) & 7939, g = l[6] & 255 | (l[7] & 255) << 8, this.r[3] = (a >>> 7 | g << 9) & 8191, S = l[8] & 255 | (l[9] & 255) << 8, this.r[4] = (g >>> 4 | S << 12) & 255, this.r[5] = S >>> 1 & 8190, E = l[10] & 255 | (l[11] & 255) << 8, this.r[6] = (S >>> 14 | E << 2) & 8191, U = l[12] & 255 | (l[13] & 255) << 8, this.r[7] = (E >>> 11 | U << 5) & 8065, z = l[14] & 255 | (l[15] & 255) << 8, this.r[8] = (U >>> 8 | z << 8) & 8191, this.r[9] = z >>> 5 & 127, this.pad[0] = l[16] & 255 | (l[17] & 255) << 8, this.pad[1] = l[18] & 255 | (l[19] & 255) << 8, this.pad[2] = l[20] & 255 | (l[21] & 255) << 8, this.pad[3] = l[22] & 255 | (l[23] & 255) << 8, this.pad[4] = l[24] & 255 | (l[25] & 255) << 8, this.pad[5] = l[26] & 255 | (l[27] & 255) << 8, this.pad[6] = l[28] & 255 | (l[29] & 255) << 8, this.pad[7] = l[30] & 255 | (l[31] & 255) << 8;
    };
    Ge.prototype.blocks = function(l, p, d) {
      for (var a = this.fin ? 0 : 2048, g, S, E, U, z, me, J, lt, ae, ke, Ce, $e, Re, Be, Ne, Oe, he, xe, te, de = this.h[0], ge = this.h[1], Y = this.h[2], C = this.h[3], B = this.h[4], V = this.h[5], j = this.h[6], D = this.h[7], L = this.h[8], Se = this.h[9], Me = this.r[0], Fe = this.r[1], Ve = this.r[2], w = this.r[3], We = this.r[4], ut = this.r[5], ft = this.r[6], Ke = this.r[7], st = this.r[8], ot = this.r[9]; d >= 16; )
        g = l[p + 0] & 255 | (l[p + 1] & 255) << 8, de += g & 8191, S = l[p + 2] & 255 | (l[p + 3] & 255) << 8, ge += (g >>> 13 | S << 3) & 8191, E = l[p + 4] & 255 | (l[p + 5] & 255) << 8, Y += (S >>> 10 | E << 6) & 8191, U = l[p + 6] & 255 | (l[p + 7] & 255) << 8, C += (E >>> 7 | U << 9) & 8191, z = l[p + 8] & 255 | (l[p + 9] & 255) << 8, B += (U >>> 4 | z << 12) & 8191, V += z >>> 1 & 8191, me = l[p + 10] & 255 | (l[p + 11] & 255) << 8, j += (z >>> 14 | me << 2) & 8191, J = l[p + 12] & 255 | (l[p + 13] & 255) << 8, D += (me >>> 11 | J << 5) & 8191, lt = l[p + 14] & 255 | (l[p + 15] & 255) << 8, L += (J >>> 8 | lt << 8) & 8191, Se += lt >>> 5 | a, ae = 0, ke = ae, ke += de * Me, ke += ge * (5 * ot), ke += Y * (5 * st), ke += C * (5 * Ke), ke += B * (5 * ft), ae = ke >>> 13, ke &= 8191, ke += V * (5 * ut), ke += j * (5 * We), ke += D * (5 * w), ke += L * (5 * Ve), ke += Se * (5 * Fe), ae += ke >>> 13, ke &= 8191, Ce = ae, Ce += de * Fe, Ce += ge * Me, Ce += Y * (5 * ot), Ce += C * (5 * st), Ce += B * (5 * Ke), ae = Ce >>> 13, Ce &= 8191, Ce += V * (5 * ft), Ce += j * (5 * ut), Ce += D * (5 * We), Ce += L * (5 * w), Ce += Se * (5 * Ve), ae += Ce >>> 13, Ce &= 8191, $e = ae, $e += de * Ve, $e += ge * Fe, $e += Y * Me, $e += C * (5 * ot), $e += B * (5 * st), ae = $e >>> 13, $e &= 8191, $e += V * (5 * Ke), $e += j * (5 * ft), $e += D * (5 * ut), $e += L * (5 * We), $e += Se * (5 * w), ae += $e >>> 13, $e &= 8191, Re = ae, Re += de * w, Re += ge * Ve, Re += Y * Fe, Re += C * Me, Re += B * (5 * ot), ae = Re >>> 13, Re &= 8191, Re += V * (5 * st), Re += j * (5 * Ke), Re += D * (5 * ft), Re += L * (5 * ut), Re += Se * (5 * We), ae += Re >>> 13, Re &= 8191, Be = ae, Be += de * We, Be += ge * w, Be += Y * Ve, Be += C * Fe, Be += B * Me, ae = Be >>> 13, Be &= 8191, Be += V * (5 * ot), Be += j * (5 * st), Be += D * (5 * Ke), Be += L * (5 * ft), Be += Se * (5 * ut), ae += Be >>> 13, Be &= 8191, Ne = ae, Ne += de * ut, Ne += ge * We, Ne += Y * w, Ne += C * Ve, Ne += B * Fe, ae = Ne >>> 13, Ne &= 8191, Ne += V * Me, Ne += j * (5 * ot), Ne += D * (5 * st), Ne += L * (5 * Ke), Ne += Se * (5 * ft), ae += Ne >>> 13, Ne &= 8191, Oe = ae, Oe += de * ft, Oe += ge * ut, Oe += Y * We, Oe += C * w, Oe += B * Ve, ae = Oe >>> 13, Oe &= 8191, Oe += V * Fe, Oe += j * Me, Oe += D * (5 * ot), Oe += L * (5 * st), Oe += Se * (5 * Ke), ae += Oe >>> 13, Oe &= 8191, he = ae, he += de * Ke, he += ge * ft, he += Y * ut, he += C * We, he += B * w, ae = he >>> 13, he &= 8191, he += V * Ve, he += j * Fe, he += D * Me, he += L * (5 * ot), he += Se * (5 * st), ae += he >>> 13, he &= 8191, xe = ae, xe += de * st, xe += ge * Ke, xe += Y * ft, xe += C * ut, xe += B * We, ae = xe >>> 13, xe &= 8191, xe += V * w, xe += j * Ve, xe += D * Fe, xe += L * Me, xe += Se * (5 * ot), ae += xe >>> 13, xe &= 8191, te = ae, te += de * ot, te += ge * st, te += Y * Ke, te += C * ft, te += B * ut, ae = te >>> 13, te &= 8191, te += V * We, te += j * w, te += D * Ve, te += L * Fe, te += Se * Me, ae += te >>> 13, te &= 8191, ae = (ae << 2) + ae | 0, ae = ae + ke | 0, ke = ae & 8191, ae = ae >>> 13, Ce += ae, de = ke, ge = Ce, Y = $e, C = Re, B = Be, V = Ne, j = Oe, D = he, L = xe, Se = te, p += 16, d -= 16;
      this.h[0] = de, this.h[1] = ge, this.h[2] = Y, this.h[3] = C, this.h[4] = B, this.h[5] = V, this.h[6] = j, this.h[7] = D, this.h[8] = L, this.h[9] = Se;
    }, Ge.prototype.finish = function(l, p) {
      var d = new Uint16Array(10), a, g, S, E;
      if (this.leftover) {
        for (E = this.leftover, this.buffer[E++] = 1; E < 16; E++) this.buffer[E] = 0;
        this.fin = 1, this.blocks(this.buffer, 0, 16);
      }
      for (a = this.h[1] >>> 13, this.h[1] &= 8191, E = 2; E < 10; E++)
        this.h[E] += a, a = this.h[E] >>> 13, this.h[E] &= 8191;
      for (this.h[0] += a * 5, a = this.h[0] >>> 13, this.h[0] &= 8191, this.h[1] += a, a = this.h[1] >>> 13, this.h[1] &= 8191, this.h[2] += a, d[0] = this.h[0] + 5, a = d[0] >>> 13, d[0] &= 8191, E = 1; E < 10; E++)
        d[E] = this.h[E] + a, a = d[E] >>> 13, d[E] &= 8191;
      for (d[9] -= 8192, g = (a ^ 1) - 1, E = 0; E < 10; E++) d[E] &= g;
      for (g = ~g, E = 0; E < 10; E++) this.h[E] = this.h[E] & g | d[E];
      for (this.h[0] = (this.h[0] | this.h[1] << 13) & 65535, this.h[1] = (this.h[1] >>> 3 | this.h[2] << 10) & 65535, this.h[2] = (this.h[2] >>> 6 | this.h[3] << 7) & 65535, this.h[3] = (this.h[3] >>> 9 | this.h[4] << 4) & 65535, this.h[4] = (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14) & 65535, this.h[5] = (this.h[6] >>> 2 | this.h[7] << 11) & 65535, this.h[6] = (this.h[7] >>> 5 | this.h[8] << 8) & 65535, this.h[7] = (this.h[8] >>> 8 | this.h[9] << 5) & 65535, S = this.h[0] + this.pad[0], this.h[0] = S & 65535, E = 1; E < 8; E++)
        S = (this.h[E] + this.pad[E] | 0) + (S >>> 16) | 0, this.h[E] = S & 65535;
      l[p + 0] = this.h[0] >>> 0 & 255, l[p + 1] = this.h[0] >>> 8 & 255, l[p + 2] = this.h[1] >>> 0 & 255, l[p + 3] = this.h[1] >>> 8 & 255, l[p + 4] = this.h[2] >>> 0 & 255, l[p + 5] = this.h[2] >>> 8 & 255, l[p + 6] = this.h[3] >>> 0 & 255, l[p + 7] = this.h[3] >>> 8 & 255, l[p + 8] = this.h[4] >>> 0 & 255, l[p + 9] = this.h[4] >>> 8 & 255, l[p + 10] = this.h[5] >>> 0 & 255, l[p + 11] = this.h[5] >>> 8 & 255, l[p + 12] = this.h[6] >>> 0 & 255, l[p + 13] = this.h[6] >>> 8 & 255, l[p + 14] = this.h[7] >>> 0 & 255, l[p + 15] = this.h[7] >>> 8 & 255;
    }, Ge.prototype.update = function(l, p, d) {
      var a, g;
      if (this.leftover) {
        for (g = 16 - this.leftover, g > d && (g = d), a = 0; a < g; a++)
          this.buffer[this.leftover + a] = l[p + a];
        if (d -= g, p += g, this.leftover += g, this.leftover < 16)
          return;
        this.blocks(this.buffer, 0, 16), this.leftover = 0;
      }
      if (d >= 16 && (g = d - d % 16, this.blocks(l, p, g), p += g, d -= g), d) {
        for (a = 0; a < d; a++)
          this.buffer[this.leftover + a] = l[p + a];
        this.leftover += d;
      }
    };
    function bt(l, p, d, a, g, S) {
      var E = new Ge(S);
      return E.update(d, a, g), E.finish(l, p), 0;
    }
    function Tt(l, p, d, a, g, S) {
      var E = new Uint8Array(16);
      return bt(E, 0, d, a, g, S), O(l, p, E, 0);
    }
    function Et(l, p, d, a, g) {
      var S;
      if (d < 32) return -1;
      for (we(l, 0, p, 0, d, a, g), bt(l, 16, l, 32, d - 32, l), S = 0; S < 16; S++) l[S] = 0;
      return 0;
    }
    function ht(l, p, d, a, g) {
      var S, E = new Uint8Array(32);
      if (d < 32 || (pe(E, 0, 32, a, g), Tt(p, 16, p, 32, d - 32, E) !== 0)) return -1;
      for (we(l, 0, p, 0, d, a, g), S = 0; S < 32; S++) l[S] = 0;
      return 0;
    }
    function Qe(l, p) {
      var d;
      for (d = 0; d < 16; d++) l[d] = p[d] | 0;
    }
    function se(l) {
      var p, d, a = 1;
      for (p = 0; p < 16; p++)
        d = l[p] + a + 65535, a = Math.floor(d / 65536), l[p] = d - a * 65536;
      l[0] += a - 1 + 37 * (a - 1);
    }
    function _e(l, p, d) {
      for (var a, g = ~(d - 1), S = 0; S < 16; S++)
        a = g & (l[S] ^ p[S]), l[S] ^= a, p[S] ^= a;
    }
    function yt(l, p) {
      var d, a, g, S = t(), E = t();
      for (d = 0; d < 16; d++) E[d] = p[d];
      for (se(E), se(E), se(E), a = 0; a < 2; a++) {
        for (S[0] = E[0] - 65517, d = 1; d < 15; d++)
          S[d] = E[d] - 65535 - (S[d - 1] >> 16 & 1), S[d - 1] &= 65535;
        S[15] = E[15] - 32767 - (S[14] >> 16 & 1), g = S[15] >> 16 & 1, S[14] &= 65535, _e(E, S, 1 - g);
      }
      for (d = 0; d < 16; d++)
        l[2 * d] = E[d] & 255, l[2 * d + 1] = E[d] >> 8;
    }
    function Ut(l, p) {
      var d = new Uint8Array(32), a = new Uint8Array(32);
      return yt(d, l), yt(a, p), I(d, 0, a, 0);
    }
    function Dt(l) {
      var p = new Uint8Array(32);
      return yt(p, l), p[0] & 1;
    }
    function le(l, p) {
      var d;
      for (d = 0; d < 16; d++) l[d] = p[2 * d] + (p[2 * d + 1] << 8);
      l[15] &= 32767;
    }
    function it(l, p, d) {
      for (var a = 0; a < 16; a++) l[a] = p[a] + d[a];
    }
    function gt(l, p, d) {
      for (var a = 0; a < 16; a++) l[a] = p[a] - d[a];
    }
    function Q(l, p, d) {
      var a, g, S = 0, E = 0, U = 0, z = 0, me = 0, J = 0, lt = 0, ae = 0, ke = 0, Ce = 0, $e = 0, Re = 0, Be = 0, Ne = 0, Oe = 0, he = 0, xe = 0, te = 0, de = 0, ge = 0, Y = 0, C = 0, B = 0, V = 0, j = 0, D = 0, L = 0, Se = 0, Me = 0, Fe = 0, Ve = 0, w = d[0], We = d[1], ut = d[2], ft = d[3], Ke = d[4], st = d[5], ot = d[6], $t = d[7], mt = d[8], Nt = d[9], Pt = d[10], jt = d[11], Lt = d[12], Qt = d[13], er = d[14], tr = d[15];
      a = p[0], S += a * w, E += a * We, U += a * ut, z += a * ft, me += a * Ke, J += a * st, lt += a * ot, ae += a * $t, ke += a * mt, Ce += a * Nt, $e += a * Pt, Re += a * jt, Be += a * Lt, Ne += a * Qt, Oe += a * er, he += a * tr, a = p[1], E += a * w, U += a * We, z += a * ut, me += a * ft, J += a * Ke, lt += a * st, ae += a * ot, ke += a * $t, Ce += a * mt, $e += a * Nt, Re += a * Pt, Be += a * jt, Ne += a * Lt, Oe += a * Qt, he += a * er, xe += a * tr, a = p[2], U += a * w, z += a * We, me += a * ut, J += a * ft, lt += a * Ke, ae += a * st, ke += a * ot, Ce += a * $t, $e += a * mt, Re += a * Nt, Be += a * Pt, Ne += a * jt, Oe += a * Lt, he += a * Qt, xe += a * er, te += a * tr, a = p[3], z += a * w, me += a * We, J += a * ut, lt += a * ft, ae += a * Ke, ke += a * st, Ce += a * ot, $e += a * $t, Re += a * mt, Be += a * Nt, Ne += a * Pt, Oe += a * jt, he += a * Lt, xe += a * Qt, te += a * er, de += a * tr, a = p[4], me += a * w, J += a * We, lt += a * ut, ae += a * ft, ke += a * Ke, Ce += a * st, $e += a * ot, Re += a * $t, Be += a * mt, Ne += a * Nt, Oe += a * Pt, he += a * jt, xe += a * Lt, te += a * Qt, de += a * er, ge += a * tr, a = p[5], J += a * w, lt += a * We, ae += a * ut, ke += a * ft, Ce += a * Ke, $e += a * st, Re += a * ot, Be += a * $t, Ne += a * mt, Oe += a * Nt, he += a * Pt, xe += a * jt, te += a * Lt, de += a * Qt, ge += a * er, Y += a * tr, a = p[6], lt += a * w, ae += a * We, ke += a * ut, Ce += a * ft, $e += a * Ke, Re += a * st, Be += a * ot, Ne += a * $t, Oe += a * mt, he += a * Nt, xe += a * Pt, te += a * jt, de += a * Lt, ge += a * Qt, Y += a * er, C += a * tr, a = p[7], ae += a * w, ke += a * We, Ce += a * ut, $e += a * ft, Re += a * Ke, Be += a * st, Ne += a * ot, Oe += a * $t, he += a * mt, xe += a * Nt, te += a * Pt, de += a * jt, ge += a * Lt, Y += a * Qt, C += a * er, B += a * tr, a = p[8], ke += a * w, Ce += a * We, $e += a * ut, Re += a * ft, Be += a * Ke, Ne += a * st, Oe += a * ot, he += a * $t, xe += a * mt, te += a * Nt, de += a * Pt, ge += a * jt, Y += a * Lt, C += a * Qt, B += a * er, V += a * tr, a = p[9], Ce += a * w, $e += a * We, Re += a * ut, Be += a * ft, Ne += a * Ke, Oe += a * st, he += a * ot, xe += a * $t, te += a * mt, de += a * Nt, ge += a * Pt, Y += a * jt, C += a * Lt, B += a * Qt, V += a * er, j += a * tr, a = p[10], $e += a * w, Re += a * We, Be += a * ut, Ne += a * ft, Oe += a * Ke, he += a * st, xe += a * ot, te += a * $t, de += a * mt, ge += a * Nt, Y += a * Pt, C += a * jt, B += a * Lt, V += a * Qt, j += a * er, D += a * tr, a = p[11], Re += a * w, Be += a * We, Ne += a * ut, Oe += a * ft, he += a * Ke, xe += a * st, te += a * ot, de += a * $t, ge += a * mt, Y += a * Nt, C += a * Pt, B += a * jt, V += a * Lt, j += a * Qt, D += a * er, L += a * tr, a = p[12], Be += a * w, Ne += a * We, Oe += a * ut, he += a * ft, xe += a * Ke, te += a * st, de += a * ot, ge += a * $t, Y += a * mt, C += a * Nt, B += a * Pt, V += a * jt, j += a * Lt, D += a * Qt, L += a * er, Se += a * tr, a = p[13], Ne += a * w, Oe += a * We, he += a * ut, xe += a * ft, te += a * Ke, de += a * st, ge += a * ot, Y += a * $t, C += a * mt, B += a * Nt, V += a * Pt, j += a * jt, D += a * Lt, L += a * Qt, Se += a * er, Me += a * tr, a = p[14], Oe += a * w, he += a * We, xe += a * ut, te += a * ft, de += a * Ke, ge += a * st, Y += a * ot, C += a * $t, B += a * mt, V += a * Nt, j += a * Pt, D += a * jt, L += a * Lt, Se += a * Qt, Me += a * er, Fe += a * tr, a = p[15], he += a * w, xe += a * We, te += a * ut, de += a * ft, ge += a * Ke, Y += a * st, C += a * ot, B += a * $t, V += a * mt, j += a * Nt, D += a * Pt, L += a * jt, Se += a * Lt, Me += a * Qt, Fe += a * er, Ve += a * tr, S += 38 * xe, E += 38 * te, U += 38 * de, z += 38 * ge, me += 38 * Y, J += 38 * C, lt += 38 * B, ae += 38 * V, ke += 38 * j, Ce += 38 * D, $e += 38 * L, Re += 38 * Se, Be += 38 * Me, Ne += 38 * Fe, Oe += 38 * Ve, g = 1, a = S + g + 65535, g = Math.floor(a / 65536), S = a - g * 65536, a = E + g + 65535, g = Math.floor(a / 65536), E = a - g * 65536, a = U + g + 65535, g = Math.floor(a / 65536), U = a - g * 65536, a = z + g + 65535, g = Math.floor(a / 65536), z = a - g * 65536, a = me + g + 65535, g = Math.floor(a / 65536), me = a - g * 65536, a = J + g + 65535, g = Math.floor(a / 65536), J = a - g * 65536, a = lt + g + 65535, g = Math.floor(a / 65536), lt = a - g * 65536, a = ae + g + 65535, g = Math.floor(a / 65536), ae = a - g * 65536, a = ke + g + 65535, g = Math.floor(a / 65536), ke = a - g * 65536, a = Ce + g + 65535, g = Math.floor(a / 65536), Ce = a - g * 65536, a = $e + g + 65535, g = Math.floor(a / 65536), $e = a - g * 65536, a = Re + g + 65535, g = Math.floor(a / 65536), Re = a - g * 65536, a = Be + g + 65535, g = Math.floor(a / 65536), Be = a - g * 65536, a = Ne + g + 65535, g = Math.floor(a / 65536), Ne = a - g * 65536, a = Oe + g + 65535, g = Math.floor(a / 65536), Oe = a - g * 65536, a = he + g + 65535, g = Math.floor(a / 65536), he = a - g * 65536, S += g - 1 + 37 * (g - 1), g = 1, a = S + g + 65535, g = Math.floor(a / 65536), S = a - g * 65536, a = E + g + 65535, g = Math.floor(a / 65536), E = a - g * 65536, a = U + g + 65535, g = Math.floor(a / 65536), U = a - g * 65536, a = z + g + 65535, g = Math.floor(a / 65536), z = a - g * 65536, a = me + g + 65535, g = Math.floor(a / 65536), me = a - g * 65536, a = J + g + 65535, g = Math.floor(a / 65536), J = a - g * 65536, a = lt + g + 65535, g = Math.floor(a / 65536), lt = a - g * 65536, a = ae + g + 65535, g = Math.floor(a / 65536), ae = a - g * 65536, a = ke + g + 65535, g = Math.floor(a / 65536), ke = a - g * 65536, a = Ce + g + 65535, g = Math.floor(a / 65536), Ce = a - g * 65536, a = $e + g + 65535, g = Math.floor(a / 65536), $e = a - g * 65536, a = Re + g + 65535, g = Math.floor(a / 65536), Re = a - g * 65536, a = Be + g + 65535, g = Math.floor(a / 65536), Be = a - g * 65536, a = Ne + g + 65535, g = Math.floor(a / 65536), Ne = a - g * 65536, a = Oe + g + 65535, g = Math.floor(a / 65536), Oe = a - g * 65536, a = he + g + 65535, g = Math.floor(a / 65536), he = a - g * 65536, S += g - 1 + 37 * (g - 1), l[0] = S, l[1] = E, l[2] = U, l[3] = z, l[4] = me, l[5] = J, l[6] = lt, l[7] = ae, l[8] = ke, l[9] = Ce, l[10] = $e, l[11] = Re, l[12] = Be, l[13] = Ne, l[14] = Oe, l[15] = he;
    }
    function dt(l, p) {
      Q(l, p, p);
    }
    function Vt(l, p) {
      var d = t(), a;
      for (a = 0; a < 16; a++) d[a] = p[a];
      for (a = 253; a >= 0; a--)
        dt(d, d), a !== 2 && a !== 4 && Q(d, d, p);
      for (a = 0; a < 16; a++) l[a] = d[a];
    }
    function ds(l, p) {
      var d = t(), a;
      for (a = 0; a < 16; a++) d[a] = p[a];
      for (a = 250; a >= 0; a--)
        dt(d, d), a !== 1 && Q(d, d, p);
      for (a = 0; a < 16; a++) l[a] = d[a];
    }
    function Oi(l, p, d) {
      var a = new Uint8Array(32), g = new Float64Array(80), S, E, U = t(), z = t(), me = t(), J = t(), lt = t(), ae = t();
      for (E = 0; E < 31; E++) a[E] = p[E];
      for (a[31] = p[31] & 127 | 64, a[0] &= 248, le(g, d), E = 0; E < 16; E++)
        z[E] = g[E], J[E] = U[E] = me[E] = 0;
      for (U[0] = J[0] = 1, E = 254; E >= 0; --E)
        S = a[E >>> 3] >>> (E & 7) & 1, _e(U, z, S), _e(me, J, S), it(lt, U, me), gt(U, U, me), it(me, z, J), gt(z, z, J), dt(J, lt), dt(ae, U), Q(U, me, U), Q(me, z, lt), it(lt, U, me), gt(U, U, me), dt(z, U), gt(me, J, ae), Q(U, me, u), it(U, U, J), Q(me, me, U), Q(U, J, ae), Q(J, z, g), dt(z, lt), _e(U, z, S), _e(me, J, S);
      for (E = 0; E < 16; E++)
        g[E + 16] = U[E], g[E + 32] = me[E], g[E + 48] = z[E], g[E + 64] = J[E];
      var ke = g.subarray(32), Ce = g.subarray(16);
      return Vt(ke, ke), Q(Ce, Ce, ke), yt(l, Ce), 0;
    }
    function or(l, p) {
      return Oi(l, p, s);
    }
    function ps(l, p) {
      return n(p, 32), or(l, p);
    }
    function yn(l, p, d) {
      var a = new Uint8Array(32);
      return Oi(a, d, p), ze(l, i, a, Je);
    }
    var ys = Et, Hc = ht;
    function gs(l, p, d, a, g, S) {
      var E = new Uint8Array(32);
      return yn(E, g, S), ys(l, p, d, a, E);
    }
    function No(l, p, d, a, g, S) {
      var E = new Uint8Array(32);
      return yn(E, g, S), Hc(l, p, d, a, E);
    }
    var vs = [
      1116352408,
      3609767458,
      1899447441,
      602891725,
      3049323471,
      3964484399,
      3921009573,
      2173295548,
      961987163,
      4081628472,
      1508970993,
      3053834265,
      2453635748,
      2937671579,
      2870763221,
      3664609560,
      3624381080,
      2734883394,
      310598401,
      1164996542,
      607225278,
      1323610764,
      1426881987,
      3590304994,
      1925078388,
      4068182383,
      2162078206,
      991336113,
      2614888103,
      633803317,
      3248222580,
      3479774868,
      3835390401,
      2666613458,
      4022224774,
      944711139,
      264347078,
      2341262773,
      604807628,
      2007800933,
      770255983,
      1495990901,
      1249150122,
      1856431235,
      1555081692,
      3175218132,
      1996064986,
      2198950837,
      2554220882,
      3999719339,
      2821834349,
      766784016,
      2952996808,
      2566594879,
      3210313671,
      3203337956,
      3336571891,
      1034457026,
      3584528711,
      2466948901,
      113926993,
      3758326383,
      338241895,
      168717936,
      666307205,
      1188179964,
      773529912,
      1546045734,
      1294757372,
      1522805485,
      1396182291,
      2643833823,
      1695183700,
      2343527390,
      1986661051,
      1014477480,
      2177026350,
      1206759142,
      2456956037,
      344077627,
      2730485921,
      1290863460,
      2820302411,
      3158454273,
      3259730800,
      3505952657,
      3345764771,
      106217008,
      3516065817,
      3606008344,
      3600352804,
      1432725776,
      4094571909,
      1467031594,
      275423344,
      851169720,
      430227734,
      3100823752,
      506948616,
      1363258195,
      659060556,
      3750685593,
      883997877,
      3785050280,
      958139571,
      3318307427,
      1322822218,
      3812723403,
      1537002063,
      2003034995,
      1747873779,
      3602036899,
      1955562222,
      1575990012,
      2024104815,
      1125592928,
      2227730452,
      2716904306,
      2361852424,
      442776044,
      2428436474,
      593698344,
      2756734187,
      3733110249,
      3204031479,
      2999351573,
      3329325298,
      3815920427,
      3391569614,
      3928383900,
      3515267271,
      566280711,
      3940187606,
      3454069534,
      4118630271,
      4000239992,
      116418474,
      1914138554,
      174292421,
      2731055270,
      289380356,
      3203993006,
      460393269,
      320620315,
      685471733,
      587496836,
      852142971,
      1086792851,
      1017036298,
      365543100,
      1126000580,
      2618297676,
      1288033470,
      3409855158,
      1501505948,
      4234509866,
      1607167915,
      987167468,
      1816402316,
      1246189591
    ];
    function ms(l, p, d, a) {
      for (var g = new Int32Array(16), S = new Int32Array(16), E, U, z, me, J, lt, ae, ke, Ce, $e, Re, Be, Ne, Oe, he, xe, te, de, ge, Y, C, B, V, j, D, L, Se = l[0], Me = l[1], Fe = l[2], Ve = l[3], w = l[4], We = l[5], ut = l[6], ft = l[7], Ke = p[0], st = p[1], ot = p[2], $t = p[3], mt = p[4], Nt = p[5], Pt = p[6], jt = p[7], Lt = 0; a >= 128; ) {
        for (ge = 0; ge < 16; ge++)
          Y = 8 * ge + Lt, g[ge] = d[Y + 0] << 24 | d[Y + 1] << 16 | d[Y + 2] << 8 | d[Y + 3], S[ge] = d[Y + 4] << 24 | d[Y + 5] << 16 | d[Y + 6] << 8 | d[Y + 7];
        for (ge = 0; ge < 80; ge++)
          if (E = Se, U = Me, z = Fe, me = Ve, J = w, lt = We, ae = ut, ke = ft, Ce = Ke, $e = st, Re = ot, Be = $t, Ne = mt, Oe = Nt, he = Pt, xe = jt, C = ft, B = jt, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = (w >>> 14 | mt << 18) ^ (w >>> 18 | mt << 14) ^ (mt >>> 9 | w << 23), B = (mt >>> 14 | w << 18) ^ (mt >>> 18 | w << 14) ^ (w >>> 9 | mt << 23), V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, C = w & We ^ ~w & ut, B = mt & Nt ^ ~mt & Pt, V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, C = vs[ge * 2], B = vs[ge * 2 + 1], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, C = g[ge % 16], B = S[ge % 16], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, te = D & 65535 | L << 16, de = V & 65535 | j << 16, C = te, B = de, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = (Se >>> 28 | Ke << 4) ^ (Ke >>> 2 | Se << 30) ^ (Ke >>> 7 | Se << 25), B = (Ke >>> 28 | Se << 4) ^ (Se >>> 2 | Ke << 30) ^ (Se >>> 7 | Ke << 25), V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, C = Se & Me ^ Se & Fe ^ Me & Fe, B = Ke & st ^ Ke & ot ^ st & ot, V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, ke = D & 65535 | L << 16, xe = V & 65535 | j << 16, C = me, B = Be, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = te, B = de, V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, me = D & 65535 | L << 16, Be = V & 65535 | j << 16, Me = E, Fe = U, Ve = z, w = me, We = J, ut = lt, ft = ae, Se = ke, st = Ce, ot = $e, $t = Re, mt = Be, Nt = Ne, Pt = Oe, jt = he, Ke = xe, ge % 16 === 15)
            for (Y = 0; Y < 16; Y++)
              C = g[Y], B = S[Y], V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = g[(Y + 9) % 16], B = S[(Y + 9) % 16], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, te = g[(Y + 1) % 16], de = S[(Y + 1) % 16], C = (te >>> 1 | de << 31) ^ (te >>> 8 | de << 24) ^ te >>> 7, B = (de >>> 1 | te << 31) ^ (de >>> 8 | te << 24) ^ (de >>> 7 | te << 25), V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, te = g[(Y + 14) % 16], de = S[(Y + 14) % 16], C = (te >>> 19 | de << 13) ^ (de >>> 29 | te << 3) ^ te >>> 6, B = (de >>> 19 | te << 13) ^ (te >>> 29 | de << 3) ^ (de >>> 6 | te << 26), V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, g[Y] = D & 65535 | L << 16, S[Y] = V & 65535 | j << 16;
        C = Se, B = Ke, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[0], B = p[0], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[0] = Se = D & 65535 | L << 16, p[0] = Ke = V & 65535 | j << 16, C = Me, B = st, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[1], B = p[1], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[1] = Me = D & 65535 | L << 16, p[1] = st = V & 65535 | j << 16, C = Fe, B = ot, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[2], B = p[2], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[2] = Fe = D & 65535 | L << 16, p[2] = ot = V & 65535 | j << 16, C = Ve, B = $t, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[3], B = p[3], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[3] = Ve = D & 65535 | L << 16, p[3] = $t = V & 65535 | j << 16, C = w, B = mt, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[4], B = p[4], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[4] = w = D & 65535 | L << 16, p[4] = mt = V & 65535 | j << 16, C = We, B = Nt, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[5], B = p[5], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[5] = We = D & 65535 | L << 16, p[5] = Nt = V & 65535 | j << 16, C = ut, B = Pt, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[6], B = p[6], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[6] = ut = D & 65535 | L << 16, p[6] = Pt = V & 65535 | j << 16, C = ft, B = jt, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[7], B = p[7], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[7] = ft = D & 65535 | L << 16, p[7] = jt = V & 65535 | j << 16, Lt += 128, a -= 128;
      }
      return a;
    }
    function Zr(l, p, d) {
      var a = new Int32Array(8), g = new Int32Array(8), S = new Uint8Array(256), E, U = d;
      for (a[0] = 1779033703, a[1] = 3144134277, a[2] = 1013904242, a[3] = 2773480762, a[4] = 1359893119, a[5] = 2600822924, a[6] = 528734635, a[7] = 1541459225, g[0] = 4089235720, g[1] = 2227873595, g[2] = 4271175723, g[3] = 1595750129, g[4] = 2917565137, g[5] = 725511199, g[6] = 4215389547, g[7] = 327033209, ms(a, g, p, d), d %= 128, E = 0; E < d; E++) S[E] = p[U - d + E];
      for (S[d] = 128, d = 256 - 128 * (d < 112 ? 1 : 0), S[d - 9] = 0, v(S, d - 8, U / 536870912 | 0, U << 3), ms(a, g, S, d), E = 0; E < 8; E++) v(l, 8 * E, a[E], g[E]);
      return 0;
    }
    function Qn(l, p) {
      var d = t(), a = t(), g = t(), S = t(), E = t(), U = t(), z = t(), me = t(), J = t();
      gt(d, l[1], l[0]), gt(J, p[1], p[0]), Q(d, d, J), it(a, l[0], l[1]), it(J, p[0], p[1]), Q(a, a, J), Q(g, l[3], p[3]), Q(g, g, m), Q(S, l[2], p[2]), it(S, S, S), gt(E, a, d), gt(U, S, g), it(z, S, g), it(me, a, d), Q(l[0], E, U), Q(l[1], me, z), Q(l[2], z, U), Q(l[3], E, me);
    }
    function Ti(l, p, d) {
      var a;
      for (a = 0; a < 4; a++)
        _e(l[a], p[a], d);
    }
    function ws(l, p) {
      var d = t(), a = t(), g = t();
      Vt(g, p[2]), Q(d, p[0], g), Q(a, p[1], g), yt(l, a), l[31] ^= Dt(d) << 7;
    }
    function bs(l, p, d) {
      var a, g;
      for (Qe(l[0], o), Qe(l[1], c), Qe(l[2], c), Qe(l[3], o), g = 255; g >= 0; --g)
        a = d[g / 8 | 0] >> (g & 7) & 1, Ti(l, p, a), Qn(p, l), Qn(l, l), Ti(l, p, a);
    }
    function Ni(l, p) {
      var d = [t(), t(), t(), t()];
      Qe(d[0], x), Qe(d[1], G), Qe(d[2], c), Q(d[3], x, G), bs(l, d, p);
    }
    function xs(l, p, d) {
      var a = new Uint8Array(64), g = [t(), t(), t(), t()], S;
      for (d || n(p, 32), Zr(a, p, 32), a[0] &= 248, a[31] &= 127, a[31] |= 64, Ni(g, a), ws(l, g), S = 0; S < 32; S++) p[S + 32] = l[S];
      return 0;
    }
    var Wr = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);
    function As(l, p) {
      var d, a, g, S;
      for (a = 63; a >= 32; --a) {
        for (d = 0, g = a - 32, S = a - 12; g < S; ++g)
          p[g] += d - 16 * p[a] * Wr[g - (a - 32)], d = Math.floor((p[g] + 128) / 256), p[g] -= d * 256;
        p[g] += d, p[a] = 0;
      }
      for (d = 0, g = 0; g < 32; g++)
        p[g] += d - (p[31] >> 4) * Wr[g], d = p[g] >> 8, p[g] &= 255;
      for (g = 0; g < 32; g++) p[g] -= d * Wr[g];
      for (a = 0; a < 32; a++)
        p[a + 1] += p[a] >> 8, l[a] = p[a] & 255;
    }
    function Ss(l) {
      var p = new Float64Array(64), d;
      for (d = 0; d < 64; d++) p[d] = l[d];
      for (d = 0; d < 64; d++) l[d] = 0;
      As(l, p);
    }
    function Po(l, p, d, a) {
      var g = new Uint8Array(64), S = new Uint8Array(64), E = new Uint8Array(64), U, z, me = new Float64Array(64), J = [t(), t(), t(), t()];
      Zr(g, a, 32), g[0] &= 248, g[31] &= 127, g[31] |= 64;
      var lt = d + 64;
      for (U = 0; U < d; U++) l[64 + U] = p[U];
      for (U = 0; U < 32; U++) l[32 + U] = g[32 + U];
      for (Zr(E, l.subarray(32), d + 32), Ss(E), Ni(J, E), ws(l, J), U = 32; U < 64; U++) l[U] = a[U];
      for (Zr(S, l, d + 64), Ss(S), U = 0; U < 64; U++) me[U] = 0;
      for (U = 0; U < 32; U++) me[U] = E[U];
      for (U = 0; U < 32; U++)
        for (z = 0; z < 32; z++)
          me[U + z] += S[U] * g[z];
      return As(l.subarray(32), me), lt;
    }
    function _s(l, p) {
      var d = t(), a = t(), g = t(), S = t(), E = t(), U = t(), z = t();
      return Qe(l[2], c), le(l[1], p), dt(g, l[1]), Q(S, g, h), gt(g, g, l[2]), it(S, l[2], S), dt(E, S), dt(U, E), Q(z, U, E), Q(d, z, g), Q(d, d, S), ds(d, d), Q(d, d, g), Q(d, d, S), Q(d, d, S), Q(l[0], d, S), dt(a, l[0]), Q(a, a, S), Ut(a, g) && Q(l[0], l[0], N), dt(a, l[0]), Q(a, a, S), Ut(a, g) ? -1 : (Dt(l[0]) === p[31] >> 7 && gt(l[0], o, l[0]), Q(l[3], l[0], l[1]), 0);
    }
    function _(l, p, d, a) {
      var g, S = new Uint8Array(32), E = new Uint8Array(64), U = [t(), t(), t(), t()], z = [t(), t(), t(), t()];
      if (d < 64 || _s(z, a)) return -1;
      for (g = 0; g < d; g++) l[g] = p[g];
      for (g = 0; g < 32; g++) l[g + 32] = a[g];
      if (Zr(E, l, d), Ss(E), bs(U, z, E), Ni(z, p.subarray(32)), Qn(U, z), ws(S, U), d -= 64, I(p, 0, S, 0)) {
        for (g = 0; g < d; g++) l[g] = 0;
        return -1;
      }
      for (g = 0; g < d; g++) l[g] = p[g + 64];
      return d;
    }
    var k = 32, T = 24, K = 32, be = 16, At = 32, St = 32, je = 32, Z = 32, ee = 32, ue = T, ye = K, Xe = be, tt = 64, vt = 32, zt = 64, Pi = 32, Es = 64;
    e.lowlevel = {
      crypto_core_hsalsa20: ze,
      crypto_stream_xor: we,
      crypto_stream: pe,
      crypto_stream_salsa20_xor: Pe,
      crypto_stream_salsa20: re,
      crypto_onetimeauth: bt,
      crypto_onetimeauth_verify: Tt,
      crypto_verify_16: O,
      crypto_verify_32: I,
      crypto_secretbox: Et,
      crypto_secretbox_open: ht,
      crypto_scalarmult: Oi,
      crypto_scalarmult_base: or,
      crypto_box_beforenm: yn,
      crypto_box_afternm: ys,
      crypto_box: gs,
      crypto_box_open: No,
      crypto_box_keypair: ps,
      crypto_hash: Zr,
      crypto_sign: Po,
      crypto_sign_keypair: xs,
      crypto_sign_open: _,
      crypto_secretbox_KEYBYTES: k,
      crypto_secretbox_NONCEBYTES: T,
      crypto_secretbox_ZEROBYTES: K,
      crypto_secretbox_BOXZEROBYTES: be,
      crypto_scalarmult_BYTES: At,
      crypto_scalarmult_SCALARBYTES: St,
      crypto_box_PUBLICKEYBYTES: je,
      crypto_box_SECRETKEYBYTES: Z,
      crypto_box_BEFORENMBYTES: ee,
      crypto_box_NONCEBYTES: ue,
      crypto_box_ZEROBYTES: ye,
      crypto_box_BOXZEROBYTES: Xe,
      crypto_sign_BYTES: tt,
      crypto_sign_PUBLICKEYBYTES: vt,
      crypto_sign_SECRETKEYBYTES: zt,
      crypto_sign_SEEDBYTES: Pi,
      crypto_hash_BYTES: Es,
      gf: t,
      D: h,
      L: Wr,
      pack25519: yt,
      unpack25519: le,
      M: Q,
      A: it,
      S: dt,
      Z: gt,
      pow2523: ds,
      add: Qn,
      set25519: Qe,
      modL: As,
      scalarmult: bs,
      scalarbase: Ni
    };
    function jo(l, p) {
      if (l.length !== k) throw new Error("bad key size");
      if (p.length !== T) throw new Error("bad nonce size");
    }
    function ng(l, p) {
      if (l.length !== je) throw new Error("bad public key size");
      if (p.length !== Z) throw new Error("bad secret key size");
    }
    function xr() {
      for (var l = 0; l < arguments.length; l++)
        if (!(arguments[l] instanceof Uint8Array))
          throw new TypeError("unexpected type, use Uint8Array");
    }
    function Lf(l) {
      for (var p = 0; p < l.length; p++) l[p] = 0;
    }
    e.randomBytes = function(l) {
      var p = new Uint8Array(l);
      return n(p, l), p;
    }, e.secretbox = function(l, p, d) {
      xr(l, p, d), jo(d, p);
      for (var a = new Uint8Array(K + l.length), g = new Uint8Array(a.length), S = 0; S < l.length; S++) a[S + K] = l[S];
      return Et(g, a, a.length, p, d), g.subarray(be);
    }, e.secretbox.open = function(l, p, d) {
      xr(l, p, d), jo(d, p);
      for (var a = new Uint8Array(be + l.length), g = new Uint8Array(a.length), S = 0; S < l.length; S++) a[S + be] = l[S];
      return a.length < 32 || ht(g, a, a.length, p, d) !== 0 ? null : g.subarray(K);
    }, e.secretbox.keyLength = k, e.secretbox.nonceLength = T, e.secretbox.overheadLength = be, e.scalarMult = function(l, p) {
      if (xr(l, p), l.length !== St) throw new Error("bad n size");
      if (p.length !== At) throw new Error("bad p size");
      var d = new Uint8Array(At);
      return Oi(d, l, p), d;
    }, e.scalarMult.base = function(l) {
      if (xr(l), l.length !== St) throw new Error("bad n size");
      var p = new Uint8Array(At);
      return or(p, l), p;
    }, e.scalarMult.scalarLength = St, e.scalarMult.groupElementLength = At, e.box = function(l, p, d, a) {
      var g = e.box.before(d, a);
      return e.secretbox(l, p, g);
    }, e.box.before = function(l, p) {
      xr(l, p), ng(l, p);
      var d = new Uint8Array(ee);
      return yn(d, l, p), d;
    }, e.box.after = e.secretbox, e.box.open = function(l, p, d, a) {
      var g = e.box.before(d, a);
      return e.secretbox.open(l, p, g);
    }, e.box.open.after = e.secretbox.open, e.box.keyPair = function() {
      var l = new Uint8Array(je), p = new Uint8Array(Z);
      return ps(l, p), { publicKey: l, secretKey: p };
    }, e.box.keyPair.fromSecretKey = function(l) {
      if (xr(l), l.length !== Z)
        throw new Error("bad secret key size");
      var p = new Uint8Array(je);
      return or(p, l), { publicKey: p, secretKey: new Uint8Array(l) };
    }, e.box.publicKeyLength = je, e.box.secretKeyLength = Z, e.box.sharedKeyLength = ee, e.box.nonceLength = ue, e.box.overheadLength = e.secretbox.overheadLength, e.sign = function(l, p) {
      if (xr(l, p), p.length !== zt)
        throw new Error("bad secret key size");
      var d = new Uint8Array(tt + l.length);
      return Po(d, l, l.length, p), d;
    }, e.sign.open = function(l, p) {
      if (xr(l, p), p.length !== vt)
        throw new Error("bad public key size");
      var d = new Uint8Array(l.length), a = _(d, l, l.length, p);
      if (a < 0) return null;
      for (var g = new Uint8Array(a), S = 0; S < g.length; S++) g[S] = d[S];
      return g;
    }, e.sign.detached = function(l, p) {
      for (var d = e.sign(l, p), a = new Uint8Array(tt), g = 0; g < a.length; g++) a[g] = d[g];
      return a;
    }, e.sign.detached.verify = function(l, p, d) {
      if (xr(l, p, d), p.length !== tt)
        throw new Error("bad signature size");
      if (d.length !== vt)
        throw new Error("bad public key size");
      var a = new Uint8Array(tt + l.length), g = new Uint8Array(tt + l.length), S;
      for (S = 0; S < tt; S++) a[S] = p[S];
      for (S = 0; S < l.length; S++) a[S + tt] = l[S];
      return _(g, a, a.length, d) >= 0;
    }, e.sign.keyPair = function() {
      var l = new Uint8Array(vt), p = new Uint8Array(zt);
      return xs(l, p), { publicKey: l, secretKey: p };
    }, e.sign.keyPair.fromSecretKey = function(l) {
      if (xr(l), l.length !== zt)
        throw new Error("bad secret key size");
      for (var p = new Uint8Array(vt), d = 0; d < p.length; d++) p[d] = l[32 + d];
      return { publicKey: p, secretKey: new Uint8Array(l) };
    }, e.sign.keyPair.fromSeed = function(l) {
      if (xr(l), l.length !== Pi)
        throw new Error("bad seed size");
      for (var p = new Uint8Array(vt), d = new Uint8Array(zt), a = 0; a < 32; a++) d[a] = l[a];
      return xs(p, d, !0), { publicKey: p, secretKey: d };
    }, e.sign.publicKeyLength = vt, e.sign.secretKeyLength = zt, e.sign.seedLength = Pi, e.sign.signatureLength = tt, e.hash = function(l) {
      xr(l);
      var p = new Uint8Array(Es);
      return Zr(p, l, l.length), p;
    }, e.hash.hashLength = Es, e.verify = function(l, p) {
      return xr(l, p), l.length === 0 || p.length === 0 || l.length !== p.length ? !1 : A(l, 0, p, 0, l.length) === 0;
    }, e.setPRNG = function(l) {
      n = l;
    }, function() {
      var l = typeof self < "u" ? self.crypto || self.msCrypto : null;
      if (l && l.getRandomValues) {
        var p = 65536;
        e.setPRNG(function(d, a) {
          var g, S = new Uint8Array(a);
          for (g = 0; g < a; g += p)
            l.getRandomValues(S.subarray(g, g + Math.min(a - g, p)));
          for (g = 0; g < a; g++) d[g] = S[g];
          Lf(S);
        });
      } else typeof nw < "u" && (l = ow, l && l.randomBytes && e.setPRNG(function(d, a) {
        var g, S = l.randomBytes(a);
        for (g = 0; g < a; g++) d[g] = S[g];
        Lf(S);
      }));
    }();
  })(r.exports ? r.exports : self.nacl = self.nacl || {});
})(ry);
var aw = ry.exports;
const ny = /* @__PURE__ */ Ag(aw);
function cw() {
  return ny.box.keyPair();
}
async function Ii(r, e) {
  const t = sessionStorage.getItem("sessionKey"), n = sessionStorage.getItem("sessionId");
  console.groupCollapsed("Attestation");
  try {
    if (t && n && !r) {
      const o = Ds(t);
      return console.log("Using existing attestation from session storage."), { sessionKey: o, sessionId: n };
    }
    const i = window.crypto.randomUUID();
    console.log("Generated attestation nonce:", i);
    const s = await rw(i, e);
    if (s && s.public_key) {
      console.log("Attestation document verification succeeded");
      const o = cw();
      console.log("Generated client key pair");
      const c = new Uint8Array(s.public_key), { encrypted_session_key: u, session_id: h } = await Vy(
        Br(o.publicKey),
        i,
        e
      );
      console.log("Key exchange completed.");
      const m = ny.scalarMult(o.secretKey, c), x = Ds(u), G = 12, N = x.slice(0, G), v = x.slice(G), O = new Ru(m).open(N, v);
      if (O)
        return console.log("Session key decrypted successfully"), window.sessionStorage.setItem("sessionKey", Br(O)), window.sessionStorage.setItem("sessionId", h), { sessionKey: O, sessionId: h };
      throw new Error("Failed to decrypt session key");
    } else
      throw new Error("Invalid attestation document");
  } catch (i) {
    throw console.error("Error verifying attestation:", i), i;
  } finally {
    console.groupEnd();
  }
}
let ct = "";
function lw(r) {
  ct = r;
}
async function uw(r, e) {
  return Ot(
    `${ct}/platform/login`,
    "POST",
    { email: r, password: e },
    void 0,
    "Failed to login"
  );
}
async function fw(r, e, t, n) {
  return Ot(
    `${ct}/platform/register`,
    "POST",
    { email: r, password: e, invite_code: t, name: n },
    void 0,
    "Failed to register"
  );
}
async function hw(r) {
  return Ot(
    `${ct}/platform/logout`,
    "POST",
    { refresh_token: r },
    void 0,
    "Failed to logout"
  );
}
async function dw() {
  const r = window.localStorage.getItem("refresh_token");
  if (!r) throw new Error("No refresh token available");
  const e = { refresh_token: r };
  try {
    const t = await Ot(
      `${ct}/platform/refresh`,
      "POST",
      e,
      void 0,
      "Failed to refresh platform token"
    );
    return window.localStorage.setItem("access_token", t.access_token), window.localStorage.setItem("refresh_token", t.refresh_token), t;
  } catch (t) {
    throw console.error("Error refreshing platform token:", t), t;
  }
}
async function iy(r) {
  return Te(
    `${ct}/platform/orgs`,
    "POST",
    { name: r }
  );
}
async function sy() {
  return Te(
    `${ct}/platform/orgs`,
    "GET",
    void 0
  );
}
async function oy(r) {
  return Te(
    `${ct}/platform/orgs/${r}`,
    "DELETE",
    void 0
  );
}
async function ay(r, e, t) {
  return Te(
    `${ct}/platform/orgs/${r}/projects`,
    "POST",
    { name: e, description: t }
  );
}
async function cy(r) {
  return Te(
    `${ct}/platform/orgs/${r}/projects`,
    "GET",
    void 0
  );
}
async function ly(r, e) {
  return Te(
    `${ct}/platform/orgs/${r}/projects/${e}`,
    "GET",
    void 0
  );
}
async function uy(r, e, t) {
  return Te(
    `${ct}/platform/orgs/${r}/projects/${e}`,
    "PATCH",
    t
  );
}
async function fy(r, e) {
  return Te(
    `${ct}/platform/orgs/${r}/projects/${e}`,
    "DELETE",
    void 0
  );
}
function pw(r) {
  const e = /^[A-Za-z0-9+/]*[=]{0,2}$/, t = r.length % 4 === 0, n = e.test(r);
  return t && n;
}
async function hy(r, e, t, n) {
  if (!pw(n))
    throw new Error(
      "Secret must be base64 encoded. Use @stablelib/base64's encode function to encode your data."
    );
  return Te(
    `${ct}/platform/orgs/${r}/projects/${e}/secrets`,
    "POST",
    { key_name: t, secret: n }
  );
}
async function dy(r, e) {
  return Te(
    `${ct}/platform/orgs/${r}/projects/${e}/secrets`,
    "GET",
    void 0
  );
}
async function py(r, e, t) {
  return Te(
    `${ct}/platform/orgs/${r}/projects/${e}/secrets/${t}`,
    "DELETE",
    void 0
  );
}
async function yy(r, e) {
  return Te(
    `${ct}/platform/orgs/${r}/projects/${e}/settings/email`,
    "GET",
    void 0
  );
}
async function gy(r, e, t) {
  return Te(
    `${ct}/platform/orgs/${r}/projects/${e}/settings/email`,
    "PUT",
    t
  );
}
async function vy(r, e) {
  return Te(
    `${ct}/platform/orgs/${r}/projects/${e}/settings/oauth`,
    "GET",
    void 0
  );
}
async function my(r, e, t) {
  return Te(
    `${ct}/platform/orgs/${r}/projects/${e}/settings/oauth`,
    "PUT",
    t
  );
}
async function wy(r, e, t) {
  if (!e || e.trim() === "")
    throw new Error("Email is required");
  return Te(
    `${ct}/platform/orgs/${r}/invites`,
    "POST",
    { email: e, role: t }
  );
}
async function by(r) {
  return Te(
    `${ct}/platform/orgs/${r}/invites`,
    "GET",
    void 0
  );
}
async function xy(r, e) {
  return Te(
    `${ct}/platform/orgs/${r}/invites/${e}`,
    "GET",
    void 0
  );
}
async function Ay(r, e) {
  return Te(
    `${ct}/platform/orgs/${r}/invites/${e}`,
    "DELETE",
    void 0
  );
}
async function Sy(r) {
  return Te(
    `${ct}/platform/orgs/${r}/memberships`,
    "GET",
    void 0
  );
}
async function _y(r, e, t) {
  return Te(
    `${ct}/platform/orgs/${r}/memberships/${e}`,
    "PATCH",
    { role: t }
  );
}
async function Ey(r, e) {
  return Te(
    `${ct}/platform/orgs/${r}/memberships/${e}`,
    "DELETE",
    void 0
  );
}
async function Iy(r) {
  return Te(
    `${ct}/platform/accept_invite/${r}`,
    "POST",
    void 0
  );
}
async function yw() {
  return Te(`${ct}/platform/me`, "GET", void 0);
}
async function ky(r) {
  return Ot(
    `${ct}/platform/verify-email/${r}`,
    "GET",
    void 0,
    void 0,
    "Failed to verify email"
  );
}
async function La() {
  return Te(
    `${ct}/platform/request_verification`,
    "POST",
    void 0,
    "Failed to request new verification code"
  );
}
async function Cy(r, e) {
  const t = {
    email: r,
    hashed_secret: e
  };
  return Ot(
    `${ct}/platform/password-reset/request`,
    "POST",
    t,
    void 0,
    "Failed to request platform password reset"
  );
}
async function By(r, e, t, n) {
  const i = {
    email: r,
    alphanumeric_code: e,
    plaintext_secret: t,
    new_password: n
  };
  return Ot(
    `${ct}/platform/password-reset/confirm`,
    "POST",
    i,
    void 0,
    "Failed to confirm platform password reset"
  );
}
async function Oy(r, e) {
  const t = {
    current_password: r,
    new_password: e
  };
  return Te(
    `${ct}/platform/change-password`,
    "POST",
    t,
    "Failed to change platform password"
  );
}
async function Te(r, e, t, n) {
  const i = async (s = !1) => {
    try {
      if (s) {
        console.log("Refreshing access token");
        const u = Ko.getRefreshFunction(r);
        console.log(`Using ${u}`), u === "platformRefreshToken" ? await dw() : await To();
      }
      const o = window.localStorage.getItem("access_token");
      if (!o)
        throw new Error("No access token available");
      const c = await Ty(
        r,
        e,
        t,
        o,
        n
      );
      if (c.status === 401 && !s)
        return console.log(`Received 401 for URL ${r}, attempting to refresh token`), i(!0);
      if (c.error)
        throw new Error(c.error);
      if (!c.data)
        throw new Error("No data received from the server");
      return c.data;
    } catch (o) {
      throw console.error(o), o;
    }
  };
  return i();
}
async function Ty(r, e, t, n, i) {
  const o = Ko.resolveEndpoint(r).context === "platform" ? Ko.platformApiUrl : void 0;
  let { sessionKey: c, sessionId: u } = await Ii(!1, o);
  const h = async (x, G = !1) => {
    if (G || !c || !u) {
      const P = await Ii(!0, o);
      c = P.sessionKey, u = P.sessionId;
    }
    if (!c || !u)
      throw new Error("Failed to make encrypted API call, no attestation available.");
    const N = t ? JSON.stringify(t) : void 0, v = N ? Hd(c, N) : void 0, A = {
      "Content-Type": "application/json",
      "x-session-id": u
    };
    x && (A.Authorization = `Bearer ${x}`);
    const O = await fetch(r, {
      method: e,
      headers: A,
      body: v ? JSON.stringify({ encrypted: v }) : void 0
    }), I = {
      status: O.status
    };
    if (O.ok)
      try {
        const P = await O.json(), R = Fd(c, P.encrypted);
        I.data = JSON.parse(R);
      } catch (P) {
        console.error("Error decrypting or parsing response:", P), I.status = 500, I.error = "Failed to decrypt or parse the response";
      }
    else
      try {
        const P = await O.json();
        I.error = P.message || i || `HTTP error! Status: ${O.status}`;
      } catch {
        I.error = i || `HTTP error! Status: ${O.status}`;
      }
    return I;
  }, m = async (x, G = !1) => {
    var N;
    try {
      const v = await h(x, G);
      return (v.status === 400 || (N = v.error) != null && N.includes("Encryption error")) && !G ? (console.log("Encryption error or Bad Request, attempting to renew attestation"), m(x, !0)) : v;
    } catch (v) {
      return {
        status: 500,
        error: v instanceof Error ? v.message : "Unknown error occurred"
      };
    }
  };
  return m(n);
}
async function Ot(r, e, t, n, i) {
  const s = await Ty(
    r,
    e,
    t,
    n,
    i
  );
  if (s.error)
    throw new Error(s.error);
  if (!s.data)
    throw new Error("No data received from the server");
  return s.data;
}
let Ze = "";
function gw(r) {
  Ze = r;
}
function Ny() {
  return Ze;
}
async function Py(r, e) {
  const { clientId: t } = fn(), n = await Ot(
    `${Ze}/login`,
    "POST",
    { email: r, password: e, client_id: t }
  );
  return window.localStorage.setItem("access_token", n.access_token), window.localStorage.setItem("refresh_token", n.refresh_token), n;
}
async function jy(r, e) {
  const { clientId: t } = fn(), n = await Ot(
    `${Ze}/login`,
    "POST",
    { id: r, password: e, client_id: t }
  );
  return window.localStorage.setItem("access_token", n.access_token), window.localStorage.setItem("refresh_token", n.refresh_token), n;
}
async function Ry(r, e, t, n) {
  const { clientId: i } = fn(), s = await Ot(`${Ze}/register`, "POST", {
    email: r,
    password: e,
    inviteCode: t.toLowerCase(),
    client_id: i,
    name: n
  });
  return window.localStorage.setItem("access_token", s.access_token), window.localStorage.setItem("refresh_token", s.refresh_token), s;
}
async function Uy(r, e) {
  const { clientId: t } = fn(), n = await Ot(`${Ze}/register`, "POST", {
    password: r,
    inviteCode: e.toLowerCase(),
    client_id: t
  });
  return window.localStorage.setItem("access_token", n.access_token), window.localStorage.setItem("refresh_token", n.refresh_token), n;
}
async function To() {
  const r = window.localStorage.getItem("refresh_token");
  if (!r) throw new Error("No refresh token available");
  const e = { refresh_token: r };
  try {
    const t = await Ot(
      `${Ze}/refresh`,
      "POST",
      e,
      void 0,
      "Failed to refresh token"
    );
    return window.localStorage.setItem("access_token", t.access_token), window.localStorage.setItem("refresh_token", t.refresh_token), t;
  } catch (t) {
    throw console.error("Error refreshing token:", t), t;
  }
}
async function Dy() {
  return Te(
    `${Ze}/protected/user`,
    "GET",
    void 0,
    "Failed to fetch user"
  );
}
async function kf(r, e) {
  return Te(
    `${Ze}/protected/kv/${r}`,
    "PUT",
    e,
    "Failed to put key-value pair"
  );
}
async function Cf(r) {
  return Te(
    `${Ze}/protected/kv/${r}`,
    "DELETE",
    void 0,
    "Failed to delete key-value pair"
  );
}
async function Bf(r) {
  try {
    return await Te(
      `${Ze}/protected/kv/${r}`,
      "GET",
      void 0,
      "Failed to get key-value pair"
    );
  } catch (e) {
    console.error(`Error fetching key "${r}":`, e);
    return;
  }
}
async function Of() {
  return Te(
    `${Ze}/protected/kv`,
    "GET",
    void 0,
    "Failed to list key-value pairs"
  );
}
async function $y(r) {
  const e = { refresh_token: r };
  return Ot(`${Ze}/logout`, "POST", e);
}
async function Tf(r) {
  return Ot(
    `${Ze}/verify-email/${r}`,
    "GET",
    void 0,
    void 0,
    "Failed to verify email"
  );
}
async function po() {
  return Te(
    `${Ze}/protected/request_verification`,
    "POST",
    void 0,
    "Failed to request new verification code"
  );
}
async function My(r, e) {
  const n = await fetch(`${e || Ze}/attestation/${r}`);
  if (!n.ok)
    throw new Error(`Request failed with status ${n.status}`);
  return (await n.json()).attestation_document;
}
async function Vy(r, e, t) {
  const i = await fetch(`${t || Ze}/key_exchange`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ client_public_key: r, nonce: e })
  });
  if (!i.ok)
    throw new Error("Key exchange failed");
  return i.json();
}
async function Ly(r, e) {
  const { clientId: t } = fn(), n = {
    email: r,
    hashed_secret: e,
    client_id: t
  };
  return Ot(
    `${Ze}/password-reset/request`,
    "POST",
    n,
    void 0,
    "Failed to request password reset"
  );
}
async function Hy(r, e, t, n) {
  const { clientId: i } = fn(), s = {
    email: r,
    alphanumeric_code: e,
    plaintext_secret: t,
    new_password: n,
    client_id: i
  };
  return Ot(
    `${Ze}/password-reset/confirm`,
    "POST",
    s,
    void 0,
    "Failed to confirm password reset"
  );
}
async function Nf(r, e) {
  const t = {
    current_password: r,
    new_password: e
  };
  return Te(
    `${Ze}/protected/change_password`,
    "POST",
    t,
    "Failed to change password"
  );
}
async function Fy(r) {
  const { clientId: e } = fn();
  try {
    return await Ot(
      `${Ze}/auth/github`,
      "POST",
      r ? { invite_code: r, client_id: e } : { client_id: e },
      void 0,
      "Failed to initiate GitHub auth"
    );
  } catch (t) {
    throw t instanceof Error && t.message.includes("Invalid invite code") ? new Error("Invalid invite code. Please check and try again.") : t;
  }
}
async function zy(r, e, t) {
  const n = { code: r, state: e, invite_code: t };
  try {
    const i = await Ot(
      `${Ze}/auth/github/callback`,
      "POST",
      n,
      void 0,
      "GitHub callback failed"
    );
    return window.localStorage.setItem("access_token", i.access_token), window.localStorage.setItem("refresh_token", i.refresh_token), i;
  } catch (i) {
    throw console.error("Detailed GitHub callback error:", i), i instanceof Error ? i.message.includes("User exists") || i.message.includes("Email already registered") ? new Error(
      "An account with this email already exists. Please sign in using your existing account."
    ) : i.message.includes("Invalid invite code") ? new Error("Invalid invite code. Please try signing up with a valid invite code.") : i.message.includes("User not found") ? new Error(
      "User not found. Please sign up first before attempting to log in with GitHub."
    ) : new Error("Failed to authenticate with GitHub. Please try again.") : i;
  }
}
async function Gy(r) {
  const { clientId: e } = fn();
  try {
    return await Ot(
      `${Ze}/auth/google`,
      "POST",
      r ? { invite_code: r, client_id: e } : { client_id: e },
      void 0,
      "Failed to initiate Google auth"
    );
  } catch (t) {
    throw t instanceof Error && t.message.includes("Invalid invite code") ? new Error("Invalid invite code. Please check and try again.") : t;
  }
}
async function Ky(r, e, t) {
  const n = { code: r, state: e, invite_code: t };
  try {
    const i = await Ot(
      `${Ze}/auth/google/callback`,
      "POST",
      n,
      void 0,
      "Google callback failed"
    );
    return window.localStorage.setItem("access_token", i.access_token), window.localStorage.setItem("refresh_token", i.refresh_token), i;
  } catch (i) {
    throw console.error("Detailed Google callback error:", i), i instanceof Error ? i.message.includes("User exists") || i.message.includes("Email already registered") ? new Error(
      "An account with this email already exists. Please sign in using your existing account."
    ) : i.message.includes("Invalid invite code") ? new Error("Invalid invite code. Please try signing up with a valid invite code.") : i.message.includes("User not found") ? new Error(
      "User not found. Please sign up first before attempting to log in with Google."
    ) : new Error("Failed to authenticate with Google. Please try again.") : i;
  }
}
async function qy(r) {
  const { clientId: e } = fn();
  try {
    return await Ot(
      `${Ze}/auth/apple`,
      "POST",
      r ? { invite_code: r, client_id: e } : { client_id: e },
      void 0,
      "Failed to initiate Apple auth"
    );
  } catch (t) {
    throw t instanceof Error && t.message.includes("Invalid invite code") ? new Error("Invalid invite code. Please check and try again.") : t;
  }
}
async function Zy(r, e, t) {
  const n = { code: r, state: e, invite_code: t };
  try {
    const i = await Ot(
      `${Ze}/auth/apple/callback`,
      "POST",
      n,
      void 0,
      "Apple callback failed"
    );
    return window.localStorage.setItem("access_token", i.access_token), window.localStorage.setItem("refresh_token", i.refresh_token), i;
  } catch (i) {
    throw console.error("Detailed Apple callback error:", i), i instanceof Error ? i.message.includes("User exists") || i.message.includes("Email already registered") ? new Error(
      "An account with this email already exists. Please sign in using your existing account."
    ) : i.message.includes("Invalid invite code") ? new Error("Invalid invite code. Please try signing up with a valid invite code.") : i.message.includes("User not found") ? new Error(
      "User not found. Please sign up first before attempting to log in with Apple."
    ) : new Error("Failed to authenticate with Apple. Please try again.") : i;
  }
}
async function Wy(r, e) {
  const { clientId: t } = fn(), n = {
    ...r,
    client_id: t,
    ...e ? { invite_code: e } : {}
  };
  try {
    const i = await Ot(
      `${Ze}/auth/apple/native`,
      "POST",
      n,
      void 0,
      "Apple Sign-In failed"
    );
    return window.localStorage.setItem("access_token", i.access_token), window.localStorage.setItem("refresh_token", i.refresh_token), i;
  } catch (i) {
    throw console.error("Detailed Apple Sign-In error:", i), i instanceof Error ? i.message.includes("User exists") || i.message.includes("Email already registered") ? new Error(
      "An account with this email already exists. Please sign in using your existing account."
    ) : i.message.includes("Invalid invite code") ? new Error("Invalid invite code. Please try signing up with a valid invite code.") : i.message.includes("User not found") ? new Error(
      "User not found. Please sign up first before attempting to log in with Apple."
    ) : i.message.includes("No email found") ? new Error("Unable to retrieve email from Apple. Please try another sign-in method.") : new Error("Failed to authenticate with Apple. Please try again.") : i;
  }
}
async function Pf(r) {
  let e = `${Ze}/protected/private_key`;
  const t = [];
  return r != null && r.seed_phrase_derivation_path && t.push(
    `seed_phrase_derivation_path=${encodeURIComponent(r.seed_phrase_derivation_path)}`
  ), r != null && r.private_key_derivation_path && t.push(
    `private_key_derivation_path=${encodeURIComponent(r.private_key_derivation_path)}`
  ), t.length > 0 && (e += `?${t.join("&")}`), Te(
    e,
    "GET",
    void 0,
    "Failed to fetch private key"
  );
}
async function jf(r) {
  let e = `${Ze}/protected/private_key_bytes`;
  const t = [];
  return r != null && r.seed_phrase_derivation_path && t.push(
    `seed_phrase_derivation_path=${encodeURIComponent(r.seed_phrase_derivation_path)}`
  ), r != null && r.private_key_derivation_path && t.push(
    `private_key_derivation_path=${encodeURIComponent(r.private_key_derivation_path)}`
  ), t.length > 0 && (e += `?${t.join("&")}`), Te(
    e,
    "GET",
    void 0,
    "Failed to fetch private key bytes"
  );
}
async function Rf(r, e, t) {
  const i = {
    message_base64: Br(r),
    algorithm: e,
    ...t && Object.keys(t).length > 0 && { key_options: t }
  };
  return Te(
    `${Ze}/protected/sign_message`,
    "POST",
    i,
    "Failed to sign message"
  );
}
async function Uf(r, e) {
  let t = `${Ze}/protected/public_key?algorithm=${r}`;
  return e != null && e.seed_phrase_derivation_path && (t += `&seed_phrase_derivation_path=${encodeURIComponent(e.seed_phrase_derivation_path)}`), e != null && e.private_key_derivation_path && (t += `&private_key_derivation_path=${encodeURIComponent(e.private_key_derivation_path)}`), Te(
    t,
    "GET",
    void 0,
    "Failed to fetch public key"
  );
}
async function Yy(r, e, t) {
  const n = {
    email: r,
    password: e,
    ...t !== void 0 && { name: t }
  };
  return Te(
    `${Ze}/protected/convert_guest`,
    "POST",
    n,
    "Failed to convert guest account"
  );
}
async function Jy(r) {
  return Te(
    `${Ze}/protected/third_party_token`,
    "POST",
    r ? { audience: r } : {},
    "Failed to generate third party token"
  );
}
async function Df(r, e) {
  const t = {
    data: r,
    ...e && Object.keys(e).length > 0 && { key_options: e }
  };
  return Te(
    `${Ze}/protected/encrypt`,
    "POST",
    t,
    "Failed to encrypt data"
  );
}
async function $f(r, e) {
  const t = {
    encrypted_data: r,
    ...e && Object.keys(e).length > 0 && { key_options: e }
  };
  return Te(
    `${Ze}/protected/decrypt`,
    "POST",
    t,
    "Failed to decrypt data"
  );
}
async function Xy(r) {
  const e = {
    hashed_secret: r
  };
  return Te(
    `${Ze}/protected/delete-account/request`,
    "POST",
    e,
    "Failed to request account deletion"
  );
}
async function Qy(r, e) {
  const t = {
    confirmation_code: r,
    plaintext_secret: e
  };
  return Te(
    `${Ze}/protected/delete-account/confirm`,
    "POST",
    t,
    "Failed to confirm account deletion"
  );
}
async function Mf() {
  try {
    const r = await Te(
      `${Ze}/v1/models`,
      "GET",
      void 0,
      "Failed to fetch models"
    );
    if (!r || typeof r != "object")
      throw new Error("Invalid response from models endpoint");
    if (r.object !== "list" || !Array.isArray(r.data))
      throw new Error("Models response missing expected 'object' or 'data' fields");
    return r.data;
  } catch (r) {
    throw console.error("Error fetching models:", r), r;
  }
}
const Pd = 10 * 1024 * 1024;
function vw(r) {
  return new Promise((e) => setTimeout(e, r));
}
async function Mc(r) {
  if (r.size > Pd)
    throw new Error(`File size exceeds maximum limit of ${Pd / 1024 / 1024}MB`);
  const e = await r.arrayBuffer(), t = new Uint8Array(e), n = Br(t), s = {
    filename: r instanceof File ? r.name : "document",
    content_base64: n
  };
  return Te(
    `${Ze}/v1/documents/upload`,
    "POST",
    s,
    "Failed to upload document"
  );
}
async function Vc(r) {
  const e = {
    task_id: r
  };
  return Te(
    `${Ze}/v1/documents/status`,
    "POST",
    e,
    "Failed to check document status"
  );
}
async function Vf(r, e) {
  const { pollInterval: t = 2e3, maxAttempts: n = 150, onProgress: i } = e || {}, s = await Mc(r);
  let o = 0;
  for (; o < n; ) {
    const c = await Vc(s.task_id);
    switch (i && i(c.status, c.progress), c.status) {
      case "success":
        if (!c.document)
          throw new Error("Document processing succeeded but no document returned");
        return c.document;
      case "failure":
        throw new Error(c.error || "Document processing failed");
      case "pending":
      case "started":
        await vw(t), o++;
        break;
      default:
        throw new Error(`Unknown document status: ${c.status}`);
    }
  }
  throw new Error("Document processing timed out");
}
const mw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  changePassword: Nf,
  checkDocumentStatus: Vc,
  confirmAccountDeletion: Qy,
  confirmPasswordReset: Hy,
  convertGuestToEmailAccount: Yy,
  decryptData: $f,
  encryptData: Df,
  fetchAttestationDocument: My,
  fetchDelete: Cf,
  fetchGet: Bf,
  fetchGuestLogin: jy,
  fetchGuestSignUp: Uy,
  fetchList: Of,
  fetchLogin: Py,
  fetchLogout: $y,
  fetchModels: Mf,
  fetchPrivateKey: Pf,
  fetchPrivateKeyBytes: jf,
  fetchPublicKey: Uf,
  fetchPut: kf,
  fetchSignUp: Ry,
  fetchUser: Dy,
  generateThirdPartyToken: Jy,
  getApiUrl: Ny,
  handleAppleCallback: Zy,
  handleAppleNativeSignIn: Wy,
  handleGitHubCallback: zy,
  handleGoogleCallback: Ky,
  initiateAppleAuth: qy,
  initiateGitHubAuth: Fy,
  initiateGoogleAuth: Gy,
  keyExchange: Vy,
  refreshToken: To,
  requestAccountDeletion: Xy,
  requestNewVerificationCode: po,
  requestPasswordReset: Ly,
  setApiUrl: gw,
  signMessage: Rf,
  uploadDocument: Mc,
  uploadDocumentWithPolling: Vf,
  verifyEmail: Tf
}, Symbol.toStringTag, { value: "Module" }));
function ww() {
  return async (r, e) => {
    var n, i;
    const t = () => {
      const s = window.localStorage.getItem("access_token");
      if (!s)
        throw new Error("No access token available");
      return `Bearer ${s}`;
    };
    try {
      const s = new Headers(e == null ? void 0 : e.headers);
      s.set("Authorization", t());
      const { sessionKey: o, sessionId: c } = await Ii();
      if (!o || !c)
        throw new Error("No session key or ID available");
      s.set("x-session-id", c);
      const u = { ...e, headers: s };
      if (e != null && e.body) {
        const m = Hd(o, e.body);
        u.body = JSON.stringify({ encrypted: m }), s.set("Content-Type", "application/json");
      }
      let h = await fetch(r, u);
      if (h.status === 401 && (console.warn("Unauthorized, refreshing access token"), await To(), s.set("Authorization", t()), u.headers = s, h = await fetch(r, u)), !h.ok) {
        const m = await h.text();
        throw console.error(
          "Request failed with response status:",
          h.status,
          " and message:",
          m
        ), new Error(`Request failed with status ${h.status}: ${m}`);
      }
      if ((n = h.headers.get("content-type")) != null && n.includes("text/event-stream")) {
        const m = (i = h.body) == null ? void 0 : i.getReader(), x = new TextDecoder();
        let G = "";
        const N = new ReadableStream({
          async start(v) {
            for (; ; ) {
              const { done: A, value: O } = await m.read();
              if (A) break;
              const I = x.decode(O);
              G += I;
              let P;
              for (; P = bw(G); )
                if (G = G.slice(P.length), P.trim().startsWith("data: ")) {
                  const R = P.slice(6).trim();
                  if (R === "[DONE]")
                    v.enqueue(`data: [DONE]

`);
                  else
                    try {
                      console.groupCollapsed("Decrypting chunk"), console.log("Attempting to decrypt, data length:", R.length);
                      const ce = Fd(o, R);
                      console.log("Decrypted data length:", ce.length), console.log("Decrypted data:", ce);
                      try {
                        const ze = JSON.parse(ce);
                        console.log("Parsed JSON:", ze), v.enqueue(`data: ${JSON.stringify(ze)}

`);
                      } catch (ze) {
                        ze instanceof SyntaxError && (console.log("Failed to parse JSON:", ce), v.enqueue(`data: ${ce}

`));
                      }
                    } catch (ce) {
                      console.error("Decryption error:", ce, "Data:", R), console.log("Skipping corrupted chunk");
                    } finally {
                      console.groupEnd();
                    }
                }
            }
            v.close();
          }
        });
        return new Response(N, {
          headers: h.headers,
          status: h.status,
          statusText: h.statusText
        });
      }
      return h;
    } catch (s) {
      throw console.error("Error during fetch process:", s), s;
    }
  };
}
function bw(r) {
  const e = r.indexOf(`

`);
  return e === -1 ? null : r.slice(0, e + 2);
}
const xw = [
  "eeddbb58f57c38894d6d5af5e575fbe791c5bf3bbcfb5df8da8cfcf0c2e1da1913108e6a762112444740b88c163d7f4b",
  "74ed417f88cb0ca76c4a3d10f278bd010f1d3f95eafb254d4732511bb50e404507a4049b779c5230137e4091a5582271",
  "9043fcab93b972d3c14ad2dc8fa78ca7ad374fc937c02435681772a003f7a72876bc4d578089b5c4cf3fe9b480f1aabb",
  "52c3595b151d93d8b159c257301bfd5aa6f49210de0c55a6cd6df5ebeee44e4206cab950500f5d188f7fa14e6d900b75",
  "91cb67311e910cce68cd5b7d0de77aa40610d87c6681439b44c46c3ff786ae643956ab2c812478a1da8745b259f07a45",
  "859065ac81b81d3735130ba08b8af72a7256b603fefb74faabae25ed28cca6edcaa7c10ea32b5948d675c18a9b0f2b1d",
  "acd82a7d3943e23e95a9dc3ce0b0107ea358d6287f9e3afa245622f7c7e3e0a66142a928b6efcc02f594a95366d3a99d"
], Aw = [
  "62c0407056217a4c10764ed9045694c29fa93255d3cc04c2f989cdd9a1f8050c8b169714c71f1118ebce2fcc9951d1a9",
  "cb95519905443f9f66f05f63c548b61ad1561a27fd5717b69285861aaea3c3063fe12a2571773b67fea3c6c11b4d8ec6",
  "deb5895831b5e4286f5a2dcf5e9c27383821446f8df2b465f141d10743599be20ba3bb381ce063bf7139cc89f7f61d4c",
  "70ba26c6af1ec3b57ce80e1adcc0ee96d70224d4c7a078f427895cdf68e1c30f09b5ac4c456588d872f3f21ff77c036b",
  "669404ea71435b8f498b48db7816a5c2ab1d258b1a77685b11d84d15a73189504d79c4dee13a658de9f4a0cbfc39cfe8",
  "a791bf92c25ffdfd372660e460a0e238c6778c090672df6509ae4bc065cf8668b6baac6b6a11d554af53ee0ff0172ad5",
  "c4285443b87b9b12a6cea3bef1064ec060f652b235a297095975af8f134e5ed65f92d70d4616fdec80af9dff48bb9f35"
], Sw = "MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEHiUY9kFWK1GqBGzczohhwEwElXzgWLDZa9R6wBx3JOBocgSt9+UIzZlJbPDjYeGBfDUXh7Z62BG2vVsh2NgclLB5S7A2ucBBtb1wd8vSQHP8jpdPhZX1slauPgbnROIP", _w = {
  prod: "https://raw.githubusercontent.com/OpenSecretCloud/opensecret/master/pcrProdHistory.json",
  dev: "https://raw.githubusercontent.com/OpenSecretCloud/opensecret/master/pcrDevHistory.json"
};
async function Ew() {
  try {
    const r = new Uint8Array(
      atob(Sw).split("").map((e) => e.charCodeAt(0))
    );
    return await crypto.subtle.importKey(
      "spki",
      // The format: SubjectPublicKeyInfo
      r,
      // Pass the Uint8Array directly, not .buffer
      {
        name: "ECDSA",
        // The algorithm
        namedCurve: "P-384"
        // The curve (must be P-384 to match our backend)
      },
      !1,
      // Not extractable
      ["verify"]
      // Only for verification
    );
  } catch (r) {
    throw console.error("Error importing verification key:", r), new Error("Failed to import PCR verification key");
  }
}
async function Iw(r, e) {
  try {
    const t = (e == null ? void 0 : e[r]) || _w[r], n = await fetch(t);
    if (!n.ok)
      throw new Error(`Failed to fetch PCR history: ${n.status}`);
    return await n.json();
  } catch (t) {
    throw console.error("Error fetching PCR history:", t), new Error("Failed to fetch PCR history");
  }
}
async function kw(r, e, t) {
  try {
    const i = new TextEncoder().encode(r), s = new Uint8Array(
      atob(e).split("").map((o) => o.charCodeAt(0))
    );
    return await crypto.subtle.verify(
      {
        name: "ECDSA",
        hash: { name: "SHA-384" }
        // Must match the hash used for signing
      },
      t,
      s,
      i
    );
  } catch (n) {
    return console.error("Signature verification error:", n), !1;
  }
}
async function jd(r, e, t) {
  try {
    const n = await Ew(), i = await Iw(e, t);
    for (const s of i)
      if (s.PCR0 === r && await kw(s.PCR0, s.signature, n))
        return {
          isMatch: !0,
          text: "PCR0 matches remotely attested value",
          verifiedAt: new Date(s.timestamp * 1e3).toLocaleString()
        };
    return null;
  } catch (n) {
    return console.error("PCR remote validation error:", n), null;
  }
}
async function Cw(r, e) {
  const t = [...(e == null ? void 0 : e.pcr0Values) || [], ...xw], n = [...(e == null ? void 0 : e.pcr0DevValues) || [], ...Aw];
  if (t.includes(r))
    return {
      isMatch: !0,
      text: "PCR0 matches a known good value"
    };
  if (n.includes(r))
    return {
      isMatch: !0,
      text: "PCR0 matches development enclave"
    };
  if ((e == null ? void 0 : e.remoteAttestation) !== !1)
    try {
      const s = await jd(
        r,
        "prod",
        e == null ? void 0 : e.remoteAttestationUrls
      );
      if (s)
        return s;
      const o = await jd(
        r,
        "dev",
        e == null ? void 0 : e.remoteAttestationUrls
      );
      if (o)
        return o;
    } catch (s) {
      console.error("Error during remote PCR validation:", s);
    }
  return {
    isMatch: !1,
    text: "PCR0 does not match a known good value"
  };
}
const ns = Va, Lc = "641a0321a3e244efe456463195d606317ed7cdcc3c1756e09893f3c68f79bb5b";
function eg(r) {
  return Array.from(r).map((e) => e.toString(16).padStart(2, "0")).join("");
}
async function Bw(r) {
  const e = await crypto.subtle.digest("SHA-256", r);
  return eg(new Uint8Array(e));
}
async function is(r, e, t) {
  console.log("Raw timestamp:", r.timestamp), console.log("Date object:", new Date(r.timestamp));
  const n = Array.from(r.pcrs.entries()).map(([m, x]) => ({
    id: m,
    value: eg(x)
  })).filter((m) => !m.value.match(/^0+$/)), i = n.find((m) => m.id === 0);
  let s = null;
  i && (s = await Cw(i.value, t));
  const o = [...e, r.certificate].map((m) => {
    const x = new xi(m);
    return {
      subject: x.subject,
      notBefore: x.notBefore.toLocaleString(),
      notAfter: x.notAfter.toLocaleString(),
      pem: x.toString("pem"),
      isRoot: x.subject === "C=US, O=Amazon, OU=AWS, CN=aws.nitro-enclaves"
    };
  }), c = new TextDecoder(), u = new xi(e[0]), h = await Bw(u.rawData);
  return {
    moduleId: r.module_id,
    publicKey: r.public_key ? Br(r.public_key) : null,
    timestamp: new Date(r.timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short"
    }),
    digest: r.digest,
    pcrs: n,
    certificates: o,
    userData: r.user_data ? c.decode(r.user_data) : null,
    nonce: r.nonce ? c.decode(r.nonce) : null,
    cert0hash: h,
    validatedPcr0Hash: s
  };
}
const tg = $d({
  auth: {
    loading: !0,
    user: void 0
  },
  clientId: "",
  signIn: async () => {
  },
  signUp: async () => {
  },
  signInGuest: async () => {
  },
  signUpGuest: async () => ({
    id: "",
    email: void 0,
    access_token: "",
    refresh_token: ""
  }),
  convertGuestToUserAccount: async () => {
  },
  signOut: async () => {
  },
  get: Bf,
  put: kf,
  list: Of,
  del: Cf,
  verifyEmail: Tf,
  requestNewVerificationCode: po,
  requestNewVerificationEmail: po,
  refetchUser: async () => {
  },
  changePassword: Nf,
  refreshAccessToken: To,
  requestPasswordReset: async () => {
  },
  confirmPasswordReset: async () => {
  },
  requestAccountDeletion: async () => {
  },
  confirmAccountDeletion: async () => {
  },
  initiateGitHubAuth: async () => ({ auth_url: "", csrf_token: "" }),
  handleGitHubCallback: async () => {
  },
  initiateGoogleAuth: async () => ({ auth_url: "", csrf_token: "" }),
  handleGoogleCallback: async () => {
  },
  initiateAppleAuth: async () => ({ auth_url: "", state: "" }),
  handleAppleCallback: async () => {
  },
  handleAppleNativeSignIn: async () => {
  },
  getPrivateKey: Pf,
  getPrivateKeyBytes: jf,
  getPublicKey: Uf,
  signMessage: Rf,
  aiCustomFetch: async () => new Response(),
  apiUrl: "",
  pcrConfig: {},
  getAttestation: Ii,
  authenticate: Ei,
  parseAttestationForView: is,
  awsRootCertDer: ns,
  expectedRootCertHash: Lc,
  getAttestationDocument: async () => {
    throw new Error("getAttestationDocument called outside of OpenSecretProvider");
  },
  generateThirdPartyToken: async () => ({ token: "" }),
  encryptData: Df,
  decryptData: $f,
  fetchModels: Mf,
  uploadDocument: Mc,
  checkDocumentStatus: Vc,
  uploadDocumentWithPolling: Vf
});
function Nx({
  children: r,
  apiUrl: e,
  clientId: t,
  pcrConfig: n = {}
}) {
  const [i, s] = al({
    loading: !0,
    user: void 0
  }), [o, c] = al();
  Ns(() => {
    if (!e || e.trim() === "")
      throw new Error(
        "OpenSecretProvider requires a non-empty apiUrl. Please provide a valid API endpoint URL."
      );
    if (!t || t.trim() === "")
      throw new Error(
        "OpenSecretProvider requires a non-empty clientId. Please provide a valid project UUID."
      );
    og({ apiUrl: e, clientId: t });
  }, [e, t]), Ns(() => {
    i.user ? c(() => ww()) : c(void 0);
  }, [i.user]);
  async function u() {
    const re = window.localStorage.getItem("access_token"), pe = window.localStorage.getItem("refresh_token");
    if (!re || !pe) {
      s({
        loading: !1,
        user: void 0
      });
      return;
    }
    try {
      const we = await Dy();
      s({
        loading: !1,
        user: we
      });
    } catch (we) {
      console.error("Failed to fetch user:", we), s({
        loading: !1,
        user: void 0
      });
    }
  }
  Ns(() => {
    u();
  }, []);
  async function h(re, pe) {
    console.log("Signing in");
    try {
      await Py(re, pe), await u();
    } catch (we) {
      throw console.error(we), we;
    }
  }
  async function m(re, pe, we, Ge) {
    try {
      await Ry(
        re,
        pe,
        we,
        Ge || null
      ), await u();
    } catch (bt) {
      throw console.error(bt), bt;
    }
  }
  async function x(re, pe) {
    console.log("Signing in Guest");
    try {
      await jy(re, pe), await u();
    } catch (we) {
      throw console.error(we), we;
    }
  }
  async function G(re, pe) {
    try {
      const we = await Uy(
        re,
        pe
      );
      return await u(), we;
    } catch (we) {
      throw console.error(we), we;
    }
  }
  async function N(re, pe, we) {
    try {
      await Yy(re, pe, we), await u();
    } catch (Ge) {
      throw console.error(Ge), Ge;
    }
  }
  async function v() {
    const re = window.localStorage.getItem("refresh_token");
    if (re)
      try {
        await $y(re);
      } catch (pe) {
        console.error("Error during logout:", pe);
      }
    localStorage.removeItem("access_token"), localStorage.removeItem("refresh_token"), sessionStorage.removeItem("sessionKey"), sessionStorage.removeItem("sessionId"), s({
      loading: !1,
      user: void 0
    });
  }
  const Pe = {
    auth: i,
    clientId: t,
    signIn: h,
    signInGuest: x,
    signOut: v,
    signUp: m,
    signUpGuest: G,
    convertGuestToUserAccount: N,
    get: Bf,
    put: kf,
    list: Of,
    del: Cf,
    refetchUser: u,
    verifyEmail: Tf,
    requestNewVerificationCode: po,
    requestNewVerificationEmail: po,
    changePassword: Nf,
    refreshAccessToken: To,
    requestPasswordReset: Ly,
    confirmPasswordReset: Hy,
    requestAccountDeletion: Xy,
    confirmAccountDeletion: Qy,
    initiateGitHubAuth: async (re) => {
      try {
        return await Fy(re);
      } catch (pe) {
        throw console.error("Failed to initiate GitHub auth:", pe), pe;
      }
    },
    handleGitHubCallback: async (re, pe, we) => {
      try {
        await zy(
          re,
          pe,
          we
        ), await u();
      } catch (Ge) {
        throw console.error("GitHub callback error:", Ge), Ge;
      }
    },
    initiateGoogleAuth: async (re) => {
      try {
        return await Gy(re);
      } catch (pe) {
        throw console.error("Failed to initiate Google auth:", pe), pe;
      }
    },
    handleGoogleCallback: async (re, pe, we) => {
      try {
        await Ky(
          re,
          pe,
          we
        ), await u();
      } catch (Ge) {
        throw console.error("Google callback error:", Ge), Ge;
      }
    },
    initiateAppleAuth: async (re) => {
      try {
        return await qy(re);
      } catch (pe) {
        throw console.error("Failed to initiate Apple auth:", pe), pe;
      }
    },
    handleAppleCallback: async (re, pe, we) => {
      try {
        await Zy(
          re,
          pe,
          we
        ), await u();
      } catch (Ge) {
        throw console.error("Apple callback error:", Ge), Ge;
      }
    },
    handleAppleNativeSignIn: async (re, pe) => {
      try {
        await Wy(
          re,
          pe
        ), await u();
      } catch (we) {
        throw console.error("Apple native sign-in error:", we), we;
      }
    },
    getPrivateKey: Pf,
    getPrivateKeyBytes: jf,
    getPublicKey: Uf,
    signMessage: Rf,
    aiCustomFetch: o || (async () => new Response()),
    apiUrl: e,
    pcrConfig: n,
    getAttestation: Ii,
    authenticate: Ei,
    parseAttestationForView: is,
    awsRootCertDer: ns,
    expectedRootCertHash: Lc,
    getAttestationDocument: async () => {
      const re = window.crypto.randomUUID(), pe = await fetch(`${e}/attestation/${re}`);
      if (!pe.ok)
        throw new Error("Failed to fetch attestation document");
      const we = await pe.json(), Ge = await Ei(
        we.attestation_document,
        ns,
        re
      );
      return is(Ge, Ge.cabundle, n);
    },
    generateThirdPartyToken: Jy,
    encryptData: Df,
    decryptData: $f,
    fetchModels: Mf,
    uploadDocument: Mc,
    checkDocumentStatus: Vc,
    uploadDocumentWithPolling: Vf
  };
  return /* @__PURE__ */ Dd(tg.Provider, { value: Pe, children: r });
}
const rg = $d({
  auth: {
    loading: !0,
    developer: void 0
  },
  signIn: async () => {
    throw new Error("signIn called outside of OpenSecretDeveloper provider");
  },
  signUp: async () => {
    throw new Error("signUp called outside of OpenSecretDeveloper provider");
  },
  signOut: async () => {
    throw new Error("signOut called outside of OpenSecretDeveloper provider");
  },
  refetchDeveloper: async () => {
    throw new Error("refetchDeveloper called outside of OpenSecretDeveloper provider");
  },
  verifyEmail: ky,
  requestNewVerificationCode: La,
  requestNewVerificationEmail: La,
  requestPasswordReset: Cy,
  confirmPasswordReset: By,
  changePassword: Oy,
  pcrConfig: {},
  getAttestation: Ii,
  authenticate: Ei,
  parseAttestationForView: is,
  awsRootCertDer: ns,
  expectedRootCertHash: Lc,
  getAttestationDocument: async () => {
    throw new Error("getAttestationDocument called outside of OpenSecretDeveloper provider");
  },
  createOrganization: iy,
  listOrganizations: sy,
  deleteOrganization: oy,
  createProject: ay,
  listProjects: cy,
  getProject: ly,
  updateProject: uy,
  deleteProject: fy,
  createProjectSecret: hy,
  listProjectSecrets: dy,
  deleteProjectSecret: py,
  getEmailSettings: yy,
  updateEmailSettings: gy,
  getOAuthSettings: vy,
  updateOAuthSettings: my,
  inviteDeveloper: wy,
  listOrganizationMembers: Sy,
  listOrganizationInvites: by,
  getOrganizationInvite: xy,
  deleteOrganizationInvite: Ay,
  updateMemberRole: _y,
  removeMember: Ey,
  acceptInvite: Iy,
  apiUrl: ""
});
function Px({
  children: r,
  apiUrl: e,
  pcrConfig: t = {}
}) {
  const [n, i] = al({
    loading: !0,
    developer: void 0
  });
  Ns(() => {
    if (!e || e.trim() === "")
      throw new Error(
        "OpenSecretDeveloper requires a non-empty apiUrl. Please provide a valid API endpoint URL."
      );
    lw(e), Promise.resolve().then(() => Vd).then(({ apiConfig: m }) => {
      const x = m.appApiUrl || "";
      m.configure(x, e);
    }).catch((m) => {
      throw console.error("Failed to load apiConfig:", m), new Error(
        "Failed to initialize OpenSecretDeveloper - could not load required dependencies"
      );
    });
  }, [e]);
  async function s() {
    const m = window.localStorage.getItem("access_token"), x = window.localStorage.getItem("refresh_token");
    if (!m || !x) {
      i({
        loading: !1,
        developer: void 0
      });
      return;
    }
    try {
      const G = await yw();
      i({
        loading: !1,
        developer: {
          ...G.user,
          organizations: G.organizations
        }
      });
    } catch (G) {
      console.error("Failed to fetch developer:", G), i({
        loading: !1,
        developer: void 0
      });
    }
  }
  const o = async () => {
    const m = window.crypto.randomUUID(), x = await fetch(`${e}/attestation/${m}`);
    if (!x.ok)
      throw new Error("Failed to fetch attestation document");
    const G = await x.json(), N = await Ei(
      G.attestation_document,
      ns,
      m
    );
    return is(N, N.cabundle, t);
  };
  Ns(() => {
    s();
  }, []);
  async function c(m, x) {
    try {
      const { access_token: G, refresh_token: N } = await uw(m, x);
      return window.localStorage.setItem("access_token", G), window.localStorage.setItem("refresh_token", N), await s(), { access_token: G, refresh_token: N, id: "", email: m };
    } catch (G) {
      throw console.error("Login error:", G), G;
    }
  }
  async function u(m, x, G, N) {
    try {
      const { access_token: v, refresh_token: A } = await fw(
        m,
        x,
        G,
        N
      );
      return window.localStorage.setItem("access_token", v), window.localStorage.setItem("refresh_token", A), await s(), { access_token: v, refresh_token: A, id: "", email: m, name: N };
    } catch (v) {
      throw console.error("Registration error:", v), v;
    }
  }
  const h = {
    auth: n,
    signIn: c,
    signUp: u,
    refetchDeveloper: s,
    signOut: async () => {
      const m = window.localStorage.getItem("refresh_token");
      if (m)
        try {
          await hw(m);
        } catch (x) {
          console.error("Error during logout:", x);
        }
      localStorage.removeItem("access_token"), localStorage.removeItem("refresh_token"), i({
        loading: !1,
        developer: void 0
      });
    },
    verifyEmail: ky,
    requestNewVerificationCode: La,
    requestNewVerificationEmail: La,
    requestPasswordReset: Cy,
    confirmPasswordReset: By,
    changePassword: Oy,
    pcrConfig: t,
    getAttestation: Ii,
    authenticate: Ei,
    parseAttestationForView: is,
    awsRootCertDer: ns,
    expectedRootCertHash: Lc,
    getAttestationDocument: o,
    createOrganization: iy,
    listOrganizations: sy,
    deleteOrganization: oy,
    createProject: ay,
    listProjects: cy,
    getProject: ly,
    updateProject: uy,
    deleteProject: fy,
    createProjectSecret: hy,
    listProjectSecrets: dy,
    deleteProjectSecret: py,
    getEmailSettings: yy,
    updateEmailSettings: gy,
    getOAuthSettings: vy,
    updateOAuthSettings: my,
    inviteDeveloper: wy,
    listOrganizationMembers: Sy,
    listOrganizationInvites: by,
    getOrganizationInvite: xy,
    deleteOrganizationInvite: Ay,
    updateMemberRole: _y,
    removeMember: Ey,
    acceptInvite: Iy,
    apiUrl: e
  };
  return /* @__PURE__ */ Dd(rg.Provider, { value: h, children: r });
}
function jx() {
  return Md(tg);
}
function Rx() {
  return Md(rg);
}
function Ux() {
  const r = new Uint8Array(32);
  return crypto.getRandomValues(r), Array.from(r, (e) => e.toString(16).padStart(2, "0")).join("");
}
async function Dx(r) {
  const t = new TextEncoder().encode(r), n = await crypto.subtle.digest("SHA-256", t);
  return Array.from(new Uint8Array(n)).map((s) => s.toString(16).padStart(2, "0")).join("");
}
export {
  tg as OpenSecretContext,
  Px as OpenSecretDeveloper,
  rg as OpenSecretDeveloperContext,
  Nx as OpenSecretProvider,
  Ko as apiConfig,
  Ei as authenticate,
  ns as awsRootCertDer,
  Nf as changePassword,
  Vc as checkDocumentStatus,
  og as configure,
  Qy as confirmAccountDeletion,
  Hy as confirmPasswordReset,
  Yy as convertGuestToUserAccount,
  ww as createAiCustomFetch,
  $f as decryptData,
  Cf as del,
  Df as encryptData,
  Lc as expectedRootCertHash,
  Mf as fetchModels,
  Dy as fetchUser,
  Ux as generateSecureSecret,
  Jy as generateThirdPartyToken,
  Bf as get,
  Ny as getApiUrl,
  Ii as getAttestation,
  fn as getConfig,
  Pf as getPrivateKey,
  jf as getPrivateKeyBytes,
  Uf as getPublicKey,
  Zy as handleAppleCallback,
  Wy as handleAppleNativeSignIn,
  zy as handleGitHubCallback,
  Ky as handleGoogleCallback,
  Dx as hashSecret,
  qy as initiateAppleAuth,
  Fy as initiateGitHubAuth,
  Gy as initiateGoogleAuth,
  Pw as isConfigured,
  Of as list,
  is as parseAttestationForView,
  kf as put,
  To as refreshAccessToken,
  Xy as requestAccountDeletion,
  po as requestNewVerificationCode,
  Ly as requestPasswordReset,
  jw as resetConfig,
  gw as setApiUrl,
  Py as signIn,
  jy as signInGuest,
  Rf as signMessage,
  $y as signOut,
  Ry as signUp,
  Uy as signUpGuest,
  Mc as uploadDocument,
  Vf as uploadDocumentWithPolling,
  jx as useOpenSecret,
  Rx as useOpenSecretDeveloper,
  Tf as verifyEmail
};
