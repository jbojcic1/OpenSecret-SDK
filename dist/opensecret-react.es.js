var jy = Object.defineProperty;
var _f = (r) => {
  throw TypeError(r);
};
var Ry = (r, e, t) => e in r ? jy(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var Le = (r, e, t) => Ry(r, typeof e != "symbol" ? e + "" : e, t), Dc = (r, e, t) => e.has(r) || _f("Cannot " + t);
var $ = (r, e, t) => (Dc(r, e, "read from private field"), t ? t.call(r) : e.get(r)), rr = (r, e, t) => e.has(r) ? _f("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(r) : e.set(r, t), It = (r, e, t, n) => (Dc(r, e, "write to private field"), n ? n.call(r, t) : e.set(r, t), t), Ue = (r, e, t) => (Dc(r, e, "access private method"), t);
var Ef = (r, e, t, n) => ({
  set _(i) {
    It(r, e, i, t);
  },
  get _() {
    return $(r, e, n);
  }
});
import { jsx as xd } from "react/jsx-runtime";
import { createContext as Ad, useState as Sd, useEffect as If, useContext as _d } from "react";
class Uy {
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
const Lo = new Uy(), Ed = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  apiConfig: Lo
}, Symbol.toStringTag, { value: "Module" })), hr = 256;
class Dy {
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
    let s = 0, o = 0, c = 0, u = 0, h = 0, w = 0, x = 0;
    for (; o < n - 4; o += 4)
      u = this._decodeChar(e.charCodeAt(o + 0)), h = this._decodeChar(e.charCodeAt(o + 1)), w = this._decodeChar(e.charCodeAt(o + 2)), x = this._decodeChar(e.charCodeAt(o + 3)), i[s++] = u << 2 | h >>> 4, i[s++] = h << 4 | w >>> 2, i[s++] = w << 6 | x, c |= u & hr, c |= h & hr, c |= w & hr, c |= x & hr;
    if (o < n - 1 && (u = this._decodeChar(e.charCodeAt(o)), h = this._decodeChar(e.charCodeAt(o + 1)), i[s++] = u << 2 | h >>> 4, c |= u & hr, c |= h & hr), o < n - 2 && (w = this._decodeChar(e.charCodeAt(o + 2)), i[s++] = h << 4 | w >>> 2, c |= w & hr), o < n - 3 && (x = this._decodeChar(e.charCodeAt(o + 3)), i[s++] = w << 6 | x, c |= x & hr), c !== 0)
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
const Id = new Dy();
function Br(r) {
  return Id.encode(r);
}
function js(r) {
  return Id.decode(r);
}
function Gt(r, e = new Uint8Array(4), t = 0) {
  return e[t + 0] = r >>> 0, e[t + 1] = r >>> 8, e[t + 2] = r >>> 16, e[t + 3] = r >>> 24, e;
}
function kf(r, e = new Uint8Array(8), t = 0) {
  return Gt(r >>> 0, e, t), Gt(r / 4294967296 >>> 0, e, t + 4), e;
}
function Cr(r) {
  for (let e = 0; e < r.length; e++)
    r[e] = 0;
  return r;
}
const $y = 20;
function My(r, e, t) {
  let n = 1634760805, i = 857760878, s = 2036477234, o = 1797285236, c = t[3] << 24 | t[2] << 16 | t[1] << 8 | t[0], u = t[7] << 24 | t[6] << 16 | t[5] << 8 | t[4], h = t[11] << 24 | t[10] << 16 | t[9] << 8 | t[8], w = t[15] << 24 | t[14] << 16 | t[13] << 8 | t[12], x = t[19] << 24 | t[18] << 16 | t[17] << 8 | t[16], q = t[23] << 24 | t[22] << 16 | t[21] << 8 | t[20], N = t[27] << 24 | t[26] << 16 | t[25] << 8 | t[24], v = t[31] << 24 | t[30] << 16 | t[29] << 8 | t[28], A = e[3] << 24 | e[2] << 16 | e[1] << 8 | e[0], O = e[7] << 24 | e[6] << 16 | e[5] << 8 | e[4], I = e[11] << 24 | e[10] << 16 | e[9] << 8 | e[8], U = e[15] << 24 | e[14] << 16 | e[13] << 8 | e[12], D = n, be = i, et = s, Ke = o, K = c, W = u, te = h, pe = w, Xe = x, xt = q, Tt = N, Et = v, ht = A, Je = O, ae = I, Ee = U;
  for (let yt = 0; yt < $y; yt += 2)
    D = D + K | 0, ht ^= D, ht = ht >>> 16 | ht << 16, Xe = Xe + ht | 0, K ^= Xe, K = K >>> 20 | K << 12, be = be + W | 0, Je ^= be, Je = Je >>> 16 | Je << 16, xt = xt + Je | 0, W ^= xt, W = W >>> 20 | W << 12, et = et + te | 0, ae ^= et, ae = ae >>> 16 | ae << 16, Tt = Tt + ae | 0, te ^= Tt, te = te >>> 20 | te << 12, Ke = Ke + pe | 0, Ee ^= Ke, Ee = Ee >>> 16 | Ee << 16, Et = Et + Ee | 0, pe ^= Et, pe = pe >>> 20 | pe << 12, et = et + te | 0, ae ^= et, ae = ae >>> 24 | ae << 8, Tt = Tt + ae | 0, te ^= Tt, te = te >>> 25 | te << 7, Ke = Ke + pe | 0, Ee ^= Ke, Ee = Ee >>> 24 | Ee << 8, Et = Et + Ee | 0, pe ^= Et, pe = pe >>> 25 | pe << 7, be = be + W | 0, Je ^= be, Je = Je >>> 24 | Je << 8, xt = xt + Je | 0, W ^= xt, W = W >>> 25 | W << 7, D = D + K | 0, ht ^= D, ht = ht >>> 24 | ht << 8, Xe = Xe + ht | 0, K ^= Xe, K = K >>> 25 | K << 7, D = D + W | 0, Ee ^= D, Ee = Ee >>> 16 | Ee << 16, Tt = Tt + Ee | 0, W ^= Tt, W = W >>> 20 | W << 12, be = be + te | 0, ht ^= be, ht = ht >>> 16 | ht << 16, Et = Et + ht | 0, te ^= Et, te = te >>> 20 | te << 12, et = et + pe | 0, Je ^= et, Je = Je >>> 16 | Je << 16, Xe = Xe + Je | 0, pe ^= Xe, pe = pe >>> 20 | pe << 12, Ke = Ke + K | 0, ae ^= Ke, ae = ae >>> 16 | ae << 16, xt = xt + ae | 0, K ^= xt, K = K >>> 20 | K << 12, et = et + pe | 0, Je ^= et, Je = Je >>> 24 | Je << 8, Xe = Xe + Je | 0, pe ^= Xe, pe = pe >>> 25 | pe << 7, Ke = Ke + K | 0, ae ^= Ke, ae = ae >>> 24 | ae << 8, xt = xt + ae | 0, K ^= xt, K = K >>> 25 | K << 7, be = be + te | 0, ht ^= be, ht = ht >>> 24 | ht << 8, Et = Et + ht | 0, te ^= Et, te = te >>> 25 | te << 7, D = D + W | 0, Ee ^= D, Ee = Ee >>> 24 | Ee << 8, Tt = Tt + Ee | 0, W ^= Tt, W = W >>> 25 | W << 7;
  Gt(D + n | 0, r, 0), Gt(be + i | 0, r, 4), Gt(et + s | 0, r, 8), Gt(Ke + o | 0, r, 12), Gt(K + c | 0, r, 16), Gt(W + u | 0, r, 20), Gt(te + h | 0, r, 24), Gt(pe + w | 0, r, 28), Gt(Xe + x | 0, r, 32), Gt(xt + q | 0, r, 36), Gt(Tt + N | 0, r, 40), Gt(Et + v | 0, r, 44), Gt(ht + A | 0, r, 48), Gt(Je + O | 0, r, 52), Gt(ae + I | 0, r, 56), Gt(Ee + U | 0, r, 60);
}
function tl(r, e, t, n, i = 0) {
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
    My(c, s, r);
    for (let h = u; h < u + 64 && h < t.length; h++)
      n[h] = t[h] ^ c[h - u];
    Vy(s, 0, o);
  }
  return Cr(c), i === 0 && Cr(s), n;
}
function Cf(r, e, t, n = 0) {
  return Cr(t), tl(r, e, t, t, n);
}
function Vy(r, e, t) {
  let n = 1;
  for (; t--; )
    n = n + (r[e] & 255) | 0, r[e] = n & 255, n >>>= 8, e++;
  if (n > 0)
    throw new Error("ChaCha: counter overflow");
}
function Ly(r, e) {
  if (r.length !== e.length)
    return 0;
  let t = 0;
  for (let n = 0; n < r.length; n++)
    t |= r[n] ^ e[n];
  return 1 & t - 1 >>> 8;
}
function Hy(r, e) {
  return r.length === 0 || e.length === 0 ? !1 : Ly(r, e) !== 0;
}
const Fy = 16;
class zy {
  constructor(e) {
    Le(this, "digestLength", Fy);
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
    let i = this._fin ? 0 : 2048, s = this._h[0], o = this._h[1], c = this._h[2], u = this._h[3], h = this._h[4], w = this._h[5], x = this._h[6], q = this._h[7], N = this._h[8], v = this._h[9], A = this._r[0], O = this._r[1], I = this._r[2], U = this._r[3], D = this._r[4], be = this._r[5], et = this._r[6], Ke = this._r[7], K = this._r[8], W = this._r[9];
    for (; n >= 16; ) {
      let te = e[t + 0] | e[t + 1] << 8;
      s += te & 8191;
      let pe = e[t + 2] | e[t + 3] << 8;
      o += (te >>> 13 | pe << 3) & 8191;
      let Xe = e[t + 4] | e[t + 5] << 8;
      c += (pe >>> 10 | Xe << 6) & 8191;
      let xt = e[t + 6] | e[t + 7] << 8;
      u += (Xe >>> 7 | xt << 9) & 8191;
      let Tt = e[t + 8] | e[t + 9] << 8;
      h += (xt >>> 4 | Tt << 12) & 8191, w += Tt >>> 1 & 8191;
      let Et = e[t + 10] | e[t + 11] << 8;
      x += (Tt >>> 14 | Et << 2) & 8191;
      let ht = e[t + 12] | e[t + 13] << 8;
      q += (Et >>> 11 | ht << 5) & 8191;
      let Je = e[t + 14] | e[t + 15] << 8;
      N += (ht >>> 8 | Je << 8) & 8191, v += Je >>> 5 | i;
      let ae = 0, Ee = ae;
      Ee += s * A, Ee += o * (5 * W), Ee += c * (5 * K), Ee += u * (5 * Ke), Ee += h * (5 * et), ae = Ee >>> 13, Ee &= 8191, Ee += w * (5 * be), Ee += x * (5 * D), Ee += q * (5 * U), Ee += N * (5 * I), Ee += v * (5 * O), ae += Ee >>> 13, Ee &= 8191;
      let yt = ae;
      yt += s * O, yt += o * A, yt += c * (5 * W), yt += u * (5 * K), yt += h * (5 * Ke), ae = yt >>> 13, yt &= 8191, yt += w * (5 * et), yt += x * (5 * be), yt += q * (5 * D), yt += N * (5 * U), yt += v * (5 * I), ae += yt >>> 13, yt &= 8191;
      let Ut = ae;
      Ut += s * I, Ut += o * O, Ut += c * A, Ut += u * (5 * W), Ut += h * (5 * K), ae = Ut >>> 13, Ut &= 8191, Ut += w * (5 * Ke), Ut += x * (5 * et), Ut += q * (5 * be), Ut += N * (5 * D), Ut += v * (5 * U), ae += Ut >>> 13, Ut &= 8191;
      let Dt = ae;
      Dt += s * U, Dt += o * I, Dt += c * O, Dt += u * A, Dt += h * (5 * W), ae = Dt >>> 13, Dt &= 8191, Dt += w * (5 * K), Dt += x * (5 * Ke), Dt += q * (5 * et), Dt += N * (5 * be), Dt += v * (5 * D), ae += Dt >>> 13, Dt &= 8191;
      let ue = ae;
      ue += s * D, ue += o * U, ue += c * I, ue += u * O, ue += h * A, ae = ue >>> 13, ue &= 8191, ue += w * (5 * W), ue += x * (5 * K), ue += q * (5 * Ke), ue += N * (5 * et), ue += v * (5 * be), ae += ue >>> 13, ue &= 8191;
      let it = ae;
      it += s * be, it += o * D, it += c * U, it += u * I, it += h * O, ae = it >>> 13, it &= 8191, it += w * A, it += x * (5 * W), it += q * (5 * K), it += N * (5 * Ke), it += v * (5 * et), ae += it >>> 13, it &= 8191;
      let gt = ae;
      gt += s * et, gt += o * be, gt += c * D, gt += u * U, gt += h * I, ae = gt >>> 13, gt &= 8191, gt += w * O, gt += x * A, gt += q * (5 * W), gt += N * (5 * K), gt += v * (5 * Ke), ae += gt >>> 13, gt &= 8191;
      let re = ae;
      re += s * Ke, re += o * et, re += c * be, re += u * D, re += h * U, ae = re >>> 13, re &= 8191, re += w * I, re += x * O, re += q * A, re += N * (5 * W), re += v * (5 * K), ae += re >>> 13, re &= 8191;
      let dt = ae;
      dt += s * K, dt += o * Ke, dt += c * et, dt += u * be, dt += h * D, ae = dt >>> 13, dt &= 8191, dt += w * U, dt += x * I, dt += q * O, dt += N * A, dt += v * (5 * W), ae += dt >>> 13, dt &= 8191;
      let Vt = ae;
      Vt += s * W, Vt += o * K, Vt += c * Ke, Vt += u * et, Vt += h * be, ae = Vt >>> 13, Vt &= 8191, Vt += w * D, Vt += x * U, Vt += q * I, Vt += N * O, Vt += v * A, ae += Vt >>> 13, Vt &= 8191, ae = (ae << 2) + ae | 0, ae = ae + Ee | 0, Ee = ae & 8191, ae = ae >>> 13, yt += ae, s = Ee, o = yt, c = Ut, u = Dt, h = ue, w = it, x = gt, q = re, N = dt, v = Vt, t += 16, n -= 16;
    }
    this._h[0] = s, this._h[1] = o, this._h[2] = c, this._h[3] = u, this._h[4] = h, this._h[5] = w, this._h[6] = x, this._h[7] = q, this._h[8] = N, this._h[9] = v;
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
const Gy = 32, qy = 12, Ky = 16, Bf = new Uint8Array(16);
class Cu {
  /**
   * Creates a new instance with the given 32-byte key.
   */
  constructor(e) {
    Le(this, "nonceLength", qy);
    Le(this, "tagLength", Ky);
    Le(this, "_key");
    if (e.length !== Gy)
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
    Cf(this._key, s, o, 4);
    const c = t.length + this.tagLength;
    let u;
    if (i) {
      if (i.length !== c)
        throw new Error("ChaCha20Poly1305: incorrect destination length");
      u = i;
    } else
      u = new Uint8Array(c);
    return tl(this._key, s, t, u, 4), this._authenticate(u.subarray(u.length - this.tagLength, u.length), o, u.subarray(0, u.length - this.tagLength), n), Cr(s), u;
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
    Cf(this._key, s, o, 4);
    const c = new Uint8Array(this.tagLength);
    if (this._authenticate(c, o, t.subarray(0, t.length - this.tagLength), n), !Hy(c, t.subarray(t.length - this.tagLength, t.length)))
      return null;
    const u = t.length - this.tagLength;
    let h;
    if (i) {
      if (i.length !== u)
        throw new Error("ChaCha20Poly1305: incorrect destination length");
      h = i;
    } else
      h = new Uint8Array(u);
    return tl(this._key, s, t.subarray(0, t.length - this.tagLength), h, 4), Cr(s), h;
  }
  clean() {
    return Cr(this._key), this;
  }
  _authenticate(e, t, n, i) {
    const s = new zy(t);
    i && (s.update(i), i.length % 16 > 0 && s.update(Bf.subarray(i.length % 16))), s.update(n), n.length % 16 > 0 && s.update(Bf.subarray(n.length % 16));
    const o = new Uint8Array(8);
    i && kf(i.length, o), s.update(o), kf(n.length, o), s.update(o);
    const c = s.digest();
    for (let u = 0; u < c.length; u++)
      e[u] = c[u];
    s.clean(), Cr(c), Cr(o);
  }
}
const Of = 65536;
class Zy {
  constructor() {
    Le(this, "isAvailable", !1);
    Le(this, "isInstantiated", !1);
    typeof crypto < "u" && "getRandomValues" in crypto && (this.isAvailable = !0, this.isInstantiated = !0);
  }
  randomBytes(e) {
    if (!this.isAvailable)
      throw new Error("System random byte generator is not available.");
    const t = new Uint8Array(e);
    for (let n = 0; n < t.length; n += Of)
      crypto.getRandomValues(t.subarray(n, n + Math.min(t.length - n, Of)));
    return t;
  }
}
const Wy = new Zy();
function Yy(r, e = Wy) {
  return e.randomBytes(r);
}
function Jy(r, e) {
  const t = new Cu(r), n = Yy(12), s = new TextEncoder().encode(e), o = t.seal(n, s), c = new Uint8Array(n.length + o.length);
  return c.set(n), c.set(o, n.length), Br(c);
}
function Xy(r, e) {
  const t = new Cu(r), n = js(e), i = 12, s = n.slice(0, i), o = n.slice(i), c = t.open(s, o);
  if (!c)
    throw new Error("Decryption failed");
  return new TextDecoder().decode(c);
}
var rl = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Qy(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function eg(r) {
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
var Tf;
(function(r) {
  (function(e) {
    var t = typeof globalThis == "object" ? globalThis : typeof rl == "object" ? rl : typeof self == "object" ? self : typeof this == "object" ? this : c(), n = i(r);
    typeof t.Reflect < "u" && (n = i(t.Reflect, n)), e(n, t), typeof t.Reflect > "u" && (t.Reflect = r);
    function i(u, h) {
      return function(w, x) {
        Object.defineProperty(u, w, { configurable: !0, writable: !0, value: x }), h && h(w, x);
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
    var n = Object.prototype.hasOwnProperty, i = typeof Symbol == "function", s = i && typeof Symbol.toPrimitive < "u" ? Symbol.toPrimitive : "@@toPrimitive", o = i && typeof Symbol.iterator < "u" ? Symbol.iterator : "@@iterator", c = typeof Object.create == "function", u = { __proto__: [] } instanceof Array, h = !c && !u, w = {
      // create an object in dictionary mode (a.k.a. "slow" mode in v8)
      create: c ? function() {
        return As(/* @__PURE__ */ Object.create(null));
      } : u ? function() {
        return As({ __proto__: null });
      } : function() {
        return As({});
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
    }, x = Object.getPrototypeOf(Function), q = typeof Map == "function" && typeof Map.prototype.entries == "function" ? Map : bs(), N = typeof Set == "function" && typeof Set.prototype.entries == "function" ? Set : xs(), v = typeof WeakMap == "function" ? WeakMap : Co(), A = i ? Symbol.for("@reflect-metadata:registry") : void 0, O = ms(), I = Bi(O);
    function U(_, k, T, G) {
      if (ue(T)) {
        if (!hs(_))
          throw new TypeError();
        if (!ds(k))
          throw new TypeError();
        return xt(_, k);
      } else {
        if (!hs(_))
          throw new TypeError();
        if (!re(k))
          throw new TypeError();
        if (!re(G) && !ue(G) && !it(G))
          throw new TypeError();
        return it(G) && (G = void 0), T = or(T), Tt(_, k, T, G);
      }
    }
    e("decorate", U);
    function D(_, k) {
      function T(G, xe) {
        if (!re(G))
          throw new TypeError();
        if (!ue(xe) && !Uc(xe))
          throw new TypeError();
        Ee(_, k, G, xe);
      }
      return T;
    }
    e("metadata", D);
    function be(_, k, T, G) {
      if (!re(T))
        throw new TypeError();
      return ue(G) || (G = or(G)), Ee(_, k, T, G);
    }
    e("defineMetadata", be);
    function et(_, k, T) {
      if (!re(k))
        throw new TypeError();
      return ue(T) || (T = or(T)), Et(_, k, T);
    }
    e("hasMetadata", et);
    function Ke(_, k, T) {
      if (!re(k))
        throw new TypeError();
      return ue(T) || (T = or(T)), ht(_, k, T);
    }
    e("hasOwnMetadata", Ke);
    function K(_, k, T) {
      if (!re(k))
        throw new TypeError();
      return ue(T) || (T = or(T)), Je(_, k, T);
    }
    e("getMetadata", K);
    function W(_, k, T) {
      if (!re(k))
        throw new TypeError();
      return ue(T) || (T = or(T)), ae(_, k, T);
    }
    e("getOwnMetadata", W);
    function te(_, k) {
      if (!re(_))
        throw new TypeError();
      return ue(k) || (k = or(k)), yt(_, k);
    }
    e("getMetadataKeys", te);
    function pe(_, k) {
      if (!re(_))
        throw new TypeError();
      return ue(k) || (k = or(k)), Ut(_, k);
    }
    e("getOwnMetadataKeys", pe);
    function Xe(_, k, T) {
      if (!re(k))
        throw new TypeError();
      if (ue(T) || (T = or(T)), !re(k))
        throw new TypeError();
      ue(T) || (T = or(T));
      var G = Wr(
        k,
        T,
        /*Create*/
        !1
      );
      return ue(G) ? !1 : G.OrdinaryDeleteMetadata(_, k, T);
    }
    e("deleteMetadata", Xe);
    function xt(_, k) {
      for (var T = _.length - 1; T >= 0; --T) {
        var G = _[T], xe = G(k);
        if (!ue(xe) && !it(xe)) {
          if (!ds(xe))
            throw new TypeError();
          k = xe;
        }
      }
      return k;
    }
    function Tt(_, k, T, G) {
      for (var xe = _.length - 1; xe >= 0; --xe) {
        var At = _[xe], St = At(k, T, G);
        if (!ue(St) && !it(St)) {
          if (!re(St))
            throw new TypeError();
          G = St;
        }
      }
      return G;
    }
    function Et(_, k, T) {
      var G = ht(_, k, T);
      if (G)
        return !0;
      var xe = Ci(k);
      return it(xe) ? !1 : Et(_, xe, T);
    }
    function ht(_, k, T) {
      var G = Wr(
        k,
        T,
        /*Create*/
        !1
      );
      return ue(G) ? !1 : fs(G.OrdinaryHasOwnMetadata(_, k, T));
    }
    function Je(_, k, T) {
      var G = ht(_, k, T);
      if (G)
        return ae(_, k, T);
      var xe = Ci(k);
      if (!it(xe))
        return Je(_, xe, T);
    }
    function ae(_, k, T) {
      var G = Wr(
        k,
        T,
        /*Create*/
        !1
      );
      if (!ue(G))
        return G.OrdinaryGetOwnMetadata(_, k, T);
    }
    function Ee(_, k, T, G) {
      var xe = Wr(
        T,
        G,
        /*Create*/
        !0
      );
      xe.OrdinaryDefineOwnMetadata(_, k, T, G);
    }
    function yt(_, k) {
      var T = Ut(_, k), G = Ci(_);
      if (G === null)
        return T;
      var xe = yt(G, k);
      if (xe.length <= 0)
        return T;
      if (T.length <= 0)
        return xe;
      for (var At = new N(), St = [], je = 0, Y = T; je < Y.length; je++) {
        var ne = Y[je], fe = At.has(ne);
        fe || (At.add(ne), St.push(ne));
      }
      for (var ge = 0, Ye = xe; ge < Ye.length; ge++) {
        var ne = Ye[ge], fe = At.has(ne);
        fe || (At.add(ne), St.push(ne));
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
    function ue(_) {
      return _ === void 0;
    }
    function it(_) {
      return _ === null;
    }
    function gt(_) {
      return typeof _ == "symbol";
    }
    function re(_) {
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
      var T = "string", G = ko(_, s);
      if (G !== void 0) {
        var xe = G.call(_, T);
        if (re(xe))
          throw new TypeError();
        return xe;
      }
      return Vt(_);
    }
    function Vt(_, k) {
      var T, G;
      {
        var xe = _.toString;
        if (pn(xe)) {
          var G = xe.call(_);
          if (!re(G))
            return G;
        }
        var T = _.valueOf;
        if (pn(T)) {
          var G = T.call(_);
          if (!re(G))
            return G;
        }
      }
      throw new TypeError();
    }
    function fs(_) {
      return !!_;
    }
    function ki(_) {
      return "" + _;
    }
    function or(_) {
      var k = dt(_);
      return gt(k) ? k : ki(k);
    }
    function hs(_) {
      return Array.isArray ? Array.isArray(_) : _ instanceof Object ? _ instanceof Array : Object.prototype.toString.call(_) === "[object Array]";
    }
    function pn(_) {
      return typeof _ == "function";
    }
    function ds(_) {
      return typeof _ == "function";
    }
    function Uc(_) {
      switch (Dt(_)) {
        case 3:
          return !0;
        case 4:
          return !0;
        default:
          return !1;
      }
    }
    function ps(_, k) {
      return _ === k || _ !== _ && k !== k;
    }
    function ko(_, k) {
      var T = _[k];
      if (T != null) {
        if (!pn(T))
          throw new TypeError();
        return T;
      }
    }
    function ys(_) {
      var k = ko(_, o);
      if (!pn(k))
        throw new TypeError();
      var T = k.call(_);
      if (!re(T))
        throw new TypeError();
      return T;
    }
    function gs(_) {
      return _.value;
    }
    function Zr(_) {
      var k = _.next();
      return k.done ? !1 : k;
    }
    function Xn(_) {
      var k = _.return;
      k && k.call(_);
    }
    function Ci(_) {
      var k = Object.getPrototypeOf(_);
      if (typeof _ != "function" || _ === x || k !== x)
        return k;
      var T = _.prototype, G = T && Object.getPrototypeOf(T);
      if (G == null || G === Object.prototype)
        return k;
      var xe = G.constructor;
      return typeof xe != "function" || xe === _ ? k : xe;
    }
    function vs() {
      var _;
      !ue(A) && typeof t.Reflect < "u" && !(A in t.Reflect) && typeof t.Reflect.defineMetadata == "function" && (_ = ws(t.Reflect));
      var k, T, G, xe = new v(), At = {
        registerProvider: St,
        getProvider: Y,
        setProvider: fe
      };
      return At;
      function St(ge) {
        if (!Object.isExtensible(At))
          throw new Error("Cannot add provider to a frozen registry.");
        switch (!0) {
          case _ === ge:
            break;
          case ue(k):
            k = ge;
            break;
          case k === ge:
            break;
          case ue(T):
            T = ge;
            break;
          case T === ge:
            break;
          default:
            G === void 0 && (G = new N()), G.add(ge);
            break;
        }
      }
      function je(ge, Ye) {
        if (!ue(k)) {
          if (k.isProviderFor(ge, Ye))
            return k;
          if (!ue(T)) {
            if (T.isProviderFor(ge, Ye))
              return k;
            if (!ue(G))
              for (var tt = ys(G); ; ) {
                var vt = Zr(tt);
                if (!vt)
                  return;
                var zt = gs(vt);
                if (zt.isProviderFor(ge, Ye))
                  return Xn(tt), zt;
              }
          }
        }
        if (!ue(_) && _.isProviderFor(ge, Ye))
          return _;
      }
      function Y(ge, Ye) {
        var tt = xe.get(ge), vt;
        return ue(tt) || (vt = tt.get(Ye)), ue(vt) && (vt = je(ge, Ye), ue(vt) || (ue(tt) && (tt = new q(), xe.set(ge, tt)), tt.set(Ye, vt))), vt;
      }
      function ne(ge) {
        if (ue(ge))
          throw new TypeError();
        return k === ge || T === ge || !ue(G) && G.has(ge);
      }
      function fe(ge, Ye, tt) {
        if (!ne(tt))
          throw new Error("Metadata provider not registered.");
        var vt = Y(ge, Ye);
        if (vt !== tt) {
          if (!ue(vt))
            return !1;
          var zt = xe.get(ge);
          ue(zt) && (zt = new q(), xe.set(ge, zt)), zt.set(Ye, tt);
        }
        return !0;
      }
    }
    function ms() {
      var _;
      return !ue(A) && re(t.Reflect) && Object.isExtensible(t.Reflect) && (_ = t.Reflect[A]), ue(_) && (_ = vs()), !ue(A) && re(t.Reflect) && Object.isExtensible(t.Reflect) && Object.defineProperty(t.Reflect, A, {
        enumerable: !1,
        configurable: !1,
        writable: !1,
        value: _
      }), _;
    }
    function Bi(_) {
      var k = new v(), T = {
        isProviderFor: function(ne, fe) {
          var ge = k.get(ne);
          return ue(ge) ? !1 : ge.has(fe);
        },
        OrdinaryDefineOwnMetadata: St,
        OrdinaryHasOwnMetadata: xe,
        OrdinaryGetOwnMetadata: At,
        OrdinaryOwnMetadataKeys: je,
        OrdinaryDeleteMetadata: Y
      };
      return O.registerProvider(T), T;
      function G(ne, fe, ge) {
        var Ye = k.get(ne), tt = !1;
        if (ue(Ye)) {
          if (!ge)
            return;
          Ye = new q(), k.set(ne, Ye), tt = !0;
        }
        var vt = Ye.get(fe);
        if (ue(vt)) {
          if (!ge)
            return;
          if (vt = new q(), Ye.set(fe, vt), !_.setProvider(ne, fe, T))
            throw Ye.delete(fe), tt && k.delete(ne), new Error("Wrong provider for target.");
        }
        return vt;
      }
      function xe(ne, fe, ge) {
        var Ye = G(
          fe,
          ge,
          /*Create*/
          !1
        );
        return ue(Ye) ? !1 : fs(Ye.has(ne));
      }
      function At(ne, fe, ge) {
        var Ye = G(
          fe,
          ge,
          /*Create*/
          !1
        );
        if (!ue(Ye))
          return Ye.get(ne);
      }
      function St(ne, fe, ge, Ye) {
        var tt = G(
          ge,
          Ye,
          /*Create*/
          !0
        );
        tt.set(ne, fe);
      }
      function je(ne, fe) {
        var ge = [], Ye = G(
          ne,
          fe,
          /*Create*/
          !1
        );
        if (ue(Ye))
          return ge;
        for (var tt = Ye.keys(), vt = ys(tt), zt = 0; ; ) {
          var Oi = Zr(vt);
          if (!Oi)
            return ge.length = zt, ge;
          var Ss = gs(Oi);
          try {
            ge[zt] = Ss;
          } catch (Bo) {
            try {
              Xn(vt);
            } finally {
              throw Bo;
            }
          }
          zt++;
        }
      }
      function Y(ne, fe, ge) {
        var Ye = G(
          fe,
          ge,
          /*Create*/
          !1
        );
        if (ue(Ye) || !Ye.delete(ne))
          return !1;
        if (Ye.size === 0) {
          var tt = k.get(fe);
          ue(tt) || (tt.delete(ge), tt.size === 0 && k.delete(tt));
        }
        return !0;
      }
    }
    function ws(_) {
      var k = _.defineMetadata, T = _.hasOwnMetadata, G = _.getOwnMetadata, xe = _.getOwnMetadataKeys, At = _.deleteMetadata, St = new v(), je = {
        isProviderFor: function(Y, ne) {
          var fe = St.get(Y);
          return !ue(fe) && fe.has(ne) ? !0 : xe(Y, ne).length ? (ue(fe) && (fe = new N(), St.set(Y, fe)), fe.add(ne), !0) : !1;
        },
        OrdinaryDefineOwnMetadata: k,
        OrdinaryHasOwnMetadata: T,
        OrdinaryGetOwnMetadata: G,
        OrdinaryOwnMetadataKeys: xe,
        OrdinaryDeleteMetadata: At
      };
      return je;
    }
    function Wr(_, k, T) {
      var G = O.getProvider(_, k);
      if (!ue(G))
        return G;
      if (T) {
        if (O.setProvider(_, k, I))
          return I;
        throw new Error("Illegal state.");
      }
    }
    function bs() {
      var _ = {}, k = [], T = (
        /** @class */
        function() {
          function je(Y, ne, fe) {
            this._index = 0, this._keys = Y, this._values = ne, this._selector = fe;
          }
          return je.prototype["@@iterator"] = function() {
            return this;
          }, je.prototype[o] = function() {
            return this;
          }, je.prototype.next = function() {
            var Y = this._index;
            if (Y >= 0 && Y < this._keys.length) {
              var ne = this._selector(this._keys[Y], this._values[Y]);
              return Y + 1 >= this._keys.length ? (this._index = -1, this._keys = k, this._values = k) : this._index++, { value: ne, done: !1 };
            }
            return { value: void 0, done: !0 };
          }, je.prototype.throw = function(Y) {
            throw this._index >= 0 && (this._index = -1, this._keys = k, this._values = k), Y;
          }, je.prototype.return = function(Y) {
            return this._index >= 0 && (this._index = -1, this._keys = k, this._values = k), { value: Y, done: !0 };
          }, je;
        }()
      ), G = (
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
          }), je.prototype.has = function(Y) {
            return this._find(
              Y,
              /*insert*/
              !1
            ) >= 0;
          }, je.prototype.get = function(Y) {
            var ne = this._find(
              Y,
              /*insert*/
              !1
            );
            return ne >= 0 ? this._values[ne] : void 0;
          }, je.prototype.set = function(Y, ne) {
            var fe = this._find(
              Y,
              /*insert*/
              !0
            );
            return this._values[fe] = ne, this;
          }, je.prototype.delete = function(Y) {
            var ne = this._find(
              Y,
              /*insert*/
              !1
            );
            if (ne >= 0) {
              for (var fe = this._keys.length, ge = ne + 1; ge < fe; ge++)
                this._keys[ge - 1] = this._keys[ge], this._values[ge - 1] = this._values[ge];
              return this._keys.length--, this._values.length--, ps(Y, this._cacheKey) && (this._cacheKey = _, this._cacheIndex = -2), !0;
            }
            return !1;
          }, je.prototype.clear = function() {
            this._keys.length = 0, this._values.length = 0, this._cacheKey = _, this._cacheIndex = -2;
          }, je.prototype.keys = function() {
            return new T(this._keys, this._values, xe);
          }, je.prototype.values = function() {
            return new T(this._keys, this._values, At);
          }, je.prototype.entries = function() {
            return new T(this._keys, this._values, St);
          }, je.prototype["@@iterator"] = function() {
            return this.entries();
          }, je.prototype[o] = function() {
            return this.entries();
          }, je.prototype._find = function(Y, ne) {
            if (!ps(this._cacheKey, Y)) {
              this._cacheIndex = -1;
              for (var fe = 0; fe < this._keys.length; fe++)
                if (ps(this._keys[fe], Y)) {
                  this._cacheIndex = fe;
                  break;
                }
            }
            return this._cacheIndex < 0 && ne && (this._cacheIndex = this._keys.length, this._keys.push(Y), this._values.push(void 0)), this._cacheIndex;
          }, je;
        }()
      );
      return G;
      function xe(je, Y) {
        return je;
      }
      function At(je, Y) {
        return Y;
      }
      function St(je, Y) {
        return [je, Y];
      }
    }
    function xs() {
      var _ = (
        /** @class */
        function() {
          function k() {
            this._map = new q();
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
    function Co() {
      var _ = 16, k = w.create(), T = G();
      return (
        /** @class */
        function() {
          function Y() {
            this._key = G();
          }
          return Y.prototype.has = function(ne) {
            var fe = xe(
              ne,
              /*create*/
              !1
            );
            return fe !== void 0 ? w.has(fe, this._key) : !1;
          }, Y.prototype.get = function(ne) {
            var fe = xe(
              ne,
              /*create*/
              !1
            );
            return fe !== void 0 ? w.get(fe, this._key) : void 0;
          }, Y.prototype.set = function(ne, fe) {
            var ge = xe(
              ne,
              /*create*/
              !0
            );
            return ge[this._key] = fe, this;
          }, Y.prototype.delete = function(ne) {
            var fe = xe(
              ne,
              /*create*/
              !1
            );
            return fe !== void 0 ? delete fe[this._key] : !1;
          }, Y.prototype.clear = function() {
            this._key = G();
          }, Y;
        }()
      );
      function G() {
        var Y;
        do
          Y = "@@WeakMap@@" + je();
        while (w.has(k, Y));
        return k[Y] = !0, Y;
      }
      function xe(Y, ne) {
        if (!n.call(Y, T)) {
          if (!ne)
            return;
          Object.defineProperty(Y, T, { value: w.create() });
        }
        return Y[T];
      }
      function At(Y, ne) {
        for (var fe = 0; fe < ne; ++fe)
          Y[fe] = Math.random() * 255 | 0;
        return Y;
      }
      function St(Y) {
        if (typeof Uint8Array == "function") {
          var ne = new Uint8Array(Y);
          return typeof crypto < "u" ? crypto.getRandomValues(ne) : typeof msCrypto < "u" ? msCrypto.getRandomValues(ne) : At(ne, Y), ne;
        }
        return At(new Array(Y), Y);
      }
      function je() {
        var Y = St(_);
        Y[6] = Y[6] & 79 | 64, Y[8] = Y[8] & 191 | 128;
        for (var ne = "", fe = 0; fe < _; ++fe) {
          var ge = Y[fe];
          (fe === 4 || fe === 6 || fe === 8) && (ne += "-"), ge < 16 && (ne += "0"), ne += ge.toString(16).toLowerCase();
        }
        return ne;
      }
    }
    function As(_) {
      return _.__ = void 0, delete _.__, _;
    }
  });
})(Tf || (Tf = {}));
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
const tg = "[object ArrayBuffer]";
class J {
  static isArrayBuffer(e) {
    return Object.prototype.toString.call(e) === tg;
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
    const n = J.toUint8Array(e), i = J.toUint8Array(t);
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
const $c = "string", rg = /^[0-9a-f]+$/i, ng = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/, ig = /^[a-zA-Z0-9-_]+$/;
class Nf {
  static fromString(e) {
    const t = unescape(encodeURIComponent(e)), n = new Uint8Array(t.length);
    for (let i = 0; i < t.length; i++)
      n[i] = t.charCodeAt(i);
    return n.buffer;
  }
  static toString(e) {
    const t = J.toUint8Array(e);
    let n = "";
    for (let s = 0; s < t.length; s++)
      n += String.fromCharCode(t[s]);
    return decodeURIComponent(escape(n));
  }
}
class Yr {
  static toString(e, t = !1) {
    const n = J.toArrayBuffer(e), i = new DataView(n);
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
class he {
  static isHex(e) {
    return typeof e === $c && rg.test(e);
  }
  static isBase64(e) {
    return typeof e === $c && ng.test(e);
  }
  static isBase64Url(e) {
    return typeof e === $c && ig.test(e);
  }
  static ToString(e, t = "utf8") {
    const n = J.toUint8Array(e);
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
    const t = J.toUint8Array(e);
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
    if (!he.isBase64(t))
      throw new TypeError("Argument 'base64Text' is not Base64 encoded");
    return typeof atob < "u" ? this.FromBinary(atob(t)) : new Uint8Array(Buffer.from(t, "base64")).buffer;
  }
  static FromBase64Url(e) {
    const t = this.formatString(e);
    if (!t)
      return new ArrayBuffer(0);
    if (!he.isBase64Url(t))
      throw new TypeError("Argument 'base64url' is not Base64Url encoded");
    return this.FromBase64(this.Base64Padding(t.replace(/\-/g, "+").replace(/\_/g, "/")));
  }
  static ToBase64Url(e) {
    return this.ToBase64(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
  }
  static FromUtf8String(e, t = he.DEFAULT_UTF8_ENCODING) {
    switch (t) {
      case "ascii":
        return this.FromBinary(e);
      case "utf8":
        return Nf.fromString(e);
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
  static ToUtf8String(e, t = he.DEFAULT_UTF8_ENCODING) {
    switch (t) {
      case "ascii":
        return this.ToBinary(e);
      case "utf8":
        return Nf.toString(e);
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
    const t = J.toUint8Array(e);
    let n = "";
    for (let i = 0; i < t.length; i++)
      n += String.fromCharCode(t[i]);
    return n;
  }
  static ToHex(e) {
    const t = J.toUint8Array(e);
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
    if (!he.isHex(t))
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
he.DEFAULT_UTF8_ENCODING = "utf8";
function sg(...r) {
  const e = r.map((i) => i.byteLength).reduce((i, s) => i + s), t = new Uint8Array(e);
  let n = 0;
  return r.map((i) => new Uint8Array(i)).forEach((i) => {
    for (const s of i)
      t[n++] = s;
  }), t.buffer;
}
function Ho(r, e) {
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
function $i(r, e) {
  let t = 0;
  if (r.length === 1)
    return r[0];
  for (let n = r.length - 1; n >= 0; n--)
    t += r[r.length - 1 - n] * Math.pow(2, e * n);
  return t;
}
function ci(r, e, t = -1) {
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
      for (let w = c - 1; w >= 0; w--) {
        const x = Math.pow(2, w * e);
        h[s - w - 1] = Math.floor(i / x), i -= h[s - w - 1] * x;
      }
      return u;
    }
    o *= Math.pow(2, e);
  }
  return new ArrayBuffer(0);
}
function nl(...r) {
  let e = 0, t = 0;
  for (const s of r)
    e += s.length;
  const n = new ArrayBuffer(e), i = new Uint8Array(n);
  for (const s of r)
    i.set(s, t), t += s.length;
  return i;
}
function kd() {
  const r = new Uint8Array(this.valueHex);
  if (this.valueHex.byteLength >= 2) {
    const c = r[0] === 255 && r[1] & 128, u = r[0] === 0 && (r[1] & 128) === 0;
    (c || u) && this.warnings.push("Needlessly long format");
  }
  const e = new ArrayBuffer(this.valueHex.byteLength), t = new Uint8Array(e);
  for (let c = 0; c < this.valueHex.byteLength; c++)
    t[c] = 0;
  t[0] = r[0] & 128;
  const n = $i(t, 8), i = new ArrayBuffer(this.valueHex.byteLength), s = new Uint8Array(i);
  for (let c = 0; c < this.valueHex.byteLength; c++)
    s[c] = r[c];
  return s[0] &= 127, $i(s, 8) - n;
}
function og(r) {
  const e = r < 0 ? r * -1 : r;
  let t = 128;
  for (let n = 1; n < 8; n++) {
    if (e <= t) {
      if (r < 0) {
        const o = t - e, c = ci(o, 8, n), u = new Uint8Array(c);
        return u[0] |= 128, c;
      }
      let i = ci(e, 8, n), s = new Uint8Array(i);
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
function ag(r, e) {
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
function Fo() {
  if (typeof BigInt > "u")
    throw new Error("BigInt is not defined. Your environment doesn't implement BigInt.");
}
function Bu(r) {
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
function In(r, e, t, n) {
  return e instanceof Uint8Array ? e.byteLength ? t < 0 ? (r.error = "Wrong parameter: inputOffset less than zero", !1) : n < 0 ? (r.error = "Wrong parameter: inputLength less than zero", !1) : e.byteLength - t - n < 0 ? (r.error = "End of input reached before message was fully decoded (inconsistent offset and length values)", !1) : !0 : (r.error = "Wrong parameter: inputBuffer has zero length", !1) : (r.error = "Wrong parameter: inputBuffer must be 'Uint8Array'", !1);
}
class La {
  constructor() {
    this.items = [];
  }
  write(e) {
    this.items.push(e);
  }
  final() {
    return Bu(this.items);
  }
}
const _s = [new Uint8Array([1])], Pf = "0123456789", Mc = "name", jf = "valueHexView", cg = "isHexOnly", lg = "idBlock", ug = "tagClass", fg = "tagNumber", hg = "isConstructed", dg = "fromBER", pg = "toBER", yg = "local", yr = "", qr = new ArrayBuffer(0), Ha = new Uint8Array(0), Rs = "EndOfContent", Cd = "OCTET STRING", Bd = "BIT STRING";
function fn(r) {
  var e;
  return e = class extends r {
    constructor(...n) {
      var i;
      super(...n);
      const s = n[0] || {};
      this.isHexOnly = (i = s.isHexOnly) !== null && i !== void 0 ? i : !1, this.valueHexView = s.valueHex ? J.toUint8Array(s.valueHex) : Ha;
    }
    get valueHex() {
      return this.valueHexView.slice().buffer;
    }
    set valueHex(n) {
      this.valueHexView = new Uint8Array(n);
    }
    fromBER(n, i, s) {
      const o = n instanceof ArrayBuffer ? new Uint8Array(n) : n;
      if (!In(this, o, i, s))
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
        valueHex: he.ToHex(this.valueHexView)
      };
    }
  }, e.NAME = "hexBlock", e;
}
class _i {
  constructor({ blockLength: e = 0, error: t = yr, warnings: n = [], valueBeforeDecode: i = Ha } = {}) {
    this.blockLength = e, this.error = t, this.warnings = n, this.valueBeforeDecodeView = J.toUint8Array(i);
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
      valueBeforeDecode: he.ToHex(this.valueBeforeDecodeView)
    };
  }
}
_i.NAME = "baseBlock";
class fr extends _i {
  fromBER(e, t, n) {
    throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
  }
  toBER(e, t) {
    throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
  }
}
fr.NAME = "valueBlock";
class Od extends fn(_i) {
  constructor({ idBlock: e = {} } = {}) {
    var t, n, i, s;
    super(), e ? (this.isHexOnly = (t = e.isHexOnly) !== null && t !== void 0 ? t : !1, this.valueHexView = e.valueHex ? J.toUint8Array(e.valueHex) : Ha, this.tagClass = (n = e.tagClass) !== null && n !== void 0 ? n : -1, this.tagNumber = (i = e.tagNumber) !== null && i !== void 0 ? i : -1, this.isConstructed = (s = e.isConstructed) !== null && s !== void 0 ? s : !1) : (this.tagClass = -1, this.tagNumber = -1, this.isConstructed = !1);
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
      const i = ci(this.tagNumber, 7), s = new Uint8Array(i), o = i.byteLength, c = new Uint8Array(o + 1);
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
    const i = J.toUint8Array(e);
    if (!In(this, i, t, n))
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
      let u = 1, h = this.valueHexView = new Uint8Array(255), w = 255;
      for (; s[u] & 128; ) {
        if (h[u - 1] = s[u] & 127, u++, u >= s.length)
          return this.error = "End of input reached before message was fully decoded", -1;
        if (u === w) {
          w += 255;
          const q = new Uint8Array(w);
          for (let N = 0; N < h.length; N++)
            q[N] = h[N];
          h = this.valueHexView = new Uint8Array(w);
        }
      }
      this.blockLength = u + 1, h[u - 1] = s[u] & 127;
      const x = new Uint8Array(u);
      for (let q = 0; q < u; q++)
        x[q] = h[q];
      h = this.valueHexView = new Uint8Array(u), h.set(x), this.blockLength <= 9 ? this.tagNumber = $i(h, 7) : (this.isHexOnly = !0, this.warnings.push("Tag too long, represented as hex-coded"));
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
Od.NAME = "identificationBlock";
class Td extends _i {
  constructor({ lenBlock: e = {} } = {}) {
    var t, n, i;
    super(), this.isIndefiniteForm = (t = e.isIndefiniteForm) !== null && t !== void 0 ? t : !1, this.longFormUsed = (n = e.longFormUsed) !== null && n !== void 0 ? n : !1, this.length = (i = e.length) !== null && i !== void 0 ? i : 0;
  }
  fromBER(e, t, n) {
    const i = J.toUint8Array(e);
    if (!In(this, i, t, n))
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
    return u[o - 1] === 0 && this.warnings.push("Needlessly long encoded length"), this.length = $i(u, 8), this.longFormUsed && this.length <= 127 && this.warnings.push("Unnecessary usage of long length form"), this.blockLength = o + 1, t + this.blockLength;
  }
  toBER(e = !1) {
    let t, n;
    if (this.length > 127 && (this.longFormUsed = !0), this.isIndefiniteForm)
      return t = new ArrayBuffer(1), e === !1 && (n = new Uint8Array(t), n[0] = 128), t;
    if (this.longFormUsed) {
      const i = ci(this.length, 8);
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
Td.NAME = "lengthBlock";
const ce = {};
class Jt extends _i {
  constructor({ name: e = yr, optional: t = !1, primitiveSchema: n, ...i } = {}, s) {
    super(i), this.name = e, this.optional = t, n && (this.primitiveSchema = n), this.idBlock = new Od(i), this.lenBlock = new Td(i), this.valueBlock = s ? new s(i) : new fr(i);
  }
  fromBER(e, t, n) {
    const i = this.valueBlock.fromBER(e, t, this.lenBlock.isIndefiniteForm ? n : this.lenBlock.length);
    return i === -1 ? (this.error = this.valueBlock.error, i) : (this.idBlock.error.length || (this.blockLength += this.idBlock.blockLength), this.lenBlock.error.length || (this.blockLength += this.lenBlock.blockLength), this.valueBlock.error.length || (this.blockLength += this.valueBlock.blockLength), i);
  }
  toBER(e, t) {
    const n = t || new La();
    t || Nd(this);
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
    return e === "ascii" ? this.onAsciiEncoding() : he.ToHex(this.toBER());
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${he.ToHex(this.valueBlock.valueBeforeDecodeView)}`;
  }
  isEqual(e) {
    if (this === e)
      return !0;
    if (!(e instanceof this.constructor))
      return !1;
    const t = this.toBER(), n = e.toBER();
    return ag(t, n);
  }
}
Jt.NAME = "BaseBlock";
function Nd(r) {
  if (r instanceof ce.Constructed)
    for (const e of r.valueBlock.value)
      Nd(e) && (r.lenBlock.isIndefiniteForm = !0);
  return !!r.lenBlock.isIndefiniteForm;
}
class Ou extends Jt {
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
Ou.NAME = "BaseStringBlock";
class Pd extends fn(fr) {
  constructor({ isHexOnly: e = !0, ...t } = {}) {
    super(t), this.isHexOnly = e;
  }
}
Pd.NAME = "PrimitiveValueBlock";
var jd;
class uo extends Jt {
  constructor(e = {}) {
    super(e, Pd), this.idBlock.isConstructed = !1;
  }
}
jd = uo;
ce.Primitive = jd;
uo.NAME = "PRIMITIVE";
function gg(r, e) {
  if (r instanceof e)
    return r;
  const t = new e();
  return t.idBlock = r.idBlock, t.lenBlock = r.lenBlock, t.warnings = r.warnings, t.valueBeforeDecodeView = r.valueBeforeDecodeView, t;
}
function ns(r, e = 0, t = r.length) {
  const n = e;
  let i = new Jt({}, fr);
  const s = new _i();
  if (!In(s, r, e, t))
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
          u = ce.EndOfContent;
          break;
        case 1:
          u = ce.Boolean;
          break;
        case 2:
          u = ce.Integer;
          break;
        case 3:
          u = ce.BitString;
          break;
        case 4:
          u = ce.OctetString;
          break;
        case 5:
          u = ce.Null;
          break;
        case 6:
          u = ce.ObjectIdentifier;
          break;
        case 10:
          u = ce.Enumerated;
          break;
        case 12:
          u = ce.Utf8String;
          break;
        case 13:
          u = ce.RelativeObjectIdentifier;
          break;
        case 14:
          u = ce.TIME;
          break;
        case 15:
          return i.error = "[UNIVERSAL 15] is reserved by ASN.1 standard", {
            offset: -1,
            result: i
          };
        case 16:
          u = ce.Sequence;
          break;
        case 17:
          u = ce.Set;
          break;
        case 18:
          u = ce.NumericString;
          break;
        case 19:
          u = ce.PrintableString;
          break;
        case 20:
          u = ce.TeletexString;
          break;
        case 21:
          u = ce.VideotexString;
          break;
        case 22:
          u = ce.IA5String;
          break;
        case 23:
          u = ce.UTCTime;
          break;
        case 24:
          u = ce.GeneralizedTime;
          break;
        case 25:
          u = ce.GraphicString;
          break;
        case 26:
          u = ce.VisibleString;
          break;
        case 27:
          u = ce.GeneralString;
          break;
        case 28:
          u = ce.UniversalString;
          break;
        case 29:
          u = ce.CharacterString;
          break;
        case 30:
          u = ce.BmpString;
          break;
        case 31:
          u = ce.DATE;
          break;
        case 32:
          u = ce.TimeOfDay;
          break;
        case 33:
          u = ce.DateTime;
          break;
        case 34:
          u = ce.Duration;
          break;
        default: {
          const h = i.idBlock.isConstructed ? new ce.Constructed() : new ce.Primitive();
          h.idBlock = i.idBlock, h.lenBlock = i.lenBlock, h.warnings = i.warnings, i = h;
        }
      }
      break;
    case 2:
    case 3:
    case 4:
    default:
      u = i.idBlock.isConstructed ? ce.Constructed : ce.Primitive;
  }
  return i = gg(i, u), c = i.fromBER(r, e, i.lenBlock.isIndefiniteForm ? t : i.lenBlock.length), i.valueBeforeDecodeView = r.subarray(n, n + i.blockLength), {
    offset: c,
    result: i
  };
}
function Ri(r) {
  if (!r.byteLength) {
    const e = new Jt({}, fr);
    return e.error = "Input buffer has zero length", {
      offset: -1,
      result: e
    };
  }
  return ns(J.toUint8Array(r).slice(), 0, r.byteLength);
}
function vg(r, e) {
  return r ? 1 : e;
}
class Vn extends fr {
  constructor({ value: e = [], isIndefiniteForm: t = !1, ...n } = {}) {
    super(n), this.value = e, this.isIndefiniteForm = t;
  }
  fromBER(e, t, n) {
    const i = J.toUint8Array(e);
    if (!In(this, i, t, n))
      return -1;
    if (this.valueBeforeDecodeView = i.subarray(t, t + n), this.valueBeforeDecodeView.length === 0)
      return this.warnings.push("Zero buffer length"), t;
    let s = t;
    for (; vg(this.isIndefiniteForm, n) > 0; ) {
      const o = ns(i, s, n);
      if (o.offset === -1)
        return this.error = o.result.error, this.warnings.concat(o.result.warnings), -1;
      if (s = o.offset, this.blockLength += o.result.blockLength, n -= o.result.blockLength, this.value.push(o.result), this.isIndefiniteForm && o.result.constructor.NAME === Rs)
        break;
    }
    return this.isIndefiniteForm && (this.value[this.value.length - 1].constructor.NAME === Rs ? this.value.pop() : this.warnings.push("No EndOfContent block encoded")), s;
  }
  toBER(e, t) {
    const n = t || new La();
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
Vn.NAME = "ConstructedValueBlock";
var Rd;
class vr extends Jt {
  constructor(e = {}) {
    super(e, Vn), this.idBlock.isConstructed = !0;
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
Rd = vr;
ce.Constructed = Rd;
vr.NAME = "CONSTRUCTED";
class Ud extends fr {
  fromBER(e, t, n) {
    return t;
  }
  toBER(e) {
    return qr;
  }
}
Ud.override = "EndOfContentValueBlock";
var Dd;
class Tu extends Jt {
  constructor(e = {}) {
    super(e, Ud), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 0;
  }
}
Dd = Tu;
ce.EndOfContent = Dd;
Tu.NAME = Rs;
var $d;
class li extends Jt {
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
$d = li;
ce.Null = $d;
li.NAME = "NULL";
class Md extends fn(fr) {
  constructor({ value: e, ...t } = {}) {
    super(t), t.valueHex ? this.valueHexView = J.toUint8Array(t.valueHex) : this.valueHexView = new Uint8Array(1), e && (this.value = e);
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
    const i = J.toUint8Array(e);
    return In(this, i, t, n) ? (this.valueHexView = i.subarray(t, t + n), n > 1 && this.warnings.push("Boolean value encoded in more then 1 octet"), this.isHexOnly = !0, kd.call(this), this.blockLength = n, t + n) : -1;
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
Md.NAME = "BooleanValueBlock";
var Vd;
let Fa = class extends Jt {
  constructor(e = {}) {
    super(e, Md), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 1;
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
Vd = Fa;
ce.Boolean = Vd;
Fa.NAME = "BOOLEAN";
class Ld extends fn(Vn) {
  constructor({ isConstructed: e = !1, ...t } = {}) {
    super(t), this.isConstructed = e;
  }
  fromBER(e, t, n) {
    let i = 0;
    if (this.isConstructed) {
      if (this.isHexOnly = !1, i = Vn.prototype.fromBER.call(this, e, t, n), i === -1)
        return i;
      for (let s = 0; s < this.value.length; s++) {
        const o = this.value[s].constructor.NAME;
        if (o === Rs) {
          if (this.isIndefiniteForm)
            break;
          return this.error = "EndOfContent is unexpected, OCTET STRING may consists of OCTET STRINGs only", -1;
        }
        if (o !== Cd)
          return this.error = "OCTET STRING may consists of OCTET STRINGs only", -1;
      }
    } else
      this.isHexOnly = !0, i = super.fromBER(e, t, n), this.blockLength = n;
    return i;
  }
  toBER(e, t) {
    return this.isConstructed ? Vn.prototype.toBER.call(this, e, t) : e ? new ArrayBuffer(this.valueHexView.byteLength) : this.valueHexView.slice().buffer;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      isConstructed: this.isConstructed
    };
  }
}
Ld.NAME = "OctetStringValueBlock";
var Hd;
let si = class Fd extends Jt {
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
    }, Ld), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 4;
  }
  fromBER(e, t, n) {
    if (this.valueBlock.isConstructed = this.idBlock.isConstructed, this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm, n === 0)
      return this.idBlock.error.length === 0 && (this.blockLength += this.idBlock.blockLength), this.lenBlock.error.length === 0 && (this.blockLength += this.lenBlock.blockLength), t;
    if (!this.valueBlock.isConstructed) {
      const s = (e instanceof ArrayBuffer ? new Uint8Array(e) : e).subarray(t, t + n);
      try {
        if (s.byteLength) {
          const o = ns(s, 0, s.byteLength);
          o.offset !== -1 && o.offset === n && (this.valueBlock.value = [o.result]);
        }
      } catch {
      }
    }
    return super.fromBER(e, t, n);
  }
  onAsciiEncoding() {
    return this.valueBlock.isConstructed || this.valueBlock.value && this.valueBlock.value.length ? vr.prototype.onAsciiEncoding.call(this) : `${this.constructor.NAME} : ${he.ToHex(this.valueBlock.valueHexView)}`;
  }
  getValue() {
    if (!this.idBlock.isConstructed)
      return this.valueBlock.valueHexView.slice().buffer;
    const e = [];
    for (const t of this.valueBlock.value)
      t instanceof Fd && e.push(t.valueBlock.valueHexView);
    return J.concat(e);
  }
};
Hd = si;
ce.OctetString = Hd;
si.NAME = Cd;
class zd extends fn(Vn) {
  constructor({ unusedBits: e = 0, isConstructed: t = !1, ...n } = {}) {
    super(n), this.unusedBits = e, this.isConstructed = t, this.blockLength = this.valueHexView.byteLength;
  }
  fromBER(e, t, n) {
    if (!n)
      return t;
    let i = -1;
    if (this.isConstructed) {
      if (i = Vn.prototype.fromBER.call(this, e, t, n), i === -1)
        return i;
      for (const c of this.value) {
        const u = c.constructor.NAME;
        if (u === Rs) {
          if (this.isIndefiniteForm)
            break;
          return this.error = "EndOfContent is unexpected, BIT STRING may consists of BIT STRINGs only", -1;
        }
        if (u !== Bd)
          return this.error = "BIT STRING may consists of BIT STRINGs only", -1;
        const h = c.valueBlock;
        if (this.unusedBits > 0 && h.unusedBits > 0)
          return this.error = 'Using of "unused bits" inside constructive BIT STRING allowed for least one only', -1;
        this.unusedBits = h.unusedBits;
      }
      return i;
    }
    const s = J.toUint8Array(e);
    if (!In(this, s, t, n))
      return -1;
    const o = s.subarray(t, t + n);
    if (this.unusedBits = o[0], this.unusedBits > 7)
      return this.error = "Unused bits for BitString must be in range 0-7", -1;
    if (!this.unusedBits) {
      const c = o.subarray(1);
      try {
        if (c.byteLength) {
          const u = ns(c, 0, c.byteLength);
          u.offset !== -1 && u.offset === n - 1 && (this.value = [u.result]);
        }
      } catch {
      }
    }
    return this.valueHexView = o.subarray(1), this.blockLength = o.length, t + n;
  }
  toBER(e, t) {
    if (this.isConstructed)
      return Vn.prototype.toBER.call(this, e, t);
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
zd.NAME = "BitStringValueBlock";
var Gd;
let oi = class extends Jt {
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
    }, zd), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 3;
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
Gd = oi;
ce.BitString = Gd;
oi.NAME = Bd;
var qd;
function mg(r, e) {
  const t = new Uint8Array([0]), n = new Uint8Array(r), i = new Uint8Array(e);
  let s = n.slice(0);
  const o = s.length - 1, c = i.slice(0), u = c.length - 1;
  let h = 0;
  const w = u < o ? o : u;
  let x = 0;
  for (let q = w; q >= 0; q--, x++) {
    switch (!0) {
      case x < c.length:
        h = s[o - x] + c[u - x] + t[0];
        break;
      default:
        h = s[o - x] + t[0];
    }
    switch (t[0] = h / 10, !0) {
      case x >= s.length:
        s = nl(new Uint8Array([h % 10]), s);
        break;
      default:
        s[o - x] = h % 10;
    }
  }
  return t[0] > 0 && (s = nl(t, s)), s;
}
function Rf(r) {
  if (r >= _s.length)
    for (let e = _s.length; e <= r; e++) {
      const t = new Uint8Array([0]);
      let n = _s[e - 1].slice(0);
      for (let i = n.length - 1; i >= 0; i--) {
        const s = new Uint8Array([(n[i] << 1) + t[0]]);
        t[0] = s[0] / 10, n[i] = s[0] % 10;
      }
      t[0] > 0 && (n = nl(t, n)), _s.push(n);
    }
  return _s[r];
}
function wg(r, e) {
  let t = 0;
  const n = new Uint8Array(r), i = new Uint8Array(e), s = n.slice(0), o = s.length - 1, c = i.slice(0), u = c.length - 1;
  let h, w = 0;
  for (let x = u; x >= 0; x--, w++)
    switch (h = s[o - w] - c[u - w] - t, !0) {
      case h < 0:
        t = 1, s[o - w] = h + 10;
        break;
      default:
        t = 0, s[o - w] = h;
    }
  if (t > 0)
    for (let x = o - u + 1; x >= 0; x--, w++)
      if (h = s[o - w] - t, h < 0)
        t = 1, s[o - w] = h + 10;
      else {
        t = 0, s[o - w] = h;
        break;
      }
  return s.slice();
}
class Nu extends fn(fr) {
  constructor({ value: e, ...t } = {}) {
    super(t), this._valueDec = 0, t.valueHex && this.setValueHex(), e !== void 0 && (this.valueDec = e);
  }
  setValueHex() {
    this.valueHexView.length >= 4 ? (this.warnings.push("Too big Integer for decoding, hex only"), this.isHexOnly = !0, this._valueDec = 0) : (this.isHexOnly = !1, this.valueHexView.length > 0 && (this._valueDec = kd.call(this)));
  }
  set valueDec(e) {
    this._valueDec = e, this.isHexOnly = !1, this.valueHexView = new Uint8Array(og(e));
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
              t = wg(Rf(n), t), o = "-";
              break;
            default:
              t = mg(t, Rf(n));
          }
        n++, i >>= 1;
      }
    }
    for (let u = 0; u < t.length; u++)
      t[u] && (c = !0), c && (o += Pf.charAt(t[u]));
    return c === !1 && (o += Pf.charAt(0)), o;
  }
}
qd = Nu;
Nu.NAME = "IntegerValueBlock";
Object.defineProperty(qd.prototype, "valueHex", {
  set: function(r) {
    this.valueHexView = new Uint8Array(r), this.setValueHex();
  },
  get: function() {
    return this.valueHexView.slice().buffer;
  }
});
var Kd;
class nn extends Jt {
  constructor(e = {}) {
    super(e, Nu), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 2;
  }
  toBigInt() {
    return Fo(), BigInt(this.valueBlock.toString());
  }
  static fromBigInt(e) {
    Fo();
    const t = BigInt(e), n = new La(), i = t.toString(16).replace(/^-/, ""), s = new Uint8Array(he.FromHex(i));
    if (t < 0) {
      const c = new Uint8Array(s.length + (s[0] & 128 ? 1 : 0));
      c[0] |= 128;
      const h = BigInt(`0x${he.ToHex(c)}`) + t, w = J.toUint8Array(he.FromHex(h.toString(16)));
      w[0] |= 128, n.write(w);
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
Kd = nn;
ce.Integer = Kd;
nn.NAME = "INTEGER";
var Zd;
class za extends nn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 10;
  }
}
Zd = za;
ce.Enumerated = Zd;
za.NAME = "ENUMERATED";
class il extends fn(fr) {
  constructor({ valueDec: e = -1, isFirstSid: t = !1, ...n } = {}) {
    super(n), this.valueDec = e, this.isFirstSid = t;
  }
  fromBER(e, t, n) {
    if (!n)
      return t;
    const i = J.toUint8Array(e);
    if (!In(this, i, t, n))
      return -1;
    const s = i.subarray(t, t + n);
    this.valueHexView = new Uint8Array(n);
    for (let c = 0; c < n && (this.valueHexView[c] = s[c] & 127, this.blockLength++, !!(s[c] & 128)); c++)
      ;
    const o = new Uint8Array(this.blockLength);
    for (let c = 0; c < this.blockLength; c++)
      o[c] = this.valueHexView[c];
    return this.valueHexView = o, s[this.blockLength - 1] & 128 ? (this.error = "End of input reached before message was fully decoded", -1) : (this.valueHexView[0] === 0 && this.warnings.push("Needlessly long format of SID encoding"), this.blockLength <= 8 ? this.valueDec = $i(this.valueHexView, 7) : (this.isHexOnly = !0, this.warnings.push("Too big SID for decoding, hex only")), t + this.blockLength);
  }
  set valueBigInt(e) {
    Fo();
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
    const t = ci(this.valueDec, 7);
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
      e = he.ToHex(this.valueHexView);
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
il.NAME = "sidBlock";
class Wd extends fr {
  constructor({ value: e = yr, ...t } = {}) {
    super(t), this.value = [], e && this.fromString(e);
  }
  fromBER(e, t, n) {
    let i = t;
    for (; n > 0; ) {
      const s = new il();
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
    return Bu(t);
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
        const o = new il();
        if (i > Number.MAX_SAFE_INTEGER) {
          Fo();
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
Wd.NAME = "ObjectIdentifierValueBlock";
var Yd;
class Ga extends Jt {
  constructor(e = {}) {
    super(e, Wd), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 6;
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
Yd = Ga;
ce.ObjectIdentifier = Yd;
Ga.NAME = "OBJECT IDENTIFIER";
class sl extends fn(_i) {
  constructor({ valueDec: e = 0, ...t } = {}) {
    super(t), this.valueDec = e;
  }
  fromBER(e, t, n) {
    if (n === 0)
      return t;
    const i = J.toUint8Array(e);
    if (!In(this, i, t, n))
      return -1;
    const s = i.subarray(t, t + n);
    this.valueHexView = new Uint8Array(n);
    for (let c = 0; c < n && (this.valueHexView[c] = s[c] & 127, this.blockLength++, !!(s[c] & 128)); c++)
      ;
    const o = new Uint8Array(this.blockLength);
    for (let c = 0; c < this.blockLength; c++)
      o[c] = this.valueHexView[c];
    return this.valueHexView = o, s[this.blockLength - 1] & 128 ? (this.error = "End of input reached before message was fully decoded", -1) : (this.valueHexView[0] === 0 && this.warnings.push("Needlessly long format of SID encoding"), this.blockLength <= 8 ? this.valueDec = $i(this.valueHexView, 7) : (this.isHexOnly = !0, this.warnings.push("Too big SID for decoding, hex only")), t + this.blockLength);
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
    const t = ci(this.valueDec, 7);
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
    return this.isHexOnly ? e = he.ToHex(this.valueHexView) : e = this.valueDec.toString(), e;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      valueDec: this.valueDec
    };
  }
}
sl.NAME = "relativeSidBlock";
class Jd extends fr {
  constructor({ value: e = yr, ...t } = {}) {
    super(t), this.value = [], e && this.fromString(e);
  }
  fromBER(e, t, n) {
    let i = t;
    for (; n > 0; ) {
      const s = new sl();
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
    return Bu(n);
  }
  fromString(e) {
    this.value = [];
    let t = 0, n = 0, i = "";
    do {
      n = e.indexOf(".", t), n === -1 ? i = e.substring(t) : i = e.substring(t, n), t = n + 1;
      const s = new sl();
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
Jd.NAME = "RelativeObjectIdentifierValueBlock";
var Xd;
class Pu extends Jt {
  constructor(e = {}) {
    super(e, Jd), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 13;
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
Xd = Pu;
ce.RelativeObjectIdentifier = Xd;
Pu.NAME = "RelativeObjectIdentifier";
var Qd;
class mn extends vr {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 16;
  }
}
Qd = mn;
ce.Sequence = Qd;
mn.NAME = "SEQUENCE";
var ep;
let wn = class extends vr {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 17;
  }
};
ep = wn;
ce.Set = ep;
wn.NAME = "SET";
class tp extends fn(fr) {
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
tp.NAME = "StringValueBlock";
class rp extends tp {
}
rp.NAME = "SimpleStringValueBlock";
class Ir extends Ou {
  constructor({ ...e } = {}) {
    super(e, rp);
  }
  fromBuffer(e) {
    this.valueBlock.value = String.fromCharCode.apply(null, J.toUint8Array(e));
  }
  fromString(e) {
    const t = e.length, n = this.valueBlock.valueHexView = new Uint8Array(t);
    for (let i = 0; i < t; i++)
      n[i] = e.charCodeAt(i);
    this.valueBlock.value = e;
  }
}
Ir.NAME = "SIMPLE STRING";
class np extends Ir {
  fromBuffer(e) {
    this.valueBlock.valueHexView = J.toUint8Array(e);
    try {
      this.valueBlock.value = he.ToUtf8String(e);
    } catch (t) {
      this.warnings.push(`Error during "decodeURIComponent": ${t}, using raw string`), this.valueBlock.value = he.ToBinary(e);
    }
  }
  fromString(e) {
    this.valueBlock.valueHexView = new Uint8Array(he.FromUtf8String(e)), this.valueBlock.value = e;
  }
}
np.NAME = "Utf8StringValueBlock";
var ip;
class kn extends np {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 12;
  }
}
ip = kn;
ce.Utf8String = ip;
kn.NAME = "UTF8String";
class sp extends Ir {
  fromBuffer(e) {
    this.valueBlock.value = he.ToUtf16String(e), this.valueBlock.valueHexView = J.toUint8Array(e);
  }
  fromString(e) {
    this.valueBlock.value = e, this.valueBlock.valueHexView = new Uint8Array(he.FromUtf16String(e));
  }
}
sp.NAME = "BmpStringValueBlock";
var op;
class qa extends sp {
  constructor({ ...e } = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 30;
  }
}
op = qa;
ce.BmpString = op;
qa.NAME = "BMPString";
class ap extends Ir {
  fromBuffer(e) {
    const t = ArrayBuffer.isView(e) ? e.slice().buffer : e.slice(0), n = new Uint8Array(t);
    for (let i = 0; i < n.length; i += 4)
      n[i] = n[i + 3], n[i + 1] = n[i + 2], n[i + 2] = 0, n[i + 3] = 0;
    this.valueBlock.value = String.fromCharCode.apply(null, new Uint32Array(t));
  }
  fromString(e) {
    const t = e.length, n = this.valueBlock.valueHexView = new Uint8Array(t * 4);
    for (let i = 0; i < t; i++) {
      const s = ci(e.charCodeAt(i), 8), o = new Uint8Array(s);
      if (o.length > 4)
        continue;
      const c = 4 - o.length;
      for (let u = o.length - 1; u >= 0; u--)
        n[i * 4 + u + c] = o[u];
    }
    this.valueBlock.value = e;
  }
}
ap.NAME = "UniversalStringValueBlock";
var cp;
class Ka extends ap {
  constructor({ ...e } = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 28;
  }
}
cp = Ka;
ce.UniversalString = cp;
Ka.NAME = "UniversalString";
var lp;
class Za extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 18;
  }
}
lp = Za;
ce.NumericString = lp;
Za.NAME = "NumericString";
var up;
class Wa extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 19;
  }
}
up = Wa;
ce.PrintableString = up;
Wa.NAME = "PrintableString";
var fp;
class Ya extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 20;
  }
}
fp = Ya;
ce.TeletexString = fp;
Ya.NAME = "TeletexString";
var hp;
class Ja extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 21;
  }
}
hp = Ja;
ce.VideotexString = hp;
Ja.NAME = "VideotexString";
var dp;
class Xa extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 22;
  }
}
dp = Xa;
ce.IA5String = dp;
Xa.NAME = "IA5String";
var pp;
class Qa extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 25;
  }
}
pp = Qa;
ce.GraphicString = pp;
Qa.NAME = "GraphicString";
var yp;
class fo extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 26;
  }
}
yp = fo;
ce.VisibleString = yp;
fo.NAME = "VisibleString";
var gp;
class ec extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 27;
  }
}
gp = ec;
ce.GeneralString = gp;
ec.NAME = "GeneralString";
var vp;
class tc extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 29;
  }
}
vp = tc;
ce.CharacterString = vp;
tc.NAME = "CharacterString";
var mp;
class ho extends fo {
  constructor({ value: e, valueDate: t, ...n } = {}) {
    if (super(n), this.year = 0, this.month = 0, this.day = 0, this.hour = 0, this.minute = 0, this.second = 0, e) {
      this.fromString(e), this.valueBlock.valueHexView = new Uint8Array(e.length);
      for (let i = 0; i < e.length; i++)
        this.valueBlock.valueHexView[i] = e.charCodeAt(i);
    }
    t && (this.fromDate(t), this.valueBlock.valueHexView = new Uint8Array(this.toBuffer())), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 23;
  }
  fromBuffer(e) {
    this.fromString(String.fromCharCode.apply(null, J.toUint8Array(e)));
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
mp = ho;
ce.UTCTime = mp;
ho.NAME = "UTCTime";
var wp;
class rc extends ho {
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
      let x = 1, q = n.indexOf("+"), N = "";
      if (q === -1 && (q = n.indexOf("-"), x = -1), q !== -1) {
        if (N = n.substring(q + 1), n = n.substring(0, q), N.length !== 2 && N.length !== 4)
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
    const w = o.exec(i);
    if (w === null)
      throw new Error("Wrong input string for conversion");
    for (let x = 1; x < w.length; x++)
      switch (x) {
        case 1:
          this.year = parseInt(w[x], 10);
          break;
        case 2:
          this.month = parseInt(w[x], 10);
          break;
        case 3:
          this.day = parseInt(w[x], 10);
          break;
        case 4:
          this.hour = parseInt(w[x], 10) + c;
          break;
        case 5:
          this.minute = parseInt(w[x], 10) + u;
          break;
        case 6:
          this.second = parseInt(w[x], 10);
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
wp = rc;
ce.GeneralizedTime = wp;
rc.NAME = "GeneralizedTime";
var bp;
class ju extends kn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 31;
  }
}
bp = ju;
ce.DATE = bp;
ju.NAME = "DATE";
var xp;
class Ru extends kn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 32;
  }
}
xp = Ru;
ce.TimeOfDay = xp;
Ru.NAME = "TimeOfDay";
var Ap;
class Uu extends kn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 33;
  }
}
Ap = Uu;
ce.DateTime = Ap;
Uu.NAME = "DateTime";
var Sp;
class Du extends kn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 34;
  }
}
Sp = Du;
ce.Duration = Sp;
Du.NAME = "Duration";
var _p;
class $u extends kn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 14;
  }
}
_p = $u;
ce.TIME = _p;
$u.NAME = "TIME";
class ui {
  constructor({ name: e = yr, optional: t = !1 } = {}) {
    this.name = e, this.optional = t;
  }
}
class Mu extends ui {
  constructor({ value: e = [], ...t } = {}) {
    super(t), this.value = e;
  }
}
class zo extends ui {
  constructor({ value: e = new ui(), local: t = !1, ...n } = {}) {
    super(n), this.value = e, this.local = t;
  }
}
class bg {
  constructor({ data: e = Ha } = {}) {
    this.dataView = J.toUint8Array(e);
  }
  get data() {
    return this.dataView.slice().buffer;
  }
  set data(e) {
    this.dataView = J.toUint8Array(e);
  }
  fromBER(e, t, n) {
    const i = t + n;
    return this.dataView = J.toUint8Array(e).subarray(t, i), i;
  }
  toBER(e) {
    return this.dataView.slice().buffer;
  }
}
function ri(r, e, t) {
  if (t instanceof Mu) {
    for (let s = 0; s < t.value.length; s++)
      if (ri(r, e, t.value[s]).verified)
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
      return t.hasOwnProperty(Mc) && (s.name = t.name), s;
    }
  }
  if (t instanceof ui)
    return t.hasOwnProperty(Mc) && (r[t.name] = e), {
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
  if (!(lg in t))
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (!(dg in t.idBlock))
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (!(pg in t.idBlock))
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
  if (t.idBlock.hasOwnProperty(ug) === !1)
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (t.idBlock.tagClass !== e.idBlock.tagClass)
    return {
      verified: !1,
      result: r
    };
  if (t.idBlock.hasOwnProperty(fg) === !1)
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (t.idBlock.tagNumber !== e.idBlock.tagNumber)
    return {
      verified: !1,
      result: r
    };
  if (t.idBlock.hasOwnProperty(hg) === !1)
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (t.idBlock.isConstructed !== e.idBlock.isConstructed)
    return {
      verified: !1,
      result: r
    };
  if (!(cg in t.idBlock))
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
    if (!(jf in t.idBlock))
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
  if (t.name && (t.name = t.name.replace(/^\s+|\s+$/g, yr), t.name && (r[t.name] = e)), t instanceof ce.Constructed) {
    let s = 0, o = {
      verified: !1,
      result: {
        error: "Unknown error"
      }
    }, c = t.valueBlock.value.length;
    if (c > 0 && t.valueBlock.value[0] instanceof zo && (c = e.valueBlock.value.length), c === 0)
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
      } else if (t.valueBlock.value[0] instanceof zo) {
        if (o = ri(r, e.valueBlock.value[u], t.valueBlock.value[0].value), o.verified === !1)
          if (t.valueBlock.value[0].optional)
            s++;
          else
            return t.name && (t.name = t.name.replace(/^\s+|\s+$/g, yr), t.name && delete r[t.name]), o;
        if (Mc in t.valueBlock.value[0] && t.valueBlock.value[0].name.length > 0) {
          let h = {};
          yg in t.valueBlock.value[0] && t.valueBlock.value[0].local ? h = e : h = r, typeof h[t.valueBlock.value[0].name] > "u" && (h[t.valueBlock.value[0].name] = []), h[t.valueBlock.value[0].name].push(e.valueBlock.value[u]);
        }
      } else if (o = ri(r, e.valueBlock.value[u - s], t.valueBlock.value[u]), o.verified === !1)
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
  if (t.primitiveSchema && jf in e.valueBlock) {
    const s = ns(e.valueBlock.valueHexView);
    if (s.offset === -1) {
      const o = {
        verified: !1,
        result: s.result
      };
      return t.name && (t.name = t.name.replace(/^\s+|\s+$/g, yr), t.name && (delete r[t.name], o.name = t.name)), o;
    }
    return ri(r, s.result, t.primitiveSchema);
  }
  return {
    verified: !0,
    result: r
  };
}
function xg(r, e) {
  if (!(e instanceof Object))
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema type" }
    };
  const t = ns(J.toUint8Array(r));
  return t.offset === -1 ? {
    verified: !1,
    result: t.result
  } : ri(t.result, t.result, e);
}
const Ep = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Any: ui,
  BaseBlock: Jt,
  BaseStringBlock: Ou,
  BitString: oi,
  BmpString: qa,
  Boolean: Fa,
  CharacterString: tc,
  Choice: Mu,
  Constructed: vr,
  DATE: ju,
  DateTime: Uu,
  Duration: Du,
  EndOfContent: Tu,
  Enumerated: za,
  GeneralString: ec,
  GeneralizedTime: rc,
  GraphicString: Qa,
  HexBlock: fn,
  IA5String: Xa,
  Integer: nn,
  Null: li,
  NumericString: Za,
  ObjectIdentifier: Ga,
  OctetString: si,
  Primitive: uo,
  PrintableString: Wa,
  RawData: bg,
  RelativeObjectIdentifier: Pu,
  Repeated: zo,
  Sequence: mn,
  Set: wn,
  TIME: $u,
  TeletexString: Ya,
  TimeOfDay: Ru,
  UTCTime: ho,
  UniversalString: Ka,
  Utf8String: kn,
  ValueBlock: fr,
  VideotexString: Ja,
  ViewWriter: La,
  VisibleString: fo,
  compareSchema: ri,
  fromBER: Ri,
  verifySchema: xg
}, Symbol.toStringTag, { value: "Module" }));
var M;
(function(r) {
  r[r.Sequence = 0] = "Sequence", r[r.Set = 1] = "Set", r[r.Choice = 2] = "Choice";
})(M || (M = {}));
var b;
(function(r) {
  r[r.Any = 1] = "Any", r[r.Boolean = 2] = "Boolean", r[r.OctetString = 3] = "OctetString", r[r.BitString = 4] = "BitString", r[r.Integer = 5] = "Integer", r[r.Enumerated = 6] = "Enumerated", r[r.ObjectIdentifier = 7] = "ObjectIdentifier", r[r.Utf8String = 8] = "Utf8String", r[r.BmpString = 9] = "BmpString", r[r.UniversalString = 10] = "UniversalString", r[r.NumericString = 11] = "NumericString", r[r.PrintableString = 12] = "PrintableString", r[r.TeletexString = 13] = "TeletexString", r[r.VideotexString = 14] = "VideotexString", r[r.IA5String = 15] = "IA5String", r[r.GraphicString = 16] = "GraphicString", r[r.VisibleString = 17] = "VisibleString", r[r.GeneralString = 18] = "GeneralString", r[r.CharacterString = 19] = "CharacterString", r[r.UTCTime = 20] = "UTCTime", r[r.GeneralizedTime = 21] = "GeneralizedTime", r[r.DATE = 22] = "DATE", r[r.TimeOfDay = 23] = "TimeOfDay", r[r.DateTime = 24] = "DateTime", r[r.Duration = 25] = "Duration", r[r.TIME = 26] = "TIME", r[r.Null = 27] = "Null";
})(b || (b = {}));
class nc {
  constructor(e, t = 0) {
    if (this.unusedBits = 0, this.value = new ArrayBuffer(0), e)
      if (typeof e == "number")
        this.fromNumber(e);
      else if (J.isBufferSource(e))
        this.unusedBits = t, this.value = J.toArrayBuffer(e);
      else
        throw TypeError("Unsupported type of 'params' argument for BitString");
  }
  fromASN(e) {
    if (!(e instanceof oi))
      throw new TypeError("Argument 'asn' is not instance of ASN.1 BitString");
    return this.unusedBits = e.valueBlock.unusedBits, this.value = e.valueBlock.valueHex, this;
  }
  toASN() {
    return new oi({ unusedBits: this.unusedBits, valueHex: this.value });
  }
  toSchema(e) {
    return new oi({ name: e });
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
    typeof e == "number" ? this.buffer = new ArrayBuffer(e) : J.isBufferSource(e) ? this.buffer = J.toArrayBuffer(e) : Array.isArray(e) ? this.buffer = new Uint8Array(e) : this.buffer = new ArrayBuffer(0);
  }
  fromASN(e) {
    if (!(e instanceof si))
      throw new TypeError("Argument 'asn' is not instance of ASN.1 OctetString");
    return this.buffer = e.valueBlock.valueHex, this;
  }
  toASN() {
    return new si({ valueHex: this.buffer });
  }
  toSchema(e) {
    return new si({ name: e });
  }
}
const Ag = {
  fromASN: (r) => r instanceof li ? null : r.valueBeforeDecodeView,
  toASN: (r) => {
    if (r === null)
      return new li();
    const e = Ri(r);
    if (e.result.error)
      throw new Error(e.result.error);
    return e.result;
  }
}, Sg = {
  fromASN: (r) => r.valueBlock.valueHexView.byteLength >= 4 ? r.valueBlock.toString() : r.valueBlock.valueDec,
  toASN: (r) => new nn({ value: +r })
}, _g = {
  fromASN: (r) => r.valueBlock.valueDec,
  toASN: (r) => new za({ value: r })
}, bt = {
  fromASN: (r) => r.valueBlock.valueHexView,
  toASN: (r) => new nn({ valueHex: r })
}, Eg = {
  fromASN: (r) => r.valueBlock.valueHexView,
  toASN: (r) => new oi({ valueHex: r })
}, Ig = {
  fromASN: (r) => r.valueBlock.toString(),
  toASN: (r) => new Ga({ value: r })
}, kg = {
  fromASN: (r) => r.valueBlock.value,
  toASN: (r) => new Fa({ value: r })
}, Go = {
  fromASN: (r) => r.valueBlock.valueHexView,
  toASN: (r) => new si({ valueHex: r })
}, Cg = {
  fromASN: (r) => new nt(r.getValue()),
  toASN: (r) => r.toASN()
};
function Nr(r) {
  return {
    fromASN: (e) => e.valueBlock.value,
    toASN: (e) => new r({ value: e })
  };
}
const Ip = Nr(kn), Bg = Nr(qa), Og = Nr(Ka), Tg = Nr(Za), Ng = Nr(Wa), Pg = Nr(Ya), jg = Nr(Ja), Rg = Nr(Xa), Ug = Nr(Qa), Dg = Nr(fo), $g = Nr(ec), Mg = Nr(tc), Vg = {
  fromASN: (r) => r.toDate(),
  toASN: (r) => new ho({ valueDate: r })
}, Lg = {
  fromASN: (r) => r.toDate(),
  toASN: (r) => new rc({ valueDate: r })
}, Hg = {
  fromASN: () => null,
  toASN: () => new li()
};
function Vu(r) {
  switch (r) {
    case b.Any:
      return Ag;
    case b.BitString:
      return Eg;
    case b.BmpString:
      return Bg;
    case b.Boolean:
      return kg;
    case b.CharacterString:
      return Mg;
    case b.Enumerated:
      return _g;
    case b.GeneralString:
      return $g;
    case b.GeneralizedTime:
      return Lg;
    case b.GraphicString:
      return Ug;
    case b.IA5String:
      return Rg;
    case b.Integer:
      return Sg;
    case b.Null:
      return Hg;
    case b.NumericString:
      return Tg;
    case b.ObjectIdentifier:
      return Ig;
    case b.OctetString:
      return Go;
    case b.PrintableString:
      return Ng;
    case b.TeletexString:
      return Pg;
    case b.UTCTime:
      return Vg;
    case b.UniversalString:
      return Og;
    case b.Utf8String:
      return Ip;
    case b.VideotexString:
      return jg;
    case b.VisibleString:
      return Dg;
    default:
      return null;
  }
}
function gn(r) {
  return typeof r == "function" && r.prototype ? r.prototype.toASN && r.prototype.fromASN ? !0 : gn(r.prototype) : !!(r && typeof r == "object" && "toASN" in r && "fromASN" in r);
}
function kp(r) {
  var e;
  if (r) {
    const t = Object.getPrototypeOf(r);
    return ((e = t == null ? void 0 : t.prototype) === null || e === void 0 ? void 0 : e.constructor) === Array ? !0 : kp(t);
  }
  return !1;
}
function Fg(r, e) {
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
        const w = b[o.type], x = Ep[w];
        if (!x)
          throw new Error(`Cannot get ASN1 class by name '${w}'`);
        u = new x({ name: c });
      } else gn(o.type) ? u = new o.type().toSchema(c) : o.optional ? this.get(o.type).type === M.Choice ? u = new ui({ name: c }) : (u = this.create(o.type, !1), u.name = c) : u = new ui({ name: c });
      const h = !!o.optional || o.defaultValue !== void 0;
      if (o.repeated) {
        u.name = "";
        const w = o.repeated === "set" ? wn : mn;
        u = new w({
          name: "",
          value: [
            new zo({
              name: c,
              value: u
            })
          ]
        });
      }
      if (o.context !== null && o.context !== void 0)
        if (o.implicit)
          if (typeof o.type == "number" || gn(o.type)) {
            const w = o.repeated ? vr : uo;
            i.push(new w({
              name: c,
              optional: h,
              idBlock: {
                tagClass: 3,
                tagNumber: o.context
              }
            }));
          } else {
            this.cache(o.type);
            const w = !!o.repeated;
            let x = w ? u : this.get(o.type, !0).schema;
            x = "valueBlock" in x ? x.valueBlock.value : x.value, i.push(new vr({
              name: w ? "" : c,
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
        return new mn({ value: i, name: "" });
      case M.Set:
        return new wn({ value: i, name: "" });
      case M.Choice:
        return new Mu({ value: i, name: "" });
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
    const s = Vu(r.type);
    if (!s)
      throw new Error(`Cannot get default converter for property '${t}' of ${e.constructor.name}`);
    i.converter = s;
  }
  n.items[t] = i;
};
class Uf extends Error {
  constructor() {
    super(...arguments), this.schemas = [];
  }
}
class Gg {
  static parse(e, t) {
    const n = Ri(e);
    if (n.result.error)
      throw new Error(n.result.error);
    return this.fromASN(n.result, t);
  }
  static fromASN(e, t) {
    var n;
    try {
      if (gn(t))
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
      const o = ri({}, e, s);
      if (!o.verified)
        throw new Uf(`Data does not match to ${t.name} ASN1 schema. ${o.result.error}`);
      const c = new t();
      if (kp(t)) {
        if (!("value" in e.valueBlock && Array.isArray(e.valueBlock.value)))
          throw new Error("Cannot get items from the ASN.1 parsed value. ASN.1 object is not constructed.");
        const u = i.itemType;
        if (typeof u == "number") {
          const h = Vu(u);
          if (!h)
            throw new Error(`Cannot get default converter for array item of ${t.name} ASN1 schema`);
          return t.from(e.valueBlock.value, (w) => h.fromASN(w));
        } else
          return t.from(e.valueBlock.value, (h) => this.fromASN(h, u));
      }
      for (const u in i.items) {
        const h = o.result[u];
        if (!h)
          continue;
        const w = i.items[u], x = w.type;
        if (typeof x == "number" || gn(x)) {
          const q = (n = w.converter) !== null && n !== void 0 ? n : gn(x) ? new x() : null;
          if (!q)
            throw new Error("Converter is empty");
          if (w.repeated)
            if (w.implicit) {
              const N = w.repeated === "sequence" ? mn : wn, v = new N();
              v.valueBlock = h.valueBlock;
              const A = Ri(v.toBER(!1));
              if (A.offset === -1)
                throw new Error(`Cannot parse the child item. ${A.result.error}`);
              if (!("value" in A.result.valueBlock && Array.isArray(A.result.valueBlock.value)))
                throw new Error("Cannot get items from the ASN.1 parsed value. ASN.1 object is not constructed.");
              const O = A.result.valueBlock.value;
              c[u] = Array.from(O, (I) => q.fromASN(I));
            } else
              c[u] = Array.from(h, (N) => q.fromASN(N));
          else {
            let N = h;
            if (w.implicit) {
              let v;
              if (gn(x))
                v = new x().toSchema("");
              else {
                const A = b[x], O = Ep[A];
                if (!O)
                  throw new Error(`Cannot get '${A}' class from asn1js module`);
                v = new O();
              }
              v.valueBlock = N.valueBlock, N = Ri(v.toBER(!1)).result;
            }
            c[u] = q.fromASN(N);
          }
        } else if (w.repeated) {
          if (!Array.isArray(h))
            throw new Error("Cannot get list of items from the ASN.1 parsed value. ASN.1 value should be iterable.");
          c[u] = Array.from(h, (q) => this.fromASN(q, x));
        } else
          c[u] = this.fromASN(h, x);
      }
      return c;
    } catch (i) {
      throw i instanceof Uf && i.schemas.push(t.name), i;
    }
  }
}
class Lu {
  static serialize(e) {
    return e instanceof Jt ? e.toBER(!1) : this.toASN(e).toBER(!1);
  }
  static toASN(e) {
    if (e && typeof e == "object" && gn(e))
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
        const o = Vu(n.itemType);
        if (!o)
          throw new Error(`Cannot get default converter for array item of ${t.name} ASN1 schema`);
        i = e.map((c) => o.toASN(c));
      } else
        i = e.map((o) => this.toAsnItem({ type: n.itemType }, "[]", t, o));
    } else
      for (const o in n.items) {
        const c = n.items[o], u = e[o];
        if (u === void 0 || c.defaultValue === u || typeof c.defaultValue == "object" && typeof u == "object" && Fg(this.serialize(c.defaultValue), this.serialize(u)))
          continue;
        const h = Lu.toAsnItem(c, o, t, u);
        if (typeof c.context == "number")
          if (c.implicit)
            if (!c.repeated && (typeof c.type == "number" || gn(c.type))) {
              const w = {};
              w.valueHex = h instanceof li ? h.valueBeforeDecodeView : h.valueBlock.toBER(), i.push(new uo({
                optional: c.optional,
                idBlock: {
                  tagClass: 3,
                  tagNumber: c.context
                },
                ...w
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
        s = new mn({ value: i });
        break;
      case M.Set:
        s = new wn({ value: i });
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
        const c = Array.from(i, (h) => o.toASN(h)), u = e.repeated === "sequence" ? mn : wn;
        s = new u({
          value: c
        });
      } else
        s = o.toASN(i);
    } else if (e.repeated) {
      if (!Array.isArray(i))
        throw new TypeError("Parameter 'objProp' should be type of Array.");
      const o = Array.from(i, (u) => this.toASN(u)), c = e.repeated === "sequence" ? mn : wn;
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
class Z {
  static serialize(e) {
    return Lu.serialize(e);
  }
  static parse(e, t) {
    return Gg.parse(e, t);
  }
  static toString(e) {
    const t = J.isBufferSource(e) ? J.toArrayBuffer(e) : Z.serialize(e), n = Ri(t);
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
var Cp = { exports: {} };
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
      let O = 0, I = -1, U = (v.match(u.zoneIndex) || [])[0], D, be;
      for (U && (U = U.substring(1), v = v.replace(/%.+$/, "")); (I = v.indexOf(":", I + 1)) >= 0; )
        O++;
      if (v.substr(0, 2) === "::" && O--, v.substr(-2, 2) === "::" && O--, O > A)
        return null;
      for (be = A - O, D = ":"; be--; )
        D += "0:";
      return v = v.replace("::", D), v[0] === ":" && (v = v.slice(1)), v[v.length - 1] === ":" && (v = v.slice(0, -1)), A = function() {
        const et = v.split(":"), Ke = [];
        for (let K = 0; K < et.length; K++)
          Ke.push(parseInt(et[K], 16));
        return Ke;
      }(), {
        parts: A,
        zoneId: U
      };
    }
    function w(v, A, O, I) {
      if (v.length !== A.length)
        throw new Error("ipaddr: cannot match CIDR for objects with different lengths");
      let U = 0, D;
      for (; I > 0; ) {
        if (D = O - I, D < 0 && (D = 0), v[U] >> D !== A[U] >> D)
          return !1;
        I -= O, U += 1;
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
    function q(v, A) {
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
        return w(this.octets, A.octets, 8, O);
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
        let U, D, be;
        for (U = 3; U >= 0; U -= 1)
          if (D = this.octets[U], D in I) {
            if (be = I[D], O && be !== 0)
              return null;
            be !== 8 && (O = !0), A += be;
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
        const A = this.parseCIDR(v), O = A[0].toByteArray(), I = this.subnetMaskFromPrefixLength(A[1]).toByteArray(), U = [];
        let D = 0;
        for (; D < 4; )
          U.push(parseInt(O[D], 10) | parseInt(I[D], 10) ^ 255), D++;
        return new this(U);
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
      let A, O, I, U, D;
      try {
        for (A = this.parseCIDR(v), I = A[0].toByteArray(), D = this.subnetMaskFromPrefixLength(A[1]).toByteArray(), U = [], O = 0; O < 4; )
          U.push(parseInt(I[O], 10) & parseInt(D[O], 10)), O++;
        return new this(U);
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
          const U = A.slice(1, 6), D = [];
          for (let be = 0; be < U.length; be++)
            O = U[be], D.push(x(O));
          return D;
        }();
      if (A = v.match(n.longValue)) {
        if (I = x(A[1]), I > 4294967295 || I < 0)
          throw new Error("ipaddr: address outside defined range");
        return function() {
          const U = [];
          let D;
          for (D = 0; D <= 24; D += 8)
            U.push(I >> D & 255);
          return U;
        }().reverse();
      } else return (A = v.match(n.twoOctet)) ? function() {
        const U = A.slice(1, 4), D = [];
        if (I = x(U[1]), I > 16777215 || I < 0)
          throw new Error("ipaddr: address outside defined range");
        return D.push(x(U[0])), D.push(I >> 16 & 255), D.push(I >> 8 & 255), D.push(I & 255), D;
      }() : (A = v.match(n.threeOctet)) ? function() {
        const U = A.slice(1, 5), D = [];
        if (I = x(U[2]), I > 65535 || I < 0)
          throw new Error("ipaddr: address outside defined range");
        return D.push(x(U[0])), D.push(x(U[1])), D.push(I >> 8 & 255), D.push(I & 255), D;
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
        let I, U;
        if (A.length === 16)
          for (this.parts = [], I = 0; I <= 14; I += 2)
            this.parts.push(A[I] << 8 | A[I + 1]);
        else if (A.length === 8)
          this.parts = A;
        else
          throw new Error("ipaddr: ipv6 part count should be 8 or 16");
        for (I = 0; I < this.parts.length; I++)
          if (U = this.parts[I], !(0 <= U && U <= 65535))
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
        return w(this.parts, A.parts, 16, O);
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
        let U, D;
        for (let be = 7; be >= 0; be -= 1)
          if (U = this.parts[be], U in I) {
            if (D = I[U], O && D !== 0)
              return null;
            D !== 16 && (O = !0), A += D;
          } else
            return null;
        return 128 - A;
      }, v.prototype.range = function() {
        return N.subnetMatch(this, this.SpecialRanges);
      }, v.prototype.toByteArray = function() {
        let A;
        const O = [], I = this.parts;
        for (let U = 0; U < I.length; U++)
          A = I[U], O.push(A >> 8), O.push(A & 255);
        return O;
      }, v.prototype.toFixedLengthString = function() {
        const A = (function() {
          const I = [];
          for (let U = 0; U < this.parts.length; U++)
            I.push(q(this.parts[U].toString(16), 4));
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
          for (let U = 0; U < this.parts.length; U++)
            I.push(this.parts[U].toString(16));
          return I;
        }).call(this).join(":");
        let O = "";
        return this.zoneId && (O = `%${this.zoneId}`), A + O;
      }, v.prototype.toRFC5952String = function() {
        const A = /((^|:)(0(:|$)){2,})/g, O = this.toNormalizedString();
        let I = 0, U = -1, D;
        for (; D = A.exec(O); )
          D[0].length > U && (I = D.index, U = D[0].length);
        return U < 0 ? O : `${O.substring(0, I)}::${O.substring(I + U)}`;
      }, v.prototype.toString = function() {
        return this.toRFC5952String();
      }, v;
    }(), N.IPv6.broadcastAddressFromCIDR = function(v) {
      try {
        const A = this.parseCIDR(v), O = A[0].toByteArray(), I = this.subnetMaskFromPrefixLength(A[1]).toByteArray(), U = [];
        let D = 0;
        for (; D < 16; )
          U.push(parseInt(O[D], 10) | parseInt(I[D], 10) ^ 255), D++;
        return new this(U);
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
      let A, O, I, U, D;
      try {
        for (A = this.parseCIDR(v), I = A[0].toByteArray(), D = this.subnetMaskFromPrefixLength(A[1]).toByteArray(), U = [], O = 0; O < 16; )
          U.push(parseInt(I[O], 10) & parseInt(D[O], 10)), O++;
        return new this(U);
      } catch (be) {
        throw new Error(`ipaddr: the address does not have IPv6 CIDR format (${be})`);
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
      let A, O, I, U, D, be;
      if (I = v.match(u.deprecatedTransitional))
        return this.parser(`::ffff:${I[1]}`);
      if (u.native.test(v))
        return h(v, 8);
      if ((I = v.match(u.transitional)) && (be = I[6] || "", A = I[1], I[1].endsWith("::") || (A = A.slice(0, -1)), A = h(A + be, 6), A.parts)) {
        for (D = [
          parseInt(I[2]),
          parseInt(I[3]),
          parseInt(I[4]),
          parseInt(I[5])
        ], O = 0; O < D.length; O++)
          if (U = D[O], !(0 <= U && U <= 255))
            return null;
        return A.parts.push(D[0] << 8 | D[1]), A.parts.push(D[2] << 8 | D[3]), {
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
      let I, U, D, be;
      O == null && (O = "unicast");
      for (U in A)
        if (Object.prototype.hasOwnProperty.call(A, U)) {
          for (D = A[U], D[0] && !(D[0] instanceof Array) && (D = [D]), I = 0; I < D.length; I++)
            if (be = D[I], v.kind() === be[0].kind() && v.match.apply(v, be))
              return U;
        }
      return O;
    }, r.exports ? r.exports = N : e.ipaddr = N;
  })(rl);
})(Cp);
var Df = Cp.exports;
class $f {
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
      return Df.fromByteArray(Array.from(t)).toString();
    }
    return this.decodeIP(he.ToHex(e));
  }
  static fromString(e) {
    const t = Df.parse(e);
    return new Uint8Array(t.toByteArray()).buffer;
  }
}
var ol, al, cl;
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
let Mi = class extends Xt {
  constructor(e = {}) {
    super(e), Object.assign(this, e);
  }
  toString() {
    return this.ia5String || (this.anyValue ? he.ToHex(this.anyValue) : super.toString());
  }
};
f([
  y({ type: b.IA5String })
], Mi.prototype, "ia5String", void 0);
f([
  y({ type: b.Any })
], Mi.prototype, "anyValue", void 0);
Mi = f([
  H({ type: M.Choice })
], Mi);
class ic {
  constructor(e = {}) {
    this.type = "", this.value = new Mi(), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], ic.prototype, "type", void 0);
f([
  y({ type: Mi })
], ic.prototype, "value", void 0);
let Vi = ol = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, ol.prototype);
  }
};
Vi = ol = f([
  H({ type: M.Set, itemType: ic })
], Vi);
let ll = al = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, al.prototype);
  }
};
ll = al = f([
  H({ type: M.Sequence, itemType: Vi })
], ll);
let Ht = cl = class extends ll {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, cl.prototype);
  }
};
Ht = cl = f([
  H({ type: M.Sequence })
], Ht);
const qg = {
  fromASN: (r) => $f.toString(Go.fromASN(r)),
  toASN: (r) => Go.toASN($f.fromString(r))
};
class Us {
  constructor(e = {}) {
    this.typeId = "", this.value = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Us.prototype, "typeId", void 0);
f([
  y({ type: b.Any, context: 0 })
], Us.prototype, "value", void 0);
class Hu {
  constructor(e = {}) {
    this.partyName = new Xt(), Object.assign(this, e);
  }
}
f([
  y({ type: Xt, optional: !0, context: 0, implicit: !0 })
], Hu.prototype, "nameAssigner", void 0);
f([
  y({ type: Xt, context: 1, implicit: !0 })
], Hu.prototype, "partyName", void 0);
let De = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: Us, context: 0, implicit: !0 })
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
  y({ type: Hu, context: 5 })
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
const Fu = "1.3.6.1.5.5.7", Kg = `${Fu}.1`, is = `${Fu}.3`, sc = `${Fu}.48`, Mf = `${sc}.1`, Vf = `${sc}.2`, Lf = `${sc}.3`, Hf = `${sc}.5`, Yn = "2.5.29";
var ul;
const fl = `${Kg}.1`;
class po {
  constructor(e = {}) {
    this.accessMethod = "", this.accessLocation = new De(), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], po.prototype, "accessMethod", void 0);
f([
  y({ type: De })
], po.prototype, "accessLocation", void 0);
let Pi = ul = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, ul.prototype);
  }
};
Pi = ul = f([
  H({ type: M.Sequence, itemType: po })
], Pi);
const qo = `${Yn}.35`;
class zu extends nt {
}
class ni {
  constructor(e = {}) {
    e && Object.assign(this, e);
  }
}
f([
  y({ type: zu, context: 0, optional: !0, implicit: !0 })
], ni.prototype, "keyIdentifier", void 0);
f([
  y({ type: De, context: 1, optional: !0, implicit: !0, repeated: "sequence" })
], ni.prototype, "authorityCertIssuer", void 0);
f([
  y({
    type: b.Integer,
    context: 2,
    optional: !0,
    implicit: !0,
    converter: bt
  })
], ni.prototype, "authorityCertSerialNumber", void 0);
const Bp = `${Yn}.19`;
class Ko {
  constructor(e = {}) {
    this.cA = !1, Object.assign(this, e);
  }
}
f([
  y({ type: b.Boolean, defaultValue: !1 })
], Ko.prototype, "cA", void 0);
f([
  y({ type: b.Integer, optional: !0 })
], Ko.prototype, "pathLenConstraint", void 0);
var hl;
let cr = hl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, hl.prototype);
  }
};
cr = hl = f([
  H({ type: M.Sequence, itemType: De })
], cr);
var dl;
let Ff = dl = class extends cr {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, dl.prototype);
  }
};
Ff = dl = f([
  H({ type: M.Sequence })
], Ff);
var pl;
const Op = `${Yn}.32`;
let An = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
  toString() {
    return this.ia5String || this.visibleString || this.bmpString || this.utf8String || "";
  }
};
f([
  y({ type: b.IA5String })
], An.prototype, "ia5String", void 0);
f([
  y({ type: b.VisibleString })
], An.prototype, "visibleString", void 0);
f([
  y({ type: b.BmpString })
], An.prototype, "bmpString", void 0);
f([
  y({ type: b.Utf8String })
], An.prototype, "utf8String", void 0);
An = f([
  H({ type: M.Choice })
], An);
class Gu {
  constructor(e = {}) {
    this.organization = new An(), this.noticeNumbers = [], Object.assign(this, e);
  }
}
f([
  y({ type: An })
], Gu.prototype, "organization", void 0);
f([
  y({ type: b.Integer, repeated: "sequence" })
], Gu.prototype, "noticeNumbers", void 0);
class qu {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: Gu, optional: !0 })
], qu.prototype, "noticeRef", void 0);
f([
  y({ type: An, optional: !0 })
], qu.prototype, "explicitText", void 0);
let Zo = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: b.IA5String })
], Zo.prototype, "cPSuri", void 0);
f([
  y({ type: qu })
], Zo.prototype, "userNotice", void 0);
Zo = f([
  H({ type: M.Choice })
], Zo);
class Ku {
  constructor(e = {}) {
    this.policyQualifierId = "", this.qualifier = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Ku.prototype, "policyQualifierId", void 0);
f([
  y({ type: b.Any })
], Ku.prototype, "qualifier", void 0);
class oc {
  constructor(e = {}) {
    this.policyIdentifier = "", Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], oc.prototype, "policyIdentifier", void 0);
f([
  y({ type: Ku, repeated: "sequence", optional: !0 })
], oc.prototype, "policyQualifiers", void 0);
let Wo = pl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, pl.prototype);
  }
};
Wo = pl = f([
  H({ type: M.Sequence, itemType: oc })
], Wo);
let Yo = class {
  constructor(e = 0) {
    this.value = e;
  }
};
f([
  y({ type: b.Integer })
], Yo.prototype, "value", void 0);
Yo = f([
  H({ type: M.Choice })
], Yo);
let zf = class extends Yo {
};
zf = f([
  H({ type: M.Choice })
], zf);
var yl;
const gl = `${Yn}.31`;
var Ur;
(function(r) {
  r[r.unused = 1] = "unused", r[r.keyCompromise = 2] = "keyCompromise", r[r.cACompromise = 4] = "cACompromise", r[r.affiliationChanged = 8] = "affiliationChanged", r[r.superseded = 16] = "superseded", r[r.cessationOfOperation = 32] = "cessationOfOperation", r[r.certificateHold = 64] = "certificateHold", r[r.privilegeWithdrawn = 128] = "privilegeWithdrawn", r[r.aACompromise = 256] = "aACompromise";
})(Ur || (Ur = {}));
class Tp extends nc {
  toJSON() {
    const e = [], t = this.toNumber();
    return t & Ur.aACompromise && e.push("aACompromise"), t & Ur.affiliationChanged && e.push("affiliationChanged"), t & Ur.cACompromise && e.push("cACompromise"), t & Ur.certificateHold && e.push("certificateHold"), t & Ur.cessationOfOperation && e.push("cessationOfOperation"), t & Ur.keyCompromise && e.push("keyCompromise"), t & Ur.privilegeWithdrawn && e.push("privilegeWithdrawn"), t & Ur.superseded && e.push("superseded"), t & Ur.unused && e.push("unused"), e;
  }
  toString() {
    return `[${this.toJSON().join(", ")}]`;
  }
}
let fi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: De, context: 0, repeated: "sequence", implicit: !0 })
], fi.prototype, "fullName", void 0);
f([
  y({ type: Vi, context: 1, implicit: !0 })
], fi.prototype, "nameRelativeToCRLIssuer", void 0);
fi = f([
  H({ type: M.Choice })
], fi);
class ss {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: fi, context: 0, optional: !0 })
], ss.prototype, "distributionPoint", void 0);
f([
  y({ type: Tp, context: 1, optional: !0, implicit: !0 })
], ss.prototype, "reasons", void 0);
f([
  y({ type: De, context: 2, optional: !0, repeated: "sequence", implicit: !0 })
], ss.prototype, "cRLIssuer", void 0);
let Ui = yl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, yl.prototype);
  }
};
Ui = yl = f([
  H({ type: M.Sequence, itemType: ss })
], Ui);
var vl;
let Gf = vl = class extends Ui {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, vl.prototype);
  }
};
Gf = vl = f([
  H({ type: M.Sequence, itemType: ss })
], Gf);
class ir {
  constructor(e = {}) {
    this.onlyContainsUserCerts = ir.ONLY, this.onlyContainsCACerts = ir.ONLY, this.indirectCRL = ir.ONLY, this.onlyContainsAttributeCerts = ir.ONLY, Object.assign(this, e);
  }
}
ir.ONLY = !1;
f([
  y({ type: fi, context: 0, optional: !0 })
], ir.prototype, "distributionPoint", void 0);
f([
  y({ type: b.Boolean, context: 1, defaultValue: ir.ONLY, implicit: !0 })
], ir.prototype, "onlyContainsUserCerts", void 0);
f([
  y({ type: b.Boolean, context: 2, defaultValue: ir.ONLY, implicit: !0 })
], ir.prototype, "onlyContainsCACerts", void 0);
f([
  y({ type: Tp, context: 3, optional: !0, implicit: !0 })
], ir.prototype, "onlySomeReasons", void 0);
f([
  y({ type: b.Boolean, context: 4, defaultValue: ir.ONLY, implicit: !0 })
], ir.prototype, "indirectCRL", void 0);
f([
  y({ type: b.Boolean, context: 5, defaultValue: ir.ONLY, implicit: !0 })
], ir.prototype, "onlyContainsAttributeCerts", void 0);
var Os;
(function(r) {
  r[r.unspecified = 0] = "unspecified", r[r.keyCompromise = 1] = "keyCompromise", r[r.cACompromise = 2] = "cACompromise", r[r.affiliationChanged = 3] = "affiliationChanged", r[r.superseded = 4] = "superseded", r[r.cessationOfOperation = 5] = "cessationOfOperation", r[r.certificateHold = 6] = "certificateHold", r[r.removeFromCRL = 8] = "removeFromCRL", r[r.privilegeWithdrawn = 9] = "privilegeWithdrawn", r[r.aACompromise = 10] = "aACompromise";
})(Os || (Os = {}));
let ml = class {
  constructor(e = Os.unspecified) {
    this.reason = Os.unspecified, this.reason = e;
  }
  toJSON() {
    return Os[this.reason];
  }
  toString() {
    return this.toJSON();
  }
};
f([
  y({ type: b.Enumerated })
], ml.prototype, "reason", void 0);
ml = f([
  H({ type: M.Choice })
], ml);
var wl;
const Np = `${Yn}.37`;
let Jo = wl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, wl.prototype);
  }
};
Jo = wl = f([
  H({ type: M.Sequence, itemType: b.ObjectIdentifier })
], Jo);
const Zg = `${is}.1`, Wg = `${is}.2`, Yg = `${is}.3`, Jg = `${is}.4`, Xg = `${is}.8`, Qg = `${is}.9`;
let bl = class {
  constructor(e = new ArrayBuffer(0)) {
    this.value = e;
  }
};
f([
  y({ type: b.Integer, converter: bt })
], bl.prototype, "value", void 0);
bl = f([
  H({ type: M.Choice })
], bl);
let xl = class {
  constructor(e) {
    this.value = /* @__PURE__ */ new Date(), e && (this.value = e);
  }
};
f([
  y({ type: b.GeneralizedTime })
], xl.prototype, "value", void 0);
xl = f([
  H({ type: M.Choice })
], xl);
var Al;
let qf = Al = class extends cr {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Al.prototype);
  }
};
qf = Al = f([
  H({ type: M.Sequence })
], qf);
const Pp = `${Yn}.15`;
var Dr;
(function(r) {
  r[r.digitalSignature = 1] = "digitalSignature", r[r.nonRepudiation = 2] = "nonRepudiation", r[r.keyEncipherment = 4] = "keyEncipherment", r[r.dataEncipherment = 8] = "dataEncipherment", r[r.keyAgreement = 16] = "keyAgreement", r[r.keyCertSign = 32] = "keyCertSign", r[r.cRLSign = 64] = "cRLSign", r[r.encipherOnly = 128] = "encipherOnly", r[r.decipherOnly = 256] = "decipherOnly";
})(Dr || (Dr = {}));
class Vc extends nc {
  toJSON() {
    const e = this.toNumber(), t = [];
    return e & Dr.cRLSign && t.push("crlSign"), e & Dr.dataEncipherment && t.push("dataEncipherment"), e & Dr.decipherOnly && t.push("decipherOnly"), e & Dr.digitalSignature && t.push("digitalSignature"), e & Dr.encipherOnly && t.push("encipherOnly"), e & Dr.keyAgreement && t.push("keyAgreement"), e & Dr.keyCertSign && t.push("keyCertSign"), e & Dr.keyEncipherment && t.push("keyEncipherment"), e & Dr.nonRepudiation && t.push("nonRepudiation"), t;
  }
  toString() {
    return `[${this.toJSON().join(", ")}]`;
  }
}
var Sl;
class ac {
  constructor(e = {}) {
    this.base = new De(), this.minimum = 0, Object.assign(this, e);
  }
}
f([
  y({ type: De })
], ac.prototype, "base", void 0);
f([
  y({ type: b.Integer, context: 0, defaultValue: 0, implicit: !0 })
], ac.prototype, "minimum", void 0);
f([
  y({ type: b.Integer, context: 1, optional: !0, implicit: !0 })
], ac.prototype, "maximum", void 0);
let Xo = Sl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Sl.prototype);
  }
};
Xo = Sl = f([
  H({ type: M.Sequence, itemType: ac })
], Xo);
class jp {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: Xo, context: 0, optional: !0, implicit: !0 })
], jp.prototype, "permittedSubtrees", void 0);
f([
  y({ type: Xo, context: 1, optional: !0, implicit: !0 })
], jp.prototype, "excludedSubtrees", void 0);
class Rp {
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
    converter: bt
  })
], Rp.prototype, "requireExplicitPolicy", void 0);
f([
  y({
    type: b.Integer,
    context: 1,
    implicit: !0,
    optional: !0,
    converter: bt
  })
], Rp.prototype, "inhibitPolicyMapping", void 0);
var _l;
class Zu {
  constructor(e = {}) {
    this.issuerDomainPolicy = "", this.subjectDomainPolicy = "", Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Zu.prototype, "issuerDomainPolicy", void 0);
f([
  y({ type: b.ObjectIdentifier })
], Zu.prototype, "subjectDomainPolicy", void 0);
let Kf = _l = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, _l.prototype);
  }
};
Kf = _l = f([
  H({ type: M.Sequence, itemType: Zu })
], Kf);
var El;
const Wu = `${Yn}.17`;
let Il = El = class extends cr {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, El.prototype);
  }
};
Il = El = f([
  H({ type: M.Sequence })
], Il);
let Sn = class {
  constructor(e = {}) {
    this.type = "", this.values = [], Object.assign(this, e);
  }
};
f([
  y({ type: b.ObjectIdentifier })
], Sn.prototype, "type", void 0);
f([
  y({ type: b.Any, repeated: "set" })
], Sn.prototype, "values", void 0);
var kl;
let Zf = kl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, kl.prototype);
  }
};
Zf = kl = f([
  H({ type: M.Sequence, itemType: Sn })
], Zf);
const Yu = `${Yn}.14`;
class Ln extends zu {
}
class Up {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: b.GeneralizedTime, context: 0, implicit: !0, optional: !0 })
], Up.prototype, "notBefore", void 0);
f([
  y({ type: b.GeneralizedTime, context: 1, implicit: !0, optional: !0 })
], Up.prototype, "notAfter", void 0);
var Ts;
(function(r) {
  r[r.keyUpdateAllowed = 1] = "keyUpdateAllowed", r[r.newExtensions = 2] = "newExtensions", r[r.pKIXCertificate = 4] = "pKIXCertificate";
})(Ts || (Ts = {}));
class Dp extends nc {
  toJSON() {
    const e = [], t = this.toNumber();
    return t & Ts.pKIXCertificate && e.push("pKIXCertificate"), t & Ts.newExtensions && e.push("newExtensions"), t & Ts.keyUpdateAllowed && e.push("keyUpdateAllowed"), e;
  }
  toString() {
    return `[${this.toJSON().join(", ")}]`;
  }
}
class $p {
  constructor(e = {}) {
    this.entrustVers = "", this.entrustInfoFlags = new Dp(), Object.assign(this, e);
  }
}
f([
  y({ type: b.GeneralString })
], $p.prototype, "entrustVers", void 0);
f([
  y({ type: Dp })
], $p.prototype, "entrustInfoFlags", void 0);
var Cl;
let Wf = Cl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Cl.prototype);
  }
};
Wf = Cl = f([
  H({ type: M.Sequence, itemType: po })
], Wf);
class oe {
  constructor(e = {}) {
    this.algorithm = "", Object.assign(this, e);
  }
  isEqual(e) {
    return e instanceof oe && e.algorithm == this.algorithm && (e.parameters && this.parameters && Ho(e.parameters, this.parameters) || e.parameters === this.parameters);
  }
}
f([
  y({
    type: b.ObjectIdentifier
  })
], oe.prototype, "algorithm", void 0);
f([
  y({
    type: b.Any,
    optional: !0
  })
], oe.prototype, "parameters", void 0);
class rn {
  constructor(e = {}) {
    this.algorithm = new oe(), this.subjectPublicKey = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: oe })
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
class cc {
  constructor(e) {
    this.notBefore = new Yt(/* @__PURE__ */ new Date()), this.notAfter = new Yt(/* @__PURE__ */ new Date()), e && (this.notBefore = new Yt(e.notBefore), this.notAfter = new Yt(e.notAfter));
  }
}
f([
  y({ type: Yt })
], cc.prototype, "notBefore", void 0);
f([
  y({ type: Yt })
], cc.prototype, "notAfter", void 0);
var Bl;
let Hr = class Mp {
  constructor(e = {}) {
    this.extnID = "", this.critical = Mp.CRITICAL, this.extnValue = new nt(), Object.assign(this, e);
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
let hi = Bl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Bl.prototype);
  }
};
hi = Bl = f([
  H({ type: M.Sequence, itemType: Hr })
], hi);
var Li;
(function(r) {
  r[r.v1 = 0] = "v1", r[r.v2 = 1] = "v2", r[r.v3 = 2] = "v3";
})(Li || (Li = {}));
class Pr {
  constructor(e = {}) {
    this.version = Li.v1, this.serialNumber = new ArrayBuffer(0), this.signature = new oe(), this.issuer = new Ht(), this.validity = new cc(), this.subject = new Ht(), this.subjectPublicKeyInfo = new rn(), Object.assign(this, e);
  }
}
f([
  y({
    type: b.Integer,
    context: 0,
    defaultValue: Li.v1
  })
], Pr.prototype, "version", void 0);
f([
  y({
    type: b.Integer,
    converter: bt
  })
], Pr.prototype, "serialNumber", void 0);
f([
  y({ type: oe })
], Pr.prototype, "signature", void 0);
f([
  y({ type: Ht })
], Pr.prototype, "issuer", void 0);
f([
  y({ type: cc })
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
  y({ type: hi, context: 3, optional: !0 })
], Pr.prototype, "extensions", void 0);
class di {
  constructor(e = {}) {
    this.tbsCertificate = new Pr(), this.signatureAlgorithm = new oe(), this.signatureValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: Pr })
], di.prototype, "tbsCertificate", void 0);
f([
  y({ type: oe })
], di.prototype, "signatureAlgorithm", void 0);
f([
  y({ type: b.BitString })
], di.prototype, "signatureValue", void 0);
class lc {
  constructor(e = {}) {
    this.userCertificate = new ArrayBuffer(0), this.revocationDate = new Yt(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, converter: bt })
], lc.prototype, "userCertificate", void 0);
f([
  y({ type: Yt })
], lc.prototype, "revocationDate", void 0);
f([
  y({ type: Hr, optional: !0, repeated: "sequence" })
], lc.prototype, "crlEntryExtensions", void 0);
class Cn {
  constructor(e = {}) {
    this.signature = new oe(), this.issuer = new Ht(), this.thisUpdate = new Yt(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, optional: !0 })
], Cn.prototype, "version", void 0);
f([
  y({ type: oe })
], Cn.prototype, "signature", void 0);
f([
  y({ type: Ht })
], Cn.prototype, "issuer", void 0);
f([
  y({ type: Yt })
], Cn.prototype, "thisUpdate", void 0);
f([
  y({ type: Yt, optional: !0 })
], Cn.prototype, "nextUpdate", void 0);
f([
  y({ type: lc, repeated: "sequence", optional: !0 })
], Cn.prototype, "revokedCertificates", void 0);
f([
  y({ type: Hr, optional: !0, context: 0, repeated: "sequence" })
], Cn.prototype, "crlExtensions", void 0);
class Ju {
  constructor(e = {}) {
    this.tbsCertList = new Cn(), this.signatureAlgorithm = new oe(), this.signature = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: Cn })
], Ju.prototype, "tbsCertList", void 0);
f([
  y({ type: oe })
], Ju.prototype, "signatureAlgorithm", void 0);
f([
  y({ type: b.BitString })
], Ju.prototype, "signature", void 0);
class os {
  constructor(e = {}) {
    this.issuer = new Ht(), this.serialNumber = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: Ht })
], os.prototype, "issuer", void 0);
f([
  y({ type: b.Integer, converter: bt })
], os.prototype, "serialNumber", void 0);
let Hi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: Ln, context: 0, implicit: !0 })
], Hi.prototype, "subjectKeyIdentifier", void 0);
f([
  y({ type: os })
], Hi.prototype, "issuerAndSerialNumber", void 0);
Hi = f([
  H({ type: M.Choice })
], Hi);
var an;
(function(r) {
  r[r.v0 = 0] = "v0", r[r.v1 = 1] = "v1", r[r.v2 = 2] = "v2", r[r.v3 = 3] = "v3", r[r.v4 = 4] = "v4", r[r.v5 = 5] = "v5";
})(an || (an = {}));
let Ds = class extends oe {
};
Ds = f([
  H({ type: M.Sequence })
], Ds);
let Qo = class extends oe {
};
Qo = f([
  H({ type: M.Sequence })
], Qo);
let cn = class extends oe {
};
cn = f([
  H({ type: M.Sequence })
], cn);
let ea = class extends oe {
};
ea = f([
  H({ type: M.Sequence })
], ea);
let Yf = class extends oe {
};
Yf = f([
  H({ type: M.Sequence })
], Yf);
let Ol = class extends oe {
};
Ol = f([
  H({ type: M.Sequence })
], Ol);
let as = class {
  constructor(e = {}) {
    this.attrType = "", this.attrValues = [], Object.assign(this, e);
  }
};
f([
  y({ type: b.ObjectIdentifier })
], as.prototype, "attrType", void 0);
f([
  y({ type: b.Any, repeated: "set" })
], as.prototype, "attrValues", void 0);
var Tl;
class hn {
  constructor(e = {}) {
    this.version = an.v0, this.sid = new Hi(), this.digestAlgorithm = new Ds(), this.signatureAlgorithm = new Qo(), this.signature = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], hn.prototype, "version", void 0);
f([
  y({ type: Hi })
], hn.prototype, "sid", void 0);
f([
  y({ type: Ds })
], hn.prototype, "digestAlgorithm", void 0);
f([
  y({ type: as, repeated: "set", context: 0, implicit: !0, optional: !0 })
], hn.prototype, "signedAttrs", void 0);
f([
  y({ type: Qo })
], hn.prototype, "signatureAlgorithm", void 0);
f([
  y({ type: nt })
], hn.prototype, "signature", void 0);
f([
  y({ type: as, repeated: "set", context: 1, implicit: !0, optional: !0 })
], hn.prototype, "unsignedAttrs", void 0);
let ta = Tl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Tl.prototype);
  }
};
ta = Tl = f([
  H({ type: M.Set, itemType: hn })
], ta);
let Jf = class extends Yt {
};
Jf = f([
  H({ type: M.Choice })
], Jf);
let Xf = class extends hn {
};
Xf = f([
  H({ type: M.Sequence })
], Xf);
class Xu {
  constructor(e = {}) {
    this.acIssuer = new De(), this.acSerial = 0, this.attrs = [], Object.assign(this, e);
  }
}
f([
  y({ type: De })
], Xu.prototype, "acIssuer", void 0);
f([
  y({ type: b.Integer })
], Xu.prototype, "acSerial", void 0);
f([
  y({ type: Sn, repeated: "sequence" })
], Xu.prototype, "attrs", void 0);
var Nl;
let ra = Nl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Nl.prototype);
  }
};
ra = Nl = f([
  H({ type: M.Sequence, itemType: b.ObjectIdentifier })
], ra);
class uc {
  constructor(e = {}) {
    this.permitUnSpecified = !0, Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, optional: !0 })
], uc.prototype, "pathLenConstraint", void 0);
f([
  y({ type: ra, implicit: !0, context: 0, optional: !0 })
], uc.prototype, "permittedAttrs", void 0);
f([
  y({ type: ra, implicit: !0, context: 1, optional: !0 })
], uc.prototype, "excludedAttrs", void 0);
f([
  y({ type: b.Boolean, defaultValue: !0 })
], uc.prototype, "permitUnSpecified", void 0);
class Ei {
  constructor(e = {}) {
    this.issuer = new cr(), this.serial = new ArrayBuffer(0), this.issuerUID = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: cr })
], Ei.prototype, "issuer", void 0);
f([
  y({ type: b.Integer, converter: bt })
], Ei.prototype, "serial", void 0);
f([
  y({ type: b.BitString, optional: !0 })
], Ei.prototype, "issuerUID", void 0);
var Pl;
(function(r) {
  r[r.publicKey = 0] = "publicKey", r[r.publicKeyCert = 1] = "publicKeyCert", r[r.otherObjectTypes = 2] = "otherObjectTypes";
})(Pl || (Pl = {}));
class Ii {
  constructor(e = {}) {
    this.digestedObjectType = Pl.publicKey, this.digestAlgorithm = new oe(), this.objectDigest = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.Enumerated })
], Ii.prototype, "digestedObjectType", void 0);
f([
  y({ type: b.ObjectIdentifier, optional: !0 })
], Ii.prototype, "otherObjectTypeID", void 0);
f([
  y({ type: oe })
], Ii.prototype, "digestAlgorithm", void 0);
f([
  y({ type: b.BitString })
], Ii.prototype, "objectDigest", void 0);
class fc {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: cr, optional: !0 })
], fc.prototype, "issuerName", void 0);
f([
  y({ type: Ei, context: 0, implicit: !0, optional: !0 })
], fc.prototype, "baseCertificateID", void 0);
f([
  y({ type: Ii, context: 1, implicit: !0, optional: !0 })
], fc.prototype, "objectDigestInfo", void 0);
let Fi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: De, repeated: "sequence" })
], Fi.prototype, "v1Form", void 0);
f([
  y({ type: fc, context: 0, implicit: !0 })
], Fi.prototype, "v2Form", void 0);
Fi = f([
  H({ type: M.Choice })
], Fi);
class hc {
  constructor(e = {}) {
    this.notBeforeTime = /* @__PURE__ */ new Date(), this.notAfterTime = /* @__PURE__ */ new Date(), Object.assign(this, e);
  }
}
f([
  y({ type: b.GeneralizedTime })
], hc.prototype, "notBeforeTime", void 0);
f([
  y({ type: b.GeneralizedTime })
], hc.prototype, "notAfterTime", void 0);
class yo {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: Ei, implicit: !0, context: 0, optional: !0 })
], yo.prototype, "baseCertificateID", void 0);
f([
  y({ type: cr, implicit: !0, context: 1, optional: !0 })
], yo.prototype, "entityName", void 0);
f([
  y({ type: Ii, implicit: !0, context: 2, optional: !0 })
], yo.prototype, "objectDigestInfo", void 0);
var jl;
(function(r) {
  r[r.v2 = 1] = "v2";
})(jl || (jl = {}));
class Kr {
  constructor(e = {}) {
    this.version = jl.v2, this.holder = new yo(), this.issuer = new Fi(), this.signature = new oe(), this.serialNumber = new ArrayBuffer(0), this.attrCertValidityPeriod = new hc(), this.attributes = [], Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], Kr.prototype, "version", void 0);
f([
  y({ type: yo })
], Kr.prototype, "holder", void 0);
f([
  y({ type: Fi })
], Kr.prototype, "issuer", void 0);
f([
  y({ type: oe })
], Kr.prototype, "signature", void 0);
f([
  y({ type: b.Integer, converter: bt })
], Kr.prototype, "serialNumber", void 0);
f([
  y({ type: hc })
], Kr.prototype, "attrCertValidityPeriod", void 0);
f([
  y({ type: Sn, repeated: "sequence" })
], Kr.prototype, "attributes", void 0);
f([
  y({ type: b.BitString, optional: !0 })
], Kr.prototype, "issuerUniqueID", void 0);
f([
  y({ type: hi, optional: !0 })
], Kr.prototype, "extensions", void 0);
class dc {
  constructor(e = {}) {
    this.acinfo = new Kr(), this.signatureAlgorithm = new oe(), this.signatureValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: Kr })
], dc.prototype, "acinfo", void 0);
f([
  y({ type: oe })
], dc.prototype, "signatureAlgorithm", void 0);
f([
  y({ type: b.BitString })
], dc.prototype, "signatureValue", void 0);
var na;
(function(r) {
  r[r.unmarked = 1] = "unmarked", r[r.unclassified = 2] = "unclassified", r[r.restricted = 4] = "restricted", r[r.confidential = 8] = "confidential", r[r.secret = 16] = "secret", r[r.topSecret = 32] = "topSecret";
})(na || (na = {}));
class Rl extends nc {
}
class Qu {
  constructor(e = {}) {
    this.type = "", this.value = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier, implicit: !0, context: 0 })
], Qu.prototype, "type", void 0);
f([
  y({ type: b.Any, implicit: !0, context: 1 })
], Qu.prototype, "value", void 0);
class ef {
  constructor(e = {}) {
    this.policyId = "", this.classList = new Rl(na.unclassified), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], ef.prototype, "policyId", void 0);
f([
  y({ type: Rl, defaultValue: new Rl(na.unclassified) })
], ef.prototype, "classList", void 0);
f([
  y({ type: Qu, repeated: "set" })
], ef.prototype, "securityCategories", void 0);
class pc {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: nt })
], pc.prototype, "cotets", void 0);
f([
  y({ type: b.ObjectIdentifier })
], pc.prototype, "oid", void 0);
f([
  y({ type: b.Utf8String })
], pc.prototype, "string", void 0);
class Vp {
  constructor(e = {}) {
    this.values = [], Object.assign(this, e);
  }
}
f([
  y({ type: cr, implicit: !0, context: 0, optional: !0 })
], Vp.prototype, "policyAuthority", void 0);
f([
  y({ type: pc, repeated: "sequence" })
], Vp.prototype, "values", void 0);
var Ul;
class yc {
  constructor(e = {}) {
    this.targetCertificate = new Ei(), Object.assign(this, e);
  }
}
f([
  y({ type: Ei })
], yc.prototype, "targetCertificate", void 0);
f([
  y({ type: De, optional: !0 })
], yc.prototype, "targetName", void 0);
f([
  y({ type: Ii, optional: !0 })
], yc.prototype, "certDigestInfo", void 0);
let zi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: De, context: 0, implicit: !0 })
], zi.prototype, "targetName", void 0);
f([
  y({ type: De, context: 1, implicit: !0 })
], zi.prototype, "targetGroup", void 0);
f([
  y({ type: yc, context: 2, implicit: !0 })
], zi.prototype, "targetCert", void 0);
zi = f([
  H({ type: M.Choice })
], zi);
let Dl = Ul = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Ul.prototype);
  }
};
Dl = Ul = f([
  H({ type: M.Sequence, itemType: zi })
], Dl);
var $l;
let Qf = $l = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, $l.prototype);
  }
};
Qf = $l = f([
  H({ type: M.Sequence, itemType: Dl })
], Qf);
class Lp {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: cr, implicit: !0, context: 0, optional: !0 })
], Lp.prototype, "roleAuthority", void 0);
f([
  y({ type: De, implicit: !0, context: 1 })
], Lp.prototype, "roleName", void 0);
class tf {
  constructor(e = {}) {
    this.service = new De(), this.ident = new De(), Object.assign(this, e);
  }
}
f([
  y({ type: De })
], tf.prototype, "service", void 0);
f([
  y({ type: De })
], tf.prototype, "ident", void 0);
f([
  y({ type: nt, optional: !0 })
], tf.prototype, "authInfo", void 0);
var Ml;
class rf {
  constructor(e = {}) {
    this.otherCertFormat = "", this.otherCert = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], rf.prototype, "otherCertFormat", void 0);
f([
  y({ type: b.Any })
], rf.prototype, "otherCert", void 0);
let pi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: di })
], pi.prototype, "certificate", void 0);
f([
  y({ type: dc, context: 2, implicit: !0 })
], pi.prototype, "v2AttrCert", void 0);
f([
  y({ type: rf, context: 3, implicit: !0 })
], pi.prototype, "other", void 0);
pi = f([
  H({ type: M.Choice })
], pi);
let $s = Ml = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Ml.prototype);
  }
};
$s = Ml = f([
  H({ type: M.Set, itemType: pi })
], $s);
class bn {
  constructor(e = {}) {
    this.contentType = "", this.content = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], bn.prototype, "contentType", void 0);
f([
  y({ type: b.Any, context: 0 })
], bn.prototype, "content", void 0);
let Gi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: nt })
], Gi.prototype, "single", void 0);
f([
  y({ type: b.Any })
], Gi.prototype, "any", void 0);
Gi = f([
  H({ type: M.Choice })
], Gi);
class gc {
  constructor(e = {}) {
    this.eContentType = "", Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], gc.prototype, "eContentType", void 0);
f([
  y({ type: Gi, context: 0, optional: !0 })
], gc.prototype, "eContent", void 0);
let Ms = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: nt, context: 0, implicit: !0, optional: !0 })
], Ms.prototype, "value", void 0);
f([
  y({ type: nt, converter: Cg, context: 0, implicit: !0, optional: !0, repeated: "sequence" })
], Ms.prototype, "constructedValue", void 0);
Ms = f([
  H({ type: M.Choice })
], Ms);
class go {
  constructor(e = {}) {
    this.contentType = "", this.contentEncryptionAlgorithm = new ea(), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], go.prototype, "contentType", void 0);
f([
  y({ type: ea })
], go.prototype, "contentEncryptionAlgorithm", void 0);
f([
  y({ type: Ms, optional: !0 })
], go.prototype, "encryptedContent", void 0);
class vc {
  constructor(e = {}) {
    this.keyAttrId = "", Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], vc.prototype, "keyAttrId", void 0);
f([
  y({ type: b.Any, optional: !0 })
], vc.prototype, "keyAttr", void 0);
var Vl;
class mc {
  constructor(e = {}) {
    this.subjectKeyIdentifier = new Ln(), Object.assign(this, e);
  }
}
f([
  y({ type: Ln })
], mc.prototype, "subjectKeyIdentifier", void 0);
f([
  y({ type: b.GeneralizedTime, optional: !0 })
], mc.prototype, "date", void 0);
f([
  y({ type: vc, optional: !0 })
], mc.prototype, "other", void 0);
let qi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: mc, context: 0, implicit: !0, optional: !0 })
], qi.prototype, "rKeyId", void 0);
f([
  y({ type: os, optional: !0 })
], qi.prototype, "issuerAndSerialNumber", void 0);
qi = f([
  H({ type: M.Choice })
], qi);
class nf {
  constructor(e = {}) {
    this.rid = new qi(), this.encryptedKey = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: qi })
], nf.prototype, "rid", void 0);
f([
  y({ type: nt })
], nf.prototype, "encryptedKey", void 0);
let ia = Vl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Vl.prototype);
  }
};
ia = Vl = f([
  H({ type: M.Sequence, itemType: nf })
], ia);
class sf {
  constructor(e = {}) {
    this.algorithm = new oe(), this.publicKey = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: oe })
], sf.prototype, "algorithm", void 0);
f([
  y({ type: b.BitString })
], sf.prototype, "publicKey", void 0);
let yi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: Ln, context: 0, implicit: !0, optional: !0 })
], yi.prototype, "subjectKeyIdentifier", void 0);
f([
  y({ type: sf, context: 1, implicit: !0, optional: !0 })
], yi.prototype, "originatorKey", void 0);
f([
  y({ type: os, optional: !0 })
], yi.prototype, "issuerAndSerialNumber", void 0);
yi = f([
  H({ type: M.Choice })
], yi);
class cs {
  constructor(e = {}) {
    this.version = an.v3, this.originator = new yi(), this.keyEncryptionAlgorithm = new cn(), this.recipientEncryptedKeys = new ia(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], cs.prototype, "version", void 0);
f([
  y({ type: yi, context: 0 })
], cs.prototype, "originator", void 0);
f([
  y({ type: nt, context: 1, optional: !0 })
], cs.prototype, "ukm", void 0);
f([
  y({ type: cn })
], cs.prototype, "keyEncryptionAlgorithm", void 0);
f([
  y({ type: ia })
], cs.prototype, "recipientEncryptedKeys", void 0);
let Ki = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: Ln, context: 0, implicit: !0 })
], Ki.prototype, "subjectKeyIdentifier", void 0);
f([
  y({ type: os })
], Ki.prototype, "issuerAndSerialNumber", void 0);
Ki = f([
  H({ type: M.Choice })
], Ki);
class vo {
  constructor(e = {}) {
    this.version = an.v0, this.rid = new Ki(), this.keyEncryptionAlgorithm = new cn(), this.encryptedKey = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], vo.prototype, "version", void 0);
f([
  y({ type: Ki })
], vo.prototype, "rid", void 0);
f([
  y({ type: cn })
], vo.prototype, "keyEncryptionAlgorithm", void 0);
f([
  y({ type: nt })
], vo.prototype, "encryptedKey", void 0);
class mo {
  constructor(e = {}) {
    this.keyIdentifier = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: nt })
], mo.prototype, "keyIdentifier", void 0);
f([
  y({ type: b.GeneralizedTime, optional: !0 })
], mo.prototype, "date", void 0);
f([
  y({ type: vc, optional: !0 })
], mo.prototype, "other", void 0);
class wo {
  constructor(e = {}) {
    this.version = an.v4, this.kekid = new mo(), this.keyEncryptionAlgorithm = new cn(), this.encryptedKey = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], wo.prototype, "version", void 0);
f([
  y({ type: mo })
], wo.prototype, "kekid", void 0);
f([
  y({ type: cn })
], wo.prototype, "keyEncryptionAlgorithm", void 0);
f([
  y({ type: nt })
], wo.prototype, "encryptedKey", void 0);
class bo {
  constructor(e = {}) {
    this.version = an.v0, this.keyEncryptionAlgorithm = new cn(), this.encryptedKey = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], bo.prototype, "version", void 0);
f([
  y({ type: Ol, context: 0, optional: !0 })
], bo.prototype, "keyDerivationAlgorithm", void 0);
f([
  y({ type: cn })
], bo.prototype, "keyEncryptionAlgorithm", void 0);
f([
  y({ type: nt })
], bo.prototype, "encryptedKey", void 0);
class of {
  constructor(e = {}) {
    this.oriType = "", this.oriValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], of.prototype, "oriType", void 0);
f([
  y({ type: b.Any })
], of.prototype, "oriValue", void 0);
let Fn = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: vo, optional: !0 })
], Fn.prototype, "ktri", void 0);
f([
  y({ type: cs, context: 1, implicit: !0, optional: !0 })
], Fn.prototype, "kari", void 0);
f([
  y({ type: wo, context: 2, implicit: !0, optional: !0 })
], Fn.prototype, "kekri", void 0);
f([
  y({ type: bo, context: 3, implicit: !0, optional: !0 })
], Fn.prototype, "pwri", void 0);
f([
  y({ type: of, context: 4, implicit: !0, optional: !0 })
], Fn.prototype, "ori", void 0);
Fn = f([
  H({ type: M.Choice })
], Fn);
var Ll;
let sa = Ll = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Ll.prototype);
  }
};
sa = Ll = f([
  H({ type: M.Set, itemType: Fn })
], sa);
var Hl;
class wc {
  constructor(e = {}) {
    this.otherRevInfoFormat = "", this.otherRevInfo = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], wc.prototype, "otherRevInfoFormat", void 0);
f([
  y({ type: b.Any })
], wc.prototype, "otherRevInfo", void 0);
let oa = class {
  constructor(e = {}) {
    this.other = new wc(), Object.assign(this, e);
  }
};
f([
  y({ type: wc, context: 1, implicit: !0 })
], oa.prototype, "other", void 0);
oa = f([
  H({ type: M.Choice })
], oa);
let aa = Hl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Hl.prototype);
  }
};
aa = Hl = f([
  H({ type: M.Set, itemType: oa })
], aa);
class af {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: $s, context: 0, implicit: !0, optional: !0 })
], af.prototype, "certs", void 0);
f([
  y({ type: aa, context: 1, implicit: !0, optional: !0 })
], af.prototype, "crls", void 0);
var Fl;
let zl = Fl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Fl.prototype);
  }
};
zl = Fl = f([
  H({ type: M.Set, itemType: as })
], zl);
class xo {
  constructor(e = {}) {
    this.version = an.v0, this.recipientInfos = new sa(), this.encryptedContentInfo = new go(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], xo.prototype, "version", void 0);
f([
  y({ type: af, context: 0, implicit: !0, optional: !0 })
], xo.prototype, "originatorInfo", void 0);
f([
  y({ type: sa })
], xo.prototype, "recipientInfos", void 0);
f([
  y({ type: go })
], xo.prototype, "encryptedContentInfo", void 0);
f([
  y({ type: zl, context: 1, implicit: !0, optional: !0 })
], xo.prototype, "unprotectedAttrs", void 0);
const ev = "1.2.840.113549.1.7.1", Gl = "1.2.840.113549.1.7.2";
var ql;
let ca = ql = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, ql.prototype);
  }
};
ca = ql = f([
  H({ type: M.Set, itemType: Ds })
], ca);
class xn {
  constructor(e = {}) {
    this.version = an.v0, this.digestAlgorithms = new ca(), this.encapContentInfo = new gc(), this.signerInfos = new ta(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], xn.prototype, "version", void 0);
f([
  y({ type: ca })
], xn.prototype, "digestAlgorithms", void 0);
f([
  y({ type: gc })
], xn.prototype, "encapContentInfo", void 0);
f([
  y({ type: $s, context: 0, implicit: !0, optional: !0 })
], xn.prototype, "certificates", void 0);
f([
  y({ type: aa, context: 1, implicit: !0, optional: !0 })
], xn.prototype, "crls", void 0);
f([
  y({ type: ta })
], xn.prototype, "signerInfos", void 0);
const Vs = "1.2.840.10045.2.1", cf = "1.2.840.10045.4.1", Hp = "1.2.840.10045.4.3.1", lf = "1.2.840.10045.4.3.2", uf = "1.2.840.10045.4.3.3", ff = "1.2.840.10045.4.3.4", eh = "1.2.840.10045.3.1.7", th = "1.3.132.0.34", rh = "1.3.132.0.35";
function Ao(r) {
  return new oe({ algorithm: r });
}
const tv = Ao(cf);
Ao(Hp);
const rv = Ao(lf), nv = Ao(uf), iv = Ao(ff);
let Ls = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: b.ObjectIdentifier })
], Ls.prototype, "fieldType", void 0);
f([
  y({ type: b.Any })
], Ls.prototype, "parameters", void 0);
Ls = f([
  H({ type: M.Sequence })
], Ls);
class sv extends nt {
}
let Zi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: b.OctetString })
], Zi.prototype, "a", void 0);
f([
  y({ type: b.OctetString })
], Zi.prototype, "b", void 0);
f([
  y({ type: b.BitString, optional: !0 })
], Zi.prototype, "seed", void 0);
Zi = f([
  H({ type: M.Sequence })
], Zi);
var Kl;
(function(r) {
  r[r.ecpVer1 = 1] = "ecpVer1";
})(Kl || (Kl = {}));
let _n = class {
  constructor(e = {}) {
    this.version = Kl.ecpVer1, Object.assign(this, e);
  }
};
f([
  y({ type: b.Integer })
], _n.prototype, "version", void 0);
f([
  y({ type: Ls })
], _n.prototype, "fieldID", void 0);
f([
  y({ type: Zi })
], _n.prototype, "curve", void 0);
f([
  y({ type: sv })
], _n.prototype, "base", void 0);
f([
  y({ type: b.Integer, converter: bt })
], _n.prototype, "order", void 0);
f([
  y({ type: b.Integer, optional: !0 })
], _n.prototype, "cofactor", void 0);
_n = f([
  H({ type: M.Sequence })
], _n);
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
  y({ type: _n })
], zn.prototype, "specifiedCurve", void 0);
zn = f([
  H({ type: M.Choice })
], zn);
class bc {
  constructor(e = {}) {
    this.version = 1, this.privateKey = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], bc.prototype, "version", void 0);
f([
  y({ type: nt })
], bc.prototype, "privateKey", void 0);
f([
  y({ type: zn, context: 0, optional: !0 })
], bc.prototype, "parameters", void 0);
f([
  y({ type: b.BitString, context: 1, optional: !0 })
], bc.prototype, "publicKey", void 0);
class la {
  constructor(e = {}) {
    this.r = new ArrayBuffer(0), this.s = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, converter: bt })
], la.prototype, "r", void 0);
f([
  y({ type: b.Integer, converter: bt })
], la.prototype, "s", void 0);
const wr = "1.2.840.113549.1.1", gi = `${wr}.1`, ov = `${wr}.7`, av = `${wr}.9`, Ns = `${wr}.10`, cv = `${wr}.2`, lv = `${wr}.4`, ua = `${wr}.5`, uv = `${wr}.14`, Zl = `${wr}.11`, fa = `${wr}.12`, ha = `${wr}.13`, Fp = `${wr}.15`, zp = `${wr}.16`, da = "1.3.14.3.2.26", Gp = "2.16.840.1.101.3.4.2.4", pa = "2.16.840.1.101.3.4.2.1", ya = "2.16.840.1.101.3.4.2.2", ga = "2.16.840.1.101.3.4.2.3", fv = "2.16.840.1.101.3.4.2.5", hv = "2.16.840.1.101.3.4.2.6", dv = "1.2.840.113549.2.2", pv = "1.2.840.113549.2.5", xc = `${wr}.8`;
function Ft(r) {
  return new oe({ algorithm: r, parameters: null });
}
Ft(dv);
Ft(pv);
const vi = Ft(da);
Ft(Gp);
Ft(pa);
Ft(ya);
Ft(ga);
Ft(fv);
Ft(hv);
const qp = new oe({
  algorithm: xc,
  parameters: Z.serialize(vi)
}), Kp = new oe({
  algorithm: av,
  parameters: Z.serialize(Go.toASN(new Uint8Array([218, 57, 163, 238, 94, 107, 75, 13, 50, 85, 191, 239, 149, 96, 24, 144, 175, 216, 7, 9]).buffer))
});
Ft(gi);
Ft(cv);
Ft(lv);
Ft(ua);
Ft(Fp);
Ft(zp);
Ft(fa);
Ft(ha);
Ft(Fp);
Ft(zp);
class Ac {
  constructor(e = {}) {
    this.hashAlgorithm = new oe(vi), this.maskGenAlgorithm = new oe({
      algorithm: xc,
      parameters: Z.serialize(vi)
    }), this.pSourceAlgorithm = new oe(Kp), Object.assign(this, e);
  }
}
f([
  y({ type: oe, context: 0, defaultValue: vi })
], Ac.prototype, "hashAlgorithm", void 0);
f([
  y({ type: oe, context: 1, defaultValue: qp })
], Ac.prototype, "maskGenAlgorithm", void 0);
f([
  y({ type: oe, context: 2, defaultValue: Kp })
], Ac.prototype, "pSourceAlgorithm", void 0);
new oe({
  algorithm: ov,
  parameters: Z.serialize(new Ac())
});
class mi {
  constructor(e = {}) {
    this.hashAlgorithm = new oe(vi), this.maskGenAlgorithm = new oe({
      algorithm: xc,
      parameters: Z.serialize(vi)
    }), this.saltLength = 20, this.trailerField = 1, Object.assign(this, e);
  }
}
f([
  y({ type: oe, context: 0, defaultValue: vi })
], mi.prototype, "hashAlgorithm", void 0);
f([
  y({ type: oe, context: 1, defaultValue: qp })
], mi.prototype, "maskGenAlgorithm", void 0);
f([
  y({ type: b.Integer, context: 2, defaultValue: 20 })
], mi.prototype, "saltLength", void 0);
f([
  y({ type: b.Integer, context: 3, defaultValue: 1 })
], mi.prototype, "trailerField", void 0);
new oe({
  algorithm: Ns,
  parameters: Z.serialize(new mi())
});
class Sc {
  constructor(e = {}) {
    this.digestAlgorithm = new oe(), this.digest = new nt(), Object.assign(this, e);
  }
}
f([
  y({ type: oe })
], Sc.prototype, "digestAlgorithm", void 0);
f([
  y({ type: nt })
], Sc.prototype, "digest", void 0);
var Wl;
class _c {
  constructor(e = {}) {
    this.prime = new ArrayBuffer(0), this.exponent = new ArrayBuffer(0), this.coefficient = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, converter: bt })
], _c.prototype, "prime", void 0);
f([
  y({ type: b.Integer, converter: bt })
], _c.prototype, "exponent", void 0);
f([
  y({ type: b.Integer, converter: bt })
], _c.prototype, "coefficient", void 0);
let Yl = Wl = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Wl.prototype);
  }
};
Yl = Wl = f([
  H({ type: M.Sequence, itemType: _c })
], Yl);
class dn {
  constructor(e = {}) {
    this.version = 0, this.modulus = new ArrayBuffer(0), this.publicExponent = new ArrayBuffer(0), this.privateExponent = new ArrayBuffer(0), this.prime1 = new ArrayBuffer(0), this.prime2 = new ArrayBuffer(0), this.exponent1 = new ArrayBuffer(0), this.exponent2 = new ArrayBuffer(0), this.coefficient = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], dn.prototype, "version", void 0);
f([
  y({ type: b.Integer, converter: bt })
], dn.prototype, "modulus", void 0);
f([
  y({ type: b.Integer, converter: bt })
], dn.prototype, "publicExponent", void 0);
f([
  y({ type: b.Integer, converter: bt })
], dn.prototype, "privateExponent", void 0);
f([
  y({ type: b.Integer, converter: bt })
], dn.prototype, "prime1", void 0);
f([
  y({ type: b.Integer, converter: bt })
], dn.prototype, "prime2", void 0);
f([
  y({ type: b.Integer, converter: bt })
], dn.prototype, "exponent1", void 0);
f([
  y({ type: b.Integer, converter: bt })
], dn.prototype, "exponent2", void 0);
f([
  y({ type: b.Integer, converter: bt })
], dn.prototype, "coefficient", void 0);
f([
  y({ type: Yl, optional: !0 })
], dn.prototype, "otherPrimeInfos", void 0);
class hf {
  constructor(e = {}) {
    this.modulus = new ArrayBuffer(0), this.publicExponent = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, converter: bt })
], hf.prototype, "modulus", void 0);
f([
  y({ type: b.Integer, converter: bt })
], hf.prototype, "publicExponent", void 0);
var Jl;
(function(r) {
  r[r.Transient = 0] = "Transient", r[r.Singleton = 1] = "Singleton", r[r.ResolutionScoped = 2] = "ResolutionScoped", r[r.ContainerScoped = 3] = "ContainerScoped";
})(Jl || (Jl = {}));
const dr = Jl;
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
var Xl = function(r, e) {
  return Xl = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, n) {
    t.__proto__ = n;
  } || function(t, n) {
    for (var i in n) n.hasOwnProperty(i) && (t[i] = n[i]);
  }, Xl(r, e);
};
function df(r, e) {
  Xl(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
function yv(r, e, t, n) {
  function i(s) {
    return s instanceof t ? s : new t(function(o) {
      o(s);
    });
  }
  return new (t || (t = Promise))(function(s, o) {
    function c(w) {
      try {
        h(n.next(w));
      } catch (x) {
        o(x);
      }
    }
    function u(w) {
      try {
        h(n.throw(w));
      } catch (x) {
        o(x);
      }
    }
    function h(w) {
      w.done ? s(w.value) : i(w.value).then(c, u);
    }
    h((n = n.apply(r, [])).next());
  });
}
function gv(r, e) {
  var t = { label: 0, sent: function() {
    if (s[0] & 1) throw s[1];
    return s[1];
  }, trys: [], ops: [] }, n, i, s, o;
  return o = { next: c(0), throw: c(1), return: c(2) }, typeof Symbol == "function" && (o[Symbol.iterator] = function() {
    return this;
  }), o;
  function c(h) {
    return function(w) {
      return u([h, w]);
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
    } catch (w) {
      h = [6, w], i = 0;
    } finally {
      n = s = 0;
    }
    if (h[0] & 5) throw h[1];
    return { value: h[0] ? h[1] : void 0, done: !0 };
  }
}
function Oo(r) {
  var e = typeof Symbol == "function" && Symbol.iterator, t = e && r[e], n = 0;
  if (t) return t.call(r);
  if (r && typeof r.length == "number") return {
    next: function() {
      return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
    }
  };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function va(r, e) {
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
function ti() {
  for (var r = [], e = 0; e < arguments.length; e++)
    r = r.concat(va(arguments[e]));
  return r;
}
var vv = "injectionTokens";
function mv(r) {
  var e = Reflect.getMetadata("design:paramtypes", r) || [], t = Reflect.getOwnMetadata(vv, r) || {};
  return Object.keys(t).forEach(function(n) {
    e[+n] = t[n];
  }), e;
}
function Zp(r) {
  return !!r.useClass;
}
function Ql(r) {
  return !!r.useFactory;
}
var Wp = function() {
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
        return c.apply(void 0, ti(s));
      };
    };
    return this.reflectMethods.forEach(n), t;
  }, r;
}();
function Ti(r) {
  return typeof r == "string" || typeof r == "symbol";
}
function wv(r) {
  return typeof r == "object" && "token" in r && "multiple" in r;
}
function nh(r) {
  return typeof r == "object" && "token" in r && "transform" in r;
}
function bv(r) {
  return typeof r == "function" || r instanceof Wp;
}
function Uo(r) {
  return !!r.useToken;
}
function Do(r) {
  return r.useValue != null;
}
function xv(r) {
  return Zp(r) || Do(r) || Uo(r) || Ql(r);
}
var pf = function() {
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
}(), Av = function(r) {
  df(e, r);
  function e() {
    return r !== null && r.apply(this, arguments) || this;
  }
  return e;
}(pf), ih = /* @__PURE__ */ function() {
  function r() {
    this.scopedResolutions = /* @__PURE__ */ new Map();
  }
  return r;
}();
function Sv(r, e) {
  if (r === null)
    return "at position #" + e;
  var t = r.split(",")[e].trim();
  return '"' + t + '" at position #' + e;
}
function _v(r, e, t) {
  return t === void 0 && (t = "    "), ti([r], e.message.split(`
`).map(function(n) {
    return t + n;
  })).join(`
`);
}
function Ev(r, e, t) {
  var n = va(r.toString().match(/constructor\(([\w, ]+)\)/) || [], 2), i = n[1], s = i === void 0 ? null : i, o = Sv(s, e);
  return _v("Cannot inject the dependency " + o + ' of "' + r.name + '" constructor. Reason:', t);
}
function Iv(r) {
  if (typeof r.dispose != "function")
    return !1;
  var e = r.dispose;
  return !(e.length > 0);
}
var kv = function(r) {
  df(e, r);
  function e() {
    return r !== null && r.apply(this, arguments) || this;
  }
  return e;
}(pf), Cv = function(r) {
  df(e, r);
  function e() {
    return r !== null && r.apply(this, arguments) || this;
  }
  return e;
}(pf), Bv = /* @__PURE__ */ function() {
  function r() {
    this.preResolution = new kv(), this.postResolution = new Cv();
  }
  return r;
}(), Yp = /* @__PURE__ */ new Map(), Ov = function() {
  function r(e) {
    this.parent = e, this._registry = new Av(), this.interceptors = new Bv(), this.disposed = !1, this.disposables = /* @__PURE__ */ new Set();
  }
  return r.prototype.register = function(e, t, n) {
    n === void 0 && (n = { lifecycle: dr.Transient }), this.ensureNotDisposed();
    var i;
    if (xv(t) ? i = t : i = { useClass: t }, Uo(i))
      for (var s = [e], o = i; o != null; ) {
        var c = o.useToken;
        if (s.includes(c))
          throw new Error("Token registration cycle detected! " + ti(s, [c]).join(" -> "));
        s.push(c);
        var u = this._registry.get(c);
        u && Uo(u.provider) ? o = u.provider : o = null;
      }
    if ((n.lifecycle === dr.Singleton || n.lifecycle == dr.ContainerScoped || n.lifecycle == dr.ResolutionScoped) && (Do(i) || Ql(i)))
      throw new Error('Cannot use lifecycle "' + dr[n.lifecycle] + '" with ValueProviders or FactoryProviders');
    return this._registry.set(e, { provider: i, options: n }), this;
  }, r.prototype.registerType = function(e, t) {
    return this.ensureNotDisposed(), Ti(t) ? this.register(e, {
      useToken: t
    }) : this.register(e, {
      useClass: t
    });
  }, r.prototype.registerInstance = function(e, t) {
    return this.ensureNotDisposed(), this.register(e, {
      useValue: t
    });
  }, r.prototype.registerSingleton = function(e, t) {
    if (this.ensureNotDisposed(), Ti(e)) {
      if (Ti(t))
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
    return t && !Ti(t) && (n = t), this.register(e, {
      useClass: n
    }, { lifecycle: dr.Singleton });
  }, r.prototype.resolve = function(e, t) {
    t === void 0 && (t = new ih()), this.ensureNotDisposed();
    var n = this.getRegistration(e);
    if (!n && Ti(e))
      throw new Error('Attempted to resolve unregistered dependency token: "' + e.toString() + '"');
    if (this.executePreResolutionInterceptor(e, "Single"), n) {
      var i = this.resolveRegistration(n, t);
      return this.executePostResolutionInterceptor(e, i, "Single"), i;
    }
    if (bv(e)) {
      var i = this.construct(e, t);
      return this.executePostResolutionInterceptor(e, i, "Single"), i;
    }
    throw new Error("Attempted to construct an undefined constructor. Could mean a circular dependency problem. Try using `delay` function.");
  }, r.prototype.executePreResolutionInterceptor = function(e, t) {
    var n, i;
    if (this.interceptors.preResolution.has(e)) {
      var s = [];
      try {
        for (var o = Oo(this.interceptors.preResolution.getAll(e)), c = o.next(); !c.done; c = o.next()) {
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
        for (var c = Oo(this.interceptors.postResolution.getAll(e)), u = c.next(); !u.done; u = c.next()) {
          var h = u.value;
          h.options.frequency != "Once" && o.push(h), h.callback(e, t, n);
        }
      } catch (w) {
        i = { error: w };
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
    return Do(e.provider) ? o = e.provider.useValue : Uo(e.provider) ? o = s ? e.instance || (e.instance = this.resolve(e.provider.useToken, t)) : this.resolve(e.provider.useToken, t) : Zp(e.provider) ? o = s ? e.instance || (e.instance = this.construct(e.provider.useClass, t)) : this.construct(e.provider.useClass, t) : Ql(e.provider) ? o = e.provider.useFactory(this) : o = this.construct(e.provider, t), e.options.lifecycle === dr.ResolutionScoped && t.scopedResolutions.set(e, o), o;
  }, r.prototype.resolveAll = function(e, t) {
    var n = this;
    t === void 0 && (t = new ih()), this.ensureNotDisposed();
    var i = this.getAllRegistrations(e);
    if (!i && Ti(e))
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
      for (var n = Oo(this._registry.entries()), i = n.next(); !i.done; i = n.next()) {
        var s = va(i.value, 2), o = s[0], c = s[1];
        this._registry.setAll(o, c.filter(function(u) {
          return !Do(u.provider);
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
      for (var i = Oo(this._registry.entries()), s = i.next(); !s.done; s = i.next()) {
        var o = va(s.value, 2), c = o[0], u = o[1];
        u.some(function(h) {
          var w = h.options;
          return w.lifecycle === dr.ContainerScoped;
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
    return yv(this, void 0, void 0, function() {
      var e;
      return gv(this, function(t) {
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
    if (e instanceof Wp)
      return e.createProxy(function(s) {
        return n.resolve(s, t);
      });
    var i = function() {
      var s = Yp.get(e);
      if (!s || s.length === 0) {
        if (e.length === 0)
          return new e();
        throw new Error('TypeInfo not known for "' + e.name + '"');
      }
      var o = s.map(n.resolveParams(t, e));
      return new (e.bind.apply(e, ti([void 0], o)))();
    }();
    return Iv(i) && this.disposables.add(i), i;
  }, r.prototype.resolveParams = function(e, t) {
    var n = this;
    return function(i, s) {
      var o, c, u;
      try {
        return wv(i) ? nh(i) ? i.multiple ? (o = n.resolve(i.transform)).transform.apply(o, ti([n.resolveAll(i.token)], i.transformArgs)) : (c = n.resolve(i.transform)).transform.apply(c, ti([n.resolve(i.token, e)], i.transformArgs)) : i.multiple ? n.resolveAll(i.token) : n.resolve(i.token, e) : nh(i) ? (u = n.resolve(i.transform, e)).transform.apply(u, ti([n.resolve(i.token, e)], i.transformArgs)) : n.resolve(i, e);
      } catch (h) {
        throw new Error(Ev(t, s, h));
      }
    };
  }, r.prototype.ensureNotDisposed = function() {
    if (this.disposed)
      throw new Error("This container has been disposed, you cannot interact with a disposed container");
  }, r;
}(), lr = new Ov();
function Ec() {
  return function(r) {
    Yp.set(r, mv(r));
  };
}
if (typeof Reflect > "u" || !Reflect.getMetadata)
  throw new Error(`tsyringe requires a reflect polyfill. Please add 'import "reflect-metadata"' to the top of your entry point.`);
var eu;
class Ic {
  constructor(e = {}) {
    this.attrId = "", this.attrValues = [], Object.assign(e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Ic.prototype, "attrId", void 0);
f([
  y({ type: b.Any, repeated: "set" })
], Ic.prototype, "attrValues", void 0);
let sh = eu = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, eu.prototype);
  }
};
sh = eu = f([
  H({ type: M.Sequence, itemType: Ic })
], sh);
var tu;
let oh = tu = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, tu.prototype);
  }
};
oh = tu = f([
  H({ type: M.Sequence, itemType: bn })
], oh);
class Jp {
  constructor(e = {}) {
    this.certId = "", this.certValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Jp.prototype, "certId", void 0);
f([
  y({ type: b.Any, context: 0 })
], Jp.prototype, "certValue", void 0);
class Xp {
  constructor(e = {}) {
    this.crlId = "", this.crltValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Xp.prototype, "crlId", void 0);
f([
  y({ type: b.Any, context: 0 })
], Xp.prototype, "crltValue", void 0);
class Qp extends nt {
}
let kc = class {
  constructor(e = {}) {
    this.encryptionAlgorithm = new oe(), this.encryptedData = new Qp(), Object.assign(this, e);
  }
};
f([
  y({ type: oe })
], kc.prototype, "encryptionAlgorithm", void 0);
f([
  y({ type: Qp })
], kc.prototype, "encryptedData", void 0);
var ru, nu;
(function(r) {
  r[r.v1 = 0] = "v1";
})(nu || (nu = {}));
class e0 extends nt {
}
let iu = ru = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, ru.prototype);
  }
};
iu = ru = f([
  H({ type: M.Sequence, itemType: Sn })
], iu);
class So {
  constructor(e = {}) {
    this.version = nu.v1, this.privateKeyAlgorithm = new oe(), this.privateKey = new e0(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], So.prototype, "version", void 0);
f([
  y({ type: oe })
], So.prototype, "privateKeyAlgorithm", void 0);
f([
  y({ type: e0 })
], So.prototype, "privateKey", void 0);
f([
  y({ type: iu, implicit: !0, context: 0, optional: !0 })
], So.prototype, "attributes", void 0);
let ah = class extends So {
};
ah = f([
  H({ type: M.Sequence })
], ah);
let ch = class extends kc {
};
ch = f([
  H({ type: M.Sequence })
], ch);
class t0 {
  constructor(e = {}) {
    this.secretTypeId = "", this.secretValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], t0.prototype, "secretTypeId", void 0);
f([
  y({ type: b.Any, context: 0 })
], t0.prototype, "secretValue", void 0);
class _o {
  constructor(e = {}) {
    this.mac = new Sc(), this.macSalt = new nt(), this.iterations = 1, Object.assign(this, e);
  }
}
f([
  y({ type: Sc })
], _o.prototype, "mac", void 0);
f([
  y({ type: nt })
], _o.prototype, "macSalt", void 0);
f([
  y({ type: b.Integer, defaultValue: 1 })
], _o.prototype, "iterations", void 0);
class Cc {
  constructor(e = {}) {
    this.version = 3, this.authSafe = new bn(), this.macData = new _o(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], Cc.prototype, "version", void 0);
f([
  y({ type: bn })
], Cc.prototype, "authSafe", void 0);
f([
  y({ type: _o, optional: !0 })
], Cc.prototype, "macData", void 0);
var su;
class Bc {
  constructor(e = {}) {
    this.bagId = "", this.bagValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Bc.prototype, "bagId", void 0);
f([
  y({ type: b.Any, context: 0 })
], Bc.prototype, "bagValue", void 0);
f([
  y({ type: Ic, repeated: "set", optional: !0 })
], Bc.prototype, "bagAttributes", void 0);
let lh = su = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, su.prototype);
  }
};
lh = su = f([
  H({ type: M.Sequence, itemType: Bc })
], lh);
var ou, au, cu;
const r0 = "1.2.840.113549.1.9", n0 = `${r0}.7`, yf = `${r0}.14`;
let ma = class extends Xt {
  constructor(e = {}) {
    super(e);
  }
  toString() {
    return this.ia5String || super.toString();
  }
};
f([
  y({ type: b.IA5String })
], ma.prototype, "ia5String", void 0);
ma = f([
  H({ type: M.Choice })
], ma);
let uh = class extends bn {
};
uh = f([
  H({ type: M.Sequence })
], uh);
let fh = class extends Cc {
};
fh = f([
  H({ type: M.Sequence })
], fh);
let hh = class extends kc {
};
hh = f([
  H({ type: M.Sequence })
], hh);
let lu = class {
  constructor(e = "") {
    this.value = e;
  }
  toString() {
    return this.value;
  }
};
f([
  y({ type: b.IA5String })
], lu.prototype, "value", void 0);
lu = f([
  H({ type: M.Choice })
], lu);
let dh = class extends ma {
};
dh = f([
  H({ type: M.Choice })
], dh);
let ph = class extends Xt {
};
ph = f([
  H({ type: M.Choice })
], ph);
let uu = class {
  constructor(e = /* @__PURE__ */ new Date()) {
    this.value = e;
  }
};
f([
  y({ type: b.GeneralizedTime })
], uu.prototype, "value", void 0);
uu = f([
  H({ type: M.Choice })
], uu);
let yh = class extends Xt {
};
yh = f([
  H({ type: M.Choice })
], yh);
let fu = class {
  constructor(e = "M") {
    this.value = e;
  }
  toString() {
    return this.value;
  }
};
f([
  y({ type: b.PrintableString })
], fu.prototype, "value", void 0);
fu = f([
  H({ type: M.Choice })
], fu);
let wa = class {
  constructor(e = "") {
    this.value = e;
  }
  toString() {
    return this.value;
  }
};
f([
  y({ type: b.PrintableString })
], wa.prototype, "value", void 0);
wa = f([
  H({ type: M.Choice })
], wa);
let gh = class extends wa {
};
gh = f([
  H({ type: M.Choice })
], gh);
let vh = class extends Xt {
};
vh = f([
  H({ type: M.Choice })
], vh);
let hu = class {
  constructor(e = "") {
    this.value = e;
  }
  toString() {
    return this.value;
  }
};
f([
  y({ type: b.ObjectIdentifier })
], hu.prototype, "value", void 0);
hu = f([
  H({ type: M.Choice })
], hu);
let mh = class extends Yt {
};
mh = f([
  H({ type: M.Choice })
], mh);
let du = class {
  constructor(e = 0) {
    this.value = e;
  }
  toString() {
    return this.value.toString();
  }
};
f([
  y({ type: b.Integer })
], du.prototype, "value", void 0);
du = f([
  H({ type: M.Choice })
], du);
let wh = class extends hn {
};
wh = f([
  H({ type: M.Sequence })
], wh);
let ba = class extends Xt {
};
ba = f([
  H({ type: M.Choice })
], ba);
let bh = ou = class extends hi {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, ou.prototype);
  }
};
bh = ou = f([
  H({ type: M.Sequence })
], bh);
let xh = au = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, au.prototype);
  }
};
xh = au = f([
  H({ type: M.Set, itemType: as })
], xh);
let pu = class {
  constructor(e = "") {
    this.value = e;
  }
  toString() {
    return this.value;
  }
};
f([
  y({ type: b.BmpString })
], pu.prototype, "value", void 0);
pu = f([
  H({ type: M.Choice })
], pu);
let yu = class extends oe {
};
yu = f([
  H({ type: M.Sequence })
], yu);
let Ah = cu = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, cu.prototype);
  }
};
Ah = cu = f([
  H({ type: M.Sequence, itemType: yu })
], Ah);
var gu;
let xa = gu = class extends pt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, gu.prototype);
  }
};
xa = gu = f([
  H({ type: M.Sequence, itemType: Sn })
], xa);
class ls {
  constructor(e = {}) {
    this.version = 0, this.subject = new Ht(), this.subjectPKInfo = new rn(), this.attributes = new xa(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], ls.prototype, "version", void 0);
f([
  y({ type: Ht })
], ls.prototype, "subject", void 0);
f([
  y({ type: rn })
], ls.prototype, "subjectPKInfo", void 0);
f([
  y({ type: xa, implicit: !0, context: 0 })
], ls.prototype, "attributes", void 0);
class Hs {
  constructor(e = {}) {
    this.certificationRequestInfo = new ls(), this.signatureAlgorithm = new oe(), this.signature = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: ls })
], Hs.prototype, "certificationRequestInfo", void 0);
f([
  y({ type: oe })
], Hs.prototype, "signatureAlgorithm", void 0);
f([
  y({ type: b.BitString })
], Hs.prototype, "signature", void 0);
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
const Eo = "crypto.algorithm";
class Tv {
  getAlgorithms() {
    return lr.resolveAll(Eo);
  }
  toAsnAlgorithm(e) {
    ({ ...e });
    for (const t of this.getAlgorithms()) {
      const n = t.toAsnAlgorithm(e);
      if (n)
        return n;
    }
    if (/^[0-9.]+$/.test(e.name)) {
      const t = new oe({
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
const Wi = "crypto.algorithmProvider";
lr.registerSingleton(Wi, Tv);
var $o;
const br = "1.3.36.3.3.2.8.1.1", Sh = `${br}.1`, _h = `${br}.2`, Eh = `${br}.3`, Ih = `${br}.4`, kh = `${br}.5`, Ch = `${br}.6`, Bh = `${br}.7`, Oh = `${br}.8`, Th = `${br}.9`, Nh = `${br}.10`, Ph = `${br}.11`, jh = `${br}.12`, Rh = `${br}.13`, Uh = `${br}.14`, Dh = "brainpoolP160r1", $h = "brainpoolP160t1", Mh = "brainpoolP192r1", Vh = "brainpoolP192t1", Lh = "brainpoolP224r1", Hh = "brainpoolP224t1", Fh = "brainpoolP256r1", zh = "brainpoolP256t1", Gh = "brainpoolP320r1", qh = "brainpoolP320t1", Kh = "brainpoolP384r1", Zh = "brainpoolP384t1", Wh = "brainpoolP512r1", Yh = "brainpoolP512t1", kt = "ECDSA";
let Fs = $o = class {
  toAsnAlgorithm(e) {
    switch (e.name.toLowerCase()) {
      case kt.toLowerCase():
        if ("hash" in e)
          switch ((typeof e.hash == "string" ? e.hash : e.hash.name).toLowerCase()) {
            case "sha-1":
              return tv;
            case "sha-256":
              return rv;
            case "sha-384":
              return nv;
            case "sha-512":
              return iv;
          }
        else if ("namedCurve" in e) {
          let t = "";
          switch (e.namedCurve) {
            case "P-256":
              t = eh;
              break;
            case "K-256":
              t = $o.SECP256K1;
              break;
            case "P-384":
              t = th;
              break;
            case "P-521":
              t = rh;
              break;
            case Dh:
              t = Sh;
              break;
            case $h:
              t = _h;
              break;
            case Mh:
              t = Eh;
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
            case zh:
              t = Oh;
              break;
            case Gh:
              t = Th;
              break;
            case qh:
              t = Nh;
              break;
            case Kh:
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
          }
          if (t)
            return new oe({
              algorithm: Vs,
              parameters: Z.serialize(new zn({ namedCurve: t }))
            });
        }
    }
    return null;
  }
  toWebAlgorithm(e) {
    switch (e.algorithm) {
      case cf:
        return { name: kt, hash: { name: "SHA-1" } };
      case lf:
        return { name: kt, hash: { name: "SHA-256" } };
      case uf:
        return { name: kt, hash: { name: "SHA-384" } };
      case ff:
        return { name: kt, hash: { name: "SHA-512" } };
      case Vs: {
        if (!e.parameters)
          throw new TypeError("Cannot get required parameters from EC algorithm");
        switch (Z.parse(e.parameters, zn).namedCurve) {
          case eh:
            return { name: kt, namedCurve: "P-256" };
          case $o.SECP256K1:
            return { name: kt, namedCurve: "K-256" };
          case th:
            return { name: kt, namedCurve: "P-384" };
          case rh:
            return { name: kt, namedCurve: "P-521" };
          case Sh:
            return { name: kt, namedCurve: Dh };
          case _h:
            return { name: kt, namedCurve: $h };
          case Eh:
            return { name: kt, namedCurve: Mh };
          case Ih:
            return { name: kt, namedCurve: Vh };
          case kh:
            return { name: kt, namedCurve: Lh };
          case Ch:
            return { name: kt, namedCurve: Hh };
          case Bh:
            return { name: kt, namedCurve: Fh };
          case Oh:
            return { name: kt, namedCurve: zh };
          case Th:
            return { name: kt, namedCurve: Gh };
          case Nh:
            return { name: kt, namedCurve: qh };
          case Ph:
            return { name: kt, namedCurve: Kh };
          case jh:
            return { name: kt, namedCurve: Zh };
          case Rh:
            return { name: kt, namedCurve: Wh };
          case Uh:
            return { name: kt, namedCurve: Yh };
        }
      }
    }
    return null;
  }
};
Fs.SECP256K1 = "1.3.132.0.10";
Fs = $o = f([
  Ec()
], Fs);
lr.registerSingleton(Eo, Fs);
const i0 = Symbol("name"), s0 = Symbol("value");
class rt {
  constructor(e, t = {}, n = "") {
    this[i0] = e, this[s0] = n;
    for (const i in t)
      this[i] = t[i];
  }
}
rt.NAME = i0;
rt.VALUE = s0;
class Nv {
  static toTextObject(e) {
    const t = new rt("Algorithm Identifier", {}, Bn.toString(e.algorithm));
    if (e.parameters)
      switch (e.algorithm) {
        case Vs: {
          const n = new Fs().toWebAlgorithm(e);
          n && "namedCurve" in n ? t["Named Curve"] = n.namedCurve : t.Parameters = e.parameters;
          break;
        }
        default:
          t.Parameters = e.parameters;
      }
    return t;
  }
}
class Bn {
  static toString(e) {
    const t = this.items[e];
    return t || e;
  }
}
Bn.items = {
  [da]: "sha1",
  [Gp]: "sha224",
  [pa]: "sha256",
  [ya]: "sha384",
  [ga]: "sha512",
  [gi]: "rsaEncryption",
  [ua]: "sha1WithRSAEncryption",
  [uv]: "sha224WithRSAEncryption",
  [Zl]: "sha256WithRSAEncryption",
  [fa]: "sha384WithRSAEncryption",
  [ha]: "sha512WithRSAEncryption",
  [Vs]: "ecPublicKey",
  [cf]: "ecdsaWithSHA1",
  [Hp]: "ecdsaWithSHA224",
  [lf]: "ecdsaWithSHA256",
  [uf]: "ecdsaWithSHA384",
  [ff]: "ecdsaWithSHA512",
  [Zg]: "TLS WWW server authentication",
  [Wg]: "TLS WWW client authentication",
  [Yg]: "Code Signing",
  [Jg]: "E-mail Protection",
  [Xg]: "Time Stamping",
  [Qg]: "OCSP Signing",
  [Gl]: "Signed Data"
};
class Gn {
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
        for (const w of u)
          w[rt.NAME] = c, n.push(...this.serializeObj(w, t));
      else if (u instanceof rt)
        u[rt.NAME] = c, n.push(...this.serializeObj(u, t));
      else if (J.isBufferSource(u))
        c ? (n.push(`${i}${h}`), n.push(...this.serializeBufferSource(u, t + 1))) : n.push(...this.serializeBufferSource(u, t));
      else if ("toTextObject" in u) {
        const w = u.toTextObject();
        w[rt.NAME] = c, n.push(...this.serializeObj(w, t));
      } else
        throw new TypeError("Cannot serialize data in text format. Unsupported type.");
    }
    return n;
  }
  static serializeBufferSource(e, t = 0) {
    const n = this.pad(t), i = J.toUint8Array(e), s = [];
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
Gn.oidSerializer = Bn;
Gn.algorithmSerializer = Nv;
class Jn {
  constructor(...e) {
    if (e.length === 1) {
      const t = e[0];
      this.rawData = Z.serialize(t), this.onInit(t);
    } else {
      const t = Z.parse(e[0], e[1]);
      this.rawData = J.toArrayBuffer(e[0]), this.onInit(t);
    }
  }
  equal(e) {
    return e instanceof Jn ? Ho(e.rawData, this.rawData) : !1;
  }
  toString(e = "text") {
    switch (e) {
      case "asn":
        return Z.toString(this.rawData);
      case "text":
        return Gn.serialize(this.toTextObject());
      case "hex":
        return he.ToHex(this.rawData);
      case "base64":
        return he.ToBase64(this.rawData);
      case "base64url":
        return he.ToBase64Url(this.rawData);
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
Jn.NAME = "ASN";
class jr extends Jn {
  constructor(...e) {
    let t;
    J.isBufferSource(e[0]) ? t = J.toArrayBuffer(e[0]) : t = Z.serialize(new Hr({
      extnID: e[0],
      critical: e[1],
      extnValue: new nt(J.toArrayBuffer(e[2]))
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
    return e[rt.NAME] === jr.NAME && (e[rt.NAME] = Bn.toString(this.type)), e;
  }
}
var o0;
class Dn {
  static isCryptoKeyPair(e) {
    return e && e.privateKey && e.publicKey;
  }
  static isCryptoKey(e) {
    return e && e.usages && e.type && e.algorithm && e.extractable !== void 0;
  }
  constructor() {
    this.items = /* @__PURE__ */ new Map(), this[o0] = "CryptoProvider", typeof self < "u" && typeof crypto < "u" ? this.set(Dn.DEFAULT, crypto) : typeof global < "u" && global.crypto && global.crypto.subtle && this.set(Dn.DEFAULT, global.crypto);
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
  get(e = Dn.DEFAULT) {
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
      this.items.set(Dn.DEFAULT, e);
    return this;
  }
}
o0 = Symbol.toStringTag;
Dn.DEFAULT = "default";
const Zt = new Dn(), Pv = /^[0-2](?:\.[1-9][0-9]*)+$/;
function jv(r) {
  return new RegExp(Pv).test(r);
}
class a0 {
  constructor(e = {}) {
    this.items = {};
    for (const t in e)
      this.register(t, e[t]);
  }
  get(e) {
    return this.items[e] || null;
  }
  findId(e) {
    return jv(e) ? e : this.get(e);
  }
  register(e, t) {
    this.items[e] = t, this.items[t] = e;
  }
}
const mr = new a0();
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
function Rv(r, e) {
  return `\\${he.ToHex(he.FromUtf8String(e)).toUpperCase()}`;
}
function Uv(r) {
  return r.replace(/([,+"\\<>;])/g, "\\$1").replace(/^([ #])/, "\\$1").replace(/([ ]$)/, "\\$1").replace(/([\r\n\t])/, Rv);
}
class Hn {
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
    this.extraNames = new a0(), this.asn = new Ht();
    for (const n in t)
      if (Object.prototype.hasOwnProperty.call(t, n)) {
        const i = t[n];
        this.extraNames.register(n, i);
      }
    typeof e == "string" ? this.asn = this.fromString(e) : e instanceof Ht ? this.asn = e : J.isBufferSource(e) ? this.asn = Z.parse(e, Ht) : this.asn = this.fromJSON(e);
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
      const n = this.getName(t.type) || t.type, i = t.value.anyValue ? `#${he.ToHex(t.value.anyValue)}` : Uv(t.value.toString());
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
        (e = i[o]) !== null && e !== void 0 || (i[o] = []), i[o].push(s.value.anyValue ? `#${he.ToHex(s.value.anyValue)}` : s.value.toString());
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
      const w = this.createAttribute(o, c);
      s === "+" ? t[t.length - 1].push(w) : t.push(new Vi([w])), s = h;
    }
    return t;
  }
  fromJSON(e) {
    const t = new Ht();
    for (const n of e) {
      const i = new Vi();
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
    const n = new ic({ type: e });
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
      n.value.anyValue = he.FromHex(t.slice(1));
    else {
      const i = this.processStringValue(t);
      e === this.getName("E") || e === this.getName("DC") ? n.value.ia5String = i : Hn.isPrintableString(i) ? n.value.printableString = i : n.value.utf8String = i;
    }
    return n;
  }
  processStringValue(e) {
    const t = /"(.*?[^\\])?"/.exec(e);
    return t && (e = t[1]), e.replace(/\\0a/ig, `
`).replace(/\\0d/ig, "\r").replace(/\\0g/ig, "	").replace(/\\(.)/g, "$1");
  }
  toArrayBuffer() {
    return Z.serialize(this.asn);
  }
  async getThumbprint(...e) {
    var t;
    let n, i = "SHA-1";
    return e.length >= 1 && !(!((t = e[0]) === null || t === void 0) && t.subtle) ? (i = e[0] || i, n = e[1] || Zt.get()) : n = e[0] || Zt.get(), await n.subtle.digest(i, this.toArrayBuffer());
  }
}
const c0 = "Cannot initialize GeneralName from ASN.1 data.", Jh = `${c0} Unsupported string format in use.`, Dv = `${c0} Value doesn't match to GUID regular expression.`, Xh = /^([0-9a-f]{8})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{12})$/i, Qh = "1.3.6.1.4.1.311.25.1", ed = "1.3.6.1.4.1.311.20.2.3", Lc = "dns", Hc = "dn", Fc = "email", zc = "ip", Gc = "url", qc = "guid", Kc = "upn", To = "id";
class $n extends Jn {
  constructor(...e) {
    let t;
    if (e.length === 2)
      switch (e[0]) {
        case Hc: {
          const n = new Hn(e[1]).toArrayBuffer(), i = Z.parse(n, Ht);
          t = new De({ directoryName: i });
          break;
        }
        case Lc:
          t = new De({ dNSName: e[1] });
          break;
        case Fc:
          t = new De({ rfc822Name: e[1] });
          break;
        case qc: {
          const n = new RegExp(Xh, "i").exec(e[1]);
          if (!n)
            throw new Error("Cannot parse GUID value. Value doesn't match to regular expression");
          const i = n.slice(1).map((s, o) => o < 3 ? he.ToHex(new Uint8Array(he.FromHex(s)).reverse()) : s).join("");
          t = new De({
            otherName: new Us({
              typeId: Qh,
              value: Z.serialize(new nt(he.FromHex(i)))
            })
          });
          break;
        }
        case zc:
          t = new De({ iPAddress: e[1] });
          break;
        case To:
          t = new De({ registeredID: e[1] });
          break;
        case Kc: {
          t = new De({
            otherName: new Us({
              typeId: ed,
              value: Z.serialize(Ip.toASN(e[1]))
            })
          });
          break;
        }
        case Gc:
          t = new De({ uniformResourceIdentifier: e[1] });
          break;
        default:
          throw new Error("Cannot create GeneralName. Unsupported type of the name");
      }
    else J.isBufferSource(e[0]) ? t = Z.parse(e[0], De) : t = e[0];
    super(t);
  }
  onInit(e) {
    if (e.dNSName != null)
      this.type = Lc, this.value = e.dNSName;
    else if (e.rfc822Name != null)
      this.type = Fc, this.value = e.rfc822Name;
    else if (e.iPAddress != null)
      this.type = zc, this.value = e.iPAddress;
    else if (e.uniformResourceIdentifier != null)
      this.type = Gc, this.value = e.uniformResourceIdentifier;
    else if (e.registeredID != null)
      this.type = To, this.value = e.registeredID;
    else if (e.directoryName != null)
      this.type = Hc, this.value = new Hn(e.directoryName).toString();
    else if (e.otherName != null)
      if (e.otherName.typeId === Qh) {
        this.type = qc;
        const t = Z.parse(e.otherName.value, nt), n = new RegExp(Xh, "i").exec(he.ToHex(t));
        if (!n)
          throw new Error(Dv);
        this.value = n.slice(1).map((i, s) => s < 3 ? he.ToHex(new Uint8Array(he.FromHex(i)).reverse()) : i).join("-");
      } else if (e.otherName.typeId === ed)
        this.type = Kc, this.value = Z.parse(e.otherName.value, Xt).toString();
      else
        throw new Error(Jh);
    else
      throw new Error(Jh);
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
      case Hc:
      case Lc:
      case qc:
      case zc:
      case To:
      case Kc:
      case Gc:
        e = this.type.toUpperCase();
        break;
      case Fc:
        e = "Email";
        break;
      default:
        throw new Error("Unsupported GeneralName type");
    }
    let t = this.value;
    return this.type === To && (t = Bn.toString(t)), new rt(e, void 0, t);
  }
}
class zs extends Jn {
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
          const s = Z.parse(new $n(i.type, i.value).rawData, De);
          n.push(s);
        }
      t = new cr(n);
    } else if (J.isBufferSource(e))
      t = Z.parse(e, cr);
    else
      throw new Error("Cannot initialize GeneralNames. Incorrect incoming arguments");
    super(t);
  }
  onInit(e) {
    const t = [];
    for (const n of e) {
      let i = null;
      try {
        i = new $n(n);
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
zs.NAME = "GeneralNames";
const Ps = "-{5}", Gs = "\\n", $v = `[^${Gs}]+`, Mv = `${Ps}BEGIN (${$v}(?=${Ps}))${Ps}`, Vv = `${Ps}END \\1${Ps}`, Yi = "\\n", Lv = `[^:${Gs}]+`, Hv = `(?:[^${Gs}]+${Yi}(?: +[^${Gs}]+${Yi})*)`, Fv = "[a-zA-Z0-9=+/]+", zv = `(?:${Fv}${Yi})+`, td = `${Mv}${Yi}(?:((?:${Lv}: ${Hv})+))?${Yi}?(${zv})${Vv}`;
class gr {
  static isPem(e) {
    return typeof e == "string" && new RegExp(td, "g").test(e);
  }
  static decodeWithHeaders(e) {
    e = e.replace(/\r/g, "");
    const t = new RegExp(td, "g"), n = [];
    let i = null;
    for (; i = t.exec(e); ) {
      const s = i[3].replace(new RegExp(`[${Gs}]+`, "g"), ""), o = {
        type: i[1],
        headers: [],
        rawData: he.FromBase64(s)
      }, c = i[2];
      if (c) {
        const u = c.split(new RegExp(Yi, "g"));
        let h = null;
        for (const w of u) {
          const [x, q] = w.split(/:(.*)/);
          if (q === void 0) {
            if (!h)
              throw new Error("Cannot parse PEM string. Incorrect header value");
            h.value += x.trim();
          } else
            h && o.headers.push(h), h = { key: x, value: q.trim() };
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
        if (!J.isBufferSource(i))
          throw new TypeError("Cannot encode array of BufferSource in PEM format. Not all items of the array are BufferSource");
        n.push(this.encodeStruct({
          type: t,
          rawData: J.toArrayBuffer(i)
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
        rawData: J.toArrayBuffer(e)
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
    const s = he.ToBase64(e.rawData);
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
class Fr extends Jn {
  static isAsnEncoded(e) {
    return J.isBufferSource(e) || typeof e == "string";
  }
  static toArrayBuffer(e) {
    if (typeof e == "string") {
      if (gr.isPem(e))
        return gr.decode(e)[0];
      if (he.isHex(e))
        return he.FromHex(e);
      if (he.isBase64(e))
        return he.FromBase64(e);
      if (he.isBase64Url(e))
        return he.FromBase64Url(e);
      throw new TypeError("Unsupported format of 'raw' argument. Must be one of DER, PEM, HEX, Base64, or Base4Url");
    } else {
      const t = he.ToBinary(e);
      return gr.isPem(t) ? gr.decode(t)[0] : he.isHex(t) ? he.FromHex(t) : he.isBase64(t) ? he.FromBase64(t) : he.isBase64Url(t) ? he.FromBase64Url(t) : J.toArrayBuffer(e);
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
    if (Dn.isCryptoKey(e)) {
      if (e.type !== "public")
        throw new TypeError("Public key is required");
      const n = await t.subtle.exportKey("spki", e);
      return new sn(n);
    } else {
      if (e.publicKey)
        return e.publicKey;
      if (J.isBufferSource(e))
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
    const o = Z.parse(this.rawData, rn);
    return o.algorithm.algorithm === Ns && (s = Gv(o, s)), t.subtle.importKey("spki", s, i, !0, n);
  }
  onInit(e) {
    const t = lr.resolve(Wi), n = this.algorithm = t.toWebAlgorithm(e.algorithm);
    switch (e.algorithm.algorithm) {
      case gi: {
        const i = Z.parse(e.subjectPublicKey, hf), s = J.toUint8Array(i.modulus);
        n.publicExponent = J.toUint8Array(i.publicExponent), n.modulusLength = (s[0] ? s : s.slice(1)).byteLength << 3;
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
    const i = Z.parse(this.rawData, rn);
    return await t.subtle.digest(n, i.subjectPublicKey);
  }
  toTextObject() {
    const e = this.toTextObjectEmpty(), t = Z.parse(this.rawData, rn);
    switch (e.Algorithm = Gn.serializeAlgorithm(t.algorithm), t.algorithm.algorithm) {
      case Vs:
        e["EC Point"] = t.subjectPublicKey;
        break;
      case gi:
      default:
        e["Raw Data"] = t.subjectPublicKey;
    }
    return e;
  }
}
function Gv(r, e) {
  return r.algorithm = new oe({
    algorithm: gi,
    parameters: null
  }), e = Z.serialize(r), e;
}
class qs extends jr {
  static async create(e, t = !1, n = Zt.get()) {
    if ("name" in e && "serialNumber" in e)
      return new qs(e, t);
    const s = await (await sn.create(e, n)).getKeyIdentifier(n);
    return new qs(he.ToHex(s), t);
  }
  constructor(...e) {
    if (J.isBufferSource(e[0]))
      super(e[0]);
    else if (typeof e[0] == "string") {
      const t = new ni({ keyIdentifier: new zu(he.FromHex(e[0])) });
      super(qo, e[1], Z.serialize(t));
    } else {
      const t = e[0], n = t.name instanceof zs ? Z.parse(t.name.rawData, cr) : t.name, i = new ni({
        authorityCertIssuer: n,
        authorityCertSerialNumber: he.FromHex(t.serialNumber)
      });
      super(qo, e[1], Z.serialize(i));
    }
  }
  onInit(e) {
    super.onInit(e);
    const t = Z.parse(e.extnValue, ni);
    t.keyIdentifier && (this.keyId = he.ToHex(t.keyIdentifier)), (t.authorityCertIssuer || t.authorityCertSerialNumber) && (this.certId = {
      name: t.authorityCertIssuer || [],
      serialNumber: t.authorityCertSerialNumber ? he.ToHex(t.authorityCertSerialNumber) : ""
    });
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue(), t = Z.parse(this.value, ni);
    return t.authorityCertIssuer && (e["Authority Issuer"] = new zs(t.authorityCertIssuer).toTextObject()), t.authorityCertSerialNumber && (e["Authority Serial Number"] = t.authorityCertSerialNumber), t.keyIdentifier && (e[""] = t.keyIdentifier), e;
  }
}
qs.NAME = "Authority Key Identifier";
class l0 extends jr {
  constructor(...e) {
    if (J.isBufferSource(e[0])) {
      super(e[0]);
      const t = Z.parse(this.value, Ko);
      this.ca = t.cA, this.pathLength = t.pathLenConstraint;
    } else {
      const t = new Ko({
        cA: e[0],
        pathLenConstraint: e[1]
      });
      super(Bp, e[2], Z.serialize(t)), this.ca = e[0], this.pathLength = e[1];
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return this.ca && (e.CA = this.ca), this.pathLength !== void 0 && (e["Path Length"] = this.pathLength), e;
  }
}
l0.NAME = "Basic Constraints";
var rd;
(function(r) {
  r.serverAuth = "1.3.6.1.5.5.7.3.1", r.clientAuth = "1.3.6.1.5.5.7.3.2", r.codeSigning = "1.3.6.1.5.5.7.3.3", r.emailProtection = "1.3.6.1.5.5.7.3.4", r.timeStamping = "1.3.6.1.5.5.7.3.8", r.ocspSigning = "1.3.6.1.5.5.7.3.9";
})(rd || (rd = {}));
class u0 extends jr {
  constructor(...e) {
    if (J.isBufferSource(e[0])) {
      super(e[0]);
      const t = Z.parse(this.value, Jo);
      this.usages = t.map((n) => n);
    } else {
      const t = new Jo(e[0]);
      super(Np, e[1], Z.serialize(t)), this.usages = e[0];
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return e[""] = this.usages.map((t) => Bn.toString(t)).join(", "), e;
  }
}
u0.NAME = "Extended Key Usages";
var nd;
(function(r) {
  r[r.digitalSignature = 1] = "digitalSignature", r[r.nonRepudiation = 2] = "nonRepudiation", r[r.keyEncipherment = 4] = "keyEncipherment", r[r.dataEncipherment = 8] = "dataEncipherment", r[r.keyAgreement = 16] = "keyAgreement", r[r.keyCertSign = 32] = "keyCertSign", r[r.cRLSign = 64] = "cRLSign", r[r.encipherOnly = 128] = "encipherOnly", r[r.decipherOnly = 256] = "decipherOnly";
})(nd || (nd = {}));
class f0 extends jr {
  constructor(...e) {
    if (J.isBufferSource(e[0])) {
      super(e[0]);
      const t = Z.parse(this.value, Vc);
      this.usages = t.toNumber();
    } else {
      const t = new Vc(e[0]);
      super(Pp, e[1], Z.serialize(t)), this.usages = e[0];
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue(), t = Z.parse(this.value, Vc);
    return e[""] = t.toJSON().join(", "), e;
  }
}
f0.NAME = "Key Usages";
class Oc extends jr {
  static async create(e, t = !1, n = Zt.get()) {
    const s = await (await sn.create(e, n)).getKeyIdentifier(n);
    return new Oc(he.ToHex(s), t);
  }
  constructor(...e) {
    if (J.isBufferSource(e[0])) {
      super(e[0]);
      const t = Z.parse(this.value, Ln);
      this.keyId = he.ToHex(t);
    } else {
      const t = typeof e[0] == "string" ? he.FromHex(e[0]) : e[0], n = new Ln(t);
      super(Yu, e[1], Z.serialize(n)), this.keyId = he.ToHex(t);
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue(), t = Z.parse(this.value, Ln);
    return e[""] = t, e;
  }
}
Oc.NAME = "Subject Key Identifier";
class h0 extends jr {
  constructor(...e) {
    J.isBufferSource(e[0]) ? super(e[0]) : super(Wu, e[1], new zs(e[0] || []).rawData);
  }
  onInit(e) {
    super.onInit(e);
    const t = Z.parse(e.extnValue, Il);
    this.names = new zs(t);
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue(), t = this.names.toTextObject();
    for (const n in t)
      e[n] = t[n];
    return e;
  }
}
h0.NAME = "Subject Alternative Name";
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
class d0 extends jr {
  constructor(...e) {
    var t;
    if (J.isBufferSource(e[0])) {
      super(e[0]);
      const n = Z.parse(this.value, Wo);
      this.policies = n.map((i) => i.policyIdentifier);
    } else {
      const n = e[0], i = (t = e[1]) !== null && t !== void 0 ? t : !1, s = new Wo(n.map((o) => new oc({
        policyIdentifier: o
      })));
      super(Op, i, Z.serialize(s)), this.policies = n;
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return e.Policy = this.policies.map((t) => new rt("", {}, Bn.toString(t))), e;
  }
}
d0.NAME = "Certificate Policies";
Rr.register(Op, d0);
class p0 extends jr {
  constructor(...e) {
    var t;
    if (J.isBufferSource(e[0]))
      super(e[0]);
    else if (Array.isArray(e[0]) && typeof e[0][0] == "string") {
      const i = e[0].map((o) => new ss({
        distributionPoint: new fi({
          fullName: [new De({ uniformResourceIdentifier: o })]
        })
      })), s = new Ui(i);
      super(gl, e[1], Z.serialize(s));
    } else {
      const n = new Ui(e[0]);
      super(gl, e[1], Z.serialize(n));
    }
    (t = this.distributionPoints) !== null && t !== void 0 || (this.distributionPoints = []);
  }
  onInit(e) {
    super.onInit(e);
    const t = Z.parse(e.extnValue, Ui);
    this.distributionPoints = t;
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return e["Distribution Point"] = this.distributionPoints.map((t) => {
      var n;
      const i = {};
      return t.distributionPoint && (i[""] = (n = t.distributionPoint.fullName) === null || n === void 0 ? void 0 : n.map((s) => new $n(s).toString()).join(", ")), t.reasons && (i.Reasons = t.reasons.toString()), t.cRLIssuer && (i["CRL Issuer"] = t.cRLIssuer.map((s) => s.toString()).join(", ")), i;
    }), e;
  }
}
p0.NAME = "CRL Distribution Points";
class y0 extends jr {
  constructor(...e) {
    var t, n, i, s;
    if (J.isBufferSource(e[0]))
      super(e[0]);
    else if (e[0] instanceof Pi) {
      const o = new Pi(e[0]);
      super(fl, e[1], Z.serialize(o));
    } else {
      const o = e[0], c = new Pi();
      Po(c, o, Mf, "ocsp"), Po(c, o, Vf, "caIssuers"), Po(c, o, Lf, "timeStamping"), Po(c, o, Hf, "caRepository"), super(fl, e[1], Z.serialize(c));
    }
    (t = this.ocsp) !== null && t !== void 0 || (this.ocsp = []), (n = this.caIssuers) !== null && n !== void 0 || (this.caIssuers = []), (i = this.timeStamping) !== null && i !== void 0 || (this.timeStamping = []), (s = this.caRepository) !== null && s !== void 0 || (this.caRepository = []);
  }
  onInit(e) {
    super.onInit(e), this.ocsp = [], this.caIssuers = [], this.timeStamping = [], this.caRepository = [], Z.parse(e.extnValue, Pi).forEach((n) => {
      switch (n.accessMethod) {
        case Mf:
          this.ocsp.push(new $n(n.accessLocation));
          break;
        case Vf:
          this.caIssuers.push(new $n(n.accessLocation));
          break;
        case Lf:
          this.timeStamping.push(new $n(n.accessLocation));
          break;
        case Hf:
          this.caRepository.push(new $n(n.accessLocation));
          break;
      }
    });
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return this.ocsp.length && No(e, "OCSP", this.ocsp), this.caIssuers.length && No(e, "CA Issuers", this.caIssuers), this.timeStamping.length && No(e, "Time Stamping", this.timeStamping), this.caRepository.length && No(e, "CA Repository", this.caRepository), e;
  }
}
y0.NAME = "Authority Info Access";
function No(r, e, t) {
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
function Po(r, e, t, n) {
  const i = e[n];
  i && (Array.isArray(i) ? i : [i]).forEach((o) => {
    typeof o == "string" && (o = new $n("url", o)), r.push(new po({
      accessMethod: t,
      accessLocation: Z.parse(o.rawData, De)
    }));
  });
}
class us extends Jn {
  constructor(...e) {
    let t;
    if (J.isBufferSource(e[0]))
      t = J.toArrayBuffer(e[0]);
    else {
      const n = e[0], i = Array.isArray(e[1]) ? e[1].map((s) => J.toArrayBuffer(s)) : [];
      t = Z.serialize(new Sn({ type: n, values: i }));
    }
    super(t, Sn);
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
    return e[rt.NAME] === us.NAME && (e[rt.NAME] = Bn.toString(this.type)), e;
  }
}
us.NAME = "Attribute";
class g0 extends us {
  constructor(...e) {
    var t;
    if (J.isBufferSource(e[0]))
      super(e[0]);
    else {
      const n = new ba({
        printableString: e[0]
      });
      super(n0, [Z.serialize(n)]);
    }
    (t = this.password) !== null && t !== void 0 || (this.password = "");
  }
  onInit(e) {
    if (super.onInit(e), this.values[0]) {
      const t = Z.parse(this.values[0], ba);
      this.password = t.toString();
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return e[rt.VALUE] = this.password, e;
  }
}
g0.NAME = "Challenge Password";
class gf extends us {
  constructor(...e) {
    var t;
    if (J.isBufferSource(e[0]))
      super(e[0]);
    else {
      const n = e[0], i = new hi();
      for (const s of n)
        i.push(Z.parse(s.rawData, Hr));
      super(yf, [Z.serialize(i)]);
    }
    (t = this.items) !== null && t !== void 0 || (this.items = []);
  }
  onInit(e) {
    if (super.onInit(e), this.values[0]) {
      const t = Z.parse(this.values[0], hi);
      this.items = t.map((n) => Rr.create(Z.serialize(n)));
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue(), t = this.items.map((n) => n.toTextObject());
    for (const n of t)
      e[n[rt.NAME]] = n;
    return e;
  }
}
gf.NAME = "Extensions";
class Tc {
  static register(e, t) {
    this.items.set(e, t);
  }
  static create(e) {
    const t = new us(e), n = this.items.get(t.type);
    return n ? new n(e) : t;
  }
}
Tc.items = /* @__PURE__ */ new Map();
const Nc = "crypto.signatureFormatter";
class qv {
  toAsnSignature(e, t) {
    return J.toArrayBuffer(t);
  }
  toWebSignature(e, t) {
    return J.toArrayBuffer(t);
  }
}
var Mo;
let vu = Mo = class {
  static createPssParams(e, t) {
    const n = Mo.getHashAlgorithm(e);
    return n ? new mi({
      hashAlgorithm: n,
      maskGenAlgorithm: new oe({
        algorithm: xc,
        parameters: Z.serialize(n)
      }),
      saltLength: t
    }) : null;
  }
  static getHashAlgorithm(e) {
    const t = lr.resolve(Wi);
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
              return new oe({ algorithm: ua, parameters: null });
            case "sha-256":
              return new oe({ algorithm: Zl, parameters: null });
            case "sha-384":
              return new oe({ algorithm: fa, parameters: null });
            case "sha-512":
              return new oe({ algorithm: ha, parameters: null });
          }
        } else
          return new oe({ algorithm: gi, parameters: null });
        break;
      case "rsa-pss":
        if ("hash" in e) {
          if (!("saltLength" in e && typeof e.saltLength == "number"))
            throw new Error("Cannot get 'saltLength' from 'alg' argument");
          const t = Mo.createPssParams(e.hash, e.saltLength);
          if (!t)
            throw new Error("Cannot create PSS parameters");
          return new oe({ algorithm: Ns, parameters: Z.serialize(t) });
        } else
          return new oe({ algorithm: Ns, parameters: null });
    }
    return null;
  }
  toWebAlgorithm(e) {
    switch (e.algorithm) {
      case gi:
        return { name: "RSASSA-PKCS1-v1_5" };
      case ua:
        return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-1" } };
      case Zl:
        return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } };
      case fa:
        return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-384" } };
      case ha:
        return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-512" } };
      case Ns:
        if (e.parameters) {
          const t = Z.parse(e.parameters, mi);
          return {
            name: "RSA-PSS",
            hash: lr.resolve(Wi).toWebAlgorithm(t.hashAlgorithm),
            saltLength: t.saltLength
          };
        } else
          return { name: "RSA-PSS" };
    }
    return null;
  }
};
vu = Mo = f([
  Ec()
], vu);
lr.registerSingleton(Eo, vu);
let mu = class {
  toAsnAlgorithm(e) {
    switch (e.name.toLowerCase()) {
      case "sha-1":
        return new oe({ algorithm: da });
      case "sha-256":
        return new oe({ algorithm: pa });
      case "sha-384":
        return new oe({ algorithm: ya });
      case "sha-512":
        return new oe({ algorithm: ga });
    }
    return null;
  }
  toWebAlgorithm(e) {
    switch (e.algorithm) {
      case da:
        return { name: "SHA-1" };
      case pa:
        return { name: "SHA-256" };
      case ya:
        return { name: "SHA-384" };
      case ga:
        return { name: "SHA-512" };
    }
    return null;
  }
};
mu = f([
  Ec()
], mu);
lr.registerSingleton(Eo, mu);
class Tr {
  addPadding(e, t) {
    const n = J.toUint8Array(t), i = new Uint8Array(e);
    return i.set(n, e - n.length), i;
  }
  removePadding(e, t = !1) {
    let n = J.toUint8Array(e);
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
      const n = e.namedCurve, i = Tr.namedCurveSize.get(n) || Tr.defaultNamedCurveSize, s = new la(), o = J.toUint8Array(t);
      return s.r = this.removePadding(o.slice(0, i), !0), s.s = this.removePadding(o.slice(i, i + i), !0), Z.serialize(s);
    }
    return null;
  }
  toWebSignature(e, t) {
    if (e.name === "ECDSA") {
      const n = Z.parse(t, la), i = e.namedCurve, s = Tr.namedCurveSize.get(i) || Tr.defaultNamedCurveSize, o = this.addPadding(s, this.removePadding(n.r)), c = this.addPadding(s, this.removePadding(n.s));
      return sg(o, c);
    }
    return null;
  }
}
Tr.namedCurveSize = /* @__PURE__ */ new Map();
Tr.defaultNamedCurveSize = 32;
const Zc = "1.3.101.110", id = "1.3.101.111", Wc = "1.3.101.112", sd = "1.3.101.113";
let wu = class {
  toAsnAlgorithm(e) {
    let t = null;
    switch (e.name.toLowerCase()) {
      case "ed25519":
        t = Wc;
        break;
      case "x25519":
        t = Zc;
        break;
      case "eddsa":
        switch (e.namedCurve.toLowerCase()) {
          case "ed25519":
            t = Wc;
            break;
          case "ed448":
            t = sd;
            break;
        }
        break;
      case "ecdh-es":
        switch (e.namedCurve.toLowerCase()) {
          case "x25519":
            t = Zc;
            break;
          case "x448":
            t = id;
            break;
        }
    }
    return t ? new oe({
      algorithm: t
    }) : null;
  }
  toWebAlgorithm(e) {
    switch (e.algorithm) {
      case Wc:
        return { name: "Ed25519" };
      case sd:
        return { name: "EdDSA", namedCurve: "Ed448" };
      case Zc:
        return { name: "X25519" };
      case id:
        return { name: "ECDH-ES", namedCurve: "X448" };
    }
    return null;
  }
};
wu = f([
  Ec()
], wu);
lr.registerSingleton(Eo, wu);
class Kv extends Fr {
  constructor(e) {
    Fr.isAsnEncoded(e) ? super(e, Hs) : super(e), this.tag = gr.CertificateRequestTag;
  }
  onInit(e) {
    this.tbs = Z.serialize(e.certificationRequestInfo), this.publicKey = new sn(e.certificationRequestInfo.subjectPKInfo);
    const t = lr.resolve(Wi);
    this.signatureAlgorithm = t.toWebAlgorithm(e.signatureAlgorithm), this.signature = e.signature, this.attributes = e.certificationRequestInfo.attributes.map((i) => Tc.create(Z.serialize(i)));
    const n = this.getAttribute(yf);
    this.extensions = [], n instanceof gf && (this.extensions = n.items), this.subjectName = new Hn(e.certificationRequestInfo.subject), this.subject = this.subjectName.toString();
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
    const t = { ...this.publicKey.algorithm, ...this.signatureAlgorithm }, n = await this.publicKey.export(t, ["verify"], e), i = lr.resolveAll(Nc).reverse();
    let s = null;
    for (const c of i)
      if (s = c.toWebSignature(t, this.signature), s)
        break;
    if (!s)
      throw Error("Cannot convert WebCrypto signature value to ASN.1 format");
    return await e.subtle.verify(this.signatureAlgorithm, n, s, this.tbs);
  }
  toTextObject() {
    const e = this.toTextObjectEmpty(), t = Z.parse(this.rawData, Hs), n = t.certificationRequestInfo, i = new rt("", {
      Version: `${Li[n.version]} (${n.version})`,
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
      Algorithm: Gn.serializeAlgorithm(t.signatureAlgorithm),
      "": t.signature
    }), e;
  }
}
Kv.NAME = "PKCS#10 Certificate Request";
class wi extends Fr {
  constructor(e) {
    Fr.isAsnEncoded(e) ? super(e, di) : super(e), this.tag = gr.CertificateTag;
  }
  onInit(e) {
    const t = e.tbsCertificate;
    this.tbs = Z.serialize(t), this.serialNumber = he.ToHex(t.serialNumber), this.subjectName = new Hn(t.subject), this.subject = new Hn(t.subject).toString(), this.issuerName = new Hn(t.issuer), this.issuer = this.issuerName.toString();
    const n = lr.resolve(Wi);
    this.signatureAlgorithm = n.toWebAlgorithm(e.signatureAlgorithm), this.signature = e.signatureValue;
    const i = t.validity.notBefore.utcTime || t.validity.notBefore.generalTime;
    if (!i)
      throw new Error("Cannot get 'notBefore' value");
    this.notBefore = i;
    const s = t.validity.notAfter.utcTime || t.validity.notAfter.generalTime;
    if (!s)
      throw new Error("Cannot get 'notAfter' value");
    this.notAfter = s, this.extensions = [], t.extensions && (this.extensions = t.extensions.map((o) => Rr.create(Z.serialize(o)))), this.publicKey = new sn(t.subjectPublicKeyInfo);
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
      else if (J.isBufferSource(s)) {
        const h = new sn(s);
        n = { ...h.algorithm, ...this.signatureAlgorithm }, i = await h.export(n, ["verify"], t);
      } else
        n = { ...s.algorithm, ...this.signatureAlgorithm }, i = s;
    } catch {
      return !1;
    }
    const o = lr.resolveAll(Nc).reverse();
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
      const w = (e.date || /* @__PURE__ */ new Date()).getTime();
      return u && this.notBefore.getTime() < w && w < this.notAfter.getTime();
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
    const e = this.toTextObjectEmpty(), t = Z.parse(this.rawData, di), n = t.tbsCertificate, i = new rt("", {
      Version: `${Li[n.version]} (${n.version})`,
      "Serial Number": n.serialNumber,
      "Signature Algorithm": Gn.serializeAlgorithm(n.signature),
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
      Algorithm: Gn.serializeAlgorithm(t.signatureAlgorithm),
      "": t.signatureValue
    }), e;
  }
}
wi.NAME = "Certificate";
class Zv extends Array {
  constructor(e) {
    if (super(), Fr.isAsnEncoded(e))
      this.import(e);
    else if (e instanceof wi)
      this.push(e);
    else if (Array.isArray(e))
      for (const t of e)
        this.push(t);
  }
  export(e) {
    const t = new xn();
    t.version = 1, t.encapContentInfo.eContentType = ev, t.encapContentInfo.eContent = new Gi({
      single: new nt()
    }), t.certificates = new $s(this.map((s) => new pi({
      certificate: Z.parse(s.rawData, di)
    })));
    const n = new bn({
      contentType: Gl,
      content: Z.serialize(t)
    }), i = Z.serialize(n);
    return e === "raw" ? i : this.toString(e);
  }
  import(e) {
    const t = Fr.toArrayBuffer(e), n = Z.parse(t, bn);
    if (n.contentType !== Gl)
      throw new TypeError("Cannot parse CMS package. Incoming data is not a SignedData object.");
    const i = Z.parse(n.content, xn);
    this.clear();
    for (const s of i.certificates || [])
      s.certificate && this.push(new wi(s.certificate));
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
        return Z.toString(t);
      case "hex":
        return he.ToHex(t);
      case "base64":
        return he.ToBase64(t);
      case "base64url":
        return he.ToBase64Url(t);
      case "text":
        return Gn.serialize(this.toTextObject());
      default:
        throw TypeError("Argument 'format' is unsupported value");
    }
  }
  toTextObject() {
    const e = Z.parse(this.export("raw"), bn), t = Z.parse(e.content, xn);
    return new rt("X509Certificates", {
      "Content Type": Bn.toString(e.contentType),
      Content: new rt("", {
        Version: `${an[t.version]} (${t.version})`,
        Certificates: new rt("", { Certificate: this.map((i) => i.toTextObject()) })
      })
    });
  }
}
class Wv {
  constructor(e = {}) {
    this.certificates = [], e.certificates && (this.certificates = e.certificates);
  }
  async build(e, t = Zt.get()) {
    const n = new Zv(e);
    let i = e;
    for (; i = await this.findIssuer(i, t); ) {
      const s = await i.getThumbprint(t);
      for (const o of n) {
        const c = await o.getThumbprint(t);
        if (Ho(s, c))
          throw new Error("Cannot build a certificate chain. Circular dependency.");
      }
      n.push(i);
    }
    return n;
  }
  async findIssuer(e, t = Zt.get()) {
    if (!await e.isSelfSigned(t)) {
      const n = e.getExtension(qo);
      for (const i of this.certificates)
        if (i.subject === e.issuer) {
          if (n) {
            if (n.keyId) {
              const s = i.getExtension(Yu);
              if (s && s.keyId !== n.keyId)
                continue;
            } else if (n.certId) {
              const s = i.getExtension(Wu);
              if (s && !(n.certId.serialNumber === i.serialNumber && Ho(Z.serialize(n.certId.name), Z.serialize(s))))
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
var od;
(function(r) {
  r[r.unspecified = 0] = "unspecified", r[r.keyCompromise = 1] = "keyCompromise", r[r.cACompromise = 2] = "cACompromise", r[r.affiliationChanged = 3] = "affiliationChanged", r[r.superseded = 4] = "superseded", r[r.cessationOfOperation = 5] = "cessationOfOperation", r[r.certificateHold = 6] = "certificateHold", r[r.removeFromCRL = 8] = "removeFromCRL", r[r.privilegeWithdrawn = 9] = "privilegeWithdrawn", r[r.aACompromise = 10] = "aACompromise";
})(od || (od = {}));
Rr.register(Bp, l0);
Rr.register(Np, u0);
Rr.register(Pp, f0);
Rr.register(Yu, Oc);
Rr.register(qo, qs);
Rr.register(Wu, h0);
Rr.register(gl, p0);
Rr.register(fl, y0);
Tc.register(n0, g0);
Tc.register(yf, gf);
lr.registerSingleton(Nc, qv);
lr.registerSingleton(Nc, Tr);
Tr.namedCurveSize.set("P-256", 32);
Tr.namedCurveSize.set("K-256", 32);
Tr.namedCurveSize.set("P-384", 48);
Tr.namedCurveSize.set("P-521", 66);
const me = { POS_INT: 0, NEG_INT: 1, BYTE_STRING: 2, UTF8_STRING: 3, ARRAY: 4, MAP: 5, TAG: 6, SIMPLE_FLOAT: 7 }, _t = { DATE_STRING: 0, DATE_EPOCH: 1, POS_BIGINT: 2, NEG_BIGINT: 3, DECIMAL_FRAC: 4, BIGFLOAT: 5, BASE64URL_EXPECTED: 21, BASE64_EXPECTED: 22, BASE16_EXPECTED: 23, CBOR: 24, URI: 32, BASE64URL: 33, BASE64: 34, MIME: 36, SET: 258, JSON: 262, REGEXP: 21066, SELF_DESCRIBED: 55799, INVALID_16: 65535, INVALID_32: 4294967295, INVALID_64: 0xffffffffffffffffn }, wt = { ZERO: 0, ONE: 24, TWO: 25, FOUR: 26, EIGHT: 27, INDEFINITE: 31 }, Mn = { FALSE: 20, TRUE: 21, NULL: 22, UNDEFINED: 23 };
var Es;
let Er = (Es = class {
}, Le(Es, "BREAK", Symbol.for("github.com/hildjj/cbor2/break")), Le(Es, "ENCODED", Symbol.for("github.com/hildjj/cbor2/cbor-encoded")), Le(Es, "LENGTH", Symbol.for("github.com/hildjj/cbor2/length")), Es);
const Aa = { MIN: -(2n ** 63n), MAX: 2n ** 64n - 1n };
var vn, Qr;
let We = (vn = class {
  constructor(e, t = void 0) {
    Le(this, "tag");
    Le(this, "contents");
    this.tag = e, this.contents = t;
  }
  get noChildren() {
    var e;
    return !!((e = $(vn, Qr).get(this.tag)) != null && e.noChildren);
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
    const t = $(vn, Qr).get(this.tag);
    return t ? t(this, e) : this;
  }
  comment(e, t) {
    const n = $(vn, Qr).get(this.tag);
    if (n != null && n.comment) return n.comment(this, e, t);
  }
  toCBOR() {
    return [this.tag, this.contents];
  }
  [Symbol.for("nodejs.util.inspect.custom")](e, t, n) {
    return `${this.tag}(${n(this.contents, t)})`;
  }
}, Qr = new WeakMap(), rr(vn, Qr, /* @__PURE__ */ new Map()), vn);
function Sa(r) {
  if (r != null && typeof r == "object") return r[Er.ENCODED];
}
function Yv(r) {
  if (r != null && typeof r == "object") return r[Er.LENGTH];
}
function Ks(r, e) {
  Object.defineProperty(r, Er.ENCODED, { configurable: !0, enumerable: !1, value: e });
}
function Is(r, e) {
  const t = Object(r);
  return Ks(t, e), t;
}
function v0(r) {
  let e = Math.ceil(r.length / 2);
  const t = new Uint8Array(e);
  e--;
  for (let n = r.length, i = n - 2; n >= 0; n = i, i -= 2, e--) t[e] = parseInt(r.substring(i, n), 16);
  return t;
}
function Vr(r) {
  return r.reduce((e, t) => e + t.toString(16).padStart(2, "0"), "");
}
function Jv(r) {
  const e = r.reduce((i, s) => i + s.length, 0), t = new Uint8Array(e);
  let n = 0;
  for (const i of r) t.set(i, n), n += i.length;
  return t;
}
function vf(r) {
  const e = atob(r);
  return Uint8Array.from(e, (t) => t.codePointAt(0));
}
const Xv = { "-": "+", _: "/" };
function Qv(r) {
  const e = r.replace(/[_-]/g, (t) => Xv[t]);
  return vf(e.padEnd(Math.ceil(e.length / 4) * 4, "="));
}
function em() {
  const r = new Uint8Array(4), e = new Uint32Array(r.buffer);
  return !((e[0] = 1) & r[0]);
}
function ad(r) {
  var t;
  let e = "";
  for (const n of r) {
    const i = (t = n.codePointAt(0)) == null ? void 0 : t.toString(16).padStart(4, "0");
    e && (e += ", "), e += `U+${i}`;
  }
  return e;
}
function m0(r, e) {
  const [t, n, i] = r, [s, o, c] = e, u = Math.min(i.length, c.length);
  for (let h = 0; h < u; h++) {
    const w = i[h] - c[h];
    if (w !== 0) return w;
  }
  return 0;
}
var Rn, qt, pr, Mt, Un, Qe, Qn, Vo, bu, Jr, Xr;
const $a = class $a {
  constructor(e = {}) {
    rr(this, Qe);
    rr(this, Rn);
    rr(this, qt, []);
    rr(this, pr, null);
    rr(this, Mt, 0);
    rr(this, Un, 0);
    if (It(this, Rn, { ...$a.defaultOptions, ...e }), $(this, Rn).chunkSize < 8) throw new RangeError(`Expected size >= 8, got ${$(this, Rn).chunkSize}`);
    Ue(this, Qe, Qn).call(this);
  }
  get length() {
    return $(this, Un);
  }
  read() {
    Ue(this, Qe, Vo).call(this);
    const e = new Uint8Array($(this, Un));
    let t = 0;
    for (const n of $(this, qt)) e.set(n, t), t += n.length;
    return Ue(this, Qe, Qn).call(this), e;
  }
  write(e) {
    const t = e.length;
    t > Ue(this, Qe, bu).call(this) ? (Ue(this, Qe, Vo).call(this), t > $(this, Rn).chunkSize ? ($(this, qt).push(e), Ue(this, Qe, Qn).call(this)) : (Ue(this, Qe, Qn).call(this), $(this, qt)[$(this, qt).length - 1].set(e), It(this, Mt, t))) : ($(this, qt)[$(this, qt).length - 1].set(e, $(this, Mt)), It(this, Mt, $(this, Mt) + t)), It(this, Un, $(this, Un) + t);
  }
  writeUint8(e) {
    Ue(this, Qe, Jr).call(this, 1), $(this, pr).setUint8($(this, Mt), e), Ue(this, Qe, Xr).call(this, 1);
  }
  writeUint16(e, t = !1) {
    Ue(this, Qe, Jr).call(this, 2), $(this, pr).setUint16($(this, Mt), e, t), Ue(this, Qe, Xr).call(this, 2);
  }
  writeUint32(e, t = !1) {
    Ue(this, Qe, Jr).call(this, 4), $(this, pr).setUint32($(this, Mt), e, t), Ue(this, Qe, Xr).call(this, 4);
  }
  writeBigUint64(e, t = !1) {
    Ue(this, Qe, Jr).call(this, 8), $(this, pr).setBigUint64($(this, Mt), e, t), Ue(this, Qe, Xr).call(this, 8);
  }
  writeInt16(e, t = !1) {
    Ue(this, Qe, Jr).call(this, 2), $(this, pr).setInt16($(this, Mt), e, t), Ue(this, Qe, Xr).call(this, 2);
  }
  writeInt32(e, t = !1) {
    Ue(this, Qe, Jr).call(this, 4), $(this, pr).setInt32($(this, Mt), e, t), Ue(this, Qe, Xr).call(this, 4);
  }
  writeBigInt64(e, t = !1) {
    Ue(this, Qe, Jr).call(this, 8), $(this, pr).setBigInt64($(this, Mt), e, t), Ue(this, Qe, Xr).call(this, 8);
  }
  writeFloat32(e, t = !1) {
    Ue(this, Qe, Jr).call(this, 4), $(this, pr).setFloat32($(this, Mt), e, t), Ue(this, Qe, Xr).call(this, 4);
  }
  writeFloat64(e, t = !1) {
    Ue(this, Qe, Jr).call(this, 8), $(this, pr).setFloat64($(this, Mt), e, t), Ue(this, Qe, Xr).call(this, 8);
  }
  clear() {
    It(this, Un, 0), It(this, qt, []), Ue(this, Qe, Qn).call(this);
  }
};
Rn = new WeakMap(), qt = new WeakMap(), pr = new WeakMap(), Mt = new WeakMap(), Un = new WeakMap(), Qe = new WeakSet(), Qn = function() {
  const e = new Uint8Array($(this, Rn).chunkSize);
  $(this, qt).push(e), It(this, Mt, 0), It(this, pr, new DataView(e.buffer, e.byteOffset, e.byteLength));
}, Vo = function() {
  if ($(this, Mt) === 0) {
    $(this, qt).pop();
    return;
  }
  const e = $(this, qt).length - 1;
  $(this, qt)[e] = $(this, qt)[e].subarray(0, $(this, Mt)), It(this, Mt, 0), It(this, pr, null);
}, bu = function() {
  const e = $(this, qt).length - 1;
  return $(this, qt)[e].length - $(this, Mt);
}, Jr = function(e) {
  Ue(this, Qe, bu).call(this) < e && (Ue(this, Qe, Vo).call(this), Ue(this, Qe, Qn).call(this));
}, Xr = function(e) {
  It(this, Mt, $(this, Mt) + e), It(this, Un, $(this, Un) + e);
}, Le($a, "defaultOptions", { chunkSize: 4096 });
let _a = $a;
function w0(r, e = 0, t = !1) {
  const n = r[e] & 128 ? -1 : 1, i = (r[e] & 124) >> 2, s = (r[e] & 3) << 8 | r[e + 1];
  if (i === 0) {
    if (t && s !== 0) throw new Error(`Unwanted subnormal: ${n * 5960464477539063e-23 * s}`);
    return n * 5960464477539063e-23 * s;
  } else if (i === 31) return s ? NaN : n * (1 / 0);
  return n * 2 ** (i - 25) * (1024 + s);
}
function tm(r) {
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
function rm(r) {
  if (r !== 0) {
    const e = new ArrayBuffer(8), t = new DataView(e);
    t.setFloat64(0, r, !1);
    const n = t.getBigUint64(0, !1);
    if ((n & 0x7ff0000000000000n) === 0n) return n & 0x8000000000000000n ? -0 : 0;
  }
  return r;
}
function nm(r) {
  switch (r.length) {
    case 2:
      w0(r, 0, !0);
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
const cd = me.SIMPLE_FLOAT << 5 | wt.TWO, im = me.SIMPLE_FLOAT << 5 | wt.FOUR, sm = me.SIMPLE_FLOAT << 5 | wt.EIGHT, om = me.SIMPLE_FLOAT << 5 | Mn.TRUE, am = me.SIMPLE_FLOAT << 5 | Mn.FALSE, cm = me.SIMPLE_FLOAT << 5 | Mn.UNDEFINED, lm = me.SIMPLE_FLOAT << 5 | Mn.NULL, um = new TextEncoder(), fm = { ..._a.defaultOptions, avoidInts: !1, cde: !1, collapseBigInts: !0, dcbor: !1, float64: !1, flushToZero: !1, forceEndian: null, ignoreOriginalEncoding: !1, largeNegativeAsBigInt: !1, reduceUnsafeNumbers: !1, rejectBigInts: !1, rejectCustomSimples: !1, rejectDuplicateKeys: !1, rejectFloats: !1, rejectUndefined: !1, simplifyNegativeZero: !1, sortKeys: null, stringNormalization: null }, b0 = { cde: !0, ignoreOriginalEncoding: !0, sortKeys: m0 }, hm = { ...b0, dcbor: !0, largeNegativeAsBigInt: !0, reduceUnsafeNumbers: !0, rejectCustomSimples: !0, rejectDuplicateKeys: !0, rejectUndefined: !0, simplifyNegativeZero: !0, stringNormalization: "NFC" };
function x0(r) {
  const e = r < 0;
  return typeof r == "bigint" ? [e ? -r - 1n : r, e] : [e ? -r - 1 : r, e];
}
function Yc(r, e, t) {
  if (t.rejectFloats) throw new Error(`Attempt to encode an unwanted floating point number: ${r}`);
  if (isNaN(r)) e.writeUint8(cd), e.writeUint16(32256);
  else if (!t.float64 && Math.fround(r) === r) {
    const n = tm(r);
    n === null ? (e.writeUint8(im), e.writeFloat32(r)) : (e.writeUint8(cd), e.writeUint16(n));
  } else e.writeUint8(sm), e.writeFloat64(r);
}
function zr(r, e, t) {
  const [n, i] = x0(r);
  if (i && t) throw new TypeError(`Negative size: ${r}`);
  t ?? (t = i ? me.NEG_INT : me.POS_INT), t <<= 5, n < 24 ? e.writeUint8(t | n) : n <= 255 ? (e.writeUint8(t | wt.ONE), e.writeUint8(n)) : n <= 65535 ? (e.writeUint8(t | wt.TWO), e.writeUint16(n)) : n <= 4294967295 ? (e.writeUint8(t | wt.FOUR), e.writeUint32(n)) : (e.writeUint8(t | wt.EIGHT), e.writeBigUint64(BigInt(n)));
}
function Ea(r, e, t) {
  typeof r == "number" ? zr(r, e, me.TAG) : typeof r == "object" && !t.ignoreOriginalEncoding && Er.ENCODED in r ? e.write(r[Er.ENCODED]) : r <= Number.MAX_SAFE_INTEGER ? zr(Number(r), e, me.TAG) : (e.writeUint8(me.TAG << 5 | wt.EIGHT), e.writeBigUint64(BigInt(r)));
}
function A0(r, e, t) {
  const [n, i] = x0(r);
  if (t.collapseBigInts && (!t.largeNegativeAsBigInt || r >= -0x8000000000000000n)) {
    if (n <= 0xffffffffn) {
      zr(Number(r), e);
      return;
    }
    if (n <= 0xffffffffffffffffn) {
      const h = (i ? me.NEG_INT : me.POS_INT) << 5;
      e.writeUint8(h | wt.EIGHT), e.writeBigUint64(n);
      return;
    }
  }
  if (t.rejectBigInts) throw new Error(`Attempt to encode unwanted bigint: ${r}`);
  const s = i ? _t.NEG_BIGINT : _t.POS_BIGINT, o = n.toString(16), c = o.length % 2 ? "0" : "";
  Ea(s, e, t);
  const u = v0(c + o);
  zr(u.length, e, me.BYTE_STRING), e.write(u);
}
function dm(r, e, t) {
  t.flushToZero && (r = rm(r)), Object.is(r, -0) ? t.simplifyNegativeZero ? t.avoidInts ? Yc(0, e, t) : zr(0, e) : Yc(r, e, t) : !t.avoidInts && Number.isSafeInteger(r) ? zr(r, e) : t.reduceUnsafeNumbers && Math.floor(r) === r && r >= Aa.MIN && r <= Aa.MAX ? A0(BigInt(r), e, t) : Yc(r, e, t);
}
function pm(r, e, t) {
  const n = t.stringNormalization ? r.normalize(t.stringNormalization) : r, i = um.encode(n);
  zr(i.length, e, me.UTF8_STRING), e.write(i);
}
function ym(r, e, t) {
  const n = r;
  mf(n, n.length, me.ARRAY, e, t);
  for (const i of n) ii(i, e, t);
}
function gm(r, e) {
  const t = r;
  zr(t.length, e, me.BYTE_STRING), e.write(t);
}
const xu = /* @__PURE__ */ new Map([[Array, ym], [Uint8Array, gm]]);
function Rt(r, e) {
  const t = xu.get(r);
  return xu.set(r, e), t;
}
function mf(r, e, t, n, i) {
  const s = Yv(r);
  s && !i.ignoreOriginalEncoding ? n.write(s) : zr(e, n, t);
}
function vm(r, e, t) {
  if (r === null) {
    e.writeUint8(lm);
    return;
  }
  if (!t.ignoreOriginalEncoding && Er.ENCODED in r) {
    e.write(r[Er.ENCODED]);
    return;
  }
  const n = xu.get(r.constructor);
  if (n) {
    const s = n(r, e, t);
    s && ((typeof s[0] == "bigint" || isFinite(Number(s[0]))) && Ea(s[0], e, t), ii(s[1], e, t));
    return;
  }
  if (typeof r.toCBOR == "function") {
    const s = r.toCBOR(e, t);
    s && ((typeof s[0] == "bigint" || isFinite(Number(s[0]))) && Ea(s[0], e, t), ii(s[1], e, t));
    return;
  }
  if (typeof r.toJSON == "function") {
    ii(r.toJSON(), e, t);
    return;
  }
  const i = Object.entries(r).map((s) => [s[0], s[1], Pc(s[0], t)]);
  t.sortKeys && i.sort(t.sortKeys), mf(r, i.length, me.MAP, e, t);
  for (const [s, o, c] of i) e.write(c), ii(o, e, t);
}
function ii(r, e, t) {
  switch (typeof r) {
    case "number":
      dm(r, e, t);
      break;
    case "bigint":
      A0(r, e, t);
      break;
    case "string":
      pm(r, e, t);
      break;
    case "boolean":
      e.writeUint8(r ? om : am);
      break;
    case "undefined":
      if (t.rejectUndefined) throw new Error("Attempt to encode unwanted undefined.");
      e.writeUint8(cm);
      break;
    case "object":
      vm(r, e, t);
      break;
    case "symbol":
      throw new TypeError(`Unknown symbol: ${r.toString()}`);
    default:
      throw new TypeError(`Unknown type: ${typeof r}, ${String(r)}`);
  }
}
function Pc(r, e = {}) {
  const t = { ...fm };
  e.dcbor ? Object.assign(t, hm) : e.cde && Object.assign(t, b0), Object.assign(t, e);
  const n = new _a(t);
  return ii(r, n, t), n.read();
}
var S0 = ((r) => (r[r.NEVER = -1] = "NEVER", r[r.PREFERRED = 0] = "PREFERRED", r[r.ALWAYS = 1] = "ALWAYS", r))(S0 || {});
const Tn = class Tn {
  constructor(e) {
    Le(this, "value");
    this.value = e;
  }
  static create(e) {
    return Tn.KnownSimple.has(e) ? Tn.KnownSimple.get(e) : new Tn(e);
  }
  toCBOR(e, t) {
    if (t.rejectCustomSimples) throw new Error(`Cannot encode non-standard Simple value: ${this.value}`);
    zr(this.value, e, me.SIMPLE_FLOAT);
  }
  toString() {
    return `simple(${this.value})`;
  }
  decode() {
    return Tn.KnownSimple.has(this.value) ? Tn.KnownSimple.get(this.value) : this;
  }
  [Symbol.for("nodejs.util.inspect.custom")](e, t, n) {
    return `simple(${n(this.value, t)})`;
  }
};
Le(Tn, "KnownSimple", /* @__PURE__ */ new Map([[Mn.FALSE, !1], [Mn.TRUE, !0], [Mn.NULL, null], [Mn.UNDEFINED, void 0]]));
let Zs = Tn;
const mm = new TextDecoder("utf8", { fatal: !0, ignoreBOM: !0 });
var Ar, $r, Kt, kr, Wt, ei, Au, ks;
const Ma = class Ma {
  constructor(e, t) {
    rr(this, Wt);
    rr(this, Ar);
    rr(this, $r);
    rr(this, Kt, 0);
    rr(this, kr);
    if (It(this, kr, { ...Ma.defaultOptions, ...t }), typeof e == "string") switch ($(this, kr).encoding) {
      case "hex":
        It(this, Ar, v0(e));
        break;
      case "base64":
        It(this, Ar, vf(e));
        break;
      default:
        throw new TypeError(`Encoding not implemented: "${$(this, kr).encoding}"`);
    }
    else It(this, Ar, e);
    It(this, $r, new DataView($(this, Ar).buffer, $(this, Ar).byteOffset, $(this, Ar).byteLength));
  }
  toHere(e) {
    return $(this, Ar).subarray(e, $(this, Kt));
  }
  *[Symbol.iterator]() {
    if (yield* Ue(this, Wt, ei).call(this, 0), $(this, Kt) !== $(this, Ar).length) throw new Error("Extra data in input");
  }
};
Ar = new WeakMap(), $r = new WeakMap(), Kt = new WeakMap(), kr = new WeakMap(), Wt = new WeakSet(), ei = function* (e) {
  if (e++ > $(this, kr).maxDepth) throw new Error(`Maximum depth ${$(this, kr).maxDepth} exceeded`);
  const t = $(this, Kt), n = $(this, $r).getUint8(Ef(this, Kt)._++), i = n >> 5, s = n & 31;
  let o = s, c = !1, u = 0;
  switch (s) {
    case wt.ONE:
      if (u = 1, o = $(this, $r).getUint8($(this, Kt)), i === me.SIMPLE_FLOAT) {
        if (o < 32) throw new Error(`Invalid simple encoding in extra byte: ${o}`);
        c = !0;
      } else if ($(this, kr).requirePreferred && o < 24) throw new Error(`Unexpectedly long integer encoding (1) for ${o}`);
      break;
    case wt.TWO:
      if (u = 2, i === me.SIMPLE_FLOAT) o = w0($(this, Ar), $(this, Kt));
      else if (o = $(this, $r).getUint16($(this, Kt), !1), $(this, kr).requirePreferred && o <= 255) throw new Error(`Unexpectedly long integer encoding (2) for ${o}`);
      break;
    case wt.FOUR:
      if (u = 4, i === me.SIMPLE_FLOAT) o = $(this, $r).getFloat32($(this, Kt), !1);
      else if (o = $(this, $r).getUint32($(this, Kt), !1), $(this, kr).requirePreferred && o <= 65535) throw new Error(`Unexpectedly long integer encoding (4) for ${o}`);
      break;
    case wt.EIGHT: {
      if (u = 8, i === me.SIMPLE_FLOAT) o = $(this, $r).getFloat64($(this, Kt), !1);
      else if (o = $(this, $r).getBigUint64($(this, Kt), !1), o <= Number.MAX_SAFE_INTEGER && (o = Number(o)), $(this, kr).requirePreferred && o <= 4294967295) throw new Error(`Unexpectedly long integer encoding (8) for ${o}`);
      break;
    }
    case 28:
    case 29:
    case 30:
      throw new Error(`Additional info not implemented: ${s}`);
    case wt.INDEFINITE:
      switch (i) {
        case me.POS_INT:
        case me.NEG_INT:
        case me.TAG:
          throw new Error(`Invalid indefinite encoding for MT ${i}`);
        case me.SIMPLE_FLOAT:
          yield [i, s, Er.BREAK, t, 0];
          return;
      }
      o = 1 / 0;
      break;
    default:
      c = !0;
  }
  switch (It(this, Kt, $(this, Kt) + u), i) {
    case me.POS_INT:
      yield [i, s, o, t, u];
      break;
    case me.NEG_INT:
      yield [i, s, typeof o == "bigint" ? -1n - o : -1 - Number(o), t, u];
      break;
    case me.BYTE_STRING:
      o === 1 / 0 ? yield* Ue(this, Wt, ks).call(this, i, e, t) : yield [i, s, Ue(this, Wt, Au).call(this, o), t, o];
      break;
    case me.UTF8_STRING:
      o === 1 / 0 ? yield* Ue(this, Wt, ks).call(this, i, e, t) : yield [i, s, mm.decode(Ue(this, Wt, Au).call(this, o)), t, o];
      break;
    case me.ARRAY:
      if (o === 1 / 0) yield* Ue(this, Wt, ks).call(this, i, e, t, !1);
      else {
        const h = Number(o);
        yield [i, s, h, t, u];
        for (let w = 0; w < h; w++) yield* Ue(this, Wt, ei).call(this, e + 1);
      }
      break;
    case me.MAP:
      if (o === 1 / 0) yield* Ue(this, Wt, ks).call(this, i, e, t, !1);
      else {
        const h = Number(o);
        yield [i, s, h, t, u];
        for (let w = 0; w < h; w++) yield* Ue(this, Wt, ei).call(this, e), yield* Ue(this, Wt, ei).call(this, e);
      }
      break;
    case me.TAG:
      yield [i, s, o, t, u], yield* Ue(this, Wt, ei).call(this, e);
      break;
    case me.SIMPLE_FLOAT: {
      const h = o;
      c && (o = Zs.create(Number(o))), yield [i, s, o, t, h];
      break;
    }
  }
}, Au = function(e) {
  const t = $(this, Ar).subarray($(this, Kt), It(this, Kt, $(this, Kt) + e));
  if (t.length !== e) throw new Error(`Unexpected end of stream reading ${e} bytes, got ${t.length}`);
  return t;
}, ks = function* (e, t, n, i = !0) {
  for (yield [e, wt.INDEFINITE, 1 / 0, n, 1 / 0]; ; ) {
    const s = Ue(this, Wt, ei).call(this, t), o = s.next(), [c, u, h] = o.value;
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
}, Le(Ma, "defaultOptions", { maxDepth: 1024, encoding: "hex", requirePreferred: !1 });
let Ws = Ma;
const wm = /* @__PURE__ */ new Map([[wt.ZERO, 1], [wt.ONE, 2], [wt.TWO, 3], [wt.FOUR, 5], [wt.EIGHT, 9]]), bm = new Uint8Array(0);
var tn, ar, en, Va, _0;
let Nn = (tn = class {
  constructor(e, t, n, i) {
    rr(this, Va);
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
    if ([this.mt, this.ai, , this.offset] = e, this.left = t, this.parent = n, It(this, ar, i), n && (this.depth = n.depth + 1), this.mt === me.MAP && ($(this, ar).sortKeys || $(this, ar).rejectDuplicateKeys) && It(this, en, []), $(this, ar).rejectStreaming && this.ai === wt.INDEFINITE) throw new Error("Streaming not supported");
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
      case me.POS_INT:
      case me.NEG_INT: {
        if (n.rejectInts) throw new Error(`Unexpected integer: ${c}`);
        if (n.rejectLargeNegatives && c < -0x8000000000000000n) throw new Error(`Invalid 65bit negative number: ${c}`);
        let h = c;
        return n.convertUnsafeIntsToFloat && h >= Aa.MIN && h <= Aa.MAX && (h = Number(c)), n.boxed ? Is(h, i.toHere(u)) : h;
      }
      case me.SIMPLE_FLOAT:
        if (o > wt.ONE) {
          if (n.rejectFloats) throw new Error(`Decoding unwanted floating point number: ${c}`);
          if (n.rejectNegativeZero && Object.is(c, -0)) throw new Error("Decoding negative zero");
          if (n.rejectLongLoundNaN && isNaN(c)) {
            const h = i.toHere(u);
            if (h.length !== 3 || h[1] !== 126 || h[2] !== 0) throw new Error(`Invalid NaN encoding: "${Vr(h)}"`);
          }
          if (n.rejectSubnormals && nm(i.toHere(u + 1)), n.rejectLongFloats) {
            const h = Pc(c, { chunkSize: 9, reduceUnsafeNumbers: n.rejectUnsafeFloatInts });
            if (h[0] >> 5 !== s) throw new Error(`Should have been encoded as int, not float: ${c}`);
            if (h.length < wm.get(o)) throw new Error(`Number should have been encoded shorter: ${c}`);
          }
          if (typeof c == "number" && n.boxed) return Is(c, i.toHere(u));
        } else {
          if (n.rejectSimple && c instanceof Zs) throw new Error(`Invalid simple value: ${c}`);
          if (n.rejectUndefined && c === void 0) throw new Error("Unexpected undefined");
        }
        return c;
      case me.BYTE_STRING:
      case me.UTF8_STRING:
        if (c === 1 / 0) return new n.ParentType(e, 1 / 0, t, n);
        if (n.rejectStringsNotNormalizedAs && typeof c == "string") {
          const h = c.normalize(n.rejectStringsNotNormalizedAs);
          if (c !== h) throw new Error(`String not normalized as "${n.rejectStringsNotNormalizedAs}", got [${ad(c)}] instead of [${ad(h)}]`);
        }
        return n.boxed ? Is(c, i.toHere(u)) : c;
      case me.ARRAY:
        return new n.ParentType(e, c, t, n);
      case me.MAP:
        return new n.ParentType(e, c * 2, t, n);
      case me.TAG: {
        const h = new n.ParentType(e, 1, t, n);
        return h.children = new We(c), h;
      }
    }
    throw new TypeError(`Invalid major type: ${s}`);
  }
  push(e, t, n) {
    if (this.children.push(e), $(this, en)) {
      const i = Sa(e) || t.toHere(n);
      $(this, en).push(i);
    }
    return --this.left;
  }
  replaceLast(e, t, n) {
    let i, s = -1 / 0;
    if (this.children instanceof We ? (s = 0, i = this.children.contents, this.children.contents = e) : (s = this.children.length - 1, i = this.children[s], this.children[s] = e), $(this, en)) {
      const o = Sa(e) || n.toHere(t.offset);
      $(this, en)[s] = o;
    }
    return i;
  }
  convert(e) {
    let t;
    switch (this.mt) {
      case me.ARRAY:
        t = this.children;
        break;
      case me.MAP: {
        const n = Ue(this, Va, _0).call(this);
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
      case me.BYTE_STRING:
        return Jv(this.children);
      case me.UTF8_STRING: {
        const n = this.children.join("");
        t = $(this, ar).boxed ? Is(n, e.toHere(this.offset)) : n;
        break;
      }
      case me.TAG:
        t = this.children.decode($(this, ar));
        break;
      default:
        throw new TypeError(`Invalid mt on convert: ${this.mt}`);
    }
    return $(this, ar).saveOriginal && t && typeof t == "object" && Ks(t, e.toHere(this.offset)), t;
  }
}, ar = new WeakMap(), en = new WeakMap(), Va = new WeakSet(), _0 = function() {
  const e = this.children, t = e.length;
  if (t % 2) throw new Error("Missing map value");
  const n = new Array(t / 2);
  if ($(this, en)) for (let i = 0; i < t; i += 2) n[i >> 1] = [e[i], e[i + 1], $(this, en)[i]];
  else for (let i = 0; i < t; i += 2) n[i >> 1] = [e[i], e[i + 1], bm];
  return n;
}, Le(tn, "defaultDecodeOptions", { ...Ws.defaultOptions, ParentType: tn, boxed: !1, cde: !1, dcbor: !1, diagnosticSizes: S0.PREFERRED, convertUnsafeIntsToFloat: !1, pretty: !1, preferMap: !1, rejectLargeNegatives: !1, rejectBigInts: !1, rejectDuplicateKeys: !1, rejectFloats: !1, rejectInts: !1, rejectLongLoundNaN: !1, rejectLongFloats: !1, rejectNegativeZero: !1, rejectSimple: !1, rejectStreaming: !1, rejectStringsNotNormalizedAs: null, rejectSubnormals: !1, rejectUndefined: !1, rejectUnsafeFloatInts: !1, saveOriginal: !1, sortKeys: null }), Le(tn, "cdeDecodeOptions", { cde: !0, rejectStreaming: !0, requirePreferred: !0, sortKeys: m0 }), Le(tn, "dcborDecodeOptions", { ...tn.cdeDecodeOptions, dcbor: !0, convertUnsafeIntsToFloat: !0, rejectDuplicateKeys: !0, rejectLargeNegatives: !0, rejectLongLoundNaN: !0, rejectLongFloats: !0, rejectNegativeZero: !0, rejectSimple: !0, rejectUndefined: !0, rejectUnsafeFloatInts: !0, rejectStringsNotNormalizedAs: "NFC" }), tn);
var wd, bd;
class Su extends (bd = Nn, wd = Er.ENCODED, bd) {
  constructor(t, n, i, s) {
    super(t, n, i, s);
    Le(this, "depth", 0);
    Le(this, "leaf", !1);
    Le(this, "value");
    Le(this, "length");
    Le(this, wd);
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
function E0(r) {
  return r instanceof Su;
}
function jo(r, e) {
  return r === 1 / 0 ? "Indefinite" : e ? `${r} ${e}${r !== 1 && r !== 1n ? "s" : ""}` : String(r);
}
function Jc(r) {
  return "".padStart(r, " ");
}
function I0(r, e, t) {
  let n = "";
  n += Jc(r.depth * 2);
  const i = Sa(r);
  n += Vr(i.subarray(0, 1));
  const s = r.numBytes();
  s && (n += " ", n += Vr(i.subarray(1, s + 1))), n = n.padEnd(e.minCol + 1, " "), n += "-- ", t !== void 0 && (n += Jc(r.depth * 2), t !== "" && (n += `[${t}] `));
  let o = !1;
  const [c] = r.children;
  switch (r.mt) {
    case me.POS_INT:
      n += `Unsigned: ${c}`, typeof c == "bigint" && (n += "n");
      break;
    case me.NEG_INT:
      n += `Negative: ${c}`, typeof c == "bigint" && (n += "n");
      break;
    case me.BYTE_STRING:
      n += `Bytes (Length: ${jo(r.length)})`;
      break;
    case me.UTF8_STRING:
      n += `UTF8 (Length: ${jo(r.length)})`, r.length !== 1 / 0 && (n += `: ${JSON.stringify(c)}`);
      break;
    case me.ARRAY:
      n += `Array (Length: ${jo(r.value, "item")})`;
      break;
    case me.MAP:
      n += `Map (Length: ${jo(r.value, "pair")})`;
      break;
    case me.TAG: {
      n += `Tag #${r.value}`;
      const u = r.children, [h] = u.contents.children, w = new We(u.tag, h);
      Ks(w, i);
      const x = w.comment(e, r.depth);
      x && (n += ": ", n += x), o || (o = w.noChildren);
      break;
    }
    case me.SIMPLE_FLOAT:
      c === Er.BREAK ? n += "BREAK" : r.ai > wt.ONE ? Object.is(c, -0) ? n += "Float: -0" : n += `Float: ${c}` : (n += "Simple: ", c instanceof Zs ? n += c.value : n += c);
      break;
  }
  if (!o) if (r.leaf) {
    if (n += `
`, i.length > s + 1) {
      const u = Jc((r.depth + 1) * 2);
      for (let h = s + 1; h < i.length; h += 8) n += u, n += Vr(i.subarray(h, h + 8)), n += `
`;
    }
  } else {
    n += `
`;
    let u = 0;
    for (const h of r.children) {
      if (E0(h)) {
        let w = String(u);
        r.mt === me.MAP ? w = u % 2 ? `val ${(u - 1) / 2}` : `key ${u / 2}` : r.mt === me.TAG && (w = ""), n += I0(h, e, w);
      }
      u++;
    }
  }
  return n;
}
const xm = { ...Nn.defaultDecodeOptions, initialDepth: 0, noPrefixHex: !1, minCol: 0 };
function Am(r, e) {
  const t = { ...xm, ...e, ParentType: Su, saveOriginal: !0 }, n = new Ws(r, t);
  let i, s;
  for (const c of n) {
    if (s = Nn.create(c, i, t, n), c[2] === Er.BREAK) if (i != null && i.isStreaming) i.left = 1;
    else throw new Error("Unexpected BREAK");
    if (!E0(s)) {
      const w = new Su(c, 0, i, t);
      w.leaf = !0, w.children.push(s), Ks(w, n.toHere(c[3])), s = w;
    }
    let u = (s.depth + 1) * 2;
    const h = s.numBytes();
    for (h && (u += 1, u += h * 2), t.minCol = Math.max(t.minCol, u), i && i.push(s, n, c[3]), i = s; i != null && i.done; ) s = i, s.leaf || Ks(s, n.toHere(s.offset)), { parent: i } = i;
  }
  e && (e.minCol = t.minCol);
  let o = t.noPrefixHex ? "" : `0x${Vr(n.toHere(0))}
`;
  return o += I0(s, t), o;
}
const ld = !em();
function k0(r) {
  if (typeof r == "object" && r) {
    if (r.constructor !== Number) throw new Error(`Expected number: ${r}`);
  } else if (typeof r != "number") throw new Error(`Expected number: ${r}`);
}
function Pn(r) {
  if (typeof r == "object" && r) {
    if (r.constructor !== String) throw new Error(`Expected string: ${r}`);
  } else if (typeof r != "string") throw new Error(`Expected string: ${r}`);
}
function bi(r) {
  if (!(r instanceof Uint8Array)) throw new Error(`Expected Uint8Array: ${r}`);
}
function C0(r) {
  if (!Array.isArray(r)) throw new Error(`Expected Array: ${r}`);
}
Rt(Map, (r, e, t) => {
  const n = [...r.entries()].map((i) => [i[0], i[1], Pc(i[0], t)]);
  if (t.rejectDuplicateKeys) {
    const i = /* @__PURE__ */ new Set();
    for (const [s, o, c] of n) {
      const u = Vr(c);
      if (i.has(u)) throw new Error(`Duplicate map key: 0x${u}`);
      i.add(u);
    }
  }
  t.sortKeys && n.sort(t.sortKeys), mf(r, r.size, me.MAP, e, t);
  for (const [i, s, o] of n) e.write(o), ii(s, e, t);
});
function ud(r) {
  return Pn(r.contents), new Date(r.contents);
}
ud.comment = (r) => (Pn(r.contents), `(String Date) ${new Date(r.contents).toISOString()}`), We.registerDecoder(_t.DATE_STRING, ud);
function fd(r) {
  return k0(r.contents), new Date(r.contents * 1e3);
}
fd.comment = (r) => (k0(r.contents), `(Epoch Date) ${new Date(r.contents * 1e3).toISOString()}`), We.registerDecoder(_t.DATE_EPOCH, fd), Rt(Date, (r) => [_t.DATE_EPOCH, r.valueOf() / 1e3]);
function Ia(r, e, t) {
  if (bi(e.contents), t.rejectBigInts) throw new Error(`Decoding unwanted big integer: ${e}(h'${Vr(e.contents)}')`);
  if (t.requirePreferred && e.contents[0] === 0) throw new Error(`Decoding overly-large bigint: ${e.tag}(h'${Vr(e.contents)})`);
  let n = e.contents.reduce((i, s) => i << 8n | BigInt(s), 0n);
  if (r && (n = -1n - n), t.requirePreferred && n >= Number.MIN_SAFE_INTEGER && n <= Number.MAX_SAFE_INTEGER) throw new Error(`Decoding bigint that could have been int: ${n}n`);
  return t.boxed ? Is(n, e.contents) : n;
}
const hd = Ia.bind(null, !1), dd = Ia.bind(null, !0);
hd.comment = (r, e) => `(Positive BigInt) ${Ia(!1, r, e)}n`, dd.comment = (r, e) => `(Negative BigInt) ${Ia(!0, r, e)}n`, We.registerDecoder(_t.POS_BIGINT, hd), We.registerDecoder(_t.NEG_BIGINT, dd);
function Xc(r, e) {
  return bi(r.contents), r;
}
Xc.comment = (r, e, t) => {
  bi(r.contents);
  const n = { ...e, initialDepth: t + 2, noPrefixHex: !0 }, i = Sa(r);
  let s = 2 ** ((i[0] & 31) - 24) + 1;
  const o = i[s] & 31;
  let c = Vr(i.subarray(s, ++s));
  o >= 24 && (c += " ", c += Vr(i.subarray(s, s + 2 ** (o - 24)))), n.minCol = Math.max(n.minCol, (t + 1) * 2 + c.length);
  const u = Am(r.contents, n);
  let h = `Embedded CBOR
`;
  return h += `${"".padStart((t + 1) * 2, " ")}${c}`.padEnd(n.minCol + 1, " "), h += `-- Bytes (Length: ${r.contents.length})
`, h += u, h;
}, Xc.noChildren = !0, We.registerDecoder(_t.CBOR, Xc), We.registerDecoder(_t.URI, (r) => (Pn(r.contents), new URL(r.contents)), "URI"), Rt(URL, (r) => [_t.URI, r.toString()]), We.registerDecoder(_t.BASE64URL, (r) => (Pn(r.contents), Qv(r.contents)), "Base64url-encoded"), We.registerDecoder(_t.BASE64, (r) => (Pn(r.contents), vf(r.contents)), "Base64-encoded"), We.registerDecoder(35, (r) => (Pn(r.contents), new RegExp(r.contents)), "RegExp"), We.registerDecoder(21065, (r) => {
  Pn(r.contents);
  let e = r.contents.replace(new RegExp("(?<!\\\\)(?<!\\[(?:[^\\]]|\\\\\\])*)\\.", "g"), `[^
\r]`);
  return e = `^(?:${e})$`, new RegExp(e, "u");
}, "I-RegExp"), We.registerDecoder(_t.REGEXP, (r) => {
  if (C0(r.contents), r.contents.length < 1 || r.contents.length > 2) throw new Error(`Invalid RegExp Array: ${r.contents}`);
  return new RegExp(r.contents[0], r.contents[1]);
}, "RegExp"), Rt(RegExp, (r) => [_t.REGEXP, [r.source, r.flags]]), We.registerDecoder(64, (r) => (bi(r.contents), r.contents), "uint8 Typed Array");
function nr(r, e, t) {
  bi(r.contents);
  let n = r.contents.length;
  if (n % e.BYTES_PER_ELEMENT !== 0) throw new Error(`Number of bytes must be divisible by ${e.BYTES_PER_ELEMENT}, got: ${n}`);
  n /= e.BYTES_PER_ELEMENT;
  const i = new e(n), s = new DataView(r.contents.buffer, r.contents.byteOffset, r.contents.byteLength), o = s[`get${e.name.replace(/Array/, "")}`].bind(s);
  for (let c = 0; c < n; c++) i[c] = o(c * e.BYTES_PER_ELEMENT, t);
  return i;
}
function On(r, e, t, n, i) {
  const s = i.forceEndian ?? ld;
  if (Ea(s ? e : t, r, i), zr(n.byteLength, r, me.BYTE_STRING), ld === s) r.write(new Uint8Array(n.buffer, n.byteOffset, n.byteLength));
  else {
    const o = `write${n.constructor.name.replace(/Array/, "")}`, c = r[o].bind(r);
    for (const u of n) c(u, s);
  }
}
We.registerDecoder(65, (r) => nr(r, Uint16Array, !1), "uint16, big endian, Typed Array"), We.registerDecoder(66, (r) => nr(r, Uint32Array, !1), "uint32, big endian, Typed Array"), We.registerDecoder(67, (r) => nr(r, BigUint64Array, !1), "uint64, big endian, Typed Array"), We.registerDecoder(68, (r) => (bi(r.contents), new Uint8ClampedArray(r.contents)), "uint8 Typed Array, clamped arithmetic"), Rt(Uint8ClampedArray, (r) => [68, new Uint8Array(r.buffer, r.byteOffset, r.byteLength)]), We.registerDecoder(69, (r) => nr(r, Uint16Array, !0), "uint16, little endian, Typed Array"), Rt(Uint16Array, (r, e, t) => On(e, 69, 65, r, t)), We.registerDecoder(70, (r) => nr(r, Uint32Array, !0), "uint32, little endian, Typed Array"), Rt(Uint32Array, (r, e, t) => On(e, 70, 66, r, t)), We.registerDecoder(71, (r) => nr(r, BigUint64Array, !0), "uint64, little endian, Typed Array"), Rt(BigUint64Array, (r, e, t) => On(e, 71, 67, r, t)), We.registerDecoder(72, (r) => (bi(r.contents), new Int8Array(r.contents)), "sint8 Typed Array"), Rt(Int8Array, (r) => [72, new Uint8Array(r.buffer, r.byteOffset, r.byteLength)]), We.registerDecoder(73, (r) => nr(r, Int16Array, !1), "sint16, big endian, Typed Array"), We.registerDecoder(74, (r) => nr(r, Int32Array, !1), "sint32, big endian, Typed Array"), We.registerDecoder(75, (r) => nr(r, BigInt64Array, !1), "sint64, big endian, Typed Array"), We.registerDecoder(77, (r) => nr(r, Int16Array, !0), "sint16, little endian, Typed Array"), Rt(Int16Array, (r, e, t) => On(e, 77, 73, r, t)), We.registerDecoder(78, (r) => nr(r, Int32Array, !0), "sint32, little endian, Typed Array"), Rt(Int32Array, (r, e, t) => On(e, 78, 74, r, t)), We.registerDecoder(79, (r) => nr(r, BigInt64Array, !0), "sint64, little endian, Typed Array"), Rt(BigInt64Array, (r, e, t) => On(e, 79, 75, r, t)), We.registerDecoder(81, (r) => nr(r, Float32Array, !1), "IEEE 754 binary32, big endian, Typed Array"), We.registerDecoder(82, (r) => nr(r, Float64Array, !1), "IEEE 754 binary64, big endian, Typed Array"), We.registerDecoder(85, (r) => nr(r, Float32Array, !0), "IEEE 754 binary32, little endian, Typed Array"), Rt(Float32Array, (r, e, t) => On(e, 85, 81, r, t)), We.registerDecoder(86, (r) => nr(r, Float64Array, !0), "IEEE 754 binary64, big endian, Typed Array"), Rt(Float64Array, (r, e, t) => On(e, 86, 82, r, t)), We.registerDecoder(_t.SET, (r) => (C0(r.contents), new Set(r.contents)), "Set"), Rt(Set, (r) => [_t.SET, [...r]]), We.registerDecoder(_t.JSON, (r) => (Pn(r.contents), JSON.parse(r.contents)), "JSON-encoded"), We.registerDecoder(_t.SELF_DESCRIBED, (r) => r.contents, "Self-Described"), We.registerDecoder(_t.INVALID_16, () => {
  throw new Error(`Tag always invalid: ${_t.INVALID_16}`);
}, "Invalid"), We.registerDecoder(_t.INVALID_32, () => {
  throw new Error(`Tag always invalid: ${_t.INVALID_32}`);
}, "Invalid"), We.registerDecoder(_t.INVALID_64, () => {
  throw new Error(`Tag always invalid: ${_t.INVALID_64}`);
}, "Invalid");
function Qc(r) {
  throw new Error(`Encoding ${r.constructor.name} intentionally unimplmented.  It is not concrete enough to interoperate.  Convert to Uint8Array first.`);
}
Rt(ArrayBuffer, Qc), Rt(DataView, Qc), typeof SharedArrayBuffer < "u" && Rt(SharedArrayBuffer, Qc);
function Ro(r) {
  return [NaN, r.valueOf()];
}
Rt(Boolean, Ro), Rt(Number, Ro), Rt(String, Ro), Rt(BigInt, Ro);
function ka(r, e = {}) {
  const t = { ...Nn.defaultDecodeOptions };
  if (e.dcbor ? Object.assign(t, Nn.dcborDecodeOptions) : e.cde && Object.assign(t, Nn.cdeDecodeOptions), Object.assign(t, e), Object.hasOwn(t, "rejectLongNumbers")) throw new TypeError("rejectLongNumbers has changed to requirePreferred");
  t.boxed && (t.saveOriginal = !0);
  const n = new Ws(r, t);
  let i, s;
  for (const o of n) {
    if (s = Nn.create(o, i, t, n), o[2] === Er.BREAK) if (i != null && i.isStreaming) i.left = 0;
    else throw new Error("Unexpected BREAK");
    else i && i.push(s, n, o[3]);
    for (s instanceof Nn && (i = s); i != null && i.done; ) {
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
var _u;
(function(r) {
  r.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(_u || (_u = {}));
const se = at.arrayToEnum([
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
]), jn = (r) => {
  switch (typeof r) {
    case "undefined":
      return se.undefined;
    case "string":
      return se.string;
    case "number":
      return isNaN(r) ? se.nan : se.number;
    case "boolean":
      return se.boolean;
    case "function":
      return se.function;
    case "bigint":
      return se.bigint;
    case "symbol":
      return se.symbol;
    case "object":
      return Array.isArray(r) ? se.array : r === null ? se.null : r.then && typeof r.then == "function" && r.catch && typeof r.catch == "function" ? se.promise : typeof Map < "u" && r instanceof Map ? se.map : typeof Set < "u" && r instanceof Set ? se.set : typeof Date < "u" && r instanceof Date ? se.date : se.object;
    default:
      return se.unknown;
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
]), Sm = (r) => JSON.stringify(r, null, 2).replace(/"([^"]+)":/g, "$1:");
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
const Ji = (r, e) => {
  let t;
  switch (r.code) {
    case F.invalid_type:
      r.received === se.undefined ? t = "Required" : t = `Expected ${r.expected}, received ${r.received}`;
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
let B0 = Ji;
function _m(r) {
  B0 = r;
}
function Ca() {
  return B0;
}
const Ba = (r) => {
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
}, Em = [];
function ee(r, e) {
  const t = Ca(), n = Ba({
    issueData: e,
    data: r.data,
    path: r.path,
    errorMaps: [
      r.common.contextualErrorMap,
      r.schemaErrorMap,
      t,
      t === Ji ? void 0 : Ji
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
        return ke;
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
        return ke;
      s.status === "dirty" && e.dirty(), o.status === "dirty" && e.dirty(), s.value !== "__proto__" && (typeof o.value < "u" || i.alwaysSet) && (n[s.value] = o.value);
    }
    return { status: e.value, value: n };
  }
}
const ke = Object.freeze({
  status: "aborted"
}), ji = (r) => ({ status: "dirty", value: r }), ur = (r) => ({ status: "valid", value: r }), Eu = (r) => r.status === "aborted", Iu = (r) => r.status === "dirty", Ys = (r) => r.status === "valid", Js = (r) => typeof Promise < "u" && r instanceof Promise;
function Oa(r, e, t, n) {
  if (typeof e == "function" ? r !== e || !n : !e.has(r)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return e.get(r);
}
function O0(r, e, t, n, i) {
  if (typeof e == "function" ? r !== e || !i : !e.has(r)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return e.set(r, t), t;
}
var Se;
(function(r) {
  r.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, r.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(Se || (Se = {}));
var Cs, Bs;
class ln {
  constructor(e, t, n, i) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = n, this._key = i;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const pd = (r, e) => {
  if (Ys(e))
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
    const { message: w } = r;
    return o.code === "invalid_enum_value" ? { message: w ?? c.defaultError } : typeof c.data > "u" ? { message: (u = w ?? n) !== null && u !== void 0 ? u : c.defaultError } : o.code !== "invalid_type" ? { message: c.defaultError } : { message: (h = w ?? t) !== null && h !== void 0 ? h : c.defaultError };
  }, description: i };
}
class Ge {
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this);
  }
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return jn(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: jn(e.data),
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
        parsedType: jn(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (Js(t))
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
      parsedType: jn(e)
    }, s = this._parseSync({ data: e, path: i.path, parent: i });
    return pd(i, s);
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
      parsedType: jn(e)
    }, i = this._parse({ data: e, path: n.path, parent: n }), s = await (Js(i) ? i : Promise.resolve(i));
    return pd(n, s);
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
      typeName: Ie.ZodEffects,
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
    return Wn.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return Lr.create(this, this._def);
  }
  promise() {
    return Qi.create(this, this._def);
  }
  or(e) {
    return to.create([this, e], this._def);
  }
  and(e) {
    return ro.create(this, e, this._def);
  }
  transform(e) {
    return new Gr({
      ...He(this._def),
      schema: this,
      typeName: Ie.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new ao({
      ...He(this._def),
      innerType: this,
      defaultValue: t,
      typeName: Ie.ZodDefault
    });
  }
  brand() {
    return new wf({
      typeName: Ie.ZodBranded,
      type: this,
      ...He(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new co({
      ...He(this._def),
      innerType: this,
      catchValue: t,
      typeName: Ie.ZodCatch
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
    return Io.create(this, e);
  }
  readonly() {
    return lo.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Im = /^c[^\s-]{8,}$/i, km = /^[0-9a-z]+$/, Cm = /^[0-9A-HJKMNP-TV-Z]{26}$/, Bm = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Om = /^[a-z0-9_-]{21}$/i, Tm = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Nm = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Pm = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let el;
const jm = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Rm = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/, Um = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, T0 = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", Dm = new RegExp(`^${T0}$`);
function N0(r) {
  let e = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
  return r.precision ? e = `${e}\\.\\d{${r.precision}}` : r.precision == null && (e = `${e}(\\.\\d+)?`), e;
}
function $m(r) {
  return new RegExp(`^${N0(r)}$`);
}
function P0(r) {
  let e = `${T0}T${N0(r)}`;
  const t = [];
  return t.push(r.local ? "Z?" : "Z"), r.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function Mm(r, e) {
  return !!((e === "v4" || !e) && jm.test(r) || (e === "v6" || !e) && Rm.test(r));
}
class Mr extends Ge {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== se.string) {
      const s = this._getOrReturnCtx(e);
      return ee(s, {
        code: F.invalid_type,
        expected: se.string,
        received: s.parsedType
      }), ke;
    }
    const n = new sr();
    let i;
    for (const s of this._def.checks)
      if (s.kind === "min")
        e.data.length < s.value && (i = this._getOrReturnCtx(e, i), ee(i, {
          code: F.too_small,
          minimum: s.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: s.message
        }), n.dirty());
      else if (s.kind === "max")
        e.data.length > s.value && (i = this._getOrReturnCtx(e, i), ee(i, {
          code: F.too_big,
          maximum: s.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: s.message
        }), n.dirty());
      else if (s.kind === "length") {
        const o = e.data.length > s.value, c = e.data.length < s.value;
        (o || c) && (i = this._getOrReturnCtx(e, i), o ? ee(i, {
          code: F.too_big,
          maximum: s.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: s.message
        }) : c && ee(i, {
          code: F.too_small,
          minimum: s.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: s.message
        }), n.dirty());
      } else if (s.kind === "email")
        Nm.test(e.data) || (i = this._getOrReturnCtx(e, i), ee(i, {
          validation: "email",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "emoji")
        el || (el = new RegExp(Pm, "u")), el.test(e.data) || (i = this._getOrReturnCtx(e, i), ee(i, {
          validation: "emoji",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "uuid")
        Bm.test(e.data) || (i = this._getOrReturnCtx(e, i), ee(i, {
          validation: "uuid",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "nanoid")
        Om.test(e.data) || (i = this._getOrReturnCtx(e, i), ee(i, {
          validation: "nanoid",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "cuid")
        Im.test(e.data) || (i = this._getOrReturnCtx(e, i), ee(i, {
          validation: "cuid",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "cuid2")
        km.test(e.data) || (i = this._getOrReturnCtx(e, i), ee(i, {
          validation: "cuid2",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "ulid")
        Cm.test(e.data) || (i = this._getOrReturnCtx(e, i), ee(i, {
          validation: "ulid",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "url")
        try {
          new URL(e.data);
        } catch {
          i = this._getOrReturnCtx(e, i), ee(i, {
            validation: "url",
            code: F.invalid_string,
            message: s.message
          }), n.dirty();
        }
      else s.kind === "regex" ? (s.regex.lastIndex = 0, s.regex.test(e.data) || (i = this._getOrReturnCtx(e, i), ee(i, {
        validation: "regex",
        code: F.invalid_string,
        message: s.message
      }), n.dirty())) : s.kind === "trim" ? e.data = e.data.trim() : s.kind === "includes" ? e.data.includes(s.value, s.position) || (i = this._getOrReturnCtx(e, i), ee(i, {
        code: F.invalid_string,
        validation: { includes: s.value, position: s.position },
        message: s.message
      }), n.dirty()) : s.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : s.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : s.kind === "startsWith" ? e.data.startsWith(s.value) || (i = this._getOrReturnCtx(e, i), ee(i, {
        code: F.invalid_string,
        validation: { startsWith: s.value },
        message: s.message
      }), n.dirty()) : s.kind === "endsWith" ? e.data.endsWith(s.value) || (i = this._getOrReturnCtx(e, i), ee(i, {
        code: F.invalid_string,
        validation: { endsWith: s.value },
        message: s.message
      }), n.dirty()) : s.kind === "datetime" ? P0(s).test(e.data) || (i = this._getOrReturnCtx(e, i), ee(i, {
        code: F.invalid_string,
        validation: "datetime",
        message: s.message
      }), n.dirty()) : s.kind === "date" ? Dm.test(e.data) || (i = this._getOrReturnCtx(e, i), ee(i, {
        code: F.invalid_string,
        validation: "date",
        message: s.message
      }), n.dirty()) : s.kind === "time" ? $m(s).test(e.data) || (i = this._getOrReturnCtx(e, i), ee(i, {
        code: F.invalid_string,
        validation: "time",
        message: s.message
      }), n.dirty()) : s.kind === "duration" ? Tm.test(e.data) || (i = this._getOrReturnCtx(e, i), ee(i, {
        validation: "duration",
        code: F.invalid_string,
        message: s.message
      }), n.dirty()) : s.kind === "ip" ? Mm(e.data, s.version) || (i = this._getOrReturnCtx(e, i), ee(i, {
        validation: "ip",
        code: F.invalid_string,
        message: s.message
      }), n.dirty()) : s.kind === "base64" ? Um.test(e.data) || (i = this._getOrReturnCtx(e, i), ee(i, {
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
      ...Se.errToObj(n)
    });
  }
  _addCheck(e) {
    return new Mr({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...Se.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...Se.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...Se.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...Se.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...Se.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...Se.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...Se.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...Se.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...Se.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...Se.errToObj(e) });
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
      ...Se.errToObj(e == null ? void 0 : e.message)
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
      ...Se.errToObj(e == null ? void 0 : e.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...Se.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...Se.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t == null ? void 0 : t.position,
      ...Se.errToObj(t == null ? void 0 : t.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...Se.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...Se.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...Se.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...Se.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...Se.errToObj(t)
    });
  }
  /**
   * @deprecated Use z.string().min(1) instead.
   * @see {@link ZodString.min}
   */
  nonempty(e) {
    return this.min(1, Se.errToObj(e));
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
    typeName: Ie.ZodString,
    coerce: (e = r == null ? void 0 : r.coerce) !== null && e !== void 0 ? e : !1,
    ...He(r)
  });
};
function Vm(r, e) {
  const t = (r.toString().split(".")[1] || "").length, n = (e.toString().split(".")[1] || "").length, i = t > n ? t : n, s = parseInt(r.toFixed(i).replace(".", "")), o = parseInt(e.toFixed(i).replace(".", ""));
  return s % o / Math.pow(10, i);
}
class qn extends Ge {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== se.number) {
      const s = this._getOrReturnCtx(e);
      return ee(s, {
        code: F.invalid_type,
        expected: se.number,
        received: s.parsedType
      }), ke;
    }
    let n;
    const i = new sr();
    for (const s of this._def.checks)
      s.kind === "int" ? at.isInteger(e.data) || (n = this._getOrReturnCtx(e, n), ee(n, {
        code: F.invalid_type,
        expected: "integer",
        received: "float",
        message: s.message
      }), i.dirty()) : s.kind === "min" ? (s.inclusive ? e.data < s.value : e.data <= s.value) && (n = this._getOrReturnCtx(e, n), ee(n, {
        code: F.too_small,
        minimum: s.value,
        type: "number",
        inclusive: s.inclusive,
        exact: !1,
        message: s.message
      }), i.dirty()) : s.kind === "max" ? (s.inclusive ? e.data > s.value : e.data >= s.value) && (n = this._getOrReturnCtx(e, n), ee(n, {
        code: F.too_big,
        maximum: s.value,
        type: "number",
        inclusive: s.inclusive,
        exact: !1,
        message: s.message
      }), i.dirty()) : s.kind === "multipleOf" ? Vm(e.data, s.value) !== 0 && (n = this._getOrReturnCtx(e, n), ee(n, {
        code: F.not_multiple_of,
        multipleOf: s.value,
        message: s.message
      }), i.dirty()) : s.kind === "finite" ? Number.isFinite(e.data) || (n = this._getOrReturnCtx(e, n), ee(n, {
        code: F.not_finite,
        message: s.message
      }), i.dirty()) : at.assertNever(s);
    return { status: i.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, Se.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, Se.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, Se.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, Se.toString(t));
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
          message: Se.toString(i)
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
      message: Se.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: Se.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: Se.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: Se.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: Se.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: Se.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: Se.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: Se.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: Se.toString(e)
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
  typeName: Ie.ZodNumber,
  coerce: (r == null ? void 0 : r.coerce) || !1,
  ...He(r)
});
class Kn extends Ge {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = BigInt(e.data)), this._getType(e) !== se.bigint) {
      const s = this._getOrReturnCtx(e);
      return ee(s, {
        code: F.invalid_type,
        expected: se.bigint,
        received: s.parsedType
      }), ke;
    }
    let n;
    const i = new sr();
    for (const s of this._def.checks)
      s.kind === "min" ? (s.inclusive ? e.data < s.value : e.data <= s.value) && (n = this._getOrReturnCtx(e, n), ee(n, {
        code: F.too_small,
        type: "bigint",
        minimum: s.value,
        inclusive: s.inclusive,
        message: s.message
      }), i.dirty()) : s.kind === "max" ? (s.inclusive ? e.data > s.value : e.data >= s.value) && (n = this._getOrReturnCtx(e, n), ee(n, {
        code: F.too_big,
        type: "bigint",
        maximum: s.value,
        inclusive: s.inclusive,
        message: s.message
      }), i.dirty()) : s.kind === "multipleOf" ? e.data % s.value !== BigInt(0) && (n = this._getOrReturnCtx(e, n), ee(n, {
        code: F.not_multiple_of,
        multipleOf: s.value,
        message: s.message
      }), i.dirty()) : at.assertNever(s);
    return { status: i.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, Se.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, Se.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, Se.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, Se.toString(t));
  }
  setLimit(e, t, n, i) {
    return new Kn({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: Se.toString(i)
        }
      ]
    });
  }
  _addCheck(e) {
    return new Kn({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: Se.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: Se.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: Se.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: Se.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: Se.toString(t)
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
Kn.create = (r) => {
  var e;
  return new Kn({
    checks: [],
    typeName: Ie.ZodBigInt,
    coerce: (e = r == null ? void 0 : r.coerce) !== null && e !== void 0 ? e : !1,
    ...He(r)
  });
};
class Xs extends Ge {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== se.boolean) {
      const n = this._getOrReturnCtx(e);
      return ee(n, {
        code: F.invalid_type,
        expected: se.boolean,
        received: n.parsedType
      }), ke;
    }
    return ur(e.data);
  }
}
Xs.create = (r) => new Xs({
  typeName: Ie.ZodBoolean,
  coerce: (r == null ? void 0 : r.coerce) || !1,
  ...He(r)
});
class xi extends Ge {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== se.date) {
      const s = this._getOrReturnCtx(e);
      return ee(s, {
        code: F.invalid_type,
        expected: se.date,
        received: s.parsedType
      }), ke;
    }
    if (isNaN(e.data.getTime())) {
      const s = this._getOrReturnCtx(e);
      return ee(s, {
        code: F.invalid_date
      }), ke;
    }
    const n = new sr();
    let i;
    for (const s of this._def.checks)
      s.kind === "min" ? e.data.getTime() < s.value && (i = this._getOrReturnCtx(e, i), ee(i, {
        code: F.too_small,
        message: s.message,
        inclusive: !0,
        exact: !1,
        minimum: s.value,
        type: "date"
      }), n.dirty()) : s.kind === "max" ? e.data.getTime() > s.value && (i = this._getOrReturnCtx(e, i), ee(i, {
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
    return new xi({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: Se.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: Se.toString(t)
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
xi.create = (r) => new xi({
  checks: [],
  coerce: (r == null ? void 0 : r.coerce) || !1,
  typeName: Ie.ZodDate,
  ...He(r)
});
class Ta extends Ge {
  _parse(e) {
    if (this._getType(e) !== se.symbol) {
      const n = this._getOrReturnCtx(e);
      return ee(n, {
        code: F.invalid_type,
        expected: se.symbol,
        received: n.parsedType
      }), ke;
    }
    return ur(e.data);
  }
}
Ta.create = (r) => new Ta({
  typeName: Ie.ZodSymbol,
  ...He(r)
});
class Qs extends Ge {
  _parse(e) {
    if (this._getType(e) !== se.undefined) {
      const n = this._getOrReturnCtx(e);
      return ee(n, {
        code: F.invalid_type,
        expected: se.undefined,
        received: n.parsedType
      }), ke;
    }
    return ur(e.data);
  }
}
Qs.create = (r) => new Qs({
  typeName: Ie.ZodUndefined,
  ...He(r)
});
class eo extends Ge {
  _parse(e) {
    if (this._getType(e) !== se.null) {
      const n = this._getOrReturnCtx(e);
      return ee(n, {
        code: F.invalid_type,
        expected: se.null,
        received: n.parsedType
      }), ke;
    }
    return ur(e.data);
  }
}
eo.create = (r) => new eo({
  typeName: Ie.ZodNull,
  ...He(r)
});
class Xi extends Ge {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return ur(e.data);
  }
}
Xi.create = (r) => new Xi({
  typeName: Ie.ZodAny,
  ...He(r)
});
class ai extends Ge {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return ur(e.data);
  }
}
ai.create = (r) => new ai({
  typeName: Ie.ZodUnknown,
  ...He(r)
});
class En extends Ge {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return ee(t, {
      code: F.invalid_type,
      expected: se.never,
      received: t.parsedType
    }), ke;
  }
}
En.create = (r) => new En({
  typeName: Ie.ZodNever,
  ...He(r)
});
class Na extends Ge {
  _parse(e) {
    if (this._getType(e) !== se.undefined) {
      const n = this._getOrReturnCtx(e);
      return ee(n, {
        code: F.invalid_type,
        expected: se.void,
        received: n.parsedType
      }), ke;
    }
    return ur(e.data);
  }
}
Na.create = (r) => new Na({
  typeName: Ie.ZodVoid,
  ...He(r)
});
class Lr extends Ge {
  _parse(e) {
    const { ctx: t, status: n } = this._processInputParams(e), i = this._def;
    if (t.parsedType !== se.array)
      return ee(t, {
        code: F.invalid_type,
        expected: se.array,
        received: t.parsedType
      }), ke;
    if (i.exactLength !== null) {
      const o = t.data.length > i.exactLength.value, c = t.data.length < i.exactLength.value;
      (o || c) && (ee(t, {
        code: o ? F.too_big : F.too_small,
        minimum: c ? i.exactLength.value : void 0,
        maximum: o ? i.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: i.exactLength.message
      }), n.dirty());
    }
    if (i.minLength !== null && t.data.length < i.minLength.value && (ee(t, {
      code: F.too_small,
      minimum: i.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: i.minLength.message
    }), n.dirty()), i.maxLength !== null && t.data.length > i.maxLength.value && (ee(t, {
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
      minLength: { value: e, message: Se.toString(t) }
    });
  }
  max(e, t) {
    return new Lr({
      ...this._def,
      maxLength: { value: e, message: Se.toString(t) }
    });
  }
  length(e, t) {
    return new Lr({
      ...this._def,
      exactLength: { value: e, message: Se.toString(t) }
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
  typeName: Ie.ZodArray,
  ...He(e)
});
function Ni(r) {
  if (r instanceof Bt) {
    const e = {};
    for (const t in r.shape) {
      const n = r.shape[t];
      e[t] = on.create(Ni(n));
    }
    return new Bt({
      ...r._def,
      shape: () => e
    });
  } else return r instanceof Lr ? new Lr({
    ...r._def,
    type: Ni(r.element)
  }) : r instanceof on ? on.create(Ni(r.unwrap())) : r instanceof Wn ? Wn.create(Ni(r.unwrap())) : r instanceof un ? un.create(r.items.map((e) => Ni(e))) : r;
}
class Bt extends Ge {
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
    if (this._getType(e) !== se.object) {
      const h = this._getOrReturnCtx(e);
      return ee(h, {
        code: F.invalid_type,
        expected: se.object,
        received: h.parsedType
      }), ke;
    }
    const { status: n, ctx: i } = this._processInputParams(e), { shape: s, keys: o } = this._getCached(), c = [];
    if (!(this._def.catchall instanceof En && this._def.unknownKeys === "strip"))
      for (const h in i.data)
        o.includes(h) || c.push(h);
    const u = [];
    for (const h of o) {
      const w = s[h], x = i.data[h];
      u.push({
        key: { status: "valid", value: h },
        value: w._parse(new ln(i, x, i.path, h)),
        alwaysSet: h in i.data
      });
    }
    if (this._def.catchall instanceof En) {
      const h = this._def.unknownKeys;
      if (h === "passthrough")
        for (const w of c)
          u.push({
            key: { status: "valid", value: w },
            value: { status: "valid", value: i.data[w] }
          });
      else if (h === "strict")
        c.length > 0 && (ee(i, {
          code: F.unrecognized_keys,
          keys: c
        }), n.dirty());
      else if (h !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const h = this._def.catchall;
      for (const w of c) {
        const x = i.data[w];
        u.push({
          key: { status: "valid", value: w },
          value: h._parse(
            new ln(i, x, i.path, w)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: w in i.data
        });
      }
    }
    return i.common.async ? Promise.resolve().then(async () => {
      const h = [];
      for (const w of u) {
        const x = await w.key, q = await w.value;
        h.push({
          key: x,
          value: q,
          alwaysSet: w.alwaysSet
        });
      }
      return h;
    }).then((h) => sr.mergeObjectSync(n, h)) : sr.mergeObjectSync(n, u);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return Se.errToObj, new Bt({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, n) => {
          var i, s, o, c;
          const u = (o = (s = (i = this._def).errorMap) === null || s === void 0 ? void 0 : s.call(i, t, n).message) !== null && o !== void 0 ? o : n.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: (c = Se.errToObj(e).message) !== null && c !== void 0 ? c : u
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
      typeName: Ie.ZodObject
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
    return Ni(this);
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
    return j0(at.objectKeys(this.shape));
  }
}
Bt.create = (r, e) => new Bt({
  shape: () => r,
  unknownKeys: "strip",
  catchall: En.create(),
  typeName: Ie.ZodObject,
  ...He(e)
});
Bt.strictCreate = (r, e) => new Bt({
  shape: () => r,
  unknownKeys: "strict",
  catchall: En.create(),
  typeName: Ie.ZodObject,
  ...He(e)
});
Bt.lazycreate = (r, e) => new Bt({
  shape: r,
  unknownKeys: "strip",
  catchall: En.create(),
  typeName: Ie.ZodObject,
  ...He(e)
});
class to extends Ge {
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
      return ee(t, {
        code: F.invalid_union,
        unionErrors: o
      }), ke;
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
        }, w = u._parseSync({
          data: t.data,
          path: t.path,
          parent: h
        });
        if (w.status === "valid")
          return w;
        w.status === "dirty" && !s && (s = { result: w, ctx: h }), h.common.issues.length && o.push(h.common.issues);
      }
      if (s)
        return t.common.issues.push(...s.ctx.common.issues), s.result;
      const c = o.map((u) => new _r(u));
      return ee(t, {
        code: F.invalid_union,
        unionErrors: c
      }), ke;
    }
  }
  get options() {
    return this._def.options;
  }
}
to.create = (r, e) => new to({
  options: r,
  typeName: Ie.ZodUnion,
  ...He(e)
});
const yn = (r) => r instanceof io ? yn(r.schema) : r instanceof Gr ? yn(r.innerType()) : r instanceof so ? [r.value] : r instanceof Zn ? r.options : r instanceof oo ? at.objectValues(r.enum) : r instanceof ao ? yn(r._def.innerType) : r instanceof Qs ? [void 0] : r instanceof eo ? [null] : r instanceof on ? [void 0, ...yn(r.unwrap())] : r instanceof Wn ? [null, ...yn(r.unwrap())] : r instanceof wf || r instanceof lo ? yn(r.unwrap()) : r instanceof co ? yn(r._def.innerType) : [];
class jc extends Ge {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== se.object)
      return ee(t, {
        code: F.invalid_type,
        expected: se.object,
        received: t.parsedType
      }), ke;
    const n = this.discriminator, i = t.data[n], s = this.optionsMap.get(i);
    return s ? t.common.async ? s._parseAsync({
      data: t.data,
      path: t.path,
      parent: t
    }) : s._parseSync({
      data: t.data,
      path: t.path,
      parent: t
    }) : (ee(t, {
      code: F.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [n]
    }), ke);
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
      const o = yn(s.shape[e]);
      if (!o.length)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const c of o) {
        if (i.has(c))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(c)}`);
        i.set(c, s);
      }
    }
    return new jc({
      typeName: Ie.ZodDiscriminatedUnion,
      discriminator: e,
      options: t,
      optionsMap: i,
      ...He(n)
    });
  }
}
function ku(r, e) {
  const t = jn(r), n = jn(e);
  if (r === e)
    return { valid: !0, data: r };
  if (t === se.object && n === se.object) {
    const i = at.objectKeys(e), s = at.objectKeys(r).filter((c) => i.indexOf(c) !== -1), o = { ...r, ...e };
    for (const c of s) {
      const u = ku(r[c], e[c]);
      if (!u.valid)
        return { valid: !1 };
      o[c] = u.data;
    }
    return { valid: !0, data: o };
  } else if (t === se.array && n === se.array) {
    if (r.length !== e.length)
      return { valid: !1 };
    const i = [];
    for (let s = 0; s < r.length; s++) {
      const o = r[s], c = e[s], u = ku(o, c);
      if (!u.valid)
        return { valid: !1 };
      i.push(u.data);
    }
    return { valid: !0, data: i };
  } else return t === se.date && n === se.date && +r == +e ? { valid: !0, data: r } : { valid: !1 };
}
class ro extends Ge {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), i = (s, o) => {
      if (Eu(s) || Eu(o))
        return ke;
      const c = ku(s.value, o.value);
      return c.valid ? ((Iu(s) || Iu(o)) && t.dirty(), { status: t.value, value: c.data }) : (ee(n, {
        code: F.invalid_intersection_types
      }), ke);
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
ro.create = (r, e, t) => new ro({
  left: r,
  right: e,
  typeName: Ie.ZodIntersection,
  ...He(t)
});
class un extends Ge {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== se.array)
      return ee(n, {
        code: F.invalid_type,
        expected: se.array,
        received: n.parsedType
      }), ke;
    if (n.data.length < this._def.items.length)
      return ee(n, {
        code: F.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), ke;
    !this._def.rest && n.data.length > this._def.items.length && (ee(n, {
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
    typeName: Ie.ZodTuple,
    rest: null,
    ...He(e)
  });
};
class no extends Ge {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== se.object)
      return ee(n, {
        code: F.invalid_type,
        expected: se.object,
        received: n.parsedType
      }), ke;
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
    return t instanceof Ge ? new no({
      keyType: e,
      valueType: t,
      typeName: Ie.ZodRecord,
      ...He(n)
    }) : new no({
      keyType: Mr.create(),
      valueType: e,
      typeName: Ie.ZodRecord,
      ...He(t)
    });
  }
}
class Pa extends Ge {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== se.map)
      return ee(n, {
        code: F.invalid_type,
        expected: se.map,
        received: n.parsedType
      }), ke;
    const i = this._def.keyType, s = this._def.valueType, o = [...n.data.entries()].map(([c, u], h) => ({
      key: i._parse(new ln(n, c, n.path, [h, "key"])),
      value: s._parse(new ln(n, u, n.path, [h, "value"]))
    }));
    if (n.common.async) {
      const c = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const u of o) {
          const h = await u.key, w = await u.value;
          if (h.status === "aborted" || w.status === "aborted")
            return ke;
          (h.status === "dirty" || w.status === "dirty") && t.dirty(), c.set(h.value, w.value);
        }
        return { status: t.value, value: c };
      });
    } else {
      const c = /* @__PURE__ */ new Map();
      for (const u of o) {
        const h = u.key, w = u.value;
        if (h.status === "aborted" || w.status === "aborted")
          return ke;
        (h.status === "dirty" || w.status === "dirty") && t.dirty(), c.set(h.value, w.value);
      }
      return { status: t.value, value: c };
    }
  }
}
Pa.create = (r, e, t) => new Pa({
  valueType: e,
  keyType: r,
  typeName: Ie.ZodMap,
  ...He(t)
});
class Ai extends Ge {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== se.set)
      return ee(n, {
        code: F.invalid_type,
        expected: se.set,
        received: n.parsedType
      }), ke;
    const i = this._def;
    i.minSize !== null && n.data.size < i.minSize.value && (ee(n, {
      code: F.too_small,
      minimum: i.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: i.minSize.message
    }), t.dirty()), i.maxSize !== null && n.data.size > i.maxSize.value && (ee(n, {
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
      for (const w of u) {
        if (w.status === "aborted")
          return ke;
        w.status === "dirty" && t.dirty(), h.add(w.value);
      }
      return { status: t.value, value: h };
    }
    const c = [...n.data.values()].map((u, h) => s._parse(new ln(n, u, n.path, h)));
    return n.common.async ? Promise.all(c).then((u) => o(u)) : o(c);
  }
  min(e, t) {
    return new Ai({
      ...this._def,
      minSize: { value: e, message: Se.toString(t) }
    });
  }
  max(e, t) {
    return new Ai({
      ...this._def,
      maxSize: { value: e, message: Se.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
Ai.create = (r, e) => new Ai({
  valueType: r,
  minSize: null,
  maxSize: null,
  typeName: Ie.ZodSet,
  ...He(e)
});
class Di extends Ge {
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== se.function)
      return ee(t, {
        code: F.invalid_type,
        expected: se.function,
        received: t.parsedType
      }), ke;
    function n(c, u) {
      return Ba({
        data: c,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          Ca(),
          Ji
        ].filter((h) => !!h),
        issueData: {
          code: F.invalid_arguments,
          argumentsError: u
        }
      });
    }
    function i(c, u) {
      return Ba({
        data: c,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          Ca(),
          Ji
        ].filter((h) => !!h),
        issueData: {
          code: F.invalid_return_type,
          returnTypeError: u
        }
      });
    }
    const s = { errorMap: t.common.contextualErrorMap }, o = t.data;
    if (this._def.returns instanceof Qi) {
      const c = this;
      return ur(async function(...u) {
        const h = new _r([]), w = await c._def.args.parseAsync(u, s).catch((N) => {
          throw h.addIssue(n(u, N)), h;
        }), x = await Reflect.apply(o, this, w);
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
        const w = Reflect.apply(o, this, h.data), x = c._def.returns.safeParse(w, s);
        if (!x.success)
          throw new _r([i(w, x.error)]);
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
    return new Di({
      ...this._def,
      args: un.create(e).rest(ai.create())
    });
  }
  returns(e) {
    return new Di({
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
    return new Di({
      args: e || un.create([]).rest(ai.create()),
      returns: t || ai.create(),
      typeName: Ie.ZodFunction,
      ...He(n)
    });
  }
}
class io extends Ge {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
io.create = (r, e) => new io({
  getter: r,
  typeName: Ie.ZodLazy,
  ...He(e)
});
class so extends Ge {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return ee(t, {
        received: t.data,
        code: F.invalid_literal,
        expected: this._def.value
      }), ke;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
so.create = (r, e) => new so({
  value: r,
  typeName: Ie.ZodLiteral,
  ...He(e)
});
function j0(r, e) {
  return new Zn({
    values: r,
    typeName: Ie.ZodEnum,
    ...He(e)
  });
}
class Zn extends Ge {
  constructor() {
    super(...arguments), Cs.set(this, void 0);
  }
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return ee(t, {
        expected: at.joinValues(n),
        received: t.parsedType,
        code: F.invalid_type
      }), ke;
    }
    if (Oa(this, Cs) || O0(this, Cs, new Set(this._def.values)), !Oa(this, Cs).has(e.data)) {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return ee(t, {
        received: t.data,
        code: F.invalid_enum_value,
        options: n
      }), ke;
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
    return Zn.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return Zn.create(this.options.filter((n) => !e.includes(n)), {
      ...this._def,
      ...t
    });
  }
}
Cs = /* @__PURE__ */ new WeakMap();
Zn.create = j0;
class oo extends Ge {
  constructor() {
    super(...arguments), Bs.set(this, void 0);
  }
  _parse(e) {
    const t = at.getValidEnumValues(this._def.values), n = this._getOrReturnCtx(e);
    if (n.parsedType !== se.string && n.parsedType !== se.number) {
      const i = at.objectValues(t);
      return ee(n, {
        expected: at.joinValues(i),
        received: n.parsedType,
        code: F.invalid_type
      }), ke;
    }
    if (Oa(this, Bs) || O0(this, Bs, new Set(at.getValidEnumValues(this._def.values))), !Oa(this, Bs).has(e.data)) {
      const i = at.objectValues(t);
      return ee(n, {
        received: n.data,
        code: F.invalid_enum_value,
        options: i
      }), ke;
    }
    return ur(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
Bs = /* @__PURE__ */ new WeakMap();
oo.create = (r, e) => new oo({
  values: r,
  typeName: Ie.ZodNativeEnum,
  ...He(e)
});
class Qi extends Ge {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== se.promise && t.common.async === !1)
      return ee(t, {
        code: F.invalid_type,
        expected: se.promise,
        received: t.parsedType
      }), ke;
    const n = t.parsedType === se.promise ? t.data : Promise.resolve(t.data);
    return ur(n.then((i) => this._def.type.parseAsync(i, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
Qi.create = (r, e) => new Qi({
  type: r,
  typeName: Ie.ZodPromise,
  ...He(e)
});
class Gr extends Ge {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === Ie.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), i = this._def.effect || null, s = {
      addIssue: (o) => {
        ee(n, o), o.fatal ? t.abort() : t.dirty();
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
            return ke;
          const u = await this._def.schema._parseAsync({
            data: c,
            path: n.path,
            parent: n
          });
          return u.status === "aborted" ? ke : u.status === "dirty" || t.value === "dirty" ? ji(u.value) : u;
        });
      {
        if (t.value === "aborted")
          return ke;
        const c = this._def.schema._parseSync({
          data: o,
          path: n.path,
          parent: n
        });
        return c.status === "aborted" ? ke : c.status === "dirty" || t.value === "dirty" ? ji(c.value) : c;
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
        return c.status === "aborted" ? ke : (c.status === "dirty" && t.dirty(), o(c.value), { status: t.value, value: c.value });
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((c) => c.status === "aborted" ? ke : (c.status === "dirty" && t.dirty(), o(c.value).then(() => ({ status: t.value, value: c.value }))));
    }
    if (i.type === "transform")
      if (n.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        if (!Ys(o))
          return o;
        const c = i.transform(o.value, s);
        if (c instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: c };
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((o) => Ys(o) ? Promise.resolve(i.transform(o.value, s)).then((c) => ({ status: t.value, value: c })) : o);
    at.assertNever(i);
  }
}
Gr.create = (r, e, t) => new Gr({
  schema: r,
  typeName: Ie.ZodEffects,
  effect: e,
  ...He(t)
});
Gr.createWithPreprocess = (r, e, t) => new Gr({
  schema: e,
  effect: { type: "preprocess", transform: r },
  typeName: Ie.ZodEffects,
  ...He(t)
});
class on extends Ge {
  _parse(e) {
    return this._getType(e) === se.undefined ? ur(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
on.create = (r, e) => new on({
  innerType: r,
  typeName: Ie.ZodOptional,
  ...He(e)
});
class Wn extends Ge {
  _parse(e) {
    return this._getType(e) === se.null ? ur(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Wn.create = (r, e) => new Wn({
  innerType: r,
  typeName: Ie.ZodNullable,
  ...He(e)
});
class ao extends Ge {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let n = t.data;
    return t.parsedType === se.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({
      data: n,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ao.create = (r, e) => new ao({
  innerType: r,
  typeName: Ie.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...He(e)
});
class co extends Ge {
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
    return Js(i) ? i.then((s) => ({
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
co.create = (r, e) => new co({
  innerType: r,
  typeName: Ie.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...He(e)
});
class ja extends Ge {
  _parse(e) {
    if (this._getType(e) !== se.nan) {
      const n = this._getOrReturnCtx(e);
      return ee(n, {
        code: F.invalid_type,
        expected: se.nan,
        received: n.parsedType
      }), ke;
    }
    return { status: "valid", value: e.data };
  }
}
ja.create = (r) => new ja({
  typeName: Ie.ZodNaN,
  ...He(r)
});
const Lm = Symbol("zod_brand");
class wf extends Ge {
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
class Io extends Ge {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.common.async)
      return (async () => {
        const s = await this._def.in._parseAsync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return s.status === "aborted" ? ke : s.status === "dirty" ? (t.dirty(), ji(s.value)) : this._def.out._parseAsync({
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
      return i.status === "aborted" ? ke : i.status === "dirty" ? (t.dirty(), {
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
    return new Io({
      in: e,
      out: t,
      typeName: Ie.ZodPipeline
    });
  }
}
class lo extends Ge {
  _parse(e) {
    const t = this._def.innerType._parse(e), n = (i) => (Ys(i) && (i.value = Object.freeze(i.value)), i);
    return Js(t) ? t.then((i) => n(i)) : n(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
lo.create = (r, e) => new lo({
  innerType: r,
  typeName: Ie.ZodReadonly,
  ...He(e)
});
function R0(r, e = {}, t) {
  return r ? Xi.create().superRefine((n, i) => {
    var s, o;
    if (!r(n)) {
      const c = typeof e == "function" ? e(n) : typeof e == "string" ? { message: e } : e, u = (o = (s = c.fatal) !== null && s !== void 0 ? s : t) !== null && o !== void 0 ? o : !0, h = typeof c == "string" ? { message: c } : c;
      i.addIssue({ code: "custom", ...h, fatal: u });
    }
  }) : Xi.create();
}
const Hm = {
  object: Bt.lazycreate
};
var Ie;
(function(r) {
  r.ZodString = "ZodString", r.ZodNumber = "ZodNumber", r.ZodNaN = "ZodNaN", r.ZodBigInt = "ZodBigInt", r.ZodBoolean = "ZodBoolean", r.ZodDate = "ZodDate", r.ZodSymbol = "ZodSymbol", r.ZodUndefined = "ZodUndefined", r.ZodNull = "ZodNull", r.ZodAny = "ZodAny", r.ZodUnknown = "ZodUnknown", r.ZodNever = "ZodNever", r.ZodVoid = "ZodVoid", r.ZodArray = "ZodArray", r.ZodObject = "ZodObject", r.ZodUnion = "ZodUnion", r.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r.ZodIntersection = "ZodIntersection", r.ZodTuple = "ZodTuple", r.ZodRecord = "ZodRecord", r.ZodMap = "ZodMap", r.ZodSet = "ZodSet", r.ZodFunction = "ZodFunction", r.ZodLazy = "ZodLazy", r.ZodLiteral = "ZodLiteral", r.ZodEnum = "ZodEnum", r.ZodEffects = "ZodEffects", r.ZodNativeEnum = "ZodNativeEnum", r.ZodOptional = "ZodOptional", r.ZodNullable = "ZodNullable", r.ZodDefault = "ZodDefault", r.ZodCatch = "ZodCatch", r.ZodPromise = "ZodPromise", r.ZodBranded = "ZodBranded", r.ZodPipeline = "ZodPipeline", r.ZodReadonly = "ZodReadonly";
})(Ie || (Ie = {}));
const Fm = (r, e = {
  message: `Input not instance of ${r.name}`
}) => R0((t) => t instanceof r, e), U0 = Mr.create, D0 = qn.create, zm = ja.create, Gm = Kn.create, $0 = Xs.create, qm = xi.create, Km = Ta.create, Zm = Qs.create, Wm = eo.create, Ym = Xi.create, Jm = ai.create, Xm = En.create, Qm = Na.create, e1 = Lr.create, t1 = Bt.create, r1 = Bt.strictCreate, n1 = to.create, i1 = jc.create, s1 = ro.create, o1 = un.create, a1 = no.create, c1 = Pa.create, l1 = Ai.create, u1 = Di.create, f1 = io.create, h1 = so.create, d1 = Zn.create, p1 = oo.create, y1 = Qi.create, yd = Gr.create, g1 = on.create, v1 = Wn.create, m1 = Gr.createWithPreprocess, w1 = Io.create, b1 = () => U0().optional(), x1 = () => D0().optional(), A1 = () => $0().optional(), S1 = {
  string: (r) => Mr.create({ ...r, coerce: !0 }),
  number: (r) => qn.create({ ...r, coerce: !0 }),
  boolean: (r) => Xs.create({
    ...r,
    coerce: !0
  }),
  bigint: (r) => Kn.create({ ...r, coerce: !0 }),
  date: (r) => xi.create({ ...r, coerce: !0 })
}, _1 = ke;
var Ct = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: Ji,
  setErrorMap: _m,
  getErrorMap: Ca,
  makeIssue: Ba,
  EMPTY_PATH: Em,
  addIssueToContext: ee,
  ParseStatus: sr,
  INVALID: ke,
  DIRTY: ji,
  OK: ur,
  isAborted: Eu,
  isDirty: Iu,
  isValid: Ys,
  isAsync: Js,
  get util() {
    return at;
  },
  get objectUtil() {
    return _u;
  },
  ZodParsedType: se,
  getParsedType: jn,
  ZodType: Ge,
  datetimeRegex: P0,
  ZodString: Mr,
  ZodNumber: qn,
  ZodBigInt: Kn,
  ZodBoolean: Xs,
  ZodDate: xi,
  ZodSymbol: Ta,
  ZodUndefined: Qs,
  ZodNull: eo,
  ZodAny: Xi,
  ZodUnknown: ai,
  ZodNever: En,
  ZodVoid: Na,
  ZodArray: Lr,
  ZodObject: Bt,
  ZodUnion: to,
  ZodDiscriminatedUnion: jc,
  ZodIntersection: ro,
  ZodTuple: un,
  ZodRecord: no,
  ZodMap: Pa,
  ZodSet: Ai,
  ZodFunction: Di,
  ZodLazy: io,
  ZodLiteral: so,
  ZodEnum: Zn,
  ZodNativeEnum: oo,
  ZodPromise: Qi,
  ZodEffects: Gr,
  ZodTransformer: Gr,
  ZodOptional: on,
  ZodNullable: Wn,
  ZodDefault: ao,
  ZodCatch: co,
  ZodNaN: ja,
  BRAND: Lm,
  ZodBranded: wf,
  ZodPipeline: Io,
  ZodReadonly: lo,
  custom: R0,
  Schema: Ge,
  ZodSchema: Ge,
  late: Hm,
  get ZodFirstPartyTypeKind() {
    return Ie;
  },
  coerce: S1,
  any: Ym,
  array: e1,
  bigint: Gm,
  boolean: $0,
  date: qm,
  discriminatedUnion: i1,
  effect: yd,
  enum: d1,
  function: u1,
  instanceof: Fm,
  intersection: s1,
  lazy: f1,
  literal: h1,
  map: c1,
  nan: zm,
  nativeEnum: p1,
  never: Xm,
  null: Wm,
  nullable: v1,
  number: D0,
  object: t1,
  oboolean: A1,
  onumber: x1,
  optional: g1,
  ostring: b1,
  pipeline: w1,
  preprocess: m1,
  promise: y1,
  record: a1,
  set: l1,
  strictObject: r1,
  string: U0,
  symbol: Km,
  transformer: yd,
  tuple: o1,
  undefined: Zm,
  union: n1,
  unknown: Jm,
  void: Qm,
  NEVER: _1,
  ZodIssueCode: F,
  quotelessJson: Sm,
  ZodError: _r
});
const Ra = new Uint8Array([48, 130, 2, 17, 48, 130, 1, 150, 160, 3, 2, 1, 2, 2, 17, 0, 249, 49, 117, 104, 27, 144, 175, 225, 29, 70, 204, 180, 228, 231, 248, 86, 48, 10, 6, 8, 42, 134, 72, 206, 61, 4, 3, 3, 48, 73, 49, 11, 48, 9, 6, 3, 85, 4, 6, 19, 2, 85, 83, 49, 15, 48, 13, 6, 3, 85, 4, 10, 12, 6, 65, 109, 97, 122, 111, 110, 49, 12, 48, 10, 6, 3, 85, 4, 11, 12, 3, 65, 87, 83, 49, 27, 48, 25, 6, 3, 85, 4, 3, 12, 18, 97, 119, 115, 46, 110, 105, 116, 114, 111, 45, 101, 110, 99, 108, 97, 118, 101, 115, 48, 30, 23, 13, 49, 57, 49, 48, 50, 56, 49, 51, 50, 56, 48, 53, 90, 23, 13, 52, 57, 49, 48, 50, 56, 49, 52, 50, 56, 48, 53, 90, 48, 73, 49, 11, 48, 9, 6, 3, 85, 4, 6, 19, 2, 85, 83, 49, 15, 48, 13, 6, 3, 85, 4, 10, 12, 6, 65, 109, 97, 122, 111, 110, 49, 12, 48, 10, 6, 3, 85, 4, 11, 12, 3, 65, 87, 83, 49, 27, 48, 25, 6, 3, 85, 4, 3, 12, 18, 97, 119, 115, 46, 110, 105, 116, 114, 111, 45, 101, 110, 99, 108, 97, 118, 101, 115, 48, 118, 48, 16, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 5, 43, 129, 4, 0, 34, 3, 98, 0, 4, 252, 2, 84, 235, 166, 8, 193, 243, 104, 112, 226, 154, 218, 144, 190, 70, 56, 50, 146, 115, 110, 137, 75, 255, 246, 114, 217, 137, 68, 75, 80, 81, 229, 52, 164, 177, 246, 219, 227, 192, 188, 88, 26, 50, 183, 177, 118, 7, 14, 222, 18, 214, 154, 63, 234, 33, 27, 102, 231, 82, 207, 125, 209, 221, 9, 95, 111, 19, 112, 244, 23, 8, 67, 217, 220, 16, 1, 33, 228, 207, 99, 1, 40, 9, 102, 68, 135, 201, 121, 98, 132, 48, 77, 197, 63, 244, 163, 66, 48, 64, 48, 15, 6, 3, 85, 29, 19, 1, 1, 255, 4, 5, 48, 3, 1, 1, 255, 48, 29, 6, 3, 85, 29, 14, 4, 22, 4, 20, 144, 37, 181, 13, 217, 5, 71, 231, 150, 195, 150, 250, 114, 157, 207, 153, 169, 223, 75, 150, 48, 14, 6, 3, 85, 29, 15, 1, 1, 255, 4, 4, 3, 2, 1, 134, 48, 10, 6, 8, 42, 134, 72, 206, 61, 4, 3, 3, 3, 105, 0, 48, 102, 2, 49, 0, 163, 127, 47, 145, 161, 201, 189, 94, 231, 184, 98, 124, 22, 152, 210, 85, 3, 142, 31, 3, 67, 249, 91, 99, 169, 98, 140, 61, 57, 128, 149, 69, 161, 30, 188, 191, 46, 59, 85, 216, 174, 238, 113, 180, 195, 214, 173, 243, 2, 49, 0, 162, 243, 155, 22, 5, 178, 112, 40, 165, 221, 75, 160, 105, 181, 1, 110, 101, 180, 251, 222, 143, 224, 6, 29, 106, 83, 25, 127, 156, 218, 245, 217, 67, 188, 97, 252, 43, 235, 3, 203, 111, 238, 141, 35, 2, 243, 223, 246]);
if (!Ra || Ra.length === 0)
  throw new Error("AWS root certificate is empty or not loaded correctly");
const E1 = Ct.object({
  module_id: Ct.string().min(1),
  digest: Ct.literal("SHA384"),
  timestamp: Ct.number().min(1677721600),
  pcrs: Ct.map(Ct.number(), Ct.instanceof(Uint8Array)),
  certificate: Ct.instanceof(Uint8Array),
  cabundle: Ct.array(Ct.instanceof(Uint8Array)),
  public_key: Ct.nullable(Ct.instanceof(Uint8Array)),
  user_data: Ct.nullable(Ct.instanceof(Uint8Array)),
  nonce: Ct.nullable(Ct.instanceof(Uint8Array))
}), I1 = Ct.object({
  protected: Ct.instanceof(Uint8Array),
  // There's an "unprotected" header in the CBOR, but we never use it
  payload: Ct.instanceof(Uint8Array),
  signature: Ct.instanceof(Uint8Array)
});
async function k1(r) {
  try {
    if (!r)
      throw new Error("Attestation document is empty.");
    const e = js(r), t = ka(e), n = t[0], i = t[2], s = t[3];
    return I1.parse({
      protected: n,
      payload: i,
      signature: s
    });
  } catch (e) {
    throw console.error("Error parsing document data:", e), new Error("Failed to parse document data.");
  }
}
async function C1(r) {
  try {
    const e = ka(r);
    return E1.parse(e);
  } catch (e) {
    throw console.error("Error parsing document payload:", e), new Error("Failed to parse document payload.");
  }
}
function B1(r, e) {
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
  return Pc(t);
}
async function O1(r, e) {
  try {
    console.log("SIGNATURE:"), console.log(Br(r.signature));
    const t = B1(r.protected, r.payload), n = await crypto.subtle.digest("SHA-384", t);
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
async function Si(r, e, t) {
  try {
    const n = await k1(r), i = await C1(n.payload);
    if (!i.nonce)
      throw new Error("Attestation document does not have a nonce.");
    const o = new TextDecoder("utf-8").decode(i.nonce);
    if (t !== o)
      throw console.log("Nonce mismatch"), console.log("Provided nonce:", t), console.log("Attestation document nonce:", o), new Error("Attestation document's nonce does not match the provided nonce.");
    const c = [], u = Br(i.cabundle[0]);
    if (u !== Br(e))
      throw console.error("Root cert doesn't match first cert"), console.log("First cert base64:", u), console.log("Trusted root cert base64:", Br(e)), new Error("Root cert does not match first cert in attestation document.");
    for (let I = 0; I < i.cabundle.length; I++) {
      const U = new wi(i.cabundle[I]);
      c.push(U);
    }
    const h = new wi(i.certificate), x = await new Wv({
      certificates: c
    }).build(h);
    console.log("Chain items:", x);
    const N = (/* @__PURE__ */ new Date()).getTime();
    for (let I = 0; I < x.length; I++) {
      const U = x[I];
      if (console.log("CERT: ", I), console.log(U.subject), console.log("Not before:", U.notBefore), console.log("Not after:", U.notAfter), console.log(U.toString("pem")), U.notBefore.getTime() > N || U.notAfter.getTime() < N)
        throw new Error("Certificate is expired.");
      console.log(`Certificate ${I} is not expired.`);
    }
    if (x.length !== i.cabundle.length + 1)
      throw new Error("Certificate chain length does not match length of cabundle.");
    const v = h.publicKey;
    console.log("PUBLIC KEY:"), console.log(Br(new Uint8Array(v.rawData)));
    const A = await v.export(), O = await O1(n, A);
    if (console.log("Signature verified:", O), !O)
      throw new Error("Signature verification failed.");
    return i;
  } catch (n) {
    throw console.error("Error verifying attestation document:", n), n;
  }
}
const T1 = Ct.object({
  public_key: Ct.nullable(Ct.instanceof(Uint8Array))
});
async function N1(r) {
  const e = js(r), n = ka(e)[2], i = ka(n);
  return await T1.parse(i);
}
async function P1(r, e) {
  try {
    const t = await Q1(r, e), n = e || yy();
    return n && (n === "http://127.0.0.1:3000" || n === "http://localhost:3000" || n === "http://0.0.0.0:3000") ? (console.log("DEV MODE: Using fake attestation document"), await N1(t)) : await Si(t, Ra, r);
  } catch (t) {
    throw t instanceof Error ? (console.error("Error verifying attestation document:", t), new Error(`Couldn't process attestation document: ${t.message}`)) : (console.error("Error verifying attestation document:", t), new Error("Couldn't process attestation document."));
  }
}
function j1(r) {
  throw new Error('Could not dynamically require "' + r + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var M0 = { exports: {} };
const R1 = {}, U1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: R1
}, Symbol.toStringTag, { value: "Module" })), D1 = /* @__PURE__ */ eg(U1);
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
    var o = t(), c = t([1]), u = t([56129, 1]), h = t([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]), w = t([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]), x = t([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]), q = t([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]), N = t([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);
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
    function U(l, p, d, a) {
      for (var g = a[0] & 255 | (a[1] & 255) << 8 | (a[2] & 255) << 16 | (a[3] & 255) << 24, S = d[0] & 255 | (d[1] & 255) << 8 | (d[2] & 255) << 16 | (d[3] & 255) << 24, E = d[4] & 255 | (d[5] & 255) << 8 | (d[6] & 255) << 16 | (d[7] & 255) << 24, j = d[8] & 255 | (d[9] & 255) << 8 | (d[10] & 255) << 16 | (d[11] & 255) << 24, z = d[12] & 255 | (d[13] & 255) << 8 | (d[14] & 255) << 16 | (d[15] & 255) << 24, we = a[4] & 255 | (a[5] & 255) << 8 | (a[6] & 255) << 16 | (a[7] & 255) << 24, Q = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, lt = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, le = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, Ce = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, Be = a[8] & 255 | (a[9] & 255) << 8 | (a[10] & 255) << 16 | (a[11] & 255) << 24, $e = d[16] & 255 | (d[17] & 255) << 8 | (d[18] & 255) << 16 | (d[19] & 255) << 24, Re = d[20] & 255 | (d[21] & 255) << 8 | (d[22] & 255) << 16 | (d[23] & 255) << 24, Oe = d[24] & 255 | (d[25] & 255) << 8 | (d[26] & 255) << 16 | (d[27] & 255) << 24, Pe = d[28] & 255 | (d[29] & 255) << 8 | (d[30] & 255) << 16 | (d[31] & 255) << 24, Te = a[12] & 255 | (a[13] & 255) << 8 | (a[14] & 255) << 16 | (a[15] & 255) << 24, de = g, Ae = S, ie = E, ye = j, ve = z, X = we, C = Q, B = lt, V = le, P = Ce, R = Be, L = $e, _e = Re, Me = Oe, Fe = Pe, Ve = Te, m, Ze = 0; Ze < 20; Ze += 2)
        m = de + _e | 0, ve ^= m << 7 | m >>> 25, m = ve + de | 0, V ^= m << 9 | m >>> 23, m = V + ve | 0, _e ^= m << 13 | m >>> 19, m = _e + V | 0, de ^= m << 18 | m >>> 14, m = X + Ae | 0, P ^= m << 7 | m >>> 25, m = P + X | 0, Me ^= m << 9 | m >>> 23, m = Me + P | 0, Ae ^= m << 13 | m >>> 19, m = Ae + Me | 0, X ^= m << 18 | m >>> 14, m = R + C | 0, Fe ^= m << 7 | m >>> 25, m = Fe + R | 0, ie ^= m << 9 | m >>> 23, m = ie + Fe | 0, C ^= m << 13 | m >>> 19, m = C + ie | 0, R ^= m << 18 | m >>> 14, m = Ve + L | 0, ye ^= m << 7 | m >>> 25, m = ye + Ve | 0, B ^= m << 9 | m >>> 23, m = B + ye | 0, L ^= m << 13 | m >>> 19, m = L + B | 0, Ve ^= m << 18 | m >>> 14, m = de + ye | 0, Ae ^= m << 7 | m >>> 25, m = Ae + de | 0, ie ^= m << 9 | m >>> 23, m = ie + Ae | 0, ye ^= m << 13 | m >>> 19, m = ye + ie | 0, de ^= m << 18 | m >>> 14, m = X + ve | 0, C ^= m << 7 | m >>> 25, m = C + X | 0, B ^= m << 9 | m >>> 23, m = B + C | 0, ve ^= m << 13 | m >>> 19, m = ve + B | 0, X ^= m << 18 | m >>> 14, m = R + P | 0, L ^= m << 7 | m >>> 25, m = L + R | 0, V ^= m << 9 | m >>> 23, m = V + L | 0, P ^= m << 13 | m >>> 19, m = P + V | 0, R ^= m << 18 | m >>> 14, m = Ve + Fe | 0, _e ^= m << 7 | m >>> 25, m = _e + Ve | 0, Me ^= m << 9 | m >>> 23, m = Me + _e | 0, Fe ^= m << 13 | m >>> 19, m = Fe + Me | 0, Ve ^= m << 18 | m >>> 14;
      de = de + g | 0, Ae = Ae + S | 0, ie = ie + E | 0, ye = ye + j | 0, ve = ve + z | 0, X = X + we | 0, C = C + Q | 0, B = B + lt | 0, V = V + le | 0, P = P + Ce | 0, R = R + Be | 0, L = L + $e | 0, _e = _e + Re | 0, Me = Me + Oe | 0, Fe = Fe + Pe | 0, Ve = Ve + Te | 0, l[0] = de >>> 0 & 255, l[1] = de >>> 8 & 255, l[2] = de >>> 16 & 255, l[3] = de >>> 24 & 255, l[4] = Ae >>> 0 & 255, l[5] = Ae >>> 8 & 255, l[6] = Ae >>> 16 & 255, l[7] = Ae >>> 24 & 255, l[8] = ie >>> 0 & 255, l[9] = ie >>> 8 & 255, l[10] = ie >>> 16 & 255, l[11] = ie >>> 24 & 255, l[12] = ye >>> 0 & 255, l[13] = ye >>> 8 & 255, l[14] = ye >>> 16 & 255, l[15] = ye >>> 24 & 255, l[16] = ve >>> 0 & 255, l[17] = ve >>> 8 & 255, l[18] = ve >>> 16 & 255, l[19] = ve >>> 24 & 255, l[20] = X >>> 0 & 255, l[21] = X >>> 8 & 255, l[22] = X >>> 16 & 255, l[23] = X >>> 24 & 255, l[24] = C >>> 0 & 255, l[25] = C >>> 8 & 255, l[26] = C >>> 16 & 255, l[27] = C >>> 24 & 255, l[28] = B >>> 0 & 255, l[29] = B >>> 8 & 255, l[30] = B >>> 16 & 255, l[31] = B >>> 24 & 255, l[32] = V >>> 0 & 255, l[33] = V >>> 8 & 255, l[34] = V >>> 16 & 255, l[35] = V >>> 24 & 255, l[36] = P >>> 0 & 255, l[37] = P >>> 8 & 255, l[38] = P >>> 16 & 255, l[39] = P >>> 24 & 255, l[40] = R >>> 0 & 255, l[41] = R >>> 8 & 255, l[42] = R >>> 16 & 255, l[43] = R >>> 24 & 255, l[44] = L >>> 0 & 255, l[45] = L >>> 8 & 255, l[46] = L >>> 16 & 255, l[47] = L >>> 24 & 255, l[48] = _e >>> 0 & 255, l[49] = _e >>> 8 & 255, l[50] = _e >>> 16 & 255, l[51] = _e >>> 24 & 255, l[52] = Me >>> 0 & 255, l[53] = Me >>> 8 & 255, l[54] = Me >>> 16 & 255, l[55] = Me >>> 24 & 255, l[56] = Fe >>> 0 & 255, l[57] = Fe >>> 8 & 255, l[58] = Fe >>> 16 & 255, l[59] = Fe >>> 24 & 255, l[60] = Ve >>> 0 & 255, l[61] = Ve >>> 8 & 255, l[62] = Ve >>> 16 & 255, l[63] = Ve >>> 24 & 255;
    }
    function D(l, p, d, a) {
      for (var g = a[0] & 255 | (a[1] & 255) << 8 | (a[2] & 255) << 16 | (a[3] & 255) << 24, S = d[0] & 255 | (d[1] & 255) << 8 | (d[2] & 255) << 16 | (d[3] & 255) << 24, E = d[4] & 255 | (d[5] & 255) << 8 | (d[6] & 255) << 16 | (d[7] & 255) << 24, j = d[8] & 255 | (d[9] & 255) << 8 | (d[10] & 255) << 16 | (d[11] & 255) << 24, z = d[12] & 255 | (d[13] & 255) << 8 | (d[14] & 255) << 16 | (d[15] & 255) << 24, we = a[4] & 255 | (a[5] & 255) << 8 | (a[6] & 255) << 16 | (a[7] & 255) << 24, Q = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, lt = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, le = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, Ce = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, Be = a[8] & 255 | (a[9] & 255) << 8 | (a[10] & 255) << 16 | (a[11] & 255) << 24, $e = d[16] & 255 | (d[17] & 255) << 8 | (d[18] & 255) << 16 | (d[19] & 255) << 24, Re = d[20] & 255 | (d[21] & 255) << 8 | (d[22] & 255) << 16 | (d[23] & 255) << 24, Oe = d[24] & 255 | (d[25] & 255) << 8 | (d[26] & 255) << 16 | (d[27] & 255) << 24, Pe = d[28] & 255 | (d[29] & 255) << 8 | (d[30] & 255) << 16 | (d[31] & 255) << 24, Te = a[12] & 255 | (a[13] & 255) << 8 | (a[14] & 255) << 16 | (a[15] & 255) << 24, de = g, Ae = S, ie = E, ye = j, ve = z, X = we, C = Q, B = lt, V = le, P = Ce, R = Be, L = $e, _e = Re, Me = Oe, Fe = Pe, Ve = Te, m, Ze = 0; Ze < 20; Ze += 2)
        m = de + _e | 0, ve ^= m << 7 | m >>> 25, m = ve + de | 0, V ^= m << 9 | m >>> 23, m = V + ve | 0, _e ^= m << 13 | m >>> 19, m = _e + V | 0, de ^= m << 18 | m >>> 14, m = X + Ae | 0, P ^= m << 7 | m >>> 25, m = P + X | 0, Me ^= m << 9 | m >>> 23, m = Me + P | 0, Ae ^= m << 13 | m >>> 19, m = Ae + Me | 0, X ^= m << 18 | m >>> 14, m = R + C | 0, Fe ^= m << 7 | m >>> 25, m = Fe + R | 0, ie ^= m << 9 | m >>> 23, m = ie + Fe | 0, C ^= m << 13 | m >>> 19, m = C + ie | 0, R ^= m << 18 | m >>> 14, m = Ve + L | 0, ye ^= m << 7 | m >>> 25, m = ye + Ve | 0, B ^= m << 9 | m >>> 23, m = B + ye | 0, L ^= m << 13 | m >>> 19, m = L + B | 0, Ve ^= m << 18 | m >>> 14, m = de + ye | 0, Ae ^= m << 7 | m >>> 25, m = Ae + de | 0, ie ^= m << 9 | m >>> 23, m = ie + Ae | 0, ye ^= m << 13 | m >>> 19, m = ye + ie | 0, de ^= m << 18 | m >>> 14, m = X + ve | 0, C ^= m << 7 | m >>> 25, m = C + X | 0, B ^= m << 9 | m >>> 23, m = B + C | 0, ve ^= m << 13 | m >>> 19, m = ve + B | 0, X ^= m << 18 | m >>> 14, m = R + P | 0, L ^= m << 7 | m >>> 25, m = L + R | 0, V ^= m << 9 | m >>> 23, m = V + L | 0, P ^= m << 13 | m >>> 19, m = P + V | 0, R ^= m << 18 | m >>> 14, m = Ve + Fe | 0, _e ^= m << 7 | m >>> 25, m = _e + Ve | 0, Me ^= m << 9 | m >>> 23, m = Me + _e | 0, Fe ^= m << 13 | m >>> 19, m = Fe + Me | 0, Ve ^= m << 18 | m >>> 14;
      l[0] = de >>> 0 & 255, l[1] = de >>> 8 & 255, l[2] = de >>> 16 & 255, l[3] = de >>> 24 & 255, l[4] = X >>> 0 & 255, l[5] = X >>> 8 & 255, l[6] = X >>> 16 & 255, l[7] = X >>> 24 & 255, l[8] = R >>> 0 & 255, l[9] = R >>> 8 & 255, l[10] = R >>> 16 & 255, l[11] = R >>> 24 & 255, l[12] = Ve >>> 0 & 255, l[13] = Ve >>> 8 & 255, l[14] = Ve >>> 16 & 255, l[15] = Ve >>> 24 & 255, l[16] = C >>> 0 & 255, l[17] = C >>> 8 & 255, l[18] = C >>> 16 & 255, l[19] = C >>> 24 & 255, l[20] = B >>> 0 & 255, l[21] = B >>> 8 & 255, l[22] = B >>> 16 & 255, l[23] = B >>> 24 & 255, l[24] = V >>> 0 & 255, l[25] = V >>> 8 & 255, l[26] = V >>> 16 & 255, l[27] = V >>> 24 & 255, l[28] = P >>> 0 & 255, l[29] = P >>> 8 & 255, l[30] = P >>> 16 & 255, l[31] = P >>> 24 & 255;
    }
    function be(l, p, d, a) {
      U(l, p, d, a);
    }
    function et(l, p, d, a) {
      D(l, p, d, a);
    }
    var Ke = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
    function K(l, p, d, a, g, S, E) {
      var j = new Uint8Array(16), z = new Uint8Array(64), we, Q;
      for (Q = 0; Q < 16; Q++) j[Q] = 0;
      for (Q = 0; Q < 8; Q++) j[Q] = S[Q];
      for (; g >= 64; ) {
        for (be(z, j, E, Ke), Q = 0; Q < 64; Q++) l[p + Q] = d[a + Q] ^ z[Q];
        for (we = 1, Q = 8; Q < 16; Q++)
          we = we + (j[Q] & 255) | 0, j[Q] = we & 255, we >>>= 8;
        g -= 64, p += 64, a += 64;
      }
      if (g > 0)
        for (be(z, j, E, Ke), Q = 0; Q < g; Q++) l[p + Q] = d[a + Q] ^ z[Q];
      return 0;
    }
    function W(l, p, d, a, g) {
      var S = new Uint8Array(16), E = new Uint8Array(64), j, z;
      for (z = 0; z < 16; z++) S[z] = 0;
      for (z = 0; z < 8; z++) S[z] = a[z];
      for (; d >= 64; ) {
        for (be(E, S, g, Ke), z = 0; z < 64; z++) l[p + z] = E[z];
        for (j = 1, z = 8; z < 16; z++)
          j = j + (S[z] & 255) | 0, S[z] = j & 255, j >>>= 8;
        d -= 64, p += 64;
      }
      if (d > 0)
        for (be(E, S, g, Ke), z = 0; z < d; z++) l[p + z] = E[z];
      return 0;
    }
    function te(l, p, d, a, g) {
      var S = new Uint8Array(32);
      et(S, a, g, Ke);
      for (var E = new Uint8Array(8), j = 0; j < 8; j++) E[j] = a[j + 16];
      return W(l, p, d, E, S);
    }
    function pe(l, p, d, a, g, S, E) {
      var j = new Uint8Array(32);
      et(j, S, E, Ke);
      for (var z = new Uint8Array(8), we = 0; we < 8; we++) z[we] = S[we + 16];
      return K(l, p, d, a, g, z, j);
    }
    var Xe = function(l) {
      this.buffer = new Uint8Array(16), this.r = new Uint16Array(10), this.h = new Uint16Array(10), this.pad = new Uint16Array(8), this.leftover = 0, this.fin = 0;
      var p, d, a, g, S, E, j, z;
      p = l[0] & 255 | (l[1] & 255) << 8, this.r[0] = p & 8191, d = l[2] & 255 | (l[3] & 255) << 8, this.r[1] = (p >>> 13 | d << 3) & 8191, a = l[4] & 255 | (l[5] & 255) << 8, this.r[2] = (d >>> 10 | a << 6) & 7939, g = l[6] & 255 | (l[7] & 255) << 8, this.r[3] = (a >>> 7 | g << 9) & 8191, S = l[8] & 255 | (l[9] & 255) << 8, this.r[4] = (g >>> 4 | S << 12) & 255, this.r[5] = S >>> 1 & 8190, E = l[10] & 255 | (l[11] & 255) << 8, this.r[6] = (S >>> 14 | E << 2) & 8191, j = l[12] & 255 | (l[13] & 255) << 8, this.r[7] = (E >>> 11 | j << 5) & 8065, z = l[14] & 255 | (l[15] & 255) << 8, this.r[8] = (j >>> 8 | z << 8) & 8191, this.r[9] = z >>> 5 & 127, this.pad[0] = l[16] & 255 | (l[17] & 255) << 8, this.pad[1] = l[18] & 255 | (l[19] & 255) << 8, this.pad[2] = l[20] & 255 | (l[21] & 255) << 8, this.pad[3] = l[22] & 255 | (l[23] & 255) << 8, this.pad[4] = l[24] & 255 | (l[25] & 255) << 8, this.pad[5] = l[26] & 255 | (l[27] & 255) << 8, this.pad[6] = l[28] & 255 | (l[29] & 255) << 8, this.pad[7] = l[30] & 255 | (l[31] & 255) << 8;
    };
    Xe.prototype.blocks = function(l, p, d) {
      for (var a = this.fin ? 0 : 2048, g, S, E, j, z, we, Q, lt, le, Ce, Be, $e, Re, Oe, Pe, Te, de, Ae, ie, ye = this.h[0], ve = this.h[1], X = this.h[2], C = this.h[3], B = this.h[4], V = this.h[5], P = this.h[6], R = this.h[7], L = this.h[8], _e = this.h[9], Me = this.r[0], Fe = this.r[1], Ve = this.r[2], m = this.r[3], Ze = this.r[4], ut = this.r[5], ft = this.r[6], ze = this.r[7], st = this.r[8], ot = this.r[9]; d >= 16; )
        g = l[p + 0] & 255 | (l[p + 1] & 255) << 8, ye += g & 8191, S = l[p + 2] & 255 | (l[p + 3] & 255) << 8, ve += (g >>> 13 | S << 3) & 8191, E = l[p + 4] & 255 | (l[p + 5] & 255) << 8, X += (S >>> 10 | E << 6) & 8191, j = l[p + 6] & 255 | (l[p + 7] & 255) << 8, C += (E >>> 7 | j << 9) & 8191, z = l[p + 8] & 255 | (l[p + 9] & 255) << 8, B += (j >>> 4 | z << 12) & 8191, V += z >>> 1 & 8191, we = l[p + 10] & 255 | (l[p + 11] & 255) << 8, P += (z >>> 14 | we << 2) & 8191, Q = l[p + 12] & 255 | (l[p + 13] & 255) << 8, R += (we >>> 11 | Q << 5) & 8191, lt = l[p + 14] & 255 | (l[p + 15] & 255) << 8, L += (Q >>> 8 | lt << 8) & 8191, _e += lt >>> 5 | a, le = 0, Ce = le, Ce += ye * Me, Ce += ve * (5 * ot), Ce += X * (5 * st), Ce += C * (5 * ze), Ce += B * (5 * ft), le = Ce >>> 13, Ce &= 8191, Ce += V * (5 * ut), Ce += P * (5 * Ze), Ce += R * (5 * m), Ce += L * (5 * Ve), Ce += _e * (5 * Fe), le += Ce >>> 13, Ce &= 8191, Be = le, Be += ye * Fe, Be += ve * Me, Be += X * (5 * ot), Be += C * (5 * st), Be += B * (5 * ze), le = Be >>> 13, Be &= 8191, Be += V * (5 * ft), Be += P * (5 * ut), Be += R * (5 * Ze), Be += L * (5 * m), Be += _e * (5 * Ve), le += Be >>> 13, Be &= 8191, $e = le, $e += ye * Ve, $e += ve * Fe, $e += X * Me, $e += C * (5 * ot), $e += B * (5 * st), le = $e >>> 13, $e &= 8191, $e += V * (5 * ze), $e += P * (5 * ft), $e += R * (5 * ut), $e += L * (5 * Ze), $e += _e * (5 * m), le += $e >>> 13, $e &= 8191, Re = le, Re += ye * m, Re += ve * Ve, Re += X * Fe, Re += C * Me, Re += B * (5 * ot), le = Re >>> 13, Re &= 8191, Re += V * (5 * st), Re += P * (5 * ze), Re += R * (5 * ft), Re += L * (5 * ut), Re += _e * (5 * Ze), le += Re >>> 13, Re &= 8191, Oe = le, Oe += ye * Ze, Oe += ve * m, Oe += X * Ve, Oe += C * Fe, Oe += B * Me, le = Oe >>> 13, Oe &= 8191, Oe += V * (5 * ot), Oe += P * (5 * st), Oe += R * (5 * ze), Oe += L * (5 * ft), Oe += _e * (5 * ut), le += Oe >>> 13, Oe &= 8191, Pe = le, Pe += ye * ut, Pe += ve * Ze, Pe += X * m, Pe += C * Ve, Pe += B * Fe, le = Pe >>> 13, Pe &= 8191, Pe += V * Me, Pe += P * (5 * ot), Pe += R * (5 * st), Pe += L * (5 * ze), Pe += _e * (5 * ft), le += Pe >>> 13, Pe &= 8191, Te = le, Te += ye * ft, Te += ve * ut, Te += X * Ze, Te += C * m, Te += B * Ve, le = Te >>> 13, Te &= 8191, Te += V * Fe, Te += P * Me, Te += R * (5 * ot), Te += L * (5 * st), Te += _e * (5 * ze), le += Te >>> 13, Te &= 8191, de = le, de += ye * ze, de += ve * ft, de += X * ut, de += C * Ze, de += B * m, le = de >>> 13, de &= 8191, de += V * Ve, de += P * Fe, de += R * Me, de += L * (5 * ot), de += _e * (5 * st), le += de >>> 13, de &= 8191, Ae = le, Ae += ye * st, Ae += ve * ze, Ae += X * ft, Ae += C * ut, Ae += B * Ze, le = Ae >>> 13, Ae &= 8191, Ae += V * m, Ae += P * Ve, Ae += R * Fe, Ae += L * Me, Ae += _e * (5 * ot), le += Ae >>> 13, Ae &= 8191, ie = le, ie += ye * ot, ie += ve * st, ie += X * ze, ie += C * ft, ie += B * ut, le = ie >>> 13, ie &= 8191, ie += V * Ze, ie += P * m, ie += R * Ve, ie += L * Fe, ie += _e * Me, le += ie >>> 13, ie &= 8191, le = (le << 2) + le | 0, le = le + Ce | 0, Ce = le & 8191, le = le >>> 13, Be += le, ye = Ce, ve = Be, X = $e, C = Re, B = Oe, V = Pe, P = Te, R = de, L = Ae, _e = ie, p += 16, d -= 16;
      this.h[0] = ye, this.h[1] = ve, this.h[2] = X, this.h[3] = C, this.h[4] = B, this.h[5] = V, this.h[6] = P, this.h[7] = R, this.h[8] = L, this.h[9] = _e;
    }, Xe.prototype.finish = function(l, p) {
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
    }, Xe.prototype.update = function(l, p, d) {
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
    function xt(l, p, d, a, g, S) {
      var E = new Xe(S);
      return E.update(d, a, g), E.finish(l, p), 0;
    }
    function Tt(l, p, d, a, g, S) {
      var E = new Uint8Array(16);
      return xt(E, 0, d, a, g, S), O(l, p, E, 0);
    }
    function Et(l, p, d, a, g) {
      var S;
      if (d < 32) return -1;
      for (pe(l, 0, p, 0, d, a, g), xt(l, 16, l, 32, d - 32, l), S = 0; S < 16; S++) l[S] = 0;
      return 0;
    }
    function ht(l, p, d, a, g) {
      var S, E = new Uint8Array(32);
      if (d < 32 || (te(E, 0, 32, a, g), Tt(p, 16, p, 32, d - 32, E) !== 0)) return -1;
      for (pe(l, 0, p, 0, d, a, g), S = 0; S < 32; S++) l[S] = 0;
      return 0;
    }
    function Je(l, p) {
      var d;
      for (d = 0; d < 16; d++) l[d] = p[d] | 0;
    }
    function ae(l) {
      var p, d, a = 1;
      for (p = 0; p < 16; p++)
        d = l[p] + a + 65535, a = Math.floor(d / 65536), l[p] = d - a * 65536;
      l[0] += a - 1 + 37 * (a - 1);
    }
    function Ee(l, p, d) {
      for (var a, g = ~(d - 1), S = 0; S < 16; S++)
        a = g & (l[S] ^ p[S]), l[S] ^= a, p[S] ^= a;
    }
    function yt(l, p) {
      var d, a, g, S = t(), E = t();
      for (d = 0; d < 16; d++) E[d] = p[d];
      for (ae(E), ae(E), ae(E), a = 0; a < 2; a++) {
        for (S[0] = E[0] - 65517, d = 1; d < 15; d++)
          S[d] = E[d] - 65535 - (S[d - 1] >> 16 & 1), S[d - 1] &= 65535;
        S[15] = E[15] - 32767 - (S[14] >> 16 & 1), g = S[15] >> 16 & 1, S[14] &= 65535, Ee(E, S, 1 - g);
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
    function ue(l, p) {
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
    function re(l, p, d) {
      var a, g, S = 0, E = 0, j = 0, z = 0, we = 0, Q = 0, lt = 0, le = 0, Ce = 0, Be = 0, $e = 0, Re = 0, Oe = 0, Pe = 0, Te = 0, de = 0, Ae = 0, ie = 0, ye = 0, ve = 0, X = 0, C = 0, B = 0, V = 0, P = 0, R = 0, L = 0, _e = 0, Me = 0, Fe = 0, Ve = 0, m = d[0], Ze = d[1], ut = d[2], ft = d[3], ze = d[4], st = d[5], ot = d[6], $t = d[7], mt = d[8], Nt = d[9], Pt = d[10], jt = d[11], Lt = d[12], Qt = d[13], er = d[14], tr = d[15];
      a = p[0], S += a * m, E += a * Ze, j += a * ut, z += a * ft, we += a * ze, Q += a * st, lt += a * ot, le += a * $t, Ce += a * mt, Be += a * Nt, $e += a * Pt, Re += a * jt, Oe += a * Lt, Pe += a * Qt, Te += a * er, de += a * tr, a = p[1], E += a * m, j += a * Ze, z += a * ut, we += a * ft, Q += a * ze, lt += a * st, le += a * ot, Ce += a * $t, Be += a * mt, $e += a * Nt, Re += a * Pt, Oe += a * jt, Pe += a * Lt, Te += a * Qt, de += a * er, Ae += a * tr, a = p[2], j += a * m, z += a * Ze, we += a * ut, Q += a * ft, lt += a * ze, le += a * st, Ce += a * ot, Be += a * $t, $e += a * mt, Re += a * Nt, Oe += a * Pt, Pe += a * jt, Te += a * Lt, de += a * Qt, Ae += a * er, ie += a * tr, a = p[3], z += a * m, we += a * Ze, Q += a * ut, lt += a * ft, le += a * ze, Ce += a * st, Be += a * ot, $e += a * $t, Re += a * mt, Oe += a * Nt, Pe += a * Pt, Te += a * jt, de += a * Lt, Ae += a * Qt, ie += a * er, ye += a * tr, a = p[4], we += a * m, Q += a * Ze, lt += a * ut, le += a * ft, Ce += a * ze, Be += a * st, $e += a * ot, Re += a * $t, Oe += a * mt, Pe += a * Nt, Te += a * Pt, de += a * jt, Ae += a * Lt, ie += a * Qt, ye += a * er, ve += a * tr, a = p[5], Q += a * m, lt += a * Ze, le += a * ut, Ce += a * ft, Be += a * ze, $e += a * st, Re += a * ot, Oe += a * $t, Pe += a * mt, Te += a * Nt, de += a * Pt, Ae += a * jt, ie += a * Lt, ye += a * Qt, ve += a * er, X += a * tr, a = p[6], lt += a * m, le += a * Ze, Ce += a * ut, Be += a * ft, $e += a * ze, Re += a * st, Oe += a * ot, Pe += a * $t, Te += a * mt, de += a * Nt, Ae += a * Pt, ie += a * jt, ye += a * Lt, ve += a * Qt, X += a * er, C += a * tr, a = p[7], le += a * m, Ce += a * Ze, Be += a * ut, $e += a * ft, Re += a * ze, Oe += a * st, Pe += a * ot, Te += a * $t, de += a * mt, Ae += a * Nt, ie += a * Pt, ye += a * jt, ve += a * Lt, X += a * Qt, C += a * er, B += a * tr, a = p[8], Ce += a * m, Be += a * Ze, $e += a * ut, Re += a * ft, Oe += a * ze, Pe += a * st, Te += a * ot, de += a * $t, Ae += a * mt, ie += a * Nt, ye += a * Pt, ve += a * jt, X += a * Lt, C += a * Qt, B += a * er, V += a * tr, a = p[9], Be += a * m, $e += a * Ze, Re += a * ut, Oe += a * ft, Pe += a * ze, Te += a * st, de += a * ot, Ae += a * $t, ie += a * mt, ye += a * Nt, ve += a * Pt, X += a * jt, C += a * Lt, B += a * Qt, V += a * er, P += a * tr, a = p[10], $e += a * m, Re += a * Ze, Oe += a * ut, Pe += a * ft, Te += a * ze, de += a * st, Ae += a * ot, ie += a * $t, ye += a * mt, ve += a * Nt, X += a * Pt, C += a * jt, B += a * Lt, V += a * Qt, P += a * er, R += a * tr, a = p[11], Re += a * m, Oe += a * Ze, Pe += a * ut, Te += a * ft, de += a * ze, Ae += a * st, ie += a * ot, ye += a * $t, ve += a * mt, X += a * Nt, C += a * Pt, B += a * jt, V += a * Lt, P += a * Qt, R += a * er, L += a * tr, a = p[12], Oe += a * m, Pe += a * Ze, Te += a * ut, de += a * ft, Ae += a * ze, ie += a * st, ye += a * ot, ve += a * $t, X += a * mt, C += a * Nt, B += a * Pt, V += a * jt, P += a * Lt, R += a * Qt, L += a * er, _e += a * tr, a = p[13], Pe += a * m, Te += a * Ze, de += a * ut, Ae += a * ft, ie += a * ze, ye += a * st, ve += a * ot, X += a * $t, C += a * mt, B += a * Nt, V += a * Pt, P += a * jt, R += a * Lt, L += a * Qt, _e += a * er, Me += a * tr, a = p[14], Te += a * m, de += a * Ze, Ae += a * ut, ie += a * ft, ye += a * ze, ve += a * st, X += a * ot, C += a * $t, B += a * mt, V += a * Nt, P += a * Pt, R += a * jt, L += a * Lt, _e += a * Qt, Me += a * er, Fe += a * tr, a = p[15], de += a * m, Ae += a * Ze, ie += a * ut, ye += a * ft, ve += a * ze, X += a * st, C += a * ot, B += a * $t, V += a * mt, P += a * Nt, R += a * Pt, L += a * jt, _e += a * Lt, Me += a * Qt, Fe += a * er, Ve += a * tr, S += 38 * Ae, E += 38 * ie, j += 38 * ye, z += 38 * ve, we += 38 * X, Q += 38 * C, lt += 38 * B, le += 38 * V, Ce += 38 * P, Be += 38 * R, $e += 38 * L, Re += 38 * _e, Oe += 38 * Me, Pe += 38 * Fe, Te += 38 * Ve, g = 1, a = S + g + 65535, g = Math.floor(a / 65536), S = a - g * 65536, a = E + g + 65535, g = Math.floor(a / 65536), E = a - g * 65536, a = j + g + 65535, g = Math.floor(a / 65536), j = a - g * 65536, a = z + g + 65535, g = Math.floor(a / 65536), z = a - g * 65536, a = we + g + 65535, g = Math.floor(a / 65536), we = a - g * 65536, a = Q + g + 65535, g = Math.floor(a / 65536), Q = a - g * 65536, a = lt + g + 65535, g = Math.floor(a / 65536), lt = a - g * 65536, a = le + g + 65535, g = Math.floor(a / 65536), le = a - g * 65536, a = Ce + g + 65535, g = Math.floor(a / 65536), Ce = a - g * 65536, a = Be + g + 65535, g = Math.floor(a / 65536), Be = a - g * 65536, a = $e + g + 65535, g = Math.floor(a / 65536), $e = a - g * 65536, a = Re + g + 65535, g = Math.floor(a / 65536), Re = a - g * 65536, a = Oe + g + 65535, g = Math.floor(a / 65536), Oe = a - g * 65536, a = Pe + g + 65535, g = Math.floor(a / 65536), Pe = a - g * 65536, a = Te + g + 65535, g = Math.floor(a / 65536), Te = a - g * 65536, a = de + g + 65535, g = Math.floor(a / 65536), de = a - g * 65536, S += g - 1 + 37 * (g - 1), g = 1, a = S + g + 65535, g = Math.floor(a / 65536), S = a - g * 65536, a = E + g + 65535, g = Math.floor(a / 65536), E = a - g * 65536, a = j + g + 65535, g = Math.floor(a / 65536), j = a - g * 65536, a = z + g + 65535, g = Math.floor(a / 65536), z = a - g * 65536, a = we + g + 65535, g = Math.floor(a / 65536), we = a - g * 65536, a = Q + g + 65535, g = Math.floor(a / 65536), Q = a - g * 65536, a = lt + g + 65535, g = Math.floor(a / 65536), lt = a - g * 65536, a = le + g + 65535, g = Math.floor(a / 65536), le = a - g * 65536, a = Ce + g + 65535, g = Math.floor(a / 65536), Ce = a - g * 65536, a = Be + g + 65535, g = Math.floor(a / 65536), Be = a - g * 65536, a = $e + g + 65535, g = Math.floor(a / 65536), $e = a - g * 65536, a = Re + g + 65535, g = Math.floor(a / 65536), Re = a - g * 65536, a = Oe + g + 65535, g = Math.floor(a / 65536), Oe = a - g * 65536, a = Pe + g + 65535, g = Math.floor(a / 65536), Pe = a - g * 65536, a = Te + g + 65535, g = Math.floor(a / 65536), Te = a - g * 65536, a = de + g + 65535, g = Math.floor(a / 65536), de = a - g * 65536, S += g - 1 + 37 * (g - 1), l[0] = S, l[1] = E, l[2] = j, l[3] = z, l[4] = we, l[5] = Q, l[6] = lt, l[7] = le, l[8] = Ce, l[9] = Be, l[10] = $e, l[11] = Re, l[12] = Oe, l[13] = Pe, l[14] = Te, l[15] = de;
    }
    function dt(l, p) {
      re(l, p, p);
    }
    function Vt(l, p) {
      var d = t(), a;
      for (a = 0; a < 16; a++) d[a] = p[a];
      for (a = 253; a >= 0; a--)
        dt(d, d), a !== 2 && a !== 4 && re(d, d, p);
      for (a = 0; a < 16; a++) l[a] = d[a];
    }
    function fs(l, p) {
      var d = t(), a;
      for (a = 0; a < 16; a++) d[a] = p[a];
      for (a = 250; a >= 0; a--)
        dt(d, d), a !== 1 && re(d, d, p);
      for (a = 0; a < 16; a++) l[a] = d[a];
    }
    function ki(l, p, d) {
      var a = new Uint8Array(32), g = new Float64Array(80), S, E, j = t(), z = t(), we = t(), Q = t(), lt = t(), le = t();
      for (E = 0; E < 31; E++) a[E] = p[E];
      for (a[31] = p[31] & 127 | 64, a[0] &= 248, ue(g, d), E = 0; E < 16; E++)
        z[E] = g[E], Q[E] = j[E] = we[E] = 0;
      for (j[0] = Q[0] = 1, E = 254; E >= 0; --E)
        S = a[E >>> 3] >>> (E & 7) & 1, Ee(j, z, S), Ee(we, Q, S), it(lt, j, we), gt(j, j, we), it(we, z, Q), gt(z, z, Q), dt(Q, lt), dt(le, j), re(j, we, j), re(we, z, lt), it(lt, j, we), gt(j, j, we), dt(z, j), gt(we, Q, le), re(j, we, u), it(j, j, Q), re(we, we, j), re(j, Q, le), re(Q, z, g), dt(z, lt), Ee(j, z, S), Ee(we, Q, S);
      for (E = 0; E < 16; E++)
        g[E + 16] = j[E], g[E + 32] = we[E], g[E + 48] = z[E], g[E + 64] = Q[E];
      var Ce = g.subarray(32), Be = g.subarray(16);
      return Vt(Ce, Ce), re(Be, Be, Ce), yt(l, Be), 0;
    }
    function or(l, p) {
      return ki(l, p, s);
    }
    function hs(l, p) {
      return n(p, 32), or(l, p);
    }
    function pn(l, p, d) {
      var a = new Uint8Array(32);
      return ki(a, d, p), et(l, i, a, Ke);
    }
    var ds = Et, Uc = ht;
    function ps(l, p, d, a, g, S) {
      var E = new Uint8Array(32);
      return pn(E, g, S), ds(l, p, d, a, E);
    }
    function ko(l, p, d, a, g, S) {
      var E = new Uint8Array(32);
      return pn(E, g, S), Uc(l, p, d, a, E);
    }
    var ys = [
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
    function gs(l, p, d, a) {
      for (var g = new Int32Array(16), S = new Int32Array(16), E, j, z, we, Q, lt, le, Ce, Be, $e, Re, Oe, Pe, Te, de, Ae, ie, ye, ve, X, C, B, V, P, R, L, _e = l[0], Me = l[1], Fe = l[2], Ve = l[3], m = l[4], Ze = l[5], ut = l[6], ft = l[7], ze = p[0], st = p[1], ot = p[2], $t = p[3], mt = p[4], Nt = p[5], Pt = p[6], jt = p[7], Lt = 0; a >= 128; ) {
        for (ve = 0; ve < 16; ve++)
          X = 8 * ve + Lt, g[ve] = d[X + 0] << 24 | d[X + 1] << 16 | d[X + 2] << 8 | d[X + 3], S[ve] = d[X + 4] << 24 | d[X + 5] << 16 | d[X + 6] << 8 | d[X + 7];
        for (ve = 0; ve < 80; ve++)
          if (E = _e, j = Me, z = Fe, we = Ve, Q = m, lt = Ze, le = ut, Ce = ft, Be = ze, $e = st, Re = ot, Oe = $t, Pe = mt, Te = Nt, de = Pt, Ae = jt, C = ft, B = jt, V = B & 65535, P = B >>> 16, R = C & 65535, L = C >>> 16, C = (m >>> 14 | mt << 18) ^ (m >>> 18 | mt << 14) ^ (mt >>> 9 | m << 23), B = (mt >>> 14 | m << 18) ^ (mt >>> 18 | m << 14) ^ (m >>> 9 | mt << 23), V += B & 65535, P += B >>> 16, R += C & 65535, L += C >>> 16, C = m & Ze ^ ~m & ut, B = mt & Nt ^ ~mt & Pt, V += B & 65535, P += B >>> 16, R += C & 65535, L += C >>> 16, C = ys[ve * 2], B = ys[ve * 2 + 1], V += B & 65535, P += B >>> 16, R += C & 65535, L += C >>> 16, C = g[ve % 16], B = S[ve % 16], V += B & 65535, P += B >>> 16, R += C & 65535, L += C >>> 16, P += V >>> 16, R += P >>> 16, L += R >>> 16, ie = R & 65535 | L << 16, ye = V & 65535 | P << 16, C = ie, B = ye, V = B & 65535, P = B >>> 16, R = C & 65535, L = C >>> 16, C = (_e >>> 28 | ze << 4) ^ (ze >>> 2 | _e << 30) ^ (ze >>> 7 | _e << 25), B = (ze >>> 28 | _e << 4) ^ (_e >>> 2 | ze << 30) ^ (_e >>> 7 | ze << 25), V += B & 65535, P += B >>> 16, R += C & 65535, L += C >>> 16, C = _e & Me ^ _e & Fe ^ Me & Fe, B = ze & st ^ ze & ot ^ st & ot, V += B & 65535, P += B >>> 16, R += C & 65535, L += C >>> 16, P += V >>> 16, R += P >>> 16, L += R >>> 16, Ce = R & 65535 | L << 16, Ae = V & 65535 | P << 16, C = we, B = Oe, V = B & 65535, P = B >>> 16, R = C & 65535, L = C >>> 16, C = ie, B = ye, V += B & 65535, P += B >>> 16, R += C & 65535, L += C >>> 16, P += V >>> 16, R += P >>> 16, L += R >>> 16, we = R & 65535 | L << 16, Oe = V & 65535 | P << 16, Me = E, Fe = j, Ve = z, m = we, Ze = Q, ut = lt, ft = le, _e = Ce, st = Be, ot = $e, $t = Re, mt = Oe, Nt = Pe, Pt = Te, jt = de, ze = Ae, ve % 16 === 15)
            for (X = 0; X < 16; X++)
              C = g[X], B = S[X], V = B & 65535, P = B >>> 16, R = C & 65535, L = C >>> 16, C = g[(X + 9) % 16], B = S[(X + 9) % 16], V += B & 65535, P += B >>> 16, R += C & 65535, L += C >>> 16, ie = g[(X + 1) % 16], ye = S[(X + 1) % 16], C = (ie >>> 1 | ye << 31) ^ (ie >>> 8 | ye << 24) ^ ie >>> 7, B = (ye >>> 1 | ie << 31) ^ (ye >>> 8 | ie << 24) ^ (ye >>> 7 | ie << 25), V += B & 65535, P += B >>> 16, R += C & 65535, L += C >>> 16, ie = g[(X + 14) % 16], ye = S[(X + 14) % 16], C = (ie >>> 19 | ye << 13) ^ (ye >>> 29 | ie << 3) ^ ie >>> 6, B = (ye >>> 19 | ie << 13) ^ (ie >>> 29 | ye << 3) ^ (ye >>> 6 | ie << 26), V += B & 65535, P += B >>> 16, R += C & 65535, L += C >>> 16, P += V >>> 16, R += P >>> 16, L += R >>> 16, g[X] = R & 65535 | L << 16, S[X] = V & 65535 | P << 16;
        C = _e, B = ze, V = B & 65535, P = B >>> 16, R = C & 65535, L = C >>> 16, C = l[0], B = p[0], V += B & 65535, P += B >>> 16, R += C & 65535, L += C >>> 16, P += V >>> 16, R += P >>> 16, L += R >>> 16, l[0] = _e = R & 65535 | L << 16, p[0] = ze = V & 65535 | P << 16, C = Me, B = st, V = B & 65535, P = B >>> 16, R = C & 65535, L = C >>> 16, C = l[1], B = p[1], V += B & 65535, P += B >>> 16, R += C & 65535, L += C >>> 16, P += V >>> 16, R += P >>> 16, L += R >>> 16, l[1] = Me = R & 65535 | L << 16, p[1] = st = V & 65535 | P << 16, C = Fe, B = ot, V = B & 65535, P = B >>> 16, R = C & 65535, L = C >>> 16, C = l[2], B = p[2], V += B & 65535, P += B >>> 16, R += C & 65535, L += C >>> 16, P += V >>> 16, R += P >>> 16, L += R >>> 16, l[2] = Fe = R & 65535 | L << 16, p[2] = ot = V & 65535 | P << 16, C = Ve, B = $t, V = B & 65535, P = B >>> 16, R = C & 65535, L = C >>> 16, C = l[3], B = p[3], V += B & 65535, P += B >>> 16, R += C & 65535, L += C >>> 16, P += V >>> 16, R += P >>> 16, L += R >>> 16, l[3] = Ve = R & 65535 | L << 16, p[3] = $t = V & 65535 | P << 16, C = m, B = mt, V = B & 65535, P = B >>> 16, R = C & 65535, L = C >>> 16, C = l[4], B = p[4], V += B & 65535, P += B >>> 16, R += C & 65535, L += C >>> 16, P += V >>> 16, R += P >>> 16, L += R >>> 16, l[4] = m = R & 65535 | L << 16, p[4] = mt = V & 65535 | P << 16, C = Ze, B = Nt, V = B & 65535, P = B >>> 16, R = C & 65535, L = C >>> 16, C = l[5], B = p[5], V += B & 65535, P += B >>> 16, R += C & 65535, L += C >>> 16, P += V >>> 16, R += P >>> 16, L += R >>> 16, l[5] = Ze = R & 65535 | L << 16, p[5] = Nt = V & 65535 | P << 16, C = ut, B = Pt, V = B & 65535, P = B >>> 16, R = C & 65535, L = C >>> 16, C = l[6], B = p[6], V += B & 65535, P += B >>> 16, R += C & 65535, L += C >>> 16, P += V >>> 16, R += P >>> 16, L += R >>> 16, l[6] = ut = R & 65535 | L << 16, p[6] = Pt = V & 65535 | P << 16, C = ft, B = jt, V = B & 65535, P = B >>> 16, R = C & 65535, L = C >>> 16, C = l[7], B = p[7], V += B & 65535, P += B >>> 16, R += C & 65535, L += C >>> 16, P += V >>> 16, R += P >>> 16, L += R >>> 16, l[7] = ft = R & 65535 | L << 16, p[7] = jt = V & 65535 | P << 16, Lt += 128, a -= 128;
      }
      return a;
    }
    function Zr(l, p, d) {
      var a = new Int32Array(8), g = new Int32Array(8), S = new Uint8Array(256), E, j = d;
      for (a[0] = 1779033703, a[1] = 3144134277, a[2] = 1013904242, a[3] = 2773480762, a[4] = 1359893119, a[5] = 2600822924, a[6] = 528734635, a[7] = 1541459225, g[0] = 4089235720, g[1] = 2227873595, g[2] = 4271175723, g[3] = 1595750129, g[4] = 2917565137, g[5] = 725511199, g[6] = 4215389547, g[7] = 327033209, gs(a, g, p, d), d %= 128, E = 0; E < d; E++) S[E] = p[j - d + E];
      for (S[d] = 128, d = 256 - 128 * (d < 112 ? 1 : 0), S[d - 9] = 0, v(S, d - 8, j / 536870912 | 0, j << 3), gs(a, g, S, d), E = 0; E < 8; E++) v(l, 8 * E, a[E], g[E]);
      return 0;
    }
    function Xn(l, p) {
      var d = t(), a = t(), g = t(), S = t(), E = t(), j = t(), z = t(), we = t(), Q = t();
      gt(d, l[1], l[0]), gt(Q, p[1], p[0]), re(d, d, Q), it(a, l[0], l[1]), it(Q, p[0], p[1]), re(a, a, Q), re(g, l[3], p[3]), re(g, g, w), re(S, l[2], p[2]), it(S, S, S), gt(E, a, d), gt(j, S, g), it(z, S, g), it(we, a, d), re(l[0], E, j), re(l[1], we, z), re(l[2], z, j), re(l[3], E, we);
    }
    function Ci(l, p, d) {
      var a;
      for (a = 0; a < 4; a++)
        Ee(l[a], p[a], d);
    }
    function vs(l, p) {
      var d = t(), a = t(), g = t();
      Vt(g, p[2]), re(d, p[0], g), re(a, p[1], g), yt(l, a), l[31] ^= Dt(d) << 7;
    }
    function ms(l, p, d) {
      var a, g;
      for (Je(l[0], o), Je(l[1], c), Je(l[2], c), Je(l[3], o), g = 255; g >= 0; --g)
        a = d[g / 8 | 0] >> (g & 7) & 1, Ci(l, p, a), Xn(p, l), Xn(l, l), Ci(l, p, a);
    }
    function Bi(l, p) {
      var d = [t(), t(), t(), t()];
      Je(d[0], x), Je(d[1], q), Je(d[2], c), re(d[3], x, q), ms(l, d, p);
    }
    function ws(l, p, d) {
      var a = new Uint8Array(64), g = [t(), t(), t(), t()], S;
      for (d || n(p, 32), Zr(a, p, 32), a[0] &= 248, a[31] &= 127, a[31] |= 64, Bi(g, a), vs(l, g), S = 0; S < 32; S++) p[S + 32] = l[S];
      return 0;
    }
    var Wr = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);
    function bs(l, p) {
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
    function xs(l) {
      var p = new Float64Array(64), d;
      for (d = 0; d < 64; d++) p[d] = l[d];
      for (d = 0; d < 64; d++) l[d] = 0;
      bs(l, p);
    }
    function Co(l, p, d, a) {
      var g = new Uint8Array(64), S = new Uint8Array(64), E = new Uint8Array(64), j, z, we = new Float64Array(64), Q = [t(), t(), t(), t()];
      Zr(g, a, 32), g[0] &= 248, g[31] &= 127, g[31] |= 64;
      var lt = d + 64;
      for (j = 0; j < d; j++) l[64 + j] = p[j];
      for (j = 0; j < 32; j++) l[32 + j] = g[32 + j];
      for (Zr(E, l.subarray(32), d + 32), xs(E), Bi(Q, E), vs(l, Q), j = 32; j < 64; j++) l[j] = a[j];
      for (Zr(S, l, d + 64), xs(S), j = 0; j < 64; j++) we[j] = 0;
      for (j = 0; j < 32; j++) we[j] = E[j];
      for (j = 0; j < 32; j++)
        for (z = 0; z < 32; z++)
          we[j + z] += S[j] * g[z];
      return bs(l.subarray(32), we), lt;
    }
    function As(l, p) {
      var d = t(), a = t(), g = t(), S = t(), E = t(), j = t(), z = t();
      return Je(l[2], c), ue(l[1], p), dt(g, l[1]), re(S, g, h), gt(g, g, l[2]), it(S, l[2], S), dt(E, S), dt(j, E), re(z, j, E), re(d, z, g), re(d, d, S), fs(d, d), re(d, d, g), re(d, d, S), re(d, d, S), re(l[0], d, S), dt(a, l[0]), re(a, a, S), Ut(a, g) && re(l[0], l[0], N), dt(a, l[0]), re(a, a, S), Ut(a, g) ? -1 : (Dt(l[0]) === p[31] >> 7 && gt(l[0], o, l[0]), re(l[3], l[0], l[1]), 0);
    }
    function _(l, p, d, a) {
      var g, S = new Uint8Array(32), E = new Uint8Array(64), j = [t(), t(), t(), t()], z = [t(), t(), t(), t()];
      if (d < 64 || As(z, a)) return -1;
      for (g = 0; g < d; g++) l[g] = p[g];
      for (g = 0; g < 32; g++) l[g + 32] = a[g];
      if (Zr(E, l, d), xs(E), ms(j, z, E), Bi(z, p.subarray(32)), Xn(j, z), vs(S, j), d -= 64, I(p, 0, S, 0)) {
        for (g = 0; g < d; g++) l[g] = 0;
        return -1;
      }
      for (g = 0; g < d; g++) l[g] = p[g + 64];
      return d;
    }
    var k = 32, T = 24, G = 32, xe = 16, At = 32, St = 32, je = 32, Y = 32, ne = 32, fe = T, ge = G, Ye = xe, tt = 64, vt = 32, zt = 64, Oi = 32, Ss = 64;
    e.lowlevel = {
      crypto_core_hsalsa20: et,
      crypto_stream_xor: pe,
      crypto_stream: te,
      crypto_stream_salsa20_xor: K,
      crypto_stream_salsa20: W,
      crypto_onetimeauth: xt,
      crypto_onetimeauth_verify: Tt,
      crypto_verify_16: O,
      crypto_verify_32: I,
      crypto_secretbox: Et,
      crypto_secretbox_open: ht,
      crypto_scalarmult: ki,
      crypto_scalarmult_base: or,
      crypto_box_beforenm: pn,
      crypto_box_afternm: ds,
      crypto_box: ps,
      crypto_box_open: ko,
      crypto_box_keypair: hs,
      crypto_hash: Zr,
      crypto_sign: Co,
      crypto_sign_keypair: ws,
      crypto_sign_open: _,
      crypto_secretbox_KEYBYTES: k,
      crypto_secretbox_NONCEBYTES: T,
      crypto_secretbox_ZEROBYTES: G,
      crypto_secretbox_BOXZEROBYTES: xe,
      crypto_scalarmult_BYTES: At,
      crypto_scalarmult_SCALARBYTES: St,
      crypto_box_PUBLICKEYBYTES: je,
      crypto_box_SECRETKEYBYTES: Y,
      crypto_box_BEFORENMBYTES: ne,
      crypto_box_NONCEBYTES: fe,
      crypto_box_ZEROBYTES: ge,
      crypto_box_BOXZEROBYTES: Ye,
      crypto_sign_BYTES: tt,
      crypto_sign_PUBLICKEYBYTES: vt,
      crypto_sign_SECRETKEYBYTES: zt,
      crypto_sign_SEEDBYTES: Oi,
      crypto_hash_BYTES: Ss,
      gf: t,
      D: h,
      L: Wr,
      pack25519: yt,
      unpack25519: ue,
      M: re,
      A: it,
      S: dt,
      Z: gt,
      pow2523: fs,
      add: Xn,
      set25519: Je,
      modL: bs,
      scalarmult: ms,
      scalarbase: Bi
    };
    function Bo(l, p) {
      if (l.length !== k) throw new Error("bad key size");
      if (p.length !== T) throw new Error("bad nonce size");
    }
    function Py(l, p) {
      if (l.length !== je) throw new Error("bad public key size");
      if (p.length !== Y) throw new Error("bad secret key size");
    }
    function xr() {
      for (var l = 0; l < arguments.length; l++)
        if (!(arguments[l] instanceof Uint8Array))
          throw new TypeError("unexpected type, use Uint8Array");
    }
    function Sf(l) {
      for (var p = 0; p < l.length; p++) l[p] = 0;
    }
    e.randomBytes = function(l) {
      var p = new Uint8Array(l);
      return n(p, l), p;
    }, e.secretbox = function(l, p, d) {
      xr(l, p, d), Bo(d, p);
      for (var a = new Uint8Array(G + l.length), g = new Uint8Array(a.length), S = 0; S < l.length; S++) a[S + G] = l[S];
      return Et(g, a, a.length, p, d), g.subarray(xe);
    }, e.secretbox.open = function(l, p, d) {
      xr(l, p, d), Bo(d, p);
      for (var a = new Uint8Array(xe + l.length), g = new Uint8Array(a.length), S = 0; S < l.length; S++) a[S + xe] = l[S];
      return a.length < 32 || ht(g, a, a.length, p, d) !== 0 ? null : g.subarray(G);
    }, e.secretbox.keyLength = k, e.secretbox.nonceLength = T, e.secretbox.overheadLength = xe, e.scalarMult = function(l, p) {
      if (xr(l, p), l.length !== St) throw new Error("bad n size");
      if (p.length !== At) throw new Error("bad p size");
      var d = new Uint8Array(At);
      return ki(d, l, p), d;
    }, e.scalarMult.base = function(l) {
      if (xr(l), l.length !== St) throw new Error("bad n size");
      var p = new Uint8Array(At);
      return or(p, l), p;
    }, e.scalarMult.scalarLength = St, e.scalarMult.groupElementLength = At, e.box = function(l, p, d, a) {
      var g = e.box.before(d, a);
      return e.secretbox(l, p, g);
    }, e.box.before = function(l, p) {
      xr(l, p), Py(l, p);
      var d = new Uint8Array(ne);
      return pn(d, l, p), d;
    }, e.box.after = e.secretbox, e.box.open = function(l, p, d, a) {
      var g = e.box.before(d, a);
      return e.secretbox.open(l, p, g);
    }, e.box.open.after = e.secretbox.open, e.box.keyPair = function() {
      var l = new Uint8Array(je), p = new Uint8Array(Y);
      return hs(l, p), { publicKey: l, secretKey: p };
    }, e.box.keyPair.fromSecretKey = function(l) {
      if (xr(l), l.length !== Y)
        throw new Error("bad secret key size");
      var p = new Uint8Array(je);
      return or(p, l), { publicKey: p, secretKey: new Uint8Array(l) };
    }, e.box.publicKeyLength = je, e.box.secretKeyLength = Y, e.box.sharedKeyLength = ne, e.box.nonceLength = fe, e.box.overheadLength = e.secretbox.overheadLength, e.sign = function(l, p) {
      if (xr(l, p), p.length !== zt)
        throw new Error("bad secret key size");
      var d = new Uint8Array(tt + l.length);
      return Co(d, l, l.length, p), d;
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
      return ws(l, p), { publicKey: l, secretKey: p };
    }, e.sign.keyPair.fromSecretKey = function(l) {
      if (xr(l), l.length !== zt)
        throw new Error("bad secret key size");
      for (var p = new Uint8Array(vt), d = 0; d < p.length; d++) p[d] = l[32 + d];
      return { publicKey: p, secretKey: new Uint8Array(l) };
    }, e.sign.keyPair.fromSeed = function(l) {
      if (xr(l), l.length !== Oi)
        throw new Error("bad seed size");
      for (var p = new Uint8Array(vt), d = new Uint8Array(zt), a = 0; a < 32; a++) d[a] = l[a];
      return ws(p, d, !0), { publicKey: p, secretKey: d };
    }, e.sign.publicKeyLength = vt, e.sign.secretKeyLength = zt, e.sign.seedLength = Oi, e.sign.signatureLength = tt, e.hash = function(l) {
      xr(l);
      var p = new Uint8Array(Ss);
      return Zr(p, l, l.length), p;
    }, e.hash.hashLength = Ss, e.verify = function(l, p) {
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
          Sf(S);
        });
      } else typeof j1 < "u" && (l = D1, l && l.randomBytes && e.setPRNG(function(d, a) {
        var g, S = l.randomBytes(a);
        for (g = 0; g < a; g++) d[g] = S[g];
        Sf(S);
      }));
    }();
  })(r.exports ? r.exports : self.nacl = self.nacl || {});
})(M0);
var $1 = M0.exports;
const V0 = /* @__PURE__ */ Qy($1);
function M1() {
  return V0.box.keyPair();
}
async function es(r, e) {
  const t = sessionStorage.getItem("sessionKey"), n = sessionStorage.getItem("sessionId");
  console.groupCollapsed("Attestation");
  try {
    if (t && n && !r) {
      const o = js(t);
      return console.log("Using existing attestation from session storage."), { sessionKey: o, sessionId: n };
    }
    const i = window.crypto.randomUUID();
    console.log("Generated attestation nonce:", i);
    const s = await P1(i, e);
    if (s && s.public_key) {
      console.log("Attestation document verification succeeded");
      const o = M1();
      console.log("Generated client key pair");
      const c = new Uint8Array(s.public_key), { encrypted_session_key: u, session_id: h } = await ew(
        Br(o.publicKey),
        i,
        e
      );
      console.log("Key exchange completed.");
      const w = V0.scalarMult(o.secretKey, c), x = js(u), q = 12, N = x.slice(0, q), v = x.slice(q), O = new Cu(w).open(N, v);
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
function V1(r) {
  ct = r;
}
async function L1(r, e) {
  return Ot(
    `${ct}/platform/login`,
    "POST",
    { email: r, password: e },
    void 0,
    "Failed to login"
  );
}
async function H1(r, e, t, n) {
  return Ot(
    `${ct}/platform/register`,
    "POST",
    { email: r, password: e, invite_code: t, name: n },
    void 0,
    "Failed to register"
  );
}
async function F1(r) {
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
async function L0(r) {
  return Ne(
    `${ct}/platform/orgs`,
    "POST",
    { name: r }
  );
}
async function H0() {
  return Ne(
    `${ct}/platform/orgs`,
    "GET",
    void 0
  );
}
async function F0(r) {
  return Ne(
    `${ct}/platform/orgs/${r}`,
    "DELETE",
    void 0
  );
}
async function z0(r, e, t) {
  return Ne(
    `${ct}/platform/orgs/${r}/projects`,
    "POST",
    { name: e, description: t }
  );
}
async function G0(r) {
  return Ne(
    `${ct}/platform/orgs/${r}/projects`,
    "GET",
    void 0
  );
}
async function q0(r, e) {
  return Ne(
    `${ct}/platform/orgs/${r}/projects/${e}`,
    "GET",
    void 0
  );
}
async function K0(r, e, t) {
  return Ne(
    `${ct}/platform/orgs/${r}/projects/${e}`,
    "PATCH",
    t
  );
}
async function Z0(r, e) {
  return Ne(
    `${ct}/platform/orgs/${r}/projects/${e}`,
    "DELETE",
    void 0
  );
}
function G1(r) {
  const e = /^[A-Za-z0-9+/]*[=]{0,2}$/, t = r.length % 4 === 0, n = e.test(r);
  return t && n;
}
async function W0(r, e, t, n) {
  if (!G1(n))
    throw new Error(
      "Secret must be base64 encoded. Use @stablelib/base64's encode function to encode your data."
    );
  return Ne(
    `${ct}/platform/orgs/${r}/projects/${e}/secrets`,
    "POST",
    { key_name: t, secret: n }
  );
}
async function Y0(r, e) {
  return Ne(
    `${ct}/platform/orgs/${r}/projects/${e}/secrets`,
    "GET",
    void 0
  );
}
async function J0(r, e, t) {
  return Ne(
    `${ct}/platform/orgs/${r}/projects/${e}/secrets/${t}`,
    "DELETE",
    void 0
  );
}
async function X0(r, e) {
  return Ne(
    `${ct}/platform/orgs/${r}/projects/${e}/settings/email`,
    "GET",
    void 0
  );
}
async function Q0(r, e, t) {
  return Ne(
    `${ct}/platform/orgs/${r}/projects/${e}/settings/email`,
    "PUT",
    t
  );
}
async function ey(r, e) {
  return Ne(
    `${ct}/platform/orgs/${r}/projects/${e}/settings/oauth`,
    "GET",
    void 0
  );
}
async function ty(r, e, t) {
  return Ne(
    `${ct}/platform/orgs/${r}/projects/${e}/settings/oauth`,
    "PUT",
    t
  );
}
async function ry(r, e, t) {
  if (!e || e.trim() === "")
    throw new Error("Email is required");
  return Ne(
    `${ct}/platform/orgs/${r}/invites`,
    "POST",
    { email: e, role: t }
  );
}
async function ny(r) {
  return Ne(
    `${ct}/platform/orgs/${r}/invites`,
    "GET",
    void 0
  );
}
async function iy(r, e) {
  return Ne(
    `${ct}/platform/orgs/${r}/invites/${e}`,
    "GET",
    void 0
  );
}
async function sy(r, e) {
  return Ne(
    `${ct}/platform/orgs/${r}/invites/${e}`,
    "DELETE",
    void 0
  );
}
async function oy(r) {
  return Ne(
    `${ct}/platform/orgs/${r}/memberships`,
    "GET",
    void 0
  );
}
async function ay(r, e, t) {
  return Ne(
    `${ct}/platform/orgs/${r}/memberships/${e}`,
    "PATCH",
    { role: t }
  );
}
async function cy(r, e) {
  return Ne(
    `${ct}/platform/orgs/${r}/memberships/${e}`,
    "DELETE",
    void 0
  );
}
async function ly(r) {
  return Ne(
    `${ct}/platform/accept_invite/${r}`,
    "POST",
    void 0
  );
}
async function q1() {
  return Ne(`${ct}/platform/me`, "GET", void 0);
}
async function uy(r) {
  return Ot(
    `${ct}/platform/verify-email/${r}`,
    "GET",
    void 0,
    void 0,
    "Failed to verify email"
  );
}
async function Ua() {
  return Ne(
    `${ct}/platform/request_verification`,
    "POST",
    void 0,
    "Failed to request new verification code"
  );
}
async function fy(r, e) {
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
async function hy(r, e, t, n) {
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
async function dy(r, e) {
  const t = {
    current_password: r,
    new_password: e
  };
  return Ne(
    `${ct}/platform/change-password`,
    "POST",
    t,
    "Failed to change platform password"
  );
}
async function Ne(r, e, t, n) {
  const i = async (s = !1) => {
    try {
      if (s) {
        console.log("Refreshing access token");
        const u = Lo.getRefreshFunction(r);
        console.log(`Using ${u}`), u === "platformRefreshToken" ? await z1() : await bf();
      }
      const o = window.localStorage.getItem("access_token");
      if (!o)
        throw new Error("No access token available");
      const c = await py(
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
async function py(r, e, t, n, i) {
  const o = Lo.resolveEndpoint(r).context === "platform" ? Lo.platformApiUrl : void 0;
  let { sessionKey: c, sessionId: u } = await es(!1, o);
  const h = async (x, q = !1) => {
    if (q || !c || !u) {
      const U = await es(!0, o);
      c = U.sessionKey, u = U.sessionId;
    }
    if (!c || !u)
      throw new Error("Failed to make encrypted API call, no attestation available.");
    const N = t ? JSON.stringify(t) : void 0, v = N ? Jy(c, N) : void 0, A = {
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
        const U = await O.json(), D = Xy(c, U.encrypted);
        I.data = JSON.parse(D);
      } catch (U) {
        console.error("Error decrypting or parsing response:", U), I.status = 500, I.error = "Failed to decrypt or parse the response";
      }
    else
      try {
        const U = await O.json();
        I.error = U.message || i || `HTTP error! Status: ${O.status}`;
      } catch {
        I.error = i || `HTTP error! Status: ${O.status}`;
      }
    return I;
  }, w = async (x, q = !1) => {
    var N;
    try {
      const v = await h(x, q);
      return (v.status === 400 || (N = v.error) != null && N.includes("Encryption error")) && !q ? (console.log("Encryption error or Bad Request, attempting to renew attestation"), w(x, !0)) : v;
    } catch (v) {
      return {
        status: 500,
        error: v instanceof Error ? v.message : "Unknown error occurred"
      };
    }
  };
  return w(n);
}
async function Ot(r, e, t, n, i) {
  const s = await py(
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
let qe = "";
function K1(r) {
  qe = r;
}
function yy() {
  return qe;
}
async function Z1(r, e, t) {
  return Ot(
    `${qe}/login`,
    "POST",
    { email: r, password: e, client_id: t }
  );
}
async function W1(r, e, t) {
  return Ot(
    `${qe}/login`,
    "POST",
    { id: r, password: e, client_id: t }
  );
}
async function Y1(r, e, t, n, i) {
  return Ot(`${qe}/register`, "POST", {
    email: r,
    password: e,
    inviteCode: t.toLowerCase(),
    client_id: n,
    name: i
  });
}
async function J1(r, e, t) {
  return Ot(`${qe}/register`, "POST", {
    password: r,
    inviteCode: e.toLowerCase(),
    client_id: t
  });
}
async function bf() {
  const r = window.localStorage.getItem("refresh_token");
  if (!r) throw new Error("No refresh token available");
  const e = { refresh_token: r };
  try {
    const t = await Ot(
      `${qe}/refresh`,
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
async function gd() {
  return Ne(
    `${qe}/protected/user`,
    "GET",
    void 0,
    "Failed to fetch user"
  );
}
async function gy(r, e) {
  return Ne(
    `${qe}/protected/kv/${r}`,
    "PUT",
    e,
    "Failed to put key-value pair"
  );
}
async function vy(r) {
  return Ne(
    `${qe}/protected/kv/${r}`,
    "DELETE",
    void 0,
    "Failed to delete key-value pair"
  );
}
async function my(r) {
  try {
    return await Ne(
      `${qe}/protected/kv/${r}`,
      "GET",
      void 0,
      "Failed to get key-value pair"
    );
  } catch (e) {
    console.error(`Error fetching key "${r}":`, e);
    return;
  }
}
async function wy() {
  return Ne(
    `${qe}/protected/kv`,
    "GET",
    void 0,
    "Failed to list key-value pairs"
  );
}
async function X1(r) {
  const e = { refresh_token: r };
  return Ot(`${qe}/logout`, "POST", e);
}
async function by(r) {
  return Ot(
    `${qe}/verify-email/${r}`,
    "GET",
    void 0,
    void 0,
    "Failed to verify email"
  );
}
async function Da() {
  return Ne(
    `${qe}/protected/request_verification`,
    "POST",
    void 0,
    "Failed to request new verification code"
  );
}
async function Q1(r, e) {
  const n = await fetch(`${e || qe}/attestation/${r}`);
  if (!n.ok)
    throw new Error(`Request failed with status ${n.status}`);
  return (await n.json()).attestation_document;
}
async function ew(r, e, t) {
  const i = await fetch(`${t || qe}/key_exchange`, {
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
async function tw(r, e, t) {
  const n = {
    email: r,
    hashed_secret: e,
    client_id: t
  };
  return Ot(
    `${qe}/password-reset/request`,
    "POST",
    n,
    void 0,
    "Failed to request password reset"
  );
}
async function rw(r, e, t, n, i) {
  const s = {
    email: r,
    alphanumeric_code: e,
    plaintext_secret: t,
    new_password: n,
    client_id: i
  };
  return Ot(
    `${qe}/password-reset/confirm`,
    "POST",
    s,
    void 0,
    "Failed to confirm password reset"
  );
}
async function xy(r, e) {
  const t = {
    current_password: r,
    new_password: e
  };
  return Ne(
    `${qe}/protected/change_password`,
    "POST",
    t,
    "Failed to change password"
  );
}
async function nw(r, e) {
  try {
    return await Ot(
      `${qe}/auth/github`,
      "POST",
      e ? { invite_code: e, client_id: r } : { client_id: r },
      void 0,
      "Failed to initiate GitHub auth"
    );
  } catch (t) {
    throw t instanceof Error && t.message.includes("Invalid invite code") ? new Error("Invalid invite code. Please check and try again.") : t;
  }
}
async function iw(r, e, t) {
  const n = { code: r, state: e, invite_code: t };
  try {
    return await Ot(
      `${qe}/auth/github/callback`,
      "POST",
      n,
      void 0,
      "GitHub callback failed"
    );
  } catch (i) {
    throw console.error("Detailed GitHub callback error:", i), i instanceof Error ? i.message.includes("User exists") || i.message.includes("Email already registered") ? new Error(
      "An account with this email already exists. Please sign in using your existing account."
    ) : i.message.includes("Invalid invite code") ? new Error("Invalid invite code. Please try signing up with a valid invite code.") : i.message.includes("User not found") ? new Error(
      "User not found. Please sign up first before attempting to log in with GitHub."
    ) : new Error("Failed to authenticate with GitHub. Please try again.") : i;
  }
}
async function sw(r, e) {
  try {
    return await Ot(
      `${qe}/auth/google`,
      "POST",
      e ? { invite_code: e, client_id: r } : { client_id: r },
      void 0,
      "Failed to initiate Google auth"
    );
  } catch (t) {
    throw t instanceof Error && t.message.includes("Invalid invite code") ? new Error("Invalid invite code. Please check and try again.") : t;
  }
}
async function ow(r, e, t) {
  const n = { code: r, state: e, invite_code: t };
  try {
    return await Ot(
      `${qe}/auth/google/callback`,
      "POST",
      n,
      void 0,
      "Google callback failed"
    );
  } catch (i) {
    throw console.error("Detailed Google callback error:", i), i instanceof Error ? i.message.includes("User exists") || i.message.includes("Email already registered") ? new Error(
      "An account with this email already exists. Please sign in using your existing account."
    ) : i.message.includes("Invalid invite code") ? new Error("Invalid invite code. Please try signing up with a valid invite code.") : i.message.includes("User not found") ? new Error(
      "User not found. Please sign up first before attempting to log in with Google."
    ) : new Error("Failed to authenticate with Google. Please try again.") : i;
  }
}
async function aw(r, e) {
  try {
    return await Ot(
      `${qe}/auth/apple`,
      "POST",
      e ? { invite_code: e, client_id: r } : { client_id: r },
      void 0,
      "Failed to initiate Apple auth"
    );
  } catch (t) {
    throw t instanceof Error && t.message.includes("Invalid invite code") ? new Error("Invalid invite code. Please check and try again.") : t;
  }
}
async function cw(r, e, t) {
  const n = { code: r, state: e, invite_code: t };
  try {
    return await Ot(
      `${qe}/auth/apple/callback`,
      "POST",
      n,
      void 0,
      "Apple callback failed"
    );
  } catch (i) {
    throw console.error("Detailed Apple callback error:", i), i instanceof Error ? i.message.includes("User exists") || i.message.includes("Email already registered") ? new Error(
      "An account with this email already exists. Please sign in using your existing account."
    ) : i.message.includes("Invalid invite code") ? new Error("Invalid invite code. Please try signing up with a valid invite code.") : i.message.includes("User not found") ? new Error(
      "User not found. Please sign up first before attempting to log in with Apple."
    ) : new Error("Failed to authenticate with Apple. Please try again.") : i;
  }
}
async function lw(r, e, t) {
  const n = {
    ...r,
    client_id: e,
    ...t ? { invite_code: t } : {}
  };
  try {
    return await Ot(
      `${qe}/auth/apple/native`,
      "POST",
      n,
      void 0,
      "Apple Sign-In failed"
    );
  } catch (i) {
    throw console.error("Detailed Apple Sign-In error:", i), i instanceof Error ? i.message.includes("User exists") || i.message.includes("Email already registered") ? new Error(
      "An account with this email already exists. Please sign in using your existing account."
    ) : i.message.includes("Invalid invite code") ? new Error("Invalid invite code. Please try signing up with a valid invite code.") : i.message.includes("User not found") ? new Error(
      "User not found. Please sign up first before attempting to log in with Apple."
    ) : i.message.includes("No email found") ? new Error("Unable to retrieve email from Apple. Please try another sign-in method.") : new Error("Failed to authenticate with Apple. Please try again.") : i;
  }
}
async function Ay(r) {
  let e = `${qe}/protected/private_key`;
  const t = [];
  return r != null && r.seed_phrase_derivation_path && t.push(
    `seed_phrase_derivation_path=${encodeURIComponent(r.seed_phrase_derivation_path)}`
  ), r != null && r.private_key_derivation_path && t.push(
    `private_key_derivation_path=${encodeURIComponent(r.private_key_derivation_path)}`
  ), t.length > 0 && (e += `?${t.join("&")}`), Ne(
    e,
    "GET",
    void 0,
    "Failed to fetch private key"
  );
}
async function Sy(r) {
  let e = `${qe}/protected/private_key_bytes`;
  const t = [];
  return r != null && r.seed_phrase_derivation_path && t.push(
    `seed_phrase_derivation_path=${encodeURIComponent(r.seed_phrase_derivation_path)}`
  ), r != null && r.private_key_derivation_path && t.push(
    `private_key_derivation_path=${encodeURIComponent(r.private_key_derivation_path)}`
  ), t.length > 0 && (e += `?${t.join("&")}`), Ne(
    e,
    "GET",
    void 0,
    "Failed to fetch private key bytes"
  );
}
async function _y(r, e, t) {
  const i = {
    message_base64: Br(r),
    algorithm: e,
    ...t && Object.keys(t).length > 0 && { key_options: t }
  };
  return Ne(
    `${qe}/protected/sign_message`,
    "POST",
    i,
    "Failed to sign message"
  );
}
async function Ey(r, e) {
  let t = `${qe}/protected/public_key?algorithm=${r}`;
  return e != null && e.seed_phrase_derivation_path && (t += `&seed_phrase_derivation_path=${encodeURIComponent(e.seed_phrase_derivation_path)}`), e != null && e.private_key_derivation_path && (t += `&private_key_derivation_path=${encodeURIComponent(e.private_key_derivation_path)}`), Ne(
    t,
    "GET",
    void 0,
    "Failed to fetch public key"
  );
}
async function uw(r, e, t) {
  const n = {
    email: r,
    password: e,
    ...t !== void 0 && { name: t }
  };
  return Ne(
    `${qe}/protected/convert_guest`,
    "POST",
    n,
    "Failed to convert guest account"
  );
}
async function fw(r) {
  return Ne(
    `${qe}/protected/third_party_token`,
    "POST",
    r ? { audience: r } : {},
    "Failed to generate third party token"
  );
}
async function Iy(r, e) {
  const t = {
    data: r,
    ...e && Object.keys(e).length > 0 && { key_options: e }
  };
  return Ne(
    `${qe}/protected/encrypt`,
    "POST",
    t,
    "Failed to encrypt data"
  );
}
async function ky(r, e) {
  const t = {
    encrypted_data: r,
    ...e && Object.keys(e).length > 0 && { key_options: e }
  };
  return Ne(
    `${qe}/protected/decrypt`,
    "POST",
    t,
    "Failed to decrypt data"
  );
}
async function hw(r) {
  const e = {
    hashed_secret: r
  };
  return Ne(
    `${qe}/protected/delete-account/request`,
    "POST",
    e,
    "Failed to request account deletion"
  );
}
async function dw(r, e) {
  const t = {
    confirmation_code: r,
    plaintext_secret: e
  };
  return Ne(
    `${qe}/protected/delete-account/confirm`,
    "POST",
    t,
    "Failed to confirm account deletion"
  );
}
async function Cy() {
  try {
    const r = await Ne(
      `${qe}/v1/models`,
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
const vd = 10 * 1024 * 1024;
function pw(r) {
  return new Promise((e) => setTimeout(e, r));
}
async function xf(r) {
  if (r.size > vd)
    throw new Error(`File size exceeds maximum limit of ${vd / 1024 / 1024}MB`);
  const e = await r.arrayBuffer(), t = new Uint8Array(e), n = Br(t), s = {
    filename: r instanceof File ? r.name : "document",
    content_base64: n
  };
  return Ne(
    `${qe}/v1/documents/upload`,
    "POST",
    s,
    "Failed to upload document"
  );
}
async function Af(r) {
  const e = {
    task_id: r
  };
  return Ne(
    `${qe}/v1/documents/status`,
    "POST",
    e,
    "Failed to check document status"
  );
}
async function By(r, e) {
  const { pollInterval: t = 2e3, maxAttempts: n = 150, onProgress: i } = e || {}, s = await xf(r);
  let o = 0;
  for (; o < n; ) {
    const c = await Af(s.task_id);
    switch (i && i(c.status, c.progress), c.status) {
      case "success":
        if (!c.document)
          throw new Error("Document processing succeeded but no document returned");
        return c.document;
      case "failure":
        throw new Error(c.error || "Document processing failed");
      case "pending":
      case "started":
        await pw(t), o++;
        break;
      default:
        throw new Error(`Unknown document status: ${c.status}`);
    }
  }
  throw new Error("Document processing timed out");
}
const yw = [
  "eeddbb58f57c38894d6d5af5e575fbe791c5bf3bbcfb5df8da8cfcf0c2e1da1913108e6a762112444740b88c163d7f4b",
  "74ed417f88cb0ca76c4a3d10f278bd010f1d3f95eafb254d4732511bb50e404507a4049b779c5230137e4091a5582271",
  "9043fcab93b972d3c14ad2dc8fa78ca7ad374fc937c02435681772a003f7a72876bc4d578089b5c4cf3fe9b480f1aabb",
  "52c3595b151d93d8b159c257301bfd5aa6f49210de0c55a6cd6df5ebeee44e4206cab950500f5d188f7fa14e6d900b75",
  "91cb67311e910cce68cd5b7d0de77aa40610d87c6681439b44c46c3ff786ae643956ab2c812478a1da8745b259f07a45",
  "859065ac81b81d3735130ba08b8af72a7256b603fefb74faabae25ed28cca6edcaa7c10ea32b5948d675c18a9b0f2b1d",
  "acd82a7d3943e23e95a9dc3ce0b0107ea358d6287f9e3afa245622f7c7e3e0a66142a928b6efcc02f594a95366d3a99d"
], gw = [
  "62c0407056217a4c10764ed9045694c29fa93255d3cc04c2f989cdd9a1f8050c8b169714c71f1118ebce2fcc9951d1a9",
  "cb95519905443f9f66f05f63c548b61ad1561a27fd5717b69285861aaea3c3063fe12a2571773b67fea3c6c11b4d8ec6",
  "deb5895831b5e4286f5a2dcf5e9c27383821446f8df2b465f141d10743599be20ba3bb381ce063bf7139cc89f7f61d4c",
  "70ba26c6af1ec3b57ce80e1adcc0ee96d70224d4c7a078f427895cdf68e1c30f09b5ac4c456588d872f3f21ff77c036b",
  "669404ea71435b8f498b48db7816a5c2ab1d258b1a77685b11d84d15a73189504d79c4dee13a658de9f4a0cbfc39cfe8",
  "a791bf92c25ffdfd372660e460a0e238c6778c090672df6509ae4bc065cf8668b6baac6b6a11d554af53ee0ff0172ad5",
  "c4285443b87b9b12a6cea3bef1064ec060f652b235a297095975af8f134e5ed65f92d70d4616fdec80af9dff48bb9f35"
], vw = "MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEHiUY9kFWK1GqBGzczohhwEwElXzgWLDZa9R6wBx3JOBocgSt9+UIzZlJbPDjYeGBfDUXh7Z62BG2vVsh2NgclLB5S7A2ucBBtb1wd8vSQHP8jpdPhZX1slauPgbnROIP", mw = {
  prod: "https://raw.githubusercontent.com/OpenSecretCloud/opensecret/master/pcrProdHistory.json",
  dev: "https://raw.githubusercontent.com/OpenSecretCloud/opensecret/master/pcrDevHistory.json"
};
async function ww() {
  try {
    const r = new Uint8Array(
      atob(vw).split("").map((e) => e.charCodeAt(0))
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
async function bw(r, e) {
  try {
    const t = (e == null ? void 0 : e[r]) || mw[r], n = await fetch(t);
    if (!n.ok)
      throw new Error(`Failed to fetch PCR history: ${n.status}`);
    return await n.json();
  } catch (t) {
    throw console.error("Error fetching PCR history:", t), new Error("Failed to fetch PCR history");
  }
}
async function xw(r, e, t) {
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
async function md(r, e, t) {
  try {
    const n = await ww(), i = await bw(e, t);
    for (const s of i)
      if (s.PCR0 === r && await xw(s.PCR0, s.signature, n))
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
async function Aw(r, e) {
  const t = [...(e == null ? void 0 : e.pcr0Values) || [], ...yw], n = [...(e == null ? void 0 : e.pcr0DevValues) || [], ...gw];
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
      const s = await md(
        r,
        "prod",
        e == null ? void 0 : e.remoteAttestationUrls
      );
      if (s)
        return s;
      const o = await md(
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
const ts = Ra, Rc = "641a0321a3e244efe456463195d606317ed7cdcc3c1756e09893f3c68f79bb5b";
function Oy(r) {
  return Array.from(r).map((e) => e.toString(16).padStart(2, "0")).join("");
}
async function Sw(r) {
  const e = await crypto.subtle.digest("SHA-256", r);
  return Oy(new Uint8Array(e));
}
async function rs(r, e, t) {
  console.log("Raw timestamp:", r.timestamp), console.log("Date object:", new Date(r.timestamp));
  const n = Array.from(r.pcrs.entries()).map(([w, x]) => ({
    id: w,
    value: Oy(x)
  })).filter((w) => !w.value.match(/^0+$/)), i = n.find((w) => w.id === 0);
  let s = null;
  i && (s = await Aw(i.value, t));
  const o = [...e, r.certificate].map((w) => {
    const x = new wi(w);
    return {
      subject: x.subject,
      notBefore: x.notBefore.toLocaleString(),
      notAfter: x.notAfter.toLocaleString(),
      pem: x.toString("pem"),
      isRoot: x.subject === "C=US, O=Amazon, OU=AWS, CN=aws.nitro-enclaves"
    };
  }), c = new TextDecoder(), u = new wi(e[0]), h = await Sw(u.rawData);
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
const Ty = Ad({
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
  get: my,
  put: gy,
  list: wy,
  del: vy,
  verifyEmail: by,
  requestNewVerificationCode: Da,
  requestNewVerificationEmail: Da,
  fetchUser: async () => {
  },
  refetchUser: async () => {
  },
  changePassword: xy,
  refreshAccessToken: bf,
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
  getPrivateKey: Ay,
  getPrivateKeyBytes: Sy,
  getPublicKey: Ey,
  signMessage: _y,
  apiUrl: "",
  pcrConfig: {},
  getAttestation: es,
  authenticate: Si,
  parseAttestationForView: rs,
  awsRootCertDer: ts,
  expectedRootCertHash: Rc,
  getAttestationDocument: async () => {
    throw new Error("getAttestationDocument called outside of OpenSecretProvider");
  },
  generateThirdPartyToken: async () => ({ token: "" }),
  encryptData: Iy,
  decryptData: ky,
  fetchModels: Cy,
  uploadDocument: xf,
  checkDocumentStatus: Af,
  uploadDocumentWithPolling: By
});
function _x({
  children: r,
  apiUrl: e,
  clientId: t,
  pcrConfig: n = {}
}) {
  if (!yy()) {
    debugger;
    if (!e || e.trim() === "")
      throw new Error(
        "OpenSecretProvider requires a non-empty apiUrl. Please provide a valid API endpoint URL."
      );
    if (!t || t.trim() === "")
      throw new Error(
        "OpenSecretProvider requires a non-empty clientId. Please provide a valid project UUID."
      );
    K1(e), Promise.resolve().then(() => Ed).then(({ apiConfig: K }) => {
      const W = K.platformApiUrl || "";
      K.configure(e, W);
    });
  }
  const [i, s] = Sd({
    loading: !0,
    user: void 0
  });
  async function o() {
    const K = window.localStorage.getItem("access_token"), W = window.localStorage.getItem("refresh_token");
    if (!(!K || !W))
      try {
        return await gd();
      } catch (te) {
        console.error("Failed to fetch user:", te);
      }
  }
  async function c() {
    const K = window.localStorage.getItem("access_token"), W = window.localStorage.getItem("refresh_token");
    if (!K || !W) {
      s({
        loading: !1,
        user: void 0
      });
      return;
    }
    try {
      const te = await gd();
      return s({
        loading: !1,
        user: te
      }), te;
    } catch (te) {
      console.error("Failed to fetch user:", te), s({
        loading: !1,
        user: void 0
      });
    }
  }
  async function u(K, W) {
    console.log("Signing in");
    try {
      const { access_token: te, refresh_token: pe } = await Z1(K, W, t);
      window.localStorage.setItem("access_token", te), window.localStorage.setItem("refresh_token", pe), await c();
    } catch (te) {
      throw console.error(te), te;
    }
  }
  async function h(K, W, te, pe) {
    try {
      const { access_token: Xe, refresh_token: xt } = await Y1(
        K,
        W,
        te,
        t,
        pe || null
      );
      window.localStorage.setItem("access_token", Xe), window.localStorage.setItem("refresh_token", xt), await c();
    } catch (Xe) {
      throw console.error(Xe), Xe;
    }
  }
  async function w(K, W) {
    console.log("Signing in Guest");
    try {
      const { access_token: te, refresh_token: pe } = await W1(K, W, t);
      window.localStorage.setItem("access_token", te), window.localStorage.setItem("refresh_token", pe), await c();
    } catch (te) {
      throw console.error(te), te;
    }
  }
  async function x(K, W) {
    try {
      const { access_token: te, refresh_token: pe, id: Xe } = await J1(
        K,
        W,
        t
      );
      return window.localStorage.setItem("access_token", te), window.localStorage.setItem("refresh_token", pe), await c(), { access_token: te, refresh_token: pe, id: Xe };
    } catch (te) {
      throw console.error(te), te;
    }
  }
  async function q(K, W, te) {
    try {
      await uw(K, W, te), await c();
    } catch (pe) {
      throw console.error(pe), pe;
    }
  }
  async function N() {
    const K = window.localStorage.getItem("refresh_token");
    if (K)
      try {
        await X1(K);
      } catch (W) {
        console.error("Error during logout:", W);
      }
    localStorage.removeItem("access_token"), localStorage.removeItem("refresh_token"), sessionStorage.removeItem("sessionKey"), sessionStorage.removeItem("sessionId"), s({
      loading: !1,
      user: void 0
    });
  }
  const Ke = {
    auth: i,
    clientId: t,
    signIn: u,
    signInGuest: w,
    signOut: N,
    signUp: h,
    signUpGuest: x,
    convertGuestToUserAccount: q,
    get: my,
    put: gy,
    list: wy,
    del: vy,
    fetchUser: o,
    refetchUser: () => c().then(() => {
    }),
    verifyEmail: by,
    requestNewVerificationCode: Da,
    requestNewVerificationEmail: Da,
    changePassword: xy,
    refreshAccessToken: bf,
    requestPasswordReset: (K, W) => tw(K, W, t),
    confirmPasswordReset: (K, W, te, pe) => rw(K, W, te, pe, t),
    requestAccountDeletion: hw,
    confirmAccountDeletion: dw,
    initiateGitHubAuth: async (K) => {
      try {
        return await nw(t, K);
      } catch (W) {
        throw console.error("Failed to initiate GitHub auth:", W), W;
      }
    },
    handleGitHubCallback: async (K, W, te) => {
      try {
        const { access_token: pe, refresh_token: Xe } = await iw(
          K,
          W,
          te
        );
        window.localStorage.setItem("access_token", pe), window.localStorage.setItem("refresh_token", Xe), await c();
      } catch (pe) {
        throw console.error("GitHub callback error:", pe), pe;
      }
    },
    initiateGoogleAuth: async (K) => {
      try {
        return await sw(t, K);
      } catch (W) {
        throw console.error("Failed to initiate Google auth:", W), W;
      }
    },
    handleGoogleCallback: async (K, W, te) => {
      try {
        const { access_token: pe, refresh_token: Xe } = await ow(
          K,
          W,
          te
        );
        window.localStorage.setItem("access_token", pe), window.localStorage.setItem("refresh_token", Xe), await c();
      } catch (pe) {
        throw console.error("Google callback error:", pe), pe;
      }
    },
    initiateAppleAuth: async (K) => {
      try {
        return await aw(t, K);
      } catch (W) {
        throw console.error("Failed to initiate Apple auth:", W), W;
      }
    },
    handleAppleCallback: async (K, W, te) => {
      try {
        const { access_token: pe, refresh_token: Xe } = await cw(
          K,
          W,
          te
        );
        window.localStorage.setItem("access_token", pe), window.localStorage.setItem("refresh_token", Xe), await c();
      } catch (pe) {
        throw console.error("Apple callback error:", pe), pe;
      }
    },
    handleAppleNativeSignIn: async (K, W) => {
      try {
        const { access_token: te, refresh_token: pe } = await lw(
          K,
          t,
          W
        );
        window.localStorage.setItem("access_token", te), window.localStorage.setItem("refresh_token", pe), await c();
      } catch (te) {
        throw console.error("Apple native sign-in error:", te), te;
      }
    },
    getPrivateKey: Ay,
    getPrivateKeyBytes: Sy,
    getPublicKey: Ey,
    signMessage: _y,
    apiUrl: e,
    pcrConfig: n,
    getAttestation: es,
    authenticate: Si,
    parseAttestationForView: rs,
    awsRootCertDer: ts,
    expectedRootCertHash: Rc,
    getAttestationDocument: async () => {
      const K = window.crypto.randomUUID(), W = await fetch(`${e}/attestation/${K}`);
      if (!W.ok)
        throw new Error("Failed to fetch attestation document");
      const te = await W.json(), pe = await Si(
        te.attestation_document,
        ts,
        K
      );
      return rs(pe, pe.cabundle, n);
    },
    generateThirdPartyToken: fw,
    encryptData: Iy,
    decryptData: ky,
    fetchModels: Cy,
    uploadDocument: xf,
    checkDocumentStatus: Af,
    uploadDocumentWithPolling: By
  };
  return /* @__PURE__ */ xd(Ty.Provider, { value: Ke, children: r });
}
const Ny = Ad({
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
  verifyEmail: uy,
  requestNewVerificationCode: Ua,
  requestNewVerificationEmail: Ua,
  requestPasswordReset: fy,
  confirmPasswordReset: hy,
  changePassword: dy,
  pcrConfig: {},
  getAttestation: es,
  authenticate: Si,
  parseAttestationForView: rs,
  awsRootCertDer: ts,
  expectedRootCertHash: Rc,
  getAttestationDocument: async () => {
    throw new Error("getAttestationDocument called outside of OpenSecretDeveloper provider");
  },
  createOrganization: L0,
  listOrganizations: H0,
  deleteOrganization: F0,
  createProject: z0,
  listProjects: G0,
  getProject: q0,
  updateProject: K0,
  deleteProject: Z0,
  createProjectSecret: W0,
  listProjectSecrets: Y0,
  deleteProjectSecret: J0,
  getEmailSettings: X0,
  updateEmailSettings: Q0,
  getOAuthSettings: ey,
  updateOAuthSettings: ty,
  inviteDeveloper: ry,
  listOrganizationMembers: oy,
  listOrganizationInvites: ny,
  getOrganizationInvite: iy,
  deleteOrganizationInvite: sy,
  updateMemberRole: ay,
  removeMember: cy,
  acceptInvite: ly,
  apiUrl: ""
});
function Ex({
  children: r,
  apiUrl: e,
  pcrConfig: t = {}
}) {
  const [n, i] = Sd({
    loading: !0,
    developer: void 0
  });
  If(() => {
    if (!e || e.trim() === "")
      throw new Error(
        "OpenSecretDeveloper requires a non-empty apiUrl. Please provide a valid API endpoint URL."
      );
    V1(e), Promise.resolve().then(() => Ed).then(({ apiConfig: w }) => {
      const x = w.appApiUrl || "";
      w.configure(x, e);
    }).catch((w) => {
      throw console.error("Failed to load apiConfig:", w), new Error(
        "Failed to initialize OpenSecretDeveloper - could not load required dependencies"
      );
    });
  }, [e]);
  async function s() {
    const w = window.localStorage.getItem("access_token"), x = window.localStorage.getItem("refresh_token");
    if (!w || !x) {
      i({
        loading: !1,
        developer: void 0
      });
      return;
    }
    try {
      const q = await q1();
      i({
        loading: !1,
        developer: {
          ...q.user,
          organizations: q.organizations
        }
      });
    } catch (q) {
      console.error("Failed to fetch developer:", q), i({
        loading: !1,
        developer: void 0
      });
    }
  }
  const o = async () => {
    const w = window.crypto.randomUUID(), x = await fetch(`${e}/attestation/${w}`);
    if (!x.ok)
      throw new Error("Failed to fetch attestation document");
    const q = await x.json(), N = await Si(
      q.attestation_document,
      ts,
      w
    );
    return rs(N, N.cabundle, t);
  };
  If(() => {
    s();
  }, []);
  async function c(w, x) {
    try {
      const { access_token: q, refresh_token: N } = await L1(w, x);
      return window.localStorage.setItem("access_token", q), window.localStorage.setItem("refresh_token", N), await s(), { access_token: q, refresh_token: N, id: "", email: w };
    } catch (q) {
      throw console.error("Login error:", q), q;
    }
  }
  async function u(w, x, q, N) {
    try {
      const { access_token: v, refresh_token: A } = await H1(
        w,
        x,
        q,
        N
      );
      return window.localStorage.setItem("access_token", v), window.localStorage.setItem("refresh_token", A), await s(), { access_token: v, refresh_token: A, id: "", email: w, name: N };
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
      const w = window.localStorage.getItem("refresh_token");
      if (w)
        try {
          await F1(w);
        } catch (x) {
          console.error("Error during logout:", x);
        }
      localStorage.removeItem("access_token"), localStorage.removeItem("refresh_token"), i({
        loading: !1,
        developer: void 0
      });
    },
    verifyEmail: uy,
    requestNewVerificationCode: Ua,
    requestNewVerificationEmail: Ua,
    requestPasswordReset: fy,
    confirmPasswordReset: hy,
    changePassword: dy,
    pcrConfig: t,
    getAttestation: es,
    authenticate: Si,
    parseAttestationForView: rs,
    awsRootCertDer: ts,
    expectedRootCertHash: Rc,
    getAttestationDocument: o,
    createOrganization: L0,
    listOrganizations: H0,
    deleteOrganization: F0,
    createProject: z0,
    listProjects: G0,
    getProject: q0,
    updateProject: K0,
    deleteProject: Z0,
    createProjectSecret: W0,
    listProjectSecrets: Y0,
    deleteProjectSecret: J0,
    getEmailSettings: X0,
    updateEmailSettings: Q0,
    getOAuthSettings: ey,
    updateOAuthSettings: ty,
    inviteDeveloper: ry,
    listOrganizationMembers: oy,
    listOrganizationInvites: ny,
    getOrganizationInvite: iy,
    deleteOrganizationInvite: sy,
    updateMemberRole: ay,
    removeMember: cy,
    acceptInvite: ly,
    apiUrl: e
  };
  return /* @__PURE__ */ xd(Ny.Provider, { value: h, children: r });
}
function Ix() {
  return _d(Ty);
}
function kx() {
  return _d(Ny);
}
function Cx() {
  const r = new Uint8Array(32);
  return crypto.getRandomValues(r), Array.from(r, (e) => e.toString(16).padStart(2, "0")).join("");
}
async function Bx(r) {
  const t = new TextEncoder().encode(r), n = await crypto.subtle.digest("SHA-256", t);
  return Array.from(new Uint8Array(n)).map((s) => s.toString(16).padStart(2, "0")).join("");
}
export {
  Ty as OpenSecretContext,
  Ex as OpenSecretDeveloper,
  Ny as OpenSecretDeveloperContext,
  _x as OpenSecretProvider,
  Lo as apiConfig,
  Cx as generateSecureSecret,
  Bx as hashSecret,
  Ix as useOpenSecret,
  kx as useOpenSecretDeveloper
};
