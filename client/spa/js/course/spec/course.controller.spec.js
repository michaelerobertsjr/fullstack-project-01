/**
 * Created by rauldablaing on 2/2/15.
 */

/*
 global jasmine, describe, it, expect, beforeEach, afterEach, xdescribe, xit,
 spyOn
 */

// Get the code you want to test
var Controller = require('../course.controller');
var $ = require('jquery');
var matchers = require('jasmine-jquery-matchers');

// Test suite
console.log('test course.controller');
describe('Course controller', function(){

  var controller;

  beforeEach(function(){
    controller = new Controller();
  });

  it('can be created', function(){
    expect(controller).toBeDefined();
  });

  describe('when it is created', function(){

    it('has the expected routes', function(){
      expect(controller.routes).toEqual(jasmine.objectContaining({
        'course/:id': 'showCourse'
      }));
    });

    it('without a container option, uses body as the container', function(){
      expect(controller.options.container).toEqual('body');
    });

    it('with a container option, uses specified container', function(){
      var ctrl = new Controller({container: '.newcontainer'});
      expect(ctrl.options.container).toEqual('.newcontainer');
    });
  });

  describe('when calling showCourse', function(){

    beforeEach(function(){
      jasmine.addMatchers(matchers);
    });

    var success = function(callbacks){
      controller.model.set({'title': 'Full Stack Dev I', 'courseType':'video', 'description':'Learn how to do single page apps advanced'});
      callbacks.success(controller.model);
    };
    var err = function(callbacks){
      callbacks.error('error', controller.model);
    };

    it('with a valid course id, fetches the model', function(){
      spyOn(controller.model, 'fetch').and.callFake(success);
      var cb = function(err, view){
        expect(err).toBeNull();
        expect(controller.model.get('title')).toEqual('Full Stack Dev I');
        expect(controller.model.get('courseType')).toEqual('video');
        expect(controller.model.get('description')).toEqual('Learn how to do single page apps advanced');
      };
      controller.showCourse(1, cb);
    });

    it('with a valid course id, renders the view', function(){
      spyOn(controller.model, 'fetch').and.callFake(success);
      spyOn(controller.view, 'render').and.callFake(function(){
        controller.view.$el = 'fake render';
        return controller.view;
      });
      var cb = function(err, view){
        expect($('body')).toHaveText('fake render');
        expect(view.cid).toEqual(controller.view.cid);
      };
      controller.showCourse(1, cb);
    });

    it('with an invalid course id, renders an error message', function(){
      spyOn(controller.model, 'fetch').and.callFake(err);
      var cb = function(err, view){
        expect(err).toBeTruthy();
        expect($('body')).toHaveText(
          'There was a problem rendering this course');
      };
      controller.showCourse(1, cb);
    });

  });

});
