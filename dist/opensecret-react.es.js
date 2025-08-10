var jy = Object.defineProperty;
var If = (r) => {
  throw TypeError(r);
};
var Ry = (r, e, t) => e in r ? jy(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var He = (r, e, t) => Ry(r, typeof e != "symbol" ? e + "" : e, t), Mc = (r, e, t) => e.has(r) || If("Cannot " + t);
var $ = (r, e, t) => (Mc(r, e, "read from private field"), t ? t.call(r) : e.get(r)), rr = (r, e, t) => e.has(r) ? If("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(r) : e.set(r, t), kt = (r, e, t, n) => (Mc(r, e, "write to private field"), n ? n.call(r, t) : e.set(r, t), t), De = (r, e, t) => (Mc(r, e, "access private method"), t);
var kf = (r, e, t, n) => ({
  set _(i) {
    kt(r, e, i, t);
  },
  get _() {
    return $(r, e, n);
  }
});
import { jsx as xd } from "react/jsx-runtime";
import { createContext as Ad, useState as nl, useEffect as Lo, useContext as Sd } from "react";
class Uy {
  constructor() {
    He(this, "_appApiUrl", "");
    He(this, "_platformApiUrl", "");
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
const Ho = new Uy(), _d = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  apiConfig: Ho
}, Symbol.toStringTag, { value: "Module" })), hr = 256;
class Dy {
  // TODO(dchest): methods to encode chunk-by-chunk.
  constructor(e = "=") {
    He(this, "_paddingCharacter");
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
const Ed = new Dy();
function Br(r) {
  return Ed.encode(r);
}
function js(r) {
  return Ed.decode(r);
}
function Gt(r, e = new Uint8Array(4), t = 0) {
  return e[t + 0] = r >>> 0, e[t + 1] = r >>> 8, e[t + 2] = r >>> 16, e[t + 3] = r >>> 24, e;
}
function Cf(r, e = new Uint8Array(8), t = 0) {
  return Gt(r >>> 0, e, t), Gt(r / 4294967296 >>> 0, e, t + 4), e;
}
function Cr(r) {
  for (let e = 0; e < r.length; e++)
    r[e] = 0;
  return r;
}
const $y = 20;
function My(r, e, t) {
  let n = 1634760805, i = 857760878, s = 2036477234, o = 1797285236, c = t[3] << 24 | t[2] << 16 | t[1] << 8 | t[0], u = t[7] << 24 | t[6] << 16 | t[5] << 8 | t[4], h = t[11] << 24 | t[10] << 16 | t[9] << 8 | t[8], m = t[15] << 24 | t[14] << 16 | t[13] << 8 | t[12], x = t[19] << 24 | t[18] << 16 | t[17] << 8 | t[16], G = t[23] << 24 | t[22] << 16 | t[21] << 8 | t[20], N = t[27] << 24 | t[26] << 16 | t[25] << 8 | t[24], v = t[31] << 24 | t[30] << 16 | t[29] << 8 | t[28], A = e[3] << 24 | e[2] << 16 | e[1] << 8 | e[0], O = e[7] << 24 | e[6] << 16 | e[5] << 8 | e[4], I = e[11] << 24 | e[10] << 16 | e[9] << 8 | e[8], P = e[15] << 24 | e[14] << 16 | e[13] << 8 | e[12], R = n, ue = i, Ge = s, Je = o, je = c, W = u, ie = h, te = m, xe = x, tt = G, At = N, It = v, dt = A, Qe = O, ae = I, Ee = P;
  for (let gt = 0; gt < $y; gt += 2)
    R = R + je | 0, dt ^= R, dt = dt >>> 16 | dt << 16, xe = xe + dt | 0, je ^= xe, je = je >>> 20 | je << 12, ue = ue + W | 0, Qe ^= ue, Qe = Qe >>> 16 | Qe << 16, tt = tt + Qe | 0, W ^= tt, W = W >>> 20 | W << 12, Ge = Ge + ie | 0, ae ^= Ge, ae = ae >>> 16 | ae << 16, At = At + ae | 0, ie ^= At, ie = ie >>> 20 | ie << 12, Je = Je + te | 0, Ee ^= Je, Ee = Ee >>> 16 | Ee << 16, It = It + Ee | 0, te ^= It, te = te >>> 20 | te << 12, Ge = Ge + ie | 0, ae ^= Ge, ae = ae >>> 24 | ae << 8, At = At + ae | 0, ie ^= At, ie = ie >>> 25 | ie << 7, Je = Je + te | 0, Ee ^= Je, Ee = Ee >>> 24 | Ee << 8, It = It + Ee | 0, te ^= It, te = te >>> 25 | te << 7, ue = ue + W | 0, Qe ^= ue, Qe = Qe >>> 24 | Qe << 8, tt = tt + Qe | 0, W ^= tt, W = W >>> 25 | W << 7, R = R + je | 0, dt ^= R, dt = dt >>> 24 | dt << 8, xe = xe + dt | 0, je ^= xe, je = je >>> 25 | je << 7, R = R + W | 0, Ee ^= R, Ee = Ee >>> 16 | Ee << 16, At = At + Ee | 0, W ^= At, W = W >>> 20 | W << 12, ue = ue + ie | 0, dt ^= ue, dt = dt >>> 16 | dt << 16, It = It + dt | 0, ie ^= It, ie = ie >>> 20 | ie << 12, Ge = Ge + te | 0, Qe ^= Ge, Qe = Qe >>> 16 | Qe << 16, xe = xe + Qe | 0, te ^= xe, te = te >>> 20 | te << 12, Je = Je + je | 0, ae ^= Je, ae = ae >>> 16 | ae << 16, tt = tt + ae | 0, je ^= tt, je = je >>> 20 | je << 12, Ge = Ge + te | 0, Qe ^= Ge, Qe = Qe >>> 24 | Qe << 8, xe = xe + Qe | 0, te ^= xe, te = te >>> 25 | te << 7, Je = Je + je | 0, ae ^= Je, ae = ae >>> 24 | ae << 8, tt = tt + ae | 0, je ^= tt, je = je >>> 25 | je << 7, ue = ue + ie | 0, dt ^= ue, dt = dt >>> 24 | dt << 8, It = It + dt | 0, ie ^= It, ie = ie >>> 25 | ie << 7, R = R + W | 0, Ee ^= R, Ee = Ee >>> 24 | Ee << 8, At = At + Ee | 0, W ^= At, W = W >>> 25 | W << 7;
  Gt(R + n | 0, r, 0), Gt(ue + i | 0, r, 4), Gt(Ge + s | 0, r, 8), Gt(Je + o | 0, r, 12), Gt(je + c | 0, r, 16), Gt(W + u | 0, r, 20), Gt(ie + h | 0, r, 24), Gt(te + m | 0, r, 28), Gt(xe + x | 0, r, 32), Gt(tt + G | 0, r, 36), Gt(At + N | 0, r, 40), Gt(It + v | 0, r, 44), Gt(dt + A | 0, r, 48), Gt(Qe + O | 0, r, 52), Gt(ae + I | 0, r, 56), Gt(Ee + P | 0, r, 60);
}
function il(r, e, t, n, i = 0) {
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
function Bf(r, e, t, n = 0) {
  return Cr(t), il(r, e, t, t, n);
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
    He(this, "digestLength", Fy);
    He(this, "_buffer", new Uint8Array(16));
    He(this, "_r", new Uint16Array(10));
    He(this, "_h", new Uint16Array(10));
    He(this, "_pad", new Uint16Array(8));
    He(this, "_leftover", 0);
    He(this, "_fin", 0);
    He(this, "_finished", !1);
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
    let i = this._fin ? 0 : 2048, s = this._h[0], o = this._h[1], c = this._h[2], u = this._h[3], h = this._h[4], m = this._h[5], x = this._h[6], G = this._h[7], N = this._h[8], v = this._h[9], A = this._r[0], O = this._r[1], I = this._r[2], P = this._r[3], R = this._r[4], ue = this._r[5], Ge = this._r[6], Je = this._r[7], je = this._r[8], W = this._r[9];
    for (; n >= 16; ) {
      let ie = e[t + 0] | e[t + 1] << 8;
      s += ie & 8191;
      let te = e[t + 2] | e[t + 3] << 8;
      o += (ie >>> 13 | te << 3) & 8191;
      let xe = e[t + 4] | e[t + 5] << 8;
      c += (te >>> 10 | xe << 6) & 8191;
      let tt = e[t + 6] | e[t + 7] << 8;
      u += (xe >>> 7 | tt << 9) & 8191;
      let At = e[t + 8] | e[t + 9] << 8;
      h += (tt >>> 4 | At << 12) & 8191, m += At >>> 1 & 8191;
      let It = e[t + 10] | e[t + 11] << 8;
      x += (At >>> 14 | It << 2) & 8191;
      let dt = e[t + 12] | e[t + 13] << 8;
      G += (It >>> 11 | dt << 5) & 8191;
      let Qe = e[t + 14] | e[t + 15] << 8;
      N += (dt >>> 8 | Qe << 8) & 8191, v += Qe >>> 5 | i;
      let ae = 0, Ee = ae;
      Ee += s * A, Ee += o * (5 * W), Ee += c * (5 * je), Ee += u * (5 * Je), Ee += h * (5 * Ge), ae = Ee >>> 13, Ee &= 8191, Ee += m * (5 * ue), Ee += x * (5 * R), Ee += G * (5 * P), Ee += N * (5 * I), Ee += v * (5 * O), ae += Ee >>> 13, Ee &= 8191;
      let gt = ae;
      gt += s * O, gt += o * A, gt += c * (5 * W), gt += u * (5 * je), gt += h * (5 * Je), ae = gt >>> 13, gt &= 8191, gt += m * (5 * Ge), gt += x * (5 * ue), gt += G * (5 * R), gt += N * (5 * P), gt += v * (5 * I), ae += gt >>> 13, gt &= 8191;
      let Ut = ae;
      Ut += s * I, Ut += o * O, Ut += c * A, Ut += u * (5 * W), Ut += h * (5 * je), ae = Ut >>> 13, Ut &= 8191, Ut += m * (5 * Je), Ut += x * (5 * Ge), Ut += G * (5 * ue), Ut += N * (5 * R), Ut += v * (5 * P), ae += Ut >>> 13, Ut &= 8191;
      let Dt = ae;
      Dt += s * P, Dt += o * I, Dt += c * O, Dt += u * A, Dt += h * (5 * W), ae = Dt >>> 13, Dt &= 8191, Dt += m * (5 * je), Dt += x * (5 * Je), Dt += G * (5 * Ge), Dt += N * (5 * ue), Dt += v * (5 * R), ae += Dt >>> 13, Dt &= 8191;
      let fe = ae;
      fe += s * R, fe += o * P, fe += c * I, fe += u * O, fe += h * A, ae = fe >>> 13, fe &= 8191, fe += m * (5 * W), fe += x * (5 * je), fe += G * (5 * Je), fe += N * (5 * Ge), fe += v * (5 * ue), ae += fe >>> 13, fe &= 8191;
      let st = ae;
      st += s * ue, st += o * R, st += c * P, st += u * I, st += h * O, ae = st >>> 13, st &= 8191, st += m * A, st += x * (5 * W), st += G * (5 * je), st += N * (5 * Je), st += v * (5 * Ge), ae += st >>> 13, st &= 8191;
      let vt = ae;
      vt += s * Ge, vt += o * ue, vt += c * R, vt += u * P, vt += h * I, ae = vt >>> 13, vt &= 8191, vt += m * O, vt += x * A, vt += G * (5 * W), vt += N * (5 * je), vt += v * (5 * Je), ae += vt >>> 13, vt &= 8191;
      let ee = ae;
      ee += s * Je, ee += o * Ge, ee += c * ue, ee += u * R, ee += h * P, ae = ee >>> 13, ee &= 8191, ee += m * I, ee += x * O, ee += G * A, ee += N * (5 * W), ee += v * (5 * je), ae += ee >>> 13, ee &= 8191;
      let pt = ae;
      pt += s * je, pt += o * Je, pt += c * Ge, pt += u * ue, pt += h * R, ae = pt >>> 13, pt &= 8191, pt += m * P, pt += x * I, pt += G * O, pt += N * A, pt += v * (5 * W), ae += pt >>> 13, pt &= 8191;
      let Vt = ae;
      Vt += s * W, Vt += o * je, Vt += c * Je, Vt += u * Ge, Vt += h * ue, ae = Vt >>> 13, Vt &= 8191, Vt += m * R, Vt += x * P, Vt += G * I, Vt += N * O, Vt += v * A, ae += Vt >>> 13, Vt &= 8191, ae = (ae << 2) + ae | 0, ae = ae + Ee | 0, Ee = ae & 8191, ae = ae >>> 13, gt += ae, s = Ee, o = gt, c = Ut, u = Dt, h = fe, m = st, x = vt, G = ee, N = pt, v = Vt, t += 16, n -= 16;
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
const Gy = 32, qy = 12, Ky = 16, Of = new Uint8Array(16);
class Tu {
  /**
   * Creates a new instance with the given 32-byte key.
   */
  constructor(e) {
    He(this, "nonceLength", qy);
    He(this, "tagLength", Ky);
    He(this, "_key");
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
    Bf(this._key, s, o, 4);
    const c = t.length + this.tagLength;
    let u;
    if (i) {
      if (i.length !== c)
        throw new Error("ChaCha20Poly1305: incorrect destination length");
      u = i;
    } else
      u = new Uint8Array(c);
    return il(this._key, s, t, u, 4), this._authenticate(u.subarray(u.length - this.tagLength, u.length), o, u.subarray(0, u.length - this.tagLength), n), Cr(s), u;
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
    Bf(this._key, s, o, 4);
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
    return il(this._key, s, t.subarray(0, t.length - this.tagLength), h, 4), Cr(s), h;
  }
  clean() {
    return Cr(this._key), this;
  }
  _authenticate(e, t, n, i) {
    const s = new zy(t);
    i && (s.update(i), i.length % 16 > 0 && s.update(Of.subarray(i.length % 16))), s.update(n), n.length % 16 > 0 && s.update(Of.subarray(n.length % 16));
    const o = new Uint8Array(8);
    i && Cf(i.length, o), s.update(o), Cf(n.length, o), s.update(o);
    const c = s.digest();
    for (let u = 0; u < c.length; u++)
      e[u] = c[u];
    s.clean(), Cr(c), Cr(o);
  }
}
const Tf = 65536;
class Zy {
  constructor() {
    He(this, "isAvailable", !1);
    He(this, "isInstantiated", !1);
    typeof crypto < "u" && "getRandomValues" in crypto && (this.isAvailable = !0, this.isInstantiated = !0);
  }
  randomBytes(e) {
    if (!this.isAvailable)
      throw new Error("System random byte generator is not available.");
    const t = new Uint8Array(e);
    for (let n = 0; n < t.length; n += Tf)
      crypto.getRandomValues(t.subarray(n, n + Math.min(t.length - n, Tf)));
    return t;
  }
}
const Wy = new Zy();
function Yy(r, e = Wy) {
  return e.randomBytes(r);
}
function Id(r, e) {
  const t = new Tu(r), n = Yy(12), s = new TextEncoder().encode(e), o = t.seal(n, s), c = new Uint8Array(n.length + o.length);
  return c.set(n), c.set(o, n.length), Br(c);
}
function kd(r, e) {
  const t = new Tu(r), n = js(e), i = 12, s = n.slice(0, i), o = n.slice(i), c = t.open(s, o);
  if (!c)
    throw new Error("Decryption failed");
  return new TextDecoder().decode(c);
}
var sl = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Jy(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function Xy(r) {
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
var Nf;
(function(r) {
  (function(e) {
    var t = typeof globalThis == "object" ? globalThis : typeof sl == "object" ? sl : typeof self == "object" ? self : typeof this == "object" ? this : c(), n = i(r);
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
    }, x = Object.getPrototypeOf(Function), G = typeof Map == "function" && typeof Map.prototype.entries == "function" ? Map : bs(), N = typeof Set == "function" && typeof Set.prototype.entries == "function" ? Set : xs(), v = typeof WeakMap == "function" ? WeakMap : Co(), A = i ? Symbol.for("@reflect-metadata:registry") : void 0, O = ms(), I = Oi(O);
    function P(_, k, T, q) {
      if (fe(T)) {
        if (!hs(_))
          throw new TypeError();
        if (!ds(k))
          throw new TypeError();
        return tt(_, k);
      } else {
        if (!hs(_))
          throw new TypeError();
        if (!ee(k))
          throw new TypeError();
        if (!ee(q) && !fe(q) && !st(q))
          throw new TypeError();
        return st(q) && (q = void 0), T = or(T), At(_, k, T, q);
      }
    }
    e("decorate", P);
    function R(_, k) {
      function T(q, be) {
        if (!ee(q))
          throw new TypeError();
        if (!fe(be) && !$c(be))
          throw new TypeError();
        Ee(_, k, q, be);
      }
      return T;
    }
    e("metadata", R);
    function ue(_, k, T, q) {
      if (!ee(T))
        throw new TypeError();
      return fe(q) || (q = or(q)), Ee(_, k, T, q);
    }
    e("defineMetadata", ue);
    function Ge(_, k, T) {
      if (!ee(k))
        throw new TypeError();
      return fe(T) || (T = or(T)), It(_, k, T);
    }
    e("hasMetadata", Ge);
    function Je(_, k, T) {
      if (!ee(k))
        throw new TypeError();
      return fe(T) || (T = or(T)), dt(_, k, T);
    }
    e("hasOwnMetadata", Je);
    function je(_, k, T) {
      if (!ee(k))
        throw new TypeError();
      return fe(T) || (T = or(T)), Qe(_, k, T);
    }
    e("getMetadata", je);
    function W(_, k, T) {
      if (!ee(k))
        throw new TypeError();
      return fe(T) || (T = or(T)), ae(_, k, T);
    }
    e("getOwnMetadata", W);
    function ie(_, k) {
      if (!ee(_))
        throw new TypeError();
      return fe(k) || (k = or(k)), gt(_, k);
    }
    e("getMetadataKeys", ie);
    function te(_, k) {
      if (!ee(_))
        throw new TypeError();
      return fe(k) || (k = or(k)), Ut(_, k);
    }
    e("getOwnMetadataKeys", te);
    function xe(_, k, T) {
      if (!ee(k))
        throw new TypeError();
      if (fe(T) || (T = or(T)), !ee(k))
        throw new TypeError();
      fe(T) || (T = or(T));
      var q = Wr(
        k,
        T,
        /*Create*/
        !1
      );
      return fe(q) ? !1 : q.OrdinaryDeleteMetadata(_, k, T);
    }
    e("deleteMetadata", xe);
    function tt(_, k) {
      for (var T = _.length - 1; T >= 0; --T) {
        var q = _[T], be = q(k);
        if (!fe(be) && !st(be)) {
          if (!ds(be))
            throw new TypeError();
          k = be;
        }
      }
      return k;
    }
    function At(_, k, T, q) {
      for (var be = _.length - 1; be >= 0; --be) {
        var St = _[be], _t = St(k, T, q);
        if (!fe(_t) && !st(_t)) {
          if (!ee(_t))
            throw new TypeError();
          q = _t;
        }
      }
      return q;
    }
    function It(_, k, T) {
      var q = dt(_, k, T);
      if (q)
        return !0;
      var be = Bi(k);
      return st(be) ? !1 : It(_, be, T);
    }
    function dt(_, k, T) {
      var q = Wr(
        k,
        T,
        /*Create*/
        !1
      );
      return fe(q) ? !1 : fs(q.OrdinaryHasOwnMetadata(_, k, T));
    }
    function Qe(_, k, T) {
      var q = dt(_, k, T);
      if (q)
        return ae(_, k, T);
      var be = Bi(k);
      if (!st(be))
        return Qe(_, be, T);
    }
    function ae(_, k, T) {
      var q = Wr(
        k,
        T,
        /*Create*/
        !1
      );
      if (!fe(q))
        return q.OrdinaryGetOwnMetadata(_, k, T);
    }
    function Ee(_, k, T, q) {
      var be = Wr(
        T,
        q,
        /*Create*/
        !0
      );
      be.OrdinaryDefineOwnMetadata(_, k, T, q);
    }
    function gt(_, k) {
      var T = Ut(_, k), q = Bi(_);
      if (q === null)
        return T;
      var be = gt(q, k);
      if (be.length <= 0)
        return T;
      if (T.length <= 0)
        return be;
      for (var St = new N(), _t = [], Re = 0, Z = T; Re < Z.length; Re++) {
        var re = Z[Re], he = St.has(re);
        he || (St.add(re), _t.push(re));
      }
      for (var ge = 0, Xe = be; ge < Xe.length; ge++) {
        var re = Xe[ge], he = St.has(re);
        he || (St.add(re), _t.push(re));
      }
      return _t;
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
    function fe(_) {
      return _ === void 0;
    }
    function st(_) {
      return _ === null;
    }
    function vt(_) {
      return typeof _ == "symbol";
    }
    function ee(_) {
      return typeof _ == "object" ? _ !== null : typeof _ == "function";
    }
    function pt(_, k) {
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
      var T = "string", q = ko(_, s);
      if (q !== void 0) {
        var be = q.call(_, T);
        if (ee(be))
          throw new TypeError();
        return be;
      }
      return Vt(_);
    }
    function Vt(_, k) {
      var T, q;
      {
        var be = _.toString;
        if (pn(be)) {
          var q = be.call(_);
          if (!ee(q))
            return q;
        }
        var T = _.valueOf;
        if (pn(T)) {
          var q = T.call(_);
          if (!ee(q))
            return q;
        }
      }
      throw new TypeError();
    }
    function fs(_) {
      return !!_;
    }
    function Ci(_) {
      return "" + _;
    }
    function or(_) {
      var k = pt(_);
      return vt(k) ? k : Ci(k);
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
    function $c(_) {
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
      if (!ee(T))
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
    function Bi(_) {
      var k = Object.getPrototypeOf(_);
      if (typeof _ != "function" || _ === x || k !== x)
        return k;
      var T = _.prototype, q = T && Object.getPrototypeOf(T);
      if (q == null || q === Object.prototype)
        return k;
      var be = q.constructor;
      return typeof be != "function" || be === _ ? k : be;
    }
    function vs() {
      var _;
      !fe(A) && typeof t.Reflect < "u" && !(A in t.Reflect) && typeof t.Reflect.defineMetadata == "function" && (_ = ws(t.Reflect));
      var k, T, q, be = new v(), St = {
        registerProvider: _t,
        getProvider: Z,
        setProvider: he
      };
      return St;
      function _t(ge) {
        if (!Object.isExtensible(St))
          throw new Error("Cannot add provider to a frozen registry.");
        switch (!0) {
          case _ === ge:
            break;
          case fe(k):
            k = ge;
            break;
          case k === ge:
            break;
          case fe(T):
            T = ge;
            break;
          case T === ge:
            break;
          default:
            q === void 0 && (q = new N()), q.add(ge);
            break;
        }
      }
      function Re(ge, Xe) {
        if (!fe(k)) {
          if (k.isProviderFor(ge, Xe))
            return k;
          if (!fe(T)) {
            if (T.isProviderFor(ge, Xe))
              return k;
            if (!fe(q))
              for (var rt = ys(q); ; ) {
                var mt = Zr(rt);
                if (!mt)
                  return;
                var zt = gs(mt);
                if (zt.isProviderFor(ge, Xe))
                  return Xn(rt), zt;
              }
          }
        }
        if (!fe(_) && _.isProviderFor(ge, Xe))
          return _;
      }
      function Z(ge, Xe) {
        var rt = be.get(ge), mt;
        return fe(rt) || (mt = rt.get(Xe)), fe(mt) && (mt = Re(ge, Xe), fe(mt) || (fe(rt) && (rt = new G(), be.set(ge, rt)), rt.set(Xe, mt))), mt;
      }
      function re(ge) {
        if (fe(ge))
          throw new TypeError();
        return k === ge || T === ge || !fe(q) && q.has(ge);
      }
      function he(ge, Xe, rt) {
        if (!re(rt))
          throw new Error("Metadata provider not registered.");
        var mt = Z(ge, Xe);
        if (mt !== rt) {
          if (!fe(mt))
            return !1;
          var zt = be.get(ge);
          fe(zt) && (zt = new G(), be.set(ge, zt)), zt.set(Xe, rt);
        }
        return !0;
      }
    }
    function ms() {
      var _;
      return !fe(A) && ee(t.Reflect) && Object.isExtensible(t.Reflect) && (_ = t.Reflect[A]), fe(_) && (_ = vs()), !fe(A) && ee(t.Reflect) && Object.isExtensible(t.Reflect) && Object.defineProperty(t.Reflect, A, {
        enumerable: !1,
        configurable: !1,
        writable: !1,
        value: _
      }), _;
    }
    function Oi(_) {
      var k = new v(), T = {
        isProviderFor: function(re, he) {
          var ge = k.get(re);
          return fe(ge) ? !1 : ge.has(he);
        },
        OrdinaryDefineOwnMetadata: _t,
        OrdinaryHasOwnMetadata: be,
        OrdinaryGetOwnMetadata: St,
        OrdinaryOwnMetadataKeys: Re,
        OrdinaryDeleteMetadata: Z
      };
      return O.registerProvider(T), T;
      function q(re, he, ge) {
        var Xe = k.get(re), rt = !1;
        if (fe(Xe)) {
          if (!ge)
            return;
          Xe = new G(), k.set(re, Xe), rt = !0;
        }
        var mt = Xe.get(he);
        if (fe(mt)) {
          if (!ge)
            return;
          if (mt = new G(), Xe.set(he, mt), !_.setProvider(re, he, T))
            throw Xe.delete(he), rt && k.delete(re), new Error("Wrong provider for target.");
        }
        return mt;
      }
      function be(re, he, ge) {
        var Xe = q(
          he,
          ge,
          /*Create*/
          !1
        );
        return fe(Xe) ? !1 : fs(Xe.has(re));
      }
      function St(re, he, ge) {
        var Xe = q(
          he,
          ge,
          /*Create*/
          !1
        );
        if (!fe(Xe))
          return Xe.get(re);
      }
      function _t(re, he, ge, Xe) {
        var rt = q(
          ge,
          Xe,
          /*Create*/
          !0
        );
        rt.set(re, he);
      }
      function Re(re, he) {
        var ge = [], Xe = q(
          re,
          he,
          /*Create*/
          !1
        );
        if (fe(Xe))
          return ge;
        for (var rt = Xe.keys(), mt = ys(rt), zt = 0; ; ) {
          var Ti = Zr(mt);
          if (!Ti)
            return ge.length = zt, ge;
          var Ss = gs(Ti);
          try {
            ge[zt] = Ss;
          } catch (Bo) {
            try {
              Xn(mt);
            } finally {
              throw Bo;
            }
          }
          zt++;
        }
      }
      function Z(re, he, ge) {
        var Xe = q(
          he,
          ge,
          /*Create*/
          !1
        );
        if (fe(Xe) || !Xe.delete(re))
          return !1;
        if (Xe.size === 0) {
          var rt = k.get(he);
          fe(rt) || (rt.delete(ge), rt.size === 0 && k.delete(rt));
        }
        return !0;
      }
    }
    function ws(_) {
      var k = _.defineMetadata, T = _.hasOwnMetadata, q = _.getOwnMetadata, be = _.getOwnMetadataKeys, St = _.deleteMetadata, _t = new v(), Re = {
        isProviderFor: function(Z, re) {
          var he = _t.get(Z);
          return !fe(he) && he.has(re) ? !0 : be(Z, re).length ? (fe(he) && (he = new N(), _t.set(Z, he)), he.add(re), !0) : !1;
        },
        OrdinaryDefineOwnMetadata: k,
        OrdinaryHasOwnMetadata: T,
        OrdinaryGetOwnMetadata: q,
        OrdinaryOwnMetadataKeys: be,
        OrdinaryDeleteMetadata: St
      };
      return Re;
    }
    function Wr(_, k, T) {
      var q = O.getProvider(_, k);
      if (!fe(q))
        return q;
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
          function Re(Z, re, he) {
            this._index = 0, this._keys = Z, this._values = re, this._selector = he;
          }
          return Re.prototype["@@iterator"] = function() {
            return this;
          }, Re.prototype[o] = function() {
            return this;
          }, Re.prototype.next = function() {
            var Z = this._index;
            if (Z >= 0 && Z < this._keys.length) {
              var re = this._selector(this._keys[Z], this._values[Z]);
              return Z + 1 >= this._keys.length ? (this._index = -1, this._keys = k, this._values = k) : this._index++, { value: re, done: !1 };
            }
            return { value: void 0, done: !0 };
          }, Re.prototype.throw = function(Z) {
            throw this._index >= 0 && (this._index = -1, this._keys = k, this._values = k), Z;
          }, Re.prototype.return = function(Z) {
            return this._index >= 0 && (this._index = -1, this._keys = k, this._values = k), { value: Z, done: !0 };
          }, Re;
        }()
      ), q = (
        /** @class */
        function() {
          function Re() {
            this._keys = [], this._values = [], this._cacheKey = _, this._cacheIndex = -2;
          }
          return Object.defineProperty(Re.prototype, "size", {
            get: function() {
              return this._keys.length;
            },
            enumerable: !0,
            configurable: !0
          }), Re.prototype.has = function(Z) {
            return this._find(
              Z,
              /*insert*/
              !1
            ) >= 0;
          }, Re.prototype.get = function(Z) {
            var re = this._find(
              Z,
              /*insert*/
              !1
            );
            return re >= 0 ? this._values[re] : void 0;
          }, Re.prototype.set = function(Z, re) {
            var he = this._find(
              Z,
              /*insert*/
              !0
            );
            return this._values[he] = re, this;
          }, Re.prototype.delete = function(Z) {
            var re = this._find(
              Z,
              /*insert*/
              !1
            );
            if (re >= 0) {
              for (var he = this._keys.length, ge = re + 1; ge < he; ge++)
                this._keys[ge - 1] = this._keys[ge], this._values[ge - 1] = this._values[ge];
              return this._keys.length--, this._values.length--, ps(Z, this._cacheKey) && (this._cacheKey = _, this._cacheIndex = -2), !0;
            }
            return !1;
          }, Re.prototype.clear = function() {
            this._keys.length = 0, this._values.length = 0, this._cacheKey = _, this._cacheIndex = -2;
          }, Re.prototype.keys = function() {
            return new T(this._keys, this._values, be);
          }, Re.prototype.values = function() {
            return new T(this._keys, this._values, St);
          }, Re.prototype.entries = function() {
            return new T(this._keys, this._values, _t);
          }, Re.prototype["@@iterator"] = function() {
            return this.entries();
          }, Re.prototype[o] = function() {
            return this.entries();
          }, Re.prototype._find = function(Z, re) {
            if (!ps(this._cacheKey, Z)) {
              this._cacheIndex = -1;
              for (var he = 0; he < this._keys.length; he++)
                if (ps(this._keys[he], Z)) {
                  this._cacheIndex = he;
                  break;
                }
            }
            return this._cacheIndex < 0 && re && (this._cacheIndex = this._keys.length, this._keys.push(Z), this._values.push(void 0)), this._cacheIndex;
          }, Re;
        }()
      );
      return q;
      function be(Re, Z) {
        return Re;
      }
      function St(Re, Z) {
        return Z;
      }
      function _t(Re, Z) {
        return [Re, Z];
      }
    }
    function xs() {
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
    function Co() {
      var _ = 16, k = m.create(), T = q();
      return (
        /** @class */
        function() {
          function Z() {
            this._key = q();
          }
          return Z.prototype.has = function(re) {
            var he = be(
              re,
              /*create*/
              !1
            );
            return he !== void 0 ? m.has(he, this._key) : !1;
          }, Z.prototype.get = function(re) {
            var he = be(
              re,
              /*create*/
              !1
            );
            return he !== void 0 ? m.get(he, this._key) : void 0;
          }, Z.prototype.set = function(re, he) {
            var ge = be(
              re,
              /*create*/
              !0
            );
            return ge[this._key] = he, this;
          }, Z.prototype.delete = function(re) {
            var he = be(
              re,
              /*create*/
              !1
            );
            return he !== void 0 ? delete he[this._key] : !1;
          }, Z.prototype.clear = function() {
            this._key = q();
          }, Z;
        }()
      );
      function q() {
        var Z;
        do
          Z = "@@WeakMap@@" + Re();
        while (m.has(k, Z));
        return k[Z] = !0, Z;
      }
      function be(Z, re) {
        if (!n.call(Z, T)) {
          if (!re)
            return;
          Object.defineProperty(Z, T, { value: m.create() });
        }
        return Z[T];
      }
      function St(Z, re) {
        for (var he = 0; he < re; ++he)
          Z[he] = Math.random() * 255 | 0;
        return Z;
      }
      function _t(Z) {
        if (typeof Uint8Array == "function") {
          var re = new Uint8Array(Z);
          return typeof crypto < "u" ? crypto.getRandomValues(re) : typeof msCrypto < "u" ? msCrypto.getRandomValues(re) : St(re, Z), re;
        }
        return St(new Array(Z), Z);
      }
      function Re() {
        var Z = _t(_);
        Z[6] = Z[6] & 79 | 64, Z[8] = Z[8] & 191 | 128;
        for (var re = "", he = 0; he < _; ++he) {
          var ge = Z[he];
          (he === 4 || he === 6 || he === 8) && (re += "-"), ge < 16 && (re += "0"), re += ge.toString(16).toLowerCase();
        }
        return re;
      }
    }
    function As(_) {
      return _.__ = void 0, delete _.__, _;
    }
  });
})(Nf || (Nf = {}));
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
const Qy = "[object ArrayBuffer]";
class Y {
  static isArrayBuffer(e) {
    return Object.prototype.toString.call(e) === Qy;
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
    const n = Y.toUint8Array(e), i = Y.toUint8Array(t);
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
const Vc = "string", eg = /^[0-9a-f]+$/i, tg = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/, rg = /^[a-zA-Z0-9-_]+$/;
class Pf {
  static fromString(e) {
    const t = unescape(encodeURIComponent(e)), n = new Uint8Array(t.length);
    for (let i = 0; i < t.length; i++)
      n[i] = t.charCodeAt(i);
    return n.buffer;
  }
  static toString(e) {
    const t = Y.toUint8Array(e);
    let n = "";
    for (let s = 0; s < t.length; s++)
      n += String.fromCharCode(t[s]);
    return decodeURIComponent(escape(n));
  }
}
class Yr {
  static toString(e, t = !1) {
    const n = Y.toArrayBuffer(e), i = new DataView(n);
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
class de {
  static isHex(e) {
    return typeof e === Vc && eg.test(e);
  }
  static isBase64(e) {
    return typeof e === Vc && tg.test(e);
  }
  static isBase64Url(e) {
    return typeof e === Vc && rg.test(e);
  }
  static ToString(e, t = "utf8") {
    const n = Y.toUint8Array(e);
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
    const t = Y.toUint8Array(e);
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
    if (!de.isBase64(t))
      throw new TypeError("Argument 'base64Text' is not Base64 encoded");
    return typeof atob < "u" ? this.FromBinary(atob(t)) : new Uint8Array(Buffer.from(t, "base64")).buffer;
  }
  static FromBase64Url(e) {
    const t = this.formatString(e);
    if (!t)
      return new ArrayBuffer(0);
    if (!de.isBase64Url(t))
      throw new TypeError("Argument 'base64url' is not Base64Url encoded");
    return this.FromBase64(this.Base64Padding(t.replace(/\-/g, "+").replace(/\_/g, "/")));
  }
  static ToBase64Url(e) {
    return this.ToBase64(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
  }
  static FromUtf8String(e, t = de.DEFAULT_UTF8_ENCODING) {
    switch (t) {
      case "ascii":
        return this.FromBinary(e);
      case "utf8":
        return Pf.fromString(e);
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
  static ToUtf8String(e, t = de.DEFAULT_UTF8_ENCODING) {
    switch (t) {
      case "ascii":
        return this.ToBinary(e);
      case "utf8":
        return Pf.toString(e);
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
    const t = Y.toUint8Array(e);
    let n = "";
    for (let i = 0; i < t.length; i++)
      n += String.fromCharCode(t[i]);
    return n;
  }
  static ToHex(e) {
    const t = Y.toUint8Array(e);
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
    if (!de.isHex(t))
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
de.DEFAULT_UTF8_ENCODING = "utf8";
function ng(...r) {
  const e = r.map((i) => i.byteLength).reduce((i, s) => i + s), t = new Uint8Array(e);
  let n = 0;
  return r.map((i) => new Uint8Array(i)).forEach((i) => {
    for (const s of i)
      t[n++] = s;
  }), t.buffer;
}
function Fo(r, e) {
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
function Mi(r, e) {
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
function ol(...r) {
  let e = 0, t = 0;
  for (const s of r)
    e += s.length;
  const n = new ArrayBuffer(e), i = new Uint8Array(n);
  for (const s of r)
    i.set(s, t), t += s.length;
  return i;
}
function Cd() {
  const r = new Uint8Array(this.valueHex);
  if (this.valueHex.byteLength >= 2) {
    const c = r[0] === 255 && r[1] & 128, u = r[0] === 0 && (r[1] & 128) === 0;
    (c || u) && this.warnings.push("Needlessly long format");
  }
  const e = new ArrayBuffer(this.valueHex.byteLength), t = new Uint8Array(e);
  for (let c = 0; c < this.valueHex.byteLength; c++)
    t[c] = 0;
  t[0] = r[0] & 128;
  const n = Mi(t, 8), i = new ArrayBuffer(this.valueHex.byteLength), s = new Uint8Array(i);
  for (let c = 0; c < this.valueHex.byteLength; c++)
    s[c] = r[c];
  return s[0] &= 127, Mi(s, 8) - n;
}
function ig(r) {
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
function sg(r, e) {
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
function zo() {
  if (typeof BigInt > "u")
    throw new Error("BigInt is not defined. Your environment doesn't implement BigInt.");
}
function Nu(r) {
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
class Ha {
  constructor() {
    this.items = [];
  }
  write(e) {
    this.items.push(e);
  }
  final() {
    return Nu(this.items);
  }
}
const _s = [new Uint8Array([1])], jf = "0123456789", Lc = "name", Rf = "valueHexView", og = "isHexOnly", ag = "idBlock", cg = "tagClass", lg = "tagNumber", ug = "isConstructed", fg = "fromBER", hg = "toBER", dg = "local", yr = "", qr = new ArrayBuffer(0), Fa = new Uint8Array(0), Rs = "EndOfContent", Bd = "OCTET STRING", Od = "BIT STRING";
function fn(r) {
  var e;
  return e = class extends r {
    constructor(...n) {
      var i;
      super(...n);
      const s = n[0] || {};
      this.isHexOnly = (i = s.isHexOnly) !== null && i !== void 0 ? i : !1, this.valueHexView = s.valueHex ? Y.toUint8Array(s.valueHex) : Fa;
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
        valueHex: de.ToHex(this.valueHexView)
      };
    }
  }, e.NAME = "hexBlock", e;
}
class Ei {
  constructor({ blockLength: e = 0, error: t = yr, warnings: n = [], valueBeforeDecode: i = Fa } = {}) {
    this.blockLength = e, this.error = t, this.warnings = n, this.valueBeforeDecodeView = Y.toUint8Array(i);
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
      valueBeforeDecode: de.ToHex(this.valueBeforeDecodeView)
    };
  }
}
Ei.NAME = "baseBlock";
class fr extends Ei {
  fromBER(e, t, n) {
    throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
  }
  toBER(e, t) {
    throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
  }
}
fr.NAME = "valueBlock";
class Td extends fn(Ei) {
  constructor({ idBlock: e = {} } = {}) {
    var t, n, i, s;
    super(), e ? (this.isHexOnly = (t = e.isHexOnly) !== null && t !== void 0 ? t : !1, this.valueHexView = e.valueHex ? Y.toUint8Array(e.valueHex) : Fa, this.tagClass = (n = e.tagClass) !== null && n !== void 0 ? n : -1, this.tagNumber = (i = e.tagNumber) !== null && i !== void 0 ? i : -1, this.isConstructed = (s = e.isConstructed) !== null && s !== void 0 ? s : !1) : (this.tagClass = -1, this.tagNumber = -1, this.isConstructed = !1);
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
    const i = Y.toUint8Array(e);
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
      h = this.valueHexView = new Uint8Array(u), h.set(x), this.blockLength <= 9 ? this.tagNumber = Mi(h, 7) : (this.isHexOnly = !0, this.warnings.push("Tag too long, represented as hex-coded"));
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
Td.NAME = "identificationBlock";
class Nd extends Ei {
  constructor({ lenBlock: e = {} } = {}) {
    var t, n, i;
    super(), this.isIndefiniteForm = (t = e.isIndefiniteForm) !== null && t !== void 0 ? t : !1, this.longFormUsed = (n = e.longFormUsed) !== null && n !== void 0 ? n : !1, this.length = (i = e.length) !== null && i !== void 0 ? i : 0;
  }
  fromBER(e, t, n) {
    const i = Y.toUint8Array(e);
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
    return u[o - 1] === 0 && this.warnings.push("Needlessly long encoded length"), this.length = Mi(u, 8), this.longFormUsed && this.length <= 127 && this.warnings.push("Unnecessary usage of long length form"), this.blockLength = o + 1, t + this.blockLength;
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
Nd.NAME = "lengthBlock";
const ce = {};
class Jt extends Ei {
  constructor({ name: e = yr, optional: t = !1, primitiveSchema: n, ...i } = {}, s) {
    super(i), this.name = e, this.optional = t, n && (this.primitiveSchema = n), this.idBlock = new Td(i), this.lenBlock = new Nd(i), this.valueBlock = s ? new s(i) : new fr(i);
  }
  fromBER(e, t, n) {
    const i = this.valueBlock.fromBER(e, t, this.lenBlock.isIndefiniteForm ? n : this.lenBlock.length);
    return i === -1 ? (this.error = this.valueBlock.error, i) : (this.idBlock.error.length || (this.blockLength += this.idBlock.blockLength), this.lenBlock.error.length || (this.blockLength += this.lenBlock.blockLength), this.valueBlock.error.length || (this.blockLength += this.valueBlock.blockLength), i);
  }
  toBER(e, t) {
    const n = t || new Ha();
    t || Pd(this);
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
    return e === "ascii" ? this.onAsciiEncoding() : de.ToHex(this.toBER());
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${de.ToHex(this.valueBlock.valueBeforeDecodeView)}`;
  }
  isEqual(e) {
    if (this === e)
      return !0;
    if (!(e instanceof this.constructor))
      return !1;
    const t = this.toBER(), n = e.toBER();
    return sg(t, n);
  }
}
Jt.NAME = "BaseBlock";
function Pd(r) {
  if (r instanceof ce.Constructed)
    for (const e of r.valueBlock.value)
      Pd(e) && (r.lenBlock.isIndefiniteForm = !0);
  return !!r.lenBlock.isIndefiniteForm;
}
class Pu extends Jt {
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
Pu.NAME = "BaseStringBlock";
class jd extends fn(fr) {
  constructor({ isHexOnly: e = !0, ...t } = {}) {
    super(t), this.isHexOnly = e;
  }
}
jd.NAME = "PrimitiveValueBlock";
var Rd;
class uo extends Jt {
  constructor(e = {}) {
    super(e, jd), this.idBlock.isConstructed = !1;
  }
}
Rd = uo;
ce.Primitive = Rd;
uo.NAME = "PRIMITIVE";
function pg(r, e) {
  if (r instanceof e)
    return r;
  const t = new e();
  return t.idBlock = r.idBlock, t.lenBlock = r.lenBlock, t.warnings = r.warnings, t.valueBeforeDecodeView = r.valueBeforeDecodeView, t;
}
function ns(r, e = 0, t = r.length) {
  const n = e;
  let i = new Jt({}, fr);
  const s = new Ei();
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
  return i = pg(i, u), c = i.fromBER(r, e, i.lenBlock.isIndefiniteForm ? t : i.lenBlock.length), i.valueBeforeDecodeView = r.subarray(n, n + i.blockLength), {
    offset: c,
    result: i
  };
}
function Ui(r) {
  if (!r.byteLength) {
    const e = new Jt({}, fr);
    return e.error = "Input buffer has zero length", {
      offset: -1,
      result: e
    };
  }
  return ns(Y.toUint8Array(r).slice(), 0, r.byteLength);
}
function yg(r, e) {
  return r ? 1 : e;
}
class Vn extends fr {
  constructor({ value: e = [], isIndefiniteForm: t = !1, ...n } = {}) {
    super(n), this.value = e, this.isIndefiniteForm = t;
  }
  fromBER(e, t, n) {
    const i = Y.toUint8Array(e);
    if (!In(this, i, t, n))
      return -1;
    if (this.valueBeforeDecodeView = i.subarray(t, t + n), this.valueBeforeDecodeView.length === 0)
      return this.warnings.push("Zero buffer length"), t;
    let s = t;
    for (; yg(this.isIndefiniteForm, n) > 0; ) {
      const o = ns(i, s, n);
      if (o.offset === -1)
        return this.error = o.result.error, this.warnings.concat(o.result.warnings), -1;
      if (s = o.offset, this.blockLength += o.result.blockLength, n -= o.result.blockLength, this.value.push(o.result), this.isIndefiniteForm && o.result.constructor.NAME === Rs)
        break;
    }
    return this.isIndefiniteForm && (this.value[this.value.length - 1].constructor.NAME === Rs ? this.value.pop() : this.warnings.push("No EndOfContent block encoded")), s;
  }
  toBER(e, t) {
    const n = t || new Ha();
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
var Ud;
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
Ud = vr;
ce.Constructed = Ud;
vr.NAME = "CONSTRUCTED";
class Dd extends fr {
  fromBER(e, t, n) {
    return t;
  }
  toBER(e) {
    return qr;
  }
}
Dd.override = "EndOfContentValueBlock";
var $d;
class ju extends Jt {
  constructor(e = {}) {
    super(e, Dd), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 0;
  }
}
$d = ju;
ce.EndOfContent = $d;
ju.NAME = Rs;
var Md;
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
Md = li;
ce.Null = Md;
li.NAME = "NULL";
class Vd extends fn(fr) {
  constructor({ value: e, ...t } = {}) {
    super(t), t.valueHex ? this.valueHexView = Y.toUint8Array(t.valueHex) : this.valueHexView = new Uint8Array(1), e && (this.value = e);
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
    const i = Y.toUint8Array(e);
    return In(this, i, t, n) ? (this.valueHexView = i.subarray(t, t + n), n > 1 && this.warnings.push("Boolean value encoded in more then 1 octet"), this.isHexOnly = !0, Cd.call(this), this.blockLength = n, t + n) : -1;
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
Vd.NAME = "BooleanValueBlock";
var Ld;
let za = class extends Jt {
  constructor(e = {}) {
    super(e, Vd), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 1;
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
Ld = za;
ce.Boolean = Ld;
za.NAME = "BOOLEAN";
class Hd extends fn(Vn) {
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
        if (o !== Bd)
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
Hd.NAME = "OctetStringValueBlock";
var Fd;
let si = class zd extends Jt {
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
    }, Hd), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 4;
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
    return this.valueBlock.isConstructed || this.valueBlock.value && this.valueBlock.value.length ? vr.prototype.onAsciiEncoding.call(this) : `${this.constructor.NAME} : ${de.ToHex(this.valueBlock.valueHexView)}`;
  }
  getValue() {
    if (!this.idBlock.isConstructed)
      return this.valueBlock.valueHexView.slice().buffer;
    const e = [];
    for (const t of this.valueBlock.value)
      t instanceof zd && e.push(t.valueBlock.valueHexView);
    return Y.concat(e);
  }
};
Fd = si;
ce.OctetString = Fd;
si.NAME = Bd;
class Gd extends fn(Vn) {
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
        if (u !== Od)
          return this.error = "BIT STRING may consists of BIT STRINGs only", -1;
        const h = c.valueBlock;
        if (this.unusedBits > 0 && h.unusedBits > 0)
          return this.error = 'Using of "unused bits" inside constructive BIT STRING allowed for least one only', -1;
        this.unusedBits = h.unusedBits;
      }
      return i;
    }
    const s = Y.toUint8Array(e);
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
Gd.NAME = "BitStringValueBlock";
var qd;
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
    }, Gd), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 3;
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
qd = oi;
ce.BitString = qd;
oi.NAME = Od;
var Kd;
function gg(r, e) {
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
        s = ol(new Uint8Array([h % 10]), s);
        break;
      default:
        s[o - x] = h % 10;
    }
  }
  return t[0] > 0 && (s = ol(t, s)), s;
}
function Uf(r) {
  if (r >= _s.length)
    for (let e = _s.length; e <= r; e++) {
      const t = new Uint8Array([0]);
      let n = _s[e - 1].slice(0);
      for (let i = n.length - 1; i >= 0; i--) {
        const s = new Uint8Array([(n[i] << 1) + t[0]]);
        t[0] = s[0] / 10, n[i] = s[0] % 10;
      }
      t[0] > 0 && (n = ol(t, n)), _s.push(n);
    }
  return _s[r];
}
function vg(r, e) {
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
class Ru extends fn(fr) {
  constructor({ value: e, ...t } = {}) {
    super(t), this._valueDec = 0, t.valueHex && this.setValueHex(), e !== void 0 && (this.valueDec = e);
  }
  setValueHex() {
    this.valueHexView.length >= 4 ? (this.warnings.push("Too big Integer for decoding, hex only"), this.isHexOnly = !0, this._valueDec = 0) : (this.isHexOnly = !1, this.valueHexView.length > 0 && (this._valueDec = Cd.call(this)));
  }
  set valueDec(e) {
    this._valueDec = e, this.isHexOnly = !1, this.valueHexView = new Uint8Array(ig(e));
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
              t = vg(Uf(n), t), o = "-";
              break;
            default:
              t = gg(t, Uf(n));
          }
        n++, i >>= 1;
      }
    }
    for (let u = 0; u < t.length; u++)
      t[u] && (c = !0), c && (o += jf.charAt(t[u]));
    return c === !1 && (o += jf.charAt(0)), o;
  }
}
Kd = Ru;
Ru.NAME = "IntegerValueBlock";
Object.defineProperty(Kd.prototype, "valueHex", {
  set: function(r) {
    this.valueHexView = new Uint8Array(r), this.setValueHex();
  },
  get: function() {
    return this.valueHexView.slice().buffer;
  }
});
var Zd;
class nn extends Jt {
  constructor(e = {}) {
    super(e, Ru), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 2;
  }
  toBigInt() {
    return zo(), BigInt(this.valueBlock.toString());
  }
  static fromBigInt(e) {
    zo();
    const t = BigInt(e), n = new Ha(), i = t.toString(16).replace(/^-/, ""), s = new Uint8Array(de.FromHex(i));
    if (t < 0) {
      const c = new Uint8Array(s.length + (s[0] & 128 ? 1 : 0));
      c[0] |= 128;
      const h = BigInt(`0x${de.ToHex(c)}`) + t, m = Y.toUint8Array(de.FromHex(h.toString(16)));
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
Zd = nn;
ce.Integer = Zd;
nn.NAME = "INTEGER";
var Wd;
class Ga extends nn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 10;
  }
}
Wd = Ga;
ce.Enumerated = Wd;
Ga.NAME = "ENUMERATED";
class al extends fn(fr) {
  constructor({ valueDec: e = -1, isFirstSid: t = !1, ...n } = {}) {
    super(n), this.valueDec = e, this.isFirstSid = t;
  }
  fromBER(e, t, n) {
    if (!n)
      return t;
    const i = Y.toUint8Array(e);
    if (!In(this, i, t, n))
      return -1;
    const s = i.subarray(t, t + n);
    this.valueHexView = new Uint8Array(n);
    for (let c = 0; c < n && (this.valueHexView[c] = s[c] & 127, this.blockLength++, !!(s[c] & 128)); c++)
      ;
    const o = new Uint8Array(this.blockLength);
    for (let c = 0; c < this.blockLength; c++)
      o[c] = this.valueHexView[c];
    return this.valueHexView = o, s[this.blockLength - 1] & 128 ? (this.error = "End of input reached before message was fully decoded", -1) : (this.valueHexView[0] === 0 && this.warnings.push("Needlessly long format of SID encoding"), this.blockLength <= 8 ? this.valueDec = Mi(this.valueHexView, 7) : (this.isHexOnly = !0, this.warnings.push("Too big SID for decoding, hex only")), t + this.blockLength);
  }
  set valueBigInt(e) {
    zo();
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
      e = de.ToHex(this.valueHexView);
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
al.NAME = "sidBlock";
class Yd extends fr {
  constructor({ value: e = yr, ...t } = {}) {
    super(t), this.value = [], e && this.fromString(e);
  }
  fromBER(e, t, n) {
    let i = t;
    for (; n > 0; ) {
      const s = new al();
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
    return Nu(t);
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
        const o = new al();
        if (i > Number.MAX_SAFE_INTEGER) {
          zo();
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
Yd.NAME = "ObjectIdentifierValueBlock";
var Jd;
class qa extends Jt {
  constructor(e = {}) {
    super(e, Yd), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 6;
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
Jd = qa;
ce.ObjectIdentifier = Jd;
qa.NAME = "OBJECT IDENTIFIER";
class cl extends fn(Ei) {
  constructor({ valueDec: e = 0, ...t } = {}) {
    super(t), this.valueDec = e;
  }
  fromBER(e, t, n) {
    if (n === 0)
      return t;
    const i = Y.toUint8Array(e);
    if (!In(this, i, t, n))
      return -1;
    const s = i.subarray(t, t + n);
    this.valueHexView = new Uint8Array(n);
    for (let c = 0; c < n && (this.valueHexView[c] = s[c] & 127, this.blockLength++, !!(s[c] & 128)); c++)
      ;
    const o = new Uint8Array(this.blockLength);
    for (let c = 0; c < this.blockLength; c++)
      o[c] = this.valueHexView[c];
    return this.valueHexView = o, s[this.blockLength - 1] & 128 ? (this.error = "End of input reached before message was fully decoded", -1) : (this.valueHexView[0] === 0 && this.warnings.push("Needlessly long format of SID encoding"), this.blockLength <= 8 ? this.valueDec = Mi(this.valueHexView, 7) : (this.isHexOnly = !0, this.warnings.push("Too big SID for decoding, hex only")), t + this.blockLength);
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
    return this.isHexOnly ? e = de.ToHex(this.valueHexView) : e = this.valueDec.toString(), e;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      valueDec: this.valueDec
    };
  }
}
cl.NAME = "relativeSidBlock";
class Xd extends fr {
  constructor({ value: e = yr, ...t } = {}) {
    super(t), this.value = [], e && this.fromString(e);
  }
  fromBER(e, t, n) {
    let i = t;
    for (; n > 0; ) {
      const s = new cl();
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
    return Nu(n);
  }
  fromString(e) {
    this.value = [];
    let t = 0, n = 0, i = "";
    do {
      n = e.indexOf(".", t), n === -1 ? i = e.substring(t) : i = e.substring(t, n), t = n + 1;
      const s = new cl();
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
Xd.NAME = "RelativeObjectIdentifierValueBlock";
var Qd;
class Uu extends Jt {
  constructor(e = {}) {
    super(e, Xd), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 13;
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
Qd = Uu;
ce.RelativeObjectIdentifier = Qd;
Uu.NAME = "RelativeObjectIdentifier";
var ep;
class mn extends vr {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 16;
  }
}
ep = mn;
ce.Sequence = ep;
mn.NAME = "SEQUENCE";
var tp;
let wn = class extends vr {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 17;
  }
};
tp = wn;
ce.Set = tp;
wn.NAME = "SET";
class rp extends fn(fr) {
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
rp.NAME = "StringValueBlock";
class np extends rp {
}
np.NAME = "SimpleStringValueBlock";
class Ir extends Pu {
  constructor({ ...e } = {}) {
    super(e, np);
  }
  fromBuffer(e) {
    this.valueBlock.value = String.fromCharCode.apply(null, Y.toUint8Array(e));
  }
  fromString(e) {
    const t = e.length, n = this.valueBlock.valueHexView = new Uint8Array(t);
    for (let i = 0; i < t; i++)
      n[i] = e.charCodeAt(i);
    this.valueBlock.value = e;
  }
}
Ir.NAME = "SIMPLE STRING";
class ip extends Ir {
  fromBuffer(e) {
    this.valueBlock.valueHexView = Y.toUint8Array(e);
    try {
      this.valueBlock.value = de.ToUtf8String(e);
    } catch (t) {
      this.warnings.push(`Error during "decodeURIComponent": ${t}, using raw string`), this.valueBlock.value = de.ToBinary(e);
    }
  }
  fromString(e) {
    this.valueBlock.valueHexView = new Uint8Array(de.FromUtf8String(e)), this.valueBlock.value = e;
  }
}
ip.NAME = "Utf8StringValueBlock";
var sp;
class kn extends ip {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 12;
  }
}
sp = kn;
ce.Utf8String = sp;
kn.NAME = "UTF8String";
class op extends Ir {
  fromBuffer(e) {
    this.valueBlock.value = de.ToUtf16String(e), this.valueBlock.valueHexView = Y.toUint8Array(e);
  }
  fromString(e) {
    this.valueBlock.value = e, this.valueBlock.valueHexView = new Uint8Array(de.FromUtf16String(e));
  }
}
op.NAME = "BmpStringValueBlock";
var ap;
class Ka extends op {
  constructor({ ...e } = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 30;
  }
}
ap = Ka;
ce.BmpString = ap;
Ka.NAME = "BMPString";
class cp extends Ir {
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
cp.NAME = "UniversalStringValueBlock";
var lp;
class Za extends cp {
  constructor({ ...e } = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 28;
  }
}
lp = Za;
ce.UniversalString = lp;
Za.NAME = "UniversalString";
var up;
class Wa extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 18;
  }
}
up = Wa;
ce.NumericString = up;
Wa.NAME = "NumericString";
var fp;
class Ya extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 19;
  }
}
fp = Ya;
ce.PrintableString = fp;
Ya.NAME = "PrintableString";
var hp;
class Ja extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 20;
  }
}
hp = Ja;
ce.TeletexString = hp;
Ja.NAME = "TeletexString";
var dp;
class Xa extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 21;
  }
}
dp = Xa;
ce.VideotexString = dp;
Xa.NAME = "VideotexString";
var pp;
class Qa extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 22;
  }
}
pp = Qa;
ce.IA5String = pp;
Qa.NAME = "IA5String";
var yp;
class ec extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 25;
  }
}
yp = ec;
ce.GraphicString = yp;
ec.NAME = "GraphicString";
var gp;
class fo extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 26;
  }
}
gp = fo;
ce.VisibleString = gp;
fo.NAME = "VisibleString";
var vp;
class tc extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 27;
  }
}
vp = tc;
ce.GeneralString = vp;
tc.NAME = "GeneralString";
var mp;
class rc extends Ir {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 29;
  }
}
mp = rc;
ce.CharacterString = mp;
rc.NAME = "CharacterString";
var wp;
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
    this.fromString(String.fromCharCode.apply(null, Y.toUint8Array(e)));
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
wp = ho;
ce.UTCTime = wp;
ho.NAME = "UTCTime";
var bp;
class nc extends ho {
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
bp = nc;
ce.GeneralizedTime = bp;
nc.NAME = "GeneralizedTime";
var xp;
class Du extends kn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 31;
  }
}
xp = Du;
ce.DATE = xp;
Du.NAME = "DATE";
var Ap;
class $u extends kn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 32;
  }
}
Ap = $u;
ce.TimeOfDay = Ap;
$u.NAME = "TimeOfDay";
var Sp;
class Mu extends kn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 33;
  }
}
Sp = Mu;
ce.DateTime = Sp;
Mu.NAME = "DateTime";
var _p;
class Vu extends kn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 34;
  }
}
_p = Vu;
ce.Duration = _p;
Vu.NAME = "Duration";
var Ep;
class Lu extends kn {
  constructor(e = {}) {
    super(e), this.idBlock.tagClass = 1, this.idBlock.tagNumber = 14;
  }
}
Ep = Lu;
ce.TIME = Ep;
Lu.NAME = "TIME";
class ui {
  constructor({ name: e = yr, optional: t = !1 } = {}) {
    this.name = e, this.optional = t;
  }
}
class Hu extends ui {
  constructor({ value: e = [], ...t } = {}) {
    super(t), this.value = e;
  }
}
class Go extends ui {
  constructor({ value: e = new ui(), local: t = !1, ...n } = {}) {
    super(n), this.value = e, this.local = t;
  }
}
class mg {
  constructor({ data: e = Fa } = {}) {
    this.dataView = Y.toUint8Array(e);
  }
  get data() {
    return this.dataView.slice().buffer;
  }
  set data(e) {
    this.dataView = Y.toUint8Array(e);
  }
  fromBER(e, t, n) {
    const i = t + n;
    return this.dataView = Y.toUint8Array(e).subarray(t, i), i;
  }
  toBER(e) {
    return this.dataView.slice().buffer;
  }
}
function ri(r, e, t) {
  if (t instanceof Hu) {
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
      return t.hasOwnProperty(Lc) && (s.name = t.name), s;
    }
  }
  if (t instanceof ui)
    return t.hasOwnProperty(Lc) && (r[t.name] = e), {
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
  if (!(ag in t))
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (!(fg in t.idBlock))
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (!(hg in t.idBlock))
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
  if (t.idBlock.hasOwnProperty(cg) === !1)
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (t.idBlock.tagClass !== e.idBlock.tagClass)
    return {
      verified: !1,
      result: r
    };
  if (t.idBlock.hasOwnProperty(lg) === !1)
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (t.idBlock.tagNumber !== e.idBlock.tagNumber)
    return {
      verified: !1,
      result: r
    };
  if (t.idBlock.hasOwnProperty(ug) === !1)
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema" }
    };
  if (t.idBlock.isConstructed !== e.idBlock.isConstructed)
    return {
      verified: !1,
      result: r
    };
  if (!(og in t.idBlock))
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
    if (!(Rf in t.idBlock))
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
    if (c > 0 && t.valueBlock.value[0] instanceof Go && (c = e.valueBlock.value.length), c === 0)
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
      } else if (t.valueBlock.value[0] instanceof Go) {
        if (o = ri(r, e.valueBlock.value[u], t.valueBlock.value[0].value), o.verified === !1)
          if (t.valueBlock.value[0].optional)
            s++;
          else
            return t.name && (t.name = t.name.replace(/^\s+|\s+$/g, yr), t.name && delete r[t.name]), o;
        if (Lc in t.valueBlock.value[0] && t.valueBlock.value[0].name.length > 0) {
          let h = {};
          dg in t.valueBlock.value[0] && t.valueBlock.value[0].local ? h = e : h = r, typeof h[t.valueBlock.value[0].name] > "u" && (h[t.valueBlock.value[0].name] = []), h[t.valueBlock.value[0].name].push(e.valueBlock.value[u]);
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
  if (t.primitiveSchema && Rf in e.valueBlock) {
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
function wg(r, e) {
  if (!(e instanceof Object))
    return {
      verified: !1,
      result: { error: "Wrong ASN.1 schema type" }
    };
  const t = ns(Y.toUint8Array(r));
  return t.offset === -1 ? {
    verified: !1,
    result: t.result
  } : ri(t.result, t.result, e);
}
const Ip = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Any: ui,
  BaseBlock: Jt,
  BaseStringBlock: Pu,
  BitString: oi,
  BmpString: Ka,
  Boolean: za,
  CharacterString: rc,
  Choice: Hu,
  Constructed: vr,
  DATE: Du,
  DateTime: Mu,
  Duration: Vu,
  EndOfContent: ju,
  Enumerated: Ga,
  GeneralString: tc,
  GeneralizedTime: nc,
  GraphicString: ec,
  HexBlock: fn,
  IA5String: Qa,
  Integer: nn,
  Null: li,
  NumericString: Wa,
  ObjectIdentifier: qa,
  OctetString: si,
  Primitive: uo,
  PrintableString: Ya,
  RawData: mg,
  RelativeObjectIdentifier: Uu,
  Repeated: Go,
  Sequence: mn,
  Set: wn,
  TIME: Lu,
  TeletexString: Ja,
  TimeOfDay: $u,
  UTCTime: ho,
  UniversalString: Za,
  Utf8String: kn,
  ValueBlock: fr,
  VideotexString: Xa,
  ViewWriter: Ha,
  VisibleString: fo,
  compareSchema: ri,
  fromBER: Ui,
  verifySchema: wg
}, Symbol.toStringTag, { value: "Module" }));
var M;
(function(r) {
  r[r.Sequence = 0] = "Sequence", r[r.Set = 1] = "Set", r[r.Choice = 2] = "Choice";
})(M || (M = {}));
var b;
(function(r) {
  r[r.Any = 1] = "Any", r[r.Boolean = 2] = "Boolean", r[r.OctetString = 3] = "OctetString", r[r.BitString = 4] = "BitString", r[r.Integer = 5] = "Integer", r[r.Enumerated = 6] = "Enumerated", r[r.ObjectIdentifier = 7] = "ObjectIdentifier", r[r.Utf8String = 8] = "Utf8String", r[r.BmpString = 9] = "BmpString", r[r.UniversalString = 10] = "UniversalString", r[r.NumericString = 11] = "NumericString", r[r.PrintableString = 12] = "PrintableString", r[r.TeletexString = 13] = "TeletexString", r[r.VideotexString = 14] = "VideotexString", r[r.IA5String = 15] = "IA5String", r[r.GraphicString = 16] = "GraphicString", r[r.VisibleString = 17] = "VisibleString", r[r.GeneralString = 18] = "GeneralString", r[r.CharacterString = 19] = "CharacterString", r[r.UTCTime = 20] = "UTCTime", r[r.GeneralizedTime = 21] = "GeneralizedTime", r[r.DATE = 22] = "DATE", r[r.TimeOfDay = 23] = "TimeOfDay", r[r.DateTime = 24] = "DateTime", r[r.Duration = 25] = "Duration", r[r.TIME = 26] = "TIME", r[r.Null = 27] = "Null";
})(b || (b = {}));
class ic {
  constructor(e, t = 0) {
    if (this.unusedBits = 0, this.value = new ArrayBuffer(0), e)
      if (typeof e == "number")
        this.fromNumber(e);
      else if (Y.isBufferSource(e))
        this.unusedBits = t, this.value = Y.toArrayBuffer(e);
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
class it {
  get byteLength() {
    return this.buffer.byteLength;
  }
  get byteOffset() {
    return 0;
  }
  constructor(e) {
    typeof e == "number" ? this.buffer = new ArrayBuffer(e) : Y.isBufferSource(e) ? this.buffer = Y.toArrayBuffer(e) : Array.isArray(e) ? this.buffer = new Uint8Array(e) : this.buffer = new ArrayBuffer(0);
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
const bg = {
  fromASN: (r) => r instanceof li ? null : r.valueBeforeDecodeView,
  toASN: (r) => {
    if (r === null)
      return new li();
    const e = Ui(r);
    if (e.result.error)
      throw new Error(e.result.error);
    return e.result;
  }
}, xg = {
  fromASN: (r) => r.valueBlock.valueHexView.byteLength >= 4 ? r.valueBlock.toString() : r.valueBlock.valueDec,
  toASN: (r) => new nn({ value: +r })
}, Ag = {
  fromASN: (r) => r.valueBlock.valueDec,
  toASN: (r) => new Ga({ value: r })
}, xt = {
  fromASN: (r) => r.valueBlock.valueHexView,
  toASN: (r) => new nn({ valueHex: r })
}, Sg = {
  fromASN: (r) => r.valueBlock.valueHexView,
  toASN: (r) => new oi({ valueHex: r })
}, _g = {
  fromASN: (r) => r.valueBlock.toString(),
  toASN: (r) => new qa({ value: r })
}, Eg = {
  fromASN: (r) => r.valueBlock.value,
  toASN: (r) => new za({ value: r })
}, qo = {
  fromASN: (r) => r.valueBlock.valueHexView,
  toASN: (r) => new si({ valueHex: r })
}, Ig = {
  fromASN: (r) => new it(r.getValue()),
  toASN: (r) => r.toASN()
};
function Nr(r) {
  return {
    fromASN: (e) => e.valueBlock.value,
    toASN: (e) => new r({ value: e })
  };
}
const kp = Nr(kn), kg = Nr(Ka), Cg = Nr(Za), Bg = Nr(Wa), Og = Nr(Ya), Tg = Nr(Ja), Ng = Nr(Xa), Pg = Nr(Qa), jg = Nr(ec), Rg = Nr(fo), Ug = Nr(tc), Dg = Nr(rc), $g = {
  fromASN: (r) => r.toDate(),
  toASN: (r) => new ho({ valueDate: r })
}, Mg = {
  fromASN: (r) => r.toDate(),
  toASN: (r) => new nc({ valueDate: r })
}, Vg = {
  fromASN: () => null,
  toASN: () => new li()
};
function Fu(r) {
  switch (r) {
    case b.Any:
      return bg;
    case b.BitString:
      return Sg;
    case b.BmpString:
      return kg;
    case b.Boolean:
      return Eg;
    case b.CharacterString:
      return Dg;
    case b.Enumerated:
      return Ag;
    case b.GeneralString:
      return Ug;
    case b.GeneralizedTime:
      return Mg;
    case b.GraphicString:
      return jg;
    case b.IA5String:
      return Pg;
    case b.Integer:
      return xg;
    case b.Null:
      return Vg;
    case b.NumericString:
      return Bg;
    case b.ObjectIdentifier:
      return _g;
    case b.OctetString:
      return qo;
    case b.PrintableString:
      return Og;
    case b.TeletexString:
      return Tg;
    case b.UTCTime:
      return $g;
    case b.UniversalString:
      return Cg;
    case b.Utf8String:
      return kp;
    case b.VideotexString:
      return Ng;
    case b.VisibleString:
      return Rg;
    default:
      return null;
  }
}
function gn(r) {
  return typeof r == "function" && r.prototype ? r.prototype.toASN && r.prototype.fromASN ? !0 : gn(r.prototype) : !!(r && typeof r == "object" && "toASN" in r && "fromASN" in r);
}
function Cp(r) {
  var e;
  if (r) {
    const t = Object.getPrototypeOf(r);
    return ((e = t == null ? void 0 : t.prototype) === null || e === void 0 ? void 0 : e.constructor) === Array ? !0 : Cp(t);
  }
  return !1;
}
function Lg(r, e) {
  if (!(r && e) || r.byteLength !== e.byteLength)
    return !1;
  const t = new Uint8Array(r), n = new Uint8Array(e);
  for (let i = 0; i < r.byteLength; i++)
    if (t[i] !== n[i])
      return !1;
  return !0;
}
class Hg {
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
        const m = b[o.type], x = Ip[m];
        if (!x)
          throw new Error(`Cannot get ASN1 class by name '${m}'`);
        u = new x({ name: c });
      } else gn(o.type) ? u = new o.type().toSchema(c) : o.optional ? this.get(o.type).type === M.Choice ? u = new ui({ name: c }) : (u = this.create(o.type, !1), u.name = c) : u = new ui({ name: c });
      const h = !!o.optional || o.defaultValue !== void 0;
      if (o.repeated) {
        u.name = "";
        const m = o.repeated === "set" ? wn : mn;
        u = new m({
          name: "",
          value: [
            new Go({
              name: c,
              value: u
            })
          ]
        });
      }
      if (o.context !== null && o.context !== void 0)
        if (o.implicit)
          if (typeof o.type == "number" || gn(o.type)) {
            const m = o.repeated ? vr : uo;
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
        return new mn({ value: i, name: "" });
      case M.Set:
        return new wn({ value: i, name: "" });
      case M.Choice:
        return new Hu({ value: i, name: "" });
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
const Or = new Hg(), H = (r) => (e) => {
  let t;
  Or.has(e) ? t = Or.get(e) : (t = Or.createDefault(e), Or.set(e, t)), Object.assign(t, r);
}, y = (r) => (e, t) => {
  let n;
  Or.has(e.constructor) ? n = Or.get(e.constructor) : (n = Or.createDefault(e.constructor), Or.set(e.constructor, n));
  const i = Object.assign({}, r);
  if (typeof i.type == "number" && !i.converter) {
    const s = Fu(r.type);
    if (!s)
      throw new Error(`Cannot get default converter for property '${t}' of ${e.constructor.name}`);
    i.converter = s;
  }
  n.items[t] = i;
};
class Df extends Error {
  constructor() {
    super(...arguments), this.schemas = [];
  }
}
class Fg {
  static parse(e, t) {
    const n = Ui(e);
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
        throw new Df(`Data does not match to ${t.name} ASN1 schema. ${o.result.error}`);
      const c = new t();
      if (Cp(t)) {
        if (!("value" in e.valueBlock && Array.isArray(e.valueBlock.value)))
          throw new Error("Cannot get items from the ASN.1 parsed value. ASN.1 object is not constructed.");
        const u = i.itemType;
        if (typeof u == "number") {
          const h = Fu(u);
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
        if (typeof x == "number" || gn(x)) {
          const G = (n = m.converter) !== null && n !== void 0 ? n : gn(x) ? new x() : null;
          if (!G)
            throw new Error("Converter is empty");
          if (m.repeated)
            if (m.implicit) {
              const N = m.repeated === "sequence" ? mn : wn, v = new N();
              v.valueBlock = h.valueBlock;
              const A = Ui(v.toBER(!1));
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
              if (gn(x))
                v = new x().toSchema("");
              else {
                const A = b[x], O = Ip[A];
                if (!O)
                  throw new Error(`Cannot get '${A}' class from asn1js module`);
                v = new O();
              }
              v.valueBlock = N.valueBlock, N = Ui(v.toBER(!1)).result;
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
      throw i instanceof Df && i.schemas.push(t.name), i;
    }
  }
}
class zu {
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
        const o = Fu(n.itemType);
        if (!o)
          throw new Error(`Cannot get default converter for array item of ${t.name} ASN1 schema`);
        i = e.map((c) => o.toASN(c));
      } else
        i = e.map((o) => this.toAsnItem({ type: n.itemType }, "[]", t, o));
    } else
      for (const o in n.items) {
        const c = n.items[o], u = e[o];
        if (u === void 0 || c.defaultValue === u || typeof c.defaultValue == "object" && typeof u == "object" && Lg(this.serialize(c.defaultValue), this.serialize(u)))
          continue;
        const h = zu.toAsnItem(c, o, t, u);
        if (typeof c.context == "number")
          if (c.implicit)
            if (!c.repeated && (typeof c.type == "number" || gn(c.type))) {
              const m = {};
              m.valueHex = h instanceof li ? h.valueBeforeDecodeView : h.valueBlock.toBER(), i.push(new uo({
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
class yt extends Array {
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
class K {
  static serialize(e) {
    return zu.serialize(e);
  }
  static parse(e, t) {
    return Fg.parse(e, t);
  }
  static toString(e) {
    const t = Y.isBufferSource(e) ? Y.toArrayBuffer(e) : K.serialize(e), n = Ui(t);
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
var Bp = { exports: {} };
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
      let O = 0, I = -1, P = (v.match(u.zoneIndex) || [])[0], R, ue;
      for (P && (P = P.substring(1), v = v.replace(/%.+$/, "")); (I = v.indexOf(":", I + 1)) >= 0; )
        O++;
      if (v.substr(0, 2) === "::" && O--, v.substr(-2, 2) === "::" && O--, O > A)
        return null;
      for (ue = A - O, R = ":"; ue--; )
        R += "0:";
      return v = v.replace("::", R), v[0] === ":" && (v = v.slice(1)), v[v.length - 1] === ":" && (v = v.slice(0, -1)), A = function() {
        const Ge = v.split(":"), Je = [];
        for (let je = 0; je < Ge.length; je++)
          Je.push(parseInt(Ge[je], 16));
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
        let P, R, ue;
        for (P = 3; P >= 0; P -= 1)
          if (R = this.octets[P], R in I) {
            if (ue = I[R], O && ue !== 0)
              return null;
            ue !== 8 && (O = !0), A += ue;
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
          for (let ue = 0; ue < P.length; ue++)
            O = P[ue], R.push(x(O));
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
        for (let ue = 7; ue >= 0; ue -= 1)
          if (P = this.parts[ue], P in I) {
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
      } catch (ue) {
        throw new Error(`ipaddr: the address does not have IPv6 CIDR format (${ue})`);
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
      let A, O, I, P, R, ue;
      if (I = v.match(u.deprecatedTransitional))
        return this.parser(`::ffff:${I[1]}`);
      if (u.native.test(v))
        return h(v, 8);
      if ((I = v.match(u.transitional)) && (ue = I[6] || "", A = I[1], I[1].endsWith("::") || (A = A.slice(0, -1)), A = h(A + ue, 6), A.parts)) {
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
      let I, P, R, ue;
      O == null && (O = "unicast");
      for (P in A)
        if (Object.prototype.hasOwnProperty.call(A, P)) {
          for (R = A[P], R[0] && !(R[0] instanceof Array) && (R = [R]), I = 0; I < R.length; I++)
            if (ue = R[I], v.kind() === ue[0].kind() && v.match.apply(v, ue))
              return P;
        }
      return O;
    }, r.exports ? r.exports = N : e.ipaddr = N;
  })(sl);
})(Bp);
var $f = Bp.exports;
class Mf {
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
      return $f.fromByteArray(Array.from(t)).toString();
    }
    return this.decodeIP(de.ToHex(e));
  }
  static fromString(e) {
    const t = $f.parse(e);
    return new Uint8Array(t.toByteArray()).buffer;
  }
}
var ll, ul, fl;
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
let Vi = class extends Xt {
  constructor(e = {}) {
    super(e), Object.assign(this, e);
  }
  toString() {
    return this.ia5String || (this.anyValue ? de.ToHex(this.anyValue) : super.toString());
  }
};
f([
  y({ type: b.IA5String })
], Vi.prototype, "ia5String", void 0);
f([
  y({ type: b.Any })
], Vi.prototype, "anyValue", void 0);
Vi = f([
  H({ type: M.Choice })
], Vi);
class sc {
  constructor(e = {}) {
    this.type = "", this.value = new Vi(), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], sc.prototype, "type", void 0);
f([
  y({ type: Vi })
], sc.prototype, "value", void 0);
let Li = ll = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, ll.prototype);
  }
};
Li = ll = f([
  H({ type: M.Set, itemType: sc })
], Li);
let hl = ul = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, ul.prototype);
  }
};
hl = ul = f([
  H({ type: M.Sequence, itemType: Li })
], hl);
let Ht = fl = class extends hl {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, fl.prototype);
  }
};
Ht = fl = f([
  H({ type: M.Sequence })
], Ht);
const zg = {
  fromASN: (r) => Mf.toString(qo.fromASN(r)),
  toASN: (r) => qo.toASN(Mf.fromString(r))
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
class Gu {
  constructor(e = {}) {
    this.partyName = new Xt(), Object.assign(this, e);
  }
}
f([
  y({ type: Xt, optional: !0, context: 0, implicit: !0 })
], Gu.prototype, "nameAssigner", void 0);
f([
  y({ type: Xt, context: 1, implicit: !0 })
], Gu.prototype, "partyName", void 0);
let $e = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: Us, context: 0, implicit: !0 })
], $e.prototype, "otherName", void 0);
f([
  y({ type: b.IA5String, context: 1, implicit: !0 })
], $e.prototype, "rfc822Name", void 0);
f([
  y({ type: b.IA5String, context: 2, implicit: !0 })
], $e.prototype, "dNSName", void 0);
f([
  y({ type: b.Any, context: 3, implicit: !0 })
], $e.prototype, "x400Address", void 0);
f([
  y({ type: Ht, context: 4, implicit: !1 })
], $e.prototype, "directoryName", void 0);
f([
  y({ type: Gu, context: 5 })
], $e.prototype, "ediPartyName", void 0);
f([
  y({ type: b.IA5String, context: 6, implicit: !0 })
], $e.prototype, "uniformResourceIdentifier", void 0);
f([
  y({ type: b.OctetString, context: 7, implicit: !0, converter: zg })
], $e.prototype, "iPAddress", void 0);
f([
  y({ type: b.ObjectIdentifier, context: 8, implicit: !0 })
], $e.prototype, "registeredID", void 0);
$e = f([
  H({ type: M.Choice })
], $e);
const qu = "1.3.6.1.5.5.7", Gg = `${qu}.1`, is = `${qu}.3`, oc = `${qu}.48`, Vf = `${oc}.1`, Lf = `${oc}.2`, Hf = `${oc}.3`, Ff = `${oc}.5`, Yn = "2.5.29";
var dl;
const pl = `${Gg}.1`;
class po {
  constructor(e = {}) {
    this.accessMethod = "", this.accessLocation = new $e(), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], po.prototype, "accessMethod", void 0);
f([
  y({ type: $e })
], po.prototype, "accessLocation", void 0);
let ji = dl = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, dl.prototype);
  }
};
ji = dl = f([
  H({ type: M.Sequence, itemType: po })
], ji);
const Ko = `${Yn}.35`;
class Ku extends it {
}
class ni {
  constructor(e = {}) {
    e && Object.assign(this, e);
  }
}
f([
  y({ type: Ku, context: 0, optional: !0, implicit: !0 })
], ni.prototype, "keyIdentifier", void 0);
f([
  y({ type: $e, context: 1, optional: !0, implicit: !0, repeated: "sequence" })
], ni.prototype, "authorityCertIssuer", void 0);
f([
  y({
    type: b.Integer,
    context: 2,
    optional: !0,
    implicit: !0,
    converter: xt
  })
], ni.prototype, "authorityCertSerialNumber", void 0);
const Op = `${Yn}.19`;
class Zo {
  constructor(e = {}) {
    this.cA = !1, Object.assign(this, e);
  }
}
f([
  y({ type: b.Boolean, defaultValue: !1 })
], Zo.prototype, "cA", void 0);
f([
  y({ type: b.Integer, optional: !0 })
], Zo.prototype, "pathLenConstraint", void 0);
var yl;
let cr = yl = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, yl.prototype);
  }
};
cr = yl = f([
  H({ type: M.Sequence, itemType: $e })
], cr);
var gl;
let zf = gl = class extends cr {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, gl.prototype);
  }
};
zf = gl = f([
  H({ type: M.Sequence })
], zf);
var vl;
const Tp = `${Yn}.32`;
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
class Zu {
  constructor(e = {}) {
    this.organization = new An(), this.noticeNumbers = [], Object.assign(this, e);
  }
}
f([
  y({ type: An })
], Zu.prototype, "organization", void 0);
f([
  y({ type: b.Integer, repeated: "sequence" })
], Zu.prototype, "noticeNumbers", void 0);
class Wu {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: Zu, optional: !0 })
], Wu.prototype, "noticeRef", void 0);
f([
  y({ type: An, optional: !0 })
], Wu.prototype, "explicitText", void 0);
let Wo = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: b.IA5String })
], Wo.prototype, "cPSuri", void 0);
f([
  y({ type: Wu })
], Wo.prototype, "userNotice", void 0);
Wo = f([
  H({ type: M.Choice })
], Wo);
class Yu {
  constructor(e = {}) {
    this.policyQualifierId = "", this.qualifier = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Yu.prototype, "policyQualifierId", void 0);
f([
  y({ type: b.Any })
], Yu.prototype, "qualifier", void 0);
class ac {
  constructor(e = {}) {
    this.policyIdentifier = "", Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], ac.prototype, "policyIdentifier", void 0);
f([
  y({ type: Yu, repeated: "sequence", optional: !0 })
], ac.prototype, "policyQualifiers", void 0);
let Yo = vl = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, vl.prototype);
  }
};
Yo = vl = f([
  H({ type: M.Sequence, itemType: ac })
], Yo);
let Jo = class {
  constructor(e = 0) {
    this.value = e;
  }
};
f([
  y({ type: b.Integer })
], Jo.prototype, "value", void 0);
Jo = f([
  H({ type: M.Choice })
], Jo);
let Gf = class extends Jo {
};
Gf = f([
  H({ type: M.Choice })
], Gf);
var ml;
const wl = `${Yn}.31`;
var Ur;
(function(r) {
  r[r.unused = 1] = "unused", r[r.keyCompromise = 2] = "keyCompromise", r[r.cACompromise = 4] = "cACompromise", r[r.affiliationChanged = 8] = "affiliationChanged", r[r.superseded = 16] = "superseded", r[r.cessationOfOperation = 32] = "cessationOfOperation", r[r.certificateHold = 64] = "certificateHold", r[r.privilegeWithdrawn = 128] = "privilegeWithdrawn", r[r.aACompromise = 256] = "aACompromise";
})(Ur || (Ur = {}));
class Np extends ic {
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
  y({ type: $e, context: 0, repeated: "sequence", implicit: !0 })
], fi.prototype, "fullName", void 0);
f([
  y({ type: Li, context: 1, implicit: !0 })
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
  y({ type: Np, context: 1, optional: !0, implicit: !0 })
], ss.prototype, "reasons", void 0);
f([
  y({ type: $e, context: 2, optional: !0, repeated: "sequence", implicit: !0 })
], ss.prototype, "cRLIssuer", void 0);
let Di = ml = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, ml.prototype);
  }
};
Di = ml = f([
  H({ type: M.Sequence, itemType: ss })
], Di);
var bl;
let qf = bl = class extends Di {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, bl.prototype);
  }
};
qf = bl = f([
  H({ type: M.Sequence, itemType: ss })
], qf);
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
  y({ type: Np, context: 3, optional: !0, implicit: !0 })
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
let xl = class {
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
], xl.prototype, "reason", void 0);
xl = f([
  H({ type: M.Choice })
], xl);
var Al;
const Pp = `${Yn}.37`;
let Xo = Al = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Al.prototype);
  }
};
Xo = Al = f([
  H({ type: M.Sequence, itemType: b.ObjectIdentifier })
], Xo);
const qg = `${is}.1`, Kg = `${is}.2`, Zg = `${is}.3`, Wg = `${is}.4`, Yg = `${is}.8`, Jg = `${is}.9`;
let Sl = class {
  constructor(e = new ArrayBuffer(0)) {
    this.value = e;
  }
};
f([
  y({ type: b.Integer, converter: xt })
], Sl.prototype, "value", void 0);
Sl = f([
  H({ type: M.Choice })
], Sl);
let _l = class {
  constructor(e) {
    this.value = /* @__PURE__ */ new Date(), e && (this.value = e);
  }
};
f([
  y({ type: b.GeneralizedTime })
], _l.prototype, "value", void 0);
_l = f([
  H({ type: M.Choice })
], _l);
var El;
let Kf = El = class extends cr {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, El.prototype);
  }
};
Kf = El = f([
  H({ type: M.Sequence })
], Kf);
const jp = `${Yn}.15`;
var Dr;
(function(r) {
  r[r.digitalSignature = 1] = "digitalSignature", r[r.nonRepudiation = 2] = "nonRepudiation", r[r.keyEncipherment = 4] = "keyEncipherment", r[r.dataEncipherment = 8] = "dataEncipherment", r[r.keyAgreement = 16] = "keyAgreement", r[r.keyCertSign = 32] = "keyCertSign", r[r.cRLSign = 64] = "cRLSign", r[r.encipherOnly = 128] = "encipherOnly", r[r.decipherOnly = 256] = "decipherOnly";
})(Dr || (Dr = {}));
class Hc extends ic {
  toJSON() {
    const e = this.toNumber(), t = [];
    return e & Dr.cRLSign && t.push("crlSign"), e & Dr.dataEncipherment && t.push("dataEncipherment"), e & Dr.decipherOnly && t.push("decipherOnly"), e & Dr.digitalSignature && t.push("digitalSignature"), e & Dr.encipherOnly && t.push("encipherOnly"), e & Dr.keyAgreement && t.push("keyAgreement"), e & Dr.keyCertSign && t.push("keyCertSign"), e & Dr.keyEncipherment && t.push("keyEncipherment"), e & Dr.nonRepudiation && t.push("nonRepudiation"), t;
  }
  toString() {
    return `[${this.toJSON().join(", ")}]`;
  }
}
var Il;
class cc {
  constructor(e = {}) {
    this.base = new $e(), this.minimum = 0, Object.assign(this, e);
  }
}
f([
  y({ type: $e })
], cc.prototype, "base", void 0);
f([
  y({ type: b.Integer, context: 0, defaultValue: 0, implicit: !0 })
], cc.prototype, "minimum", void 0);
f([
  y({ type: b.Integer, context: 1, optional: !0, implicit: !0 })
], cc.prototype, "maximum", void 0);
let Qo = Il = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Il.prototype);
  }
};
Qo = Il = f([
  H({ type: M.Sequence, itemType: cc })
], Qo);
class Rp {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: Qo, context: 0, optional: !0, implicit: !0 })
], Rp.prototype, "permittedSubtrees", void 0);
f([
  y({ type: Qo, context: 1, optional: !0, implicit: !0 })
], Rp.prototype, "excludedSubtrees", void 0);
class Up {
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
], Up.prototype, "requireExplicitPolicy", void 0);
f([
  y({
    type: b.Integer,
    context: 1,
    implicit: !0,
    optional: !0,
    converter: xt
  })
], Up.prototype, "inhibitPolicyMapping", void 0);
var kl;
class Ju {
  constructor(e = {}) {
    this.issuerDomainPolicy = "", this.subjectDomainPolicy = "", Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Ju.prototype, "issuerDomainPolicy", void 0);
f([
  y({ type: b.ObjectIdentifier })
], Ju.prototype, "subjectDomainPolicy", void 0);
let Zf = kl = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, kl.prototype);
  }
};
Zf = kl = f([
  H({ type: M.Sequence, itemType: Ju })
], Zf);
var Cl;
const Xu = `${Yn}.17`;
let Bl = Cl = class extends cr {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Cl.prototype);
  }
};
Bl = Cl = f([
  H({ type: M.Sequence })
], Bl);
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
var Ol;
let Wf = Ol = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Ol.prototype);
  }
};
Wf = Ol = f([
  H({ type: M.Sequence, itemType: Sn })
], Wf);
const Qu = `${Yn}.14`;
class Ln extends Ku {
}
class Dp {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: b.GeneralizedTime, context: 0, implicit: !0, optional: !0 })
], Dp.prototype, "notBefore", void 0);
f([
  y({ type: b.GeneralizedTime, context: 1, implicit: !0, optional: !0 })
], Dp.prototype, "notAfter", void 0);
var Ts;
(function(r) {
  r[r.keyUpdateAllowed = 1] = "keyUpdateAllowed", r[r.newExtensions = 2] = "newExtensions", r[r.pKIXCertificate = 4] = "pKIXCertificate";
})(Ts || (Ts = {}));
class $p extends ic {
  toJSON() {
    const e = [], t = this.toNumber();
    return t & Ts.pKIXCertificate && e.push("pKIXCertificate"), t & Ts.newExtensions && e.push("newExtensions"), t & Ts.keyUpdateAllowed && e.push("keyUpdateAllowed"), e;
  }
  toString() {
    return `[${this.toJSON().join(", ")}]`;
  }
}
class Mp {
  constructor(e = {}) {
    this.entrustVers = "", this.entrustInfoFlags = new $p(), Object.assign(this, e);
  }
}
f([
  y({ type: b.GeneralString })
], Mp.prototype, "entrustVers", void 0);
f([
  y({ type: $p })
], Mp.prototype, "entrustInfoFlags", void 0);
var Tl;
let Yf = Tl = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Tl.prototype);
  }
};
Yf = Tl = f([
  H({ type: M.Sequence, itemType: po })
], Yf);
class oe {
  constructor(e = {}) {
    this.algorithm = "", Object.assign(this, e);
  }
  isEqual(e) {
    return e instanceof oe && e.algorithm == this.algorithm && (e.parameters && this.parameters && Fo(e.parameters, this.parameters) || e.parameters === this.parameters);
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
class lc {
  constructor(e) {
    this.notBefore = new Yt(/* @__PURE__ */ new Date()), this.notAfter = new Yt(/* @__PURE__ */ new Date()), e && (this.notBefore = new Yt(e.notBefore), this.notAfter = new Yt(e.notAfter));
  }
}
f([
  y({ type: Yt })
], lc.prototype, "notBefore", void 0);
f([
  y({ type: Yt })
], lc.prototype, "notAfter", void 0);
var Nl;
let Hr = class Vp {
  constructor(e = {}) {
    this.extnID = "", this.critical = Vp.CRITICAL, this.extnValue = new it(), Object.assign(this, e);
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
  y({ type: it })
], Hr.prototype, "extnValue", void 0);
let hi = Nl = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Nl.prototype);
  }
};
hi = Nl = f([
  H({ type: M.Sequence, itemType: Hr })
], hi);
var Hi;
(function(r) {
  r[r.v1 = 0] = "v1", r[r.v2 = 1] = "v2", r[r.v3 = 2] = "v3";
})(Hi || (Hi = {}));
class Pr {
  constructor(e = {}) {
    this.version = Hi.v1, this.serialNumber = new ArrayBuffer(0), this.signature = new oe(), this.issuer = new Ht(), this.validity = new lc(), this.subject = new Ht(), this.subjectPublicKeyInfo = new rn(), Object.assign(this, e);
  }
}
f([
  y({
    type: b.Integer,
    context: 0,
    defaultValue: Hi.v1
  })
], Pr.prototype, "version", void 0);
f([
  y({
    type: b.Integer,
    converter: xt
  })
], Pr.prototype, "serialNumber", void 0);
f([
  y({ type: oe })
], Pr.prototype, "signature", void 0);
f([
  y({ type: Ht })
], Pr.prototype, "issuer", void 0);
f([
  y({ type: lc })
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
class uc {
  constructor(e = {}) {
    this.userCertificate = new ArrayBuffer(0), this.revocationDate = new Yt(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, converter: xt })
], uc.prototype, "userCertificate", void 0);
f([
  y({ type: Yt })
], uc.prototype, "revocationDate", void 0);
f([
  y({ type: Hr, optional: !0, repeated: "sequence" })
], uc.prototype, "crlEntryExtensions", void 0);
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
  y({ type: uc, repeated: "sequence", optional: !0 })
], Cn.prototype, "revokedCertificates", void 0);
f([
  y({ type: Hr, optional: !0, context: 0, repeated: "sequence" })
], Cn.prototype, "crlExtensions", void 0);
class ef {
  constructor(e = {}) {
    this.tbsCertList = new Cn(), this.signatureAlgorithm = new oe(), this.signature = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: Cn })
], ef.prototype, "tbsCertList", void 0);
f([
  y({ type: oe })
], ef.prototype, "signatureAlgorithm", void 0);
f([
  y({ type: b.BitString })
], ef.prototype, "signature", void 0);
class os {
  constructor(e = {}) {
    this.issuer = new Ht(), this.serialNumber = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: Ht })
], os.prototype, "issuer", void 0);
f([
  y({ type: b.Integer, converter: xt })
], os.prototype, "serialNumber", void 0);
let Fi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: Ln, context: 0, implicit: !0 })
], Fi.prototype, "subjectKeyIdentifier", void 0);
f([
  y({ type: os })
], Fi.prototype, "issuerAndSerialNumber", void 0);
Fi = f([
  H({ type: M.Choice })
], Fi);
var an;
(function(r) {
  r[r.v0 = 0] = "v0", r[r.v1 = 1] = "v1", r[r.v2 = 2] = "v2", r[r.v3 = 3] = "v3", r[r.v4 = 4] = "v4", r[r.v5 = 5] = "v5";
})(an || (an = {}));
let Ds = class extends oe {
};
Ds = f([
  H({ type: M.Sequence })
], Ds);
let ea = class extends oe {
};
ea = f([
  H({ type: M.Sequence })
], ea);
let cn = class extends oe {
};
cn = f([
  H({ type: M.Sequence })
], cn);
let ta = class extends oe {
};
ta = f([
  H({ type: M.Sequence })
], ta);
let Jf = class extends oe {
};
Jf = f([
  H({ type: M.Sequence })
], Jf);
let Pl = class extends oe {
};
Pl = f([
  H({ type: M.Sequence })
], Pl);
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
var jl;
class hn {
  constructor(e = {}) {
    this.version = an.v0, this.sid = new Fi(), this.digestAlgorithm = new Ds(), this.signatureAlgorithm = new ea(), this.signature = new it(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], hn.prototype, "version", void 0);
f([
  y({ type: Fi })
], hn.prototype, "sid", void 0);
f([
  y({ type: Ds })
], hn.prototype, "digestAlgorithm", void 0);
f([
  y({ type: as, repeated: "set", context: 0, implicit: !0, optional: !0 })
], hn.prototype, "signedAttrs", void 0);
f([
  y({ type: ea })
], hn.prototype, "signatureAlgorithm", void 0);
f([
  y({ type: it })
], hn.prototype, "signature", void 0);
f([
  y({ type: as, repeated: "set", context: 1, implicit: !0, optional: !0 })
], hn.prototype, "unsignedAttrs", void 0);
let ra = jl = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, jl.prototype);
  }
};
ra = jl = f([
  H({ type: M.Set, itemType: hn })
], ra);
let Xf = class extends Yt {
};
Xf = f([
  H({ type: M.Choice })
], Xf);
let Qf = class extends hn {
};
Qf = f([
  H({ type: M.Sequence })
], Qf);
class tf {
  constructor(e = {}) {
    this.acIssuer = new $e(), this.acSerial = 0, this.attrs = [], Object.assign(this, e);
  }
}
f([
  y({ type: $e })
], tf.prototype, "acIssuer", void 0);
f([
  y({ type: b.Integer })
], tf.prototype, "acSerial", void 0);
f([
  y({ type: Sn, repeated: "sequence" })
], tf.prototype, "attrs", void 0);
var Rl;
let na = Rl = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Rl.prototype);
  }
};
na = Rl = f([
  H({ type: M.Sequence, itemType: b.ObjectIdentifier })
], na);
class fc {
  constructor(e = {}) {
    this.permitUnSpecified = !0, Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, optional: !0 })
], fc.prototype, "pathLenConstraint", void 0);
f([
  y({ type: na, implicit: !0, context: 0, optional: !0 })
], fc.prototype, "permittedAttrs", void 0);
f([
  y({ type: na, implicit: !0, context: 1, optional: !0 })
], fc.prototype, "excludedAttrs", void 0);
f([
  y({ type: b.Boolean, defaultValue: !0 })
], fc.prototype, "permitUnSpecified", void 0);
class Ii {
  constructor(e = {}) {
    this.issuer = new cr(), this.serial = new ArrayBuffer(0), this.issuerUID = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: cr })
], Ii.prototype, "issuer", void 0);
f([
  y({ type: b.Integer, converter: xt })
], Ii.prototype, "serial", void 0);
f([
  y({ type: b.BitString, optional: !0 })
], Ii.prototype, "issuerUID", void 0);
var Ul;
(function(r) {
  r[r.publicKey = 0] = "publicKey", r[r.publicKeyCert = 1] = "publicKeyCert", r[r.otherObjectTypes = 2] = "otherObjectTypes";
})(Ul || (Ul = {}));
class ki {
  constructor(e = {}) {
    this.digestedObjectType = Ul.publicKey, this.digestAlgorithm = new oe(), this.objectDigest = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.Enumerated })
], ki.prototype, "digestedObjectType", void 0);
f([
  y({ type: b.ObjectIdentifier, optional: !0 })
], ki.prototype, "otherObjectTypeID", void 0);
f([
  y({ type: oe })
], ki.prototype, "digestAlgorithm", void 0);
f([
  y({ type: b.BitString })
], ki.prototype, "objectDigest", void 0);
class hc {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: cr, optional: !0 })
], hc.prototype, "issuerName", void 0);
f([
  y({ type: Ii, context: 0, implicit: !0, optional: !0 })
], hc.prototype, "baseCertificateID", void 0);
f([
  y({ type: ki, context: 1, implicit: !0, optional: !0 })
], hc.prototype, "objectDigestInfo", void 0);
let zi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: $e, repeated: "sequence" })
], zi.prototype, "v1Form", void 0);
f([
  y({ type: hc, context: 0, implicit: !0 })
], zi.prototype, "v2Form", void 0);
zi = f([
  H({ type: M.Choice })
], zi);
class dc {
  constructor(e = {}) {
    this.notBeforeTime = /* @__PURE__ */ new Date(), this.notAfterTime = /* @__PURE__ */ new Date(), Object.assign(this, e);
  }
}
f([
  y({ type: b.GeneralizedTime })
], dc.prototype, "notBeforeTime", void 0);
f([
  y({ type: b.GeneralizedTime })
], dc.prototype, "notAfterTime", void 0);
class yo {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: Ii, implicit: !0, context: 0, optional: !0 })
], yo.prototype, "baseCertificateID", void 0);
f([
  y({ type: cr, implicit: !0, context: 1, optional: !0 })
], yo.prototype, "entityName", void 0);
f([
  y({ type: ki, implicit: !0, context: 2, optional: !0 })
], yo.prototype, "objectDigestInfo", void 0);
var Dl;
(function(r) {
  r[r.v2 = 1] = "v2";
})(Dl || (Dl = {}));
class Kr {
  constructor(e = {}) {
    this.version = Dl.v2, this.holder = new yo(), this.issuer = new zi(), this.signature = new oe(), this.serialNumber = new ArrayBuffer(0), this.attrCertValidityPeriod = new dc(), this.attributes = [], Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], Kr.prototype, "version", void 0);
f([
  y({ type: yo })
], Kr.prototype, "holder", void 0);
f([
  y({ type: zi })
], Kr.prototype, "issuer", void 0);
f([
  y({ type: oe })
], Kr.prototype, "signature", void 0);
f([
  y({ type: b.Integer, converter: xt })
], Kr.prototype, "serialNumber", void 0);
f([
  y({ type: dc })
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
class pc {
  constructor(e = {}) {
    this.acinfo = new Kr(), this.signatureAlgorithm = new oe(), this.signatureValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: Kr })
], pc.prototype, "acinfo", void 0);
f([
  y({ type: oe })
], pc.prototype, "signatureAlgorithm", void 0);
f([
  y({ type: b.BitString })
], pc.prototype, "signatureValue", void 0);
var ia;
(function(r) {
  r[r.unmarked = 1] = "unmarked", r[r.unclassified = 2] = "unclassified", r[r.restricted = 4] = "restricted", r[r.confidential = 8] = "confidential", r[r.secret = 16] = "secret", r[r.topSecret = 32] = "topSecret";
})(ia || (ia = {}));
class $l extends ic {
}
class rf {
  constructor(e = {}) {
    this.type = "", this.value = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier, implicit: !0, context: 0 })
], rf.prototype, "type", void 0);
f([
  y({ type: b.Any, implicit: !0, context: 1 })
], rf.prototype, "value", void 0);
class nf {
  constructor(e = {}) {
    this.policyId = "", this.classList = new $l(ia.unclassified), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], nf.prototype, "policyId", void 0);
f([
  y({ type: $l, defaultValue: new $l(ia.unclassified) })
], nf.prototype, "classList", void 0);
f([
  y({ type: rf, repeated: "set" })
], nf.prototype, "securityCategories", void 0);
class yc {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: it })
], yc.prototype, "cotets", void 0);
f([
  y({ type: b.ObjectIdentifier })
], yc.prototype, "oid", void 0);
f([
  y({ type: b.Utf8String })
], yc.prototype, "string", void 0);
class Lp {
  constructor(e = {}) {
    this.values = [], Object.assign(this, e);
  }
}
f([
  y({ type: cr, implicit: !0, context: 0, optional: !0 })
], Lp.prototype, "policyAuthority", void 0);
f([
  y({ type: yc, repeated: "sequence" })
], Lp.prototype, "values", void 0);
var Ml;
class gc {
  constructor(e = {}) {
    this.targetCertificate = new Ii(), Object.assign(this, e);
  }
}
f([
  y({ type: Ii })
], gc.prototype, "targetCertificate", void 0);
f([
  y({ type: $e, optional: !0 })
], gc.prototype, "targetName", void 0);
f([
  y({ type: ki, optional: !0 })
], gc.prototype, "certDigestInfo", void 0);
let Gi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: $e, context: 0, implicit: !0 })
], Gi.prototype, "targetName", void 0);
f([
  y({ type: $e, context: 1, implicit: !0 })
], Gi.prototype, "targetGroup", void 0);
f([
  y({ type: gc, context: 2, implicit: !0 })
], Gi.prototype, "targetCert", void 0);
Gi = f([
  H({ type: M.Choice })
], Gi);
let Vl = Ml = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Ml.prototype);
  }
};
Vl = Ml = f([
  H({ type: M.Sequence, itemType: Gi })
], Vl);
var Ll;
let eh = Ll = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Ll.prototype);
  }
};
eh = Ll = f([
  H({ type: M.Sequence, itemType: Vl })
], eh);
class Hp {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: cr, implicit: !0, context: 0, optional: !0 })
], Hp.prototype, "roleAuthority", void 0);
f([
  y({ type: $e, implicit: !0, context: 1 })
], Hp.prototype, "roleName", void 0);
class sf {
  constructor(e = {}) {
    this.service = new $e(), this.ident = new $e(), Object.assign(this, e);
  }
}
f([
  y({ type: $e })
], sf.prototype, "service", void 0);
f([
  y({ type: $e })
], sf.prototype, "ident", void 0);
f([
  y({ type: it, optional: !0 })
], sf.prototype, "authInfo", void 0);
var Hl;
class of {
  constructor(e = {}) {
    this.otherCertFormat = "", this.otherCert = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], of.prototype, "otherCertFormat", void 0);
f([
  y({ type: b.Any })
], of.prototype, "otherCert", void 0);
let pi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: di })
], pi.prototype, "certificate", void 0);
f([
  y({ type: pc, context: 2, implicit: !0 })
], pi.prototype, "v2AttrCert", void 0);
f([
  y({ type: of, context: 3, implicit: !0 })
], pi.prototype, "other", void 0);
pi = f([
  H({ type: M.Choice })
], pi);
let $s = Hl = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Hl.prototype);
  }
};
$s = Hl = f([
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
let qi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: it })
], qi.prototype, "single", void 0);
f([
  y({ type: b.Any })
], qi.prototype, "any", void 0);
qi = f([
  H({ type: M.Choice })
], qi);
class vc {
  constructor(e = {}) {
    this.eContentType = "", Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], vc.prototype, "eContentType", void 0);
f([
  y({ type: qi, context: 0, optional: !0 })
], vc.prototype, "eContent", void 0);
let Ms = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: it, context: 0, implicit: !0, optional: !0 })
], Ms.prototype, "value", void 0);
f([
  y({ type: it, converter: Ig, context: 0, implicit: !0, optional: !0, repeated: "sequence" })
], Ms.prototype, "constructedValue", void 0);
Ms = f([
  H({ type: M.Choice })
], Ms);
class go {
  constructor(e = {}) {
    this.contentType = "", this.contentEncryptionAlgorithm = new ta(), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], go.prototype, "contentType", void 0);
f([
  y({ type: ta })
], go.prototype, "contentEncryptionAlgorithm", void 0);
f([
  y({ type: Ms, optional: !0 })
], go.prototype, "encryptedContent", void 0);
class mc {
  constructor(e = {}) {
    this.keyAttrId = "", Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], mc.prototype, "keyAttrId", void 0);
f([
  y({ type: b.Any, optional: !0 })
], mc.prototype, "keyAttr", void 0);
var Fl;
class wc {
  constructor(e = {}) {
    this.subjectKeyIdentifier = new Ln(), Object.assign(this, e);
  }
}
f([
  y({ type: Ln })
], wc.prototype, "subjectKeyIdentifier", void 0);
f([
  y({ type: b.GeneralizedTime, optional: !0 })
], wc.prototype, "date", void 0);
f([
  y({ type: mc, optional: !0 })
], wc.prototype, "other", void 0);
let Ki = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: wc, context: 0, implicit: !0, optional: !0 })
], Ki.prototype, "rKeyId", void 0);
f([
  y({ type: os, optional: !0 })
], Ki.prototype, "issuerAndSerialNumber", void 0);
Ki = f([
  H({ type: M.Choice })
], Ki);
class af {
  constructor(e = {}) {
    this.rid = new Ki(), this.encryptedKey = new it(), Object.assign(this, e);
  }
}
f([
  y({ type: Ki })
], af.prototype, "rid", void 0);
f([
  y({ type: it })
], af.prototype, "encryptedKey", void 0);
let sa = Fl = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Fl.prototype);
  }
};
sa = Fl = f([
  H({ type: M.Sequence, itemType: af })
], sa);
class cf {
  constructor(e = {}) {
    this.algorithm = new oe(), this.publicKey = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: oe })
], cf.prototype, "algorithm", void 0);
f([
  y({ type: b.BitString })
], cf.prototype, "publicKey", void 0);
let yi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: Ln, context: 0, implicit: !0, optional: !0 })
], yi.prototype, "subjectKeyIdentifier", void 0);
f([
  y({ type: cf, context: 1, implicit: !0, optional: !0 })
], yi.prototype, "originatorKey", void 0);
f([
  y({ type: os, optional: !0 })
], yi.prototype, "issuerAndSerialNumber", void 0);
yi = f([
  H({ type: M.Choice })
], yi);
class cs {
  constructor(e = {}) {
    this.version = an.v3, this.originator = new yi(), this.keyEncryptionAlgorithm = new cn(), this.recipientEncryptedKeys = new sa(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], cs.prototype, "version", void 0);
f([
  y({ type: yi, context: 0 })
], cs.prototype, "originator", void 0);
f([
  y({ type: it, context: 1, optional: !0 })
], cs.prototype, "ukm", void 0);
f([
  y({ type: cn })
], cs.prototype, "keyEncryptionAlgorithm", void 0);
f([
  y({ type: sa })
], cs.prototype, "recipientEncryptedKeys", void 0);
let Zi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: Ln, context: 0, implicit: !0 })
], Zi.prototype, "subjectKeyIdentifier", void 0);
f([
  y({ type: os })
], Zi.prototype, "issuerAndSerialNumber", void 0);
Zi = f([
  H({ type: M.Choice })
], Zi);
class vo {
  constructor(e = {}) {
    this.version = an.v0, this.rid = new Zi(), this.keyEncryptionAlgorithm = new cn(), this.encryptedKey = new it(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], vo.prototype, "version", void 0);
f([
  y({ type: Zi })
], vo.prototype, "rid", void 0);
f([
  y({ type: cn })
], vo.prototype, "keyEncryptionAlgorithm", void 0);
f([
  y({ type: it })
], vo.prototype, "encryptedKey", void 0);
class mo {
  constructor(e = {}) {
    this.keyIdentifier = new it(), Object.assign(this, e);
  }
}
f([
  y({ type: it })
], mo.prototype, "keyIdentifier", void 0);
f([
  y({ type: b.GeneralizedTime, optional: !0 })
], mo.prototype, "date", void 0);
f([
  y({ type: mc, optional: !0 })
], mo.prototype, "other", void 0);
class wo {
  constructor(e = {}) {
    this.version = an.v4, this.kekid = new mo(), this.keyEncryptionAlgorithm = new cn(), this.encryptedKey = new it(), Object.assign(this, e);
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
  y({ type: it })
], wo.prototype, "encryptedKey", void 0);
class bo {
  constructor(e = {}) {
    this.version = an.v0, this.keyEncryptionAlgorithm = new cn(), this.encryptedKey = new it(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], bo.prototype, "version", void 0);
f([
  y({ type: Pl, context: 0, optional: !0 })
], bo.prototype, "keyDerivationAlgorithm", void 0);
f([
  y({ type: cn })
], bo.prototype, "keyEncryptionAlgorithm", void 0);
f([
  y({ type: it })
], bo.prototype, "encryptedKey", void 0);
class lf {
  constructor(e = {}) {
    this.oriType = "", this.oriValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], lf.prototype, "oriType", void 0);
f([
  y({ type: b.Any })
], lf.prototype, "oriValue", void 0);
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
  y({ type: lf, context: 4, implicit: !0, optional: !0 })
], Fn.prototype, "ori", void 0);
Fn = f([
  H({ type: M.Choice })
], Fn);
var zl;
let oa = zl = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, zl.prototype);
  }
};
oa = zl = f([
  H({ type: M.Set, itemType: Fn })
], oa);
var Gl;
class bc {
  constructor(e = {}) {
    this.otherRevInfoFormat = "", this.otherRevInfo = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], bc.prototype, "otherRevInfoFormat", void 0);
f([
  y({ type: b.Any })
], bc.prototype, "otherRevInfo", void 0);
let aa = class {
  constructor(e = {}) {
    this.other = new bc(), Object.assign(this, e);
  }
};
f([
  y({ type: bc, context: 1, implicit: !0 })
], aa.prototype, "other", void 0);
aa = f([
  H({ type: M.Choice })
], aa);
let ca = Gl = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Gl.prototype);
  }
};
ca = Gl = f([
  H({ type: M.Set, itemType: aa })
], ca);
class uf {
  constructor(e = {}) {
    Object.assign(this, e);
  }
}
f([
  y({ type: $s, context: 0, implicit: !0, optional: !0 })
], uf.prototype, "certs", void 0);
f([
  y({ type: ca, context: 1, implicit: !0, optional: !0 })
], uf.prototype, "crls", void 0);
var ql;
let Kl = ql = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, ql.prototype);
  }
};
Kl = ql = f([
  H({ type: M.Set, itemType: as })
], Kl);
class xo {
  constructor(e = {}) {
    this.version = an.v0, this.recipientInfos = new oa(), this.encryptedContentInfo = new go(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], xo.prototype, "version", void 0);
f([
  y({ type: uf, context: 0, implicit: !0, optional: !0 })
], xo.prototype, "originatorInfo", void 0);
f([
  y({ type: oa })
], xo.prototype, "recipientInfos", void 0);
f([
  y({ type: go })
], xo.prototype, "encryptedContentInfo", void 0);
f([
  y({ type: Kl, context: 1, implicit: !0, optional: !0 })
], xo.prototype, "unprotectedAttrs", void 0);
const Xg = "1.2.840.113549.1.7.1", Zl = "1.2.840.113549.1.7.2";
var Wl;
let la = Wl = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Wl.prototype);
  }
};
la = Wl = f([
  H({ type: M.Set, itemType: Ds })
], la);
class xn {
  constructor(e = {}) {
    this.version = an.v0, this.digestAlgorithms = new la(), this.encapContentInfo = new vc(), this.signerInfos = new ra(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], xn.prototype, "version", void 0);
f([
  y({ type: la })
], xn.prototype, "digestAlgorithms", void 0);
f([
  y({ type: vc })
], xn.prototype, "encapContentInfo", void 0);
f([
  y({ type: $s, context: 0, implicit: !0, optional: !0 })
], xn.prototype, "certificates", void 0);
f([
  y({ type: ca, context: 1, implicit: !0, optional: !0 })
], xn.prototype, "crls", void 0);
f([
  y({ type: ra })
], xn.prototype, "signerInfos", void 0);
const Vs = "1.2.840.10045.2.1", ff = "1.2.840.10045.4.1", Fp = "1.2.840.10045.4.3.1", hf = "1.2.840.10045.4.3.2", df = "1.2.840.10045.4.3.3", pf = "1.2.840.10045.4.3.4", th = "1.2.840.10045.3.1.7", rh = "1.3.132.0.34", nh = "1.3.132.0.35";
function Ao(r) {
  return new oe({ algorithm: r });
}
const Qg = Ao(ff);
Ao(Fp);
const ev = Ao(hf), tv = Ao(df), rv = Ao(pf);
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
class nv extends it {
}
let Wi = class {
  constructor(e = {}) {
    Object.assign(this, e);
  }
};
f([
  y({ type: b.OctetString })
], Wi.prototype, "a", void 0);
f([
  y({ type: b.OctetString })
], Wi.prototype, "b", void 0);
f([
  y({ type: b.BitString, optional: !0 })
], Wi.prototype, "seed", void 0);
Wi = f([
  H({ type: M.Sequence })
], Wi);
var Yl;
(function(r) {
  r[r.ecpVer1 = 1] = "ecpVer1";
})(Yl || (Yl = {}));
let _n = class {
  constructor(e = {}) {
    this.version = Yl.ecpVer1, Object.assign(this, e);
  }
};
f([
  y({ type: b.Integer })
], _n.prototype, "version", void 0);
f([
  y({ type: Ls })
], _n.prototype, "fieldID", void 0);
f([
  y({ type: Wi })
], _n.prototype, "curve", void 0);
f([
  y({ type: nv })
], _n.prototype, "base", void 0);
f([
  y({ type: b.Integer, converter: xt })
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
class xc {
  constructor(e = {}) {
    this.version = 1, this.privateKey = new it(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], xc.prototype, "version", void 0);
f([
  y({ type: it })
], xc.prototype, "privateKey", void 0);
f([
  y({ type: zn, context: 0, optional: !0 })
], xc.prototype, "parameters", void 0);
f([
  y({ type: b.BitString, context: 1, optional: !0 })
], xc.prototype, "publicKey", void 0);
class ua {
  constructor(e = {}) {
    this.r = new ArrayBuffer(0), this.s = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, converter: xt })
], ua.prototype, "r", void 0);
f([
  y({ type: b.Integer, converter: xt })
], ua.prototype, "s", void 0);
const wr = "1.2.840.113549.1.1", gi = `${wr}.1`, iv = `${wr}.7`, sv = `${wr}.9`, Ns = `${wr}.10`, ov = `${wr}.2`, av = `${wr}.4`, fa = `${wr}.5`, cv = `${wr}.14`, Jl = `${wr}.11`, ha = `${wr}.12`, da = `${wr}.13`, zp = `${wr}.15`, Gp = `${wr}.16`, pa = "1.3.14.3.2.26", qp = "2.16.840.1.101.3.4.2.4", ya = "2.16.840.1.101.3.4.2.1", ga = "2.16.840.1.101.3.4.2.2", va = "2.16.840.1.101.3.4.2.3", lv = "2.16.840.1.101.3.4.2.5", uv = "2.16.840.1.101.3.4.2.6", fv = "1.2.840.113549.2.2", hv = "1.2.840.113549.2.5", Ac = `${wr}.8`;
function Ft(r) {
  return new oe({ algorithm: r, parameters: null });
}
Ft(fv);
Ft(hv);
const vi = Ft(pa);
Ft(qp);
Ft(ya);
Ft(ga);
Ft(va);
Ft(lv);
Ft(uv);
const Kp = new oe({
  algorithm: Ac,
  parameters: K.serialize(vi)
}), Zp = new oe({
  algorithm: sv,
  parameters: K.serialize(qo.toASN(new Uint8Array([218, 57, 163, 238, 94, 107, 75, 13, 50, 85, 191, 239, 149, 96, 24, 144, 175, 216, 7, 9]).buffer))
});
Ft(gi);
Ft(ov);
Ft(av);
Ft(fa);
Ft(zp);
Ft(Gp);
Ft(ha);
Ft(da);
Ft(zp);
Ft(Gp);
class Sc {
  constructor(e = {}) {
    this.hashAlgorithm = new oe(vi), this.maskGenAlgorithm = new oe({
      algorithm: Ac,
      parameters: K.serialize(vi)
    }), this.pSourceAlgorithm = new oe(Zp), Object.assign(this, e);
  }
}
f([
  y({ type: oe, context: 0, defaultValue: vi })
], Sc.prototype, "hashAlgorithm", void 0);
f([
  y({ type: oe, context: 1, defaultValue: Kp })
], Sc.prototype, "maskGenAlgorithm", void 0);
f([
  y({ type: oe, context: 2, defaultValue: Zp })
], Sc.prototype, "pSourceAlgorithm", void 0);
new oe({
  algorithm: iv,
  parameters: K.serialize(new Sc())
});
class mi {
  constructor(e = {}) {
    this.hashAlgorithm = new oe(vi), this.maskGenAlgorithm = new oe({
      algorithm: Ac,
      parameters: K.serialize(vi)
    }), this.saltLength = 20, this.trailerField = 1, Object.assign(this, e);
  }
}
f([
  y({ type: oe, context: 0, defaultValue: vi })
], mi.prototype, "hashAlgorithm", void 0);
f([
  y({ type: oe, context: 1, defaultValue: Kp })
], mi.prototype, "maskGenAlgorithm", void 0);
f([
  y({ type: b.Integer, context: 2, defaultValue: 20 })
], mi.prototype, "saltLength", void 0);
f([
  y({ type: b.Integer, context: 3, defaultValue: 1 })
], mi.prototype, "trailerField", void 0);
new oe({
  algorithm: Ns,
  parameters: K.serialize(new mi())
});
class _c {
  constructor(e = {}) {
    this.digestAlgorithm = new oe(), this.digest = new it(), Object.assign(this, e);
  }
}
f([
  y({ type: oe })
], _c.prototype, "digestAlgorithm", void 0);
f([
  y({ type: it })
], _c.prototype, "digest", void 0);
var Xl;
class Ec {
  constructor(e = {}) {
    this.prime = new ArrayBuffer(0), this.exponent = new ArrayBuffer(0), this.coefficient = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, converter: xt })
], Ec.prototype, "prime", void 0);
f([
  y({ type: b.Integer, converter: xt })
], Ec.prototype, "exponent", void 0);
f([
  y({ type: b.Integer, converter: xt })
], Ec.prototype, "coefficient", void 0);
let Ql = Xl = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, Xl.prototype);
  }
};
Ql = Xl = f([
  H({ type: M.Sequence, itemType: Ec })
], Ql);
class dn {
  constructor(e = {}) {
    this.version = 0, this.modulus = new ArrayBuffer(0), this.publicExponent = new ArrayBuffer(0), this.privateExponent = new ArrayBuffer(0), this.prime1 = new ArrayBuffer(0), this.prime2 = new ArrayBuffer(0), this.exponent1 = new ArrayBuffer(0), this.exponent2 = new ArrayBuffer(0), this.coefficient = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], dn.prototype, "version", void 0);
f([
  y({ type: b.Integer, converter: xt })
], dn.prototype, "modulus", void 0);
f([
  y({ type: b.Integer, converter: xt })
], dn.prototype, "publicExponent", void 0);
f([
  y({ type: b.Integer, converter: xt })
], dn.prototype, "privateExponent", void 0);
f([
  y({ type: b.Integer, converter: xt })
], dn.prototype, "prime1", void 0);
f([
  y({ type: b.Integer, converter: xt })
], dn.prototype, "prime2", void 0);
f([
  y({ type: b.Integer, converter: xt })
], dn.prototype, "exponent1", void 0);
f([
  y({ type: b.Integer, converter: xt })
], dn.prototype, "exponent2", void 0);
f([
  y({ type: b.Integer, converter: xt })
], dn.prototype, "coefficient", void 0);
f([
  y({ type: Ql, optional: !0 })
], dn.prototype, "otherPrimeInfos", void 0);
class yf {
  constructor(e = {}) {
    this.modulus = new ArrayBuffer(0), this.publicExponent = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer, converter: xt })
], yf.prototype, "modulus", void 0);
f([
  y({ type: b.Integer, converter: xt })
], yf.prototype, "publicExponent", void 0);
var eu;
(function(r) {
  r[r.Transient = 0] = "Transient", r[r.Singleton = 1] = "Singleton", r[r.ResolutionScoped = 2] = "ResolutionScoped", r[r.ContainerScoped = 3] = "ContainerScoped";
})(eu || (eu = {}));
const dr = eu;
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
var tu = function(r, e) {
  return tu = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, n) {
    t.__proto__ = n;
  } || function(t, n) {
    for (var i in n) n.hasOwnProperty(i) && (t[i] = n[i]);
  }, tu(r, e);
};
function gf(r, e) {
  tu(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
function dv(r, e, t, n) {
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
function pv(r, e) {
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
function ma(r, e) {
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
    r = r.concat(ma(arguments[e]));
  return r;
}
var yv = "injectionTokens";
function gv(r) {
  var e = Reflect.getMetadata("design:paramtypes", r) || [], t = Reflect.getOwnMetadata(yv, r) || {};
  return Object.keys(t).forEach(function(n) {
    e[+n] = t[n];
  }), e;
}
function Wp(r) {
  return !!r.useClass;
}
function ru(r) {
  return !!r.useFactory;
}
var Yp = function() {
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
function Ni(r) {
  return typeof r == "string" || typeof r == "symbol";
}
function vv(r) {
  return typeof r == "object" && "token" in r && "multiple" in r;
}
function ih(r) {
  return typeof r == "object" && "token" in r && "transform" in r;
}
function mv(r) {
  return typeof r == "function" || r instanceof Yp;
}
function Uo(r) {
  return !!r.useToken;
}
function Do(r) {
  return r.useValue != null;
}
function wv(r) {
  return Wp(r) || Do(r) || Uo(r) || ru(r);
}
var vf = function() {
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
}(), bv = function(r) {
  gf(e, r);
  function e() {
    return r !== null && r.apply(this, arguments) || this;
  }
  return e;
}(vf), sh = /* @__PURE__ */ function() {
  function r() {
    this.scopedResolutions = /* @__PURE__ */ new Map();
  }
  return r;
}();
function xv(r, e) {
  if (r === null)
    return "at position #" + e;
  var t = r.split(",")[e].trim();
  return '"' + t + '" at position #' + e;
}
function Av(r, e, t) {
  return t === void 0 && (t = "    "), ti([r], e.message.split(`
`).map(function(n) {
    return t + n;
  })).join(`
`);
}
function Sv(r, e, t) {
  var n = ma(r.toString().match(/constructor\(([\w, ]+)\)/) || [], 2), i = n[1], s = i === void 0 ? null : i, o = xv(s, e);
  return Av("Cannot inject the dependency " + o + ' of "' + r.name + '" constructor. Reason:', t);
}
function _v(r) {
  if (typeof r.dispose != "function")
    return !1;
  var e = r.dispose;
  return !(e.length > 0);
}
var Ev = function(r) {
  gf(e, r);
  function e() {
    return r !== null && r.apply(this, arguments) || this;
  }
  return e;
}(vf), Iv = function(r) {
  gf(e, r);
  function e() {
    return r !== null && r.apply(this, arguments) || this;
  }
  return e;
}(vf), kv = /* @__PURE__ */ function() {
  function r() {
    this.preResolution = new Ev(), this.postResolution = new Iv();
  }
  return r;
}(), Jp = /* @__PURE__ */ new Map(), Cv = function() {
  function r(e) {
    this.parent = e, this._registry = new bv(), this.interceptors = new kv(), this.disposed = !1, this.disposables = /* @__PURE__ */ new Set();
  }
  return r.prototype.register = function(e, t, n) {
    n === void 0 && (n = { lifecycle: dr.Transient }), this.ensureNotDisposed();
    var i;
    if (wv(t) ? i = t : i = { useClass: t }, Uo(i))
      for (var s = [e], o = i; o != null; ) {
        var c = o.useToken;
        if (s.includes(c))
          throw new Error("Token registration cycle detected! " + ti(s, [c]).join(" -> "));
        s.push(c);
        var u = this._registry.get(c);
        u && Uo(u.provider) ? o = u.provider : o = null;
      }
    if ((n.lifecycle === dr.Singleton || n.lifecycle == dr.ContainerScoped || n.lifecycle == dr.ResolutionScoped) && (Do(i) || ru(i)))
      throw new Error('Cannot use lifecycle "' + dr[n.lifecycle] + '" with ValueProviders or FactoryProviders');
    return this._registry.set(e, { provider: i, options: n }), this;
  }, r.prototype.registerType = function(e, t) {
    return this.ensureNotDisposed(), Ni(t) ? this.register(e, {
      useToken: t
    }) : this.register(e, {
      useClass: t
    });
  }, r.prototype.registerInstance = function(e, t) {
    return this.ensureNotDisposed(), this.register(e, {
      useValue: t
    });
  }, r.prototype.registerSingleton = function(e, t) {
    if (this.ensureNotDisposed(), Ni(e)) {
      if (Ni(t))
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
    return t && !Ni(t) && (n = t), this.register(e, {
      useClass: n
    }, { lifecycle: dr.Singleton });
  }, r.prototype.resolve = function(e, t) {
    t === void 0 && (t = new sh()), this.ensureNotDisposed();
    var n = this.getRegistration(e);
    if (!n && Ni(e))
      throw new Error('Attempted to resolve unregistered dependency token: "' + e.toString() + '"');
    if (this.executePreResolutionInterceptor(e, "Single"), n) {
      var i = this.resolveRegistration(n, t);
      return this.executePostResolutionInterceptor(e, i, "Single"), i;
    }
    if (mv(e)) {
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
    return Do(e.provider) ? o = e.provider.useValue : Uo(e.provider) ? o = s ? e.instance || (e.instance = this.resolve(e.provider.useToken, t)) : this.resolve(e.provider.useToken, t) : Wp(e.provider) ? o = s ? e.instance || (e.instance = this.construct(e.provider.useClass, t)) : this.construct(e.provider.useClass, t) : ru(e.provider) ? o = e.provider.useFactory(this) : o = this.construct(e.provider, t), e.options.lifecycle === dr.ResolutionScoped && t.scopedResolutions.set(e, o), o;
  }, r.prototype.resolveAll = function(e, t) {
    var n = this;
    t === void 0 && (t = new sh()), this.ensureNotDisposed();
    var i = this.getAllRegistrations(e);
    if (!i && Ni(e))
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
        var s = ma(i.value, 2), o = s[0], c = s[1];
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
        var o = ma(s.value, 2), c = o[0], u = o[1];
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
    return dv(this, void 0, void 0, function() {
      var e;
      return pv(this, function(t) {
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
    if (e instanceof Yp)
      return e.createProxy(function(s) {
        return n.resolve(s, t);
      });
    var i = function() {
      var s = Jp.get(e);
      if (!s || s.length === 0) {
        if (e.length === 0)
          return new e();
        throw new Error('TypeInfo not known for "' + e.name + '"');
      }
      var o = s.map(n.resolveParams(t, e));
      return new (e.bind.apply(e, ti([void 0], o)))();
    }();
    return _v(i) && this.disposables.add(i), i;
  }, r.prototype.resolveParams = function(e, t) {
    var n = this;
    return function(i, s) {
      var o, c, u;
      try {
        return vv(i) ? ih(i) ? i.multiple ? (o = n.resolve(i.transform)).transform.apply(o, ti([n.resolveAll(i.token)], i.transformArgs)) : (c = n.resolve(i.transform)).transform.apply(c, ti([n.resolve(i.token, e)], i.transformArgs)) : i.multiple ? n.resolveAll(i.token) : n.resolve(i.token, e) : ih(i) ? (u = n.resolve(i.transform, e)).transform.apply(u, ti([n.resolve(i.token, e)], i.transformArgs)) : n.resolve(i, e);
      } catch (h) {
        throw new Error(Sv(t, s, h));
      }
    };
  }, r.prototype.ensureNotDisposed = function() {
    if (this.disposed)
      throw new Error("This container has been disposed, you cannot interact with a disposed container");
  }, r;
}(), lr = new Cv();
function Ic() {
  return function(r) {
    Jp.set(r, gv(r));
  };
}
if (typeof Reflect > "u" || !Reflect.getMetadata)
  throw new Error(`tsyringe requires a reflect polyfill. Please add 'import "reflect-metadata"' to the top of your entry point.`);
var nu;
class kc {
  constructor(e = {}) {
    this.attrId = "", this.attrValues = [], Object.assign(e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], kc.prototype, "attrId", void 0);
f([
  y({ type: b.Any, repeated: "set" })
], kc.prototype, "attrValues", void 0);
let oh = nu = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, nu.prototype);
  }
};
oh = nu = f([
  H({ type: M.Sequence, itemType: kc })
], oh);
var iu;
let ah = iu = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, iu.prototype);
  }
};
ah = iu = f([
  H({ type: M.Sequence, itemType: bn })
], ah);
class Xp {
  constructor(e = {}) {
    this.certId = "", this.certValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Xp.prototype, "certId", void 0);
f([
  y({ type: b.Any, context: 0 })
], Xp.prototype, "certValue", void 0);
class Qp {
  constructor(e = {}) {
    this.crlId = "", this.crltValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Qp.prototype, "crlId", void 0);
f([
  y({ type: b.Any, context: 0 })
], Qp.prototype, "crltValue", void 0);
class e0 extends it {
}
let Cc = class {
  constructor(e = {}) {
    this.encryptionAlgorithm = new oe(), this.encryptedData = new e0(), Object.assign(this, e);
  }
};
f([
  y({ type: oe })
], Cc.prototype, "encryptionAlgorithm", void 0);
f([
  y({ type: e0 })
], Cc.prototype, "encryptedData", void 0);
var su, ou;
(function(r) {
  r[r.v1 = 0] = "v1";
})(ou || (ou = {}));
class t0 extends it {
}
let au = su = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, su.prototype);
  }
};
au = su = f([
  H({ type: M.Sequence, itemType: Sn })
], au);
class So {
  constructor(e = {}) {
    this.version = ou.v1, this.privateKeyAlgorithm = new oe(), this.privateKey = new t0(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], So.prototype, "version", void 0);
f([
  y({ type: oe })
], So.prototype, "privateKeyAlgorithm", void 0);
f([
  y({ type: t0 })
], So.prototype, "privateKey", void 0);
f([
  y({ type: au, implicit: !0, context: 0, optional: !0 })
], So.prototype, "attributes", void 0);
let ch = class extends So {
};
ch = f([
  H({ type: M.Sequence })
], ch);
let lh = class extends Cc {
};
lh = f([
  H({ type: M.Sequence })
], lh);
class r0 {
  constructor(e = {}) {
    this.secretTypeId = "", this.secretValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], r0.prototype, "secretTypeId", void 0);
f([
  y({ type: b.Any, context: 0 })
], r0.prototype, "secretValue", void 0);
class _o {
  constructor(e = {}) {
    this.mac = new _c(), this.macSalt = new it(), this.iterations = 1, Object.assign(this, e);
  }
}
f([
  y({ type: _c })
], _o.prototype, "mac", void 0);
f([
  y({ type: it })
], _o.prototype, "macSalt", void 0);
f([
  y({ type: b.Integer, defaultValue: 1 })
], _o.prototype, "iterations", void 0);
class Bc {
  constructor(e = {}) {
    this.version = 3, this.authSafe = new bn(), this.macData = new _o(), Object.assign(this, e);
  }
}
f([
  y({ type: b.Integer })
], Bc.prototype, "version", void 0);
f([
  y({ type: bn })
], Bc.prototype, "authSafe", void 0);
f([
  y({ type: _o, optional: !0 })
], Bc.prototype, "macData", void 0);
var cu;
class Oc {
  constructor(e = {}) {
    this.bagId = "", this.bagValue = new ArrayBuffer(0), Object.assign(this, e);
  }
}
f([
  y({ type: b.ObjectIdentifier })
], Oc.prototype, "bagId", void 0);
f([
  y({ type: b.Any, context: 0 })
], Oc.prototype, "bagValue", void 0);
f([
  y({ type: kc, repeated: "set", optional: !0 })
], Oc.prototype, "bagAttributes", void 0);
let uh = cu = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, cu.prototype);
  }
};
uh = cu = f([
  H({ type: M.Sequence, itemType: Oc })
], uh);
var lu, uu, fu;
const n0 = "1.2.840.113549.1.9", i0 = `${n0}.7`, mf = `${n0}.14`;
let wa = class extends Xt {
  constructor(e = {}) {
    super(e);
  }
  toString() {
    return this.ia5String || super.toString();
  }
};
f([
  y({ type: b.IA5String })
], wa.prototype, "ia5String", void 0);
wa = f([
  H({ type: M.Choice })
], wa);
let fh = class extends bn {
};
fh = f([
  H({ type: M.Sequence })
], fh);
let hh = class extends Bc {
};
hh = f([
  H({ type: M.Sequence })
], hh);
let dh = class extends Cc {
};
dh = f([
  H({ type: M.Sequence })
], dh);
let hu = class {
  constructor(e = "") {
    this.value = e;
  }
  toString() {
    return this.value;
  }
};
f([
  y({ type: b.IA5String })
], hu.prototype, "value", void 0);
hu = f([
  H({ type: M.Choice })
], hu);
let ph = class extends wa {
};
ph = f([
  H({ type: M.Choice })
], ph);
let yh = class extends Xt {
};
yh = f([
  H({ type: M.Choice })
], yh);
let du = class {
  constructor(e = /* @__PURE__ */ new Date()) {
    this.value = e;
  }
};
f([
  y({ type: b.GeneralizedTime })
], du.prototype, "value", void 0);
du = f([
  H({ type: M.Choice })
], du);
let gh = class extends Xt {
};
gh = f([
  H({ type: M.Choice })
], gh);
let pu = class {
  constructor(e = "M") {
    this.value = e;
  }
  toString() {
    return this.value;
  }
};
f([
  y({ type: b.PrintableString })
], pu.prototype, "value", void 0);
pu = f([
  H({ type: M.Choice })
], pu);
let ba = class {
  constructor(e = "") {
    this.value = e;
  }
  toString() {
    return this.value;
  }
};
f([
  y({ type: b.PrintableString })
], ba.prototype, "value", void 0);
ba = f([
  H({ type: M.Choice })
], ba);
let vh = class extends ba {
};
vh = f([
  H({ type: M.Choice })
], vh);
let mh = class extends Xt {
};
mh = f([
  H({ type: M.Choice })
], mh);
let yu = class {
  constructor(e = "") {
    this.value = e;
  }
  toString() {
    return this.value;
  }
};
f([
  y({ type: b.ObjectIdentifier })
], yu.prototype, "value", void 0);
yu = f([
  H({ type: M.Choice })
], yu);
let wh = class extends Yt {
};
wh = f([
  H({ type: M.Choice })
], wh);
let gu = class {
  constructor(e = 0) {
    this.value = e;
  }
  toString() {
    return this.value.toString();
  }
};
f([
  y({ type: b.Integer })
], gu.prototype, "value", void 0);
gu = f([
  H({ type: M.Choice })
], gu);
let bh = class extends hn {
};
bh = f([
  H({ type: M.Sequence })
], bh);
let xa = class extends Xt {
};
xa = f([
  H({ type: M.Choice })
], xa);
let xh = lu = class extends hi {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, lu.prototype);
  }
};
xh = lu = f([
  H({ type: M.Sequence })
], xh);
let Ah = uu = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, uu.prototype);
  }
};
Ah = uu = f([
  H({ type: M.Set, itemType: as })
], Ah);
let vu = class {
  constructor(e = "") {
    this.value = e;
  }
  toString() {
    return this.value;
  }
};
f([
  y({ type: b.BmpString })
], vu.prototype, "value", void 0);
vu = f([
  H({ type: M.Choice })
], vu);
let mu = class extends oe {
};
mu = f([
  H({ type: M.Sequence })
], mu);
let Sh = fu = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, fu.prototype);
  }
};
Sh = fu = f([
  H({ type: M.Sequence, itemType: mu })
], Sh);
var wu;
let Aa = wu = class extends yt {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, wu.prototype);
  }
};
Aa = wu = f([
  H({ type: M.Sequence, itemType: Sn })
], Aa);
class ls {
  constructor(e = {}) {
    this.version = 0, this.subject = new Ht(), this.subjectPKInfo = new rn(), this.attributes = new Aa(), Object.assign(this, e);
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
  y({ type: Aa, implicit: !0, context: 0 })
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
class Bv {
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
const Yi = "crypto.algorithmProvider";
lr.registerSingleton(Yi, Bv);
var $o;
const br = "1.3.36.3.3.2.8.1.1", _h = `${br}.1`, Eh = `${br}.2`, Ih = `${br}.3`, kh = `${br}.4`, Ch = `${br}.5`, Bh = `${br}.6`, Oh = `${br}.7`, Th = `${br}.8`, Nh = `${br}.9`, Ph = `${br}.10`, jh = `${br}.11`, Rh = `${br}.12`, Uh = `${br}.13`, Dh = `${br}.14`, $h = "brainpoolP160r1", Mh = "brainpoolP160t1", Vh = "brainpoolP192r1", Lh = "brainpoolP192t1", Hh = "brainpoolP224r1", Fh = "brainpoolP224t1", zh = "brainpoolP256r1", Gh = "brainpoolP256t1", qh = "brainpoolP320r1", Kh = "brainpoolP320t1", Zh = "brainpoolP384r1", Wh = "brainpoolP384t1", Yh = "brainpoolP512r1", Jh = "brainpoolP512t1", Ct = "ECDSA";
let Fs = $o = class {
  toAsnAlgorithm(e) {
    switch (e.name.toLowerCase()) {
      case Ct.toLowerCase():
        if ("hash" in e)
          switch ((typeof e.hash == "string" ? e.hash : e.hash.name).toLowerCase()) {
            case "sha-1":
              return Qg;
            case "sha-256":
              return ev;
            case "sha-384":
              return tv;
            case "sha-512":
              return rv;
          }
        else if ("namedCurve" in e) {
          let t = "";
          switch (e.namedCurve) {
            case "P-256":
              t = th;
              break;
            case "K-256":
              t = $o.SECP256K1;
              break;
            case "P-384":
              t = rh;
              break;
            case "P-521":
              t = nh;
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
            case Jh:
              t = Dh;
              break;
          }
          if (t)
            return new oe({
              algorithm: Vs,
              parameters: K.serialize(new zn({ namedCurve: t }))
            });
        }
    }
    return null;
  }
  toWebAlgorithm(e) {
    switch (e.algorithm) {
      case ff:
        return { name: Ct, hash: { name: "SHA-1" } };
      case hf:
        return { name: Ct, hash: { name: "SHA-256" } };
      case df:
        return { name: Ct, hash: { name: "SHA-384" } };
      case pf:
        return { name: Ct, hash: { name: "SHA-512" } };
      case Vs: {
        if (!e.parameters)
          throw new TypeError("Cannot get required parameters from EC algorithm");
        switch (K.parse(e.parameters, zn).namedCurve) {
          case th:
            return { name: Ct, namedCurve: "P-256" };
          case $o.SECP256K1:
            return { name: Ct, namedCurve: "K-256" };
          case rh:
            return { name: Ct, namedCurve: "P-384" };
          case nh:
            return { name: Ct, namedCurve: "P-521" };
          case _h:
            return { name: Ct, namedCurve: $h };
          case Eh:
            return { name: Ct, namedCurve: Mh };
          case Ih:
            return { name: Ct, namedCurve: Vh };
          case kh:
            return { name: Ct, namedCurve: Lh };
          case Ch:
            return { name: Ct, namedCurve: Hh };
          case Bh:
            return { name: Ct, namedCurve: Fh };
          case Oh:
            return { name: Ct, namedCurve: zh };
          case Th:
            return { name: Ct, namedCurve: Gh };
          case Nh:
            return { name: Ct, namedCurve: qh };
          case Ph:
            return { name: Ct, namedCurve: Kh };
          case jh:
            return { name: Ct, namedCurve: Zh };
          case Rh:
            return { name: Ct, namedCurve: Wh };
          case Uh:
            return { name: Ct, namedCurve: Yh };
          case Dh:
            return { name: Ct, namedCurve: Jh };
        }
      }
    }
    return null;
  }
};
Fs.SECP256K1 = "1.3.132.0.10";
Fs = $o = f([
  Ic()
], Fs);
lr.registerSingleton(Eo, Fs);
const s0 = Symbol("name"), o0 = Symbol("value");
class nt {
  constructor(e, t = {}, n = "") {
    this[s0] = e, this[o0] = n;
    for (const i in t)
      this[i] = t[i];
  }
}
nt.NAME = s0;
nt.VALUE = o0;
class Ov {
  static toTextObject(e) {
    const t = new nt("Algorithm Identifier", {}, Bn.toString(e.algorithm));
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
  [pa]: "sha1",
  [qp]: "sha224",
  [ya]: "sha256",
  [ga]: "sha384",
  [va]: "sha512",
  [gi]: "rsaEncryption",
  [fa]: "sha1WithRSAEncryption",
  [cv]: "sha224WithRSAEncryption",
  [Jl]: "sha256WithRSAEncryption",
  [ha]: "sha384WithRSAEncryption",
  [da]: "sha512WithRSAEncryption",
  [Vs]: "ecPublicKey",
  [ff]: "ecdsaWithSHA1",
  [Fp]: "ecdsaWithSHA224",
  [hf]: "ecdsaWithSHA256",
  [df]: "ecdsaWithSHA384",
  [pf]: "ecdsaWithSHA512",
  [qg]: "TLS WWW server authentication",
  [Kg]: "TLS WWW client authentication",
  [Zg]: "Code Signing",
  [Wg]: "E-mail Protection",
  [Yg]: "Time Stamping",
  [Jg]: "OCSP Signing",
  [Zl]: "Signed Data"
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
    const o = e[nt.VALUE];
    o && (s = ` ${o}`), n.push(`${i}${e[nt.NAME]}:${s}`), i = this.pad(t);
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
          m[nt.NAME] = c, n.push(...this.serializeObj(m, t));
      else if (u instanceof nt)
        u[nt.NAME] = c, n.push(...this.serializeObj(u, t));
      else if (Y.isBufferSource(u))
        c ? (n.push(`${i}${h}`), n.push(...this.serializeBufferSource(u, t + 1))) : n.push(...this.serializeBufferSource(u, t));
      else if ("toTextObject" in u) {
        const m = u.toTextObject();
        m[nt.NAME] = c, n.push(...this.serializeObj(m, t));
      } else
        throw new TypeError("Cannot serialize data in text format. Unsupported type.");
    }
    return n;
  }
  static serializeBufferSource(e, t = 0) {
    const n = this.pad(t), i = Y.toUint8Array(e), s = [];
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
Gn.algorithmSerializer = Ov;
class Jn {
  constructor(...e) {
    if (e.length === 1) {
      const t = e[0];
      this.rawData = K.serialize(t), this.onInit(t);
    } else {
      const t = K.parse(e[0], e[1]);
      this.rawData = Y.toArrayBuffer(e[0]), this.onInit(t);
    }
  }
  equal(e) {
    return e instanceof Jn ? Fo(e.rawData, this.rawData) : !1;
  }
  toString(e = "text") {
    switch (e) {
      case "asn":
        return K.toString(this.rawData);
      case "text":
        return Gn.serialize(this.toTextObject());
      case "hex":
        return de.ToHex(this.rawData);
      case "base64":
        return de.ToBase64(this.rawData);
      case "base64url":
        return de.ToBase64Url(this.rawData);
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
    return new nt(this.getTextName(), {}, e);
  }
}
Jn.NAME = "ASN";
class jr extends Jn {
  constructor(...e) {
    let t;
    Y.isBufferSource(e[0]) ? t = Y.toArrayBuffer(e[0]) : t = K.serialize(new Hr({
      extnID: e[0],
      critical: e[1],
      extnValue: new it(Y.toArrayBuffer(e[2]))
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
    return e[nt.NAME] === jr.NAME && (e[nt.NAME] = Bn.toString(this.type)), e;
  }
}
var a0;
class Dn {
  static isCryptoKeyPair(e) {
    return e && e.privateKey && e.publicKey;
  }
  static isCryptoKey(e) {
    return e && e.usages && e.type && e.algorithm && e.extractable !== void 0;
  }
  constructor() {
    this.items = /* @__PURE__ */ new Map(), this[a0] = "CryptoProvider", typeof self < "u" && typeof crypto < "u" ? this.set(Dn.DEFAULT, crypto) : typeof global < "u" && global.crypto && global.crypto.subtle && this.set(Dn.DEFAULT, global.crypto);
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
a0 = Symbol.toStringTag;
Dn.DEFAULT = "default";
const Zt = new Dn(), Tv = /^[0-2](?:\.[1-9][0-9]*)+$/;
function Nv(r) {
  return new RegExp(Tv).test(r);
}
class c0 {
  constructor(e = {}) {
    this.items = {};
    for (const t in e)
      this.register(t, e[t]);
  }
  get(e) {
    return this.items[e] || null;
  }
  findId(e) {
    return Nv(e) ? e : this.get(e);
  }
  register(e, t) {
    this.items[e] = t, this.items[t] = e;
  }
}
const mr = new c0();
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
function Pv(r, e) {
  return `\\${de.ToHex(de.FromUtf8String(e)).toUpperCase()}`;
}
function jv(r) {
  return r.replace(/([,+"\\<>;])/g, "\\$1").replace(/^([ #])/, "\\$1").replace(/([ ]$)/, "\\$1").replace(/([\r\n\t])/, Pv);
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
    this.extraNames = new c0(), this.asn = new Ht();
    for (const n in t)
      if (Object.prototype.hasOwnProperty.call(t, n)) {
        const i = t[n];
        this.extraNames.register(n, i);
      }
    typeof e == "string" ? this.asn = this.fromString(e) : e instanceof Ht ? this.asn = e : Y.isBufferSource(e) ? this.asn = K.parse(e, Ht) : this.asn = this.fromJSON(e);
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
      const n = this.getName(t.type) || t.type, i = t.value.anyValue ? `#${de.ToHex(t.value.anyValue)}` : jv(t.value.toString());
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
        (e = i[o]) !== null && e !== void 0 || (i[o] = []), i[o].push(s.value.anyValue ? `#${de.ToHex(s.value.anyValue)}` : s.value.toString());
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
      s === "+" ? t[t.length - 1].push(m) : t.push(new Li([m])), s = h;
    }
    return t;
  }
  fromJSON(e) {
    const t = new Ht();
    for (const n of e) {
      const i = new Li();
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
    const n = new sc({ type: e });
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
      n.value.anyValue = de.FromHex(t.slice(1));
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
    return K.serialize(this.asn);
  }
  async getThumbprint(...e) {
    var t;
    let n, i = "SHA-1";
    return e.length >= 1 && !(!((t = e[0]) === null || t === void 0) && t.subtle) ? (i = e[0] || i, n = e[1] || Zt.get()) : n = e[0] || Zt.get(), await n.subtle.digest(i, this.toArrayBuffer());
  }
}
const l0 = "Cannot initialize GeneralName from ASN.1 data.", Xh = `${l0} Unsupported string format in use.`, Rv = `${l0} Value doesn't match to GUID regular expression.`, Qh = /^([0-9a-f]{8})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{12})$/i, ed = "1.3.6.1.4.1.311.25.1", td = "1.3.6.1.4.1.311.20.2.3", Fc = "dns", zc = "dn", Gc = "email", qc = "ip", Kc = "url", Zc = "guid", Wc = "upn", To = "id";
class $n extends Jn {
  constructor(...e) {
    let t;
    if (e.length === 2)
      switch (e[0]) {
        case zc: {
          const n = new Hn(e[1]).toArrayBuffer(), i = K.parse(n, Ht);
          t = new $e({ directoryName: i });
          break;
        }
        case Fc:
          t = new $e({ dNSName: e[1] });
          break;
        case Gc:
          t = new $e({ rfc822Name: e[1] });
          break;
        case Zc: {
          const n = new RegExp(Qh, "i").exec(e[1]);
          if (!n)
            throw new Error("Cannot parse GUID value. Value doesn't match to regular expression");
          const i = n.slice(1).map((s, o) => o < 3 ? de.ToHex(new Uint8Array(de.FromHex(s)).reverse()) : s).join("");
          t = new $e({
            otherName: new Us({
              typeId: ed,
              value: K.serialize(new it(de.FromHex(i)))
            })
          });
          break;
        }
        case qc:
          t = new $e({ iPAddress: e[1] });
          break;
        case To:
          t = new $e({ registeredID: e[1] });
          break;
        case Wc: {
          t = new $e({
            otherName: new Us({
              typeId: td,
              value: K.serialize(kp.toASN(e[1]))
            })
          });
          break;
        }
        case Kc:
          t = new $e({ uniformResourceIdentifier: e[1] });
          break;
        default:
          throw new Error("Cannot create GeneralName. Unsupported type of the name");
      }
    else Y.isBufferSource(e[0]) ? t = K.parse(e[0], $e) : t = e[0];
    super(t);
  }
  onInit(e) {
    if (e.dNSName != null)
      this.type = Fc, this.value = e.dNSName;
    else if (e.rfc822Name != null)
      this.type = Gc, this.value = e.rfc822Name;
    else if (e.iPAddress != null)
      this.type = qc, this.value = e.iPAddress;
    else if (e.uniformResourceIdentifier != null)
      this.type = Kc, this.value = e.uniformResourceIdentifier;
    else if (e.registeredID != null)
      this.type = To, this.value = e.registeredID;
    else if (e.directoryName != null)
      this.type = zc, this.value = new Hn(e.directoryName).toString();
    else if (e.otherName != null)
      if (e.otherName.typeId === ed) {
        this.type = Zc;
        const t = K.parse(e.otherName.value, it), n = new RegExp(Qh, "i").exec(de.ToHex(t));
        if (!n)
          throw new Error(Rv);
        this.value = n.slice(1).map((i, s) => s < 3 ? de.ToHex(new Uint8Array(de.FromHex(i)).reverse()) : i).join("-");
      } else if (e.otherName.typeId === td)
        this.type = Wc, this.value = K.parse(e.otherName.value, Xt).toString();
      else
        throw new Error(Xh);
    else
      throw new Error(Xh);
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
      case zc:
      case Fc:
      case Zc:
      case qc:
      case To:
      case Wc:
      case Kc:
        e = this.type.toUpperCase();
        break;
      case Gc:
        e = "Email";
        break;
      default:
        throw new Error("Unsupported GeneralName type");
    }
    let t = this.value;
    return this.type === To && (t = Bn.toString(t)), new nt(e, void 0, t);
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
        if (i instanceof $e)
          n.push(i);
        else {
          const s = K.parse(new $n(i.type, i.value).rawData, $e);
          n.push(s);
        }
      t = new cr(n);
    } else if (Y.isBufferSource(e))
      t = K.parse(e, cr);
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
      let i = e[n[nt.NAME]];
      Array.isArray(i) || (i = [], e[n[nt.NAME]] = i), i.push(n);
    }
    return e;
  }
}
zs.NAME = "GeneralNames";
const Ps = "-{5}", Gs = "\\n", Uv = `[^${Gs}]+`, Dv = `${Ps}BEGIN (${Uv}(?=${Ps}))${Ps}`, $v = `${Ps}END \\1${Ps}`, Ji = "\\n", Mv = `[^:${Gs}]+`, Vv = `(?:[^${Gs}]+${Ji}(?: +[^${Gs}]+${Ji})*)`, Lv = "[a-zA-Z0-9=+/]+", Hv = `(?:${Lv}${Ji})+`, rd = `${Dv}${Ji}(?:((?:${Mv}: ${Vv})+))?${Ji}?(${Hv})${$v}`;
class gr {
  static isPem(e) {
    return typeof e == "string" && new RegExp(rd, "g").test(e);
  }
  static decodeWithHeaders(e) {
    e = e.replace(/\r/g, "");
    const t = new RegExp(rd, "g"), n = [];
    let i = null;
    for (; i = t.exec(e); ) {
      const s = i[3].replace(new RegExp(`[${Gs}]+`, "g"), ""), o = {
        type: i[1],
        headers: [],
        rawData: de.FromBase64(s)
      }, c = i[2];
      if (c) {
        const u = c.split(new RegExp(Ji, "g"));
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
        if (!Y.isBufferSource(i))
          throw new TypeError("Cannot encode array of BufferSource in PEM format. Not all items of the array are BufferSource");
        n.push(this.encodeStruct({
          type: t,
          rawData: Y.toArrayBuffer(i)
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
        rawData: Y.toArrayBuffer(e)
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
    const s = de.ToBase64(e.rawData);
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
    return Y.isBufferSource(e) || typeof e == "string";
  }
  static toArrayBuffer(e) {
    if (typeof e == "string") {
      if (gr.isPem(e))
        return gr.decode(e)[0];
      if (de.isHex(e))
        return de.FromHex(e);
      if (de.isBase64(e))
        return de.FromBase64(e);
      if (de.isBase64Url(e))
        return de.FromBase64Url(e);
      throw new TypeError("Unsupported format of 'raw' argument. Must be one of DER, PEM, HEX, Base64, or Base4Url");
    } else {
      const t = de.ToBinary(e);
      return gr.isPem(t) ? gr.decode(t)[0] : de.isHex(t) ? de.FromHex(t) : de.isBase64(t) ? de.FromBase64(t) : de.isBase64Url(t) ? de.FromBase64Url(t) : Y.toArrayBuffer(e);
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
      if (Y.isBufferSource(e))
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
    const o = K.parse(this.rawData, rn);
    return o.algorithm.algorithm === Ns && (s = Fv(o, s)), t.subtle.importKey("spki", s, i, !0, n);
  }
  onInit(e) {
    const t = lr.resolve(Yi), n = this.algorithm = t.toWebAlgorithm(e.algorithm);
    switch (e.algorithm.algorithm) {
      case gi: {
        const i = K.parse(e.subjectPublicKey, yf), s = Y.toUint8Array(i.modulus);
        n.publicExponent = Y.toUint8Array(i.publicExponent), n.modulusLength = (s[0] ? s : s.slice(1)).byteLength << 3;
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
    const i = K.parse(this.rawData, rn);
    return await t.subtle.digest(n, i.subjectPublicKey);
  }
  toTextObject() {
    const e = this.toTextObjectEmpty(), t = K.parse(this.rawData, rn);
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
function Fv(r, e) {
  return r.algorithm = new oe({
    algorithm: gi,
    parameters: null
  }), e = K.serialize(r), e;
}
class qs extends jr {
  static async create(e, t = !1, n = Zt.get()) {
    if ("name" in e && "serialNumber" in e)
      return new qs(e, t);
    const s = await (await sn.create(e, n)).getKeyIdentifier(n);
    return new qs(de.ToHex(s), t);
  }
  constructor(...e) {
    if (Y.isBufferSource(e[0]))
      super(e[0]);
    else if (typeof e[0] == "string") {
      const t = new ni({ keyIdentifier: new Ku(de.FromHex(e[0])) });
      super(Ko, e[1], K.serialize(t));
    } else {
      const t = e[0], n = t.name instanceof zs ? K.parse(t.name.rawData, cr) : t.name, i = new ni({
        authorityCertIssuer: n,
        authorityCertSerialNumber: de.FromHex(t.serialNumber)
      });
      super(Ko, e[1], K.serialize(i));
    }
  }
  onInit(e) {
    super.onInit(e);
    const t = K.parse(e.extnValue, ni);
    t.keyIdentifier && (this.keyId = de.ToHex(t.keyIdentifier)), (t.authorityCertIssuer || t.authorityCertSerialNumber) && (this.certId = {
      name: t.authorityCertIssuer || [],
      serialNumber: t.authorityCertSerialNumber ? de.ToHex(t.authorityCertSerialNumber) : ""
    });
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue(), t = K.parse(this.value, ni);
    return t.authorityCertIssuer && (e["Authority Issuer"] = new zs(t.authorityCertIssuer).toTextObject()), t.authorityCertSerialNumber && (e["Authority Serial Number"] = t.authorityCertSerialNumber), t.keyIdentifier && (e[""] = t.keyIdentifier), e;
  }
}
qs.NAME = "Authority Key Identifier";
class u0 extends jr {
  constructor(...e) {
    if (Y.isBufferSource(e[0])) {
      super(e[0]);
      const t = K.parse(this.value, Zo);
      this.ca = t.cA, this.pathLength = t.pathLenConstraint;
    } else {
      const t = new Zo({
        cA: e[0],
        pathLenConstraint: e[1]
      });
      super(Op, e[2], K.serialize(t)), this.ca = e[0], this.pathLength = e[1];
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return this.ca && (e.CA = this.ca), this.pathLength !== void 0 && (e["Path Length"] = this.pathLength), e;
  }
}
u0.NAME = "Basic Constraints";
var nd;
(function(r) {
  r.serverAuth = "1.3.6.1.5.5.7.3.1", r.clientAuth = "1.3.6.1.5.5.7.3.2", r.codeSigning = "1.3.6.1.5.5.7.3.3", r.emailProtection = "1.3.6.1.5.5.7.3.4", r.timeStamping = "1.3.6.1.5.5.7.3.8", r.ocspSigning = "1.3.6.1.5.5.7.3.9";
})(nd || (nd = {}));
class f0 extends jr {
  constructor(...e) {
    if (Y.isBufferSource(e[0])) {
      super(e[0]);
      const t = K.parse(this.value, Xo);
      this.usages = t.map((n) => n);
    } else {
      const t = new Xo(e[0]);
      super(Pp, e[1], K.serialize(t)), this.usages = e[0];
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return e[""] = this.usages.map((t) => Bn.toString(t)).join(", "), e;
  }
}
f0.NAME = "Extended Key Usages";
var id;
(function(r) {
  r[r.digitalSignature = 1] = "digitalSignature", r[r.nonRepudiation = 2] = "nonRepudiation", r[r.keyEncipherment = 4] = "keyEncipherment", r[r.dataEncipherment = 8] = "dataEncipherment", r[r.keyAgreement = 16] = "keyAgreement", r[r.keyCertSign = 32] = "keyCertSign", r[r.cRLSign = 64] = "cRLSign", r[r.encipherOnly = 128] = "encipherOnly", r[r.decipherOnly = 256] = "decipherOnly";
})(id || (id = {}));
class h0 extends jr {
  constructor(...e) {
    if (Y.isBufferSource(e[0])) {
      super(e[0]);
      const t = K.parse(this.value, Hc);
      this.usages = t.toNumber();
    } else {
      const t = new Hc(e[0]);
      super(jp, e[1], K.serialize(t)), this.usages = e[0];
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue(), t = K.parse(this.value, Hc);
    return e[""] = t.toJSON().join(", "), e;
  }
}
h0.NAME = "Key Usages";
class Tc extends jr {
  static async create(e, t = !1, n = Zt.get()) {
    const s = await (await sn.create(e, n)).getKeyIdentifier(n);
    return new Tc(de.ToHex(s), t);
  }
  constructor(...e) {
    if (Y.isBufferSource(e[0])) {
      super(e[0]);
      const t = K.parse(this.value, Ln);
      this.keyId = de.ToHex(t);
    } else {
      const t = typeof e[0] == "string" ? de.FromHex(e[0]) : e[0], n = new Ln(t);
      super(Qu, e[1], K.serialize(n)), this.keyId = de.ToHex(t);
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue(), t = K.parse(this.value, Ln);
    return e[""] = t, e;
  }
}
Tc.NAME = "Subject Key Identifier";
class d0 extends jr {
  constructor(...e) {
    Y.isBufferSource(e[0]) ? super(e[0]) : super(Xu, e[1], new zs(e[0] || []).rawData);
  }
  onInit(e) {
    super.onInit(e);
    const t = K.parse(e.extnValue, Bl);
    this.names = new zs(t);
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue(), t = this.names.toTextObject();
    for (const n in t)
      e[n] = t[n];
    return e;
  }
}
d0.NAME = "Subject Alternative Name";
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
class p0 extends jr {
  constructor(...e) {
    var t;
    if (Y.isBufferSource(e[0])) {
      super(e[0]);
      const n = K.parse(this.value, Yo);
      this.policies = n.map((i) => i.policyIdentifier);
    } else {
      const n = e[0], i = (t = e[1]) !== null && t !== void 0 ? t : !1, s = new Yo(n.map((o) => new ac({
        policyIdentifier: o
      })));
      super(Tp, i, K.serialize(s)), this.policies = n;
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return e.Policy = this.policies.map((t) => new nt("", {}, Bn.toString(t))), e;
  }
}
p0.NAME = "Certificate Policies";
Rr.register(Tp, p0);
class y0 extends jr {
  constructor(...e) {
    var t;
    if (Y.isBufferSource(e[0]))
      super(e[0]);
    else if (Array.isArray(e[0]) && typeof e[0][0] == "string") {
      const i = e[0].map((o) => new ss({
        distributionPoint: new fi({
          fullName: [new $e({ uniformResourceIdentifier: o })]
        })
      })), s = new Di(i);
      super(wl, e[1], K.serialize(s));
    } else {
      const n = new Di(e[0]);
      super(wl, e[1], K.serialize(n));
    }
    (t = this.distributionPoints) !== null && t !== void 0 || (this.distributionPoints = []);
  }
  onInit(e) {
    super.onInit(e);
    const t = K.parse(e.extnValue, Di);
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
y0.NAME = "CRL Distribution Points";
class g0 extends jr {
  constructor(...e) {
    var t, n, i, s;
    if (Y.isBufferSource(e[0]))
      super(e[0]);
    else if (e[0] instanceof ji) {
      const o = new ji(e[0]);
      super(pl, e[1], K.serialize(o));
    } else {
      const o = e[0], c = new ji();
      Po(c, o, Vf, "ocsp"), Po(c, o, Lf, "caIssuers"), Po(c, o, Hf, "timeStamping"), Po(c, o, Ff, "caRepository"), super(pl, e[1], K.serialize(c));
    }
    (t = this.ocsp) !== null && t !== void 0 || (this.ocsp = []), (n = this.caIssuers) !== null && n !== void 0 || (this.caIssuers = []), (i = this.timeStamping) !== null && i !== void 0 || (this.timeStamping = []), (s = this.caRepository) !== null && s !== void 0 || (this.caRepository = []);
  }
  onInit(e) {
    super.onInit(e), this.ocsp = [], this.caIssuers = [], this.timeStamping = [], this.caRepository = [], K.parse(e.extnValue, ji).forEach((n) => {
      switch (n.accessMethod) {
        case Vf:
          this.ocsp.push(new $n(n.accessLocation));
          break;
        case Lf:
          this.caIssuers.push(new $n(n.accessLocation));
          break;
        case Hf:
          this.timeStamping.push(new $n(n.accessLocation));
          break;
        case Ff:
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
g0.NAME = "Authority Info Access";
function No(r, e, t) {
  if (t.length === 1)
    r[e] = t[0].toTextObject();
  else {
    const n = new nt("");
    t.forEach((i, s) => {
      const o = i.toTextObject(), c = `${o[nt.NAME]} ${s + 1}`;
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
      accessLocation: K.parse(o.rawData, $e)
    }));
  });
}
class us extends Jn {
  constructor(...e) {
    let t;
    if (Y.isBufferSource(e[0]))
      t = Y.toArrayBuffer(e[0]);
    else {
      const n = e[0], i = Array.isArray(e[1]) ? e[1].map((s) => Y.toArrayBuffer(s)) : [];
      t = K.serialize(new Sn({ type: n, values: i }));
    }
    super(t, Sn);
  }
  onInit(e) {
    this.type = e.type, this.values = e.values;
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return e.Value = this.values.map((t) => new nt("", { "": t })), e;
  }
  toTextObjectWithoutValue() {
    const e = this.toTextObjectEmpty();
    return e[nt.NAME] === us.NAME && (e[nt.NAME] = Bn.toString(this.type)), e;
  }
}
us.NAME = "Attribute";
class v0 extends us {
  constructor(...e) {
    var t;
    if (Y.isBufferSource(e[0]))
      super(e[0]);
    else {
      const n = new xa({
        printableString: e[0]
      });
      super(i0, [K.serialize(n)]);
    }
    (t = this.password) !== null && t !== void 0 || (this.password = "");
  }
  onInit(e) {
    if (super.onInit(e), this.values[0]) {
      const t = K.parse(this.values[0], xa);
      this.password = t.toString();
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue();
    return e[nt.VALUE] = this.password, e;
  }
}
v0.NAME = "Challenge Password";
class wf extends us {
  constructor(...e) {
    var t;
    if (Y.isBufferSource(e[0]))
      super(e[0]);
    else {
      const n = e[0], i = new hi();
      for (const s of n)
        i.push(K.parse(s.rawData, Hr));
      super(mf, [K.serialize(i)]);
    }
    (t = this.items) !== null && t !== void 0 || (this.items = []);
  }
  onInit(e) {
    if (super.onInit(e), this.values[0]) {
      const t = K.parse(this.values[0], hi);
      this.items = t.map((n) => Rr.create(K.serialize(n)));
    }
  }
  toTextObject() {
    const e = this.toTextObjectWithoutValue(), t = this.items.map((n) => n.toTextObject());
    for (const n of t)
      e[n[nt.NAME]] = n;
    return e;
  }
}
wf.NAME = "Extensions";
class Nc {
  static register(e, t) {
    this.items.set(e, t);
  }
  static create(e) {
    const t = new us(e), n = this.items.get(t.type);
    return n ? new n(e) : t;
  }
}
Nc.items = /* @__PURE__ */ new Map();
const Pc = "crypto.signatureFormatter";
class zv {
  toAsnSignature(e, t) {
    return Y.toArrayBuffer(t);
  }
  toWebSignature(e, t) {
    return Y.toArrayBuffer(t);
  }
}
var Mo;
let bu = Mo = class {
  static createPssParams(e, t) {
    const n = Mo.getHashAlgorithm(e);
    return n ? new mi({
      hashAlgorithm: n,
      maskGenAlgorithm: new oe({
        algorithm: Ac,
        parameters: K.serialize(n)
      }),
      saltLength: t
    }) : null;
  }
  static getHashAlgorithm(e) {
    const t = lr.resolve(Yi);
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
              return new oe({ algorithm: fa, parameters: null });
            case "sha-256":
              return new oe({ algorithm: Jl, parameters: null });
            case "sha-384":
              return new oe({ algorithm: ha, parameters: null });
            case "sha-512":
              return new oe({ algorithm: da, parameters: null });
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
          return new oe({ algorithm: Ns, parameters: K.serialize(t) });
        } else
          return new oe({ algorithm: Ns, parameters: null });
    }
    return null;
  }
  toWebAlgorithm(e) {
    switch (e.algorithm) {
      case gi:
        return { name: "RSASSA-PKCS1-v1_5" };
      case fa:
        return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-1" } };
      case Jl:
        return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } };
      case ha:
        return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-384" } };
      case da:
        return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-512" } };
      case Ns:
        if (e.parameters) {
          const t = K.parse(e.parameters, mi);
          return {
            name: "RSA-PSS",
            hash: lr.resolve(Yi).toWebAlgorithm(t.hashAlgorithm),
            saltLength: t.saltLength
          };
        } else
          return { name: "RSA-PSS" };
    }
    return null;
  }
};
bu = Mo = f([
  Ic()
], bu);
lr.registerSingleton(Eo, bu);
let xu = class {
  toAsnAlgorithm(e) {
    switch (e.name.toLowerCase()) {
      case "sha-1":
        return new oe({ algorithm: pa });
      case "sha-256":
        return new oe({ algorithm: ya });
      case "sha-384":
        return new oe({ algorithm: ga });
      case "sha-512":
        return new oe({ algorithm: va });
    }
    return null;
  }
  toWebAlgorithm(e) {
    switch (e.algorithm) {
      case pa:
        return { name: "SHA-1" };
      case ya:
        return { name: "SHA-256" };
      case ga:
        return { name: "SHA-384" };
      case va:
        return { name: "SHA-512" };
    }
    return null;
  }
};
xu = f([
  Ic()
], xu);
lr.registerSingleton(Eo, xu);
class Tr {
  addPadding(e, t) {
    const n = Y.toUint8Array(t), i = new Uint8Array(e);
    return i.set(n, e - n.length), i;
  }
  removePadding(e, t = !1) {
    let n = Y.toUint8Array(e);
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
      const n = e.namedCurve, i = Tr.namedCurveSize.get(n) || Tr.defaultNamedCurveSize, s = new ua(), o = Y.toUint8Array(t);
      return s.r = this.removePadding(o.slice(0, i), !0), s.s = this.removePadding(o.slice(i, i + i), !0), K.serialize(s);
    }
    return null;
  }
  toWebSignature(e, t) {
    if (e.name === "ECDSA") {
      const n = K.parse(t, ua), i = e.namedCurve, s = Tr.namedCurveSize.get(i) || Tr.defaultNamedCurveSize, o = this.addPadding(s, this.removePadding(n.r)), c = this.addPadding(s, this.removePadding(n.s));
      return ng(o, c);
    }
    return null;
  }
}
Tr.namedCurveSize = /* @__PURE__ */ new Map();
Tr.defaultNamedCurveSize = 32;
const Yc = "1.3.101.110", sd = "1.3.101.111", Jc = "1.3.101.112", od = "1.3.101.113";
let Au = class {
  toAsnAlgorithm(e) {
    let t = null;
    switch (e.name.toLowerCase()) {
      case "ed25519":
        t = Jc;
        break;
      case "x25519":
        t = Yc;
        break;
      case "eddsa":
        switch (e.namedCurve.toLowerCase()) {
          case "ed25519":
            t = Jc;
            break;
          case "ed448":
            t = od;
            break;
        }
        break;
      case "ecdh-es":
        switch (e.namedCurve.toLowerCase()) {
          case "x25519":
            t = Yc;
            break;
          case "x448":
            t = sd;
            break;
        }
    }
    return t ? new oe({
      algorithm: t
    }) : null;
  }
  toWebAlgorithm(e) {
    switch (e.algorithm) {
      case Jc:
        return { name: "Ed25519" };
      case od:
        return { name: "EdDSA", namedCurve: "Ed448" };
      case Yc:
        return { name: "X25519" };
      case sd:
        return { name: "ECDH-ES", namedCurve: "X448" };
    }
    return null;
  }
};
Au = f([
  Ic()
], Au);
lr.registerSingleton(Eo, Au);
class Gv extends Fr {
  constructor(e) {
    Fr.isAsnEncoded(e) ? super(e, Hs) : super(e), this.tag = gr.CertificateRequestTag;
  }
  onInit(e) {
    this.tbs = K.serialize(e.certificationRequestInfo), this.publicKey = new sn(e.certificationRequestInfo.subjectPKInfo);
    const t = lr.resolve(Yi);
    this.signatureAlgorithm = t.toWebAlgorithm(e.signatureAlgorithm), this.signature = e.signature, this.attributes = e.certificationRequestInfo.attributes.map((i) => Nc.create(K.serialize(i)));
    const n = this.getAttribute(mf);
    this.extensions = [], n instanceof wf && (this.extensions = n.items), this.subjectName = new Hn(e.certificationRequestInfo.subject), this.subject = this.subjectName.toString();
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
    const t = { ...this.publicKey.algorithm, ...this.signatureAlgorithm }, n = await this.publicKey.export(t, ["verify"], e), i = lr.resolveAll(Pc).reverse();
    let s = null;
    for (const c of i)
      if (s = c.toWebSignature(t, this.signature), s)
        break;
    if (!s)
      throw Error("Cannot convert WebCrypto signature value to ASN.1 format");
    return await e.subtle.verify(this.signatureAlgorithm, n, s, this.tbs);
  }
  toTextObject() {
    const e = this.toTextObjectEmpty(), t = K.parse(this.rawData, Hs), n = t.certificationRequestInfo, i = new nt("", {
      Version: `${Hi[n.version]} (${n.version})`,
      Subject: this.subject,
      "Subject Public Key Info": this.publicKey
    });
    if (this.attributes.length) {
      const s = new nt("");
      for (const o of this.attributes) {
        const c = o.toTextObject();
        s[c[nt.NAME]] = c;
      }
      i.Attributes = s;
    }
    return e.Data = i, e.Signature = new nt("", {
      Algorithm: Gn.serializeAlgorithm(t.signatureAlgorithm),
      "": t.signature
    }), e;
  }
}
Gv.NAME = "PKCS#10 Certificate Request";
class wi extends Fr {
  constructor(e) {
    Fr.isAsnEncoded(e) ? super(e, di) : super(e), this.tag = gr.CertificateTag;
  }
  onInit(e) {
    const t = e.tbsCertificate;
    this.tbs = K.serialize(t), this.serialNumber = de.ToHex(t.serialNumber), this.subjectName = new Hn(t.subject), this.subject = new Hn(t.subject).toString(), this.issuerName = new Hn(t.issuer), this.issuer = this.issuerName.toString();
    const n = lr.resolve(Yi);
    this.signatureAlgorithm = n.toWebAlgorithm(e.signatureAlgorithm), this.signature = e.signatureValue;
    const i = t.validity.notBefore.utcTime || t.validity.notBefore.generalTime;
    if (!i)
      throw new Error("Cannot get 'notBefore' value");
    this.notBefore = i;
    const s = t.validity.notAfter.utcTime || t.validity.notAfter.generalTime;
    if (!s)
      throw new Error("Cannot get 'notAfter' value");
    this.notAfter = s, this.extensions = [], t.extensions && (this.extensions = t.extensions.map((o) => Rr.create(K.serialize(o)))), this.publicKey = new sn(t.subjectPublicKeyInfo);
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
      else if (Y.isBufferSource(s)) {
        const h = new sn(s);
        n = { ...h.algorithm, ...this.signatureAlgorithm }, i = await h.export(n, ["verify"], t);
      } else
        n = { ...s.algorithm, ...this.signatureAlgorithm }, i = s;
    } catch {
      return !1;
    }
    const o = lr.resolveAll(Pc).reverse();
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
    const e = this.toTextObjectEmpty(), t = K.parse(this.rawData, di), n = t.tbsCertificate, i = new nt("", {
      Version: `${Hi[n.version]} (${n.version})`,
      "Serial Number": n.serialNumber,
      "Signature Algorithm": Gn.serializeAlgorithm(n.signature),
      Issuer: this.issuer,
      Validity: new nt("", {
        "Not Before": n.validity.notBefore.getTime(),
        "Not After": n.validity.notAfter.getTime()
      }),
      Subject: this.subject,
      "Subject Public Key Info": this.publicKey
    });
    if (n.issuerUniqueID && (i["Issuer Unique ID"] = n.issuerUniqueID), n.subjectUniqueID && (i["Subject Unique ID"] = n.subjectUniqueID), this.extensions.length) {
      const s = new nt("");
      for (const o of this.extensions) {
        const c = o.toTextObject();
        s[c[nt.NAME]] = c;
      }
      i.Extensions = s;
    }
    return e.Data = i, e.Signature = new nt("", {
      Algorithm: Gn.serializeAlgorithm(t.signatureAlgorithm),
      "": t.signatureValue
    }), e;
  }
}
wi.NAME = "Certificate";
class qv extends Array {
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
    t.version = 1, t.encapContentInfo.eContentType = Xg, t.encapContentInfo.eContent = new qi({
      single: new it()
    }), t.certificates = new $s(this.map((s) => new pi({
      certificate: K.parse(s.rawData, di)
    })));
    const n = new bn({
      contentType: Zl,
      content: K.serialize(t)
    }), i = K.serialize(n);
    return e === "raw" ? i : this.toString(e);
  }
  import(e) {
    const t = Fr.toArrayBuffer(e), n = K.parse(t, bn);
    if (n.contentType !== Zl)
      throw new TypeError("Cannot parse CMS package. Incoming data is not a SignedData object.");
    const i = K.parse(n.content, xn);
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
        return K.toString(t);
      case "hex":
        return de.ToHex(t);
      case "base64":
        return de.ToBase64(t);
      case "base64url":
        return de.ToBase64Url(t);
      case "text":
        return Gn.serialize(this.toTextObject());
      default:
        throw TypeError("Argument 'format' is unsupported value");
    }
  }
  toTextObject() {
    const e = K.parse(this.export("raw"), bn), t = K.parse(e.content, xn);
    return new nt("X509Certificates", {
      "Content Type": Bn.toString(e.contentType),
      Content: new nt("", {
        Version: `${an[t.version]} (${t.version})`,
        Certificates: new nt("", { Certificate: this.map((i) => i.toTextObject()) })
      })
    });
  }
}
class Kv {
  constructor(e = {}) {
    this.certificates = [], e.certificates && (this.certificates = e.certificates);
  }
  async build(e, t = Zt.get()) {
    const n = new qv(e);
    let i = e;
    for (; i = await this.findIssuer(i, t); ) {
      const s = await i.getThumbprint(t);
      for (const o of n) {
        const c = await o.getThumbprint(t);
        if (Fo(s, c))
          throw new Error("Cannot build a certificate chain. Circular dependency.");
      }
      n.push(i);
    }
    return n;
  }
  async findIssuer(e, t = Zt.get()) {
    if (!await e.isSelfSigned(t)) {
      const n = e.getExtension(Ko);
      for (const i of this.certificates)
        if (i.subject === e.issuer) {
          if (n) {
            if (n.keyId) {
              const s = i.getExtension(Qu);
              if (s && s.keyId !== n.keyId)
                continue;
            } else if (n.certId) {
              const s = i.getExtension(Xu);
              if (s && !(n.certId.serialNumber === i.serialNumber && Fo(K.serialize(n.certId.name), K.serialize(s))))
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
var ad;
(function(r) {
  r[r.unspecified = 0] = "unspecified", r[r.keyCompromise = 1] = "keyCompromise", r[r.cACompromise = 2] = "cACompromise", r[r.affiliationChanged = 3] = "affiliationChanged", r[r.superseded = 4] = "superseded", r[r.cessationOfOperation = 5] = "cessationOfOperation", r[r.certificateHold = 6] = "certificateHold", r[r.removeFromCRL = 8] = "removeFromCRL", r[r.privilegeWithdrawn = 9] = "privilegeWithdrawn", r[r.aACompromise = 10] = "aACompromise";
})(ad || (ad = {}));
Rr.register(Op, u0);
Rr.register(Pp, f0);
Rr.register(jp, h0);
Rr.register(Qu, Tc);
Rr.register(Ko, qs);
Rr.register(Xu, d0);
Rr.register(wl, y0);
Rr.register(pl, g0);
Nc.register(i0, v0);
Nc.register(mf, wf);
lr.registerSingleton(Pc, zv);
lr.registerSingleton(Pc, Tr);
Tr.namedCurveSize.set("P-256", 32);
Tr.namedCurveSize.set("K-256", 32);
Tr.namedCurveSize.set("P-384", 48);
Tr.namedCurveSize.set("P-521", 66);
const me = { POS_INT: 0, NEG_INT: 1, BYTE_STRING: 2, UTF8_STRING: 3, ARRAY: 4, MAP: 5, TAG: 6, SIMPLE_FLOAT: 7 }, Et = { DATE_STRING: 0, DATE_EPOCH: 1, POS_BIGINT: 2, NEG_BIGINT: 3, DECIMAL_FRAC: 4, BIGFLOAT: 5, BASE64URL_EXPECTED: 21, BASE64_EXPECTED: 22, BASE16_EXPECTED: 23, CBOR: 24, URI: 32, BASE64URL: 33, BASE64: 34, MIME: 36, SET: 258, JSON: 262, REGEXP: 21066, SELF_DESCRIBED: 55799, INVALID_16: 65535, INVALID_32: 4294967295, INVALID_64: 0xffffffffffffffffn }, bt = { ZERO: 0, ONE: 24, TWO: 25, FOUR: 26, EIGHT: 27, INDEFINITE: 31 }, Mn = { FALSE: 20, TRUE: 21, NULL: 22, UNDEFINED: 23 };
var Es;
let Er = (Es = class {
}, He(Es, "BREAK", Symbol.for("github.com/hildjj/cbor2/break")), He(Es, "ENCODED", Symbol.for("github.com/hildjj/cbor2/cbor-encoded")), He(Es, "LENGTH", Symbol.for("github.com/hildjj/cbor2/length")), Es);
const Sa = { MIN: -(2n ** 63n), MAX: 2n ** 64n - 1n };
var vn, Qr;
let Ye = (vn = class {
  constructor(e, t = void 0) {
    He(this, "tag");
    He(this, "contents");
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
function _a(r) {
  if (r != null && typeof r == "object") return r[Er.ENCODED];
}
function Zv(r) {
  if (r != null && typeof r == "object") return r[Er.LENGTH];
}
function Ks(r, e) {
  Object.defineProperty(r, Er.ENCODED, { configurable: !0, enumerable: !1, value: e });
}
function Is(r, e) {
  const t = Object(r);
  return Ks(t, e), t;
}
function m0(r) {
  let e = Math.ceil(r.length / 2);
  const t = new Uint8Array(e);
  e--;
  for (let n = r.length, i = n - 2; n >= 0; n = i, i -= 2, e--) t[e] = parseInt(r.substring(i, n), 16);
  return t;
}
function Vr(r) {
  return r.reduce((e, t) => e + t.toString(16).padStart(2, "0"), "");
}
function Wv(r) {
  const e = r.reduce((i, s) => i + s.length, 0), t = new Uint8Array(e);
  let n = 0;
  for (const i of r) t.set(i, n), n += i.length;
  return t;
}
function bf(r) {
  const e = atob(r);
  return Uint8Array.from(e, (t) => t.codePointAt(0));
}
const Yv = { "-": "+", _: "/" };
function Jv(r) {
  const e = r.replace(/[_-]/g, (t) => Yv[t]);
  return bf(e.padEnd(Math.ceil(e.length / 4) * 4, "="));
}
function Xv() {
  const r = new Uint8Array(4), e = new Uint32Array(r.buffer);
  return !((e[0] = 1) & r[0]);
}
function cd(r) {
  var t;
  let e = "";
  for (const n of r) {
    const i = (t = n.codePointAt(0)) == null ? void 0 : t.toString(16).padStart(4, "0");
    e && (e += ", "), e += `U+${i}`;
  }
  return e;
}
function w0(r, e) {
  const [t, n, i] = r, [s, o, c] = e, u = Math.min(i.length, c.length);
  for (let h = 0; h < u; h++) {
    const m = i[h] - c[h];
    if (m !== 0) return m;
  }
  return 0;
}
var Rn, qt, pr, Mt, Un, et, Qn, Vo, Su, Jr, Xr;
const Ma = class Ma {
  constructor(e = {}) {
    rr(this, et);
    rr(this, Rn);
    rr(this, qt, []);
    rr(this, pr, null);
    rr(this, Mt, 0);
    rr(this, Un, 0);
    if (kt(this, Rn, { ...Ma.defaultOptions, ...e }), $(this, Rn).chunkSize < 8) throw new RangeError(`Expected size >= 8, got ${$(this, Rn).chunkSize}`);
    De(this, et, Qn).call(this);
  }
  get length() {
    return $(this, Un);
  }
  read() {
    De(this, et, Vo).call(this);
    const e = new Uint8Array($(this, Un));
    let t = 0;
    for (const n of $(this, qt)) e.set(n, t), t += n.length;
    return De(this, et, Qn).call(this), e;
  }
  write(e) {
    const t = e.length;
    t > De(this, et, Su).call(this) ? (De(this, et, Vo).call(this), t > $(this, Rn).chunkSize ? ($(this, qt).push(e), De(this, et, Qn).call(this)) : (De(this, et, Qn).call(this), $(this, qt)[$(this, qt).length - 1].set(e), kt(this, Mt, t))) : ($(this, qt)[$(this, qt).length - 1].set(e, $(this, Mt)), kt(this, Mt, $(this, Mt) + t)), kt(this, Un, $(this, Un) + t);
  }
  writeUint8(e) {
    De(this, et, Jr).call(this, 1), $(this, pr).setUint8($(this, Mt), e), De(this, et, Xr).call(this, 1);
  }
  writeUint16(e, t = !1) {
    De(this, et, Jr).call(this, 2), $(this, pr).setUint16($(this, Mt), e, t), De(this, et, Xr).call(this, 2);
  }
  writeUint32(e, t = !1) {
    De(this, et, Jr).call(this, 4), $(this, pr).setUint32($(this, Mt), e, t), De(this, et, Xr).call(this, 4);
  }
  writeBigUint64(e, t = !1) {
    De(this, et, Jr).call(this, 8), $(this, pr).setBigUint64($(this, Mt), e, t), De(this, et, Xr).call(this, 8);
  }
  writeInt16(e, t = !1) {
    De(this, et, Jr).call(this, 2), $(this, pr).setInt16($(this, Mt), e, t), De(this, et, Xr).call(this, 2);
  }
  writeInt32(e, t = !1) {
    De(this, et, Jr).call(this, 4), $(this, pr).setInt32($(this, Mt), e, t), De(this, et, Xr).call(this, 4);
  }
  writeBigInt64(e, t = !1) {
    De(this, et, Jr).call(this, 8), $(this, pr).setBigInt64($(this, Mt), e, t), De(this, et, Xr).call(this, 8);
  }
  writeFloat32(e, t = !1) {
    De(this, et, Jr).call(this, 4), $(this, pr).setFloat32($(this, Mt), e, t), De(this, et, Xr).call(this, 4);
  }
  writeFloat64(e, t = !1) {
    De(this, et, Jr).call(this, 8), $(this, pr).setFloat64($(this, Mt), e, t), De(this, et, Xr).call(this, 8);
  }
  clear() {
    kt(this, Un, 0), kt(this, qt, []), De(this, et, Qn).call(this);
  }
};
Rn = new WeakMap(), qt = new WeakMap(), pr = new WeakMap(), Mt = new WeakMap(), Un = new WeakMap(), et = new WeakSet(), Qn = function() {
  const e = new Uint8Array($(this, Rn).chunkSize);
  $(this, qt).push(e), kt(this, Mt, 0), kt(this, pr, new DataView(e.buffer, e.byteOffset, e.byteLength));
}, Vo = function() {
  if ($(this, Mt) === 0) {
    $(this, qt).pop();
    return;
  }
  const e = $(this, qt).length - 1;
  $(this, qt)[e] = $(this, qt)[e].subarray(0, $(this, Mt)), kt(this, Mt, 0), kt(this, pr, null);
}, Su = function() {
  const e = $(this, qt).length - 1;
  return $(this, qt)[e].length - $(this, Mt);
}, Jr = function(e) {
  De(this, et, Su).call(this) < e && (De(this, et, Vo).call(this), De(this, et, Qn).call(this));
}, Xr = function(e) {
  kt(this, Mt, $(this, Mt) + e), kt(this, Un, $(this, Un) + e);
}, He(Ma, "defaultOptions", { chunkSize: 4096 });
let Ea = Ma;
function b0(r, e = 0, t = !1) {
  const n = r[e] & 128 ? -1 : 1, i = (r[e] & 124) >> 2, s = (r[e] & 3) << 8 | r[e + 1];
  if (i === 0) {
    if (t && s !== 0) throw new Error(`Unwanted subnormal: ${n * 5960464477539063e-23 * s}`);
    return n * 5960464477539063e-23 * s;
  } else if (i === 31) return s ? NaN : n * (1 / 0);
  return n * 2 ** (i - 25) * (1024 + s);
}
function Qv(r) {
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
function em(r) {
  if (r !== 0) {
    const e = new ArrayBuffer(8), t = new DataView(e);
    t.setFloat64(0, r, !1);
    const n = t.getBigUint64(0, !1);
    if ((n & 0x7ff0000000000000n) === 0n) return n & 0x8000000000000000n ? -0 : 0;
  }
  return r;
}
function tm(r) {
  switch (r.length) {
    case 2:
      b0(r, 0, !0);
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
const ld = me.SIMPLE_FLOAT << 5 | bt.TWO, rm = me.SIMPLE_FLOAT << 5 | bt.FOUR, nm = me.SIMPLE_FLOAT << 5 | bt.EIGHT, im = me.SIMPLE_FLOAT << 5 | Mn.TRUE, sm = me.SIMPLE_FLOAT << 5 | Mn.FALSE, om = me.SIMPLE_FLOAT << 5 | Mn.UNDEFINED, am = me.SIMPLE_FLOAT << 5 | Mn.NULL, cm = new TextEncoder(), lm = { ...Ea.defaultOptions, avoidInts: !1, cde: !1, collapseBigInts: !0, dcbor: !1, float64: !1, flushToZero: !1, forceEndian: null, ignoreOriginalEncoding: !1, largeNegativeAsBigInt: !1, reduceUnsafeNumbers: !1, rejectBigInts: !1, rejectCustomSimples: !1, rejectDuplicateKeys: !1, rejectFloats: !1, rejectUndefined: !1, simplifyNegativeZero: !1, sortKeys: null, stringNormalization: null }, x0 = { cde: !0, ignoreOriginalEncoding: !0, sortKeys: w0 }, um = { ...x0, dcbor: !0, largeNegativeAsBigInt: !0, reduceUnsafeNumbers: !0, rejectCustomSimples: !0, rejectDuplicateKeys: !0, rejectUndefined: !0, simplifyNegativeZero: !0, stringNormalization: "NFC" };
function A0(r) {
  const e = r < 0;
  return typeof r == "bigint" ? [e ? -r - 1n : r, e] : [e ? -r - 1 : r, e];
}
function Xc(r, e, t) {
  if (t.rejectFloats) throw new Error(`Attempt to encode an unwanted floating point number: ${r}`);
  if (isNaN(r)) e.writeUint8(ld), e.writeUint16(32256);
  else if (!t.float64 && Math.fround(r) === r) {
    const n = Qv(r);
    n === null ? (e.writeUint8(rm), e.writeFloat32(r)) : (e.writeUint8(ld), e.writeUint16(n));
  } else e.writeUint8(nm), e.writeFloat64(r);
}
function zr(r, e, t) {
  const [n, i] = A0(r);
  if (i && t) throw new TypeError(`Negative size: ${r}`);
  t ?? (t = i ? me.NEG_INT : me.POS_INT), t <<= 5, n < 24 ? e.writeUint8(t | n) : n <= 255 ? (e.writeUint8(t | bt.ONE), e.writeUint8(n)) : n <= 65535 ? (e.writeUint8(t | bt.TWO), e.writeUint16(n)) : n <= 4294967295 ? (e.writeUint8(t | bt.FOUR), e.writeUint32(n)) : (e.writeUint8(t | bt.EIGHT), e.writeBigUint64(BigInt(n)));
}
function Ia(r, e, t) {
  typeof r == "number" ? zr(r, e, me.TAG) : typeof r == "object" && !t.ignoreOriginalEncoding && Er.ENCODED in r ? e.write(r[Er.ENCODED]) : r <= Number.MAX_SAFE_INTEGER ? zr(Number(r), e, me.TAG) : (e.writeUint8(me.TAG << 5 | bt.EIGHT), e.writeBigUint64(BigInt(r)));
}
function S0(r, e, t) {
  const [n, i] = A0(r);
  if (t.collapseBigInts && (!t.largeNegativeAsBigInt || r >= -0x8000000000000000n)) {
    if (n <= 0xffffffffn) {
      zr(Number(r), e);
      return;
    }
    if (n <= 0xffffffffffffffffn) {
      const h = (i ? me.NEG_INT : me.POS_INT) << 5;
      e.writeUint8(h | bt.EIGHT), e.writeBigUint64(n);
      return;
    }
  }
  if (t.rejectBigInts) throw new Error(`Attempt to encode unwanted bigint: ${r}`);
  const s = i ? Et.NEG_BIGINT : Et.POS_BIGINT, o = n.toString(16), c = o.length % 2 ? "0" : "";
  Ia(s, e, t);
  const u = m0(c + o);
  zr(u.length, e, me.BYTE_STRING), e.write(u);
}
function fm(r, e, t) {
  t.flushToZero && (r = em(r)), Object.is(r, -0) ? t.simplifyNegativeZero ? t.avoidInts ? Xc(0, e, t) : zr(0, e) : Xc(r, e, t) : !t.avoidInts && Number.isSafeInteger(r) ? zr(r, e) : t.reduceUnsafeNumbers && Math.floor(r) === r && r >= Sa.MIN && r <= Sa.MAX ? S0(BigInt(r), e, t) : Xc(r, e, t);
}
function hm(r, e, t) {
  const n = t.stringNormalization ? r.normalize(t.stringNormalization) : r, i = cm.encode(n);
  zr(i.length, e, me.UTF8_STRING), e.write(i);
}
function dm(r, e, t) {
  const n = r;
  xf(n, n.length, me.ARRAY, e, t);
  for (const i of n) ii(i, e, t);
}
function pm(r, e) {
  const t = r;
  zr(t.length, e, me.BYTE_STRING), e.write(t);
}
const _u = /* @__PURE__ */ new Map([[Array, dm], [Uint8Array, pm]]);
function Rt(r, e) {
  const t = _u.get(r);
  return _u.set(r, e), t;
}
function xf(r, e, t, n, i) {
  const s = Zv(r);
  s && !i.ignoreOriginalEncoding ? n.write(s) : zr(e, n, t);
}
function ym(r, e, t) {
  if (r === null) {
    e.writeUint8(am);
    return;
  }
  if (!t.ignoreOriginalEncoding && Er.ENCODED in r) {
    e.write(r[Er.ENCODED]);
    return;
  }
  const n = _u.get(r.constructor);
  if (n) {
    const s = n(r, e, t);
    s && ((typeof s[0] == "bigint" || isFinite(Number(s[0]))) && Ia(s[0], e, t), ii(s[1], e, t));
    return;
  }
  if (typeof r.toCBOR == "function") {
    const s = r.toCBOR(e, t);
    s && ((typeof s[0] == "bigint" || isFinite(Number(s[0]))) && Ia(s[0], e, t), ii(s[1], e, t));
    return;
  }
  if (typeof r.toJSON == "function") {
    ii(r.toJSON(), e, t);
    return;
  }
  const i = Object.entries(r).map((s) => [s[0], s[1], jc(s[0], t)]);
  t.sortKeys && i.sort(t.sortKeys), xf(r, i.length, me.MAP, e, t);
  for (const [s, o, c] of i) e.write(c), ii(o, e, t);
}
function ii(r, e, t) {
  switch (typeof r) {
    case "number":
      fm(r, e, t);
      break;
    case "bigint":
      S0(r, e, t);
      break;
    case "string":
      hm(r, e, t);
      break;
    case "boolean":
      e.writeUint8(r ? im : sm);
      break;
    case "undefined":
      if (t.rejectUndefined) throw new Error("Attempt to encode unwanted undefined.");
      e.writeUint8(om);
      break;
    case "object":
      ym(r, e, t);
      break;
    case "symbol":
      throw new TypeError(`Unknown symbol: ${r.toString()}`);
    default:
      throw new TypeError(`Unknown type: ${typeof r}, ${String(r)}`);
  }
}
function jc(r, e = {}) {
  const t = { ...lm };
  e.dcbor ? Object.assign(t, um) : e.cde && Object.assign(t, x0), Object.assign(t, e);
  const n = new Ea(t);
  return ii(r, n, t), n.read();
}
var _0 = ((r) => (r[r.NEVER = -1] = "NEVER", r[r.PREFERRED = 0] = "PREFERRED", r[r.ALWAYS = 1] = "ALWAYS", r))(_0 || {});
const Tn = class Tn {
  constructor(e) {
    He(this, "value");
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
He(Tn, "KnownSimple", /* @__PURE__ */ new Map([[Mn.FALSE, !1], [Mn.TRUE, !0], [Mn.NULL, null], [Mn.UNDEFINED, void 0]]));
let Zs = Tn;
const gm = new TextDecoder("utf8", { fatal: !0, ignoreBOM: !0 });
var Ar, $r, Kt, kr, Wt, ei, Eu, ks;
const Va = class Va {
  constructor(e, t) {
    rr(this, Wt);
    rr(this, Ar);
    rr(this, $r);
    rr(this, Kt, 0);
    rr(this, kr);
    if (kt(this, kr, { ...Va.defaultOptions, ...t }), typeof e == "string") switch ($(this, kr).encoding) {
      case "hex":
        kt(this, Ar, m0(e));
        break;
      case "base64":
        kt(this, Ar, bf(e));
        break;
      default:
        throw new TypeError(`Encoding not implemented: "${$(this, kr).encoding}"`);
    }
    else kt(this, Ar, e);
    kt(this, $r, new DataView($(this, Ar).buffer, $(this, Ar).byteOffset, $(this, Ar).byteLength));
  }
  toHere(e) {
    return $(this, Ar).subarray(e, $(this, Kt));
  }
  *[Symbol.iterator]() {
    if (yield* De(this, Wt, ei).call(this, 0), $(this, Kt) !== $(this, Ar).length) throw new Error("Extra data in input");
  }
};
Ar = new WeakMap(), $r = new WeakMap(), Kt = new WeakMap(), kr = new WeakMap(), Wt = new WeakSet(), ei = function* (e) {
  if (e++ > $(this, kr).maxDepth) throw new Error(`Maximum depth ${$(this, kr).maxDepth} exceeded`);
  const t = $(this, Kt), n = $(this, $r).getUint8(kf(this, Kt)._++), i = n >> 5, s = n & 31;
  let o = s, c = !1, u = 0;
  switch (s) {
    case bt.ONE:
      if (u = 1, o = $(this, $r).getUint8($(this, Kt)), i === me.SIMPLE_FLOAT) {
        if (o < 32) throw new Error(`Invalid simple encoding in extra byte: ${o}`);
        c = !0;
      } else if ($(this, kr).requirePreferred && o < 24) throw new Error(`Unexpectedly long integer encoding (1) for ${o}`);
      break;
    case bt.TWO:
      if (u = 2, i === me.SIMPLE_FLOAT) o = b0($(this, Ar), $(this, Kt));
      else if (o = $(this, $r).getUint16($(this, Kt), !1), $(this, kr).requirePreferred && o <= 255) throw new Error(`Unexpectedly long integer encoding (2) for ${o}`);
      break;
    case bt.FOUR:
      if (u = 4, i === me.SIMPLE_FLOAT) o = $(this, $r).getFloat32($(this, Kt), !1);
      else if (o = $(this, $r).getUint32($(this, Kt), !1), $(this, kr).requirePreferred && o <= 65535) throw new Error(`Unexpectedly long integer encoding (4) for ${o}`);
      break;
    case bt.EIGHT: {
      if (u = 8, i === me.SIMPLE_FLOAT) o = $(this, $r).getFloat64($(this, Kt), !1);
      else if (o = $(this, $r).getBigUint64($(this, Kt), !1), o <= Number.MAX_SAFE_INTEGER && (o = Number(o)), $(this, kr).requirePreferred && o <= 4294967295) throw new Error(`Unexpectedly long integer encoding (8) for ${o}`);
      break;
    }
    case 28:
    case 29:
    case 30:
      throw new Error(`Additional info not implemented: ${s}`);
    case bt.INDEFINITE:
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
  switch (kt(this, Kt, $(this, Kt) + u), i) {
    case me.POS_INT:
      yield [i, s, o, t, u];
      break;
    case me.NEG_INT:
      yield [i, s, typeof o == "bigint" ? -1n - o : -1 - Number(o), t, u];
      break;
    case me.BYTE_STRING:
      o === 1 / 0 ? yield* De(this, Wt, ks).call(this, i, e, t) : yield [i, s, De(this, Wt, Eu).call(this, o), t, o];
      break;
    case me.UTF8_STRING:
      o === 1 / 0 ? yield* De(this, Wt, ks).call(this, i, e, t) : yield [i, s, gm.decode(De(this, Wt, Eu).call(this, o)), t, o];
      break;
    case me.ARRAY:
      if (o === 1 / 0) yield* De(this, Wt, ks).call(this, i, e, t, !1);
      else {
        const h = Number(o);
        yield [i, s, h, t, u];
        for (let m = 0; m < h; m++) yield* De(this, Wt, ei).call(this, e + 1);
      }
      break;
    case me.MAP:
      if (o === 1 / 0) yield* De(this, Wt, ks).call(this, i, e, t, !1);
      else {
        const h = Number(o);
        yield [i, s, h, t, u];
        for (let m = 0; m < h; m++) yield* De(this, Wt, ei).call(this, e), yield* De(this, Wt, ei).call(this, e);
      }
      break;
    case me.TAG:
      yield [i, s, o, t, u], yield* De(this, Wt, ei).call(this, e);
      break;
    case me.SIMPLE_FLOAT: {
      const h = o;
      c && (o = Zs.create(Number(o))), yield [i, s, o, t, h];
      break;
    }
  }
}, Eu = function(e) {
  const t = $(this, Ar).subarray($(this, Kt), kt(this, Kt, $(this, Kt) + e));
  if (t.length !== e) throw new Error(`Unexpected end of stream reading ${e} bytes, got ${t.length}`);
  return t;
}, ks = function* (e, t, n, i = !0) {
  for (yield [e, bt.INDEFINITE, 1 / 0, n, 1 / 0]; ; ) {
    const s = De(this, Wt, ei).call(this, t), o = s.next(), [c, u, h] = o.value;
    if (h === Er.BREAK) {
      yield o.value, s.next();
      return;
    }
    if (i) {
      if (c !== e) throw new Error(`Unmatched major type.  Expected ${e}, got ${c}.`);
      if (u === bt.INDEFINITE) throw new Error("New stream started in typed stream");
    }
    yield o.value, yield* s;
  }
}, He(Va, "defaultOptions", { maxDepth: 1024, encoding: "hex", requirePreferred: !1 });
let Ws = Va;
const vm = /* @__PURE__ */ new Map([[bt.ZERO, 1], [bt.ONE, 2], [bt.TWO, 3], [bt.FOUR, 5], [bt.EIGHT, 9]]), mm = new Uint8Array(0);
var tn, ar, en, La, E0;
let Nn = (tn = class {
  constructor(e, t, n, i) {
    rr(this, La);
    He(this, "parent");
    He(this, "mt");
    He(this, "ai");
    He(this, "left");
    He(this, "offset");
    He(this, "count", 0);
    He(this, "children", []);
    He(this, "depth", 0);
    rr(this, ar);
    rr(this, en, null);
    if ([this.mt, this.ai, , this.offset] = e, this.left = t, this.parent = n, kt(this, ar, i), n && (this.depth = n.depth + 1), this.mt === me.MAP && ($(this, ar).sortKeys || $(this, ar).rejectDuplicateKeys) && kt(this, en, []), $(this, ar).rejectStreaming && this.ai === bt.INDEFINITE) throw new Error("Streaming not supported");
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
        return n.convertUnsafeIntsToFloat && h >= Sa.MIN && h <= Sa.MAX && (h = Number(c)), n.boxed ? Is(h, i.toHere(u)) : h;
      }
      case me.SIMPLE_FLOAT:
        if (o > bt.ONE) {
          if (n.rejectFloats) throw new Error(`Decoding unwanted floating point number: ${c}`);
          if (n.rejectNegativeZero && Object.is(c, -0)) throw new Error("Decoding negative zero");
          if (n.rejectLongLoundNaN && isNaN(c)) {
            const h = i.toHere(u);
            if (h.length !== 3 || h[1] !== 126 || h[2] !== 0) throw new Error(`Invalid NaN encoding: "${Vr(h)}"`);
          }
          if (n.rejectSubnormals && tm(i.toHere(u + 1)), n.rejectLongFloats) {
            const h = jc(c, { chunkSize: 9, reduceUnsafeNumbers: n.rejectUnsafeFloatInts });
            if (h[0] >> 5 !== s) throw new Error(`Should have been encoded as int, not float: ${c}`);
            if (h.length < vm.get(o)) throw new Error(`Number should have been encoded shorter: ${c}`);
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
          if (c !== h) throw new Error(`String not normalized as "${n.rejectStringsNotNormalizedAs}", got [${cd(c)}] instead of [${cd(h)}]`);
        }
        return n.boxed ? Is(c, i.toHere(u)) : c;
      case me.ARRAY:
        return new n.ParentType(e, c, t, n);
      case me.MAP:
        return new n.ParentType(e, c * 2, t, n);
      case me.TAG: {
        const h = new n.ParentType(e, 1, t, n);
        return h.children = new Ye(c), h;
      }
    }
    throw new TypeError(`Invalid major type: ${s}`);
  }
  push(e, t, n) {
    if (this.children.push(e), $(this, en)) {
      const i = _a(e) || t.toHere(n);
      $(this, en).push(i);
    }
    return --this.left;
  }
  replaceLast(e, t, n) {
    let i, s = -1 / 0;
    if (this.children instanceof Ye ? (s = 0, i = this.children.contents, this.children.contents = e) : (s = this.children.length - 1, i = this.children[s], this.children[s] = e), $(this, en)) {
      const o = _a(e) || n.toHere(t.offset);
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
        const n = De(this, La, E0).call(this);
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
        return Wv(this.children);
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
}, ar = new WeakMap(), en = new WeakMap(), La = new WeakSet(), E0 = function() {
  const e = this.children, t = e.length;
  if (t % 2) throw new Error("Missing map value");
  const n = new Array(t / 2);
  if ($(this, en)) for (let i = 0; i < t; i += 2) n[i >> 1] = [e[i], e[i + 1], $(this, en)[i]];
  else for (let i = 0; i < t; i += 2) n[i >> 1] = [e[i], e[i + 1], mm];
  return n;
}, He(tn, "defaultDecodeOptions", { ...Ws.defaultOptions, ParentType: tn, boxed: !1, cde: !1, dcbor: !1, diagnosticSizes: _0.PREFERRED, convertUnsafeIntsToFloat: !1, pretty: !1, preferMap: !1, rejectLargeNegatives: !1, rejectBigInts: !1, rejectDuplicateKeys: !1, rejectFloats: !1, rejectInts: !1, rejectLongLoundNaN: !1, rejectLongFloats: !1, rejectNegativeZero: !1, rejectSimple: !1, rejectStreaming: !1, rejectStringsNotNormalizedAs: null, rejectSubnormals: !1, rejectUndefined: !1, rejectUnsafeFloatInts: !1, saveOriginal: !1, sortKeys: null }), He(tn, "cdeDecodeOptions", { cde: !0, rejectStreaming: !0, requirePreferred: !0, sortKeys: w0 }), He(tn, "dcborDecodeOptions", { ...tn.cdeDecodeOptions, dcbor: !0, convertUnsafeIntsToFloat: !0, rejectDuplicateKeys: !0, rejectLargeNegatives: !0, rejectLongLoundNaN: !0, rejectLongFloats: !0, rejectNegativeZero: !0, rejectSimple: !0, rejectUndefined: !0, rejectUnsafeFloatInts: !0, rejectStringsNotNormalizedAs: "NFC" }), tn);
var wd, bd;
class Iu extends (bd = Nn, wd = Er.ENCODED, bd) {
  constructor(t, n, i, s) {
    super(t, n, i, s);
    He(this, "depth", 0);
    He(this, "leaf", !1);
    He(this, "value");
    He(this, "length");
    He(this, wd);
    this.parent ? this.depth = this.parent.depth + 1 : this.depth = s.initialDepth, [, , this.value, , this.length] = t;
  }
  numBytes() {
    switch (this.ai) {
      case bt.ONE:
        return 1;
      case bt.TWO:
        return 2;
      case bt.FOUR:
        return 4;
      case bt.EIGHT:
        return 8;
    }
    return 0;
  }
}
function I0(r) {
  return r instanceof Iu;
}
function jo(r, e) {
  return r === 1 / 0 ? "Indefinite" : e ? `${r} ${e}${r !== 1 && r !== 1n ? "s" : ""}` : String(r);
}
function Qc(r) {
  return "".padStart(r, " ");
}
function k0(r, e, t) {
  let n = "";
  n += Qc(r.depth * 2);
  const i = _a(r);
  n += Vr(i.subarray(0, 1));
  const s = r.numBytes();
  s && (n += " ", n += Vr(i.subarray(1, s + 1))), n = n.padEnd(e.minCol + 1, " "), n += "-- ", t !== void 0 && (n += Qc(r.depth * 2), t !== "" && (n += `[${t}] `));
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
      const u = r.children, [h] = u.contents.children, m = new Ye(u.tag, h);
      Ks(m, i);
      const x = m.comment(e, r.depth);
      x && (n += ": ", n += x), o || (o = m.noChildren);
      break;
    }
    case me.SIMPLE_FLOAT:
      c === Er.BREAK ? n += "BREAK" : r.ai > bt.ONE ? Object.is(c, -0) ? n += "Float: -0" : n += `Float: ${c}` : (n += "Simple: ", c instanceof Zs ? n += c.value : n += c);
      break;
  }
  if (!o) if (r.leaf) {
    if (n += `
`, i.length > s + 1) {
      const u = Qc((r.depth + 1) * 2);
      for (let h = s + 1; h < i.length; h += 8) n += u, n += Vr(i.subarray(h, h + 8)), n += `
`;
    }
  } else {
    n += `
`;
    let u = 0;
    for (const h of r.children) {
      if (I0(h)) {
        let m = String(u);
        r.mt === me.MAP ? m = u % 2 ? `val ${(u - 1) / 2}` : `key ${u / 2}` : r.mt === me.TAG && (m = ""), n += k0(h, e, m);
      }
      u++;
    }
  }
  return n;
}
const wm = { ...Nn.defaultDecodeOptions, initialDepth: 0, noPrefixHex: !1, minCol: 0 };
function bm(r, e) {
  const t = { ...wm, ...e, ParentType: Iu, saveOriginal: !0 }, n = new Ws(r, t);
  let i, s;
  for (const c of n) {
    if (s = Nn.create(c, i, t, n), c[2] === Er.BREAK) if (i != null && i.isStreaming) i.left = 1;
    else throw new Error("Unexpected BREAK");
    if (!I0(s)) {
      const m = new Iu(c, 0, i, t);
      m.leaf = !0, m.children.push(s), Ks(m, n.toHere(c[3])), s = m;
    }
    let u = (s.depth + 1) * 2;
    const h = s.numBytes();
    for (h && (u += 1, u += h * 2), t.minCol = Math.max(t.minCol, u), i && i.push(s, n, c[3]), i = s; i != null && i.done; ) s = i, s.leaf || Ks(s, n.toHere(s.offset)), { parent: i } = i;
  }
  e && (e.minCol = t.minCol);
  let o = t.noPrefixHex ? "" : `0x${Vr(n.toHere(0))}
`;
  return o += k0(s, t), o;
}
const ud = !Xv();
function C0(r) {
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
function B0(r) {
  if (!Array.isArray(r)) throw new Error(`Expected Array: ${r}`);
}
Rt(Map, (r, e, t) => {
  const n = [...r.entries()].map((i) => [i[0], i[1], jc(i[0], t)]);
  if (t.rejectDuplicateKeys) {
    const i = /* @__PURE__ */ new Set();
    for (const [s, o, c] of n) {
      const u = Vr(c);
      if (i.has(u)) throw new Error(`Duplicate map key: 0x${u}`);
      i.add(u);
    }
  }
  t.sortKeys && n.sort(t.sortKeys), xf(r, r.size, me.MAP, e, t);
  for (const [i, s, o] of n) e.write(o), ii(s, e, t);
});
function fd(r) {
  return Pn(r.contents), new Date(r.contents);
}
fd.comment = (r) => (Pn(r.contents), `(String Date) ${new Date(r.contents).toISOString()}`), Ye.registerDecoder(Et.DATE_STRING, fd);
function hd(r) {
  return C0(r.contents), new Date(r.contents * 1e3);
}
hd.comment = (r) => (C0(r.contents), `(Epoch Date) ${new Date(r.contents * 1e3).toISOString()}`), Ye.registerDecoder(Et.DATE_EPOCH, hd), Rt(Date, (r) => [Et.DATE_EPOCH, r.valueOf() / 1e3]);
function ka(r, e, t) {
  if (bi(e.contents), t.rejectBigInts) throw new Error(`Decoding unwanted big integer: ${e}(h'${Vr(e.contents)}')`);
  if (t.requirePreferred && e.contents[0] === 0) throw new Error(`Decoding overly-large bigint: ${e.tag}(h'${Vr(e.contents)})`);
  let n = e.contents.reduce((i, s) => i << 8n | BigInt(s), 0n);
  if (r && (n = -1n - n), t.requirePreferred && n >= Number.MIN_SAFE_INTEGER && n <= Number.MAX_SAFE_INTEGER) throw new Error(`Decoding bigint that could have been int: ${n}n`);
  return t.boxed ? Is(n, e.contents) : n;
}
const dd = ka.bind(null, !1), pd = ka.bind(null, !0);
dd.comment = (r, e) => `(Positive BigInt) ${ka(!1, r, e)}n`, pd.comment = (r, e) => `(Negative BigInt) ${ka(!0, r, e)}n`, Ye.registerDecoder(Et.POS_BIGINT, dd), Ye.registerDecoder(Et.NEG_BIGINT, pd);
function el(r, e) {
  return bi(r.contents), r;
}
el.comment = (r, e, t) => {
  bi(r.contents);
  const n = { ...e, initialDepth: t + 2, noPrefixHex: !0 }, i = _a(r);
  let s = 2 ** ((i[0] & 31) - 24) + 1;
  const o = i[s] & 31;
  let c = Vr(i.subarray(s, ++s));
  o >= 24 && (c += " ", c += Vr(i.subarray(s, s + 2 ** (o - 24)))), n.minCol = Math.max(n.minCol, (t + 1) * 2 + c.length);
  const u = bm(r.contents, n);
  let h = `Embedded CBOR
`;
  return h += `${"".padStart((t + 1) * 2, " ")}${c}`.padEnd(n.minCol + 1, " "), h += `-- Bytes (Length: ${r.contents.length})
`, h += u, h;
}, el.noChildren = !0, Ye.registerDecoder(Et.CBOR, el), Ye.registerDecoder(Et.URI, (r) => (Pn(r.contents), new URL(r.contents)), "URI"), Rt(URL, (r) => [Et.URI, r.toString()]), Ye.registerDecoder(Et.BASE64URL, (r) => (Pn(r.contents), Jv(r.contents)), "Base64url-encoded"), Ye.registerDecoder(Et.BASE64, (r) => (Pn(r.contents), bf(r.contents)), "Base64-encoded"), Ye.registerDecoder(35, (r) => (Pn(r.contents), new RegExp(r.contents)), "RegExp"), Ye.registerDecoder(21065, (r) => {
  Pn(r.contents);
  let e = r.contents.replace(new RegExp("(?<!\\\\)(?<!\\[(?:[^\\]]|\\\\\\])*)\\.", "g"), `[^
\r]`);
  return e = `^(?:${e})$`, new RegExp(e, "u");
}, "I-RegExp"), Ye.registerDecoder(Et.REGEXP, (r) => {
  if (B0(r.contents), r.contents.length < 1 || r.contents.length > 2) throw new Error(`Invalid RegExp Array: ${r.contents}`);
  return new RegExp(r.contents[0], r.contents[1]);
}, "RegExp"), Rt(RegExp, (r) => [Et.REGEXP, [r.source, r.flags]]), Ye.registerDecoder(64, (r) => (bi(r.contents), r.contents), "uint8 Typed Array");
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
  const s = i.forceEndian ?? ud;
  if (Ia(s ? e : t, r, i), zr(n.byteLength, r, me.BYTE_STRING), ud === s) r.write(new Uint8Array(n.buffer, n.byteOffset, n.byteLength));
  else {
    const o = `write${n.constructor.name.replace(/Array/, "")}`, c = r[o].bind(r);
    for (const u of n) c(u, s);
  }
}
Ye.registerDecoder(65, (r) => nr(r, Uint16Array, !1), "uint16, big endian, Typed Array"), Ye.registerDecoder(66, (r) => nr(r, Uint32Array, !1), "uint32, big endian, Typed Array"), Ye.registerDecoder(67, (r) => nr(r, BigUint64Array, !1), "uint64, big endian, Typed Array"), Ye.registerDecoder(68, (r) => (bi(r.contents), new Uint8ClampedArray(r.contents)), "uint8 Typed Array, clamped arithmetic"), Rt(Uint8ClampedArray, (r) => [68, new Uint8Array(r.buffer, r.byteOffset, r.byteLength)]), Ye.registerDecoder(69, (r) => nr(r, Uint16Array, !0), "uint16, little endian, Typed Array"), Rt(Uint16Array, (r, e, t) => On(e, 69, 65, r, t)), Ye.registerDecoder(70, (r) => nr(r, Uint32Array, !0), "uint32, little endian, Typed Array"), Rt(Uint32Array, (r, e, t) => On(e, 70, 66, r, t)), Ye.registerDecoder(71, (r) => nr(r, BigUint64Array, !0), "uint64, little endian, Typed Array"), Rt(BigUint64Array, (r, e, t) => On(e, 71, 67, r, t)), Ye.registerDecoder(72, (r) => (bi(r.contents), new Int8Array(r.contents)), "sint8 Typed Array"), Rt(Int8Array, (r) => [72, new Uint8Array(r.buffer, r.byteOffset, r.byteLength)]), Ye.registerDecoder(73, (r) => nr(r, Int16Array, !1), "sint16, big endian, Typed Array"), Ye.registerDecoder(74, (r) => nr(r, Int32Array, !1), "sint32, big endian, Typed Array"), Ye.registerDecoder(75, (r) => nr(r, BigInt64Array, !1), "sint64, big endian, Typed Array"), Ye.registerDecoder(77, (r) => nr(r, Int16Array, !0), "sint16, little endian, Typed Array"), Rt(Int16Array, (r, e, t) => On(e, 77, 73, r, t)), Ye.registerDecoder(78, (r) => nr(r, Int32Array, !0), "sint32, little endian, Typed Array"), Rt(Int32Array, (r, e, t) => On(e, 78, 74, r, t)), Ye.registerDecoder(79, (r) => nr(r, BigInt64Array, !0), "sint64, little endian, Typed Array"), Rt(BigInt64Array, (r, e, t) => On(e, 79, 75, r, t)), Ye.registerDecoder(81, (r) => nr(r, Float32Array, !1), "IEEE 754 binary32, big endian, Typed Array"), Ye.registerDecoder(82, (r) => nr(r, Float64Array, !1), "IEEE 754 binary64, big endian, Typed Array"), Ye.registerDecoder(85, (r) => nr(r, Float32Array, !0), "IEEE 754 binary32, little endian, Typed Array"), Rt(Float32Array, (r, e, t) => On(e, 85, 81, r, t)), Ye.registerDecoder(86, (r) => nr(r, Float64Array, !0), "IEEE 754 binary64, big endian, Typed Array"), Rt(Float64Array, (r, e, t) => On(e, 86, 82, r, t)), Ye.registerDecoder(Et.SET, (r) => (B0(r.contents), new Set(r.contents)), "Set"), Rt(Set, (r) => [Et.SET, [...r]]), Ye.registerDecoder(Et.JSON, (r) => (Pn(r.contents), JSON.parse(r.contents)), "JSON-encoded"), Ye.registerDecoder(Et.SELF_DESCRIBED, (r) => r.contents, "Self-Described"), Ye.registerDecoder(Et.INVALID_16, () => {
  throw new Error(`Tag always invalid: ${Et.INVALID_16}`);
}, "Invalid"), Ye.registerDecoder(Et.INVALID_32, () => {
  throw new Error(`Tag always invalid: ${Et.INVALID_32}`);
}, "Invalid"), Ye.registerDecoder(Et.INVALID_64, () => {
  throw new Error(`Tag always invalid: ${Et.INVALID_64}`);
}, "Invalid");
function tl(r) {
  throw new Error(`Encoding ${r.constructor.name} intentionally unimplmented.  It is not concrete enough to interoperate.  Convert to Uint8Array first.`);
}
Rt(ArrayBuffer, tl), Rt(DataView, tl), typeof SharedArrayBuffer < "u" && Rt(SharedArrayBuffer, tl);
function Ro(r) {
  return [NaN, r.valueOf()];
}
Rt(Boolean, Ro), Rt(Number, Ro), Rt(String, Ro), Rt(BigInt, Ro);
function Ca(r, e = {}) {
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
var ct;
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
})(ct || (ct = {}));
var ku;
(function(r) {
  r.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(ku || (ku = {}));
const se = ct.arrayToEnum([
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
}, F = ct.arrayToEnum([
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
]), xm = (r) => JSON.stringify(r, null, 2).replace(/"([^"]+)":/g, "$1:");
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
    return JSON.stringify(this.issues, ct.jsonStringifyReplacer, 2);
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
const Xi = (r, e) => {
  let t;
  switch (r.code) {
    case F.invalid_type:
      r.received === se.undefined ? t = "Required" : t = `Expected ${r.expected}, received ${r.received}`;
      break;
    case F.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(r.expected, ct.jsonStringifyReplacer)}`;
      break;
    case F.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${ct.joinValues(r.keys, ", ")}`;
      break;
    case F.invalid_union:
      t = "Invalid input";
      break;
    case F.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${ct.joinValues(r.options)}`;
      break;
    case F.invalid_enum_value:
      t = `Invalid enum value. Expected ${ct.joinValues(r.options)}, received '${r.received}'`;
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
      typeof r.validation == "object" ? "includes" in r.validation ? (t = `Invalid input: must include "${r.validation.includes}"`, typeof r.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${r.validation.position}`)) : "startsWith" in r.validation ? t = `Invalid input: must start with "${r.validation.startsWith}"` : "endsWith" in r.validation ? t = `Invalid input: must end with "${r.validation.endsWith}"` : ct.assertNever(r.validation) : r.validation !== "regex" ? t = `Invalid ${r.validation}` : t = "Invalid";
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
      t = e.defaultError, ct.assertNever(r);
  }
  return { message: t };
};
let O0 = Xi;
function Am(r) {
  O0 = r;
}
function Ba() {
  return O0;
}
const Oa = (r) => {
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
}, Sm = [];
function Q(r, e) {
  const t = Ba(), n = Oa({
    issueData: e,
    data: r.data,
    path: r.path,
    errorMaps: [
      r.common.contextualErrorMap,
      r.schemaErrorMap,
      t,
      t === Xi ? void 0 : Xi
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
}), Ri = (r) => ({ status: "dirty", value: r }), ur = (r) => ({ status: "valid", value: r }), Cu = (r) => r.status === "aborted", Bu = (r) => r.status === "dirty", Ys = (r) => r.status === "valid", Js = (r) => typeof Promise < "u" && r instanceof Promise;
function Ta(r, e, t, n) {
  if (typeof e == "function" ? r !== e || !n : !e.has(r)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return e.get(r);
}
function T0(r, e, t, n, i) {
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
const yd = (r, e) => {
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
function Fe(r) {
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
class Ke {
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
    return yd(i, s);
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
    return yd(n, s);
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
    return es.create(this, this._def);
  }
  or(e) {
    return to.create([this, e], this._def);
  }
  and(e) {
    return ro.create(this, e, this._def);
  }
  transform(e) {
    return new Gr({
      ...Fe(this._def),
      schema: this,
      typeName: Ie.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new ao({
      ...Fe(this._def),
      innerType: this,
      defaultValue: t,
      typeName: Ie.ZodDefault
    });
  }
  brand() {
    return new Af({
      typeName: Ie.ZodBranded,
      type: this,
      ...Fe(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new co({
      ...Fe(this._def),
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
const _m = /^c[^\s-]{8,}$/i, Em = /^[0-9a-z]+$/, Im = /^[0-9A-HJKMNP-TV-Z]{26}$/, km = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Cm = /^[a-z0-9_-]{21}$/i, Bm = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Om = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Tm = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let rl;
const Nm = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Pm = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/, jm = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, N0 = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", Rm = new RegExp(`^${N0}$`);
function P0(r) {
  let e = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
  return r.precision ? e = `${e}\\.\\d{${r.precision}}` : r.precision == null && (e = `${e}(\\.\\d+)?`), e;
}
function Um(r) {
  return new RegExp(`^${P0(r)}$`);
}
function j0(r) {
  let e = `${N0}T${P0(r)}`;
  const t = [];
  return t.push(r.local ? "Z?" : "Z"), r.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function Dm(r, e) {
  return !!((e === "v4" || !e) && Nm.test(r) || (e === "v6" || !e) && Pm.test(r));
}
class Mr extends Ke {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== se.string) {
      const s = this._getOrReturnCtx(e);
      return Q(s, {
        code: F.invalid_type,
        expected: se.string,
        received: s.parsedType
      }), ke;
    }
    const n = new sr();
    let i;
    for (const s of this._def.checks)
      if (s.kind === "min")
        e.data.length < s.value && (i = this._getOrReturnCtx(e, i), Q(i, {
          code: F.too_small,
          minimum: s.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: s.message
        }), n.dirty());
      else if (s.kind === "max")
        e.data.length > s.value && (i = this._getOrReturnCtx(e, i), Q(i, {
          code: F.too_big,
          maximum: s.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: s.message
        }), n.dirty());
      else if (s.kind === "length") {
        const o = e.data.length > s.value, c = e.data.length < s.value;
        (o || c) && (i = this._getOrReturnCtx(e, i), o ? Q(i, {
          code: F.too_big,
          maximum: s.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: s.message
        }) : c && Q(i, {
          code: F.too_small,
          minimum: s.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: s.message
        }), n.dirty());
      } else if (s.kind === "email")
        Om.test(e.data) || (i = this._getOrReturnCtx(e, i), Q(i, {
          validation: "email",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "emoji")
        rl || (rl = new RegExp(Tm, "u")), rl.test(e.data) || (i = this._getOrReturnCtx(e, i), Q(i, {
          validation: "emoji",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "uuid")
        km.test(e.data) || (i = this._getOrReturnCtx(e, i), Q(i, {
          validation: "uuid",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "nanoid")
        Cm.test(e.data) || (i = this._getOrReturnCtx(e, i), Q(i, {
          validation: "nanoid",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "cuid")
        _m.test(e.data) || (i = this._getOrReturnCtx(e, i), Q(i, {
          validation: "cuid",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "cuid2")
        Em.test(e.data) || (i = this._getOrReturnCtx(e, i), Q(i, {
          validation: "cuid2",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "ulid")
        Im.test(e.data) || (i = this._getOrReturnCtx(e, i), Q(i, {
          validation: "ulid",
          code: F.invalid_string,
          message: s.message
        }), n.dirty());
      else if (s.kind === "url")
        try {
          new URL(e.data);
        } catch {
          i = this._getOrReturnCtx(e, i), Q(i, {
            validation: "url",
            code: F.invalid_string,
            message: s.message
          }), n.dirty();
        }
      else s.kind === "regex" ? (s.regex.lastIndex = 0, s.regex.test(e.data) || (i = this._getOrReturnCtx(e, i), Q(i, {
        validation: "regex",
        code: F.invalid_string,
        message: s.message
      }), n.dirty())) : s.kind === "trim" ? e.data = e.data.trim() : s.kind === "includes" ? e.data.includes(s.value, s.position) || (i = this._getOrReturnCtx(e, i), Q(i, {
        code: F.invalid_string,
        validation: { includes: s.value, position: s.position },
        message: s.message
      }), n.dirty()) : s.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : s.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : s.kind === "startsWith" ? e.data.startsWith(s.value) || (i = this._getOrReturnCtx(e, i), Q(i, {
        code: F.invalid_string,
        validation: { startsWith: s.value },
        message: s.message
      }), n.dirty()) : s.kind === "endsWith" ? e.data.endsWith(s.value) || (i = this._getOrReturnCtx(e, i), Q(i, {
        code: F.invalid_string,
        validation: { endsWith: s.value },
        message: s.message
      }), n.dirty()) : s.kind === "datetime" ? j0(s).test(e.data) || (i = this._getOrReturnCtx(e, i), Q(i, {
        code: F.invalid_string,
        validation: "datetime",
        message: s.message
      }), n.dirty()) : s.kind === "date" ? Rm.test(e.data) || (i = this._getOrReturnCtx(e, i), Q(i, {
        code: F.invalid_string,
        validation: "date",
        message: s.message
      }), n.dirty()) : s.kind === "time" ? Um(s).test(e.data) || (i = this._getOrReturnCtx(e, i), Q(i, {
        code: F.invalid_string,
        validation: "time",
        message: s.message
      }), n.dirty()) : s.kind === "duration" ? Bm.test(e.data) || (i = this._getOrReturnCtx(e, i), Q(i, {
        validation: "duration",
        code: F.invalid_string,
        message: s.message
      }), n.dirty()) : s.kind === "ip" ? Dm(e.data, s.version) || (i = this._getOrReturnCtx(e, i), Q(i, {
        validation: "ip",
        code: F.invalid_string,
        message: s.message
      }), n.dirty()) : s.kind === "base64" ? jm.test(e.data) || (i = this._getOrReturnCtx(e, i), Q(i, {
        validation: "base64",
        code: F.invalid_string,
        message: s.message
      }), n.dirty()) : ct.assertNever(s);
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
    ...Fe(r)
  });
};
function $m(r, e) {
  const t = (r.toString().split(".")[1] || "").length, n = (e.toString().split(".")[1] || "").length, i = t > n ? t : n, s = parseInt(r.toFixed(i).replace(".", "")), o = parseInt(e.toFixed(i).replace(".", ""));
  return s % o / Math.pow(10, i);
}
class qn extends Ke {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== se.number) {
      const s = this._getOrReturnCtx(e);
      return Q(s, {
        code: F.invalid_type,
        expected: se.number,
        received: s.parsedType
      }), ke;
    }
    let n;
    const i = new sr();
    for (const s of this._def.checks)
      s.kind === "int" ? ct.isInteger(e.data) || (n = this._getOrReturnCtx(e, n), Q(n, {
        code: F.invalid_type,
        expected: "integer",
        received: "float",
        message: s.message
      }), i.dirty()) : s.kind === "min" ? (s.inclusive ? e.data < s.value : e.data <= s.value) && (n = this._getOrReturnCtx(e, n), Q(n, {
        code: F.too_small,
        minimum: s.value,
        type: "number",
        inclusive: s.inclusive,
        exact: !1,
        message: s.message
      }), i.dirty()) : s.kind === "max" ? (s.inclusive ? e.data > s.value : e.data >= s.value) && (n = this._getOrReturnCtx(e, n), Q(n, {
        code: F.too_big,
        maximum: s.value,
        type: "number",
        inclusive: s.inclusive,
        exact: !1,
        message: s.message
      }), i.dirty()) : s.kind === "multipleOf" ? $m(e.data, s.value) !== 0 && (n = this._getOrReturnCtx(e, n), Q(n, {
        code: F.not_multiple_of,
        multipleOf: s.value,
        message: s.message
      }), i.dirty()) : s.kind === "finite" ? Number.isFinite(e.data) || (n = this._getOrReturnCtx(e, n), Q(n, {
        code: F.not_finite,
        message: s.message
      }), i.dirty()) : ct.assertNever(s);
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
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && ct.isInteger(e.value));
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
  ...Fe(r)
});
class Kn extends Ke {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = BigInt(e.data)), this._getType(e) !== se.bigint) {
      const s = this._getOrReturnCtx(e);
      return Q(s, {
        code: F.invalid_type,
        expected: se.bigint,
        received: s.parsedType
      }), ke;
    }
    let n;
    const i = new sr();
    for (const s of this._def.checks)
      s.kind === "min" ? (s.inclusive ? e.data < s.value : e.data <= s.value) && (n = this._getOrReturnCtx(e, n), Q(n, {
        code: F.too_small,
        type: "bigint",
        minimum: s.value,
        inclusive: s.inclusive,
        message: s.message
      }), i.dirty()) : s.kind === "max" ? (s.inclusive ? e.data > s.value : e.data >= s.value) && (n = this._getOrReturnCtx(e, n), Q(n, {
        code: F.too_big,
        type: "bigint",
        maximum: s.value,
        inclusive: s.inclusive,
        message: s.message
      }), i.dirty()) : s.kind === "multipleOf" ? e.data % s.value !== BigInt(0) && (n = this._getOrReturnCtx(e, n), Q(n, {
        code: F.not_multiple_of,
        multipleOf: s.value,
        message: s.message
      }), i.dirty()) : ct.assertNever(s);
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
    ...Fe(r)
  });
};
class Xs extends Ke {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== se.boolean) {
      const n = this._getOrReturnCtx(e);
      return Q(n, {
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
  ...Fe(r)
});
class xi extends Ke {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== se.date) {
      const s = this._getOrReturnCtx(e);
      return Q(s, {
        code: F.invalid_type,
        expected: se.date,
        received: s.parsedType
      }), ke;
    }
    if (isNaN(e.data.getTime())) {
      const s = this._getOrReturnCtx(e);
      return Q(s, {
        code: F.invalid_date
      }), ke;
    }
    const n = new sr();
    let i;
    for (const s of this._def.checks)
      s.kind === "min" ? e.data.getTime() < s.value && (i = this._getOrReturnCtx(e, i), Q(i, {
        code: F.too_small,
        message: s.message,
        inclusive: !0,
        exact: !1,
        minimum: s.value,
        type: "date"
      }), n.dirty()) : s.kind === "max" ? e.data.getTime() > s.value && (i = this._getOrReturnCtx(e, i), Q(i, {
        code: F.too_big,
        message: s.message,
        inclusive: !0,
        exact: !1,
        maximum: s.value,
        type: "date"
      }), n.dirty()) : ct.assertNever(s);
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
  ...Fe(r)
});
class Na extends Ke {
  _parse(e) {
    if (this._getType(e) !== se.symbol) {
      const n = this._getOrReturnCtx(e);
      return Q(n, {
        code: F.invalid_type,
        expected: se.symbol,
        received: n.parsedType
      }), ke;
    }
    return ur(e.data);
  }
}
Na.create = (r) => new Na({
  typeName: Ie.ZodSymbol,
  ...Fe(r)
});
class Qs extends Ke {
  _parse(e) {
    if (this._getType(e) !== se.undefined) {
      const n = this._getOrReturnCtx(e);
      return Q(n, {
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
  ...Fe(r)
});
class eo extends Ke {
  _parse(e) {
    if (this._getType(e) !== se.null) {
      const n = this._getOrReturnCtx(e);
      return Q(n, {
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
  ...Fe(r)
});
class Qi extends Ke {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return ur(e.data);
  }
}
Qi.create = (r) => new Qi({
  typeName: Ie.ZodAny,
  ...Fe(r)
});
class ai extends Ke {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return ur(e.data);
  }
}
ai.create = (r) => new ai({
  typeName: Ie.ZodUnknown,
  ...Fe(r)
});
class En extends Ke {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return Q(t, {
      code: F.invalid_type,
      expected: se.never,
      received: t.parsedType
    }), ke;
  }
}
En.create = (r) => new En({
  typeName: Ie.ZodNever,
  ...Fe(r)
});
class Pa extends Ke {
  _parse(e) {
    if (this._getType(e) !== se.undefined) {
      const n = this._getOrReturnCtx(e);
      return Q(n, {
        code: F.invalid_type,
        expected: se.void,
        received: n.parsedType
      }), ke;
    }
    return ur(e.data);
  }
}
Pa.create = (r) => new Pa({
  typeName: Ie.ZodVoid,
  ...Fe(r)
});
class Lr extends Ke {
  _parse(e) {
    const { ctx: t, status: n } = this._processInputParams(e), i = this._def;
    if (t.parsedType !== se.array)
      return Q(t, {
        code: F.invalid_type,
        expected: se.array,
        received: t.parsedType
      }), ke;
    if (i.exactLength !== null) {
      const o = t.data.length > i.exactLength.value, c = t.data.length < i.exactLength.value;
      (o || c) && (Q(t, {
        code: o ? F.too_big : F.too_small,
        minimum: c ? i.exactLength.value : void 0,
        maximum: o ? i.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: i.exactLength.message
      }), n.dirty());
    }
    if (i.minLength !== null && t.data.length < i.minLength.value && (Q(t, {
      code: F.too_small,
      minimum: i.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: i.minLength.message
    }), n.dirty()), i.maxLength !== null && t.data.length > i.maxLength.value && (Q(t, {
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
  ...Fe(e)
});
function Pi(r) {
  if (r instanceof Ot) {
    const e = {};
    for (const t in r.shape) {
      const n = r.shape[t];
      e[t] = on.create(Pi(n));
    }
    return new Ot({
      ...r._def,
      shape: () => e
    });
  } else return r instanceof Lr ? new Lr({
    ...r._def,
    type: Pi(r.element)
  }) : r instanceof on ? on.create(Pi(r.unwrap())) : r instanceof Wn ? Wn.create(Pi(r.unwrap())) : r instanceof un ? un.create(r.items.map((e) => Pi(e))) : r;
}
class Ot extends Ke {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = ct.objectKeys(e);
    return this._cached = { shape: e, keys: t };
  }
  _parse(e) {
    if (this._getType(e) !== se.object) {
      const h = this._getOrReturnCtx(e);
      return Q(h, {
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
      const m = s[h], x = i.data[h];
      u.push({
        key: { status: "valid", value: h },
        value: m._parse(new ln(i, x, i.path, h)),
        alwaysSet: h in i.data
      });
    }
    if (this._def.catchall instanceof En) {
      const h = this._def.unknownKeys;
      if (h === "passthrough")
        for (const m of c)
          u.push({
            key: { status: "valid", value: m },
            value: { status: "valid", value: i.data[m] }
          });
      else if (h === "strict")
        c.length > 0 && (Q(i, {
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
    return Se.errToObj, new Ot({
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
    return new Ot({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new Ot({
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
    return new Ot({
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
    return new Ot({
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
    return new Ot({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    return ct.objectKeys(e).forEach((n) => {
      e[n] && this.shape[n] && (t[n] = this.shape[n]);
    }), new Ot({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    return ct.objectKeys(this.shape).forEach((n) => {
      e[n] || (t[n] = this.shape[n]);
    }), new Ot({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return Pi(this);
  }
  partial(e) {
    const t = {};
    return ct.objectKeys(this.shape).forEach((n) => {
      const i = this.shape[n];
      e && !e[n] ? t[n] = i : t[n] = i.optional();
    }), new Ot({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    return ct.objectKeys(this.shape).forEach((n) => {
      if (e && !e[n])
        t[n] = this.shape[n];
      else {
        let s = this.shape[n];
        for (; s instanceof on; )
          s = s._def.innerType;
        t[n] = s;
      }
    }), new Ot({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return R0(ct.objectKeys(this.shape));
  }
}
Ot.create = (r, e) => new Ot({
  shape: () => r,
  unknownKeys: "strip",
  catchall: En.create(),
  typeName: Ie.ZodObject,
  ...Fe(e)
});
Ot.strictCreate = (r, e) => new Ot({
  shape: () => r,
  unknownKeys: "strict",
  catchall: En.create(),
  typeName: Ie.ZodObject,
  ...Fe(e)
});
Ot.lazycreate = (r, e) => new Ot({
  shape: r,
  unknownKeys: "strip",
  catchall: En.create(),
  typeName: Ie.ZodObject,
  ...Fe(e)
});
class to extends Ke {
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
      return Q(t, {
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
      return Q(t, {
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
  ...Fe(e)
});
const yn = (r) => r instanceof io ? yn(r.schema) : r instanceof Gr ? yn(r.innerType()) : r instanceof so ? [r.value] : r instanceof Zn ? r.options : r instanceof oo ? ct.objectValues(r.enum) : r instanceof ao ? yn(r._def.innerType) : r instanceof Qs ? [void 0] : r instanceof eo ? [null] : r instanceof on ? [void 0, ...yn(r.unwrap())] : r instanceof Wn ? [null, ...yn(r.unwrap())] : r instanceof Af || r instanceof lo ? yn(r.unwrap()) : r instanceof co ? yn(r._def.innerType) : [];
class Rc extends Ke {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== se.object)
      return Q(t, {
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
    }) : (Q(t, {
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
    return new Rc({
      typeName: Ie.ZodDiscriminatedUnion,
      discriminator: e,
      options: t,
      optionsMap: i,
      ...Fe(n)
    });
  }
}
function Ou(r, e) {
  const t = jn(r), n = jn(e);
  if (r === e)
    return { valid: !0, data: r };
  if (t === se.object && n === se.object) {
    const i = ct.objectKeys(e), s = ct.objectKeys(r).filter((c) => i.indexOf(c) !== -1), o = { ...r, ...e };
    for (const c of s) {
      const u = Ou(r[c], e[c]);
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
      const o = r[s], c = e[s], u = Ou(o, c);
      if (!u.valid)
        return { valid: !1 };
      i.push(u.data);
    }
    return { valid: !0, data: i };
  } else return t === se.date && n === se.date && +r == +e ? { valid: !0, data: r } : { valid: !1 };
}
class ro extends Ke {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), i = (s, o) => {
      if (Cu(s) || Cu(o))
        return ke;
      const c = Ou(s.value, o.value);
      return c.valid ? ((Bu(s) || Bu(o)) && t.dirty(), { status: t.value, value: c.data }) : (Q(n, {
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
  ...Fe(t)
});
class un extends Ke {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== se.array)
      return Q(n, {
        code: F.invalid_type,
        expected: se.array,
        received: n.parsedType
      }), ke;
    if (n.data.length < this._def.items.length)
      return Q(n, {
        code: F.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), ke;
    !this._def.rest && n.data.length > this._def.items.length && (Q(n, {
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
    ...Fe(e)
  });
};
class no extends Ke {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== se.object)
      return Q(n, {
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
    return t instanceof Ke ? new no({
      keyType: e,
      valueType: t,
      typeName: Ie.ZodRecord,
      ...Fe(n)
    }) : new no({
      keyType: Mr.create(),
      valueType: e,
      typeName: Ie.ZodRecord,
      ...Fe(t)
    });
  }
}
class ja extends Ke {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== se.map)
      return Q(n, {
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
          const h = await u.key, m = await u.value;
          if (h.status === "aborted" || m.status === "aborted")
            return ke;
          (h.status === "dirty" || m.status === "dirty") && t.dirty(), c.set(h.value, m.value);
        }
        return { status: t.value, value: c };
      });
    } else {
      const c = /* @__PURE__ */ new Map();
      for (const u of o) {
        const h = u.key, m = u.value;
        if (h.status === "aborted" || m.status === "aborted")
          return ke;
        (h.status === "dirty" || m.status === "dirty") && t.dirty(), c.set(h.value, m.value);
      }
      return { status: t.value, value: c };
    }
  }
}
ja.create = (r, e, t) => new ja({
  valueType: e,
  keyType: r,
  typeName: Ie.ZodMap,
  ...Fe(t)
});
class Ai extends Ke {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== se.set)
      return Q(n, {
        code: F.invalid_type,
        expected: se.set,
        received: n.parsedType
      }), ke;
    const i = this._def;
    i.minSize !== null && n.data.size < i.minSize.value && (Q(n, {
      code: F.too_small,
      minimum: i.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: i.minSize.message
    }), t.dirty()), i.maxSize !== null && n.data.size > i.maxSize.value && (Q(n, {
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
          return ke;
        m.status === "dirty" && t.dirty(), h.add(m.value);
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
  ...Fe(e)
});
class $i extends Ke {
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== se.function)
      return Q(t, {
        code: F.invalid_type,
        expected: se.function,
        received: t.parsedType
      }), ke;
    function n(c, u) {
      return Oa({
        data: c,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          Ba(),
          Xi
        ].filter((h) => !!h),
        issueData: {
          code: F.invalid_arguments,
          argumentsError: u
        }
      });
    }
    function i(c, u) {
      return Oa({
        data: c,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          Ba(),
          Xi
        ].filter((h) => !!h),
        issueData: {
          code: F.invalid_return_type,
          returnTypeError: u
        }
      });
    }
    const s = { errorMap: t.common.contextualErrorMap }, o = t.data;
    if (this._def.returns instanceof es) {
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
    return new $i({
      ...this._def,
      args: un.create(e).rest(ai.create())
    });
  }
  returns(e) {
    return new $i({
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
    return new $i({
      args: e || un.create([]).rest(ai.create()),
      returns: t || ai.create(),
      typeName: Ie.ZodFunction,
      ...Fe(n)
    });
  }
}
class io extends Ke {
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
  ...Fe(e)
});
class so extends Ke {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return Q(t, {
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
  ...Fe(e)
});
function R0(r, e) {
  return new Zn({
    values: r,
    typeName: Ie.ZodEnum,
    ...Fe(e)
  });
}
class Zn extends Ke {
  constructor() {
    super(...arguments), Cs.set(this, void 0);
  }
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return Q(t, {
        expected: ct.joinValues(n),
        received: t.parsedType,
        code: F.invalid_type
      }), ke;
    }
    if (Ta(this, Cs) || T0(this, Cs, new Set(this._def.values)), !Ta(this, Cs).has(e.data)) {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return Q(t, {
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
Zn.create = R0;
class oo extends Ke {
  constructor() {
    super(...arguments), Bs.set(this, void 0);
  }
  _parse(e) {
    const t = ct.getValidEnumValues(this._def.values), n = this._getOrReturnCtx(e);
    if (n.parsedType !== se.string && n.parsedType !== se.number) {
      const i = ct.objectValues(t);
      return Q(n, {
        expected: ct.joinValues(i),
        received: n.parsedType,
        code: F.invalid_type
      }), ke;
    }
    if (Ta(this, Bs) || T0(this, Bs, new Set(ct.getValidEnumValues(this._def.values))), !Ta(this, Bs).has(e.data)) {
      const i = ct.objectValues(t);
      return Q(n, {
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
  ...Fe(e)
});
class es extends Ke {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== se.promise && t.common.async === !1)
      return Q(t, {
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
es.create = (r, e) => new es({
  type: r,
  typeName: Ie.ZodPromise,
  ...Fe(e)
});
class Gr extends Ke {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === Ie.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), i = this._def.effect || null, s = {
      addIssue: (o) => {
        Q(n, o), o.fatal ? t.abort() : t.dirty();
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
          return u.status === "aborted" ? ke : u.status === "dirty" || t.value === "dirty" ? Ri(u.value) : u;
        });
      {
        if (t.value === "aborted")
          return ke;
        const c = this._def.schema._parseSync({
          data: o,
          path: n.path,
          parent: n
        });
        return c.status === "aborted" ? ke : c.status === "dirty" || t.value === "dirty" ? Ri(c.value) : c;
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
    ct.assertNever(i);
  }
}
Gr.create = (r, e, t) => new Gr({
  schema: r,
  typeName: Ie.ZodEffects,
  effect: e,
  ...Fe(t)
});
Gr.createWithPreprocess = (r, e, t) => new Gr({
  schema: e,
  effect: { type: "preprocess", transform: r },
  typeName: Ie.ZodEffects,
  ...Fe(t)
});
class on extends Ke {
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
  ...Fe(e)
});
class Wn extends Ke {
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
  ...Fe(e)
});
class ao extends Ke {
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
  ...Fe(e)
});
class co extends Ke {
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
  ...Fe(e)
});
class Ra extends Ke {
  _parse(e) {
    if (this._getType(e) !== se.nan) {
      const n = this._getOrReturnCtx(e);
      return Q(n, {
        code: F.invalid_type,
        expected: se.nan,
        received: n.parsedType
      }), ke;
    }
    return { status: "valid", value: e.data };
  }
}
Ra.create = (r) => new Ra({
  typeName: Ie.ZodNaN,
  ...Fe(r)
});
const Mm = Symbol("zod_brand");
class Af extends Ke {
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
class Io extends Ke {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.common.async)
      return (async () => {
        const s = await this._def.in._parseAsync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return s.status === "aborted" ? ke : s.status === "dirty" ? (t.dirty(), Ri(s.value)) : this._def.out._parseAsync({
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
class lo extends Ke {
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
  ...Fe(e)
});
function U0(r, e = {}, t) {
  return r ? Qi.create().superRefine((n, i) => {
    var s, o;
    if (!r(n)) {
      const c = typeof e == "function" ? e(n) : typeof e == "string" ? { message: e } : e, u = (o = (s = c.fatal) !== null && s !== void 0 ? s : t) !== null && o !== void 0 ? o : !0, h = typeof c == "string" ? { message: c } : c;
      i.addIssue({ code: "custom", ...h, fatal: u });
    }
  }) : Qi.create();
}
const Vm = {
  object: Ot.lazycreate
};
var Ie;
(function(r) {
  r.ZodString = "ZodString", r.ZodNumber = "ZodNumber", r.ZodNaN = "ZodNaN", r.ZodBigInt = "ZodBigInt", r.ZodBoolean = "ZodBoolean", r.ZodDate = "ZodDate", r.ZodSymbol = "ZodSymbol", r.ZodUndefined = "ZodUndefined", r.ZodNull = "ZodNull", r.ZodAny = "ZodAny", r.ZodUnknown = "ZodUnknown", r.ZodNever = "ZodNever", r.ZodVoid = "ZodVoid", r.ZodArray = "ZodArray", r.ZodObject = "ZodObject", r.ZodUnion = "ZodUnion", r.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r.ZodIntersection = "ZodIntersection", r.ZodTuple = "ZodTuple", r.ZodRecord = "ZodRecord", r.ZodMap = "ZodMap", r.ZodSet = "ZodSet", r.ZodFunction = "ZodFunction", r.ZodLazy = "ZodLazy", r.ZodLiteral = "ZodLiteral", r.ZodEnum = "ZodEnum", r.ZodEffects = "ZodEffects", r.ZodNativeEnum = "ZodNativeEnum", r.ZodOptional = "ZodOptional", r.ZodNullable = "ZodNullable", r.ZodDefault = "ZodDefault", r.ZodCatch = "ZodCatch", r.ZodPromise = "ZodPromise", r.ZodBranded = "ZodBranded", r.ZodPipeline = "ZodPipeline", r.ZodReadonly = "ZodReadonly";
})(Ie || (Ie = {}));
const Lm = (r, e = {
  message: `Input not instance of ${r.name}`
}) => U0((t) => t instanceof r, e), D0 = Mr.create, $0 = qn.create, Hm = Ra.create, Fm = Kn.create, M0 = Xs.create, zm = xi.create, Gm = Na.create, qm = Qs.create, Km = eo.create, Zm = Qi.create, Wm = ai.create, Ym = En.create, Jm = Pa.create, Xm = Lr.create, Qm = Ot.create, e1 = Ot.strictCreate, t1 = to.create, r1 = Rc.create, n1 = ro.create, i1 = un.create, s1 = no.create, o1 = ja.create, a1 = Ai.create, c1 = $i.create, l1 = io.create, u1 = so.create, f1 = Zn.create, h1 = oo.create, d1 = es.create, gd = Gr.create, p1 = on.create, y1 = Wn.create, g1 = Gr.createWithPreprocess, v1 = Io.create, m1 = () => D0().optional(), w1 = () => $0().optional(), b1 = () => M0().optional(), x1 = {
  string: (r) => Mr.create({ ...r, coerce: !0 }),
  number: (r) => qn.create({ ...r, coerce: !0 }),
  boolean: (r) => Xs.create({
    ...r,
    coerce: !0
  }),
  bigint: (r) => Kn.create({ ...r, coerce: !0 }),
  date: (r) => xi.create({ ...r, coerce: !0 })
}, A1 = ke;
var Bt = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: Xi,
  setErrorMap: Am,
  getErrorMap: Ba,
  makeIssue: Oa,
  EMPTY_PATH: Sm,
  addIssueToContext: Q,
  ParseStatus: sr,
  INVALID: ke,
  DIRTY: Ri,
  OK: ur,
  isAborted: Cu,
  isDirty: Bu,
  isValid: Ys,
  isAsync: Js,
  get util() {
    return ct;
  },
  get objectUtil() {
    return ku;
  },
  ZodParsedType: se,
  getParsedType: jn,
  ZodType: Ke,
  datetimeRegex: j0,
  ZodString: Mr,
  ZodNumber: qn,
  ZodBigInt: Kn,
  ZodBoolean: Xs,
  ZodDate: xi,
  ZodSymbol: Na,
  ZodUndefined: Qs,
  ZodNull: eo,
  ZodAny: Qi,
  ZodUnknown: ai,
  ZodNever: En,
  ZodVoid: Pa,
  ZodArray: Lr,
  ZodObject: Ot,
  ZodUnion: to,
  ZodDiscriminatedUnion: Rc,
  ZodIntersection: ro,
  ZodTuple: un,
  ZodRecord: no,
  ZodMap: ja,
  ZodSet: Ai,
  ZodFunction: $i,
  ZodLazy: io,
  ZodLiteral: so,
  ZodEnum: Zn,
  ZodNativeEnum: oo,
  ZodPromise: es,
  ZodEffects: Gr,
  ZodTransformer: Gr,
  ZodOptional: on,
  ZodNullable: Wn,
  ZodDefault: ao,
  ZodCatch: co,
  ZodNaN: Ra,
  BRAND: Mm,
  ZodBranded: Af,
  ZodPipeline: Io,
  ZodReadonly: lo,
  custom: U0,
  Schema: Ke,
  ZodSchema: Ke,
  late: Vm,
  get ZodFirstPartyTypeKind() {
    return Ie;
  },
  coerce: x1,
  any: Zm,
  array: Xm,
  bigint: Fm,
  boolean: M0,
  date: zm,
  discriminatedUnion: r1,
  effect: gd,
  enum: f1,
  function: c1,
  instanceof: Lm,
  intersection: n1,
  lazy: l1,
  literal: u1,
  map: o1,
  nan: Hm,
  nativeEnum: h1,
  never: Ym,
  null: Km,
  nullable: y1,
  number: $0,
  object: Qm,
  oboolean: b1,
  onumber: w1,
  optional: p1,
  ostring: m1,
  pipeline: v1,
  preprocess: g1,
  promise: d1,
  record: s1,
  set: a1,
  strictObject: e1,
  string: D0,
  symbol: Gm,
  transformer: gd,
  tuple: i1,
  undefined: qm,
  union: t1,
  unknown: Wm,
  void: Jm,
  NEVER: A1,
  ZodIssueCode: F,
  quotelessJson: xm,
  ZodError: _r
});
const Ua = new Uint8Array([48, 130, 2, 17, 48, 130, 1, 150, 160, 3, 2, 1, 2, 2, 17, 0, 249, 49, 117, 104, 27, 144, 175, 225, 29, 70, 204, 180, 228, 231, 248, 86, 48, 10, 6, 8, 42, 134, 72, 206, 61, 4, 3, 3, 48, 73, 49, 11, 48, 9, 6, 3, 85, 4, 6, 19, 2, 85, 83, 49, 15, 48, 13, 6, 3, 85, 4, 10, 12, 6, 65, 109, 97, 122, 111, 110, 49, 12, 48, 10, 6, 3, 85, 4, 11, 12, 3, 65, 87, 83, 49, 27, 48, 25, 6, 3, 85, 4, 3, 12, 18, 97, 119, 115, 46, 110, 105, 116, 114, 111, 45, 101, 110, 99, 108, 97, 118, 101, 115, 48, 30, 23, 13, 49, 57, 49, 48, 50, 56, 49, 51, 50, 56, 48, 53, 90, 23, 13, 52, 57, 49, 48, 50, 56, 49, 52, 50, 56, 48, 53, 90, 48, 73, 49, 11, 48, 9, 6, 3, 85, 4, 6, 19, 2, 85, 83, 49, 15, 48, 13, 6, 3, 85, 4, 10, 12, 6, 65, 109, 97, 122, 111, 110, 49, 12, 48, 10, 6, 3, 85, 4, 11, 12, 3, 65, 87, 83, 49, 27, 48, 25, 6, 3, 85, 4, 3, 12, 18, 97, 119, 115, 46, 110, 105, 116, 114, 111, 45, 101, 110, 99, 108, 97, 118, 101, 115, 48, 118, 48, 16, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 5, 43, 129, 4, 0, 34, 3, 98, 0, 4, 252, 2, 84, 235, 166, 8, 193, 243, 104, 112, 226, 154, 218, 144, 190, 70, 56, 50, 146, 115, 110, 137, 75, 255, 246, 114, 217, 137, 68, 75, 80, 81, 229, 52, 164, 177, 246, 219, 227, 192, 188, 88, 26, 50, 183, 177, 118, 7, 14, 222, 18, 214, 154, 63, 234, 33, 27, 102, 231, 82, 207, 125, 209, 221, 9, 95, 111, 19, 112, 244, 23, 8, 67, 217, 220, 16, 1, 33, 228, 207, 99, 1, 40, 9, 102, 68, 135, 201, 121, 98, 132, 48, 77, 197, 63, 244, 163, 66, 48, 64, 48, 15, 6, 3, 85, 29, 19, 1, 1, 255, 4, 5, 48, 3, 1, 1, 255, 48, 29, 6, 3, 85, 29, 14, 4, 22, 4, 20, 144, 37, 181, 13, 217, 5, 71, 231, 150, 195, 150, 250, 114, 157, 207, 153, 169, 223, 75, 150, 48, 14, 6, 3, 85, 29, 15, 1, 1, 255, 4, 4, 3, 2, 1, 134, 48, 10, 6, 8, 42, 134, 72, 206, 61, 4, 3, 3, 3, 105, 0, 48, 102, 2, 49, 0, 163, 127, 47, 145, 161, 201, 189, 94, 231, 184, 98, 124, 22, 152, 210, 85, 3, 142, 31, 3, 67, 249, 91, 99, 169, 98, 140, 61, 57, 128, 149, 69, 161, 30, 188, 191, 46, 59, 85, 216, 174, 238, 113, 180, 195, 214, 173, 243, 2, 49, 0, 162, 243, 155, 22, 5, 178, 112, 40, 165, 221, 75, 160, 105, 181, 1, 110, 101, 180, 251, 222, 143, 224, 6, 29, 106, 83, 25, 127, 156, 218, 245, 217, 67, 188, 97, 252, 43, 235, 3, 203, 111, 238, 141, 35, 2, 243, 223, 246]);
if (!Ua || Ua.length === 0)
  throw new Error("AWS root certificate is empty or not loaded correctly");
const S1 = Bt.object({
  module_id: Bt.string().min(1),
  digest: Bt.literal("SHA384"),
  timestamp: Bt.number().min(1677721600),
  pcrs: Bt.map(Bt.number(), Bt.instanceof(Uint8Array)),
  certificate: Bt.instanceof(Uint8Array),
  cabundle: Bt.array(Bt.instanceof(Uint8Array)),
  public_key: Bt.nullable(Bt.instanceof(Uint8Array)),
  user_data: Bt.nullable(Bt.instanceof(Uint8Array)),
  nonce: Bt.nullable(Bt.instanceof(Uint8Array))
}), _1 = Bt.object({
  protected: Bt.instanceof(Uint8Array),
  // There's an "unprotected" header in the CBOR, but we never use it
  payload: Bt.instanceof(Uint8Array),
  signature: Bt.instanceof(Uint8Array)
});
async function E1(r) {
  try {
    if (!r)
      throw new Error("Attestation document is empty.");
    const e = js(r), t = Ca(e), n = t[0], i = t[2], s = t[3];
    return _1.parse({
      protected: n,
      payload: i,
      signature: s
    });
  } catch (e) {
    throw console.error("Error parsing document data:", e), new Error("Failed to parse document data.");
  }
}
async function I1(r) {
  try {
    const e = Ca(r);
    return S1.parse(e);
  } catch (e) {
    throw console.error("Error parsing document payload:", e), new Error("Failed to parse document payload.");
  }
}
function k1(r, e) {
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
  return jc(t);
}
async function C1(r, e) {
  try {
    console.log("SIGNATURE:"), console.log(Br(r.signature));
    const t = k1(r.protected, r.payload), n = await crypto.subtle.digest("SHA-384", t);
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
    const n = await E1(r), i = await I1(n.payload);
    if (!i.nonce)
      throw new Error("Attestation document does not have a nonce.");
    const o = new TextDecoder("utf-8").decode(i.nonce);
    if (t !== o)
      throw console.log("Nonce mismatch"), console.log("Provided nonce:", t), console.log("Attestation document nonce:", o), new Error("Attestation document's nonce does not match the provided nonce.");
    const c = [], u = Br(i.cabundle[0]);
    if (u !== Br(e))
      throw console.error("Root cert doesn't match first cert"), console.log("First cert base64:", u), console.log("Trusted root cert base64:", Br(e)), new Error("Root cert does not match first cert in attestation document.");
    for (let I = 0; I < i.cabundle.length; I++) {
      const P = new wi(i.cabundle[I]);
      c.push(P);
    }
    const h = new wi(i.certificate), x = await new Kv({
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
    const A = await v.export(), O = await C1(n, A);
    if (console.log("Signature verified:", O), !O)
      throw new Error("Signature verification failed.");
    return i;
  } catch (n) {
    throw console.error("Error verifying attestation document:", n), n;
  }
}
const B1 = Bt.object({
  public_key: Bt.nullable(Bt.instanceof(Uint8Array))
});
async function O1(r) {
  const e = js(r), n = Ca(e)[2], i = Ca(n);
  return await B1.parse(i);
}
async function T1(r, e) {
  try {
    const t = await Q1(r, e), n = e || q1();
    return n && (n === "http://127.0.0.1:3000" || n === "http://localhost:3000" || n === "http://0.0.0.0:3000") ? (console.log("DEV MODE: Using fake attestation document"), await O1(t)) : await Si(t, Ua, r);
  } catch (t) {
    throw t instanceof Error ? (console.error("Error verifying attestation document:", t), new Error(`Couldn't process attestation document: ${t.message}`)) : (console.error("Error verifying attestation document:", t), new Error("Couldn't process attestation document."));
  }
}
function N1(r) {
  throw new Error('Could not dynamically require "' + r + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var V0 = { exports: {} };
const P1 = {}, j1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: P1
}, Symbol.toStringTag, { value: "Module" })), R1 = /* @__PURE__ */ Xy(j1);
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
      for (var g = a[0] & 255 | (a[1] & 255) << 8 | (a[2] & 255) << 16 | (a[3] & 255) << 24, S = d[0] & 255 | (d[1] & 255) << 8 | (d[2] & 255) << 16 | (d[3] & 255) << 24, E = d[4] & 255 | (d[5] & 255) << 8 | (d[6] & 255) << 16 | (d[7] & 255) << 24, U = d[8] & 255 | (d[9] & 255) << 8 | (d[10] & 255) << 16 | (d[11] & 255) << 24, z = d[12] & 255 | (d[13] & 255) << 8 | (d[14] & 255) << 16 | (d[15] & 255) << 24, we = a[4] & 255 | (a[5] & 255) << 8 | (a[6] & 255) << 16 | (a[7] & 255) << 24, X = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, ut = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, le = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, Ce = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, Be = a[8] & 255 | (a[9] & 255) << 8 | (a[10] & 255) << 16 | (a[11] & 255) << 24, Me = d[16] & 255 | (d[17] & 255) << 8 | (d[18] & 255) << 16 | (d[19] & 255) << 24, Ue = d[20] & 255 | (d[21] & 255) << 8 | (d[22] & 255) << 16 | (d[23] & 255) << 24, Oe = d[24] & 255 | (d[25] & 255) << 8 | (d[26] & 255) << 16 | (d[27] & 255) << 24, Pe = d[28] & 255 | (d[29] & 255) << 8 | (d[30] & 255) << 16 | (d[31] & 255) << 24, Te = a[12] & 255 | (a[13] & 255) << 8 | (a[14] & 255) << 16 | (a[15] & 255) << 24, pe = g, Ae = S, ne = E, ye = U, ve = z, J = we, C = X, B = ut, V = le, j = Ce, D = Be, L = Me, _e = Ue, Ve = Oe, ze = Pe, Le = Te, w, We = 0; We < 20; We += 2)
        w = pe + _e | 0, ve ^= w << 7 | w >>> 25, w = ve + pe | 0, V ^= w << 9 | w >>> 23, w = V + ve | 0, _e ^= w << 13 | w >>> 19, w = _e + V | 0, pe ^= w << 18 | w >>> 14, w = J + Ae | 0, j ^= w << 7 | w >>> 25, w = j + J | 0, Ve ^= w << 9 | w >>> 23, w = Ve + j | 0, Ae ^= w << 13 | w >>> 19, w = Ae + Ve | 0, J ^= w << 18 | w >>> 14, w = D + C | 0, ze ^= w << 7 | w >>> 25, w = ze + D | 0, ne ^= w << 9 | w >>> 23, w = ne + ze | 0, C ^= w << 13 | w >>> 19, w = C + ne | 0, D ^= w << 18 | w >>> 14, w = Le + L | 0, ye ^= w << 7 | w >>> 25, w = ye + Le | 0, B ^= w << 9 | w >>> 23, w = B + ye | 0, L ^= w << 13 | w >>> 19, w = L + B | 0, Le ^= w << 18 | w >>> 14, w = pe + ye | 0, Ae ^= w << 7 | w >>> 25, w = Ae + pe | 0, ne ^= w << 9 | w >>> 23, w = ne + Ae | 0, ye ^= w << 13 | w >>> 19, w = ye + ne | 0, pe ^= w << 18 | w >>> 14, w = J + ve | 0, C ^= w << 7 | w >>> 25, w = C + J | 0, B ^= w << 9 | w >>> 23, w = B + C | 0, ve ^= w << 13 | w >>> 19, w = ve + B | 0, J ^= w << 18 | w >>> 14, w = D + j | 0, L ^= w << 7 | w >>> 25, w = L + D | 0, V ^= w << 9 | w >>> 23, w = V + L | 0, j ^= w << 13 | w >>> 19, w = j + V | 0, D ^= w << 18 | w >>> 14, w = Le + ze | 0, _e ^= w << 7 | w >>> 25, w = _e + Le | 0, Ve ^= w << 9 | w >>> 23, w = Ve + _e | 0, ze ^= w << 13 | w >>> 19, w = ze + Ve | 0, Le ^= w << 18 | w >>> 14;
      pe = pe + g | 0, Ae = Ae + S | 0, ne = ne + E | 0, ye = ye + U | 0, ve = ve + z | 0, J = J + we | 0, C = C + X | 0, B = B + ut | 0, V = V + le | 0, j = j + Ce | 0, D = D + Be | 0, L = L + Me | 0, _e = _e + Ue | 0, Ve = Ve + Oe | 0, ze = ze + Pe | 0, Le = Le + Te | 0, l[0] = pe >>> 0 & 255, l[1] = pe >>> 8 & 255, l[2] = pe >>> 16 & 255, l[3] = pe >>> 24 & 255, l[4] = Ae >>> 0 & 255, l[5] = Ae >>> 8 & 255, l[6] = Ae >>> 16 & 255, l[7] = Ae >>> 24 & 255, l[8] = ne >>> 0 & 255, l[9] = ne >>> 8 & 255, l[10] = ne >>> 16 & 255, l[11] = ne >>> 24 & 255, l[12] = ye >>> 0 & 255, l[13] = ye >>> 8 & 255, l[14] = ye >>> 16 & 255, l[15] = ye >>> 24 & 255, l[16] = ve >>> 0 & 255, l[17] = ve >>> 8 & 255, l[18] = ve >>> 16 & 255, l[19] = ve >>> 24 & 255, l[20] = J >>> 0 & 255, l[21] = J >>> 8 & 255, l[22] = J >>> 16 & 255, l[23] = J >>> 24 & 255, l[24] = C >>> 0 & 255, l[25] = C >>> 8 & 255, l[26] = C >>> 16 & 255, l[27] = C >>> 24 & 255, l[28] = B >>> 0 & 255, l[29] = B >>> 8 & 255, l[30] = B >>> 16 & 255, l[31] = B >>> 24 & 255, l[32] = V >>> 0 & 255, l[33] = V >>> 8 & 255, l[34] = V >>> 16 & 255, l[35] = V >>> 24 & 255, l[36] = j >>> 0 & 255, l[37] = j >>> 8 & 255, l[38] = j >>> 16 & 255, l[39] = j >>> 24 & 255, l[40] = D >>> 0 & 255, l[41] = D >>> 8 & 255, l[42] = D >>> 16 & 255, l[43] = D >>> 24 & 255, l[44] = L >>> 0 & 255, l[45] = L >>> 8 & 255, l[46] = L >>> 16 & 255, l[47] = L >>> 24 & 255, l[48] = _e >>> 0 & 255, l[49] = _e >>> 8 & 255, l[50] = _e >>> 16 & 255, l[51] = _e >>> 24 & 255, l[52] = Ve >>> 0 & 255, l[53] = Ve >>> 8 & 255, l[54] = Ve >>> 16 & 255, l[55] = Ve >>> 24 & 255, l[56] = ze >>> 0 & 255, l[57] = ze >>> 8 & 255, l[58] = ze >>> 16 & 255, l[59] = ze >>> 24 & 255, l[60] = Le >>> 0 & 255, l[61] = Le >>> 8 & 255, l[62] = Le >>> 16 & 255, l[63] = Le >>> 24 & 255;
    }
    function R(l, p, d, a) {
      for (var g = a[0] & 255 | (a[1] & 255) << 8 | (a[2] & 255) << 16 | (a[3] & 255) << 24, S = d[0] & 255 | (d[1] & 255) << 8 | (d[2] & 255) << 16 | (d[3] & 255) << 24, E = d[4] & 255 | (d[5] & 255) << 8 | (d[6] & 255) << 16 | (d[7] & 255) << 24, U = d[8] & 255 | (d[9] & 255) << 8 | (d[10] & 255) << 16 | (d[11] & 255) << 24, z = d[12] & 255 | (d[13] & 255) << 8 | (d[14] & 255) << 16 | (d[15] & 255) << 24, we = a[4] & 255 | (a[5] & 255) << 8 | (a[6] & 255) << 16 | (a[7] & 255) << 24, X = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, ut = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, le = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, Ce = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, Be = a[8] & 255 | (a[9] & 255) << 8 | (a[10] & 255) << 16 | (a[11] & 255) << 24, Me = d[16] & 255 | (d[17] & 255) << 8 | (d[18] & 255) << 16 | (d[19] & 255) << 24, Ue = d[20] & 255 | (d[21] & 255) << 8 | (d[22] & 255) << 16 | (d[23] & 255) << 24, Oe = d[24] & 255 | (d[25] & 255) << 8 | (d[26] & 255) << 16 | (d[27] & 255) << 24, Pe = d[28] & 255 | (d[29] & 255) << 8 | (d[30] & 255) << 16 | (d[31] & 255) << 24, Te = a[12] & 255 | (a[13] & 255) << 8 | (a[14] & 255) << 16 | (a[15] & 255) << 24, pe = g, Ae = S, ne = E, ye = U, ve = z, J = we, C = X, B = ut, V = le, j = Ce, D = Be, L = Me, _e = Ue, Ve = Oe, ze = Pe, Le = Te, w, We = 0; We < 20; We += 2)
        w = pe + _e | 0, ve ^= w << 7 | w >>> 25, w = ve + pe | 0, V ^= w << 9 | w >>> 23, w = V + ve | 0, _e ^= w << 13 | w >>> 19, w = _e + V | 0, pe ^= w << 18 | w >>> 14, w = J + Ae | 0, j ^= w << 7 | w >>> 25, w = j + J | 0, Ve ^= w << 9 | w >>> 23, w = Ve + j | 0, Ae ^= w << 13 | w >>> 19, w = Ae + Ve | 0, J ^= w << 18 | w >>> 14, w = D + C | 0, ze ^= w << 7 | w >>> 25, w = ze + D | 0, ne ^= w << 9 | w >>> 23, w = ne + ze | 0, C ^= w << 13 | w >>> 19, w = C + ne | 0, D ^= w << 18 | w >>> 14, w = Le + L | 0, ye ^= w << 7 | w >>> 25, w = ye + Le | 0, B ^= w << 9 | w >>> 23, w = B + ye | 0, L ^= w << 13 | w >>> 19, w = L + B | 0, Le ^= w << 18 | w >>> 14, w = pe + ye | 0, Ae ^= w << 7 | w >>> 25, w = Ae + pe | 0, ne ^= w << 9 | w >>> 23, w = ne + Ae | 0, ye ^= w << 13 | w >>> 19, w = ye + ne | 0, pe ^= w << 18 | w >>> 14, w = J + ve | 0, C ^= w << 7 | w >>> 25, w = C + J | 0, B ^= w << 9 | w >>> 23, w = B + C | 0, ve ^= w << 13 | w >>> 19, w = ve + B | 0, J ^= w << 18 | w >>> 14, w = D + j | 0, L ^= w << 7 | w >>> 25, w = L + D | 0, V ^= w << 9 | w >>> 23, w = V + L | 0, j ^= w << 13 | w >>> 19, w = j + V | 0, D ^= w << 18 | w >>> 14, w = Le + ze | 0, _e ^= w << 7 | w >>> 25, w = _e + Le | 0, Ve ^= w << 9 | w >>> 23, w = Ve + _e | 0, ze ^= w << 13 | w >>> 19, w = ze + Ve | 0, Le ^= w << 18 | w >>> 14;
      l[0] = pe >>> 0 & 255, l[1] = pe >>> 8 & 255, l[2] = pe >>> 16 & 255, l[3] = pe >>> 24 & 255, l[4] = J >>> 0 & 255, l[5] = J >>> 8 & 255, l[6] = J >>> 16 & 255, l[7] = J >>> 24 & 255, l[8] = D >>> 0 & 255, l[9] = D >>> 8 & 255, l[10] = D >>> 16 & 255, l[11] = D >>> 24 & 255, l[12] = Le >>> 0 & 255, l[13] = Le >>> 8 & 255, l[14] = Le >>> 16 & 255, l[15] = Le >>> 24 & 255, l[16] = C >>> 0 & 255, l[17] = C >>> 8 & 255, l[18] = C >>> 16 & 255, l[19] = C >>> 24 & 255, l[20] = B >>> 0 & 255, l[21] = B >>> 8 & 255, l[22] = B >>> 16 & 255, l[23] = B >>> 24 & 255, l[24] = V >>> 0 & 255, l[25] = V >>> 8 & 255, l[26] = V >>> 16 & 255, l[27] = V >>> 24 & 255, l[28] = j >>> 0 & 255, l[29] = j >>> 8 & 255, l[30] = j >>> 16 & 255, l[31] = j >>> 24 & 255;
    }
    function ue(l, p, d, a) {
      P(l, p, d, a);
    }
    function Ge(l, p, d, a) {
      R(l, p, d, a);
    }
    var Je = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
    function je(l, p, d, a, g, S, E) {
      var U = new Uint8Array(16), z = new Uint8Array(64), we, X;
      for (X = 0; X < 16; X++) U[X] = 0;
      for (X = 0; X < 8; X++) U[X] = S[X];
      for (; g >= 64; ) {
        for (ue(z, U, E, Je), X = 0; X < 64; X++) l[p + X] = d[a + X] ^ z[X];
        for (we = 1, X = 8; X < 16; X++)
          we = we + (U[X] & 255) | 0, U[X] = we & 255, we >>>= 8;
        g -= 64, p += 64, a += 64;
      }
      if (g > 0)
        for (ue(z, U, E, Je), X = 0; X < g; X++) l[p + X] = d[a + X] ^ z[X];
      return 0;
    }
    function W(l, p, d, a, g) {
      var S = new Uint8Array(16), E = new Uint8Array(64), U, z;
      for (z = 0; z < 16; z++) S[z] = 0;
      for (z = 0; z < 8; z++) S[z] = a[z];
      for (; d >= 64; ) {
        for (ue(E, S, g, Je), z = 0; z < 64; z++) l[p + z] = E[z];
        for (U = 1, z = 8; z < 16; z++)
          U = U + (S[z] & 255) | 0, S[z] = U & 255, U >>>= 8;
        d -= 64, p += 64;
      }
      if (d > 0)
        for (ue(E, S, g, Je), z = 0; z < d; z++) l[p + z] = E[z];
      return 0;
    }
    function ie(l, p, d, a, g) {
      var S = new Uint8Array(32);
      Ge(S, a, g, Je);
      for (var E = new Uint8Array(8), U = 0; U < 8; U++) E[U] = a[U + 16];
      return W(l, p, d, E, S);
    }
    function te(l, p, d, a, g, S, E) {
      var U = new Uint8Array(32);
      Ge(U, S, E, Je);
      for (var z = new Uint8Array(8), we = 0; we < 8; we++) z[we] = S[we + 16];
      return je(l, p, d, a, g, z, U);
    }
    var xe = function(l) {
      this.buffer = new Uint8Array(16), this.r = new Uint16Array(10), this.h = new Uint16Array(10), this.pad = new Uint16Array(8), this.leftover = 0, this.fin = 0;
      var p, d, a, g, S, E, U, z;
      p = l[0] & 255 | (l[1] & 255) << 8, this.r[0] = p & 8191, d = l[2] & 255 | (l[3] & 255) << 8, this.r[1] = (p >>> 13 | d << 3) & 8191, a = l[4] & 255 | (l[5] & 255) << 8, this.r[2] = (d >>> 10 | a << 6) & 7939, g = l[6] & 255 | (l[7] & 255) << 8, this.r[3] = (a >>> 7 | g << 9) & 8191, S = l[8] & 255 | (l[9] & 255) << 8, this.r[4] = (g >>> 4 | S << 12) & 255, this.r[5] = S >>> 1 & 8190, E = l[10] & 255 | (l[11] & 255) << 8, this.r[6] = (S >>> 14 | E << 2) & 8191, U = l[12] & 255 | (l[13] & 255) << 8, this.r[7] = (E >>> 11 | U << 5) & 8065, z = l[14] & 255 | (l[15] & 255) << 8, this.r[8] = (U >>> 8 | z << 8) & 8191, this.r[9] = z >>> 5 & 127, this.pad[0] = l[16] & 255 | (l[17] & 255) << 8, this.pad[1] = l[18] & 255 | (l[19] & 255) << 8, this.pad[2] = l[20] & 255 | (l[21] & 255) << 8, this.pad[3] = l[22] & 255 | (l[23] & 255) << 8, this.pad[4] = l[24] & 255 | (l[25] & 255) << 8, this.pad[5] = l[26] & 255 | (l[27] & 255) << 8, this.pad[6] = l[28] & 255 | (l[29] & 255) << 8, this.pad[7] = l[30] & 255 | (l[31] & 255) << 8;
    };
    xe.prototype.blocks = function(l, p, d) {
      for (var a = this.fin ? 0 : 2048, g, S, E, U, z, we, X, ut, le, Ce, Be, Me, Ue, Oe, Pe, Te, pe, Ae, ne, ye = this.h[0], ve = this.h[1], J = this.h[2], C = this.h[3], B = this.h[4], V = this.h[5], j = this.h[6], D = this.h[7], L = this.h[8], _e = this.h[9], Ve = this.r[0], ze = this.r[1], Le = this.r[2], w = this.r[3], We = this.r[4], ft = this.r[5], ht = this.r[6], qe = this.r[7], ot = this.r[8], at = this.r[9]; d >= 16; )
        g = l[p + 0] & 255 | (l[p + 1] & 255) << 8, ye += g & 8191, S = l[p + 2] & 255 | (l[p + 3] & 255) << 8, ve += (g >>> 13 | S << 3) & 8191, E = l[p + 4] & 255 | (l[p + 5] & 255) << 8, J += (S >>> 10 | E << 6) & 8191, U = l[p + 6] & 255 | (l[p + 7] & 255) << 8, C += (E >>> 7 | U << 9) & 8191, z = l[p + 8] & 255 | (l[p + 9] & 255) << 8, B += (U >>> 4 | z << 12) & 8191, V += z >>> 1 & 8191, we = l[p + 10] & 255 | (l[p + 11] & 255) << 8, j += (z >>> 14 | we << 2) & 8191, X = l[p + 12] & 255 | (l[p + 13] & 255) << 8, D += (we >>> 11 | X << 5) & 8191, ut = l[p + 14] & 255 | (l[p + 15] & 255) << 8, L += (X >>> 8 | ut << 8) & 8191, _e += ut >>> 5 | a, le = 0, Ce = le, Ce += ye * Ve, Ce += ve * (5 * at), Ce += J * (5 * ot), Ce += C * (5 * qe), Ce += B * (5 * ht), le = Ce >>> 13, Ce &= 8191, Ce += V * (5 * ft), Ce += j * (5 * We), Ce += D * (5 * w), Ce += L * (5 * Le), Ce += _e * (5 * ze), le += Ce >>> 13, Ce &= 8191, Be = le, Be += ye * ze, Be += ve * Ve, Be += J * (5 * at), Be += C * (5 * ot), Be += B * (5 * qe), le = Be >>> 13, Be &= 8191, Be += V * (5 * ht), Be += j * (5 * ft), Be += D * (5 * We), Be += L * (5 * w), Be += _e * (5 * Le), le += Be >>> 13, Be &= 8191, Me = le, Me += ye * Le, Me += ve * ze, Me += J * Ve, Me += C * (5 * at), Me += B * (5 * ot), le = Me >>> 13, Me &= 8191, Me += V * (5 * qe), Me += j * (5 * ht), Me += D * (5 * ft), Me += L * (5 * We), Me += _e * (5 * w), le += Me >>> 13, Me &= 8191, Ue = le, Ue += ye * w, Ue += ve * Le, Ue += J * ze, Ue += C * Ve, Ue += B * (5 * at), le = Ue >>> 13, Ue &= 8191, Ue += V * (5 * ot), Ue += j * (5 * qe), Ue += D * (5 * ht), Ue += L * (5 * ft), Ue += _e * (5 * We), le += Ue >>> 13, Ue &= 8191, Oe = le, Oe += ye * We, Oe += ve * w, Oe += J * Le, Oe += C * ze, Oe += B * Ve, le = Oe >>> 13, Oe &= 8191, Oe += V * (5 * at), Oe += j * (5 * ot), Oe += D * (5 * qe), Oe += L * (5 * ht), Oe += _e * (5 * ft), le += Oe >>> 13, Oe &= 8191, Pe = le, Pe += ye * ft, Pe += ve * We, Pe += J * w, Pe += C * Le, Pe += B * ze, le = Pe >>> 13, Pe &= 8191, Pe += V * Ve, Pe += j * (5 * at), Pe += D * (5 * ot), Pe += L * (5 * qe), Pe += _e * (5 * ht), le += Pe >>> 13, Pe &= 8191, Te = le, Te += ye * ht, Te += ve * ft, Te += J * We, Te += C * w, Te += B * Le, le = Te >>> 13, Te &= 8191, Te += V * ze, Te += j * Ve, Te += D * (5 * at), Te += L * (5 * ot), Te += _e * (5 * qe), le += Te >>> 13, Te &= 8191, pe = le, pe += ye * qe, pe += ve * ht, pe += J * ft, pe += C * We, pe += B * w, le = pe >>> 13, pe &= 8191, pe += V * Le, pe += j * ze, pe += D * Ve, pe += L * (5 * at), pe += _e * (5 * ot), le += pe >>> 13, pe &= 8191, Ae = le, Ae += ye * ot, Ae += ve * qe, Ae += J * ht, Ae += C * ft, Ae += B * We, le = Ae >>> 13, Ae &= 8191, Ae += V * w, Ae += j * Le, Ae += D * ze, Ae += L * Ve, Ae += _e * (5 * at), le += Ae >>> 13, Ae &= 8191, ne = le, ne += ye * at, ne += ve * ot, ne += J * qe, ne += C * ht, ne += B * ft, le = ne >>> 13, ne &= 8191, ne += V * We, ne += j * w, ne += D * Le, ne += L * ze, ne += _e * Ve, le += ne >>> 13, ne &= 8191, le = (le << 2) + le | 0, le = le + Ce | 0, Ce = le & 8191, le = le >>> 13, Be += le, ye = Ce, ve = Be, J = Me, C = Ue, B = Oe, V = Pe, j = Te, D = pe, L = Ae, _e = ne, p += 16, d -= 16;
      this.h[0] = ye, this.h[1] = ve, this.h[2] = J, this.h[3] = C, this.h[4] = B, this.h[5] = V, this.h[6] = j, this.h[7] = D, this.h[8] = L, this.h[9] = _e;
    }, xe.prototype.finish = function(l, p) {
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
    }, xe.prototype.update = function(l, p, d) {
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
    function tt(l, p, d, a, g, S) {
      var E = new xe(S);
      return E.update(d, a, g), E.finish(l, p), 0;
    }
    function At(l, p, d, a, g, S) {
      var E = new Uint8Array(16);
      return tt(E, 0, d, a, g, S), O(l, p, E, 0);
    }
    function It(l, p, d, a, g) {
      var S;
      if (d < 32) return -1;
      for (te(l, 0, p, 0, d, a, g), tt(l, 16, l, 32, d - 32, l), S = 0; S < 16; S++) l[S] = 0;
      return 0;
    }
    function dt(l, p, d, a, g) {
      var S, E = new Uint8Array(32);
      if (d < 32 || (ie(E, 0, 32, a, g), At(p, 16, p, 32, d - 32, E) !== 0)) return -1;
      for (te(l, 0, p, 0, d, a, g), S = 0; S < 32; S++) l[S] = 0;
      return 0;
    }
    function Qe(l, p) {
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
    function gt(l, p) {
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
      return gt(d, l), gt(a, p), I(d, 0, a, 0);
    }
    function Dt(l) {
      var p = new Uint8Array(32);
      return gt(p, l), p[0] & 1;
    }
    function fe(l, p) {
      var d;
      for (d = 0; d < 16; d++) l[d] = p[2 * d] + (p[2 * d + 1] << 8);
      l[15] &= 32767;
    }
    function st(l, p, d) {
      for (var a = 0; a < 16; a++) l[a] = p[a] + d[a];
    }
    function vt(l, p, d) {
      for (var a = 0; a < 16; a++) l[a] = p[a] - d[a];
    }
    function ee(l, p, d) {
      var a, g, S = 0, E = 0, U = 0, z = 0, we = 0, X = 0, ut = 0, le = 0, Ce = 0, Be = 0, Me = 0, Ue = 0, Oe = 0, Pe = 0, Te = 0, pe = 0, Ae = 0, ne = 0, ye = 0, ve = 0, J = 0, C = 0, B = 0, V = 0, j = 0, D = 0, L = 0, _e = 0, Ve = 0, ze = 0, Le = 0, w = d[0], We = d[1], ft = d[2], ht = d[3], qe = d[4], ot = d[5], at = d[6], $t = d[7], wt = d[8], Nt = d[9], Pt = d[10], jt = d[11], Lt = d[12], Qt = d[13], er = d[14], tr = d[15];
      a = p[0], S += a * w, E += a * We, U += a * ft, z += a * ht, we += a * qe, X += a * ot, ut += a * at, le += a * $t, Ce += a * wt, Be += a * Nt, Me += a * Pt, Ue += a * jt, Oe += a * Lt, Pe += a * Qt, Te += a * er, pe += a * tr, a = p[1], E += a * w, U += a * We, z += a * ft, we += a * ht, X += a * qe, ut += a * ot, le += a * at, Ce += a * $t, Be += a * wt, Me += a * Nt, Ue += a * Pt, Oe += a * jt, Pe += a * Lt, Te += a * Qt, pe += a * er, Ae += a * tr, a = p[2], U += a * w, z += a * We, we += a * ft, X += a * ht, ut += a * qe, le += a * ot, Ce += a * at, Be += a * $t, Me += a * wt, Ue += a * Nt, Oe += a * Pt, Pe += a * jt, Te += a * Lt, pe += a * Qt, Ae += a * er, ne += a * tr, a = p[3], z += a * w, we += a * We, X += a * ft, ut += a * ht, le += a * qe, Ce += a * ot, Be += a * at, Me += a * $t, Ue += a * wt, Oe += a * Nt, Pe += a * Pt, Te += a * jt, pe += a * Lt, Ae += a * Qt, ne += a * er, ye += a * tr, a = p[4], we += a * w, X += a * We, ut += a * ft, le += a * ht, Ce += a * qe, Be += a * ot, Me += a * at, Ue += a * $t, Oe += a * wt, Pe += a * Nt, Te += a * Pt, pe += a * jt, Ae += a * Lt, ne += a * Qt, ye += a * er, ve += a * tr, a = p[5], X += a * w, ut += a * We, le += a * ft, Ce += a * ht, Be += a * qe, Me += a * ot, Ue += a * at, Oe += a * $t, Pe += a * wt, Te += a * Nt, pe += a * Pt, Ae += a * jt, ne += a * Lt, ye += a * Qt, ve += a * er, J += a * tr, a = p[6], ut += a * w, le += a * We, Ce += a * ft, Be += a * ht, Me += a * qe, Ue += a * ot, Oe += a * at, Pe += a * $t, Te += a * wt, pe += a * Nt, Ae += a * Pt, ne += a * jt, ye += a * Lt, ve += a * Qt, J += a * er, C += a * tr, a = p[7], le += a * w, Ce += a * We, Be += a * ft, Me += a * ht, Ue += a * qe, Oe += a * ot, Pe += a * at, Te += a * $t, pe += a * wt, Ae += a * Nt, ne += a * Pt, ye += a * jt, ve += a * Lt, J += a * Qt, C += a * er, B += a * tr, a = p[8], Ce += a * w, Be += a * We, Me += a * ft, Ue += a * ht, Oe += a * qe, Pe += a * ot, Te += a * at, pe += a * $t, Ae += a * wt, ne += a * Nt, ye += a * Pt, ve += a * jt, J += a * Lt, C += a * Qt, B += a * er, V += a * tr, a = p[9], Be += a * w, Me += a * We, Ue += a * ft, Oe += a * ht, Pe += a * qe, Te += a * ot, pe += a * at, Ae += a * $t, ne += a * wt, ye += a * Nt, ve += a * Pt, J += a * jt, C += a * Lt, B += a * Qt, V += a * er, j += a * tr, a = p[10], Me += a * w, Ue += a * We, Oe += a * ft, Pe += a * ht, Te += a * qe, pe += a * ot, Ae += a * at, ne += a * $t, ye += a * wt, ve += a * Nt, J += a * Pt, C += a * jt, B += a * Lt, V += a * Qt, j += a * er, D += a * tr, a = p[11], Ue += a * w, Oe += a * We, Pe += a * ft, Te += a * ht, pe += a * qe, Ae += a * ot, ne += a * at, ye += a * $t, ve += a * wt, J += a * Nt, C += a * Pt, B += a * jt, V += a * Lt, j += a * Qt, D += a * er, L += a * tr, a = p[12], Oe += a * w, Pe += a * We, Te += a * ft, pe += a * ht, Ae += a * qe, ne += a * ot, ye += a * at, ve += a * $t, J += a * wt, C += a * Nt, B += a * Pt, V += a * jt, j += a * Lt, D += a * Qt, L += a * er, _e += a * tr, a = p[13], Pe += a * w, Te += a * We, pe += a * ft, Ae += a * ht, ne += a * qe, ye += a * ot, ve += a * at, J += a * $t, C += a * wt, B += a * Nt, V += a * Pt, j += a * jt, D += a * Lt, L += a * Qt, _e += a * er, Ve += a * tr, a = p[14], Te += a * w, pe += a * We, Ae += a * ft, ne += a * ht, ye += a * qe, ve += a * ot, J += a * at, C += a * $t, B += a * wt, V += a * Nt, j += a * Pt, D += a * jt, L += a * Lt, _e += a * Qt, Ve += a * er, ze += a * tr, a = p[15], pe += a * w, Ae += a * We, ne += a * ft, ye += a * ht, ve += a * qe, J += a * ot, C += a * at, B += a * $t, V += a * wt, j += a * Nt, D += a * Pt, L += a * jt, _e += a * Lt, Ve += a * Qt, ze += a * er, Le += a * tr, S += 38 * Ae, E += 38 * ne, U += 38 * ye, z += 38 * ve, we += 38 * J, X += 38 * C, ut += 38 * B, le += 38 * V, Ce += 38 * j, Be += 38 * D, Me += 38 * L, Ue += 38 * _e, Oe += 38 * Ve, Pe += 38 * ze, Te += 38 * Le, g = 1, a = S + g + 65535, g = Math.floor(a / 65536), S = a - g * 65536, a = E + g + 65535, g = Math.floor(a / 65536), E = a - g * 65536, a = U + g + 65535, g = Math.floor(a / 65536), U = a - g * 65536, a = z + g + 65535, g = Math.floor(a / 65536), z = a - g * 65536, a = we + g + 65535, g = Math.floor(a / 65536), we = a - g * 65536, a = X + g + 65535, g = Math.floor(a / 65536), X = a - g * 65536, a = ut + g + 65535, g = Math.floor(a / 65536), ut = a - g * 65536, a = le + g + 65535, g = Math.floor(a / 65536), le = a - g * 65536, a = Ce + g + 65535, g = Math.floor(a / 65536), Ce = a - g * 65536, a = Be + g + 65535, g = Math.floor(a / 65536), Be = a - g * 65536, a = Me + g + 65535, g = Math.floor(a / 65536), Me = a - g * 65536, a = Ue + g + 65535, g = Math.floor(a / 65536), Ue = a - g * 65536, a = Oe + g + 65535, g = Math.floor(a / 65536), Oe = a - g * 65536, a = Pe + g + 65535, g = Math.floor(a / 65536), Pe = a - g * 65536, a = Te + g + 65535, g = Math.floor(a / 65536), Te = a - g * 65536, a = pe + g + 65535, g = Math.floor(a / 65536), pe = a - g * 65536, S += g - 1 + 37 * (g - 1), g = 1, a = S + g + 65535, g = Math.floor(a / 65536), S = a - g * 65536, a = E + g + 65535, g = Math.floor(a / 65536), E = a - g * 65536, a = U + g + 65535, g = Math.floor(a / 65536), U = a - g * 65536, a = z + g + 65535, g = Math.floor(a / 65536), z = a - g * 65536, a = we + g + 65535, g = Math.floor(a / 65536), we = a - g * 65536, a = X + g + 65535, g = Math.floor(a / 65536), X = a - g * 65536, a = ut + g + 65535, g = Math.floor(a / 65536), ut = a - g * 65536, a = le + g + 65535, g = Math.floor(a / 65536), le = a - g * 65536, a = Ce + g + 65535, g = Math.floor(a / 65536), Ce = a - g * 65536, a = Be + g + 65535, g = Math.floor(a / 65536), Be = a - g * 65536, a = Me + g + 65535, g = Math.floor(a / 65536), Me = a - g * 65536, a = Ue + g + 65535, g = Math.floor(a / 65536), Ue = a - g * 65536, a = Oe + g + 65535, g = Math.floor(a / 65536), Oe = a - g * 65536, a = Pe + g + 65535, g = Math.floor(a / 65536), Pe = a - g * 65536, a = Te + g + 65535, g = Math.floor(a / 65536), Te = a - g * 65536, a = pe + g + 65535, g = Math.floor(a / 65536), pe = a - g * 65536, S += g - 1 + 37 * (g - 1), l[0] = S, l[1] = E, l[2] = U, l[3] = z, l[4] = we, l[5] = X, l[6] = ut, l[7] = le, l[8] = Ce, l[9] = Be, l[10] = Me, l[11] = Ue, l[12] = Oe, l[13] = Pe, l[14] = Te, l[15] = pe;
    }
    function pt(l, p) {
      ee(l, p, p);
    }
    function Vt(l, p) {
      var d = t(), a;
      for (a = 0; a < 16; a++) d[a] = p[a];
      for (a = 253; a >= 0; a--)
        pt(d, d), a !== 2 && a !== 4 && ee(d, d, p);
      for (a = 0; a < 16; a++) l[a] = d[a];
    }
    function fs(l, p) {
      var d = t(), a;
      for (a = 0; a < 16; a++) d[a] = p[a];
      for (a = 250; a >= 0; a--)
        pt(d, d), a !== 1 && ee(d, d, p);
      for (a = 0; a < 16; a++) l[a] = d[a];
    }
    function Ci(l, p, d) {
      var a = new Uint8Array(32), g = new Float64Array(80), S, E, U = t(), z = t(), we = t(), X = t(), ut = t(), le = t();
      for (E = 0; E < 31; E++) a[E] = p[E];
      for (a[31] = p[31] & 127 | 64, a[0] &= 248, fe(g, d), E = 0; E < 16; E++)
        z[E] = g[E], X[E] = U[E] = we[E] = 0;
      for (U[0] = X[0] = 1, E = 254; E >= 0; --E)
        S = a[E >>> 3] >>> (E & 7) & 1, Ee(U, z, S), Ee(we, X, S), st(ut, U, we), vt(U, U, we), st(we, z, X), vt(z, z, X), pt(X, ut), pt(le, U), ee(U, we, U), ee(we, z, ut), st(ut, U, we), vt(U, U, we), pt(z, U), vt(we, X, le), ee(U, we, u), st(U, U, X), ee(we, we, U), ee(U, X, le), ee(X, z, g), pt(z, ut), Ee(U, z, S), Ee(we, X, S);
      for (E = 0; E < 16; E++)
        g[E + 16] = U[E], g[E + 32] = we[E], g[E + 48] = z[E], g[E + 64] = X[E];
      var Ce = g.subarray(32), Be = g.subarray(16);
      return Vt(Ce, Ce), ee(Be, Be, Ce), gt(l, Be), 0;
    }
    function or(l, p) {
      return Ci(l, p, s);
    }
    function hs(l, p) {
      return n(p, 32), or(l, p);
    }
    function pn(l, p, d) {
      var a = new Uint8Array(32);
      return Ci(a, d, p), Ge(l, i, a, Je);
    }
    var ds = It, $c = dt;
    function ps(l, p, d, a, g, S) {
      var E = new Uint8Array(32);
      return pn(E, g, S), ds(l, p, d, a, E);
    }
    function ko(l, p, d, a, g, S) {
      var E = new Uint8Array(32);
      return pn(E, g, S), $c(l, p, d, a, E);
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
      for (var g = new Int32Array(16), S = new Int32Array(16), E, U, z, we, X, ut, le, Ce, Be, Me, Ue, Oe, Pe, Te, pe, Ae, ne, ye, ve, J, C, B, V, j, D, L, _e = l[0], Ve = l[1], ze = l[2], Le = l[3], w = l[4], We = l[5], ft = l[6], ht = l[7], qe = p[0], ot = p[1], at = p[2], $t = p[3], wt = p[4], Nt = p[5], Pt = p[6], jt = p[7], Lt = 0; a >= 128; ) {
        for (ve = 0; ve < 16; ve++)
          J = 8 * ve + Lt, g[ve] = d[J + 0] << 24 | d[J + 1] << 16 | d[J + 2] << 8 | d[J + 3], S[ve] = d[J + 4] << 24 | d[J + 5] << 16 | d[J + 6] << 8 | d[J + 7];
        for (ve = 0; ve < 80; ve++)
          if (E = _e, U = Ve, z = ze, we = Le, X = w, ut = We, le = ft, Ce = ht, Be = qe, Me = ot, Ue = at, Oe = $t, Pe = wt, Te = Nt, pe = Pt, Ae = jt, C = ht, B = jt, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = (w >>> 14 | wt << 18) ^ (w >>> 18 | wt << 14) ^ (wt >>> 9 | w << 23), B = (wt >>> 14 | w << 18) ^ (wt >>> 18 | w << 14) ^ (w >>> 9 | wt << 23), V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, C = w & We ^ ~w & ft, B = wt & Nt ^ ~wt & Pt, V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, C = ys[ve * 2], B = ys[ve * 2 + 1], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, C = g[ve % 16], B = S[ve % 16], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, ne = D & 65535 | L << 16, ye = V & 65535 | j << 16, C = ne, B = ye, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = (_e >>> 28 | qe << 4) ^ (qe >>> 2 | _e << 30) ^ (qe >>> 7 | _e << 25), B = (qe >>> 28 | _e << 4) ^ (_e >>> 2 | qe << 30) ^ (_e >>> 7 | qe << 25), V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, C = _e & Ve ^ _e & ze ^ Ve & ze, B = qe & ot ^ qe & at ^ ot & at, V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, Ce = D & 65535 | L << 16, Ae = V & 65535 | j << 16, C = we, B = Oe, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = ne, B = ye, V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, we = D & 65535 | L << 16, Oe = V & 65535 | j << 16, Ve = E, ze = U, Le = z, w = we, We = X, ft = ut, ht = le, _e = Ce, ot = Be, at = Me, $t = Ue, wt = Oe, Nt = Pe, Pt = Te, jt = pe, qe = Ae, ve % 16 === 15)
            for (J = 0; J < 16; J++)
              C = g[J], B = S[J], V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = g[(J + 9) % 16], B = S[(J + 9) % 16], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, ne = g[(J + 1) % 16], ye = S[(J + 1) % 16], C = (ne >>> 1 | ye << 31) ^ (ne >>> 8 | ye << 24) ^ ne >>> 7, B = (ye >>> 1 | ne << 31) ^ (ye >>> 8 | ne << 24) ^ (ye >>> 7 | ne << 25), V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, ne = g[(J + 14) % 16], ye = S[(J + 14) % 16], C = (ne >>> 19 | ye << 13) ^ (ye >>> 29 | ne << 3) ^ ne >>> 6, B = (ye >>> 19 | ne << 13) ^ (ne >>> 29 | ye << 3) ^ (ye >>> 6 | ne << 26), V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, g[J] = D & 65535 | L << 16, S[J] = V & 65535 | j << 16;
        C = _e, B = qe, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[0], B = p[0], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[0] = _e = D & 65535 | L << 16, p[0] = qe = V & 65535 | j << 16, C = Ve, B = ot, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[1], B = p[1], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[1] = Ve = D & 65535 | L << 16, p[1] = ot = V & 65535 | j << 16, C = ze, B = at, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[2], B = p[2], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[2] = ze = D & 65535 | L << 16, p[2] = at = V & 65535 | j << 16, C = Le, B = $t, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[3], B = p[3], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[3] = Le = D & 65535 | L << 16, p[3] = $t = V & 65535 | j << 16, C = w, B = wt, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[4], B = p[4], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[4] = w = D & 65535 | L << 16, p[4] = wt = V & 65535 | j << 16, C = We, B = Nt, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[5], B = p[5], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[5] = We = D & 65535 | L << 16, p[5] = Nt = V & 65535 | j << 16, C = ft, B = Pt, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[6], B = p[6], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[6] = ft = D & 65535 | L << 16, p[6] = Pt = V & 65535 | j << 16, C = ht, B = jt, V = B & 65535, j = B >>> 16, D = C & 65535, L = C >>> 16, C = l[7], B = p[7], V += B & 65535, j += B >>> 16, D += C & 65535, L += C >>> 16, j += V >>> 16, D += j >>> 16, L += D >>> 16, l[7] = ht = D & 65535 | L << 16, p[7] = jt = V & 65535 | j << 16, Lt += 128, a -= 128;
      }
      return a;
    }
    function Zr(l, p, d) {
      var a = new Int32Array(8), g = new Int32Array(8), S = new Uint8Array(256), E, U = d;
      for (a[0] = 1779033703, a[1] = 3144134277, a[2] = 1013904242, a[3] = 2773480762, a[4] = 1359893119, a[5] = 2600822924, a[6] = 528734635, a[7] = 1541459225, g[0] = 4089235720, g[1] = 2227873595, g[2] = 4271175723, g[3] = 1595750129, g[4] = 2917565137, g[5] = 725511199, g[6] = 4215389547, g[7] = 327033209, gs(a, g, p, d), d %= 128, E = 0; E < d; E++) S[E] = p[U - d + E];
      for (S[d] = 128, d = 256 - 128 * (d < 112 ? 1 : 0), S[d - 9] = 0, v(S, d - 8, U / 536870912 | 0, U << 3), gs(a, g, S, d), E = 0; E < 8; E++) v(l, 8 * E, a[E], g[E]);
      return 0;
    }
    function Xn(l, p) {
      var d = t(), a = t(), g = t(), S = t(), E = t(), U = t(), z = t(), we = t(), X = t();
      vt(d, l[1], l[0]), vt(X, p[1], p[0]), ee(d, d, X), st(a, l[0], l[1]), st(X, p[0], p[1]), ee(a, a, X), ee(g, l[3], p[3]), ee(g, g, m), ee(S, l[2], p[2]), st(S, S, S), vt(E, a, d), vt(U, S, g), st(z, S, g), st(we, a, d), ee(l[0], E, U), ee(l[1], we, z), ee(l[2], z, U), ee(l[3], E, we);
    }
    function Bi(l, p, d) {
      var a;
      for (a = 0; a < 4; a++)
        Ee(l[a], p[a], d);
    }
    function vs(l, p) {
      var d = t(), a = t(), g = t();
      Vt(g, p[2]), ee(d, p[0], g), ee(a, p[1], g), gt(l, a), l[31] ^= Dt(d) << 7;
    }
    function ms(l, p, d) {
      var a, g;
      for (Qe(l[0], o), Qe(l[1], c), Qe(l[2], c), Qe(l[3], o), g = 255; g >= 0; --g)
        a = d[g / 8 | 0] >> (g & 7) & 1, Bi(l, p, a), Xn(p, l), Xn(l, l), Bi(l, p, a);
    }
    function Oi(l, p) {
      var d = [t(), t(), t(), t()];
      Qe(d[0], x), Qe(d[1], G), Qe(d[2], c), ee(d[3], x, G), ms(l, d, p);
    }
    function ws(l, p, d) {
      var a = new Uint8Array(64), g = [t(), t(), t(), t()], S;
      for (d || n(p, 32), Zr(a, p, 32), a[0] &= 248, a[31] &= 127, a[31] |= 64, Oi(g, a), vs(l, g), S = 0; S < 32; S++) p[S + 32] = l[S];
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
      var g = new Uint8Array(64), S = new Uint8Array(64), E = new Uint8Array(64), U, z, we = new Float64Array(64), X = [t(), t(), t(), t()];
      Zr(g, a, 32), g[0] &= 248, g[31] &= 127, g[31] |= 64;
      var ut = d + 64;
      for (U = 0; U < d; U++) l[64 + U] = p[U];
      for (U = 0; U < 32; U++) l[32 + U] = g[32 + U];
      for (Zr(E, l.subarray(32), d + 32), xs(E), Oi(X, E), vs(l, X), U = 32; U < 64; U++) l[U] = a[U];
      for (Zr(S, l, d + 64), xs(S), U = 0; U < 64; U++) we[U] = 0;
      for (U = 0; U < 32; U++) we[U] = E[U];
      for (U = 0; U < 32; U++)
        for (z = 0; z < 32; z++)
          we[U + z] += S[U] * g[z];
      return bs(l.subarray(32), we), ut;
    }
    function As(l, p) {
      var d = t(), a = t(), g = t(), S = t(), E = t(), U = t(), z = t();
      return Qe(l[2], c), fe(l[1], p), pt(g, l[1]), ee(S, g, h), vt(g, g, l[2]), st(S, l[2], S), pt(E, S), pt(U, E), ee(z, U, E), ee(d, z, g), ee(d, d, S), fs(d, d), ee(d, d, g), ee(d, d, S), ee(d, d, S), ee(l[0], d, S), pt(a, l[0]), ee(a, a, S), Ut(a, g) && ee(l[0], l[0], N), pt(a, l[0]), ee(a, a, S), Ut(a, g) ? -1 : (Dt(l[0]) === p[31] >> 7 && vt(l[0], o, l[0]), ee(l[3], l[0], l[1]), 0);
    }
    function _(l, p, d, a) {
      var g, S = new Uint8Array(32), E = new Uint8Array(64), U = [t(), t(), t(), t()], z = [t(), t(), t(), t()];
      if (d < 64 || As(z, a)) return -1;
      for (g = 0; g < d; g++) l[g] = p[g];
      for (g = 0; g < 32; g++) l[g + 32] = a[g];
      if (Zr(E, l, d), xs(E), ms(U, z, E), Oi(z, p.subarray(32)), Xn(U, z), vs(S, U), d -= 64, I(p, 0, S, 0)) {
        for (g = 0; g < d; g++) l[g] = 0;
        return -1;
      }
      for (g = 0; g < d; g++) l[g] = p[g + 64];
      return d;
    }
    var k = 32, T = 24, q = 32, be = 16, St = 32, _t = 32, Re = 32, Z = 32, re = 32, he = T, ge = q, Xe = be, rt = 64, mt = 32, zt = 64, Ti = 32, Ss = 64;
    e.lowlevel = {
      crypto_core_hsalsa20: Ge,
      crypto_stream_xor: te,
      crypto_stream: ie,
      crypto_stream_salsa20_xor: je,
      crypto_stream_salsa20: W,
      crypto_onetimeauth: tt,
      crypto_onetimeauth_verify: At,
      crypto_verify_16: O,
      crypto_verify_32: I,
      crypto_secretbox: It,
      crypto_secretbox_open: dt,
      crypto_scalarmult: Ci,
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
      crypto_secretbox_ZEROBYTES: q,
      crypto_secretbox_BOXZEROBYTES: be,
      crypto_scalarmult_BYTES: St,
      crypto_scalarmult_SCALARBYTES: _t,
      crypto_box_PUBLICKEYBYTES: Re,
      crypto_box_SECRETKEYBYTES: Z,
      crypto_box_BEFORENMBYTES: re,
      crypto_box_NONCEBYTES: he,
      crypto_box_ZEROBYTES: ge,
      crypto_box_BOXZEROBYTES: Xe,
      crypto_sign_BYTES: rt,
      crypto_sign_PUBLICKEYBYTES: mt,
      crypto_sign_SECRETKEYBYTES: zt,
      crypto_sign_SEEDBYTES: Ti,
      crypto_hash_BYTES: Ss,
      gf: t,
      D: h,
      L: Wr,
      pack25519: gt,
      unpack25519: fe,
      M: ee,
      A: st,
      S: pt,
      Z: vt,
      pow2523: fs,
      add: Xn,
      set25519: Qe,
      modL: bs,
      scalarmult: ms,
      scalarbase: Oi
    };
    function Bo(l, p) {
      if (l.length !== k) throw new Error("bad key size");
      if (p.length !== T) throw new Error("bad nonce size");
    }
    function Py(l, p) {
      if (l.length !== Re) throw new Error("bad public key size");
      if (p.length !== Z) throw new Error("bad secret key size");
    }
    function xr() {
      for (var l = 0; l < arguments.length; l++)
        if (!(arguments[l] instanceof Uint8Array))
          throw new TypeError("unexpected type, use Uint8Array");
    }
    function Ef(l) {
      for (var p = 0; p < l.length; p++) l[p] = 0;
    }
    e.randomBytes = function(l) {
      var p = new Uint8Array(l);
      return n(p, l), p;
    }, e.secretbox = function(l, p, d) {
      xr(l, p, d), Bo(d, p);
      for (var a = new Uint8Array(q + l.length), g = new Uint8Array(a.length), S = 0; S < l.length; S++) a[S + q] = l[S];
      return It(g, a, a.length, p, d), g.subarray(be);
    }, e.secretbox.open = function(l, p, d) {
      xr(l, p, d), Bo(d, p);
      for (var a = new Uint8Array(be + l.length), g = new Uint8Array(a.length), S = 0; S < l.length; S++) a[S + be] = l[S];
      return a.length < 32 || dt(g, a, a.length, p, d) !== 0 ? null : g.subarray(q);
    }, e.secretbox.keyLength = k, e.secretbox.nonceLength = T, e.secretbox.overheadLength = be, e.scalarMult = function(l, p) {
      if (xr(l, p), l.length !== _t) throw new Error("bad n size");
      if (p.length !== St) throw new Error("bad p size");
      var d = new Uint8Array(St);
      return Ci(d, l, p), d;
    }, e.scalarMult.base = function(l) {
      if (xr(l), l.length !== _t) throw new Error("bad n size");
      var p = new Uint8Array(St);
      return or(p, l), p;
    }, e.scalarMult.scalarLength = _t, e.scalarMult.groupElementLength = St, e.box = function(l, p, d, a) {
      var g = e.box.before(d, a);
      return e.secretbox(l, p, g);
    }, e.box.before = function(l, p) {
      xr(l, p), Py(l, p);
      var d = new Uint8Array(re);
      return pn(d, l, p), d;
    }, e.box.after = e.secretbox, e.box.open = function(l, p, d, a) {
      var g = e.box.before(d, a);
      return e.secretbox.open(l, p, g);
    }, e.box.open.after = e.secretbox.open, e.box.keyPair = function() {
      var l = new Uint8Array(Re), p = new Uint8Array(Z);
      return hs(l, p), { publicKey: l, secretKey: p };
    }, e.box.keyPair.fromSecretKey = function(l) {
      if (xr(l), l.length !== Z)
        throw new Error("bad secret key size");
      var p = new Uint8Array(Re);
      return or(p, l), { publicKey: p, secretKey: new Uint8Array(l) };
    }, e.box.publicKeyLength = Re, e.box.secretKeyLength = Z, e.box.sharedKeyLength = re, e.box.nonceLength = he, e.box.overheadLength = e.secretbox.overheadLength, e.sign = function(l, p) {
      if (xr(l, p), p.length !== zt)
        throw new Error("bad secret key size");
      var d = new Uint8Array(rt + l.length);
      return Co(d, l, l.length, p), d;
    }, e.sign.open = function(l, p) {
      if (xr(l, p), p.length !== mt)
        throw new Error("bad public key size");
      var d = new Uint8Array(l.length), a = _(d, l, l.length, p);
      if (a < 0) return null;
      for (var g = new Uint8Array(a), S = 0; S < g.length; S++) g[S] = d[S];
      return g;
    }, e.sign.detached = function(l, p) {
      for (var d = e.sign(l, p), a = new Uint8Array(rt), g = 0; g < a.length; g++) a[g] = d[g];
      return a;
    }, e.sign.detached.verify = function(l, p, d) {
      if (xr(l, p, d), p.length !== rt)
        throw new Error("bad signature size");
      if (d.length !== mt)
        throw new Error("bad public key size");
      var a = new Uint8Array(rt + l.length), g = new Uint8Array(rt + l.length), S;
      for (S = 0; S < rt; S++) a[S] = p[S];
      for (S = 0; S < l.length; S++) a[S + rt] = l[S];
      return _(g, a, a.length, d) >= 0;
    }, e.sign.keyPair = function() {
      var l = new Uint8Array(mt), p = new Uint8Array(zt);
      return ws(l, p), { publicKey: l, secretKey: p };
    }, e.sign.keyPair.fromSecretKey = function(l) {
      if (xr(l), l.length !== zt)
        throw new Error("bad secret key size");
      for (var p = new Uint8Array(mt), d = 0; d < p.length; d++) p[d] = l[32 + d];
      return { publicKey: p, secretKey: new Uint8Array(l) };
    }, e.sign.keyPair.fromSeed = function(l) {
      if (xr(l), l.length !== Ti)
        throw new Error("bad seed size");
      for (var p = new Uint8Array(mt), d = new Uint8Array(zt), a = 0; a < 32; a++) d[a] = l[a];
      return ws(p, d, !0), { publicKey: p, secretKey: d };
    }, e.sign.publicKeyLength = mt, e.sign.secretKeyLength = zt, e.sign.seedLength = Ti, e.sign.signatureLength = rt, e.hash = function(l) {
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
          Ef(S);
        });
      } else typeof N1 < "u" && (l = R1, l && l.randomBytes && e.setPRNG(function(d, a) {
        var g, S = l.randomBytes(a);
        for (g = 0; g < a; g++) d[g] = S[g];
        Ef(S);
      }));
    }();
  })(r.exports ? r.exports : self.nacl = self.nacl || {});
})(V0);
var U1 = V0.exports;
const L0 = /* @__PURE__ */ Jy(U1);
function D1() {
  return L0.box.keyPair();
}
async function _i(r, e) {
  const t = sessionStorage.getItem("sessionKey"), n = sessionStorage.getItem("sessionId");
  console.groupCollapsed("Attestation");
  try {
    if (t && n && !r) {
      const o = js(t);
      return console.log("Using existing attestation from session storage."), { sessionKey: o, sessionId: n };
    }
    const i = window.crypto.randomUUID();
    console.log("Generated attestation nonce:", i);
    const s = await T1(i, e);
    if (s && s.public_key) {
      console.log("Attestation document verification succeeded");
      const o = D1();
      console.log("Generated client key pair");
      const c = new Uint8Array(s.public_key), { encrypted_session_key: u, session_id: h } = await ew(
        Br(o.publicKey),
        i,
        e
      );
      console.log("Key exchange completed.");
      const m = L0.scalarMult(o.secretKey, c), x = js(u), G = 12, N = x.slice(0, G), v = x.slice(G), O = new Tu(m).open(N, v);
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
let lt = "";
function $1(r) {
  lt = r;
}
async function M1(r, e) {
  return Tt(
    `${lt}/platform/login`,
    "POST",
    { email: r, password: e },
    void 0,
    "Failed to login"
  );
}
async function V1(r, e, t, n) {
  return Tt(
    `${lt}/platform/register`,
    "POST",
    { email: r, password: e, invite_code: t, name: n },
    void 0,
    "Failed to register"
  );
}
async function L1(r) {
  return Tt(
    `${lt}/platform/logout`,
    "POST",
    { refresh_token: r },
    void 0,
    "Failed to logout"
  );
}
async function H1() {
  const r = window.localStorage.getItem("refresh_token");
  if (!r) throw new Error("No refresh token available");
  const e = { refresh_token: r };
  try {
    const t = await Tt(
      `${lt}/platform/refresh`,
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
async function H0(r) {
  return Ne(
    `${lt}/platform/orgs`,
    "POST",
    { name: r }
  );
}
async function F0() {
  return Ne(
    `${lt}/platform/orgs`,
    "GET",
    void 0
  );
}
async function z0(r) {
  return Ne(
    `${lt}/platform/orgs/${r}`,
    "DELETE",
    void 0
  );
}
async function G0(r, e, t) {
  return Ne(
    `${lt}/platform/orgs/${r}/projects`,
    "POST",
    { name: e, description: t }
  );
}
async function q0(r) {
  return Ne(
    `${lt}/platform/orgs/${r}/projects`,
    "GET",
    void 0
  );
}
async function K0(r, e) {
  return Ne(
    `${lt}/platform/orgs/${r}/projects/${e}`,
    "GET",
    void 0
  );
}
async function Z0(r, e, t) {
  return Ne(
    `${lt}/platform/orgs/${r}/projects/${e}`,
    "PATCH",
    t
  );
}
async function W0(r, e) {
  return Ne(
    `${lt}/platform/orgs/${r}/projects/${e}`,
    "DELETE",
    void 0
  );
}
function F1(r) {
  const e = /^[A-Za-z0-9+/]*[=]{0,2}$/, t = r.length % 4 === 0, n = e.test(r);
  return t && n;
}
async function Y0(r, e, t, n) {
  if (!F1(n))
    throw new Error(
      "Secret must be base64 encoded. Use @stablelib/base64's encode function to encode your data."
    );
  return Ne(
    `${lt}/platform/orgs/${r}/projects/${e}/secrets`,
    "POST",
    { key_name: t, secret: n }
  );
}
async function J0(r, e) {
  return Ne(
    `${lt}/platform/orgs/${r}/projects/${e}/secrets`,
    "GET",
    void 0
  );
}
async function X0(r, e, t) {
  return Ne(
    `${lt}/platform/orgs/${r}/projects/${e}/secrets/${t}`,
    "DELETE",
    void 0
  );
}
async function Q0(r, e) {
  return Ne(
    `${lt}/platform/orgs/${r}/projects/${e}/settings/email`,
    "GET",
    void 0
  );
}
async function ey(r, e, t) {
  return Ne(
    `${lt}/platform/orgs/${r}/projects/${e}/settings/email`,
    "PUT",
    t
  );
}
async function ty(r, e) {
  return Ne(
    `${lt}/platform/orgs/${r}/projects/${e}/settings/oauth`,
    "GET",
    void 0
  );
}
async function ry(r, e, t) {
  return Ne(
    `${lt}/platform/orgs/${r}/projects/${e}/settings/oauth`,
    "PUT",
    t
  );
}
async function ny(r, e, t) {
  if (!e || e.trim() === "")
    throw new Error("Email is required");
  return Ne(
    `${lt}/platform/orgs/${r}/invites`,
    "POST",
    { email: e, role: t }
  );
}
async function iy(r) {
  return Ne(
    `${lt}/platform/orgs/${r}/invites`,
    "GET",
    void 0
  );
}
async function sy(r, e) {
  return Ne(
    `${lt}/platform/orgs/${r}/invites/${e}`,
    "GET",
    void 0
  );
}
async function oy(r, e) {
  return Ne(
    `${lt}/platform/orgs/${r}/invites/${e}`,
    "DELETE",
    void 0
  );
}
async function ay(r) {
  return Ne(
    `${lt}/platform/orgs/${r}/memberships`,
    "GET",
    void 0
  );
}
async function cy(r, e, t) {
  return Ne(
    `${lt}/platform/orgs/${r}/memberships/${e}`,
    "PATCH",
    { role: t }
  );
}
async function ly(r, e) {
  return Ne(
    `${lt}/platform/orgs/${r}/memberships/${e}`,
    "DELETE",
    void 0
  );
}
async function uy(r) {
  return Ne(
    `${lt}/platform/accept_invite/${r}`,
    "POST",
    void 0
  );
}
async function z1() {
  return Ne(`${lt}/platform/me`, "GET", void 0);
}
async function fy(r) {
  return Tt(
    `${lt}/platform/verify-email/${r}`,
    "GET",
    void 0,
    void 0,
    "Failed to verify email"
  );
}
async function Da() {
  return Ne(
    `${lt}/platform/request_verification`,
    "POST",
    void 0,
    "Failed to request new verification code"
  );
}
async function hy(r, e) {
  const t = {
    email: r,
    hashed_secret: e
  };
  return Tt(
    `${lt}/platform/password-reset/request`,
    "POST",
    t,
    void 0,
    "Failed to request platform password reset"
  );
}
async function dy(r, e, t, n) {
  const i = {
    email: r,
    alphanumeric_code: e,
    plaintext_secret: t,
    new_password: n
  };
  return Tt(
    `${lt}/platform/password-reset/confirm`,
    "POST",
    i,
    void 0,
    "Failed to confirm platform password reset"
  );
}
async function py(r, e) {
  const t = {
    current_password: r,
    new_password: e
  };
  return Ne(
    `${lt}/platform/change-password`,
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
        const u = Ho.getRefreshFunction(r);
        console.log(`Using ${u}`), u === "platformRefreshToken" ? await H1() : await Uc();
      }
      const o = window.localStorage.getItem("access_token");
      if (!o)
        throw new Error("No access token available");
      const c = await yy(
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
async function yy(r, e, t, n, i) {
  const o = Ho.resolveEndpoint(r).context === "platform" ? Ho.platformApiUrl : void 0;
  let { sessionKey: c, sessionId: u } = await _i(!1, o);
  const h = async (x, G = !1) => {
    if (G || !c || !u) {
      const P = await _i(!0, o);
      c = P.sessionKey, u = P.sessionId;
    }
    if (!c || !u)
      throw new Error("Failed to make encrypted API call, no attestation available.");
    const N = t ? JSON.stringify(t) : void 0, v = N ? Id(c, N) : void 0, A = {
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
        const P = await O.json(), R = kd(c, P.encrypted);
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
async function Tt(r, e, t, n, i) {
  const s = await yy(
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
function G1(r) {
  Ze = r;
}
function q1() {
  return Ze;
}
async function K1(r, e, t) {
  return Tt(
    `${Ze}/login`,
    "POST",
    { email: r, password: e, client_id: t }
  );
}
async function Z1(r, e, t) {
  return Tt(
    `${Ze}/login`,
    "POST",
    { id: r, password: e, client_id: t }
  );
}
async function W1(r, e, t, n, i) {
  return Tt(`${Ze}/register`, "POST", {
    email: r,
    password: e,
    inviteCode: t.toLowerCase(),
    client_id: n,
    name: i
  });
}
async function Y1(r, e, t) {
  return Tt(`${Ze}/register`, "POST", {
    password: r,
    inviteCode: e.toLowerCase(),
    client_id: t
  });
}
async function Uc() {
  const r = window.localStorage.getItem("refresh_token");
  if (!r) throw new Error("No refresh token available");
  const e = { refresh_token: r };
  try {
    const t = await Tt(
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
async function J1() {
  return Ne(
    `${Ze}/protected/user`,
    "GET",
    void 0,
    "Failed to fetch user"
  );
}
async function gy(r, e) {
  return Ne(
    `${Ze}/protected/kv/${r}`,
    "PUT",
    e,
    "Failed to put key-value pair"
  );
}
async function vy(r) {
  return Ne(
    `${Ze}/protected/kv/${r}`,
    "DELETE",
    void 0,
    "Failed to delete key-value pair"
  );
}
async function my(r) {
  try {
    return await Ne(
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
async function wy() {
  return Ne(
    `${Ze}/protected/kv`,
    "GET",
    void 0,
    "Failed to list key-value pairs"
  );
}
async function X1(r) {
  const e = { refresh_token: r };
  return Tt(`${Ze}/logout`, "POST", e);
}
async function by(r) {
  return Tt(
    `${Ze}/verify-email/${r}`,
    "GET",
    void 0,
    void 0,
    "Failed to verify email"
  );
}
async function $a() {
  return Ne(
    `${Ze}/protected/request_verification`,
    "POST",
    void 0,
    "Failed to request new verification code"
  );
}
async function Q1(r, e) {
  const n = await fetch(`${e || Ze}/attestation/${r}`);
  if (!n.ok)
    throw new Error(`Request failed with status ${n.status}`);
  return (await n.json()).attestation_document;
}
async function ew(r, e, t) {
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
async function tw(r, e, t) {
  const n = {
    email: r,
    hashed_secret: e,
    client_id: t
  };
  return Tt(
    `${Ze}/password-reset/request`,
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
  return Tt(
    `${Ze}/password-reset/confirm`,
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
    `${Ze}/protected/change_password`,
    "POST",
    t,
    "Failed to change password"
  );
}
async function nw(r, e) {
  try {
    return await Tt(
      `${Ze}/auth/github`,
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
    return await Tt(
      `${Ze}/auth/github/callback`,
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
    return await Tt(
      `${Ze}/auth/google`,
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
    return await Tt(
      `${Ze}/auth/google/callback`,
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
    return await Tt(
      `${Ze}/auth/apple`,
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
    return await Tt(
      `${Ze}/auth/apple/callback`,
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
    return await Tt(
      `${Ze}/auth/apple/native`,
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
  let e = `${Ze}/protected/private_key`;
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
  let e = `${Ze}/protected/private_key_bytes`;
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
    `${Ze}/protected/sign_message`,
    "POST",
    i,
    "Failed to sign message"
  );
}
async function Ey(r, e) {
  let t = `${Ze}/protected/public_key?algorithm=${r}`;
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
    `${Ze}/protected/convert_guest`,
    "POST",
    n,
    "Failed to convert guest account"
  );
}
async function fw(r) {
  return Ne(
    `${Ze}/protected/third_party_token`,
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
    `${Ze}/protected/encrypt`,
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
    `${Ze}/protected/decrypt`,
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
    `${Ze}/protected/delete-account/request`,
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
    `${Ze}/protected/delete-account/confirm`,
    "POST",
    t,
    "Failed to confirm account deletion"
  );
}
async function Cy() {
  try {
    const r = await Ne(
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
const vd = 10 * 1024 * 1024;
function pw(r) {
  return new Promise((e) => setTimeout(e, r));
}
async function Sf(r) {
  if (r.size > vd)
    throw new Error(`File size exceeds maximum limit of ${vd / 1024 / 1024}MB`);
  const e = await r.arrayBuffer(), t = new Uint8Array(e), n = Br(t), s = {
    filename: r instanceof File ? r.name : "document",
    content_base64: n
  };
  return Ne(
    `${Ze}/v1/documents/upload`,
    "POST",
    s,
    "Failed to upload document"
  );
}
async function _f(r) {
  const e = {
    task_id: r
  };
  return Ne(
    `${Ze}/v1/documents/status`,
    "POST",
    e,
    "Failed to check document status"
  );
}
async function By(r, e) {
  const { pollInterval: t = 2e3, maxAttempts: n = 150, onProgress: i } = e || {}, s = await Sf(r);
  let o = 0;
  for (; o < n; ) {
    const c = await _f(s.task_id);
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
function yw() {
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
      const { sessionKey: o, sessionId: c } = await _i();
      if (!o || !c)
        throw new Error("No session key or ID available");
      s.set("x-session-id", c);
      const u = { ...e, headers: s };
      if (e != null && e.body) {
        const m = Id(o, e.body);
        u.body = JSON.stringify({ encrypted: m }), s.set("Content-Type", "application/json");
      }
      let h = await fetch(r, u);
      if (h.status === 401 && (console.warn("Unauthorized, refreshing access token"), await Uc(), s.set("Authorization", t()), u.headers = s, h = await fetch(r, u)), !h.ok) {
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
              for (; P = gw(G); )
                if (G = G.slice(P.length), P.trim().startsWith("data: ")) {
                  const R = P.slice(6).trim();
                  if (R === "[DONE]")
                    v.enqueue(`data: [DONE]

`);
                  else
                    try {
                      console.groupCollapsed("Decrypting chunk"), console.log("Attempting to decrypt, data length:", R.length);
                      const ue = kd(o, R);
                      console.log("Decrypted data length:", ue.length), console.log("Decrypted data:", ue);
                      try {
                        const Ge = JSON.parse(ue);
                        console.log("Parsed JSON:", Ge), v.enqueue(`data: ${JSON.stringify(Ge)}

`);
                      } catch (Ge) {
                        Ge instanceof SyntaxError && (console.log("Failed to parse JSON:", ue), v.enqueue(`data: ${ue}

`));
                      }
                    } catch (ue) {
                      console.error("Decryption error:", ue, "Data:", R), console.log("Skipping corrupted chunk");
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
function gw(r) {
  const e = r.indexOf(`

`);
  return e === -1 ? null : r.slice(0, e + 2);
}
const vw = [
  "eeddbb58f57c38894d6d5af5e575fbe791c5bf3bbcfb5df8da8cfcf0c2e1da1913108e6a762112444740b88c163d7f4b",
  "74ed417f88cb0ca76c4a3d10f278bd010f1d3f95eafb254d4732511bb50e404507a4049b779c5230137e4091a5582271",
  "9043fcab93b972d3c14ad2dc8fa78ca7ad374fc937c02435681772a003f7a72876bc4d578089b5c4cf3fe9b480f1aabb",
  "52c3595b151d93d8b159c257301bfd5aa6f49210de0c55a6cd6df5ebeee44e4206cab950500f5d188f7fa14e6d900b75",
  "91cb67311e910cce68cd5b7d0de77aa40610d87c6681439b44c46c3ff786ae643956ab2c812478a1da8745b259f07a45",
  "859065ac81b81d3735130ba08b8af72a7256b603fefb74faabae25ed28cca6edcaa7c10ea32b5948d675c18a9b0f2b1d",
  "acd82a7d3943e23e95a9dc3ce0b0107ea358d6287f9e3afa245622f7c7e3e0a66142a928b6efcc02f594a95366d3a99d"
], mw = [
  "62c0407056217a4c10764ed9045694c29fa93255d3cc04c2f989cdd9a1f8050c8b169714c71f1118ebce2fcc9951d1a9",
  "cb95519905443f9f66f05f63c548b61ad1561a27fd5717b69285861aaea3c3063fe12a2571773b67fea3c6c11b4d8ec6",
  "deb5895831b5e4286f5a2dcf5e9c27383821446f8df2b465f141d10743599be20ba3bb381ce063bf7139cc89f7f61d4c",
  "70ba26c6af1ec3b57ce80e1adcc0ee96d70224d4c7a078f427895cdf68e1c30f09b5ac4c456588d872f3f21ff77c036b",
  "669404ea71435b8f498b48db7816a5c2ab1d258b1a77685b11d84d15a73189504d79c4dee13a658de9f4a0cbfc39cfe8",
  "a791bf92c25ffdfd372660e460a0e238c6778c090672df6509ae4bc065cf8668b6baac6b6a11d554af53ee0ff0172ad5",
  "c4285443b87b9b12a6cea3bef1064ec060f652b235a297095975af8f134e5ed65f92d70d4616fdec80af9dff48bb9f35"
], ww = "MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEHiUY9kFWK1GqBGzczohhwEwElXzgWLDZa9R6wBx3JOBocgSt9+UIzZlJbPDjYeGBfDUXh7Z62BG2vVsh2NgclLB5S7A2ucBBtb1wd8vSQHP8jpdPhZX1slauPgbnROIP", bw = {
  prod: "https://raw.githubusercontent.com/OpenSecretCloud/opensecret/master/pcrProdHistory.json",
  dev: "https://raw.githubusercontent.com/OpenSecretCloud/opensecret/master/pcrDevHistory.json"
};
async function xw() {
  try {
    const r = new Uint8Array(
      atob(ww).split("").map((e) => e.charCodeAt(0))
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
async function Aw(r, e) {
  try {
    const t = (e == null ? void 0 : e[r]) || bw[r], n = await fetch(t);
    if (!n.ok)
      throw new Error(`Failed to fetch PCR history: ${n.status}`);
    return await n.json();
  } catch (t) {
    throw console.error("Error fetching PCR history:", t), new Error("Failed to fetch PCR history");
  }
}
async function Sw(r, e, t) {
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
    const n = await xw(), i = await Aw(e, t);
    for (const s of i)
      if (s.PCR0 === r && await Sw(s.PCR0, s.signature, n))
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
async function _w(r, e) {
  const t = [...(e == null ? void 0 : e.pcr0Values) || [], ...vw], n = [...(e == null ? void 0 : e.pcr0DevValues) || [], ...mw];
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
const ts = Ua, Dc = "641a0321a3e244efe456463195d606317ed7cdcc3c1756e09893f3c68f79bb5b";
function Oy(r) {
  return Array.from(r).map((e) => e.toString(16).padStart(2, "0")).join("");
}
async function Ew(r) {
  const e = await crypto.subtle.digest("SHA-256", r);
  return Oy(new Uint8Array(e));
}
async function rs(r, e, t) {
  console.log("Raw timestamp:", r.timestamp), console.log("Date object:", new Date(r.timestamp));
  const n = Array.from(r.pcrs.entries()).map(([m, x]) => ({
    id: m,
    value: Oy(x)
  })).filter((m) => !m.value.match(/^0+$/)), i = n.find((m) => m.id === 0);
  let s = null;
  i && (s = await _w(i.value, t));
  const o = [...e, r.certificate].map((m) => {
    const x = new wi(m);
    return {
      subject: x.subject,
      notBefore: x.notBefore.toLocaleString(),
      notAfter: x.notAfter.toLocaleString(),
      pem: x.toString("pem"),
      isRoot: x.subject === "C=US, O=Amazon, OU=AWS, CN=aws.nitro-enclaves"
    };
  }), c = new TextDecoder(), u = new wi(e[0]), h = await Ew(u.rawData);
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
  requestNewVerificationCode: $a,
  requestNewVerificationEmail: $a,
  fetchUser: async () => {
  },
  refetchUser: async () => {
  },
  changePassword: xy,
  refreshAccessToken: Uc,
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
  aiCustomFetch: async () => new Response(),
  apiUrl: "",
  pcrConfig: {},
  getAttestation: _i,
  authenticate: Si,
  parseAttestationForView: rs,
  awsRootCertDer: ts,
  expectedRootCertHash: Dc,
  getAttestationDocument: async () => {
    throw new Error("getAttestationDocument called outside of OpenSecretProvider");
  },
  generateThirdPartyToken: async () => ({ token: "" }),
  encryptData: Iy,
  decryptData: ky,
  fetchModels: Cy,
  uploadDocument: Sf,
  checkDocumentStatus: _f,
  uploadDocumentWithPolling: By
});
function Ix({
  children: r,
  apiUrl: e,
  clientId: t,
  pcrConfig: n = {}
}) {
  const [i, s] = nl({
    loading: !0,
    user: void 0
  }), [o, c] = nl();
  Lo(() => {
    if (!e || e.trim() === "")
      throw new Error(
        "OpenSecretProvider requires a non-empty apiUrl. Please provide a valid API endpoint URL."
      );
    if (!t || t.trim() === "")
      throw new Error(
        "OpenSecretProvider requires a non-empty clientId. Please provide a valid project UUID."
      );
    G1(e), Promise.resolve().then(() => _d).then(({ apiConfig: W }) => {
      const ie = W.platformApiUrl || "";
      W.configure(e, ie);
    });
  }, [e, t]), Lo(() => {
    i.user ? c(() => yw()) : c(void 0);
  }, [i.user]);
  async function u() {
    const W = window.localStorage.getItem("access_token"), ie = window.localStorage.getItem("refresh_token");
    if (!W || !ie) {
      s({
        loading: !1,
        user: void 0
      });
      return;
    }
    try {
      const te = await J1();
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
  async function h(W, ie) {
    console.log("Signing in");
    try {
      const { access_token: te, refresh_token: xe } = await K1(W, ie, t);
      window.localStorage.setItem("access_token", te), window.localStorage.setItem("refresh_token", xe), await u();
    } catch (te) {
      throw console.error(te), te;
    }
  }
  async function m(W, ie, te, xe) {
    try {
      const { access_token: tt, refresh_token: At } = await W1(
        W,
        ie,
        te,
        t,
        xe || null
      );
      window.localStorage.setItem("access_token", tt), window.localStorage.setItem("refresh_token", At), await u();
    } catch (tt) {
      throw console.error(tt), tt;
    }
  }
  async function x(W, ie) {
    console.log("Signing in Guest");
    try {
      const { access_token: te, refresh_token: xe } = await Z1(W, ie, t);
      window.localStorage.setItem("access_token", te), window.localStorage.setItem("refresh_token", xe), await u();
    } catch (te) {
      throw console.error(te), te;
    }
  }
  async function G(W, ie) {
    try {
      const { access_token: te, refresh_token: xe, id: tt } = await Y1(
        W,
        ie,
        t
      );
      return window.localStorage.setItem("access_token", te), window.localStorage.setItem("refresh_token", xe), await u(), { access_token: te, refresh_token: xe, id: tt };
    } catch (te) {
      throw console.error(te), te;
    }
  }
  async function N(W, ie, te) {
    try {
      await uw(W, ie, te), await u();
    } catch (xe) {
      throw console.error(xe), xe;
    }
  }
  async function v() {
    const W = window.localStorage.getItem("refresh_token");
    if (W)
      try {
        await X1(W);
      } catch (ie) {
        console.error("Error during logout:", ie);
      }
    localStorage.removeItem("access_token"), localStorage.removeItem("refresh_token"), sessionStorage.removeItem("sessionKey"), sessionStorage.removeItem("sessionId"), s({
      loading: !1,
      user: void 0
    });
  }
  const je = {
    auth: i,
    clientId: t,
    signIn: h,
    signInGuest: x,
    signOut: v,
    signUp: m,
    signUpGuest: G,
    convertGuestToUserAccount: N,
    get: my,
    put: gy,
    list: wy,
    del: vy,
    fetchUser: u,
    refetchUser: () => u().then(() => {
    }),
    verifyEmail: by,
    requestNewVerificationCode: $a,
    requestNewVerificationEmail: $a,
    changePassword: xy,
    refreshAccessToken: Uc,
    requestPasswordReset: (W, ie) => tw(W, ie, t),
    confirmPasswordReset: (W, ie, te, xe) => rw(W, ie, te, xe, t),
    requestAccountDeletion: hw,
    confirmAccountDeletion: dw,
    initiateGitHubAuth: async (W) => {
      try {
        return await nw(t, W);
      } catch (ie) {
        throw console.error("Failed to initiate GitHub auth:", ie), ie;
      }
    },
    handleGitHubCallback: async (W, ie, te) => {
      try {
        const { access_token: xe, refresh_token: tt } = await iw(
          W,
          ie,
          te
        );
        window.localStorage.setItem("access_token", xe), window.localStorage.setItem("refresh_token", tt), await u();
      } catch (xe) {
        throw console.error("GitHub callback error:", xe), xe;
      }
    },
    initiateGoogleAuth: async (W) => {
      try {
        return await sw(t, W);
      } catch (ie) {
        throw console.error("Failed to initiate Google auth:", ie), ie;
      }
    },
    handleGoogleCallback: async (W, ie, te) => {
      try {
        const { access_token: xe, refresh_token: tt } = await ow(
          W,
          ie,
          te
        );
        window.localStorage.setItem("access_token", xe), window.localStorage.setItem("refresh_token", tt), await u();
      } catch (xe) {
        throw console.error("Google callback error:", xe), xe;
      }
    },
    initiateAppleAuth: async (W) => {
      try {
        return await aw(t, W);
      } catch (ie) {
        throw console.error("Failed to initiate Apple auth:", ie), ie;
      }
    },
    handleAppleCallback: async (W, ie, te) => {
      try {
        const { access_token: xe, refresh_token: tt } = await cw(
          W,
          ie,
          te
        );
        window.localStorage.setItem("access_token", xe), window.localStorage.setItem("refresh_token", tt), await u();
      } catch (xe) {
        throw console.error("Apple callback error:", xe), xe;
      }
    },
    handleAppleNativeSignIn: async (W, ie) => {
      try {
        const { access_token: te, refresh_token: xe } = await lw(
          W,
          t,
          ie
        );
        window.localStorage.setItem("access_token", te), window.localStorage.setItem("refresh_token", xe), await u();
      } catch (te) {
        throw console.error("Apple native sign-in error:", te), te;
      }
    },
    getPrivateKey: Ay,
    getPrivateKeyBytes: Sy,
    getPublicKey: Ey,
    signMessage: _y,
    aiCustomFetch: o || (async () => new Response()),
    apiUrl: e,
    pcrConfig: n,
    getAttestation: _i,
    authenticate: Si,
    parseAttestationForView: rs,
    awsRootCertDer: ts,
    expectedRootCertHash: Dc,
    getAttestationDocument: async () => {
      const W = window.crypto.randomUUID(), ie = await fetch(`${e}/attestation/${W}`);
      if (!ie.ok)
        throw new Error("Failed to fetch attestation document");
      const te = await ie.json(), xe = await Si(
        te.attestation_document,
        ts,
        W
      );
      return rs(xe, xe.cabundle, n);
    },
    generateThirdPartyToken: fw,
    encryptData: Iy,
    decryptData: ky,
    fetchModels: Cy,
    uploadDocument: Sf,
    checkDocumentStatus: _f,
    uploadDocumentWithPolling: By
  };
  return /* @__PURE__ */ xd(Ty.Provider, { value: je, children: r });
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
  verifyEmail: fy,
  requestNewVerificationCode: Da,
  requestNewVerificationEmail: Da,
  requestPasswordReset: hy,
  confirmPasswordReset: dy,
  changePassword: py,
  pcrConfig: {},
  getAttestation: _i,
  authenticate: Si,
  parseAttestationForView: rs,
  awsRootCertDer: ts,
  expectedRootCertHash: Dc,
  getAttestationDocument: async () => {
    throw new Error("getAttestationDocument called outside of OpenSecretDeveloper provider");
  },
  createOrganization: H0,
  listOrganizations: F0,
  deleteOrganization: z0,
  createProject: G0,
  listProjects: q0,
  getProject: K0,
  updateProject: Z0,
  deleteProject: W0,
  createProjectSecret: Y0,
  listProjectSecrets: J0,
  deleteProjectSecret: X0,
  getEmailSettings: Q0,
  updateEmailSettings: ey,
  getOAuthSettings: ty,
  updateOAuthSettings: ry,
  inviteDeveloper: ny,
  listOrganizationMembers: ay,
  listOrganizationInvites: iy,
  getOrganizationInvite: sy,
  deleteOrganizationInvite: oy,
  updateMemberRole: cy,
  removeMember: ly,
  acceptInvite: uy,
  apiUrl: ""
});
function kx({
  children: r,
  apiUrl: e,
  pcrConfig: t = {}
}) {
  const [n, i] = nl({
    loading: !0,
    developer: void 0
  });
  Lo(() => {
    if (!e || e.trim() === "")
      throw new Error(
        "OpenSecretDeveloper requires a non-empty apiUrl. Please provide a valid API endpoint URL."
      );
    $1(e), Promise.resolve().then(() => _d).then(({ apiConfig: m }) => {
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
      const G = await z1();
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
    const G = await x.json(), N = await Si(
      G.attestation_document,
      ts,
      m
    );
    return rs(N, N.cabundle, t);
  };
  Lo(() => {
    s();
  }, []);
  async function c(m, x) {
    try {
      const { access_token: G, refresh_token: N } = await M1(m, x);
      return window.localStorage.setItem("access_token", G), window.localStorage.setItem("refresh_token", N), await s(), { access_token: G, refresh_token: N, id: "", email: m };
    } catch (G) {
      throw console.error("Login error:", G), G;
    }
  }
  async function u(m, x, G, N) {
    try {
      const { access_token: v, refresh_token: A } = await V1(
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
          await L1(m);
        } catch (x) {
          console.error("Error during logout:", x);
        }
      localStorage.removeItem("access_token"), localStorage.removeItem("refresh_token"), i({
        loading: !1,
        developer: void 0
      });
    },
    verifyEmail: fy,
    requestNewVerificationCode: Da,
    requestNewVerificationEmail: Da,
    requestPasswordReset: hy,
    confirmPasswordReset: dy,
    changePassword: py,
    pcrConfig: t,
    getAttestation: _i,
    authenticate: Si,
    parseAttestationForView: rs,
    awsRootCertDer: ts,
    expectedRootCertHash: Dc,
    getAttestationDocument: o,
    createOrganization: H0,
    listOrganizations: F0,
    deleteOrganization: z0,
    createProject: G0,
    listProjects: q0,
    getProject: K0,
    updateProject: Z0,
    deleteProject: W0,
    createProjectSecret: Y0,
    listProjectSecrets: J0,
    deleteProjectSecret: X0,
    getEmailSettings: Q0,
    updateEmailSettings: ey,
    getOAuthSettings: ty,
    updateOAuthSettings: ry,
    inviteDeveloper: ny,
    listOrganizationMembers: ay,
    listOrganizationInvites: iy,
    getOrganizationInvite: sy,
    deleteOrganizationInvite: oy,
    updateMemberRole: cy,
    removeMember: ly,
    acceptInvite: uy,
    apiUrl: e
  };
  return /* @__PURE__ */ xd(Ny.Provider, { value: h, children: r });
}
function Cx() {
  return Sd(Ty);
}
function Bx() {
  return Sd(Ny);
}
function Ox() {
  const r = new Uint8Array(32);
  return crypto.getRandomValues(r), Array.from(r, (e) => e.toString(16).padStart(2, "0")).join("");
}
async function Tx(r) {
  const t = new TextEncoder().encode(r), n = await crypto.subtle.digest("SHA-256", t);
  return Array.from(new Uint8Array(n)).map((s) => s.toString(16).padStart(2, "0")).join("");
}
export {
  Ty as OpenSecretContext,
  kx as OpenSecretDeveloper,
  Ny as OpenSecretDeveloperContext,
  Ix as OpenSecretProvider,
  Ho as apiConfig,
  Ox as generateSecureSecret,
  Tx as hashSecret,
  Cx as useOpenSecret,
  Bx as useOpenSecretDeveloper
};
