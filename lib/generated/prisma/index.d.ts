
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Tenant
 * Represents a tenant (vehicle wrap business)
 */
export type Tenant = $Result.DefaultSelection<Prisma.$TenantPayload>
/**
 * Model TenantUserMembership
 * Tracks user membership and roles within a tenant (RBAC)
 */
export type TenantUserMembership = $Result.DefaultSelection<Prisma.$TenantUserMembershipPayload>
/**
 * Model Wrap
 * Represents a wrap design
 */
export type Wrap = $Result.DefaultSelection<Prisma.$WrapPayload>
/**
 * Model WrapCategory
 * Categories for organizing wraps
 */
export type WrapCategory = $Result.DefaultSelection<Prisma.$WrapCategoryPayload>
/**
 * Model WrapCategoryMapping
 * Junction table: many wraps to many categories
 */
export type WrapCategoryMapping = $Result.DefaultSelection<Prisma.$WrapCategoryMappingPayload>
/**
 * Model WrapImage
 * Images for wrap designs
 */
export type WrapImage = $Result.DefaultSelection<Prisma.$WrapImagePayload>
/**
 * Model AvailabilityRule
 * Availability rules for time slots
 */
export type AvailabilityRule = $Result.DefaultSelection<Prisma.$AvailabilityRulePayload>
/**
 * Model Booking
 * Customer bookings
 */
export type Booking = $Result.DefaultSelection<Prisma.$BookingPayload>
/**
 * Model BookingReservation
 * 15-minute reservation hold on booking slots
 */
export type BookingReservation = $Result.DefaultSelection<Prisma.$BookingReservationPayload>
/**
 * Model VisualizerPreview
 * Preview generation results (cached for 24h)
 */
export type VisualizerPreview = $Result.DefaultSelection<Prisma.$VisualizerPreviewPayload>
/**
 * Model Invoice
 * Invoices for bookings
 */
export type Invoice = $Result.DefaultSelection<Prisma.$InvoicePayload>
/**
 * Model InvoiceLineItem
 * Line items for invoices
 */
export type InvoiceLineItem = $Result.DefaultSelection<Prisma.$InvoiceLineItemPayload>
/**
 * Model Payment
 * Payment records (Stripe integration)
 */
export type Payment = $Result.DefaultSelection<Prisma.$PaymentPayload>
/**
 * Model AuditLog
 * Audit trail for security and compliance
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Tenants
 * const tenants = await prisma.tenant.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Tenants
   * const tenants = await prisma.tenant.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.tenant`: Exposes CRUD operations for the **Tenant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tenants
    * const tenants = await prisma.tenant.findMany()
    * ```
    */
  get tenant(): Prisma.TenantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tenantUserMembership`: Exposes CRUD operations for the **TenantUserMembership** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TenantUserMemberships
    * const tenantUserMemberships = await prisma.tenantUserMembership.findMany()
    * ```
    */
  get tenantUserMembership(): Prisma.TenantUserMembershipDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.wrap`: Exposes CRUD operations for the **Wrap** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Wraps
    * const wraps = await prisma.wrap.findMany()
    * ```
    */
  get wrap(): Prisma.WrapDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.wrapCategory`: Exposes CRUD operations for the **WrapCategory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WrapCategories
    * const wrapCategories = await prisma.wrapCategory.findMany()
    * ```
    */
  get wrapCategory(): Prisma.WrapCategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.wrapCategoryMapping`: Exposes CRUD operations for the **WrapCategoryMapping** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WrapCategoryMappings
    * const wrapCategoryMappings = await prisma.wrapCategoryMapping.findMany()
    * ```
    */
  get wrapCategoryMapping(): Prisma.WrapCategoryMappingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.wrapImage`: Exposes CRUD operations for the **WrapImage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WrapImages
    * const wrapImages = await prisma.wrapImage.findMany()
    * ```
    */
  get wrapImage(): Prisma.WrapImageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.availabilityRule`: Exposes CRUD operations for the **AvailabilityRule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AvailabilityRules
    * const availabilityRules = await prisma.availabilityRule.findMany()
    * ```
    */
  get availabilityRule(): Prisma.AvailabilityRuleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.booking`: Exposes CRUD operations for the **Booking** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bookings
    * const bookings = await prisma.booking.findMany()
    * ```
    */
  get booking(): Prisma.BookingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bookingReservation`: Exposes CRUD operations for the **BookingReservation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BookingReservations
    * const bookingReservations = await prisma.bookingReservation.findMany()
    * ```
    */
  get bookingReservation(): Prisma.BookingReservationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.visualizerPreview`: Exposes CRUD operations for the **VisualizerPreview** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VisualizerPreviews
    * const visualizerPreviews = await prisma.visualizerPreview.findMany()
    * ```
    */
  get visualizerPreview(): Prisma.VisualizerPreviewDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.invoice`: Exposes CRUD operations for the **Invoice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Invoices
    * const invoices = await prisma.invoice.findMany()
    * ```
    */
  get invoice(): Prisma.InvoiceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.invoiceLineItem`: Exposes CRUD operations for the **InvoiceLineItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InvoiceLineItems
    * const invoiceLineItems = await prisma.invoiceLineItem.findMany()
    * ```
    */
  get invoiceLineItem(): Prisma.InvoiceLineItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payments
    * const payments = await prisma.payment.findMany()
    * ```
    */
  get payment(): Prisma.PaymentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.2
   * Query Engine version: 94a226be1cf2967af2541cca5529f0f7ba866919
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Tenant: 'Tenant',
    TenantUserMembership: 'TenantUserMembership',
    Wrap: 'Wrap',
    WrapCategory: 'WrapCategory',
    WrapCategoryMapping: 'WrapCategoryMapping',
    WrapImage: 'WrapImage',
    AvailabilityRule: 'AvailabilityRule',
    Booking: 'Booking',
    BookingReservation: 'BookingReservation',
    VisualizerPreview: 'VisualizerPreview',
    Invoice: 'Invoice',
    InvoiceLineItem: 'InvoiceLineItem',
    Payment: 'Payment',
    AuditLog: 'AuditLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "tenant" | "tenantUserMembership" | "wrap" | "wrapCategory" | "wrapCategoryMapping" | "wrapImage" | "availabilityRule" | "booking" | "bookingReservation" | "visualizerPreview" | "invoice" | "invoiceLineItem" | "payment" | "auditLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Tenant: {
        payload: Prisma.$TenantPayload<ExtArgs>
        fields: Prisma.TenantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findFirst: {
            args: Prisma.TenantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findMany: {
            args: Prisma.TenantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          create: {
            args: Prisma.TenantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          createMany: {
            args: Prisma.TenantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          delete: {
            args: Prisma.TenantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          update: {
            args: Prisma.TenantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          deleteMany: {
            args: Prisma.TenantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TenantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          upsert: {
            args: Prisma.TenantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          aggregate: {
            args: Prisma.TenantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenant>
          }
          groupBy: {
            args: Prisma.TenantGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantCountArgs<ExtArgs>
            result: $Utils.Optional<TenantCountAggregateOutputType> | number
          }
        }
      }
      TenantUserMembership: {
        payload: Prisma.$TenantUserMembershipPayload<ExtArgs>
        fields: Prisma.TenantUserMembershipFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantUserMembershipFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserMembershipPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantUserMembershipFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserMembershipPayload>
          }
          findFirst: {
            args: Prisma.TenantUserMembershipFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserMembershipPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantUserMembershipFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserMembershipPayload>
          }
          findMany: {
            args: Prisma.TenantUserMembershipFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserMembershipPayload>[]
          }
          create: {
            args: Prisma.TenantUserMembershipCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserMembershipPayload>
          }
          createMany: {
            args: Prisma.TenantUserMembershipCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantUserMembershipCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserMembershipPayload>[]
          }
          delete: {
            args: Prisma.TenantUserMembershipDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserMembershipPayload>
          }
          update: {
            args: Prisma.TenantUserMembershipUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserMembershipPayload>
          }
          deleteMany: {
            args: Prisma.TenantUserMembershipDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUserMembershipUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TenantUserMembershipUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserMembershipPayload>[]
          }
          upsert: {
            args: Prisma.TenantUserMembershipUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserMembershipPayload>
          }
          aggregate: {
            args: Prisma.TenantUserMembershipAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenantUserMembership>
          }
          groupBy: {
            args: Prisma.TenantUserMembershipGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantUserMembershipGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantUserMembershipCountArgs<ExtArgs>
            result: $Utils.Optional<TenantUserMembershipCountAggregateOutputType> | number
          }
        }
      }
      Wrap: {
        payload: Prisma.$WrapPayload<ExtArgs>
        fields: Prisma.WrapFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WrapFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WrapFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapPayload>
          }
          findFirst: {
            args: Prisma.WrapFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WrapFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapPayload>
          }
          findMany: {
            args: Prisma.WrapFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapPayload>[]
          }
          create: {
            args: Prisma.WrapCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapPayload>
          }
          createMany: {
            args: Prisma.WrapCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WrapCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapPayload>[]
          }
          delete: {
            args: Prisma.WrapDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapPayload>
          }
          update: {
            args: Prisma.WrapUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapPayload>
          }
          deleteMany: {
            args: Prisma.WrapDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WrapUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WrapUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapPayload>[]
          }
          upsert: {
            args: Prisma.WrapUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapPayload>
          }
          aggregate: {
            args: Prisma.WrapAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWrap>
          }
          groupBy: {
            args: Prisma.WrapGroupByArgs<ExtArgs>
            result: $Utils.Optional<WrapGroupByOutputType>[]
          }
          count: {
            args: Prisma.WrapCountArgs<ExtArgs>
            result: $Utils.Optional<WrapCountAggregateOutputType> | number
          }
        }
      }
      WrapCategory: {
        payload: Prisma.$WrapCategoryPayload<ExtArgs>
        fields: Prisma.WrapCategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WrapCategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WrapCategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryPayload>
          }
          findFirst: {
            args: Prisma.WrapCategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WrapCategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryPayload>
          }
          findMany: {
            args: Prisma.WrapCategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryPayload>[]
          }
          create: {
            args: Prisma.WrapCategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryPayload>
          }
          createMany: {
            args: Prisma.WrapCategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WrapCategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryPayload>[]
          }
          delete: {
            args: Prisma.WrapCategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryPayload>
          }
          update: {
            args: Prisma.WrapCategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryPayload>
          }
          deleteMany: {
            args: Prisma.WrapCategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WrapCategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WrapCategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryPayload>[]
          }
          upsert: {
            args: Prisma.WrapCategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryPayload>
          }
          aggregate: {
            args: Prisma.WrapCategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWrapCategory>
          }
          groupBy: {
            args: Prisma.WrapCategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<WrapCategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.WrapCategoryCountArgs<ExtArgs>
            result: $Utils.Optional<WrapCategoryCountAggregateOutputType> | number
          }
        }
      }
      WrapCategoryMapping: {
        payload: Prisma.$WrapCategoryMappingPayload<ExtArgs>
        fields: Prisma.WrapCategoryMappingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WrapCategoryMappingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryMappingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WrapCategoryMappingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryMappingPayload>
          }
          findFirst: {
            args: Prisma.WrapCategoryMappingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryMappingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WrapCategoryMappingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryMappingPayload>
          }
          findMany: {
            args: Prisma.WrapCategoryMappingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryMappingPayload>[]
          }
          create: {
            args: Prisma.WrapCategoryMappingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryMappingPayload>
          }
          createMany: {
            args: Prisma.WrapCategoryMappingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WrapCategoryMappingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryMappingPayload>[]
          }
          delete: {
            args: Prisma.WrapCategoryMappingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryMappingPayload>
          }
          update: {
            args: Prisma.WrapCategoryMappingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryMappingPayload>
          }
          deleteMany: {
            args: Prisma.WrapCategoryMappingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WrapCategoryMappingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WrapCategoryMappingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryMappingPayload>[]
          }
          upsert: {
            args: Prisma.WrapCategoryMappingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapCategoryMappingPayload>
          }
          aggregate: {
            args: Prisma.WrapCategoryMappingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWrapCategoryMapping>
          }
          groupBy: {
            args: Prisma.WrapCategoryMappingGroupByArgs<ExtArgs>
            result: $Utils.Optional<WrapCategoryMappingGroupByOutputType>[]
          }
          count: {
            args: Prisma.WrapCategoryMappingCountArgs<ExtArgs>
            result: $Utils.Optional<WrapCategoryMappingCountAggregateOutputType> | number
          }
        }
      }
      WrapImage: {
        payload: Prisma.$WrapImagePayload<ExtArgs>
        fields: Prisma.WrapImageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WrapImageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapImagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WrapImageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapImagePayload>
          }
          findFirst: {
            args: Prisma.WrapImageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapImagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WrapImageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapImagePayload>
          }
          findMany: {
            args: Prisma.WrapImageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapImagePayload>[]
          }
          create: {
            args: Prisma.WrapImageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapImagePayload>
          }
          createMany: {
            args: Prisma.WrapImageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WrapImageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapImagePayload>[]
          }
          delete: {
            args: Prisma.WrapImageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapImagePayload>
          }
          update: {
            args: Prisma.WrapImageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapImagePayload>
          }
          deleteMany: {
            args: Prisma.WrapImageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WrapImageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WrapImageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapImagePayload>[]
          }
          upsert: {
            args: Prisma.WrapImageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WrapImagePayload>
          }
          aggregate: {
            args: Prisma.WrapImageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWrapImage>
          }
          groupBy: {
            args: Prisma.WrapImageGroupByArgs<ExtArgs>
            result: $Utils.Optional<WrapImageGroupByOutputType>[]
          }
          count: {
            args: Prisma.WrapImageCountArgs<ExtArgs>
            result: $Utils.Optional<WrapImageCountAggregateOutputType> | number
          }
        }
      }
      AvailabilityRule: {
        payload: Prisma.$AvailabilityRulePayload<ExtArgs>
        fields: Prisma.AvailabilityRuleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AvailabilityRuleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityRulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AvailabilityRuleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityRulePayload>
          }
          findFirst: {
            args: Prisma.AvailabilityRuleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityRulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AvailabilityRuleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityRulePayload>
          }
          findMany: {
            args: Prisma.AvailabilityRuleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityRulePayload>[]
          }
          create: {
            args: Prisma.AvailabilityRuleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityRulePayload>
          }
          createMany: {
            args: Prisma.AvailabilityRuleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AvailabilityRuleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityRulePayload>[]
          }
          delete: {
            args: Prisma.AvailabilityRuleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityRulePayload>
          }
          update: {
            args: Prisma.AvailabilityRuleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityRulePayload>
          }
          deleteMany: {
            args: Prisma.AvailabilityRuleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AvailabilityRuleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AvailabilityRuleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityRulePayload>[]
          }
          upsert: {
            args: Prisma.AvailabilityRuleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityRulePayload>
          }
          aggregate: {
            args: Prisma.AvailabilityRuleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAvailabilityRule>
          }
          groupBy: {
            args: Prisma.AvailabilityRuleGroupByArgs<ExtArgs>
            result: $Utils.Optional<AvailabilityRuleGroupByOutputType>[]
          }
          count: {
            args: Prisma.AvailabilityRuleCountArgs<ExtArgs>
            result: $Utils.Optional<AvailabilityRuleCountAggregateOutputType> | number
          }
        }
      }
      Booking: {
        payload: Prisma.$BookingPayload<ExtArgs>
        fields: Prisma.BookingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          findFirst: {
            args: Prisma.BookingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          findMany: {
            args: Prisma.BookingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          create: {
            args: Prisma.BookingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          createMany: {
            args: Prisma.BookingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          delete: {
            args: Prisma.BookingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          update: {
            args: Prisma.BookingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          deleteMany: {
            args: Prisma.BookingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BookingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          upsert: {
            args: Prisma.BookingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          aggregate: {
            args: Prisma.BookingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBooking>
          }
          groupBy: {
            args: Prisma.BookingGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookingGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookingCountArgs<ExtArgs>
            result: $Utils.Optional<BookingCountAggregateOutputType> | number
          }
        }
      }
      BookingReservation: {
        payload: Prisma.$BookingReservationPayload<ExtArgs>
        fields: Prisma.BookingReservationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookingReservationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingReservationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookingReservationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingReservationPayload>
          }
          findFirst: {
            args: Prisma.BookingReservationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingReservationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookingReservationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingReservationPayload>
          }
          findMany: {
            args: Prisma.BookingReservationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingReservationPayload>[]
          }
          create: {
            args: Prisma.BookingReservationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingReservationPayload>
          }
          createMany: {
            args: Prisma.BookingReservationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookingReservationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingReservationPayload>[]
          }
          delete: {
            args: Prisma.BookingReservationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingReservationPayload>
          }
          update: {
            args: Prisma.BookingReservationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingReservationPayload>
          }
          deleteMany: {
            args: Prisma.BookingReservationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookingReservationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BookingReservationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingReservationPayload>[]
          }
          upsert: {
            args: Prisma.BookingReservationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingReservationPayload>
          }
          aggregate: {
            args: Prisma.BookingReservationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBookingReservation>
          }
          groupBy: {
            args: Prisma.BookingReservationGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookingReservationGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookingReservationCountArgs<ExtArgs>
            result: $Utils.Optional<BookingReservationCountAggregateOutputType> | number
          }
        }
      }
      VisualizerPreview: {
        payload: Prisma.$VisualizerPreviewPayload<ExtArgs>
        fields: Prisma.VisualizerPreviewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VisualizerPreviewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisualizerPreviewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VisualizerPreviewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisualizerPreviewPayload>
          }
          findFirst: {
            args: Prisma.VisualizerPreviewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisualizerPreviewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VisualizerPreviewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisualizerPreviewPayload>
          }
          findMany: {
            args: Prisma.VisualizerPreviewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisualizerPreviewPayload>[]
          }
          create: {
            args: Prisma.VisualizerPreviewCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisualizerPreviewPayload>
          }
          createMany: {
            args: Prisma.VisualizerPreviewCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VisualizerPreviewCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisualizerPreviewPayload>[]
          }
          delete: {
            args: Prisma.VisualizerPreviewDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisualizerPreviewPayload>
          }
          update: {
            args: Prisma.VisualizerPreviewUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisualizerPreviewPayload>
          }
          deleteMany: {
            args: Prisma.VisualizerPreviewDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VisualizerPreviewUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VisualizerPreviewUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisualizerPreviewPayload>[]
          }
          upsert: {
            args: Prisma.VisualizerPreviewUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisualizerPreviewPayload>
          }
          aggregate: {
            args: Prisma.VisualizerPreviewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVisualizerPreview>
          }
          groupBy: {
            args: Prisma.VisualizerPreviewGroupByArgs<ExtArgs>
            result: $Utils.Optional<VisualizerPreviewGroupByOutputType>[]
          }
          count: {
            args: Prisma.VisualizerPreviewCountArgs<ExtArgs>
            result: $Utils.Optional<VisualizerPreviewCountAggregateOutputType> | number
          }
        }
      }
      Invoice: {
        payload: Prisma.$InvoicePayload<ExtArgs>
        fields: Prisma.InvoiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvoiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvoiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findFirst: {
            args: Prisma.InvoiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvoiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findMany: {
            args: Prisma.InvoiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          create: {
            args: Prisma.InvoiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          createMany: {
            args: Prisma.InvoiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvoiceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          delete: {
            args: Prisma.InvoiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          update: {
            args: Prisma.InvoiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          deleteMany: {
            args: Prisma.InvoiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvoiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InvoiceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          upsert: {
            args: Prisma.InvoiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          aggregate: {
            args: Prisma.InvoiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvoice>
          }
          groupBy: {
            args: Prisma.InvoiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvoiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvoiceCountArgs<ExtArgs>
            result: $Utils.Optional<InvoiceCountAggregateOutputType> | number
          }
        }
      }
      InvoiceLineItem: {
        payload: Prisma.$InvoiceLineItemPayload<ExtArgs>
        fields: Prisma.InvoiceLineItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvoiceLineItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLineItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvoiceLineItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLineItemPayload>
          }
          findFirst: {
            args: Prisma.InvoiceLineItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLineItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvoiceLineItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLineItemPayload>
          }
          findMany: {
            args: Prisma.InvoiceLineItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLineItemPayload>[]
          }
          create: {
            args: Prisma.InvoiceLineItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLineItemPayload>
          }
          createMany: {
            args: Prisma.InvoiceLineItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvoiceLineItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLineItemPayload>[]
          }
          delete: {
            args: Prisma.InvoiceLineItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLineItemPayload>
          }
          update: {
            args: Prisma.InvoiceLineItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLineItemPayload>
          }
          deleteMany: {
            args: Prisma.InvoiceLineItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvoiceLineItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InvoiceLineItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLineItemPayload>[]
          }
          upsert: {
            args: Prisma.InvoiceLineItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLineItemPayload>
          }
          aggregate: {
            args: Prisma.InvoiceLineItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvoiceLineItem>
          }
          groupBy: {
            args: Prisma.InvoiceLineItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvoiceLineItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvoiceLineItemCountArgs<ExtArgs>
            result: $Utils.Optional<InvoiceLineItemCountAggregateOutputType> | number
          }
        }
      }
      Payment: {
        payload: Prisma.$PaymentPayload<ExtArgs>
        fields: Prisma.PaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findFirst: {
            args: Prisma.PaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findMany: {
            args: Prisma.PaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          create: {
            args: Prisma.PaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          createMany: {
            args: Prisma.PaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          delete: {
            args: Prisma.PaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          update: {
            args: Prisma.PaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          deleteMany: {
            args: Prisma.PaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PaymentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          upsert: {
            args: Prisma.PaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          aggregate: {
            args: Prisma.PaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayment>
          }
          groupBy: {
            args: Prisma.PaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    tenant?: TenantOmit
    tenantUserMembership?: TenantUserMembershipOmit
    wrap?: WrapOmit
    wrapCategory?: WrapCategoryOmit
    wrapCategoryMapping?: WrapCategoryMappingOmit
    wrapImage?: WrapImageOmit
    availabilityRule?: AvailabilityRuleOmit
    booking?: BookingOmit
    bookingReservation?: BookingReservationOmit
    visualizerPreview?: VisualizerPreviewOmit
    invoice?: InvoiceOmit
    invoiceLineItem?: InvoiceLineItemOmit
    payment?: PaymentOmit
    auditLog?: AuditLogOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TenantCountOutputType
   */

  export type TenantCountOutputType = {
    members: number
    wraps: number
    wrapCategories: number
    availabilityRules: number
    bookings: number
    previews: number
    invoices: number
    auditLogs: number
  }

  export type TenantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | TenantCountOutputTypeCountMembersArgs
    wraps?: boolean | TenantCountOutputTypeCountWrapsArgs
    wrapCategories?: boolean | TenantCountOutputTypeCountWrapCategoriesArgs
    availabilityRules?: boolean | TenantCountOutputTypeCountAvailabilityRulesArgs
    bookings?: boolean | TenantCountOutputTypeCountBookingsArgs
    previews?: boolean | TenantCountOutputTypeCountPreviewsArgs
    invoices?: boolean | TenantCountOutputTypeCountInvoicesArgs
    auditLogs?: boolean | TenantCountOutputTypeCountAuditLogsArgs
  }

  // Custom InputTypes
  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantCountOutputType
     */
    select?: TenantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantUserMembershipWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountWrapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WrapWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountWrapCategoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WrapCategoryWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountAvailabilityRulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AvailabilityRuleWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountBookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountPreviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VisualizerPreviewWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }


  /**
   * Count Type WrapCountOutputType
   */

  export type WrapCountOutputType = {
    images: number
    categoryMappings: number
    bookings: number
    previews: number
  }

  export type WrapCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    images?: boolean | WrapCountOutputTypeCountImagesArgs
    categoryMappings?: boolean | WrapCountOutputTypeCountCategoryMappingsArgs
    bookings?: boolean | WrapCountOutputTypeCountBookingsArgs
    previews?: boolean | WrapCountOutputTypeCountPreviewsArgs
  }

  // Custom InputTypes
  /**
   * WrapCountOutputType without action
   */
  export type WrapCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCountOutputType
     */
    select?: WrapCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WrapCountOutputType without action
   */
  export type WrapCountOutputTypeCountImagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WrapImageWhereInput
  }

  /**
   * WrapCountOutputType without action
   */
  export type WrapCountOutputTypeCountCategoryMappingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WrapCategoryMappingWhereInput
  }

  /**
   * WrapCountOutputType without action
   */
  export type WrapCountOutputTypeCountBookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
  }

  /**
   * WrapCountOutputType without action
   */
  export type WrapCountOutputTypeCountPreviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VisualizerPreviewWhereInput
  }


  /**
   * Count Type WrapCategoryCountOutputType
   */

  export type WrapCategoryCountOutputType = {
    wraps: number
  }

  export type WrapCategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wraps?: boolean | WrapCategoryCountOutputTypeCountWrapsArgs
  }

  // Custom InputTypes
  /**
   * WrapCategoryCountOutputType without action
   */
  export type WrapCategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategoryCountOutputType
     */
    select?: WrapCategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WrapCategoryCountOutputType without action
   */
  export type WrapCategoryCountOutputTypeCountWrapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WrapCategoryMappingWhereInput
  }


  /**
   * Count Type InvoiceCountOutputType
   */

  export type InvoiceCountOutputType = {
    lineItems: number
    payments: number
  }

  export type InvoiceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lineItems?: boolean | InvoiceCountOutputTypeCountLineItemsArgs
    payments?: boolean | InvoiceCountOutputTypeCountPaymentsArgs
  }

  // Custom InputTypes
  /**
   * InvoiceCountOutputType without action
   */
  export type InvoiceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceCountOutputType
     */
    select?: InvoiceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InvoiceCountOutputType without action
   */
  export type InvoiceCountOutputTypeCountLineItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceLineItemWhereInput
  }

  /**
   * InvoiceCountOutputType without action
   */
  export type InvoiceCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Tenant
   */

  export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  export type TenantMinAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type TenantMaxAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type TenantCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type TenantMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type TenantMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type TenantCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type TenantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenant to aggregate.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tenants
    **/
    _count?: true | TenantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantMaxAggregateInputType
  }

  export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
        [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenant[P]>
      : GetScalarType<T[P], AggregateTenant[P]>
  }




  export type TenantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithAggregationInput | TenantOrderByWithAggregationInput[]
    by: TenantScalarFieldEnum[] | TenantScalarFieldEnum
    having?: TenantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantCountAggregateInputType | true
    _min?: TenantMinAggregateInputType
    _max?: TenantMaxAggregateInputType
  }

  export type TenantGroupByOutputType = {
    id: string
    name: string
    slug: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: TenantCountAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantGroupByOutputType[P]>
            : GetScalarType<T[P], TenantGroupByOutputType[P]>
        }
      >
    >


  export type TenantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    members?: boolean | Tenant$membersArgs<ExtArgs>
    wraps?: boolean | Tenant$wrapsArgs<ExtArgs>
    wrapCategories?: boolean | Tenant$wrapCategoriesArgs<ExtArgs>
    availabilityRules?: boolean | Tenant$availabilityRulesArgs<ExtArgs>
    bookings?: boolean | Tenant$bookingsArgs<ExtArgs>
    previews?: boolean | Tenant$previewsArgs<ExtArgs>
    invoices?: boolean | Tenant$invoicesArgs<ExtArgs>
    auditLogs?: boolean | Tenant$auditLogsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type TenantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["tenant"]>
  export type TenantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | Tenant$membersArgs<ExtArgs>
    wraps?: boolean | Tenant$wrapsArgs<ExtArgs>
    wrapCategories?: boolean | Tenant$wrapCategoriesArgs<ExtArgs>
    availabilityRules?: boolean | Tenant$availabilityRulesArgs<ExtArgs>
    bookings?: boolean | Tenant$bookingsArgs<ExtArgs>
    previews?: boolean | Tenant$previewsArgs<ExtArgs>
    invoices?: boolean | Tenant$invoicesArgs<ExtArgs>
    auditLogs?: boolean | Tenant$auditLogsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TenantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TenantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TenantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tenant"
    objects: {
      members: Prisma.$TenantUserMembershipPayload<ExtArgs>[]
      wraps: Prisma.$WrapPayload<ExtArgs>[]
      wrapCategories: Prisma.$WrapCategoryPayload<ExtArgs>[]
      availabilityRules: Prisma.$AvailabilityRulePayload<ExtArgs>[]
      bookings: Prisma.$BookingPayload<ExtArgs>[]
      previews: Prisma.$VisualizerPreviewPayload<ExtArgs>[]
      invoices: Prisma.$InvoicePayload<ExtArgs>[]
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      slug: string
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["tenant"]>
    composites: {}
  }

  type TenantGetPayload<S extends boolean | null | undefined | TenantDefaultArgs> = $Result.GetResult<Prisma.$TenantPayload, S>

  type TenantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantCountAggregateInputType | true
    }

  export interface TenantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tenant'], meta: { name: 'Tenant' } }
    /**
     * Find zero or one Tenant that matches the filter.
     * @param {TenantFindUniqueArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantFindUniqueArgs>(args: SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tenant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantFindUniqueOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantFindFirstArgs>(args?: SelectSubset<T, TenantFindFirstArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tenants
     * const tenants = await prisma.tenant.findMany()
     * 
     * // Get first 10 Tenants
     * const tenants = await prisma.tenant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantWithIdOnly = await prisma.tenant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantFindManyArgs>(args?: SelectSubset<T, TenantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tenant.
     * @param {TenantCreateArgs} args - Arguments to create a Tenant.
     * @example
     * // Create one Tenant
     * const Tenant = await prisma.tenant.create({
     *   data: {
     *     // ... data to create a Tenant
     *   }
     * })
     * 
     */
    create<T extends TenantCreateArgs>(args: SelectSubset<T, TenantCreateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tenants.
     * @param {TenantCreateManyArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantCreateManyArgs>(args?: SelectSubset<T, TenantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tenants and returns the data saved in the database.
     * @param {TenantCreateManyAndReturnArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TenantCreateManyAndReturnArgs>(args?: SelectSubset<T, TenantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tenant.
     * @param {TenantDeleteArgs} args - Arguments to delete one Tenant.
     * @example
     * // Delete one Tenant
     * const Tenant = await prisma.tenant.delete({
     *   where: {
     *     // ... filter to delete one Tenant
     *   }
     * })
     * 
     */
    delete<T extends TenantDeleteArgs>(args: SelectSubset<T, TenantDeleteArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tenant.
     * @param {TenantUpdateArgs} args - Arguments to update one Tenant.
     * @example
     * // Update one Tenant
     * const tenant = await prisma.tenant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantUpdateArgs>(args: SelectSubset<T, TenantUpdateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tenants.
     * @param {TenantDeleteManyArgs} args - Arguments to filter Tenants to delete.
     * @example
     * // Delete a few Tenants
     * const { count } = await prisma.tenant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantDeleteManyArgs>(args?: SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantUpdateManyArgs>(args: SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants and returns the data updated in the database.
     * @param {TenantUpdateManyAndReturnArgs} args - Arguments to update many Tenants.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TenantUpdateManyAndReturnArgs>(args: SelectSubset<T, TenantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tenant.
     * @param {TenantUpsertArgs} args - Arguments to update or create a Tenant.
     * @example
     * // Update or create a Tenant
     * const tenant = await prisma.tenant.upsert({
     *   create: {
     *     // ... data to create a Tenant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tenant we want to update
     *   }
     * })
     */
    upsert<T extends TenantUpsertArgs>(args: SelectSubset<T, TenantUpsertArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantCountArgs} args - Arguments to filter Tenants to count.
     * @example
     * // Count the number of Tenants
     * const count = await prisma.tenant.count({
     *   where: {
     *     // ... the filter for the Tenants we want to count
     *   }
     * })
    **/
    count<T extends TenantCountArgs>(
      args?: Subset<T, TenantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantAggregateArgs>(args: Subset<T, TenantAggregateArgs>): Prisma.PrismaPromise<GetTenantAggregateType<T>>

    /**
     * Group by Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantGroupByArgs['orderBy'] }
        : { orderBy?: TenantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tenant model
   */
  readonly fields: TenantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tenant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    members<T extends Tenant$membersArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantUserMembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    wraps<T extends Tenant$wrapsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$wrapsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WrapPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    wrapCategories<T extends Tenant$wrapCategoriesArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$wrapCategoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WrapCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    availabilityRules<T extends Tenant$availabilityRulesArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$availabilityRulesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AvailabilityRulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    bookings<T extends Tenant$bookingsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$bookingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    previews<T extends Tenant$previewsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$previewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisualizerPreviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    invoices<T extends Tenant$invoicesArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$invoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    auditLogs<T extends Tenant$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tenant model
   */
  interface TenantFieldRefs {
    readonly id: FieldRef<"Tenant", 'String'>
    readonly name: FieldRef<"Tenant", 'String'>
    readonly slug: FieldRef<"Tenant", 'String'>
    readonly createdAt: FieldRef<"Tenant", 'DateTime'>
    readonly updatedAt: FieldRef<"Tenant", 'DateTime'>
    readonly deletedAt: FieldRef<"Tenant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tenant findUnique
   */
  export type TenantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findUniqueOrThrow
   */
  export type TenantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findFirst
   */
  export type TenantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findFirstOrThrow
   */
  export type TenantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findMany
   */
  export type TenantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenants to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant create
   */
  export type TenantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to create a Tenant.
     */
    data: XOR<TenantCreateInput, TenantUncheckedCreateInput>
  }

  /**
   * Tenant createMany
   */
  export type TenantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant createManyAndReturn
   */
  export type TenantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant update
   */
  export type TenantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to update a Tenant.
     */
    data: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
    /**
     * Choose, which Tenant to update.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant updateMany
   */
  export type TenantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant updateManyAndReturn
   */
  export type TenantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant upsert
   */
  export type TenantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The filter to search for the Tenant to update in case it exists.
     */
    where: TenantWhereUniqueInput
    /**
     * In case the Tenant found by the `where` argument doesn't exist, create a new Tenant with this data.
     */
    create: XOR<TenantCreateInput, TenantUncheckedCreateInput>
    /**
     * In case the Tenant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
  }

  /**
   * Tenant delete
   */
  export type TenantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter which Tenant to delete.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant deleteMany
   */
  export type TenantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenants to delete
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to delete.
     */
    limit?: number
  }

  /**
   * Tenant.members
   */
  export type Tenant$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUserMembership
     */
    select?: TenantUserMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUserMembership
     */
    omit?: TenantUserMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserMembershipInclude<ExtArgs> | null
    where?: TenantUserMembershipWhereInput
    orderBy?: TenantUserMembershipOrderByWithRelationInput | TenantUserMembershipOrderByWithRelationInput[]
    cursor?: TenantUserMembershipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TenantUserMembershipScalarFieldEnum | TenantUserMembershipScalarFieldEnum[]
  }

  /**
   * Tenant.wraps
   */
  export type Tenant$wrapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wrap
     */
    select?: WrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wrap
     */
    omit?: WrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapInclude<ExtArgs> | null
    where?: WrapWhereInput
    orderBy?: WrapOrderByWithRelationInput | WrapOrderByWithRelationInput[]
    cursor?: WrapWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WrapScalarFieldEnum | WrapScalarFieldEnum[]
  }

  /**
   * Tenant.wrapCategories
   */
  export type Tenant$wrapCategoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategory
     */
    select?: WrapCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategory
     */
    omit?: WrapCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryInclude<ExtArgs> | null
    where?: WrapCategoryWhereInput
    orderBy?: WrapCategoryOrderByWithRelationInput | WrapCategoryOrderByWithRelationInput[]
    cursor?: WrapCategoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WrapCategoryScalarFieldEnum | WrapCategoryScalarFieldEnum[]
  }

  /**
   * Tenant.availabilityRules
   */
  export type Tenant$availabilityRulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AvailabilityRule
     */
    select?: AvailabilityRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AvailabilityRule
     */
    omit?: AvailabilityRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityRuleInclude<ExtArgs> | null
    where?: AvailabilityRuleWhereInput
    orderBy?: AvailabilityRuleOrderByWithRelationInput | AvailabilityRuleOrderByWithRelationInput[]
    cursor?: AvailabilityRuleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AvailabilityRuleScalarFieldEnum | AvailabilityRuleScalarFieldEnum[]
  }

  /**
   * Tenant.bookings
   */
  export type Tenant$bookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    cursor?: BookingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Tenant.previews
   */
  export type Tenant$previewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisualizerPreview
     */
    select?: VisualizerPreviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisualizerPreview
     */
    omit?: VisualizerPreviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisualizerPreviewInclude<ExtArgs> | null
    where?: VisualizerPreviewWhereInput
    orderBy?: VisualizerPreviewOrderByWithRelationInput | VisualizerPreviewOrderByWithRelationInput[]
    cursor?: VisualizerPreviewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VisualizerPreviewScalarFieldEnum | VisualizerPreviewScalarFieldEnum[]
  }

  /**
   * Tenant.invoices
   */
  export type Tenant$invoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    cursor?: InvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Tenant.auditLogs
   */
  export type Tenant$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * Tenant without action
   */
  export type TenantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
  }


  /**
   * Model TenantUserMembership
   */

  export type AggregateTenantUserMembership = {
    _count: TenantUserMembershipCountAggregateOutputType | null
    _min: TenantUserMembershipMinAggregateOutputType | null
    _max: TenantUserMembershipMaxAggregateOutputType | null
  }

  export type TenantUserMembershipMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    userId: string | null
    role: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type TenantUserMembershipMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    userId: string | null
    role: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type TenantUserMembershipCountAggregateOutputType = {
    id: number
    tenantId: number
    userId: number
    role: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type TenantUserMembershipMinAggregateInputType = {
    id?: true
    tenantId?: true
    userId?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type TenantUserMembershipMaxAggregateInputType = {
    id?: true
    tenantId?: true
    userId?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type TenantUserMembershipCountAggregateInputType = {
    id?: true
    tenantId?: true
    userId?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type TenantUserMembershipAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantUserMembership to aggregate.
     */
    where?: TenantUserMembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantUserMemberships to fetch.
     */
    orderBy?: TenantUserMembershipOrderByWithRelationInput | TenantUserMembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantUserMembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantUserMemberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantUserMemberships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TenantUserMemberships
    **/
    _count?: true | TenantUserMembershipCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantUserMembershipMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantUserMembershipMaxAggregateInputType
  }

  export type GetTenantUserMembershipAggregateType<T extends TenantUserMembershipAggregateArgs> = {
        [P in keyof T & keyof AggregateTenantUserMembership]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenantUserMembership[P]>
      : GetScalarType<T[P], AggregateTenantUserMembership[P]>
  }




  export type TenantUserMembershipGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantUserMembershipWhereInput
    orderBy?: TenantUserMembershipOrderByWithAggregationInput | TenantUserMembershipOrderByWithAggregationInput[]
    by: TenantUserMembershipScalarFieldEnum[] | TenantUserMembershipScalarFieldEnum
    having?: TenantUserMembershipScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantUserMembershipCountAggregateInputType | true
    _min?: TenantUserMembershipMinAggregateInputType
    _max?: TenantUserMembershipMaxAggregateInputType
  }

  export type TenantUserMembershipGroupByOutputType = {
    id: string
    tenantId: string
    userId: string
    role: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: TenantUserMembershipCountAggregateOutputType | null
    _min: TenantUserMembershipMinAggregateOutputType | null
    _max: TenantUserMembershipMaxAggregateOutputType | null
  }

  type GetTenantUserMembershipGroupByPayload<T extends TenantUserMembershipGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantUserMembershipGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantUserMembershipGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantUserMembershipGroupByOutputType[P]>
            : GetScalarType<T[P], TenantUserMembershipGroupByOutputType[P]>
        }
      >
    >


  export type TenantUserMembershipSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    userId?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenantUserMembership"]>

  export type TenantUserMembershipSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    userId?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenantUserMembership"]>

  export type TenantUserMembershipSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    userId?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenantUserMembership"]>

  export type TenantUserMembershipSelectScalar = {
    id?: boolean
    tenantId?: boolean
    userId?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type TenantUserMembershipOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "userId" | "role" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["tenantUserMembership"]>
  export type TenantUserMembershipInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type TenantUserMembershipIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type TenantUserMembershipIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $TenantUserMembershipPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TenantUserMembership"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      userId: string
      role: string
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["tenantUserMembership"]>
    composites: {}
  }

  type TenantUserMembershipGetPayload<S extends boolean | null | undefined | TenantUserMembershipDefaultArgs> = $Result.GetResult<Prisma.$TenantUserMembershipPayload, S>

  type TenantUserMembershipCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantUserMembershipFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantUserMembershipCountAggregateInputType | true
    }

  export interface TenantUserMembershipDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TenantUserMembership'], meta: { name: 'TenantUserMembership' } }
    /**
     * Find zero or one TenantUserMembership that matches the filter.
     * @param {TenantUserMembershipFindUniqueArgs} args - Arguments to find a TenantUserMembership
     * @example
     * // Get one TenantUserMembership
     * const tenantUserMembership = await prisma.tenantUserMembership.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantUserMembershipFindUniqueArgs>(args: SelectSubset<T, TenantUserMembershipFindUniqueArgs<ExtArgs>>): Prisma__TenantUserMembershipClient<$Result.GetResult<Prisma.$TenantUserMembershipPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TenantUserMembership that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantUserMembershipFindUniqueOrThrowArgs} args - Arguments to find a TenantUserMembership
     * @example
     * // Get one TenantUserMembership
     * const tenantUserMembership = await prisma.tenantUserMembership.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantUserMembershipFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantUserMembershipFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantUserMembershipClient<$Result.GetResult<Prisma.$TenantUserMembershipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TenantUserMembership that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUserMembershipFindFirstArgs} args - Arguments to find a TenantUserMembership
     * @example
     * // Get one TenantUserMembership
     * const tenantUserMembership = await prisma.tenantUserMembership.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantUserMembershipFindFirstArgs>(args?: SelectSubset<T, TenantUserMembershipFindFirstArgs<ExtArgs>>): Prisma__TenantUserMembershipClient<$Result.GetResult<Prisma.$TenantUserMembershipPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TenantUserMembership that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUserMembershipFindFirstOrThrowArgs} args - Arguments to find a TenantUserMembership
     * @example
     * // Get one TenantUserMembership
     * const tenantUserMembership = await prisma.tenantUserMembership.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantUserMembershipFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantUserMembershipFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantUserMembershipClient<$Result.GetResult<Prisma.$TenantUserMembershipPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TenantUserMemberships that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUserMembershipFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TenantUserMemberships
     * const tenantUserMemberships = await prisma.tenantUserMembership.findMany()
     * 
     * // Get first 10 TenantUserMemberships
     * const tenantUserMemberships = await prisma.tenantUserMembership.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantUserMembershipWithIdOnly = await prisma.tenantUserMembership.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantUserMembershipFindManyArgs>(args?: SelectSubset<T, TenantUserMembershipFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantUserMembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TenantUserMembership.
     * @param {TenantUserMembershipCreateArgs} args - Arguments to create a TenantUserMembership.
     * @example
     * // Create one TenantUserMembership
     * const TenantUserMembership = await prisma.tenantUserMembership.create({
     *   data: {
     *     // ... data to create a TenantUserMembership
     *   }
     * })
     * 
     */
    create<T extends TenantUserMembershipCreateArgs>(args: SelectSubset<T, TenantUserMembershipCreateArgs<ExtArgs>>): Prisma__TenantUserMembershipClient<$Result.GetResult<Prisma.$TenantUserMembershipPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TenantUserMemberships.
     * @param {TenantUserMembershipCreateManyArgs} args - Arguments to create many TenantUserMemberships.
     * @example
     * // Create many TenantUserMemberships
     * const tenantUserMembership = await prisma.tenantUserMembership.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantUserMembershipCreateManyArgs>(args?: SelectSubset<T, TenantUserMembershipCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TenantUserMemberships and returns the data saved in the database.
     * @param {TenantUserMembershipCreateManyAndReturnArgs} args - Arguments to create many TenantUserMemberships.
     * @example
     * // Create many TenantUserMemberships
     * const tenantUserMembership = await prisma.tenantUserMembership.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TenantUserMemberships and only return the `id`
     * const tenantUserMembershipWithIdOnly = await prisma.tenantUserMembership.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TenantUserMembershipCreateManyAndReturnArgs>(args?: SelectSubset<T, TenantUserMembershipCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantUserMembershipPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TenantUserMembership.
     * @param {TenantUserMembershipDeleteArgs} args - Arguments to delete one TenantUserMembership.
     * @example
     * // Delete one TenantUserMembership
     * const TenantUserMembership = await prisma.tenantUserMembership.delete({
     *   where: {
     *     // ... filter to delete one TenantUserMembership
     *   }
     * })
     * 
     */
    delete<T extends TenantUserMembershipDeleteArgs>(args: SelectSubset<T, TenantUserMembershipDeleteArgs<ExtArgs>>): Prisma__TenantUserMembershipClient<$Result.GetResult<Prisma.$TenantUserMembershipPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TenantUserMembership.
     * @param {TenantUserMembershipUpdateArgs} args - Arguments to update one TenantUserMembership.
     * @example
     * // Update one TenantUserMembership
     * const tenantUserMembership = await prisma.tenantUserMembership.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantUserMembershipUpdateArgs>(args: SelectSubset<T, TenantUserMembershipUpdateArgs<ExtArgs>>): Prisma__TenantUserMembershipClient<$Result.GetResult<Prisma.$TenantUserMembershipPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TenantUserMemberships.
     * @param {TenantUserMembershipDeleteManyArgs} args - Arguments to filter TenantUserMemberships to delete.
     * @example
     * // Delete a few TenantUserMemberships
     * const { count } = await prisma.tenantUserMembership.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantUserMembershipDeleteManyArgs>(args?: SelectSubset<T, TenantUserMembershipDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantUserMemberships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUserMembershipUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TenantUserMemberships
     * const tenantUserMembership = await prisma.tenantUserMembership.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantUserMembershipUpdateManyArgs>(args: SelectSubset<T, TenantUserMembershipUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantUserMemberships and returns the data updated in the database.
     * @param {TenantUserMembershipUpdateManyAndReturnArgs} args - Arguments to update many TenantUserMemberships.
     * @example
     * // Update many TenantUserMemberships
     * const tenantUserMembership = await prisma.tenantUserMembership.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TenantUserMemberships and only return the `id`
     * const tenantUserMembershipWithIdOnly = await prisma.tenantUserMembership.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TenantUserMembershipUpdateManyAndReturnArgs>(args: SelectSubset<T, TenantUserMembershipUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantUserMembershipPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TenantUserMembership.
     * @param {TenantUserMembershipUpsertArgs} args - Arguments to update or create a TenantUserMembership.
     * @example
     * // Update or create a TenantUserMembership
     * const tenantUserMembership = await prisma.tenantUserMembership.upsert({
     *   create: {
     *     // ... data to create a TenantUserMembership
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TenantUserMembership we want to update
     *   }
     * })
     */
    upsert<T extends TenantUserMembershipUpsertArgs>(args: SelectSubset<T, TenantUserMembershipUpsertArgs<ExtArgs>>): Prisma__TenantUserMembershipClient<$Result.GetResult<Prisma.$TenantUserMembershipPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TenantUserMemberships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUserMembershipCountArgs} args - Arguments to filter TenantUserMemberships to count.
     * @example
     * // Count the number of TenantUserMemberships
     * const count = await prisma.tenantUserMembership.count({
     *   where: {
     *     // ... the filter for the TenantUserMemberships we want to count
     *   }
     * })
    **/
    count<T extends TenantUserMembershipCountArgs>(
      args?: Subset<T, TenantUserMembershipCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantUserMembershipCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TenantUserMembership.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUserMembershipAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantUserMembershipAggregateArgs>(args: Subset<T, TenantUserMembershipAggregateArgs>): Prisma.PrismaPromise<GetTenantUserMembershipAggregateType<T>>

    /**
     * Group by TenantUserMembership.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUserMembershipGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantUserMembershipGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantUserMembershipGroupByArgs['orderBy'] }
        : { orderBy?: TenantUserMembershipGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantUserMembershipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantUserMembershipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TenantUserMembership model
   */
  readonly fields: TenantUserMembershipFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TenantUserMembership.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantUserMembershipClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TenantUserMembership model
   */
  interface TenantUserMembershipFieldRefs {
    readonly id: FieldRef<"TenantUserMembership", 'String'>
    readonly tenantId: FieldRef<"TenantUserMembership", 'String'>
    readonly userId: FieldRef<"TenantUserMembership", 'String'>
    readonly role: FieldRef<"TenantUserMembership", 'String'>
    readonly createdAt: FieldRef<"TenantUserMembership", 'DateTime'>
    readonly updatedAt: FieldRef<"TenantUserMembership", 'DateTime'>
    readonly deletedAt: FieldRef<"TenantUserMembership", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TenantUserMembership findUnique
   */
  export type TenantUserMembershipFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUserMembership
     */
    select?: TenantUserMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUserMembership
     */
    omit?: TenantUserMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserMembershipInclude<ExtArgs> | null
    /**
     * Filter, which TenantUserMembership to fetch.
     */
    where: TenantUserMembershipWhereUniqueInput
  }

  /**
   * TenantUserMembership findUniqueOrThrow
   */
  export type TenantUserMembershipFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUserMembership
     */
    select?: TenantUserMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUserMembership
     */
    omit?: TenantUserMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserMembershipInclude<ExtArgs> | null
    /**
     * Filter, which TenantUserMembership to fetch.
     */
    where: TenantUserMembershipWhereUniqueInput
  }

  /**
   * TenantUserMembership findFirst
   */
  export type TenantUserMembershipFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUserMembership
     */
    select?: TenantUserMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUserMembership
     */
    omit?: TenantUserMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserMembershipInclude<ExtArgs> | null
    /**
     * Filter, which TenantUserMembership to fetch.
     */
    where?: TenantUserMembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantUserMemberships to fetch.
     */
    orderBy?: TenantUserMembershipOrderByWithRelationInput | TenantUserMembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantUserMemberships.
     */
    cursor?: TenantUserMembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantUserMemberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantUserMemberships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantUserMemberships.
     */
    distinct?: TenantUserMembershipScalarFieldEnum | TenantUserMembershipScalarFieldEnum[]
  }

  /**
   * TenantUserMembership findFirstOrThrow
   */
  export type TenantUserMembershipFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUserMembership
     */
    select?: TenantUserMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUserMembership
     */
    omit?: TenantUserMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserMembershipInclude<ExtArgs> | null
    /**
     * Filter, which TenantUserMembership to fetch.
     */
    where?: TenantUserMembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantUserMemberships to fetch.
     */
    orderBy?: TenantUserMembershipOrderByWithRelationInput | TenantUserMembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantUserMemberships.
     */
    cursor?: TenantUserMembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantUserMemberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantUserMemberships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantUserMemberships.
     */
    distinct?: TenantUserMembershipScalarFieldEnum | TenantUserMembershipScalarFieldEnum[]
  }

  /**
   * TenantUserMembership findMany
   */
  export type TenantUserMembershipFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUserMembership
     */
    select?: TenantUserMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUserMembership
     */
    omit?: TenantUserMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserMembershipInclude<ExtArgs> | null
    /**
     * Filter, which TenantUserMemberships to fetch.
     */
    where?: TenantUserMembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantUserMemberships to fetch.
     */
    orderBy?: TenantUserMembershipOrderByWithRelationInput | TenantUserMembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TenantUserMemberships.
     */
    cursor?: TenantUserMembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantUserMemberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantUserMemberships.
     */
    skip?: number
    distinct?: TenantUserMembershipScalarFieldEnum | TenantUserMembershipScalarFieldEnum[]
  }

  /**
   * TenantUserMembership create
   */
  export type TenantUserMembershipCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUserMembership
     */
    select?: TenantUserMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUserMembership
     */
    omit?: TenantUserMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserMembershipInclude<ExtArgs> | null
    /**
     * The data needed to create a TenantUserMembership.
     */
    data: XOR<TenantUserMembershipCreateInput, TenantUserMembershipUncheckedCreateInput>
  }

  /**
   * TenantUserMembership createMany
   */
  export type TenantUserMembershipCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TenantUserMemberships.
     */
    data: TenantUserMembershipCreateManyInput | TenantUserMembershipCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TenantUserMembership createManyAndReturn
   */
  export type TenantUserMembershipCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUserMembership
     */
    select?: TenantUserMembershipSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUserMembership
     */
    omit?: TenantUserMembershipOmit<ExtArgs> | null
    /**
     * The data used to create many TenantUserMemberships.
     */
    data: TenantUserMembershipCreateManyInput | TenantUserMembershipCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserMembershipIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TenantUserMembership update
   */
  export type TenantUserMembershipUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUserMembership
     */
    select?: TenantUserMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUserMembership
     */
    omit?: TenantUserMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserMembershipInclude<ExtArgs> | null
    /**
     * The data needed to update a TenantUserMembership.
     */
    data: XOR<TenantUserMembershipUpdateInput, TenantUserMembershipUncheckedUpdateInput>
    /**
     * Choose, which TenantUserMembership to update.
     */
    where: TenantUserMembershipWhereUniqueInput
  }

  /**
   * TenantUserMembership updateMany
   */
  export type TenantUserMembershipUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TenantUserMemberships.
     */
    data: XOR<TenantUserMembershipUpdateManyMutationInput, TenantUserMembershipUncheckedUpdateManyInput>
    /**
     * Filter which TenantUserMemberships to update
     */
    where?: TenantUserMembershipWhereInput
    /**
     * Limit how many TenantUserMemberships to update.
     */
    limit?: number
  }

  /**
   * TenantUserMembership updateManyAndReturn
   */
  export type TenantUserMembershipUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUserMembership
     */
    select?: TenantUserMembershipSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUserMembership
     */
    omit?: TenantUserMembershipOmit<ExtArgs> | null
    /**
     * The data used to update TenantUserMemberships.
     */
    data: XOR<TenantUserMembershipUpdateManyMutationInput, TenantUserMembershipUncheckedUpdateManyInput>
    /**
     * Filter which TenantUserMemberships to update
     */
    where?: TenantUserMembershipWhereInput
    /**
     * Limit how many TenantUserMemberships to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserMembershipIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TenantUserMembership upsert
   */
  export type TenantUserMembershipUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUserMembership
     */
    select?: TenantUserMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUserMembership
     */
    omit?: TenantUserMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserMembershipInclude<ExtArgs> | null
    /**
     * The filter to search for the TenantUserMembership to update in case it exists.
     */
    where: TenantUserMembershipWhereUniqueInput
    /**
     * In case the TenantUserMembership found by the `where` argument doesn't exist, create a new TenantUserMembership with this data.
     */
    create: XOR<TenantUserMembershipCreateInput, TenantUserMembershipUncheckedCreateInput>
    /**
     * In case the TenantUserMembership was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUserMembershipUpdateInput, TenantUserMembershipUncheckedUpdateInput>
  }

  /**
   * TenantUserMembership delete
   */
  export type TenantUserMembershipDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUserMembership
     */
    select?: TenantUserMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUserMembership
     */
    omit?: TenantUserMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserMembershipInclude<ExtArgs> | null
    /**
     * Filter which TenantUserMembership to delete.
     */
    where: TenantUserMembershipWhereUniqueInput
  }

  /**
   * TenantUserMembership deleteMany
   */
  export type TenantUserMembershipDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantUserMemberships to delete
     */
    where?: TenantUserMembershipWhereInput
    /**
     * Limit how many TenantUserMemberships to delete.
     */
    limit?: number
  }

  /**
   * TenantUserMembership without action
   */
  export type TenantUserMembershipDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUserMembership
     */
    select?: TenantUserMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUserMembership
     */
    omit?: TenantUserMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserMembershipInclude<ExtArgs> | null
  }


  /**
   * Model Wrap
   */

  export type AggregateWrap = {
    _count: WrapCountAggregateOutputType | null
    _avg: WrapAvgAggregateOutputType | null
    _sum: WrapSumAggregateOutputType | null
    _min: WrapMinAggregateOutputType | null
    _max: WrapMaxAggregateOutputType | null
  }

  export type WrapAvgAggregateOutputType = {
    price: number | null
    installationMinutes: number | null
  }

  export type WrapSumAggregateOutputType = {
    price: number | null
    installationMinutes: number | null
  }

  export type WrapMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    description: string | null
    price: number | null
    installationMinutes: number | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type WrapMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    description: string | null
    price: number | null
    installationMinutes: number | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type WrapCountAggregateOutputType = {
    id: number
    tenantId: number
    name: number
    description: number
    price: number
    installationMinutes: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type WrapAvgAggregateInputType = {
    price?: true
    installationMinutes?: true
  }

  export type WrapSumAggregateInputType = {
    price?: true
    installationMinutes?: true
  }

  export type WrapMinAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    description?: true
    price?: true
    installationMinutes?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type WrapMaxAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    description?: true
    price?: true
    installationMinutes?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type WrapCountAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    description?: true
    price?: true
    installationMinutes?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type WrapAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Wrap to aggregate.
     */
    where?: WrapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wraps to fetch.
     */
    orderBy?: WrapOrderByWithRelationInput | WrapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WrapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wraps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wraps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Wraps
    **/
    _count?: true | WrapCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WrapAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WrapSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WrapMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WrapMaxAggregateInputType
  }

  export type GetWrapAggregateType<T extends WrapAggregateArgs> = {
        [P in keyof T & keyof AggregateWrap]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWrap[P]>
      : GetScalarType<T[P], AggregateWrap[P]>
  }




  export type WrapGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WrapWhereInput
    orderBy?: WrapOrderByWithAggregationInput | WrapOrderByWithAggregationInput[]
    by: WrapScalarFieldEnum[] | WrapScalarFieldEnum
    having?: WrapScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WrapCountAggregateInputType | true
    _avg?: WrapAvgAggregateInputType
    _sum?: WrapSumAggregateInputType
    _min?: WrapMinAggregateInputType
    _max?: WrapMaxAggregateInputType
  }

  export type WrapGroupByOutputType = {
    id: string
    tenantId: string
    name: string
    description: string | null
    price: number
    installationMinutes: number | null
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: WrapCountAggregateOutputType | null
    _avg: WrapAvgAggregateOutputType | null
    _sum: WrapSumAggregateOutputType | null
    _min: WrapMinAggregateOutputType | null
    _max: WrapMaxAggregateOutputType | null
  }

  type GetWrapGroupByPayload<T extends WrapGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WrapGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WrapGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WrapGroupByOutputType[P]>
            : GetScalarType<T[P], WrapGroupByOutputType[P]>
        }
      >
    >


  export type WrapSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    installationMinutes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    images?: boolean | Wrap$imagesArgs<ExtArgs>
    categoryMappings?: boolean | Wrap$categoryMappingsArgs<ExtArgs>
    bookings?: boolean | Wrap$bookingsArgs<ExtArgs>
    previews?: boolean | Wrap$previewsArgs<ExtArgs>
    _count?: boolean | WrapCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wrap"]>

  export type WrapSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    installationMinutes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wrap"]>

  export type WrapSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    installationMinutes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wrap"]>

  export type WrapSelectScalar = {
    id?: boolean
    tenantId?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    installationMinutes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type WrapOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "name" | "description" | "price" | "installationMinutes" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["wrap"]>
  export type WrapInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    images?: boolean | Wrap$imagesArgs<ExtArgs>
    categoryMappings?: boolean | Wrap$categoryMappingsArgs<ExtArgs>
    bookings?: boolean | Wrap$bookingsArgs<ExtArgs>
    previews?: boolean | Wrap$previewsArgs<ExtArgs>
    _count?: boolean | WrapCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WrapIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type WrapIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $WrapPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Wrap"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      images: Prisma.$WrapImagePayload<ExtArgs>[]
      categoryMappings: Prisma.$WrapCategoryMappingPayload<ExtArgs>[]
      bookings: Prisma.$BookingPayload<ExtArgs>[]
      previews: Prisma.$VisualizerPreviewPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      name: string
      description: string | null
      price: number
      installationMinutes: number | null
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["wrap"]>
    composites: {}
  }

  type WrapGetPayload<S extends boolean | null | undefined | WrapDefaultArgs> = $Result.GetResult<Prisma.$WrapPayload, S>

  type WrapCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WrapFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WrapCountAggregateInputType | true
    }

  export interface WrapDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Wrap'], meta: { name: 'Wrap' } }
    /**
     * Find zero or one Wrap that matches the filter.
     * @param {WrapFindUniqueArgs} args - Arguments to find a Wrap
     * @example
     * // Get one Wrap
     * const wrap = await prisma.wrap.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WrapFindUniqueArgs>(args: SelectSubset<T, WrapFindUniqueArgs<ExtArgs>>): Prisma__WrapClient<$Result.GetResult<Prisma.$WrapPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Wrap that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WrapFindUniqueOrThrowArgs} args - Arguments to find a Wrap
     * @example
     * // Get one Wrap
     * const wrap = await prisma.wrap.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WrapFindUniqueOrThrowArgs>(args: SelectSubset<T, WrapFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WrapClient<$Result.GetResult<Prisma.$WrapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Wrap that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapFindFirstArgs} args - Arguments to find a Wrap
     * @example
     * // Get one Wrap
     * const wrap = await prisma.wrap.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WrapFindFirstArgs>(args?: SelectSubset<T, WrapFindFirstArgs<ExtArgs>>): Prisma__WrapClient<$Result.GetResult<Prisma.$WrapPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Wrap that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapFindFirstOrThrowArgs} args - Arguments to find a Wrap
     * @example
     * // Get one Wrap
     * const wrap = await prisma.wrap.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WrapFindFirstOrThrowArgs>(args?: SelectSubset<T, WrapFindFirstOrThrowArgs<ExtArgs>>): Prisma__WrapClient<$Result.GetResult<Prisma.$WrapPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Wraps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Wraps
     * const wraps = await prisma.wrap.findMany()
     * 
     * // Get first 10 Wraps
     * const wraps = await prisma.wrap.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const wrapWithIdOnly = await prisma.wrap.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WrapFindManyArgs>(args?: SelectSubset<T, WrapFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WrapPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Wrap.
     * @param {WrapCreateArgs} args - Arguments to create a Wrap.
     * @example
     * // Create one Wrap
     * const Wrap = await prisma.wrap.create({
     *   data: {
     *     // ... data to create a Wrap
     *   }
     * })
     * 
     */
    create<T extends WrapCreateArgs>(args: SelectSubset<T, WrapCreateArgs<ExtArgs>>): Prisma__WrapClient<$Result.GetResult<Prisma.$WrapPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Wraps.
     * @param {WrapCreateManyArgs} args - Arguments to create many Wraps.
     * @example
     * // Create many Wraps
     * const wrap = await prisma.wrap.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WrapCreateManyArgs>(args?: SelectSubset<T, WrapCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Wraps and returns the data saved in the database.
     * @param {WrapCreateManyAndReturnArgs} args - Arguments to create many Wraps.
     * @example
     * // Create many Wraps
     * const wrap = await prisma.wrap.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Wraps and only return the `id`
     * const wrapWithIdOnly = await prisma.wrap.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WrapCreateManyAndReturnArgs>(args?: SelectSubset<T, WrapCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WrapPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Wrap.
     * @param {WrapDeleteArgs} args - Arguments to delete one Wrap.
     * @example
     * // Delete one Wrap
     * const Wrap = await prisma.wrap.delete({
     *   where: {
     *     // ... filter to delete one Wrap
     *   }
     * })
     * 
     */
    delete<T extends WrapDeleteArgs>(args: SelectSubset<T, WrapDeleteArgs<ExtArgs>>): Prisma__WrapClient<$Result.GetResult<Prisma.$WrapPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Wrap.
     * @param {WrapUpdateArgs} args - Arguments to update one Wrap.
     * @example
     * // Update one Wrap
     * const wrap = await prisma.wrap.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WrapUpdateArgs>(args: SelectSubset<T, WrapUpdateArgs<ExtArgs>>): Prisma__WrapClient<$Result.GetResult<Prisma.$WrapPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Wraps.
     * @param {WrapDeleteManyArgs} args - Arguments to filter Wraps to delete.
     * @example
     * // Delete a few Wraps
     * const { count } = await prisma.wrap.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WrapDeleteManyArgs>(args?: SelectSubset<T, WrapDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Wraps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Wraps
     * const wrap = await prisma.wrap.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WrapUpdateManyArgs>(args: SelectSubset<T, WrapUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Wraps and returns the data updated in the database.
     * @param {WrapUpdateManyAndReturnArgs} args - Arguments to update many Wraps.
     * @example
     * // Update many Wraps
     * const wrap = await prisma.wrap.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Wraps and only return the `id`
     * const wrapWithIdOnly = await prisma.wrap.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WrapUpdateManyAndReturnArgs>(args: SelectSubset<T, WrapUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WrapPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Wrap.
     * @param {WrapUpsertArgs} args - Arguments to update or create a Wrap.
     * @example
     * // Update or create a Wrap
     * const wrap = await prisma.wrap.upsert({
     *   create: {
     *     // ... data to create a Wrap
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Wrap we want to update
     *   }
     * })
     */
    upsert<T extends WrapUpsertArgs>(args: SelectSubset<T, WrapUpsertArgs<ExtArgs>>): Prisma__WrapClient<$Result.GetResult<Prisma.$WrapPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Wraps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapCountArgs} args - Arguments to filter Wraps to count.
     * @example
     * // Count the number of Wraps
     * const count = await prisma.wrap.count({
     *   where: {
     *     // ... the filter for the Wraps we want to count
     *   }
     * })
    **/
    count<T extends WrapCountArgs>(
      args?: Subset<T, WrapCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WrapCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Wrap.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WrapAggregateArgs>(args: Subset<T, WrapAggregateArgs>): Prisma.PrismaPromise<GetWrapAggregateType<T>>

    /**
     * Group by Wrap.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WrapGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WrapGroupByArgs['orderBy'] }
        : { orderBy?: WrapGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WrapGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWrapGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Wrap model
   */
  readonly fields: WrapFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Wrap.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WrapClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    images<T extends Wrap$imagesArgs<ExtArgs> = {}>(args?: Subset<T, Wrap$imagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WrapImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    categoryMappings<T extends Wrap$categoryMappingsArgs<ExtArgs> = {}>(args?: Subset<T, Wrap$categoryMappingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WrapCategoryMappingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    bookings<T extends Wrap$bookingsArgs<ExtArgs> = {}>(args?: Subset<T, Wrap$bookingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    previews<T extends Wrap$previewsArgs<ExtArgs> = {}>(args?: Subset<T, Wrap$previewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisualizerPreviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Wrap model
   */
  interface WrapFieldRefs {
    readonly id: FieldRef<"Wrap", 'String'>
    readonly tenantId: FieldRef<"Wrap", 'String'>
    readonly name: FieldRef<"Wrap", 'String'>
    readonly description: FieldRef<"Wrap", 'String'>
    readonly price: FieldRef<"Wrap", 'Float'>
    readonly installationMinutes: FieldRef<"Wrap", 'Int'>
    readonly createdAt: FieldRef<"Wrap", 'DateTime'>
    readonly updatedAt: FieldRef<"Wrap", 'DateTime'>
    readonly deletedAt: FieldRef<"Wrap", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Wrap findUnique
   */
  export type WrapFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wrap
     */
    select?: WrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wrap
     */
    omit?: WrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapInclude<ExtArgs> | null
    /**
     * Filter, which Wrap to fetch.
     */
    where: WrapWhereUniqueInput
  }

  /**
   * Wrap findUniqueOrThrow
   */
  export type WrapFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wrap
     */
    select?: WrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wrap
     */
    omit?: WrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapInclude<ExtArgs> | null
    /**
     * Filter, which Wrap to fetch.
     */
    where: WrapWhereUniqueInput
  }

  /**
   * Wrap findFirst
   */
  export type WrapFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wrap
     */
    select?: WrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wrap
     */
    omit?: WrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapInclude<ExtArgs> | null
    /**
     * Filter, which Wrap to fetch.
     */
    where?: WrapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wraps to fetch.
     */
    orderBy?: WrapOrderByWithRelationInput | WrapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Wraps.
     */
    cursor?: WrapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wraps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wraps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Wraps.
     */
    distinct?: WrapScalarFieldEnum | WrapScalarFieldEnum[]
  }

  /**
   * Wrap findFirstOrThrow
   */
  export type WrapFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wrap
     */
    select?: WrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wrap
     */
    omit?: WrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapInclude<ExtArgs> | null
    /**
     * Filter, which Wrap to fetch.
     */
    where?: WrapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wraps to fetch.
     */
    orderBy?: WrapOrderByWithRelationInput | WrapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Wraps.
     */
    cursor?: WrapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wraps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wraps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Wraps.
     */
    distinct?: WrapScalarFieldEnum | WrapScalarFieldEnum[]
  }

  /**
   * Wrap findMany
   */
  export type WrapFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wrap
     */
    select?: WrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wrap
     */
    omit?: WrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapInclude<ExtArgs> | null
    /**
     * Filter, which Wraps to fetch.
     */
    where?: WrapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wraps to fetch.
     */
    orderBy?: WrapOrderByWithRelationInput | WrapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Wraps.
     */
    cursor?: WrapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wraps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wraps.
     */
    skip?: number
    distinct?: WrapScalarFieldEnum | WrapScalarFieldEnum[]
  }

  /**
   * Wrap create
   */
  export type WrapCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wrap
     */
    select?: WrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wrap
     */
    omit?: WrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapInclude<ExtArgs> | null
    /**
     * The data needed to create a Wrap.
     */
    data: XOR<WrapCreateInput, WrapUncheckedCreateInput>
  }

  /**
   * Wrap createMany
   */
  export type WrapCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Wraps.
     */
    data: WrapCreateManyInput | WrapCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Wrap createManyAndReturn
   */
  export type WrapCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wrap
     */
    select?: WrapSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Wrap
     */
    omit?: WrapOmit<ExtArgs> | null
    /**
     * The data used to create many Wraps.
     */
    data: WrapCreateManyInput | WrapCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Wrap update
   */
  export type WrapUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wrap
     */
    select?: WrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wrap
     */
    omit?: WrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapInclude<ExtArgs> | null
    /**
     * The data needed to update a Wrap.
     */
    data: XOR<WrapUpdateInput, WrapUncheckedUpdateInput>
    /**
     * Choose, which Wrap to update.
     */
    where: WrapWhereUniqueInput
  }

  /**
   * Wrap updateMany
   */
  export type WrapUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Wraps.
     */
    data: XOR<WrapUpdateManyMutationInput, WrapUncheckedUpdateManyInput>
    /**
     * Filter which Wraps to update
     */
    where?: WrapWhereInput
    /**
     * Limit how many Wraps to update.
     */
    limit?: number
  }

  /**
   * Wrap updateManyAndReturn
   */
  export type WrapUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wrap
     */
    select?: WrapSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Wrap
     */
    omit?: WrapOmit<ExtArgs> | null
    /**
     * The data used to update Wraps.
     */
    data: XOR<WrapUpdateManyMutationInput, WrapUncheckedUpdateManyInput>
    /**
     * Filter which Wraps to update
     */
    where?: WrapWhereInput
    /**
     * Limit how many Wraps to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Wrap upsert
   */
  export type WrapUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wrap
     */
    select?: WrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wrap
     */
    omit?: WrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapInclude<ExtArgs> | null
    /**
     * The filter to search for the Wrap to update in case it exists.
     */
    where: WrapWhereUniqueInput
    /**
     * In case the Wrap found by the `where` argument doesn't exist, create a new Wrap with this data.
     */
    create: XOR<WrapCreateInput, WrapUncheckedCreateInput>
    /**
     * In case the Wrap was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WrapUpdateInput, WrapUncheckedUpdateInput>
  }

  /**
   * Wrap delete
   */
  export type WrapDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wrap
     */
    select?: WrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wrap
     */
    omit?: WrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapInclude<ExtArgs> | null
    /**
     * Filter which Wrap to delete.
     */
    where: WrapWhereUniqueInput
  }

  /**
   * Wrap deleteMany
   */
  export type WrapDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Wraps to delete
     */
    where?: WrapWhereInput
    /**
     * Limit how many Wraps to delete.
     */
    limit?: number
  }

  /**
   * Wrap.images
   */
  export type Wrap$imagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapImage
     */
    select?: WrapImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapImage
     */
    omit?: WrapImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapImageInclude<ExtArgs> | null
    where?: WrapImageWhereInput
    orderBy?: WrapImageOrderByWithRelationInput | WrapImageOrderByWithRelationInput[]
    cursor?: WrapImageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WrapImageScalarFieldEnum | WrapImageScalarFieldEnum[]
  }

  /**
   * Wrap.categoryMappings
   */
  export type Wrap$categoryMappingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategoryMapping
     */
    select?: WrapCategoryMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategoryMapping
     */
    omit?: WrapCategoryMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryMappingInclude<ExtArgs> | null
    where?: WrapCategoryMappingWhereInput
    orderBy?: WrapCategoryMappingOrderByWithRelationInput | WrapCategoryMappingOrderByWithRelationInput[]
    cursor?: WrapCategoryMappingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WrapCategoryMappingScalarFieldEnum | WrapCategoryMappingScalarFieldEnum[]
  }

  /**
   * Wrap.bookings
   */
  export type Wrap$bookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    cursor?: BookingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Wrap.previews
   */
  export type Wrap$previewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisualizerPreview
     */
    select?: VisualizerPreviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisualizerPreview
     */
    omit?: VisualizerPreviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisualizerPreviewInclude<ExtArgs> | null
    where?: VisualizerPreviewWhereInput
    orderBy?: VisualizerPreviewOrderByWithRelationInput | VisualizerPreviewOrderByWithRelationInput[]
    cursor?: VisualizerPreviewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VisualizerPreviewScalarFieldEnum | VisualizerPreviewScalarFieldEnum[]
  }

  /**
   * Wrap without action
   */
  export type WrapDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wrap
     */
    select?: WrapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wrap
     */
    omit?: WrapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapInclude<ExtArgs> | null
  }


  /**
   * Model WrapCategory
   */

  export type AggregateWrapCategory = {
    _count: WrapCategoryCountAggregateOutputType | null
    _min: WrapCategoryMinAggregateOutputType | null
    _max: WrapCategoryMaxAggregateOutputType | null
  }

  export type WrapCategoryMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    slug: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type WrapCategoryMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    slug: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type WrapCategoryCountAggregateOutputType = {
    id: number
    tenantId: number
    name: number
    slug: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type WrapCategoryMinAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    slug?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type WrapCategoryMaxAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    slug?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type WrapCategoryCountAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    slug?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type WrapCategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WrapCategory to aggregate.
     */
    where?: WrapCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WrapCategories to fetch.
     */
    orderBy?: WrapCategoryOrderByWithRelationInput | WrapCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WrapCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WrapCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WrapCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WrapCategories
    **/
    _count?: true | WrapCategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WrapCategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WrapCategoryMaxAggregateInputType
  }

  export type GetWrapCategoryAggregateType<T extends WrapCategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateWrapCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWrapCategory[P]>
      : GetScalarType<T[P], AggregateWrapCategory[P]>
  }




  export type WrapCategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WrapCategoryWhereInput
    orderBy?: WrapCategoryOrderByWithAggregationInput | WrapCategoryOrderByWithAggregationInput[]
    by: WrapCategoryScalarFieldEnum[] | WrapCategoryScalarFieldEnum
    having?: WrapCategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WrapCategoryCountAggregateInputType | true
    _min?: WrapCategoryMinAggregateInputType
    _max?: WrapCategoryMaxAggregateInputType
  }

  export type WrapCategoryGroupByOutputType = {
    id: string
    tenantId: string
    name: string
    slug: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: WrapCategoryCountAggregateOutputType | null
    _min: WrapCategoryMinAggregateOutputType | null
    _max: WrapCategoryMaxAggregateOutputType | null
  }

  type GetWrapCategoryGroupByPayload<T extends WrapCategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WrapCategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WrapCategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WrapCategoryGroupByOutputType[P]>
            : GetScalarType<T[P], WrapCategoryGroupByOutputType[P]>
        }
      >
    >


  export type WrapCategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    wraps?: boolean | WrapCategory$wrapsArgs<ExtArgs>
    _count?: boolean | WrapCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wrapCategory"]>

  export type WrapCategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wrapCategory"]>

  export type WrapCategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wrapCategory"]>

  export type WrapCategorySelectScalar = {
    id?: boolean
    tenantId?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type WrapCategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "name" | "slug" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["wrapCategory"]>
  export type WrapCategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    wraps?: boolean | WrapCategory$wrapsArgs<ExtArgs>
    _count?: boolean | WrapCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WrapCategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type WrapCategoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $WrapCategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WrapCategory"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      wraps: Prisma.$WrapCategoryMappingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      name: string
      slug: string
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["wrapCategory"]>
    composites: {}
  }

  type WrapCategoryGetPayload<S extends boolean | null | undefined | WrapCategoryDefaultArgs> = $Result.GetResult<Prisma.$WrapCategoryPayload, S>

  type WrapCategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WrapCategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WrapCategoryCountAggregateInputType | true
    }

  export interface WrapCategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WrapCategory'], meta: { name: 'WrapCategory' } }
    /**
     * Find zero or one WrapCategory that matches the filter.
     * @param {WrapCategoryFindUniqueArgs} args - Arguments to find a WrapCategory
     * @example
     * // Get one WrapCategory
     * const wrapCategory = await prisma.wrapCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WrapCategoryFindUniqueArgs>(args: SelectSubset<T, WrapCategoryFindUniqueArgs<ExtArgs>>): Prisma__WrapCategoryClient<$Result.GetResult<Prisma.$WrapCategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WrapCategory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WrapCategoryFindUniqueOrThrowArgs} args - Arguments to find a WrapCategory
     * @example
     * // Get one WrapCategory
     * const wrapCategory = await prisma.wrapCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WrapCategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, WrapCategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WrapCategoryClient<$Result.GetResult<Prisma.$WrapCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WrapCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapCategoryFindFirstArgs} args - Arguments to find a WrapCategory
     * @example
     * // Get one WrapCategory
     * const wrapCategory = await prisma.wrapCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WrapCategoryFindFirstArgs>(args?: SelectSubset<T, WrapCategoryFindFirstArgs<ExtArgs>>): Prisma__WrapCategoryClient<$Result.GetResult<Prisma.$WrapCategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WrapCategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapCategoryFindFirstOrThrowArgs} args - Arguments to find a WrapCategory
     * @example
     * // Get one WrapCategory
     * const wrapCategory = await prisma.wrapCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WrapCategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, WrapCategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__WrapCategoryClient<$Result.GetResult<Prisma.$WrapCategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WrapCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapCategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WrapCategories
     * const wrapCategories = await prisma.wrapCategory.findMany()
     * 
     * // Get first 10 WrapCategories
     * const wrapCategories = await prisma.wrapCategory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const wrapCategoryWithIdOnly = await prisma.wrapCategory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WrapCategoryFindManyArgs>(args?: SelectSubset<T, WrapCategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WrapCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WrapCategory.
     * @param {WrapCategoryCreateArgs} args - Arguments to create a WrapCategory.
     * @example
     * // Create one WrapCategory
     * const WrapCategory = await prisma.wrapCategory.create({
     *   data: {
     *     // ... data to create a WrapCategory
     *   }
     * })
     * 
     */
    create<T extends WrapCategoryCreateArgs>(args: SelectSubset<T, WrapCategoryCreateArgs<ExtArgs>>): Prisma__WrapCategoryClient<$Result.GetResult<Prisma.$WrapCategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WrapCategories.
     * @param {WrapCategoryCreateManyArgs} args - Arguments to create many WrapCategories.
     * @example
     * // Create many WrapCategories
     * const wrapCategory = await prisma.wrapCategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WrapCategoryCreateManyArgs>(args?: SelectSubset<T, WrapCategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WrapCategories and returns the data saved in the database.
     * @param {WrapCategoryCreateManyAndReturnArgs} args - Arguments to create many WrapCategories.
     * @example
     * // Create many WrapCategories
     * const wrapCategory = await prisma.wrapCategory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WrapCategories and only return the `id`
     * const wrapCategoryWithIdOnly = await prisma.wrapCategory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WrapCategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, WrapCategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WrapCategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WrapCategory.
     * @param {WrapCategoryDeleteArgs} args - Arguments to delete one WrapCategory.
     * @example
     * // Delete one WrapCategory
     * const WrapCategory = await prisma.wrapCategory.delete({
     *   where: {
     *     // ... filter to delete one WrapCategory
     *   }
     * })
     * 
     */
    delete<T extends WrapCategoryDeleteArgs>(args: SelectSubset<T, WrapCategoryDeleteArgs<ExtArgs>>): Prisma__WrapCategoryClient<$Result.GetResult<Prisma.$WrapCategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WrapCategory.
     * @param {WrapCategoryUpdateArgs} args - Arguments to update one WrapCategory.
     * @example
     * // Update one WrapCategory
     * const wrapCategory = await prisma.wrapCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WrapCategoryUpdateArgs>(args: SelectSubset<T, WrapCategoryUpdateArgs<ExtArgs>>): Prisma__WrapCategoryClient<$Result.GetResult<Prisma.$WrapCategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WrapCategories.
     * @param {WrapCategoryDeleteManyArgs} args - Arguments to filter WrapCategories to delete.
     * @example
     * // Delete a few WrapCategories
     * const { count } = await prisma.wrapCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WrapCategoryDeleteManyArgs>(args?: SelectSubset<T, WrapCategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WrapCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WrapCategories
     * const wrapCategory = await prisma.wrapCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WrapCategoryUpdateManyArgs>(args: SelectSubset<T, WrapCategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WrapCategories and returns the data updated in the database.
     * @param {WrapCategoryUpdateManyAndReturnArgs} args - Arguments to update many WrapCategories.
     * @example
     * // Update many WrapCategories
     * const wrapCategory = await prisma.wrapCategory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WrapCategories and only return the `id`
     * const wrapCategoryWithIdOnly = await prisma.wrapCategory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WrapCategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, WrapCategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WrapCategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WrapCategory.
     * @param {WrapCategoryUpsertArgs} args - Arguments to update or create a WrapCategory.
     * @example
     * // Update or create a WrapCategory
     * const wrapCategory = await prisma.wrapCategory.upsert({
     *   create: {
     *     // ... data to create a WrapCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WrapCategory we want to update
     *   }
     * })
     */
    upsert<T extends WrapCategoryUpsertArgs>(args: SelectSubset<T, WrapCategoryUpsertArgs<ExtArgs>>): Prisma__WrapCategoryClient<$Result.GetResult<Prisma.$WrapCategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WrapCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapCategoryCountArgs} args - Arguments to filter WrapCategories to count.
     * @example
     * // Count the number of WrapCategories
     * const count = await prisma.wrapCategory.count({
     *   where: {
     *     // ... the filter for the WrapCategories we want to count
     *   }
     * })
    **/
    count<T extends WrapCategoryCountArgs>(
      args?: Subset<T, WrapCategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WrapCategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WrapCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WrapCategoryAggregateArgs>(args: Subset<T, WrapCategoryAggregateArgs>): Prisma.PrismaPromise<GetWrapCategoryAggregateType<T>>

    /**
     * Group by WrapCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapCategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WrapCategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WrapCategoryGroupByArgs['orderBy'] }
        : { orderBy?: WrapCategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WrapCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWrapCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WrapCategory model
   */
  readonly fields: WrapCategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WrapCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WrapCategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    wraps<T extends WrapCategory$wrapsArgs<ExtArgs> = {}>(args?: Subset<T, WrapCategory$wrapsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WrapCategoryMappingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WrapCategory model
   */
  interface WrapCategoryFieldRefs {
    readonly id: FieldRef<"WrapCategory", 'String'>
    readonly tenantId: FieldRef<"WrapCategory", 'String'>
    readonly name: FieldRef<"WrapCategory", 'String'>
    readonly slug: FieldRef<"WrapCategory", 'String'>
    readonly createdAt: FieldRef<"WrapCategory", 'DateTime'>
    readonly updatedAt: FieldRef<"WrapCategory", 'DateTime'>
    readonly deletedAt: FieldRef<"WrapCategory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WrapCategory findUnique
   */
  export type WrapCategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategory
     */
    select?: WrapCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategory
     */
    omit?: WrapCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryInclude<ExtArgs> | null
    /**
     * Filter, which WrapCategory to fetch.
     */
    where: WrapCategoryWhereUniqueInput
  }

  /**
   * WrapCategory findUniqueOrThrow
   */
  export type WrapCategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategory
     */
    select?: WrapCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategory
     */
    omit?: WrapCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryInclude<ExtArgs> | null
    /**
     * Filter, which WrapCategory to fetch.
     */
    where: WrapCategoryWhereUniqueInput
  }

  /**
   * WrapCategory findFirst
   */
  export type WrapCategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategory
     */
    select?: WrapCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategory
     */
    omit?: WrapCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryInclude<ExtArgs> | null
    /**
     * Filter, which WrapCategory to fetch.
     */
    where?: WrapCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WrapCategories to fetch.
     */
    orderBy?: WrapCategoryOrderByWithRelationInput | WrapCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WrapCategories.
     */
    cursor?: WrapCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WrapCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WrapCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WrapCategories.
     */
    distinct?: WrapCategoryScalarFieldEnum | WrapCategoryScalarFieldEnum[]
  }

  /**
   * WrapCategory findFirstOrThrow
   */
  export type WrapCategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategory
     */
    select?: WrapCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategory
     */
    omit?: WrapCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryInclude<ExtArgs> | null
    /**
     * Filter, which WrapCategory to fetch.
     */
    where?: WrapCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WrapCategories to fetch.
     */
    orderBy?: WrapCategoryOrderByWithRelationInput | WrapCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WrapCategories.
     */
    cursor?: WrapCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WrapCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WrapCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WrapCategories.
     */
    distinct?: WrapCategoryScalarFieldEnum | WrapCategoryScalarFieldEnum[]
  }

  /**
   * WrapCategory findMany
   */
  export type WrapCategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategory
     */
    select?: WrapCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategory
     */
    omit?: WrapCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryInclude<ExtArgs> | null
    /**
     * Filter, which WrapCategories to fetch.
     */
    where?: WrapCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WrapCategories to fetch.
     */
    orderBy?: WrapCategoryOrderByWithRelationInput | WrapCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WrapCategories.
     */
    cursor?: WrapCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WrapCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WrapCategories.
     */
    skip?: number
    distinct?: WrapCategoryScalarFieldEnum | WrapCategoryScalarFieldEnum[]
  }

  /**
   * WrapCategory create
   */
  export type WrapCategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategory
     */
    select?: WrapCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategory
     */
    omit?: WrapCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a WrapCategory.
     */
    data: XOR<WrapCategoryCreateInput, WrapCategoryUncheckedCreateInput>
  }

  /**
   * WrapCategory createMany
   */
  export type WrapCategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WrapCategories.
     */
    data: WrapCategoryCreateManyInput | WrapCategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WrapCategory createManyAndReturn
   */
  export type WrapCategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategory
     */
    select?: WrapCategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategory
     */
    omit?: WrapCategoryOmit<ExtArgs> | null
    /**
     * The data used to create many WrapCategories.
     */
    data: WrapCategoryCreateManyInput | WrapCategoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WrapCategory update
   */
  export type WrapCategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategory
     */
    select?: WrapCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategory
     */
    omit?: WrapCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a WrapCategory.
     */
    data: XOR<WrapCategoryUpdateInput, WrapCategoryUncheckedUpdateInput>
    /**
     * Choose, which WrapCategory to update.
     */
    where: WrapCategoryWhereUniqueInput
  }

  /**
   * WrapCategory updateMany
   */
  export type WrapCategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WrapCategories.
     */
    data: XOR<WrapCategoryUpdateManyMutationInput, WrapCategoryUncheckedUpdateManyInput>
    /**
     * Filter which WrapCategories to update
     */
    where?: WrapCategoryWhereInput
    /**
     * Limit how many WrapCategories to update.
     */
    limit?: number
  }

  /**
   * WrapCategory updateManyAndReturn
   */
  export type WrapCategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategory
     */
    select?: WrapCategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategory
     */
    omit?: WrapCategoryOmit<ExtArgs> | null
    /**
     * The data used to update WrapCategories.
     */
    data: XOR<WrapCategoryUpdateManyMutationInput, WrapCategoryUncheckedUpdateManyInput>
    /**
     * Filter which WrapCategories to update
     */
    where?: WrapCategoryWhereInput
    /**
     * Limit how many WrapCategories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WrapCategory upsert
   */
  export type WrapCategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategory
     */
    select?: WrapCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategory
     */
    omit?: WrapCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the WrapCategory to update in case it exists.
     */
    where: WrapCategoryWhereUniqueInput
    /**
     * In case the WrapCategory found by the `where` argument doesn't exist, create a new WrapCategory with this data.
     */
    create: XOR<WrapCategoryCreateInput, WrapCategoryUncheckedCreateInput>
    /**
     * In case the WrapCategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WrapCategoryUpdateInput, WrapCategoryUncheckedUpdateInput>
  }

  /**
   * WrapCategory delete
   */
  export type WrapCategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategory
     */
    select?: WrapCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategory
     */
    omit?: WrapCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryInclude<ExtArgs> | null
    /**
     * Filter which WrapCategory to delete.
     */
    where: WrapCategoryWhereUniqueInput
  }

  /**
   * WrapCategory deleteMany
   */
  export type WrapCategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WrapCategories to delete
     */
    where?: WrapCategoryWhereInput
    /**
     * Limit how many WrapCategories to delete.
     */
    limit?: number
  }

  /**
   * WrapCategory.wraps
   */
  export type WrapCategory$wrapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategoryMapping
     */
    select?: WrapCategoryMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategoryMapping
     */
    omit?: WrapCategoryMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryMappingInclude<ExtArgs> | null
    where?: WrapCategoryMappingWhereInput
    orderBy?: WrapCategoryMappingOrderByWithRelationInput | WrapCategoryMappingOrderByWithRelationInput[]
    cursor?: WrapCategoryMappingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WrapCategoryMappingScalarFieldEnum | WrapCategoryMappingScalarFieldEnum[]
  }

  /**
   * WrapCategory without action
   */
  export type WrapCategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategory
     */
    select?: WrapCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategory
     */
    omit?: WrapCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryInclude<ExtArgs> | null
  }


  /**
   * Model WrapCategoryMapping
   */

  export type AggregateWrapCategoryMapping = {
    _count: WrapCategoryMappingCountAggregateOutputType | null
    _min: WrapCategoryMappingMinAggregateOutputType | null
    _max: WrapCategoryMappingMaxAggregateOutputType | null
  }

  export type WrapCategoryMappingMinAggregateOutputType = {
    wrapId: string | null
    categoryId: string | null
  }

  export type WrapCategoryMappingMaxAggregateOutputType = {
    wrapId: string | null
    categoryId: string | null
  }

  export type WrapCategoryMappingCountAggregateOutputType = {
    wrapId: number
    categoryId: number
    _all: number
  }


  export type WrapCategoryMappingMinAggregateInputType = {
    wrapId?: true
    categoryId?: true
  }

  export type WrapCategoryMappingMaxAggregateInputType = {
    wrapId?: true
    categoryId?: true
  }

  export type WrapCategoryMappingCountAggregateInputType = {
    wrapId?: true
    categoryId?: true
    _all?: true
  }

  export type WrapCategoryMappingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WrapCategoryMapping to aggregate.
     */
    where?: WrapCategoryMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WrapCategoryMappings to fetch.
     */
    orderBy?: WrapCategoryMappingOrderByWithRelationInput | WrapCategoryMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WrapCategoryMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WrapCategoryMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WrapCategoryMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WrapCategoryMappings
    **/
    _count?: true | WrapCategoryMappingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WrapCategoryMappingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WrapCategoryMappingMaxAggregateInputType
  }

  export type GetWrapCategoryMappingAggregateType<T extends WrapCategoryMappingAggregateArgs> = {
        [P in keyof T & keyof AggregateWrapCategoryMapping]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWrapCategoryMapping[P]>
      : GetScalarType<T[P], AggregateWrapCategoryMapping[P]>
  }




  export type WrapCategoryMappingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WrapCategoryMappingWhereInput
    orderBy?: WrapCategoryMappingOrderByWithAggregationInput | WrapCategoryMappingOrderByWithAggregationInput[]
    by: WrapCategoryMappingScalarFieldEnum[] | WrapCategoryMappingScalarFieldEnum
    having?: WrapCategoryMappingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WrapCategoryMappingCountAggregateInputType | true
    _min?: WrapCategoryMappingMinAggregateInputType
    _max?: WrapCategoryMappingMaxAggregateInputType
  }

  export type WrapCategoryMappingGroupByOutputType = {
    wrapId: string
    categoryId: string
    _count: WrapCategoryMappingCountAggregateOutputType | null
    _min: WrapCategoryMappingMinAggregateOutputType | null
    _max: WrapCategoryMappingMaxAggregateOutputType | null
  }

  type GetWrapCategoryMappingGroupByPayload<T extends WrapCategoryMappingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WrapCategoryMappingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WrapCategoryMappingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WrapCategoryMappingGroupByOutputType[P]>
            : GetScalarType<T[P], WrapCategoryMappingGroupByOutputType[P]>
        }
      >
    >


  export type WrapCategoryMappingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    wrapId?: boolean
    categoryId?: boolean
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
    category?: boolean | WrapCategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wrapCategoryMapping"]>

  export type WrapCategoryMappingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    wrapId?: boolean
    categoryId?: boolean
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
    category?: boolean | WrapCategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wrapCategoryMapping"]>

  export type WrapCategoryMappingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    wrapId?: boolean
    categoryId?: boolean
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
    category?: boolean | WrapCategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wrapCategoryMapping"]>

  export type WrapCategoryMappingSelectScalar = {
    wrapId?: boolean
    categoryId?: boolean
  }

  export type WrapCategoryMappingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"wrapId" | "categoryId", ExtArgs["result"]["wrapCategoryMapping"]>
  export type WrapCategoryMappingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
    category?: boolean | WrapCategoryDefaultArgs<ExtArgs>
  }
  export type WrapCategoryMappingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
    category?: boolean | WrapCategoryDefaultArgs<ExtArgs>
  }
  export type WrapCategoryMappingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
    category?: boolean | WrapCategoryDefaultArgs<ExtArgs>
  }

  export type $WrapCategoryMappingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WrapCategoryMapping"
    objects: {
      wrap: Prisma.$WrapPayload<ExtArgs>
      category: Prisma.$WrapCategoryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      wrapId: string
      categoryId: string
    }, ExtArgs["result"]["wrapCategoryMapping"]>
    composites: {}
  }

  type WrapCategoryMappingGetPayload<S extends boolean | null | undefined | WrapCategoryMappingDefaultArgs> = $Result.GetResult<Prisma.$WrapCategoryMappingPayload, S>

  type WrapCategoryMappingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WrapCategoryMappingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WrapCategoryMappingCountAggregateInputType | true
    }

  export interface WrapCategoryMappingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WrapCategoryMapping'], meta: { name: 'WrapCategoryMapping' } }
    /**
     * Find zero or one WrapCategoryMapping that matches the filter.
     * @param {WrapCategoryMappingFindUniqueArgs} args - Arguments to find a WrapCategoryMapping
     * @example
     * // Get one WrapCategoryMapping
     * const wrapCategoryMapping = await prisma.wrapCategoryMapping.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WrapCategoryMappingFindUniqueArgs>(args: SelectSubset<T, WrapCategoryMappingFindUniqueArgs<ExtArgs>>): Prisma__WrapCategoryMappingClient<$Result.GetResult<Prisma.$WrapCategoryMappingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WrapCategoryMapping that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WrapCategoryMappingFindUniqueOrThrowArgs} args - Arguments to find a WrapCategoryMapping
     * @example
     * // Get one WrapCategoryMapping
     * const wrapCategoryMapping = await prisma.wrapCategoryMapping.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WrapCategoryMappingFindUniqueOrThrowArgs>(args: SelectSubset<T, WrapCategoryMappingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WrapCategoryMappingClient<$Result.GetResult<Prisma.$WrapCategoryMappingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WrapCategoryMapping that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapCategoryMappingFindFirstArgs} args - Arguments to find a WrapCategoryMapping
     * @example
     * // Get one WrapCategoryMapping
     * const wrapCategoryMapping = await prisma.wrapCategoryMapping.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WrapCategoryMappingFindFirstArgs>(args?: SelectSubset<T, WrapCategoryMappingFindFirstArgs<ExtArgs>>): Prisma__WrapCategoryMappingClient<$Result.GetResult<Prisma.$WrapCategoryMappingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WrapCategoryMapping that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapCategoryMappingFindFirstOrThrowArgs} args - Arguments to find a WrapCategoryMapping
     * @example
     * // Get one WrapCategoryMapping
     * const wrapCategoryMapping = await prisma.wrapCategoryMapping.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WrapCategoryMappingFindFirstOrThrowArgs>(args?: SelectSubset<T, WrapCategoryMappingFindFirstOrThrowArgs<ExtArgs>>): Prisma__WrapCategoryMappingClient<$Result.GetResult<Prisma.$WrapCategoryMappingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WrapCategoryMappings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapCategoryMappingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WrapCategoryMappings
     * const wrapCategoryMappings = await prisma.wrapCategoryMapping.findMany()
     * 
     * // Get first 10 WrapCategoryMappings
     * const wrapCategoryMappings = await prisma.wrapCategoryMapping.findMany({ take: 10 })
     * 
     * // Only select the `wrapId`
     * const wrapCategoryMappingWithWrapIdOnly = await prisma.wrapCategoryMapping.findMany({ select: { wrapId: true } })
     * 
     */
    findMany<T extends WrapCategoryMappingFindManyArgs>(args?: SelectSubset<T, WrapCategoryMappingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WrapCategoryMappingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WrapCategoryMapping.
     * @param {WrapCategoryMappingCreateArgs} args - Arguments to create a WrapCategoryMapping.
     * @example
     * // Create one WrapCategoryMapping
     * const WrapCategoryMapping = await prisma.wrapCategoryMapping.create({
     *   data: {
     *     // ... data to create a WrapCategoryMapping
     *   }
     * })
     * 
     */
    create<T extends WrapCategoryMappingCreateArgs>(args: SelectSubset<T, WrapCategoryMappingCreateArgs<ExtArgs>>): Prisma__WrapCategoryMappingClient<$Result.GetResult<Prisma.$WrapCategoryMappingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WrapCategoryMappings.
     * @param {WrapCategoryMappingCreateManyArgs} args - Arguments to create many WrapCategoryMappings.
     * @example
     * // Create many WrapCategoryMappings
     * const wrapCategoryMapping = await prisma.wrapCategoryMapping.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WrapCategoryMappingCreateManyArgs>(args?: SelectSubset<T, WrapCategoryMappingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WrapCategoryMappings and returns the data saved in the database.
     * @param {WrapCategoryMappingCreateManyAndReturnArgs} args - Arguments to create many WrapCategoryMappings.
     * @example
     * // Create many WrapCategoryMappings
     * const wrapCategoryMapping = await prisma.wrapCategoryMapping.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WrapCategoryMappings and only return the `wrapId`
     * const wrapCategoryMappingWithWrapIdOnly = await prisma.wrapCategoryMapping.createManyAndReturn({
     *   select: { wrapId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WrapCategoryMappingCreateManyAndReturnArgs>(args?: SelectSubset<T, WrapCategoryMappingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WrapCategoryMappingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WrapCategoryMapping.
     * @param {WrapCategoryMappingDeleteArgs} args - Arguments to delete one WrapCategoryMapping.
     * @example
     * // Delete one WrapCategoryMapping
     * const WrapCategoryMapping = await prisma.wrapCategoryMapping.delete({
     *   where: {
     *     // ... filter to delete one WrapCategoryMapping
     *   }
     * })
     * 
     */
    delete<T extends WrapCategoryMappingDeleteArgs>(args: SelectSubset<T, WrapCategoryMappingDeleteArgs<ExtArgs>>): Prisma__WrapCategoryMappingClient<$Result.GetResult<Prisma.$WrapCategoryMappingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WrapCategoryMapping.
     * @param {WrapCategoryMappingUpdateArgs} args - Arguments to update one WrapCategoryMapping.
     * @example
     * // Update one WrapCategoryMapping
     * const wrapCategoryMapping = await prisma.wrapCategoryMapping.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WrapCategoryMappingUpdateArgs>(args: SelectSubset<T, WrapCategoryMappingUpdateArgs<ExtArgs>>): Prisma__WrapCategoryMappingClient<$Result.GetResult<Prisma.$WrapCategoryMappingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WrapCategoryMappings.
     * @param {WrapCategoryMappingDeleteManyArgs} args - Arguments to filter WrapCategoryMappings to delete.
     * @example
     * // Delete a few WrapCategoryMappings
     * const { count } = await prisma.wrapCategoryMapping.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WrapCategoryMappingDeleteManyArgs>(args?: SelectSubset<T, WrapCategoryMappingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WrapCategoryMappings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapCategoryMappingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WrapCategoryMappings
     * const wrapCategoryMapping = await prisma.wrapCategoryMapping.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WrapCategoryMappingUpdateManyArgs>(args: SelectSubset<T, WrapCategoryMappingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WrapCategoryMappings and returns the data updated in the database.
     * @param {WrapCategoryMappingUpdateManyAndReturnArgs} args - Arguments to update many WrapCategoryMappings.
     * @example
     * // Update many WrapCategoryMappings
     * const wrapCategoryMapping = await prisma.wrapCategoryMapping.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WrapCategoryMappings and only return the `wrapId`
     * const wrapCategoryMappingWithWrapIdOnly = await prisma.wrapCategoryMapping.updateManyAndReturn({
     *   select: { wrapId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WrapCategoryMappingUpdateManyAndReturnArgs>(args: SelectSubset<T, WrapCategoryMappingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WrapCategoryMappingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WrapCategoryMapping.
     * @param {WrapCategoryMappingUpsertArgs} args - Arguments to update or create a WrapCategoryMapping.
     * @example
     * // Update or create a WrapCategoryMapping
     * const wrapCategoryMapping = await prisma.wrapCategoryMapping.upsert({
     *   create: {
     *     // ... data to create a WrapCategoryMapping
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WrapCategoryMapping we want to update
     *   }
     * })
     */
    upsert<T extends WrapCategoryMappingUpsertArgs>(args: SelectSubset<T, WrapCategoryMappingUpsertArgs<ExtArgs>>): Prisma__WrapCategoryMappingClient<$Result.GetResult<Prisma.$WrapCategoryMappingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WrapCategoryMappings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapCategoryMappingCountArgs} args - Arguments to filter WrapCategoryMappings to count.
     * @example
     * // Count the number of WrapCategoryMappings
     * const count = await prisma.wrapCategoryMapping.count({
     *   where: {
     *     // ... the filter for the WrapCategoryMappings we want to count
     *   }
     * })
    **/
    count<T extends WrapCategoryMappingCountArgs>(
      args?: Subset<T, WrapCategoryMappingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WrapCategoryMappingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WrapCategoryMapping.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapCategoryMappingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WrapCategoryMappingAggregateArgs>(args: Subset<T, WrapCategoryMappingAggregateArgs>): Prisma.PrismaPromise<GetWrapCategoryMappingAggregateType<T>>

    /**
     * Group by WrapCategoryMapping.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapCategoryMappingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WrapCategoryMappingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WrapCategoryMappingGroupByArgs['orderBy'] }
        : { orderBy?: WrapCategoryMappingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WrapCategoryMappingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWrapCategoryMappingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WrapCategoryMapping model
   */
  readonly fields: WrapCategoryMappingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WrapCategoryMapping.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WrapCategoryMappingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wrap<T extends WrapDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WrapDefaultArgs<ExtArgs>>): Prisma__WrapClient<$Result.GetResult<Prisma.$WrapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    category<T extends WrapCategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WrapCategoryDefaultArgs<ExtArgs>>): Prisma__WrapCategoryClient<$Result.GetResult<Prisma.$WrapCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WrapCategoryMapping model
   */
  interface WrapCategoryMappingFieldRefs {
    readonly wrapId: FieldRef<"WrapCategoryMapping", 'String'>
    readonly categoryId: FieldRef<"WrapCategoryMapping", 'String'>
  }
    

  // Custom InputTypes
  /**
   * WrapCategoryMapping findUnique
   */
  export type WrapCategoryMappingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategoryMapping
     */
    select?: WrapCategoryMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategoryMapping
     */
    omit?: WrapCategoryMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryMappingInclude<ExtArgs> | null
    /**
     * Filter, which WrapCategoryMapping to fetch.
     */
    where: WrapCategoryMappingWhereUniqueInput
  }

  /**
   * WrapCategoryMapping findUniqueOrThrow
   */
  export type WrapCategoryMappingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategoryMapping
     */
    select?: WrapCategoryMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategoryMapping
     */
    omit?: WrapCategoryMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryMappingInclude<ExtArgs> | null
    /**
     * Filter, which WrapCategoryMapping to fetch.
     */
    where: WrapCategoryMappingWhereUniqueInput
  }

  /**
   * WrapCategoryMapping findFirst
   */
  export type WrapCategoryMappingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategoryMapping
     */
    select?: WrapCategoryMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategoryMapping
     */
    omit?: WrapCategoryMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryMappingInclude<ExtArgs> | null
    /**
     * Filter, which WrapCategoryMapping to fetch.
     */
    where?: WrapCategoryMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WrapCategoryMappings to fetch.
     */
    orderBy?: WrapCategoryMappingOrderByWithRelationInput | WrapCategoryMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WrapCategoryMappings.
     */
    cursor?: WrapCategoryMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WrapCategoryMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WrapCategoryMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WrapCategoryMappings.
     */
    distinct?: WrapCategoryMappingScalarFieldEnum | WrapCategoryMappingScalarFieldEnum[]
  }

  /**
   * WrapCategoryMapping findFirstOrThrow
   */
  export type WrapCategoryMappingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategoryMapping
     */
    select?: WrapCategoryMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategoryMapping
     */
    omit?: WrapCategoryMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryMappingInclude<ExtArgs> | null
    /**
     * Filter, which WrapCategoryMapping to fetch.
     */
    where?: WrapCategoryMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WrapCategoryMappings to fetch.
     */
    orderBy?: WrapCategoryMappingOrderByWithRelationInput | WrapCategoryMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WrapCategoryMappings.
     */
    cursor?: WrapCategoryMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WrapCategoryMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WrapCategoryMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WrapCategoryMappings.
     */
    distinct?: WrapCategoryMappingScalarFieldEnum | WrapCategoryMappingScalarFieldEnum[]
  }

  /**
   * WrapCategoryMapping findMany
   */
  export type WrapCategoryMappingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategoryMapping
     */
    select?: WrapCategoryMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategoryMapping
     */
    omit?: WrapCategoryMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryMappingInclude<ExtArgs> | null
    /**
     * Filter, which WrapCategoryMappings to fetch.
     */
    where?: WrapCategoryMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WrapCategoryMappings to fetch.
     */
    orderBy?: WrapCategoryMappingOrderByWithRelationInput | WrapCategoryMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WrapCategoryMappings.
     */
    cursor?: WrapCategoryMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WrapCategoryMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WrapCategoryMappings.
     */
    skip?: number
    distinct?: WrapCategoryMappingScalarFieldEnum | WrapCategoryMappingScalarFieldEnum[]
  }

  /**
   * WrapCategoryMapping create
   */
  export type WrapCategoryMappingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategoryMapping
     */
    select?: WrapCategoryMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategoryMapping
     */
    omit?: WrapCategoryMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryMappingInclude<ExtArgs> | null
    /**
     * The data needed to create a WrapCategoryMapping.
     */
    data: XOR<WrapCategoryMappingCreateInput, WrapCategoryMappingUncheckedCreateInput>
  }

  /**
   * WrapCategoryMapping createMany
   */
  export type WrapCategoryMappingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WrapCategoryMappings.
     */
    data: WrapCategoryMappingCreateManyInput | WrapCategoryMappingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WrapCategoryMapping createManyAndReturn
   */
  export type WrapCategoryMappingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategoryMapping
     */
    select?: WrapCategoryMappingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategoryMapping
     */
    omit?: WrapCategoryMappingOmit<ExtArgs> | null
    /**
     * The data used to create many WrapCategoryMappings.
     */
    data: WrapCategoryMappingCreateManyInput | WrapCategoryMappingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryMappingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WrapCategoryMapping update
   */
  export type WrapCategoryMappingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategoryMapping
     */
    select?: WrapCategoryMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategoryMapping
     */
    omit?: WrapCategoryMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryMappingInclude<ExtArgs> | null
    /**
     * The data needed to update a WrapCategoryMapping.
     */
    data: XOR<WrapCategoryMappingUpdateInput, WrapCategoryMappingUncheckedUpdateInput>
    /**
     * Choose, which WrapCategoryMapping to update.
     */
    where: WrapCategoryMappingWhereUniqueInput
  }

  /**
   * WrapCategoryMapping updateMany
   */
  export type WrapCategoryMappingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WrapCategoryMappings.
     */
    data: XOR<WrapCategoryMappingUpdateManyMutationInput, WrapCategoryMappingUncheckedUpdateManyInput>
    /**
     * Filter which WrapCategoryMappings to update
     */
    where?: WrapCategoryMappingWhereInput
    /**
     * Limit how many WrapCategoryMappings to update.
     */
    limit?: number
  }

  /**
   * WrapCategoryMapping updateManyAndReturn
   */
  export type WrapCategoryMappingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategoryMapping
     */
    select?: WrapCategoryMappingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategoryMapping
     */
    omit?: WrapCategoryMappingOmit<ExtArgs> | null
    /**
     * The data used to update WrapCategoryMappings.
     */
    data: XOR<WrapCategoryMappingUpdateManyMutationInput, WrapCategoryMappingUncheckedUpdateManyInput>
    /**
     * Filter which WrapCategoryMappings to update
     */
    where?: WrapCategoryMappingWhereInput
    /**
     * Limit how many WrapCategoryMappings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryMappingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WrapCategoryMapping upsert
   */
  export type WrapCategoryMappingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategoryMapping
     */
    select?: WrapCategoryMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategoryMapping
     */
    omit?: WrapCategoryMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryMappingInclude<ExtArgs> | null
    /**
     * The filter to search for the WrapCategoryMapping to update in case it exists.
     */
    where: WrapCategoryMappingWhereUniqueInput
    /**
     * In case the WrapCategoryMapping found by the `where` argument doesn't exist, create a new WrapCategoryMapping with this data.
     */
    create: XOR<WrapCategoryMappingCreateInput, WrapCategoryMappingUncheckedCreateInput>
    /**
     * In case the WrapCategoryMapping was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WrapCategoryMappingUpdateInput, WrapCategoryMappingUncheckedUpdateInput>
  }

  /**
   * WrapCategoryMapping delete
   */
  export type WrapCategoryMappingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategoryMapping
     */
    select?: WrapCategoryMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategoryMapping
     */
    omit?: WrapCategoryMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryMappingInclude<ExtArgs> | null
    /**
     * Filter which WrapCategoryMapping to delete.
     */
    where: WrapCategoryMappingWhereUniqueInput
  }

  /**
   * WrapCategoryMapping deleteMany
   */
  export type WrapCategoryMappingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WrapCategoryMappings to delete
     */
    where?: WrapCategoryMappingWhereInput
    /**
     * Limit how many WrapCategoryMappings to delete.
     */
    limit?: number
  }

  /**
   * WrapCategoryMapping without action
   */
  export type WrapCategoryMappingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapCategoryMapping
     */
    select?: WrapCategoryMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapCategoryMapping
     */
    omit?: WrapCategoryMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapCategoryMappingInclude<ExtArgs> | null
  }


  /**
   * Model WrapImage
   */

  export type AggregateWrapImage = {
    _count: WrapImageCountAggregateOutputType | null
    _avg: WrapImageAvgAggregateOutputType | null
    _sum: WrapImageSumAggregateOutputType | null
    _min: WrapImageMinAggregateOutputType | null
    _max: WrapImageMaxAggregateOutputType | null
  }

  export type WrapImageAvgAggregateOutputType = {
    displayOrder: number | null
  }

  export type WrapImageSumAggregateOutputType = {
    displayOrder: number | null
  }

  export type WrapImageMinAggregateOutputType = {
    id: string | null
    wrapId: string | null
    url: string | null
    displayOrder: number | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type WrapImageMaxAggregateOutputType = {
    id: string | null
    wrapId: string | null
    url: string | null
    displayOrder: number | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type WrapImageCountAggregateOutputType = {
    id: number
    wrapId: number
    url: number
    displayOrder: number
    createdAt: number
    deletedAt: number
    _all: number
  }


  export type WrapImageAvgAggregateInputType = {
    displayOrder?: true
  }

  export type WrapImageSumAggregateInputType = {
    displayOrder?: true
  }

  export type WrapImageMinAggregateInputType = {
    id?: true
    wrapId?: true
    url?: true
    displayOrder?: true
    createdAt?: true
    deletedAt?: true
  }

  export type WrapImageMaxAggregateInputType = {
    id?: true
    wrapId?: true
    url?: true
    displayOrder?: true
    createdAt?: true
    deletedAt?: true
  }

  export type WrapImageCountAggregateInputType = {
    id?: true
    wrapId?: true
    url?: true
    displayOrder?: true
    createdAt?: true
    deletedAt?: true
    _all?: true
  }

  export type WrapImageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WrapImage to aggregate.
     */
    where?: WrapImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WrapImages to fetch.
     */
    orderBy?: WrapImageOrderByWithRelationInput | WrapImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WrapImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WrapImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WrapImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WrapImages
    **/
    _count?: true | WrapImageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WrapImageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WrapImageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WrapImageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WrapImageMaxAggregateInputType
  }

  export type GetWrapImageAggregateType<T extends WrapImageAggregateArgs> = {
        [P in keyof T & keyof AggregateWrapImage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWrapImage[P]>
      : GetScalarType<T[P], AggregateWrapImage[P]>
  }




  export type WrapImageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WrapImageWhereInput
    orderBy?: WrapImageOrderByWithAggregationInput | WrapImageOrderByWithAggregationInput[]
    by: WrapImageScalarFieldEnum[] | WrapImageScalarFieldEnum
    having?: WrapImageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WrapImageCountAggregateInputType | true
    _avg?: WrapImageAvgAggregateInputType
    _sum?: WrapImageSumAggregateInputType
    _min?: WrapImageMinAggregateInputType
    _max?: WrapImageMaxAggregateInputType
  }

  export type WrapImageGroupByOutputType = {
    id: string
    wrapId: string
    url: string
    displayOrder: number
    createdAt: Date
    deletedAt: Date | null
    _count: WrapImageCountAggregateOutputType | null
    _avg: WrapImageAvgAggregateOutputType | null
    _sum: WrapImageSumAggregateOutputType | null
    _min: WrapImageMinAggregateOutputType | null
    _max: WrapImageMaxAggregateOutputType | null
  }

  type GetWrapImageGroupByPayload<T extends WrapImageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WrapImageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WrapImageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WrapImageGroupByOutputType[P]>
            : GetScalarType<T[P], WrapImageGroupByOutputType[P]>
        }
      >
    >


  export type WrapImageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wrapId?: boolean
    url?: boolean
    displayOrder?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wrapImage"]>

  export type WrapImageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wrapId?: boolean
    url?: boolean
    displayOrder?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wrapImage"]>

  export type WrapImageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wrapId?: boolean
    url?: boolean
    displayOrder?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wrapImage"]>

  export type WrapImageSelectScalar = {
    id?: boolean
    wrapId?: boolean
    url?: boolean
    displayOrder?: boolean
    createdAt?: boolean
    deletedAt?: boolean
  }

  export type WrapImageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "wrapId" | "url" | "displayOrder" | "createdAt" | "deletedAt", ExtArgs["result"]["wrapImage"]>
  export type WrapImageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
  }
  export type WrapImageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
  }
  export type WrapImageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
  }

  export type $WrapImagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WrapImage"
    objects: {
      wrap: Prisma.$WrapPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      wrapId: string
      url: string
      displayOrder: number
      createdAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["wrapImage"]>
    composites: {}
  }

  type WrapImageGetPayload<S extends boolean | null | undefined | WrapImageDefaultArgs> = $Result.GetResult<Prisma.$WrapImagePayload, S>

  type WrapImageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WrapImageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WrapImageCountAggregateInputType | true
    }

  export interface WrapImageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WrapImage'], meta: { name: 'WrapImage' } }
    /**
     * Find zero or one WrapImage that matches the filter.
     * @param {WrapImageFindUniqueArgs} args - Arguments to find a WrapImage
     * @example
     * // Get one WrapImage
     * const wrapImage = await prisma.wrapImage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WrapImageFindUniqueArgs>(args: SelectSubset<T, WrapImageFindUniqueArgs<ExtArgs>>): Prisma__WrapImageClient<$Result.GetResult<Prisma.$WrapImagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WrapImage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WrapImageFindUniqueOrThrowArgs} args - Arguments to find a WrapImage
     * @example
     * // Get one WrapImage
     * const wrapImage = await prisma.wrapImage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WrapImageFindUniqueOrThrowArgs>(args: SelectSubset<T, WrapImageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WrapImageClient<$Result.GetResult<Prisma.$WrapImagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WrapImage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapImageFindFirstArgs} args - Arguments to find a WrapImage
     * @example
     * // Get one WrapImage
     * const wrapImage = await prisma.wrapImage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WrapImageFindFirstArgs>(args?: SelectSubset<T, WrapImageFindFirstArgs<ExtArgs>>): Prisma__WrapImageClient<$Result.GetResult<Prisma.$WrapImagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WrapImage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapImageFindFirstOrThrowArgs} args - Arguments to find a WrapImage
     * @example
     * // Get one WrapImage
     * const wrapImage = await prisma.wrapImage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WrapImageFindFirstOrThrowArgs>(args?: SelectSubset<T, WrapImageFindFirstOrThrowArgs<ExtArgs>>): Prisma__WrapImageClient<$Result.GetResult<Prisma.$WrapImagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WrapImages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapImageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WrapImages
     * const wrapImages = await prisma.wrapImage.findMany()
     * 
     * // Get first 10 WrapImages
     * const wrapImages = await prisma.wrapImage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const wrapImageWithIdOnly = await prisma.wrapImage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WrapImageFindManyArgs>(args?: SelectSubset<T, WrapImageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WrapImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WrapImage.
     * @param {WrapImageCreateArgs} args - Arguments to create a WrapImage.
     * @example
     * // Create one WrapImage
     * const WrapImage = await prisma.wrapImage.create({
     *   data: {
     *     // ... data to create a WrapImage
     *   }
     * })
     * 
     */
    create<T extends WrapImageCreateArgs>(args: SelectSubset<T, WrapImageCreateArgs<ExtArgs>>): Prisma__WrapImageClient<$Result.GetResult<Prisma.$WrapImagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WrapImages.
     * @param {WrapImageCreateManyArgs} args - Arguments to create many WrapImages.
     * @example
     * // Create many WrapImages
     * const wrapImage = await prisma.wrapImage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WrapImageCreateManyArgs>(args?: SelectSubset<T, WrapImageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WrapImages and returns the data saved in the database.
     * @param {WrapImageCreateManyAndReturnArgs} args - Arguments to create many WrapImages.
     * @example
     * // Create many WrapImages
     * const wrapImage = await prisma.wrapImage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WrapImages and only return the `id`
     * const wrapImageWithIdOnly = await prisma.wrapImage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WrapImageCreateManyAndReturnArgs>(args?: SelectSubset<T, WrapImageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WrapImagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WrapImage.
     * @param {WrapImageDeleteArgs} args - Arguments to delete one WrapImage.
     * @example
     * // Delete one WrapImage
     * const WrapImage = await prisma.wrapImage.delete({
     *   where: {
     *     // ... filter to delete one WrapImage
     *   }
     * })
     * 
     */
    delete<T extends WrapImageDeleteArgs>(args: SelectSubset<T, WrapImageDeleteArgs<ExtArgs>>): Prisma__WrapImageClient<$Result.GetResult<Prisma.$WrapImagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WrapImage.
     * @param {WrapImageUpdateArgs} args - Arguments to update one WrapImage.
     * @example
     * // Update one WrapImage
     * const wrapImage = await prisma.wrapImage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WrapImageUpdateArgs>(args: SelectSubset<T, WrapImageUpdateArgs<ExtArgs>>): Prisma__WrapImageClient<$Result.GetResult<Prisma.$WrapImagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WrapImages.
     * @param {WrapImageDeleteManyArgs} args - Arguments to filter WrapImages to delete.
     * @example
     * // Delete a few WrapImages
     * const { count } = await prisma.wrapImage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WrapImageDeleteManyArgs>(args?: SelectSubset<T, WrapImageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WrapImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapImageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WrapImages
     * const wrapImage = await prisma.wrapImage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WrapImageUpdateManyArgs>(args: SelectSubset<T, WrapImageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WrapImages and returns the data updated in the database.
     * @param {WrapImageUpdateManyAndReturnArgs} args - Arguments to update many WrapImages.
     * @example
     * // Update many WrapImages
     * const wrapImage = await prisma.wrapImage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WrapImages and only return the `id`
     * const wrapImageWithIdOnly = await prisma.wrapImage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WrapImageUpdateManyAndReturnArgs>(args: SelectSubset<T, WrapImageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WrapImagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WrapImage.
     * @param {WrapImageUpsertArgs} args - Arguments to update or create a WrapImage.
     * @example
     * // Update or create a WrapImage
     * const wrapImage = await prisma.wrapImage.upsert({
     *   create: {
     *     // ... data to create a WrapImage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WrapImage we want to update
     *   }
     * })
     */
    upsert<T extends WrapImageUpsertArgs>(args: SelectSubset<T, WrapImageUpsertArgs<ExtArgs>>): Prisma__WrapImageClient<$Result.GetResult<Prisma.$WrapImagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WrapImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapImageCountArgs} args - Arguments to filter WrapImages to count.
     * @example
     * // Count the number of WrapImages
     * const count = await prisma.wrapImage.count({
     *   where: {
     *     // ... the filter for the WrapImages we want to count
     *   }
     * })
    **/
    count<T extends WrapImageCountArgs>(
      args?: Subset<T, WrapImageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WrapImageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WrapImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapImageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WrapImageAggregateArgs>(args: Subset<T, WrapImageAggregateArgs>): Prisma.PrismaPromise<GetWrapImageAggregateType<T>>

    /**
     * Group by WrapImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WrapImageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WrapImageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WrapImageGroupByArgs['orderBy'] }
        : { orderBy?: WrapImageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WrapImageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWrapImageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WrapImage model
   */
  readonly fields: WrapImageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WrapImage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WrapImageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wrap<T extends WrapDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WrapDefaultArgs<ExtArgs>>): Prisma__WrapClient<$Result.GetResult<Prisma.$WrapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WrapImage model
   */
  interface WrapImageFieldRefs {
    readonly id: FieldRef<"WrapImage", 'String'>
    readonly wrapId: FieldRef<"WrapImage", 'String'>
    readonly url: FieldRef<"WrapImage", 'String'>
    readonly displayOrder: FieldRef<"WrapImage", 'Int'>
    readonly createdAt: FieldRef<"WrapImage", 'DateTime'>
    readonly deletedAt: FieldRef<"WrapImage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WrapImage findUnique
   */
  export type WrapImageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapImage
     */
    select?: WrapImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapImage
     */
    omit?: WrapImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapImageInclude<ExtArgs> | null
    /**
     * Filter, which WrapImage to fetch.
     */
    where: WrapImageWhereUniqueInput
  }

  /**
   * WrapImage findUniqueOrThrow
   */
  export type WrapImageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapImage
     */
    select?: WrapImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapImage
     */
    omit?: WrapImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapImageInclude<ExtArgs> | null
    /**
     * Filter, which WrapImage to fetch.
     */
    where: WrapImageWhereUniqueInput
  }

  /**
   * WrapImage findFirst
   */
  export type WrapImageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapImage
     */
    select?: WrapImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapImage
     */
    omit?: WrapImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapImageInclude<ExtArgs> | null
    /**
     * Filter, which WrapImage to fetch.
     */
    where?: WrapImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WrapImages to fetch.
     */
    orderBy?: WrapImageOrderByWithRelationInput | WrapImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WrapImages.
     */
    cursor?: WrapImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WrapImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WrapImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WrapImages.
     */
    distinct?: WrapImageScalarFieldEnum | WrapImageScalarFieldEnum[]
  }

  /**
   * WrapImage findFirstOrThrow
   */
  export type WrapImageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapImage
     */
    select?: WrapImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapImage
     */
    omit?: WrapImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapImageInclude<ExtArgs> | null
    /**
     * Filter, which WrapImage to fetch.
     */
    where?: WrapImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WrapImages to fetch.
     */
    orderBy?: WrapImageOrderByWithRelationInput | WrapImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WrapImages.
     */
    cursor?: WrapImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WrapImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WrapImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WrapImages.
     */
    distinct?: WrapImageScalarFieldEnum | WrapImageScalarFieldEnum[]
  }

  /**
   * WrapImage findMany
   */
  export type WrapImageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapImage
     */
    select?: WrapImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapImage
     */
    omit?: WrapImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapImageInclude<ExtArgs> | null
    /**
     * Filter, which WrapImages to fetch.
     */
    where?: WrapImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WrapImages to fetch.
     */
    orderBy?: WrapImageOrderByWithRelationInput | WrapImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WrapImages.
     */
    cursor?: WrapImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WrapImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WrapImages.
     */
    skip?: number
    distinct?: WrapImageScalarFieldEnum | WrapImageScalarFieldEnum[]
  }

  /**
   * WrapImage create
   */
  export type WrapImageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapImage
     */
    select?: WrapImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapImage
     */
    omit?: WrapImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapImageInclude<ExtArgs> | null
    /**
     * The data needed to create a WrapImage.
     */
    data: XOR<WrapImageCreateInput, WrapImageUncheckedCreateInput>
  }

  /**
   * WrapImage createMany
   */
  export type WrapImageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WrapImages.
     */
    data: WrapImageCreateManyInput | WrapImageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WrapImage createManyAndReturn
   */
  export type WrapImageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapImage
     */
    select?: WrapImageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WrapImage
     */
    omit?: WrapImageOmit<ExtArgs> | null
    /**
     * The data used to create many WrapImages.
     */
    data: WrapImageCreateManyInput | WrapImageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapImageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WrapImage update
   */
  export type WrapImageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapImage
     */
    select?: WrapImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapImage
     */
    omit?: WrapImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapImageInclude<ExtArgs> | null
    /**
     * The data needed to update a WrapImage.
     */
    data: XOR<WrapImageUpdateInput, WrapImageUncheckedUpdateInput>
    /**
     * Choose, which WrapImage to update.
     */
    where: WrapImageWhereUniqueInput
  }

  /**
   * WrapImage updateMany
   */
  export type WrapImageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WrapImages.
     */
    data: XOR<WrapImageUpdateManyMutationInput, WrapImageUncheckedUpdateManyInput>
    /**
     * Filter which WrapImages to update
     */
    where?: WrapImageWhereInput
    /**
     * Limit how many WrapImages to update.
     */
    limit?: number
  }

  /**
   * WrapImage updateManyAndReturn
   */
  export type WrapImageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapImage
     */
    select?: WrapImageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WrapImage
     */
    omit?: WrapImageOmit<ExtArgs> | null
    /**
     * The data used to update WrapImages.
     */
    data: XOR<WrapImageUpdateManyMutationInput, WrapImageUncheckedUpdateManyInput>
    /**
     * Filter which WrapImages to update
     */
    where?: WrapImageWhereInput
    /**
     * Limit how many WrapImages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapImageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WrapImage upsert
   */
  export type WrapImageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapImage
     */
    select?: WrapImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapImage
     */
    omit?: WrapImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapImageInclude<ExtArgs> | null
    /**
     * The filter to search for the WrapImage to update in case it exists.
     */
    where: WrapImageWhereUniqueInput
    /**
     * In case the WrapImage found by the `where` argument doesn't exist, create a new WrapImage with this data.
     */
    create: XOR<WrapImageCreateInput, WrapImageUncheckedCreateInput>
    /**
     * In case the WrapImage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WrapImageUpdateInput, WrapImageUncheckedUpdateInput>
  }

  /**
   * WrapImage delete
   */
  export type WrapImageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapImage
     */
    select?: WrapImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapImage
     */
    omit?: WrapImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapImageInclude<ExtArgs> | null
    /**
     * Filter which WrapImage to delete.
     */
    where: WrapImageWhereUniqueInput
  }

  /**
   * WrapImage deleteMany
   */
  export type WrapImageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WrapImages to delete
     */
    where?: WrapImageWhereInput
    /**
     * Limit how many WrapImages to delete.
     */
    limit?: number
  }

  /**
   * WrapImage without action
   */
  export type WrapImageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WrapImage
     */
    select?: WrapImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WrapImage
     */
    omit?: WrapImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WrapImageInclude<ExtArgs> | null
  }


  /**
   * Model AvailabilityRule
   */

  export type AggregateAvailabilityRule = {
    _count: AvailabilityRuleCountAggregateOutputType | null
    _avg: AvailabilityRuleAvgAggregateOutputType | null
    _sum: AvailabilityRuleSumAggregateOutputType | null
    _min: AvailabilityRuleMinAggregateOutputType | null
    _max: AvailabilityRuleMaxAggregateOutputType | null
  }

  export type AvailabilityRuleAvgAggregateOutputType = {
    dayOfWeek: number | null
    capacitySlots: number | null
  }

  export type AvailabilityRuleSumAggregateOutputType = {
    dayOfWeek: number | null
    capacitySlots: number | null
  }

  export type AvailabilityRuleMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    dayOfWeek: number | null
    startTime: string | null
    endTime: string | null
    capacitySlots: number | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type AvailabilityRuleMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    dayOfWeek: number | null
    startTime: string | null
    endTime: string | null
    capacitySlots: number | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type AvailabilityRuleCountAggregateOutputType = {
    id: number
    tenantId: number
    dayOfWeek: number
    startTime: number
    endTime: number
    capacitySlots: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type AvailabilityRuleAvgAggregateInputType = {
    dayOfWeek?: true
    capacitySlots?: true
  }

  export type AvailabilityRuleSumAggregateInputType = {
    dayOfWeek?: true
    capacitySlots?: true
  }

  export type AvailabilityRuleMinAggregateInputType = {
    id?: true
    tenantId?: true
    dayOfWeek?: true
    startTime?: true
    endTime?: true
    capacitySlots?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type AvailabilityRuleMaxAggregateInputType = {
    id?: true
    tenantId?: true
    dayOfWeek?: true
    startTime?: true
    endTime?: true
    capacitySlots?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type AvailabilityRuleCountAggregateInputType = {
    id?: true
    tenantId?: true
    dayOfWeek?: true
    startTime?: true
    endTime?: true
    capacitySlots?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type AvailabilityRuleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AvailabilityRule to aggregate.
     */
    where?: AvailabilityRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AvailabilityRules to fetch.
     */
    orderBy?: AvailabilityRuleOrderByWithRelationInput | AvailabilityRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AvailabilityRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AvailabilityRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AvailabilityRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AvailabilityRules
    **/
    _count?: true | AvailabilityRuleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AvailabilityRuleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AvailabilityRuleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AvailabilityRuleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AvailabilityRuleMaxAggregateInputType
  }

  export type GetAvailabilityRuleAggregateType<T extends AvailabilityRuleAggregateArgs> = {
        [P in keyof T & keyof AggregateAvailabilityRule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAvailabilityRule[P]>
      : GetScalarType<T[P], AggregateAvailabilityRule[P]>
  }




  export type AvailabilityRuleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AvailabilityRuleWhereInput
    orderBy?: AvailabilityRuleOrderByWithAggregationInput | AvailabilityRuleOrderByWithAggregationInput[]
    by: AvailabilityRuleScalarFieldEnum[] | AvailabilityRuleScalarFieldEnum
    having?: AvailabilityRuleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AvailabilityRuleCountAggregateInputType | true
    _avg?: AvailabilityRuleAvgAggregateInputType
    _sum?: AvailabilityRuleSumAggregateInputType
    _min?: AvailabilityRuleMinAggregateInputType
    _max?: AvailabilityRuleMaxAggregateInputType
  }

  export type AvailabilityRuleGroupByOutputType = {
    id: string
    tenantId: string
    dayOfWeek: number
    startTime: string
    endTime: string
    capacitySlots: number
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: AvailabilityRuleCountAggregateOutputType | null
    _avg: AvailabilityRuleAvgAggregateOutputType | null
    _sum: AvailabilityRuleSumAggregateOutputType | null
    _min: AvailabilityRuleMinAggregateOutputType | null
    _max: AvailabilityRuleMaxAggregateOutputType | null
  }

  type GetAvailabilityRuleGroupByPayload<T extends AvailabilityRuleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AvailabilityRuleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AvailabilityRuleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AvailabilityRuleGroupByOutputType[P]>
            : GetScalarType<T[P], AvailabilityRuleGroupByOutputType[P]>
        }
      >
    >


  export type AvailabilityRuleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    dayOfWeek?: boolean
    startTime?: boolean
    endTime?: boolean
    capacitySlots?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["availabilityRule"]>

  export type AvailabilityRuleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    dayOfWeek?: boolean
    startTime?: boolean
    endTime?: boolean
    capacitySlots?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["availabilityRule"]>

  export type AvailabilityRuleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    dayOfWeek?: boolean
    startTime?: boolean
    endTime?: boolean
    capacitySlots?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["availabilityRule"]>

  export type AvailabilityRuleSelectScalar = {
    id?: boolean
    tenantId?: boolean
    dayOfWeek?: boolean
    startTime?: boolean
    endTime?: boolean
    capacitySlots?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type AvailabilityRuleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "dayOfWeek" | "startTime" | "endTime" | "capacitySlots" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["availabilityRule"]>
  export type AvailabilityRuleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type AvailabilityRuleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type AvailabilityRuleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $AvailabilityRulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AvailabilityRule"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      dayOfWeek: number
      startTime: string
      endTime: string
      capacitySlots: number
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["availabilityRule"]>
    composites: {}
  }

  type AvailabilityRuleGetPayload<S extends boolean | null | undefined | AvailabilityRuleDefaultArgs> = $Result.GetResult<Prisma.$AvailabilityRulePayload, S>

  type AvailabilityRuleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AvailabilityRuleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AvailabilityRuleCountAggregateInputType | true
    }

  export interface AvailabilityRuleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AvailabilityRule'], meta: { name: 'AvailabilityRule' } }
    /**
     * Find zero or one AvailabilityRule that matches the filter.
     * @param {AvailabilityRuleFindUniqueArgs} args - Arguments to find a AvailabilityRule
     * @example
     * // Get one AvailabilityRule
     * const availabilityRule = await prisma.availabilityRule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AvailabilityRuleFindUniqueArgs>(args: SelectSubset<T, AvailabilityRuleFindUniqueArgs<ExtArgs>>): Prisma__AvailabilityRuleClient<$Result.GetResult<Prisma.$AvailabilityRulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AvailabilityRule that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AvailabilityRuleFindUniqueOrThrowArgs} args - Arguments to find a AvailabilityRule
     * @example
     * // Get one AvailabilityRule
     * const availabilityRule = await prisma.availabilityRule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AvailabilityRuleFindUniqueOrThrowArgs>(args: SelectSubset<T, AvailabilityRuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AvailabilityRuleClient<$Result.GetResult<Prisma.$AvailabilityRulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AvailabilityRule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvailabilityRuleFindFirstArgs} args - Arguments to find a AvailabilityRule
     * @example
     * // Get one AvailabilityRule
     * const availabilityRule = await prisma.availabilityRule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AvailabilityRuleFindFirstArgs>(args?: SelectSubset<T, AvailabilityRuleFindFirstArgs<ExtArgs>>): Prisma__AvailabilityRuleClient<$Result.GetResult<Prisma.$AvailabilityRulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AvailabilityRule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvailabilityRuleFindFirstOrThrowArgs} args - Arguments to find a AvailabilityRule
     * @example
     * // Get one AvailabilityRule
     * const availabilityRule = await prisma.availabilityRule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AvailabilityRuleFindFirstOrThrowArgs>(args?: SelectSubset<T, AvailabilityRuleFindFirstOrThrowArgs<ExtArgs>>): Prisma__AvailabilityRuleClient<$Result.GetResult<Prisma.$AvailabilityRulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AvailabilityRules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvailabilityRuleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AvailabilityRules
     * const availabilityRules = await prisma.availabilityRule.findMany()
     * 
     * // Get first 10 AvailabilityRules
     * const availabilityRules = await prisma.availabilityRule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const availabilityRuleWithIdOnly = await prisma.availabilityRule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AvailabilityRuleFindManyArgs>(args?: SelectSubset<T, AvailabilityRuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AvailabilityRulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AvailabilityRule.
     * @param {AvailabilityRuleCreateArgs} args - Arguments to create a AvailabilityRule.
     * @example
     * // Create one AvailabilityRule
     * const AvailabilityRule = await prisma.availabilityRule.create({
     *   data: {
     *     // ... data to create a AvailabilityRule
     *   }
     * })
     * 
     */
    create<T extends AvailabilityRuleCreateArgs>(args: SelectSubset<T, AvailabilityRuleCreateArgs<ExtArgs>>): Prisma__AvailabilityRuleClient<$Result.GetResult<Prisma.$AvailabilityRulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AvailabilityRules.
     * @param {AvailabilityRuleCreateManyArgs} args - Arguments to create many AvailabilityRules.
     * @example
     * // Create many AvailabilityRules
     * const availabilityRule = await prisma.availabilityRule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AvailabilityRuleCreateManyArgs>(args?: SelectSubset<T, AvailabilityRuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AvailabilityRules and returns the data saved in the database.
     * @param {AvailabilityRuleCreateManyAndReturnArgs} args - Arguments to create many AvailabilityRules.
     * @example
     * // Create many AvailabilityRules
     * const availabilityRule = await prisma.availabilityRule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AvailabilityRules and only return the `id`
     * const availabilityRuleWithIdOnly = await prisma.availabilityRule.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AvailabilityRuleCreateManyAndReturnArgs>(args?: SelectSubset<T, AvailabilityRuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AvailabilityRulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AvailabilityRule.
     * @param {AvailabilityRuleDeleteArgs} args - Arguments to delete one AvailabilityRule.
     * @example
     * // Delete one AvailabilityRule
     * const AvailabilityRule = await prisma.availabilityRule.delete({
     *   where: {
     *     // ... filter to delete one AvailabilityRule
     *   }
     * })
     * 
     */
    delete<T extends AvailabilityRuleDeleteArgs>(args: SelectSubset<T, AvailabilityRuleDeleteArgs<ExtArgs>>): Prisma__AvailabilityRuleClient<$Result.GetResult<Prisma.$AvailabilityRulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AvailabilityRule.
     * @param {AvailabilityRuleUpdateArgs} args - Arguments to update one AvailabilityRule.
     * @example
     * // Update one AvailabilityRule
     * const availabilityRule = await prisma.availabilityRule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AvailabilityRuleUpdateArgs>(args: SelectSubset<T, AvailabilityRuleUpdateArgs<ExtArgs>>): Prisma__AvailabilityRuleClient<$Result.GetResult<Prisma.$AvailabilityRulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AvailabilityRules.
     * @param {AvailabilityRuleDeleteManyArgs} args - Arguments to filter AvailabilityRules to delete.
     * @example
     * // Delete a few AvailabilityRules
     * const { count } = await prisma.availabilityRule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AvailabilityRuleDeleteManyArgs>(args?: SelectSubset<T, AvailabilityRuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AvailabilityRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvailabilityRuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AvailabilityRules
     * const availabilityRule = await prisma.availabilityRule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AvailabilityRuleUpdateManyArgs>(args: SelectSubset<T, AvailabilityRuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AvailabilityRules and returns the data updated in the database.
     * @param {AvailabilityRuleUpdateManyAndReturnArgs} args - Arguments to update many AvailabilityRules.
     * @example
     * // Update many AvailabilityRules
     * const availabilityRule = await prisma.availabilityRule.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AvailabilityRules and only return the `id`
     * const availabilityRuleWithIdOnly = await prisma.availabilityRule.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AvailabilityRuleUpdateManyAndReturnArgs>(args: SelectSubset<T, AvailabilityRuleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AvailabilityRulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AvailabilityRule.
     * @param {AvailabilityRuleUpsertArgs} args - Arguments to update or create a AvailabilityRule.
     * @example
     * // Update or create a AvailabilityRule
     * const availabilityRule = await prisma.availabilityRule.upsert({
     *   create: {
     *     // ... data to create a AvailabilityRule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AvailabilityRule we want to update
     *   }
     * })
     */
    upsert<T extends AvailabilityRuleUpsertArgs>(args: SelectSubset<T, AvailabilityRuleUpsertArgs<ExtArgs>>): Prisma__AvailabilityRuleClient<$Result.GetResult<Prisma.$AvailabilityRulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AvailabilityRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvailabilityRuleCountArgs} args - Arguments to filter AvailabilityRules to count.
     * @example
     * // Count the number of AvailabilityRules
     * const count = await prisma.availabilityRule.count({
     *   where: {
     *     // ... the filter for the AvailabilityRules we want to count
     *   }
     * })
    **/
    count<T extends AvailabilityRuleCountArgs>(
      args?: Subset<T, AvailabilityRuleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AvailabilityRuleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AvailabilityRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvailabilityRuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AvailabilityRuleAggregateArgs>(args: Subset<T, AvailabilityRuleAggregateArgs>): Prisma.PrismaPromise<GetAvailabilityRuleAggregateType<T>>

    /**
     * Group by AvailabilityRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvailabilityRuleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AvailabilityRuleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AvailabilityRuleGroupByArgs['orderBy'] }
        : { orderBy?: AvailabilityRuleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AvailabilityRuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAvailabilityRuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AvailabilityRule model
   */
  readonly fields: AvailabilityRuleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AvailabilityRule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AvailabilityRuleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AvailabilityRule model
   */
  interface AvailabilityRuleFieldRefs {
    readonly id: FieldRef<"AvailabilityRule", 'String'>
    readonly tenantId: FieldRef<"AvailabilityRule", 'String'>
    readonly dayOfWeek: FieldRef<"AvailabilityRule", 'Int'>
    readonly startTime: FieldRef<"AvailabilityRule", 'String'>
    readonly endTime: FieldRef<"AvailabilityRule", 'String'>
    readonly capacitySlots: FieldRef<"AvailabilityRule", 'Int'>
    readonly createdAt: FieldRef<"AvailabilityRule", 'DateTime'>
    readonly updatedAt: FieldRef<"AvailabilityRule", 'DateTime'>
    readonly deletedAt: FieldRef<"AvailabilityRule", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AvailabilityRule findUnique
   */
  export type AvailabilityRuleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AvailabilityRule
     */
    select?: AvailabilityRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AvailabilityRule
     */
    omit?: AvailabilityRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityRuleInclude<ExtArgs> | null
    /**
     * Filter, which AvailabilityRule to fetch.
     */
    where: AvailabilityRuleWhereUniqueInput
  }

  /**
   * AvailabilityRule findUniqueOrThrow
   */
  export type AvailabilityRuleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AvailabilityRule
     */
    select?: AvailabilityRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AvailabilityRule
     */
    omit?: AvailabilityRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityRuleInclude<ExtArgs> | null
    /**
     * Filter, which AvailabilityRule to fetch.
     */
    where: AvailabilityRuleWhereUniqueInput
  }

  /**
   * AvailabilityRule findFirst
   */
  export type AvailabilityRuleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AvailabilityRule
     */
    select?: AvailabilityRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AvailabilityRule
     */
    omit?: AvailabilityRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityRuleInclude<ExtArgs> | null
    /**
     * Filter, which AvailabilityRule to fetch.
     */
    where?: AvailabilityRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AvailabilityRules to fetch.
     */
    orderBy?: AvailabilityRuleOrderByWithRelationInput | AvailabilityRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AvailabilityRules.
     */
    cursor?: AvailabilityRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AvailabilityRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AvailabilityRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AvailabilityRules.
     */
    distinct?: AvailabilityRuleScalarFieldEnum | AvailabilityRuleScalarFieldEnum[]
  }

  /**
   * AvailabilityRule findFirstOrThrow
   */
  export type AvailabilityRuleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AvailabilityRule
     */
    select?: AvailabilityRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AvailabilityRule
     */
    omit?: AvailabilityRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityRuleInclude<ExtArgs> | null
    /**
     * Filter, which AvailabilityRule to fetch.
     */
    where?: AvailabilityRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AvailabilityRules to fetch.
     */
    orderBy?: AvailabilityRuleOrderByWithRelationInput | AvailabilityRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AvailabilityRules.
     */
    cursor?: AvailabilityRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AvailabilityRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AvailabilityRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AvailabilityRules.
     */
    distinct?: AvailabilityRuleScalarFieldEnum | AvailabilityRuleScalarFieldEnum[]
  }

  /**
   * AvailabilityRule findMany
   */
  export type AvailabilityRuleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AvailabilityRule
     */
    select?: AvailabilityRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AvailabilityRule
     */
    omit?: AvailabilityRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityRuleInclude<ExtArgs> | null
    /**
     * Filter, which AvailabilityRules to fetch.
     */
    where?: AvailabilityRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AvailabilityRules to fetch.
     */
    orderBy?: AvailabilityRuleOrderByWithRelationInput | AvailabilityRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AvailabilityRules.
     */
    cursor?: AvailabilityRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AvailabilityRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AvailabilityRules.
     */
    skip?: number
    distinct?: AvailabilityRuleScalarFieldEnum | AvailabilityRuleScalarFieldEnum[]
  }

  /**
   * AvailabilityRule create
   */
  export type AvailabilityRuleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AvailabilityRule
     */
    select?: AvailabilityRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AvailabilityRule
     */
    omit?: AvailabilityRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityRuleInclude<ExtArgs> | null
    /**
     * The data needed to create a AvailabilityRule.
     */
    data: XOR<AvailabilityRuleCreateInput, AvailabilityRuleUncheckedCreateInput>
  }

  /**
   * AvailabilityRule createMany
   */
  export type AvailabilityRuleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AvailabilityRules.
     */
    data: AvailabilityRuleCreateManyInput | AvailabilityRuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AvailabilityRule createManyAndReturn
   */
  export type AvailabilityRuleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AvailabilityRule
     */
    select?: AvailabilityRuleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AvailabilityRule
     */
    omit?: AvailabilityRuleOmit<ExtArgs> | null
    /**
     * The data used to create many AvailabilityRules.
     */
    data: AvailabilityRuleCreateManyInput | AvailabilityRuleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityRuleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AvailabilityRule update
   */
  export type AvailabilityRuleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AvailabilityRule
     */
    select?: AvailabilityRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AvailabilityRule
     */
    omit?: AvailabilityRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityRuleInclude<ExtArgs> | null
    /**
     * The data needed to update a AvailabilityRule.
     */
    data: XOR<AvailabilityRuleUpdateInput, AvailabilityRuleUncheckedUpdateInput>
    /**
     * Choose, which AvailabilityRule to update.
     */
    where: AvailabilityRuleWhereUniqueInput
  }

  /**
   * AvailabilityRule updateMany
   */
  export type AvailabilityRuleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AvailabilityRules.
     */
    data: XOR<AvailabilityRuleUpdateManyMutationInput, AvailabilityRuleUncheckedUpdateManyInput>
    /**
     * Filter which AvailabilityRules to update
     */
    where?: AvailabilityRuleWhereInput
    /**
     * Limit how many AvailabilityRules to update.
     */
    limit?: number
  }

  /**
   * AvailabilityRule updateManyAndReturn
   */
  export type AvailabilityRuleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AvailabilityRule
     */
    select?: AvailabilityRuleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AvailabilityRule
     */
    omit?: AvailabilityRuleOmit<ExtArgs> | null
    /**
     * The data used to update AvailabilityRules.
     */
    data: XOR<AvailabilityRuleUpdateManyMutationInput, AvailabilityRuleUncheckedUpdateManyInput>
    /**
     * Filter which AvailabilityRules to update
     */
    where?: AvailabilityRuleWhereInput
    /**
     * Limit how many AvailabilityRules to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityRuleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AvailabilityRule upsert
   */
  export type AvailabilityRuleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AvailabilityRule
     */
    select?: AvailabilityRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AvailabilityRule
     */
    omit?: AvailabilityRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityRuleInclude<ExtArgs> | null
    /**
     * The filter to search for the AvailabilityRule to update in case it exists.
     */
    where: AvailabilityRuleWhereUniqueInput
    /**
     * In case the AvailabilityRule found by the `where` argument doesn't exist, create a new AvailabilityRule with this data.
     */
    create: XOR<AvailabilityRuleCreateInput, AvailabilityRuleUncheckedCreateInput>
    /**
     * In case the AvailabilityRule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AvailabilityRuleUpdateInput, AvailabilityRuleUncheckedUpdateInput>
  }

  /**
   * AvailabilityRule delete
   */
  export type AvailabilityRuleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AvailabilityRule
     */
    select?: AvailabilityRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AvailabilityRule
     */
    omit?: AvailabilityRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityRuleInclude<ExtArgs> | null
    /**
     * Filter which AvailabilityRule to delete.
     */
    where: AvailabilityRuleWhereUniqueInput
  }

  /**
   * AvailabilityRule deleteMany
   */
  export type AvailabilityRuleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AvailabilityRules to delete
     */
    where?: AvailabilityRuleWhereInput
    /**
     * Limit how many AvailabilityRules to delete.
     */
    limit?: number
  }

  /**
   * AvailabilityRule without action
   */
  export type AvailabilityRuleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AvailabilityRule
     */
    select?: AvailabilityRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AvailabilityRule
     */
    omit?: AvailabilityRuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityRuleInclude<ExtArgs> | null
  }


  /**
   * Model Booking
   */

  export type AggregateBooking = {
    _count: BookingCountAggregateOutputType | null
    _avg: BookingAvgAggregateOutputType | null
    _sum: BookingSumAggregateOutputType | null
    _min: BookingMinAggregateOutputType | null
    _max: BookingMaxAggregateOutputType | null
  }

  export type BookingAvgAggregateOutputType = {
    totalPrice: number | null
  }

  export type BookingSumAggregateOutputType = {
    totalPrice: number | null
  }

  export type BookingMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    customerId: string | null
    wrapId: string | null
    startTime: Date | null
    endTime: Date | null
    status: string | null
    totalPrice: number | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type BookingMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    customerId: string | null
    wrapId: string | null
    startTime: Date | null
    endTime: Date | null
    status: string | null
    totalPrice: number | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type BookingCountAggregateOutputType = {
    id: number
    tenantId: number
    customerId: number
    wrapId: number
    startTime: number
    endTime: number
    status: number
    totalPrice: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type BookingAvgAggregateInputType = {
    totalPrice?: true
  }

  export type BookingSumAggregateInputType = {
    totalPrice?: true
  }

  export type BookingMinAggregateInputType = {
    id?: true
    tenantId?: true
    customerId?: true
    wrapId?: true
    startTime?: true
    endTime?: true
    status?: true
    totalPrice?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type BookingMaxAggregateInputType = {
    id?: true
    tenantId?: true
    customerId?: true
    wrapId?: true
    startTime?: true
    endTime?: true
    status?: true
    totalPrice?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type BookingCountAggregateInputType = {
    id?: true
    tenantId?: true
    customerId?: true
    wrapId?: true
    startTime?: true
    endTime?: true
    status?: true
    totalPrice?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type BookingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Booking to aggregate.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Bookings
    **/
    _count?: true | BookingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookingMaxAggregateInputType
  }

  export type GetBookingAggregateType<T extends BookingAggregateArgs> = {
        [P in keyof T & keyof AggregateBooking]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBooking[P]>
      : GetScalarType<T[P], AggregateBooking[P]>
  }




  export type BookingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithAggregationInput | BookingOrderByWithAggregationInput[]
    by: BookingScalarFieldEnum[] | BookingScalarFieldEnum
    having?: BookingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookingCountAggregateInputType | true
    _avg?: BookingAvgAggregateInputType
    _sum?: BookingSumAggregateInputType
    _min?: BookingMinAggregateInputType
    _max?: BookingMaxAggregateInputType
  }

  export type BookingGroupByOutputType = {
    id: string
    tenantId: string
    customerId: string
    wrapId: string
    startTime: Date
    endTime: Date
    status: string
    totalPrice: number
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: BookingCountAggregateOutputType | null
    _avg: BookingAvgAggregateOutputType | null
    _sum: BookingSumAggregateOutputType | null
    _min: BookingMinAggregateOutputType | null
    _max: BookingMaxAggregateOutputType | null
  }

  type GetBookingGroupByPayload<T extends BookingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookingGroupByOutputType[P]>
            : GetScalarType<T[P], BookingGroupByOutputType[P]>
        }
      >
    >


  export type BookingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    customerId?: boolean
    wrapId?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    totalPrice?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
    reservation?: boolean | Booking$reservationArgs<ExtArgs>
    invoice?: boolean | Booking$invoiceArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    customerId?: boolean
    wrapId?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    totalPrice?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    customerId?: boolean
    wrapId?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    totalPrice?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectScalar = {
    id?: boolean
    tenantId?: boolean
    customerId?: boolean
    wrapId?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    totalPrice?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type BookingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "customerId" | "wrapId" | "startTime" | "endTime" | "status" | "totalPrice" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["booking"]>
  export type BookingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
    reservation?: boolean | Booking$reservationArgs<ExtArgs>
    invoice?: boolean | Booking$invoiceArgs<ExtArgs>
  }
  export type BookingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
  }
  export type BookingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
  }

  export type $BookingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Booking"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      wrap: Prisma.$WrapPayload<ExtArgs>
      reservation: Prisma.$BookingReservationPayload<ExtArgs> | null
      invoice: Prisma.$InvoicePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      customerId: string
      wrapId: string
      startTime: Date
      endTime: Date
      status: string
      totalPrice: number
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["booking"]>
    composites: {}
  }

  type BookingGetPayload<S extends boolean | null | undefined | BookingDefaultArgs> = $Result.GetResult<Prisma.$BookingPayload, S>

  type BookingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BookingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookingCountAggregateInputType | true
    }

  export interface BookingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Booking'], meta: { name: 'Booking' } }
    /**
     * Find zero or one Booking that matches the filter.
     * @param {BookingFindUniqueArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookingFindUniqueArgs>(args: SelectSubset<T, BookingFindUniqueArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Booking that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BookingFindUniqueOrThrowArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookingFindUniqueOrThrowArgs>(args: SelectSubset<T, BookingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Booking that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindFirstArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookingFindFirstArgs>(args?: SelectSubset<T, BookingFindFirstArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Booking that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindFirstOrThrowArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookingFindFirstOrThrowArgs>(args?: SelectSubset<T, BookingFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bookings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bookings
     * const bookings = await prisma.booking.findMany()
     * 
     * // Get first 10 Bookings
     * const bookings = await prisma.booking.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookingWithIdOnly = await prisma.booking.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookingFindManyArgs>(args?: SelectSubset<T, BookingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Booking.
     * @param {BookingCreateArgs} args - Arguments to create a Booking.
     * @example
     * // Create one Booking
     * const Booking = await prisma.booking.create({
     *   data: {
     *     // ... data to create a Booking
     *   }
     * })
     * 
     */
    create<T extends BookingCreateArgs>(args: SelectSubset<T, BookingCreateArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bookings.
     * @param {BookingCreateManyArgs} args - Arguments to create many Bookings.
     * @example
     * // Create many Bookings
     * const booking = await prisma.booking.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookingCreateManyArgs>(args?: SelectSubset<T, BookingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Bookings and returns the data saved in the database.
     * @param {BookingCreateManyAndReturnArgs} args - Arguments to create many Bookings.
     * @example
     * // Create many Bookings
     * const booking = await prisma.booking.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Bookings and only return the `id`
     * const bookingWithIdOnly = await prisma.booking.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookingCreateManyAndReturnArgs>(args?: SelectSubset<T, BookingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Booking.
     * @param {BookingDeleteArgs} args - Arguments to delete one Booking.
     * @example
     * // Delete one Booking
     * const Booking = await prisma.booking.delete({
     *   where: {
     *     // ... filter to delete one Booking
     *   }
     * })
     * 
     */
    delete<T extends BookingDeleteArgs>(args: SelectSubset<T, BookingDeleteArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Booking.
     * @param {BookingUpdateArgs} args - Arguments to update one Booking.
     * @example
     * // Update one Booking
     * const booking = await prisma.booking.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookingUpdateArgs>(args: SelectSubset<T, BookingUpdateArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bookings.
     * @param {BookingDeleteManyArgs} args - Arguments to filter Bookings to delete.
     * @example
     * // Delete a few Bookings
     * const { count } = await prisma.booking.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookingDeleteManyArgs>(args?: SelectSubset<T, BookingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bookings
     * const booking = await prisma.booking.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookingUpdateManyArgs>(args: SelectSubset<T, BookingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookings and returns the data updated in the database.
     * @param {BookingUpdateManyAndReturnArgs} args - Arguments to update many Bookings.
     * @example
     * // Update many Bookings
     * const booking = await prisma.booking.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Bookings and only return the `id`
     * const bookingWithIdOnly = await prisma.booking.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BookingUpdateManyAndReturnArgs>(args: SelectSubset<T, BookingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Booking.
     * @param {BookingUpsertArgs} args - Arguments to update or create a Booking.
     * @example
     * // Update or create a Booking
     * const booking = await prisma.booking.upsert({
     *   create: {
     *     // ... data to create a Booking
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Booking we want to update
     *   }
     * })
     */
    upsert<T extends BookingUpsertArgs>(args: SelectSubset<T, BookingUpsertArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Bookings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingCountArgs} args - Arguments to filter Bookings to count.
     * @example
     * // Count the number of Bookings
     * const count = await prisma.booking.count({
     *   where: {
     *     // ... the filter for the Bookings we want to count
     *   }
     * })
    **/
    count<T extends BookingCountArgs>(
      args?: Subset<T, BookingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Booking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookingAggregateArgs>(args: Subset<T, BookingAggregateArgs>): Prisma.PrismaPromise<GetBookingAggregateType<T>>

    /**
     * Group by Booking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BookingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookingGroupByArgs['orderBy'] }
        : { orderBy?: BookingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BookingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Booking model
   */
  readonly fields: BookingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Booking.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    wrap<T extends WrapDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WrapDefaultArgs<ExtArgs>>): Prisma__WrapClient<$Result.GetResult<Prisma.$WrapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    reservation<T extends Booking$reservationArgs<ExtArgs> = {}>(args?: Subset<T, Booking$reservationArgs<ExtArgs>>): Prisma__BookingReservationClient<$Result.GetResult<Prisma.$BookingReservationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    invoice<T extends Booking$invoiceArgs<ExtArgs> = {}>(args?: Subset<T, Booking$invoiceArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Booking model
   */
  interface BookingFieldRefs {
    readonly id: FieldRef<"Booking", 'String'>
    readonly tenantId: FieldRef<"Booking", 'String'>
    readonly customerId: FieldRef<"Booking", 'String'>
    readonly wrapId: FieldRef<"Booking", 'String'>
    readonly startTime: FieldRef<"Booking", 'DateTime'>
    readonly endTime: FieldRef<"Booking", 'DateTime'>
    readonly status: FieldRef<"Booking", 'String'>
    readonly totalPrice: FieldRef<"Booking", 'Float'>
    readonly createdAt: FieldRef<"Booking", 'DateTime'>
    readonly updatedAt: FieldRef<"Booking", 'DateTime'>
    readonly deletedAt: FieldRef<"Booking", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Booking findUnique
   */
  export type BookingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking findUniqueOrThrow
   */
  export type BookingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking findFirst
   */
  export type BookingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookings.
     */
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking findFirstOrThrow
   */
  export type BookingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookings.
     */
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking findMany
   */
  export type BookingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Bookings to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking create
   */
  export type BookingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The data needed to create a Booking.
     */
    data: XOR<BookingCreateInput, BookingUncheckedCreateInput>
  }

  /**
   * Booking createMany
   */
  export type BookingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Bookings.
     */
    data: BookingCreateManyInput | BookingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Booking createManyAndReturn
   */
  export type BookingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * The data used to create many Bookings.
     */
    data: BookingCreateManyInput | BookingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Booking update
   */
  export type BookingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The data needed to update a Booking.
     */
    data: XOR<BookingUpdateInput, BookingUncheckedUpdateInput>
    /**
     * Choose, which Booking to update.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking updateMany
   */
  export type BookingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Bookings.
     */
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyInput>
    /**
     * Filter which Bookings to update
     */
    where?: BookingWhereInput
    /**
     * Limit how many Bookings to update.
     */
    limit?: number
  }

  /**
   * Booking updateManyAndReturn
   */
  export type BookingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * The data used to update Bookings.
     */
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyInput>
    /**
     * Filter which Bookings to update
     */
    where?: BookingWhereInput
    /**
     * Limit how many Bookings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Booking upsert
   */
  export type BookingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The filter to search for the Booking to update in case it exists.
     */
    where: BookingWhereUniqueInput
    /**
     * In case the Booking found by the `where` argument doesn't exist, create a new Booking with this data.
     */
    create: XOR<BookingCreateInput, BookingUncheckedCreateInput>
    /**
     * In case the Booking was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookingUpdateInput, BookingUncheckedUpdateInput>
  }

  /**
   * Booking delete
   */
  export type BookingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter which Booking to delete.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking deleteMany
   */
  export type BookingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bookings to delete
     */
    where?: BookingWhereInput
    /**
     * Limit how many Bookings to delete.
     */
    limit?: number
  }

  /**
   * Booking.reservation
   */
  export type Booking$reservationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingReservation
     */
    select?: BookingReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingReservation
     */
    omit?: BookingReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingReservationInclude<ExtArgs> | null
    where?: BookingReservationWhereInput
  }

  /**
   * Booking.invoice
   */
  export type Booking$invoiceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    where?: InvoiceWhereInput
  }

  /**
   * Booking without action
   */
  export type BookingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
  }


  /**
   * Model BookingReservation
   */

  export type AggregateBookingReservation = {
    _count: BookingReservationCountAggregateOutputType | null
    _min: BookingReservationMinAggregateOutputType | null
    _max: BookingReservationMaxAggregateOutputType | null
  }

  export type BookingReservationMinAggregateOutputType = {
    id: string | null
    bookingId: string | null
    expiresAt: Date | null
    reservedAt: Date | null
    createdAt: Date | null
  }

  export type BookingReservationMaxAggregateOutputType = {
    id: string | null
    bookingId: string | null
    expiresAt: Date | null
    reservedAt: Date | null
    createdAt: Date | null
  }

  export type BookingReservationCountAggregateOutputType = {
    id: number
    bookingId: number
    expiresAt: number
    reservedAt: number
    createdAt: number
    _all: number
  }


  export type BookingReservationMinAggregateInputType = {
    id?: true
    bookingId?: true
    expiresAt?: true
    reservedAt?: true
    createdAt?: true
  }

  export type BookingReservationMaxAggregateInputType = {
    id?: true
    bookingId?: true
    expiresAt?: true
    reservedAt?: true
    createdAt?: true
  }

  export type BookingReservationCountAggregateInputType = {
    id?: true
    bookingId?: true
    expiresAt?: true
    reservedAt?: true
    createdAt?: true
    _all?: true
  }

  export type BookingReservationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookingReservation to aggregate.
     */
    where?: BookingReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingReservations to fetch.
     */
    orderBy?: BookingReservationOrderByWithRelationInput | BookingReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookingReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingReservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingReservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BookingReservations
    **/
    _count?: true | BookingReservationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookingReservationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookingReservationMaxAggregateInputType
  }

  export type GetBookingReservationAggregateType<T extends BookingReservationAggregateArgs> = {
        [P in keyof T & keyof AggregateBookingReservation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBookingReservation[P]>
      : GetScalarType<T[P], AggregateBookingReservation[P]>
  }




  export type BookingReservationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingReservationWhereInput
    orderBy?: BookingReservationOrderByWithAggregationInput | BookingReservationOrderByWithAggregationInput[]
    by: BookingReservationScalarFieldEnum[] | BookingReservationScalarFieldEnum
    having?: BookingReservationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookingReservationCountAggregateInputType | true
    _min?: BookingReservationMinAggregateInputType
    _max?: BookingReservationMaxAggregateInputType
  }

  export type BookingReservationGroupByOutputType = {
    id: string
    bookingId: string
    expiresAt: Date
    reservedAt: Date
    createdAt: Date
    _count: BookingReservationCountAggregateOutputType | null
    _min: BookingReservationMinAggregateOutputType | null
    _max: BookingReservationMaxAggregateOutputType | null
  }

  type GetBookingReservationGroupByPayload<T extends BookingReservationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookingReservationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookingReservationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookingReservationGroupByOutputType[P]>
            : GetScalarType<T[P], BookingReservationGroupByOutputType[P]>
        }
      >
    >


  export type BookingReservationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookingId?: boolean
    expiresAt?: boolean
    reservedAt?: boolean
    createdAt?: boolean
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookingReservation"]>

  export type BookingReservationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookingId?: boolean
    expiresAt?: boolean
    reservedAt?: boolean
    createdAt?: boolean
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookingReservation"]>

  export type BookingReservationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookingId?: boolean
    expiresAt?: boolean
    reservedAt?: boolean
    createdAt?: boolean
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookingReservation"]>

  export type BookingReservationSelectScalar = {
    id?: boolean
    bookingId?: boolean
    expiresAt?: boolean
    reservedAt?: boolean
    createdAt?: boolean
  }

  export type BookingReservationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "bookingId" | "expiresAt" | "reservedAt" | "createdAt", ExtArgs["result"]["bookingReservation"]>
  export type BookingReservationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }
  export type BookingReservationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }
  export type BookingReservationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }

  export type $BookingReservationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BookingReservation"
    objects: {
      booking: Prisma.$BookingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      bookingId: string
      expiresAt: Date
      reservedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["bookingReservation"]>
    composites: {}
  }

  type BookingReservationGetPayload<S extends boolean | null | undefined | BookingReservationDefaultArgs> = $Result.GetResult<Prisma.$BookingReservationPayload, S>

  type BookingReservationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BookingReservationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookingReservationCountAggregateInputType | true
    }

  export interface BookingReservationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BookingReservation'], meta: { name: 'BookingReservation' } }
    /**
     * Find zero or one BookingReservation that matches the filter.
     * @param {BookingReservationFindUniqueArgs} args - Arguments to find a BookingReservation
     * @example
     * // Get one BookingReservation
     * const bookingReservation = await prisma.bookingReservation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookingReservationFindUniqueArgs>(args: SelectSubset<T, BookingReservationFindUniqueArgs<ExtArgs>>): Prisma__BookingReservationClient<$Result.GetResult<Prisma.$BookingReservationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BookingReservation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BookingReservationFindUniqueOrThrowArgs} args - Arguments to find a BookingReservation
     * @example
     * // Get one BookingReservation
     * const bookingReservation = await prisma.bookingReservation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookingReservationFindUniqueOrThrowArgs>(args: SelectSubset<T, BookingReservationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookingReservationClient<$Result.GetResult<Prisma.$BookingReservationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BookingReservation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingReservationFindFirstArgs} args - Arguments to find a BookingReservation
     * @example
     * // Get one BookingReservation
     * const bookingReservation = await prisma.bookingReservation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookingReservationFindFirstArgs>(args?: SelectSubset<T, BookingReservationFindFirstArgs<ExtArgs>>): Prisma__BookingReservationClient<$Result.GetResult<Prisma.$BookingReservationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BookingReservation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingReservationFindFirstOrThrowArgs} args - Arguments to find a BookingReservation
     * @example
     * // Get one BookingReservation
     * const bookingReservation = await prisma.bookingReservation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookingReservationFindFirstOrThrowArgs>(args?: SelectSubset<T, BookingReservationFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookingReservationClient<$Result.GetResult<Prisma.$BookingReservationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BookingReservations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingReservationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BookingReservations
     * const bookingReservations = await prisma.bookingReservation.findMany()
     * 
     * // Get first 10 BookingReservations
     * const bookingReservations = await prisma.bookingReservation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookingReservationWithIdOnly = await prisma.bookingReservation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookingReservationFindManyArgs>(args?: SelectSubset<T, BookingReservationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingReservationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BookingReservation.
     * @param {BookingReservationCreateArgs} args - Arguments to create a BookingReservation.
     * @example
     * // Create one BookingReservation
     * const BookingReservation = await prisma.bookingReservation.create({
     *   data: {
     *     // ... data to create a BookingReservation
     *   }
     * })
     * 
     */
    create<T extends BookingReservationCreateArgs>(args: SelectSubset<T, BookingReservationCreateArgs<ExtArgs>>): Prisma__BookingReservationClient<$Result.GetResult<Prisma.$BookingReservationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BookingReservations.
     * @param {BookingReservationCreateManyArgs} args - Arguments to create many BookingReservations.
     * @example
     * // Create many BookingReservations
     * const bookingReservation = await prisma.bookingReservation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookingReservationCreateManyArgs>(args?: SelectSubset<T, BookingReservationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BookingReservations and returns the data saved in the database.
     * @param {BookingReservationCreateManyAndReturnArgs} args - Arguments to create many BookingReservations.
     * @example
     * // Create many BookingReservations
     * const bookingReservation = await prisma.bookingReservation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BookingReservations and only return the `id`
     * const bookingReservationWithIdOnly = await prisma.bookingReservation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookingReservationCreateManyAndReturnArgs>(args?: SelectSubset<T, BookingReservationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingReservationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BookingReservation.
     * @param {BookingReservationDeleteArgs} args - Arguments to delete one BookingReservation.
     * @example
     * // Delete one BookingReservation
     * const BookingReservation = await prisma.bookingReservation.delete({
     *   where: {
     *     // ... filter to delete one BookingReservation
     *   }
     * })
     * 
     */
    delete<T extends BookingReservationDeleteArgs>(args: SelectSubset<T, BookingReservationDeleteArgs<ExtArgs>>): Prisma__BookingReservationClient<$Result.GetResult<Prisma.$BookingReservationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BookingReservation.
     * @param {BookingReservationUpdateArgs} args - Arguments to update one BookingReservation.
     * @example
     * // Update one BookingReservation
     * const bookingReservation = await prisma.bookingReservation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookingReservationUpdateArgs>(args: SelectSubset<T, BookingReservationUpdateArgs<ExtArgs>>): Prisma__BookingReservationClient<$Result.GetResult<Prisma.$BookingReservationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BookingReservations.
     * @param {BookingReservationDeleteManyArgs} args - Arguments to filter BookingReservations to delete.
     * @example
     * // Delete a few BookingReservations
     * const { count } = await prisma.bookingReservation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookingReservationDeleteManyArgs>(args?: SelectSubset<T, BookingReservationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BookingReservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingReservationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BookingReservations
     * const bookingReservation = await prisma.bookingReservation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookingReservationUpdateManyArgs>(args: SelectSubset<T, BookingReservationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BookingReservations and returns the data updated in the database.
     * @param {BookingReservationUpdateManyAndReturnArgs} args - Arguments to update many BookingReservations.
     * @example
     * // Update many BookingReservations
     * const bookingReservation = await prisma.bookingReservation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BookingReservations and only return the `id`
     * const bookingReservationWithIdOnly = await prisma.bookingReservation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BookingReservationUpdateManyAndReturnArgs>(args: SelectSubset<T, BookingReservationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingReservationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BookingReservation.
     * @param {BookingReservationUpsertArgs} args - Arguments to update or create a BookingReservation.
     * @example
     * // Update or create a BookingReservation
     * const bookingReservation = await prisma.bookingReservation.upsert({
     *   create: {
     *     // ... data to create a BookingReservation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BookingReservation we want to update
     *   }
     * })
     */
    upsert<T extends BookingReservationUpsertArgs>(args: SelectSubset<T, BookingReservationUpsertArgs<ExtArgs>>): Prisma__BookingReservationClient<$Result.GetResult<Prisma.$BookingReservationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BookingReservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingReservationCountArgs} args - Arguments to filter BookingReservations to count.
     * @example
     * // Count the number of BookingReservations
     * const count = await prisma.bookingReservation.count({
     *   where: {
     *     // ... the filter for the BookingReservations we want to count
     *   }
     * })
    **/
    count<T extends BookingReservationCountArgs>(
      args?: Subset<T, BookingReservationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookingReservationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BookingReservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingReservationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookingReservationAggregateArgs>(args: Subset<T, BookingReservationAggregateArgs>): Prisma.PrismaPromise<GetBookingReservationAggregateType<T>>

    /**
     * Group by BookingReservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingReservationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BookingReservationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookingReservationGroupByArgs['orderBy'] }
        : { orderBy?: BookingReservationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BookingReservationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookingReservationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BookingReservation model
   */
  readonly fields: BookingReservationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BookingReservation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookingReservationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    booking<T extends BookingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BookingDefaultArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BookingReservation model
   */
  interface BookingReservationFieldRefs {
    readonly id: FieldRef<"BookingReservation", 'String'>
    readonly bookingId: FieldRef<"BookingReservation", 'String'>
    readonly expiresAt: FieldRef<"BookingReservation", 'DateTime'>
    readonly reservedAt: FieldRef<"BookingReservation", 'DateTime'>
    readonly createdAt: FieldRef<"BookingReservation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BookingReservation findUnique
   */
  export type BookingReservationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingReservation
     */
    select?: BookingReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingReservation
     */
    omit?: BookingReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingReservationInclude<ExtArgs> | null
    /**
     * Filter, which BookingReservation to fetch.
     */
    where: BookingReservationWhereUniqueInput
  }

  /**
   * BookingReservation findUniqueOrThrow
   */
  export type BookingReservationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingReservation
     */
    select?: BookingReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingReservation
     */
    omit?: BookingReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingReservationInclude<ExtArgs> | null
    /**
     * Filter, which BookingReservation to fetch.
     */
    where: BookingReservationWhereUniqueInput
  }

  /**
   * BookingReservation findFirst
   */
  export type BookingReservationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingReservation
     */
    select?: BookingReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingReservation
     */
    omit?: BookingReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingReservationInclude<ExtArgs> | null
    /**
     * Filter, which BookingReservation to fetch.
     */
    where?: BookingReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingReservations to fetch.
     */
    orderBy?: BookingReservationOrderByWithRelationInput | BookingReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookingReservations.
     */
    cursor?: BookingReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingReservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingReservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookingReservations.
     */
    distinct?: BookingReservationScalarFieldEnum | BookingReservationScalarFieldEnum[]
  }

  /**
   * BookingReservation findFirstOrThrow
   */
  export type BookingReservationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingReservation
     */
    select?: BookingReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingReservation
     */
    omit?: BookingReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingReservationInclude<ExtArgs> | null
    /**
     * Filter, which BookingReservation to fetch.
     */
    where?: BookingReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingReservations to fetch.
     */
    orderBy?: BookingReservationOrderByWithRelationInput | BookingReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookingReservations.
     */
    cursor?: BookingReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingReservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingReservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookingReservations.
     */
    distinct?: BookingReservationScalarFieldEnum | BookingReservationScalarFieldEnum[]
  }

  /**
   * BookingReservation findMany
   */
  export type BookingReservationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingReservation
     */
    select?: BookingReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingReservation
     */
    omit?: BookingReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingReservationInclude<ExtArgs> | null
    /**
     * Filter, which BookingReservations to fetch.
     */
    where?: BookingReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingReservations to fetch.
     */
    orderBy?: BookingReservationOrderByWithRelationInput | BookingReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BookingReservations.
     */
    cursor?: BookingReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingReservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingReservations.
     */
    skip?: number
    distinct?: BookingReservationScalarFieldEnum | BookingReservationScalarFieldEnum[]
  }

  /**
   * BookingReservation create
   */
  export type BookingReservationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingReservation
     */
    select?: BookingReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingReservation
     */
    omit?: BookingReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingReservationInclude<ExtArgs> | null
    /**
     * The data needed to create a BookingReservation.
     */
    data: XOR<BookingReservationCreateInput, BookingReservationUncheckedCreateInput>
  }

  /**
   * BookingReservation createMany
   */
  export type BookingReservationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BookingReservations.
     */
    data: BookingReservationCreateManyInput | BookingReservationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BookingReservation createManyAndReturn
   */
  export type BookingReservationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingReservation
     */
    select?: BookingReservationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BookingReservation
     */
    omit?: BookingReservationOmit<ExtArgs> | null
    /**
     * The data used to create many BookingReservations.
     */
    data: BookingReservationCreateManyInput | BookingReservationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingReservationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BookingReservation update
   */
  export type BookingReservationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingReservation
     */
    select?: BookingReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingReservation
     */
    omit?: BookingReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingReservationInclude<ExtArgs> | null
    /**
     * The data needed to update a BookingReservation.
     */
    data: XOR<BookingReservationUpdateInput, BookingReservationUncheckedUpdateInput>
    /**
     * Choose, which BookingReservation to update.
     */
    where: BookingReservationWhereUniqueInput
  }

  /**
   * BookingReservation updateMany
   */
  export type BookingReservationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BookingReservations.
     */
    data: XOR<BookingReservationUpdateManyMutationInput, BookingReservationUncheckedUpdateManyInput>
    /**
     * Filter which BookingReservations to update
     */
    where?: BookingReservationWhereInput
    /**
     * Limit how many BookingReservations to update.
     */
    limit?: number
  }

  /**
   * BookingReservation updateManyAndReturn
   */
  export type BookingReservationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingReservation
     */
    select?: BookingReservationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BookingReservation
     */
    omit?: BookingReservationOmit<ExtArgs> | null
    /**
     * The data used to update BookingReservations.
     */
    data: XOR<BookingReservationUpdateManyMutationInput, BookingReservationUncheckedUpdateManyInput>
    /**
     * Filter which BookingReservations to update
     */
    where?: BookingReservationWhereInput
    /**
     * Limit how many BookingReservations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingReservationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BookingReservation upsert
   */
  export type BookingReservationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingReservation
     */
    select?: BookingReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingReservation
     */
    omit?: BookingReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingReservationInclude<ExtArgs> | null
    /**
     * The filter to search for the BookingReservation to update in case it exists.
     */
    where: BookingReservationWhereUniqueInput
    /**
     * In case the BookingReservation found by the `where` argument doesn't exist, create a new BookingReservation with this data.
     */
    create: XOR<BookingReservationCreateInput, BookingReservationUncheckedCreateInput>
    /**
     * In case the BookingReservation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookingReservationUpdateInput, BookingReservationUncheckedUpdateInput>
  }

  /**
   * BookingReservation delete
   */
  export type BookingReservationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingReservation
     */
    select?: BookingReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingReservation
     */
    omit?: BookingReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingReservationInclude<ExtArgs> | null
    /**
     * Filter which BookingReservation to delete.
     */
    where: BookingReservationWhereUniqueInput
  }

  /**
   * BookingReservation deleteMany
   */
  export type BookingReservationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookingReservations to delete
     */
    where?: BookingReservationWhereInput
    /**
     * Limit how many BookingReservations to delete.
     */
    limit?: number
  }

  /**
   * BookingReservation without action
   */
  export type BookingReservationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingReservation
     */
    select?: BookingReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingReservation
     */
    omit?: BookingReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingReservationInclude<ExtArgs> | null
  }


  /**
   * Model VisualizerPreview
   */

  export type AggregateVisualizerPreview = {
    _count: VisualizerPreviewCountAggregateOutputType | null
    _min: VisualizerPreviewMinAggregateOutputType | null
    _max: VisualizerPreviewMaxAggregateOutputType | null
  }

  export type VisualizerPreviewMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    wrapId: string | null
    customerPhotoUrl: string | null
    processedImageUrl: string | null
    status: string | null
    cacheKey: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type VisualizerPreviewMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    wrapId: string | null
    customerPhotoUrl: string | null
    processedImageUrl: string | null
    status: string | null
    cacheKey: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type VisualizerPreviewCountAggregateOutputType = {
    id: number
    tenantId: number
    wrapId: number
    customerPhotoUrl: number
    processedImageUrl: number
    status: number
    cacheKey: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type VisualizerPreviewMinAggregateInputType = {
    id?: true
    tenantId?: true
    wrapId?: true
    customerPhotoUrl?: true
    processedImageUrl?: true
    status?: true
    cacheKey?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type VisualizerPreviewMaxAggregateInputType = {
    id?: true
    tenantId?: true
    wrapId?: true
    customerPhotoUrl?: true
    processedImageUrl?: true
    status?: true
    cacheKey?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type VisualizerPreviewCountAggregateInputType = {
    id?: true
    tenantId?: true
    wrapId?: true
    customerPhotoUrl?: true
    processedImageUrl?: true
    status?: true
    cacheKey?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type VisualizerPreviewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VisualizerPreview to aggregate.
     */
    where?: VisualizerPreviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisualizerPreviews to fetch.
     */
    orderBy?: VisualizerPreviewOrderByWithRelationInput | VisualizerPreviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VisualizerPreviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisualizerPreviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisualizerPreviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VisualizerPreviews
    **/
    _count?: true | VisualizerPreviewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VisualizerPreviewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VisualizerPreviewMaxAggregateInputType
  }

  export type GetVisualizerPreviewAggregateType<T extends VisualizerPreviewAggregateArgs> = {
        [P in keyof T & keyof AggregateVisualizerPreview]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVisualizerPreview[P]>
      : GetScalarType<T[P], AggregateVisualizerPreview[P]>
  }




  export type VisualizerPreviewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VisualizerPreviewWhereInput
    orderBy?: VisualizerPreviewOrderByWithAggregationInput | VisualizerPreviewOrderByWithAggregationInput[]
    by: VisualizerPreviewScalarFieldEnum[] | VisualizerPreviewScalarFieldEnum
    having?: VisualizerPreviewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VisualizerPreviewCountAggregateInputType | true
    _min?: VisualizerPreviewMinAggregateInputType
    _max?: VisualizerPreviewMaxAggregateInputType
  }

  export type VisualizerPreviewGroupByOutputType = {
    id: string
    tenantId: string
    wrapId: string
    customerPhotoUrl: string
    processedImageUrl: string | null
    status: string
    cacheKey: string
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: VisualizerPreviewCountAggregateOutputType | null
    _min: VisualizerPreviewMinAggregateOutputType | null
    _max: VisualizerPreviewMaxAggregateOutputType | null
  }

  type GetVisualizerPreviewGroupByPayload<T extends VisualizerPreviewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VisualizerPreviewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VisualizerPreviewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VisualizerPreviewGroupByOutputType[P]>
            : GetScalarType<T[P], VisualizerPreviewGroupByOutputType[P]>
        }
      >
    >


  export type VisualizerPreviewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    wrapId?: boolean
    customerPhotoUrl?: boolean
    processedImageUrl?: boolean
    status?: boolean
    cacheKey?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["visualizerPreview"]>

  export type VisualizerPreviewSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    wrapId?: boolean
    customerPhotoUrl?: boolean
    processedImageUrl?: boolean
    status?: boolean
    cacheKey?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["visualizerPreview"]>

  export type VisualizerPreviewSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    wrapId?: boolean
    customerPhotoUrl?: boolean
    processedImageUrl?: boolean
    status?: boolean
    cacheKey?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["visualizerPreview"]>

  export type VisualizerPreviewSelectScalar = {
    id?: boolean
    tenantId?: boolean
    wrapId?: boolean
    customerPhotoUrl?: boolean
    processedImageUrl?: boolean
    status?: boolean
    cacheKey?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type VisualizerPreviewOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "wrapId" | "customerPhotoUrl" | "processedImageUrl" | "status" | "cacheKey" | "expiresAt" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["visualizerPreview"]>
  export type VisualizerPreviewInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
  }
  export type VisualizerPreviewIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
  }
  export type VisualizerPreviewIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    wrap?: boolean | WrapDefaultArgs<ExtArgs>
  }

  export type $VisualizerPreviewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VisualizerPreview"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      wrap: Prisma.$WrapPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      wrapId: string
      customerPhotoUrl: string
      processedImageUrl: string | null
      status: string
      cacheKey: string
      expiresAt: Date
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["visualizerPreview"]>
    composites: {}
  }

  type VisualizerPreviewGetPayload<S extends boolean | null | undefined | VisualizerPreviewDefaultArgs> = $Result.GetResult<Prisma.$VisualizerPreviewPayload, S>

  type VisualizerPreviewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VisualizerPreviewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VisualizerPreviewCountAggregateInputType | true
    }

  export interface VisualizerPreviewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VisualizerPreview'], meta: { name: 'VisualizerPreview' } }
    /**
     * Find zero or one VisualizerPreview that matches the filter.
     * @param {VisualizerPreviewFindUniqueArgs} args - Arguments to find a VisualizerPreview
     * @example
     * // Get one VisualizerPreview
     * const visualizerPreview = await prisma.visualizerPreview.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VisualizerPreviewFindUniqueArgs>(args: SelectSubset<T, VisualizerPreviewFindUniqueArgs<ExtArgs>>): Prisma__VisualizerPreviewClient<$Result.GetResult<Prisma.$VisualizerPreviewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VisualizerPreview that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VisualizerPreviewFindUniqueOrThrowArgs} args - Arguments to find a VisualizerPreview
     * @example
     * // Get one VisualizerPreview
     * const visualizerPreview = await prisma.visualizerPreview.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VisualizerPreviewFindUniqueOrThrowArgs>(args: SelectSubset<T, VisualizerPreviewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VisualizerPreviewClient<$Result.GetResult<Prisma.$VisualizerPreviewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VisualizerPreview that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisualizerPreviewFindFirstArgs} args - Arguments to find a VisualizerPreview
     * @example
     * // Get one VisualizerPreview
     * const visualizerPreview = await prisma.visualizerPreview.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VisualizerPreviewFindFirstArgs>(args?: SelectSubset<T, VisualizerPreviewFindFirstArgs<ExtArgs>>): Prisma__VisualizerPreviewClient<$Result.GetResult<Prisma.$VisualizerPreviewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VisualizerPreview that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisualizerPreviewFindFirstOrThrowArgs} args - Arguments to find a VisualizerPreview
     * @example
     * // Get one VisualizerPreview
     * const visualizerPreview = await prisma.visualizerPreview.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VisualizerPreviewFindFirstOrThrowArgs>(args?: SelectSubset<T, VisualizerPreviewFindFirstOrThrowArgs<ExtArgs>>): Prisma__VisualizerPreviewClient<$Result.GetResult<Prisma.$VisualizerPreviewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VisualizerPreviews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisualizerPreviewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VisualizerPreviews
     * const visualizerPreviews = await prisma.visualizerPreview.findMany()
     * 
     * // Get first 10 VisualizerPreviews
     * const visualizerPreviews = await prisma.visualizerPreview.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const visualizerPreviewWithIdOnly = await prisma.visualizerPreview.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VisualizerPreviewFindManyArgs>(args?: SelectSubset<T, VisualizerPreviewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisualizerPreviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VisualizerPreview.
     * @param {VisualizerPreviewCreateArgs} args - Arguments to create a VisualizerPreview.
     * @example
     * // Create one VisualizerPreview
     * const VisualizerPreview = await prisma.visualizerPreview.create({
     *   data: {
     *     // ... data to create a VisualizerPreview
     *   }
     * })
     * 
     */
    create<T extends VisualizerPreviewCreateArgs>(args: SelectSubset<T, VisualizerPreviewCreateArgs<ExtArgs>>): Prisma__VisualizerPreviewClient<$Result.GetResult<Prisma.$VisualizerPreviewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VisualizerPreviews.
     * @param {VisualizerPreviewCreateManyArgs} args - Arguments to create many VisualizerPreviews.
     * @example
     * // Create many VisualizerPreviews
     * const visualizerPreview = await prisma.visualizerPreview.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VisualizerPreviewCreateManyArgs>(args?: SelectSubset<T, VisualizerPreviewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VisualizerPreviews and returns the data saved in the database.
     * @param {VisualizerPreviewCreateManyAndReturnArgs} args - Arguments to create many VisualizerPreviews.
     * @example
     * // Create many VisualizerPreviews
     * const visualizerPreview = await prisma.visualizerPreview.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VisualizerPreviews and only return the `id`
     * const visualizerPreviewWithIdOnly = await prisma.visualizerPreview.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VisualizerPreviewCreateManyAndReturnArgs>(args?: SelectSubset<T, VisualizerPreviewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisualizerPreviewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VisualizerPreview.
     * @param {VisualizerPreviewDeleteArgs} args - Arguments to delete one VisualizerPreview.
     * @example
     * // Delete one VisualizerPreview
     * const VisualizerPreview = await prisma.visualizerPreview.delete({
     *   where: {
     *     // ... filter to delete one VisualizerPreview
     *   }
     * })
     * 
     */
    delete<T extends VisualizerPreviewDeleteArgs>(args: SelectSubset<T, VisualizerPreviewDeleteArgs<ExtArgs>>): Prisma__VisualizerPreviewClient<$Result.GetResult<Prisma.$VisualizerPreviewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VisualizerPreview.
     * @param {VisualizerPreviewUpdateArgs} args - Arguments to update one VisualizerPreview.
     * @example
     * // Update one VisualizerPreview
     * const visualizerPreview = await prisma.visualizerPreview.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VisualizerPreviewUpdateArgs>(args: SelectSubset<T, VisualizerPreviewUpdateArgs<ExtArgs>>): Prisma__VisualizerPreviewClient<$Result.GetResult<Prisma.$VisualizerPreviewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VisualizerPreviews.
     * @param {VisualizerPreviewDeleteManyArgs} args - Arguments to filter VisualizerPreviews to delete.
     * @example
     * // Delete a few VisualizerPreviews
     * const { count } = await prisma.visualizerPreview.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VisualizerPreviewDeleteManyArgs>(args?: SelectSubset<T, VisualizerPreviewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VisualizerPreviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisualizerPreviewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VisualizerPreviews
     * const visualizerPreview = await prisma.visualizerPreview.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VisualizerPreviewUpdateManyArgs>(args: SelectSubset<T, VisualizerPreviewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VisualizerPreviews and returns the data updated in the database.
     * @param {VisualizerPreviewUpdateManyAndReturnArgs} args - Arguments to update many VisualizerPreviews.
     * @example
     * // Update many VisualizerPreviews
     * const visualizerPreview = await prisma.visualizerPreview.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VisualizerPreviews and only return the `id`
     * const visualizerPreviewWithIdOnly = await prisma.visualizerPreview.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VisualizerPreviewUpdateManyAndReturnArgs>(args: SelectSubset<T, VisualizerPreviewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisualizerPreviewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VisualizerPreview.
     * @param {VisualizerPreviewUpsertArgs} args - Arguments to update or create a VisualizerPreview.
     * @example
     * // Update or create a VisualizerPreview
     * const visualizerPreview = await prisma.visualizerPreview.upsert({
     *   create: {
     *     // ... data to create a VisualizerPreview
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VisualizerPreview we want to update
     *   }
     * })
     */
    upsert<T extends VisualizerPreviewUpsertArgs>(args: SelectSubset<T, VisualizerPreviewUpsertArgs<ExtArgs>>): Prisma__VisualizerPreviewClient<$Result.GetResult<Prisma.$VisualizerPreviewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VisualizerPreviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisualizerPreviewCountArgs} args - Arguments to filter VisualizerPreviews to count.
     * @example
     * // Count the number of VisualizerPreviews
     * const count = await prisma.visualizerPreview.count({
     *   where: {
     *     // ... the filter for the VisualizerPreviews we want to count
     *   }
     * })
    **/
    count<T extends VisualizerPreviewCountArgs>(
      args?: Subset<T, VisualizerPreviewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VisualizerPreviewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VisualizerPreview.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisualizerPreviewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VisualizerPreviewAggregateArgs>(args: Subset<T, VisualizerPreviewAggregateArgs>): Prisma.PrismaPromise<GetVisualizerPreviewAggregateType<T>>

    /**
     * Group by VisualizerPreview.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisualizerPreviewGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VisualizerPreviewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VisualizerPreviewGroupByArgs['orderBy'] }
        : { orderBy?: VisualizerPreviewGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VisualizerPreviewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVisualizerPreviewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VisualizerPreview model
   */
  readonly fields: VisualizerPreviewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VisualizerPreview.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VisualizerPreviewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    wrap<T extends WrapDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WrapDefaultArgs<ExtArgs>>): Prisma__WrapClient<$Result.GetResult<Prisma.$WrapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VisualizerPreview model
   */
  interface VisualizerPreviewFieldRefs {
    readonly id: FieldRef<"VisualizerPreview", 'String'>
    readonly tenantId: FieldRef<"VisualizerPreview", 'String'>
    readonly wrapId: FieldRef<"VisualizerPreview", 'String'>
    readonly customerPhotoUrl: FieldRef<"VisualizerPreview", 'String'>
    readonly processedImageUrl: FieldRef<"VisualizerPreview", 'String'>
    readonly status: FieldRef<"VisualizerPreview", 'String'>
    readonly cacheKey: FieldRef<"VisualizerPreview", 'String'>
    readonly expiresAt: FieldRef<"VisualizerPreview", 'DateTime'>
    readonly createdAt: FieldRef<"VisualizerPreview", 'DateTime'>
    readonly updatedAt: FieldRef<"VisualizerPreview", 'DateTime'>
    readonly deletedAt: FieldRef<"VisualizerPreview", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VisualizerPreview findUnique
   */
  export type VisualizerPreviewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisualizerPreview
     */
    select?: VisualizerPreviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisualizerPreview
     */
    omit?: VisualizerPreviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisualizerPreviewInclude<ExtArgs> | null
    /**
     * Filter, which VisualizerPreview to fetch.
     */
    where: VisualizerPreviewWhereUniqueInput
  }

  /**
   * VisualizerPreview findUniqueOrThrow
   */
  export type VisualizerPreviewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisualizerPreview
     */
    select?: VisualizerPreviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisualizerPreview
     */
    omit?: VisualizerPreviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisualizerPreviewInclude<ExtArgs> | null
    /**
     * Filter, which VisualizerPreview to fetch.
     */
    where: VisualizerPreviewWhereUniqueInput
  }

  /**
   * VisualizerPreview findFirst
   */
  export type VisualizerPreviewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisualizerPreview
     */
    select?: VisualizerPreviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisualizerPreview
     */
    omit?: VisualizerPreviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisualizerPreviewInclude<ExtArgs> | null
    /**
     * Filter, which VisualizerPreview to fetch.
     */
    where?: VisualizerPreviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisualizerPreviews to fetch.
     */
    orderBy?: VisualizerPreviewOrderByWithRelationInput | VisualizerPreviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VisualizerPreviews.
     */
    cursor?: VisualizerPreviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisualizerPreviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisualizerPreviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VisualizerPreviews.
     */
    distinct?: VisualizerPreviewScalarFieldEnum | VisualizerPreviewScalarFieldEnum[]
  }

  /**
   * VisualizerPreview findFirstOrThrow
   */
  export type VisualizerPreviewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisualizerPreview
     */
    select?: VisualizerPreviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisualizerPreview
     */
    omit?: VisualizerPreviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisualizerPreviewInclude<ExtArgs> | null
    /**
     * Filter, which VisualizerPreview to fetch.
     */
    where?: VisualizerPreviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisualizerPreviews to fetch.
     */
    orderBy?: VisualizerPreviewOrderByWithRelationInput | VisualizerPreviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VisualizerPreviews.
     */
    cursor?: VisualizerPreviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisualizerPreviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisualizerPreviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VisualizerPreviews.
     */
    distinct?: VisualizerPreviewScalarFieldEnum | VisualizerPreviewScalarFieldEnum[]
  }

  /**
   * VisualizerPreview findMany
   */
  export type VisualizerPreviewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisualizerPreview
     */
    select?: VisualizerPreviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisualizerPreview
     */
    omit?: VisualizerPreviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisualizerPreviewInclude<ExtArgs> | null
    /**
     * Filter, which VisualizerPreviews to fetch.
     */
    where?: VisualizerPreviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisualizerPreviews to fetch.
     */
    orderBy?: VisualizerPreviewOrderByWithRelationInput | VisualizerPreviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VisualizerPreviews.
     */
    cursor?: VisualizerPreviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisualizerPreviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisualizerPreviews.
     */
    skip?: number
    distinct?: VisualizerPreviewScalarFieldEnum | VisualizerPreviewScalarFieldEnum[]
  }

  /**
   * VisualizerPreview create
   */
  export type VisualizerPreviewCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisualizerPreview
     */
    select?: VisualizerPreviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisualizerPreview
     */
    omit?: VisualizerPreviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisualizerPreviewInclude<ExtArgs> | null
    /**
     * The data needed to create a VisualizerPreview.
     */
    data: XOR<VisualizerPreviewCreateInput, VisualizerPreviewUncheckedCreateInput>
  }

  /**
   * VisualizerPreview createMany
   */
  export type VisualizerPreviewCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VisualizerPreviews.
     */
    data: VisualizerPreviewCreateManyInput | VisualizerPreviewCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VisualizerPreview createManyAndReturn
   */
  export type VisualizerPreviewCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisualizerPreview
     */
    select?: VisualizerPreviewSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VisualizerPreview
     */
    omit?: VisualizerPreviewOmit<ExtArgs> | null
    /**
     * The data used to create many VisualizerPreviews.
     */
    data: VisualizerPreviewCreateManyInput | VisualizerPreviewCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisualizerPreviewIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VisualizerPreview update
   */
  export type VisualizerPreviewUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisualizerPreview
     */
    select?: VisualizerPreviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisualizerPreview
     */
    omit?: VisualizerPreviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisualizerPreviewInclude<ExtArgs> | null
    /**
     * The data needed to update a VisualizerPreview.
     */
    data: XOR<VisualizerPreviewUpdateInput, VisualizerPreviewUncheckedUpdateInput>
    /**
     * Choose, which VisualizerPreview to update.
     */
    where: VisualizerPreviewWhereUniqueInput
  }

  /**
   * VisualizerPreview updateMany
   */
  export type VisualizerPreviewUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VisualizerPreviews.
     */
    data: XOR<VisualizerPreviewUpdateManyMutationInput, VisualizerPreviewUncheckedUpdateManyInput>
    /**
     * Filter which VisualizerPreviews to update
     */
    where?: VisualizerPreviewWhereInput
    /**
     * Limit how many VisualizerPreviews to update.
     */
    limit?: number
  }

  /**
   * VisualizerPreview updateManyAndReturn
   */
  export type VisualizerPreviewUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisualizerPreview
     */
    select?: VisualizerPreviewSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VisualizerPreview
     */
    omit?: VisualizerPreviewOmit<ExtArgs> | null
    /**
     * The data used to update VisualizerPreviews.
     */
    data: XOR<VisualizerPreviewUpdateManyMutationInput, VisualizerPreviewUncheckedUpdateManyInput>
    /**
     * Filter which VisualizerPreviews to update
     */
    where?: VisualizerPreviewWhereInput
    /**
     * Limit how many VisualizerPreviews to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisualizerPreviewIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * VisualizerPreview upsert
   */
  export type VisualizerPreviewUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisualizerPreview
     */
    select?: VisualizerPreviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisualizerPreview
     */
    omit?: VisualizerPreviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisualizerPreviewInclude<ExtArgs> | null
    /**
     * The filter to search for the VisualizerPreview to update in case it exists.
     */
    where: VisualizerPreviewWhereUniqueInput
    /**
     * In case the VisualizerPreview found by the `where` argument doesn't exist, create a new VisualizerPreview with this data.
     */
    create: XOR<VisualizerPreviewCreateInput, VisualizerPreviewUncheckedCreateInput>
    /**
     * In case the VisualizerPreview was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VisualizerPreviewUpdateInput, VisualizerPreviewUncheckedUpdateInput>
  }

  /**
   * VisualizerPreview delete
   */
  export type VisualizerPreviewDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisualizerPreview
     */
    select?: VisualizerPreviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisualizerPreview
     */
    omit?: VisualizerPreviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisualizerPreviewInclude<ExtArgs> | null
    /**
     * Filter which VisualizerPreview to delete.
     */
    where: VisualizerPreviewWhereUniqueInput
  }

  /**
   * VisualizerPreview deleteMany
   */
  export type VisualizerPreviewDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VisualizerPreviews to delete
     */
    where?: VisualizerPreviewWhereInput
    /**
     * Limit how many VisualizerPreviews to delete.
     */
    limit?: number
  }

  /**
   * VisualizerPreview without action
   */
  export type VisualizerPreviewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisualizerPreview
     */
    select?: VisualizerPreviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisualizerPreview
     */
    omit?: VisualizerPreviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisualizerPreviewInclude<ExtArgs> | null
  }


  /**
   * Model Invoice
   */

  export type AggregateInvoice = {
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  export type InvoiceAvgAggregateOutputType = {
    totalAmount: number | null
  }

  export type InvoiceSumAggregateOutputType = {
    totalAmount: number | null
  }

  export type InvoiceMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    bookingId: string | null
    status: string | null
    totalAmount: number | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type InvoiceMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    bookingId: string | null
    status: string | null
    totalAmount: number | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type InvoiceCountAggregateOutputType = {
    id: number
    tenantId: number
    bookingId: number
    status: number
    totalAmount: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type InvoiceAvgAggregateInputType = {
    totalAmount?: true
  }

  export type InvoiceSumAggregateInputType = {
    totalAmount?: true
  }

  export type InvoiceMinAggregateInputType = {
    id?: true
    tenantId?: true
    bookingId?: true
    status?: true
    totalAmount?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type InvoiceMaxAggregateInputType = {
    id?: true
    tenantId?: true
    bookingId?: true
    status?: true
    totalAmount?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type InvoiceCountAggregateInputType = {
    id?: true
    tenantId?: true
    bookingId?: true
    status?: true
    totalAmount?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type InvoiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoice to aggregate.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Invoices
    **/
    _count?: true | InvoiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InvoiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InvoiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvoiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvoiceMaxAggregateInputType
  }

  export type GetInvoiceAggregateType<T extends InvoiceAggregateArgs> = {
        [P in keyof T & keyof AggregateInvoice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvoice[P]>
      : GetScalarType<T[P], AggregateInvoice[P]>
  }




  export type InvoiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithAggregationInput | InvoiceOrderByWithAggregationInput[]
    by: InvoiceScalarFieldEnum[] | InvoiceScalarFieldEnum
    having?: InvoiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvoiceCountAggregateInputType | true
    _avg?: InvoiceAvgAggregateInputType
    _sum?: InvoiceSumAggregateInputType
    _min?: InvoiceMinAggregateInputType
    _max?: InvoiceMaxAggregateInputType
  }

  export type InvoiceGroupByOutputType = {
    id: string
    tenantId: string
    bookingId: string
    status: string
    totalAmount: number
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  type GetInvoiceGroupByPayload<T extends InvoiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvoiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvoiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
            : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
        }
      >
    >


  export type InvoiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    bookingId?: boolean
    status?: boolean
    totalAmount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    booking?: boolean | BookingDefaultArgs<ExtArgs>
    lineItems?: boolean | Invoice$lineItemsArgs<ExtArgs>
    payments?: boolean | Invoice$paymentsArgs<ExtArgs>
    _count?: boolean | InvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    bookingId?: boolean
    status?: boolean
    totalAmount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    bookingId?: boolean
    status?: boolean
    totalAmount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectScalar = {
    id?: boolean
    tenantId?: boolean
    bookingId?: boolean
    status?: boolean
    totalAmount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type InvoiceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "bookingId" | "status" | "totalAmount" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["invoice"]>
  export type InvoiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    booking?: boolean | BookingDefaultArgs<ExtArgs>
    lineItems?: boolean | Invoice$lineItemsArgs<ExtArgs>
    payments?: boolean | Invoice$paymentsArgs<ExtArgs>
    _count?: boolean | InvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InvoiceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }
  export type InvoiceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }

  export type $InvoicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Invoice"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      booking: Prisma.$BookingPayload<ExtArgs>
      lineItems: Prisma.$InvoiceLineItemPayload<ExtArgs>[]
      payments: Prisma.$PaymentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      bookingId: string
      status: string
      totalAmount: number
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["invoice"]>
    composites: {}
  }

  type InvoiceGetPayload<S extends boolean | null | undefined | InvoiceDefaultArgs> = $Result.GetResult<Prisma.$InvoicePayload, S>

  type InvoiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InvoiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InvoiceCountAggregateInputType | true
    }

  export interface InvoiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Invoice'], meta: { name: 'Invoice' } }
    /**
     * Find zero or one Invoice that matches the filter.
     * @param {InvoiceFindUniqueArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvoiceFindUniqueArgs>(args: SelectSubset<T, InvoiceFindUniqueArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Invoice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InvoiceFindUniqueOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvoiceFindUniqueOrThrowArgs>(args: SelectSubset<T, InvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Invoice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvoiceFindFirstArgs>(args?: SelectSubset<T, InvoiceFindFirstArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Invoice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvoiceFindFirstOrThrowArgs>(args?: SelectSubset<T, InvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Invoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Invoices
     * const invoices = await prisma.invoice.findMany()
     * 
     * // Get first 10 Invoices
     * const invoices = await prisma.invoice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invoiceWithIdOnly = await prisma.invoice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvoiceFindManyArgs>(args?: SelectSubset<T, InvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Invoice.
     * @param {InvoiceCreateArgs} args - Arguments to create a Invoice.
     * @example
     * // Create one Invoice
     * const Invoice = await prisma.invoice.create({
     *   data: {
     *     // ... data to create a Invoice
     *   }
     * })
     * 
     */
    create<T extends InvoiceCreateArgs>(args: SelectSubset<T, InvoiceCreateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Invoices.
     * @param {InvoiceCreateManyArgs} args - Arguments to create many Invoices.
     * @example
     * // Create many Invoices
     * const invoice = await prisma.invoice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvoiceCreateManyArgs>(args?: SelectSubset<T, InvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Invoices and returns the data saved in the database.
     * @param {InvoiceCreateManyAndReturnArgs} args - Arguments to create many Invoices.
     * @example
     * // Create many Invoices
     * const invoice = await prisma.invoice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Invoices and only return the `id`
     * const invoiceWithIdOnly = await prisma.invoice.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvoiceCreateManyAndReturnArgs>(args?: SelectSubset<T, InvoiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Invoice.
     * @param {InvoiceDeleteArgs} args - Arguments to delete one Invoice.
     * @example
     * // Delete one Invoice
     * const Invoice = await prisma.invoice.delete({
     *   where: {
     *     // ... filter to delete one Invoice
     *   }
     * })
     * 
     */
    delete<T extends InvoiceDeleteArgs>(args: SelectSubset<T, InvoiceDeleteArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Invoice.
     * @param {InvoiceUpdateArgs} args - Arguments to update one Invoice.
     * @example
     * // Update one Invoice
     * const invoice = await prisma.invoice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvoiceUpdateArgs>(args: SelectSubset<T, InvoiceUpdateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Invoices.
     * @param {InvoiceDeleteManyArgs} args - Arguments to filter Invoices to delete.
     * @example
     * // Delete a few Invoices
     * const { count } = await prisma.invoice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvoiceDeleteManyArgs>(args?: SelectSubset<T, InvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Invoices
     * const invoice = await prisma.invoice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvoiceUpdateManyArgs>(args: SelectSubset<T, InvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invoices and returns the data updated in the database.
     * @param {InvoiceUpdateManyAndReturnArgs} args - Arguments to update many Invoices.
     * @example
     * // Update many Invoices
     * const invoice = await prisma.invoice.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Invoices and only return the `id`
     * const invoiceWithIdOnly = await prisma.invoice.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InvoiceUpdateManyAndReturnArgs>(args: SelectSubset<T, InvoiceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Invoice.
     * @param {InvoiceUpsertArgs} args - Arguments to update or create a Invoice.
     * @example
     * // Update or create a Invoice
     * const invoice = await prisma.invoice.upsert({
     *   create: {
     *     // ... data to create a Invoice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Invoice we want to update
     *   }
     * })
     */
    upsert<T extends InvoiceUpsertArgs>(args: SelectSubset<T, InvoiceUpsertArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceCountArgs} args - Arguments to filter Invoices to count.
     * @example
     * // Count the number of Invoices
     * const count = await prisma.invoice.count({
     *   where: {
     *     // ... the filter for the Invoices we want to count
     *   }
     * })
    **/
    count<T extends InvoiceCountArgs>(
      args?: Subset<T, InvoiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvoiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvoiceAggregateArgs>(args: Subset<T, InvoiceAggregateArgs>): Prisma.PrismaPromise<GetInvoiceAggregateType<T>>

    /**
     * Group by Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvoiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvoiceGroupByArgs['orderBy'] }
        : { orderBy?: InvoiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Invoice model
   */
  readonly fields: InvoiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Invoice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvoiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    booking<T extends BookingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BookingDefaultArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    lineItems<T extends Invoice$lineItemsArgs<ExtArgs> = {}>(args?: Subset<T, Invoice$lineItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    payments<T extends Invoice$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, Invoice$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Invoice model
   */
  interface InvoiceFieldRefs {
    readonly id: FieldRef<"Invoice", 'String'>
    readonly tenantId: FieldRef<"Invoice", 'String'>
    readonly bookingId: FieldRef<"Invoice", 'String'>
    readonly status: FieldRef<"Invoice", 'String'>
    readonly totalAmount: FieldRef<"Invoice", 'Float'>
    readonly createdAt: FieldRef<"Invoice", 'DateTime'>
    readonly updatedAt: FieldRef<"Invoice", 'DateTime'>
    readonly deletedAt: FieldRef<"Invoice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Invoice findUnique
   */
  export type InvoiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findUniqueOrThrow
   */
  export type InvoiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findFirst
   */
  export type InvoiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findFirstOrThrow
   */
  export type InvoiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findMany
   */
  export type InvoiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoices to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice create
   */
  export type InvoiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to create a Invoice.
     */
    data: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
  }

  /**
   * Invoice createMany
   */
  export type InvoiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Invoices.
     */
    data: InvoiceCreateManyInput | InvoiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Invoice createManyAndReturn
   */
  export type InvoiceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * The data used to create many Invoices.
     */
    data: InvoiceCreateManyInput | InvoiceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Invoice update
   */
  export type InvoiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to update a Invoice.
     */
    data: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
    /**
     * Choose, which Invoice to update.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice updateMany
   */
  export type InvoiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Invoices.
     */
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyInput>
    /**
     * Filter which Invoices to update
     */
    where?: InvoiceWhereInput
    /**
     * Limit how many Invoices to update.
     */
    limit?: number
  }

  /**
   * Invoice updateManyAndReturn
   */
  export type InvoiceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * The data used to update Invoices.
     */
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyInput>
    /**
     * Filter which Invoices to update
     */
    where?: InvoiceWhereInput
    /**
     * Limit how many Invoices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Invoice upsert
   */
  export type InvoiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The filter to search for the Invoice to update in case it exists.
     */
    where: InvoiceWhereUniqueInput
    /**
     * In case the Invoice found by the `where` argument doesn't exist, create a new Invoice with this data.
     */
    create: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
    /**
     * In case the Invoice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
  }

  /**
   * Invoice delete
   */
  export type InvoiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter which Invoice to delete.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice deleteMany
   */
  export type InvoiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoices to delete
     */
    where?: InvoiceWhereInput
    /**
     * Limit how many Invoices to delete.
     */
    limit?: number
  }

  /**
   * Invoice.lineItems
   */
  export type Invoice$lineItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
    where?: InvoiceLineItemWhereInput
    orderBy?: InvoiceLineItemOrderByWithRelationInput | InvoiceLineItemOrderByWithRelationInput[]
    cursor?: InvoiceLineItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceLineItemScalarFieldEnum | InvoiceLineItemScalarFieldEnum[]
  }

  /**
   * Invoice.payments
   */
  export type Invoice$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Invoice without action
   */
  export type InvoiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
  }


  /**
   * Model InvoiceLineItem
   */

  export type AggregateInvoiceLineItem = {
    _count: InvoiceLineItemCountAggregateOutputType | null
    _avg: InvoiceLineItemAvgAggregateOutputType | null
    _sum: InvoiceLineItemSumAggregateOutputType | null
    _min: InvoiceLineItemMinAggregateOutputType | null
    _max: InvoiceLineItemMaxAggregateOutputType | null
  }

  export type InvoiceLineItemAvgAggregateOutputType = {
    quantity: number | null
    unitPrice: number | null
    totalPrice: number | null
  }

  export type InvoiceLineItemSumAggregateOutputType = {
    quantity: number | null
    unitPrice: number | null
    totalPrice: number | null
  }

  export type InvoiceLineItemMinAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    description: string | null
    quantity: number | null
    unitPrice: number | null
    totalPrice: number | null
  }

  export type InvoiceLineItemMaxAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    description: string | null
    quantity: number | null
    unitPrice: number | null
    totalPrice: number | null
  }

  export type InvoiceLineItemCountAggregateOutputType = {
    id: number
    invoiceId: number
    description: number
    quantity: number
    unitPrice: number
    totalPrice: number
    _all: number
  }


  export type InvoiceLineItemAvgAggregateInputType = {
    quantity?: true
    unitPrice?: true
    totalPrice?: true
  }

  export type InvoiceLineItemSumAggregateInputType = {
    quantity?: true
    unitPrice?: true
    totalPrice?: true
  }

  export type InvoiceLineItemMinAggregateInputType = {
    id?: true
    invoiceId?: true
    description?: true
    quantity?: true
    unitPrice?: true
    totalPrice?: true
  }

  export type InvoiceLineItemMaxAggregateInputType = {
    id?: true
    invoiceId?: true
    description?: true
    quantity?: true
    unitPrice?: true
    totalPrice?: true
  }

  export type InvoiceLineItemCountAggregateInputType = {
    id?: true
    invoiceId?: true
    description?: true
    quantity?: true
    unitPrice?: true
    totalPrice?: true
    _all?: true
  }

  export type InvoiceLineItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvoiceLineItem to aggregate.
     */
    where?: InvoiceLineItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceLineItems to fetch.
     */
    orderBy?: InvoiceLineItemOrderByWithRelationInput | InvoiceLineItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvoiceLineItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceLineItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceLineItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InvoiceLineItems
    **/
    _count?: true | InvoiceLineItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InvoiceLineItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InvoiceLineItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvoiceLineItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvoiceLineItemMaxAggregateInputType
  }

  export type GetInvoiceLineItemAggregateType<T extends InvoiceLineItemAggregateArgs> = {
        [P in keyof T & keyof AggregateInvoiceLineItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvoiceLineItem[P]>
      : GetScalarType<T[P], AggregateInvoiceLineItem[P]>
  }




  export type InvoiceLineItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceLineItemWhereInput
    orderBy?: InvoiceLineItemOrderByWithAggregationInput | InvoiceLineItemOrderByWithAggregationInput[]
    by: InvoiceLineItemScalarFieldEnum[] | InvoiceLineItemScalarFieldEnum
    having?: InvoiceLineItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvoiceLineItemCountAggregateInputType | true
    _avg?: InvoiceLineItemAvgAggregateInputType
    _sum?: InvoiceLineItemSumAggregateInputType
    _min?: InvoiceLineItemMinAggregateInputType
    _max?: InvoiceLineItemMaxAggregateInputType
  }

  export type InvoiceLineItemGroupByOutputType = {
    id: string
    invoiceId: string
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
    _count: InvoiceLineItemCountAggregateOutputType | null
    _avg: InvoiceLineItemAvgAggregateOutputType | null
    _sum: InvoiceLineItemSumAggregateOutputType | null
    _min: InvoiceLineItemMinAggregateOutputType | null
    _max: InvoiceLineItemMaxAggregateOutputType | null
  }

  type GetInvoiceLineItemGroupByPayload<T extends InvoiceLineItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvoiceLineItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvoiceLineItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvoiceLineItemGroupByOutputType[P]>
            : GetScalarType<T[P], InvoiceLineItemGroupByOutputType[P]>
        }
      >
    >


  export type InvoiceLineItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    description?: boolean
    quantity?: boolean
    unitPrice?: boolean
    totalPrice?: boolean
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoiceLineItem"]>

  export type InvoiceLineItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    description?: boolean
    quantity?: boolean
    unitPrice?: boolean
    totalPrice?: boolean
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoiceLineItem"]>

  export type InvoiceLineItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    description?: boolean
    quantity?: boolean
    unitPrice?: boolean
    totalPrice?: boolean
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoiceLineItem"]>

  export type InvoiceLineItemSelectScalar = {
    id?: boolean
    invoiceId?: boolean
    description?: boolean
    quantity?: boolean
    unitPrice?: boolean
    totalPrice?: boolean
  }

  export type InvoiceLineItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "invoiceId" | "description" | "quantity" | "unitPrice" | "totalPrice", ExtArgs["result"]["invoiceLineItem"]>
  export type InvoiceLineItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }
  export type InvoiceLineItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }
  export type InvoiceLineItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }

  export type $InvoiceLineItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InvoiceLineItem"
    objects: {
      invoice: Prisma.$InvoicePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      invoiceId: string
      description: string
      quantity: number
      unitPrice: number
      totalPrice: number
    }, ExtArgs["result"]["invoiceLineItem"]>
    composites: {}
  }

  type InvoiceLineItemGetPayload<S extends boolean | null | undefined | InvoiceLineItemDefaultArgs> = $Result.GetResult<Prisma.$InvoiceLineItemPayload, S>

  type InvoiceLineItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InvoiceLineItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InvoiceLineItemCountAggregateInputType | true
    }

  export interface InvoiceLineItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InvoiceLineItem'], meta: { name: 'InvoiceLineItem' } }
    /**
     * Find zero or one InvoiceLineItem that matches the filter.
     * @param {InvoiceLineItemFindUniqueArgs} args - Arguments to find a InvoiceLineItem
     * @example
     * // Get one InvoiceLineItem
     * const invoiceLineItem = await prisma.invoiceLineItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvoiceLineItemFindUniqueArgs>(args: SelectSubset<T, InvoiceLineItemFindUniqueArgs<ExtArgs>>): Prisma__InvoiceLineItemClient<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InvoiceLineItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InvoiceLineItemFindUniqueOrThrowArgs} args - Arguments to find a InvoiceLineItem
     * @example
     * // Get one InvoiceLineItem
     * const invoiceLineItem = await prisma.invoiceLineItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvoiceLineItemFindUniqueOrThrowArgs>(args: SelectSubset<T, InvoiceLineItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvoiceLineItemClient<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InvoiceLineItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineItemFindFirstArgs} args - Arguments to find a InvoiceLineItem
     * @example
     * // Get one InvoiceLineItem
     * const invoiceLineItem = await prisma.invoiceLineItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvoiceLineItemFindFirstArgs>(args?: SelectSubset<T, InvoiceLineItemFindFirstArgs<ExtArgs>>): Prisma__InvoiceLineItemClient<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InvoiceLineItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineItemFindFirstOrThrowArgs} args - Arguments to find a InvoiceLineItem
     * @example
     * // Get one InvoiceLineItem
     * const invoiceLineItem = await prisma.invoiceLineItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvoiceLineItemFindFirstOrThrowArgs>(args?: SelectSubset<T, InvoiceLineItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvoiceLineItemClient<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InvoiceLineItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InvoiceLineItems
     * const invoiceLineItems = await prisma.invoiceLineItem.findMany()
     * 
     * // Get first 10 InvoiceLineItems
     * const invoiceLineItems = await prisma.invoiceLineItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invoiceLineItemWithIdOnly = await prisma.invoiceLineItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvoiceLineItemFindManyArgs>(args?: SelectSubset<T, InvoiceLineItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InvoiceLineItem.
     * @param {InvoiceLineItemCreateArgs} args - Arguments to create a InvoiceLineItem.
     * @example
     * // Create one InvoiceLineItem
     * const InvoiceLineItem = await prisma.invoiceLineItem.create({
     *   data: {
     *     // ... data to create a InvoiceLineItem
     *   }
     * })
     * 
     */
    create<T extends InvoiceLineItemCreateArgs>(args: SelectSubset<T, InvoiceLineItemCreateArgs<ExtArgs>>): Prisma__InvoiceLineItemClient<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InvoiceLineItems.
     * @param {InvoiceLineItemCreateManyArgs} args - Arguments to create many InvoiceLineItems.
     * @example
     * // Create many InvoiceLineItems
     * const invoiceLineItem = await prisma.invoiceLineItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvoiceLineItemCreateManyArgs>(args?: SelectSubset<T, InvoiceLineItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InvoiceLineItems and returns the data saved in the database.
     * @param {InvoiceLineItemCreateManyAndReturnArgs} args - Arguments to create many InvoiceLineItems.
     * @example
     * // Create many InvoiceLineItems
     * const invoiceLineItem = await prisma.invoiceLineItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InvoiceLineItems and only return the `id`
     * const invoiceLineItemWithIdOnly = await prisma.invoiceLineItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvoiceLineItemCreateManyAndReturnArgs>(args?: SelectSubset<T, InvoiceLineItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a InvoiceLineItem.
     * @param {InvoiceLineItemDeleteArgs} args - Arguments to delete one InvoiceLineItem.
     * @example
     * // Delete one InvoiceLineItem
     * const InvoiceLineItem = await prisma.invoiceLineItem.delete({
     *   where: {
     *     // ... filter to delete one InvoiceLineItem
     *   }
     * })
     * 
     */
    delete<T extends InvoiceLineItemDeleteArgs>(args: SelectSubset<T, InvoiceLineItemDeleteArgs<ExtArgs>>): Prisma__InvoiceLineItemClient<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InvoiceLineItem.
     * @param {InvoiceLineItemUpdateArgs} args - Arguments to update one InvoiceLineItem.
     * @example
     * // Update one InvoiceLineItem
     * const invoiceLineItem = await prisma.invoiceLineItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvoiceLineItemUpdateArgs>(args: SelectSubset<T, InvoiceLineItemUpdateArgs<ExtArgs>>): Prisma__InvoiceLineItemClient<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InvoiceLineItems.
     * @param {InvoiceLineItemDeleteManyArgs} args - Arguments to filter InvoiceLineItems to delete.
     * @example
     * // Delete a few InvoiceLineItems
     * const { count } = await prisma.invoiceLineItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvoiceLineItemDeleteManyArgs>(args?: SelectSubset<T, InvoiceLineItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InvoiceLineItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InvoiceLineItems
     * const invoiceLineItem = await prisma.invoiceLineItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvoiceLineItemUpdateManyArgs>(args: SelectSubset<T, InvoiceLineItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InvoiceLineItems and returns the data updated in the database.
     * @param {InvoiceLineItemUpdateManyAndReturnArgs} args - Arguments to update many InvoiceLineItems.
     * @example
     * // Update many InvoiceLineItems
     * const invoiceLineItem = await prisma.invoiceLineItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more InvoiceLineItems and only return the `id`
     * const invoiceLineItemWithIdOnly = await prisma.invoiceLineItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InvoiceLineItemUpdateManyAndReturnArgs>(args: SelectSubset<T, InvoiceLineItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one InvoiceLineItem.
     * @param {InvoiceLineItemUpsertArgs} args - Arguments to update or create a InvoiceLineItem.
     * @example
     * // Update or create a InvoiceLineItem
     * const invoiceLineItem = await prisma.invoiceLineItem.upsert({
     *   create: {
     *     // ... data to create a InvoiceLineItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InvoiceLineItem we want to update
     *   }
     * })
     */
    upsert<T extends InvoiceLineItemUpsertArgs>(args: SelectSubset<T, InvoiceLineItemUpsertArgs<ExtArgs>>): Prisma__InvoiceLineItemClient<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InvoiceLineItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineItemCountArgs} args - Arguments to filter InvoiceLineItems to count.
     * @example
     * // Count the number of InvoiceLineItems
     * const count = await prisma.invoiceLineItem.count({
     *   where: {
     *     // ... the filter for the InvoiceLineItems we want to count
     *   }
     * })
    **/
    count<T extends InvoiceLineItemCountArgs>(
      args?: Subset<T, InvoiceLineItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvoiceLineItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InvoiceLineItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvoiceLineItemAggregateArgs>(args: Subset<T, InvoiceLineItemAggregateArgs>): Prisma.PrismaPromise<GetInvoiceLineItemAggregateType<T>>

    /**
     * Group by InvoiceLineItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvoiceLineItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvoiceLineItemGroupByArgs['orderBy'] }
        : { orderBy?: InvoiceLineItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvoiceLineItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvoiceLineItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InvoiceLineItem model
   */
  readonly fields: InvoiceLineItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InvoiceLineItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvoiceLineItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoice<T extends InvoiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InvoiceDefaultArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InvoiceLineItem model
   */
  interface InvoiceLineItemFieldRefs {
    readonly id: FieldRef<"InvoiceLineItem", 'String'>
    readonly invoiceId: FieldRef<"InvoiceLineItem", 'String'>
    readonly description: FieldRef<"InvoiceLineItem", 'String'>
    readonly quantity: FieldRef<"InvoiceLineItem", 'Int'>
    readonly unitPrice: FieldRef<"InvoiceLineItem", 'Float'>
    readonly totalPrice: FieldRef<"InvoiceLineItem", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * InvoiceLineItem findUnique
   */
  export type InvoiceLineItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceLineItem to fetch.
     */
    where: InvoiceLineItemWhereUniqueInput
  }

  /**
   * InvoiceLineItem findUniqueOrThrow
   */
  export type InvoiceLineItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceLineItem to fetch.
     */
    where: InvoiceLineItemWhereUniqueInput
  }

  /**
   * InvoiceLineItem findFirst
   */
  export type InvoiceLineItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceLineItem to fetch.
     */
    where?: InvoiceLineItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceLineItems to fetch.
     */
    orderBy?: InvoiceLineItemOrderByWithRelationInput | InvoiceLineItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvoiceLineItems.
     */
    cursor?: InvoiceLineItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceLineItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceLineItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvoiceLineItems.
     */
    distinct?: InvoiceLineItemScalarFieldEnum | InvoiceLineItemScalarFieldEnum[]
  }

  /**
   * InvoiceLineItem findFirstOrThrow
   */
  export type InvoiceLineItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceLineItem to fetch.
     */
    where?: InvoiceLineItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceLineItems to fetch.
     */
    orderBy?: InvoiceLineItemOrderByWithRelationInput | InvoiceLineItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvoiceLineItems.
     */
    cursor?: InvoiceLineItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceLineItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceLineItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvoiceLineItems.
     */
    distinct?: InvoiceLineItemScalarFieldEnum | InvoiceLineItemScalarFieldEnum[]
  }

  /**
   * InvoiceLineItem findMany
   */
  export type InvoiceLineItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceLineItems to fetch.
     */
    where?: InvoiceLineItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceLineItems to fetch.
     */
    orderBy?: InvoiceLineItemOrderByWithRelationInput | InvoiceLineItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InvoiceLineItems.
     */
    cursor?: InvoiceLineItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceLineItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceLineItems.
     */
    skip?: number
    distinct?: InvoiceLineItemScalarFieldEnum | InvoiceLineItemScalarFieldEnum[]
  }

  /**
   * InvoiceLineItem create
   */
  export type InvoiceLineItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
    /**
     * The data needed to create a InvoiceLineItem.
     */
    data: XOR<InvoiceLineItemCreateInput, InvoiceLineItemUncheckedCreateInput>
  }

  /**
   * InvoiceLineItem createMany
   */
  export type InvoiceLineItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InvoiceLineItems.
     */
    data: InvoiceLineItemCreateManyInput | InvoiceLineItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InvoiceLineItem createManyAndReturn
   */
  export type InvoiceLineItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * The data used to create many InvoiceLineItems.
     */
    data: InvoiceLineItemCreateManyInput | InvoiceLineItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InvoiceLineItem update
   */
  export type InvoiceLineItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
    /**
     * The data needed to update a InvoiceLineItem.
     */
    data: XOR<InvoiceLineItemUpdateInput, InvoiceLineItemUncheckedUpdateInput>
    /**
     * Choose, which InvoiceLineItem to update.
     */
    where: InvoiceLineItemWhereUniqueInput
  }

  /**
   * InvoiceLineItem updateMany
   */
  export type InvoiceLineItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InvoiceLineItems.
     */
    data: XOR<InvoiceLineItemUpdateManyMutationInput, InvoiceLineItemUncheckedUpdateManyInput>
    /**
     * Filter which InvoiceLineItems to update
     */
    where?: InvoiceLineItemWhereInput
    /**
     * Limit how many InvoiceLineItems to update.
     */
    limit?: number
  }

  /**
   * InvoiceLineItem updateManyAndReturn
   */
  export type InvoiceLineItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * The data used to update InvoiceLineItems.
     */
    data: XOR<InvoiceLineItemUpdateManyMutationInput, InvoiceLineItemUncheckedUpdateManyInput>
    /**
     * Filter which InvoiceLineItems to update
     */
    where?: InvoiceLineItemWhereInput
    /**
     * Limit how many InvoiceLineItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * InvoiceLineItem upsert
   */
  export type InvoiceLineItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
    /**
     * The filter to search for the InvoiceLineItem to update in case it exists.
     */
    where: InvoiceLineItemWhereUniqueInput
    /**
     * In case the InvoiceLineItem found by the `where` argument doesn't exist, create a new InvoiceLineItem with this data.
     */
    create: XOR<InvoiceLineItemCreateInput, InvoiceLineItemUncheckedCreateInput>
    /**
     * In case the InvoiceLineItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvoiceLineItemUpdateInput, InvoiceLineItemUncheckedUpdateInput>
  }

  /**
   * InvoiceLineItem delete
   */
  export type InvoiceLineItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
    /**
     * Filter which InvoiceLineItem to delete.
     */
    where: InvoiceLineItemWhereUniqueInput
  }

  /**
   * InvoiceLineItem deleteMany
   */
  export type InvoiceLineItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvoiceLineItems to delete
     */
    where?: InvoiceLineItemWhereInput
    /**
     * Limit how many InvoiceLineItems to delete.
     */
    limit?: number
  }

  /**
   * InvoiceLineItem without action
   */
  export type InvoiceLineItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
  }


  /**
   * Model Payment
   */

  export type AggregatePayment = {
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  export type PaymentAvgAggregateOutputType = {
    amount: number | null
  }

  export type PaymentSumAggregateOutputType = {
    amount: number | null
  }

  export type PaymentMinAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    stripePaymentIntentId: string | null
    status: string | null
    amount: number | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type PaymentMaxAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    stripePaymentIntentId: string | null
    status: string | null
    amount: number | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type PaymentCountAggregateOutputType = {
    id: number
    invoiceId: number
    stripePaymentIntentId: number
    status: number
    amount: number
    createdAt: number
    deletedAt: number
    _all: number
  }


  export type PaymentAvgAggregateInputType = {
    amount?: true
  }

  export type PaymentSumAggregateInputType = {
    amount?: true
  }

  export type PaymentMinAggregateInputType = {
    id?: true
    invoiceId?: true
    stripePaymentIntentId?: true
    status?: true
    amount?: true
    createdAt?: true
    deletedAt?: true
  }

  export type PaymentMaxAggregateInputType = {
    id?: true
    invoiceId?: true
    stripePaymentIntentId?: true
    status?: true
    amount?: true
    createdAt?: true
    deletedAt?: true
  }

  export type PaymentCountAggregateInputType = {
    id?: true
    invoiceId?: true
    stripePaymentIntentId?: true
    status?: true
    amount?: true
    createdAt?: true
    deletedAt?: true
    _all?: true
  }

  export type PaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payment to aggregate.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payments
    **/
    _count?: true | PaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentMaxAggregateInputType
  }

  export type GetPaymentAggregateType<T extends PaymentAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment[P]>
      : GetScalarType<T[P], AggregatePayment[P]>
  }




  export type PaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithAggregationInput | PaymentOrderByWithAggregationInput[]
    by: PaymentScalarFieldEnum[] | PaymentScalarFieldEnum
    having?: PaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCountAggregateInputType | true
    _avg?: PaymentAvgAggregateInputType
    _sum?: PaymentSumAggregateInputType
    _min?: PaymentMinAggregateInputType
    _max?: PaymentMaxAggregateInputType
  }

  export type PaymentGroupByOutputType = {
    id: string
    invoiceId: string
    stripePaymentIntentId: string
    status: string
    amount: number
    createdAt: Date
    deletedAt: Date | null
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  type GetPaymentGroupByPayload<T extends PaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGroupByOutputType[P]>
        }
      >
    >


  export type PaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    stripePaymentIntentId?: boolean
    status?: boolean
    amount?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    stripePaymentIntentId?: boolean
    status?: boolean
    amount?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    stripePaymentIntentId?: boolean
    status?: boolean
    amount?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectScalar = {
    id?: boolean
    invoiceId?: boolean
    stripePaymentIntentId?: boolean
    status?: boolean
    amount?: boolean
    createdAt?: boolean
    deletedAt?: boolean
  }

  export type PaymentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "invoiceId" | "stripePaymentIntentId" | "status" | "amount" | "createdAt" | "deletedAt", ExtArgs["result"]["payment"]>
  export type PaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }

  export type $PaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Payment"
    objects: {
      invoice: Prisma.$InvoicePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      invoiceId: string
      stripePaymentIntentId: string
      status: string
      amount: number
      createdAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["payment"]>
    composites: {}
  }

  type PaymentGetPayload<S extends boolean | null | undefined | PaymentDefaultArgs> = $Result.GetResult<Prisma.$PaymentPayload, S>

  type PaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaymentCountAggregateInputType | true
    }

  export interface PaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payment'], meta: { name: 'Payment' } }
    /**
     * Find zero or one Payment that matches the filter.
     * @param {PaymentFindUniqueArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentFindUniqueArgs>(args: SelectSubset<T, PaymentFindUniqueArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Payment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentFindUniqueOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentFindFirstArgs>(args?: SelectSubset<T, PaymentFindFirstArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Payments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payments
     * const payments = await prisma.payment.findMany()
     * 
     * // Get first 10 Payments
     * const payments = await prisma.payment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentWithIdOnly = await prisma.payment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentFindManyArgs>(args?: SelectSubset<T, PaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Payment.
     * @param {PaymentCreateArgs} args - Arguments to create a Payment.
     * @example
     * // Create one Payment
     * const Payment = await prisma.payment.create({
     *   data: {
     *     // ... data to create a Payment
     *   }
     * })
     * 
     */
    create<T extends PaymentCreateArgs>(args: SelectSubset<T, PaymentCreateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Payments.
     * @param {PaymentCreateManyArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentCreateManyArgs>(args?: SelectSubset<T, PaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Payments and returns the data saved in the database.
     * @param {PaymentCreateManyAndReturnArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Payment.
     * @param {PaymentDeleteArgs} args - Arguments to delete one Payment.
     * @example
     * // Delete one Payment
     * const Payment = await prisma.payment.delete({
     *   where: {
     *     // ... filter to delete one Payment
     *   }
     * })
     * 
     */
    delete<T extends PaymentDeleteArgs>(args: SelectSubset<T, PaymentDeleteArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Payment.
     * @param {PaymentUpdateArgs} args - Arguments to update one Payment.
     * @example
     * // Update one Payment
     * const payment = await prisma.payment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentUpdateArgs>(args: SelectSubset<T, PaymentUpdateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Payments.
     * @param {PaymentDeleteManyArgs} args - Arguments to filter Payments to delete.
     * @example
     * // Delete a few Payments
     * const { count } = await prisma.payment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentDeleteManyArgs>(args?: SelectSubset<T, PaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentUpdateManyArgs>(args: SelectSubset<T, PaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments and returns the data updated in the database.
     * @param {PaymentUpdateManyAndReturnArgs} args - Arguments to update many Payments.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PaymentUpdateManyAndReturnArgs>(args: SelectSubset<T, PaymentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Payment.
     * @param {PaymentUpsertArgs} args - Arguments to update or create a Payment.
     * @example
     * // Update or create a Payment
     * const payment = await prisma.payment.upsert({
     *   create: {
     *     // ... data to create a Payment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment we want to update
     *   }
     * })
     */
    upsert<T extends PaymentUpsertArgs>(args: SelectSubset<T, PaymentUpsertArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCountArgs} args - Arguments to filter Payments to count.
     * @example
     * // Count the number of Payments
     * const count = await prisma.payment.count({
     *   where: {
     *     // ... the filter for the Payments we want to count
     *   }
     * })
    **/
    count<T extends PaymentCountArgs>(
      args?: Subset<T, PaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentAggregateArgs>(args: Subset<T, PaymentAggregateArgs>): Prisma.PrismaPromise<GetPaymentAggregateType<T>>

    /**
     * Group by Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Payment model
   */
  readonly fields: PaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoice<T extends InvoiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InvoiceDefaultArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Payment model
   */
  interface PaymentFieldRefs {
    readonly id: FieldRef<"Payment", 'String'>
    readonly invoiceId: FieldRef<"Payment", 'String'>
    readonly stripePaymentIntentId: FieldRef<"Payment", 'String'>
    readonly status: FieldRef<"Payment", 'String'>
    readonly amount: FieldRef<"Payment", 'Float'>
    readonly createdAt: FieldRef<"Payment", 'DateTime'>
    readonly deletedAt: FieldRef<"Payment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Payment findUnique
   */
  export type PaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findUniqueOrThrow
   */
  export type PaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findFirst
   */
  export type PaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findFirstOrThrow
   */
  export type PaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findMany
   */
  export type PaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payments to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment create
   */
  export type PaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a Payment.
     */
    data: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
  }

  /**
   * Payment createMany
   */
  export type PaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payment createManyAndReturn
   */
  export type PaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment update
   */
  export type PaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a Payment.
     */
    data: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
    /**
     * Choose, which Payment to update.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment updateMany
   */
  export type PaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
  }

  /**
   * Payment updateManyAndReturn
   */
  export type PaymentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment upsert
   */
  export type PaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the Payment to update in case it exists.
     */
    where: PaymentWhereUniqueInput
    /**
     * In case the Payment found by the `where` argument doesn't exist, create a new Payment with this data.
     */
    create: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
    /**
     * In case the Payment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
  }

  /**
   * Payment delete
   */
  export type PaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter which Payment to delete.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment deleteMany
   */
  export type PaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payments to delete
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to delete.
     */
    limit?: number
  }

  /**
   * Payment without action
   */
  export type PaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    userId: string | null
    action: string | null
    resourceType: string | null
    resourceId: string | null
    details: string | null
    timestamp: Date | null
    deletedAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    userId: string | null
    action: string | null
    resourceType: string | null
    resourceId: string | null
    details: string | null
    timestamp: Date | null
    deletedAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    tenantId: number
    userId: number
    action: number
    resourceType: number
    resourceId: number
    details: number
    timestamp: number
    deletedAt: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    tenantId?: true
    userId?: true
    action?: true
    resourceType?: true
    resourceId?: true
    details?: true
    timestamp?: true
    deletedAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    tenantId?: true
    userId?: true
    action?: true
    resourceType?: true
    resourceId?: true
    details?: true
    timestamp?: true
    deletedAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    tenantId?: true
    userId?: true
    action?: true
    resourceType?: true
    resourceId?: true
    details?: true
    timestamp?: true
    deletedAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    tenantId: string
    userId: string
    action: string
    resourceType: string
    resourceId: string
    details: string | null
    timestamp: Date
    deletedAt: Date | null
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    userId?: boolean
    action?: boolean
    resourceType?: boolean
    resourceId?: boolean
    details?: boolean
    timestamp?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    userId?: boolean
    action?: boolean
    resourceType?: boolean
    resourceId?: boolean
    details?: boolean
    timestamp?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    userId?: boolean
    action?: boolean
    resourceType?: boolean
    resourceId?: boolean
    details?: boolean
    timestamp?: boolean
    deletedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    tenantId?: boolean
    userId?: boolean
    action?: boolean
    resourceType?: boolean
    resourceId?: boolean
    details?: boolean
    timestamp?: boolean
    deletedAt?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "userId" | "action" | "resourceType" | "resourceId" | "details" | "timestamp" | "deletedAt", ExtArgs["result"]["auditLog"]>
  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type AuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type AuditLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      userId: string
      action: string
      resourceType: string
      resourceId: string
      details: string | null
      timestamp: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly tenantId: FieldRef<"AuditLog", 'String'>
    readonly userId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly resourceType: FieldRef<"AuditLog", 'String'>
    readonly resourceId: FieldRef<"AuditLog", 'String'>
    readonly details: FieldRef<"AuditLog", 'String'>
    readonly timestamp: FieldRef<"AuditLog", 'DateTime'>
    readonly deletedAt: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TenantScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type TenantScalarFieldEnum = (typeof TenantScalarFieldEnum)[keyof typeof TenantScalarFieldEnum]


  export const TenantUserMembershipScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    userId: 'userId',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type TenantUserMembershipScalarFieldEnum = (typeof TenantUserMembershipScalarFieldEnum)[keyof typeof TenantUserMembershipScalarFieldEnum]


  export const WrapScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    name: 'name',
    description: 'description',
    price: 'price',
    installationMinutes: 'installationMinutes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type WrapScalarFieldEnum = (typeof WrapScalarFieldEnum)[keyof typeof WrapScalarFieldEnum]


  export const WrapCategoryScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    name: 'name',
    slug: 'slug',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type WrapCategoryScalarFieldEnum = (typeof WrapCategoryScalarFieldEnum)[keyof typeof WrapCategoryScalarFieldEnum]


  export const WrapCategoryMappingScalarFieldEnum: {
    wrapId: 'wrapId',
    categoryId: 'categoryId'
  };

  export type WrapCategoryMappingScalarFieldEnum = (typeof WrapCategoryMappingScalarFieldEnum)[keyof typeof WrapCategoryMappingScalarFieldEnum]


  export const WrapImageScalarFieldEnum: {
    id: 'id',
    wrapId: 'wrapId',
    url: 'url',
    displayOrder: 'displayOrder',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt'
  };

  export type WrapImageScalarFieldEnum = (typeof WrapImageScalarFieldEnum)[keyof typeof WrapImageScalarFieldEnum]


  export const AvailabilityRuleScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    dayOfWeek: 'dayOfWeek',
    startTime: 'startTime',
    endTime: 'endTime',
    capacitySlots: 'capacitySlots',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type AvailabilityRuleScalarFieldEnum = (typeof AvailabilityRuleScalarFieldEnum)[keyof typeof AvailabilityRuleScalarFieldEnum]


  export const BookingScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    customerId: 'customerId',
    wrapId: 'wrapId',
    startTime: 'startTime',
    endTime: 'endTime',
    status: 'status',
    totalPrice: 'totalPrice',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type BookingScalarFieldEnum = (typeof BookingScalarFieldEnum)[keyof typeof BookingScalarFieldEnum]


  export const BookingReservationScalarFieldEnum: {
    id: 'id',
    bookingId: 'bookingId',
    expiresAt: 'expiresAt',
    reservedAt: 'reservedAt',
    createdAt: 'createdAt'
  };

  export type BookingReservationScalarFieldEnum = (typeof BookingReservationScalarFieldEnum)[keyof typeof BookingReservationScalarFieldEnum]


  export const VisualizerPreviewScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    wrapId: 'wrapId',
    customerPhotoUrl: 'customerPhotoUrl',
    processedImageUrl: 'processedImageUrl',
    status: 'status',
    cacheKey: 'cacheKey',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type VisualizerPreviewScalarFieldEnum = (typeof VisualizerPreviewScalarFieldEnum)[keyof typeof VisualizerPreviewScalarFieldEnum]


  export const InvoiceScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    bookingId: 'bookingId',
    status: 'status',
    totalAmount: 'totalAmount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type InvoiceScalarFieldEnum = (typeof InvoiceScalarFieldEnum)[keyof typeof InvoiceScalarFieldEnum]


  export const InvoiceLineItemScalarFieldEnum: {
    id: 'id',
    invoiceId: 'invoiceId',
    description: 'description',
    quantity: 'quantity',
    unitPrice: 'unitPrice',
    totalPrice: 'totalPrice'
  };

  export type InvoiceLineItemScalarFieldEnum = (typeof InvoiceLineItemScalarFieldEnum)[keyof typeof InvoiceLineItemScalarFieldEnum]


  export const PaymentScalarFieldEnum: {
    id: 'id',
    invoiceId: 'invoiceId',
    stripePaymentIntentId: 'stripePaymentIntentId',
    status: 'status',
    amount: 'amount',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt'
  };

  export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    userId: 'userId',
    action: 'action',
    resourceType: 'resourceType',
    resourceId: 'resourceId',
    details: 'details',
    timestamp: 'timestamp',
    deletedAt: 'deletedAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type TenantWhereInput = {
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    id?: StringFilter<"Tenant"> | string
    name?: StringFilter<"Tenant"> | string
    slug?: StringFilter<"Tenant"> | string
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    members?: TenantUserMembershipListRelationFilter
    wraps?: WrapListRelationFilter
    wrapCategories?: WrapCategoryListRelationFilter
    availabilityRules?: AvailabilityRuleListRelationFilter
    bookings?: BookingListRelationFilter
    previews?: VisualizerPreviewListRelationFilter
    invoices?: InvoiceListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }

  export type TenantOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    members?: TenantUserMembershipOrderByRelationAggregateInput
    wraps?: WrapOrderByRelationAggregateInput
    wrapCategories?: WrapCategoryOrderByRelationAggregateInput
    availabilityRules?: AvailabilityRuleOrderByRelationAggregateInput
    bookings?: BookingOrderByRelationAggregateInput
    previews?: VisualizerPreviewOrderByRelationAggregateInput
    invoices?: InvoiceOrderByRelationAggregateInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
  }

  export type TenantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    name?: StringFilter<"Tenant"> | string
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    members?: TenantUserMembershipListRelationFilter
    wraps?: WrapListRelationFilter
    wrapCategories?: WrapCategoryListRelationFilter
    availabilityRules?: AvailabilityRuleListRelationFilter
    bookings?: BookingListRelationFilter
    previews?: VisualizerPreviewListRelationFilter
    invoices?: InvoiceListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }, "id" | "slug">

  export type TenantOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: TenantCountOrderByAggregateInput
    _max?: TenantMaxOrderByAggregateInput
    _min?: TenantMinOrderByAggregateInput
  }

  export type TenantScalarWhereWithAggregatesInput = {
    AND?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    OR?: TenantScalarWhereWithAggregatesInput[]
    NOT?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tenant"> | string
    name?: StringWithAggregatesFilter<"Tenant"> | string
    slug?: StringWithAggregatesFilter<"Tenant"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Tenant"> | Date | string | null
  }

  export type TenantUserMembershipWhereInput = {
    AND?: TenantUserMembershipWhereInput | TenantUserMembershipWhereInput[]
    OR?: TenantUserMembershipWhereInput[]
    NOT?: TenantUserMembershipWhereInput | TenantUserMembershipWhereInput[]
    id?: StringFilter<"TenantUserMembership"> | string
    tenantId?: StringFilter<"TenantUserMembership"> | string
    userId?: StringFilter<"TenantUserMembership"> | string
    role?: StringFilter<"TenantUserMembership"> | string
    createdAt?: DateTimeFilter<"TenantUserMembership"> | Date | string
    updatedAt?: DateTimeFilter<"TenantUserMembership"> | Date | string
    deletedAt?: DateTimeNullableFilter<"TenantUserMembership"> | Date | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type TenantUserMembershipOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type TenantUserMembershipWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_userId?: TenantUserMembershipTenantIdUserIdCompoundUniqueInput
    AND?: TenantUserMembershipWhereInput | TenantUserMembershipWhereInput[]
    OR?: TenantUserMembershipWhereInput[]
    NOT?: TenantUserMembershipWhereInput | TenantUserMembershipWhereInput[]
    tenantId?: StringFilter<"TenantUserMembership"> | string
    userId?: StringFilter<"TenantUserMembership"> | string
    role?: StringFilter<"TenantUserMembership"> | string
    createdAt?: DateTimeFilter<"TenantUserMembership"> | Date | string
    updatedAt?: DateTimeFilter<"TenantUserMembership"> | Date | string
    deletedAt?: DateTimeNullableFilter<"TenantUserMembership"> | Date | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id" | "tenantId_userId">

  export type TenantUserMembershipOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: TenantUserMembershipCountOrderByAggregateInput
    _max?: TenantUserMembershipMaxOrderByAggregateInput
    _min?: TenantUserMembershipMinOrderByAggregateInput
  }

  export type TenantUserMembershipScalarWhereWithAggregatesInput = {
    AND?: TenantUserMembershipScalarWhereWithAggregatesInput | TenantUserMembershipScalarWhereWithAggregatesInput[]
    OR?: TenantUserMembershipScalarWhereWithAggregatesInput[]
    NOT?: TenantUserMembershipScalarWhereWithAggregatesInput | TenantUserMembershipScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TenantUserMembership"> | string
    tenantId?: StringWithAggregatesFilter<"TenantUserMembership"> | string
    userId?: StringWithAggregatesFilter<"TenantUserMembership"> | string
    role?: StringWithAggregatesFilter<"TenantUserMembership"> | string
    createdAt?: DateTimeWithAggregatesFilter<"TenantUserMembership"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TenantUserMembership"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"TenantUserMembership"> | Date | string | null
  }

  export type WrapWhereInput = {
    AND?: WrapWhereInput | WrapWhereInput[]
    OR?: WrapWhereInput[]
    NOT?: WrapWhereInput | WrapWhereInput[]
    id?: StringFilter<"Wrap"> | string
    tenantId?: StringFilter<"Wrap"> | string
    name?: StringFilter<"Wrap"> | string
    description?: StringNullableFilter<"Wrap"> | string | null
    price?: FloatFilter<"Wrap"> | number
    installationMinutes?: IntNullableFilter<"Wrap"> | number | null
    createdAt?: DateTimeFilter<"Wrap"> | Date | string
    updatedAt?: DateTimeFilter<"Wrap"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Wrap"> | Date | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    images?: WrapImageListRelationFilter
    categoryMappings?: WrapCategoryMappingListRelationFilter
    bookings?: BookingListRelationFilter
    previews?: VisualizerPreviewListRelationFilter
  }

  export type WrapOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    installationMinutes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
    images?: WrapImageOrderByRelationAggregateInput
    categoryMappings?: WrapCategoryMappingOrderByRelationAggregateInput
    bookings?: BookingOrderByRelationAggregateInput
    previews?: VisualizerPreviewOrderByRelationAggregateInput
  }

  export type WrapWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_id?: WrapTenantIdIdCompoundUniqueInput
    AND?: WrapWhereInput | WrapWhereInput[]
    OR?: WrapWhereInput[]
    NOT?: WrapWhereInput | WrapWhereInput[]
    tenantId?: StringFilter<"Wrap"> | string
    name?: StringFilter<"Wrap"> | string
    description?: StringNullableFilter<"Wrap"> | string | null
    price?: FloatFilter<"Wrap"> | number
    installationMinutes?: IntNullableFilter<"Wrap"> | number | null
    createdAt?: DateTimeFilter<"Wrap"> | Date | string
    updatedAt?: DateTimeFilter<"Wrap"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Wrap"> | Date | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    images?: WrapImageListRelationFilter
    categoryMappings?: WrapCategoryMappingListRelationFilter
    bookings?: BookingListRelationFilter
    previews?: VisualizerPreviewListRelationFilter
  }, "id" | "tenantId_id">

  export type WrapOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    installationMinutes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: WrapCountOrderByAggregateInput
    _avg?: WrapAvgOrderByAggregateInput
    _max?: WrapMaxOrderByAggregateInput
    _min?: WrapMinOrderByAggregateInput
    _sum?: WrapSumOrderByAggregateInput
  }

  export type WrapScalarWhereWithAggregatesInput = {
    AND?: WrapScalarWhereWithAggregatesInput | WrapScalarWhereWithAggregatesInput[]
    OR?: WrapScalarWhereWithAggregatesInput[]
    NOT?: WrapScalarWhereWithAggregatesInput | WrapScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Wrap"> | string
    tenantId?: StringWithAggregatesFilter<"Wrap"> | string
    name?: StringWithAggregatesFilter<"Wrap"> | string
    description?: StringNullableWithAggregatesFilter<"Wrap"> | string | null
    price?: FloatWithAggregatesFilter<"Wrap"> | number
    installationMinutes?: IntNullableWithAggregatesFilter<"Wrap"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Wrap"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Wrap"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Wrap"> | Date | string | null
  }

  export type WrapCategoryWhereInput = {
    AND?: WrapCategoryWhereInput | WrapCategoryWhereInput[]
    OR?: WrapCategoryWhereInput[]
    NOT?: WrapCategoryWhereInput | WrapCategoryWhereInput[]
    id?: StringFilter<"WrapCategory"> | string
    tenantId?: StringFilter<"WrapCategory"> | string
    name?: StringFilter<"WrapCategory"> | string
    slug?: StringFilter<"WrapCategory"> | string
    createdAt?: DateTimeFilter<"WrapCategory"> | Date | string
    updatedAt?: DateTimeFilter<"WrapCategory"> | Date | string
    deletedAt?: DateTimeNullableFilter<"WrapCategory"> | Date | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    wraps?: WrapCategoryMappingListRelationFilter
  }

  export type WrapCategoryOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
    wraps?: WrapCategoryMappingOrderByRelationAggregateInput
  }

  export type WrapCategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_slug?: WrapCategoryTenantIdSlugCompoundUniqueInput
    AND?: WrapCategoryWhereInput | WrapCategoryWhereInput[]
    OR?: WrapCategoryWhereInput[]
    NOT?: WrapCategoryWhereInput | WrapCategoryWhereInput[]
    tenantId?: StringFilter<"WrapCategory"> | string
    name?: StringFilter<"WrapCategory"> | string
    slug?: StringFilter<"WrapCategory"> | string
    createdAt?: DateTimeFilter<"WrapCategory"> | Date | string
    updatedAt?: DateTimeFilter<"WrapCategory"> | Date | string
    deletedAt?: DateTimeNullableFilter<"WrapCategory"> | Date | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    wraps?: WrapCategoryMappingListRelationFilter
  }, "id" | "tenantId_slug">

  export type WrapCategoryOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: WrapCategoryCountOrderByAggregateInput
    _max?: WrapCategoryMaxOrderByAggregateInput
    _min?: WrapCategoryMinOrderByAggregateInput
  }

  export type WrapCategoryScalarWhereWithAggregatesInput = {
    AND?: WrapCategoryScalarWhereWithAggregatesInput | WrapCategoryScalarWhereWithAggregatesInput[]
    OR?: WrapCategoryScalarWhereWithAggregatesInput[]
    NOT?: WrapCategoryScalarWhereWithAggregatesInput | WrapCategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WrapCategory"> | string
    tenantId?: StringWithAggregatesFilter<"WrapCategory"> | string
    name?: StringWithAggregatesFilter<"WrapCategory"> | string
    slug?: StringWithAggregatesFilter<"WrapCategory"> | string
    createdAt?: DateTimeWithAggregatesFilter<"WrapCategory"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WrapCategory"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"WrapCategory"> | Date | string | null
  }

  export type WrapCategoryMappingWhereInput = {
    AND?: WrapCategoryMappingWhereInput | WrapCategoryMappingWhereInput[]
    OR?: WrapCategoryMappingWhereInput[]
    NOT?: WrapCategoryMappingWhereInput | WrapCategoryMappingWhereInput[]
    wrapId?: StringFilter<"WrapCategoryMapping"> | string
    categoryId?: StringFilter<"WrapCategoryMapping"> | string
    wrap?: XOR<WrapScalarRelationFilter, WrapWhereInput>
    category?: XOR<WrapCategoryScalarRelationFilter, WrapCategoryWhereInput>
  }

  export type WrapCategoryMappingOrderByWithRelationInput = {
    wrapId?: SortOrder
    categoryId?: SortOrder
    wrap?: WrapOrderByWithRelationInput
    category?: WrapCategoryOrderByWithRelationInput
  }

  export type WrapCategoryMappingWhereUniqueInput = Prisma.AtLeast<{
    wrapId_categoryId?: WrapCategoryMappingWrapIdCategoryIdCompoundUniqueInput
    AND?: WrapCategoryMappingWhereInput | WrapCategoryMappingWhereInput[]
    OR?: WrapCategoryMappingWhereInput[]
    NOT?: WrapCategoryMappingWhereInput | WrapCategoryMappingWhereInput[]
    wrapId?: StringFilter<"WrapCategoryMapping"> | string
    categoryId?: StringFilter<"WrapCategoryMapping"> | string
    wrap?: XOR<WrapScalarRelationFilter, WrapWhereInput>
    category?: XOR<WrapCategoryScalarRelationFilter, WrapCategoryWhereInput>
  }, "wrapId_categoryId">

  export type WrapCategoryMappingOrderByWithAggregationInput = {
    wrapId?: SortOrder
    categoryId?: SortOrder
    _count?: WrapCategoryMappingCountOrderByAggregateInput
    _max?: WrapCategoryMappingMaxOrderByAggregateInput
    _min?: WrapCategoryMappingMinOrderByAggregateInput
  }

  export type WrapCategoryMappingScalarWhereWithAggregatesInput = {
    AND?: WrapCategoryMappingScalarWhereWithAggregatesInput | WrapCategoryMappingScalarWhereWithAggregatesInput[]
    OR?: WrapCategoryMappingScalarWhereWithAggregatesInput[]
    NOT?: WrapCategoryMappingScalarWhereWithAggregatesInput | WrapCategoryMappingScalarWhereWithAggregatesInput[]
    wrapId?: StringWithAggregatesFilter<"WrapCategoryMapping"> | string
    categoryId?: StringWithAggregatesFilter<"WrapCategoryMapping"> | string
  }

  export type WrapImageWhereInput = {
    AND?: WrapImageWhereInput | WrapImageWhereInput[]
    OR?: WrapImageWhereInput[]
    NOT?: WrapImageWhereInput | WrapImageWhereInput[]
    id?: StringFilter<"WrapImage"> | string
    wrapId?: StringFilter<"WrapImage"> | string
    url?: StringFilter<"WrapImage"> | string
    displayOrder?: IntFilter<"WrapImage"> | number
    createdAt?: DateTimeFilter<"WrapImage"> | Date | string
    deletedAt?: DateTimeNullableFilter<"WrapImage"> | Date | string | null
    wrap?: XOR<WrapScalarRelationFilter, WrapWhereInput>
  }

  export type WrapImageOrderByWithRelationInput = {
    id?: SortOrder
    wrapId?: SortOrder
    url?: SortOrder
    displayOrder?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    wrap?: WrapOrderByWithRelationInput
  }

  export type WrapImageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WrapImageWhereInput | WrapImageWhereInput[]
    OR?: WrapImageWhereInput[]
    NOT?: WrapImageWhereInput | WrapImageWhereInput[]
    wrapId?: StringFilter<"WrapImage"> | string
    url?: StringFilter<"WrapImage"> | string
    displayOrder?: IntFilter<"WrapImage"> | number
    createdAt?: DateTimeFilter<"WrapImage"> | Date | string
    deletedAt?: DateTimeNullableFilter<"WrapImage"> | Date | string | null
    wrap?: XOR<WrapScalarRelationFilter, WrapWhereInput>
  }, "id">

  export type WrapImageOrderByWithAggregationInput = {
    id?: SortOrder
    wrapId?: SortOrder
    url?: SortOrder
    displayOrder?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: WrapImageCountOrderByAggregateInput
    _avg?: WrapImageAvgOrderByAggregateInput
    _max?: WrapImageMaxOrderByAggregateInput
    _min?: WrapImageMinOrderByAggregateInput
    _sum?: WrapImageSumOrderByAggregateInput
  }

  export type WrapImageScalarWhereWithAggregatesInput = {
    AND?: WrapImageScalarWhereWithAggregatesInput | WrapImageScalarWhereWithAggregatesInput[]
    OR?: WrapImageScalarWhereWithAggregatesInput[]
    NOT?: WrapImageScalarWhereWithAggregatesInput | WrapImageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WrapImage"> | string
    wrapId?: StringWithAggregatesFilter<"WrapImage"> | string
    url?: StringWithAggregatesFilter<"WrapImage"> | string
    displayOrder?: IntWithAggregatesFilter<"WrapImage"> | number
    createdAt?: DateTimeWithAggregatesFilter<"WrapImage"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"WrapImage"> | Date | string | null
  }

  export type AvailabilityRuleWhereInput = {
    AND?: AvailabilityRuleWhereInput | AvailabilityRuleWhereInput[]
    OR?: AvailabilityRuleWhereInput[]
    NOT?: AvailabilityRuleWhereInput | AvailabilityRuleWhereInput[]
    id?: StringFilter<"AvailabilityRule"> | string
    tenantId?: StringFilter<"AvailabilityRule"> | string
    dayOfWeek?: IntFilter<"AvailabilityRule"> | number
    startTime?: StringFilter<"AvailabilityRule"> | string
    endTime?: StringFilter<"AvailabilityRule"> | string
    capacitySlots?: IntFilter<"AvailabilityRule"> | number
    createdAt?: DateTimeFilter<"AvailabilityRule"> | Date | string
    updatedAt?: DateTimeFilter<"AvailabilityRule"> | Date | string
    deletedAt?: DateTimeNullableFilter<"AvailabilityRule"> | Date | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type AvailabilityRuleOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    capacitySlots?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type AvailabilityRuleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AvailabilityRuleWhereInput | AvailabilityRuleWhereInput[]
    OR?: AvailabilityRuleWhereInput[]
    NOT?: AvailabilityRuleWhereInput | AvailabilityRuleWhereInput[]
    tenantId?: StringFilter<"AvailabilityRule"> | string
    dayOfWeek?: IntFilter<"AvailabilityRule"> | number
    startTime?: StringFilter<"AvailabilityRule"> | string
    endTime?: StringFilter<"AvailabilityRule"> | string
    capacitySlots?: IntFilter<"AvailabilityRule"> | number
    createdAt?: DateTimeFilter<"AvailabilityRule"> | Date | string
    updatedAt?: DateTimeFilter<"AvailabilityRule"> | Date | string
    deletedAt?: DateTimeNullableFilter<"AvailabilityRule"> | Date | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id">

  export type AvailabilityRuleOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    capacitySlots?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: AvailabilityRuleCountOrderByAggregateInput
    _avg?: AvailabilityRuleAvgOrderByAggregateInput
    _max?: AvailabilityRuleMaxOrderByAggregateInput
    _min?: AvailabilityRuleMinOrderByAggregateInput
    _sum?: AvailabilityRuleSumOrderByAggregateInput
  }

  export type AvailabilityRuleScalarWhereWithAggregatesInput = {
    AND?: AvailabilityRuleScalarWhereWithAggregatesInput | AvailabilityRuleScalarWhereWithAggregatesInput[]
    OR?: AvailabilityRuleScalarWhereWithAggregatesInput[]
    NOT?: AvailabilityRuleScalarWhereWithAggregatesInput | AvailabilityRuleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AvailabilityRule"> | string
    tenantId?: StringWithAggregatesFilter<"AvailabilityRule"> | string
    dayOfWeek?: IntWithAggregatesFilter<"AvailabilityRule"> | number
    startTime?: StringWithAggregatesFilter<"AvailabilityRule"> | string
    endTime?: StringWithAggregatesFilter<"AvailabilityRule"> | string
    capacitySlots?: IntWithAggregatesFilter<"AvailabilityRule"> | number
    createdAt?: DateTimeWithAggregatesFilter<"AvailabilityRule"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AvailabilityRule"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"AvailabilityRule"> | Date | string | null
  }

  export type BookingWhereInput = {
    AND?: BookingWhereInput | BookingWhereInput[]
    OR?: BookingWhereInput[]
    NOT?: BookingWhereInput | BookingWhereInput[]
    id?: StringFilter<"Booking"> | string
    tenantId?: StringFilter<"Booking"> | string
    customerId?: StringFilter<"Booking"> | string
    wrapId?: StringFilter<"Booking"> | string
    startTime?: DateTimeFilter<"Booking"> | Date | string
    endTime?: DateTimeFilter<"Booking"> | Date | string
    status?: StringFilter<"Booking"> | string
    totalPrice?: FloatFilter<"Booking"> | number
    createdAt?: DateTimeFilter<"Booking"> | Date | string
    updatedAt?: DateTimeFilter<"Booking"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Booking"> | Date | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    wrap?: XOR<WrapScalarRelationFilter, WrapWhereInput>
    reservation?: XOR<BookingReservationNullableScalarRelationFilter, BookingReservationWhereInput> | null
    invoice?: XOR<InvoiceNullableScalarRelationFilter, InvoiceWhereInput> | null
  }

  export type BookingOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    customerId?: SortOrder
    wrapId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    totalPrice?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
    wrap?: WrapOrderByWithRelationInput
    reservation?: BookingReservationOrderByWithRelationInput
    invoice?: InvoiceOrderByWithRelationInput
  }

  export type BookingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_id?: BookingTenantIdIdCompoundUniqueInput
    AND?: BookingWhereInput | BookingWhereInput[]
    OR?: BookingWhereInput[]
    NOT?: BookingWhereInput | BookingWhereInput[]
    tenantId?: StringFilter<"Booking"> | string
    customerId?: StringFilter<"Booking"> | string
    wrapId?: StringFilter<"Booking"> | string
    startTime?: DateTimeFilter<"Booking"> | Date | string
    endTime?: DateTimeFilter<"Booking"> | Date | string
    status?: StringFilter<"Booking"> | string
    totalPrice?: FloatFilter<"Booking"> | number
    createdAt?: DateTimeFilter<"Booking"> | Date | string
    updatedAt?: DateTimeFilter<"Booking"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Booking"> | Date | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    wrap?: XOR<WrapScalarRelationFilter, WrapWhereInput>
    reservation?: XOR<BookingReservationNullableScalarRelationFilter, BookingReservationWhereInput> | null
    invoice?: XOR<InvoiceNullableScalarRelationFilter, InvoiceWhereInput> | null
  }, "id" | "tenantId_id">

  export type BookingOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    customerId?: SortOrder
    wrapId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    totalPrice?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: BookingCountOrderByAggregateInput
    _avg?: BookingAvgOrderByAggregateInput
    _max?: BookingMaxOrderByAggregateInput
    _min?: BookingMinOrderByAggregateInput
    _sum?: BookingSumOrderByAggregateInput
  }

  export type BookingScalarWhereWithAggregatesInput = {
    AND?: BookingScalarWhereWithAggregatesInput | BookingScalarWhereWithAggregatesInput[]
    OR?: BookingScalarWhereWithAggregatesInput[]
    NOT?: BookingScalarWhereWithAggregatesInput | BookingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Booking"> | string
    tenantId?: StringWithAggregatesFilter<"Booking"> | string
    customerId?: StringWithAggregatesFilter<"Booking"> | string
    wrapId?: StringWithAggregatesFilter<"Booking"> | string
    startTime?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    endTime?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    status?: StringWithAggregatesFilter<"Booking"> | string
    totalPrice?: FloatWithAggregatesFilter<"Booking"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Booking"> | Date | string | null
  }

  export type BookingReservationWhereInput = {
    AND?: BookingReservationWhereInput | BookingReservationWhereInput[]
    OR?: BookingReservationWhereInput[]
    NOT?: BookingReservationWhereInput | BookingReservationWhereInput[]
    id?: StringFilter<"BookingReservation"> | string
    bookingId?: StringFilter<"BookingReservation"> | string
    expiresAt?: DateTimeFilter<"BookingReservation"> | Date | string
    reservedAt?: DateTimeFilter<"BookingReservation"> | Date | string
    createdAt?: DateTimeFilter<"BookingReservation"> | Date | string
    booking?: XOR<BookingScalarRelationFilter, BookingWhereInput>
  }

  export type BookingReservationOrderByWithRelationInput = {
    id?: SortOrder
    bookingId?: SortOrder
    expiresAt?: SortOrder
    reservedAt?: SortOrder
    createdAt?: SortOrder
    booking?: BookingOrderByWithRelationInput
  }

  export type BookingReservationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    bookingId?: string
    AND?: BookingReservationWhereInput | BookingReservationWhereInput[]
    OR?: BookingReservationWhereInput[]
    NOT?: BookingReservationWhereInput | BookingReservationWhereInput[]
    expiresAt?: DateTimeFilter<"BookingReservation"> | Date | string
    reservedAt?: DateTimeFilter<"BookingReservation"> | Date | string
    createdAt?: DateTimeFilter<"BookingReservation"> | Date | string
    booking?: XOR<BookingScalarRelationFilter, BookingWhereInput>
  }, "id" | "bookingId">

  export type BookingReservationOrderByWithAggregationInput = {
    id?: SortOrder
    bookingId?: SortOrder
    expiresAt?: SortOrder
    reservedAt?: SortOrder
    createdAt?: SortOrder
    _count?: BookingReservationCountOrderByAggregateInput
    _max?: BookingReservationMaxOrderByAggregateInput
    _min?: BookingReservationMinOrderByAggregateInput
  }

  export type BookingReservationScalarWhereWithAggregatesInput = {
    AND?: BookingReservationScalarWhereWithAggregatesInput | BookingReservationScalarWhereWithAggregatesInput[]
    OR?: BookingReservationScalarWhereWithAggregatesInput[]
    NOT?: BookingReservationScalarWhereWithAggregatesInput | BookingReservationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BookingReservation"> | string
    bookingId?: StringWithAggregatesFilter<"BookingReservation"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"BookingReservation"> | Date | string
    reservedAt?: DateTimeWithAggregatesFilter<"BookingReservation"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"BookingReservation"> | Date | string
  }

  export type VisualizerPreviewWhereInput = {
    AND?: VisualizerPreviewWhereInput | VisualizerPreviewWhereInput[]
    OR?: VisualizerPreviewWhereInput[]
    NOT?: VisualizerPreviewWhereInput | VisualizerPreviewWhereInput[]
    id?: StringFilter<"VisualizerPreview"> | string
    tenantId?: StringFilter<"VisualizerPreview"> | string
    wrapId?: StringFilter<"VisualizerPreview"> | string
    customerPhotoUrl?: StringFilter<"VisualizerPreview"> | string
    processedImageUrl?: StringNullableFilter<"VisualizerPreview"> | string | null
    status?: StringFilter<"VisualizerPreview"> | string
    cacheKey?: StringFilter<"VisualizerPreview"> | string
    expiresAt?: DateTimeFilter<"VisualizerPreview"> | Date | string
    createdAt?: DateTimeFilter<"VisualizerPreview"> | Date | string
    updatedAt?: DateTimeFilter<"VisualizerPreview"> | Date | string
    deletedAt?: DateTimeNullableFilter<"VisualizerPreview"> | Date | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    wrap?: XOR<WrapScalarRelationFilter, WrapWhereInput>
  }

  export type VisualizerPreviewOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    wrapId?: SortOrder
    customerPhotoUrl?: SortOrder
    processedImageUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    cacheKey?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
    wrap?: WrapOrderByWithRelationInput
  }

  export type VisualizerPreviewWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    cacheKey?: string
    AND?: VisualizerPreviewWhereInput | VisualizerPreviewWhereInput[]
    OR?: VisualizerPreviewWhereInput[]
    NOT?: VisualizerPreviewWhereInput | VisualizerPreviewWhereInput[]
    tenantId?: StringFilter<"VisualizerPreview"> | string
    wrapId?: StringFilter<"VisualizerPreview"> | string
    customerPhotoUrl?: StringFilter<"VisualizerPreview"> | string
    processedImageUrl?: StringNullableFilter<"VisualizerPreview"> | string | null
    status?: StringFilter<"VisualizerPreview"> | string
    expiresAt?: DateTimeFilter<"VisualizerPreview"> | Date | string
    createdAt?: DateTimeFilter<"VisualizerPreview"> | Date | string
    updatedAt?: DateTimeFilter<"VisualizerPreview"> | Date | string
    deletedAt?: DateTimeNullableFilter<"VisualizerPreview"> | Date | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    wrap?: XOR<WrapScalarRelationFilter, WrapWhereInput>
  }, "id" | "cacheKey">

  export type VisualizerPreviewOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    wrapId?: SortOrder
    customerPhotoUrl?: SortOrder
    processedImageUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    cacheKey?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: VisualizerPreviewCountOrderByAggregateInput
    _max?: VisualizerPreviewMaxOrderByAggregateInput
    _min?: VisualizerPreviewMinOrderByAggregateInput
  }

  export type VisualizerPreviewScalarWhereWithAggregatesInput = {
    AND?: VisualizerPreviewScalarWhereWithAggregatesInput | VisualizerPreviewScalarWhereWithAggregatesInput[]
    OR?: VisualizerPreviewScalarWhereWithAggregatesInput[]
    NOT?: VisualizerPreviewScalarWhereWithAggregatesInput | VisualizerPreviewScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"VisualizerPreview"> | string
    tenantId?: StringWithAggregatesFilter<"VisualizerPreview"> | string
    wrapId?: StringWithAggregatesFilter<"VisualizerPreview"> | string
    customerPhotoUrl?: StringWithAggregatesFilter<"VisualizerPreview"> | string
    processedImageUrl?: StringNullableWithAggregatesFilter<"VisualizerPreview"> | string | null
    status?: StringWithAggregatesFilter<"VisualizerPreview"> | string
    cacheKey?: StringWithAggregatesFilter<"VisualizerPreview"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"VisualizerPreview"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"VisualizerPreview"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"VisualizerPreview"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"VisualizerPreview"> | Date | string | null
  }

  export type InvoiceWhereInput = {
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    id?: StringFilter<"Invoice"> | string
    tenantId?: StringFilter<"Invoice"> | string
    bookingId?: StringFilter<"Invoice"> | string
    status?: StringFilter<"Invoice"> | string
    totalAmount?: FloatFilter<"Invoice"> | number
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeFilter<"Invoice"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Invoice"> | Date | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    booking?: XOR<BookingScalarRelationFilter, BookingWhereInput>
    lineItems?: InvoiceLineItemListRelationFilter
    payments?: PaymentListRelationFilter
  }

  export type InvoiceOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    bookingId?: SortOrder
    status?: SortOrder
    totalAmount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
    booking?: BookingOrderByWithRelationInput
    lineItems?: InvoiceLineItemOrderByRelationAggregateInput
    payments?: PaymentOrderByRelationAggregateInput
  }

  export type InvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    bookingId?: string
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    tenantId?: StringFilter<"Invoice"> | string
    status?: StringFilter<"Invoice"> | string
    totalAmount?: FloatFilter<"Invoice"> | number
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeFilter<"Invoice"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Invoice"> | Date | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    booking?: XOR<BookingScalarRelationFilter, BookingWhereInput>
    lineItems?: InvoiceLineItemListRelationFilter
    payments?: PaymentListRelationFilter
  }, "id" | "bookingId">

  export type InvoiceOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    bookingId?: SortOrder
    status?: SortOrder
    totalAmount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: InvoiceCountOrderByAggregateInput
    _avg?: InvoiceAvgOrderByAggregateInput
    _max?: InvoiceMaxOrderByAggregateInput
    _min?: InvoiceMinOrderByAggregateInput
    _sum?: InvoiceSumOrderByAggregateInput
  }

  export type InvoiceScalarWhereWithAggregatesInput = {
    AND?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    OR?: InvoiceScalarWhereWithAggregatesInput[]
    NOT?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Invoice"> | string
    tenantId?: StringWithAggregatesFilter<"Invoice"> | string
    bookingId?: StringWithAggregatesFilter<"Invoice"> | string
    status?: StringWithAggregatesFilter<"Invoice"> | string
    totalAmount?: FloatWithAggregatesFilter<"Invoice"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Invoice"> | Date | string | null
  }

  export type InvoiceLineItemWhereInput = {
    AND?: InvoiceLineItemWhereInput | InvoiceLineItemWhereInput[]
    OR?: InvoiceLineItemWhereInput[]
    NOT?: InvoiceLineItemWhereInput | InvoiceLineItemWhereInput[]
    id?: StringFilter<"InvoiceLineItem"> | string
    invoiceId?: StringFilter<"InvoiceLineItem"> | string
    description?: StringFilter<"InvoiceLineItem"> | string
    quantity?: IntFilter<"InvoiceLineItem"> | number
    unitPrice?: FloatFilter<"InvoiceLineItem"> | number
    totalPrice?: FloatFilter<"InvoiceLineItem"> | number
    invoice?: XOR<InvoiceScalarRelationFilter, InvoiceWhereInput>
  }

  export type InvoiceLineItemOrderByWithRelationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    totalPrice?: SortOrder
    invoice?: InvoiceOrderByWithRelationInput
  }

  export type InvoiceLineItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InvoiceLineItemWhereInput | InvoiceLineItemWhereInput[]
    OR?: InvoiceLineItemWhereInput[]
    NOT?: InvoiceLineItemWhereInput | InvoiceLineItemWhereInput[]
    invoiceId?: StringFilter<"InvoiceLineItem"> | string
    description?: StringFilter<"InvoiceLineItem"> | string
    quantity?: IntFilter<"InvoiceLineItem"> | number
    unitPrice?: FloatFilter<"InvoiceLineItem"> | number
    totalPrice?: FloatFilter<"InvoiceLineItem"> | number
    invoice?: XOR<InvoiceScalarRelationFilter, InvoiceWhereInput>
  }, "id">

  export type InvoiceLineItemOrderByWithAggregationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    totalPrice?: SortOrder
    _count?: InvoiceLineItemCountOrderByAggregateInput
    _avg?: InvoiceLineItemAvgOrderByAggregateInput
    _max?: InvoiceLineItemMaxOrderByAggregateInput
    _min?: InvoiceLineItemMinOrderByAggregateInput
    _sum?: InvoiceLineItemSumOrderByAggregateInput
  }

  export type InvoiceLineItemScalarWhereWithAggregatesInput = {
    AND?: InvoiceLineItemScalarWhereWithAggregatesInput | InvoiceLineItemScalarWhereWithAggregatesInput[]
    OR?: InvoiceLineItemScalarWhereWithAggregatesInput[]
    NOT?: InvoiceLineItemScalarWhereWithAggregatesInput | InvoiceLineItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InvoiceLineItem"> | string
    invoiceId?: StringWithAggregatesFilter<"InvoiceLineItem"> | string
    description?: StringWithAggregatesFilter<"InvoiceLineItem"> | string
    quantity?: IntWithAggregatesFilter<"InvoiceLineItem"> | number
    unitPrice?: FloatWithAggregatesFilter<"InvoiceLineItem"> | number
    totalPrice?: FloatWithAggregatesFilter<"InvoiceLineItem"> | number
  }

  export type PaymentWhereInput = {
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    id?: StringFilter<"Payment"> | string
    invoiceId?: StringFilter<"Payment"> | string
    stripePaymentIntentId?: StringFilter<"Payment"> | string
    status?: StringFilter<"Payment"> | string
    amount?: FloatFilter<"Payment"> | number
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    invoice?: XOR<InvoiceScalarRelationFilter, InvoiceWhereInput>
  }

  export type PaymentOrderByWithRelationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    stripePaymentIntentId?: SortOrder
    status?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    invoice?: InvoiceOrderByWithRelationInput
  }

  export type PaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    stripePaymentIntentId?: string
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    invoiceId?: StringFilter<"Payment"> | string
    status?: StringFilter<"Payment"> | string
    amount?: FloatFilter<"Payment"> | number
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    invoice?: XOR<InvoiceScalarRelationFilter, InvoiceWhereInput>
  }, "id" | "stripePaymentIntentId">

  export type PaymentOrderByWithAggregationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    stripePaymentIntentId?: SortOrder
    status?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: PaymentCountOrderByAggregateInput
    _avg?: PaymentAvgOrderByAggregateInput
    _max?: PaymentMaxOrderByAggregateInput
    _min?: PaymentMinOrderByAggregateInput
    _sum?: PaymentSumOrderByAggregateInput
  }

  export type PaymentScalarWhereWithAggregatesInput = {
    AND?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    OR?: PaymentScalarWhereWithAggregatesInput[]
    NOT?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Payment"> | string
    invoiceId?: StringWithAggregatesFilter<"Payment"> | string
    stripePaymentIntentId?: StringWithAggregatesFilter<"Payment"> | string
    status?: StringWithAggregatesFilter<"Payment"> | string
    amount?: FloatWithAggregatesFilter<"Payment"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Payment"> | Date | string | null
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    tenantId?: StringFilter<"AuditLog"> | string
    userId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    resourceType?: StringFilter<"AuditLog"> | string
    resourceId?: StringFilter<"AuditLog"> | string
    details?: StringNullableFilter<"AuditLog"> | string | null
    timestamp?: DateTimeFilter<"AuditLog"> | Date | string
    deletedAt?: DateTimeNullableFilter<"AuditLog"> | Date | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    resourceType?: SortOrder
    resourceId?: SortOrder
    details?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    tenantId?: StringFilter<"AuditLog"> | string
    userId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    resourceType?: StringFilter<"AuditLog"> | string
    resourceId?: StringFilter<"AuditLog"> | string
    details?: StringNullableFilter<"AuditLog"> | string | null
    timestamp?: DateTimeFilter<"AuditLog"> | Date | string
    deletedAt?: DateTimeNullableFilter<"AuditLog"> | Date | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    resourceType?: SortOrder
    resourceId?: SortOrder
    details?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    tenantId?: StringWithAggregatesFilter<"AuditLog"> | string
    userId?: StringWithAggregatesFilter<"AuditLog"> | string
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    resourceType?: StringWithAggregatesFilter<"AuditLog"> | string
    resourceId?: StringWithAggregatesFilter<"AuditLog"> | string
    details?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    timestamp?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"AuditLog"> | Date | string | null
  }

  export type TenantCreateInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    members?: TenantUserMembershipCreateNestedManyWithoutTenantInput
    wraps?: WrapCreateNestedManyWithoutTenantInput
    wrapCategories?: WrapCategoryCreateNestedManyWithoutTenantInput
    availabilityRules?: AvailabilityRuleCreateNestedManyWithoutTenantInput
    bookings?: BookingCreateNestedManyWithoutTenantInput
    previews?: VisualizerPreviewCreateNestedManyWithoutTenantInput
    invoices?: InvoiceCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    members?: TenantUserMembershipUncheckedCreateNestedManyWithoutTenantInput
    wraps?: WrapUncheckedCreateNestedManyWithoutTenantInput
    wrapCategories?: WrapCategoryUncheckedCreateNestedManyWithoutTenantInput
    availabilityRules?: AvailabilityRuleUncheckedCreateNestedManyWithoutTenantInput
    bookings?: BookingUncheckedCreateNestedManyWithoutTenantInput
    previews?: VisualizerPreviewUncheckedCreateNestedManyWithoutTenantInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    members?: TenantUserMembershipUpdateManyWithoutTenantNestedInput
    wraps?: WrapUpdateManyWithoutTenantNestedInput
    wrapCategories?: WrapCategoryUpdateManyWithoutTenantNestedInput
    availabilityRules?: AvailabilityRuleUpdateManyWithoutTenantNestedInput
    bookings?: BookingUpdateManyWithoutTenantNestedInput
    previews?: VisualizerPreviewUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    members?: TenantUserMembershipUncheckedUpdateManyWithoutTenantNestedInput
    wraps?: WrapUncheckedUpdateManyWithoutTenantNestedInput
    wrapCategories?: WrapCategoryUncheckedUpdateManyWithoutTenantNestedInput
    availabilityRules?: AvailabilityRuleUncheckedUpdateManyWithoutTenantNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutTenantNestedInput
    previews?: VisualizerPreviewUncheckedUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateManyInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type TenantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantUserMembershipCreateInput = {
    id?: string
    userId: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutMembersInput
  }

  export type TenantUserMembershipUncheckedCreateInput = {
    id?: string
    tenantId: string
    userId: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type TenantUserMembershipUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutMembersNestedInput
  }

  export type TenantUserMembershipUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantUserMembershipCreateManyInput = {
    id?: string
    tenantId: string
    userId: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type TenantUserMembershipUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantUserMembershipUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WrapCreateInput = {
    id?: string
    name: string
    description?: string | null
    price: number
    installationMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutWrapsInput
    images?: WrapImageCreateNestedManyWithoutWrapInput
    categoryMappings?: WrapCategoryMappingCreateNestedManyWithoutWrapInput
    bookings?: BookingCreateNestedManyWithoutWrapInput
    previews?: VisualizerPreviewCreateNestedManyWithoutWrapInput
  }

  export type WrapUncheckedCreateInput = {
    id?: string
    tenantId: string
    name: string
    description?: string | null
    price: number
    installationMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    images?: WrapImageUncheckedCreateNestedManyWithoutWrapInput
    categoryMappings?: WrapCategoryMappingUncheckedCreateNestedManyWithoutWrapInput
    bookings?: BookingUncheckedCreateNestedManyWithoutWrapInput
    previews?: VisualizerPreviewUncheckedCreateNestedManyWithoutWrapInput
  }

  export type WrapUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    installationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutWrapsNestedInput
    images?: WrapImageUpdateManyWithoutWrapNestedInput
    categoryMappings?: WrapCategoryMappingUpdateManyWithoutWrapNestedInput
    bookings?: BookingUpdateManyWithoutWrapNestedInput
    previews?: VisualizerPreviewUpdateManyWithoutWrapNestedInput
  }

  export type WrapUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    installationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    images?: WrapImageUncheckedUpdateManyWithoutWrapNestedInput
    categoryMappings?: WrapCategoryMappingUncheckedUpdateManyWithoutWrapNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutWrapNestedInput
    previews?: VisualizerPreviewUncheckedUpdateManyWithoutWrapNestedInput
  }

  export type WrapCreateManyInput = {
    id?: string
    tenantId: string
    name: string
    description?: string | null
    price: number
    installationMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type WrapUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    installationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WrapUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    installationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WrapCategoryCreateInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutWrapCategoriesInput
    wraps?: WrapCategoryMappingCreateNestedManyWithoutCategoryInput
  }

  export type WrapCategoryUncheckedCreateInput = {
    id?: string
    tenantId: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    wraps?: WrapCategoryMappingUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type WrapCategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutWrapCategoriesNestedInput
    wraps?: WrapCategoryMappingUpdateManyWithoutCategoryNestedInput
  }

  export type WrapCategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wraps?: WrapCategoryMappingUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type WrapCategoryCreateManyInput = {
    id?: string
    tenantId: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type WrapCategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WrapCategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WrapCategoryMappingCreateInput = {
    wrap: WrapCreateNestedOneWithoutCategoryMappingsInput
    category: WrapCategoryCreateNestedOneWithoutWrapsInput
  }

  export type WrapCategoryMappingUncheckedCreateInput = {
    wrapId: string
    categoryId: string
  }

  export type WrapCategoryMappingUpdateInput = {
    wrap?: WrapUpdateOneRequiredWithoutCategoryMappingsNestedInput
    category?: WrapCategoryUpdateOneRequiredWithoutWrapsNestedInput
  }

  export type WrapCategoryMappingUncheckedUpdateInput = {
    wrapId?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
  }

  export type WrapCategoryMappingCreateManyInput = {
    wrapId: string
    categoryId: string
  }

  export type WrapCategoryMappingUpdateManyMutationInput = {

  }

  export type WrapCategoryMappingUncheckedUpdateManyInput = {
    wrapId?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
  }

  export type WrapImageCreateInput = {
    id?: string
    url: string
    displayOrder?: number
    createdAt?: Date | string
    deletedAt?: Date | string | null
    wrap: WrapCreateNestedOneWithoutImagesInput
  }

  export type WrapImageUncheckedCreateInput = {
    id?: string
    wrapId: string
    url: string
    displayOrder?: number
    createdAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type WrapImageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wrap?: WrapUpdateOneRequiredWithoutImagesNestedInput
  }

  export type WrapImageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    wrapId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WrapImageCreateManyInput = {
    id?: string
    wrapId: string
    url: string
    displayOrder?: number
    createdAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type WrapImageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WrapImageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    wrapId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AvailabilityRuleCreateInput = {
    id?: string
    dayOfWeek: number
    startTime: string
    endTime: string
    capacitySlots: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutAvailabilityRulesInput
  }

  export type AvailabilityRuleUncheckedCreateInput = {
    id?: string
    tenantId: string
    dayOfWeek: number
    startTime: string
    endTime: string
    capacitySlots: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type AvailabilityRuleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    capacitySlots?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutAvailabilityRulesNestedInput
  }

  export type AvailabilityRuleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    capacitySlots?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AvailabilityRuleCreateManyInput = {
    id?: string
    tenantId: string
    dayOfWeek: number
    startTime: string
    endTime: string
    capacitySlots: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type AvailabilityRuleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    capacitySlots?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AvailabilityRuleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    capacitySlots?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BookingCreateInput = {
    id?: string
    customerId: string
    startTime: Date | string
    endTime: Date | string
    status?: string
    totalPrice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutBookingsInput
    wrap: WrapCreateNestedOneWithoutBookingsInput
    reservation?: BookingReservationCreateNestedOneWithoutBookingInput
    invoice?: InvoiceCreateNestedOneWithoutBookingInput
  }

  export type BookingUncheckedCreateInput = {
    id?: string
    tenantId: string
    customerId: string
    wrapId: string
    startTime: Date | string
    endTime: Date | string
    status?: string
    totalPrice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    reservation?: BookingReservationUncheckedCreateNestedOneWithoutBookingInput
    invoice?: InvoiceUncheckedCreateNestedOneWithoutBookingInput
  }

  export type BookingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    totalPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutBookingsNestedInput
    wrap?: WrapUpdateOneRequiredWithoutBookingsNestedInput
    reservation?: BookingReservationUpdateOneWithoutBookingNestedInput
    invoice?: InvoiceUpdateOneWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    wrapId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    totalPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reservation?: BookingReservationUncheckedUpdateOneWithoutBookingNestedInput
    invoice?: InvoiceUncheckedUpdateOneWithoutBookingNestedInput
  }

  export type BookingCreateManyInput = {
    id?: string
    tenantId: string
    customerId: string
    wrapId: string
    startTime: Date | string
    endTime: Date | string
    status?: string
    totalPrice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type BookingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    totalPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BookingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    wrapId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    totalPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BookingReservationCreateInput = {
    id?: string
    expiresAt: Date | string
    reservedAt?: Date | string
    createdAt?: Date | string
    booking: BookingCreateNestedOneWithoutReservationInput
  }

  export type BookingReservationUncheckedCreateInput = {
    id?: string
    bookingId: string
    expiresAt: Date | string
    reservedAt?: Date | string
    createdAt?: Date | string
  }

  export type BookingReservationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    booking?: BookingUpdateOneRequiredWithoutReservationNestedInput
  }

  export type BookingReservationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingReservationCreateManyInput = {
    id?: string
    bookingId: string
    expiresAt: Date | string
    reservedAt?: Date | string
    createdAt?: Date | string
  }

  export type BookingReservationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingReservationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisualizerPreviewCreateInput = {
    id?: string
    customerPhotoUrl: string
    processedImageUrl?: string | null
    status?: string
    cacheKey: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutPreviewsInput
    wrap: WrapCreateNestedOneWithoutPreviewsInput
  }

  export type VisualizerPreviewUncheckedCreateInput = {
    id?: string
    tenantId: string
    wrapId: string
    customerPhotoUrl: string
    processedImageUrl?: string | null
    status?: string
    cacheKey: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type VisualizerPreviewUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerPhotoUrl?: StringFieldUpdateOperationsInput | string
    processedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    cacheKey?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutPreviewsNestedInput
    wrap?: WrapUpdateOneRequiredWithoutPreviewsNestedInput
  }

  export type VisualizerPreviewUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    wrapId?: StringFieldUpdateOperationsInput | string
    customerPhotoUrl?: StringFieldUpdateOperationsInput | string
    processedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    cacheKey?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VisualizerPreviewCreateManyInput = {
    id?: string
    tenantId: string
    wrapId: string
    customerPhotoUrl: string
    processedImageUrl?: string | null
    status?: string
    cacheKey: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type VisualizerPreviewUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerPhotoUrl?: StringFieldUpdateOperationsInput | string
    processedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    cacheKey?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VisualizerPreviewUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    wrapId?: StringFieldUpdateOperationsInput | string
    customerPhotoUrl?: StringFieldUpdateOperationsInput | string
    processedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    cacheKey?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InvoiceCreateInput = {
    id?: string
    status?: string
    totalAmount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutInvoicesInput
    booking: BookingCreateNestedOneWithoutInvoiceInput
    lineItems?: InvoiceLineItemCreateNestedManyWithoutInvoiceInput
    payments?: PaymentCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUncheckedCreateInput = {
    id?: string
    tenantId: string
    bookingId: string
    status?: string
    totalAmount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    lineItems?: InvoiceLineItemUncheckedCreateNestedManyWithoutInvoiceInput
    payments?: PaymentUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutInvoicesNestedInput
    booking?: BookingUpdateOneRequiredWithoutInvoiceNestedInput
    lineItems?: InvoiceLineItemUpdateManyWithoutInvoiceNestedInput
    payments?: PaymentUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lineItems?: InvoiceLineItemUncheckedUpdateManyWithoutInvoiceNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceCreateManyInput = {
    id?: string
    tenantId: string
    bookingId: string
    status?: string
    totalAmount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type InvoiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InvoiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InvoiceLineItemCreateInput = {
    id?: string
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
    invoice: InvoiceCreateNestedOneWithoutLineItemsInput
  }

  export type InvoiceLineItemUncheckedCreateInput = {
    id?: string
    invoiceId: string
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }

  export type InvoiceLineItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    totalPrice?: FloatFieldUpdateOperationsInput | number
    invoice?: InvoiceUpdateOneRequiredWithoutLineItemsNestedInput
  }

  export type InvoiceLineItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    totalPrice?: FloatFieldUpdateOperationsInput | number
  }

  export type InvoiceLineItemCreateManyInput = {
    id?: string
    invoiceId: string
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }

  export type InvoiceLineItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    totalPrice?: FloatFieldUpdateOperationsInput | number
  }

  export type InvoiceLineItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    totalPrice?: FloatFieldUpdateOperationsInput | number
  }

  export type PaymentCreateInput = {
    id?: string
    stripePaymentIntentId: string
    status?: string
    amount: number
    createdAt?: Date | string
    deletedAt?: Date | string | null
    invoice: InvoiceCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentUncheckedCreateInput = {
    id?: string
    invoiceId: string
    stripePaymentIntentId: string
    status?: string
    amount: number
    createdAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type PaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePaymentIntentId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invoice?: InvoiceUpdateOneRequiredWithoutPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    stripePaymentIntentId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PaymentCreateManyInput = {
    id?: string
    invoiceId: string
    stripePaymentIntentId: string
    status?: string
    amount: number
    createdAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type PaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePaymentIntentId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    stripePaymentIntentId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AuditLogCreateInput = {
    id?: string
    userId: string
    action: string
    resourceType: string
    resourceId: string
    details?: string | null
    timestamp?: Date | string
    deletedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    tenantId: string
    userId: string
    action: string
    resourceType: string
    resourceId: string
    details?: string | null
    timestamp?: Date | string
    deletedAt?: Date | string | null
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    resourceId?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    resourceId?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AuditLogCreateManyInput = {
    id?: string
    tenantId: string
    userId: string
    action: string
    resourceType: string
    resourceId: string
    details?: string | null
    timestamp?: Date | string
    deletedAt?: Date | string | null
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    resourceId?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    resourceId?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type TenantUserMembershipListRelationFilter = {
    every?: TenantUserMembershipWhereInput
    some?: TenantUserMembershipWhereInput
    none?: TenantUserMembershipWhereInput
  }

  export type WrapListRelationFilter = {
    every?: WrapWhereInput
    some?: WrapWhereInput
    none?: WrapWhereInput
  }

  export type WrapCategoryListRelationFilter = {
    every?: WrapCategoryWhereInput
    some?: WrapCategoryWhereInput
    none?: WrapCategoryWhereInput
  }

  export type AvailabilityRuleListRelationFilter = {
    every?: AvailabilityRuleWhereInput
    some?: AvailabilityRuleWhereInput
    none?: AvailabilityRuleWhereInput
  }

  export type BookingListRelationFilter = {
    every?: BookingWhereInput
    some?: BookingWhereInput
    none?: BookingWhereInput
  }

  export type VisualizerPreviewListRelationFilter = {
    every?: VisualizerPreviewWhereInput
    some?: VisualizerPreviewWhereInput
    none?: VisualizerPreviewWhereInput
  }

  export type InvoiceListRelationFilter = {
    every?: InvoiceWhereInput
    some?: InvoiceWhereInput
    none?: InvoiceWhereInput
  }

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput
    some?: AuditLogWhereInput
    none?: AuditLogWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TenantUserMembershipOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WrapOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WrapCategoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AvailabilityRuleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BookingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VisualizerPreviewOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InvoiceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type TenantMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type TenantMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type TenantScalarRelationFilter = {
    is?: TenantWhereInput
    isNot?: TenantWhereInput
  }

  export type TenantUserMembershipTenantIdUserIdCompoundUniqueInput = {
    tenantId: string
    userId: string
  }

  export type TenantUserMembershipCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type TenantUserMembershipMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type TenantUserMembershipMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type WrapImageListRelationFilter = {
    every?: WrapImageWhereInput
    some?: WrapImageWhereInput
    none?: WrapImageWhereInput
  }

  export type WrapCategoryMappingListRelationFilter = {
    every?: WrapCategoryMappingWhereInput
    some?: WrapCategoryMappingWhereInput
    none?: WrapCategoryMappingWhereInput
  }

  export type WrapImageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WrapCategoryMappingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WrapTenantIdIdCompoundUniqueInput = {
    tenantId: string
    id: string
  }

  export type WrapCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    installationMinutes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type WrapAvgOrderByAggregateInput = {
    price?: SortOrder
    installationMinutes?: SortOrder
  }

  export type WrapMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    installationMinutes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type WrapMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    installationMinutes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type WrapSumOrderByAggregateInput = {
    price?: SortOrder
    installationMinutes?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type WrapCategoryTenantIdSlugCompoundUniqueInput = {
    tenantId: string
    slug: string
  }

  export type WrapCategoryCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type WrapCategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type WrapCategoryMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type WrapScalarRelationFilter = {
    is?: WrapWhereInput
    isNot?: WrapWhereInput
  }

  export type WrapCategoryScalarRelationFilter = {
    is?: WrapCategoryWhereInput
    isNot?: WrapCategoryWhereInput
  }

  export type WrapCategoryMappingWrapIdCategoryIdCompoundUniqueInput = {
    wrapId: string
    categoryId: string
  }

  export type WrapCategoryMappingCountOrderByAggregateInput = {
    wrapId?: SortOrder
    categoryId?: SortOrder
  }

  export type WrapCategoryMappingMaxOrderByAggregateInput = {
    wrapId?: SortOrder
    categoryId?: SortOrder
  }

  export type WrapCategoryMappingMinOrderByAggregateInput = {
    wrapId?: SortOrder
    categoryId?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type WrapImageCountOrderByAggregateInput = {
    id?: SortOrder
    wrapId?: SortOrder
    url?: SortOrder
    displayOrder?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type WrapImageAvgOrderByAggregateInput = {
    displayOrder?: SortOrder
  }

  export type WrapImageMaxOrderByAggregateInput = {
    id?: SortOrder
    wrapId?: SortOrder
    url?: SortOrder
    displayOrder?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type WrapImageMinOrderByAggregateInput = {
    id?: SortOrder
    wrapId?: SortOrder
    url?: SortOrder
    displayOrder?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type WrapImageSumOrderByAggregateInput = {
    displayOrder?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type AvailabilityRuleCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    capacitySlots?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type AvailabilityRuleAvgOrderByAggregateInput = {
    dayOfWeek?: SortOrder
    capacitySlots?: SortOrder
  }

  export type AvailabilityRuleMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    capacitySlots?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type AvailabilityRuleMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    capacitySlots?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type AvailabilityRuleSumOrderByAggregateInput = {
    dayOfWeek?: SortOrder
    capacitySlots?: SortOrder
  }

  export type BookingReservationNullableScalarRelationFilter = {
    is?: BookingReservationWhereInput | null
    isNot?: BookingReservationWhereInput | null
  }

  export type InvoiceNullableScalarRelationFilter = {
    is?: InvoiceWhereInput | null
    isNot?: InvoiceWhereInput | null
  }

  export type BookingTenantIdIdCompoundUniqueInput = {
    tenantId: string
    id: string
  }

  export type BookingCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    customerId?: SortOrder
    wrapId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    totalPrice?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type BookingAvgOrderByAggregateInput = {
    totalPrice?: SortOrder
  }

  export type BookingMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    customerId?: SortOrder
    wrapId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    totalPrice?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type BookingMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    customerId?: SortOrder
    wrapId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    totalPrice?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type BookingSumOrderByAggregateInput = {
    totalPrice?: SortOrder
  }

  export type BookingScalarRelationFilter = {
    is?: BookingWhereInput
    isNot?: BookingWhereInput
  }

  export type BookingReservationCountOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    expiresAt?: SortOrder
    reservedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type BookingReservationMaxOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    expiresAt?: SortOrder
    reservedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type BookingReservationMinOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    expiresAt?: SortOrder
    reservedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type VisualizerPreviewCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    wrapId?: SortOrder
    customerPhotoUrl?: SortOrder
    processedImageUrl?: SortOrder
    status?: SortOrder
    cacheKey?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type VisualizerPreviewMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    wrapId?: SortOrder
    customerPhotoUrl?: SortOrder
    processedImageUrl?: SortOrder
    status?: SortOrder
    cacheKey?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type VisualizerPreviewMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    wrapId?: SortOrder
    customerPhotoUrl?: SortOrder
    processedImageUrl?: SortOrder
    status?: SortOrder
    cacheKey?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type InvoiceLineItemListRelationFilter = {
    every?: InvoiceLineItemWhereInput
    some?: InvoiceLineItemWhereInput
    none?: InvoiceLineItemWhereInput
  }

  export type PaymentListRelationFilter = {
    every?: PaymentWhereInput
    some?: PaymentWhereInput
    none?: PaymentWhereInput
  }

  export type InvoiceLineItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PaymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InvoiceCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    bookingId?: SortOrder
    status?: SortOrder
    totalAmount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type InvoiceAvgOrderByAggregateInput = {
    totalAmount?: SortOrder
  }

  export type InvoiceMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    bookingId?: SortOrder
    status?: SortOrder
    totalAmount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type InvoiceMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    bookingId?: SortOrder
    status?: SortOrder
    totalAmount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type InvoiceSumOrderByAggregateInput = {
    totalAmount?: SortOrder
  }

  export type InvoiceScalarRelationFilter = {
    is?: InvoiceWhereInput
    isNot?: InvoiceWhereInput
  }

  export type InvoiceLineItemCountOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    totalPrice?: SortOrder
  }

  export type InvoiceLineItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    totalPrice?: SortOrder
  }

  export type InvoiceLineItemMaxOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    totalPrice?: SortOrder
  }

  export type InvoiceLineItemMinOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    totalPrice?: SortOrder
  }

  export type InvoiceLineItemSumOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    totalPrice?: SortOrder
  }

  export type PaymentCountOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    stripePaymentIntentId?: SortOrder
    status?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type PaymentAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    stripePaymentIntentId?: SortOrder
    status?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type PaymentMinOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    stripePaymentIntentId?: SortOrder
    status?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type PaymentSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    resourceType?: SortOrder
    resourceId?: SortOrder
    details?: SortOrder
    timestamp?: SortOrder
    deletedAt?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    resourceType?: SortOrder
    resourceId?: SortOrder
    details?: SortOrder
    timestamp?: SortOrder
    deletedAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    resourceType?: SortOrder
    resourceId?: SortOrder
    details?: SortOrder
    timestamp?: SortOrder
    deletedAt?: SortOrder
  }

  export type TenantUserMembershipCreateNestedManyWithoutTenantInput = {
    create?: XOR<TenantUserMembershipCreateWithoutTenantInput, TenantUserMembershipUncheckedCreateWithoutTenantInput> | TenantUserMembershipCreateWithoutTenantInput[] | TenantUserMembershipUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantUserMembershipCreateOrConnectWithoutTenantInput | TenantUserMembershipCreateOrConnectWithoutTenantInput[]
    createMany?: TenantUserMembershipCreateManyTenantInputEnvelope
    connect?: TenantUserMembershipWhereUniqueInput | TenantUserMembershipWhereUniqueInput[]
  }

  export type WrapCreateNestedManyWithoutTenantInput = {
    create?: XOR<WrapCreateWithoutTenantInput, WrapUncheckedCreateWithoutTenantInput> | WrapCreateWithoutTenantInput[] | WrapUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: WrapCreateOrConnectWithoutTenantInput | WrapCreateOrConnectWithoutTenantInput[]
    createMany?: WrapCreateManyTenantInputEnvelope
    connect?: WrapWhereUniqueInput | WrapWhereUniqueInput[]
  }

  export type WrapCategoryCreateNestedManyWithoutTenantInput = {
    create?: XOR<WrapCategoryCreateWithoutTenantInput, WrapCategoryUncheckedCreateWithoutTenantInput> | WrapCategoryCreateWithoutTenantInput[] | WrapCategoryUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: WrapCategoryCreateOrConnectWithoutTenantInput | WrapCategoryCreateOrConnectWithoutTenantInput[]
    createMany?: WrapCategoryCreateManyTenantInputEnvelope
    connect?: WrapCategoryWhereUniqueInput | WrapCategoryWhereUniqueInput[]
  }

  export type AvailabilityRuleCreateNestedManyWithoutTenantInput = {
    create?: XOR<AvailabilityRuleCreateWithoutTenantInput, AvailabilityRuleUncheckedCreateWithoutTenantInput> | AvailabilityRuleCreateWithoutTenantInput[] | AvailabilityRuleUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AvailabilityRuleCreateOrConnectWithoutTenantInput | AvailabilityRuleCreateOrConnectWithoutTenantInput[]
    createMany?: AvailabilityRuleCreateManyTenantInputEnvelope
    connect?: AvailabilityRuleWhereUniqueInput | AvailabilityRuleWhereUniqueInput[]
  }

  export type BookingCreateNestedManyWithoutTenantInput = {
    create?: XOR<BookingCreateWithoutTenantInput, BookingUncheckedCreateWithoutTenantInput> | BookingCreateWithoutTenantInput[] | BookingUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutTenantInput | BookingCreateOrConnectWithoutTenantInput[]
    createMany?: BookingCreateManyTenantInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type VisualizerPreviewCreateNestedManyWithoutTenantInput = {
    create?: XOR<VisualizerPreviewCreateWithoutTenantInput, VisualizerPreviewUncheckedCreateWithoutTenantInput> | VisualizerPreviewCreateWithoutTenantInput[] | VisualizerPreviewUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: VisualizerPreviewCreateOrConnectWithoutTenantInput | VisualizerPreviewCreateOrConnectWithoutTenantInput[]
    createMany?: VisualizerPreviewCreateManyTenantInputEnvelope
    connect?: VisualizerPreviewWhereUniqueInput | VisualizerPreviewWhereUniqueInput[]
  }

  export type InvoiceCreateNestedManyWithoutTenantInput = {
    create?: XOR<InvoiceCreateWithoutTenantInput, InvoiceUncheckedCreateWithoutTenantInput> | InvoiceCreateWithoutTenantInput[] | InvoiceUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutTenantInput | InvoiceCreateOrConnectWithoutTenantInput[]
    createMany?: InvoiceCreateManyTenantInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutTenantInput = {
    create?: XOR<AuditLogCreateWithoutTenantInput, AuditLogUncheckedCreateWithoutTenantInput> | AuditLogCreateWithoutTenantInput[] | AuditLogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutTenantInput | AuditLogCreateOrConnectWithoutTenantInput[]
    createMany?: AuditLogCreateManyTenantInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type TenantUserMembershipUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<TenantUserMembershipCreateWithoutTenantInput, TenantUserMembershipUncheckedCreateWithoutTenantInput> | TenantUserMembershipCreateWithoutTenantInput[] | TenantUserMembershipUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantUserMembershipCreateOrConnectWithoutTenantInput | TenantUserMembershipCreateOrConnectWithoutTenantInput[]
    createMany?: TenantUserMembershipCreateManyTenantInputEnvelope
    connect?: TenantUserMembershipWhereUniqueInput | TenantUserMembershipWhereUniqueInput[]
  }

  export type WrapUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<WrapCreateWithoutTenantInput, WrapUncheckedCreateWithoutTenantInput> | WrapCreateWithoutTenantInput[] | WrapUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: WrapCreateOrConnectWithoutTenantInput | WrapCreateOrConnectWithoutTenantInput[]
    createMany?: WrapCreateManyTenantInputEnvelope
    connect?: WrapWhereUniqueInput | WrapWhereUniqueInput[]
  }

  export type WrapCategoryUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<WrapCategoryCreateWithoutTenantInput, WrapCategoryUncheckedCreateWithoutTenantInput> | WrapCategoryCreateWithoutTenantInput[] | WrapCategoryUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: WrapCategoryCreateOrConnectWithoutTenantInput | WrapCategoryCreateOrConnectWithoutTenantInput[]
    createMany?: WrapCategoryCreateManyTenantInputEnvelope
    connect?: WrapCategoryWhereUniqueInput | WrapCategoryWhereUniqueInput[]
  }

  export type AvailabilityRuleUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<AvailabilityRuleCreateWithoutTenantInput, AvailabilityRuleUncheckedCreateWithoutTenantInput> | AvailabilityRuleCreateWithoutTenantInput[] | AvailabilityRuleUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AvailabilityRuleCreateOrConnectWithoutTenantInput | AvailabilityRuleCreateOrConnectWithoutTenantInput[]
    createMany?: AvailabilityRuleCreateManyTenantInputEnvelope
    connect?: AvailabilityRuleWhereUniqueInput | AvailabilityRuleWhereUniqueInput[]
  }

  export type BookingUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<BookingCreateWithoutTenantInput, BookingUncheckedCreateWithoutTenantInput> | BookingCreateWithoutTenantInput[] | BookingUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutTenantInput | BookingCreateOrConnectWithoutTenantInput[]
    createMany?: BookingCreateManyTenantInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type VisualizerPreviewUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<VisualizerPreviewCreateWithoutTenantInput, VisualizerPreviewUncheckedCreateWithoutTenantInput> | VisualizerPreviewCreateWithoutTenantInput[] | VisualizerPreviewUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: VisualizerPreviewCreateOrConnectWithoutTenantInput | VisualizerPreviewCreateOrConnectWithoutTenantInput[]
    createMany?: VisualizerPreviewCreateManyTenantInputEnvelope
    connect?: VisualizerPreviewWhereUniqueInput | VisualizerPreviewWhereUniqueInput[]
  }

  export type InvoiceUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<InvoiceCreateWithoutTenantInput, InvoiceUncheckedCreateWithoutTenantInput> | InvoiceCreateWithoutTenantInput[] | InvoiceUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutTenantInput | InvoiceCreateOrConnectWithoutTenantInput[]
    createMany?: InvoiceCreateManyTenantInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<AuditLogCreateWithoutTenantInput, AuditLogUncheckedCreateWithoutTenantInput> | AuditLogCreateWithoutTenantInput[] | AuditLogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutTenantInput | AuditLogCreateOrConnectWithoutTenantInput[]
    createMany?: AuditLogCreateManyTenantInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type TenantUserMembershipUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TenantUserMembershipCreateWithoutTenantInput, TenantUserMembershipUncheckedCreateWithoutTenantInput> | TenantUserMembershipCreateWithoutTenantInput[] | TenantUserMembershipUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantUserMembershipCreateOrConnectWithoutTenantInput | TenantUserMembershipCreateOrConnectWithoutTenantInput[]
    upsert?: TenantUserMembershipUpsertWithWhereUniqueWithoutTenantInput | TenantUserMembershipUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TenantUserMembershipCreateManyTenantInputEnvelope
    set?: TenantUserMembershipWhereUniqueInput | TenantUserMembershipWhereUniqueInput[]
    disconnect?: TenantUserMembershipWhereUniqueInput | TenantUserMembershipWhereUniqueInput[]
    delete?: TenantUserMembershipWhereUniqueInput | TenantUserMembershipWhereUniqueInput[]
    connect?: TenantUserMembershipWhereUniqueInput | TenantUserMembershipWhereUniqueInput[]
    update?: TenantUserMembershipUpdateWithWhereUniqueWithoutTenantInput | TenantUserMembershipUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TenantUserMembershipUpdateManyWithWhereWithoutTenantInput | TenantUserMembershipUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TenantUserMembershipScalarWhereInput | TenantUserMembershipScalarWhereInput[]
  }

  export type WrapUpdateManyWithoutTenantNestedInput = {
    create?: XOR<WrapCreateWithoutTenantInput, WrapUncheckedCreateWithoutTenantInput> | WrapCreateWithoutTenantInput[] | WrapUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: WrapCreateOrConnectWithoutTenantInput | WrapCreateOrConnectWithoutTenantInput[]
    upsert?: WrapUpsertWithWhereUniqueWithoutTenantInput | WrapUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: WrapCreateManyTenantInputEnvelope
    set?: WrapWhereUniqueInput | WrapWhereUniqueInput[]
    disconnect?: WrapWhereUniqueInput | WrapWhereUniqueInput[]
    delete?: WrapWhereUniqueInput | WrapWhereUniqueInput[]
    connect?: WrapWhereUniqueInput | WrapWhereUniqueInput[]
    update?: WrapUpdateWithWhereUniqueWithoutTenantInput | WrapUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: WrapUpdateManyWithWhereWithoutTenantInput | WrapUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: WrapScalarWhereInput | WrapScalarWhereInput[]
  }

  export type WrapCategoryUpdateManyWithoutTenantNestedInput = {
    create?: XOR<WrapCategoryCreateWithoutTenantInput, WrapCategoryUncheckedCreateWithoutTenantInput> | WrapCategoryCreateWithoutTenantInput[] | WrapCategoryUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: WrapCategoryCreateOrConnectWithoutTenantInput | WrapCategoryCreateOrConnectWithoutTenantInput[]
    upsert?: WrapCategoryUpsertWithWhereUniqueWithoutTenantInput | WrapCategoryUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: WrapCategoryCreateManyTenantInputEnvelope
    set?: WrapCategoryWhereUniqueInput | WrapCategoryWhereUniqueInput[]
    disconnect?: WrapCategoryWhereUniqueInput | WrapCategoryWhereUniqueInput[]
    delete?: WrapCategoryWhereUniqueInput | WrapCategoryWhereUniqueInput[]
    connect?: WrapCategoryWhereUniqueInput | WrapCategoryWhereUniqueInput[]
    update?: WrapCategoryUpdateWithWhereUniqueWithoutTenantInput | WrapCategoryUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: WrapCategoryUpdateManyWithWhereWithoutTenantInput | WrapCategoryUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: WrapCategoryScalarWhereInput | WrapCategoryScalarWhereInput[]
  }

  export type AvailabilityRuleUpdateManyWithoutTenantNestedInput = {
    create?: XOR<AvailabilityRuleCreateWithoutTenantInput, AvailabilityRuleUncheckedCreateWithoutTenantInput> | AvailabilityRuleCreateWithoutTenantInput[] | AvailabilityRuleUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AvailabilityRuleCreateOrConnectWithoutTenantInput | AvailabilityRuleCreateOrConnectWithoutTenantInput[]
    upsert?: AvailabilityRuleUpsertWithWhereUniqueWithoutTenantInput | AvailabilityRuleUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: AvailabilityRuleCreateManyTenantInputEnvelope
    set?: AvailabilityRuleWhereUniqueInput | AvailabilityRuleWhereUniqueInput[]
    disconnect?: AvailabilityRuleWhereUniqueInput | AvailabilityRuleWhereUniqueInput[]
    delete?: AvailabilityRuleWhereUniqueInput | AvailabilityRuleWhereUniqueInput[]
    connect?: AvailabilityRuleWhereUniqueInput | AvailabilityRuleWhereUniqueInput[]
    update?: AvailabilityRuleUpdateWithWhereUniqueWithoutTenantInput | AvailabilityRuleUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: AvailabilityRuleUpdateManyWithWhereWithoutTenantInput | AvailabilityRuleUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: AvailabilityRuleScalarWhereInput | AvailabilityRuleScalarWhereInput[]
  }

  export type BookingUpdateManyWithoutTenantNestedInput = {
    create?: XOR<BookingCreateWithoutTenantInput, BookingUncheckedCreateWithoutTenantInput> | BookingCreateWithoutTenantInput[] | BookingUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutTenantInput | BookingCreateOrConnectWithoutTenantInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutTenantInput | BookingUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: BookingCreateManyTenantInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutTenantInput | BookingUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutTenantInput | BookingUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type VisualizerPreviewUpdateManyWithoutTenantNestedInput = {
    create?: XOR<VisualizerPreviewCreateWithoutTenantInput, VisualizerPreviewUncheckedCreateWithoutTenantInput> | VisualizerPreviewCreateWithoutTenantInput[] | VisualizerPreviewUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: VisualizerPreviewCreateOrConnectWithoutTenantInput | VisualizerPreviewCreateOrConnectWithoutTenantInput[]
    upsert?: VisualizerPreviewUpsertWithWhereUniqueWithoutTenantInput | VisualizerPreviewUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: VisualizerPreviewCreateManyTenantInputEnvelope
    set?: VisualizerPreviewWhereUniqueInput | VisualizerPreviewWhereUniqueInput[]
    disconnect?: VisualizerPreviewWhereUniqueInput | VisualizerPreviewWhereUniqueInput[]
    delete?: VisualizerPreviewWhereUniqueInput | VisualizerPreviewWhereUniqueInput[]
    connect?: VisualizerPreviewWhereUniqueInput | VisualizerPreviewWhereUniqueInput[]
    update?: VisualizerPreviewUpdateWithWhereUniqueWithoutTenantInput | VisualizerPreviewUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: VisualizerPreviewUpdateManyWithWhereWithoutTenantInput | VisualizerPreviewUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: VisualizerPreviewScalarWhereInput | VisualizerPreviewScalarWhereInput[]
  }

  export type InvoiceUpdateManyWithoutTenantNestedInput = {
    create?: XOR<InvoiceCreateWithoutTenantInput, InvoiceUncheckedCreateWithoutTenantInput> | InvoiceCreateWithoutTenantInput[] | InvoiceUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutTenantInput | InvoiceCreateOrConnectWithoutTenantInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutTenantInput | InvoiceUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: InvoiceCreateManyTenantInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutTenantInput | InvoiceUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutTenantInput | InvoiceUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutTenantNestedInput = {
    create?: XOR<AuditLogCreateWithoutTenantInput, AuditLogUncheckedCreateWithoutTenantInput> | AuditLogCreateWithoutTenantInput[] | AuditLogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutTenantInput | AuditLogCreateOrConnectWithoutTenantInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutTenantInput | AuditLogUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: AuditLogCreateManyTenantInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutTenantInput | AuditLogUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutTenantInput | AuditLogUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type TenantUserMembershipUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TenantUserMembershipCreateWithoutTenantInput, TenantUserMembershipUncheckedCreateWithoutTenantInput> | TenantUserMembershipCreateWithoutTenantInput[] | TenantUserMembershipUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantUserMembershipCreateOrConnectWithoutTenantInput | TenantUserMembershipCreateOrConnectWithoutTenantInput[]
    upsert?: TenantUserMembershipUpsertWithWhereUniqueWithoutTenantInput | TenantUserMembershipUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TenantUserMembershipCreateManyTenantInputEnvelope
    set?: TenantUserMembershipWhereUniqueInput | TenantUserMembershipWhereUniqueInput[]
    disconnect?: TenantUserMembershipWhereUniqueInput | TenantUserMembershipWhereUniqueInput[]
    delete?: TenantUserMembershipWhereUniqueInput | TenantUserMembershipWhereUniqueInput[]
    connect?: TenantUserMembershipWhereUniqueInput | TenantUserMembershipWhereUniqueInput[]
    update?: TenantUserMembershipUpdateWithWhereUniqueWithoutTenantInput | TenantUserMembershipUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TenantUserMembershipUpdateManyWithWhereWithoutTenantInput | TenantUserMembershipUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TenantUserMembershipScalarWhereInput | TenantUserMembershipScalarWhereInput[]
  }

  export type WrapUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<WrapCreateWithoutTenantInput, WrapUncheckedCreateWithoutTenantInput> | WrapCreateWithoutTenantInput[] | WrapUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: WrapCreateOrConnectWithoutTenantInput | WrapCreateOrConnectWithoutTenantInput[]
    upsert?: WrapUpsertWithWhereUniqueWithoutTenantInput | WrapUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: WrapCreateManyTenantInputEnvelope
    set?: WrapWhereUniqueInput | WrapWhereUniqueInput[]
    disconnect?: WrapWhereUniqueInput | WrapWhereUniqueInput[]
    delete?: WrapWhereUniqueInput | WrapWhereUniqueInput[]
    connect?: WrapWhereUniqueInput | WrapWhereUniqueInput[]
    update?: WrapUpdateWithWhereUniqueWithoutTenantInput | WrapUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: WrapUpdateManyWithWhereWithoutTenantInput | WrapUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: WrapScalarWhereInput | WrapScalarWhereInput[]
  }

  export type WrapCategoryUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<WrapCategoryCreateWithoutTenantInput, WrapCategoryUncheckedCreateWithoutTenantInput> | WrapCategoryCreateWithoutTenantInput[] | WrapCategoryUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: WrapCategoryCreateOrConnectWithoutTenantInput | WrapCategoryCreateOrConnectWithoutTenantInput[]
    upsert?: WrapCategoryUpsertWithWhereUniqueWithoutTenantInput | WrapCategoryUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: WrapCategoryCreateManyTenantInputEnvelope
    set?: WrapCategoryWhereUniqueInput | WrapCategoryWhereUniqueInput[]
    disconnect?: WrapCategoryWhereUniqueInput | WrapCategoryWhereUniqueInput[]
    delete?: WrapCategoryWhereUniqueInput | WrapCategoryWhereUniqueInput[]
    connect?: WrapCategoryWhereUniqueInput | WrapCategoryWhereUniqueInput[]
    update?: WrapCategoryUpdateWithWhereUniqueWithoutTenantInput | WrapCategoryUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: WrapCategoryUpdateManyWithWhereWithoutTenantInput | WrapCategoryUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: WrapCategoryScalarWhereInput | WrapCategoryScalarWhereInput[]
  }

  export type AvailabilityRuleUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<AvailabilityRuleCreateWithoutTenantInput, AvailabilityRuleUncheckedCreateWithoutTenantInput> | AvailabilityRuleCreateWithoutTenantInput[] | AvailabilityRuleUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AvailabilityRuleCreateOrConnectWithoutTenantInput | AvailabilityRuleCreateOrConnectWithoutTenantInput[]
    upsert?: AvailabilityRuleUpsertWithWhereUniqueWithoutTenantInput | AvailabilityRuleUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: AvailabilityRuleCreateManyTenantInputEnvelope
    set?: AvailabilityRuleWhereUniqueInput | AvailabilityRuleWhereUniqueInput[]
    disconnect?: AvailabilityRuleWhereUniqueInput | AvailabilityRuleWhereUniqueInput[]
    delete?: AvailabilityRuleWhereUniqueInput | AvailabilityRuleWhereUniqueInput[]
    connect?: AvailabilityRuleWhereUniqueInput | AvailabilityRuleWhereUniqueInput[]
    update?: AvailabilityRuleUpdateWithWhereUniqueWithoutTenantInput | AvailabilityRuleUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: AvailabilityRuleUpdateManyWithWhereWithoutTenantInput | AvailabilityRuleUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: AvailabilityRuleScalarWhereInput | AvailabilityRuleScalarWhereInput[]
  }

  export type BookingUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<BookingCreateWithoutTenantInput, BookingUncheckedCreateWithoutTenantInput> | BookingCreateWithoutTenantInput[] | BookingUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutTenantInput | BookingCreateOrConnectWithoutTenantInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutTenantInput | BookingUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: BookingCreateManyTenantInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutTenantInput | BookingUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutTenantInput | BookingUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type VisualizerPreviewUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<VisualizerPreviewCreateWithoutTenantInput, VisualizerPreviewUncheckedCreateWithoutTenantInput> | VisualizerPreviewCreateWithoutTenantInput[] | VisualizerPreviewUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: VisualizerPreviewCreateOrConnectWithoutTenantInput | VisualizerPreviewCreateOrConnectWithoutTenantInput[]
    upsert?: VisualizerPreviewUpsertWithWhereUniqueWithoutTenantInput | VisualizerPreviewUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: VisualizerPreviewCreateManyTenantInputEnvelope
    set?: VisualizerPreviewWhereUniqueInput | VisualizerPreviewWhereUniqueInput[]
    disconnect?: VisualizerPreviewWhereUniqueInput | VisualizerPreviewWhereUniqueInput[]
    delete?: VisualizerPreviewWhereUniqueInput | VisualizerPreviewWhereUniqueInput[]
    connect?: VisualizerPreviewWhereUniqueInput | VisualizerPreviewWhereUniqueInput[]
    update?: VisualizerPreviewUpdateWithWhereUniqueWithoutTenantInput | VisualizerPreviewUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: VisualizerPreviewUpdateManyWithWhereWithoutTenantInput | VisualizerPreviewUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: VisualizerPreviewScalarWhereInput | VisualizerPreviewScalarWhereInput[]
  }

  export type InvoiceUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<InvoiceCreateWithoutTenantInput, InvoiceUncheckedCreateWithoutTenantInput> | InvoiceCreateWithoutTenantInput[] | InvoiceUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutTenantInput | InvoiceCreateOrConnectWithoutTenantInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutTenantInput | InvoiceUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: InvoiceCreateManyTenantInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutTenantInput | InvoiceUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutTenantInput | InvoiceUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<AuditLogCreateWithoutTenantInput, AuditLogUncheckedCreateWithoutTenantInput> | AuditLogCreateWithoutTenantInput[] | AuditLogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutTenantInput | AuditLogCreateOrConnectWithoutTenantInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutTenantInput | AuditLogUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: AuditLogCreateManyTenantInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutTenantInput | AuditLogUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutTenantInput | AuditLogUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutMembersInput = {
    create?: XOR<TenantCreateWithoutMembersInput, TenantUncheckedCreateWithoutMembersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutMembersInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<TenantCreateWithoutMembersInput, TenantUncheckedCreateWithoutMembersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutMembersInput
    upsert?: TenantUpsertWithoutMembersInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutMembersInput, TenantUpdateWithoutMembersInput>, TenantUncheckedUpdateWithoutMembersInput>
  }

  export type TenantCreateNestedOneWithoutWrapsInput = {
    create?: XOR<TenantCreateWithoutWrapsInput, TenantUncheckedCreateWithoutWrapsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutWrapsInput
    connect?: TenantWhereUniqueInput
  }

  export type WrapImageCreateNestedManyWithoutWrapInput = {
    create?: XOR<WrapImageCreateWithoutWrapInput, WrapImageUncheckedCreateWithoutWrapInput> | WrapImageCreateWithoutWrapInput[] | WrapImageUncheckedCreateWithoutWrapInput[]
    connectOrCreate?: WrapImageCreateOrConnectWithoutWrapInput | WrapImageCreateOrConnectWithoutWrapInput[]
    createMany?: WrapImageCreateManyWrapInputEnvelope
    connect?: WrapImageWhereUniqueInput | WrapImageWhereUniqueInput[]
  }

  export type WrapCategoryMappingCreateNestedManyWithoutWrapInput = {
    create?: XOR<WrapCategoryMappingCreateWithoutWrapInput, WrapCategoryMappingUncheckedCreateWithoutWrapInput> | WrapCategoryMappingCreateWithoutWrapInput[] | WrapCategoryMappingUncheckedCreateWithoutWrapInput[]
    connectOrCreate?: WrapCategoryMappingCreateOrConnectWithoutWrapInput | WrapCategoryMappingCreateOrConnectWithoutWrapInput[]
    createMany?: WrapCategoryMappingCreateManyWrapInputEnvelope
    connect?: WrapCategoryMappingWhereUniqueInput | WrapCategoryMappingWhereUniqueInput[]
  }

  export type BookingCreateNestedManyWithoutWrapInput = {
    create?: XOR<BookingCreateWithoutWrapInput, BookingUncheckedCreateWithoutWrapInput> | BookingCreateWithoutWrapInput[] | BookingUncheckedCreateWithoutWrapInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutWrapInput | BookingCreateOrConnectWithoutWrapInput[]
    createMany?: BookingCreateManyWrapInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type VisualizerPreviewCreateNestedManyWithoutWrapInput = {
    create?: XOR<VisualizerPreviewCreateWithoutWrapInput, VisualizerPreviewUncheckedCreateWithoutWrapInput> | VisualizerPreviewCreateWithoutWrapInput[] | VisualizerPreviewUncheckedCreateWithoutWrapInput[]
    connectOrCreate?: VisualizerPreviewCreateOrConnectWithoutWrapInput | VisualizerPreviewCreateOrConnectWithoutWrapInput[]
    createMany?: VisualizerPreviewCreateManyWrapInputEnvelope
    connect?: VisualizerPreviewWhereUniqueInput | VisualizerPreviewWhereUniqueInput[]
  }

  export type WrapImageUncheckedCreateNestedManyWithoutWrapInput = {
    create?: XOR<WrapImageCreateWithoutWrapInput, WrapImageUncheckedCreateWithoutWrapInput> | WrapImageCreateWithoutWrapInput[] | WrapImageUncheckedCreateWithoutWrapInput[]
    connectOrCreate?: WrapImageCreateOrConnectWithoutWrapInput | WrapImageCreateOrConnectWithoutWrapInput[]
    createMany?: WrapImageCreateManyWrapInputEnvelope
    connect?: WrapImageWhereUniqueInput | WrapImageWhereUniqueInput[]
  }

  export type WrapCategoryMappingUncheckedCreateNestedManyWithoutWrapInput = {
    create?: XOR<WrapCategoryMappingCreateWithoutWrapInput, WrapCategoryMappingUncheckedCreateWithoutWrapInput> | WrapCategoryMappingCreateWithoutWrapInput[] | WrapCategoryMappingUncheckedCreateWithoutWrapInput[]
    connectOrCreate?: WrapCategoryMappingCreateOrConnectWithoutWrapInput | WrapCategoryMappingCreateOrConnectWithoutWrapInput[]
    createMany?: WrapCategoryMappingCreateManyWrapInputEnvelope
    connect?: WrapCategoryMappingWhereUniqueInput | WrapCategoryMappingWhereUniqueInput[]
  }

  export type BookingUncheckedCreateNestedManyWithoutWrapInput = {
    create?: XOR<BookingCreateWithoutWrapInput, BookingUncheckedCreateWithoutWrapInput> | BookingCreateWithoutWrapInput[] | BookingUncheckedCreateWithoutWrapInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutWrapInput | BookingCreateOrConnectWithoutWrapInput[]
    createMany?: BookingCreateManyWrapInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type VisualizerPreviewUncheckedCreateNestedManyWithoutWrapInput = {
    create?: XOR<VisualizerPreviewCreateWithoutWrapInput, VisualizerPreviewUncheckedCreateWithoutWrapInput> | VisualizerPreviewCreateWithoutWrapInput[] | VisualizerPreviewUncheckedCreateWithoutWrapInput[]
    connectOrCreate?: VisualizerPreviewCreateOrConnectWithoutWrapInput | VisualizerPreviewCreateOrConnectWithoutWrapInput[]
    createMany?: VisualizerPreviewCreateManyWrapInputEnvelope
    connect?: VisualizerPreviewWhereUniqueInput | VisualizerPreviewWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TenantUpdateOneRequiredWithoutWrapsNestedInput = {
    create?: XOR<TenantCreateWithoutWrapsInput, TenantUncheckedCreateWithoutWrapsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutWrapsInput
    upsert?: TenantUpsertWithoutWrapsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutWrapsInput, TenantUpdateWithoutWrapsInput>, TenantUncheckedUpdateWithoutWrapsInput>
  }

  export type WrapImageUpdateManyWithoutWrapNestedInput = {
    create?: XOR<WrapImageCreateWithoutWrapInput, WrapImageUncheckedCreateWithoutWrapInput> | WrapImageCreateWithoutWrapInput[] | WrapImageUncheckedCreateWithoutWrapInput[]
    connectOrCreate?: WrapImageCreateOrConnectWithoutWrapInput | WrapImageCreateOrConnectWithoutWrapInput[]
    upsert?: WrapImageUpsertWithWhereUniqueWithoutWrapInput | WrapImageUpsertWithWhereUniqueWithoutWrapInput[]
    createMany?: WrapImageCreateManyWrapInputEnvelope
    set?: WrapImageWhereUniqueInput | WrapImageWhereUniqueInput[]
    disconnect?: WrapImageWhereUniqueInput | WrapImageWhereUniqueInput[]
    delete?: WrapImageWhereUniqueInput | WrapImageWhereUniqueInput[]
    connect?: WrapImageWhereUniqueInput | WrapImageWhereUniqueInput[]
    update?: WrapImageUpdateWithWhereUniqueWithoutWrapInput | WrapImageUpdateWithWhereUniqueWithoutWrapInput[]
    updateMany?: WrapImageUpdateManyWithWhereWithoutWrapInput | WrapImageUpdateManyWithWhereWithoutWrapInput[]
    deleteMany?: WrapImageScalarWhereInput | WrapImageScalarWhereInput[]
  }

  export type WrapCategoryMappingUpdateManyWithoutWrapNestedInput = {
    create?: XOR<WrapCategoryMappingCreateWithoutWrapInput, WrapCategoryMappingUncheckedCreateWithoutWrapInput> | WrapCategoryMappingCreateWithoutWrapInput[] | WrapCategoryMappingUncheckedCreateWithoutWrapInput[]
    connectOrCreate?: WrapCategoryMappingCreateOrConnectWithoutWrapInput | WrapCategoryMappingCreateOrConnectWithoutWrapInput[]
    upsert?: WrapCategoryMappingUpsertWithWhereUniqueWithoutWrapInput | WrapCategoryMappingUpsertWithWhereUniqueWithoutWrapInput[]
    createMany?: WrapCategoryMappingCreateManyWrapInputEnvelope
    set?: WrapCategoryMappingWhereUniqueInput | WrapCategoryMappingWhereUniqueInput[]
    disconnect?: WrapCategoryMappingWhereUniqueInput | WrapCategoryMappingWhereUniqueInput[]
    delete?: WrapCategoryMappingWhereUniqueInput | WrapCategoryMappingWhereUniqueInput[]
    connect?: WrapCategoryMappingWhereUniqueInput | WrapCategoryMappingWhereUniqueInput[]
    update?: WrapCategoryMappingUpdateWithWhereUniqueWithoutWrapInput | WrapCategoryMappingUpdateWithWhereUniqueWithoutWrapInput[]
    updateMany?: WrapCategoryMappingUpdateManyWithWhereWithoutWrapInput | WrapCategoryMappingUpdateManyWithWhereWithoutWrapInput[]
    deleteMany?: WrapCategoryMappingScalarWhereInput | WrapCategoryMappingScalarWhereInput[]
  }

  export type BookingUpdateManyWithoutWrapNestedInput = {
    create?: XOR<BookingCreateWithoutWrapInput, BookingUncheckedCreateWithoutWrapInput> | BookingCreateWithoutWrapInput[] | BookingUncheckedCreateWithoutWrapInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutWrapInput | BookingCreateOrConnectWithoutWrapInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutWrapInput | BookingUpsertWithWhereUniqueWithoutWrapInput[]
    createMany?: BookingCreateManyWrapInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutWrapInput | BookingUpdateWithWhereUniqueWithoutWrapInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutWrapInput | BookingUpdateManyWithWhereWithoutWrapInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type VisualizerPreviewUpdateManyWithoutWrapNestedInput = {
    create?: XOR<VisualizerPreviewCreateWithoutWrapInput, VisualizerPreviewUncheckedCreateWithoutWrapInput> | VisualizerPreviewCreateWithoutWrapInput[] | VisualizerPreviewUncheckedCreateWithoutWrapInput[]
    connectOrCreate?: VisualizerPreviewCreateOrConnectWithoutWrapInput | VisualizerPreviewCreateOrConnectWithoutWrapInput[]
    upsert?: VisualizerPreviewUpsertWithWhereUniqueWithoutWrapInput | VisualizerPreviewUpsertWithWhereUniqueWithoutWrapInput[]
    createMany?: VisualizerPreviewCreateManyWrapInputEnvelope
    set?: VisualizerPreviewWhereUniqueInput | VisualizerPreviewWhereUniqueInput[]
    disconnect?: VisualizerPreviewWhereUniqueInput | VisualizerPreviewWhereUniqueInput[]
    delete?: VisualizerPreviewWhereUniqueInput | VisualizerPreviewWhereUniqueInput[]
    connect?: VisualizerPreviewWhereUniqueInput | VisualizerPreviewWhereUniqueInput[]
    update?: VisualizerPreviewUpdateWithWhereUniqueWithoutWrapInput | VisualizerPreviewUpdateWithWhereUniqueWithoutWrapInput[]
    updateMany?: VisualizerPreviewUpdateManyWithWhereWithoutWrapInput | VisualizerPreviewUpdateManyWithWhereWithoutWrapInput[]
    deleteMany?: VisualizerPreviewScalarWhereInput | VisualizerPreviewScalarWhereInput[]
  }

  export type WrapImageUncheckedUpdateManyWithoutWrapNestedInput = {
    create?: XOR<WrapImageCreateWithoutWrapInput, WrapImageUncheckedCreateWithoutWrapInput> | WrapImageCreateWithoutWrapInput[] | WrapImageUncheckedCreateWithoutWrapInput[]
    connectOrCreate?: WrapImageCreateOrConnectWithoutWrapInput | WrapImageCreateOrConnectWithoutWrapInput[]
    upsert?: WrapImageUpsertWithWhereUniqueWithoutWrapInput | WrapImageUpsertWithWhereUniqueWithoutWrapInput[]
    createMany?: WrapImageCreateManyWrapInputEnvelope
    set?: WrapImageWhereUniqueInput | WrapImageWhereUniqueInput[]
    disconnect?: WrapImageWhereUniqueInput | WrapImageWhereUniqueInput[]
    delete?: WrapImageWhereUniqueInput | WrapImageWhereUniqueInput[]
    connect?: WrapImageWhereUniqueInput | WrapImageWhereUniqueInput[]
    update?: WrapImageUpdateWithWhereUniqueWithoutWrapInput | WrapImageUpdateWithWhereUniqueWithoutWrapInput[]
    updateMany?: WrapImageUpdateManyWithWhereWithoutWrapInput | WrapImageUpdateManyWithWhereWithoutWrapInput[]
    deleteMany?: WrapImageScalarWhereInput | WrapImageScalarWhereInput[]
  }

  export type WrapCategoryMappingUncheckedUpdateManyWithoutWrapNestedInput = {
    create?: XOR<WrapCategoryMappingCreateWithoutWrapInput, WrapCategoryMappingUncheckedCreateWithoutWrapInput> | WrapCategoryMappingCreateWithoutWrapInput[] | WrapCategoryMappingUncheckedCreateWithoutWrapInput[]
    connectOrCreate?: WrapCategoryMappingCreateOrConnectWithoutWrapInput | WrapCategoryMappingCreateOrConnectWithoutWrapInput[]
    upsert?: WrapCategoryMappingUpsertWithWhereUniqueWithoutWrapInput | WrapCategoryMappingUpsertWithWhereUniqueWithoutWrapInput[]
    createMany?: WrapCategoryMappingCreateManyWrapInputEnvelope
    set?: WrapCategoryMappingWhereUniqueInput | WrapCategoryMappingWhereUniqueInput[]
    disconnect?: WrapCategoryMappingWhereUniqueInput | WrapCategoryMappingWhereUniqueInput[]
    delete?: WrapCategoryMappingWhereUniqueInput | WrapCategoryMappingWhereUniqueInput[]
    connect?: WrapCategoryMappingWhereUniqueInput | WrapCategoryMappingWhereUniqueInput[]
    update?: WrapCategoryMappingUpdateWithWhereUniqueWithoutWrapInput | WrapCategoryMappingUpdateWithWhereUniqueWithoutWrapInput[]
    updateMany?: WrapCategoryMappingUpdateManyWithWhereWithoutWrapInput | WrapCategoryMappingUpdateManyWithWhereWithoutWrapInput[]
    deleteMany?: WrapCategoryMappingScalarWhereInput | WrapCategoryMappingScalarWhereInput[]
  }

  export type BookingUncheckedUpdateManyWithoutWrapNestedInput = {
    create?: XOR<BookingCreateWithoutWrapInput, BookingUncheckedCreateWithoutWrapInput> | BookingCreateWithoutWrapInput[] | BookingUncheckedCreateWithoutWrapInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutWrapInput | BookingCreateOrConnectWithoutWrapInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutWrapInput | BookingUpsertWithWhereUniqueWithoutWrapInput[]
    createMany?: BookingCreateManyWrapInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutWrapInput | BookingUpdateWithWhereUniqueWithoutWrapInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutWrapInput | BookingUpdateManyWithWhereWithoutWrapInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type VisualizerPreviewUncheckedUpdateManyWithoutWrapNestedInput = {
    create?: XOR<VisualizerPreviewCreateWithoutWrapInput, VisualizerPreviewUncheckedCreateWithoutWrapInput> | VisualizerPreviewCreateWithoutWrapInput[] | VisualizerPreviewUncheckedCreateWithoutWrapInput[]
    connectOrCreate?: VisualizerPreviewCreateOrConnectWithoutWrapInput | VisualizerPreviewCreateOrConnectWithoutWrapInput[]
    upsert?: VisualizerPreviewUpsertWithWhereUniqueWithoutWrapInput | VisualizerPreviewUpsertWithWhereUniqueWithoutWrapInput[]
    createMany?: VisualizerPreviewCreateManyWrapInputEnvelope
    set?: VisualizerPreviewWhereUniqueInput | VisualizerPreviewWhereUniqueInput[]
    disconnect?: VisualizerPreviewWhereUniqueInput | VisualizerPreviewWhereUniqueInput[]
    delete?: VisualizerPreviewWhereUniqueInput | VisualizerPreviewWhereUniqueInput[]
    connect?: VisualizerPreviewWhereUniqueInput | VisualizerPreviewWhereUniqueInput[]
    update?: VisualizerPreviewUpdateWithWhereUniqueWithoutWrapInput | VisualizerPreviewUpdateWithWhereUniqueWithoutWrapInput[]
    updateMany?: VisualizerPreviewUpdateManyWithWhereWithoutWrapInput | VisualizerPreviewUpdateManyWithWhereWithoutWrapInput[]
    deleteMany?: VisualizerPreviewScalarWhereInput | VisualizerPreviewScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutWrapCategoriesInput = {
    create?: XOR<TenantCreateWithoutWrapCategoriesInput, TenantUncheckedCreateWithoutWrapCategoriesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutWrapCategoriesInput
    connect?: TenantWhereUniqueInput
  }

  export type WrapCategoryMappingCreateNestedManyWithoutCategoryInput = {
    create?: XOR<WrapCategoryMappingCreateWithoutCategoryInput, WrapCategoryMappingUncheckedCreateWithoutCategoryInput> | WrapCategoryMappingCreateWithoutCategoryInput[] | WrapCategoryMappingUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: WrapCategoryMappingCreateOrConnectWithoutCategoryInput | WrapCategoryMappingCreateOrConnectWithoutCategoryInput[]
    createMany?: WrapCategoryMappingCreateManyCategoryInputEnvelope
    connect?: WrapCategoryMappingWhereUniqueInput | WrapCategoryMappingWhereUniqueInput[]
  }

  export type WrapCategoryMappingUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<WrapCategoryMappingCreateWithoutCategoryInput, WrapCategoryMappingUncheckedCreateWithoutCategoryInput> | WrapCategoryMappingCreateWithoutCategoryInput[] | WrapCategoryMappingUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: WrapCategoryMappingCreateOrConnectWithoutCategoryInput | WrapCategoryMappingCreateOrConnectWithoutCategoryInput[]
    createMany?: WrapCategoryMappingCreateManyCategoryInputEnvelope
    connect?: WrapCategoryMappingWhereUniqueInput | WrapCategoryMappingWhereUniqueInput[]
  }

  export type TenantUpdateOneRequiredWithoutWrapCategoriesNestedInput = {
    create?: XOR<TenantCreateWithoutWrapCategoriesInput, TenantUncheckedCreateWithoutWrapCategoriesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutWrapCategoriesInput
    upsert?: TenantUpsertWithoutWrapCategoriesInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutWrapCategoriesInput, TenantUpdateWithoutWrapCategoriesInput>, TenantUncheckedUpdateWithoutWrapCategoriesInput>
  }

  export type WrapCategoryMappingUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<WrapCategoryMappingCreateWithoutCategoryInput, WrapCategoryMappingUncheckedCreateWithoutCategoryInput> | WrapCategoryMappingCreateWithoutCategoryInput[] | WrapCategoryMappingUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: WrapCategoryMappingCreateOrConnectWithoutCategoryInput | WrapCategoryMappingCreateOrConnectWithoutCategoryInput[]
    upsert?: WrapCategoryMappingUpsertWithWhereUniqueWithoutCategoryInput | WrapCategoryMappingUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: WrapCategoryMappingCreateManyCategoryInputEnvelope
    set?: WrapCategoryMappingWhereUniqueInput | WrapCategoryMappingWhereUniqueInput[]
    disconnect?: WrapCategoryMappingWhereUniqueInput | WrapCategoryMappingWhereUniqueInput[]
    delete?: WrapCategoryMappingWhereUniqueInput | WrapCategoryMappingWhereUniqueInput[]
    connect?: WrapCategoryMappingWhereUniqueInput | WrapCategoryMappingWhereUniqueInput[]
    update?: WrapCategoryMappingUpdateWithWhereUniqueWithoutCategoryInput | WrapCategoryMappingUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: WrapCategoryMappingUpdateManyWithWhereWithoutCategoryInput | WrapCategoryMappingUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: WrapCategoryMappingScalarWhereInput | WrapCategoryMappingScalarWhereInput[]
  }

  export type WrapCategoryMappingUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<WrapCategoryMappingCreateWithoutCategoryInput, WrapCategoryMappingUncheckedCreateWithoutCategoryInput> | WrapCategoryMappingCreateWithoutCategoryInput[] | WrapCategoryMappingUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: WrapCategoryMappingCreateOrConnectWithoutCategoryInput | WrapCategoryMappingCreateOrConnectWithoutCategoryInput[]
    upsert?: WrapCategoryMappingUpsertWithWhereUniqueWithoutCategoryInput | WrapCategoryMappingUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: WrapCategoryMappingCreateManyCategoryInputEnvelope
    set?: WrapCategoryMappingWhereUniqueInput | WrapCategoryMappingWhereUniqueInput[]
    disconnect?: WrapCategoryMappingWhereUniqueInput | WrapCategoryMappingWhereUniqueInput[]
    delete?: WrapCategoryMappingWhereUniqueInput | WrapCategoryMappingWhereUniqueInput[]
    connect?: WrapCategoryMappingWhereUniqueInput | WrapCategoryMappingWhereUniqueInput[]
    update?: WrapCategoryMappingUpdateWithWhereUniqueWithoutCategoryInput | WrapCategoryMappingUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: WrapCategoryMappingUpdateManyWithWhereWithoutCategoryInput | WrapCategoryMappingUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: WrapCategoryMappingScalarWhereInput | WrapCategoryMappingScalarWhereInput[]
  }

  export type WrapCreateNestedOneWithoutCategoryMappingsInput = {
    create?: XOR<WrapCreateWithoutCategoryMappingsInput, WrapUncheckedCreateWithoutCategoryMappingsInput>
    connectOrCreate?: WrapCreateOrConnectWithoutCategoryMappingsInput
    connect?: WrapWhereUniqueInput
  }

  export type WrapCategoryCreateNestedOneWithoutWrapsInput = {
    create?: XOR<WrapCategoryCreateWithoutWrapsInput, WrapCategoryUncheckedCreateWithoutWrapsInput>
    connectOrCreate?: WrapCategoryCreateOrConnectWithoutWrapsInput
    connect?: WrapCategoryWhereUniqueInput
  }

  export type WrapUpdateOneRequiredWithoutCategoryMappingsNestedInput = {
    create?: XOR<WrapCreateWithoutCategoryMappingsInput, WrapUncheckedCreateWithoutCategoryMappingsInput>
    connectOrCreate?: WrapCreateOrConnectWithoutCategoryMappingsInput
    upsert?: WrapUpsertWithoutCategoryMappingsInput
    connect?: WrapWhereUniqueInput
    update?: XOR<XOR<WrapUpdateToOneWithWhereWithoutCategoryMappingsInput, WrapUpdateWithoutCategoryMappingsInput>, WrapUncheckedUpdateWithoutCategoryMappingsInput>
  }

  export type WrapCategoryUpdateOneRequiredWithoutWrapsNestedInput = {
    create?: XOR<WrapCategoryCreateWithoutWrapsInput, WrapCategoryUncheckedCreateWithoutWrapsInput>
    connectOrCreate?: WrapCategoryCreateOrConnectWithoutWrapsInput
    upsert?: WrapCategoryUpsertWithoutWrapsInput
    connect?: WrapCategoryWhereUniqueInput
    update?: XOR<XOR<WrapCategoryUpdateToOneWithWhereWithoutWrapsInput, WrapCategoryUpdateWithoutWrapsInput>, WrapCategoryUncheckedUpdateWithoutWrapsInput>
  }

  export type WrapCreateNestedOneWithoutImagesInput = {
    create?: XOR<WrapCreateWithoutImagesInput, WrapUncheckedCreateWithoutImagesInput>
    connectOrCreate?: WrapCreateOrConnectWithoutImagesInput
    connect?: WrapWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type WrapUpdateOneRequiredWithoutImagesNestedInput = {
    create?: XOR<WrapCreateWithoutImagesInput, WrapUncheckedCreateWithoutImagesInput>
    connectOrCreate?: WrapCreateOrConnectWithoutImagesInput
    upsert?: WrapUpsertWithoutImagesInput
    connect?: WrapWhereUniqueInput
    update?: XOR<XOR<WrapUpdateToOneWithWhereWithoutImagesInput, WrapUpdateWithoutImagesInput>, WrapUncheckedUpdateWithoutImagesInput>
  }

  export type TenantCreateNestedOneWithoutAvailabilityRulesInput = {
    create?: XOR<TenantCreateWithoutAvailabilityRulesInput, TenantUncheckedCreateWithoutAvailabilityRulesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutAvailabilityRulesInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutAvailabilityRulesNestedInput = {
    create?: XOR<TenantCreateWithoutAvailabilityRulesInput, TenantUncheckedCreateWithoutAvailabilityRulesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutAvailabilityRulesInput
    upsert?: TenantUpsertWithoutAvailabilityRulesInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutAvailabilityRulesInput, TenantUpdateWithoutAvailabilityRulesInput>, TenantUncheckedUpdateWithoutAvailabilityRulesInput>
  }

  export type TenantCreateNestedOneWithoutBookingsInput = {
    create?: XOR<TenantCreateWithoutBookingsInput, TenantUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutBookingsInput
    connect?: TenantWhereUniqueInput
  }

  export type WrapCreateNestedOneWithoutBookingsInput = {
    create?: XOR<WrapCreateWithoutBookingsInput, WrapUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: WrapCreateOrConnectWithoutBookingsInput
    connect?: WrapWhereUniqueInput
  }

  export type BookingReservationCreateNestedOneWithoutBookingInput = {
    create?: XOR<BookingReservationCreateWithoutBookingInput, BookingReservationUncheckedCreateWithoutBookingInput>
    connectOrCreate?: BookingReservationCreateOrConnectWithoutBookingInput
    connect?: BookingReservationWhereUniqueInput
  }

  export type InvoiceCreateNestedOneWithoutBookingInput = {
    create?: XOR<InvoiceCreateWithoutBookingInput, InvoiceUncheckedCreateWithoutBookingInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutBookingInput
    connect?: InvoiceWhereUniqueInput
  }

  export type BookingReservationUncheckedCreateNestedOneWithoutBookingInput = {
    create?: XOR<BookingReservationCreateWithoutBookingInput, BookingReservationUncheckedCreateWithoutBookingInput>
    connectOrCreate?: BookingReservationCreateOrConnectWithoutBookingInput
    connect?: BookingReservationWhereUniqueInput
  }

  export type InvoiceUncheckedCreateNestedOneWithoutBookingInput = {
    create?: XOR<InvoiceCreateWithoutBookingInput, InvoiceUncheckedCreateWithoutBookingInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutBookingInput
    connect?: InvoiceWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutBookingsNestedInput = {
    create?: XOR<TenantCreateWithoutBookingsInput, TenantUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutBookingsInput
    upsert?: TenantUpsertWithoutBookingsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutBookingsInput, TenantUpdateWithoutBookingsInput>, TenantUncheckedUpdateWithoutBookingsInput>
  }

  export type WrapUpdateOneRequiredWithoutBookingsNestedInput = {
    create?: XOR<WrapCreateWithoutBookingsInput, WrapUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: WrapCreateOrConnectWithoutBookingsInput
    upsert?: WrapUpsertWithoutBookingsInput
    connect?: WrapWhereUniqueInput
    update?: XOR<XOR<WrapUpdateToOneWithWhereWithoutBookingsInput, WrapUpdateWithoutBookingsInput>, WrapUncheckedUpdateWithoutBookingsInput>
  }

  export type BookingReservationUpdateOneWithoutBookingNestedInput = {
    create?: XOR<BookingReservationCreateWithoutBookingInput, BookingReservationUncheckedCreateWithoutBookingInput>
    connectOrCreate?: BookingReservationCreateOrConnectWithoutBookingInput
    upsert?: BookingReservationUpsertWithoutBookingInput
    disconnect?: BookingReservationWhereInput | boolean
    delete?: BookingReservationWhereInput | boolean
    connect?: BookingReservationWhereUniqueInput
    update?: XOR<XOR<BookingReservationUpdateToOneWithWhereWithoutBookingInput, BookingReservationUpdateWithoutBookingInput>, BookingReservationUncheckedUpdateWithoutBookingInput>
  }

  export type InvoiceUpdateOneWithoutBookingNestedInput = {
    create?: XOR<InvoiceCreateWithoutBookingInput, InvoiceUncheckedCreateWithoutBookingInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutBookingInput
    upsert?: InvoiceUpsertWithoutBookingInput
    disconnect?: InvoiceWhereInput | boolean
    delete?: InvoiceWhereInput | boolean
    connect?: InvoiceWhereUniqueInput
    update?: XOR<XOR<InvoiceUpdateToOneWithWhereWithoutBookingInput, InvoiceUpdateWithoutBookingInput>, InvoiceUncheckedUpdateWithoutBookingInput>
  }

  export type BookingReservationUncheckedUpdateOneWithoutBookingNestedInput = {
    create?: XOR<BookingReservationCreateWithoutBookingInput, BookingReservationUncheckedCreateWithoutBookingInput>
    connectOrCreate?: BookingReservationCreateOrConnectWithoutBookingInput
    upsert?: BookingReservationUpsertWithoutBookingInput
    disconnect?: BookingReservationWhereInput | boolean
    delete?: BookingReservationWhereInput | boolean
    connect?: BookingReservationWhereUniqueInput
    update?: XOR<XOR<BookingReservationUpdateToOneWithWhereWithoutBookingInput, BookingReservationUpdateWithoutBookingInput>, BookingReservationUncheckedUpdateWithoutBookingInput>
  }

  export type InvoiceUncheckedUpdateOneWithoutBookingNestedInput = {
    create?: XOR<InvoiceCreateWithoutBookingInput, InvoiceUncheckedCreateWithoutBookingInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutBookingInput
    upsert?: InvoiceUpsertWithoutBookingInput
    disconnect?: InvoiceWhereInput | boolean
    delete?: InvoiceWhereInput | boolean
    connect?: InvoiceWhereUniqueInput
    update?: XOR<XOR<InvoiceUpdateToOneWithWhereWithoutBookingInput, InvoiceUpdateWithoutBookingInput>, InvoiceUncheckedUpdateWithoutBookingInput>
  }

  export type BookingCreateNestedOneWithoutReservationInput = {
    create?: XOR<BookingCreateWithoutReservationInput, BookingUncheckedCreateWithoutReservationInput>
    connectOrCreate?: BookingCreateOrConnectWithoutReservationInput
    connect?: BookingWhereUniqueInput
  }

  export type BookingUpdateOneRequiredWithoutReservationNestedInput = {
    create?: XOR<BookingCreateWithoutReservationInput, BookingUncheckedCreateWithoutReservationInput>
    connectOrCreate?: BookingCreateOrConnectWithoutReservationInput
    upsert?: BookingUpsertWithoutReservationInput
    connect?: BookingWhereUniqueInput
    update?: XOR<XOR<BookingUpdateToOneWithWhereWithoutReservationInput, BookingUpdateWithoutReservationInput>, BookingUncheckedUpdateWithoutReservationInput>
  }

  export type TenantCreateNestedOneWithoutPreviewsInput = {
    create?: XOR<TenantCreateWithoutPreviewsInput, TenantUncheckedCreateWithoutPreviewsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutPreviewsInput
    connect?: TenantWhereUniqueInput
  }

  export type WrapCreateNestedOneWithoutPreviewsInput = {
    create?: XOR<WrapCreateWithoutPreviewsInput, WrapUncheckedCreateWithoutPreviewsInput>
    connectOrCreate?: WrapCreateOrConnectWithoutPreviewsInput
    connect?: WrapWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutPreviewsNestedInput = {
    create?: XOR<TenantCreateWithoutPreviewsInput, TenantUncheckedCreateWithoutPreviewsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutPreviewsInput
    upsert?: TenantUpsertWithoutPreviewsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutPreviewsInput, TenantUpdateWithoutPreviewsInput>, TenantUncheckedUpdateWithoutPreviewsInput>
  }

  export type WrapUpdateOneRequiredWithoutPreviewsNestedInput = {
    create?: XOR<WrapCreateWithoutPreviewsInput, WrapUncheckedCreateWithoutPreviewsInput>
    connectOrCreate?: WrapCreateOrConnectWithoutPreviewsInput
    upsert?: WrapUpsertWithoutPreviewsInput
    connect?: WrapWhereUniqueInput
    update?: XOR<XOR<WrapUpdateToOneWithWhereWithoutPreviewsInput, WrapUpdateWithoutPreviewsInput>, WrapUncheckedUpdateWithoutPreviewsInput>
  }

  export type TenantCreateNestedOneWithoutInvoicesInput = {
    create?: XOR<TenantCreateWithoutInvoicesInput, TenantUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutInvoicesInput
    connect?: TenantWhereUniqueInput
  }

  export type BookingCreateNestedOneWithoutInvoiceInput = {
    create?: XOR<BookingCreateWithoutInvoiceInput, BookingUncheckedCreateWithoutInvoiceInput>
    connectOrCreate?: BookingCreateOrConnectWithoutInvoiceInput
    connect?: BookingWhereUniqueInput
  }

  export type InvoiceLineItemCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<InvoiceLineItemCreateWithoutInvoiceInput, InvoiceLineItemUncheckedCreateWithoutInvoiceInput> | InvoiceLineItemCreateWithoutInvoiceInput[] | InvoiceLineItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceLineItemCreateOrConnectWithoutInvoiceInput | InvoiceLineItemCreateOrConnectWithoutInvoiceInput[]
    createMany?: InvoiceLineItemCreateManyInvoiceInputEnvelope
    connect?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
  }

  export type PaymentCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<PaymentCreateWithoutInvoiceInput, PaymentUncheckedCreateWithoutInvoiceInput> | PaymentCreateWithoutInvoiceInput[] | PaymentUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutInvoiceInput | PaymentCreateOrConnectWithoutInvoiceInput[]
    createMany?: PaymentCreateManyInvoiceInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type InvoiceLineItemUncheckedCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<InvoiceLineItemCreateWithoutInvoiceInput, InvoiceLineItemUncheckedCreateWithoutInvoiceInput> | InvoiceLineItemCreateWithoutInvoiceInput[] | InvoiceLineItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceLineItemCreateOrConnectWithoutInvoiceInput | InvoiceLineItemCreateOrConnectWithoutInvoiceInput[]
    createMany?: InvoiceLineItemCreateManyInvoiceInputEnvelope
    connect?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
  }

  export type PaymentUncheckedCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<PaymentCreateWithoutInvoiceInput, PaymentUncheckedCreateWithoutInvoiceInput> | PaymentCreateWithoutInvoiceInput[] | PaymentUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutInvoiceInput | PaymentCreateOrConnectWithoutInvoiceInput[]
    createMany?: PaymentCreateManyInvoiceInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type TenantUpdateOneRequiredWithoutInvoicesNestedInput = {
    create?: XOR<TenantCreateWithoutInvoicesInput, TenantUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutInvoicesInput
    upsert?: TenantUpsertWithoutInvoicesInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutInvoicesInput, TenantUpdateWithoutInvoicesInput>, TenantUncheckedUpdateWithoutInvoicesInput>
  }

  export type BookingUpdateOneRequiredWithoutInvoiceNestedInput = {
    create?: XOR<BookingCreateWithoutInvoiceInput, BookingUncheckedCreateWithoutInvoiceInput>
    connectOrCreate?: BookingCreateOrConnectWithoutInvoiceInput
    upsert?: BookingUpsertWithoutInvoiceInput
    connect?: BookingWhereUniqueInput
    update?: XOR<XOR<BookingUpdateToOneWithWhereWithoutInvoiceInput, BookingUpdateWithoutInvoiceInput>, BookingUncheckedUpdateWithoutInvoiceInput>
  }

  export type InvoiceLineItemUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<InvoiceLineItemCreateWithoutInvoiceInput, InvoiceLineItemUncheckedCreateWithoutInvoiceInput> | InvoiceLineItemCreateWithoutInvoiceInput[] | InvoiceLineItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceLineItemCreateOrConnectWithoutInvoiceInput | InvoiceLineItemCreateOrConnectWithoutInvoiceInput[]
    upsert?: InvoiceLineItemUpsertWithWhereUniqueWithoutInvoiceInput | InvoiceLineItemUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: InvoiceLineItemCreateManyInvoiceInputEnvelope
    set?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    disconnect?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    delete?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    connect?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    update?: InvoiceLineItemUpdateWithWhereUniqueWithoutInvoiceInput | InvoiceLineItemUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: InvoiceLineItemUpdateManyWithWhereWithoutInvoiceInput | InvoiceLineItemUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: InvoiceLineItemScalarWhereInput | InvoiceLineItemScalarWhereInput[]
  }

  export type PaymentUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<PaymentCreateWithoutInvoiceInput, PaymentUncheckedCreateWithoutInvoiceInput> | PaymentCreateWithoutInvoiceInput[] | PaymentUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutInvoiceInput | PaymentCreateOrConnectWithoutInvoiceInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutInvoiceInput | PaymentUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: PaymentCreateManyInvoiceInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutInvoiceInput | PaymentUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutInvoiceInput | PaymentUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type InvoiceLineItemUncheckedUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<InvoiceLineItemCreateWithoutInvoiceInput, InvoiceLineItemUncheckedCreateWithoutInvoiceInput> | InvoiceLineItemCreateWithoutInvoiceInput[] | InvoiceLineItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceLineItemCreateOrConnectWithoutInvoiceInput | InvoiceLineItemCreateOrConnectWithoutInvoiceInput[]
    upsert?: InvoiceLineItemUpsertWithWhereUniqueWithoutInvoiceInput | InvoiceLineItemUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: InvoiceLineItemCreateManyInvoiceInputEnvelope
    set?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    disconnect?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    delete?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    connect?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    update?: InvoiceLineItemUpdateWithWhereUniqueWithoutInvoiceInput | InvoiceLineItemUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: InvoiceLineItemUpdateManyWithWhereWithoutInvoiceInput | InvoiceLineItemUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: InvoiceLineItemScalarWhereInput | InvoiceLineItemScalarWhereInput[]
  }

  export type PaymentUncheckedUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<PaymentCreateWithoutInvoiceInput, PaymentUncheckedCreateWithoutInvoiceInput> | PaymentCreateWithoutInvoiceInput[] | PaymentUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutInvoiceInput | PaymentCreateOrConnectWithoutInvoiceInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutInvoiceInput | PaymentUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: PaymentCreateManyInvoiceInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutInvoiceInput | PaymentUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutInvoiceInput | PaymentUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type InvoiceCreateNestedOneWithoutLineItemsInput = {
    create?: XOR<InvoiceCreateWithoutLineItemsInput, InvoiceUncheckedCreateWithoutLineItemsInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutLineItemsInput
    connect?: InvoiceWhereUniqueInput
  }

  export type InvoiceUpdateOneRequiredWithoutLineItemsNestedInput = {
    create?: XOR<InvoiceCreateWithoutLineItemsInput, InvoiceUncheckedCreateWithoutLineItemsInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutLineItemsInput
    upsert?: InvoiceUpsertWithoutLineItemsInput
    connect?: InvoiceWhereUniqueInput
    update?: XOR<XOR<InvoiceUpdateToOneWithWhereWithoutLineItemsInput, InvoiceUpdateWithoutLineItemsInput>, InvoiceUncheckedUpdateWithoutLineItemsInput>
  }

  export type InvoiceCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<InvoiceCreateWithoutPaymentsInput, InvoiceUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutPaymentsInput
    connect?: InvoiceWhereUniqueInput
  }

  export type InvoiceUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: XOR<InvoiceCreateWithoutPaymentsInput, InvoiceUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutPaymentsInput
    upsert?: InvoiceUpsertWithoutPaymentsInput
    connect?: InvoiceWhereUniqueInput
    update?: XOR<XOR<InvoiceUpdateToOneWithWhereWithoutPaymentsInput, InvoiceUpdateWithoutPaymentsInput>, InvoiceUncheckedUpdateWithoutPaymentsInput>
  }

  export type TenantCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<TenantCreateWithoutAuditLogsInput, TenantUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutAuditLogsInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutAuditLogsNestedInput = {
    create?: XOR<TenantCreateWithoutAuditLogsInput, TenantUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutAuditLogsInput
    upsert?: TenantUpsertWithoutAuditLogsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutAuditLogsInput, TenantUpdateWithoutAuditLogsInput>, TenantUncheckedUpdateWithoutAuditLogsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type TenantUserMembershipCreateWithoutTenantInput = {
    id?: string
    userId: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type TenantUserMembershipUncheckedCreateWithoutTenantInput = {
    id?: string
    userId: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type TenantUserMembershipCreateOrConnectWithoutTenantInput = {
    where: TenantUserMembershipWhereUniqueInput
    create: XOR<TenantUserMembershipCreateWithoutTenantInput, TenantUserMembershipUncheckedCreateWithoutTenantInput>
  }

  export type TenantUserMembershipCreateManyTenantInputEnvelope = {
    data: TenantUserMembershipCreateManyTenantInput | TenantUserMembershipCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type WrapCreateWithoutTenantInput = {
    id?: string
    name: string
    description?: string | null
    price: number
    installationMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    images?: WrapImageCreateNestedManyWithoutWrapInput
    categoryMappings?: WrapCategoryMappingCreateNestedManyWithoutWrapInput
    bookings?: BookingCreateNestedManyWithoutWrapInput
    previews?: VisualizerPreviewCreateNestedManyWithoutWrapInput
  }

  export type WrapUncheckedCreateWithoutTenantInput = {
    id?: string
    name: string
    description?: string | null
    price: number
    installationMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    images?: WrapImageUncheckedCreateNestedManyWithoutWrapInput
    categoryMappings?: WrapCategoryMappingUncheckedCreateNestedManyWithoutWrapInput
    bookings?: BookingUncheckedCreateNestedManyWithoutWrapInput
    previews?: VisualizerPreviewUncheckedCreateNestedManyWithoutWrapInput
  }

  export type WrapCreateOrConnectWithoutTenantInput = {
    where: WrapWhereUniqueInput
    create: XOR<WrapCreateWithoutTenantInput, WrapUncheckedCreateWithoutTenantInput>
  }

  export type WrapCreateManyTenantInputEnvelope = {
    data: WrapCreateManyTenantInput | WrapCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type WrapCategoryCreateWithoutTenantInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    wraps?: WrapCategoryMappingCreateNestedManyWithoutCategoryInput
  }

  export type WrapCategoryUncheckedCreateWithoutTenantInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    wraps?: WrapCategoryMappingUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type WrapCategoryCreateOrConnectWithoutTenantInput = {
    where: WrapCategoryWhereUniqueInput
    create: XOR<WrapCategoryCreateWithoutTenantInput, WrapCategoryUncheckedCreateWithoutTenantInput>
  }

  export type WrapCategoryCreateManyTenantInputEnvelope = {
    data: WrapCategoryCreateManyTenantInput | WrapCategoryCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type AvailabilityRuleCreateWithoutTenantInput = {
    id?: string
    dayOfWeek: number
    startTime: string
    endTime: string
    capacitySlots: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type AvailabilityRuleUncheckedCreateWithoutTenantInput = {
    id?: string
    dayOfWeek: number
    startTime: string
    endTime: string
    capacitySlots: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type AvailabilityRuleCreateOrConnectWithoutTenantInput = {
    where: AvailabilityRuleWhereUniqueInput
    create: XOR<AvailabilityRuleCreateWithoutTenantInput, AvailabilityRuleUncheckedCreateWithoutTenantInput>
  }

  export type AvailabilityRuleCreateManyTenantInputEnvelope = {
    data: AvailabilityRuleCreateManyTenantInput | AvailabilityRuleCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type BookingCreateWithoutTenantInput = {
    id?: string
    customerId: string
    startTime: Date | string
    endTime: Date | string
    status?: string
    totalPrice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    wrap: WrapCreateNestedOneWithoutBookingsInput
    reservation?: BookingReservationCreateNestedOneWithoutBookingInput
    invoice?: InvoiceCreateNestedOneWithoutBookingInput
  }

  export type BookingUncheckedCreateWithoutTenantInput = {
    id?: string
    customerId: string
    wrapId: string
    startTime: Date | string
    endTime: Date | string
    status?: string
    totalPrice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    reservation?: BookingReservationUncheckedCreateNestedOneWithoutBookingInput
    invoice?: InvoiceUncheckedCreateNestedOneWithoutBookingInput
  }

  export type BookingCreateOrConnectWithoutTenantInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutTenantInput, BookingUncheckedCreateWithoutTenantInput>
  }

  export type BookingCreateManyTenantInputEnvelope = {
    data: BookingCreateManyTenantInput | BookingCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type VisualizerPreviewCreateWithoutTenantInput = {
    id?: string
    customerPhotoUrl: string
    processedImageUrl?: string | null
    status?: string
    cacheKey: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    wrap: WrapCreateNestedOneWithoutPreviewsInput
  }

  export type VisualizerPreviewUncheckedCreateWithoutTenantInput = {
    id?: string
    wrapId: string
    customerPhotoUrl: string
    processedImageUrl?: string | null
    status?: string
    cacheKey: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type VisualizerPreviewCreateOrConnectWithoutTenantInput = {
    where: VisualizerPreviewWhereUniqueInput
    create: XOR<VisualizerPreviewCreateWithoutTenantInput, VisualizerPreviewUncheckedCreateWithoutTenantInput>
  }

  export type VisualizerPreviewCreateManyTenantInputEnvelope = {
    data: VisualizerPreviewCreateManyTenantInput | VisualizerPreviewCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type InvoiceCreateWithoutTenantInput = {
    id?: string
    status?: string
    totalAmount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    booking: BookingCreateNestedOneWithoutInvoiceInput
    lineItems?: InvoiceLineItemCreateNestedManyWithoutInvoiceInput
    payments?: PaymentCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUncheckedCreateWithoutTenantInput = {
    id?: string
    bookingId: string
    status?: string
    totalAmount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    lineItems?: InvoiceLineItemUncheckedCreateNestedManyWithoutInvoiceInput
    payments?: PaymentUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceCreateOrConnectWithoutTenantInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutTenantInput, InvoiceUncheckedCreateWithoutTenantInput>
  }

  export type InvoiceCreateManyTenantInputEnvelope = {
    data: InvoiceCreateManyTenantInput | InvoiceCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type AuditLogCreateWithoutTenantInput = {
    id?: string
    userId: string
    action: string
    resourceType: string
    resourceId: string
    details?: string | null
    timestamp?: Date | string
    deletedAt?: Date | string | null
  }

  export type AuditLogUncheckedCreateWithoutTenantInput = {
    id?: string
    userId: string
    action: string
    resourceType: string
    resourceId: string
    details?: string | null
    timestamp?: Date | string
    deletedAt?: Date | string | null
  }

  export type AuditLogCreateOrConnectWithoutTenantInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutTenantInput, AuditLogUncheckedCreateWithoutTenantInput>
  }

  export type AuditLogCreateManyTenantInputEnvelope = {
    data: AuditLogCreateManyTenantInput | AuditLogCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type TenantUserMembershipUpsertWithWhereUniqueWithoutTenantInput = {
    where: TenantUserMembershipWhereUniqueInput
    update: XOR<TenantUserMembershipUpdateWithoutTenantInput, TenantUserMembershipUncheckedUpdateWithoutTenantInput>
    create: XOR<TenantUserMembershipCreateWithoutTenantInput, TenantUserMembershipUncheckedCreateWithoutTenantInput>
  }

  export type TenantUserMembershipUpdateWithWhereUniqueWithoutTenantInput = {
    where: TenantUserMembershipWhereUniqueInput
    data: XOR<TenantUserMembershipUpdateWithoutTenantInput, TenantUserMembershipUncheckedUpdateWithoutTenantInput>
  }

  export type TenantUserMembershipUpdateManyWithWhereWithoutTenantInput = {
    where: TenantUserMembershipScalarWhereInput
    data: XOR<TenantUserMembershipUpdateManyMutationInput, TenantUserMembershipUncheckedUpdateManyWithoutTenantInput>
  }

  export type TenantUserMembershipScalarWhereInput = {
    AND?: TenantUserMembershipScalarWhereInput | TenantUserMembershipScalarWhereInput[]
    OR?: TenantUserMembershipScalarWhereInput[]
    NOT?: TenantUserMembershipScalarWhereInput | TenantUserMembershipScalarWhereInput[]
    id?: StringFilter<"TenantUserMembership"> | string
    tenantId?: StringFilter<"TenantUserMembership"> | string
    userId?: StringFilter<"TenantUserMembership"> | string
    role?: StringFilter<"TenantUserMembership"> | string
    createdAt?: DateTimeFilter<"TenantUserMembership"> | Date | string
    updatedAt?: DateTimeFilter<"TenantUserMembership"> | Date | string
    deletedAt?: DateTimeNullableFilter<"TenantUserMembership"> | Date | string | null
  }

  export type WrapUpsertWithWhereUniqueWithoutTenantInput = {
    where: WrapWhereUniqueInput
    update: XOR<WrapUpdateWithoutTenantInput, WrapUncheckedUpdateWithoutTenantInput>
    create: XOR<WrapCreateWithoutTenantInput, WrapUncheckedCreateWithoutTenantInput>
  }

  export type WrapUpdateWithWhereUniqueWithoutTenantInput = {
    where: WrapWhereUniqueInput
    data: XOR<WrapUpdateWithoutTenantInput, WrapUncheckedUpdateWithoutTenantInput>
  }

  export type WrapUpdateManyWithWhereWithoutTenantInput = {
    where: WrapScalarWhereInput
    data: XOR<WrapUpdateManyMutationInput, WrapUncheckedUpdateManyWithoutTenantInput>
  }

  export type WrapScalarWhereInput = {
    AND?: WrapScalarWhereInput | WrapScalarWhereInput[]
    OR?: WrapScalarWhereInput[]
    NOT?: WrapScalarWhereInput | WrapScalarWhereInput[]
    id?: StringFilter<"Wrap"> | string
    tenantId?: StringFilter<"Wrap"> | string
    name?: StringFilter<"Wrap"> | string
    description?: StringNullableFilter<"Wrap"> | string | null
    price?: FloatFilter<"Wrap"> | number
    installationMinutes?: IntNullableFilter<"Wrap"> | number | null
    createdAt?: DateTimeFilter<"Wrap"> | Date | string
    updatedAt?: DateTimeFilter<"Wrap"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Wrap"> | Date | string | null
  }

  export type WrapCategoryUpsertWithWhereUniqueWithoutTenantInput = {
    where: WrapCategoryWhereUniqueInput
    update: XOR<WrapCategoryUpdateWithoutTenantInput, WrapCategoryUncheckedUpdateWithoutTenantInput>
    create: XOR<WrapCategoryCreateWithoutTenantInput, WrapCategoryUncheckedCreateWithoutTenantInput>
  }

  export type WrapCategoryUpdateWithWhereUniqueWithoutTenantInput = {
    where: WrapCategoryWhereUniqueInput
    data: XOR<WrapCategoryUpdateWithoutTenantInput, WrapCategoryUncheckedUpdateWithoutTenantInput>
  }

  export type WrapCategoryUpdateManyWithWhereWithoutTenantInput = {
    where: WrapCategoryScalarWhereInput
    data: XOR<WrapCategoryUpdateManyMutationInput, WrapCategoryUncheckedUpdateManyWithoutTenantInput>
  }

  export type WrapCategoryScalarWhereInput = {
    AND?: WrapCategoryScalarWhereInput | WrapCategoryScalarWhereInput[]
    OR?: WrapCategoryScalarWhereInput[]
    NOT?: WrapCategoryScalarWhereInput | WrapCategoryScalarWhereInput[]
    id?: StringFilter<"WrapCategory"> | string
    tenantId?: StringFilter<"WrapCategory"> | string
    name?: StringFilter<"WrapCategory"> | string
    slug?: StringFilter<"WrapCategory"> | string
    createdAt?: DateTimeFilter<"WrapCategory"> | Date | string
    updatedAt?: DateTimeFilter<"WrapCategory"> | Date | string
    deletedAt?: DateTimeNullableFilter<"WrapCategory"> | Date | string | null
  }

  export type AvailabilityRuleUpsertWithWhereUniqueWithoutTenantInput = {
    where: AvailabilityRuleWhereUniqueInput
    update: XOR<AvailabilityRuleUpdateWithoutTenantInput, AvailabilityRuleUncheckedUpdateWithoutTenantInput>
    create: XOR<AvailabilityRuleCreateWithoutTenantInput, AvailabilityRuleUncheckedCreateWithoutTenantInput>
  }

  export type AvailabilityRuleUpdateWithWhereUniqueWithoutTenantInput = {
    where: AvailabilityRuleWhereUniqueInput
    data: XOR<AvailabilityRuleUpdateWithoutTenantInput, AvailabilityRuleUncheckedUpdateWithoutTenantInput>
  }

  export type AvailabilityRuleUpdateManyWithWhereWithoutTenantInput = {
    where: AvailabilityRuleScalarWhereInput
    data: XOR<AvailabilityRuleUpdateManyMutationInput, AvailabilityRuleUncheckedUpdateManyWithoutTenantInput>
  }

  export type AvailabilityRuleScalarWhereInput = {
    AND?: AvailabilityRuleScalarWhereInput | AvailabilityRuleScalarWhereInput[]
    OR?: AvailabilityRuleScalarWhereInput[]
    NOT?: AvailabilityRuleScalarWhereInput | AvailabilityRuleScalarWhereInput[]
    id?: StringFilter<"AvailabilityRule"> | string
    tenantId?: StringFilter<"AvailabilityRule"> | string
    dayOfWeek?: IntFilter<"AvailabilityRule"> | number
    startTime?: StringFilter<"AvailabilityRule"> | string
    endTime?: StringFilter<"AvailabilityRule"> | string
    capacitySlots?: IntFilter<"AvailabilityRule"> | number
    createdAt?: DateTimeFilter<"AvailabilityRule"> | Date | string
    updatedAt?: DateTimeFilter<"AvailabilityRule"> | Date | string
    deletedAt?: DateTimeNullableFilter<"AvailabilityRule"> | Date | string | null
  }

  export type BookingUpsertWithWhereUniqueWithoutTenantInput = {
    where: BookingWhereUniqueInput
    update: XOR<BookingUpdateWithoutTenantInput, BookingUncheckedUpdateWithoutTenantInput>
    create: XOR<BookingCreateWithoutTenantInput, BookingUncheckedCreateWithoutTenantInput>
  }

  export type BookingUpdateWithWhereUniqueWithoutTenantInput = {
    where: BookingWhereUniqueInput
    data: XOR<BookingUpdateWithoutTenantInput, BookingUncheckedUpdateWithoutTenantInput>
  }

  export type BookingUpdateManyWithWhereWithoutTenantInput = {
    where: BookingScalarWhereInput
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyWithoutTenantInput>
  }

  export type BookingScalarWhereInput = {
    AND?: BookingScalarWhereInput | BookingScalarWhereInput[]
    OR?: BookingScalarWhereInput[]
    NOT?: BookingScalarWhereInput | BookingScalarWhereInput[]
    id?: StringFilter<"Booking"> | string
    tenantId?: StringFilter<"Booking"> | string
    customerId?: StringFilter<"Booking"> | string
    wrapId?: StringFilter<"Booking"> | string
    startTime?: DateTimeFilter<"Booking"> | Date | string
    endTime?: DateTimeFilter<"Booking"> | Date | string
    status?: StringFilter<"Booking"> | string
    totalPrice?: FloatFilter<"Booking"> | number
    createdAt?: DateTimeFilter<"Booking"> | Date | string
    updatedAt?: DateTimeFilter<"Booking"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Booking"> | Date | string | null
  }

  export type VisualizerPreviewUpsertWithWhereUniqueWithoutTenantInput = {
    where: VisualizerPreviewWhereUniqueInput
    update: XOR<VisualizerPreviewUpdateWithoutTenantInput, VisualizerPreviewUncheckedUpdateWithoutTenantInput>
    create: XOR<VisualizerPreviewCreateWithoutTenantInput, VisualizerPreviewUncheckedCreateWithoutTenantInput>
  }

  export type VisualizerPreviewUpdateWithWhereUniqueWithoutTenantInput = {
    where: VisualizerPreviewWhereUniqueInput
    data: XOR<VisualizerPreviewUpdateWithoutTenantInput, VisualizerPreviewUncheckedUpdateWithoutTenantInput>
  }

  export type VisualizerPreviewUpdateManyWithWhereWithoutTenantInput = {
    where: VisualizerPreviewScalarWhereInput
    data: XOR<VisualizerPreviewUpdateManyMutationInput, VisualizerPreviewUncheckedUpdateManyWithoutTenantInput>
  }

  export type VisualizerPreviewScalarWhereInput = {
    AND?: VisualizerPreviewScalarWhereInput | VisualizerPreviewScalarWhereInput[]
    OR?: VisualizerPreviewScalarWhereInput[]
    NOT?: VisualizerPreviewScalarWhereInput | VisualizerPreviewScalarWhereInput[]
    id?: StringFilter<"VisualizerPreview"> | string
    tenantId?: StringFilter<"VisualizerPreview"> | string
    wrapId?: StringFilter<"VisualizerPreview"> | string
    customerPhotoUrl?: StringFilter<"VisualizerPreview"> | string
    processedImageUrl?: StringNullableFilter<"VisualizerPreview"> | string | null
    status?: StringFilter<"VisualizerPreview"> | string
    cacheKey?: StringFilter<"VisualizerPreview"> | string
    expiresAt?: DateTimeFilter<"VisualizerPreview"> | Date | string
    createdAt?: DateTimeFilter<"VisualizerPreview"> | Date | string
    updatedAt?: DateTimeFilter<"VisualizerPreview"> | Date | string
    deletedAt?: DateTimeNullableFilter<"VisualizerPreview"> | Date | string | null
  }

  export type InvoiceUpsertWithWhereUniqueWithoutTenantInput = {
    where: InvoiceWhereUniqueInput
    update: XOR<InvoiceUpdateWithoutTenantInput, InvoiceUncheckedUpdateWithoutTenantInput>
    create: XOR<InvoiceCreateWithoutTenantInput, InvoiceUncheckedCreateWithoutTenantInput>
  }

  export type InvoiceUpdateWithWhereUniqueWithoutTenantInput = {
    where: InvoiceWhereUniqueInput
    data: XOR<InvoiceUpdateWithoutTenantInput, InvoiceUncheckedUpdateWithoutTenantInput>
  }

  export type InvoiceUpdateManyWithWhereWithoutTenantInput = {
    where: InvoiceScalarWhereInput
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyWithoutTenantInput>
  }

  export type InvoiceScalarWhereInput = {
    AND?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
    OR?: InvoiceScalarWhereInput[]
    NOT?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
    id?: StringFilter<"Invoice"> | string
    tenantId?: StringFilter<"Invoice"> | string
    bookingId?: StringFilter<"Invoice"> | string
    status?: StringFilter<"Invoice"> | string
    totalAmount?: FloatFilter<"Invoice"> | number
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeFilter<"Invoice"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Invoice"> | Date | string | null
  }

  export type AuditLogUpsertWithWhereUniqueWithoutTenantInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutTenantInput, AuditLogUncheckedUpdateWithoutTenantInput>
    create: XOR<AuditLogCreateWithoutTenantInput, AuditLogUncheckedCreateWithoutTenantInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutTenantInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutTenantInput, AuditLogUncheckedUpdateWithoutTenantInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutTenantInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutTenantInput>
  }

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    OR?: AuditLogScalarWhereInput[]
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    tenantId?: StringFilter<"AuditLog"> | string
    userId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    resourceType?: StringFilter<"AuditLog"> | string
    resourceId?: StringFilter<"AuditLog"> | string
    details?: StringNullableFilter<"AuditLog"> | string | null
    timestamp?: DateTimeFilter<"AuditLog"> | Date | string
    deletedAt?: DateTimeNullableFilter<"AuditLog"> | Date | string | null
  }

  export type TenantCreateWithoutMembersInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    wraps?: WrapCreateNestedManyWithoutTenantInput
    wrapCategories?: WrapCategoryCreateNestedManyWithoutTenantInput
    availabilityRules?: AvailabilityRuleCreateNestedManyWithoutTenantInput
    bookings?: BookingCreateNestedManyWithoutTenantInput
    previews?: VisualizerPreviewCreateNestedManyWithoutTenantInput
    invoices?: InvoiceCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutMembersInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    wraps?: WrapUncheckedCreateNestedManyWithoutTenantInput
    wrapCategories?: WrapCategoryUncheckedCreateNestedManyWithoutTenantInput
    availabilityRules?: AvailabilityRuleUncheckedCreateNestedManyWithoutTenantInput
    bookings?: BookingUncheckedCreateNestedManyWithoutTenantInput
    previews?: VisualizerPreviewUncheckedCreateNestedManyWithoutTenantInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutMembersInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutMembersInput, TenantUncheckedCreateWithoutMembersInput>
  }

  export type TenantUpsertWithoutMembersInput = {
    update: XOR<TenantUpdateWithoutMembersInput, TenantUncheckedUpdateWithoutMembersInput>
    create: XOR<TenantCreateWithoutMembersInput, TenantUncheckedCreateWithoutMembersInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutMembersInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutMembersInput, TenantUncheckedUpdateWithoutMembersInput>
  }

  export type TenantUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wraps?: WrapUpdateManyWithoutTenantNestedInput
    wrapCategories?: WrapCategoryUpdateManyWithoutTenantNestedInput
    availabilityRules?: AvailabilityRuleUpdateManyWithoutTenantNestedInput
    bookings?: BookingUpdateManyWithoutTenantNestedInput
    previews?: VisualizerPreviewUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wraps?: WrapUncheckedUpdateManyWithoutTenantNestedInput
    wrapCategories?: WrapCategoryUncheckedUpdateManyWithoutTenantNestedInput
    availabilityRules?: AvailabilityRuleUncheckedUpdateManyWithoutTenantNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutTenantNestedInput
    previews?: VisualizerPreviewUncheckedUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutWrapsInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    members?: TenantUserMembershipCreateNestedManyWithoutTenantInput
    wrapCategories?: WrapCategoryCreateNestedManyWithoutTenantInput
    availabilityRules?: AvailabilityRuleCreateNestedManyWithoutTenantInput
    bookings?: BookingCreateNestedManyWithoutTenantInput
    previews?: VisualizerPreviewCreateNestedManyWithoutTenantInput
    invoices?: InvoiceCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutWrapsInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    members?: TenantUserMembershipUncheckedCreateNestedManyWithoutTenantInput
    wrapCategories?: WrapCategoryUncheckedCreateNestedManyWithoutTenantInput
    availabilityRules?: AvailabilityRuleUncheckedCreateNestedManyWithoutTenantInput
    bookings?: BookingUncheckedCreateNestedManyWithoutTenantInput
    previews?: VisualizerPreviewUncheckedCreateNestedManyWithoutTenantInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutWrapsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutWrapsInput, TenantUncheckedCreateWithoutWrapsInput>
  }

  export type WrapImageCreateWithoutWrapInput = {
    id?: string
    url: string
    displayOrder?: number
    createdAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type WrapImageUncheckedCreateWithoutWrapInput = {
    id?: string
    url: string
    displayOrder?: number
    createdAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type WrapImageCreateOrConnectWithoutWrapInput = {
    where: WrapImageWhereUniqueInput
    create: XOR<WrapImageCreateWithoutWrapInput, WrapImageUncheckedCreateWithoutWrapInput>
  }

  export type WrapImageCreateManyWrapInputEnvelope = {
    data: WrapImageCreateManyWrapInput | WrapImageCreateManyWrapInput[]
    skipDuplicates?: boolean
  }

  export type WrapCategoryMappingCreateWithoutWrapInput = {
    category: WrapCategoryCreateNestedOneWithoutWrapsInput
  }

  export type WrapCategoryMappingUncheckedCreateWithoutWrapInput = {
    categoryId: string
  }

  export type WrapCategoryMappingCreateOrConnectWithoutWrapInput = {
    where: WrapCategoryMappingWhereUniqueInput
    create: XOR<WrapCategoryMappingCreateWithoutWrapInput, WrapCategoryMappingUncheckedCreateWithoutWrapInput>
  }

  export type WrapCategoryMappingCreateManyWrapInputEnvelope = {
    data: WrapCategoryMappingCreateManyWrapInput | WrapCategoryMappingCreateManyWrapInput[]
    skipDuplicates?: boolean
  }

  export type BookingCreateWithoutWrapInput = {
    id?: string
    customerId: string
    startTime: Date | string
    endTime: Date | string
    status?: string
    totalPrice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutBookingsInput
    reservation?: BookingReservationCreateNestedOneWithoutBookingInput
    invoice?: InvoiceCreateNestedOneWithoutBookingInput
  }

  export type BookingUncheckedCreateWithoutWrapInput = {
    id?: string
    tenantId: string
    customerId: string
    startTime: Date | string
    endTime: Date | string
    status?: string
    totalPrice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    reservation?: BookingReservationUncheckedCreateNestedOneWithoutBookingInput
    invoice?: InvoiceUncheckedCreateNestedOneWithoutBookingInput
  }

  export type BookingCreateOrConnectWithoutWrapInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutWrapInput, BookingUncheckedCreateWithoutWrapInput>
  }

  export type BookingCreateManyWrapInputEnvelope = {
    data: BookingCreateManyWrapInput | BookingCreateManyWrapInput[]
    skipDuplicates?: boolean
  }

  export type VisualizerPreviewCreateWithoutWrapInput = {
    id?: string
    customerPhotoUrl: string
    processedImageUrl?: string | null
    status?: string
    cacheKey: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutPreviewsInput
  }

  export type VisualizerPreviewUncheckedCreateWithoutWrapInput = {
    id?: string
    tenantId: string
    customerPhotoUrl: string
    processedImageUrl?: string | null
    status?: string
    cacheKey: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type VisualizerPreviewCreateOrConnectWithoutWrapInput = {
    where: VisualizerPreviewWhereUniqueInput
    create: XOR<VisualizerPreviewCreateWithoutWrapInput, VisualizerPreviewUncheckedCreateWithoutWrapInput>
  }

  export type VisualizerPreviewCreateManyWrapInputEnvelope = {
    data: VisualizerPreviewCreateManyWrapInput | VisualizerPreviewCreateManyWrapInput[]
    skipDuplicates?: boolean
  }

  export type TenantUpsertWithoutWrapsInput = {
    update: XOR<TenantUpdateWithoutWrapsInput, TenantUncheckedUpdateWithoutWrapsInput>
    create: XOR<TenantCreateWithoutWrapsInput, TenantUncheckedCreateWithoutWrapsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutWrapsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutWrapsInput, TenantUncheckedUpdateWithoutWrapsInput>
  }

  export type TenantUpdateWithoutWrapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    members?: TenantUserMembershipUpdateManyWithoutTenantNestedInput
    wrapCategories?: WrapCategoryUpdateManyWithoutTenantNestedInput
    availabilityRules?: AvailabilityRuleUpdateManyWithoutTenantNestedInput
    bookings?: BookingUpdateManyWithoutTenantNestedInput
    previews?: VisualizerPreviewUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutWrapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    members?: TenantUserMembershipUncheckedUpdateManyWithoutTenantNestedInput
    wrapCategories?: WrapCategoryUncheckedUpdateManyWithoutTenantNestedInput
    availabilityRules?: AvailabilityRuleUncheckedUpdateManyWithoutTenantNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutTenantNestedInput
    previews?: VisualizerPreviewUncheckedUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type WrapImageUpsertWithWhereUniqueWithoutWrapInput = {
    where: WrapImageWhereUniqueInput
    update: XOR<WrapImageUpdateWithoutWrapInput, WrapImageUncheckedUpdateWithoutWrapInput>
    create: XOR<WrapImageCreateWithoutWrapInput, WrapImageUncheckedCreateWithoutWrapInput>
  }

  export type WrapImageUpdateWithWhereUniqueWithoutWrapInput = {
    where: WrapImageWhereUniqueInput
    data: XOR<WrapImageUpdateWithoutWrapInput, WrapImageUncheckedUpdateWithoutWrapInput>
  }

  export type WrapImageUpdateManyWithWhereWithoutWrapInput = {
    where: WrapImageScalarWhereInput
    data: XOR<WrapImageUpdateManyMutationInput, WrapImageUncheckedUpdateManyWithoutWrapInput>
  }

  export type WrapImageScalarWhereInput = {
    AND?: WrapImageScalarWhereInput | WrapImageScalarWhereInput[]
    OR?: WrapImageScalarWhereInput[]
    NOT?: WrapImageScalarWhereInput | WrapImageScalarWhereInput[]
    id?: StringFilter<"WrapImage"> | string
    wrapId?: StringFilter<"WrapImage"> | string
    url?: StringFilter<"WrapImage"> | string
    displayOrder?: IntFilter<"WrapImage"> | number
    createdAt?: DateTimeFilter<"WrapImage"> | Date | string
    deletedAt?: DateTimeNullableFilter<"WrapImage"> | Date | string | null
  }

  export type WrapCategoryMappingUpsertWithWhereUniqueWithoutWrapInput = {
    where: WrapCategoryMappingWhereUniqueInput
    update: XOR<WrapCategoryMappingUpdateWithoutWrapInput, WrapCategoryMappingUncheckedUpdateWithoutWrapInput>
    create: XOR<WrapCategoryMappingCreateWithoutWrapInput, WrapCategoryMappingUncheckedCreateWithoutWrapInput>
  }

  export type WrapCategoryMappingUpdateWithWhereUniqueWithoutWrapInput = {
    where: WrapCategoryMappingWhereUniqueInput
    data: XOR<WrapCategoryMappingUpdateWithoutWrapInput, WrapCategoryMappingUncheckedUpdateWithoutWrapInput>
  }

  export type WrapCategoryMappingUpdateManyWithWhereWithoutWrapInput = {
    where: WrapCategoryMappingScalarWhereInput
    data: XOR<WrapCategoryMappingUpdateManyMutationInput, WrapCategoryMappingUncheckedUpdateManyWithoutWrapInput>
  }

  export type WrapCategoryMappingScalarWhereInput = {
    AND?: WrapCategoryMappingScalarWhereInput | WrapCategoryMappingScalarWhereInput[]
    OR?: WrapCategoryMappingScalarWhereInput[]
    NOT?: WrapCategoryMappingScalarWhereInput | WrapCategoryMappingScalarWhereInput[]
    wrapId?: StringFilter<"WrapCategoryMapping"> | string
    categoryId?: StringFilter<"WrapCategoryMapping"> | string
  }

  export type BookingUpsertWithWhereUniqueWithoutWrapInput = {
    where: BookingWhereUniqueInput
    update: XOR<BookingUpdateWithoutWrapInput, BookingUncheckedUpdateWithoutWrapInput>
    create: XOR<BookingCreateWithoutWrapInput, BookingUncheckedCreateWithoutWrapInput>
  }

  export type BookingUpdateWithWhereUniqueWithoutWrapInput = {
    where: BookingWhereUniqueInput
    data: XOR<BookingUpdateWithoutWrapInput, BookingUncheckedUpdateWithoutWrapInput>
  }

  export type BookingUpdateManyWithWhereWithoutWrapInput = {
    where: BookingScalarWhereInput
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyWithoutWrapInput>
  }

  export type VisualizerPreviewUpsertWithWhereUniqueWithoutWrapInput = {
    where: VisualizerPreviewWhereUniqueInput
    update: XOR<VisualizerPreviewUpdateWithoutWrapInput, VisualizerPreviewUncheckedUpdateWithoutWrapInput>
    create: XOR<VisualizerPreviewCreateWithoutWrapInput, VisualizerPreviewUncheckedCreateWithoutWrapInput>
  }

  export type VisualizerPreviewUpdateWithWhereUniqueWithoutWrapInput = {
    where: VisualizerPreviewWhereUniqueInput
    data: XOR<VisualizerPreviewUpdateWithoutWrapInput, VisualizerPreviewUncheckedUpdateWithoutWrapInput>
  }

  export type VisualizerPreviewUpdateManyWithWhereWithoutWrapInput = {
    where: VisualizerPreviewScalarWhereInput
    data: XOR<VisualizerPreviewUpdateManyMutationInput, VisualizerPreviewUncheckedUpdateManyWithoutWrapInput>
  }

  export type TenantCreateWithoutWrapCategoriesInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    members?: TenantUserMembershipCreateNestedManyWithoutTenantInput
    wraps?: WrapCreateNestedManyWithoutTenantInput
    availabilityRules?: AvailabilityRuleCreateNestedManyWithoutTenantInput
    bookings?: BookingCreateNestedManyWithoutTenantInput
    previews?: VisualizerPreviewCreateNestedManyWithoutTenantInput
    invoices?: InvoiceCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutWrapCategoriesInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    members?: TenantUserMembershipUncheckedCreateNestedManyWithoutTenantInput
    wraps?: WrapUncheckedCreateNestedManyWithoutTenantInput
    availabilityRules?: AvailabilityRuleUncheckedCreateNestedManyWithoutTenantInput
    bookings?: BookingUncheckedCreateNestedManyWithoutTenantInput
    previews?: VisualizerPreviewUncheckedCreateNestedManyWithoutTenantInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutWrapCategoriesInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutWrapCategoriesInput, TenantUncheckedCreateWithoutWrapCategoriesInput>
  }

  export type WrapCategoryMappingCreateWithoutCategoryInput = {
    wrap: WrapCreateNestedOneWithoutCategoryMappingsInput
  }

  export type WrapCategoryMappingUncheckedCreateWithoutCategoryInput = {
    wrapId: string
  }

  export type WrapCategoryMappingCreateOrConnectWithoutCategoryInput = {
    where: WrapCategoryMappingWhereUniqueInput
    create: XOR<WrapCategoryMappingCreateWithoutCategoryInput, WrapCategoryMappingUncheckedCreateWithoutCategoryInput>
  }

  export type WrapCategoryMappingCreateManyCategoryInputEnvelope = {
    data: WrapCategoryMappingCreateManyCategoryInput | WrapCategoryMappingCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type TenantUpsertWithoutWrapCategoriesInput = {
    update: XOR<TenantUpdateWithoutWrapCategoriesInput, TenantUncheckedUpdateWithoutWrapCategoriesInput>
    create: XOR<TenantCreateWithoutWrapCategoriesInput, TenantUncheckedCreateWithoutWrapCategoriesInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutWrapCategoriesInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutWrapCategoriesInput, TenantUncheckedUpdateWithoutWrapCategoriesInput>
  }

  export type TenantUpdateWithoutWrapCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    members?: TenantUserMembershipUpdateManyWithoutTenantNestedInput
    wraps?: WrapUpdateManyWithoutTenantNestedInput
    availabilityRules?: AvailabilityRuleUpdateManyWithoutTenantNestedInput
    bookings?: BookingUpdateManyWithoutTenantNestedInput
    previews?: VisualizerPreviewUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutWrapCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    members?: TenantUserMembershipUncheckedUpdateManyWithoutTenantNestedInput
    wraps?: WrapUncheckedUpdateManyWithoutTenantNestedInput
    availabilityRules?: AvailabilityRuleUncheckedUpdateManyWithoutTenantNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutTenantNestedInput
    previews?: VisualizerPreviewUncheckedUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type WrapCategoryMappingUpsertWithWhereUniqueWithoutCategoryInput = {
    where: WrapCategoryMappingWhereUniqueInput
    update: XOR<WrapCategoryMappingUpdateWithoutCategoryInput, WrapCategoryMappingUncheckedUpdateWithoutCategoryInput>
    create: XOR<WrapCategoryMappingCreateWithoutCategoryInput, WrapCategoryMappingUncheckedCreateWithoutCategoryInput>
  }

  export type WrapCategoryMappingUpdateWithWhereUniqueWithoutCategoryInput = {
    where: WrapCategoryMappingWhereUniqueInput
    data: XOR<WrapCategoryMappingUpdateWithoutCategoryInput, WrapCategoryMappingUncheckedUpdateWithoutCategoryInput>
  }

  export type WrapCategoryMappingUpdateManyWithWhereWithoutCategoryInput = {
    where: WrapCategoryMappingScalarWhereInput
    data: XOR<WrapCategoryMappingUpdateManyMutationInput, WrapCategoryMappingUncheckedUpdateManyWithoutCategoryInput>
  }

  export type WrapCreateWithoutCategoryMappingsInput = {
    id?: string
    name: string
    description?: string | null
    price: number
    installationMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutWrapsInput
    images?: WrapImageCreateNestedManyWithoutWrapInput
    bookings?: BookingCreateNestedManyWithoutWrapInput
    previews?: VisualizerPreviewCreateNestedManyWithoutWrapInput
  }

  export type WrapUncheckedCreateWithoutCategoryMappingsInput = {
    id?: string
    tenantId: string
    name: string
    description?: string | null
    price: number
    installationMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    images?: WrapImageUncheckedCreateNestedManyWithoutWrapInput
    bookings?: BookingUncheckedCreateNestedManyWithoutWrapInput
    previews?: VisualizerPreviewUncheckedCreateNestedManyWithoutWrapInput
  }

  export type WrapCreateOrConnectWithoutCategoryMappingsInput = {
    where: WrapWhereUniqueInput
    create: XOR<WrapCreateWithoutCategoryMappingsInput, WrapUncheckedCreateWithoutCategoryMappingsInput>
  }

  export type WrapCategoryCreateWithoutWrapsInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutWrapCategoriesInput
  }

  export type WrapCategoryUncheckedCreateWithoutWrapsInput = {
    id?: string
    tenantId: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type WrapCategoryCreateOrConnectWithoutWrapsInput = {
    where: WrapCategoryWhereUniqueInput
    create: XOR<WrapCategoryCreateWithoutWrapsInput, WrapCategoryUncheckedCreateWithoutWrapsInput>
  }

  export type WrapUpsertWithoutCategoryMappingsInput = {
    update: XOR<WrapUpdateWithoutCategoryMappingsInput, WrapUncheckedUpdateWithoutCategoryMappingsInput>
    create: XOR<WrapCreateWithoutCategoryMappingsInput, WrapUncheckedCreateWithoutCategoryMappingsInput>
    where?: WrapWhereInput
  }

  export type WrapUpdateToOneWithWhereWithoutCategoryMappingsInput = {
    where?: WrapWhereInput
    data: XOR<WrapUpdateWithoutCategoryMappingsInput, WrapUncheckedUpdateWithoutCategoryMappingsInput>
  }

  export type WrapUpdateWithoutCategoryMappingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    installationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutWrapsNestedInput
    images?: WrapImageUpdateManyWithoutWrapNestedInput
    bookings?: BookingUpdateManyWithoutWrapNestedInput
    previews?: VisualizerPreviewUpdateManyWithoutWrapNestedInput
  }

  export type WrapUncheckedUpdateWithoutCategoryMappingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    installationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    images?: WrapImageUncheckedUpdateManyWithoutWrapNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutWrapNestedInput
    previews?: VisualizerPreviewUncheckedUpdateManyWithoutWrapNestedInput
  }

  export type WrapCategoryUpsertWithoutWrapsInput = {
    update: XOR<WrapCategoryUpdateWithoutWrapsInput, WrapCategoryUncheckedUpdateWithoutWrapsInput>
    create: XOR<WrapCategoryCreateWithoutWrapsInput, WrapCategoryUncheckedCreateWithoutWrapsInput>
    where?: WrapCategoryWhereInput
  }

  export type WrapCategoryUpdateToOneWithWhereWithoutWrapsInput = {
    where?: WrapCategoryWhereInput
    data: XOR<WrapCategoryUpdateWithoutWrapsInput, WrapCategoryUncheckedUpdateWithoutWrapsInput>
  }

  export type WrapCategoryUpdateWithoutWrapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutWrapCategoriesNestedInput
  }

  export type WrapCategoryUncheckedUpdateWithoutWrapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WrapCreateWithoutImagesInput = {
    id?: string
    name: string
    description?: string | null
    price: number
    installationMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutWrapsInput
    categoryMappings?: WrapCategoryMappingCreateNestedManyWithoutWrapInput
    bookings?: BookingCreateNestedManyWithoutWrapInput
    previews?: VisualizerPreviewCreateNestedManyWithoutWrapInput
  }

  export type WrapUncheckedCreateWithoutImagesInput = {
    id?: string
    tenantId: string
    name: string
    description?: string | null
    price: number
    installationMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    categoryMappings?: WrapCategoryMappingUncheckedCreateNestedManyWithoutWrapInput
    bookings?: BookingUncheckedCreateNestedManyWithoutWrapInput
    previews?: VisualizerPreviewUncheckedCreateNestedManyWithoutWrapInput
  }

  export type WrapCreateOrConnectWithoutImagesInput = {
    where: WrapWhereUniqueInput
    create: XOR<WrapCreateWithoutImagesInput, WrapUncheckedCreateWithoutImagesInput>
  }

  export type WrapUpsertWithoutImagesInput = {
    update: XOR<WrapUpdateWithoutImagesInput, WrapUncheckedUpdateWithoutImagesInput>
    create: XOR<WrapCreateWithoutImagesInput, WrapUncheckedCreateWithoutImagesInput>
    where?: WrapWhereInput
  }

  export type WrapUpdateToOneWithWhereWithoutImagesInput = {
    where?: WrapWhereInput
    data: XOR<WrapUpdateWithoutImagesInput, WrapUncheckedUpdateWithoutImagesInput>
  }

  export type WrapUpdateWithoutImagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    installationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutWrapsNestedInput
    categoryMappings?: WrapCategoryMappingUpdateManyWithoutWrapNestedInput
    bookings?: BookingUpdateManyWithoutWrapNestedInput
    previews?: VisualizerPreviewUpdateManyWithoutWrapNestedInput
  }

  export type WrapUncheckedUpdateWithoutImagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    installationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    categoryMappings?: WrapCategoryMappingUncheckedUpdateManyWithoutWrapNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutWrapNestedInput
    previews?: VisualizerPreviewUncheckedUpdateManyWithoutWrapNestedInput
  }

  export type TenantCreateWithoutAvailabilityRulesInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    members?: TenantUserMembershipCreateNestedManyWithoutTenantInput
    wraps?: WrapCreateNestedManyWithoutTenantInput
    wrapCategories?: WrapCategoryCreateNestedManyWithoutTenantInput
    bookings?: BookingCreateNestedManyWithoutTenantInput
    previews?: VisualizerPreviewCreateNestedManyWithoutTenantInput
    invoices?: InvoiceCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutAvailabilityRulesInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    members?: TenantUserMembershipUncheckedCreateNestedManyWithoutTenantInput
    wraps?: WrapUncheckedCreateNestedManyWithoutTenantInput
    wrapCategories?: WrapCategoryUncheckedCreateNestedManyWithoutTenantInput
    bookings?: BookingUncheckedCreateNestedManyWithoutTenantInput
    previews?: VisualizerPreviewUncheckedCreateNestedManyWithoutTenantInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutAvailabilityRulesInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutAvailabilityRulesInput, TenantUncheckedCreateWithoutAvailabilityRulesInput>
  }

  export type TenantUpsertWithoutAvailabilityRulesInput = {
    update: XOR<TenantUpdateWithoutAvailabilityRulesInput, TenantUncheckedUpdateWithoutAvailabilityRulesInput>
    create: XOR<TenantCreateWithoutAvailabilityRulesInput, TenantUncheckedCreateWithoutAvailabilityRulesInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutAvailabilityRulesInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutAvailabilityRulesInput, TenantUncheckedUpdateWithoutAvailabilityRulesInput>
  }

  export type TenantUpdateWithoutAvailabilityRulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    members?: TenantUserMembershipUpdateManyWithoutTenantNestedInput
    wraps?: WrapUpdateManyWithoutTenantNestedInput
    wrapCategories?: WrapCategoryUpdateManyWithoutTenantNestedInput
    bookings?: BookingUpdateManyWithoutTenantNestedInput
    previews?: VisualizerPreviewUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutAvailabilityRulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    members?: TenantUserMembershipUncheckedUpdateManyWithoutTenantNestedInput
    wraps?: WrapUncheckedUpdateManyWithoutTenantNestedInput
    wrapCategories?: WrapCategoryUncheckedUpdateManyWithoutTenantNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutTenantNestedInput
    previews?: VisualizerPreviewUncheckedUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutBookingsInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    members?: TenantUserMembershipCreateNestedManyWithoutTenantInput
    wraps?: WrapCreateNestedManyWithoutTenantInput
    wrapCategories?: WrapCategoryCreateNestedManyWithoutTenantInput
    availabilityRules?: AvailabilityRuleCreateNestedManyWithoutTenantInput
    previews?: VisualizerPreviewCreateNestedManyWithoutTenantInput
    invoices?: InvoiceCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutBookingsInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    members?: TenantUserMembershipUncheckedCreateNestedManyWithoutTenantInput
    wraps?: WrapUncheckedCreateNestedManyWithoutTenantInput
    wrapCategories?: WrapCategoryUncheckedCreateNestedManyWithoutTenantInput
    availabilityRules?: AvailabilityRuleUncheckedCreateNestedManyWithoutTenantInput
    previews?: VisualizerPreviewUncheckedCreateNestedManyWithoutTenantInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutBookingsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutBookingsInput, TenantUncheckedCreateWithoutBookingsInput>
  }

  export type WrapCreateWithoutBookingsInput = {
    id?: string
    name: string
    description?: string | null
    price: number
    installationMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutWrapsInput
    images?: WrapImageCreateNestedManyWithoutWrapInput
    categoryMappings?: WrapCategoryMappingCreateNestedManyWithoutWrapInput
    previews?: VisualizerPreviewCreateNestedManyWithoutWrapInput
  }

  export type WrapUncheckedCreateWithoutBookingsInput = {
    id?: string
    tenantId: string
    name: string
    description?: string | null
    price: number
    installationMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    images?: WrapImageUncheckedCreateNestedManyWithoutWrapInput
    categoryMappings?: WrapCategoryMappingUncheckedCreateNestedManyWithoutWrapInput
    previews?: VisualizerPreviewUncheckedCreateNestedManyWithoutWrapInput
  }

  export type WrapCreateOrConnectWithoutBookingsInput = {
    where: WrapWhereUniqueInput
    create: XOR<WrapCreateWithoutBookingsInput, WrapUncheckedCreateWithoutBookingsInput>
  }

  export type BookingReservationCreateWithoutBookingInput = {
    id?: string
    expiresAt: Date | string
    reservedAt?: Date | string
    createdAt?: Date | string
  }

  export type BookingReservationUncheckedCreateWithoutBookingInput = {
    id?: string
    expiresAt: Date | string
    reservedAt?: Date | string
    createdAt?: Date | string
  }

  export type BookingReservationCreateOrConnectWithoutBookingInput = {
    where: BookingReservationWhereUniqueInput
    create: XOR<BookingReservationCreateWithoutBookingInput, BookingReservationUncheckedCreateWithoutBookingInput>
  }

  export type InvoiceCreateWithoutBookingInput = {
    id?: string
    status?: string
    totalAmount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutInvoicesInput
    lineItems?: InvoiceLineItemCreateNestedManyWithoutInvoiceInput
    payments?: PaymentCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUncheckedCreateWithoutBookingInput = {
    id?: string
    tenantId: string
    status?: string
    totalAmount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    lineItems?: InvoiceLineItemUncheckedCreateNestedManyWithoutInvoiceInput
    payments?: PaymentUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceCreateOrConnectWithoutBookingInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutBookingInput, InvoiceUncheckedCreateWithoutBookingInput>
  }

  export type TenantUpsertWithoutBookingsInput = {
    update: XOR<TenantUpdateWithoutBookingsInput, TenantUncheckedUpdateWithoutBookingsInput>
    create: XOR<TenantCreateWithoutBookingsInput, TenantUncheckedCreateWithoutBookingsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutBookingsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutBookingsInput, TenantUncheckedUpdateWithoutBookingsInput>
  }

  export type TenantUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    members?: TenantUserMembershipUpdateManyWithoutTenantNestedInput
    wraps?: WrapUpdateManyWithoutTenantNestedInput
    wrapCategories?: WrapCategoryUpdateManyWithoutTenantNestedInput
    availabilityRules?: AvailabilityRuleUpdateManyWithoutTenantNestedInput
    previews?: VisualizerPreviewUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    members?: TenantUserMembershipUncheckedUpdateManyWithoutTenantNestedInput
    wraps?: WrapUncheckedUpdateManyWithoutTenantNestedInput
    wrapCategories?: WrapCategoryUncheckedUpdateManyWithoutTenantNestedInput
    availabilityRules?: AvailabilityRuleUncheckedUpdateManyWithoutTenantNestedInput
    previews?: VisualizerPreviewUncheckedUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type WrapUpsertWithoutBookingsInput = {
    update: XOR<WrapUpdateWithoutBookingsInput, WrapUncheckedUpdateWithoutBookingsInput>
    create: XOR<WrapCreateWithoutBookingsInput, WrapUncheckedCreateWithoutBookingsInput>
    where?: WrapWhereInput
  }

  export type WrapUpdateToOneWithWhereWithoutBookingsInput = {
    where?: WrapWhereInput
    data: XOR<WrapUpdateWithoutBookingsInput, WrapUncheckedUpdateWithoutBookingsInput>
  }

  export type WrapUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    installationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutWrapsNestedInput
    images?: WrapImageUpdateManyWithoutWrapNestedInput
    categoryMappings?: WrapCategoryMappingUpdateManyWithoutWrapNestedInput
    previews?: VisualizerPreviewUpdateManyWithoutWrapNestedInput
  }

  export type WrapUncheckedUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    installationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    images?: WrapImageUncheckedUpdateManyWithoutWrapNestedInput
    categoryMappings?: WrapCategoryMappingUncheckedUpdateManyWithoutWrapNestedInput
    previews?: VisualizerPreviewUncheckedUpdateManyWithoutWrapNestedInput
  }

  export type BookingReservationUpsertWithoutBookingInput = {
    update: XOR<BookingReservationUpdateWithoutBookingInput, BookingReservationUncheckedUpdateWithoutBookingInput>
    create: XOR<BookingReservationCreateWithoutBookingInput, BookingReservationUncheckedCreateWithoutBookingInput>
    where?: BookingReservationWhereInput
  }

  export type BookingReservationUpdateToOneWithWhereWithoutBookingInput = {
    where?: BookingReservationWhereInput
    data: XOR<BookingReservationUpdateWithoutBookingInput, BookingReservationUncheckedUpdateWithoutBookingInput>
  }

  export type BookingReservationUpdateWithoutBookingInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingReservationUncheckedUpdateWithoutBookingInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceUpsertWithoutBookingInput = {
    update: XOR<InvoiceUpdateWithoutBookingInput, InvoiceUncheckedUpdateWithoutBookingInput>
    create: XOR<InvoiceCreateWithoutBookingInput, InvoiceUncheckedCreateWithoutBookingInput>
    where?: InvoiceWhereInput
  }

  export type InvoiceUpdateToOneWithWhereWithoutBookingInput = {
    where?: InvoiceWhereInput
    data: XOR<InvoiceUpdateWithoutBookingInput, InvoiceUncheckedUpdateWithoutBookingInput>
  }

  export type InvoiceUpdateWithoutBookingInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutInvoicesNestedInput
    lineItems?: InvoiceLineItemUpdateManyWithoutInvoiceNestedInput
    payments?: PaymentUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateWithoutBookingInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lineItems?: InvoiceLineItemUncheckedUpdateManyWithoutInvoiceNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type BookingCreateWithoutReservationInput = {
    id?: string
    customerId: string
    startTime: Date | string
    endTime: Date | string
    status?: string
    totalPrice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutBookingsInput
    wrap: WrapCreateNestedOneWithoutBookingsInput
    invoice?: InvoiceCreateNestedOneWithoutBookingInput
  }

  export type BookingUncheckedCreateWithoutReservationInput = {
    id?: string
    tenantId: string
    customerId: string
    wrapId: string
    startTime: Date | string
    endTime: Date | string
    status?: string
    totalPrice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    invoice?: InvoiceUncheckedCreateNestedOneWithoutBookingInput
  }

  export type BookingCreateOrConnectWithoutReservationInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutReservationInput, BookingUncheckedCreateWithoutReservationInput>
  }

  export type BookingUpsertWithoutReservationInput = {
    update: XOR<BookingUpdateWithoutReservationInput, BookingUncheckedUpdateWithoutReservationInput>
    create: XOR<BookingCreateWithoutReservationInput, BookingUncheckedCreateWithoutReservationInput>
    where?: BookingWhereInput
  }

  export type BookingUpdateToOneWithWhereWithoutReservationInput = {
    where?: BookingWhereInput
    data: XOR<BookingUpdateWithoutReservationInput, BookingUncheckedUpdateWithoutReservationInput>
  }

  export type BookingUpdateWithoutReservationInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    totalPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutBookingsNestedInput
    wrap?: WrapUpdateOneRequiredWithoutBookingsNestedInput
    invoice?: InvoiceUpdateOneWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateWithoutReservationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    wrapId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    totalPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invoice?: InvoiceUncheckedUpdateOneWithoutBookingNestedInput
  }

  export type TenantCreateWithoutPreviewsInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    members?: TenantUserMembershipCreateNestedManyWithoutTenantInput
    wraps?: WrapCreateNestedManyWithoutTenantInput
    wrapCategories?: WrapCategoryCreateNestedManyWithoutTenantInput
    availabilityRules?: AvailabilityRuleCreateNestedManyWithoutTenantInput
    bookings?: BookingCreateNestedManyWithoutTenantInput
    invoices?: InvoiceCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutPreviewsInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    members?: TenantUserMembershipUncheckedCreateNestedManyWithoutTenantInput
    wraps?: WrapUncheckedCreateNestedManyWithoutTenantInput
    wrapCategories?: WrapCategoryUncheckedCreateNestedManyWithoutTenantInput
    availabilityRules?: AvailabilityRuleUncheckedCreateNestedManyWithoutTenantInput
    bookings?: BookingUncheckedCreateNestedManyWithoutTenantInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutPreviewsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutPreviewsInput, TenantUncheckedCreateWithoutPreviewsInput>
  }

  export type WrapCreateWithoutPreviewsInput = {
    id?: string
    name: string
    description?: string | null
    price: number
    installationMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutWrapsInput
    images?: WrapImageCreateNestedManyWithoutWrapInput
    categoryMappings?: WrapCategoryMappingCreateNestedManyWithoutWrapInput
    bookings?: BookingCreateNestedManyWithoutWrapInput
  }

  export type WrapUncheckedCreateWithoutPreviewsInput = {
    id?: string
    tenantId: string
    name: string
    description?: string | null
    price: number
    installationMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    images?: WrapImageUncheckedCreateNestedManyWithoutWrapInput
    categoryMappings?: WrapCategoryMappingUncheckedCreateNestedManyWithoutWrapInput
    bookings?: BookingUncheckedCreateNestedManyWithoutWrapInput
  }

  export type WrapCreateOrConnectWithoutPreviewsInput = {
    where: WrapWhereUniqueInput
    create: XOR<WrapCreateWithoutPreviewsInput, WrapUncheckedCreateWithoutPreviewsInput>
  }

  export type TenantUpsertWithoutPreviewsInput = {
    update: XOR<TenantUpdateWithoutPreviewsInput, TenantUncheckedUpdateWithoutPreviewsInput>
    create: XOR<TenantCreateWithoutPreviewsInput, TenantUncheckedCreateWithoutPreviewsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutPreviewsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutPreviewsInput, TenantUncheckedUpdateWithoutPreviewsInput>
  }

  export type TenantUpdateWithoutPreviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    members?: TenantUserMembershipUpdateManyWithoutTenantNestedInput
    wraps?: WrapUpdateManyWithoutTenantNestedInput
    wrapCategories?: WrapCategoryUpdateManyWithoutTenantNestedInput
    availabilityRules?: AvailabilityRuleUpdateManyWithoutTenantNestedInput
    bookings?: BookingUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutPreviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    members?: TenantUserMembershipUncheckedUpdateManyWithoutTenantNestedInput
    wraps?: WrapUncheckedUpdateManyWithoutTenantNestedInput
    wrapCategories?: WrapCategoryUncheckedUpdateManyWithoutTenantNestedInput
    availabilityRules?: AvailabilityRuleUncheckedUpdateManyWithoutTenantNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type WrapUpsertWithoutPreviewsInput = {
    update: XOR<WrapUpdateWithoutPreviewsInput, WrapUncheckedUpdateWithoutPreviewsInput>
    create: XOR<WrapCreateWithoutPreviewsInput, WrapUncheckedCreateWithoutPreviewsInput>
    where?: WrapWhereInput
  }

  export type WrapUpdateToOneWithWhereWithoutPreviewsInput = {
    where?: WrapWhereInput
    data: XOR<WrapUpdateWithoutPreviewsInput, WrapUncheckedUpdateWithoutPreviewsInput>
  }

  export type WrapUpdateWithoutPreviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    installationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutWrapsNestedInput
    images?: WrapImageUpdateManyWithoutWrapNestedInput
    categoryMappings?: WrapCategoryMappingUpdateManyWithoutWrapNestedInput
    bookings?: BookingUpdateManyWithoutWrapNestedInput
  }

  export type WrapUncheckedUpdateWithoutPreviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    installationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    images?: WrapImageUncheckedUpdateManyWithoutWrapNestedInput
    categoryMappings?: WrapCategoryMappingUncheckedUpdateManyWithoutWrapNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutWrapNestedInput
  }

  export type TenantCreateWithoutInvoicesInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    members?: TenantUserMembershipCreateNestedManyWithoutTenantInput
    wraps?: WrapCreateNestedManyWithoutTenantInput
    wrapCategories?: WrapCategoryCreateNestedManyWithoutTenantInput
    availabilityRules?: AvailabilityRuleCreateNestedManyWithoutTenantInput
    bookings?: BookingCreateNestedManyWithoutTenantInput
    previews?: VisualizerPreviewCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutInvoicesInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    members?: TenantUserMembershipUncheckedCreateNestedManyWithoutTenantInput
    wraps?: WrapUncheckedCreateNestedManyWithoutTenantInput
    wrapCategories?: WrapCategoryUncheckedCreateNestedManyWithoutTenantInput
    availabilityRules?: AvailabilityRuleUncheckedCreateNestedManyWithoutTenantInput
    bookings?: BookingUncheckedCreateNestedManyWithoutTenantInput
    previews?: VisualizerPreviewUncheckedCreateNestedManyWithoutTenantInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutInvoicesInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutInvoicesInput, TenantUncheckedCreateWithoutInvoicesInput>
  }

  export type BookingCreateWithoutInvoiceInput = {
    id?: string
    customerId: string
    startTime: Date | string
    endTime: Date | string
    status?: string
    totalPrice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutBookingsInput
    wrap: WrapCreateNestedOneWithoutBookingsInput
    reservation?: BookingReservationCreateNestedOneWithoutBookingInput
  }

  export type BookingUncheckedCreateWithoutInvoiceInput = {
    id?: string
    tenantId: string
    customerId: string
    wrapId: string
    startTime: Date | string
    endTime: Date | string
    status?: string
    totalPrice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    reservation?: BookingReservationUncheckedCreateNestedOneWithoutBookingInput
  }

  export type BookingCreateOrConnectWithoutInvoiceInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutInvoiceInput, BookingUncheckedCreateWithoutInvoiceInput>
  }

  export type InvoiceLineItemCreateWithoutInvoiceInput = {
    id?: string
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }

  export type InvoiceLineItemUncheckedCreateWithoutInvoiceInput = {
    id?: string
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }

  export type InvoiceLineItemCreateOrConnectWithoutInvoiceInput = {
    where: InvoiceLineItemWhereUniqueInput
    create: XOR<InvoiceLineItemCreateWithoutInvoiceInput, InvoiceLineItemUncheckedCreateWithoutInvoiceInput>
  }

  export type InvoiceLineItemCreateManyInvoiceInputEnvelope = {
    data: InvoiceLineItemCreateManyInvoiceInput | InvoiceLineItemCreateManyInvoiceInput[]
    skipDuplicates?: boolean
  }

  export type PaymentCreateWithoutInvoiceInput = {
    id?: string
    stripePaymentIntentId: string
    status?: string
    amount: number
    createdAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type PaymentUncheckedCreateWithoutInvoiceInput = {
    id?: string
    stripePaymentIntentId: string
    status?: string
    amount: number
    createdAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type PaymentCreateOrConnectWithoutInvoiceInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutInvoiceInput, PaymentUncheckedCreateWithoutInvoiceInput>
  }

  export type PaymentCreateManyInvoiceInputEnvelope = {
    data: PaymentCreateManyInvoiceInput | PaymentCreateManyInvoiceInput[]
    skipDuplicates?: boolean
  }

  export type TenantUpsertWithoutInvoicesInput = {
    update: XOR<TenantUpdateWithoutInvoicesInput, TenantUncheckedUpdateWithoutInvoicesInput>
    create: XOR<TenantCreateWithoutInvoicesInput, TenantUncheckedCreateWithoutInvoicesInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutInvoicesInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutInvoicesInput, TenantUncheckedUpdateWithoutInvoicesInput>
  }

  export type TenantUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    members?: TenantUserMembershipUpdateManyWithoutTenantNestedInput
    wraps?: WrapUpdateManyWithoutTenantNestedInput
    wrapCategories?: WrapCategoryUpdateManyWithoutTenantNestedInput
    availabilityRules?: AvailabilityRuleUpdateManyWithoutTenantNestedInput
    bookings?: BookingUpdateManyWithoutTenantNestedInput
    previews?: VisualizerPreviewUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    members?: TenantUserMembershipUncheckedUpdateManyWithoutTenantNestedInput
    wraps?: WrapUncheckedUpdateManyWithoutTenantNestedInput
    wrapCategories?: WrapCategoryUncheckedUpdateManyWithoutTenantNestedInput
    availabilityRules?: AvailabilityRuleUncheckedUpdateManyWithoutTenantNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutTenantNestedInput
    previews?: VisualizerPreviewUncheckedUpdateManyWithoutTenantNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type BookingUpsertWithoutInvoiceInput = {
    update: XOR<BookingUpdateWithoutInvoiceInput, BookingUncheckedUpdateWithoutInvoiceInput>
    create: XOR<BookingCreateWithoutInvoiceInput, BookingUncheckedCreateWithoutInvoiceInput>
    where?: BookingWhereInput
  }

  export type BookingUpdateToOneWithWhereWithoutInvoiceInput = {
    where?: BookingWhereInput
    data: XOR<BookingUpdateWithoutInvoiceInput, BookingUncheckedUpdateWithoutInvoiceInput>
  }

  export type BookingUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    totalPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutBookingsNestedInput
    wrap?: WrapUpdateOneRequiredWithoutBookingsNestedInput
    reservation?: BookingReservationUpdateOneWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    wrapId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    totalPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reservation?: BookingReservationUncheckedUpdateOneWithoutBookingNestedInput
  }

  export type InvoiceLineItemUpsertWithWhereUniqueWithoutInvoiceInput = {
    where: InvoiceLineItemWhereUniqueInput
    update: XOR<InvoiceLineItemUpdateWithoutInvoiceInput, InvoiceLineItemUncheckedUpdateWithoutInvoiceInput>
    create: XOR<InvoiceLineItemCreateWithoutInvoiceInput, InvoiceLineItemUncheckedCreateWithoutInvoiceInput>
  }

  export type InvoiceLineItemUpdateWithWhereUniqueWithoutInvoiceInput = {
    where: InvoiceLineItemWhereUniqueInput
    data: XOR<InvoiceLineItemUpdateWithoutInvoiceInput, InvoiceLineItemUncheckedUpdateWithoutInvoiceInput>
  }

  export type InvoiceLineItemUpdateManyWithWhereWithoutInvoiceInput = {
    where: InvoiceLineItemScalarWhereInput
    data: XOR<InvoiceLineItemUpdateManyMutationInput, InvoiceLineItemUncheckedUpdateManyWithoutInvoiceInput>
  }

  export type InvoiceLineItemScalarWhereInput = {
    AND?: InvoiceLineItemScalarWhereInput | InvoiceLineItemScalarWhereInput[]
    OR?: InvoiceLineItemScalarWhereInput[]
    NOT?: InvoiceLineItemScalarWhereInput | InvoiceLineItemScalarWhereInput[]
    id?: StringFilter<"InvoiceLineItem"> | string
    invoiceId?: StringFilter<"InvoiceLineItem"> | string
    description?: StringFilter<"InvoiceLineItem"> | string
    quantity?: IntFilter<"InvoiceLineItem"> | number
    unitPrice?: FloatFilter<"InvoiceLineItem"> | number
    totalPrice?: FloatFilter<"InvoiceLineItem"> | number
  }

  export type PaymentUpsertWithWhereUniqueWithoutInvoiceInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutInvoiceInput, PaymentUncheckedUpdateWithoutInvoiceInput>
    create: XOR<PaymentCreateWithoutInvoiceInput, PaymentUncheckedCreateWithoutInvoiceInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutInvoiceInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutInvoiceInput, PaymentUncheckedUpdateWithoutInvoiceInput>
  }

  export type PaymentUpdateManyWithWhereWithoutInvoiceInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutInvoiceInput>
  }

  export type PaymentScalarWhereInput = {
    AND?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    OR?: PaymentScalarWhereInput[]
    NOT?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    id?: StringFilter<"Payment"> | string
    invoiceId?: StringFilter<"Payment"> | string
    stripePaymentIntentId?: StringFilter<"Payment"> | string
    status?: StringFilter<"Payment"> | string
    amount?: FloatFilter<"Payment"> | number
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
  }

  export type InvoiceCreateWithoutLineItemsInput = {
    id?: string
    status?: string
    totalAmount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutInvoicesInput
    booking: BookingCreateNestedOneWithoutInvoiceInput
    payments?: PaymentCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUncheckedCreateWithoutLineItemsInput = {
    id?: string
    tenantId: string
    bookingId: string
    status?: string
    totalAmount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    payments?: PaymentUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceCreateOrConnectWithoutLineItemsInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutLineItemsInput, InvoiceUncheckedCreateWithoutLineItemsInput>
  }

  export type InvoiceUpsertWithoutLineItemsInput = {
    update: XOR<InvoiceUpdateWithoutLineItemsInput, InvoiceUncheckedUpdateWithoutLineItemsInput>
    create: XOR<InvoiceCreateWithoutLineItemsInput, InvoiceUncheckedCreateWithoutLineItemsInput>
    where?: InvoiceWhereInput
  }

  export type InvoiceUpdateToOneWithWhereWithoutLineItemsInput = {
    where?: InvoiceWhereInput
    data: XOR<InvoiceUpdateWithoutLineItemsInput, InvoiceUncheckedUpdateWithoutLineItemsInput>
  }

  export type InvoiceUpdateWithoutLineItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutInvoicesNestedInput
    booking?: BookingUpdateOneRequiredWithoutInvoiceNestedInput
    payments?: PaymentUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateWithoutLineItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    payments?: PaymentUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceCreateWithoutPaymentsInput = {
    id?: string
    status?: string
    totalAmount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutInvoicesInput
    booking: BookingCreateNestedOneWithoutInvoiceInput
    lineItems?: InvoiceLineItemCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUncheckedCreateWithoutPaymentsInput = {
    id?: string
    tenantId: string
    bookingId: string
    status?: string
    totalAmount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    lineItems?: InvoiceLineItemUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceCreateOrConnectWithoutPaymentsInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutPaymentsInput, InvoiceUncheckedCreateWithoutPaymentsInput>
  }

  export type InvoiceUpsertWithoutPaymentsInput = {
    update: XOR<InvoiceUpdateWithoutPaymentsInput, InvoiceUncheckedUpdateWithoutPaymentsInput>
    create: XOR<InvoiceCreateWithoutPaymentsInput, InvoiceUncheckedCreateWithoutPaymentsInput>
    where?: InvoiceWhereInput
  }

  export type InvoiceUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: InvoiceWhereInput
    data: XOR<InvoiceUpdateWithoutPaymentsInput, InvoiceUncheckedUpdateWithoutPaymentsInput>
  }

  export type InvoiceUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutInvoicesNestedInput
    booking?: BookingUpdateOneRequiredWithoutInvoiceNestedInput
    lineItems?: InvoiceLineItemUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lineItems?: InvoiceLineItemUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type TenantCreateWithoutAuditLogsInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    members?: TenantUserMembershipCreateNestedManyWithoutTenantInput
    wraps?: WrapCreateNestedManyWithoutTenantInput
    wrapCategories?: WrapCategoryCreateNestedManyWithoutTenantInput
    availabilityRules?: AvailabilityRuleCreateNestedManyWithoutTenantInput
    bookings?: BookingCreateNestedManyWithoutTenantInput
    previews?: VisualizerPreviewCreateNestedManyWithoutTenantInput
    invoices?: InvoiceCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    members?: TenantUserMembershipUncheckedCreateNestedManyWithoutTenantInput
    wraps?: WrapUncheckedCreateNestedManyWithoutTenantInput
    wrapCategories?: WrapCategoryUncheckedCreateNestedManyWithoutTenantInput
    availabilityRules?: AvailabilityRuleUncheckedCreateNestedManyWithoutTenantInput
    bookings?: BookingUncheckedCreateNestedManyWithoutTenantInput
    previews?: VisualizerPreviewUncheckedCreateNestedManyWithoutTenantInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutAuditLogsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutAuditLogsInput, TenantUncheckedCreateWithoutAuditLogsInput>
  }

  export type TenantUpsertWithoutAuditLogsInput = {
    update: XOR<TenantUpdateWithoutAuditLogsInput, TenantUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<TenantCreateWithoutAuditLogsInput, TenantUncheckedCreateWithoutAuditLogsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutAuditLogsInput, TenantUncheckedUpdateWithoutAuditLogsInput>
  }

  export type TenantUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    members?: TenantUserMembershipUpdateManyWithoutTenantNestedInput
    wraps?: WrapUpdateManyWithoutTenantNestedInput
    wrapCategories?: WrapCategoryUpdateManyWithoutTenantNestedInput
    availabilityRules?: AvailabilityRuleUpdateManyWithoutTenantNestedInput
    bookings?: BookingUpdateManyWithoutTenantNestedInput
    previews?: VisualizerPreviewUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    members?: TenantUserMembershipUncheckedUpdateManyWithoutTenantNestedInput
    wraps?: WrapUncheckedUpdateManyWithoutTenantNestedInput
    wrapCategories?: WrapCategoryUncheckedUpdateManyWithoutTenantNestedInput
    availabilityRules?: AvailabilityRuleUncheckedUpdateManyWithoutTenantNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutTenantNestedInput
    previews?: VisualizerPreviewUncheckedUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantUserMembershipCreateManyTenantInput = {
    id?: string
    userId: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type WrapCreateManyTenantInput = {
    id?: string
    name: string
    description?: string | null
    price: number
    installationMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type WrapCategoryCreateManyTenantInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type AvailabilityRuleCreateManyTenantInput = {
    id?: string
    dayOfWeek: number
    startTime: string
    endTime: string
    capacitySlots: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type BookingCreateManyTenantInput = {
    id?: string
    customerId: string
    wrapId: string
    startTime: Date | string
    endTime: Date | string
    status?: string
    totalPrice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type VisualizerPreviewCreateManyTenantInput = {
    id?: string
    wrapId: string
    customerPhotoUrl: string
    processedImageUrl?: string | null
    status?: string
    cacheKey: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type InvoiceCreateManyTenantInput = {
    id?: string
    bookingId: string
    status?: string
    totalAmount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type AuditLogCreateManyTenantInput = {
    id?: string
    userId: string
    action: string
    resourceType: string
    resourceId: string
    details?: string | null
    timestamp?: Date | string
    deletedAt?: Date | string | null
  }

  export type TenantUserMembershipUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantUserMembershipUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantUserMembershipUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WrapUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    installationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    images?: WrapImageUpdateManyWithoutWrapNestedInput
    categoryMappings?: WrapCategoryMappingUpdateManyWithoutWrapNestedInput
    bookings?: BookingUpdateManyWithoutWrapNestedInput
    previews?: VisualizerPreviewUpdateManyWithoutWrapNestedInput
  }

  export type WrapUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    installationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    images?: WrapImageUncheckedUpdateManyWithoutWrapNestedInput
    categoryMappings?: WrapCategoryMappingUncheckedUpdateManyWithoutWrapNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutWrapNestedInput
    previews?: VisualizerPreviewUncheckedUpdateManyWithoutWrapNestedInput
  }

  export type WrapUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    installationMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WrapCategoryUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wraps?: WrapCategoryMappingUpdateManyWithoutCategoryNestedInput
  }

  export type WrapCategoryUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wraps?: WrapCategoryMappingUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type WrapCategoryUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AvailabilityRuleUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    capacitySlots?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AvailabilityRuleUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    capacitySlots?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AvailabilityRuleUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    capacitySlots?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BookingUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    totalPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wrap?: WrapUpdateOneRequiredWithoutBookingsNestedInput
    reservation?: BookingReservationUpdateOneWithoutBookingNestedInput
    invoice?: InvoiceUpdateOneWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    wrapId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    totalPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reservation?: BookingReservationUncheckedUpdateOneWithoutBookingNestedInput
    invoice?: InvoiceUncheckedUpdateOneWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    wrapId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    totalPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VisualizerPreviewUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerPhotoUrl?: StringFieldUpdateOperationsInput | string
    processedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    cacheKey?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wrap?: WrapUpdateOneRequiredWithoutPreviewsNestedInput
  }

  export type VisualizerPreviewUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    wrapId?: StringFieldUpdateOperationsInput | string
    customerPhotoUrl?: StringFieldUpdateOperationsInput | string
    processedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    cacheKey?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VisualizerPreviewUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    wrapId?: StringFieldUpdateOperationsInput | string
    customerPhotoUrl?: StringFieldUpdateOperationsInput | string
    processedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    cacheKey?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InvoiceUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    booking?: BookingUpdateOneRequiredWithoutInvoiceNestedInput
    lineItems?: InvoiceLineItemUpdateManyWithoutInvoiceNestedInput
    payments?: PaymentUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lineItems?: InvoiceLineItemUncheckedUpdateManyWithoutInvoiceNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AuditLogUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    resourceId?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AuditLogUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    resourceId?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AuditLogUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    resourceId?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WrapImageCreateManyWrapInput = {
    id?: string
    url: string
    displayOrder?: number
    createdAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type WrapCategoryMappingCreateManyWrapInput = {
    categoryId: string
  }

  export type BookingCreateManyWrapInput = {
    id?: string
    tenantId: string
    customerId: string
    startTime: Date | string
    endTime: Date | string
    status?: string
    totalPrice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type VisualizerPreviewCreateManyWrapInput = {
    id?: string
    tenantId: string
    customerPhotoUrl: string
    processedImageUrl?: string | null
    status?: string
    cacheKey: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type WrapImageUpdateWithoutWrapInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WrapImageUncheckedUpdateWithoutWrapInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WrapImageUncheckedUpdateManyWithoutWrapInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WrapCategoryMappingUpdateWithoutWrapInput = {
    category?: WrapCategoryUpdateOneRequiredWithoutWrapsNestedInput
  }

  export type WrapCategoryMappingUncheckedUpdateWithoutWrapInput = {
    categoryId?: StringFieldUpdateOperationsInput | string
  }

  export type WrapCategoryMappingUncheckedUpdateManyWithoutWrapInput = {
    categoryId?: StringFieldUpdateOperationsInput | string
  }

  export type BookingUpdateWithoutWrapInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    totalPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutBookingsNestedInput
    reservation?: BookingReservationUpdateOneWithoutBookingNestedInput
    invoice?: InvoiceUpdateOneWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateWithoutWrapInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    totalPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reservation?: BookingReservationUncheckedUpdateOneWithoutBookingNestedInput
    invoice?: InvoiceUncheckedUpdateOneWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateManyWithoutWrapInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    totalPrice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VisualizerPreviewUpdateWithoutWrapInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerPhotoUrl?: StringFieldUpdateOperationsInput | string
    processedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    cacheKey?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutPreviewsNestedInput
  }

  export type VisualizerPreviewUncheckedUpdateWithoutWrapInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    customerPhotoUrl?: StringFieldUpdateOperationsInput | string
    processedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    cacheKey?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VisualizerPreviewUncheckedUpdateManyWithoutWrapInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    customerPhotoUrl?: StringFieldUpdateOperationsInput | string
    processedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    cacheKey?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WrapCategoryMappingCreateManyCategoryInput = {
    wrapId: string
  }

  export type WrapCategoryMappingUpdateWithoutCategoryInput = {
    wrap?: WrapUpdateOneRequiredWithoutCategoryMappingsNestedInput
  }

  export type WrapCategoryMappingUncheckedUpdateWithoutCategoryInput = {
    wrapId?: StringFieldUpdateOperationsInput | string
  }

  export type WrapCategoryMappingUncheckedUpdateManyWithoutCategoryInput = {
    wrapId?: StringFieldUpdateOperationsInput | string
  }

  export type InvoiceLineItemCreateManyInvoiceInput = {
    id?: string
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }

  export type PaymentCreateManyInvoiceInput = {
    id?: string
    stripePaymentIntentId: string
    status?: string
    amount: number
    createdAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type InvoiceLineItemUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    totalPrice?: FloatFieldUpdateOperationsInput | number
  }

  export type InvoiceLineItemUncheckedUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    totalPrice?: FloatFieldUpdateOperationsInput | number
  }

  export type InvoiceLineItemUncheckedUpdateManyWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    totalPrice?: FloatFieldUpdateOperationsInput | number
  }

  export type PaymentUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePaymentIntentId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PaymentUncheckedUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePaymentIntentId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PaymentUncheckedUpdateManyWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePaymentIntentId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}