from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc
from collection_day_checker import collection_day_to_nth_weekday as cd2nd
from collection_day_crawler import crawl
from datetime import datetime as dt
import datetime, numpy as np


class Entities:

    def __init__(self, app):
        self.db = SQLAlchemy(app)
        self.session = self.db.session

    def Amount(self):
        db = self.db
        session = self.session

        class Amount(db.Model):
            recorded = db.Column('recorded', db.DateTime(), primary_key=True, default=dt.now)
            amount = db.Column('amount', db.Integer(), default='0', nullable=False)

            def __init__(self, amount, datetime=None):
                self.amount = amount
                if datetime: self.recorded = datetime

            def add(self):
                session.add(self)
                session.commit()

                return self.amount
            
            @classmethod
            def latest(cls, limit=None):
                rows = cls.query.order_by(desc(cls.recorded)).limit(limit or 1).all()
                amounts = [{'recorded': row.recorded, 'amount': row.amount} for row in rows]

                return amounts
            
            @classmethod
            def total_monthly(cls, months=1):
                totals = []
                now = dt.now()

                for i in range(months):
                    # yearまたぎめんどい問題
                    # 月跨いだ時の計算めんどい問題

                    this_month = datetime.date(now.year, now.month-i, 1)
                    next_month = datetime.date(now.year, now.month-i+1, 1)

                    rows = cls.query.filter(cls.recorded >= this_month).filter(cls.recorded < next_month).all()
                    rows = np.array([amount.amount for amount in rows])

                    zero_idx = np.where(rows == 0)[0]
                    full_idx = zero_idx[zero_idx != 0] - 1

                    total = rows[full_idx].sum() + rows[-1]
                    totals.append({'month': now.month-i, 'total': int(total)})

                totals.reverse()
                # import pdb; pdb.set_trace()
                return totals

        return Amount


    def Smell(self):        
        db = self.db
        session = self.session
        
        class Smell(db.Model):
            recorded = db.Column('recorded', db.DateTime(), primary_key=True, default=dt.now)
            smell = db.Column('smell', db.Integer(), default='0', nullable=False)

            def __init__(self, smell):
                self.smell = smell

            def add(self):
                session.add(self)
                session.commit()

                return self.smell
            
            @classmethod
            def latest(cls, limit=None):
                rows = cls.query.order_by(desc(cls.recorded)).limit(limit or 1).all()
                smells = [{'recorded': row.recorded, 'smell': row.smell} for row in rows]

                return smells

        return Smell


    def Config(self):
        db = self.db
        session = self.session
        
        class Config(db.Model):
            lineup = ['name', 'nth', 'weekday', 'notification', 'time']

            name = db.Column(lineup[0], db.String(20), primary_key=True, default="普通ゴミ")
            nth = db.Column(lineup[1], db.String(10))
            weekday = db.Column(lineup[2], db.String(10))
            notification = db.Column(lineup[3], db.String(1), default="1")
            time = db.Column(lineup[4], db.String(5), default="07:00")

            def __init__(self, configs):
                self.configs = configs
                
                for key in configs.keys():
                    setattr(self, key, configs[key])
                
            def change(self):
                config = self.query.first()

                if config:
                    for key in self.configs: 
                        setattr(config, key, getattr(self, key))
                else: 
                    session.add(self)
                
                session.commit()

                return Config.get()

            @classmethod
            def get(cls):
                row = cls.query.first()
                if not row: return None

                config = {}
                for key in cls.lineup: 
                    config[key] = getattr(row, key)
                
                return config

        return Config


    def Token(self):
        db = self.db
        session = self.session
        
        class Token(db.Model):
            token = db.Column('token', db.String(), primary_key=True)

            def __init__(self, token):
                self.token = token
            
            def change(self):
                token = self.query.first()

                if token: 
                    token.token = self.token
                else: 
                    session.add(self)

                session.commit()

                return self.token
            
            @classmethod
            def get(cls):         
                row = cls.query.first()
        
                return row.token if row else None
        
        return Token


    def Collection(self):
        db = self.db
        session = self.session
        
        class Collection(db.Model):
            sorting = ['katei', 'pura', 'kanbin', 'kamirui']

            id = db.Column('id', db.Integer(), primary_key=True, autoincrement=True)
            pref_id = db.Column('pref_id', db.Integer(), nullable=False)
            city_id = db.Column('city_id', db.Integer(), nullable=False)
            ku_id = db.Column('ku_id', db.Integer(), nullable=False)
            kana1 = db.Column('kana1', db.String(), nullable=False)
            kana2 = db.Column('kana2', db.String(), nullable=False)
            juusho = db.Column('juusho', db.String(), nullable=False)
            katei = db.Column('katei', db.String(), nullable=False)
            pura = db.Column('pura', db.String(), nullable=False)
            kanbin = db.Column('kanbin', db.String(), nullable=False)
            kamirui = db.Column('kamirui', db.String(), nullable=False)
            
            @classmethod
            def search(cls, pref_id=None, city_id=None, ku_id=None, kana1=None, kana2=None):
                result = session.query(cls.id, cls.juusho)
                if pref_id: result = result.filter(cls.pref_id == int(pref_id))
                if city_id: result = result.filter(cls.city_id == int(city_id))
                if ku_id: result = result.filter(cls.ku_id == int(ku_id))
                if kana1: result = result.filter(cls.kana1 == kana1)
                if kana2: result = result.filter(cls.kana2 == kana2)
                result = [{'id': row.id, 'juusho': row.juusho} for row in result.all()]

                return result

            @classmethod
            def nth_weekday(cls, id=None, sorting_id=None):
                st = getattr(cls, cls.sorting[int(sorting)])
                cd =session.query(st).filter(cls.id == int(id)).first()

                return cd2nd(cd[0])

            @classmethod
            def create(cls):
                if cls.query.first(): return
                session.execute(cls.__table__.insert(), crawl())
                session.commit()
        
        return Collection
