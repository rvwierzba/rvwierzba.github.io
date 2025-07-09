from odoo import http, _
from odoo.http import request

class ContactController(http.Controller):

    @http.route('/contact/send', type='http', auth='public', methods=['POST'], website=True)
    def send_contact_form(self, **post):
        nome = post.get('nome')
        email = post.get('email')
        telefone = post.get('telefone')
        mensagem = post.get('mensagem')

        # Create email content
        email_content = f"""
            Nome: {nome}
            Email: {email}
            Telefone: {telefone}
            Mensagem: {mensagem}
        """

        # Send email
        mail_values = {
            'email_to': 'rafaelwierzba@gmail.com',
            'subject': 'Nova mensagem de contato do site',
            'body_html': email_content,
        }
        mail_id = request.env['mail.mail'].sudo().create(mail_values)
        mail_id.send()

        # You can also use Odoo's mail template system for more complex emails

        return request.redirect('/contact/thankyou')  # Redirect to a thank you page

    @http.route('/contact/thankyou', type='http', auth='public', website=True)
    def thankyou_page(self, **post):
        return request.render('your_module.thank_you_template') #Render a thank you template