/**
 * MongoDB models – single entry point for all collections.
 * Use this file to see at a glance what data the app stores.
 *
 * Collections in MongoDB (same order as below):
 *   - users      → User model (accounts, models, professionals, admins)
 *   - castings   → Casting model (casting calls / jobs)
 *   - contacts   → Contact model (contact form submissions)
 */

import User from "./User.js";
import Casting from "./Casting.js";
import Contact from "./Contact.js";
import HomepageConfig from "./HomepageConfig.js";

export { User, Casting, Contact, HomepageConfig };
