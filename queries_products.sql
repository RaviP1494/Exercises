-- Comments in SQL Start with dash-dash --
INSERT INTO products(name,price,can_be_returned) VALUES ('chair',44,false);
INSERT INTO products(name,price,can_be_returned) VALUES ('stool',25.99,true);
INSERT INTO products(name,price,can_be_returned) VALUES ('table',124,false);
SELECT * FROM products;
SELECT name FROM products;
SELECT name,price FROM products;
INSERT INTO products(name,price,can_be_returned) VALUES ('sun',20.01,true);
SELECT * FROM products WHERE can_be_returned;
SELECT * FROM products WHERE price < 44;
SELECT * FROM products WHERE price < 100 AND price >= 25;
UPDATE products SET price = price - 20;
