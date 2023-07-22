const { createClient } = require("@supabase/supabase-js");
const { SUPA_PROJECT_URL, SUPA_API_KEY } = require("./config");

const supabase = createClient(SUPA_PROJECT_URL, SUPA_API_KEY);

module.exports = {
  supabase,
};
