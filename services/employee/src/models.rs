use crate::schema::employee;

#[derive(Queryable)]
pub struct DbEmployee {
    pub id: String,
    pub name: String,
    pub address: String,
    pub ssn: String,
    pub marital_status: bool,
}

#[derive(Insertable)]
#[table_name = "employee"]
pub struct NewDbEmployee<'a> {
    pub name: &'a str,
    pub address: &'a str,
}
