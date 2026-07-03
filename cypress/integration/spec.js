describe('Jack Shields Christensen site', () => {
	beforeEach(() => {
		cy.visit('/')
	});

	it('has the correct <h1>', () => {
		cy.contains('h1', 'Jack Shields Christensen')
	});

	it('navigates to /contact', () => {
		cy.get('nav a').contains('Contact').click();
		cy.url().should('include', '/contact');
	});

	it('opens an accordion section and navigates to a page', () => {
		cy.get('nav button').contains('Japan').click();
		cy.get('nav a').contains('First Morning In Tokyo').click();
		cy.url().should('include', '/contents/japan/first-morning-in-tokyo');
	});
});
