from sqlalchemy import func
from sqlmodel import Session, select

from app.database.database import engine, create_db
from app.auth.jwt import hash_password
from app.models.user import User
from app.models.post import Post
from app.models.tag import Tag, PostTag
from app.models.like import Like
from app.models.save import Save
from app.models.comment import Comment
from app.models.follow import Follow
from app.models.notification import Notification


def seed():
    create_db()

    with Session(engine) as session:

        def print_summary() -> None:
            counts = {
                "users":    session.exec(select(func.count()).select_from(User)).one(),
                "posts":    session.exec(select(func.count()).select_from(Post)).one(),
                "comments": session.exec(select(func.count()).select_from(Comment)).one(),
                "follows":  session.exec(select(func.count()).select_from(Follow)).one(),
                "notifs":   session.exec(select(func.count()).select_from(Notification)).one(),
            }
            print("Database summary:", ", ".join(f"{k}={v}" for k, v in counts.items()))

        def get_or_create_user(username, email, password, display_name, bio, avatar_url) -> User:
            user = session.exec(select(User).where(User.username == username)).first()
            if user:
                return user
            user = User(
                username=username, email=email,
                password=hash_password(password),
                display_name=display_name, bio=bio, avatar_url=avatar_url,
            )
            session.add(user)
            session.flush()
            return user

        def get_or_create_tag(name: str) -> Tag:
            tag = session.exec(select(Tag).where(Tag.name == name)).first()
            if tag:
                return tag
            tag = Tag(name=name)
            session.add(tag)
            session.flush()
            return tag

        def get_or_create_post(content, author_id, image_url=None) -> Post:
            post = session.exec(
                select(Post).where(Post.content == content, Post.author_id == author_id)
            ).first()
            if post:
                return post
            post = Post(content=content, image_url=image_url, author_id=author_id)
            session.add(post)
            session.flush()
            return post

        def link_post_tag(post_id, tag_id) -> None:
            if not session.get(PostTag, (post_id, tag_id)):
                session.add(PostTag(post_id=post_id, tag_id=tag_id))

        def get_or_create_comment(content, author_id, post_id) -> Comment:
            comment = session.exec(
                select(Comment).where(
                    Comment.content == content,
                    Comment.author_id == author_id,
                    Comment.post_id == post_id,
                )
            ).first()
            if comment:
                return comment
            comment = Comment(content=content, author_id=author_id, post_id=post_id)
            session.add(comment)
            session.flush()
            return comment

        def get_or_create_like(user_id, post_id) -> None:
            if not session.get(Like, (user_id, post_id)):
                session.add(Like(user_id=user_id, post_id=post_id))

        def get_or_create_save(user_id, post_id) -> None:
            if not session.get(Save, (user_id, post_id)):
                session.add(Save(user_id=user_id, post_id=post_id))

        def get_or_create_follow(follower_id, following_id) -> None:
            if not session.get(Follow, (follower_id, following_id)):
                session.add(Follow(follower_id=follower_id, following_id=following_id))

        def get_or_create_notif(user_id, actor_username, type_, post_id=None) -> None:
            existing = session.exec(
                select(Notification).where(
                    Notification.user_id == user_id,
                    Notification.actor_username == actor_username,
                    Notification.type == type_,
                    Notification.post_id == post_id,
                )
            ).first()
            if not existing:
                session.add(Notification(
                    user_id=user_id,
                    actor_username=actor_username,
                    type=type_,
                    post_id=post_id,
                ))

        # ── USERS ─────────────────────────────────────────────────────────────
        users = {
            "joao": get_or_create_user(
                "joao", "joao@example.com", "123456",
                "João Silva",
                "Pai do Max e da Luna | Voluntário no abrigo local | Adotar é amar",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            ),
            "maria": get_or_create_user(
                "maria", "maria@example.com", "123456",
                "Maria Costa",
                "Mãe da Mimi e do Simba | Apaixonada por gatos | Resgate animal",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
            ),
            "pedro": get_or_create_user(
                "pedro", "pedro@example.com", "123456",
                "Pedro Santos",
                "Treinador canino certificado | Dicas de treino e comportamento animal",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
            ),
        }

        # ── POSTS ─────────────────────────────────────────────────────────────
        posts = {
            "max_adoption": get_or_create_post(
                "Novo membro da família! Adotámos o Max hoje no abrigo. Não consigo parar de sorrir! #dogs #adoption",
                users["joao"].id,
                "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop",
            ),
            "mimi_bath": get_or_create_post(
                "A Mimi depois do banho… não me perdoa tão cedo #cats #grooming",
                users["maria"].id,
                "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=400&fit=crop",
            ),
            "rocky_training": get_or_create_post(
                "Sessão de treino com o Rocky! Já aprendeu o 'senta' e o 'dá a pata' #training #puppies",
                users["pedro"].id,
                "https://images.unsplash.com/photo-1587559070757-f72a388edbba?w=600&h=400&fit=crop",
            ),
            "luna_walk": get_or_create_post(
                "Passeio no parque ao pôr do sol com a Luna. Nada melhor que isto! #pets #dogs",
                users["joao"].id,
                "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600&h=400&fit=crop",
            ),
            "rescue_cat": get_or_create_post(
                "Resgatámos este pequenote da rua. Agora tem casa e muito amor #rescue #pets #cats",
                users["maria"].id,
                "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&h=400&fit=crop",
            ),
            "pedro_tip": get_or_create_post(
                "Dica do dia: reforço positivo funciona melhor do que punição. Os cães aprendem com amor! #training #dogs",
                users["pedro"].id,
                "https://images.unsplash.com/photo-1568572933382-74d440642117?w=600&h=400&fit=crop",
            ),
        }

        # ── TAGS ──────────────────────────────────────────────────────────────
        tags = {n: get_or_create_tag(n) for n in [
            "dogs", "cats", "pets", "adoption", "grooming", "training", "puppies", "rescue"
        ]}

        link_post_tag(posts["max_adoption"].id,  tags["dogs"].id)
        link_post_tag(posts["max_adoption"].id,  tags["adoption"].id)
        link_post_tag(posts["mimi_bath"].id,     tags["cats"].id)
        link_post_tag(posts["mimi_bath"].id,     tags["grooming"].id)
        link_post_tag(posts["rocky_training"].id, tags["training"].id)
        link_post_tag(posts["rocky_training"].id, tags["puppies"].id)
        link_post_tag(posts["luna_walk"].id,     tags["pets"].id)
        link_post_tag(posts["luna_walk"].id,     tags["dogs"].id)
        link_post_tag(posts["rescue_cat"].id,    tags["rescue"].id)
        link_post_tag(posts["rescue_cat"].id,    tags["pets"].id)
        link_post_tag(posts["rescue_cat"].id,    tags["cats"].id)
        link_post_tag(posts["pedro_tip"].id,     tags["training"].id)
        link_post_tag(posts["pedro_tip"].id,     tags["dogs"].id)

        # ── FOLLOWS ───────────────────────────────────────────────────────────
        get_or_create_follow(users["maria"].id, users["joao"].id)
        get_or_create_follow(users["pedro"].id, users["joao"].id)
        get_or_create_follow(users["joao"].id,  users["maria"].id)
        get_or_create_follow(users["pedro"].id, users["maria"].id)
        get_or_create_follow(users["joao"].id,  users["pedro"].id)

        # ── LIKES ─────────────────────────────────────────────────────────────
        get_or_create_like(users["maria"].id, posts["max_adoption"].id)
        get_or_create_like(users["pedro"].id, posts["max_adoption"].id)
        get_or_create_like(users["joao"].id,  posts["mimi_bath"].id)
        get_or_create_like(users["pedro"].id, posts["mimi_bath"].id)
        get_or_create_like(users["joao"].id,  posts["rescue_cat"].id)
        get_or_create_like(users["pedro"].id, posts["rescue_cat"].id)
        get_or_create_like(users["maria"].id, posts["rocky_training"].id)
        get_or_create_like(users["joao"].id,  posts["pedro_tip"].id)
        get_or_create_like(users["maria"].id, posts["pedro_tip"].id)

        # ── SAVES ─────────────────────────────────────────────────────────────
        get_or_create_save(users["maria"].id, posts["max_adoption"].id)
        get_or_create_save(users["pedro"].id, posts["rocky_training"].id)
        get_or_create_save(users["joao"].id,  posts["rescue_cat"].id)
        get_or_create_save(users["maria"].id, posts["pedro_tip"].id)

        # ── COMMENTS ──────────────────────────────────────────────────────────
        get_or_create_comment("Que lindo! Parabéns pela adoção", users["maria"].id, posts["max_adoption"].id)
        get_or_create_comment("Bem-vindo Max!", users["pedro"].id, posts["max_adoption"].id)
        get_or_create_comment("Hahaha a cara dela diz tudo", users["joao"].id, posts["mimi_bath"].id)
        get_or_create_comment("A minha gata faz o mesmo depois do banho!", users["pedro"].id, posts["mimi_bath"].id)
        get_or_create_comment("Bom trabalho Rocky!", users["maria"].id, posts["rocky_training"].id)
        get_or_create_comment("Que herói! Obrigado por salvares este pequenote", users["joao"].id, posts["rescue_cat"].id)
        get_or_create_comment("Adotar salva vidas", users["pedro"].id, posts["rescue_cat"].id)
        get_or_create_comment("Ótima dica! Vou experimentar com o meu cão", users["joao"].id, posts["pedro_tip"].id)

        # ── NOTIFICATIONS ─────────────────────────────────────────────────────
        # likes → notify post author
        get_or_create_notif(users["joao"].id,  "maria",  "like", posts["max_adoption"].id)
        get_or_create_notif(users["joao"].id,  "pedro",  "like", posts["max_adoption"].id)
        get_or_create_notif(users["maria"].id, "joao",   "like", posts["mimi_bath"].id)
        get_or_create_notif(users["maria"].id, "pedro",  "like", posts["mimi_bath"].id)
        get_or_create_notif(users["maria"].id, "joao",   "like", posts["rescue_cat"].id)
        get_or_create_notif(users["maria"].id, "pedro",  "like", posts["rescue_cat"].id)
        get_or_create_notif(users["pedro"].id, "maria",  "like", posts["rocky_training"].id)
        get_or_create_notif(users["pedro"].id, "joao",   "like", posts["pedro_tip"].id)
        get_or_create_notif(users["pedro"].id, "maria",  "like", posts["pedro_tip"].id)

        # comments → notify post author
        get_or_create_notif(users["joao"].id,  "maria",  "comment", posts["max_adoption"].id)
        get_or_create_notif(users["joao"].id,  "pedro",  "comment", posts["max_adoption"].id)
        get_or_create_notif(users["maria"].id, "joao",   "comment", posts["mimi_bath"].id)
        get_or_create_notif(users["maria"].id, "pedro",  "comment", posts["mimi_bath"].id)
        get_or_create_notif(users["pedro"].id, "maria",  "comment", posts["rocky_training"].id)
        get_or_create_notif(users["maria"].id, "joao",   "comment", posts["rescue_cat"].id)
        get_or_create_notif(users["maria"].id, "pedro",  "comment", posts["rescue_cat"].id)
        get_or_create_notif(users["pedro"].id, "joao",   "comment", posts["pedro_tip"].id)

        # follows → notify followed user
        get_or_create_notif(users["joao"].id,  "maria",  "follow")
        get_or_create_notif(users["joao"].id,  "pedro",  "follow")
        get_or_create_notif(users["maria"].id, "joao",   "follow")
        get_or_create_notif(users["maria"].id, "pedro",  "follow")
        get_or_create_notif(users["pedro"].id, "joao",   "follow")

        session.commit()
        print("Seed completed successfully")
        print_summary()


if __name__ == "__main__":
    seed()
