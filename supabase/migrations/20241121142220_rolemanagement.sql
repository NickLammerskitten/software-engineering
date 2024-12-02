create role "trader";

-- Important to grant the role to the authenticator and anon role
grant trader to authenticator;
grant anon to trader;
grant authenticated to trader;
