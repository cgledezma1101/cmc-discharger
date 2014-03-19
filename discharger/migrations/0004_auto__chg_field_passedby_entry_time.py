# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'PassedBy.entry_time'
        db.alter_column(u'discharger_passedby', 'entry_time', self.gf('django.db.models.fields.DateTimeField')(null=True))

    def backwards(self, orm):

        # Changing field 'PassedBy.entry_time'
        db.alter_column(u'discharger_passedby', 'entry_time', self.gf('django.db.models.fields.DateTimeField')(default=None))

    models = {
        u'discharger.discharge': {
            'Meta': {'object_name': 'Discharge'},
            'end_time': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'location': ('django.db.models.fields.CharField', [], {'max_length': '10'}),
            'patient_name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'stages': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['discharger.Stage']", 'through': u"orm['discharger.PassedBy']", 'symmetrical': 'False'}),
            'start_time': ('django.db.models.fields.DateTimeField', [], {})
        },
        u'discharger.passedby': {
            'Meta': {'object_name': 'PassedBy'},
            'discharge': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['discharger.Discharge']"}),
            'entry_time': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'exit_time': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'stage': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['discharger.Stage']"})
        },
        u'discharger.stage': {
            'Meta': {'object_name': 'Stage'},
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'discharges': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['discharger.Discharge']", 'through': u"orm['discharger.PassedBy']", 'symmetrical': 'False'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'sequence_number': ('django.db.models.fields.IntegerField', [], {})
        }
    }

    complete_apps = ['discharger']