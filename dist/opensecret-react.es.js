var Ry = Object.defineProperty;
var Cf = (r) => {
  throw TypeError(r);
};
var Uy = (r, e, t) => e in r ? Ry(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var Fe = (r, e, t) => Uy(r, typeof e != "symbol" ? e + "" : e, t), Lc = (r, e, t) => e.has(r) || Cf("Cannot " + t);
var $ = (r, e, t) => (Lc(r, e, "read from private field"), t ? t.call(r) : e.get(r)), rr = (r, e, t) => e.has(r) ? Cf("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(r) : e.set(r, t), It = (r, e, t, n) => (Lc(r, e, "write to private field"), n ? n.call(r, t) : e.set(r, t), t), Ue = (r, e, t) => (Lc(r, e, "access private method"), t);
var Bf = (r, e, t, n) => ({
  set _(i) {
    It(r, e, i, t);
  },
  get _() {
    return $(r, e, n);
  }
});
import { jsx as Sd } from "react/jsx-runtime";
import { createContext as _d, useState as sl, useEffect as Ts, useContext as Ed } from "react";
let Us = null;
function Dy(r) {
  if (!r.apiUrl || r.apiUrl.trim() === "")
    throw new Error("OpenSecret SDK requires a non-empty apiUrl");
  if (!r.clientId || r.clientId.trim() === "")
    throw new Error("OpenSecret SDK requires a non-empty clientId");
  Us = {
    apiUrl: r.apiUrl.replace(/\/$/, ""),
    // Remove trailing slash
    clientId: r.clientId
  };
}
function Nr() {
  if (!Us)
    throw new Error(
      "OpenSecret SDK not configured. Please call configure() with your apiUrl and clientId first."
    );
  return Us;
}
function $y() {
  return Us !== null;
}
function Ow() {
  Us = null;
}
class My {
  constructor() {
    Fe(this, "_platformApiUrl", "");
  }
  /**
   * Configure the platform API URL
   */
  configurePlatform(e) {
    this._platformApiUrl = e;
  }
  /**
   * Get the platform API URL
   */
  get platformApiUrl() {
    return this._platformApiUrl;
  }
  /**
   * Get the app API URL (derived from global config)
   */
  get appApiUrl() {
    return $y() ? Nr().apiUrl : "";
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
      baseUrl: t ? this._platformApiUrl : this.appApiUrl,
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
const Go = new My(), hr = 256;
class Vy {
  // TODO(dchest): methods to encode chunk-by-chunk.
  constructor(e = "=") {
    Fe(this, "_paddingCharacter");
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
const Id = new Vy();
function Br(r) {
  return Id.encode(r);
}
function Ds(r) {
  return Id.decode(r);
}
function zt(r, e = new Uint8Array(4), t = 0) {
  return e[t + 0] = r >>> 0, e[t + 1] = r >>> 8, e[t + 2] = r >>> 16, e[t + 3] = r >>> 24, e;
}
function Of(r, e = new Uint8Array(8), t = 0) {
  return zt(r >>> 0, e, t), zt(r / 4294967296 >>> 0, e, t + 4), e;
}
function Cr(r) {
  for (let e = 0; e < r.length; e++)
    r[e] = 0;
  return r;
}
const Ly = 20;
function Hy(r, e, t) {
  let n = 1634760805, i = 857760878, s = 2036477234, o = 1797285236, c = t[3] << 24 | t[2] << 16 | t[1] << 8 | t[0], u = t[7] << 24 | t[6] << 16 | t[5] << 8 | t[4], h = t[11] << 24 | t[10] << 16 | t[9] << 8 | t[8], m = t[15] << 24 | t[14] << 16 | t[13] << 8 | t[12], x = t[19] << 24 | t[18] << 16 | t[17] << 8 | t[16], z = t[23] << 24 | t[22] << 16 | t[21] << 8 | t[20], N = t[27] << 24 | t[26] << 16 | t[25] << 8 | t[24], v = t[31] << 24 | t[30] << 16 | t[29] << 8 | t[28], A = e[3] << 24 | e[2] << 16 | e[1] << 8 | e[0], O = e[7] << 24 | e[6] << 16 | e[5] << 8 | e[4], I = e[11] << 24 | e[10] << 16 | e[9] << 8 | e[8], P = e[15] << 24 | e[14] << 16 | e[13] << 8 | e[12], R = n, ae = i, Ge = s, Je = o, Pe = c, ce = u, ve = h, we = m, ze = x, bt = z, Tt = N, Et = v, ht = A, Qe = O, ie = I, _e = P;
  for (let yt = 0; yt < Ly; yt += 2)
    R = R + Pe | 0, ht ^= R, ht = ht >>> 16 | ht << 16, ze = ze + ht | 0, Pe ^= ze, Pe = Pe >>> 20 | Pe << 12, ae = ae + ce | 0, Qe ^= ae, Qe = Qe >>> 16 | Qe << 16, bt = bt + Qe | 0, ce ^= bt, ce = ce >>> 20 | ce << 12, Ge = Ge + ve | 0, ie ^= Ge, ie = ie >>> 16 | ie << 16, Tt = Tt + ie | 0, ve ^= Tt, ve = ve >>> 20 | ve << 12, Je = Je + we | 0, _e ^= Je, _e = _e >>> 16 | _e << 16, Et = Et + _e | 0, we ^= Et, we = we >>> 20 | we << 12, Ge = Ge + ve | 0, ie ^= Ge, ie = ie >>> 24 | ie << 8, Tt = Tt + ie | 0, ve ^= Tt, ve = ve >>> 25 | ve << 7, Je = Je + we | 0, _e ^= Je, _e = _e >>> 24 | _e << 8, Et = Et + _e | 0, we ^= Et, we = we >>> 25 | we << 7, ae = ae + ce | 0, Qe ^= ae, Qe = Qe >>> 24 | Qe << 8, bt = bt + Qe | 0, ce ^= bt, ce = ce >>> 25 | ce << 7, R = R + Pe | 0, ht ^= R, ht = ht >>> 24 | ht << 8, ze = ze + ht | 0, Pe ^= ze, Pe = Pe >>> 25 | Pe << 7, R = R + ce | 0, _e ^= R, _e = _e >>> 16 | _e << 16, Tt = Tt + _e | 0, ce ^= Tt, ce = ce >>> 20 | ce << 12, ae = ae + ve | 0, ht ^= ae, ht = ht >>> 16 | ht << 16, Et = Et + ht | 0, ve ^= Et, ve = ve >>> 20 | ve << 12, Ge = Ge + we | 0, Qe ^= Ge, Qe = Qe >>> 16 | Qe << 16, ze = ze + Qe | 0, we ^= ze, we = we >>> 20 | we << 12, Je = Je + Pe | 0, ie ^= Je, ie = ie >>> 16 | ie << 16, bt = bt + ie | 0, Pe ^= bt, Pe = Pe >>> 20 | Pe << 12, Ge = Ge + we | 0, Qe ^= Ge, Qe = Qe >>> 24 | Qe << 8, ze = ze + Qe | 0, we ^= ze, we = we >>> 25 | we << 7, Je = Je + Pe | 0, ie ^= Je, ie = ie >>> 24 | ie << 8, bt = bt + ie | 0, Pe ^= bt, Pe = Pe >>> 25 | Pe << 7, ae = ae + ve | 0, ht ^= ae, ht = ht >>> 24 | ht << 8, Et = Et + ht | 0, ve ^= Et, ve = ve >>> 25 | ve << 7, R = R + ce | 0, _e ^= R, _e = _e >>> 24 | _e << 8, Tt = Tt + _e | 0, ce ^= Tt, ce = ce >>> 25 | ce << 7;
  zt(R + n | 0, r, 0), zt(ae + i | 0, r, 4), zt(Ge + s | 0, r, 8), zt(Je + o | 0, r, 12), zt(Pe + c | 0, r, 16), zt(ce + u | 0, r, 20), zt(ve + h | 0, r, 24), zt(we + m | 0, r, 28), zt(ze + x | 0, r, 32), zt(bt + z | 0, r, 36), zt(Tt + N | 0, r, 40), zt(Et + v | 0, r, 44), zt(ht + A | 0, r, 48), zt(Qe + O | 0, r, 52), zt(ie + I | 0, r, 56), zt(_e + P | 0, r, 60);
}
function ol(r, e, t, n, i = 0) {
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
    Hy(c, s, r);
    for (let h = u; h < u + 64 && h < t.length; h++)
      n[h] = t[h] ^ c[h - u];
    Fy(s, 0, o);
  }
  return Cr(c), i === 0 && Cr(s), n;
}
function Tf(r, e, t, n = 0) {
  return Cr(t), ol(r, e, t, t, n);
}
function Fy(r, e, t) {
  let n = 1;
  for (; t--; )
    n = n + (r[e] & 255) | 0, r[e] = n & 255, n >>>= 8, e++;
  if (n > 0)
    throw new Error("ChaCha: counter overflow");
}
function Gy(r, e) {
  if (r.length !== e.length)
    return 0;
  let t = 0;
  for (let n = 0; n < r.length; n++)
    t |= r[n] ^ e[n];
  return 1 & t - 1 >>> 8;
}
function zy(r, e) {
  return r.length === 0 || e.length === 0 ? !1 : Gy(r, e) !== 0;
}
const Ky = 16;
class qy {
  constructor(e) {
    Fe(this, "digestLength", Ky);
    Fe(this, "_buffer", new Uint8Array(16));
    Fe(this, "_r", new Uint16Array(10));
    Fe(this, "_h", new Uint16Array(10));
    Fe(this, "_pad", new Uint16Array(8));
    Fe(this, "_leftover", 0);
    Fe(this, "_fin", 0);
    Fe(this, "_finished", !1);
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
    let i = this._fin ? 0 : 2048, s = this._h[0], o = this._h[1], c = this._h[2], u = this._h[3], h = this._h[4], m = this._h[5], x = this._h[6], z = this._h[7], N = this._h[8], v = this._h[9], A = this._r[0], O = this._r[1], I = this._r[2], P = this._r[3], R = this._r[4], ae = this._r[5], Ge = this._r[6], Je = this._r[7], Pe = this._r[8], ce = this._r[9];
    for (; n >= 16; ) {
      let ve = e[t + 0] | e[t + 1] << 8;
      s += ve & 8191;
      let we = e[t + 2] | e[t + 3] << 8;
      o += (ve >>> 13 | we << 3) & 8191;
      let ze = e[t + 4] | e[t + 5] << 8;
      c += (we >>> 10 | ze << 6) & 8191;
      let bt = e[t + 6] | e[t + 7] << 8;
      u += (ze >>> 7 | bt << 9) & 8191;
      let Tt = e[t + 8] | e[t + 9] << 8;
      h += (bt >>> 4 | Tt << 12) & 8191, m += Tt >>> 1 & 8191;
      let Et = e[t + 10] | e[t + 11] << 8;
      x += (Tt >>> 14 | Et << 2) & 8191;
      let ht = e[t + 12] | e[t + 13] << 8;
      z += (Et >>> 11 | ht << 5) & 8191;
      let Qe = e[t + 14] | e[t + 15] << 8;
      N += (ht >>> 8 | Qe << 8) & 8191, v += Qe >>> 5 | i;
      let ie = 0, _e = ie;
      _e += s * A, _e += o * (5 * ce), _e += c * (5 * Pe), _e += u * (5 * Je), _e += h * (5 * Ge), ie = _e >>> 13, _e &= 8191, _e += m * (5 * ae), _e += x * (5 * R), _e += z * (5 * P), _e += N * (5 * I), _e += v * (5 * O), ie += _e >>> 13, _e &= 8191;
      let yt = ie;
      yt += s * O, yt += o * A, yt += c * (5 * ce), yt += u * (5 * Pe), yt += h * (5 * Je), ie = yt >>> 13, yt &= 8191, yt += m * (5 * Ge), yt += x * (5 * ae), yt += z * (5 * R), yt += N * (5 * P), yt += v * (5 * I), ie += yt >>> 13, yt &= 8191;
      let Ut = ie;
      Ut += s * I, Ut += o * O, Ut += c * A, Ut += u * (5 * ce), Ut += h * (5 * Pe), ie = Ut >>> 13, Ut &= 8191, Ut += m * (5 * Je), Ut += x * (5 * Ge), Ut += z * (5 * ae), Ut += N * (5 * R), Ut += v * (5 * P), ie += Ut >>> 13, Ut &= 8191;
      let Dt = ie;
      Dt += s * P, Dt += o * I, Dt += c * O, Dt += u * A, Dt += h * (5 * ce), ie = Dt >>> 13, Dt &= 8191, Dt += m * (5 * Pe), Dt += x * (5 * Je), Dt += z * (5 * Ge), Dt += N * (5 * ae), Dt += v * (5 * R), ie += Dt >>> 13, Dt &= 8191;
      let le = ie;
      le += s * R, le += o * P, le += c * I, le += u * O, le += h * A, ie = le >>> 13, le &= 8191, le += m * (5 * ce), le += x * (5 * Pe), le += z * (5 * Je), le += N * (5 * Ge), le += v * (5 * ae), ie += le >>> 13, le &= 8191;
      let it = ie;
      it += s * ae, it += o * R, it += c * P, it += u * I, it += h * O, ie = it >>> 13, it &= 8191, it += m * A, it += x * (5 * ce), it += z * (5 * Pe), it += N * (5 * Je), it += v * (5 * Ge), ie += it >>> 13, it &= 8191;
      let gt = ie;
      gt += s * Ge, gt += o * ae, gt += c * R, gt += u * P, gt += h * I, ie = gt >>> 13, gt &= 8191, gt += m * O, gt += x * A, gt += z * (5 * ce), gt += N * (5 * Pe), gt += v * (5 * Je), ie += gt >>> 13, gt &= 8191;
      let Q = ie;
      Q += s * Je, Q += o * Ge, Q += c * ae, Q += u * R, Q += h * P, ie = Q >>> 13, Q &= 8191, Q += m * I, Q += x * O, Q += z * A, Q += N * (5 * ce), Q += v * (5 * Pe), ie += Q >>> 13, Q &= 8191;
      let dt = ie;
      dt += s * Pe, dt += o * Je, dt += c * Ge, dt += u * ae, dt += h * R, ie = dt >>> 13, dt &= 8191, dt += m * P, dt += x * I, dt += z * O, dt += N * A, dt += v * (5 * ce), ie += dt >>> 13, dt &= 8191;
      let Vt = ie;
      Vt += s * ce, Vt += o * Pe, Vt += c * Je, Vt += u * Ge, Vt += h * ae, ie = Vt >>> 13, Vt &= 8191, Vt += m * R, Vt += x * P, Vt += z * I, Vt += N * O, Vt += v * A, ie += Vt >>> 13, Vt &= 8191, ie = (ie << 2) + ie | 0, ie = ie + _e | 0, _e = ie & 8191, ie = ie >>> 13, yt += ie, s = _e, o = yt, c = Ut, u = Dt, h = le, m = it, x = gt, z = Q, N = dt, v = Vt, t += 16, n -= 16;
    }
    this._h[0] = s, this._h[1] = o, this._h[2] = c, this._h[3] = u, this._h[4] = h, this._h[5] = m, this._h[6] = x, this._h[7] = z, this._h[8] = N, this._h[9] = v;
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
const Zy = 32, Wy = 12, Yy = 16, Nf = new Uint8Array(16);
class Pu {
  /**
   * Creates a new instance with the given 32-byte key.
   */
  constructor(e) {
    Fe(this, "nonceLength", Wy);
    Fe(this, "tagLength", Yy);
    Fe(this, "_key");
    if (e.length !== Zy)
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
    Tf(this._key, s, o, 4);
    const c = t.length + this.tagLength;
    let u;
    if (i) {
      if (i.length !== c)
        throw new Error("ChaCha20Poly1305: incorrect destination length");
      u = i;
    } else
      u = new Uint8Array(c);
    return ol(this._key, s, t, u, 4), this._authenticate(u.subarray(u.length - this.tagLength, u.length), o, u.subarray(0, u.length - this.tagLength), n), Cr(s), u;
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
    Tf(this._key, s, o, 4);
    const c = new Uint8Array(this.tagLength);
    if (this._authenticate(c, o, t.subarray(0, t.length - this.tagLength), n), !zy(c, t.subarray(t.length - this.tagLength, t.length)))
      return null;
    const u = t.length - this.tagLength;
    let h;
    if (i) {
      if (i.length !== u)
        throw new Error("ChaCha20Poly1305: incorrect destination length");
      h = i;
    } else
      h = new Uint8Array(u);
    return ol(this._key, s, t.subarray(0, t.length - this.tagLength), h, 4), Cr(s), h;
  }
  clean() {
    return Cr(this._key), this;
  }
  _authenticate(e, t, n, i) {
    const s = new qy(t);
    i && (s.update(i), i.length % 16 > 0 && s.update(Nf.subarray(i.length % 16))), s.update(n), n.length % 16 > 0 && s.update(Nf.subarray(n.length % 16));
    const o = new Uint8Array(8);
    i && Of(i.length, o), s.update(o), Of(n.length, o), s.update(o);
    const c = s.digest();
    for (let u = 0; u < c.length; u++)
      e[u] = c[u];
    s.clean(), Cr(c), Cr(o);
  }
}
const Pf = 65536;
class Jy {
  constructor() {
    Fe(this, "isAvailable", !1);
    Fe(this, "isInstantiated", !1);
    typeof crypto < "u" && "getRandomValues" in crypto && (this.isAvailable = !0, this.isInstantiated = !0);
  }
  randomBytes(e) {
    if (!this.isAvailable)
      throw new Error("System random byte generator is not available.");
    const t = new Uint8Array(e);
    for (let n = 0; n < t.length; n += Pf)
      crypto.getRandomValues(t.subarray(n, n + Math.min(t.length - n, Pf)));
    return t;
  }
}
const Xy = new Jy();
function Qy(r, e = Xy) {
  return e.randomBytes(r);
}
function kd(r, e) {
  const t = new Pu(r), n = Qy(12), s = new TextEncoder().encode(e), o = t.seal(n, s), c = new Uint8Array(n.length + o.length);
  return c.set(n), c.set(o, n.length), Br(c);
}
function Cd(r, e) {
  const t = new Pu(r), n = Ds(e), i = 12, s = n.slice(0, i), o = n.slice(i), c = t.open(s, o);
  if (!c)
    throw new Error("Decryption failed");
  return new TextDecoder().decode(c);
}
var al = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function eg(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function tg(r) {
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
var jf;
(function(r) {
  (function(e) {
    var t = typeof globalThis == "object" ? globalThis : typeof al == "object" ? al : typeof self == "object" ? self : typeof this == "object" ? this : c(), n = i(r);
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
        return Ss(/* @__PURE__ */ Object.create(null));
      } : u ? function() {
        return Ss({ __proto__: null });
      } : function() {
        return Ss({});
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
    }, x = Object.getPrototypeOf(Function), z = typeof Map == "function" && typeof Map.prototype.entries == "function" ? Map : xs(), N = typeof Set == "function" && typeof Set.prototype.entries == "function" ? Set : As(), v = typeof WeakMap == "function" ? WeakMap : To(), A = i ? Symbol.for("@reflect-metadata:registry") : void 0, O = ws(), I = Ti(O);
    function P(_, k, T, K) {
      if (le(T)) {
        if (!ds(_))
          throw new TypeError();
        if (!ps(k))
          throw new TypeError();
        return bt(_, k);
      } else {
        if (!ds(_))
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
        if (!le(be) && !Vc(be))
          throw new TypeError();
        _e(_, k, K, be);
      }
      return T;
    }
    e("metadata", R);
    function ae(_, k, T, K) {
      if (!Q(T))
        throw new TypeError();
      return le(K) || (K = or(K)), _e(_, k, T, K);
    }
    e("defineMetadata", ae);
    function Ge(_, k, T) {
      if (!Q(k))
        throw new TypeError();
      return le(T) || (T = or(T)), Et(_, k, T);
    }
    e("hasMetadata", Ge);
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
    function ce(_, k, T) {
      if (!Q(k))
        throw new TypeError();
      return le(T) || (T = or(T)), ie(_, k, T);
    }
    e("getOwnMetadata", ce);
    function ve(_, k) {
      if (!Q(_))
        throw new TypeError();
      return le(k) || (k = or(k)), yt(_, k);
    }
    e("getMetadataKeys", ve);
    function we(_, k) {
      if (!Q(_))
        throw new TypeError();
      return le(k) || (k = or(k)), Ut(_, k);
    }
    e("getOwnMetadataKeys", we);
    function ze(_, k, T) {
      if (!Q(k))
        throw new TypeError();
      if (le(T) || (T = or(T)), !Q(k))
        throw new TypeError();
      le(T) || (T = or(T));
      var K = Yr(
        k,
        T,
        /*Create*/
        !1
      );
      return le(K) ? !1 : K.OrdinaryDeleteMetadata(_, k, T);
    }
    e("deleteMetadata", ze);
    function bt(_, k) {
      for (var T = _.length - 1; T >= 0; --T) {
        var K = _[T], be = K(k);
        if (!le(be) && !it(be)) {
          if (!ps(be))
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
      var be = Oi(k);
      return it(be) ? !1 : Et(_, be, T);
    }
    function ht(_, k, T) {
      var K = Yr(
        k,
        T,
        /*Create*/
        !1
      );
      return le(K) ? !1 : hs(K.OrdinaryHasOwnMetadata(_, k, T));
    }
    function Qe(_, k, T) {
      var K = ht(_, k, T);
      if (K)
        return ie(_, k, T);
      var be = Oi(k);
      if (!it(be))
        return Qe(_, be, T);
    }
    function ie(_, k, T) {
      var K = Yr(
        k,
        T,
        /*Create*/
        !1
      );
      if (!le(K))
        return K.OrdinaryGetOwnMetadata(_, k, T);
    }
    function _e(_, k, T, K) {
      var be = Yr(
        T,
        K,
        /*Create*/
        !0
      );
      be.OrdinaryDefineOwnMetadata(_, k, T, K);
    }
    function yt(_, k) {
      var T = Ut(_, k), K = Oi(_);
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
      for (var pe = 0, Xe = be; pe < Xe.length; pe++) {
        var ee = Xe[pe], ue = At.has(ee);
        ue || (At.add(ee), St.push(ee));
      }
      return St;
    }
    function Ut(_, k) {
      var T = Yr(
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
      var T = "string", K = Oo(_, s);
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
    function hs(_) {
      return !!_;
    }
    function Bi(_) {
      return "" + _;
    }
    function or(_) {
      var k = dt(_);
      return gt(k) ? k : Bi(k);
    }
    function ds(_) {
      return Array.isArray ? Array.isArray(_) : _ instanceof Object ? _ instanceof Array : Object.prototype.toString.call(_) === "[object Array]";
    }
    function yn(_) {
      return typeof _ == "function";
    }
    function ps(_) {
      return typeof _ == "function";
    }
    function Vc(_) {
      switch (Dt(_)) {
        case 3:
          return !0;
        case 4:
          return !0;
        default:
          return !1;
      }
    }
    function ys(_, k) {
      return _ === k || _ !== _ && k !== k;
    }
    function Oo(_, k) {
      var T = _[k];
      if (T != null) {
        if (!yn(T))
          throw new TypeError();
        return T;
      }
    }
    function gs(_) {
      var k = Oo(_, o);
      if (!yn(k))
        throw new TypeError();
      var T = k.call(_);
      if (!Q(T))
        throw new TypeError();
      return T;
    }
    function vs(_) {
      return _.value;
    }
    function Wr(_) {
      var k = _.next();
      return k.done ? !1 : k;
    }
    function Qn(_) {
      var k = _.return;
      k && k.call(_);
    }
    function Oi(_) {
      var k = Object.getPrototypeOf(_);
      if (typeof _ != "function" || _ === x || k !== x)
        return k;
      var T = _.prototype, K = T && Object.getPrototypeOf(T);
      if (K == null || K === Object.prototype)
        return k;
      var be = K.constructor;
      return typeof be != "function" || be === _ ? k : be;
    }
    function ms() {
      var _;
      !le(A) && typeof t.Reflect < "u" && !(A in t.Reflect) && typeof t.Reflect.defineMetadata == "function" && (_ = bs(t.Reflect));
      var k, T, K, be = new v(), At = {
        registerProvider: St,
        getProvider: Z,
        setProvider: ue
      };
      return At;
      function St(pe) {
        if (!Object.isExtensible(At))
          throw new Error("Cannot add provider to a frozen registry.");
        switch (!0) {
          case _ === pe:
            break;
          case le(k):
            k = pe;
            break;
          case k === pe:
            break;
          case le(T):
            T = pe;
            break;
          case T === pe:
            break;
          default:
            K === void 0 && (K = new N()), K.add(pe);
            break;
        }
      }
      function je(pe, Xe) {
        if (!le(k)) {
          if (k.isProviderFor(pe, Xe))
            return k;
          if (!le(T)) {
            if (T.isProviderFor(pe, Xe))
              return k;
            if (!le(K))
              for (var tt = gs(K); ; ) {
                var vt = Wr(tt);
                if (!vt)
                  return;
                var Gt = vs(vt);
                if (Gt.isProviderFor(pe, Xe))
                  return Qn(tt), Gt;
              }
          }
        }
        if (!le(_) && _.isProviderFor(pe, Xe))
          return _;
      }
      function Z(pe, Xe) {
        var tt = be.get(pe), vt;
        return le(tt) || (vt = tt.get(Xe)), le(vt) && (vt = je(pe, Xe), le(vt) || (le(tt) && (tt = new z(), be.set(pe, tt)), tt.set(Xe, vt))), vt;
      }
      function ee(pe) {
        if (le(pe))
          throw new TypeError();
        return k === pe || T === pe || !le(K) && K.has(pe);
      }
      function ue(pe, Xe, tt) {
        if (!ee(tt))
          throw new Error("Metadata provider not registered.");
        var vt = Z(pe, Xe);
        if (vt !== tt) {
          if (!le(vt))
            return !1;
          var Gt = be.get(pe);
          le(Gt) && (Gt = new z(), be.set(pe, Gt)), Gt.set(Xe, tt);
        }
        return !0;
      }
    }
    function ws() {
      var _;
      return !le(A) && Q(t.Reflect) && Object.isExtensible(t.Reflect) && (_ = t.Reflect[A]), le(_) && (_ = ms()), !le(A) && Q(t.Reflect) && Object.isExtensible(t.Reflect) && Object.defineProperty(t.Reflect, A, {
        enumerable: !1,
        configurable: !1,
        writable: !1,
        value: _
      }), _;
    }
    function Ti(_) {
      var k = new v(), T = {
        isProviderFor: function(ee, ue) {
          var pe = k.get(ee);
          return le(pe) ? !1 : pe.has(ue);
        },
        OrdinaryDefineOwnMetadata: St,
        OrdinaryHasOwnMetadata: be,
        OrdinaryGetOwnMetadata: At,
        OrdinaryOwnMetadataKeys: je,
        OrdinaryDeleteMetadata: Z
      };
      return O.registerProvider(T), T;
      function K(ee, ue, pe) {
        var Xe = k.get(ee), tt = !1;
        if (le(Xe)) {
          if (!pe)
            return;
          Xe = new z(), k.set(ee, Xe), tt = !0;
        }
        var vt = Xe.get(ue);
        if (le(vt)) {
          if (!pe)
            return;
          if (vt = new z(), Xe.set(ue, vt), !_.setProvider(ee, ue, T))
            throw Xe.delete(ue), tt && k.delete(ee), new Error("Wrong provider for target.");
        }
        return vt;
      }
      function be(ee, ue, pe) {
        var Xe = K(
          ue,
          pe,
          /*Create*/
          !1
        );
        return le(Xe) ? !1 : hs(Xe.has(ee));
      }
      function At(ee, ue, pe) {
        var Xe = K(
          ue,
          pe,
          /*Create*/
          !1
        );
        if (!le(Xe))
          return Xe.get(ee);
      }
      function St(ee, ue, pe, Xe) {
        var tt = K(
          pe,
          Xe,
          /*Create*/
          !0
        );
        tt.set(ee, ue);
      }
      function je(ee, ue) {
        var pe = [], Xe = K(
          ee,
          ue,
          /*Create*/
          !1
        );
        if (le(Xe))
          return pe;
        for (var tt = Xe.keys(), vt = gs(tt), Gt = 0; ; ) {
          var Ni = Wr(vt);
          if (!Ni)
            return pe.length = Gt, pe;
          var _s = vs(Ni);
          try {
            pe[Gt] = _s;
          } catch (No) {
            try {
              Qn(vt);
            } finally {
              throw No;
            }
          }
          Gt++;
        }
      }
      function Z(ee, ue, pe) {
        var Xe = K(
          ue,
          pe,
          /*Create*/
          !1
        );
        if (le(Xe) || !Xe.delete(ee))
          return !1;
        if (Xe.size === 0) {
          var tt = k.get(ue);
          le(tt) || (tt.delete(pe), tt.size === 0 && k.delete(tt));
        }
        return !0;
      }
    }
    function bs(_) {
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
    function Yr(_, k, T) {
      var K = O.getProvider(_, k);
      if (!le(K))
        return K;
      if (T) {
        if (O.setProvider(_, k, I))
          return I;
        throw new Error("Illegal state.");
      }
    }
    function xs() {
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
              for (var ue = this._keys.length, pe = ee + 1; pe < ue; pe++)
                this._keys[pe - 1] = this._keys[pe], this._values[pe - 1] = this._values[pe];
              return this._keys.length--, this._values.length--, ys(Z, this._cacheKey) && (this._cacheKey = _, this._cacheIndex = -2), !0;
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
            if (!ys(this._cacheKey, Z)) {
              this._cacheIndex = -1;
              for (var ue = 0; ue < this._keys.length; ue++)
                if (ys(this._keys[ue], Z)) {
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
    function As() {
      var _ = (
        /** @class */
        function() {
          function k() {
            this._map = new z();
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
    function To() {
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
            var pe = be(
              ee,
              /*create*/
              !0
            );
            return pe[this._key] = ue, this;
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
          var pe = Z[ue];
          (ue === 4 || ue === 6 || ue === 8) && (ee += "-"), pe < 16 && (ee += "0"), ee += pe.toString(16).toLowerCase();
        }
        return ee;
      }
    }
    function Ss(_) {
      return _.__ = void 0, delete _.__, _;
    }
  });
})(jf || (jf = {}));
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
const rg = "[object ArrayBuffer]";
class W {
  static isArrayBuffer(e) {
    return Object.prototype.toString.call(e) === rg;
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
const Hc = "string", ng = /^[0-9a-f]+$/i, ig = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/, sg = /^[a-zA-Z0-9-_]+$/;
class Rf {
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
class Jr {
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
    return typeof e === Hc && ng.test(e);
  }
  static isBase64(e) {
    return typeof e === Hc && ig.test(e);
  }
  static isBase64Url(e) {
    return typeof e === Hc && sg.test(e);
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
        return Jr.toString(n, !0);
      case "utf16":
      case "utf16be":
        return Jr.toString(n);
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
        return Jr.fromString(e, !0);
      case "utf16":
      case "utf16be":
        return Jr.fromString(e);
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
        return Rf.fromString(e);
      case "utf16":
      case "utf16be":
        return Jr.fromString(e);
      case "utf16le":
      case "usc2":
        return Jr.fromString(e, !0);
      default:
        throw new Error(`Unknown type of encoding '${t}'`);
    }
  }
  static ToUtf8String(e, t = fe.DEFAULT_UTF8_ENCODING) {
    switch (t) {
      case "ascii":
        return this.ToBinary(e);
      case "utf8":
        return Rf.toString(e);
      case "utf16":
      case "utf16be":
        return Jr.toString(e);
      case "utf16le":
      case "usc2":
        return Jr.toString(e, !0);
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
    return Jr.toString(e, t);
  }
  static FromUtf16String(e, t = !1) {
    return Jr.fromString(e, t);
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
function og(...r) {
  const e = r.map((i) => i.byteLength).reduce((i, s) => i + s), t = new Uint8Array(e);
  let n = 0;
  return r.map((i) => new Uint8Array(i)).forEach((i) => {
    for (const s of i)
      t[n++] = s;
  }), t.buffer;
}
function zo(r, e) {
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
function Vi(r, e) {
  let t = 0;
  if (r.length === 1)
    return r[0];
  for (let n = r.length - 1; n >= 0; n--)
    t += r[r.length - 1 - n] * Math.pow(2, e * n);
  return t;
}
function li(r, e, t = -1) {
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
function cl(...r) {
  let e = 0, t = 0;
  for (const s of r)
    e += s.length;
  const n = new ArrayBuffer(e), i = new Uint8Array(n);
  for (const s of r)
    i.set(s, t), t += s.length;
  return i;
}
function Bd() {
  const r = new Uint8Array(this.valueHex);
  if (this.valueHex.byteLength >= 2) {
    const c = r[0] === 255 && r[1] & 128, u = r[0] === 0 && (r[1] & 128) === 0;
    (c || u) && this.warnings.push("Needlessly long format");
  }
  const e = new ArrayBuffer(this.valueHex.byteLength), t = new Uint8Array(e);
  for (let c = 0; c < this.valueHex.byteLength; c++)
    t[c] = 0;
  t[0] = r[0] & 128;
  const n = Vi(t, 8), i = new ArrayBuffer(this.valueHex.byteLength), s = new Uint8Array(i);
  for (let c = 0; c < this.valueHex.byteLength; c++)
    s[c] = r[c];
  return s[0] &= 127, Vi(s, 8) - n;
}
function ag(r) {
  const e = r < 0 ? r * -1 : r;
  let t = 128;
  for (let n = 1; n < 8; n++) {
    if (e <= t) {
      if (r < 0) {
        const o = t - e, c = li(o, 8, n), u = new Uint8Array(c);
        return u[0] |= 128, c;
      }
      let i = li(e, 8, n), s = new Uint8Array(i);
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
function cg(r, e) {
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
function Ko() {
  if (typeof BigInt > "u")
    throw new Error("BigInt is not defined. Your environment doesn't implement BigInt.");
}
function ju(r) {
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
    return ju(this.items);
  }
}
const Es = [new Uint8Array([1])], Uf = "0123456789", Fc = "name", Df = "valueHexView", lg = "isHexOnly", ug = "idBlock", fg = "tagClass", hg = "tagNumber", dg = "isConstructed", pg = "fromBER", yg = "toBER", gg = "local", yr = "", qr = new ArrayBuffer(0), za = new Uint8Array(0), $s = "EndOfContent", Od = "OCTET STRING", Td = "BIT STRING";
function hn(r) {
  var e;
  return e = class extends r {
    constructor(...n) {
      var i;
      super(...n);
      const s = n[0] || {};
      this.isHexOnly = (i = s.isHexOnly) !== null && i !== void 0 ? i : !1, this.valueHexView = s.valueHex ? W.toUint8Array(s.valueHex) : za;
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
      return this.isHexOnly ? n ? new ArrayBuffer(this.valueHexView.byteLength) : this.valueHexView.byteLength === this.valueHexView.buffer.byteLength ? this.valueHexView.buffer : this.valueHexView.slice().buffer : (this.error = "Flag 'isHexOnly' is not set, abort", qr);
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
class Ii {
  constructor({ blockLength: e = 0, error: t = yr, warnings: n = [], valueBeforeDecode: i = za } = {}) {
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
Ii.NAME = "baseBlock";
class fr extends Ii {
  fromBER(e, t, n) {
    throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
  }
  toBER(e, t) {
    throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
  }
}
fr.NAME = "valueBlock";
class Nd extends hn(Ii) {
  constructor({ idBlock: e = {} } = {}) {
    var t, n, i, s;
    super(), e ? (this.isHexOnly = (t = e.isHexOnly) !== null && t !== void 0 ? t : !1, this.valueHexView = e.valueHex ? W.toUint8Array(e.valueHex) : za, this.tagClass = (n = e.tagClass) !== null && n !== void 0 ? n : -1, this.tagNumber = (i = e.tagNumber) !== null && i !== void 0 ? i : -1, this.isConstructed = (s = e.isConstructed) !== null && s !== void 0 ? s : !1) : (this.tagClass = -1, this.tagNumber = -1, this.isConstructed = !1);
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
        return this.error = "Unknown tag class", qr;
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
      const i = li(this.tagNumber, 7), s = new Uint8Array(i), o = i.byteLength, c = new Uint8Array(o + 1);
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
          const z = new Uint8Array(m);
          for (let N = 0; N < h.length; N++)
            z[N] = h[N];
          h = this.valueHexView = new Uint8Array(m);
        }
      }
      this.blockLength = u + 1, h[u - 1] = s[u] & 127;
      const x = new Uint8Array(u);
      for (let z = 0; z < u; z++)
        x[z] = h[z];
      h = this.valueHexView = new Uint8Array(u), h.set(x), this.blockLength <= 9 ? this.tagNumber = Vi(h, 7) : (this.isHexOnly = !0, this.warnings.push("Tag too long, represented as hex-coded"));
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
Nd.NAME = "identificationBlock";
class Pd extends Ii {
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
    return u[o - 1] === 0 && this.warnings.push("Needlessly long encoded length"), this.length = Vi(u, 8), this.longFormUsed && this.length <= 127 && this.warnings.push("Unnecessary usage of long length form"), this.blockLength = o + 1, t + this.blockLength;
  }
  toBER(e = !1) {
    let t, n;
    if (this.length > 127 && (this.longFormUsed = !0), this.isIndefiniteForm)
      return t = new ArrayBuffer(1), e === !1 && (n = new Uint8Array(t), n[0] = 128), t;
    if (this.longFormUsed) {
      const i = li(this.length, 8);
      if (i.byteLength > 127)
        return this.error = "Too big length", qr;
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
Pd.NAME = "lengthBlock";
const se = {};
class Jt extends Ii {
  constructor({ name: e = yr, optional: t = !1, primitiveSchema: n, ...i } = {}, s) {
    super(i), this.name = e, this.optional = t, n && (this.primitiveSchema = n), this.idBlock = new Nd(i), this.lenBlock = new Pd(i), this.valueBlock = s ? new s(i) : new fr(i);
  }
  fromBER(e, t, n) {
    const i = this.valueBlock.fromBER(e, t, this.lenBlock.isIndefiniteForm ? n : this.lenBlock.length);
    return i === -1 ? (this.error = this.valueBlock.error, i) : (this.idBlock.error.length || (this.blockLength += this.idBlock.blockLength), this.lenBlock.error.length || (this.blockLength += this.lenBlock.blockLength), this.valueBlock.error.length || (this.blockLength += this.valueBlock.blockLength), i);
  }
  toBER(e, t) {
    const n = t || new Ga();
    t || jd(this);
    const i = this.idBlock.toBER(e);
    if (n.write(i), this.lenBlock.isIndefiniteForm)
      n.write(new Uint8Array([128]).buffer), this.valueBlock.toBER(e, n), n.write(new ArrayBuffer(2));
    else {
      const s = this.valueBlock.toBER(e);
      this.lenBlock.length = s.byteLength;
      const o = this.lenBlock.toBER(e);
      n.write(o), n.write(s);
    }
    return t ? qr : n.final();
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
    return cg(t, n);
  }
}
Jt.NAME = "BaseBlock";
function jd(r) {
  if (r instanceof se.Constructed)
    for (const e of r.valueBlock.value)
      jd(e) && (r.lenBlock.isIndefiniteForm = !0);
  return !!r.lenBlock.isIndefiniteForm;
}
class Ru extends Jt {
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
Ru.NAME = "BaseStringBlock";
class Rd extends hn(fr) {
  constructor({ isHexOnly: e = !0, ...t } = {}) {
    super(t), this.isHexOnly = e;
  }
}
Rd.NAME = "PrimitiveValueBlock";
var Ud;
class po extends Jt {
  constructor(e = {}) {
    super(e, Rd), this.idBlock.isConstructed = !1;
  }
}
Ud = po;
se.Primitive = Ud;
po.NAME = "PRIMITIVE";
function vg(r, e) {
  if (r instanceof e)
    return r;
  const t = new e();
  return t.idBlock = r.idBlock, t.lenBlock = r.lenBlock, t.warnings = r.warnings, t.valueBeforeDecodeView = r.valueBeforeDecodeView, t;
}
function is(r, e = 0, t = r.length) {
  const n = e;
  let i = new Jt({}, fr);
  const s = new Ii();
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
          u = se.EndOfContent;
          break;
        case 1:
          u = se.Boolean;
          break;
        case 2:
          u = se.Integer;
          break;
        case 3:
          u = se.BitString;
          break;
        case 4:
          u = se.OctetString;
          break;
        case 5:
          u = se.Null;
          break;
        case 6:
          u = se.ObjectIdentifier;
          break;
        case 10:
          u = se.Enumerated;
          break;
        case 12:
          u = se.Utf8String;
          break;
        case 13:
          u = se.RelativeObjectIdentifier;
          break;
        case 14:
          u = se.TIME;
          break;
        case 15:
          return i.error = "[UNIVERSAL 15] is reserved by ASN.1 standard", {
            offset: -1,
            result: i
          };
        case 16:
          u = se.Sequence;
          break;
        case 17:
          u = se.Set;
          break;
        case 18:
          u = se.NumericString;
          break;
        case 19:
          u = se.PrintableString;
          break;
        case 20:
          u = se.TeletexString;
          break;
        case 21:
          u = se.VideotexString;
          break;
        case 22:
          u = se.IA5String;
          break;
        case 23:
          u = se.UTCTime;
          break;
        case 24:
          u = se.GeneralizedTime;
          break;
        case 25:
          u = se.GraphicString;
          break;
        case 26:
          u = se.VisibleString;
          break;
        case 27:
          u = se.GeneralString;
          break;
        case 28:
          u = se.UniversalString;
          break;
        case 29:
          u = se.CharacterString;
          break;
        case 30:
          u = se.BmpString;
          break;
        case 31:
          u = se.DATE;
          break;
        case 32:
          u = se.TimeOfDay;
          break;
        case 33:
          u = se.DateTime;
          break;
        case 34:
          u = se.Duration;
          break;
        default: {
          const h = i.idBlock.isConstructed ? new se.Constructed() : new se.Primitive();
          h.idBlock = i.idBlock, h.lenBlock = i.lenBlock, h.warnings = i.warnings, i = h;
        }
      }
      break;
    case 2:
    case 3:
    case 4:
    default:
      u = i.idBlock.isConstructed ? se.Constructed : se.Primitive;
  }
  return i = vg(i, u), c = i.fromBER(r, e, i.lenBlock.isIndefiniteForm ? t : i.lenBlock.length), i.valueBeforeDecodeView = r.subarray(n, n + i.blockLength), {
    offset: c,
    result: i
  };
}
function Di(r) {
  if (!r.byteLength) {
    const e = new Jt({}, fr);
    return e.error = "Input buffer has zero length", {
      offset: -1,
      result: e
    };
  }
  return is(W.toUint8Array(r).slice(), 0, r.byteLength);
}
function mg(r, e) {
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
    for (; mg(this.isIndefiniteForm, n) > 0; ) {
      const o = is(i, s, n);
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
    return t ? qr : n.final();
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
var Dd;
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
Dd = vr;
se.Constructed = Dd;
vr.NAME = "CONSTRUCTED";
class $d extends fr {
  fromBER(e, t, n) {
    return t;
  }
  toBER(e) {
    return qr;
  }
}
$d.override = "EndOfContentValueBlock";
var Md;
class Uu extends Jt {
  constructor(e = {}) {
    super(e, $d), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 0;
  }
}
Md = Uu;
se.EndOfContent = Md;
Uu.NAME = $s;
var Vd;
class ui extends Jt {
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
Vd = ui;
se.Null = Vd;
ui.NAME = "NULL";
class Ld extends hn(fr) {
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
    return kn(this, i, t, n) ? (this.valueHexView = i.subarray(t, t + n), n > 1 && this.warnings.push("Boolean value encoded in more then 1 octet"), this.isHexOnly = !0, Bd.call(this), this.blockLength = n, t + n) : -1;
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
Ld.NAME = "BooleanValueBlock";
var Hd;
let Ka = class extends Jt {
  constructor(e = {}) {
    super(e, Ld), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 1;
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
Hd = Ka;
se.Boolean = Hd;
Ka.NAME = "BOOLEAN";
class Fd extends hn(Ln) {
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
        if (o !== Od)
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
Fd.NAME = "OctetStringValueBlock";
var Gd;
let oi = class zd extends Jt {
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
    }, Fd), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 4;
  }
  fromBER(e, t, n) {
    if (this.valueBlock.isConstructed = this.idBlock.isConstructed, this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm, n === 0)
      return this.idBlock.error.length === 0 && (this.blockLength += this.idBlock.blockLength), this.lenBlock.error.length === 0 && (this.blockLength += this.lenBlock.blockLength), t;
    if (!this.valueBlock.isConstructed) {
      const s = (e instanceof ArrayBuffer ? new Uint8Array(e) : e).subarray(t, t + n);
      try {
        if (s.byteLength) {
          const o = is(s, 0, s.byteLength);
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
      t instanceof zd && e.push(t.valueBlock.valueHexView);
    return W.concat(e);
  }
};
Gd = oi;
se.OctetString = Gd;
oi.NAME = Od;
class Kd extends hn(Ln) {
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
        if (u !== Td)
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
          const u = is(c, 0, c.byteLength);
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
      return qr;
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
Kd.NAME = "BitStringValueBlock";
var qd;
let ai = class extends Jt {
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
    }, Kd), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 3;
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
qd = ai;
se.BitString = qd;
ai.NAME = Td;
var Zd;
function wg(r, e) {
  const t = new Uint8Array([0]), n = new Uint8Array(r), i = new Uint8Array(e);
  let s = n.slice(0);
  const o = s.length - 1, c = i.slice(0), u = c.length - 1;
  let h = 0;
  const m = u < o ? o : u;
  let x = 0;
  for (let z = m; z >= 0; z--, x++) {
    switch (!0) {
      case x < c.length:
        h = s[o - x] + c[u - x] + t[0];
        break;
      default:
        h = s[o - x] + t[0];
    }
    switch (t[0] = h / 10, !0) {
      case x >= s.length:
        s = cl(new Uint8Array([h % 10]), s);
        break;
      default:
        s[o - x] = h % 10;
    }
  }
  return t[0] > 0 && (s = cl(t, s)), s;
}
function $f(r) {
  if (r >= Es.length)
    for (let e = Es.length; e <= r; e++) {
      const t = new Uint8Array([0]);
      let n = Es[e - 1].slice(0);
      for (let i = n.length - 1; i >= 0; i--) {
        const s = new Uint8Array([(n[i] << 1) + t[0]]);
        t[0] = s[0] / 10, n[i] = s[0] % 10;
      }
      t[0] > 0 && (n = cl(t, n)), Es.push(n);
    }
  return Es[r];
}
function bg(r, e) {
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
class Du extends hn(fr) {
  constructor({ value: e, ...t } = {}) {
    super(t), this._valueDec = 0, t.valueHex && this.setValueHex(), e !== void 0 && (this.valueDec = e);
  }
  setValueHex() {
    this.valueHexView.length >= 4 ? (this.warnings.push("Too big Integer for decoding, hex only"), this.isHexOnly = !0, this._valueDec = 0) : (this.isHexOnly = !1, this.valueHexView.length > 0 && (this._valueDec = Bd.call(this)));
  }
  set valueDec(e) {
    this._valueDec = e, this.isHexOnly = !1, this.valueHexView = new Uint8Array(ag(e));
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
              t = bg($f(n), t), o = "-";
              break;
            default:
              t = wg(t, $f(n));
          }
        n++, i >>= 1;
      }
    }
    for (let u = 0; u < t.length; u++)
      t[u] && (c = !0), c && (o += Uf.charAt(t[u]));
    return c === !1 && (o += Uf.charAt(0)), o;
  }
}
Zd = Du;
Du.NAME = "IntegerValueBlock";
Object.defineProperty(Zd.prototype, "valueHex", {
  set: function(r) {
    this.valueHexView = new Uint8Array(r), this.setValueHex();
  },
  get: function() {
    return this.valueHexView.slice().buffer;
  }
});
var Wd;
class sn extends Jt {
  constructor(e = {}) {
    super(e, Du), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 2;
  }
  toBigInt() {
    return Ko(), BigInt(this.valueBlock.toString());
  }
  static fromBigInt(e) {
    Ko();
    const t = BigInt(e), n = new Ga(), i = t.toString(16).replace(/^-/, ""), s = new Uint8Array(fe.FromHex(i));
    if (t < 0) {
      const c = new Uint8Array(s.length + (s[0] & 128 ? 1 : 0));
      c[0] |= 128;
      const h = BigInt(`0x${fe.ToHex(c)}`) + t, m = W.toUint8Array(fe.FromHex(h.toString(16)));
      m[0] |= 128, n.write(m);
    } else
      s[0] & 128 && n.write(new Uint8Array([0])), n.write(s);
    return new sn({
      valueHex: n.final()
    });
  }
  convertToDER() {
    const e = new sn({ valueHex: this.valueBlock.valueHexView });
    return e.valueBlock.toDER(), e;
  }
  convertFromDER() {
    return new sn({
      valueHex: this.valueBlock.valueHexView[0] === 0 ? this.valueBlock.valueHexView.subarray(1) : this.valueBlock.valueHexView
    });
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.valueBlock.toString()}`;
  }
}
Wd = sn;
se.Integer = Wd;
sn.NAME = "INTEGER";
var Yd;
class qa extends sn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 10;
  }
}
Yd = qa;
se.Enumerated = Yd;
qa.NAME = "ENUMERATED";
class ll extends hn(fr) {
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
    return this.valueHexView = o, s[this.blockLength - 1] & 128 ? (this.error = "End of input reached before message was fully decoded", -1) : (this.valueHexView[0] === 0 && this.warnings.push("Needlessly long format of SID encoding"), this.blockLength <= 8 ? this.valueDec = Vi(this.valueHexView, 7) : (this.isHexOnly = !0, this.warnings.push("Too big SID for decoding, hex only")), t + this.blockLength);
  }
  set valueBigInt(e) {
    Ko();
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
    const t = li(this.valueDec, 7);
    if (t.byteLength === 0)
      return this.error = "Error during encoding SID value", qr;
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
ll.NAME = "sidBlock";
class Jd extends fr {
  constructor({ value: e = yr, ...t } = {}) {
    super(t), this.value = [], e && this.fromString(e);
  }
  fromBER(e, t, n) {
    let i = t;
    for (; n > 0; ) {
      const s = new ll();
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
        return this.error = this.value[n].error, qr;
      t.push(i);
    }
    return ju(t);
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
        const o = new ll();
        if (i > Number.MAX_SAFE_INTEGER) {
          Ko();
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
Jd.NAME = "ObjectIdentifierValueBlock";
var Xd;
class Za extends Jt {
  constructor(e = {}) {
    super(e, Jd), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 6;
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
Xd = Za;
se.ObjectIdentifier = Xd;
Za.NAME = "OBJECT IDENTIFIER";
class ul extends hn(Ii) {
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
    return this.valueHexView = o, s[this.blockLength - 1] & 128 ? (this.error = "End of input reached before message was fully decoded", -1) : (this.valueHexView[0] === 0 && this.warnings.push("Needlessly long format of SID encoding"), this.blockLength <= 8 ? this.valueDec = Vi(this.valueHexView, 7) : (this.isHexOnly = !0, this.warnings.push("Too big SID for decoding, hex only")), t + this.blockLength);
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
    const t = li(this.valueDec, 7);
    if (t.byteLength === 0)
      return this.error = "Error during encoding SID value", qr;
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
ul.NAME = "relativeSidBlock";
class Qd extends fr {
  constructor({ value: e = yr, ...t } = {}) {
    super(t), this.value = [], e && this.fromString(e);
  }
  fromBER(e, t, n) {
    let i = t;
    for (; n > 0; ) {
      const s = new ul();
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
        return this.error = this.value[i].error, qr;
      n.push(s);
    }
    return ju(n);
  }
  fromString(e) {
    this.value = [];
    let t = 0, n = 0, i = "";
    do {
      n = e.indexOf(".", t), n === -1 ? i = e.substring(t) : i = e.substring(t, n), t = n + 1;
      const s = new ul();
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
Qd.NAME = "RelativeObjectIdentifierValueBlock";
var ep;
class $u extends Jt {
  constructor(e = {}) {
    super(e, Qd), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 13;
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
ep = $u;
se.RelativeObjectIdentifier = ep;
$u.NAME = "RelativeObjectIdentifier";
var tp;
class wn extends vr {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 16;
  }
}
tp = wn;
se.Sequence = tp;
wn.NAME = "SEQUENCE";
var rp;
let bn = class extends vr {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 17;
  }
};
rp = bn;
se.Set = rp;
bn.NAME = "SET";
class np extends hn(fr) {
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
np.NAME = "StringValueBlock";
class ip extends np {
}
ip.NAME = "SimpleStringValueBlock";
class Ir extends Ru {
  constructor({ ...e } = {}) {
    super(e, ip);
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
class sp extends Ir {
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
sp.NAME = "Utf8StringValueBlock";
var op;
class Cn extends sp {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 12;
  }
}
op = Cn;
se.Utf8String = op;
Cn.NAME = "UTF8String";
class ap extends Ir {
  fromBuffer(e) {
    this.valueBlock.value = fe.ToUtf16String(e), this.valueBlock.valueHexView = W.toUint8Array(e);
  }
  fromString(e) {
    this.valueBlock.value = e, this.valueBlock.valueHexView = new Uint8Array(fe.FromUtf16String(e));
  }
}
ap.NAME = "BmpStringValueBlock";
var cp;
class Wa extends ap {
  constructor({ ...e } = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 30;
  }
}
cp = Wa;
se.BmpString = cp;
Wa.NAME = "BMPString";
class lp extends Ir {
  fromBuffer(e) {
    const t = ArrayBuffer.isView(e) ? e.slice().buffer : e.slice(0), n = new Uint8Array(t);
    for (let i = 0; i < n.length; i += 4)
      n[i] = n[i + 3], n[i + 1] = n[i + 2], n[i + 2] = 0, n[i + 3] = 0;
    this.valueBlock.value = String.fromCharCode.apply(null, new Uint32Array(t));
  }
  fromString(e) {
    const t = e.length, n = this.valueBlock.valueHexView = new Uint8Array(t * 4);
    for (let i = 0; i < t; i++) {
      const s = li(e.charCodeAt(i), 8), o = new Uint8Array(s);
      if (o.length > 4)
        continue;
      const c = 4 - o.length;
      for (let u = o.length - 1; u >= 0; u--)
        n[i * 4 + u + c] = o[u];
    }
    this.valueBlock.value = e;
  }
}
lp.NAME = "UniversalStringValueBlock";
var up;
class Ya extends lp {
  constructor({ ...e } = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 28;
  }
}
up = Ya;
se.UniversalString = up;
Ya.NAME = "UniversalString";
var fp;
class Ja extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 18;
  }
}
fp = Ja;
se.NumericString = fp;
Ja.NAME = "NumericString";
var hp;
class Xa extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 19;
  }
}
hp = Xa;
se.PrintableString = hp;
Xa.NAME = "PrintableString";
var dp;
class Qa extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 20;
  }
}
dp = Qa;
se.TeletexString = dp;
Qa.NAME = "TeletexString";
var pp;
class ec extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 21;
  }
}
pp = ec;
se.VideotexString = pp;
ec.NAME = "VideotexString";
var yp;
class tc extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 22;
  }
}
yp = tc;
se.IA5String = yp;
tc.NAME = "IA5String";
var gp;
class rc extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 25;
  }
}
gp = rc;
se.GraphicString = gp;
rc.NAME = "GraphicString";
var vp;
class yo extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 26;
  }
}
vp = yo;
se.VisibleString = vp;
yo.NAME = "VisibleString";
var mp;
class nc extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 27;
  }
}
mp = nc;
se.GeneralString = mp;
nc.NAME = "GeneralString";
var wp;
class ic extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 29;
  }
}
wp = ic;
se.CharacterString = wp;
ic.NAME = "CharacterString";
var bp;
class go extends yo {
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
bp = go;
se.UTCTime = bp;
go.NAME = "UTCTime";
var xp;
class sc extends go {
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
      let x = 1, z = n.indexOf("+"), N = "";
      if (z === -1 && (z = n.indexOf("-"), x = -1), z !== -1) {
        if (N = n.substring(z + 1), n = n.substring(0, z), N.length !== 2 && N.length !== 4)
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
xp = sc;
se.GeneralizedTime = xp;
sc.NAME = "GeneralizedTime";
var Ap;
class Mu extends Cn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 31;
  }
}
Ap = Mu;
se.DATE = Ap;
Mu.NAME = "DATE";
var Sp;
class Vu extends Cn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 32;
  }
}
Sp = Vu;
se.TimeOfDay = Sp;
Vu.NAME = "TimeOfDay";
var _p;
class Lu extends Cn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 33;
  }
}
_p = Lu;
se.DateTime = _p;
Lu.NAME = "DateTime";
var Ep;
class Hu extends Cn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 34;
  }
}
Ep = Hu;
se.Duration = Ep;
Hu.NAME = "Duration";
var Ip;
class Fu extends Cn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 14;
  }
}
Ip = Fu;
se.TIME = Ip;
Fu.NAME = "TIME";
class fi {
  constructor({ name: e = yr, optional: t = !1 } = {}) {
    this.name = e, this.optional = t;
  }
}
class Gu extends fi {
  constructor({ value: e = [], ...t } = {}) {
    super(t), this.value = e;
  }
}
class qo extends fi {
  constructor({ value: e = new fi(), local: t = !1, ...n } = {}) {
    super(n), this.value = e, this.local = t;
  }
}
class xg {
  constructor({ data: e = za } = {}) {
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
  if (t instanceof Gu) {
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
      return t.hasOwnProperty(Fc) && (s.name = t.name), s;
    }
  }
  if (t instanceof fi)
    return t.hasOwnProperty(Fc) && (r[t.name] = e), {
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
  if (!(ug in t))
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (!(pg in t.idBlock))
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (!(yg in t.idBlock))
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
  if (t.idBlock.hasOwnProperty(fg) === !1)
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (t.idBlock.tagClass !== e.idBlock.tagClass)
    return {
      verified: !1,
      result: r
    };
  if (t.idBlock.hasOwnProperty(hg) === !1)
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (t.idBlock.tagNumber !== e.idBlock.tagNumber)
    return {
      verified: !1,
      result: r
    };
  if (t.idBlock.hasOwnProperty(dg) === !1)
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (t.idBlock.isConstructed !== e.idBlock.isConstructed)
    return {
      verified: !1,
      result: r
    };
  if (!(lg in t.idBlock))
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
    if (!(Df in t.idBlock))
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
  if (t.name && (t.name = t.name.replace(/^\s+|\s+$/g, yr), t.name && (r[t.name] = e)), t instanceof se.Constructed) {
    let s = 0, o = {
      verified: !1,
      result: {
        error: "Unknown error"
      }
    }, c = t.valueBlock.value.length;
    if (c > 0 && t.valueBlock.value[0] instanceof qo && (c = e.valueBlock.value.length), c === 0)
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
      } else if (t.valueBlock.value[0] instanceof qo) {
        if (o = ni(r, e.valueBlock.value[u], t.valueBlock.value[0].value), o.verified === !1)
          if (t.valueBlock.value[0].optional)
            s++;
          else
            return t.name && (t.name = t.name.replace(/^\s+|\s+$/g, yr), t.name && delete r[t.name]), o;
        if (Fc in t.valueBlock.value[0] && t.valueBlock.value[0].name.length > 0) {
          let h = {};
          gg in t.valueBlock.value[0] && t.valueBlock.value[0].local ? h = e : h = r, typeof h[t.valueBlock.value[0].name] > "u" && (h[t.valueBlock.value[0].name] = []), h[t.valueBlock.value[0].name].push(e.valueBlock.value[u]);
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
  if (t.primitiveSchema && Df in e.valueBlock) {
    const s = is(e.valueBlock.valueHexView);
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
function Ag(r, e) {
  if (!(e instanceof Object))
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema type" }
    };
  const t = is(W.toUint8Array(r));
  return t.offset === -1 ? {
    verified: !1,
    result: t.result
  } : ni(t.result, t.result, e);
}
const kp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Any: fi,
  BaseBlock: Jt,
  BaseStringBlock: Ru,
  BitString: ai,
  BmpString: Wa,
  Boolean: Ka,
  CharacterString: ic,
  Choice: Gu,
  Constructed: vr,
  DATE: Mu,
  DateTime: Lu,
  Duration: Hu,
  EndOfContent: Uu,
  Enumerated: qa,
  GeneralString: nc,
  GeneralizedTime: sc,
  GraphicString: rc,
  HexBlock: hn,
  IA5String: tc,
  Integer: sn,
  Null: ui,
  NumericString: Ja,
  ObjectIdentifier: Za,
  OctetString: oi,
  Primitive: po,
  PrintableString: Xa,
  RawData: xg,
  RelativeObjectIdentifier: $u,
  Repeated: qo,
  Sequence: wn,
  Set: bn,
  TIME: Fu,
  TeletexString: Qa,
  TimeOfDay: Vu,
  UTCTime: go,
  UniversalString: Ya,
  Utf8String: Cn,
  ValueBlock: fr,
  VideotexString: ec,
  ViewWriter: Ga,
  VisibleString: yo,
  compareSchema: ni,
  fromBER: Di,
  verifySchema: Ag
}, Symbol.toStringTag, { value: "Module" }));
var M;
(function(r) {
  r[r.Sequence = 0] = "Sequence", r[r.Set = 1] = "Set", r[r.Choice = 2] = "Choice";
})(M || (M = {}));
var b;
(function(r) {
  r[r.Any = 1] = "Any", r[r.Boolean = 2] = "Boolean", r[r.OctetString = 3] = "OctetString", r[r.BitString = 4] = "BitString", r[r.Integer = 5] = "Integer", r[r.Enumerated = 6] = "Enumerated", r[r.ObjectIdentifier = 7] = "ObjectIdentifier", r[r.Utf8String = 8] = "Utf8String", r[r.BmpString = 9] = "BmpString", r[r.UniversalString = 10] = "UniversalString", r[r.NumericString = 11] = "NumericString", r[r.PrintableString = 12] = "PrintableString", r[r.TeletexString = 13] = "TeletexString", r[r.VideotexString = 14] = "VideotexString", r[r.IA5String = 15] = "IA5String", r[r.GraphicString = 16] = "GraphicString", r[r.VisibleString = 17] = "VisibleString", r[r.GeneralString = 18] = "GeneralString", r[r.CharacterString = 19] = "CharacterString", r[r.UTCTime = 20] = "UTCTime", r[r.GeneralizedTime = 21] = "GeneralizedTime", r[r.DATE = 22] = "DATE", r[r.TimeOfDay = 23] = "TimeOfDay", r[r.DateTime = 24] = "DateTime", r[r.Duration = 25] = "Duration", r[r.TIME = 26] = "TIME", r[r.Null = 27] = "Null";
})(b || (b = {}));
class oc {
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
    if (!(e instanceof ai))
      throw new TypeError("Argument 'asn' is not instance of ASN.1 BitString");
    return this.unusedBits = e.valueBlock.unusedBits, this.value = e.valueBlock.valueHex, this;
  }
  toASN() {
    return new ai({ unusedBits: this.unusedBits, valueHex: this.value });
  }
  toSchema(e) {
    return new ai({ name: e });
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
    if (!(e instanceof oi))
      throw new TypeError("Argument 'asn' is not instance of ASN.1 OctetString");
    return this.buffer = e.valueBlock.valueHex, this;
  }
  toASN() {
    return new oi({ valueHex: this.buffer });
  }
  toSchema(e) {
    return new oi({ name: e });
  }
}
const Sg = {
  fromASN: (r) => r instanceof ui ? null : r.valueBeforeDecodeView,
  toASN: (r) => {
    if (r === null)
      return new ui();
    const e = Di(r);
    if (e.result.error)
      throw new Error(e.result.error);
    return e.result;
  }
}, _g = {
  fromASN: (r) => r.valueBlock.valueHexView.byteLength >= 4 ? r.valueBlock.toString() : r.valueBlock.valueDec,
  toASN: (r) => new sn({ value: +r })
}, Eg = {
  fromASN: (r) => r.valueBlock.valueDec,
  toASN: (r) => new qa({ value: r })
}, xt = {
  fromASN: (r) => r.valueBlock.valueHexView,
  toASN: (r) => new sn({ valueHex: r })
}, Ig = {
  fromASN: (r) => r.valueBlock.valueHexView,
  toASN: (r) => new ai({ valueHex: r })
}, kg = {
  fromASN: (r) => r.valueBlock.toString(),
  toASN: (r) => new Za({ value: r })
}, Cg = {
  fromASN: (r) => r.valueBlock.value,
  toASN: (r) => new Ka({ value: r })
}, Zo = {
  fromASN: (r) => r.valueBlock.valueHexView,
  toASN: (r) => new oi({ valueHex: r })
}, Bg = {
  fromASN: (r) => new nt(r.getValue()),
  toASN: (r) => r.toASN()
};
function Pr(r) {
  return {
    fromASN: (e) => e.valueBlock.value,
    toASN: (e) => new r({ value: e })
  };
}
const Cp = Pr(Cn), Og = Pr(Wa), Tg = Pr(Ya), Ng = Pr(Ja), Pg = Pr(Xa), jg = Pr(Qa), Rg = Pr(ec), Ug = Pr(tc), Dg = Pr(rc), $g = Pr(yo), Mg = Pr(nc), Vg = Pr(ic), Lg = {
  fromASN: (r) => r.toDate(),
  toASN: (r) => new go({ valueDate: r })
}, Hg = {
  fromASN: (r) => r.toDate(),
  toASN: (r) => new sc({ valueDate: r })
}, Fg = {
  fromASN: () => null,
  toASN: () => new ui()
};
function zu(r) {
  switch (r) {
    case b.Any:
      return Sg;
    case b.BitString:
      return Ig;
    case b.BmpString:
      return Og;
    case b.Boolean:
      return Cg;
    case b.CharacterString:
      return Vg;
    case b.Enumerated:
      return Eg;
    case b.GeneralString:
      return Mg;
    case b.GeneralizedTime:
      return Hg;
    case b.GraphicString:
      return Dg;
    case b.IA5String:
      return Ug;
    case b.Integer:
      return _g;
    case b.Null:
      return Fg;
    case b.NumericString:
      return Ng;
    case b.ObjectIdentifier:
      return kg;
    case b.OctetString:
      return Zo;
    case b.PrintableString:
      return Pg;
    case b.TeletexString:
      return jg;
    case b.UTCTime:
      return Lg;
    case b.UniversalString:
      return Tg;
    case b.Utf8String:
      return Cp;
    case b.VideotexString:
      return Rg;
    case b.VisibleString:
      return $g;
    default:
      return null;
  }
}
function vn(r) {
  return typeof r == "function" && r.prototype ? r.prototype.toASN && r.prototype.fromASN ? !0 : vn(r.prototype) : !!(r && typeof r == "object" && "toASN" in r && "fromASN" in r);
}
function Bp(r) {
  var e;
  if (r) {
    const t = Object.getPrototypeOf(r);
    return ((e = t == null ? void 0 : t.prototype) === null || e === void 0 ? void 0 : e.constructor) === Array ? !0 : Bp(t);
  }
  return !1;
}
function Gg(r, e) {
  if (!(r && e) || r.byteLength !== e.byteLength)
    return !1;
  const t = new Uint8Array(r), n = new Uint8Array(e);
  for (let i = 0; i < r.byteLength; i++)
    if (t[i] !== n[i])
      return !1;
  return !0;
}
class zg {
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
        const m = b[o.type], x = kp[m];
        if (!x)
          throw new Error(`Cannot get ASN1 class by name '${m}'`);
        u = new x({ name: c });
      } else vn(o.type) ? u = new o.type().toSchema(c) : o.optional ? this.get(o.type).type === M.Choice ? u = new fi({ name: c }) : (u = this.create(o.type, !1), u.name = c) : u = new fi({ name: c });
      const h = !!o.optional || o.defaultValue !== void 0;
      if (o.repeated) {
        u.name = "";
        const m = o.repeated === "set" ? bn : wn;
        u = new m({
          name: "",
          value: [
            new qo({
              name: c,
              value: u
            })
          ]
        });
      }
      if (o.context !== null && o.context !== void 0)
        if (o.implicit)
          if (typeof o.type == "number" || vn(o.type)) {
            const m = o.repeated ? vr : po;
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
        return new Gu({ value: i, name: "" });
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
const Or = new zg(), H = (r) => (e) => {
  let t;
  Or.has(e) ? t = Or.get(e) : (t = Or.createDefault(e), Or.set(e, t)), Object.assign(t, r);
}, y = (r) => (e, t) => {
  let n;
  Or.has(e.constructor) ? n = Or.get(e.constructor) : (n = Or.createDefault(e.constructor), Or.set(e.constructor, n));
  const i = Object.assign({}, r);
  if (typeof i.type == "number" && !i.converter) {
    const s = zu(r.type);
    if (!s)
      throw new Error(`Cannot get default converter for property '${t}' of ${e.constructor.name}`);
    i.converter = s;
  }
  n.items[t] = i;
};
class Mf extends Error {
  constructor() {
    super(...arguments), this.schemas = [];
  }
}
class Kg {
  static parse(e, t) {
    const n = Di(e);
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
        throw new Mf(`Data does not match to ${t.name} ASN1 schema. ${o.result.error}`);
      const c = new t();
      if (Bp(t)) {
        if (!("value" in e.valueBlock && Array.isArray(e.valueBlock.value)))
          throw new Error("Cannot get items from the ASN.1 parsed value. ASN.1 object is not constructed.");
        const u = i.itemType;
        if (typeof u == "number") {
          const h = zu(u);
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
          const z = (n = m.converter) !== null && n !== void 0 ? n : vn(x) ? new x() : null;
          if (!z)
            throw new Error("Converter is empty");
          if (m.repeated)
            if (m.implicit) {
              const N = m.repeated === "sequence" ? wn : bn, v = new N();
              v.valueBlock = h.valueBlock;
              const A = Di(v.toBER(!1));
              if (A.offset === -1)
                throw new Error(`Cannot parse the child item. ${A.result.error}`);
              if (!("value" in A.result.valueBlock && Array.isArray(A.result.valueBlock.value)))
                throw new Error("Cannot get items from the ASN.1 parsed value. ASN.1 object is not constructed.");
              const O = A.result.valueBlock.value;
              c[u] = Array.from(O, (I) => z.fromASN(I));
            } else
              c[u] = Array.from(h, (N) => z.fromASN(N));
          else {
            let N = h;
            if (m.implicit) {
              let v;
              if (vn(x))
                v = new x().toSchema("");
              else {
                const A = b[x], O = kp[A];
                if (!O)
                  throw new Error(`Cannot get '${A}' class from asn1js module`);
                v = new O();
              }
              v.valueBlock = N.valueBlock, N = Di(v.toBER(!1)).result;
            }
            c[u] = z.fromASN(N);
          }
        } else if (m.repeated) {
          if (!Array.isArray(h))
            throw new Error("Cannot get list of items from the ASN.1 parsed value. ASN.1 value should be iterable.");
          c[u] = Array.from(h, (z) => this.fromASN(z, x));
        } else
          c[u] = this.fromASN(h, x);
      }
      return c;
    } catch (i) {
      throw i instanceof Mf && i.schemas.push(t.name), i;
    }
  }
}
class Ku {
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
        const o = zu(n.itemType);
        if (!o)
          throw new Error(`Cannot get default converter for array item of ${t.name} ASN1 schema`);
        i = e.map((c) => o.toASN(c));
      } else
        i = e.map((o) => this.toAsnItem({ type: n.itemType }, "[]", t, o));
    } else
      for (const o in n.items) {
        const c = n.items[o], u = e[o];
        if (u === void 0 || c.defaultValue === u || typeof c.defaultValue == "object" && typeof u == "object" && Gg(this.serialize(c.defaultValue), this.serialize(u)))
          continue;
        const h = Ku.toAsnItem(c, o, t, u);
        if (typeof c.context == "number")
          if (c.implicit)
            if (!c.repeated && (typeof c.type == "number" || vn(c.type))) {
              const m = {};
              m.valueHex = h instanceof ui ? h.valueBeforeDecodeView : h.valueBlock.toBER(), i.push(new po({
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
    return Ku.serialize(e);
  }
  static parse(e, t) {
    return Kg.parse(e, t);
  }
  static toString(e) {
    const t = W.isBufferSource(e) ? W.toArrayBuffer(e) : q.serialize(e), n = Di(t);
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
var Op = { exports: {} };
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
      let O = 0, I = -1, P = (v.match(u.zoneIndex) || [])[0], R, ae;
      for (P && (P = P.substring(1), v = v.replace(/%.+$/, "")); (I = v.indexOf(":", I + 1)) >= 0; )
        O++;
      if (v.substr(0, 2) === "::" && O--, v.substr(-2, 2) === "::" && O--, O > A)
        return null;
      for (ae = A - O, R = ":"; ae--; )
        R += "0:";
      return v = v.replace("::", R), v[0] === ":" && (v = v.slice(1)), v[v.length - 1] === ":" && (v = v.slice(0, -1)), A = function() {
        const Ge = v.split(":"), Je = [];
        for (let Pe = 0; Pe < Ge.length; Pe++)
          Je.push(parseInt(Ge[Pe], 16));
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
    function z(v, A) {
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
        let P, R, ae;
        for (P = 3; P >= 0; P -= 1)
          if (R = this.octets[P], R in I) {
            if (ae = I[R], O && ae !== 0)
              return null;
            ae !== 8 && (O = !0), A += ae;
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
          for (let ae = 0; ae < P.length; ae++)
            O = P[ae], R.push(x(O));
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
        for (let ae = 7; ae >= 0; ae -= 1)
          if (P = this.parts[ae], P in I) {
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
            I.push(z(this.parts[P].toString(16), 4));
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
      } catch (ae) {
        throw new Error(`ipaddr: the address does not have IPv6 CIDR format (${ae})`);
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
      let A, O, I, P, R, ae;
      if (I = v.match(u.deprecatedTransitional))
        return this.parser(`::ffff:${I[1]}`);
      if (u.native.test(v))
        return h(v, 8);
      if ((I = v.match(u.transitional)) && (ae = I[6] || "", A = I[1], I[1].endsWith("::") || (A = A.slice(0, -1)), A = h(A + ae, 6), A.parts)) {
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
      let I, P, R, ae;
      O == null && (O = "unicast");
      for (P in A)
        if (Object.prototype.hasOwnProperty.call(A, P)) {
          for (R = A[P], R[0] && !(R[0] instanceof Array) && (R = [R]), I = 0; I < R.length; I++)
            if (ae = R[I], v.kind() === ae[0].kind() && v.match.apply(v, ae))
              return P;
        }
      return O;
    }, r.exports ? r.exports = N : e.ipaddr = N;
  })(al);
})(Op);
var Vf = Op.exports;
class Lf {
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
      return Vf.fromByteArray(Array.from(t)).toString();
    }
    return this.decodeIP(fe.ToHex(e));
  }
  static fromString(e) {
    const t = Vf.parse(e);
    return new Uint8Array(t.toByteArray()).buffer;
  }
}
var fl, hl, dl;
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
let Li = class extends Xt {
  constructor(e = {}) {
    super(e), Object.assign(this, e);
  }
  toString() {
    return this.ia5String || (this.anyValue ? fe.ToHex(this.anyValue) : super.toString());
  }
};
f([
  y({ type: b.IA5String })
], Li.prototype, "ia5String", void 0);
f([
  y({ type: b.Any })
], Li.prototype, "anyValue", void 0);
Li = f([
  H({ type: M.Choice })
], Li);
class ac {
  constructor(e = {}) {
    this.type = "", this.value = new Li(), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], ac.prototype, "type", void 0);
f([
  y({ type: Li })
], ac.prototype, "value", void 0);
let Hi = fl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, fl.prototype);
  }
};
Hi = fl = f([
  H({ type: M.Set, itemType: ac })
], Hi);
let pl = hl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, hl.prototype);
  }
};
pl = hl = f([
  H({ type: M.Sequence, itemType: Hi })
], pl);
let Ht = dl = class extends pl {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, dl.prototype);
  }
};
Ht = dl = f([
  H({ type: M.Sequence })
], Ht);
const qg = {
  fromASN: (r) => Lf.toString(Zo.fromASN(r)),
  toASN: (r) => Zo.toASN(Lf.fromString(r))
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
class qu {
  constructor(e = {}) {
    this.partyName = new Xt(), Object.assign(this, e);
  }
}
f([
  y({ type: Xt, optional: !0, context: 0, implicit: !0 })
], qu.prototype, "nameAssigner", void 0);
f([
  y({ type: Xt, context: 1, implicit: !0 })
], qu.prototype, "partyName", void 0);
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
  y({ type: qu, context: 5 })
], De.prototype, "ediPartyName", void 0);
f([
  y({ type: b.IA5String, context: 6, implicit: !0 })
], De.prototype, "uniformResourceIdentifier", void 0);
f([
  y({ type: b.OctetString, context: 7, implicit: !0, converter: qg })
], De.prototype, "iPAddress", void 0);
f([
  y({ type: b.ObjectIdentifier, context: 8, implicit: !0 })
], De.prototype, "registeredID", void 0);
De = f([
  H({ type: M.Choice })
], De);
const Zu = "1.3.6.1.5.5.7", Zg = `${Zu}.1`, ss = `${Zu}.3`, cc = `${Zu}.48`, Hf = `${cc}.1`, Ff = `${cc}.2`, Gf = `${cc}.3`, zf = `${cc}.5`, Jn = "2.5.29";
var yl;
const gl = `${Zg}.1`;
class vo {
  constructor(e = {}) {
    this.accessMethod = "", this.accessLocation = new De(), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], vo.prototype, "accessMethod", void 0);
f([
  y({ type: De })
], vo.prototype, "accessLocation", void 0);
let Ri = yl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, yl.prototype);
  }
};
Ri = yl = f([
  H({ type: M.Sequence, itemType: vo })
], Ri);
const Wo = `${Jn}.35`;
class Wu extends nt {
}
class ii {
  constructor(e = {}) {
    e && Object.assign(this, e);
  }
}
f([
  y({ type: Wu, context: 0, optional: !0, implicit: !0 })
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
const Tp = `${Jn}.19`;
class Yo {
  constructor(e = {}) {
    this.cA = !1, Object.assign(this, e);
  }
}
f([
  y({ type: b.Boolean, defaultValue: !1 })
], Yo.prototype, "cA", void 0);
f([
  y({ type: b.Integer, optional: !0 })
], Yo.prototype, "pathLenConstraint", void 0);
var vl;
let cr = vl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, vl.prototype);
  }
};
cr = vl = f([
  H({ type: M.Sequence, itemType: De })
], cr);
var ml;
let Kf = ml = class extends cr {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, ml.prototype);
  }
};
Kf = ml = f([
  H({ type: M.Sequence })
], Kf);
var wl;
const Np = `${Jn}.32`;
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
class Yu {
  constructor(e = {}) {
    this.organization = new Sn(), this.noticeNumbers = [], Object.assign(this, e);
  }
}
f([
  y({ type: Sn })
], Yu.prototype, "organization", void 0);
f([
  y({ type: b.Integer, repeated: "sequence" })
], Yu.prototype, "noticeNumbers", void 0);
class Ju {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: Yu, optional: !0 })
], Ju.prototype, "noticeRef", void 0);
f([
  y({ type: Sn, optional: !0 })
], Ju.prototype, "explicitText", void 0);
let Jo = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: b.IA5String })
], Jo.prototype, "cPSuri", void 0);
f([
  y({ type: Ju })
], Jo.prototype, "userNotice", void 0);
Jo = f([
  H({ type: M.Choice })
], Jo);
class Xu {
  constructor(e = {}) {
    this.policyQualifierId = "", this.qualifier = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Xu.prototype, "policyQualifierId", void 0);
f([
  y({ type: b.Any })
], Xu.prototype, "qualifier", void 0);
class lc {
  constructor(e = {}) {
    this.policyIdentifier = "", Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], lc.prototype, "policyIdentifier", void 0);
f([
  y({ type: Xu, repeated: "sequence", optional: !0 })
], lc.prototype, "policyQualifiers", void 0);
let Xo = wl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, wl.prototype);
  }
};
Xo = wl = f([
  H({ type: M.Sequence, itemType: lc })
], Xo);
let Qo = class {
  constructor(e = 0) {
    this.value = e;
  }
};
f([
  y({ type: b.Integer })
], Qo.prototype, "value", void 0);
Qo = f([
  H({ type: M.Choice })
], Qo);
let qf = class extends Qo {
};
qf = f([
  H({ type: M.Choice })
], qf);
var bl;
const xl = `${Jn}.31`;
var Dr;
(function(r) {
  r[r.unused = 1] = "unused", r[r.keyCompromise = 2] = "keyCompromise", r[r.cACompromise = 4] = "cACompromise", r[r.affiliationChanged = 8] = "affiliationChanged", r[r.superseded = 16] = "superseded", r[r.cessationOfOperation = 32] = "cessationOfOperation", r[r.certificateHold = 64] = "certificateHold", r[r.privilegeWithdrawn = 128] = "privilegeWithdrawn", r[r.aACompromise = 256] = "aACompromise";
})(Dr || (Dr = {}));
class Pp extends oc {
  toJSON() {
    const e = [], t = this.toNumber();
    return t & Dr.aACompromise && e.push("aACompromise"), t & Dr.affiliationChanged && e.push("affiliationChanged"), t & Dr.cACompromise && e.push("cACompromise"), t & Dr.certificateHold && e.push("certificateHold"), t & Dr.cessationOfOperation && e.push("cessationOfOperation"), t & Dr.keyCompromise && e.push("keyCompromise"), t & Dr.privilegeWithdrawn && e.push("privilegeWithdrawn"), t & Dr.superseded && e.push("superseded"), t & Dr.unused && e.push("unused"), e;
  }
  toString() {
    return `[${this.toJSON().join(", ")}]`;
  }
}
let hi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: De, context: 0, repeated: "sequence", implicit: !0 })
], hi.prototype, "fullName", void 0);
f([
  y({ type: Hi, context: 1, implicit: !0 })
], hi.prototype, "nameRelativeToCRLIssuer", void 0);
hi = f([
  H({ type: M.Choice })
], hi);
class os {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: hi, context: 0, optional: !0 })
], os.prototype, "distributionPoint", void 0);
f([
  y({ type: Pp, context: 1, optional: !0, implicit: !0 })
], os.prototype, "reasons", void 0);
f([
  y({ type: De, context: 2, optional: !0, repeated: "sequence", implicit: !0 })
], os.prototype, "cRLIssuer", void 0);
let $i = bl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, bl.prototype);
  }
};
$i = bl = f([
  H({ type: M.Sequence, itemType: os })
], $i);
var Al;
let Zf = Al = class extends $i {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Al.prototype);
  }
};
Zf = Al = f([
  H({ type: M.Sequence, itemType: os })
], Zf);
class ir {
  constructor(e = {}) {
    this.onlyContainsUserCerts = ir.ONLY, this.onlyContainsCACerts = ir.ONLY, this.indirectCRL = ir.ONLY, this.onlyContainsAttributeCerts = ir.ONLY, Object.assign(this, e);
  }
}
ir.ONLY = !1;
f([
  y({ type: hi, context: 0, optional: !0 })
], ir.prototype, "distributionPoint", void 0);
f([
  y({ type: b.Boolean, context: 1, defaultValue: ir.ONLY, implicit: !0 })
], ir.prototype, "onlyContainsUserCerts", void 0);
f([
  y({ type: b.Boolean, context: 2, defaultValue: ir.ONLY, implicit: !0 })
], ir.prototype, "onlyContainsCACerts", void 0);
f([
  y({ type: Pp, context: 3, optional: !0, implicit: !0 })
], ir.prototype, "onlySomeReasons", void 0);
f([
  y({ type: b.Boolean, context: 4, defaultValue: ir.ONLY, implicit: !0 })
], ir.prototype, "indirectCRL", void 0);
f([
  y({ type: b.Boolean, context: 5, defaultValue: ir.ONLY, implicit: !0 })
], ir.prototype, "onlyContainsAttributeCerts", void 0);
var Ns;
(function(r) {
  r[r.unspecified = 0] = "unspecified", r[r.keyCompromise = 1] = "keyCompromise", r[r.cACompromise = 2] = "cACompromise", r[r.affiliationChanged = 3] = "affiliationChanged", r[r.superseded = 4] = "superseded", r[r.cessationOfOperation = 5] = "cessationOfOperation", r[r.certificateHold = 6] = "certificateHold", r[r.removeFromCRL = 8] = "removeFromCRL", r[r.privilegeWithdrawn = 9] = "privilegeWithdrawn", r[r.aACompromise = 10] = "aACompromise";
})(Ns || (Ns = {}));
let Sl = class {
  constructor(e = Ns.unspecified) {
    this.reason = Ns.unspecified, this.reason = e;
  }
  toJSON() {
    return Ns[this.reason];
  }
  toString() {
    return this.toJSON();
  }
};
f([
  y({ type: b.Enumerated })
], Sl.prototype, "reason", void 0);
Sl = f([
  H({ type: M.Choice })
], Sl);
var _l;
const jp = `${Jn}.37`;
let ea = _l = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, _l.prototype);
  }
};
ea = _l = f([
  H({ type: M.Sequence, itemType: b.ObjectIdentifier })
], ea);
const Wg = `${ss}.1`, Yg = `${ss}.2`, Jg = `${ss}.3`, Xg = `${ss}.4`, Qg = `${ss}.8`, ev = `${ss}.9`;
let El = class {
  constructor(e = new ArrayBuffer(0)) {
    this.value = e;
  }
};
f([
  y({ type: b.Integer, converter: xt })
], El.prototype, "value", void 0);
El = f([
  H({ type: M.Choice })
], El);
let Il = class {
  constructor(e) {
    this.value = /* @__PURE__ */ new Date(), e && (this.value = e);
  }
};
f([
  y({ type: b.GeneralizedTime })
], Il.prototype, "value", void 0);
Il = f([
  H({ type: M.Choice })
], Il);
var kl;
let Wf = kl = class extends cr {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, kl.prototype);
  }
};
Wf = kl = f([
  H({ type: M.Sequence })
], Wf);
const Rp = `${Jn}.15`;
var $r;
(function(r) {
  r[r.digitalSignature = 1] = "digitalSignature", r[r.nonRepudiation = 2] = "nonRepudiation", r[r.keyEncipherment = 4] = "keyEncipherment", r[r.dataEncipherment = 8] = "dataEncipherment", r[r.keyAgreement = 16] = "keyAgreement", r[r.keyCertSign = 32] = "keyCertSign", r[r.cRLSign = 64] = "cRLSign", r[r.encipherOnly = 128] = "encipherOnly", r[r.decipherOnly = 256] = "decipherOnly";
})($r || ($r = {}));
class Gc extends oc {
  toJSON() {
    const e = this.toNumber(), t = [];
    return e & $r.cRLSign && t.push("crlSign"), e & $r.dataEncipherment && t.push("dataEncipherment"), e & $r.decipherOnly && t.push("decipherOnly"), e & $r.digitalSignature && t.push("digitalSignature"), e & $r.encipherOnly && t.push("encipherOnly"), e & $r.keyAgreement && t.push("keyAgreement"), e & $r.keyCertSign && t.push("keyCertSign"), e & $r.keyEncipherment && t.push("keyEncipherment"), e & $r.nonRepudiation && t.push("nonRepudiation"), t;
  }
  toString() {
    return `[${this.toJSON().join(", ")}]`;
  }
}
var Cl;
class uc {
  constructor(e = {}) {
    this.base = new De(), this.minimum = 0, Object.assign(this, e);
  }
}
f([
  y({ type: De })
], uc.prototype, "base", void 0);
f([
  y({ type: b.Integer, context: 0, defaultValue: 0, implicit: !0 })
], uc.prototype, "minimum", void 0);
f([
  y({ type: b.Integer, context: 1, optional: !0, implicit: !0 })
], uc.prototype, "maximum", void 0);
let ta = Cl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Cl.prototype);
  }
};
ta = Cl = f([
  H({ type: M.Sequence, itemType: uc })
], ta);
class Up {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: ta, context: 0, optional: !0, implicit: !0 })
], Up.prototype, "permittedSubtrees", void 0);
f([
  y({ type: ta, context: 1, optional: !0, implicit: !0 })
], Up.prototype, "excludedSubtrees", void 0);
class Dp {
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
], Dp.prototype, "requireExplicitPolicy", void 0);
f([
  y({
    type: b.Integer,
    context: 1,
    implicit: !0,
    optional: !0,
    converter: xt
  })
], Dp.prototype, "inhibitPolicyMapping", void 0);
var Bl;
class Qu {
  constructor(e = {}) {
    this.issuerDomainPolicy = "", this.subjectDomainPolicy = "", Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Qu.prototype, "issuerDomainPolicy", void 0);
f([
  y({ type: b.ObjectIdentifier })
], Qu.prototype, "subjectDomainPolicy", void 0);
let Yf = Bl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Bl.prototype);
  }
};
Yf = Bl = f([
  H({ type: M.Sequence, itemType: Qu })
], Yf);
var Ol;
const ef = `${Jn}.17`;
let Tl = Ol = class extends cr {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Ol.prototype);
  }
};
Tl = Ol = f([
  H({ type: M.Sequence })
], Tl);
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
var Nl;
let Jf = Nl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Nl.prototype);
  }
};
Jf = Nl = f([
  H({ type: M.Sequence, itemType: _n })
], Jf);
const tf = `${Jn}.14`;
class Hn extends Wu {
}
class $p {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: b.GeneralizedTime, context: 0, implicit: !0, optional: !0 })
], $p.prototype, "notBefore", void 0);
f([
  y({ type: b.GeneralizedTime, context: 1, implicit: !0, optional: !0 })
], $p.prototype, "notAfter", void 0);
var Ps;
(function(r) {
  r[r.keyUpdateAllowed = 1] = "keyUpdateAllowed", r[r.newExtensions = 2] = "newExtensions", r[r.pKIXCertificate = 4] = "pKIXCertificate";
})(Ps || (Ps = {}));
class Mp extends oc {
  toJSON() {
    const e = [], t = this.toNumber();
    return t & Ps.pKIXCertificate && e.push("pKIXCertificate"), t & Ps.newExtensions && e.push("newExtensions"), t & Ps.keyUpdateAllowed && e.push("keyUpdateAllowed"), e;
  }
  toString() {
    return `[${this.toJSON().join(", ")}]`;
  }
}
class Vp {
  constructor(e = {}) {
    this.entrustVers = "", this.entrustInfoFlags = new Mp(), Object.assign(this, e);
  }
}
f([
  y({ type: b.GeneralString })
], Vp.prototype, "entrustVers", void 0);
f([
  y({ type: Mp })
], Vp.prototype, "entrustInfoFlags", void 0);
var Pl;
let Xf = Pl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Pl.prototype);
  }
};
Xf = Pl = f([
  H({ type: M.Sequence, itemType: vo })
], Xf);
class ne {
  constructor(e = {}) {
    this.algorithm = "", Object.assign(this, e);
  }
  isEqual(e) {
    return e instanceof ne && e.algorithm == this.algorithm && (e.parameters && this.parameters && zo(e.parameters, this.parameters) || e.parameters === this.parameters);
  }
}
f([
  y({
    type: b.ObjectIdentifier
  })
], ne.prototype, "algorithm", void 0);
f([
  y({
    type: b.Any,
    optional: !0
  })
], ne.prototype, "parameters", void 0);
class nn {
  constructor(e = {}) {
    this.algorithm = new ne(), this.subjectPublicKey = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: ne })
], nn.prototype, "algorithm", void 0);
f([
  y({ type: b.BitString })
], nn.prototype, "subjectPublicKey", void 0);
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
class fc {
  constructor(e) {
    this.notBefore = new Yt(/* @__PURE__ */ new Date()), this.notAfter = new Yt(/* @__PURE__ */ new Date()), e && (this.notBefore = new Yt(e.notBefore), this.notAfter = new Yt(e.notAfter));
  }
}
f([
  y({ type: Yt })
], fc.prototype, "notBefore", void 0);
f([
  y({ type: Yt })
], fc.prototype, "notAfter", void 0);
var jl;
let Fr = class Lp {
  constructor(e = {}) {
    this.extnID = "", this.critical = Lp.CRITICAL, this.extnValue = new nt(), Object.assign(this, e);
  }
};
Fr.CRITICAL = !1;
f([
  y({ type: b.ObjectIdentifier })
], Fr.prototype, "extnID", void 0);
f([
  y({
    type: b.Boolean,
    defaultValue: Fr.CRITICAL
  })
], Fr.prototype, "critical", void 0);
f([
  y({ type: nt })
], Fr.prototype, "extnValue", void 0);
let di = jl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, jl.prototype);
  }
};
di = jl = f([
  H({ type: M.Sequence, itemType: Fr })
], di);
var Fi;
(function(r) {
  r[r.v1 = 0] = "v1", r[r.v2 = 1] = "v2", r[r.v3 = 2] = "v3";
})(Fi || (Fi = {}));
class jr {
  constructor(e = {}) {
    this.version = Fi.v1, this.serialNumber = new ArrayBuffer(0), this.signature = new ne(), this.issuer = new Ht(), this.validity = new fc(), this.subject = new Ht(), this.subjectPublicKeyInfo = new nn(), Object.assign(this, e);
  }
}
f([
  y({
    type: b.Integer,
    context: 0,
    defaultValue: Fi.v1
  })
], jr.prototype, "version", void 0);
f([
  y({
    type: b.Integer,
    converter: xt
  })
], jr.prototype, "serialNumber", void 0);
f([
  y({ type: ne })
], jr.prototype, "signature", void 0);
f([
  y({ type: Ht })
], jr.prototype, "issuer", void 0);
f([
  y({ type: fc })
], jr.prototype, "validity", void 0);
f([
  y({ type: Ht })
], jr.prototype, "subject", void 0);
f([
  y({ type: nn })
], jr.prototype, "subjectPublicKeyInfo", void 0);
f([
  y({
    type: b.BitString,
    context: 1,
    implicit: !0,
    optional: !0
  })
], jr.prototype, "issuerUniqueID", void 0);
f([
  y({ type: b.BitString, context: 2, implicit: !0, optional: !0 })
], jr.prototype, "subjectUniqueID", void 0);
f([
  y({ type: di, context: 3, optional: !0 })
], jr.prototype, "extensions", void 0);
class pi {
  constructor(e = {}) {
    this.tbsCertificate = new jr(), this.signatureAlgorithm = new ne(), this.signatureValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: jr })
], pi.prototype, "tbsCertificate", void 0);
f([
  y({ type: ne })
], pi.prototype, "signatureAlgorithm", void 0);
f([
  y({ type: b.BitString })
], pi.prototype, "signatureValue", void 0);
class hc {
  constructor(e = {}) {
    this.userCertificate = new ArrayBuffer(0), this.revocationDate = new Yt(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, converter: xt })
], hc.prototype, "userCertificate", void 0);
f([
  y({ type: Yt })
], hc.prototype, "revocationDate", void 0);
f([
  y({ type: Fr, optional: !0, repeated: "sequence" })
], hc.prototype, "crlEntryExtensions", void 0);
class Bn {
  constructor(e = {}) {
    this.signature = new ne(), this.issuer = new Ht(), this.thisUpdate = new Yt(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, optional: !0 })
], Bn.prototype, "version", void 0);
f([
  y({ type: ne })
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
  y({ type: hc, repeated: "sequence", optional: !0 })
], Bn.prototype, "revokedCertificates", void 0);
f([
  y({ type: Fr, optional: !0, context: 0, repeated: "sequence" })
], Bn.prototype, "crlExtensions", void 0);
class rf {
  constructor(e = {}) {
    this.tbsCertList = new Bn(), this.signatureAlgorithm = new ne(), this.signature = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: Bn })
], rf.prototype, "tbsCertList", void 0);
f([
  y({ type: ne })
], rf.prototype, "signatureAlgorithm", void 0);
f([
  y({ type: b.BitString })
], rf.prototype, "signature", void 0);
class as {
  constructor(e = {}) {
    this.issuer = new Ht(), this.serialNumber = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: Ht })
], as.prototype, "issuer", void 0);
f([
  y({ type: b.Integer, converter: xt })
], as.prototype, "serialNumber", void 0);
let Gi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: Hn, context: 0, implicit: !0 })
], Gi.prototype, "subjectKeyIdentifier", void 0);
f([
  y({ type: as })
], Gi.prototype, "issuerAndSerialNumber", void 0);
Gi = f([
  H({ type: M.Choice })
], Gi);
var cn;
(function(r) {
  r[r.v0 = 0] = "v0", r[r.v1 = 1] = "v1", r[r.v2 = 2] = "v2", r[r.v3 = 3] = "v3", r[r.v4 = 4] = "v4", r[r.v5 = 5] = "v5";
})(cn || (cn = {}));
let Vs = class extends ne {
};
Vs = f([
  H({ type: M.Sequence })
], Vs);
let ra = class extends ne {
};
ra = f([
  H({ type: M.Sequence })
], ra);
let ln = class extends ne {
};
ln = f([
  H({ type: M.Sequence })
], ln);
let na = class extends ne {
};
na = f([
  H({ type: M.Sequence })
], na);
let Qf = class extends ne {
};
Qf = f([
  H({ type: M.Sequence })
], Qf);
let Rl = class extends ne {
};
Rl = f([
  H({ type: M.Sequence })
], Rl);
let cs = class {
  constructor(e = {}) {
    this.attrType = "", this.attrValues = [], Object.assign(this, e);
  }
};
f([
  y({ type: b.ObjectIdentifier })
], cs.prototype, "attrType", void 0);
f([
  y({ type: b.Any, repeated: "set" })
], cs.prototype, "attrValues", void 0);
var Ul;
class dn {
  constructor(e = {}) {
    this.version = cn.v0, this.sid = new Gi(), this.digestAlgorithm = new Vs(), this.signatureAlgorithm = new ra(), this.signature = new nt(), Object.assign(this, e);
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
  y({ type: cs, repeated: "set", context: 0, implicit: !0, optional: !0 })
], dn.prototype, "signedAttrs", void 0);
f([
  y({ type: ra })
], dn.prototype, "signatureAlgorithm", void 0);
f([
  y({ type: nt })
], dn.prototype, "signature", void 0);
f([
  y({ type: cs, repeated: "set", context: 1, implicit: !0, optional: !0 })
], dn.prototype, "unsignedAttrs", void 0);
let ia = Ul = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Ul.prototype);
  }
};
ia = Ul = f([
  H({ type: M.Set, itemType: dn })
], ia);
let eh = class extends Yt {
};
eh = f([
  H({ type: M.Choice })
], eh);
let th = class extends dn {
};
th = f([
  H({ type: M.Sequence })
], th);
class nf {
  constructor(e = {}) {
    this.acIssuer = new De(), this.acSerial = 0, this.attrs = [], Object.assign(this, e);
  }
}
f([
  y({ type: De })
], nf.prototype, "acIssuer", void 0);
f([
  y({ type: b.Integer })
], nf.prototype, "acSerial", void 0);
f([
  y({ type: _n, repeated: "sequence" })
], nf.prototype, "attrs", void 0);
var Dl;
let sa = Dl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Dl.prototype);
  }
};
sa = Dl = f([
  H({ type: M.Sequence, itemType: b.ObjectIdentifier })
], sa);
class dc {
  constructor(e = {}) {
    this.permitUnSpecified = !0, Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, optional: !0 })
], dc.prototype, "pathLenConstraint", void 0);
f([
  y({ type: sa, implicit: !0, context: 0, optional: !0 })
], dc.prototype, "permittedAttrs", void 0);
f([
  y({ type: sa, implicit: !0, context: 1, optional: !0 })
], dc.prototype, "excludedAttrs", void 0);
f([
  y({ type: b.Boolean, defaultValue: !0 })
], dc.prototype, "permitUnSpecified", void 0);
class ki {
  constructor(e = {}) {
    this.issuer = new cr(), this.serial = new ArrayBuffer(0), this.issuerUID = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: cr })
], ki.prototype, "issuer", void 0);
f([
  y({ type: b.Integer, converter: xt })
], ki.prototype, "serial", void 0);
f([
  y({ type: b.BitString, optional: !0 })
], ki.prototype, "issuerUID", void 0);
var $l;
(function(r) {
  r[r.publicKey = 0] = "publicKey", r[r.publicKeyCert = 1] = "publicKeyCert", r[r.otherObjectTypes = 2] = "otherObjectTypes";
})($l || ($l = {}));
class Ci {
  constructor(e = {}) {
    this.digestedObjectType = $l.publicKey, this.digestAlgorithm = new ne(), this.objectDigest = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.Enumerated })
], Ci.prototype, "digestedObjectType", void 0);
f([
  y({ type: b.ObjectIdentifier, optional: !0 })
], Ci.prototype, "otherObjectTypeID", void 0);
f([
  y({ type: ne })
], Ci.prototype, "digestAlgorithm", void 0);
f([
  y({ type: b.BitString })
], Ci.prototype, "objectDigest", void 0);
class pc {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: cr, optional: !0 })
], pc.prototype, "issuerName", void 0);
f([
  y({ type: ki, context: 0, implicit: !0, optional: !0 })
], pc.prototype, "baseCertificateID", void 0);
f([
  y({ type: Ci, context: 1, implicit: !0, optional: !0 })
], pc.prototype, "objectDigestInfo", void 0);
let zi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: De, repeated: "sequence" })
], zi.prototype, "v1Form", void 0);
f([
  y({ type: pc, context: 0, implicit: !0 })
], zi.prototype, "v2Form", void 0);
zi = f([
  H({ type: M.Choice })
], zi);
class yc {
  constructor(e = {}) {
    this.notBeforeTime = /* @__PURE__ */ new Date(), this.notAfterTime = /* @__PURE__ */ new Date(), Object.assign(this, e);
  }
}
f([
  y({ type: b.GeneralizedTime })
], yc.prototype, "notBeforeTime", void 0);
f([
  y({ type: b.GeneralizedTime })
], yc.prototype, "notAfterTime", void 0);
class mo {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: ki, implicit: !0, context: 0, optional: !0 })
], mo.prototype, "baseCertificateID", void 0);
f([
  y({ type: cr, implicit: !0, context: 1, optional: !0 })
], mo.prototype, "entityName", void 0);
f([
  y({ type: Ci, implicit: !0, context: 2, optional: !0 })
], mo.prototype, "objectDigestInfo", void 0);
var Ml;
(function(r) {
  r[r.v2 = 1] = "v2";
})(Ml || (Ml = {}));
class Zr {
  constructor(e = {}) {
    this.version = Ml.v2, this.holder = new mo(), this.issuer = new zi(), this.signature = new ne(), this.serialNumber = new ArrayBuffer(0), this.attrCertValidityPeriod = new yc(), this.attributes = [], Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], Zr.prototype, "version", void 0);
f([
  y({ type: mo })
], Zr.prototype, "holder", void 0);
f([
  y({ type: zi })
], Zr.prototype, "issuer", void 0);
f([
  y({ type: ne })
], Zr.prototype, "signature", void 0);
f([
  y({ type: b.Integer, converter: xt })
], Zr.prototype, "serialNumber", void 0);
f([
  y({ type: yc })
], Zr.prototype, "attrCertValidityPeriod", void 0);
f([
  y({ type: _n, repeated: "sequence" })
], Zr.prototype, "attributes", void 0);
f([
  y({ type: b.BitString, optional: !0 })
], Zr.prototype, "issuerUniqueID", void 0);
f([
  y({ type: di, optional: !0 })
], Zr.prototype, "extensions", void 0);
class gc {
  constructor(e = {}) {
    this.acinfo = new Zr(), this.signatureAlgorithm = new ne(), this.signatureValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: Zr })
], gc.prototype, "acinfo", void 0);
f([
  y({ type: ne })
], gc.prototype, "signatureAlgorithm", void 0);
f([
  y({ type: b.BitString })
], gc.prototype, "signatureValue", void 0);
var oa;
(function(r) {
  r[r.unmarked = 1] = "unmarked", r[r.unclassified = 2] = "unclassified", r[r.restricted = 4] = "restricted", r[r.confidential = 8] = "confidential", r[r.secret = 16] = "secret", r[r.topSecret = 32] = "topSecret";
})(oa || (oa = {}));
class Vl extends oc {
}
class sf {
  constructor(e = {}) {
    this.type = "", this.value = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier, implicit: !0, context: 0 })
], sf.prototype, "type", void 0);
f([
  y({ type: b.Any, implicit: !0, context: 1 })
], sf.prototype, "value", void 0);
class of {
  constructor(e = {}) {
    this.policyId = "", this.classList = new Vl(oa.unclassified), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], of.prototype, "policyId", void 0);
f([
  y({ type: Vl, defaultValue: new Vl(oa.unclassified) })
], of.prototype, "classList", void 0);
f([
  y({ type: sf, repeated: "set" })
], of.prototype, "securityCategories", void 0);
class vc {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: nt })
], vc.prototype, "cotets", void 0);
f([
  y({ type: b.ObjectIdentifier })
], vc.prototype, "oid", void 0);
f([
  y({ type: b.Utf8String })
], vc.prototype, "string", void 0);
class Hp {
  constructor(e = {}) {
    this.values = [], Object.assign(this, e);
  }
}
f([
  y({ type: cr, implicit: !0, context: 0, optional: !0 })
], Hp.prototype, "policyAuthority", void 0);
f([
  y({ type: vc, repeated: "sequence" })
], Hp.prototype, "values", void 0);
var Ll;
class mc {
  constructor(e = {}) {
    this.targetCertificate = new ki(), Object.assign(this, e);
  }
}
f([
  y({ type: ki })
], mc.prototype, "targetCertificate", void 0);
f([
  y({ type: De, optional: !0 })
], mc.prototype, "targetName", void 0);
f([
  y({ type: Ci, optional: !0 })
], mc.prototype, "certDigestInfo", void 0);
let Ki = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: De, context: 0, implicit: !0 })
], Ki.prototype, "targetName", void 0);
f([
  y({ type: De, context: 1, implicit: !0 })
], Ki.prototype, "targetGroup", void 0);
f([
  y({ type: mc, context: 2, implicit: !0 })
], Ki.prototype, "targetCert", void 0);
Ki = f([
  H({ type: M.Choice })
], Ki);
let Hl = Ll = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Ll.prototype);
  }
};
Hl = Ll = f([
  H({ type: M.Sequence, itemType: Ki })
], Hl);
var Fl;
let rh = Fl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Fl.prototype);
  }
};
rh = Fl = f([
  H({ type: M.Sequence, itemType: Hl })
], rh);
class Fp {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: cr, implicit: !0, context: 0, optional: !0 })
], Fp.prototype, "roleAuthority", void 0);
f([
  y({ type: De, implicit: !0, context: 1 })
], Fp.prototype, "roleName", void 0);
class af {
  constructor(e = {}) {
    this.service = new De(), this.ident = new De(), Object.assign(this, e);
  }
}
f([
  y({ type: De })
], af.prototype, "service", void 0);
f([
  y({ type: De })
], af.prototype, "ident", void 0);
f([
  y({ type: nt, optional: !0 })
], af.prototype, "authInfo", void 0);
var Gl;
class cf {
  constructor(e = {}) {
    this.otherCertFormat = "", this.otherCert = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], cf.prototype, "otherCertFormat", void 0);
f([
  y({ type: b.Any })
], cf.prototype, "otherCert", void 0);
let yi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: pi })
], yi.prototype, "certificate", void 0);
f([
  y({ type: gc, context: 2, implicit: !0 })
], yi.prototype, "v2AttrCert", void 0);
f([
  y({ type: cf, context: 3, implicit: !0 })
], yi.prototype, "other", void 0);
yi = f([
  H({ type: M.Choice })
], yi);
let Ls = Gl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Gl.prototype);
  }
};
Ls = Gl = f([
  H({ type: M.Set, itemType: yi })
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
let qi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: nt })
], qi.prototype, "single", void 0);
f([
  y({ type: b.Any })
], qi.prototype, "any", void 0);
qi = f([
  H({ type: M.Choice })
], qi);
class wc {
  constructor(e = {}) {
    this.eContentType = "", Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], wc.prototype, "eContentType", void 0);
f([
  y({ type: qi, context: 0, optional: !0 })
], wc.prototype, "eContent", void 0);
let Hs = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: nt, context: 0, implicit: !0, optional: !0 })
], Hs.prototype, "value", void 0);
f([
  y({ type: nt, converter: Bg, context: 0, implicit: !0, optional: !0, repeated: "sequence" })
], Hs.prototype, "constructedValue", void 0);
Hs = f([
  H({ type: M.Choice })
], Hs);
class wo {
  constructor(e = {}) {
    this.contentType = "", this.contentEncryptionAlgorithm = new na(), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], wo.prototype, "contentType", void 0);
f([
  y({ type: na })
], wo.prototype, "contentEncryptionAlgorithm", void 0);
f([
  y({ type: Hs, optional: !0 })
], wo.prototype, "encryptedContent", void 0);
class bc {
  constructor(e = {}) {
    this.keyAttrId = "", Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], bc.prototype, "keyAttrId", void 0);
f([
  y({ type: b.Any, optional: !0 })
], bc.prototype, "keyAttr", void 0);
var zl;
class xc {
  constructor(e = {}) {
    this.subjectKeyIdentifier = new Hn(), Object.assign(this, e);
  }
}
f([
  y({ type: Hn })
], xc.prototype, "subjectKeyIdentifier", void 0);
f([
  y({ type: b.GeneralizedTime, optional: !0 })
], xc.prototype, "date", void 0);
f([
  y({ type: bc, optional: !0 })
], xc.prototype, "other", void 0);
let Zi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: xc, context: 0, implicit: !0, optional: !0 })
], Zi.prototype, "rKeyId", void 0);
f([
  y({ type: as, optional: !0 })
], Zi.prototype, "issuerAndSerialNumber", void 0);
Zi = f([
  H({ type: M.Choice })
], Zi);
class lf {
  constructor(e = {}) {
    this.rid = new Zi(), this.encryptedKey = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: Zi })
], lf.prototype, "rid", void 0);
f([
  y({ type: nt })
], lf.prototype, "encryptedKey", void 0);
let aa = zl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, zl.prototype);
  }
};
aa = zl = f([
  H({ type: M.Sequence, itemType: lf })
], aa);
class uf {
  constructor(e = {}) {
    this.algorithm = new ne(), this.publicKey = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: ne })
], uf.prototype, "algorithm", void 0);
f([
  y({ type: b.BitString })
], uf.prototype, "publicKey", void 0);
let gi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: Hn, context: 0, implicit: !0, optional: !0 })
], gi.prototype, "subjectKeyIdentifier", void 0);
f([
  y({ type: uf, context: 1, implicit: !0, optional: !0 })
], gi.prototype, "originatorKey", void 0);
f([
  y({ type: as, optional: !0 })
], gi.prototype, "issuerAndSerialNumber", void 0);
gi = f([
  H({ type: M.Choice })
], gi);
class ls {
  constructor(e = {}) {
    this.version = cn.v3, this.originator = new gi(), this.keyEncryptionAlgorithm = new ln(), this.recipientEncryptedKeys = new aa(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], ls.prototype, "version", void 0);
f([
  y({ type: gi, context: 0 })
], ls.prototype, "originator", void 0);
f([
  y({ type: nt, context: 1, optional: !0 })
], ls.prototype, "ukm", void 0);
f([
  y({ type: ln })
], ls.prototype, "keyEncryptionAlgorithm", void 0);
f([
  y({ type: aa })
], ls.prototype, "recipientEncryptedKeys", void 0);
let Wi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: Hn, context: 0, implicit: !0 })
], Wi.prototype, "subjectKeyIdentifier", void 0);
f([
  y({ type: as })
], Wi.prototype, "issuerAndSerialNumber", void 0);
Wi = f([
  H({ type: M.Choice })
], Wi);
class bo {
  constructor(e = {}) {
    this.version = cn.v0, this.rid = new Wi(), this.keyEncryptionAlgorithm = new ln(), this.encryptedKey = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], bo.prototype, "version", void 0);
f([
  y({ type: Wi })
], bo.prototype, "rid", void 0);
f([
  y({ type: ln })
], bo.prototype, "keyEncryptionAlgorithm", void 0);
f([
  y({ type: nt })
], bo.prototype, "encryptedKey", void 0);
class xo {
  constructor(e = {}) {
    this.keyIdentifier = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: nt })
], xo.prototype, "keyIdentifier", void 0);
f([
  y({ type: b.GeneralizedTime, optional: !0 })
], xo.prototype, "date", void 0);
f([
  y({ type: bc, optional: !0 })
], xo.prototype, "other", void 0);
class Ao {
  constructor(e = {}) {
    this.version = cn.v4, this.kekid = new xo(), this.keyEncryptionAlgorithm = new ln(), this.encryptedKey = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], Ao.prototype, "version", void 0);
f([
  y({ type: xo })
], Ao.prototype, "kekid", void 0);
f([
  y({ type: ln })
], Ao.prototype, "keyEncryptionAlgorithm", void 0);
f([
  y({ type: nt })
], Ao.prototype, "encryptedKey", void 0);
class So {
  constructor(e = {}) {
    this.version = cn.v0, this.keyEncryptionAlgorithm = new ln(), this.encryptedKey = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], So.prototype, "version", void 0);
f([
  y({ type: Rl, context: 0, optional: !0 })
], So.prototype, "keyDerivationAlgorithm", void 0);
f([
  y({ type: ln })
], So.prototype, "keyEncryptionAlgorithm", void 0);
f([
  y({ type: nt })
], So.prototype, "encryptedKey", void 0);
class ff {
  constructor(e = {}) {
    this.oriType = "", this.oriValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], ff.prototype, "oriType", void 0);
f([
  y({ type: b.Any })
], ff.prototype, "oriValue", void 0);
let Gn = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: bo, optional: !0 })
], Gn.prototype, "ktri", void 0);
f([
  y({ type: ls, context: 1, implicit: !0, optional: !0 })
], Gn.prototype, "kari", void 0);
f([
  y({ type: Ao, context: 2, implicit: !0, optional: !0 })
], Gn.prototype, "kekri", void 0);
f([
  y({ type: So, context: 3, implicit: !0, optional: !0 })
], Gn.prototype, "pwri", void 0);
f([
  y({ type: ff, context: 4, implicit: !0, optional: !0 })
], Gn.prototype, "ori", void 0);
Gn = f([
  H({ type: M.Choice })
], Gn);
var Kl;
let ca = Kl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Kl.prototype);
  }
};
ca = Kl = f([
  H({ type: M.Set, itemType: Gn })
], ca);
var ql;
class Ac {
  constructor(e = {}) {
    this.otherRevInfoFormat = "", this.otherRevInfo = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Ac.prototype, "otherRevInfoFormat", void 0);
f([
  y({ type: b.Any })
], Ac.prototype, "otherRevInfo", void 0);
let la = class {
  constructor(e = {}) {
    this.other = new Ac(), Object.assign(this, e);
  }
};
f([
  y({ type: Ac, context: 1, implicit: !0 })
], la.prototype, "other", void 0);
la = f([
  H({ type: M.Choice })
], la);
let ua = ql = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, ql.prototype);
  }
};
ua = ql = f([
  H({ type: M.Set, itemType: la })
], ua);
class hf {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: Ls, context: 0, implicit: !0, optional: !0 })
], hf.prototype, "certs", void 0);
f([
  y({ type: ua, context: 1, implicit: !0, optional: !0 })
], hf.prototype, "crls", void 0);
var Zl;
let Wl = Zl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Zl.prototype);
  }
};
Wl = Zl = f([
  H({ type: M.Set, itemType: cs })
], Wl);
class _o {
  constructor(e = {}) {
    this.version = cn.v0, this.recipientInfos = new ca(), this.encryptedContentInfo = new wo(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], _o.prototype, "version", void 0);
f([
  y({ type: hf, context: 0, implicit: !0, optional: !0 })
], _o.prototype, "originatorInfo", void 0);
f([
  y({ type: ca })
], _o.prototype, "recipientInfos", void 0);
f([
  y({ type: wo })
], _o.prototype, "encryptedContentInfo", void 0);
f([
  y({ type: Wl, context: 1, implicit: !0, optional: !0 })
], _o.prototype, "unprotectedAttrs", void 0);
const tv = "1.2.840.113549.1.7.1", Yl = "1.2.840.113549.1.7.2";
var Jl;
let fa = Jl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Jl.prototype);
  }
};
fa = Jl = f([
  H({ type: M.Set, itemType: Vs })
], fa);
class An {
  constructor(e = {}) {
    this.version = cn.v0, this.digestAlgorithms = new fa(), this.encapContentInfo = new wc(), this.signerInfos = new ia(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], An.prototype, "version", void 0);
f([
  y({ type: fa })
], An.prototype, "digestAlgorithms", void 0);
f([
  y({ type: wc })
], An.prototype, "encapContentInfo", void 0);
f([
  y({ type: Ls, context: 0, implicit: !0, optional: !0 })
], An.prototype, "certificates", void 0);
f([
  y({ type: ua, context: 1, implicit: !0, optional: !0 })
], An.prototype, "crls", void 0);
f([
  y({ type: ia })
], An.prototype, "signerInfos", void 0);
const Fs = "1.2.840.10045.2.1", df = "1.2.840.10045.4.1", Gp = "1.2.840.10045.4.3.1", pf = "1.2.840.10045.4.3.2", yf = "1.2.840.10045.4.3.3", gf = "1.2.840.10045.4.3.4", nh = "1.2.840.10045.3.1.7", ih = "1.3.132.0.34", sh = "1.3.132.0.35";
function Eo(r) {
  return new ne({ algorithm: r });
}
const rv = Eo(df);
Eo(Gp);
const nv = Eo(pf), iv = Eo(yf), sv = Eo(gf);
let Gs = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: b.ObjectIdentifier })
], Gs.prototype, "fieldType", void 0);
f([
  y({ type: b.Any })
], Gs.prototype, "parameters", void 0);
Gs = f([
  H({ type: M.Sequence })
], Gs);
class ov extends nt {
}
let Yi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: b.OctetString })
], Yi.prototype, "a", void 0);
f([
  y({ type: b.OctetString })
], Yi.prototype, "b", void 0);
f([
  y({ type: b.BitString, optional: !0 })
], Yi.prototype, "seed", void 0);
Yi = f([
  H({ type: M.Sequence })
], Yi);
var Xl;
(function(r) {
  r[r.ecpVer1 = 1] = "ecpVer1";
})(Xl || (Xl = {}));
let En = class {
  constructor(e = {}) {
    this.version = Xl.ecpVer1, Object.assign(this, e);
  }
};
f([
  y({ type: b.Integer })
], En.prototype, "version", void 0);
f([
  y({ type: Gs })
], En.prototype, "fieldID", void 0);
f([
  y({ type: Yi })
], En.prototype, "curve", void 0);
f([
  y({ type: ov })
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
let zn = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: b.ObjectIdentifier })
], zn.prototype, "namedCurve", void 0);
f([
  y({ type: b.Null })
], zn.prototype, "implicitCurve", void 0);
f([
  y({ type: En })
], zn.prototype, "specifiedCurve", void 0);
zn = f([
  H({ type: M.Choice })
], zn);
class Sc {
  constructor(e = {}) {
    this.version = 1, this.privateKey = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], Sc.prototype, "version", void 0);
f([
  y({ type: nt })
], Sc.prototype, "privateKey", void 0);
f([
  y({ type: zn, context: 0, optional: !0 })
], Sc.prototype, "parameters", void 0);
f([
  y({ type: b.BitString, context: 1, optional: !0 })
], Sc.prototype, "publicKey", void 0);
class ha {
  constructor(e = {}) {
    this.r = new ArrayBuffer(0), this.s = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, converter: xt })
], ha.prototype, "r", void 0);
f([
  y({ type: b.Integer, converter: xt })
], ha.prototype, "s", void 0);
const wr = "1.2.840.113549.1.1", vi = `${wr}.1`, av = `${wr}.7`, cv = `${wr}.9`, js = `${wr}.10`, lv = `${wr}.2`, uv = `${wr}.4`, da = `${wr}.5`, fv = `${wr}.14`, Ql = `${wr}.11`, pa = `${wr}.12`, ya = `${wr}.13`, zp = `${wr}.15`, Kp = `${wr}.16`, ga = "1.3.14.3.2.26", qp = "2.16.840.1.101.3.4.2.4", va = "2.16.840.1.101.3.4.2.1", ma = "2.16.840.1.101.3.4.2.2", wa = "2.16.840.1.101.3.4.2.3", hv = "2.16.840.1.101.3.4.2.5", dv = "2.16.840.1.101.3.4.2.6", pv = "1.2.840.113549.2.2", yv = "1.2.840.113549.2.5", _c = `${wr}.8`;
function Ft(r) {
  return new ne({ algorithm: r, parameters: null });
}
Ft(pv);
Ft(yv);
const mi = Ft(ga);
Ft(qp);
Ft(va);
Ft(ma);
Ft(wa);
Ft(hv);
Ft(dv);
const Zp = new ne({
  algorithm: _c,
  parameters: q.serialize(mi)
}), Wp = new ne({
  algorithm: cv,
  parameters: q.serialize(Zo.toASN(new Uint8Array([218, 57, 163, 238, 94, 107, 75, 13, 50, 85, 191, 239, 149, 96, 24, 144, 175, 216, 7, 9]).buffer))
});
Ft(vi);
Ft(lv);
Ft(uv);
Ft(da);
Ft(zp);
Ft(Kp);
Ft(pa);
Ft(ya);
Ft(zp);
Ft(Kp);
class Ec {
  constructor(e = {}) {
    this.hashAlgorithm = new ne(mi), this.maskGenAlgorithm = new ne({
      algorithm: _c,
      parameters: q.serialize(mi)
    }), this.pSourceAlgorithm = new ne(Wp), Object.assign(this, e);
  }
}
f([
  y({ type: ne, context: 0, defaultValue: mi })
], Ec.prototype, "hashAlgorithm", void 0);
f([
  y({ type: ne, context: 1, defaultValue: Zp })
], Ec.prototype, "maskGenAlgorithm", void 0);
f([
  y({ type: ne, context: 2, defaultValue: Wp })
], Ec.prototype, "pSourceAlgorithm", void 0);
new ne({
  algorithm: av,
  parameters: q.serialize(new Ec())
});
class wi {
  constructor(e = {}) {
    this.hashAlgorithm = new ne(mi), this.maskGenAlgorithm = new ne({
      algorithm: _c,
      parameters: q.serialize(mi)
    }), this.saltLength = 20, this.trailerField = 1, Object.assign(this, e);
  }
}
f([
  y({ type: ne, context: 0, defaultValue: mi })
], wi.prototype, "hashAlgorithm", void 0);
f([
  y({ type: ne, context: 1, defaultValue: Zp })
], wi.prototype, "maskGenAlgorithm", void 0);
f([
  y({ type: b.Integer, context: 2, defaultValue: 20 })
], wi.prototype, "saltLength", void 0);
f([
  y({ type: b.Integer, context: 3, defaultValue: 1 })
], wi.prototype, "trailerField", void 0);
new ne({
  algorithm: js,
  parameters: q.serialize(new wi())
});
class Ic {
  constructor(e = {}) {
    this.digestAlgorithm = new ne(), this.digest = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: ne })
], Ic.prototype, "digestAlgorithm", void 0);
f([
  y({ type: nt })
], Ic.prototype, "digest", void 0);
var eu;
class kc {
  constructor(e = {}) {
    this.prime = new ArrayBuffer(0), this.exponent = new ArrayBuffer(0), this.coefficient = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, converter: xt })
], kc.prototype, "prime", void 0);
f([
  y({ type: b.Integer, converter: xt })
], kc.prototype, "exponent", void 0);
f([
  y({ type: b.Integer, converter: xt })
], kc.prototype, "coefficient", void 0);
let tu = eu = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, eu.prototype);
  }
};
tu = eu = f([
  H({ type: M.Sequence, itemType: kc })
], tu);
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
  y({ type: tu, optional: !0 })
], pn.prototype, "otherPrimeInfos", void 0);
class vf {
  constructor(e = {}) {
    this.modulus = new ArrayBuffer(0), this.publicExponent = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, converter: xt })
], vf.prototype, "modulus", void 0);
f([
  y({ type: b.Integer, converter: xt })
], vf.prototype, "publicExponent", void 0);
var ru;
(function(r) {
  r[r.Transient = 0] = "Transient", r[r.Singleton = 1] = "Singleton", r[r.ResolutionScoped = 2] = "ResolutionScoped", r[r.ContainerScoped = 3] = "ContainerScoped";
})(ru || (ru = {}));
const dr = ru;
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
var nu = function(r, e) {
  return nu = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, n) {
    t.__proto__ = n;
  } || function(t, n) {
    for (var i in n) n.hasOwnProperty(i) && (t[i] = n[i]);
  }, nu(r, e);
};
function mf(r, e) {
  nu(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
function gv(r, e, t, n) {
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
function vv(r, e) {
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
function Po(r) {
  var e = typeof Symbol == "function" && Symbol.iterator, t = e && r[e], n = 0;
  if (t) return t.call(r);
  if (r && typeof r.length == "number") return {
    next: function() {
      return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
    }
  };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function ba(r, e) {
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
    r = r.concat(ba(arguments[e]));
  return r;
}
var mv = "injectionTokens";
function wv(r) {
  var e = Reflect.getMetadata("design:paramtypes", r) || [], t = Reflect.getOwnMetadata(mv, r) || {};
  return Object.keys(t).forEach(function(n) {
    e[+n] = t[n];
  }), e;
}
function Yp(r) {
  return !!r.useClass;
}
function iu(r) {
  return !!r.useFactory;
}
var Jp = function() {
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
function Pi(r) {
  return typeof r == "string" || typeof r == "symbol";
}
function bv(r) {
  return typeof r == "object" && "token" in r && "multiple" in r;
}
function oh(r) {
  return typeof r == "object" && "token" in r && "transform" in r;
}
function xv(r) {
  return typeof r == "function" || r instanceof Jp;
}
function Mo(r) {
  return !!r.useToken;
}
function Vo(r) {
  return r.useValue != null;
}
function Av(r) {
  return Yp(r) || Vo(r) || Mo(r) || iu(r);
}
var wf = function() {
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
}(), Sv = function(r) {
  mf(e, r);
  function e() {
    return r !== null && r.apply(this, arguments) || this;
  }
  return e;
}(wf), ah = /* @__PURE__ */ function() {
  function r() {
    this.scopedResolutions = /* @__PURE__ */ new Map();
  }
  return r;
}();
function _v(r, e) {
  if (r === null)
    return "at position #" + e;
  var t = r.split(",")[e].trim();
  return '"' + t + '" at position #' + e;
}
function Ev(r, e, t) {
  return t === void 0 && (t = "    "), ri([r], e.message.split(`
`).map(function(n) {
    return t + n;
  })).join(`
`);
}
function Iv(r, e, t) {
  var n = ba(r.toString().match(/constructor\(([\w, ]+)\)/) || [], 2), i = n[1], s = i === void 0 ? null : i, o = _v(s, e);
  return Ev("Cannot inject the dependency " + o + ' of "' + r.name + '" constructor. Reason:', t);
}
function kv(r) {
  if (typeof r.dispose != "function")
    return !1;
  var e = r.dispose;
  return !(e.length > 0);
}
var Cv = function(r) {
  mf(e, r);
  function e() {
    return r !== null && r.apply(this, arguments) || this;
  }
  return e;
}(wf), Bv = function(r) {
  mf(e, r);
  function e() {
    return r !== null && r.apply(this, arguments) || this;
  }
  return e;
}(wf), Ov = /* @__PURE__ */ function() {
  function r() {
    this.preResolution = new Cv(), this.postResolution = new Bv();
  }
  return r;
}(), Xp = /* @__PURE__ */ new Map(), Tv = function() {
  function r(e) {
    this.parent = e, this._registry = new Sv(), this.interceptors = new Ov(), this.disposed = !1, this.disposables = /* @__PURE__ */ new Set();
  }
  return r.prototype.register = function(e, t, n) {
    n === void 0 && (n = { lifecycle: dr.Transient }), this.ensureNotDisposed();
    var i;
    if (Av(t) ? i = t : i = { useClass: t }, Mo(i))
      for (var s = [e], o = i; o != null; ) {
        var c = o.useToken;
        if (s.includes(c))
          throw new Error("Token registration cycle detected! " + ri(s, [c]).join(" -> "));
        s.push(c);
        var u = this._registry.get(c);
        u && Mo(u.provider) ? o = u.provider : o = null;
      }
    if ((n.lifecycle === dr.Singleton || n.lifecycle == dr.ContainerScoped || n.lifecycle == dr.ResolutionScoped) && (Vo(i) || iu(i)))
      throw new Error('Cannot use lifecycle "' + dr[n.lifecycle] + '" with ValueProviders or FactoryProviders');
    return this._registry.set(e, { provider: i, options: n }), this;
  }, r.prototype.registerType = function(e, t) {
    return this.ensureNotDisposed(), Pi(t) ? this.register(e, {
      useToken: t
    }) : this.register(e, {
      useClass: t
    });
  }, r.prototype.registerInstance = function(e, t) {
    return this.ensureNotDisposed(), this.register(e, {
      useValue: t
    });
  }, r.prototype.registerSingleton = function(e, t) {
    if (this.ensureNotDisposed(), Pi(e)) {
      if (Pi(t))
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
    return t && !Pi(t) && (n = t), this.register(e, {
      useClass: n
    }, { lifecycle: dr.Singleton });
  }, r.prototype.resolve = function(e, t) {
    t === void 0 && (t = new ah()), this.ensureNotDisposed();
    var n = this.getRegistration(e);
    if (!n && Pi(e))
      throw new Error('Attempted to resolve unregistered dependency token: "' + e.toString() + '"');
    if (this.executePreResolutionInterceptor(e, "Single"), n) {
      var i = this.resolveRegistration(n, t);
      return this.executePostResolutionInterceptor(e, i, "Single"), i;
    }
    if (xv(e)) {
      var i = this.construct(e, t);
      return this.executePostResolutionInterceptor(e, i, "Single"), i;
    }
    throw new Error("Attempted to construct an undefined constructor. Could mean a circular dependency problem. Try using `delay` function.");
  }, r.prototype.executePreResolutionInterceptor = function(e, t) {
    var n, i;
    if (this.interceptors.preResolution.has(e)) {
      var s = [];
      try {
        for (var o = Po(this.interceptors.preResolution.getAll(e)), c = o.next(); !c.done; c = o.next()) {
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
        for (var c = Po(this.interceptors.postResolution.getAll(e)), u = c.next(); !u.done; u = c.next()) {
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
    return Vo(e.provider) ? o = e.provider.useValue : Mo(e.provider) ? o = s ? e.instance || (e.instance = this.resolve(e.provider.useToken, t)) : this.resolve(e.provider.useToken, t) : Yp(e.provider) ? o = s ? e.instance || (e.instance = this.construct(e.provider.useClass, t)) : this.construct(e.provider.useClass, t) : iu(e.provider) ? o = e.provider.useFactory(this) : o = this.construct(e.provider, t), e.options.lifecycle === dr.ResolutionScoped && t.scopedResolutions.set(e, o), o;
  }, r.prototype.resolveAll = function(e, t) {
    var n = this;
    t === void 0 && (t = new ah()), this.ensureNotDisposed();
    var i = this.getAllRegistrations(e);
    if (!i && Pi(e))
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
      for (var n = Po(this._registry.entries()), i = n.next(); !i.done; i = n.next()) {
        var s = ba(i.value, 2), o = s[0], c = s[1];
        this._registry.setAll(o, c.filter(function(u) {
          return !Vo(u.provider);
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
      for (var i = Po(this._registry.entries()), s = i.next(); !s.done; s = i.next()) {
        var o = ba(s.value, 2), c = o[0], u = o[1];
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
    return gv(this, void 0, void 0, function() {
      var e;
      return vv(this, function(t) {
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
    if (e instanceof Jp)
      return e.createProxy(function(s) {
        return n.resolve(s, t);
      });
    var i = function() {
      var s = Xp.get(e);
      if (!s || s.length === 0) {
        if (e.length === 0)
          return new e();
        throw new Error('TypeInfo not known for "' + e.name + '"');
      }
      var o = s.map(n.resolveParams(t, e));
      return new (e.bind.apply(e, ri([void 0], o)))();
    }();
    return kv(i) && this.disposables.add(i), i;
  }, r.prototype.resolveParams = function(e, t) {
    var n = this;
    return function(i, s) {
      var o, c, u;
      try {
        return bv(i) ? oh(i) ? i.multiple ? (o = n.resolve(i.transform)).transform.apply(o, ri([n.resolveAll(i.token)], i.transformArgs)) : (c = n.resolve(i.transform)).transform.apply(c, ri([n.resolve(i.token, e)], i.transformArgs)) : i.multiple ? n.resolveAll(i.token) : n.resolve(i.token, e) : oh(i) ? (u = n.resolve(i.transform, e)).transform.apply(u, ri([n.resolve(i.token, e)], i.transformArgs)) : n.resolve(i, e);
      } catch (h) {
        throw new Error(Iv(t, s, h));
      }
    };
  }, r.prototype.ensureNotDisposed = function() {
    if (this.disposed)
      throw new Error("This container has been disposed, you cannot interact with a disposed container");
  }, r;
}(), lr = new Tv();
function Cc() {
  return function(r) {
    Xp.set(r, wv(r));
  };
}
if (typeof Reflect > "u" || !Reflect.getMetadata)
  throw new Error(`tsyringe requires a reflect polyfill. Please add 'import "reflect-metadata"' to the top of your entry point.`);
var su;
class Bc {
  constructor(e = {}) {
    this.attrId = "", this.attrValues = [], Object.assign(e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Bc.prototype, "attrId", void 0);
f([
  y({ type: b.Any, repeated: "set" })
], Bc.prototype, "attrValues", void 0);
let ch = su = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, su.prototype);
  }
};
ch = su = f([
  H({ type: M.Sequence, itemType: Bc })
], ch);
var ou;
let lh = ou = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, ou.prototype);
  }
};
lh = ou = f([
  H({ type: M.Sequence, itemType: xn })
], lh);
class Qp {
  constructor(e = {}) {
    this.certId = "", this.certValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Qp.prototype, "certId", void 0);
f([
  y({ type: b.Any, context: 0 })
], Qp.prototype, "certValue", void 0);
class e0 {
  constructor(e = {}) {
    this.crlId = "", this.crltValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], e0.prototype, "crlId", void 0);
f([
  y({ type: b.Any, context: 0 })
], e0.prototype, "crltValue", void 0);
class t0 extends nt {
}
let Oc = class {
  constructor(e = {}) {
    this.encryptionAlgorithm = new ne(), this.encryptedData = new t0(), Object.assign(this, e);
  }
};
f([
  y({ type: ne })
], Oc.prototype, "encryptionAlgorithm", void 0);
f([
  y({ type: t0 })
], Oc.prototype, "encryptedData", void 0);
var au, cu;
(function(r) {
  r[r.v1 = 0] = "v1";
})(cu || (cu = {}));
class r0 extends nt {
}
let lu = au = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, au.prototype);
  }
};
lu = au = f([
  H({ type: M.Sequence, itemType: _n })
], lu);
class Io {
  constructor(e = {}) {
    this.version = cu.v1, this.privateKeyAlgorithm = new ne(), this.privateKey = new r0(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], Io.prototype, "version", void 0);
f([
  y({ type: ne })
], Io.prototype, "privateKeyAlgorithm", void 0);
f([
  y({ type: r0 })
], Io.prototype, "privateKey", void 0);
f([
  y({ type: lu, implicit: !0, context: 0, optional: !0 })
], Io.prototype, "attributes", void 0);
let uh = class extends Io {
};
uh = f([
  H({ type: M.Sequence })
], uh);
let fh = class extends Oc {
};
fh = f([
  H({ type: M.Sequence })
], fh);
class n0 {
  constructor(e = {}) {
    this.secretTypeId = "", this.secretValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], n0.prototype, "secretTypeId", void 0);
f([
  y({ type: b.Any, context: 0 })
], n0.prototype, "secretValue", void 0);
class ko {
  constructor(e = {}) {
    this.mac = new Ic(), this.macSalt = new nt(), this.iterations = 1, Object.assign(this, e);
  }
}
f([
  y({ type: Ic })
], ko.prototype, "mac", void 0);
f([
  y({ type: nt })
], ko.prototype, "macSalt", void 0);
f([
  y({ type: b.Integer, defaultValue: 1 })
], ko.prototype, "iterations", void 0);
class Tc {
  constructor(e = {}) {
    this.version = 3, this.authSafe = new xn(), this.macData = new ko(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], Tc.prototype, "version", void 0);
f([
  y({ type: xn })
], Tc.prototype, "authSafe", void 0);
f([
  y({ type: ko, optional: !0 })
], Tc.prototype, "macData", void 0);
var uu;
class Nc {
  constructor(e = {}) {
    this.bagId = "", this.bagValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Nc.prototype, "bagId", void 0);
f([
  y({ type: b.Any, context: 0 })
], Nc.prototype, "bagValue", void 0);
f([
  y({ type: Bc, repeated: "set", optional: !0 })
], Nc.prototype, "bagAttributes", void 0);
let hh = uu = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, uu.prototype);
  }
};
hh = uu = f([
  H({ type: M.Sequence, itemType: Nc })
], hh);
var fu, hu, du;
const i0 = "1.2.840.113549.1.9", s0 = `${i0}.7`, bf = `${i0}.14`;
let xa = class extends Xt {
  constructor(e = {}) {
    super(e);
  }
  toString() {
    return this.ia5String || super.toString();
  }
};
f([
  y({ type: b.IA5String })
], xa.prototype, "ia5String", void 0);
xa = f([
  H({ type: M.Choice })
], xa);
let dh = class extends xn {
};
dh = f([
  H({ type: M.Sequence })
], dh);
let ph = class extends Tc {
};
ph = f([
  H({ type: M.Sequence })
], ph);
let yh = class extends Oc {
};
yh = f([
  H({ type: M.Sequence })
], yh);
let pu = class {
  constructor(e = "") {
    this.value = e;
  }
  toString() {
    return this.value;
  }
};
f([
  y({ type: b.IA5String })
], pu.prototype, "value", void 0);
pu = f([
  H({ type: M.Choice })
], pu);
let gh = class extends xa {
};
gh = f([
  H({ type: M.Choice })
], gh);
let vh = class extends Xt {
};
vh = f([
  H({ type: M.Choice })
], vh);
let yu = class {
  constructor(e = /* @__PURE__ */ new Date()) {
    this.value = e;
  }
};
f([
  y({ type: b.GeneralizedTime })
], yu.prototype, "value", void 0);
yu = f([
  H({ type: M.Choice })
], yu);
let mh = class extends Xt {
};
mh = f([
  H({ type: M.Choice })
], mh);
let gu = class {
  constructor(e = "M") {
    this.value = e;
  }
  toString() {
    return this.value;
  }
};
f([
  y({ type: b.PrintableString })
], gu.prototype, "value", void 0);
gu = f([
  H({ type: M.Choice })
], gu);
let Aa = class {
  constructor(e = "") {
    this.value = e;
  }
  toString() {
    return this.value;
  }
};
f([
  y({ type: b.PrintableString })
], Aa.prototype, "value", void 0);
Aa = f([
  H({ type: M.Choice })
], Aa);
let wh = class extends Aa {
};
wh = f([
  H({ type: M.Choice })
], wh);
let bh = class extends Xt {
};
bh = f([
  H({ type: M.Choice })
], bh);
let vu = class {
  constructor(e = "") {
    this.value = e;
  }
  toString() {
    return this.value;
  }
};
f([
  y({ type: b.ObjectIdentifier })
], vu.prototype, "value", void 0);
vu = f([
  H({ type: M.Choice })
], vu);
let xh = class extends Yt {
};
xh = f([
  H({ type: M.Choice })
], xh);
let mu = class {
  constructor(e = 0) {
    this.value = e;
  }
  toString() {
    return this.value.toString();
  }
};
f([
  y({ type: b.Integer })
], mu.prototype, "value", void 0);
mu = f([
  H({ type: M.Choice })
], mu);
let Ah = class extends dn {
};
Ah = f([
  H({ type: M.Sequence })
], Ah);
let Sa = class extends Xt {
};
Sa = f([
  H({ type: M.Choice })
], Sa);
let Sh = fu = class extends di {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, fu.prototype);
  }
};
Sh = fu = f([
  H({ type: M.Sequence })
], Sh);
let _h = hu = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, hu.prototype);
  }
};
_h = hu = f([
  H({ type: M.Set, itemType: cs })
], _h);
let wu = class {
  constructor(e = "") {
    this.value = e;
  }
  toString() {
    return this.value;
  }
};
f([
  y({ type: b.BmpString })
], wu.prototype, "value", void 0);
wu = f([
  H({ type: M.Choice })
], wu);
let bu = class extends ne {
};
bu = f([
  H({ type: M.Sequence })
], bu);
let Eh = du = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, du.prototype);
  }
};
Eh = du = f([
  H({ type: M.Sequence, itemType: bu })
], Eh);
var xu;
let _a = xu = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, xu.prototype);
  }
};
_a = xu = f([
  H({ type: M.Sequence, itemType: _n })
], _a);
class us {
  constructor(e = {}) {
    this.version = 0, this.subject = new Ht(), this.subjectPKInfo = new nn(), this.attributes = new _a(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], us.prototype, "version", void 0);
f([
  y({ type: Ht })
], us.prototype, "subject", void 0);
f([
  y({ type: nn })
], us.prototype, "subjectPKInfo", void 0);
f([
  y({ type: _a, implicit: !0, context: 0 })
], us.prototype, "attributes", void 0);
class zs {
  constructor(e = {}) {
    this.certificationRequestInfo = new us(), this.signatureAlgorithm = new ne(), this.signature = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: us })
], zs.prototype, "certificationRequestInfo", void 0);
f([
  y({ type: ne })
], zs.prototype, "signatureAlgorithm", void 0);
f([
  y({ type: b.BitString })
], zs.prototype, "signature", void 0);
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
const Co = "crypto.algorithm";
class Nv {
  getAlgorithms() {
    return lr.resolveAll(Co);
  }
  toAsnAlgorithm(e) {
    ({ ...e });
    for (const t of this.getAlgorithms()) {
      const n = t.toAsnAlgorithm(e);
      if (n)
        return n;
    }
    if (/^[0-9.]+$/.test(e.name)) {
      const t = new ne({
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
const Ji = "crypto.algorithmProvider";
lr.registerSingleton(Ji, Nv);
var Lo;
const br = "1.3.36.3.3.2.8.1.1", Ih = `${br}.1`, kh = `${br}.2`, Ch = `${br}.3`, Bh = `${br}.4`, Oh = `${br}.5`, Th = `${br}.6`, Nh = `${br}.7`, Ph = `${br}.8`, jh = `${br}.9`, Rh = `${br}.10`, Uh = `${br}.11`, Dh = `${br}.12`, $h = `${br}.13`, Mh = `${br}.14`, Vh = "brainpoolP160r1", Lh = "brainpoolP160t1", Hh = "brainpoolP192r1", Fh = "brainpoolP192t1", Gh = "brainpoolP224r1", zh = "brainpoolP224t1", Kh = "brainpoolP256r1", qh = "brainpoolP256t1", Zh = "brainpoolP320r1", Wh = "brainpoolP320t1", Yh = "brainpoolP384r1", Jh = "brainpoolP384t1", Xh = "brainpoolP512r1", Qh = "brainpoolP512t1", kt = "ECDSA";
let Ks = Lo = class {
  toAsnAlgorithm(e) {
    switch (e.name.toLowerCase()) {
      case kt.toLowerCase():
        if ("hash" in e)
          switch ((typeof e.hash == "string" ? e.hash : e.hash.name).toLowerCase()) {
            case "sha-1":
              return rv;
            case "sha-256":
              return nv;
            case "sha-384":
              return iv;
            case "sha-512":
              return sv;
          }
        else if ("namedCurve" in e) {
          let t = "";
          switch (e.namedCurve) {
            case "P-256":
              t = nh;
              break;
            case "K-256":
              t = Lo.SECP256K1;
              break;
            case "P-384":
              t = ih;
              break;
            case "P-521":
              t = sh;
              break;
            case Vh:
              t = Ih;
              break;
            case Lh:
              t = kh;
              break;
            case Hh:
              t = Ch;
              break;
            case Fh:
              t = Bh;
              break;
            case Gh:
              t = Oh;
              break;
            case zh:
              t = Th;
              break;
            case Kh:
              t = Nh;
              break;
            case qh:
              t = Ph;
              break;
            case Zh:
              t = jh;
              break;
            case Wh:
              t = Rh;
              break;
            case Yh:
              t = Uh;
              break;
            case Jh:
              t = Dh;
              break;
            case Xh:
              t = $h;
              break;
            case Qh:
              t = Mh;
              break;
          }
          if (t)
            return new ne({
              algorithm: Fs,
              parameters: q.serialize(new zn({ namedCurve: t }))
            });
        }
    }
    return null;
  }
  toWebAlgorithm(e) {
    switch (e.algorithm) {
      case df:
        return { name: kt, hash: { name: "SHA-1" } };
      case pf:
        return { name: kt, hash: { name: "SHA-256" } };
      case yf:
        return { name: kt, hash: { name: "SHA-384" } };
      case gf:
        return { name: kt, hash: { name: "SHA-512" } };
      case Fs: {
        if (!e.parameters)
          throw new TypeError("Cannot get required parameters from EC algorithm");
        switch (q.parse(e.parameters, zn).namedCurve) {
          case nh:
            return { name: kt, namedCurve: "P-256" };
          case Lo.SECP256K1:
            return { name: kt, namedCurve: "K-256" };
          case ih:
            return { name: kt, namedCurve: "P-384" };
          case sh:
            return { name: kt, namedCurve: "P-521" };
          case Ih:
            return { name: kt, namedCurve: Vh };
          case kh:
            return { name: kt, namedCurve: Lh };
          case Ch:
            return { name: kt, namedCurve: Hh };
          case Bh:
            return { name: kt, namedCurve: Fh };
          case Oh:
            return { name: kt, namedCurve: Gh };
          case Th:
            return { name: kt, namedCurve: zh };
          case Nh:
            return { name: kt, namedCurve: Kh };
          case Ph:
            return { name: kt, namedCurve: qh };
          case jh:
            return { name: kt, namedCurve: Zh };
          case Rh:
            return { name: kt, namedCurve: Wh };
          case Uh:
            return { name: kt, namedCurve: Yh };
          case Dh:
            return { name: kt, namedCurve: Jh };
          case $h:
            return { name: kt, namedCurve: Xh };
          case Mh:
            return { name: kt, namedCurve: Qh };
        }
      }
    }
    return null;
  }
};
Ks.SECP256K1 = "1.3.132.0.10";
Ks = Lo = f([
  Cc()
], Ks);
lr.registerSingleton(Co, Ks);
const o0 = Symbol("name"), a0 = Symbol("value");
class rt {
  constructor(e, t = {}, n = "") {
    this[o0] = e, this[a0] = n;
    for (const i in t)
      this[i] = t[i];
  }
}
rt.NAME = o0;
rt.VALUE = a0;
class Pv {
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
  [ga]: "sha1",
  [qp]: "sha224",
  [va]: "sha256",
  [ma]: "sha384",
  [wa]: "sha512",
  [vi]: "rsaEncryption",
  [da]: "sha1WithRSAEncryption",
  [fv]: "sha224WithRSAEncryption",
  [Ql]: "sha256WithRSAEncryption",
  [pa]: "sha384WithRSAEncryption",
  [ya]: "sha512WithRSAEncryption",
  [Fs]: "ecPublicKey",
  [df]: "ecdsaWithSHA1",
  [Gp]: "ecdsaWithSHA224",
  [pf]: "ecdsaWithSHA256",
  [yf]: "ecdsaWithSHA384",
  [gf]: "ecdsaWithSHA512",
  [Wg]: "TLS WWW server authentication",
  [Yg]: "TLS WWW client authentication",
  [Jg]: "Code Signing",
  [Xg]: "E-mail Protection",
  [Qg]: "Time Stamping",
  [ev]: "OCSP Signing",
  [Yl]: "Signed Data"
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
Kn.algorithmSerializer = Pv;
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
    return e instanceof Xn ? zo(e.rawData, this.rawData) : !1;
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
class Rr extends Xn {
  constructor(...e) {
    let t;
    W.isBufferSource(e[0]) ? t = W.toArrayBuffer(e[0]) : t = q.serialize(new Fr({
      extnID: e[0],
      critical: e[1],
      extnValue: new nt(W.toArrayBuffer(e[2]))
    })), super(t, Fr);
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
    return e[rt.NAME] === Rr.NAME && (e[rt.NAME] = On.toString(this.type)), e;
  }
}
var c0;
class $n {
  static isCryptoKeyPair(e) {
    return e && e.privateKey && e.publicKey;
  }
  static isCryptoKey(e) {
    return e && e.usages && e.type && e.algorithm && e.extractable !== void 0;
  }
  constructor() {
    this.items = /* @__PURE__ */ new Map(), this[c0] = "CryptoProvider", typeof self < "u" && typeof crypto < "u" ? this.set($n.DEFAULT, crypto) : typeof global < "u" && global.crypto && global.crypto.subtle && this.set($n.DEFAULT, global.crypto);
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
c0 = Symbol.toStringTag;
$n.DEFAULT = "default";
const Zt = new $n(), jv = /^[0-2](?:\.[1-9][0-9]*)+$/;
function Rv(r) {
  return new RegExp(jv).test(r);
}
class l0 {
  constructor(e = {}) {
    this.items = {};
    for (const t in e)
      this.register(t, e[t]);
  }
  get(e) {
    return this.items[e] || null;
  }
  findId(e) {
    return Rv(e) ? e : this.get(e);
  }
  register(e, t) {
    this.items[e] = t, this.items[t] = e;
  }
}
const mr = new l0();
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
function Uv(r, e) {
  return `\\${fe.ToHex(fe.FromUtf8String(e)).toUpperCase()}`;
}
function Dv(r) {
  return r.replace(/([,+"\\<>;])/g, "\\$1").replace(/^([ #])/, "\\$1").replace(/([ ]$)/, "\\$1").replace(/([\r\n\t])/, Uv);
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
    this.extraNames = new l0(), this.asn = new Ht();
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
      const n = this.getName(t.type) || t.type, i = t.value.anyValue ? `#${fe.ToHex(t.value.anyValue)}` : Dv(t.value.toString());
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
      s === "+" ? t[t.length - 1].push(m) : t.push(new Hi([m])), s = h;
    }
    return t;
  }
  fromJSON(e) {
    const t = new Ht();
    for (const n of e) {
      const i = new Hi();
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
    const n = new ac({ type: e });
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
const u0 = "Cannot initialize GeneralName from ASN.1 data.", ed = `${u0} Unsupported string format in use.`, $v = `${u0} Value doesn't match to GUID regular expression.`, td = /^([0-9a-f]{8})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{12})$/i, rd = "1.3.6.1.4.1.311.25.1", nd = "1.3.6.1.4.1.311.20.2.3", zc = "dns", Kc = "dn", qc = "email", Zc = "ip", Wc = "url", Yc = "guid", Jc = "upn", jo = "id";
class Mn extends Xn {
  constructor(...e) {
    let t;
    if (e.length === 2)
      switch (e[0]) {
        case Kc: {
          const n = new Fn(e[1]).toArrayBuffer(), i = q.parse(n, Ht);
          t = new De({ directoryName: i });
          break;
        }
        case zc:
          t = new De({ dNSName: e[1] });
          break;
        case qc:
          t = new De({ rfc822Name: e[1] });
          break;
        case Yc: {
          const n = new RegExp(td, "i").exec(e[1]);
          if (!n)
            throw new Error("Cannot parse GUID value. Value doesn't match to regular expression");
          const i = n.slice(1).map((s, o) => o < 3 ? fe.ToHex(new Uint8Array(fe.FromHex(s)).reverse()) : s).join("");
          t = new De({
            otherName: new Ms({
              typeId: rd,
              value: q.serialize(new nt(fe.FromHex(i)))
            })
          });
          break;
        }
        case Zc:
          t = new De({ iPAddress: e[1] });
          break;
        case jo:
          t = new De({ registeredID: e[1] });
          break;
        case Jc: {
          t = new De({
            otherName: new Ms({
              typeId: nd,
              value: q.serialize(Cp.toASN(e[1]))
            })
          });
          break;
        }
        case Wc:
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
      this.type = zc, this.value = e.dNSName;
    else if (e.rfc822Name != null)
      this.type = qc, this.value = e.rfc822Name;
    else if (e.iPAddress != null)
      this.type = Zc, this.value = e.iPAddress;
    else if (e.uniformResourceIdentifier != null)
      this.type = Wc, this.value = e.uniformResourceIdentifier;
    else if (e.registeredID != null)
      this.type = jo, this.value = e.registeredID;
    else if (e.directoryName != null)
      this.type = Kc, this.value = new Fn(e.directoryName).toString();
    else if (e.otherName != null)
      if (e.otherName.typeId === rd) {
        this.type = Yc;
        const t = q.parse(e.otherName.value, nt), n = new RegExp(td, "i").exec(fe.ToHex(t));
        if (!n)
          throw new Error($v);
        this.value = n.slice(1).map((i, s) => s < 3 ? fe.ToHex(new Uint8Array(fe.FromHex(i)).reverse()) : i).join("-");
      } else if (e.otherName.typeId === nd)
        this.type = Jc, this.value = q.parse(e.otherName.value, Xt).toString();
      else
        throw new Error(ed);
    else
      throw new Error(ed);
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
      case Kc:
      case zc:
      case Yc:
      case Zc:
      case jo:
      case Jc:
      case Wc:
        e = this.type.toUpperCase();
        break;
      case qc:
        e = "Email";
        break;
      default:
        throw new Error("Unsupported GeneralName type");
    }
    let t = this.value;
    return this.type === jo && (t = On.toString(t)), new rt(e, void 0, t);
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
const Rs = "-{5}", Zs = "\\n", Mv = `[^${Zs}]+`, Vv = `${Rs}BEGIN (${Mv}(?=${Rs}))${Rs}`, Lv = `${Rs}END \\1${Rs}`, Xi = "\\n", Hv = `[^:${Zs}]+`, Fv = `(?:[^${Zs}]+${Xi}(?: +[^${Zs}]+${Xi})*)`, Gv = "[a-zA-Z0-9=+/]+", zv = `(?:${Gv}${Xi})+`, id = `${Vv}${Xi}(?:((?:${Hv}: ${Fv})+))?${Xi}?(${zv})${Lv}`;
class gr {
  static isPem(e) {
    return typeof e == "string" && new RegExp(id, "g").test(e);
  }
  static decodeWithHeaders(e) {
    e = e.replace(/\r/g, "");
    const t = new RegExp(id, "g"), n = [];
    let i = null;
    for (; i = t.exec(e); ) {
      const s = i[3].replace(new RegExp(`[${Zs}]+`, "g"), ""), o = {
        type: i[1],
        headers: [],
        rawData: fe.FromBase64(s)
      }, c = i[2];
      if (c) {
        const u = c.split(new RegExp(Xi, "g"));
        let h = null;
        for (const m of u) {
          const [x, z] = m.split(/:(.*)/);
          if (z === void 0) {
            if (!h)
              throw new Error("Cannot parse PEM string. Incorrect header value");
            h.value += x.trim();
          } else
            h && o.headers.push(h), h = { key: x, value: z.trim() };
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
class Gr extends Xn {
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
    Gr.isAsnEncoded(e[0]) ? super(Gr.toArrayBuffer(e[0]), e[1]) : super(e[0]);
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
class on extends Gr {
  static async create(e, t = Zt.get()) {
    if (e instanceof on)
      return e;
    if ($n.isCryptoKey(e)) {
      if (e.type !== "public")
        throw new TypeError("Public key is required");
      const n = await t.subtle.exportKey("spki", e);
      return new on(n);
    } else {
      if (e.publicKey)
        return e.publicKey;
      if (W.isBufferSource(e))
        return new on(e);
      throw new TypeError("Unsupported PublicKeyType");
    }
  }
  constructor(e) {
    Gr.isAsnEncoded(e) ? super(e, nn) : super(e), this.tag = gr.PublicKeyTag;
  }
  async export(...e) {
    let t, n = ["verify"], i = { hash: "SHA-256", ...this.algorithm };
    e.length > 1 ? (i = e[0] || i, n = e[1] || n, t = e[2] || Zt.get()) : t = e[0] || Zt.get();
    let s = this.rawData;
    const o = q.parse(this.rawData, nn);
    return o.algorithm.algorithm === js && (s = Kv(o, s)), t.subtle.importKey("spki", s, i, !0, n);
  }
  onInit(e) {
    const t = lr.resolve(Ji), n = this.algorithm = t.toWebAlgorithm(e.algorithm);
    switch (e.algorithm.algorithm) {
      case vi: {
        const i = q.parse(e.subjectPublicKey, vf), s = W.toUint8Array(i.modulus);
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
    const i = q.parse(this.rawData, nn);
    return await t.subtle.digest(n, i.subjectPublicKey);
  }
  toTextObject() {
    const e = this.toTextObjectEmpty(), t = q.parse(this.rawData, nn);
    switch (e.Algorithm = Kn.serializeAlgorithm(t.algorithm), t.algorithm.algorithm) {
      case Fs:
        e["EC Point"] = t.subjectPublicKey;
        break;
      case vi:
      default:
        e["Raw Data"] = t.subjectPublicKey;
    }
    return e;
  }
}
function Kv(r, e) {
  return r.algorithm = new ne({
    algorithm: vi,
    parameters: null
  }), e = q.serialize(r), e;
}
class Ws extends Rr {
  static async create(e, t = !1, n = Zt.get()) {
    if ("name" in e && "serialNumber" in e)
      return new Ws(e, t);
    const s = await (await on.create(e, n)).getKeyIdentifier(n);
    return new Ws(fe.ToHex(s), t);
  }
  constructor(...e) {
    if (W.isBufferSource(e[0]))
      super(e[0]);
    else if (typeof e[0] == "string") {
      const t = new ii({ keyIdentifier: new Wu(fe.FromHex(e[0])) });
      super(Wo, e[1], q.serialize(t));
    } else {
      const t = e[0], n = t.name instanceof qs ? q.parse(t.name.rawData, cr) : t.name, i = new ii({
        authorityCertIssuer: n,
        authorityCertSerialNumber: fe.FromHex(t.serialNumber)
      });
      super(Wo, e[1], q.serialize(i));
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
class f0 extends Rr {
  constructor(...e) {
    if (W.isBufferSource(e[0])) {
      super(e[0]);
      const t = q.parse(this.value, Yo);
      this.ca = t.cA, this.pathLength = t.pathLenConstraint;
    } else {
      const t = new Yo({
        cA: e[0],
        pathLenConstraint: e[1]
      });
      super(Tp, e[2], q.serialize(t)), this.ca = e[0], this.pathLength = e[1];
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return this.ca && (e.CA = this.ca), this.pathLength !== void 0 && (e["Path Length"] = this.pathLength), e;
  }
}
f0.NAME = "Basic Constraints";
var sd;
(function(r) {
  r.serverAuth = "1.3.6.1.5.5.7.3.1", r.clientAuth = "1.3.6.1.5.5.7.3.2", r.codeSigning = "1.3.6.1.5.5.7.3.3", r.emailProtection = "1.3.6.1.5.5.7.3.4", r.timeStamping = "1.3.6.1.5.5.7.3.8", r.ocspSigning = "1.3.6.1.5.5.7.3.9";
})(sd || (sd = {}));
class h0 extends Rr {
  constructor(...e) {
    if (W.isBufferSource(e[0])) {
      super(e[0]);
      const t = q.parse(this.value, ea);
      this.usages = t.map((n) => n);
    } else {
      const t = new ea(e[0]);
      super(jp, e[1], q.serialize(t)), this.usages = e[0];
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return e[""] = this.usages.map((t) => On.toString(t)).join(", "), e;
  }
}
h0.NAME = "Extended Key Usages";
var od;
(function(r) {
  r[r.digitalSignature = 1] = "digitalSignature", r[r.nonRepudiation = 2] = "nonRepudiation", r[r.keyEncipherment = 4] = "keyEncipherment", r[r.dataEncipherment = 8] = "dataEncipherment", r[r.keyAgreement = 16] = "keyAgreement", r[r.keyCertSign = 32] = "keyCertSign", r[r.cRLSign = 64] = "cRLSign", r[r.encipherOnly = 128] = "encipherOnly", r[r.decipherOnly = 256] = "decipherOnly";
})(od || (od = {}));
class d0 extends Rr {
  constructor(...e) {
    if (W.isBufferSource(e[0])) {
      super(e[0]);
      const t = q.parse(this.value, Gc);
      this.usages = t.toNumber();
    } else {
      const t = new Gc(e[0]);
      super(Rp, e[1], q.serialize(t)), this.usages = e[0];
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue(), t = q.parse(this.value, Gc);
    return e[""] = t.toJSON().join(", "), e;
  }
}
d0.NAME = "Key Usages";
class Pc extends Rr {
  static async create(e, t = !1, n = Zt.get()) {
    const s = await (await on.create(e, n)).getKeyIdentifier(n);
    return new Pc(fe.ToHex(s), t);
  }
  constructor(...e) {
    if (W.isBufferSource(e[0])) {
      super(e[0]);
      const t = q.parse(this.value, Hn);
      this.keyId = fe.ToHex(t);
    } else {
      const t = typeof e[0] == "string" ? fe.FromHex(e[0]) : e[0], n = new Hn(t);
      super(tf, e[1], q.serialize(n)), this.keyId = fe.ToHex(t);
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue(), t = q.parse(this.value, Hn);
    return e[""] = t, e;
  }
}
Pc.NAME = "Subject Key Identifier";
class p0 extends Rr {
  constructor(...e) {
    W.isBufferSource(e[0]) ? super(e[0]) : super(ef, e[1], new qs(e[0] || []).rawData);
  }
  onInit(e) {
    super.onInit(e);
    const t = q.parse(e.extnValue, Tl);
    this.names = new qs(t);
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue(), t = this.names.toTextObject();
    for (const n in t)
      e[n] = t[n];
    return e;
  }
}
p0.NAME = "Subject Alternative Name";
class Ur {
  static register(e, t) {
    this.items.set(e, t);
  }
  static create(e) {
    const t = new Rr(e), n = this.items.get(t.type);
    return n ? new n(e) : t;
  }
}
Ur.items = /* @__PURE__ */ new Map();
class y0 extends Rr {
  constructor(...e) {
    var t;
    if (W.isBufferSource(e[0])) {
      super(e[0]);
      const n = q.parse(this.value, Xo);
      this.policies = n.map((i) => i.policyIdentifier);
    } else {
      const n = e[0], i = (t = e[1]) !== null && t !== void 0 ? t : !1, s = new Xo(n.map((o) => new lc({
        policyIdentifier: o
      })));
      super(Np, i, q.serialize(s)), this.policies = n;
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return e.Policy = this.policies.map((t) => new rt("", {}, On.toString(t))), e;
  }
}
y0.NAME = "Certificate Policies";
Ur.register(Np, y0);
class g0 extends Rr {
  constructor(...e) {
    var t;
    if (W.isBufferSource(e[0]))
      super(e[0]);
    else if (Array.isArray(e[0]) && typeof e[0][0] == "string") {
      const i = e[0].map((o) => new os({
        distributionPoint: new hi({
          fullName: [new De({ uniformResourceIdentifier: o })]
        })
      })), s = new $i(i);
      super(xl, e[1], q.serialize(s));
    } else {
      const n = new $i(e[0]);
      super(xl, e[1], q.serialize(n));
    }
    (t = this.distributionPoints) !== null && t !== void 0 || (this.distributionPoints = []);
  }
  onInit(e) {
    super.onInit(e);
    const t = q.parse(e.extnValue, $i);
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
g0.NAME = "CRL Distribution Points";
class v0 extends Rr {
  constructor(...e) {
    var t, n, i, s;
    if (W.isBufferSource(e[0]))
      super(e[0]);
    else if (e[0] instanceof Ri) {
      const o = new Ri(e[0]);
      super(gl, e[1], q.serialize(o));
    } else {
      const o = e[0], c = new Ri();
      Uo(c, o, Hf, "ocsp"), Uo(c, o, Ff, "caIssuers"), Uo(c, o, Gf, "timeStamping"), Uo(c, o, zf, "caRepository"), super(gl, e[1], q.serialize(c));
    }
    (t = this.ocsp) !== null && t !== void 0 || (this.ocsp = []), (n = this.caIssuers) !== null && n !== void 0 || (this.caIssuers = []), (i = this.timeStamping) !== null && i !== void 0 || (this.timeStamping = []), (s = this.caRepository) !== null && s !== void 0 || (this.caRepository = []);
  }
  onInit(e) {
    super.onInit(e), this.ocsp = [], this.caIssuers = [], this.timeStamping = [], this.caRepository = [], q.parse(e.extnValue, Ri).forEach((n) => {
      switch (n.accessMethod) {
        case Hf:
          this.ocsp.push(new Mn(n.accessLocation));
          break;
        case Ff:
          this.caIssuers.push(new Mn(n.accessLocation));
          break;
        case Gf:
          this.timeStamping.push(new Mn(n.accessLocation));
          break;
        case zf:
          this.caRepository.push(new Mn(n.accessLocation));
          break;
      }
    });
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return this.ocsp.length && Ro(e, "OCSP", this.ocsp), this.caIssuers.length && Ro(e, "CA Issuers", this.caIssuers), this.timeStamping.length && Ro(e, "Time Stamping", this.timeStamping), this.caRepository.length && Ro(e, "CA Repository", this.caRepository), e;
  }
}
v0.NAME = "Authority Info Access";
function Ro(r, e, t) {
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
function Uo(r, e, t, n) {
  const i = e[n];
  i && (Array.isArray(i) ? i : [i]).forEach((o) => {
    typeof o == "string" && (o = new Mn("url", o)), r.push(new vo({
      accessMethod: t,
      accessLocation: q.parse(o.rawData, De)
    }));
  });
}
class fs extends Xn {
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
    return e[rt.NAME] === fs.NAME && (e[rt.NAME] = On.toString(this.type)), e;
  }
}
fs.NAME = "Attribute";
class m0 extends fs {
  constructor(...e) {
    var t;
    if (W.isBufferSource(e[0]))
      super(e[0]);
    else {
      const n = new Sa({
        printableString: e[0]
      });
      super(s0, [q.serialize(n)]);
    }
    (t = this.password) !== null && t !== void 0 || (this.password = "");
  }
  onInit(e) {
    if (super.onInit(e), this.values[0]) {
      const t = q.parse(this.values[0], Sa);
      this.password = t.toString();
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return e[rt.VALUE] = this.password, e;
  }
}
m0.NAME = "Challenge Password";
class xf extends fs {
  constructor(...e) {
    var t;
    if (W.isBufferSource(e[0]))
      super(e[0]);
    else {
      const n = e[0], i = new di();
      for (const s of n)
        i.push(q.parse(s.rawData, Fr));
      super(bf, [q.serialize(i)]);
    }
    (t = this.items) !== null && t !== void 0 || (this.items = []);
  }
  onInit(e) {
    if (super.onInit(e), this.values[0]) {
      const t = q.parse(this.values[0], di);
      this.items = t.map((n) => Ur.create(q.serialize(n)));
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue(), t = this.items.map((n) => n.toTextObject());
    for (const n of t)
      e[n[rt.NAME]] = n;
    return e;
  }
}
xf.NAME = "Extensions";
class jc {
  static register(e, t) {
    this.items.set(e, t);
  }
  static create(e) {
    const t = new fs(e), n = this.items.get(t.type);
    return n ? new n(e) : t;
  }
}
jc.items = /* @__PURE__ */ new Map();
const Rc = "crypto.signatureFormatter";
class qv {
  toAsnSignature(e, t) {
    return W.toArrayBuffer(t);
  }
  toWebSignature(e, t) {
    return W.toArrayBuffer(t);
  }
}
var Ho;
let Au = Ho = class {
  static createPssParams(e, t) {
    const n = Ho.getHashAlgorithm(e);
    return n ? new wi({
      hashAlgorithm: n,
      maskGenAlgorithm: new ne({
        algorithm: _c,
        parameters: q.serialize(n)
      }),
      saltLength: t
    }) : null;
  }
  static getHashAlgorithm(e) {
    const t = lr.resolve(Ji);
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
              return new ne({ algorithm: da, parameters: null });
            case "sha-256":
              return new ne({ algorithm: Ql, parameters: null });
            case "sha-384":
              return new ne({ algorithm: pa, parameters: null });
            case "sha-512":
              return new ne({ algorithm: ya, parameters: null });
          }
        } else
          return new ne({ algorithm: vi, parameters: null });
        break;
      case "rsa-pss":
        if ("hash" in e) {
          if (!("saltLength" in e && typeof e.saltLength == "number"))
            throw new Error("Cannot get 'saltLength' from 'alg' argument");
          const t = Ho.createPssParams(e.hash, e.saltLength);
          if (!t)
            throw new Error("Cannot create PSS parameters");
          return new ne({ algorithm: js, parameters: q.serialize(t) });
        } else
          return new ne({ algorithm: js, parameters: null });
    }
    return null;
  }
  toWebAlgorithm(e) {
    switch (e.algorithm) {
      case vi:
        return { name: "RSASSA-PKCS1-v1_5" };
      case da:
        return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-1" } };
      case Ql:
        return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } };
      case pa:
        return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-384" } };
      case ya:
        return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-512" } };
      case js:
        if (e.parameters) {
          const t = q.parse(e.parameters, wi);
          return {
            name: "RSA-PSS",
            hash: lr.resolve(Ji).toWebAlgorithm(t.hashAlgorithm),
            saltLength: t.saltLength
          };
        } else
          return { name: "RSA-PSS" };
    }
    return null;
  }
};
Au = Ho = f([
  Cc()
], Au);
lr.registerSingleton(Co, Au);
let Su = class {
  toAsnAlgorithm(e) {
    switch (e.name.toLowerCase()) {
      case "sha-1":
        return new ne({ algorithm: ga });
      case "sha-256":
        return new ne({ algorithm: va });
      case "sha-384":
        return new ne({ algorithm: ma });
      case "sha-512":
        return new ne({ algorithm: wa });
    }
    return null;
  }
  toWebAlgorithm(e) {
    switch (e.algorithm) {
      case ga:
        return { name: "SHA-1" };
      case va:
        return { name: "SHA-256" };
      case ma:
        return { name: "SHA-384" };
      case wa:
        return { name: "SHA-512" };
    }
    return null;
  }
};
Su = f([
  Cc()
], Su);
lr.registerSingleton(Co, Su);
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
      const n = e.namedCurve, i = Tr.namedCurveSize.get(n) || Tr.defaultNamedCurveSize, s = new ha(), o = W.toUint8Array(t);
      return s.r = this.removePadding(o.slice(0, i), !0), s.s = this.removePadding(o.slice(i, i + i), !0), q.serialize(s);
    }
    return null;
  }
  toWebSignature(e, t) {
    if (e.name === "ECDSA") {
      const n = q.parse(t, ha), i = e.namedCurve, s = Tr.namedCurveSize.get(i) || Tr.defaultNamedCurveSize, o = this.addPadding(s, this.removePadding(n.r)), c = this.addPadding(s, this.removePadding(n.s));
      return og(o, c);
    }
    return null;
  }
}
Tr.namedCurveSize = /* @__PURE__ */ new Map();
Tr.defaultNamedCurveSize = 32;
const Xc = "1.3.101.110", ad = "1.3.101.111", Qc = "1.3.101.112", cd = "1.3.101.113";
let _u = class {
  toAsnAlgorithm(e) {
    let t = null;
    switch (e.name.toLowerCase()) {
      case "ed25519":
        t = Qc;
        break;
      case "x25519":
        t = Xc;
        break;
      case "eddsa":
        switch (e.namedCurve.toLowerCase()) {
          case "ed25519":
            t = Qc;
            break;
          case "ed448":
            t = cd;
            break;
        }
        break;
      case "ecdh-es":
        switch (e.namedCurve.toLowerCase()) {
          case "x25519":
            t = Xc;
            break;
          case "x448":
            t = ad;
            break;
        }
    }
    return t ? new ne({
      algorithm: t
    }) : null;
  }
  toWebAlgorithm(e) {
    switch (e.algorithm) {
      case Qc:
        return { name: "Ed25519" };
      case cd:
        return { name: "EdDSA", namedCurve: "Ed448" };
      case Xc:
        return { name: "X25519" };
      case ad:
        return { name: "ECDH-ES", namedCurve: "X448" };
    }
    return null;
  }
};
_u = f([
  Cc()
], _u);
lr.registerSingleton(Co, _u);
class Zv extends Gr {
  constructor(e) {
    Gr.isAsnEncoded(e) ? super(e, zs) : super(e), this.tag = gr.CertificateRequestTag;
  }
  onInit(e) {
    this.tbs = q.serialize(e.certificationRequestInfo), this.publicKey = new on(e.certificationRequestInfo.subjectPKInfo);
    const t = lr.resolve(Ji);
    this.signatureAlgorithm = t.toWebAlgorithm(e.signatureAlgorithm), this.signature = e.signature, this.attributes = e.certificationRequestInfo.attributes.map((i) => jc.create(q.serialize(i)));
    const n = this.getAttribute(bf);
    this.extensions = [], n instanceof xf && (this.extensions = n.items), this.subjectName = new Fn(e.certificationRequestInfo.subject), this.subject = this.subjectName.toString();
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
    const t = { ...this.publicKey.algorithm, ...this.signatureAlgorithm }, n = await this.publicKey.export(t, ["verify"], e), i = lr.resolveAll(Rc).reverse();
    let s = null;
    for (const c of i)
      if (s = c.toWebSignature(t, this.signature), s)
        break;
    if (!s)
      throw Error("Cannot convert WebCrypto signature value to ASN.1 format");
    return await e.subtle.verify(this.signatureAlgorithm, n, s, this.tbs);
  }
  toTextObject() {
    const e = this.toTextObjectEmpty(), t = q.parse(this.rawData, zs), n = t.certificationRequestInfo, i = new rt("", {
      Version: `${Fi[n.version]} (${n.version})`,
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
Zv.NAME = "PKCS#10 Certificate Request";
class bi extends Gr {
  constructor(e) {
    Gr.isAsnEncoded(e) ? super(e, pi) : super(e), this.tag = gr.CertificateTag;
  }
  onInit(e) {
    const t = e.tbsCertificate;
    this.tbs = q.serialize(t), this.serialNumber = fe.ToHex(t.serialNumber), this.subjectName = new Fn(t.subject), this.subject = new Fn(t.subject).toString(), this.issuerName = new Fn(t.issuer), this.issuer = this.issuerName.toString();
    const n = lr.resolve(Ji);
    this.signatureAlgorithm = n.toWebAlgorithm(e.signatureAlgorithm), this.signature = e.signatureValue;
    const i = t.validity.notBefore.utcTime || t.validity.notBefore.generalTime;
    if (!i)
      throw new Error("Cannot get 'notBefore' value");
    this.notBefore = i;
    const s = t.validity.notAfter.utcTime || t.validity.notAfter.generalTime;
    if (!s)
      throw new Error("Cannot get 'notAfter' value");
    this.notAfter = s, this.extensions = [], t.extensions && (this.extensions = t.extensions.map((o) => Ur.create(q.serialize(o)))), this.publicKey = new on(t.subjectPublicKeyInfo);
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
      else if (s instanceof on)
        n = { ...s.algorithm, ...this.signatureAlgorithm }, i = await s.export(n, ["verify"], t);
      else if (W.isBufferSource(s)) {
        const h = new on(s);
        n = { ...h.algorithm, ...this.signatureAlgorithm }, i = await h.export(n, ["verify"], t);
      } else
        n = { ...s.algorithm, ...this.signatureAlgorithm }, i = s;
    } catch {
      return !1;
    }
    const o = lr.resolveAll(Rc).reverse();
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
    const e = this.toTextObjectEmpty(), t = q.parse(this.rawData, pi), n = t.tbsCertificate, i = new rt("", {
      Version: `${Fi[n.version]} (${n.version})`,
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
bi.NAME = "Certificate";
class Wv extends Array {
  constructor(e) {
    if (super(), Gr.isAsnEncoded(e))
      this.import(e);
    else if (e instanceof bi)
      this.push(e);
    else if (Array.isArray(e))
      for (const t of e)
        this.push(t);
  }
  export(e) {
    const t = new An();
    t.version = 1, t.encapContentInfo.eContentType = tv, t.encapContentInfo.eContent = new qi({
      single: new nt()
    }), t.certificates = new Ls(this.map((s) => new yi({
      certificate: q.parse(s.rawData, pi)
    })));
    const n = new xn({
      contentType: Yl,
      content: q.serialize(t)
    }), i = q.serialize(n);
    return e === "raw" ? i : this.toString(e);
  }
  import(e) {
    const t = Gr.toArrayBuffer(e), n = q.parse(t, xn);
    if (n.contentType !== Yl)
      throw new TypeError("Cannot parse CMS package. Incoming data is not a SignedData object.");
    const i = q.parse(n.content, An);
    this.clear();
    for (const s of i.certificates || [])
      s.certificate && this.push(new bi(s.certificate));
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
        Version: `${cn[t.version]} (${t.version})`,
        Certificates: new rt("", { Certificate: this.map((i) => i.toTextObject()) })
      })
    });
  }
}
class Yv {
  constructor(e = {}) {
    this.certificates = [], e.certificates && (this.certificates = e.certificates);
  }
  async build(e, t = Zt.get()) {
    const n = new Wv(e);
    let i = e;
    for (; i = await this.findIssuer(i, t); ) {
      const s = await i.getThumbprint(t);
      for (const o of n) {
        const c = await o.getThumbprint(t);
        if (zo(s, c))
          throw new Error("Cannot build a certificate chain. Circular dependency.");
      }
      n.push(i);
    }
    return n;
  }
  async findIssuer(e, t = Zt.get()) {
    if (!await e.isSelfSigned(t)) {
      const n = e.getExtension(Wo);
      for (const i of this.certificates)
        if (i.subject === e.issuer) {
          if (n) {
            if (n.keyId) {
              const s = i.getExtension(tf);
              if (s && s.keyId !== n.keyId)
                continue;
            } else if (n.certId) {
              const s = i.getExtension(ef);
              if (s && !(n.certId.serialNumber === i.serialNumber && zo(q.serialize(n.certId.name), q.serialize(s))))
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
var ld;
(function(r) {
  r[r.unspecified = 0] = "unspecified", r[r.keyCompromise = 1] = "keyCompromise", r[r.cACompromise = 2] = "cACompromise", r[r.affiliationChanged = 3] = "affiliationChanged", r[r.superseded = 4] = "superseded", r[r.cessationOfOperation = 5] = "cessationOfOperation", r[r.certificateHold = 6] = "certificateHold", r[r.removeFromCRL = 8] = "removeFromCRL", r[r.privilegeWithdrawn = 9] = "privilegeWithdrawn", r[r.aACompromise = 10] = "aACompromise";
})(ld || (ld = {}));
Ur.register(Tp, f0);
Ur.register(jp, h0);
Ur.register(Rp, d0);
Ur.register(tf, Pc);
Ur.register(Wo, Ws);
Ur.register(ef, p0);
Ur.register(xl, g0);
Ur.register(gl, v0);
jc.register(s0, m0);
jc.register(bf, xf);
lr.registerSingleton(Rc, qv);
lr.registerSingleton(Rc, Tr);
Tr.namedCurveSize.set("P-256", 32);
Tr.namedCurveSize.set("K-256", 32);
Tr.namedCurveSize.set("P-384", 48);
Tr.namedCurveSize.set("P-521", 66);
const ge = { POS_INT: 0, NEG_INT: 1, BYTE_STRING: 2, UTF8_STRING: 3, ARRAY: 4, MAP: 5, TAG: 6, SIMPLE_FLOAT: 7 }, _t = { DATE_STRING: 0, DATE_EPOCH: 1, POS_BIGINT: 2, NEG_BIGINT: 3, DECIMAL_FRAC: 4, BIGFLOAT: 5, BASE64URL_EXPECTED: 21, BASE64_EXPECTED: 22, BASE16_EXPECTED: 23, CBOR: 24, URI: 32, BASE64URL: 33, BASE64: 34, MIME: 36, SET: 258, JSON: 262, REGEXP: 21066, SELF_DESCRIBED: 55799, INVALID_16: 65535, INVALID_32: 4294967295, INVALID_64: 0xffffffffffffffffn }, wt = { ZERO: 0, ONE: 24, TWO: 25, FOUR: 26, EIGHT: 27, INDEFINITE: 31 }, Vn = { FALSE: 20, TRUE: 21, NULL: 22, UNDEFINED: 23 };
var Is;
let Er = (Is = class {
}, Fe(Is, "BREAK", Symbol.for("github.com/hildjj/cbor2/break")), Fe(Is, "ENCODED", Symbol.for("github.com/hildjj/cbor2/cbor-encoded")), Fe(Is, "LENGTH", Symbol.for("github.com/hildjj/cbor2/length")), Is);
const Ea = { MIN: -(2n ** 63n), MAX: 2n ** 64n - 1n };
var mn, en;
let We = (mn = class {
  constructor(e, t = void 0) {
    Fe(this, "tag");
    Fe(this, "contents");
    this.tag = e, this.contents = t;
  }
  get noChildren() {
    var e;
    return !!((e = $(mn, en).get(this.tag)) != null && e.noChildren);
  }
  static registerDecoder(e, t, n) {
    const i = $(this, en).get(e);
    return $(this, en).set(e, t), i && ("comment" in t || (t.comment = i.comment), "noChildren" in t || (t.noChildren = i.noChildren)), n && !t.comment && (t.comment = () => `(${n})`), i;
  }
  static clearDecoder(e) {
    const t = $(this, en).get(e);
    return $(this, en).delete(e), t;
  }
  *[Symbol.iterator]() {
    yield this.contents;
  }
  push(e) {
    return this.contents = e, 1;
  }
  decode(e) {
    const t = $(mn, en).get(this.tag);
    return t ? t(this, e) : this;
  }
  comment(e, t) {
    const n = $(mn, en).get(this.tag);
    if (n != null && n.comment) return n.comment(this, e, t);
  }
  toCBOR() {
    return [this.tag, this.contents];
  }
  [Symbol.for("nodejs.util.inspect.custom")](e, t, n) {
    return `${this.tag}(${n(this.contents, t)})`;
  }
}, en = new WeakMap(), rr(mn, en, /* @__PURE__ */ new Map()), mn);
function Ia(r) {
  if (r != null && typeof r == "object") return r[Er.ENCODED];
}
function Jv(r) {
  if (r != null && typeof r == "object") return r[Er.LENGTH];
}
function Ys(r, e) {
  Object.defineProperty(r, Er.ENCODED, { configurable: !0, enumerable: !1, value: e });
}
function ks(r, e) {
  const t = Object(r);
  return Ys(t, e), t;
}
function w0(r) {
  let e = Math.ceil(r.length / 2);
  const t = new Uint8Array(e);
  e--;
  for (let n = r.length, i = n - 2; n >= 0; n = i, i -= 2, e--) t[e] = parseInt(r.substring(i, n), 16);
  return t;
}
function Lr(r) {
  return r.reduce((e, t) => e + t.toString(16).padStart(2, "0"), "");
}
function Xv(r) {
  const e = r.reduce((i, s) => i + s.length, 0), t = new Uint8Array(e);
  let n = 0;
  for (const i of r) t.set(i, n), n += i.length;
  return t;
}
function Af(r) {
  const e = atob(r);
  return Uint8Array.from(e, (t) => t.codePointAt(0));
}
const Qv = { "-": "+", _: "/" };
function em(r) {
  const e = r.replace(/[_-]/g, (t) => Qv[t]);
  return Af(e.padEnd(Math.ceil(e.length / 4) * 4, "="));
}
function tm() {
  const r = new Uint8Array(4), e = new Uint32Array(r.buffer);
  return !((e[0] = 1) & r[0]);
}
function ud(r) {
  var t;
  let e = "";
  for (const n of r) {
    const i = (t = n.codePointAt(0)) == null ? void 0 : t.toString(16).padStart(4, "0");
    e && (e += ", "), e += `U+${i}`;
  }
  return e;
}
function b0(r, e) {
  const [t, n, i] = r, [s, o, c] = e, u = Math.min(i.length, c.length);
  for (let h = 0; h < u; h++) {
    const m = i[h] - c[h];
    if (m !== 0) return m;
  }
  return 0;
}
var Un, Kt, pr, Mt, Dn, et, ei, Fo, Eu, Xr, Qr;
const La = class La {
  constructor(e = {}) {
    rr(this, et);
    rr(this, Un);
    rr(this, Kt, []);
    rr(this, pr, null);
    rr(this, Mt, 0);
    rr(this, Dn, 0);
    if (It(this, Un, { ...La.defaultOptions, ...e }), $(this, Un).chunkSize < 8) throw new RangeError(`Expected size >= 8, got ${$(this, Un).chunkSize}`);
    Ue(this, et, ei).call(this);
  }
  get length() {
    return $(this, Dn);
  }
  read() {
    Ue(this, et, Fo).call(this);
    const e = new Uint8Array($(this, Dn));
    let t = 0;
    for (const n of $(this, Kt)) e.set(n, t), t += n.length;
    return Ue(this, et, ei).call(this), e;
  }
  write(e) {
    const t = e.length;
    t > Ue(this, et, Eu).call(this) ? (Ue(this, et, Fo).call(this), t > $(this, Un).chunkSize ? ($(this, Kt).push(e), Ue(this, et, ei).call(this)) : (Ue(this, et, ei).call(this), $(this, Kt)[$(this, Kt).length - 1].set(e), It(this, Mt, t))) : ($(this, Kt)[$(this, Kt).length - 1].set(e, $(this, Mt)), It(this, Mt, $(this, Mt) + t)), It(this, Dn, $(this, Dn) + t);
  }
  writeUint8(e) {
    Ue(this, et, Xr).call(this, 1), $(this, pr).setUint8($(this, Mt), e), Ue(this, et, Qr).call(this, 1);
  }
  writeUint16(e, t = !1) {
    Ue(this, et, Xr).call(this, 2), $(this, pr).setUint16($(this, Mt), e, t), Ue(this, et, Qr).call(this, 2);
  }
  writeUint32(e, t = !1) {
    Ue(this, et, Xr).call(this, 4), $(this, pr).setUint32($(this, Mt), e, t), Ue(this, et, Qr).call(this, 4);
  }
  writeBigUint64(e, t = !1) {
    Ue(this, et, Xr).call(this, 8), $(this, pr).setBigUint64($(this, Mt), e, t), Ue(this, et, Qr).call(this, 8);
  }
  writeInt16(e, t = !1) {
    Ue(this, et, Xr).call(this, 2), $(this, pr).setInt16($(this, Mt), e, t), Ue(this, et, Qr).call(this, 2);
  }
  writeInt32(e, t = !1) {
    Ue(this, et, Xr).call(this, 4), $(this, pr).setInt32($(this, Mt), e, t), Ue(this, et, Qr).call(this, 4);
  }
  writeBigInt64(e, t = !1) {
    Ue(this, et, Xr).call(this, 8), $(this, pr).setBigInt64($(this, Mt), e, t), Ue(this, et, Qr).call(this, 8);
  }
  writeFloat32(e, t = !1) {
    Ue(this, et, Xr).call(this, 4), $(this, pr).setFloat32($(this, Mt), e, t), Ue(this, et, Qr).call(this, 4);
  }
  writeFloat64(e, t = !1) {
    Ue(this, et, Xr).call(this, 8), $(this, pr).setFloat64($(this, Mt), e, t), Ue(this, et, Qr).call(this, 8);
  }
  clear() {
    It(this, Dn, 0), It(this, Kt, []), Ue(this, et, ei).call(this);
  }
};
Un = new WeakMap(), Kt = new WeakMap(), pr = new WeakMap(), Mt = new WeakMap(), Dn = new WeakMap(), et = new WeakSet(), ei = function() {
  const e = new Uint8Array($(this, Un).chunkSize);
  $(this, Kt).push(e), It(this, Mt, 0), It(this, pr, new DataView(e.buffer, e.byteOffset, e.byteLength));
}, Fo = function() {
  if ($(this, Mt) === 0) {
    $(this, Kt).pop();
    return;
  }
  const e = $(this, Kt).length - 1;
  $(this, Kt)[e] = $(this, Kt)[e].subarray(0, $(this, Mt)), It(this, Mt, 0), It(this, pr, null);
}, Eu = function() {
  const e = $(this, Kt).length - 1;
  return $(this, Kt)[e].length - $(this, Mt);
}, Xr = function(e) {
  Ue(this, et, Eu).call(this) < e && (Ue(this, et, Fo).call(this), Ue(this, et, ei).call(this));
}, Qr = function(e) {
  It(this, Mt, $(this, Mt) + e), It(this, Dn, $(this, Dn) + e);
}, Fe(La, "defaultOptions", { chunkSize: 4096 });
let ka = La;
function x0(r, e = 0, t = !1) {
  const n = r[e] & 128 ? -1 : 1, i = (r[e] & 124) >> 2, s = (r[e] & 3) << 8 | r[e + 1];
  if (i === 0) {
    if (t && s !== 0) throw new Error(`Unwanted subnormal: ${n * 5960464477539063e-23 * s}`);
    return n * 5960464477539063e-23 * s;
  } else if (i === 31) return s ? NaN : n * (1 / 0);
  return n * 2 ** (i - 25) * (1024 + s);
}
function rm(r) {
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
function nm(r) {
  if (r !== 0) {
    const e = new ArrayBuffer(8), t = new DataView(e);
    t.setFloat64(0, r, !1);
    const n = t.getBigUint64(0, !1);
    if ((n & 0x7ff0000000000000n) === 0n) return n & 0x8000000000000000n ? -0 : 0;
  }
  return r;
}
function im(r) {
  switch (r.length) {
    case 2:
      x0(r, 0, !0);
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
const fd = ge.SIMPLE_FLOAT << 5 | wt.TWO, sm = ge.SIMPLE_FLOAT << 5 | wt.FOUR, om = ge.SIMPLE_FLOAT << 5 | wt.EIGHT, am = ge.SIMPLE_FLOAT << 5 | Vn.TRUE, cm = ge.SIMPLE_FLOAT << 5 | Vn.FALSE, lm = ge.SIMPLE_FLOAT << 5 | Vn.UNDEFINED, um = ge.SIMPLE_FLOAT << 5 | Vn.NULL, fm = new TextEncoder(), hm = { ...ka.defaultOptions, avoidInts: !1, cde: !1, collapseBigInts: !0, dcbor: !1, float64: !1, flushToZero: !1, forceEndian: null, ignoreOriginalEncoding: !1, largeNegativeAsBigInt: !1, reduceUnsafeNumbers: !1, rejectBigInts: !1, rejectCustomSimples: !1, rejectDuplicateKeys: !1, rejectFloats: !1, rejectUndefined: !1, simplifyNegativeZero: !1, sortKeys: null, stringNormalization: null }, A0 = { cde: !0, ignoreOriginalEncoding: !0, sortKeys: b0 }, dm = { ...A0, dcbor: !0, largeNegativeAsBigInt: !0, reduceUnsafeNumbers: !0, rejectCustomSimples: !0, rejectDuplicateKeys: !0, rejectUndefined: !0, simplifyNegativeZero: !0, stringNormalization: "NFC" };
function S0(r) {
  const e = r < 0;
  return typeof r == "bigint" ? [e ? -r - 1n : r, e] : [e ? -r - 1 : r, e];
}
function el(r, e, t) {
  if (t.rejectFloats) throw new Error(`Attempt to encode an unwanted floating point number: ${r}`);
  if (isNaN(r)) e.writeUint8(fd), e.writeUint16(32256);
  else if (!t.float64 && Math.fround(r) === r) {
    const n = rm(r);
    n === null ? (e.writeUint8(sm), e.writeFloat32(r)) : (e.writeUint8(fd), e.writeUint16(n));
  } else e.writeUint8(om), e.writeFloat64(r);
}
function zr(r, e, t) {
  const [n, i] = S0(r);
  if (i && t) throw new TypeError(`Negative size: ${r}`);
  t ?? (t = i ? ge.NEG_INT : ge.POS_INT), t <<= 5, n < 24 ? e.writeUint8(t | n) : n <= 255 ? (e.writeUint8(t | wt.ONE), e.writeUint8(n)) : n <= 65535 ? (e.writeUint8(t | wt.TWO), e.writeUint16(n)) : n <= 4294967295 ? (e.writeUint8(t | wt.FOUR), e.writeUint32(n)) : (e.writeUint8(t | wt.EIGHT), e.writeBigUint64(BigInt(n)));
}
function Ca(r, e, t) {
  typeof r == "number" ? zr(r, e, ge.TAG) : typeof r == "object" && !t.ignoreOriginalEncoding && Er.ENCODED in r ? e.write(r[Er.ENCODED]) : r <= Number.MAX_SAFE_INTEGER ? zr(Number(r), e, ge.TAG) : (e.writeUint8(ge.TAG << 5 | wt.EIGHT), e.writeBigUint64(BigInt(r)));
}
function _0(r, e, t) {
  const [n, i] = S0(r);
  if (t.collapseBigInts && (!t.largeNegativeAsBigInt || r >= -0x8000000000000000n)) {
    if (n <= 0xffffffffn) {
      zr(Number(r), e);
      return;
    }
    if (n <= 0xffffffffffffffffn) {
      const h = (i ? ge.NEG_INT : ge.POS_INT) << 5;
      e.writeUint8(h | wt.EIGHT), e.writeBigUint64(n);
      return;
    }
  }
  if (t.rejectBigInts) throw new Error(`Attempt to encode unwanted bigint: ${r}`);
  const s = i ? _t.NEG_BIGINT : _t.POS_BIGINT, o = n.toString(16), c = o.length % 2 ? "0" : "";
  Ca(s, e, t);
  const u = w0(c + o);
  zr(u.length, e, ge.BYTE_STRING), e.write(u);
}
function pm(r, e, t) {
  t.flushToZero && (r = nm(r)), Object.is(r, -0) ? t.simplifyNegativeZero ? t.avoidInts ? el(0, e, t) : zr(0, e) : el(r, e, t) : !t.avoidInts && Number.isSafeInteger(r) ? zr(r, e) : t.reduceUnsafeNumbers && Math.floor(r) === r && r >= Ea.MIN && r <= Ea.MAX ? _0(BigInt(r), e, t) : el(r, e, t);
}
function ym(r, e, t) {
  const n = t.stringNormalization ? r.normalize(t.stringNormalization) : r, i = fm.encode(n);
  zr(i.length, e, ge.UTF8_STRING), e.write(i);
}
function gm(r, e, t) {
  const n = r;
  Sf(n, n.length, ge.ARRAY, e, t);
  for (const i of n) si(i, e, t);
}
function vm(r, e) {
  const t = r;
  zr(t.length, e, ge.BYTE_STRING), e.write(t);
}
const Iu = /* @__PURE__ */ new Map([[Array, gm], [Uint8Array, vm]]);
function Rt(r, e) {
  const t = Iu.get(r);
  return Iu.set(r, e), t;
}
function Sf(r, e, t, n, i) {
  const s = Jv(r);
  s && !i.ignoreOriginalEncoding ? n.write(s) : zr(e, n, t);
}
function mm(r, e, t) {
  if (r === null) {
    e.writeUint8(um);
    return;
  }
  if (!t.ignoreOriginalEncoding && Er.ENCODED in r) {
    e.write(r[Er.ENCODED]);
    return;
  }
  const n = Iu.get(r.constructor);
  if (n) {
    const s = n(r, e, t);
    s && ((typeof s[0] == "bigint" || isFinite(Number(s[0]))) && Ca(s[0], e, t), si(s[1], e, t));
    return;
  }
  if (typeof r.toCBOR == "function") {
    const s = r.toCBOR(e, t);
    s && ((typeof s[0] == "bigint" || isFinite(Number(s[0]))) && Ca(s[0], e, t), si(s[1], e, t));
    return;
  }
  if (typeof r.toJSON == "function") {
    si(r.toJSON(), e, t);
    return;
  }
  const i = Object.entries(r).map((s) => [s[0], s[1], Uc(s[0], t)]);
  t.sortKeys && i.sort(t.sortKeys), Sf(r, i.length, ge.MAP, e, t);
  for (const [s, o, c] of i) e.write(c), si(o, e, t);
}
function si(r, e, t) {
  switch (typeof r) {
    case "number":
      pm(r, e, t);
      break;
    case "bigint":
      _0(r, e, t);
      break;
    case "string":
      ym(r, e, t);
      break;
    case "boolean":
      e.writeUint8(r ? am : cm);
      break;
    case "undefined":
      if (t.rejectUndefined) throw new Error("Attempt to encode unwanted undefined.");
      e.writeUint8(lm);
      break;
    case "object":
      mm(r, e, t);
      break;
    case "symbol":
      throw new TypeError(`Unknown symbol: ${r.toString()}`);
    default:
      throw new TypeError(`Unknown type: ${typeof r}, ${String(r)}`);
  }
}
function Uc(r, e = {}) {
  const t = { ...hm };
  e.dcbor ? Object.assign(t, dm) : e.cde && Object.assign(t, A0), Object.assign(t, e);
  const n = new ka(t);
  return si(r, n, t), n.read();
}
var E0 = ((r) => (r[r.NEVER = -1] = "NEVER", r[r.PREFERRED = 0] = "PREFERRED", r[r.ALWAYS = 1] = "ALWAYS", r))(E0 || {});
const Nn = class Nn {
  constructor(e) {
    Fe(this, "value");
    this.value = e;
  }
  static create(e) {
    return Nn.KnownSimple.has(e) ? Nn.KnownSimple.get(e) : new Nn(e);
  }
  toCBOR(e, t) {
    if (t.rejectCustomSimples) throw new Error(`Cannot encode non-standard Simple value: ${this.value}`);
    zr(this.value, e, ge.SIMPLE_FLOAT);
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
Fe(Nn, "KnownSimple", /* @__PURE__ */ new Map([[Vn.FALSE, !1], [Vn.TRUE, !0], [Vn.NULL, null], [Vn.UNDEFINED, void 0]]));
let Js = Nn;
const wm = new TextDecoder("utf8", { fatal: !0, ignoreBOM: !0 });
var Ar, Mr, qt, kr, Wt, ti, ku, Cs;
const Ha = class Ha {
  constructor(e, t) {
    rr(this, Wt);
    rr(this, Ar);
    rr(this, Mr);
    rr(this, qt, 0);
    rr(this, kr);
    if (It(this, kr, { ...Ha.defaultOptions, ...t }), typeof e == "string") switch ($(this, kr).encoding) {
      case "hex":
        It(this, Ar, w0(e));
        break;
      case "base64":
        It(this, Ar, Af(e));
        break;
      default:
        throw new TypeError(`Encoding not implemented: "${$(this, kr).encoding}"`);
    }
    else It(this, Ar, e);
    It(this, Mr, new DataView($(this, Ar).buffer, $(this, Ar).byteOffset, $(this, Ar).byteLength));
  }
  toHere(e) {
    return $(this, Ar).subarray(e, $(this, qt));
  }
  *[Symbol.iterator]() {
    if (yield* Ue(this, Wt, ti).call(this, 0), $(this, qt) !== $(this, Ar).length) throw new Error("Extra data in input");
  }
};
Ar = new WeakMap(), Mr = new WeakMap(), qt = new WeakMap(), kr = new WeakMap(), Wt = new WeakSet(), ti = function* (e) {
  if (e++ > $(this, kr).maxDepth) throw new Error(`Maximum depth ${$(this, kr).maxDepth} exceeded`);
  const t = $(this, qt), n = $(this, Mr).getUint8(Bf(this, qt)._++), i = n >> 5, s = n & 31;
  let o = s, c = !1, u = 0;
  switch (s) {
    case wt.ONE:
      if (u = 1, o = $(this, Mr).getUint8($(this, qt)), i === ge.SIMPLE_FLOAT) {
        if (o < 32) throw new Error(`Invalid simple encoding in extra byte: ${o}`);
        c = !0;
      } else if ($(this, kr).requirePreferred && o < 24) throw new Error(`Unexpectedly long integer encoding (1) for ${o}`);
      break;
    case wt.TWO:
      if (u = 2, i === ge.SIMPLE_FLOAT) o = x0($(this, Ar), $(this, qt));
      else if (o = $(this, Mr).getUint16($(this, qt), !1), $(this, kr).requirePreferred && o <= 255) throw new Error(`Unexpectedly long integer encoding (2) for ${o}`);
      break;
    case wt.FOUR:
      if (u = 4, i === ge.SIMPLE_FLOAT) o = $(this, Mr).getFloat32($(this, qt), !1);
      else if (o = $(this, Mr).getUint32($(this, qt), !1), $(this, kr).requirePreferred && o <= 65535) throw new Error(`Unexpectedly long integer encoding (4) for ${o}`);
      break;
    case wt.EIGHT: {
      if (u = 8, i === ge.SIMPLE_FLOAT) o = $(this, Mr).getFloat64($(this, qt), !1);
      else if (o = $(this, Mr).getBigUint64($(this, qt), !1), o <= Number.MAX_SAFE_INTEGER && (o = Number(o)), $(this, kr).requirePreferred && o <= 4294967295) throw new Error(`Unexpectedly long integer encoding (8) for ${o}`);
      break;
    }
    case 28:
    case 29:
    case 30:
      throw new Error(`Additional info not implemented: ${s}`);
    case wt.INDEFINITE:
      switch (i) {
        case ge.POS_INT:
        case ge.NEG_INT:
        case ge.TAG:
          throw new Error(`Invalid indefinite encoding for MT ${i}`);
        case ge.SIMPLE_FLOAT:
          yield [i, s, Er.BREAK, t, 0];
          return;
      }
      o = 1 / 0;
      break;
    default:
      c = !0;
  }
  switch (It(this, qt, $(this, qt) + u), i) {
    case ge.POS_INT:
      yield [i, s, o, t, u];
      break;
    case ge.NEG_INT:
      yield [i, s, typeof o == "bigint" ? -1n - o : -1 - Number(o), t, u];
      break;
    case ge.BYTE_STRING:
      o === 1 / 0 ? yield* Ue(this, Wt, Cs).call(this, i, e, t) : yield [i, s, Ue(this, Wt, ku).call(this, o), t, o];
      break;
    case ge.UTF8_STRING:
      o === 1 / 0 ? yield* Ue(this, Wt, Cs).call(this, i, e, t) : yield [i, s, wm.decode(Ue(this, Wt, ku).call(this, o)), t, o];
      break;
    case ge.ARRAY:
      if (o === 1 / 0) yield* Ue(this, Wt, Cs).call(this, i, e, t, !1);
      else {
        const h = Number(o);
        yield [i, s, h, t, u];
        for (let m = 0; m < h; m++) yield* Ue(this, Wt, ti).call(this, e + 1);
      }
      break;
    case ge.MAP:
      if (o === 1 / 0) yield* Ue(this, Wt, Cs).call(this, i, e, t, !1);
      else {
        const h = Number(o);
        yield [i, s, h, t, u];
        for (let m = 0; m < h; m++) yield* Ue(this, Wt, ti).call(this, e), yield* Ue(this, Wt, ti).call(this, e);
      }
      break;
    case ge.TAG:
      yield [i, s, o, t, u], yield* Ue(this, Wt, ti).call(this, e);
      break;
    case ge.SIMPLE_FLOAT: {
      const h = o;
      c && (o = Js.create(Number(o))), yield [i, s, o, t, h];
      break;
    }
  }
}, ku = function(e) {
  const t = $(this, Ar).subarray($(this, qt), It(this, qt, $(this, qt) + e));
  if (t.length !== e) throw new Error(`Unexpected end of stream reading ${e} bytes, got ${t.length}`);
  return t;
}, Cs = function* (e, t, n, i = !0) {
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
}, Fe(Ha, "defaultOptions", { maxDepth: 1024, encoding: "hex", requirePreferred: !1 });
let Xs = Ha;
const bm = /* @__PURE__ */ new Map([[wt.ZERO, 1], [wt.ONE, 2], [wt.TWO, 3], [wt.FOUR, 5], [wt.EIGHT, 9]]), xm = new Uint8Array(0);
var rn, ar, tn, Fa, I0;
let Pn = (rn = class {
  constructor(e, t, n, i) {
    rr(this, Fa);
    Fe(this, "parent");
    Fe(this, "mt");
    Fe(this, "ai");
    Fe(this, "left");
    Fe(this, "offset");
    Fe(this, "count", 0);
    Fe(this, "children", []);
    Fe(this, "depth", 0);
    rr(this, ar);
    rr(this, tn, null);
    if ([this.mt, this.ai, , this.offset] = e, this.left = t, this.parent = n, It(this, ar, i), n && (this.depth = n.depth + 1), this.mt === ge.MAP && ($(this, ar).sortKeys || $(this, ar).rejectDuplicateKeys) && It(this, tn, []), $(this, ar).rejectStreaming && this.ai === wt.INDEFINITE) throw new Error("Streaming not supported");
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
      case ge.POS_INT:
      case ge.NEG_INT: {
        if (n.rejectInts) throw new Error(`Unexpected integer: ${c}`);
        if (n.rejectLargeNegatives && c < -0x8000000000000000n) throw new Error(`Invalid 65bit negative number: ${c}`);
        let h = c;
        return n.convertUnsafeIntsToFloat && h >= Ea.MIN && h <= Ea.MAX && (h = Number(c)), n.boxed ? ks(h, i.toHere(u)) : h;
      }
      case ge.SIMPLE_FLOAT:
        if (o > wt.ONE) {
          if (n.rejectFloats) throw new Error(`Decoding unwanted floating point number: ${c}`);
          if (n.rejectNegativeZero && Object.is(c, -0)) throw new Error("Decoding negative zero");
          if (n.rejectLongLoundNaN && isNaN(c)) {
            const h = i.toHere(u);
            if (h.length !== 3 || h[1] !== 126 || h[2] !== 0) throw new Error(`Invalid NaN encoding: "${Lr(h)}"`);
          }
          if (n.rejectSubnormals && im(i.toHere(u + 1)), n.rejectLongFloats) {
            const h = Uc(c, { chunkSize: 9, reduceUnsafeNumbers: n.rejectUnsafeFloatInts });
            if (h[0] >> 5 !== s) throw new Error(`Should have been encoded as int, not float: ${c}`);
            if (h.length < bm.get(o)) throw new Error(`Number should have been encoded shorter: ${c}`);
          }
          if (typeof c == "number" && n.boxed) return ks(c, i.toHere(u));
        } else {
          if (n.rejectSimple && c instanceof Js) throw new Error(`Invalid simple value: ${c}`);
          if (n.rejectUndefined && c === void 0) throw new Error("Unexpected undefined");
        }
        return c;
      case ge.BYTE_STRING:
      case ge.UTF8_STRING:
        if (c === 1 / 0) return new n.ParentType(e, 1 / 0, t, n);
        if (n.rejectStringsNotNormalizedAs && typeof c == "string") {
          const h = c.normalize(n.rejectStringsNotNormalizedAs);
          if (c !== h) throw new Error(`String not normalized as "${n.rejectStringsNotNormalizedAs}", got [${ud(c)}] instead of [${ud(h)}]`);
        }
        return n.boxed ? ks(c, i.toHere(u)) : c;
      case ge.ARRAY:
        return new n.ParentType(e, c, t, n);
      case ge.MAP:
        return new n.ParentType(e, c * 2, t, n);
      case ge.TAG: {
        const h = new n.ParentType(e, 1, t, n);
        return h.children = new We(c), h;
      }
    }
    throw new TypeError(`Invalid major type: ${s}`);
  }
  push(e, t, n) {
    if (this.children.push(e), $(this, tn)) {
      const i = Ia(e) || t.toHere(n);
      $(this, tn).push(i);
    }
    return --this.left;
  }
  replaceLast(e, t, n) {
    let i, s = -1 / 0;
    if (this.children instanceof We ? (s = 0, i = this.children.contents, this.children.contents = e) : (s = this.children.length - 1, i = this.children[s], this.children[s] = e), $(this, tn)) {
      const o = Ia(e) || n.toHere(t.offset);
      $(this, tn)[s] = o;
    }
    return i;
  }
  convert(e) {
    let t;
    switch (this.mt) {
      case ge.ARRAY:
        t = this.children;
        break;
      case ge.MAP: {
        const n = Ue(this, Fa, I0).call(this);
        if ($(this, ar).sortKeys) {
          let i;
          for (const s of n) {
            if (i && $(this, ar).sortKeys(i, s) >= 0) throw new Error(`Duplicate or out of order key: "0x${s[2]}"`);
            i = s;
          }
        } else if ($(this, ar).rejectDuplicateKeys) {
          const i = /* @__PURE__ */ new Set();
          for (const [s, o, c] of n) {
            const u = Lr(c);
            if (i.has(u)) throw new Error(`Duplicate key: "0x${u}"`);
            i.add(u);
          }
        }
        t = !$(this, ar).boxed && !$(this, ar).preferMap && n.every(([i]) => typeof i == "string") ? Object.fromEntries(n) : new Map(n);
        break;
      }
      case ge.BYTE_STRING:
        return Xv(this.children);
      case ge.UTF8_STRING: {
        const n = this.children.join("");
        t = $(this, ar).boxed ? ks(n, e.toHere(this.offset)) : n;
        break;
      }
      case ge.TAG:
        t = this.children.decode($(this, ar));
        break;
      default:
        throw new TypeError(`Invalid mt on convert: ${this.mt}`);
    }
    return $(this, ar).saveOriginal && t && typeof t == "object" && Ys(t, e.toHere(this.offset)), t;
  }
}, ar = new WeakMap(), tn = new WeakMap(), Fa = new WeakSet(), I0 = function() {
  const e = this.children, t = e.length;
  if (t % 2) throw new Error("Missing map value");
  const n = new Array(t / 2);
  if ($(this, tn)) for (let i = 0; i < t; i += 2) n[i >> 1] = [e[i], e[i + 1], $(this, tn)[i]];
  else for (let i = 0; i < t; i += 2) n[i >> 1] = [e[i], e[i + 1], xm];
  return n;
}, Fe(rn, "defaultDecodeOptions", { ...Xs.defaultOptions, ParentType: rn, boxed: !1, cde: !1, dcbor: !1, diagnosticSizes: E0.PREFERRED, convertUnsafeIntsToFloat: !1, pretty: !1, preferMap: !1, rejectLargeNegatives: !1, rejectBigInts: !1, rejectDuplicateKeys: !1, rejectFloats: !1, rejectInts: !1, rejectLongLoundNaN: !1, rejectLongFloats: !1, rejectNegativeZero: !1, rejectSimple: !1, rejectStreaming: !1, rejectStringsNotNormalizedAs: null, rejectSubnormals: !1, rejectUndefined: !1, rejectUnsafeFloatInts: !1, saveOriginal: !1, sortKeys: null }), Fe(rn, "cdeDecodeOptions", { cde: !0, rejectStreaming: !0, requirePreferred: !0, sortKeys: b0 }), Fe(rn, "dcborDecodeOptions", { ...rn.cdeDecodeOptions, dcbor: !0, convertUnsafeIntsToFloat: !0, rejectDuplicateKeys: !0, rejectLargeNegatives: !0, rejectLongLoundNaN: !0, rejectLongFloats: !0, rejectNegativeZero: !0, rejectSimple: !0, rejectUndefined: !0, rejectUnsafeFloatInts: !0, rejectStringsNotNormalizedAs: "NFC" }), rn);
var xd, Ad;
class Cu extends (Ad = Pn, xd = Er.ENCODED, Ad) {
  constructor(t, n, i, s) {
    super(t, n, i, s);
    Fe(this, "depth", 0);
    Fe(this, "leaf", !1);
    Fe(this, "value");
    Fe(this, "length");
    Fe(this, xd);
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
function k0(r) {
  return r instanceof Cu;
}
function Do(r, e) {
  return r === 1 / 0 ? "Indefinite" : e ? `${r} ${e}${r !== 1 && r !== 1n ? "s" : ""}` : String(r);
}
function tl(r) {
  return "".padStart(r, " ");
}
function C0(r, e, t) {
  let n = "";
  n += tl(r.depth * 2);
  const i = Ia(r);
  n += Lr(i.subarray(0, 1));
  const s = r.numBytes();
  s && (n += " ", n += Lr(i.subarray(1, s + 1))), n = n.padEnd(e.minCol + 1, " "), n += "-- ", t !== void 0 && (n += tl(r.depth * 2), t !== "" && (n += `[${t}] `));
  let o = !1;
  const [c] = r.children;
  switch (r.mt) {
    case ge.POS_INT:
      n += `Unsigned: ${c}`, typeof c == "bigint" && (n += "n");
      break;
    case ge.NEG_INT:
      n += `Negative: ${c}`, typeof c == "bigint" && (n += "n");
      break;
    case ge.BYTE_STRING:
      n += `Bytes (Length: ${Do(r.length)})`;
      break;
    case ge.UTF8_STRING:
      n += `UTF8 (Length: ${Do(r.length)})`, r.length !== 1 / 0 && (n += `: ${JSON.stringify(c)}`);
      break;
    case ge.ARRAY:
      n += `Array (Length: ${Do(r.value, "item")})`;
      break;
    case ge.MAP:
      n += `Map (Length: ${Do(r.value, "pair")})`;
      break;
    case ge.TAG: {
      n += `Tag #${r.value}`;
      const u = r.children, [h] = u.contents.children, m = new We(u.tag, h);
      Ys(m, i);
      const x = m.comment(e, r.depth);
      x && (n += ": ", n += x), o || (o = m.noChildren);
      break;
    }
    case ge.SIMPLE_FLOAT:
      c === Er.BREAK ? n += "BREAK" : r.ai > wt.ONE ? Object.is(c, -0) ? n += "Float: -0" : n += `Float: ${c}` : (n += "Simple: ", c instanceof Js ? n += c.value : n += c);
      break;
  }
  if (!o) if (r.leaf) {
    if (n += `
`, i.length > s + 1) {
      const u = tl((r.depth + 1) * 2);
      for (let h = s + 1; h < i.length; h += 8) n += u, n += Lr(i.subarray(h, h + 8)), n += `
`;
    }
  } else {
    n += `
`;
    let u = 0;
    for (const h of r.children) {
      if (k0(h)) {
        let m = String(u);
        r.mt === ge.MAP ? m = u % 2 ? `val ${(u - 1) / 2}` : `key ${u / 2}` : r.mt === ge.TAG && (m = ""), n += C0(h, e, m);
      }
      u++;
    }
  }
  return n;
}
const Am = { ...Pn.defaultDecodeOptions, initialDepth: 0, noPrefixHex: !1, minCol: 0 };
function Sm(r, e) {
  const t = { ...Am, ...e, ParentType: Cu, saveOriginal: !0 }, n = new Xs(r, t);
  let i, s;
  for (const c of n) {
    if (s = Pn.create(c, i, t, n), c[2] === Er.BREAK) if (i != null && i.isStreaming) i.left = 1;
    else throw new Error("Unexpected BREAK");
    if (!k0(s)) {
      const m = new Cu(c, 0, i, t);
      m.leaf = !0, m.children.push(s), Ys(m, n.toHere(c[3])), s = m;
    }
    let u = (s.depth + 1) * 2;
    const h = s.numBytes();
    for (h && (u += 1, u += h * 2), t.minCol = Math.max(t.minCol, u), i && i.push(s, n, c[3]), i = s; i != null && i.done; ) s = i, s.leaf || Ys(s, n.toHere(s.offset)), { parent: i } = i;
  }
  e && (e.minCol = t.minCol);
  let o = t.noPrefixHex ? "" : `0x${Lr(n.toHere(0))}
`;
  return o += C0(s, t), o;
}
const hd = !tm();
function B0(r) {
  if (typeof r == "object" && r) {
    if (r.constructor !== Number) throw new Error(`Expected number: ${r}`);
  } else if (typeof r != "number") throw new Error(`Expected number: ${r}`);
}
function jn(r) {
  if (typeof r == "object" && r) {
    if (r.constructor !== String) throw new Error(`Expected string: ${r}`);
  } else if (typeof r != "string") throw new Error(`Expected string: ${r}`);
}
function xi(r) {
  if (!(r instanceof Uint8Array)) throw new Error(`Expected Uint8Array: ${r}`);
}
function O0(r) {
  if (!Array.isArray(r)) throw new Error(`Expected Array: ${r}`);
}
Rt(Map, (r, e, t) => {
  const n = [...r.entries()].map((i) => [i[0], i[1], Uc(i[0], t)]);
  if (t.rejectDuplicateKeys) {
    const i = /* @__PURE__ */ new Set();
    for (const [s, o, c] of n) {
      const u = Lr(c);
      if (i.has(u)) throw new Error(`Duplicate map key: 0x${u}`);
      i.add(u);
    }
  }
  t.sortKeys && n.sort(t.sortKeys), Sf(r, r.size, ge.MAP, e, t);
  for (const [i, s, o] of n) e.write(o), si(s, e, t);
});
function dd(r) {
  return jn(r.contents), new Date(r.contents);
}
dd.comment = (r) => (jn(r.contents), `(String Date) ${new Date(r.contents).toISOString()}`), We.registerDecoder(_t.DATE_STRING, dd);
function pd(r) {
  return B0(r.contents), new Date(r.contents * 1e3);
}
pd.comment = (r) => (B0(r.contents), `(Epoch Date) ${new Date(r.contents * 1e3).toISOString()}`), We.registerDecoder(_t.DATE_EPOCH, pd), Rt(Date, (r) => [_t.DATE_EPOCH, r.valueOf() / 1e3]);
function Ba(r, e, t) {
  if (xi(e.contents), t.rejectBigInts) throw new Error(`Decoding unwanted big integer: ${e}(h'${Lr(e.contents)}')`);
  if (t.requirePreferred && e.contents[0] === 0) throw new Error(`Decoding overly-large bigint: ${e.tag}(h'${Lr(e.contents)})`);
  let n = e.contents.reduce((i, s) => i << 8n | BigInt(s), 0n);
  if (r && (n = -1n - n), t.requirePreferred && n >= Number.MIN_SAFE_INTEGER && n <= Number.MAX_SAFE_INTEGER) throw new Error(`Decoding bigint that could have been int: ${n}n`);
  return t.boxed ? ks(n, e.contents) : n;
}
const yd = Ba.bind(null, !1), gd = Ba.bind(null, !0);
yd.comment = (r, e) => `(Positive BigInt) ${Ba(!1, r, e)}n`, gd.comment = (r, e) => `(Negative BigInt) ${Ba(!0, r, e)}n`, We.registerDecoder(_t.POS_BIGINT, yd), We.registerDecoder(_t.NEG_BIGINT, gd);
function rl(r, e) {
  return xi(r.contents), r;
}
rl.comment = (r, e, t) => {
  xi(r.contents);
  const n = { ...e, initialDepth: t + 2, noPrefixHex: !0 }, i = Ia(r);
  let s = 2 ** ((i[0] & 31) - 24) + 1;
  const o = i[s] & 31;
  let c = Lr(i.subarray(s, ++s));
  o >= 24 && (c += " ", c += Lr(i.subarray(s, s + 2 ** (o - 24)))), n.minCol = Math.max(n.minCol, (t + 1) * 2 + c.length);
  const u = Sm(r.contents, n);
  let h = `Embedded CBOR
`;
  return h += `${"".padStart((t + 1) * 2, " ")}${c}`.padEnd(n.minCol + 1, " "), h += `-- Bytes (Length: ${r.contents.length})
`, h += u, h;
}, rl.noChildren = !0, We.registerDecoder(_t.CBOR, rl), We.registerDecoder(_t.URI, (r) => (jn(r.contents), new URL(r.contents)), "URI"), Rt(URL, (r) => [_t.URI, r.toString()]), We.registerDecoder(_t.BASE64URL, (r) => (jn(r.contents), em(r.contents)), "Base64url-encoded"), We.registerDecoder(_t.BASE64, (r) => (jn(r.contents), Af(r.contents)), "Base64-encoded"), We.registerDecoder(35, (r) => (jn(r.contents), new RegExp(r.contents)), "RegExp"), We.registerDecoder(21065, (r) => {
  jn(r.contents);
  let e = r.contents.replace(new RegExp("(?<!\\\\)(?<!\\[(?:[^\\]]|\\\\\\])*)\\.", "g"), `[^
\r]`);
  return e = `^(?:${e})$`, new RegExp(e, "u");
}, "I-RegExp"), We.registerDecoder(_t.REGEXP, (r) => {
  if (O0(r.contents), r.contents.length < 1 || r.contents.length > 2) throw new Error(`Invalid RegExp Array: ${r.contents}`);
  return new RegExp(r.contents[0], r.contents[1]);
}, "RegExp"), Rt(RegExp, (r) => [_t.REGEXP, [r.source, r.flags]]), We.registerDecoder(64, (r) => (xi(r.contents), r.contents), "uint8 Typed Array");
function nr(r, e, t) {
  xi(r.contents);
  let n = r.contents.length;
  if (n % e.BYTES_PER_ELEMENT !== 0) throw new Error(`Number of bytes must be divisible by ${e.BYTES_PER_ELEMENT}, got: ${n}`);
  n /= e.BYTES_PER_ELEMENT;
  const i = new e(n), s = new DataView(r.contents.buffer, r.contents.byteOffset, r.contents.byteLength), o = s[`get${e.name.replace(/Array/, "")}`].bind(s);
  for (let c = 0; c < n; c++) i[c] = o(c * e.BYTES_PER_ELEMENT, t);
  return i;
}
function Tn(r, e, t, n, i) {
  const s = i.forceEndian ?? hd;
  if (Ca(s ? e : t, r, i), zr(n.byteLength, r, ge.BYTE_STRING), hd === s) r.write(new Uint8Array(n.buffer, n.byteOffset, n.byteLength));
  else {
    const o = `write${n.constructor.name.replace(/Array/, "")}`, c = r[o].bind(r);
    for (const u of n) c(u, s);
  }
}
We.registerDecoder(65, (r) => nr(r, Uint16Array, !1), "uint16, big endian, Typed Array"), We.registerDecoder(66, (r) => nr(r, Uint32Array, !1), "uint32, big endian, Typed Array"), We.registerDecoder(67, (r) => nr(r, BigUint64Array, !1), "uint64, big endian, Typed Array"), We.registerDecoder(68, (r) => (xi(r.contents), new Uint8ClampedArray(r.contents)), "uint8 Typed Array, clamped arithmetic"), Rt(Uint8ClampedArray, (r) => [68, new Uint8Array(r.buffer, r.byteOffset, r.byteLength)]), We.registerDecoder(69, (r) => nr(r, Uint16Array, !0), "uint16, little endian, Typed Array"), Rt(Uint16Array, (r, e, t) => Tn(e, 69, 65, r, t)), We.registerDecoder(70, (r) => nr(r, Uint32Array, !0), "uint32, little endian, Typed Array"), Rt(Uint32Array, (r, e, t) => Tn(e, 70, 66, r, t)), We.registerDecoder(71, (r) => nr(r, BigUint64Array, !0), "uint64, little endian, Typed Array"), Rt(BigUint64Array, (r, e, t) => Tn(e, 71, 67, r, t)), We.registerDecoder(72, (r) => (xi(r.contents), new Int8Array(r.contents)), "sint8 Typed Array"), Rt(Int8Array, (r) => [72, new Uint8Array(r.buffer, r.byteOffset, r.byteLength)]), We.registerDecoder(73, (r) => nr(r, Int16Array, !1), "sint16, big endian, Typed Array"), We.registerDecoder(74, (r) => nr(r, Int32Array, !1), "sint32, big endian, Typed Array"), We.registerDecoder(75, (r) => nr(r, BigInt64Array, !1), "sint64, big endian, Typed Array"), We.registerDecoder(77, (r) => nr(r, Int16Array, !0), "sint16, little endian, Typed Array"), Rt(Int16Array, (r, e, t) => Tn(e, 77, 73, r, t)), We.registerDecoder(78, (r) => nr(r, Int32Array, !0), "sint32, little endian, Typed Array"), Rt(Int32Array, (r, e, t) => Tn(e, 78, 74, r, t)), We.registerDecoder(79, (r) => nr(r, BigInt64Array, !0), "sint64, little endian, Typed Array"), Rt(BigInt64Array, (r, e, t) => Tn(e, 79, 75, r, t)), We.registerDecoder(81, (r) => nr(r, Float32Array, !1), "IEEE 754 binary32, big endian, Typed Array"), We.registerDecoder(82, (r) => nr(r, Float64Array, !1), "IEEE 754 binary64, big endian, Typed Array"), We.registerDecoder(85, (r) => nr(r, Float32Array, !0), "IEEE 754 binary32, little endian, Typed Array"), Rt(Float32Array, (r, e, t) => Tn(e, 85, 81, r, t)), We.registerDecoder(86, (r) => nr(r, Float64Array, !0), "IEEE 754 binary64, big endian, Typed Array"), Rt(Float64Array, (r, e, t) => Tn(e, 86, 82, r, t)), We.registerDecoder(_t.SET, (r) => (O0(r.contents), new Set(r.contents)), "Set"), Rt(Set, (r) => [_t.SET, [...r]]), We.registerDecoder(_t.JSON, (r) => (jn(r.contents), JSON.parse(r.contents)), "JSON-encoded"), We.registerDecoder(_t.SELF_DESCRIBED, (r) => r.contents, "Self-Described"), We.registerDecoder(_t.INVALID_16, () => {
  throw new Error(`Tag always invalid: ${_t.INVALID_16}`);
}, "Invalid"), We.registerDecoder(_t.INVALID_32, () => {
  throw new Error(`Tag always invalid: ${_t.INVALID_32}`);
}, "Invalid"), We.registerDecoder(_t.INVALID_64, () => {
  throw new Error(`Tag always invalid: ${_t.INVALID_64}`);
}, "Invalid");
function nl(r) {
  throw new Error(`Encoding ${r.constructor.name} intentionally unimplmented.  It is not concrete enough to interoperate.  Convert to Uint8Array first.`);
}
Rt(ArrayBuffer, nl), Rt(DataView, nl), typeof SharedArrayBuffer < "u" && Rt(SharedArrayBuffer, nl);
function $o(r) {
  return [NaN, r.valueOf()];
}
Rt(Boolean, $o), Rt(Number, $o), Rt(String, $o), Rt(BigInt, $o);
function Oa(r, e = {}) {
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
var Bu;
(function(r) {
  r.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(Bu || (Bu = {}));
const re = at.arrayToEnum([
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
      return re.undefined;
    case "string":
      return re.string;
    case "number":
      return isNaN(r) ? re.nan : re.number;
    case "boolean":
      return re.boolean;
    case "function":
      return re.function;
    case "bigint":
      return re.bigint;
    case "symbol":
      return re.symbol;
    case "object":
      return Array.isArray(r) ? re.array : r === null ? re.null : r.then && typeof r.then == "function" && r.catch && typeof r.catch == "function" ? re.promise : typeof Map < "u" && r instanceof Map ? re.map : typeof Set < "u" && r instanceof Set ? re.set : typeof Date < "u" && r instanceof Date ? re.date : re.object;
    default:
      return re.unknown;
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
]), _m = (r) => JSON.stringify(r, null, 2).replace(/"([^"]+)":/g, "$1:");
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
const Qi = (r, e) => {
  let t;
  switch (r.code) {
    case F.invalid_type:
      r.received === re.undefined ? t = "Required" : t = `Expected ${r.expected}, received ${r.received}`;
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
let T0 = Qi;
function Em(r) {
  T0 = r;
}
function Ta() {
  return T0;
}
const Na = (r) => {
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
}, Im = [];
function X(r, e) {
  const t = Ta(), n = Na({
    issueData: e,
    data: r.data,
    path: r.path,
    errorMaps: [
      r.common.contextualErrorMap,
      r.schemaErrorMap,
      t,
      t === Qi ? void 0 : Qi
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
}), Ui = (r) => ({ status: "dirty", value: r }), ur = (r) => ({ status: "valid", value: r }), Ou = (r) => r.status === "aborted", Tu = (r) => r.status === "dirty", Qs = (r) => r.status === "valid", eo = (r) => typeof Promise < "u" && r instanceof Promise;
function Pa(r, e, t, n) {
  if (typeof e == "function" ? r !== e || !n : !e.has(r)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return e.get(r);
}
function N0(r, e, t, n, i) {
  if (typeof e == "function" ? r !== e || !i : !e.has(r)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return e.set(r, t), t;
}
var Ae;
(function(r) {
  r.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, r.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(Ae || (Ae = {}));
var Bs, Os;
class un {
  constructor(e, t, n, i) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = n, this._key = i;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const vd = (r, e) => {
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
function Le(r) {
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
    return vd(i, s);
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
    return vd(n, s);
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
    return new Kr({
      schema: this,
      typeName: Ee.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  optional() {
    return an.create(this, this._def);
  }
  nullable() {
    return Yn.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return Hr.create(this, this._def);
  }
  promise() {
    return ts.create(this, this._def);
  }
  or(e) {
    return io.create([this, e], this._def);
  }
  and(e) {
    return so.create(this, e, this._def);
  }
  transform(e) {
    return new Kr({
      ...Le(this._def),
      schema: this,
      typeName: Ee.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new uo({
      ...Le(this._def),
      innerType: this,
      defaultValue: t,
      typeName: Ee.ZodDefault
    });
  }
  brand() {
    return new _f({
      typeName: Ee.ZodBranded,
      type: this,
      ...Le(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new fo({
      ...Le(this._def),
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
    return Bo.create(this, e);
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
const km = /^c[^\s-]{8,}$/i, Cm = /^[0-9a-z]+$/, Bm = /^[0-9A-HJKMNP-TV-Z]{26}$/, Om = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Tm = /^[a-z0-9_-]{21}$/i, Nm = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Pm = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, jm = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let il;
const Rm = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Um = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/, Dm = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, P0 = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", $m = new RegExp(`^${P0}$`);
function j0(r) {
  let e = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
  return r.precision ? e = `${e}\\.\\d{${r.precision}}` : r.precision == null && (e = `${e}(\\.\\d+)?`), e;
}
function Mm(r) {
  return new RegExp(`^${j0(r)}$`);
}
function R0(r) {
  let e = `${P0}T${j0(r)}`;
  const t = [];
  return t.push(r.local ? "Z?" : "Z"), r.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function Vm(r, e) {
  return !!((e === "v4" || !e) && Rm.test(r) || (e === "v6" || !e) && Um.test(r));
}
class Vr extends qe {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== re.string) {
      const s = this._getOrReturnCtx(e);
      return X(s, {
        code: F.invalid_type,
        expected: re.string,
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
        Pm.test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
          validation: "email",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "emoji")
        il || (il = new RegExp(jm, "u")), il.test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
          validation: "emoji",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "uuid")
        Om.test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
          validation: "uuid",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "nanoid")
        Tm.test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
          validation: "nanoid",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "cuid")
        km.test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
          validation: "cuid",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "cuid2")
        Cm.test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
          validation: "cuid2",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "ulid")
        Bm.test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
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
      }), n.dirty()) : s.kind === "datetime" ? R0(s).test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
        code: F.invalid_string,
        validation: "datetime",
        message: s.message
      }), n.dirty()) : s.kind === "date" ? $m.test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
        code: F.invalid_string,
        validation: "date",
        message: s.message
      }), n.dirty()) : s.kind === "time" ? Mm(s).test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
        code: F.invalid_string,
        validation: "time",
        message: s.message
      }), n.dirty()) : s.kind === "duration" ? Nm.test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
        validation: "duration",
        code: F.invalid_string,
        message: s.message
      }), n.dirty()) : s.kind === "ip" ? Vm(e.data, s.version) || (i = this._getOrReturnCtx(e, i), X(i, {
        validation: "ip",
        code: F.invalid_string,
        message: s.message
      }), n.dirty()) : s.kind === "base64" ? Dm.test(e.data) || (i = this._getOrReturnCtx(e, i), X(i, {
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
    return new Vr({
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
    return new Vr({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new Vr({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new Vr({
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
Vr.create = (r) => {
  var e;
  return new Vr({
    checks: [],
    typeName: Ee.ZodString,
    coerce: (e = r == null ? void 0 : r.coerce) !== null && e !== void 0 ? e : !1,
    ...Le(r)
  });
};
function Lm(r, e) {
  const t = (r.toString().split(".")[1] || "").length, n = (e.toString().split(".")[1] || "").length, i = t > n ? t : n, s = parseInt(r.toFixed(i).replace(".", "")), o = parseInt(e.toFixed(i).replace(".", ""));
  return s % o / Math.pow(10, i);
}
class qn extends qe {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== re.number) {
      const s = this._getOrReturnCtx(e);
      return X(s, {
        code: F.invalid_type,
        expected: re.number,
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
      }), i.dirty()) : s.kind === "multipleOf" ? Lm(e.data, s.value) !== 0 && (n = this._getOrReturnCtx(e, n), X(n, {
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
  ...Le(r)
});
class Zn extends qe {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = BigInt(e.data)), this._getType(e) !== re.bigint) {
      const s = this._getOrReturnCtx(e);
      return X(s, {
        code: F.invalid_type,
        expected: re.bigint,
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
    ...Le(r)
  });
};
class to extends qe {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== re.boolean) {
      const n = this._getOrReturnCtx(e);
      return X(n, {
        code: F.invalid_type,
        expected: re.boolean,
        received: n.parsedType
      }), Ie;
    }
    return ur(e.data);
  }
}
to.create = (r) => new to({
  typeName: Ee.ZodBoolean,
  coerce: (r == null ? void 0 : r.coerce) || !1,
  ...Le(r)
});
class Ai extends qe {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== re.date) {
      const s = this._getOrReturnCtx(e);
      return X(s, {
        code: F.invalid_type,
        expected: re.date,
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
    return new Ai({
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
Ai.create = (r) => new Ai({
  checks: [],
  coerce: (r == null ? void 0 : r.coerce) || !1,
  typeName: Ee.ZodDate,
  ...Le(r)
});
class ja extends qe {
  _parse(e) {
    if (this._getType(e) !== re.symbol) {
      const n = this._getOrReturnCtx(e);
      return X(n, {
        code: F.invalid_type,
        expected: re.symbol,
        received: n.parsedType
      }), Ie;
    }
    return ur(e.data);
  }
}
ja.create = (r) => new ja({
  typeName: Ee.ZodSymbol,
  ...Le(r)
});
class ro extends qe {
  _parse(e) {
    if (this._getType(e) !== re.undefined) {
      const n = this._getOrReturnCtx(e);
      return X(n, {
        code: F.invalid_type,
        expected: re.undefined,
        received: n.parsedType
      }), Ie;
    }
    return ur(e.data);
  }
}
ro.create = (r) => new ro({
  typeName: Ee.ZodUndefined,
  ...Le(r)
});
class no extends qe {
  _parse(e) {
    if (this._getType(e) !== re.null) {
      const n = this._getOrReturnCtx(e);
      return X(n, {
        code: F.invalid_type,
        expected: re.null,
        received: n.parsedType
      }), Ie;
    }
    return ur(e.data);
  }
}
no.create = (r) => new no({
  typeName: Ee.ZodNull,
  ...Le(r)
});
class es extends qe {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return ur(e.data);
  }
}
es.create = (r) => new es({
  typeName: Ee.ZodAny,
  ...Le(r)
});
class ci extends qe {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return ur(e.data);
  }
}
ci.create = (r) => new ci({
  typeName: Ee.ZodUnknown,
  ...Le(r)
});
class In extends qe {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return X(t, {
      code: F.invalid_type,
      expected: re.never,
      received: t.parsedType
    }), Ie;
  }
}
In.create = (r) => new In({
  typeName: Ee.ZodNever,
  ...Le(r)
});
class Ra extends qe {
  _parse(e) {
    if (this._getType(e) !== re.undefined) {
      const n = this._getOrReturnCtx(e);
      return X(n, {
        code: F.invalid_type,
        expected: re.void,
        received: n.parsedType
      }), Ie;
    }
    return ur(e.data);
  }
}
Ra.create = (r) => new Ra({
  typeName: Ee.ZodVoid,
  ...Le(r)
});
class Hr extends qe {
  _parse(e) {
    const { ctx: t, status: n } = this._processInputParams(e), i = this._def;
    if (t.parsedType !== re.array)
      return X(t, {
        code: F.invalid_type,
        expected: re.array,
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
      return Promise.all([...t.data].map((o, c) => i.type._parseAsync(new un(t, o, t.path, c)))).then((o) => sr.mergeArray(n, o));
    const s = [...t.data].map((o, c) => i.type._parseSync(new un(t, o, t.path, c)));
    return sr.mergeArray(n, s);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new Hr({
      ...this._def,
      minLength: { value: e, message: Ae.toString(t) }
    });
  }
  max(e, t) {
    return new Hr({
      ...this._def,
      maxLength: { value: e, message: Ae.toString(t) }
    });
  }
  length(e, t) {
    return new Hr({
      ...this._def,
      exactLength: { value: e, message: Ae.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
Hr.create = (r, e) => new Hr({
  type: r,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: Ee.ZodArray,
  ...Le(e)
});
function ji(r) {
  if (r instanceof Bt) {
    const e = {};
    for (const t in r.shape) {
      const n = r.shape[t];
      e[t] = an.create(ji(n));
    }
    return new Bt({
      ...r._def,
      shape: () => e
    });
  } else return r instanceof Hr ? new Hr({
    ...r._def,
    type: ji(r.element)
  }) : r instanceof an ? an.create(ji(r.unwrap())) : r instanceof Yn ? Yn.create(ji(r.unwrap())) : r instanceof fn ? fn.create(r.items.map((e) => ji(e))) : r;
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
    if (this._getType(e) !== re.object) {
      const h = this._getOrReturnCtx(e);
      return X(h, {
        code: F.invalid_type,
        expected: re.object,
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
        value: m._parse(new un(i, x, i.path, h)),
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
            new un(i, x, i.path, m)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: m in i.data
        });
      }
    }
    return i.common.async ? Promise.resolve().then(async () => {
      const h = [];
      for (const m of u) {
        const x = await m.key, z = await m.value;
        h.push({
          key: x,
          value: z,
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
    return ji(this);
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
        for (; s instanceof an; )
          s = s._def.innerType;
        t[n] = s;
      }
    }), new Bt({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return U0(at.objectKeys(this.shape));
  }
}
Bt.create = (r, e) => new Bt({
  shape: () => r,
  unknownKeys: "strip",
  catchall: In.create(),
  typeName: Ee.ZodObject,
  ...Le(e)
});
Bt.strictCreate = (r, e) => new Bt({
  shape: () => r,
  unknownKeys: "strict",
  catchall: In.create(),
  typeName: Ee.ZodObject,
  ...Le(e)
});
Bt.lazycreate = (r, e) => new Bt({
  shape: r,
  unknownKeys: "strip",
  catchall: In.create(),
  typeName: Ee.ZodObject,
  ...Le(e)
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
  ...Le(e)
});
const gn = (r) => r instanceof ao ? gn(r.schema) : r instanceof Kr ? gn(r.innerType()) : r instanceof co ? [r.value] : r instanceof Wn ? r.options : r instanceof lo ? at.objectValues(r.enum) : r instanceof uo ? gn(r._def.innerType) : r instanceof ro ? [void 0] : r instanceof no ? [null] : r instanceof an ? [void 0, ...gn(r.unwrap())] : r instanceof Yn ? [null, ...gn(r.unwrap())] : r instanceof _f || r instanceof ho ? gn(r.unwrap()) : r instanceof fo ? gn(r._def.innerType) : [];
class Dc extends qe {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== re.object)
      return X(t, {
        code: F.invalid_type,
        expected: re.object,
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
    return new Dc({
      typeName: Ee.ZodDiscriminatedUnion,
      discriminator: e,
      options: t,
      optionsMap: i,
      ...Le(n)
    });
  }
}
function Nu(r, e) {
  const t = Rn(r), n = Rn(e);
  if (r === e)
    return { valid: !0, data: r };
  if (t === re.object && n === re.object) {
    const i = at.objectKeys(e), s = at.objectKeys(r).filter((c) => i.indexOf(c) !== -1), o = { ...r, ...e };
    for (const c of s) {
      const u = Nu(r[c], e[c]);
      if (!u.valid)
        return { valid: !1 };
      o[c] = u.data;
    }
    return { valid: !0, data: o };
  } else if (t === re.array && n === re.array) {
    if (r.length !== e.length)
      return { valid: !1 };
    const i = [];
    for (let s = 0; s < r.length; s++) {
      const o = r[s], c = e[s], u = Nu(o, c);
      if (!u.valid)
        return { valid: !1 };
      i.push(u.data);
    }
    return { valid: !0, data: i };
  } else return t === re.date && n === re.date && +r == +e ? { valid: !0, data: r } : { valid: !1 };
}
class so extends qe {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), i = (s, o) => {
      if (Ou(s) || Ou(o))
        return Ie;
      const c = Nu(s.value, o.value);
      return c.valid ? ((Tu(s) || Tu(o)) && t.dirty(), { status: t.value, value: c.data }) : (X(n, {
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
  ...Le(t)
});
class fn extends qe {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== re.array)
      return X(n, {
        code: F.invalid_type,
        expected: re.array,
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
      return u ? u._parse(new un(n, o, n.path, c)) : null;
    }).filter((o) => !!o);
    return n.common.async ? Promise.all(s).then((o) => sr.mergeArray(t, o)) : sr.mergeArray(t, s);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new fn({
      ...this._def,
      rest: e
    });
  }
}
fn.create = (r, e) => {
  if (!Array.isArray(r))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new fn({
    items: r,
    typeName: Ee.ZodTuple,
    rest: null,
    ...Le(e)
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
    if (n.parsedType !== re.object)
      return X(n, {
        code: F.invalid_type,
        expected: re.object,
        received: n.parsedType
      }), Ie;
    const i = [], s = this._def.keyType, o = this._def.valueType;
    for (const c in n.data)
      i.push({
        key: s._parse(new un(n, c, n.path, c)),
        value: o._parse(new un(n, n.data[c], n.path, c)),
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
      ...Le(n)
    }) : new oo({
      keyType: Vr.create(),
      valueType: e,
      typeName: Ee.ZodRecord,
      ...Le(t)
    });
  }
}
class Ua extends qe {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== re.map)
      return X(n, {
        code: F.invalid_type,
        expected: re.map,
        received: n.parsedType
      }), Ie;
    const i = this._def.keyType, s = this._def.valueType, o = [...n.data.entries()].map(([c, u], h) => ({
      key: i._parse(new un(n, c, n.path, [h, "key"])),
      value: s._parse(new un(n, u, n.path, [h, "value"]))
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
Ua.create = (r, e, t) => new Ua({
  valueType: e,
  keyType: r,
  typeName: Ee.ZodMap,
  ...Le(t)
});
class Si extends qe {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== re.set)
      return X(n, {
        code: F.invalid_type,
        expected: re.set,
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
    const c = [...n.data.values()].map((u, h) => s._parse(new un(n, u, n.path, h)));
    return n.common.async ? Promise.all(c).then((u) => o(u)) : o(c);
  }
  min(e, t) {
    return new Si({
      ...this._def,
      minSize: { value: e, message: Ae.toString(t) }
    });
  }
  max(e, t) {
    return new Si({
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
Si.create = (r, e) => new Si({
  valueType: r,
  minSize: null,
  maxSize: null,
  typeName: Ee.ZodSet,
  ...Le(e)
});
class Mi extends qe {
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== re.function)
      return X(t, {
        code: F.invalid_type,
        expected: re.function,
        received: t.parsedType
      }), Ie;
    function n(c, u) {
      return Na({
        data: c,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          Ta(),
          Qi
        ].filter((h) => !!h),
        issueData: {
          code: F.invalid_arguments,
          argumentsError: u
        }
      });
    }
    function i(c, u) {
      return Na({
        data: c,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          Ta(),
          Qi
        ].filter((h) => !!h),
        issueData: {
          code: F.invalid_return_type,
          returnTypeError: u
        }
      });
    }
    const s = { errorMap: t.common.contextualErrorMap }, o = t.data;
    if (this._def.returns instanceof ts) {
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
    return new Mi({
      ...this._def,
      args: fn.create(e).rest(ci.create())
    });
  }
  returns(e) {
    return new Mi({
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
    return new Mi({
      args: e || fn.create([]).rest(ci.create()),
      returns: t || ci.create(),
      typeName: Ee.ZodFunction,
      ...Le(n)
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
  ...Le(e)
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
  ...Le(e)
});
function U0(r, e) {
  return new Wn({
    values: r,
    typeName: Ee.ZodEnum,
    ...Le(e)
  });
}
class Wn extends qe {
  constructor() {
    super(...arguments), Bs.set(this, void 0);
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
    if (Pa(this, Bs) || N0(this, Bs, new Set(this._def.values)), !Pa(this, Bs).has(e.data)) {
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
Bs = /* @__PURE__ */ new WeakMap();
Wn.create = U0;
class lo extends qe {
  constructor() {
    super(...arguments), Os.set(this, void 0);
  }
  _parse(e) {
    const t = at.getValidEnumValues(this._def.values), n = this._getOrReturnCtx(e);
    if (n.parsedType !== re.string && n.parsedType !== re.number) {
      const i = at.objectValues(t);
      return X(n, {
        expected: at.joinValues(i),
        received: n.parsedType,
        code: F.invalid_type
      }), Ie;
    }
    if (Pa(this, Os) || N0(this, Os, new Set(at.getValidEnumValues(this._def.values))), !Pa(this, Os).has(e.data)) {
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
Os = /* @__PURE__ */ new WeakMap();
lo.create = (r, e) => new lo({
  values: r,
  typeName: Ee.ZodNativeEnum,
  ...Le(e)
});
class ts extends qe {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== re.promise && t.common.async === !1)
      return X(t, {
        code: F.invalid_type,
        expected: re.promise,
        received: t.parsedType
      }), Ie;
    const n = t.parsedType === re.promise ? t.data : Promise.resolve(t.data);
    return ur(n.then((i) => this._def.type.parseAsync(i, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
ts.create = (r, e) => new ts({
  type: r,
  typeName: Ee.ZodPromise,
  ...Le(e)
});
class Kr extends qe {
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
          return u.status === "aborted" ? Ie : u.status === "dirty" || t.value === "dirty" ? Ui(u.value) : u;
        });
      {
        if (t.value === "aborted")
          return Ie;
        const c = this._def.schema._parseSync({
          data: o,
          path: n.path,
          parent: n
        });
        return c.status === "aborted" ? Ie : c.status === "dirty" || t.value === "dirty" ? Ui(c.value) : c;
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
Kr.create = (r, e, t) => new Kr({
  schema: r,
  typeName: Ee.ZodEffects,
  effect: e,
  ...Le(t)
});
Kr.createWithPreprocess = (r, e, t) => new Kr({
  schema: e,
  effect: { type: "preprocess", transform: r },
  typeName: Ee.ZodEffects,
  ...Le(t)
});
class an extends qe {
  _parse(e) {
    return this._getType(e) === re.undefined ? ur(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
an.create = (r, e) => new an({
  innerType: r,
  typeName: Ee.ZodOptional,
  ...Le(e)
});
class Yn extends qe {
  _parse(e) {
    return this._getType(e) === re.null ? ur(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Yn.create = (r, e) => new Yn({
  innerType: r,
  typeName: Ee.ZodNullable,
  ...Le(e)
});
class uo extends qe {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let n = t.data;
    return t.parsedType === re.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({
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
  ...Le(e)
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
  ...Le(e)
});
class Da extends qe {
  _parse(e) {
    if (this._getType(e) !== re.nan) {
      const n = this._getOrReturnCtx(e);
      return X(n, {
        code: F.invalid_type,
        expected: re.nan,
        received: n.parsedType
      }), Ie;
    }
    return { status: "valid", value: e.data };
  }
}
Da.create = (r) => new Da({
  typeName: Ee.ZodNaN,
  ...Le(r)
});
const Hm = Symbol("zod_brand");
class _f extends qe {
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
class Bo extends qe {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.common.async)
      return (async () => {
        const s = await this._def.in._parseAsync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return s.status === "aborted" ? Ie : s.status === "dirty" ? (t.dirty(), Ui(s.value)) : this._def.out._parseAsync({
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
    return new Bo({
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
  ...Le(e)
});
function D0(r, e = {}, t) {
  return r ? es.create().superRefine((n, i) => {
    var s, o;
    if (!r(n)) {
      const c = typeof e == "function" ? e(n) : typeof e == "string" ? { message: e } : e, u = (o = (s = c.fatal) !== null && s !== void 0 ? s : t) !== null && o !== void 0 ? o : !0, h = typeof c == "string" ? { message: c } : c;
      i.addIssue({ code: "custom", ...h, fatal: u });
    }
  }) : es.create();
}
const Fm = {
  object: Bt.lazycreate
};
var Ee;
(function(r) {
  r.ZodString = "ZodString", r.ZodNumber = "ZodNumber", r.ZodNaN = "ZodNaN", r.ZodBigInt = "ZodBigInt", r.ZodBoolean = "ZodBoolean", r.ZodDate = "ZodDate", r.ZodSymbol = "ZodSymbol", r.ZodUndefined = "ZodUndefined", r.ZodNull = "ZodNull", r.ZodAny = "ZodAny", r.ZodUnknown = "ZodUnknown", r.ZodNever = "ZodNever", r.ZodVoid = "ZodVoid", r.ZodArray = "ZodArray", r.ZodObject = "ZodObject", r.ZodUnion = "ZodUnion", r.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r.ZodIntersection = "ZodIntersection", r.ZodTuple = "ZodTuple", r.ZodRecord = "ZodRecord", r.ZodMap = "ZodMap", r.ZodSet = "ZodSet", r.ZodFunction = "ZodFunction", r.ZodLazy = "ZodLazy", r.ZodLiteral = "ZodLiteral", r.ZodEnum = "ZodEnum", r.ZodEffects = "ZodEffects", r.ZodNativeEnum = "ZodNativeEnum", r.ZodOptional = "ZodOptional", r.ZodNullable = "ZodNullable", r.ZodDefault = "ZodDefault", r.ZodCatch = "ZodCatch", r.ZodPromise = "ZodPromise", r.ZodBranded = "ZodBranded", r.ZodPipeline = "ZodPipeline", r.ZodReadonly = "ZodReadonly";
})(Ee || (Ee = {}));
const Gm = (r, e = {
  message: `Input not instance of ${r.name}`
}) => D0((t) => t instanceof r, e), $0 = Vr.create, M0 = qn.create, zm = Da.create, Km = Zn.create, V0 = to.create, qm = Ai.create, Zm = ja.create, Wm = ro.create, Ym = no.create, Jm = es.create, Xm = ci.create, Qm = In.create, e1 = Ra.create, t1 = Hr.create, r1 = Bt.create, n1 = Bt.strictCreate, i1 = io.create, s1 = Dc.create, o1 = so.create, a1 = fn.create, c1 = oo.create, l1 = Ua.create, u1 = Si.create, f1 = Mi.create, h1 = ao.create, d1 = co.create, p1 = Wn.create, y1 = lo.create, g1 = ts.create, md = Kr.create, v1 = an.create, m1 = Yn.create, w1 = Kr.createWithPreprocess, b1 = Bo.create, x1 = () => $0().optional(), A1 = () => M0().optional(), S1 = () => V0().optional(), _1 = {
  string: (r) => Vr.create({ ...r, coerce: !0 }),
  number: (r) => qn.create({ ...r, coerce: !0 }),
  boolean: (r) => to.create({
    ...r,
    coerce: !0
  }),
  bigint: (r) => Zn.create({ ...r, coerce: !0 }),
  date: (r) => Ai.create({ ...r, coerce: !0 })
}, E1 = Ie;
var Ct = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: Qi,
  setErrorMap: Em,
  getErrorMap: Ta,
  makeIssue: Na,
  EMPTY_PATH: Im,
  addIssueToContext: X,
  ParseStatus: sr,
  INVALID: Ie,
  DIRTY: Ui,
  OK: ur,
  isAborted: Ou,
  isDirty: Tu,
  isValid: Qs,
  isAsync: eo,
  get util() {
    return at;
  },
  get objectUtil() {
    return Bu;
  },
  ZodParsedType: re,
  getParsedType: Rn,
  ZodType: qe,
  datetimeRegex: R0,
  ZodString: Vr,
  ZodNumber: qn,
  ZodBigInt: Zn,
  ZodBoolean: to,
  ZodDate: Ai,
  ZodSymbol: ja,
  ZodUndefined: ro,
  ZodNull: no,
  ZodAny: es,
  ZodUnknown: ci,
  ZodNever: In,
  ZodVoid: Ra,
  ZodArray: Hr,
  ZodObject: Bt,
  ZodUnion: io,
  ZodDiscriminatedUnion: Dc,
  ZodIntersection: so,
  ZodTuple: fn,
  ZodRecord: oo,
  ZodMap: Ua,
  ZodSet: Si,
  ZodFunction: Mi,
  ZodLazy: ao,
  ZodLiteral: co,
  ZodEnum: Wn,
  ZodNativeEnum: lo,
  ZodPromise: ts,
  ZodEffects: Kr,
  ZodTransformer: Kr,
  ZodOptional: an,
  ZodNullable: Yn,
  ZodDefault: uo,
  ZodCatch: fo,
  ZodNaN: Da,
  BRAND: Hm,
  ZodBranded: _f,
  ZodPipeline: Bo,
  ZodReadonly: ho,
  custom: D0,
  Schema: qe,
  ZodSchema: qe,
  late: Fm,
  get ZodFirstPartyTypeKind() {
    return Ee;
  },
  coerce: _1,
  any: Jm,
  array: t1,
  bigint: Km,
  boolean: V0,
  date: qm,
  discriminatedUnion: s1,
  effect: md,
  enum: p1,
  function: f1,
  instanceof: Gm,
  intersection: o1,
  lazy: h1,
  literal: d1,
  map: l1,
  nan: zm,
  nativeEnum: y1,
  never: Qm,
  null: Ym,
  nullable: m1,
  number: M0,
  object: r1,
  oboolean: S1,
  onumber: A1,
  optional: v1,
  ostring: x1,
  pipeline: b1,
  preprocess: w1,
  promise: g1,
  record: c1,
  set: u1,
  strictObject: n1,
  string: $0,
  symbol: Zm,
  transformer: md,
  tuple: a1,
  undefined: Wm,
  union: i1,
  unknown: Xm,
  void: e1,
  NEVER: E1,
  ZodIssueCode: F,
  quotelessJson: _m,
  ZodError: _r
});
const $a = new Uint8Array([48, 130, 2, 17, 48, 130, 1, 150, 160, 3, 2, 1, 2, 2, 17, 0, 249, 49, 117, 104, 27, 144, 175, 225, 29, 70, 204, 180, 228, 231, 248, 86, 48, 10, 6, 8, 42, 134, 72, 206, 61, 4, 3, 3, 48, 73, 49, 11, 48, 9, 6, 3, 85, 4, 6, 19, 2, 85, 83, 49, 15, 48, 13, 6, 3, 85, 4, 10, 12, 6, 65, 109, 97, 122, 111, 110, 49, 12, 48, 10, 6, 3, 85, 4, 11, 12, 3, 65, 87, 83, 49, 27, 48, 25, 6, 3, 85, 4, 3, 12, 18, 97, 119, 115, 46, 110, 105, 116, 114, 111, 45, 101, 110, 99, 108, 97, 118, 101, 115, 48, 30, 23, 13, 49, 57, 49, 48, 50, 56, 49, 51, 50, 56, 48, 53, 90, 23, 13, 52, 57, 49, 48, 50, 56, 49, 52, 50, 56, 48, 53, 90, 48, 73, 49, 11, 48, 9, 6, 3, 85, 4, 6, 19, 2, 85, 83, 49, 15, 48, 13, 6, 3, 85, 4, 10, 12, 6, 65, 109, 97, 122, 111, 110, 49, 12, 48, 10, 6, 3, 85, 4, 11, 12, 3, 65, 87, 83, 49, 27, 48, 25, 6, 3, 85, 4, 3, 12, 18, 97, 119, 115, 46, 110, 105, 116, 114, 111, 45, 101, 110, 99, 108, 97, 118, 101, 115, 48, 118, 48, 16, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 5, 43, 129, 4, 0, 34, 3, 98, 0, 4, 252, 2, 84, 235, 166, 8, 193, 243, 104, 112, 226, 154, 218, 144, 190, 70, 56, 50, 146, 115, 110, 137, 75, 255, 246, 114, 217, 137, 68, 75, 80, 81, 229, 52, 164, 177, 246, 219, 227, 192, 188, 88, 26, 50, 183, 177, 118, 7, 14, 222, 18, 214, 154, 63, 234, 33, 27, 102, 231, 82, 207, 125, 209, 221, 9, 95, 111, 19, 112, 244, 23, 8, 67, 217, 220, 16, 1, 33, 228, 207, 99, 1, 40, 9, 102, 68, 135, 201, 121, 98, 132, 48, 77, 197, 63, 244, 163, 66, 48, 64, 48, 15, 6, 3, 85, 29, 19, 1, 1, 255, 4, 5, 48, 3, 1, 1, 255, 48, 29, 6, 3, 85, 29, 14, 4, 22, 4, 20, 144, 37, 181, 13, 217, 5, 71, 231, 150, 195, 150, 250, 114, 157, 207, 153, 169, 223, 75, 150, 48, 14, 6, 3, 85, 29, 15, 1, 1, 255, 4, 4, 3, 2, 1, 134, 48, 10, 6, 8, 42, 134, 72, 206, 61, 4, 3, 3, 3, 105, 0, 48, 102, 2, 49, 0, 163, 127, 47, 145, 161, 201, 189, 94, 231, 184, 98, 124, 22, 152, 210, 85, 3, 142, 31, 3, 67, 249, 91, 99, 169, 98, 140, 61, 57, 128, 149, 69, 161, 30, 188, 191, 46, 59, 85, 216, 174, 238, 113, 180, 195, 214, 173, 243, 2, 49, 0, 162, 243, 155, 22, 5, 178, 112, 40, 165, 221, 75, 160, 105, 181, 1, 110, 101, 180, 251, 222, 143, 224, 6, 29, 106, 83, 25, 127, 156, 218, 245, 217, 67, 188, 97, 252, 43, 235, 3, 203, 111, 238, 141, 35, 2, 243, 223, 246]);
if (!$a || $a.length === 0)
  throw new Error("AWS root certificate is empty or not loaded correctly");
const I1 = Ct.object({
  module_id: Ct.string().min(1),
  digest: Ct.literal("SHA384"),
  timestamp: Ct.number().min(1677721600),
  pcrs: Ct.map(Ct.number(), Ct.instanceof(Uint8Array)),
  certificate: Ct.instanceof(Uint8Array),
  cabundle: Ct.array(Ct.instanceof(Uint8Array)),
  public_key: Ct.nullable(Ct.instanceof(Uint8Array)),
  user_data: Ct.nullable(Ct.instanceof(Uint8Array)),
  nonce: Ct.nullable(Ct.instanceof(Uint8Array))
}), k1 = Ct.object({
  protected: Ct.instanceof(Uint8Array),
  // There's an "unprotected" header in the CBOR, but we never use it
  payload: Ct.instanceof(Uint8Array),
  signature: Ct.instanceof(Uint8Array)
});
async function C1(r) {
  try {
    if (!r)
      throw new Error("Attestation document is empty.");
    const e = Ds(r), t = Oa(e), n = t[0], i = t[2], s = t[3];
    return k1.parse({
      protected: n,
      payload: i,
      signature: s
    });
  } catch (e) {
    throw console.error("Error parsing document data:", e), new Error("Failed to parse document data.");
  }
}
async function B1(r) {
  try {
    const e = Oa(r);
    return I1.parse(e);
  } catch (e) {
    throw console.error("Error parsing document payload:", e), new Error("Failed to parse document payload.");
  }
}
function O1(r, e) {
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
  return Uc(t);
}
async function T1(r, e) {
  try {
    console.log("SIGNATURE:"), console.log(Br(r.signature));
    const t = O1(r.protected, r.payload), n = await crypto.subtle.digest("SHA-384", t);
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
async function _i(r, e, t) {
  try {
    const n = await C1(r), i = await B1(n.payload);
    if (!i.nonce)
      throw new Error("Attestation document does not have a nonce.");
    const o = new TextDecoder("utf-8").decode(i.nonce);
    if (t !== o)
      throw console.log("Nonce mismatch"), console.log("Provided nonce:", t), console.log("Attestation document nonce:", o), new Error("Attestation document's nonce does not match the provided nonce.");
    const c = [], u = Br(i.cabundle[0]);
    if (u !== Br(e))
      throw console.error("Root cert doesn't match first cert"), console.log("First cert base64:", u), console.log("Trusted root cert base64:", Br(e)), new Error("Root cert does not match first cert in attestation document.");
    for (let I = 0; I < i.cabundle.length; I++) {
      const P = new bi(i.cabundle[I]);
      c.push(P);
    }
    const h = new bi(i.certificate), x = await new Yv({
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
    const A = await v.export(), O = await T1(n, A);
    if (console.log("Signature verified:", O), !O)
      throw new Error("Signature verification failed.");
    return i;
  } catch (n) {
    throw console.error("Error verifying attestation document:", n), n;
  }
}
const N1 = Ct.object({
  public_key: Ct.nullable(Ct.instanceof(Uint8Array))
});
async function P1(r) {
  const e = Ds(r), n = Oa(e)[2], i = Oa(n);
  return await N1.parse(i);
}
async function j1(r, e) {
  try {
    const t = await ew(r, e), n = e || Ye();
    return n && (n === "http://127.0.0.1:3000" || n === "http://localhost:3000" || n === "http://0.0.0.0:3000") ? (console.log("DEV MODE: Using fake attestation document"), await P1(t)) : await _i(t, $a, r);
  } catch (t) {
    throw t instanceof Error ? (console.error("Error verifying attestation document:", t), new Error(`Couldn't process attestation document: ${t.message}`)) : (console.error("Error verifying attestation document:", t), new Error("Couldn't process attestation document."));
  }
}
function R1(r) {
  throw new Error('Could not dynamically require "' + r + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var L0 = { exports: {} };
const U1 = {}, D1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: U1
}, Symbol.toStringTag, { value: "Module" })), $1 = /* @__PURE__ */ tg(D1);
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
    var o = t(), c = t([1]), u = t([56129, 1]), h = t([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]), m = t([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]), x = t([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]), z = t([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]), N = t([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);
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
      for (var g = a[0] & 255 | (a[1] & 255) << 8 | (a[2] & 255) << 16 | (a[3] & 255) << 24, S = d[0] & 255 | (d[1] & 255) << 8 | (d[2] & 255) << 16 | (d[3] & 255) << 24, E = d[4] & 255 | (d[5] & 255) << 8 | (d[6] & 255) << 16 | (d[7] & 255) << 24, U = d[8] & 255 | (d[9] & 255) << 8 | (d[10] & 255) << 16 | (d[11] & 255) << 24, G = d[12] & 255 | (d[13] & 255) << 8 | (d[14] & 255) << 16 | (d[15] & 255) << 24, me = a[4] & 255 | (a[5] & 255) << 8 | (a[6] & 255) << 16 | (a[7] & 255) << 24, J = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, lt = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, oe = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, ke = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, Ce = a[8] & 255 | (a[9] & 255) << 8 | (a[10] & 255) << 16 | (a[11] & 255) << 24, $e = d[16] & 255 | (d[17] & 255) << 8 | (d[18] & 255) << 16 | (d[19] & 255) << 24, Re = d[20] & 255 | (d[21] & 255) << 8 | (d[22] & 255) << 16 | (d[23] & 255) << 24, Be = d[24] & 255 | (d[25] & 255) << 8 | (d[26] & 255) << 16 | (d[27] & 255) << 24, Ne = d[28] & 255 | (d[29] & 255) << 8 | (d[30] & 255) << 16 | (d[31] & 255) << 24, Oe = a[12] & 255 | (a[13] & 255) << 8 | (a[14] & 255) << 16 | (a[15] & 255) << 24, he = g, xe = S, te = E, de = U, ye = G, Y = me, C = J, B = lt, V = oe, j = ke, D = Ce, L = $e, Se = Re, Me = Be, He = Ne, Ve = Oe, w, Ze = 0; Ze < 20; Ze += 2)
        w = he + Se | 0, ye ^= w << 7 | w >>> 25, w = ye + he | 0, V ^= w << 9 | w >>> 23, w = V + ye | 0, Se ^= w << 13 | w >>> 19, w = Se + V | 0, he ^= w << 18 | w >>> 14, w = Y + xe | 0, j ^= w << 7 | w >>> 25, w = j + Y | 0, Me ^= w << 9 | w >>> 23, w = Me + j | 0, xe ^= w << 13 | w >>> 19, w = xe + Me | 0, Y ^= w << 18 | w >>> 14, w = D + C | 0, He ^= w << 7 | w >>> 25, w = He + D | 0, te ^= w << 9 | w >>> 23, w = te + He | 0, C ^= w << 13 | w >>> 19, w = C + te | 0, D ^= w << 18 | w >>> 14, w = Ve + L | 0, de ^= w << 7 | w >>> 25, w = de + Ve | 0, B ^= w << 9 | w >>> 23, w = B + de | 0, L ^= w << 13 | w >>> 19, w = L + B | 0, Ve ^= w << 18 | w >>> 14, w = he + de | 0, xe ^= w << 7 | w >>> 25, w = xe + he | 0, te ^= w << 9 | w >>> 23, w = te + xe | 0, de ^= w << 13 | w >>> 19, w = de + te | 0, he ^= w << 18 | w >>> 14, w = Y + ye | 0, C ^= w << 7 | w >>> 25, w = C + Y | 0, B ^= w << 9 | w >>> 23, w = B + C | 0, ye ^= w << 13 | w >>> 19, w = ye + B | 0, Y ^= w << 18 | w >>> 14, w = D + j | 0, L ^= w << 7 | w >>> 25, w = L + D | 0, V ^= w << 9 | w >>> 23, w = V + L | 0, j ^= w << 13 | w >>> 19, w = j + V | 0, D ^= w << 18 | w >>> 14, w = Ve + He | 0, Se ^= w << 7 | w >>> 25, w = Se + Ve | 0, Me ^= w << 9 | w >>> 23, w = Me + Se | 0, He ^= w << 13 | w >>> 19, w = He + Me | 0, Ve ^= w << 18 | w >>> 14;
      he = he + g | 0, xe = xe + S | 0, te = te + E | 0, de = de + U | 0, ye = ye + G | 0, Y = Y + me | 0, C = C + J | 0, B = B + lt | 0, V = V + oe | 0, j = j + ke | 0, D = D + Ce | 0, L = L + $e | 0, Se = Se + Re | 0, Me = Me + Be | 0, He = He + Ne | 0, Ve = Ve + Oe | 0, l[0] = he >>> 0 & 255, l[1] = he >>> 8 & 255, l[2] = he >>> 16 & 255, l[3] = he >>> 24 & 255, l[4] = xe >>> 0 & 255, l[5] = xe >>> 8 & 255, l[6] = xe >>> 16 & 255, l[7] = xe >>> 24 & 255, l[8] = te >>> 0 & 255, l[9] = te >>> 8 & 255, l[10] = te >>> 16 & 255, l[11] = te >>> 24 & 255, l[12] = de >>> 0 & 255, l[13] = de >>> 8 & 255, l[14] = de >>> 16 & 255, l[15] = de >>> 24 & 255, l[16] = ye >>> 0 & 255, l[17] = ye >>> 8 & 255, l[18] = ye >>> 16 & 255, l[19] = ye >>> 24 & 255, l[20] = Y >>> 0 & 255, l[21] = Y >>> 8 & 255, l[22] = Y >>> 16 & 255, l[23] = Y >>> 24 & 255, l[24] = C >>> 0 & 255, l[25] = C >>> 8 & 255, l[26] = C >>> 16 & 255, l[27] = C >>> 24 & 255, l[28] = B >>> 0 & 255, l[29] = B >>> 8 & 255, l[30] = B >>> 16 & 255, l[31] = B >>> 24 & 255, l[32] = V >>> 0 & 255, l[33] = V >>> 8 & 255, l[34] = V >>> 16 & 255, l[35] = V >>> 24 & 255, l[36] = j >>> 0 & 255, l[37] = j >>> 8 & 255, l[38] = j >>> 16 & 255, l[39] = j >>> 24 & 255, l[40] = D >>> 0 & 255, l[41] = D >>> 8 & 255, l[42] = D >>> 16 & 255, l[43] = D >>> 24 & 255, l[44] = L >>> 0 & 255, l[45] = L >>> 8 & 255, l[46] = L >>> 16 & 255, l[47] = L >>> 24 & 255, l[48] = Se >>> 0 & 255, l[49] = Se >>> 8 & 255, l[50] = Se >>> 16 & 255, l[51] = Se >>> 24 & 255, l[52] = Me >>> 0 & 255, l[53] = Me >>> 8 & 255, l[54] = Me >>> 16 & 255, l[55] = Me >>> 24 & 255, l[56] = He >>> 0 & 255, l[57] = He >>> 8 & 255, l[58] = He >>> 16 & 255, l[59] = He >>> 24 & 255, l[60] = Ve >>> 0 & 255, l[61] = Ve >>> 8 & 255, l[62] = Ve >>> 16 & 255, l[63] = Ve >>> 24 & 255;
    }
    function R(l, p, d, a) {
      for (var g = a[0] & 255 | (a[1] & 255) << 8 | (a[2] & 255) << 16 | (a[3] & 255) << 24, S = d[0] & 255 | (d[1] & 255) << 8 | (d[2] & 255) << 16 | (d[3] & 255) << 24, E = d[4] & 255 | (d[5] & 255) << 8 | (d[6] & 255) << 16 | (d[7] & 255) << 24, U = d[8] & 255 | (d[9] & 255) << 8 | (d[10] & 255) << 16 | (d[11] & 255) << 24, G = d[12] & 255 | (d[13] & 255) << 8 | (d[14] & 255) << 16 | (d[15] & 255) << 24, me = a[4] & 255 | (a[5] & 255) << 8 | (a[6] & 255) << 16 | (a[7] & 255) << 24, J = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, lt = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, oe = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, ke = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, Ce = a[8] & 255 | (a[9] & 255) << 8 | (a[10] & 255) << 16 | (a[11] & 255) << 24, $e = d[16] & 255 | (d[17] & 255) << 8 | (d[18] & 255) << 16 | (d[19] & 255) << 24, Re = d[20] & 255 | (d[21] & 255) << 8 | (d[22] & 255) << 16 | (d[23] & 255) << 24, Be = d[24] & 255 | (d[25] & 255) << 8 | (d[26] & 255) << 16 | (d[27] & 255) << 24, Ne = d[28] & 255 | (d[29] & 255) << 8 | (d[30] & 255) << 16 | (d[31] & 255) << 24, Oe = a[12] & 255 | (a[13] & 255) << 8 | (a[14] & 255) << 16 | (a[15] & 255) << 24, he = g, xe = S, te = E, de = U, ye = G, Y = me, C = J, B = lt, V = oe, j = ke, D = Ce, L = $e, Se = Re, Me = Be, He = Ne, Ve = Oe, w, Ze = 0; Ze < 20; Ze += 2)
        w = he + Se | 0, ye ^= w << 7 | w >>> 25, w = ye + he | 0, V ^= w << 9 | w >>> 23, w = V + ye | 0, Se ^= w << 13 | w >>> 19, w = Se + V | 0, he ^= w << 18 | w >>> 14, w = Y + xe | 0, j ^= w << 7 | w >>> 25, w = j + Y | 0, Me ^= w << 9 | w >>> 23, w = Me + j | 0, xe ^= w << 13 | w >>> 19, w = xe + Me | 0, Y ^= w << 18 | w >>> 14, w = D + C | 0, He ^= w << 7 | w >>> 25, w = He + D | 0, te ^= w << 9 | w >>> 23, w = te + He | 0, C ^= w << 13 | w >>> 19, w = C + te | 0, D ^= w << 18 | w >>> 14, w = Ve + L | 0, de ^= w << 7 | w >>> 25, w = de + Ve | 0, B ^= w << 9 | w >>> 23, w = B + de | 0, L ^= w << 13 | w >>> 19, w = L + B | 0, Ve ^= w << 18 | w >>> 14, w = he + de | 0, xe ^= w << 7 | w >>> 25, w = xe + he | 0, te ^= w << 9 | w >>> 23, w = te + xe | 0, de ^= w << 13 | w >>> 19, w = de + te | 0, he ^= w << 18 | w >>> 14, w = Y + ye | 0, C ^= w << 7 | w >>> 25, w = C + Y | 0, B ^= w << 9 | w >>> 23, w = B + C | 0, ye ^= w << 13 | w >>> 19, w = ye + B | 0, Y ^= w << 18 | w >>> 14, w = D + j | 0, L ^= w << 7 | w >>> 25, w = L + D | 0, V ^= w << 9 | w >>> 23, w = V + L | 0, j ^= w << 13 | w >>> 19, w = j + V | 0, D ^= w << 18 | w >>> 14, w = Ve + He | 0, Se ^= w << 7 | w >>> 25, w = Se + Ve | 0, Me ^= w << 9 | w >>> 23, w = Me + Se | 0, He ^= w << 13 | w >>> 19, w = He + Me | 0, Ve ^= w << 18 | w >>> 14;
      l[0] = he >>> 0 & 255, l[1] = he >>> 8 & 255, l[2] = he >>> 16 & 255, l[3] = he >>> 24 & 255, l[4] = Y >>> 0 & 255, l[5] = Y >>> 8 & 255, l[6] = Y >>> 16 & 255, l[7] = Y >>> 24 & 255, l[8] = D >>> 0 & 255, l[9] = D >>> 8 & 255, l[10] = D >>> 16 & 255, l[11] = D >>> 24 & 255, l[12] = Ve >>> 0 & 255, l[13] = Ve >>> 8 & 255, l[14] = Ve >>> 16 & 255, l[15] = Ve >>> 24 & 255, l[16] = C >>> 0 & 255, l[17] = C >>> 8 & 255, l[18] = C >>> 16 & 255, l[19] = C >>> 24 & 255, l[20] = B >>> 0 & 255, l[21] = B >>> 8 & 255, l[22] = B >>> 16 & 255, l[23] = B >>> 24 & 255, l[24] = V >>> 0 & 255, l[25] = V >>> 8 & 255, l[26] = V >>> 16 & 255, l[27] = V >>> 24 & 255, l[28] = j >>> 0 & 255, l[29] = j >>> 8 & 255, l[30] = j >>> 16 & 255, l[31] = j >>> 24 & 255;
    }
    function ae(l, p, d, a) {
      P(l, p, d, a);
    }
    function Ge(l, p, d, a) {
      R(l, p, d, a);
    }
    var Je = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
    function Pe(l, p, d, a, g, S, E) {
      var U = new Uint8Array(16), G = new Uint8Array(64), me, J;
      for (J = 0; J < 16; J++) U[J] = 0;
      for (J = 0; J < 8; J++) U[J] = S[J];
      for (; g >= 64; ) {
        for (ae(G, U, E, Je), J = 0; J < 64; J++) l[p + J] = d[a + J] ^ G[J];
        for (me = 1, J = 8; J < 16; J++)
          me = me + (U[J] & 255) | 0, U[J] = me & 255, me >>>= 8;
        g -= 64, p += 64, a += 64;
      }
      if (g > 0)
        for (ae(G, U, E, Je), J = 0; J < g; J++) l[p + J] = d[a + J] ^ G[J];
      return 0;
    }
    function ce(l, p, d, a, g) {
      var S = new Uint8Array(16), E = new Uint8Array(64), U, G;
      for (G = 0; G < 16; G++) S[G] = 0;
      for (G = 0; G < 8; G++) S[G] = a[G];
      for (; d >= 64; ) {
        for (ae(E, S, g, Je), G = 0; G < 64; G++) l[p + G] = E[G];
        for (U = 1, G = 8; G < 16; G++)
          U = U + (S[G] & 255) | 0, S[G] = U & 255, U >>>= 8;
        d -= 64, p += 64;
      }
      if (d > 0)
        for (ae(E, S, g, Je), G = 0; G < d; G++) l[p + G] = E[G];
      return 0;
    }
    function ve(l, p, d, a, g) {
      var S = new Uint8Array(32);
      Ge(S, a, g, Je);
      for (var E = new Uint8Array(8), U = 0; U < 8; U++) E[U] = a[U + 16];
      return ce(l, p, d, E, S);
    }
    function we(l, p, d, a, g, S, E) {
      var U = new Uint8Array(32);
      Ge(U, S, E, Je);
      for (var G = new Uint8Array(8), me = 0; me < 8; me++) G[me] = S[me + 16];
      return Pe(l, p, d, a, g, G, U);
    }
    var ze = function(l) {
      this.buffer = new Uint8Array(16), this.r = new Uint16Array(10), this.h = new Uint16Array(10), this.pad = new Uint16Array(8), this.leftover = 0, this.fin = 0;
      var p, d, a, g, S, E, U, G;
      p = l[0] & 255 | (l[1] & 255) << 8, this.r[0] = p & 8191, d = l[2] & 255 | (l[3] & 255) << 8, this.r[1] = (p >>> 13 | d << 3) & 8191, a = l[4] & 255 | (l[5] & 255) << 8, this.r[2] = (d >>> 10 | a << 6) & 7939, g = l[6] & 255 | (l[7] & 255) << 8, this.r[3] = (a >>> 7 | g << 9) & 8191, S = l[8] & 255 | (l[9] & 255) << 8, this.r[4] = (g >>> 4 | S << 12) & 255, this.r[5] = S >>> 1 & 8190, E = l[10] & 255 | (l[11] & 255) << 8, this.r[6] = (S >>> 14 | E << 2) & 8191, U = l[12] & 255 | (l[13] & 255) << 8, this.r[7] = (E >>> 11 | U << 5) & 8065, G = l[14] & 255 | (l[15] & 255) << 8, this.r[8] = (U >>> 8 | G << 8) & 8191, this.r[9] = G >>> 5 & 127, this.pad[0] = l[16] & 255 | (l[17] & 255) << 8, this.pad[1] = l[18] & 255 | (l[19] & 255) << 8, this.pad[2] = l[20] & 255 | (l[21] & 255) << 8, this.pad[3] = l[22] & 255 | (l[23] & 255) << 8, this.pad[4] = l[24] & 255 | (l[25] & 255) << 8, this.pad[5] = l[26] & 255 | (l[27] & 255) << 8, this.pad[6] = l[28] & 255 | (l[29] & 255) << 8, this.pad[7] = l[30] & 255 | (l[31] & 255) << 8;
    };
    ze.prototype.blocks = function(l, p, d) {
      for (var a = this.fin ? 0 : 2048, g, S, E, U, G, me, J, lt, oe, ke, Ce, $e, Re, Be, Ne, Oe, he, xe, te, de = this.h[0], ye = this.h[1], Y = this.h[2], C = this.h[3], B = this.h[4], V = this.h[5], j = this.h[6], D = this.h[7], L = this.h[8], Se = this.h[9], Me = this.r[0], He = this.r[1], Ve = this.r[2], w = this.r[3], Ze = this.r[4], ut = this.r[5], ft = this.r[6], Ke = this.r[7], st = this.r[8], ot = this.r[9]; d >= 16; )
        g = l[p + 0] & 255 | (l[p + 1] & 255) << 8, de += g & 8191, S = l[p + 2] & 255 | (l[p + 3] & 255) << 8, ye += (g >>> 13 | S << 3) & 8191, E = l[p + 4] & 255 | (l[p + 5] & 255) << 8, Y += (S >>> 10 | E << 6) & 8191, U = l[p + 6] & 255 | (l[p + 7] & 255) << 8, C += (E >>> 7 | U << 9) & 8191, G = l[p + 8] & 255 | (l[p + 9] & 255) << 8, B += (U >>> 4 | G << 12) & 8191, V += G >>> 1 & 8191, me = l[p + 10] & 255 | (l[p + 11] & 255) << 8, j += (G >>> 14 | me << 2) & 8191, J = l[p + 12] & 255 | (l[p + 13] & 255) << 8, D += (me >>> 11 | J << 5) & 8191, lt = l[p + 14] & 255 | (l[p + 15] & 255) << 8, L += (J >>> 8 | lt << 8) & 8191, Se += lt >>> 5 | a, oe = 0, ke = oe, ke += de * Me, ke += ye * (5 * ot), ke += Y * (5 * st), ke += C * (5 * Ke), ke += B * (5 * ft), oe = ke >>> 13, ke &= 8191, ke += V * (5 * ut), ke += j * (5 * Ze), ke += D * (5 * w), ke += L * (5 * Ve), ke += Se * (5 * He), oe += ke >>> 13, ke &= 8191, Ce = oe, Ce += de * He, Ce += ye * Me, Ce += Y * (5 * ot), Ce += C * (5 * st), Ce += B * (5 * Ke), oe = Ce >>> 13, Ce &= 8191, Ce += V * (5 * ft), Ce += j * (5 * ut), Ce += D * (5 * Ze), Ce += L * (5 * w), Ce += Se * (5 * Ve), oe += Ce >>> 13, Ce &= 8191, $e = oe, $e += de * Ve, $e += ye * He, $e += Y * Me, $e += C * (5 * ot), $e += B * (5 * st), oe = $e >>> 13, $e &= 8191, $e += V * (5 * Ke), $e += j * (5 * ft), $e += D * (5 * ut), $e += L * (5 * Ze), $e += Se * (5 * w), oe += $e >>> 13, $e &= 8191, Re = oe, Re += de * w, Re += ye * Ve, Re += Y * He, Re += C * Me, Re += B * (5 * ot), oe = Re >>> 13, Re &= 8191, Re += V * (5 * st), Re += j * (5 * Ke), Re += D * (5 * ft), Re += L * (5 * ut), Re += Se * (5 * Ze), oe += Re >>> 13, Re &= 8191, Be = oe, Be += de * Ze, Be += ye * w, Be += Y * Ve, Be += C * He, Be += B * Me, oe = Be >>> 13, Be &= 8191, Be += V * (5 * ot), Be += j * (5 * st), Be += D * (5 * Ke), Be += L * (5 * ft), Be += Se * (5 * ut), oe += Be >>> 13, Be &= 8191, Ne = oe, Ne += de * ut, Ne += ye * Ze, Ne += Y * w, Ne += C * Ve, Ne += B * He, oe = Ne >>> 13, Ne &= 8191, Ne += V * Me, Ne += j * (5 * ot), Ne += D * (5 * st), Ne += L * (5 * Ke), Ne += Se * (5 * ft), oe += Ne >>> 13, Ne &= 8191, Oe = oe, Oe += de * ft, Oe += ye * ut, Oe += Y * Ze, Oe += C * w, Oe += B * Ve, oe = Oe >>> 13, Oe &= 8191, Oe += V * He, Oe += j * Me, Oe += D * (5 * ot), Oe += L * (5 * st), Oe += Se * (5 * Ke), oe += Oe >>> 13, Oe &= 8191, he = oe, he += de * Ke, he += ye * ft, he += Y * ut, he += C * Ze, he += B * w, oe = he >>> 13, he &= 8191, he += V * Ve, he += j * He, he += D * Me, he += L * (5 * ot), he += Se * (5 * st), oe += he >>> 13, he &= 8191, xe = oe, xe += de * st, xe += ye * Ke, xe += Y * ft, xe += C * ut, xe += B * Ze, oe = xe >>> 13, xe &= 8191, xe += V * w, xe += j * Ve, xe += D * He, xe += L * Me, xe += Se * (5 * ot), oe += xe >>> 13, xe &= 8191, te = oe, te += de * ot, te += ye * st, te += Y * Ke, te += C * ft, te += B * ut, oe = te >>> 13, te &= 8191, te += V * Ze, te += j * w, te += D * Ve, te += L * He, te += Se * Me, oe += te >>> 13, te &= 8191, oe = (oe << 2) + oe | 0, oe = oe + ke | 0, ke = oe & 8191, oe = oe >>> 13, Ce += oe, de = ke, ye = Ce, Y = $e, C = Re, B = Be, V = Ne, j = Oe, D = he, L = xe, Se = te, p += 16, d -= 16;
      this.h[0] = de, this.h[1] = ye, this.h[2] = Y, this.h[3] = C, this.h[4] = B, this.h[5] = V, this.h[6] = j, this.h[7] = D, this.h[8] = L, this.h[9] = Se;
    }, ze.prototype.finish = function(l, p) {
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
    }, ze.prototype.update = function(l, p, d) {
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
      var E = new ze(S);
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
      if (d < 32 || (ve(E, 0, 32, a, g), Tt(p, 16, p, 32, d - 32, E) !== 0)) return -1;
      for (we(l, 0, p, 0, d, a, g), S = 0; S < 32; S++) l[S] = 0;
      return 0;
    }
    function Qe(l, p) {
      var d;
      for (d = 0; d < 16; d++) l[d] = p[d] | 0;
    }
    function ie(l) {
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
      for (ie(E), ie(E), ie(E), a = 0; a < 2; a++) {
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
      var a, g, S = 0, E = 0, U = 0, G = 0, me = 0, J = 0, lt = 0, oe = 0, ke = 0, Ce = 0, $e = 0, Re = 0, Be = 0, Ne = 0, Oe = 0, he = 0, xe = 0, te = 0, de = 0, ye = 0, Y = 0, C = 0, B = 0, V = 0, j = 0, D = 0, L = 0, Se = 0, Me = 0, He = 0, Ve = 0, w = d[0], Ze = d[1], ut = d[2], ft = d[3], Ke = d[4], st = d[5], ot = d[6], $t = d[7], mt = d[8], Nt = d[9], Pt = d[10], jt = d[11], Lt = d[12], Qt = d[13], er = d[14], tr = d[15];
      a = p[0], S += a * w, E += a * Ze, U += a * ut, G += a * ft, me += a * Ke, J += a * st, lt += a * ot, oe += a * $t, ke += a * mt, Ce += a * Nt, $e += a * Pt, Re += a * jt, Be += a * Lt, Ne += a * Qt, Oe += a * er, he += a * tr, a = p[1], E += a * w, U += a * Ze, G += a * ut, me += a * ft, J += a * Ke, lt += a * st, oe += a * ot, ke += a * $t, Ce += a * mt, $e += a * Nt, Re += a * Pt, Be += a * jt, Ne += a * Lt, Oe += a * Qt, he += a * er, xe += a * tr, a = p[2], U += a * w, G += a * Ze, me += a * ut, J += a * ft, lt += a * Ke, oe += a * st, ke += a * ot, Ce += a * $t, $e += a * mt, Re += a * Nt, Be += a * Pt, Ne += a * jt, Oe += a * Lt, he += a * Qt, xe += a * er, te += a * tr, a = p[3], G += a * w, me += a * Ze, J += a * ut, lt += a * ft, oe += a * Ke, ke += a * st, Ce += a * ot, $e += a * $t, Re += a * mt, Be += a * Nt, Ne += a * Pt, Oe += a * jt, he += a * Lt, xe += a * Qt, te += a * er, de += a * tr, a = p[4], me += a * w, J += a * Ze, lt += a * ut, oe += a * ft, ke += a * Ke, Ce += a * st, $e += a * ot, Re += a * $t, Be += a * mt, Ne += a * Nt, Oe += a * Pt, he += a * jt, xe += a * Lt, te += a * Qt, de += a * er, ye += a * tr, a = p[5], J += a * w, lt += a * Ze, oe += a * ut, ke += a * ft, Ce += a * Ke, $e += a * st, Re += a * ot, Be += a * $t, Ne += a * mt, Oe += a * Nt, he += a * Pt, xe += a * jt, te += a * Lt, de += a * Qt, ye += a * er, Y += a * tr, a = p[6], lt += a * w, oe += a * Ze, ke += a * ut, Ce += a * ft, $e += a * Ke, Re += a * st, Be += a * ot, Ne += a * $t, Oe += a * mt, he += a * Nt, xe += a * Pt, te += a * jt, de += a * Lt, ye += a * Qt, Y += a * er, C += a * tr, a = p[7], oe += a * w, ke += a * Ze, Ce += a * ut, $e += a * ft, Re += a * Ke, Be += a * st, Ne += a * ot, Oe += a * $t, he += a * mt, xe += a * Nt, te += a * Pt, de += a * jt, ye += a * Lt, Y += a * Qt, C += a * er, B += a * tr, a = p[8], ke += a * w, Ce += a * Ze, $e += a * ut, Re += a * ft, Be += a * Ke, Ne += a * st, Oe += a * ot, he += a * $t, xe += a * mt, te += a * Nt, de += a * Pt, ye += a * jt, Y += a * Lt, C += a * Qt, B += a * er, V += a * tr, a = p[9], Ce += a * w, $e += a * Ze, Re += a * ut, Be += a * ft, Ne += a * Ke, Oe += a * st, he += a * ot, xe += a * $t, te += a * mt, de += a * Nt, ye += a * Pt, Y += a * jt, C += a * Lt, B += a * Qt, V += a * er, j += a * tr, a = p[10], $e += a * w, Re += a * Ze, Be += a * ut, Ne += a * ft, Oe += a * Ke, he += a * st, xe += a * ot, te += a * $t, de += a * mt, ye += a * Nt, Y += a * Pt, C += a * jt, B += a * Lt, V += a * Qt, j += a * er, D += a * tr, a = p[11], Re += a * w, Be += a * Ze, Ne += a * ut, Oe += a * ft, he += a * Ke, xe += a * st, te += a * ot, de += a * $t, ye += a * mt, Y += a * Nt, C += a * Pt, B += a * jt, V += a * Lt, j += a * Qt, D += a * er, L += a * tr, a = p[12], Be += a * w, Ne += a * Ze, Oe += a * ut, he += a * ft, xe += a * Ke, te += a * st, de += a * ot, ye += a * $t, Y += a * mt, C += a * Nt, B += a * Pt, V += a * jt, j += a * Lt, D += a * Qt, L += a * er, Se += a * tr, a = p[13], Ne += a * w, Oe += a * Ze, he += a * ut, xe += a * ft, te += a * Ke, de += a * st, ye += a * ot, Y += a * $t, C += a * mt, B += a * Nt, V += a * Pt, j += a * jt, D += a * Lt, L += a * Qt, Se += a * er, Me += a * tr, a = p[14], Oe += a * w, he += a * Ze, xe += a * ut, te += a * ft, de += a * Ke, ye += a * st, Y += a * ot, C += a * $t, B += a * mt, V += a * Nt, j += a * Pt, D += a * jt, L += a * Lt, Se += a * Qt, Me += a * er, He += a * tr, a = p[15], he += a * w, xe += a * Ze, te += a * ut, de += a * ft, ye += a * Ke, Y += a * st, C += a * ot, B += a * $t, V += a * mt, j += a * Nt, D += a * Pt, L += a * jt, Se += a * Lt, Me += a * Qt, He += a * er, Ve += a * tr, S += 38 * xe, E += 38 * te, U += 38 * de, G += 38 * ye, me += 38 * Y, J += 38 * C, lt += 38 * B, oe += 38 * V, ke += 38 * j, Ce += 38 * D, $e += 38 * L, Re += 38 * Se, Be += 38 * Me, Ne += 38 * He, Oe += 38 * Ve, g = 1, a = S + g + 65535, g = Math.floor(a / 65536), S = a - g * 65536, a = E + g + 65535, g = Math.floor(a / 65536), E = a - g * 65536, a = U + g + 65535, g = Math.floor(a / 65536), U = a - g * 65536, a = G + g + 65535, g = Math.floor(a / 65536), G = a - g * 65536, a = me + g + 65535, g = Math.floor(a / 65536), me = a - g * 65536, a = J + g + 65535, g = Math.floor(a / 65536), J = a - g * 65536, a = lt + g + 65535, g = Math.floor(a / 65536), lt = a - g * 65536, a = oe + g + 65535, g = Math.floor(a / 65536), oe = a - g * 65536, a = ke + g + 65535, g = Math.floor(a / 65536), ke = a - g * 65536, a = Ce + g + 65535, g = Math.floor(a / 65536), Ce = a - g * 65536, a = $e + g + 65535, g = Math.floor(a / 65536), $e = a - g * 65536, a = Re + g + 65535, g = Math.floor(a / 65536), Re = a - g * 65536, a = Be + g + 65535, g = Math.floor(a / 65536), Be = a - g * 65536, a = Ne + g + 65535, g = Math.floor(a / 65536), Ne = a - g * 65536, a = Oe + g + 65535, g = Math.floor(a / 65536), Oe = a - g * 65536, a = he + g + 65535, g = Math.floor(a / 65536), he = a - g * 65536, S += g - 1 + 37 * (g - 1), g = 1, a = S + g + 65535, g = Math.floor(a / 65536), S = a - g * 65536, a = E + g + 65535, g = Math.floor(a / 65536), E = a - g * 65536, a = U + g + 65535, g = Math.floor(a / 65536), U = a - g * 65536, a = G + g + 65535, g = Math.floor(a / 65536), G = a - g * 65536, a = me + g + 65535, g = Math.floor(a / 65536), me = a - g * 65536, a = J + g + 65535, g = Math.floor(a / 65536), J = a - g * 65536, a = lt + g + 65535, g = Math.floor(a / 65536), lt = a - g * 65536, a = oe + g + 65535, g = Math.floor(a / 65536), oe = a - g * 65536, a = ke + g + 65535, g = Math.floor(a / 65536), ke = a - g * 65536, a = Ce + g + 65535, g = Math.floor(a / 65536), Ce = a - g * 65536, a = $e + g + 65535, g = Math.floor(a / 65536), $e = a - g * 65536, a = Re + g + 65535, g = Math.floor(a / 65536), Re = a - g * 65536, a = Be + g + 65535, g = Math.floor(a / 65536), Be = a - g * 65536, a = Ne + g + 65535, g = Math.floor(a / 65536), Ne = a - g * 65536, a = Oe + g + 65535, g = Math.floor(a / 65536), Oe = a - g * 65536, a = he + g + 65535, g = Math.floor(a / 65536), he = a - g * 65536, S += g - 1 + 37 * (g - 1), l[0] = S, l[1] = E, l[2] = U, l[3] = G, l[4] = me, l[5] = J, l[6] = lt, l[7] = oe, l[8] = ke, l[9] = Ce, l[10] = $e, l[11] = Re, l[12] = Be, l[13] = Ne, l[14] = Oe, l[15] = he;
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
    function hs(l, p) {
      var d = t(), a;
      for (a = 0; a < 16; a++) d[a] = p[a];
      for (a = 250; a >= 0; a--)
        dt(d, d), a !== 1 && Q(d, d, p);
      for (a = 0; a < 16; a++) l[a] = d[a];
    }
    function Bi(l, p, d) {
      var a = new Uint8Array(32), g = new Float64Array(80), S, E, U = t(), G = t(), me = t(), J = t(), lt = t(), oe = t();
      for (E = 0; E < 31; E++) a[E] = p[E];
      for (a[31] = p[31] & 127 | 64, a[0] &= 248, le(g, d), E = 0; E < 16; E++)
        G[E] = g[E], J[E] = U[E] = me[E] = 0;
      for (U[0] = J[0] = 1, E = 254; E >= 0; --E)
        S = a[E >>> 3] >>> (E & 7) & 1, _e(U, G, S), _e(me, J, S), it(lt, U, me), gt(U, U, me), it(me, G, J), gt(G, G, J), dt(J, lt), dt(oe, U), Q(U, me, U), Q(me, G, lt), it(lt, U, me), gt(U, U, me), dt(G, U), gt(me, J, oe), Q(U, me, u), it(U, U, J), Q(me, me, U), Q(U, J, oe), Q(J, G, g), dt(G, lt), _e(U, G, S), _e(me, J, S);
      for (E = 0; E < 16; E++)
        g[E + 16] = U[E], g[E + 32] = me[E], g[E + 48] = G[E], g[E + 64] = J[E];
      var ke = g.subarray(32), Ce = g.subarray(16);
      return Vt(ke, ke), Q(Ce, Ce, ke), yt(l, Ce), 0;
    }
    function or(l, p) {
      return Bi(l, p, s);
    }
    function ds(l, p) {
      return n(p, 32), or(l, p);
    }
    function yn(l, p, d) {
      var a = new Uint8Array(32);
      return Bi(a, d, p), Ge(l, i, a, Je);
    }
    var ps = Et, Vc = ht;
    function ys(l, p, d, a, g, S) {
      var E = new Uint8Array(32);
      return yn(E, g, S), ps(l, p, d, a, E);
    }
    function Oo(l, p, d, a, g, S) {
      var E = new Uint8Array(32);
      return yn(E, g, S), Vc(l, p, d, a, E);
    }
    var gs = [
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
    function vs(l, p, d, a) {
      for (var g = new Int32Array(16), S = new Int32Array(16), E, U, G, me, J, lt, oe, ke, Ce, $e, Re, Be, Ne, Oe, he, xe, te, de, ye, Y, C, B, V, j, D, L, Se = l[0], Me = l[1], He = l[2], Ve = l[3], w = l[4], Ze = l[5], ut = l[6], ft = l[7], Ke = p[0], st = p[1], ot = p[2], $t = p[3], mt = p[4], Nt = p[5], Pt = p[6], jt = p[7], Lt = 0; a >= 128; ) {
        for (ye = 0; ye < 16; ye++)
          Y = 8 * ye + Lt, g[ye] = d[Y + 0] << 24 | d[Y + 1] << 16 | d[Y + 2] << 8 | d[Y + 3], S[ye] = d[Y + 4] << 24 | d[Y + 5] << 16 | d[Y + 6] << 8 | d[Y + 7];
        for (ye = 0; ye < 80; ye++)
          if (E = Se, U = Me, G = He, me = Ve, J = w, lt = Ze, oe = ut, ke = ft, Ce = Ke, $e = st, Re = ot, Be = $t, Ne = mt, Oe = Nt, he = Pt, xe = jt, C = ft, B = jt, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = (w >>> 14 | mt << 18) ^ (w >>> 18 | mt << 14) ^ (mt >>> 9 | w << 23), B = (mt >>> 14 | w << 18) ^ (mt >>> 18 | w << 14) ^ (w >>> 9 | mt << 23), V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, C = w & Ze ^ ~w & ut, B = mt & Nt ^ ~mt & Pt, V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, C = gs[ye * 2], B = gs[ye * 2 + 1], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, C = g[ye % 16], B = S[ye % 16], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, te = D & 65535 | L << 16, de = V & 65535 | j << 16, C = te, B = de, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = (Se >>> 28 | Ke << 4) ^ (Ke >>> 2 | Se << 30) ^ (Ke >>> 7 | Se << 25), B = (Ke >>> 28 | Se << 4) ^ (Se >>> 2 | Ke << 30) ^ (Se >>> 7 | Ke << 25), V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, C = Se & Me ^ Se & He ^ Me & He, B = Ke & st ^ Ke & ot ^ st & ot, V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, ke = D & 65535 | L << 16, xe = V & 65535 | j << 16, C = me, B = Be, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = te, B = de, V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, me = D & 65535 | L << 16, Be = V & 65535 | j << 16, Me = E, He = U, Ve = G, w = me, Ze = J, ut = lt, ft = oe, Se = ke, st = Ce, ot = $e, $t = Re, mt = Be, Nt = Ne, Pt = Oe, jt = he, Ke = xe, ye % 16 === 15)
            for (Y = 0; Y < 16; Y++)
              C = g[Y], B = S[Y], V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = g[(Y + 9) % 16], B = S[(Y + 9) % 16], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, te = g[(Y + 1) % 16], de = S[(Y + 1) % 16], C = (te >>> 1 | de << 31) ^ (te >>> 8 | de << 24) ^ te >>> 7, B = (de >>> 1 | te << 31) ^ (de >>> 8 | te << 24) ^ (de >>> 7 | te << 25), V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, te = g[(Y + 14) % 16], de = S[(Y + 14) % 16], C = (te >>> 19 | de << 13) ^ (de >>> 29 | te << 3) ^ te >>> 6, B = (de >>> 19 | te << 13) ^ (te >>> 29 | de << 3) ^ (de >>> 6 | te << 26), V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, g[Y] = D & 65535 | L << 16, S[Y] = V & 65535 | j << 16;
        C = Se, B = Ke, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[0], B = p[0], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[0] = Se = D & 65535 | L << 16, p[0] = Ke = V & 65535 | j << 16, C = Me, B = st, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[1], B = p[1], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[1] = Me = D & 65535 | L << 16, p[1] = st = V & 65535 | j << 16, C = He, B = ot, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[2], B = p[2], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[2] = He = D & 65535 | L << 16, p[2] = ot = V & 65535 | j << 16, C = Ve, B = $t, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[3], B = p[3], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[3] = Ve = D & 65535 | L << 16, p[3] = $t = V & 65535 | j << 16, C = w, B = mt, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[4], B = p[4], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[4] = w = D & 65535 | L << 16, p[4] = mt = V & 65535 | j << 16, C = Ze, B = Nt, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[5], B = p[5], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[5] = Ze = D & 65535 | L << 16, p[5] = Nt = V & 65535 | j << 16, C = ut, B = Pt, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[6], B = p[6], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[6] = ut = D & 65535 | L << 16, p[6] = Pt = V & 65535 | j << 16, C = ft, B = jt, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[7], B = p[7], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[7] = ft = D & 65535 | L << 16, p[7] = jt = V & 65535 | j << 16, Lt += 128, a -= 128;
      }
      return a;
    }
    function Wr(l, p, d) {
      var a = new Int32Array(8), g = new Int32Array(8), S = new Uint8Array(256), E, U = d;
      for (a[0] = 1779033703, a[1] = 3144134277, a[2] = 1013904242, a[3] = 2773480762, a[4] = 1359893119, a[5] = 2600822924, a[6] = 528734635, a[7] = 1541459225, g[0] = 4089235720, g[1] = 2227873595, g[2] = 4271175723, g[3] = 1595750129, g[4] = 2917565137, g[5] = 725511199, g[6] = 4215389547, g[7] = 327033209, vs(a, g, p, d), d %= 128, E = 0; E < d; E++) S[E] = p[U - d + E];
      for (S[d] = 128, d = 256 - 128 * (d < 112 ? 1 : 0), S[d - 9] = 0, v(S, d - 8, U / 536870912 | 0, U << 3), vs(a, g, S, d), E = 0; E < 8; E++) v(l, 8 * E, a[E], g[E]);
      return 0;
    }
    function Qn(l, p) {
      var d = t(), a = t(), g = t(), S = t(), E = t(), U = t(), G = t(), me = t(), J = t();
      gt(d, l[1], l[0]), gt(J, p[1], p[0]), Q(d, d, J), it(a, l[0], l[1]), it(J, p[0], p[1]), Q(a, a, J), Q(g, l[3], p[3]), Q(g, g, m), Q(S, l[2], p[2]), it(S, S, S), gt(E, a, d), gt(U, S, g), it(G, S, g), it(me, a, d), Q(l[0], E, U), Q(l[1], me, G), Q(l[2], G, U), Q(l[3], E, me);
    }
    function Oi(l, p, d) {
      var a;
      for (a = 0; a < 4; a++)
        _e(l[a], p[a], d);
    }
    function ms(l, p) {
      var d = t(), a = t(), g = t();
      Vt(g, p[2]), Q(d, p[0], g), Q(a, p[1], g), yt(l, a), l[31] ^= Dt(d) << 7;
    }
    function ws(l, p, d) {
      var a, g;
      for (Qe(l[0], o), Qe(l[1], c), Qe(l[2], c), Qe(l[3], o), g = 255; g >= 0; --g)
        a = d[g / 8 | 0] >> (g & 7) & 1, Oi(l, p, a), Qn(p, l), Qn(l, l), Oi(l, p, a);
    }
    function Ti(l, p) {
      var d = [t(), t(), t(), t()];
      Qe(d[0], x), Qe(d[1], z), Qe(d[2], c), Q(d[3], x, z), ws(l, d, p);
    }
    function bs(l, p, d) {
      var a = new Uint8Array(64), g = [t(), t(), t(), t()], S;
      for (d || n(p, 32), Wr(a, p, 32), a[0] &= 248, a[31] &= 127, a[31] |= 64, Ti(g, a), ms(l, g), S = 0; S < 32; S++) p[S + 32] = l[S];
      return 0;
    }
    var Yr = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);
    function xs(l, p) {
      var d, a, g, S;
      for (a = 63; a >= 32; --a) {
        for (d = 0, g = a - 32, S = a - 12; g < S; ++g)
          p[g] += d - 16 * p[a] * Yr[g - (a - 32)], d = Math.floor((p[g] + 128) / 256), p[g] -= d * 256;
        p[g] += d, p[a] = 0;
      }
      for (d = 0, g = 0; g < 32; g++)
        p[g] += d - (p[31] >> 4) * Yr[g], d = p[g] >> 8, p[g] &= 255;
      for (g = 0; g < 32; g++) p[g] -= d * Yr[g];
      for (a = 0; a < 32; a++)
        p[a + 1] += p[a] >> 8, l[a] = p[a] & 255;
    }
    function As(l) {
      var p = new Float64Array(64), d;
      for (d = 0; d < 64; d++) p[d] = l[d];
      for (d = 0; d < 64; d++) l[d] = 0;
      xs(l, p);
    }
    function To(l, p, d, a) {
      var g = new Uint8Array(64), S = new Uint8Array(64), E = new Uint8Array(64), U, G, me = new Float64Array(64), J = [t(), t(), t(), t()];
      Wr(g, a, 32), g[0] &= 248, g[31] &= 127, g[31] |= 64;
      var lt = d + 64;
      for (U = 0; U < d; U++) l[64 + U] = p[U];
      for (U = 0; U < 32; U++) l[32 + U] = g[32 + U];
      for (Wr(E, l.subarray(32), d + 32), As(E), Ti(J, E), ms(l, J), U = 32; U < 64; U++) l[U] = a[U];
      for (Wr(S, l, d + 64), As(S), U = 0; U < 64; U++) me[U] = 0;
      for (U = 0; U < 32; U++) me[U] = E[U];
      for (U = 0; U < 32; U++)
        for (G = 0; G < 32; G++)
          me[U + G] += S[U] * g[G];
      return xs(l.subarray(32), me), lt;
    }
    function Ss(l, p) {
      var d = t(), a = t(), g = t(), S = t(), E = t(), U = t(), G = t();
      return Qe(l[2], c), le(l[1], p), dt(g, l[1]), Q(S, g, h), gt(g, g, l[2]), it(S, l[2], S), dt(E, S), dt(U, E), Q(G, U, E), Q(d, G, g), Q(d, d, S), hs(d, d), Q(d, d, g), Q(d, d, S), Q(d, d, S), Q(l[0], d, S), dt(a, l[0]), Q(a, a, S), Ut(a, g) && Q(l[0], l[0], N), dt(a, l[0]), Q(a, a, S), Ut(a, g) ? -1 : (Dt(l[0]) === p[31] >> 7 && gt(l[0], o, l[0]), Q(l[3], l[0], l[1]), 0);
    }
    function _(l, p, d, a) {
      var g, S = new Uint8Array(32), E = new Uint8Array(64), U = [t(), t(), t(), t()], G = [t(), t(), t(), t()];
      if (d < 64 || Ss(G, a)) return -1;
      for (g = 0; g < d; g++) l[g] = p[g];
      for (g = 0; g < 32; g++) l[g + 32] = a[g];
      if (Wr(E, l, d), As(E), ws(U, G, E), Ti(G, p.subarray(32)), Qn(U, G), ms(S, U), d -= 64, I(p, 0, S, 0)) {
        for (g = 0; g < d; g++) l[g] = 0;
        return -1;
      }
      for (g = 0; g < d; g++) l[g] = p[g + 64];
      return d;
    }
    var k = 32, T = 24, K = 32, be = 16, At = 32, St = 32, je = 32, Z = 32, ee = 32, ue = T, pe = K, Xe = be, tt = 64, vt = 32, Gt = 64, Ni = 32, _s = 64;
    e.lowlevel = {
      crypto_core_hsalsa20: Ge,
      crypto_stream_xor: we,
      crypto_stream: ve,
      crypto_stream_salsa20_xor: Pe,
      crypto_stream_salsa20: ce,
      crypto_onetimeauth: bt,
      crypto_onetimeauth_verify: Tt,
      crypto_verify_16: O,
      crypto_verify_32: I,
      crypto_secretbox: Et,
      crypto_secretbox_open: ht,
      crypto_scalarmult: Bi,
      crypto_scalarmult_base: or,
      crypto_box_beforenm: yn,
      crypto_box_afternm: ps,
      crypto_box: ys,
      crypto_box_open: Oo,
      crypto_box_keypair: ds,
      crypto_hash: Wr,
      crypto_sign: To,
      crypto_sign_keypair: bs,
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
      crypto_box_ZEROBYTES: pe,
      crypto_box_BOXZEROBYTES: Xe,
      crypto_sign_BYTES: tt,
      crypto_sign_PUBLICKEYBYTES: vt,
      crypto_sign_SECRETKEYBYTES: Gt,
      crypto_sign_SEEDBYTES: Ni,
      crypto_hash_BYTES: _s,
      gf: t,
      D: h,
      L: Yr,
      pack25519: yt,
      unpack25519: le,
      M: Q,
      A: it,
      S: dt,
      Z: gt,
      pow2523: hs,
      add: Qn,
      set25519: Qe,
      modL: xs,
      scalarmult: ws,
      scalarbase: Ti
    };
    function No(l, p) {
      if (l.length !== k) throw new Error("bad key size");
      if (p.length !== T) throw new Error("bad nonce size");
    }
    function jy(l, p) {
      if (l.length !== je) throw new Error("bad public key size");
      if (p.length !== Z) throw new Error("bad secret key size");
    }
    function xr() {
      for (var l = 0; l < arguments.length; l++)
        if (!(arguments[l] instanceof Uint8Array))
          throw new TypeError("unexpected type, use Uint8Array");
    }
    function kf(l) {
      for (var p = 0; p < l.length; p++) l[p] = 0;
    }
    e.randomBytes = function(l) {
      var p = new Uint8Array(l);
      return n(p, l), p;
    }, e.secretbox = function(l, p, d) {
      xr(l, p, d), No(d, p);
      for (var a = new Uint8Array(K + l.length), g = new Uint8Array(a.length), S = 0; S < l.length; S++) a[S + K] = l[S];
      return Et(g, a, a.length, p, d), g.subarray(be);
    }, e.secretbox.open = function(l, p, d) {
      xr(l, p, d), No(d, p);
      for (var a = new Uint8Array(be + l.length), g = new Uint8Array(a.length), S = 0; S < l.length; S++) a[S + be] = l[S];
      return a.length < 32 || ht(g, a, a.length, p, d) !== 0 ? null : g.subarray(K);
    }, e.secretbox.keyLength = k, e.secretbox.nonceLength = T, e.secretbox.overheadLength = be, e.scalarMult = function(l, p) {
      if (xr(l, p), l.length !== St) throw new Error("bad n size");
      if (p.length !== At) throw new Error("bad p size");
      var d = new Uint8Array(At);
      return Bi(d, l, p), d;
    }, e.scalarMult.base = function(l) {
      if (xr(l), l.length !== St) throw new Error("bad n size");
      var p = new Uint8Array(At);
      return or(p, l), p;
    }, e.scalarMult.scalarLength = St, e.scalarMult.groupElementLength = At, e.box = function(l, p, d, a) {
      var g = e.box.before(d, a);
      return e.secretbox(l, p, g);
    }, e.box.before = function(l, p) {
      xr(l, p), jy(l, p);
      var d = new Uint8Array(ee);
      return yn(d, l, p), d;
    }, e.box.after = e.secretbox, e.box.open = function(l, p, d, a) {
      var g = e.box.before(d, a);
      return e.secretbox.open(l, p, g);
    }, e.box.open.after = e.secretbox.open, e.box.keyPair = function() {
      var l = new Uint8Array(je), p = new Uint8Array(Z);
      return ds(l, p), { publicKey: l, secretKey: p };
    }, e.box.keyPair.fromSecretKey = function(l) {
      if (xr(l), l.length !== Z)
        throw new Error("bad secret key size");
      var p = new Uint8Array(je);
      return or(p, l), { publicKey: p, secretKey: new Uint8Array(l) };
    }, e.box.publicKeyLength = je, e.box.secretKeyLength = Z, e.box.sharedKeyLength = ee, e.box.nonceLength = ue, e.box.overheadLength = e.secretbox.overheadLength, e.sign = function(l, p) {
      if (xr(l, p), p.length !== Gt)
        throw new Error("bad secret key size");
      var d = new Uint8Array(tt + l.length);
      return To(d, l, l.length, p), d;
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
      var l = new Uint8Array(vt), p = new Uint8Array(Gt);
      return bs(l, p), { publicKey: l, secretKey: p };
    }, e.sign.keyPair.fromSecretKey = function(l) {
      if (xr(l), l.length !== Gt)
        throw new Error("bad secret key size");
      for (var p = new Uint8Array(vt), d = 0; d < p.length; d++) p[d] = l[32 + d];
      return { publicKey: p, secretKey: new Uint8Array(l) };
    }, e.sign.keyPair.fromSeed = function(l) {
      if (xr(l), l.length !== Ni)
        throw new Error("bad seed size");
      for (var p = new Uint8Array(vt), d = new Uint8Array(Gt), a = 0; a < 32; a++) d[a] = l[a];
      return bs(p, d, !0), { publicKey: p, secretKey: d };
    }, e.sign.publicKeyLength = vt, e.sign.secretKeyLength = Gt, e.sign.seedLength = Ni, e.sign.signatureLength = tt, e.hash = function(l) {
      xr(l);
      var p = new Uint8Array(_s);
      return Wr(p, l, l.length), p;
    }, e.hash.hashLength = _s, e.verify = function(l, p) {
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
          kf(S);
        });
      } else typeof R1 < "u" && (l = $1, l && l.randomBytes && e.setPRNG(function(d, a) {
        var g, S = l.randomBytes(a);
        for (g = 0; g < a; g++) d[g] = S[g];
        kf(S);
      }));
    }();
  })(r.exports ? r.exports : self.nacl = self.nacl || {});
})(L0);
var M1 = L0.exports;
const H0 = /* @__PURE__ */ eg(M1);
function V1() {
  return H0.box.keyPair();
}
async function Ei(r, e) {
  const t = sessionStorage.getItem("sessionKey"), n = sessionStorage.getItem("sessionId");
  console.groupCollapsed("Attestation");
  try {
    if (t && n && !r) {
      const o = Ds(t);
      return console.log("Using existing attestation from session storage."), { sessionKey: o, sessionId: n };
    }
    const i = window.crypto.randomUUID();
    console.log("Generated attestation nonce:", i);
    const s = await j1(i, e);
    if (s && s.public_key) {
      console.log("Attestation document verification succeeded");
      const o = V1();
      console.log("Generated client key pair");
      const c = new Uint8Array(s.public_key), { encrypted_session_key: u, session_id: h } = await tw(
        Br(o.publicKey),
        i,
        e
      );
      console.log("Key exchange completed.");
      const m = H0.scalarMult(o.secretKey, c), x = Ds(u), z = 12, N = x.slice(0, z), v = x.slice(z), O = new Pu(m).open(N, v);
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
function L1(r) {
  ct = r;
}
async function H1(r, e) {
  return Ot(
    `${ct}/platform/login`,
    "POST",
    { email: r, password: e },
    void 0,
    "Failed to login"
  );
}
async function F1(r, e, t, n) {
  return Ot(
    `${ct}/platform/register`,
    "POST",
    { email: r, password: e, invite_code: t, name: n },
    void 0,
    "Failed to register"
  );
}
async function G1(r) {
  return Ot(
    `${ct}/platform/logout`,
    "POST",
    { refresh_token: r },
    void 0,
    "Failed to logout"
  );
}
async function z1() {
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
async function F0(r) {
  return Te(
    `${ct}/platform/orgs`,
    "POST",
    { name: r }
  );
}
async function G0() {
  return Te(
    `${ct}/platform/orgs`,
    "GET",
    void 0
  );
}
async function z0(r) {
  return Te(
    `${ct}/platform/orgs/${r}`,
    "DELETE",
    void 0
  );
}
async function K0(r, e, t) {
  return Te(
    `${ct}/platform/orgs/${r}/projects`,
    "POST",
    { name: e, description: t }
  );
}
async function q0(r) {
  return Te(
    `${ct}/platform/orgs/${r}/projects`,
    "GET",
    void 0
  );
}
async function Z0(r, e) {
  return Te(
    `${ct}/platform/orgs/${r}/projects/${e}`,
    "GET",
    void 0
  );
}
async function W0(r, e, t) {
  return Te(
    `${ct}/platform/orgs/${r}/projects/${e}`,
    "PATCH",
    t
  );
}
async function Y0(r, e) {
  return Te(
    `${ct}/platform/orgs/${r}/projects/${e}`,
    "DELETE",
    void 0
  );
}
function K1(r) {
  const e = /^[A-Za-z0-9+/]*[=]{0,2}$/, t = r.length % 4 === 0, n = e.test(r);
  return t && n;
}
async function J0(r, e, t, n) {
  if (!K1(n))
    throw new Error(
      "Secret must be base64 encoded. Use @stablelib/base64's encode function to encode your data."
    );
  return Te(
    `${ct}/platform/orgs/${r}/projects/${e}/secrets`,
    "POST",
    { key_name: t, secret: n }
  );
}
async function X0(r, e) {
  return Te(
    `${ct}/platform/orgs/${r}/projects/${e}/secrets`,
    "GET",
    void 0
  );
}
async function Q0(r, e, t) {
  return Te(
    `${ct}/platform/orgs/${r}/projects/${e}/secrets/${t}`,
    "DELETE",
    void 0
  );
}
async function ey(r, e) {
  return Te(
    `${ct}/platform/orgs/${r}/projects/${e}/settings/email`,
    "GET",
    void 0
  );
}
async function ty(r, e, t) {
  return Te(
    `${ct}/platform/orgs/${r}/projects/${e}/settings/email`,
    "PUT",
    t
  );
}
async function ry(r, e) {
  return Te(
    `${ct}/platform/orgs/${r}/projects/${e}/settings/oauth`,
    "GET",
    void 0
  );
}
async function ny(r, e, t) {
  return Te(
    `${ct}/platform/orgs/${r}/projects/${e}/settings/oauth`,
    "PUT",
    t
  );
}
async function iy(r, e, t) {
  if (!e || e.trim() === "")
    throw new Error("Email is required");
  return Te(
    `${ct}/platform/orgs/${r}/invites`,
    "POST",
    { email: e, role: t }
  );
}
async function sy(r) {
  return Te(
    `${ct}/platform/orgs/${r}/invites`,
    "GET",
    void 0
  );
}
async function oy(r, e) {
  return Te(
    `${ct}/platform/orgs/${r}/invites/${e}`,
    "GET",
    void 0
  );
}
async function ay(r, e) {
  return Te(
    `${ct}/platform/orgs/${r}/invites/${e}`,
    "DELETE",
    void 0
  );
}
async function cy(r) {
  return Te(
    `${ct}/platform/orgs/${r}/memberships`,
    "GET",
    void 0
  );
}
async function ly(r, e, t) {
  return Te(
    `${ct}/platform/orgs/${r}/memberships/${e}`,
    "PATCH",
    { role: t }
  );
}
async function uy(r, e) {
  return Te(
    `${ct}/platform/orgs/${r}/memberships/${e}`,
    "DELETE",
    void 0
  );
}
async function fy(r) {
  return Te(
    `${ct}/platform/accept_invite/${r}`,
    "POST",
    void 0
  );
}
async function q1() {
  return Te(`${ct}/platform/me`, "GET", void 0);
}
async function hy(r) {
  return Ot(
    `${ct}/platform/verify-email/${r}`,
    "GET",
    void 0,
    void 0,
    "Failed to verify email"
  );
}
async function Ma() {
  return Te(
    `${ct}/platform/request_verification`,
    "POST",
    void 0,
    "Failed to request new verification code"
  );
}
async function dy(r, e) {
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
async function py(r, e, t, n) {
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
async function yy(r, e) {
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
        const u = Go.getRefreshFunction(r);
        console.log(`Using ${u}`), u === "platformRefreshToken" ? await z1() : await $c();
      }
      const o = window.localStorage.getItem("access_token");
      if (!o)
        throw new Error("No access token available");
      const c = await gy(
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
async function gy(r, e, t, n, i) {
  const o = Go.resolveEndpoint(r).context === "platform" ? Go.platformApiUrl : void 0;
  let { sessionKey: c, sessionId: u } = await Ei(!1, o);
  const h = async (x, z = !1) => {
    if (z || !c || !u) {
      const P = await Ei(!0, o);
      c = P.sessionKey, u = P.sessionId;
    }
    if (!c || !u)
      throw new Error("Failed to make encrypted API call, no attestation available.");
    const N = t ? JSON.stringify(t) : void 0, v = N ? kd(c, N) : void 0, A = {
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
        const P = await O.json(), R = Cd(c, P.encrypted);
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
  }, m = async (x, z = !1) => {
    var N;
    try {
      const v = await h(x, z);
      return (v.status === 400 || (N = v.error) != null && N.includes("Encryption error")) && !z ? (console.log("Encryption error or Bad Request, attempting to renew attestation"), m(x, !0)) : v;
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
  const s = await gy(
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
function Ye() {
  return Nr().apiUrl;
}
async function Z1(r, e) {
  const { clientId: t } = Nr(), n = await Ot(
    `${Ye()}/login`,
    "POST",
    { email: r, password: e, client_id: t }
  );
  return window.localStorage.setItem("access_token", n.access_token), window.localStorage.setItem("refresh_token", n.refresh_token), n;
}
async function W1(r, e) {
  const { clientId: t } = Nr(), n = await Ot(
    `${Ye()}/login`,
    "POST",
    { id: r, password: e, client_id: t }
  );
  return window.localStorage.setItem("access_token", n.access_token), window.localStorage.setItem("refresh_token", n.refresh_token), n;
}
async function Y1(r, e, t, n) {
  const { clientId: i } = Nr(), s = await Ot(`${Ye()}/register`, "POST", {
    email: r,
    password: e,
    inviteCode: t.toLowerCase(),
    client_id: i,
    name: n
  });
  return window.localStorage.setItem("access_token", s.access_token), window.localStorage.setItem("refresh_token", s.refresh_token), s;
}
async function J1(r, e) {
  const { clientId: t } = Nr(), n = await Ot(`${Ye()}/register`, "POST", {
    password: r,
    inviteCode: e.toLowerCase(),
    client_id: t
  });
  return window.localStorage.setItem("access_token", n.access_token), window.localStorage.setItem("refresh_token", n.refresh_token), n;
}
async function $c() {
  const r = window.localStorage.getItem("refresh_token");
  if (!r) throw new Error("No refresh token available");
  const e = { refresh_token: r };
  try {
    const t = await Ot(
      `${Ye()}/refresh`,
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
async function X1() {
  return Te(
    `${Ye()}/protected/user`,
    "GET",
    void 0,
    "Failed to fetch user"
  );
}
async function vy(r, e) {
  return Te(
    `${Ye()}/protected/kv/${r}`,
    "PUT",
    e,
    "Failed to put key-value pair"
  );
}
async function my(r) {
  return Te(
    `${Ye()}/protected/kv/${r}`,
    "DELETE",
    void 0,
    "Failed to delete key-value pair"
  );
}
async function wy(r) {
  try {
    return await Te(
      `${Ye()}/protected/kv/${r}`,
      "GET",
      void 0,
      "Failed to get key-value pair"
    );
  } catch (e) {
    console.error(`Error fetching key "${r}":`, e);
    return;
  }
}
async function by() {
  return Te(
    `${Ye()}/protected/kv`,
    "GET",
    void 0,
    "Failed to list key-value pairs"
  );
}
async function Q1() {
  const r = window.localStorage.getItem("refresh_token");
  if (r)
    try {
      const e = { refresh_token: r };
      await Ot(`${Ye()}/logout`, "POST", e);
    } catch (e) {
      console.error("Error during logout API call:", e);
    }
  localStorage.removeItem("access_token"), localStorage.removeItem("refresh_token"), sessionStorage.removeItem("sessionKey"), sessionStorage.removeItem("sessionId");
}
async function xy(r) {
  return Ot(
    `${Ye()}/verify-email/${r}`,
    "GET",
    void 0,
    void 0,
    "Failed to verify email"
  );
}
async function Va() {
  return Te(
    `${Ye()}/protected/request_verification`,
    "POST",
    void 0,
    "Failed to request new verification code"
  );
}
async function ew(r, e) {
  const t = e || Ye(), n = await fetch(`${t}/attestation/${r}`);
  if (!n.ok)
    throw new Error(`Request failed with status ${n.status}`);
  return (await n.json()).attestation_document;
}
async function tw(r, e, t) {
  const n = t || Ye(), i = await fetch(`${n}/key_exchange`, {
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
async function rw(r, e) {
  const { clientId: t } = Nr(), n = {
    email: r,
    hashed_secret: e,
    client_id: t
  };
  return Ot(
    `${Ye()}/password-reset/request`,
    "POST",
    n,
    void 0,
    "Failed to request password reset"
  );
}
async function nw(r, e, t, n) {
  const { clientId: i } = Nr(), s = {
    email: r,
    alphanumeric_code: e,
    plaintext_secret: t,
    new_password: n,
    client_id: i
  };
  return Ot(
    `${Ye()}/password-reset/confirm`,
    "POST",
    s,
    void 0,
    "Failed to confirm password reset"
  );
}
async function Ay(r, e) {
  const t = {
    current_password: r,
    new_password: e
  };
  return Te(
    `${Ye()}/protected/change_password`,
    "POST",
    t,
    "Failed to change password"
  );
}
async function iw(r) {
  const { clientId: e } = Nr();
  try {
    return await Ot(
      `${Ye()}/auth/github`,
      "POST",
      r ? { invite_code: r, client_id: e } : { client_id: e },
      void 0,
      "Failed to initiate GitHub auth"
    );
  } catch (t) {
    throw t instanceof Error && t.message.includes("Invalid invite code") ? new Error("Invalid invite code. Please check and try again.") : t;
  }
}
async function sw(r, e, t) {
  const n = { code: r, state: e, invite_code: t };
  try {
    const i = await Ot(
      `${Ye()}/auth/github/callback`,
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
async function ow(r) {
  const { clientId: e } = Nr();
  try {
    return await Ot(
      `${Ye()}/auth/google`,
      "POST",
      r ? { invite_code: r, client_id: e } : { client_id: e },
      void 0,
      "Failed to initiate Google auth"
    );
  } catch (t) {
    throw t instanceof Error && t.message.includes("Invalid invite code") ? new Error("Invalid invite code. Please check and try again.") : t;
  }
}
async function aw(r, e, t) {
  const n = { code: r, state: e, invite_code: t };
  try {
    const i = await Ot(
      `${Ye()}/auth/google/callback`,
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
async function cw(r) {
  const { clientId: e } = Nr();
  try {
    return await Ot(
      `${Ye()}/auth/apple`,
      "POST",
      r ? { invite_code: r, client_id: e } : { client_id: e },
      void 0,
      "Failed to initiate Apple auth"
    );
  } catch (t) {
    throw t instanceof Error && t.message.includes("Invalid invite code") ? new Error("Invalid invite code. Please check and try again.") : t;
  }
}
async function lw(r, e, t) {
  const n = { code: r, state: e, invite_code: t };
  try {
    const i = await Ot(
      `${Ye()}/auth/apple/callback`,
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
async function uw(r, e) {
  const { clientId: t } = Nr(), n = {
    ...r,
    client_id: t,
    ...e ? { invite_code: e } : {}
  };
  try {
    const i = await Ot(
      `${Ye()}/auth/apple/native`,
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
async function Sy(r) {
  let e = `${Ye()}/protected/private_key`;
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
async function _y(r) {
  let e = `${Ye()}/protected/private_key_bytes`;
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
async function Ey(r, e, t) {
  const i = {
    message_base64: Br(r),
    algorithm: e,
    ...t && Object.keys(t).length > 0 && { key_options: t }
  };
  return Te(
    `${Ye()}/protected/sign_message`,
    "POST",
    i,
    "Failed to sign message"
  );
}
async function Iy(r, e) {
  let t = `${Ye()}/protected/public_key?algorithm=${r}`;
  return e != null && e.seed_phrase_derivation_path && (t += `&seed_phrase_derivation_path=${encodeURIComponent(e.seed_phrase_derivation_path)}`), e != null && e.private_key_derivation_path && (t += `&private_key_derivation_path=${encodeURIComponent(e.private_key_derivation_path)}`), Te(
    t,
    "GET",
    void 0,
    "Failed to fetch public key"
  );
}
async function fw(r, e, t) {
  const n = {
    email: r,
    password: e,
    ...t !== void 0 && { name: t }
  };
  return Te(
    `${Ye()}/protected/convert_guest`,
    "POST",
    n,
    "Failed to convert guest account"
  );
}
async function hw(r) {
  return Te(
    `${Ye()}/protected/third_party_token`,
    "POST",
    r ? { audience: r } : {},
    "Failed to generate third party token"
  );
}
async function ky(r, e) {
  const t = {
    data: r,
    ...e && Object.keys(e).length > 0 && { key_options: e }
  };
  return Te(
    `${Ye()}/protected/encrypt`,
    "POST",
    t,
    "Failed to encrypt data"
  );
}
async function Cy(r, e) {
  const t = {
    encrypted_data: r,
    ...e && Object.keys(e).length > 0 && { key_options: e }
  };
  return Te(
    `${Ye()}/protected/decrypt`,
    "POST",
    t,
    "Failed to decrypt data"
  );
}
async function dw(r) {
  const e = {
    hashed_secret: r
  };
  return Te(
    `${Ye()}/protected/delete-account/request`,
    "POST",
    e,
    "Failed to request account deletion"
  );
}
async function pw(r, e) {
  const t = {
    confirmation_code: r,
    plaintext_secret: e
  };
  return Te(
    `${Ye()}/protected/delete-account/confirm`,
    "POST",
    t,
    "Failed to confirm account deletion"
  );
}
async function By() {
  try {
    const r = await Te(
      `${Ye()}/v1/models`,
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
const wd = 10 * 1024 * 1024;
function yw(r) {
  return new Promise((e) => setTimeout(e, r));
}
async function Ef(r) {
  if (r.size > wd)
    throw new Error(`File size exceeds maximum limit of ${wd / 1024 / 1024}MB`);
  const e = await r.arrayBuffer(), t = new Uint8Array(e), n = Br(t), s = {
    filename: r instanceof File ? r.name : "document",
    content_base64: n
  };
  return Te(
    `${Ye()}/v1/documents/upload`,
    "POST",
    s,
    "Failed to upload document"
  );
}
async function If(r) {
  const e = {
    task_id: r
  };
  return Te(
    `${Ye()}/v1/documents/status`,
    "POST",
    e,
    "Failed to check document status"
  );
}
async function Oy(r, e) {
  const { pollInterval: t = 2e3, maxAttempts: n = 150, onProgress: i } = e || {}, s = await Ef(r);
  let o = 0;
  for (; o < n; ) {
    const c = await If(s.task_id);
    switch (i && i(c.status, c.progress), c.status) {
      case "success":
        if (!c.document)
          throw new Error("Document processing succeeded but no document returned");
        return c.document;
      case "failure":
        throw new Error(c.error || "Document processing failed");
      case "pending":
      case "started":
        await yw(t), o++;
        break;
      default:
        throw new Error(`Unknown document status: ${c.status}`);
    }
  }
  throw new Error("Document processing timed out");
}
function gw() {
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
      const { sessionKey: o, sessionId: c } = await Ei();
      if (!o || !c)
        throw new Error("No session key or ID available");
      s.set("x-session-id", c);
      const u = { ...e, headers: s };
      if (e != null && e.body) {
        const m = kd(o, e.body);
        u.body = JSON.stringify({ encrypted: m }), s.set("Content-Type", "application/json");
      }
      let h = await fetch(r, u);
      if (h.status === 401 && (console.warn("Unauthorized, refreshing access token"), await $c(), s.set("Authorization", t()), u.headers = s, h = await fetch(r, u)), !h.ok) {
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
        let z = "";
        const N = new ReadableStream({
          async start(v) {
            for (; ; ) {
              const { done: A, value: O } = await m.read();
              if (A) break;
              const I = x.decode(O);
              z += I;
              let P;
              for (; P = vw(z); )
                if (z = z.slice(P.length), P.trim().startsWith("data: ")) {
                  const R = P.slice(6).trim();
                  if (R === "[DONE]")
                    v.enqueue(`data: [DONE]

`);
                  else
                    try {
                      console.groupCollapsed("Decrypting chunk"), console.log("Attempting to decrypt, data length:", R.length);
                      const ae = Cd(o, R);
                      console.log("Decrypted data length:", ae.length), console.log("Decrypted data:", ae);
                      try {
                        const Ge = JSON.parse(ae);
                        console.log("Parsed JSON:", Ge), v.enqueue(`data: ${JSON.stringify(Ge)}

`);
                      } catch (Ge) {
                        Ge instanceof SyntaxError && (console.log("Failed to parse JSON:", ae), v.enqueue(`data: ${ae}

`));
                      }
                    } catch (ae) {
                      console.error("Decryption error:", ae, "Data:", R), console.log("Skipping corrupted chunk");
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
function vw(r) {
  const e = r.indexOf(`

`);
  return e === -1 ? null : r.slice(0, e + 2);
}
const mw = [
  "eeddbb58f57c38894d6d5af5e575fbe791c5bf3bbcfb5df8da8cfcf0c2e1da1913108e6a762112444740b88c163d7f4b",
  "74ed417f88cb0ca76c4a3d10f278bd010f1d3f95eafb254d4732511bb50e404507a4049b779c5230137e4091a5582271",
  "9043fcab93b972d3c14ad2dc8fa78ca7ad374fc937c02435681772a003f7a72876bc4d578089b5c4cf3fe9b480f1aabb",
  "52c3595b151d93d8b159c257301bfd5aa6f49210de0c55a6cd6df5ebeee44e4206cab950500f5d188f7fa14e6d900b75",
  "91cb67311e910cce68cd5b7d0de77aa40610d87c6681439b44c46c3ff786ae643956ab2c812478a1da8745b259f07a45",
  "859065ac81b81d3735130ba08b8af72a7256b603fefb74faabae25ed28cca6edcaa7c10ea32b5948d675c18a9b0f2b1d",
  "acd82a7d3943e23e95a9dc3ce0b0107ea358d6287f9e3afa245622f7c7e3e0a66142a928b6efcc02f594a95366d3a99d"
], ww = [
  "62c0407056217a4c10764ed9045694c29fa93255d3cc04c2f989cdd9a1f8050c8b169714c71f1118ebce2fcc9951d1a9",
  "cb95519905443f9f66f05f63c548b61ad1561a27fd5717b69285861aaea3c3063fe12a2571773b67fea3c6c11b4d8ec6",
  "deb5895831b5e4286f5a2dcf5e9c27383821446f8df2b465f141d10743599be20ba3bb381ce063bf7139cc89f7f61d4c",
  "70ba26c6af1ec3b57ce80e1adcc0ee96d70224d4c7a078f427895cdf68e1c30f09b5ac4c456588d872f3f21ff77c036b",
  "669404ea71435b8f498b48db7816a5c2ab1d258b1a77685b11d84d15a73189504d79c4dee13a658de9f4a0cbfc39cfe8",
  "a791bf92c25ffdfd372660e460a0e238c6778c090672df6509ae4bc065cf8668b6baac6b6a11d554af53ee0ff0172ad5",
  "c4285443b87b9b12a6cea3bef1064ec060f652b235a297095975af8f134e5ed65f92d70d4616fdec80af9dff48bb9f35"
], bw = "MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEHiUY9kFWK1GqBGzczohhwEwElXzgWLDZa9R6wBx3JOBocgSt9+UIzZlJbPDjYeGBfDUXh7Z62BG2vVsh2NgclLB5S7A2ucBBtb1wd8vSQHP8jpdPhZX1slauPgbnROIP", xw = {
  prod: "https://raw.githubusercontent.com/OpenSecretCloud/opensecret/master/pcrProdHistory.json",
  dev: "https://raw.githubusercontent.com/OpenSecretCloud/opensecret/master/pcrDevHistory.json"
};
async function Aw() {
  try {
    const r = new Uint8Array(
      atob(bw).split("").map((e) => e.charCodeAt(0))
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
async function Sw(r, e) {
  try {
    const t = (e == null ? void 0 : e[r]) || xw[r], n = await fetch(t);
    if (!n.ok)
      throw new Error(`Failed to fetch PCR history: ${n.status}`);
    return await n.json();
  } catch (t) {
    throw console.error("Error fetching PCR history:", t), new Error("Failed to fetch PCR history");
  }
}
async function _w(r, e, t) {
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
async function bd(r, e, t) {
  try {
    const n = await Aw(), i = await Sw(e, t);
    for (const s of i)
      if (s.PCR0 === r && await _w(s.PCR0, s.signature, n))
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
async function Ew(r, e) {
  const t = [...(e == null ? void 0 : e.pcr0Values) || [], ...mw], n = [...(e == null ? void 0 : e.pcr0DevValues) || [], ...ww];
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
      const s = await bd(
        r,
        "prod",
        e == null ? void 0 : e.remoteAttestationUrls
      );
      if (s)
        return s;
      const o = await bd(
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
const rs = $a, Mc = "641a0321a3e244efe456463195d606317ed7cdcc3c1756e09893f3c68f79bb5b";
function Ty(r) {
  return Array.from(r).map((e) => e.toString(16).padStart(2, "0")).join("");
}
async function Iw(r) {
  const e = await crypto.subtle.digest("SHA-256", r);
  return Ty(new Uint8Array(e));
}
async function ns(r, e, t) {
  console.log("Raw timestamp:", r.timestamp), console.log("Date object:", new Date(r.timestamp));
  const n = Array.from(r.pcrs.entries()).map(([m, x]) => ({
    id: m,
    value: Ty(x)
  })).filter((m) => !m.value.match(/^0+$/)), i = n.find((m) => m.id === 0);
  let s = null;
  i && (s = await Ew(i.value, t));
  const o = [...e, r.certificate].map((m) => {
    const x = new bi(m);
    return {
      subject: x.subject,
      notBefore: x.notBefore.toLocaleString(),
      notAfter: x.notAfter.toLocaleString(),
      pem: x.toString("pem"),
      isRoot: x.subject === "C=US, O=Amazon, OU=AWS, CN=aws.nitro-enclaves"
    };
  }), c = new TextDecoder(), u = new bi(e[0]), h = await Iw(u.rawData);
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
const Ny = _d({
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
  get: wy,
  put: vy,
  list: by,
  del: my,
  verifyEmail: xy,
  requestNewVerificationCode: Va,
  requestNewVerificationEmail: Va,
  refetchUser: async () => {
  },
  changePassword: Ay,
  refreshAccessToken: $c,
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
  getPrivateKey: Sy,
  getPrivateKeyBytes: _y,
  getPublicKey: Iy,
  signMessage: Ey,
  aiCustomFetch: async () => new Response(),
  apiUrl: "",
  pcrConfig: {},
  getAttestation: Ei,
  authenticate: _i,
  parseAttestationForView: ns,
  awsRootCertDer: rs,
  expectedRootCertHash: Mc,
  getAttestationDocument: async () => {
    throw new Error("getAttestationDocument called outside of OpenSecretProvider");
  },
  generateThirdPartyToken: async () => ({ token: "" }),
  encryptData: ky,
  decryptData: Cy,
  fetchModels: By,
  uploadDocument: Ef,
  checkDocumentStatus: If,
  uploadDocumentWithPolling: Oy
});
function Cx({
  children: r,
  apiUrl: e,
  clientId: t,
  pcrConfig: n = {}
}) {
  const [i, s] = sl({
    loading: !0,
    user: void 0
  }), [o, c] = sl();
  Ts(() => {
    if (!e || e.trim() === "")
      throw new Error(
        "OpenSecretProvider requires a non-empty apiUrl. Please provide a valid API endpoint URL."
      );
    if (!t || t.trim() === "")
      throw new Error(
        "OpenSecretProvider requires a non-empty clientId. Please provide a valid project UUID."
      );
    Dy({ apiUrl: e, clientId: t });
  }, [e, t]), Ts(() => {
    i.user ? c(() => gw()) : c(void 0);
  }, [i.user]);
  async function u() {
    const ce = window.localStorage.getItem("access_token"), ve = window.localStorage.getItem("refresh_token");
    if (!ce || !ve) {
      s({
        loading: !1,
        user: void 0
      });
      return;
    }
    try {
      const we = await X1();
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
  Ts(() => {
    u();
  }, []);
  async function h(ce, ve) {
    console.log("Signing in");
    try {
      await Z1(ce, ve), await u();
    } catch (we) {
      throw console.error(we), we;
    }
  }
  async function m(ce, ve, we, ze) {
    try {
      await Y1(
        ce,
        ve,
        we,
        ze || null
      ), await u();
    } catch (bt) {
      throw console.error(bt), bt;
    }
  }
  async function x(ce, ve) {
    console.log("Signing in Guest");
    try {
      await W1(ce, ve), await u();
    } catch (we) {
      throw console.error(we), we;
    }
  }
  async function z(ce, ve) {
    try {
      const we = await J1(
        ce,
        ve
      );
      return await u(), we;
    } catch (we) {
      throw console.error(we), we;
    }
  }
  async function N(ce, ve, we) {
    try {
      await fw(ce, ve, we), await u();
    } catch (ze) {
      throw console.error(ze), ze;
    }
  }
  async function v() {
    await Q1(), s({
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
    signUpGuest: z,
    convertGuestToUserAccount: N,
    get: wy,
    put: vy,
    list: by,
    del: my,
    refetchUser: u,
    verifyEmail: xy,
    requestNewVerificationCode: Va,
    requestNewVerificationEmail: Va,
    changePassword: Ay,
    refreshAccessToken: $c,
    requestPasswordReset: rw,
    confirmPasswordReset: nw,
    requestAccountDeletion: dw,
    confirmAccountDeletion: pw,
    initiateGitHubAuth: async (ce) => {
      try {
        return await iw(ce);
      } catch (ve) {
        throw console.error("Failed to initiate GitHub auth:", ve), ve;
      }
    },
    handleGitHubCallback: async (ce, ve, we) => {
      try {
        await sw(
          ce,
          ve,
          we
        ), await u();
      } catch (ze) {
        throw console.error("GitHub callback error:", ze), ze;
      }
    },
    initiateGoogleAuth: async (ce) => {
      try {
        return await ow(ce);
      } catch (ve) {
        throw console.error("Failed to initiate Google auth:", ve), ve;
      }
    },
    handleGoogleCallback: async (ce, ve, we) => {
      try {
        await aw(
          ce,
          ve,
          we
        ), await u();
      } catch (ze) {
        throw console.error("Google callback error:", ze), ze;
      }
    },
    initiateAppleAuth: async (ce) => {
      try {
        return await cw(ce);
      } catch (ve) {
        throw console.error("Failed to initiate Apple auth:", ve), ve;
      }
    },
    handleAppleCallback: async (ce, ve, we) => {
      try {
        await lw(
          ce,
          ve,
          we
        ), await u();
      } catch (ze) {
        throw console.error("Apple callback error:", ze), ze;
      }
    },
    handleAppleNativeSignIn: async (ce, ve) => {
      try {
        await uw(
          ce,
          ve
        ), await u();
      } catch (we) {
        throw console.error("Apple native sign-in error:", we), we;
      }
    },
    getPrivateKey: Sy,
    getPrivateKeyBytes: _y,
    getPublicKey: Iy,
    signMessage: Ey,
    aiCustomFetch: o || (async () => new Response()),
    apiUrl: e,
    pcrConfig: n,
    getAttestation: Ei,
    authenticate: _i,
    parseAttestationForView: ns,
    awsRootCertDer: rs,
    expectedRootCertHash: Mc,
    getAttestationDocument: async () => {
      const ce = window.crypto.randomUUID(), ve = await fetch(`${e}/attestation/${ce}`);
      if (!ve.ok)
        throw new Error("Failed to fetch attestation document");
      const we = await ve.json(), ze = await _i(
        we.attestation_document,
        rs,
        ce
      );
      return ns(ze, ze.cabundle, n);
    },
    generateThirdPartyToken: hw,
    encryptData: ky,
    decryptData: Cy,
    fetchModels: By,
    uploadDocument: Ef,
    checkDocumentStatus: If,
    uploadDocumentWithPolling: Oy
  };
  return /* @__PURE__ */ Sd(Ny.Provider, { value: Pe, children: r });
}
const Py = _d({
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
  verifyEmail: hy,
  requestNewVerificationCode: Ma,
  requestNewVerificationEmail: Ma,
  requestPasswordReset: dy,
  confirmPasswordReset: py,
  changePassword: yy,
  pcrConfig: {},
  getAttestation: Ei,
  authenticate: _i,
  parseAttestationForView: ns,
  awsRootCertDer: rs,
  expectedRootCertHash: Mc,
  getAttestationDocument: async () => {
    throw new Error("getAttestationDocument called outside of OpenSecretDeveloper provider");
  },
  createOrganization: F0,
  listOrganizations: G0,
  deleteOrganization: z0,
  createProject: K0,
  listProjects: q0,
  getProject: Z0,
  updateProject: W0,
  deleteProject: Y0,
  createProjectSecret: J0,
  listProjectSecrets: X0,
  deleteProjectSecret: Q0,
  getEmailSettings: ey,
  updateEmailSettings: ty,
  getOAuthSettings: ry,
  updateOAuthSettings: ny,
  inviteDeveloper: iy,
  listOrganizationMembers: cy,
  listOrganizationInvites: sy,
  getOrganizationInvite: oy,
  deleteOrganizationInvite: ay,
  updateMemberRole: ly,
  removeMember: uy,
  acceptInvite: fy,
  apiUrl: ""
});
function Bx({
  children: r,
  apiUrl: e,
  pcrConfig: t = {}
}) {
  const [n, i] = sl({
    loading: !0,
    developer: void 0
  });
  Ts(() => {
    if (!e || e.trim() === "")
      throw new Error(
        "OpenSecretDeveloper requires a non-empty apiUrl. Please provide a valid API endpoint URL."
      );
    L1(e), Go.configurePlatform(e);
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
      const z = await q1();
      i({
        loading: !1,
        developer: {
          ...z.user,
          organizations: z.organizations
        }
      });
    } catch (z) {
      console.error("Failed to fetch developer:", z), i({
        loading: !1,
        developer: void 0
      });
    }
  }
  const o = async () => {
    const m = window.crypto.randomUUID(), x = await fetch(`${e}/attestation/${m}`);
    if (!x.ok)
      throw new Error("Failed to fetch attestation document");
    const z = await x.json(), N = await _i(
      z.attestation_document,
      rs,
      m
    );
    return ns(N, N.cabundle, t);
  };
  Ts(() => {
    s();
  }, []);
  async function c(m, x) {
    try {
      const { access_token: z, refresh_token: N } = await H1(m, x);
      return window.localStorage.setItem("access_token", z), window.localStorage.setItem("refresh_token", N), await s(), { access_token: z, refresh_token: N, id: "", email: m };
    } catch (z) {
      throw console.error("Login error:", z), z;
    }
  }
  async function u(m, x, z, N) {
    try {
      const { access_token: v, refresh_token: A } = await F1(
        m,
        x,
        z,
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
          await G1(m);
        } catch (x) {
          console.error("Error during logout:", x);
        }
      localStorage.removeItem("access_token"), localStorage.removeItem("refresh_token"), i({
        loading: !1,
        developer: void 0
      });
    },
    verifyEmail: hy,
    requestNewVerificationCode: Ma,
    requestNewVerificationEmail: Ma,
    requestPasswordReset: dy,
    confirmPasswordReset: py,
    changePassword: yy,
    pcrConfig: t,
    getAttestation: Ei,
    authenticate: _i,
    parseAttestationForView: ns,
    awsRootCertDer: rs,
    expectedRootCertHash: Mc,
    getAttestationDocument: o,
    createOrganization: F0,
    listOrganizations: G0,
    deleteOrganization: z0,
    createProject: K0,
    listProjects: q0,
    getProject: Z0,
    updateProject: W0,
    deleteProject: Y0,
    createProjectSecret: J0,
    listProjectSecrets: X0,
    deleteProjectSecret: Q0,
    getEmailSettings: ey,
    updateEmailSettings: ty,
    getOAuthSettings: ry,
    updateOAuthSettings: ny,
    inviteDeveloper: iy,
    listOrganizationMembers: cy,
    listOrganizationInvites: sy,
    getOrganizationInvite: oy,
    deleteOrganizationInvite: ay,
    updateMemberRole: ly,
    removeMember: uy,
    acceptInvite: fy,
    apiUrl: e
  };
  return /* @__PURE__ */ Sd(Py.Provider, { value: h, children: r });
}
function Ox() {
  return Ed(Ny);
}
function Tx() {
  return Ed(Py);
}
function Nx() {
  const r = new Uint8Array(32);
  return crypto.getRandomValues(r), Array.from(r, (e) => e.toString(16).padStart(2, "0")).join("");
}
async function Px(r) {
  const t = new TextEncoder().encode(r), n = await crypto.subtle.digest("SHA-256", t);
  return Array.from(new Uint8Array(n)).map((s) => s.toString(16).padStart(2, "0")).join("");
}
export {
  Ny as OpenSecretContext,
  Bx as OpenSecretDeveloper,
  Py as OpenSecretDeveloperContext,
  Cx as OpenSecretProvider,
  Go as apiConfig,
  _i as authenticate,
  rs as awsRootCertDer,
  Ay as changePassword,
  If as checkDocumentStatus,
  Dy as configure,
  pw as confirmAccountDeletion,
  nw as confirmPasswordReset,
  fw as convertGuestToUserAccount,
  gw as createAiCustomFetch,
  Cy as decryptData,
  my as del,
  ky as encryptData,
  Mc as expectedRootCertHash,
  By as fetchModels,
  X1 as fetchUser,
  Nx as generateSecureSecret,
  hw as generateThirdPartyToken,
  wy as get,
  Ye as getApiUrl,
  Ei as getAttestation,
  Nr as getConfig,
  Sy as getPrivateKey,
  _y as getPrivateKeyBytes,
  Iy as getPublicKey,
  lw as handleAppleCallback,
  uw as handleAppleNativeSignIn,
  sw as handleGitHubCallback,
  aw as handleGoogleCallback,
  Px as hashSecret,
  cw as initiateAppleAuth,
  iw as initiateGitHubAuth,
  ow as initiateGoogleAuth,
  $y as isConfigured,
  by as list,
  ns as parseAttestationForView,
  vy as put,
  $c as refreshAccessToken,
  dw as requestAccountDeletion,
  Va as requestNewVerificationCode,
  rw as requestPasswordReset,
  Ow as resetConfig,
  Z1 as signIn,
  W1 as signInGuest,
  Ey as signMessage,
  Q1 as signOut,
  Y1 as signUp,
  J1 as signUpGuest,
  Ef as uploadDocument,
  Oy as uploadDocumentWithPolling,
  Ox as useOpenSecret,
  Tx as useOpenSecretDeveloper,
  xy as verifyEmail
};
